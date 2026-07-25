const d = "paranormal-toolkit", Ts = "Paranormal Toolkit", Ou = "ordemparanormal";
class ht {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function on(e) {
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
    console.log(`${d} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${d} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${d} | ${t}`, ...n);
  }
}
function y(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function bt(e) {
  const t = tr(e);
  return t.ok ? y(t.value.definition) : t;
}
function tr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : nr(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Fu(e) {
  return nr(e.getFlag(d, "automation"));
}
function nr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Uu(t.source) && Bu(t.definition);
}
function Bu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && E(t.label) && Array.isArray(t.steps) && t.steps.every(zu) && (t.ritualForms === void 0 || Wu(t.ritualForms)) && (t.conditionApplications === void 0 || Zu(t.conditionApplications));
}
function Uu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? E(t.presetId) && E(t.presetVersion) && E(t.appliedAt) : t.type === "manual" ? E(t.label) && E(t.appliedAt) : !1;
}
function zu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return qu(t);
    case "spendRitualCost":
      return ju(t);
    case "rollFormula":
      return Gu(t);
    case "modifyResource":
      return Vu(t);
    case "chatCard":
      return Hu(t);
    default:
      return !1;
  }
}
function qu(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Rs(t);
}
function ju(e) {
  return e.type === "spendRitualCost";
}
function Gu(e) {
  const t = e;
  return t.type === "rollFormula" && E(t.id) && E(t.formula) && (t.intent === void 0 || od(t.intent)) && (t.damageType === void 0 || E(t.damageType));
}
function Vu(e) {
  const t = e;
  return t.type === "modifyResource" && ks(t.actor) && ad(t.resource) && rd(t.operation) && Rs(t) && (t.damageType === void 0 || t.damageType === null || E(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Hu(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Wu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([a, r]) => n.has(a) && Ku(r)
  );
}
function Ku(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || E(t.label)) && (t.extraCost === void 0 || sd(t.extraCost)) && (t.rollFormulaOverrides === void 0 || cd(t.rollFormulaOverrides)) && (t.notes === void 0 || ld(t.notes)) && (t.targeting === void 0 || Yu(t.targeting));
}
function Yu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Qu(t.mode) && E(t.label) && (t.optionLabel === void 0 || E(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Xu(t.template));
}
function Xu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || oo(t.distance)) && (t.width === void 0 || t.width === null || oo(t.width));
}
function Qu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Zu(e) {
  return Array.isArray(e) && e.every(Ju);
}
function Ju(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return E(t.id) && ks(t.actor) && E(t.conditionId) && (t.label === void 0 || E(t.label)) && (t.duration === void 0 || t.duration === null || td(t.duration)) && (t.source === void 0 || E(t.source)) && (t.actionSectionId === void 0 || E(t.actionSectionId)) && (t.actionSectionTitle === void 0 || E(t.actionSectionTitle)) && (t.executedLabel === void 0 || E(t.executedLabel)) && (t.applyOnResistance === void 0 || ed(t.applyOnResistance));
}
function ed(e) {
  return e === "failure" || e === "success" || e === "always";
}
function td(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || id(t.rounds)) && (t.expiry === void 0 || t.expiry === null || nd(t.expiry));
}
function nd(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Rs(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || E(e.amountFrom);
}
function ks(e) {
  return e === "self" || e === "target";
}
function ad(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function rd(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function od(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function id(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function sd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function oo(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function E(e) {
  return typeof e == "string" && e.length > 0;
}
function ld(e) {
  return Array.isArray(e) && e.every(E);
}
function cd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => E(t) && E(n)
  );
}
function ar(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(io);
    if (md(t))
      return Array.from(t).filter(io);
  }
  return [];
}
function ud(e) {
  return ar(e)[0] ?? null;
}
function dd(e) {
  return ar(e).find(Fu) ?? null;
}
function md(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function io(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function yt(e) {
  return ar(e).filter((t) => t.type === "ritual");
}
function $s(e) {
  return yt(e)[0] ?? null;
}
function fd(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(on);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = at("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = wt(t);
      if (!n) return [];
      const a = e.automationRegistry.findForItem(n).map(co);
      return f.info(`Presets encontrados para ${n.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const n = at("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const a = wt(n);
      if (!a) return;
      const r = e.automationRegistry.require(t);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      const o = await ia(e, a, r.value);
      f.info(`Preset ${r.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = at("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = wt(t);
      if (!n) return;
      const a = e.automationRegistry.findForItem(n)[0];
      if (!a) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const r = await ia(e, n, a.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: co(a), itemPatch: r }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return so(e);
    },
    async applyBestPresetsToActorRituals() {
      return so(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = at("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = wt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function so(e) {
  const t = at("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = yt(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), lo(t);
  const a = lo(t, n.length);
  for (const r of n) {
    const o = e.automationRegistry.findForItem(r)[0];
    if (!o) {
      a.skipped.push({
        itemId: r.id ?? null,
        itemName: r.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await ia(e, r, o.preset);
    a.applied.push(pd(r, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), gd(a), a;
}
async function ia(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function pd(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: on(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function lo(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function gd(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function co(e) {
  return {
    preset: on(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function at(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function wt(e) {
  const t = $s(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function xe(e) {
  return e ? {
    id: e.id,
    source: {
      ...hd(e.sourceActor),
      token: e.sourceToken
    },
    item: bd(e.item),
    targets: e.targets.map(yd),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: uo(e.rollRequests, ws),
    rolls: uo(e.rolls, _d),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(rr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function rr(e) {
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
function hd(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function bd(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function yd(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ws(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function _d(e) {
  return {
    ...ws(e),
    total: e.total
  };
}
function uo(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, a]) => [n, t(a)]));
}
function Ad(e) {
  return {
    getSelected() {
      return ht.getSelectedActor();
    },
    logResources() {
      const t = pe(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await Le(
        e,
        "Gasto de PE",
        pe("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Le(
        e,
        "Gasto de PD",
        pe("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Le(
        e,
        "Dano em PV",
        pe("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Le(
        e,
        "Cura de PV",
        pe("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Le(
        e,
        "Dano em SAN",
        pe("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Le(
        e,
        "Recuperação de SAN",
        pe("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Le(e, t, n, a) {
  if (!n) return;
  const r = await a(n);
  if (!r.ok) {
    Td(r.error);
    return;
  }
  const o = r.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, rr(o));
}
function pe(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Td(e) {
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
const ee = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Rd() {
  Et(ee.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Et(ee.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Et(ee.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Et(ee.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function sa() {
  return {
    enabled: Ct(ee.enabled),
    console: Ct(ee.console),
    ui: Ct(ee.ui),
    chat: Ct(ee.chat)
  };
}
async function oe(e, t) {
  await game.settings.set(d, ee[e], t);
}
function Et(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Ct(e) {
  return game.settings.get(d, e) === !0;
}
function kd() {
  return {
    status() {
      return sa();
    },
    async enable() {
      await oe("enabled", !0);
    },
    async disable() {
      await oe("enabled", !1);
    },
    async enableConsole() {
      await oe("console", !0);
    },
    async disableConsole() {
      await oe("console", !1);
    },
    async enableUi() {
      await oe("ui", !0);
    },
    async disableUi() {
      await oe("ui", !1);
    },
    async enableChat() {
      await oe("chat", !0);
    },
    async disableChat() {
      await oe("chat", !1);
    }
  };
}
const Es = "ritual.costOnly", Cs = "ritual.simpleHealing", $d = "ritual.eletrocussao", wd = "ritual.definhar", Ss = "ritual.simpleDamage", Is = "generic.simpleHealing", Ls = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, or = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ed() {
  return [
    Cd(),
    Sd(),
    Id(),
    Ld(),
    vd(),
    Dd()
  ];
}
function Cd() {
  return {
    id: Es,
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
function Sd() {
  return {
    id: Cs,
    version: "1.1.0",
    label: "Cicatrização",
    description: "Gasta o custo do ritual, rola 3d8+3/5d8+5/7d8+7 de cura conforme a forma escolhida e recupera PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["cicatrizacao"]
      }
    ],
    automation: vs(),
    itemPatch: Md()
  };
}
function Id() {
  return {
    id: $d,
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
    automation: Nd(),
    itemPatch: Fd()
  };
}
function Ld() {
  return {
    id: wd,
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
    automation: Pd(),
    itemPatch: Od()
  };
}
function vd() {
  return {
    id: Ss,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ir()
  };
}
function Dd() {
  return {
    id: Is,
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
function vs(e = Ls) {
  const t = xd(e);
  return Ds(
    {
      version: 1,
      label: "Cicatrização",
      ritualForms: {
        base: {
          label: "Padrão",
          rollFormulaOverrides: {
            healing: t.base
          }
        },
        discente: {
          label: "Discente",
          extraCost: 2,
          rollFormulaOverrides: {
            healing: t.discente
          }
        },
        verdadeiro: {
          label: "Verdadeiro",
          extraCost: 9,
          rollFormulaOverrides: {
            healing: t.verdadeiro
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
    t.base
  );
}
function xd(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Ls,
    ...e
  };
}
function Nd() {
  return {
    ...ir("3d6", {
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
function Pd() {
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
function ir(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", r = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ds(
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
          damageType: r
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
          title: a,
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function Md() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: or,
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
      studentForm: !0,
      trueForm: !0
    }
  };
}
function Od() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: or,
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
function Fd() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: or,
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
function Ds(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: n
    })
  };
}
function sr() {
  return Array.from(game.user?.targets ?? []).map(xs);
}
function xs(e) {
  return {
    tokenId: Ne(e.id),
    actorId: Ne(e.actor?.id),
    sceneId: Ne(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Ns() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Ne(e.id),
    actorId: Ne(t?.id),
    sceneId: Ne(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Ne(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Bd(e) {
  return {
    logFirstRitualCost() {
      const t = ge("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = he(t);
      if (!n) return;
      const a = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      f.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: a.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${a.value.amount} ${a.value.resource} (${a.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const a = ge("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const r = he(a);
      if (r) {
        if (!qd(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await r.setFlag(d, "ritual.cost", {
          resource: n,
          amount: t
        }), f.info(`Custo customizado aplicado em ${r.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${r.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = ge("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = he(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = ge("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = he(t);
      if (!n) return;
      const a = e.automationRegistry.require(Es);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = ge("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const a = he(n);
      if (!a) return;
      if (!mo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const r = e.automationRegistry.require(Cs);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: vs(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = ge("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const a = he(n);
      if (!a) return;
      if (!mo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const r = e.automationRegistry.require(Ss);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: ir(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ge("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = he(t);
      n && await Ud(e, t, n);
    }
  };
}
async function Ud(e, t, n) {
  const a = bt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Ns(),
    item: n,
    targets: sr()
  });
  if (!r.ok) {
    zd(r.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", xe(r.value.context));
}
function zd(e) {
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
function ge(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function he(e) {
  const t = $s(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function qd(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function mo(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const jd = ["strict", "open"], Ps = "strict";
function Gd(e) {
  return jd.includes(e) ? e : Ps;
}
function Vd(e) {
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
function sn(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Hd = ["disabled", "ask", "automatic"], Wd = ["buttons", "confirm"], Ms = "ask";
function Kd(e) {
  return typeof e == "string" && Hd.includes(e);
}
function Yd(e) {
  return typeof e == "string" && Wd.includes(e);
}
function Xd(e) {
  return Kd(e) ? e : Yd(e) ? "ask" : Ms;
}
const Qd = ["keep", "replace"], Zd = ["manual", "assisted"], Os = "keep", Fs = "assisted", Jd = !0, M = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function em() {
  game.settings.register(d, M.executionMode, {
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
    default: Ms
  }), game.settings.register(d, M.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Os
  }), game.settings.register(d, M.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Fs
  }), game.settings.register(d, M.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Ps
  }), game.settings.register(d, M.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Jd
  }), game.settings.register(d, M.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function la() {
  const e = Xd(game.settings.get(d, M.executionMode)), t = zs(game.settings.get(d, M.systemCardMode)), n = qs(game.settings.get(d, M.damageResolutionMode)), a = lr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: a,
    ritualCastingCheckEnabled: Us()
  };
}
function Bs() {
  return zs(game.settings.get(d, M.systemCardMode));
}
function tm() {
  return qs(game.settings.get(d, M.damageResolutionMode));
}
function lr() {
  return Gd(game.settings.get(d, M.resistanceGateMode));
}
function Us() {
  return game.settings.get(d, M.ritualCastingCheckEnabled) === !0;
}
async function be(e) {
  await game.settings.set(d, M.executionMode, e);
}
function zs(e) {
  return Qd.includes(e) ? e : Os;
}
function qs(e) {
  return Zd.includes(e) ? e : Fs;
}
function nm(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await be("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await be("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await be(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await be("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await be("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await be("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await be("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const am = [
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
function rm(e) {
  return {
    phases() {
      return am;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = In("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = dd(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await fo(e, t, n);
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
      if (!sm(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = im(n) ?? In("Nenhum ator encontrado para executar automação do item.");
      a && await fo(e, a, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = In("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = ud(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(Is);
        if (!a.ok) {
          f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, a.value), f.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (a) {
        f.error("Falha ao configurar automação de teste no item.", a), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function fo(e, t, n) {
  const a = bt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Ns(),
    item: n,
    targets: sr()
  });
  if (!r.ok) {
    om(r.error);
    return;
  }
  f.info("Automação executada com sucesso.", xe(r.value.context));
}
function om(e) {
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
function In(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function im(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function sm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function lm(e) {
  const t = Ad(e), n = fd(e), a = Bd(e), r = rm(e), o = kd(), s = nm(e);
  return {
    actor: t,
    automation: n,
    ritual: a,
    workflow: r,
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
const Mt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function cm(e) {
  return {
    list: () => e.listConditions(),
    get: (t) => {
      const n = e.getCondition(t);
      return n.ok ? n.value : null;
    },
    applyToActor: (t, n, a = {}) => e.applyCondition({
      actor: t,
      conditionId: n,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source ?? "api.applyToActor",
      refreshExisting: a.refreshExisting
    }),
    removeFromActor: (t, n) => e.removeCondition({
      actor: t,
      conditionId: n
    }),
    applyToSelectedTokens: async (t, n = {}) => {
      const a = po();
      if (a.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const r = await Promise.all(
        a.map(
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
      return um(r), r;
    },
    removeFromSelectedTokens: async (t) => {
      const n = po();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const a = await Promise.all(
        n.map(
          (r) => e.removeCondition({
            actor: r,
            conditionId: t
          })
        )
      );
      return dm(a), a;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function po() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = n.actor ?? n.document?.actor ?? null;
    if (!a) continue;
    const o = a.uuid ?? null ?? a.id ?? a.name ?? `selected-${t.size}`;
    t.set(o, a);
  }
  return Array.from(t.values());
}
function um(e) {
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
function dm(e) {
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
function I(e) {
  return e == null ? "" : String(e).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
const mm = "icons/svg/mystery-man.svg";
function fm(e) {
  const t = e.image, n = t?.src || t?.fallbackSrc || mm, a = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(
    (r) => `<span class="paranormal-toolkit-chat-card-header__badge paranormal-toolkit-chat-card-header__badge--${r.tone ?? "neutral"}">${I(r.label)}</span>`
  ).join("")}</div>` : "";
  return `
    <header class="paranormal-toolkit-chat-card-header">
      <img
        class="paranormal-toolkit-chat-card-header__image"
        src="${I(n)}"
        alt="${I(t?.alt ?? "")}"
        width="46"
        height="46"
      >
      <div class="paranormal-toolkit-chat-card-header__body">
        <p class="paranormal-toolkit-chat-card-header__eyebrow">${I(e.eyebrow)}</p>
        <h3 class="paranormal-toolkit-chat-card-header__title">${I(e.title)}</h3>
        ${e.subtitle ? `<p class="paranormal-toolkit-chat-card-header__subtitle">${I(e.subtitle)}</p>` : ""}
        ${a}
      </div>
    </header>
  `;
}
function pm(e) {
  return `
    <section class="paranormal-toolkit-ritual-context" aria-label="Contexto do ritual">
      <p class="paranormal-toolkit-ritual-context__route"><strong>${I(e.casterName)}</strong><span aria-hidden="true">→</span><strong>${I(e.targetName)}</strong></p>
      <div class="paranormal-toolkit-ritual-context__pills">${e.pills.map((t) => `<span class="paranormal-toolkit-ritual-context__pill">${I(t)}</span>`).join("")}</div>
      <p class="paranormal-toolkit-ritual-context__resistance">${I(e.resistanceLabel)}</p>
    </section>
  `;
}
function cr(e, t) {
  return e.find((n) => n.id === t) ?? e[0];
}
function js(e, t, n, a = !1) {
  const r = cr(e, t), o = e.map(
    (s) => `<option value="${I(s.id)}"${s.id === r.id ? " selected" : ""}>${I(s.formula)}</option>`
  ).join("");
  return `
    <label class="paranormal-toolkit-ritual-formula">
      <span class="paranormal-toolkit-ritual-formula__label">${I(r.label)}</span>
      <select class="paranormal-toolkit-ritual-formula__select" data-ritual-control="${n}"${a ? " disabled" : ""} aria-label="${I(r.label)}">
        ${o}
      </select>
    </label>
  `;
}
function Gs(e) {
  return `<strong class="paranormal-toolkit-ritual-result-total">${e ?? "—"}</strong>`;
}
const gm = { pending: "Pendente", success: "Sucesso", failure: "Falha" };
function hm(e, t = !1) {
  const n = cr(e.options, e.selectedFormulaId);
  return `
    <section class="paranormal-toolkit-ritual-workflow paranormal-toolkit-ritual-workflow--conjuration paranormal-toolkit-ritual-workflow--${e.status}">
      <header class="paranormal-toolkit-ritual-workflow__header"><strong>Conjuração</strong><span class="paranormal-toolkit-ritual-workflow__status">${gm[e.status]}</span></header>
      <p class="paranormal-toolkit-ritual-workflow__description">${I(e.skillLabel)}: ${n.total ?? "—"} vs DT ${e.difficulty}</p>
      <div class="paranormal-toolkit-ritual-workflow__roll">${js(e.options, e.selectedFormulaId, "conjuration-formula", t)}${Gs(n.total)}</div>
    </section>
  `;
}
function bm(e, t = !1) {
  const n = e.state === "pending" ? "" : `<span class="paranormal-toolkit-ritual-resistance__result">${e.total} · ${e.state === "success" ? "Sucesso" : "Falha"}</span>`;
  return `
    <section class="paranormal-toolkit-ritual-resistance paranormal-toolkit-ritual-resistance--${e.state}">
      <div class="paranormal-toolkit-ritual-resistance__content">
        <strong class="paranormal-toolkit-ritual-resistance__title">Resistência</strong>
        <p class="paranormal-toolkit-ritual-resistance__description">${I(e.label)} · <strong>DT ${e.difficulty}</strong> · ${I(e.consequence)}</p>
        ${n}
      </div>
      <button type="button" class="paranormal-toolkit-ritual-resistance__button" data-ritual-control="resistance"${t ? " disabled" : ""} aria-label="Rolar resistência">${e.total ?? '<i class="fa-solid fa-dice-d20" aria-hidden="true"></i>'}</button>
    </section>
  `;
}
function ym(e, t = !1) {
  const n = cr(e.options, e.selectedFormulaId), a = e.resistance.state !== "pending" && !t, r = e.damageApplied ? "Dano aplicado na demonstração" : a ? "Aplicar dano" : "Role resistência";
  return `
    <section class="paranormal-toolkit-ritual-workflow paranormal-toolkit-ritual-workflow--damage">
      <header class="paranormal-toolkit-ritual-workflow__header"><strong>Dano</strong></header>
      <p class="paranormal-toolkit-ritual-workflow__description">${I(e.damageType)}</p>
      <div class="paranormal-toolkit-ritual-workflow__roll">${js(e.options, e.selectedFormulaId, "damage-formula", t)}${Gs(n.total)}</div>
      ${bm(e.resistance, t)}
      <section class="paranormal-toolkit-ritual-assisted-action">
        <strong class="paranormal-toolkit-ritual-assisted-action__title">Aplicar dano</strong>
        <p class="paranormal-toolkit-ritual-assisted-action__hint">${e.resistance.state === "pending" ? "Role a resistência antes de aplicar esta ação." : "A resistência foi resolvida; a ação local está disponível."}</p>
        <button type="button" class="paranormal-toolkit-ritual-assisted-action__button" data-ritual-control="apply-damage"${a && !e.damageApplied ? "" : " disabled"}>${r}</button>
      </section>
    </section>
  `;
}
function _m(e, t = !1) {
  const n = e.resistanceState === "pending" ? "Role resistência" : `${e.resistanceTotal} · ${e.resistanceState === "success" ? "Sucesso" : "Falha"}`;
  return `
    <section class="paranormal-toolkit-ritual-effect">
      <strong class="paranormal-toolkit-ritual-effect__title">Efeito</strong>
      <div class="paranormal-toolkit-ritual-effect__body"><span class="paranormal-toolkit-ritual-effect__label">${I(e.name)} · ${I(e.duration)}</span><button type="button" class="paranormal-toolkit-ritual-effect__button" data-ritual-control="effect-resistance"${t ? " disabled" : ""}>${n}</button></div>
    </section>
  `;
}
function Vs(e, t = {}) {
  const n = t.disabled ?? !1;
  return `<article class="paranormal-toolkit-chat-card paranormal-toolkit-ritual-single-target"><div class="paranormal-toolkit-chat-card__demo">Demonstração</div>${fm(e.header)}<div class="paranormal-toolkit-ritual-single-target__body">${pm(e.context)}${hm(e.conjuration, n)}${ym(e.damage, n)}${_m(e.effect, n)}</div></article>`;
}
function Te() {
  return {
    header: { image: { src: "icons/svg/lightning.svg", alt: "" }, eyebrow: "Ritual fictício", title: "Eletrocussão Prismática", subtitle: "Mercy", badges: [{ label: "Energia", tone: "accent" }] },
    context: { casterName: "Mercy", targetName: "Malvadão", pills: ["1 PE gasto", "Alvo: 1 Ser(es)", "Duração: instantânea"], resistanceLabel: "Resistência: Fortitude · DT 22 · reduz dano à metade" },
    conjuration: { skillLabel: "Ocultismo", difficulty: 21, selectedFormulaId: "standard", status: "success", options: [
      { id: "standard", label: "Fórmula padrão", formula: "1d20 + 10 + 5", total: 27, status: "success" },
      { id: "focused", label: "Fórmula concentrada", formula: "1d20 + 6", total: 18, status: "failure" },
      { id: "pending", label: "Fórmula pendente", formula: "1d20 + 8", total: null, status: "pending" }
    ] },
    damage: { damageType: "Eletricidade", selectedFormulaId: "base", options: [
      { id: "base", label: "Dano padrão", formula: "3d6", total: 11 },
      { id: "amplified", label: "Dano ampliado", formula: "5d6 + 2", total: 24 }
    ], resistance: { label: "Fortitude", difficulty: 22, consequence: "reduz dano à metade", state: "pending", total: null }, damageApplied: !1 },
    effect: { name: "Vulnerável", duration: "1 rodada", resistanceState: "pending", resistanceTotal: null }
  };
}
const Am = {
  ...Te(),
  damage: { ...Te().damage, resistance: { ...Te().damage.resistance, state: "failure", total: 17 } },
  effect: { ...Te().effect, resistanceState: "success", resistanceTotal: 25 }
};
function Tm(e = !1) {
  return [{ kind: "ritual-single-target", html: Vs(e ? Am : Te(), { disabled: e }) }];
}
const Hs = "uiExamples";
function Rm() {
  return game.messages?.contents ?? (game.messages.values ? Array.from(game.messages.values()) : []);
}
function km(e) {
  return e.getFlag?.(d, Hs)?.kind === "component-example";
}
async function Ws() {
  const e = Rm().filter(km);
  return await Promise.all(e.map((t) => t.delete?.())), { deleted: e.length };
}
async function $m(e = {}) {
  const t = e.replaceExisting ?? !0, n = e.whisperToGm ?? !0, a = t ? (await Ws()).deleted : 0, r = foundry.utils.randomID(), o = [];
  for (const s of Tm(!0)) {
    const l = await ChatMessage.create({ content: s.html, whisper: n ? game.users.filter((c) => c.isGM && c.id).map((c) => c.id) : [], flags: { [d]: { [Hs]: { version: 1, kind: "component-example", batchId: r } } } });
    l?.id && o.push(l.id);
  }
  return { created: o.length, deletedBeforeCreate: a, messageIds: o };
}
class wm {
  model = Te();
  snapshot() {
    return structuredClone(this.model);
  }
  selectConjurationFormula(t) {
    const n = this.model.conjuration.options.find((a) => a.id === t);
    n && (this.model.conjuration = { ...this.model.conjuration, selectedFormulaId: t, status: n.status ?? "pending" });
  }
  selectDamageFormula(t) {
    this.model.damage.options.some((n) => n.id === t) && (this.model.damage = { ...this.model.damage, selectedFormulaId: t });
  }
  resolveResistance(t = "success") {
    this.model.damage = { ...this.model.damage, resistance: { ...this.model.damage.resistance, state: t, total: t === "success" ? 25 : 17 } };
  }
  applyDamage() {
    this.model.damage.resistance.state !== "pending" && (this.model.damage = { ...this.model.damage, damageApplied: !0 });
  }
  resolveEffectResistance(t = "success") {
    this.model.effect = { ...this.model.effect, resistanceState: t, resistanceTotal: t === "success" ? 24 : 14 };
  }
  setScenario(t) {
    this.model = Te(), t === "casting-pending" && this.selectConjurationFormula("pending"), t === "casting-failure" && this.selectConjurationFormula("focused"), t === "resistance-success" && this.resolveResistance("success"), t === "resistance-failure" && this.resolveResistance("failure"), t === "effect-resolved" && this.resolveEffectResistance("success");
  }
}
const { ApplicationV2: Em } = foundry.applications.api;
class Cm extends Em {
  static DEFAULT_OPTIONS = { id: `${d}-component-gallery`, classes: [`${d}-component-gallery`], tag: "section", position: { width: 700, height: 760 }, window: { title: "Paranormal Toolkit · Ritual single-target", resizable: !0 } };
  controller = new wm();
  async _renderHTML() {
    const t = document.createElement("div");
    return t.className = "paranormal-toolkit-component-gallery", t.innerHTML = this.renderContent(), t;
  }
  _replaceHTML(t, n) {
    n.replaceChildren(t), this.bindControls(n);
  }
  renderContent() {
    return `<section class="paranormal-toolkit-component-gallery__group"><header class="paranormal-toolkit-component-gallery__toolbar"><label>Estado <select data-gallery-scenario><option value="success">Conjuração: sucesso</option><option value="casting-pending">Conjuração: pendente</option><option value="casting-failure">Conjuração: falha</option><option value="resistance-success">Resistência: sucesso</option><option value="resistance-failure">Resistência: falha</option><option value="effect-resolved">Efeito: resistência resolvida</option></select></label></header><div class="paranormal-toolkit-component-gallery__preview paranormal-toolkit-component-gallery__preview--narrow">${Vs(this.controller.snapshot())}</div></section>`;
  }
  bindControls(t) {
    t.querySelector("[data-gallery-scenario]")?.addEventListener("change", (n) => {
      this.controller.setScenario(n.currentTarget.value), this.render({ force: !0 });
    }), t.querySelector('[data-ritual-control="conjuration-formula"]')?.addEventListener("change", (n) => {
      this.controller.selectConjurationFormula(n.currentTarget.value), this.render({ force: !0 });
    }), t.querySelector('[data-ritual-control="damage-formula"]')?.addEventListener("change", (n) => {
      this.controller.selectDamageFormula(n.currentTarget.value), this.render({ force: !0 });
    }), t.querySelector('[data-ritual-control="resistance"]')?.addEventListener("click", () => {
      this.controller.resolveResistance("success"), this.render({ force: !0 });
    }), t.querySelector('[data-ritual-control="apply-damage"]')?.addEventListener("click", () => {
      this.controller.applyDamage(), this.render({ force: !0 });
    }), t.querySelector('[data-ritual-control="effect-resistance"]')?.addEventListener("click", () => {
      this.controller.resolveEffectResistance("success"), this.render({ force: !0 });
    });
  }
}
let go = null;
function Sm() {
  go ??= new Cm(), go.render({ force: !0 });
}
function Ln() {
  return game.user?.isGM ? !0 : (ui.notifications?.warn("Apenas o mestre pode usar os exemplos visuais do Paranormal Toolkit."), !1);
}
function Ks() {
  return { openGallery() {
    Ln() && Sm();
  }, async postChatCards(e) {
    return Ln() ? $m(e) : { created: 0, deletedBeforeCreate: 0, messageIds: [] };
  }, async clearChatCards() {
    return Ln() ? Ws() : { deleted: 0 };
  } };
}
function Im() {
  const e = Ks(), t = game.modules.get("paranormal-toolkit");
  return t && (t.api = { ...t.api ?? {}, uiExamples: e }), e;
}
function Lm(e) {
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
    conditions: cm(e.conditions),
    debug: lm(e),
    hooks: Mt,
    uiExamples: Ks()
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const a = game.modules.get(d);
  return a && (a.api = t), t;
}
class ho {
  static isSupportedSystem() {
    return game.system.id === Ou;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const vn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function vm(e) {
  if (!Om(e.item)) return null;
  const t = ca(e.actor) ? e.actor : Dm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Nm(e.token) ?? xm(t),
    targets: sr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Dm(e) {
  const t = e;
  return ca(t.actor) ? t.actor : ca(e.parent) ? e.parent : null;
}
function xm(e) {
  const t = Pm(e) ?? Mm(e);
  return t ? Ys(t) : null;
}
function Nm(e) {
  return ua(e) ? Ys(e) : null;
}
function Pm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return ua(n) ? n : (t.getActiveTokens?.() ?? []).find(ua) ?? null;
}
function Mm(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ys(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Dn(e.id),
    actorId: Dn(t?.id),
    sceneId: Dn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Om(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ca(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ua(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Dn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Xs {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(vn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${vn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = vm(Fm(t));
    if (!n) {
      f.warn(`${vn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Fm(e) {
  return e && typeof e == "object" ? e : {};
}
function Gt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function ur() {
  const e = globalThis.game;
  return ln(e) ? e : null;
}
function K(e, t) {
  const n = Bm(e, t);
  return Ot(n);
}
function Bm(e, t) {
  return t.split(".").reduce((n, a) => ln(n) ? n[a] : null, e);
}
function Um(e, t) {
  const n = e.indexOf(":");
  return n < 0 || dt(e.slice(0, n)) !== dt(t) ? null : We(e.slice(n + 1));
}
function Ot(e) {
  return typeof e == "string" ? We(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function ln(e) {
  return !!e && typeof e == "object";
}
function zm(e) {
  return typeof e == "string";
}
function cn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function We(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function dt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function da(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ue(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Qs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const Vt = "abilityRollConfig", Zs = [
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
], ma = 20, fa = 20, qm = [10, 40, 65, 99];
function Js() {
  return {
    schemaVersion: 1,
    rolls: [el(1)]
  };
}
function el(e) {
  return {
    id: Gm(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function jm() {
  return qm.map((e) => ({ minNex: e, formula: "" }));
}
function Gm() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function tl(e) {
  return dr(
    e.getFlag(d, Vt)
  );
}
function Vm(e) {
  return tl(e) ?? Js();
}
async function Hm(e, t) {
  const n = dr(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, Vt, n), n;
}
async function Wm(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, Vt)
    );
    return;
  }
  await e.setFlag(d, Vt, null);
}
function dr(e) {
  if (!Ue(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, ma).map((a, r) => Jm(a, r, t)).filter((a) => a !== null)
  };
}
function Km(e, t) {
  const n = tl(t);
  return n ? Ym(n, Xm(e)) : [];
}
function Ym(e, t) {
  const n = [];
  for (const a of e.rolls) {
    if (a.formula.mode === "fixed") {
      const l = a.formula.formula.trim();
      if (!l) continue;
      n.push({
        id: a.id,
        sourceRollId: a.id,
        label: a.label,
        intent: a.intent,
        damageType: a.intent === "damage" ? a.damageType : null,
        formula: l,
        nexThreshold: null
      });
      continue;
    }
    const r = a.formula.steps.filter(
      (l) => l.formula.trim().length > 0 && l.minNex <= t
    );
    if (r.length === 0) continue;
    const o = r.at(-1);
    if (!o) continue;
    const s = a.formula.resolution === "choose-unlocked" ? r : [o];
    for (const l of s)
      n.push({
        id: a.formula.resolution === "choose-unlocked" ? `${a.id}--nex-${l.minNex}` : a.id,
        sourceRollId: a.id,
        label: a.label,
        intent: a.intent,
        damageType: a.intent === "damage" ? a.damageType : null,
        formula: l.formula.trim(),
        nexThreshold: l.minNex
      });
  }
  return n;
}
function Xm(e) {
  const t = Ue(e.system) ? e.system : {}, n = t.NEX ?? t.nex, a = Ue(n) ? n.value : n, r = typeof a == "number" ? a : Number(a);
  return Number.isFinite(r) ? al(r) : 0;
}
function nl(e) {
  return Zs.find((t) => t.value === e)?.label ?? e;
}
function Qm(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function Zm(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function Jm(e, t, n) {
  if (!Ue(e)) return null;
  const a = `roll-${t + 1}`, r = of(rf(e.id, a), n), o = nf(e.intent), s = ef(e.formula);
  return !o || !s ? null : {
    id: r,
    label: un(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? sf(e.damageType) : null,
    formula: s
  };
}
function ef(e) {
  if (!Ue(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: un(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, fa).map(tf).filter((a) => a !== null) : [];
  t.sort((a, r) => a.minNex - r.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const a of t) n.set(a.minNex, a);
  return {
    mode: "nex",
    resolution: af(e.resolution),
    steps: [...n.values()]
  };
}
function tf(e) {
  if (!Ue(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: al(t),
    formula: un(e.formula)
  } : null;
}
function nf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function af(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function rf(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function of(e, t) {
  let n = e, a = 2;
  for (; t.has(n); )
    n = `${e}-${a}`, a += 1;
  return t.add(n), n;
}
function al(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function un(e) {
  return typeof e == "string" ? e.trim() : "";
}
function sf(e) {
  const t = un(e);
  return t.length > 0 ? t : null;
}
function Ue(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const mr = "data-paranormal-toolkit-ability-roll-id";
function lf(e) {
  if (!rl(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = le(e.actorUuid), n = le(e.itemUuid), a = le(e.abilityName);
  if (!t) return null;
  const r = e.rolls.map(cf).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: a || "Habilidade",
    rolls: r,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: xn(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: xn(e.resourceBefore),
    resourceAfter: xn(e.resourceAfter)
  };
}
function cf(e) {
  if (!rl(e)) return null;
  const t = le(e.id), n = le(e.sourceRollId), a = le(e.label), r = le(e.formula), o = uf(e.intent);
  if (!t || !n || !a || !r || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: a,
    formula: r,
    intent: o,
    damageType: o === "damage" ? df(e.damageType) : null,
    nexThreshold: s
  };
}
function uf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function le(e) {
  return typeof e == "string" ? e.trim() : "";
}
function df(e) {
  const t = le(e);
  return t.length > 0 ? t : null;
}
function xn(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function rl(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const bo = "paranormalToolkitAbilityRollBound";
let yo = !1;
function mf() {
  if (yo) return;
  yo = !0;
  const e = (t, n) => {
    ff(t, Gt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function ff(e, t) {
  if (!t) return 0;
  const n = `[${mr}]`, a = Rf(t, n);
  let r = 0;
  for (const o of a)
    o.dataset[bo] !== "true" && (o.dataset[bo] = "true", o.addEventListener("click", () => {
      pf(e, o);
    }), r += 1);
  return r;
}
async function pf(e, t) {
  const n = t.getAttribute(mr)?.trim();
  if (!n) return;
  const a = gf(e), r = a?.rolls.find((l) => l.id === n);
  if (!a || !r) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await hf(a.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!_f(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = bf();
  if (!s) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  _o(t, !0);
  try {
    const l = new s(
      r.formula,
      yf(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: Af(a.abilityName, r)
      })
    );
  } catch (l) {
    console.warn(
      "Paranormal Toolkit: não foi possível executar a rolagem da habilidade.",
      l
    ), ui.notifications?.warn(
      `Paranormal Toolkit: não foi possível rolar ${r.label}. Revise a fórmula configurada.`
    );
  } finally {
    _o(t, !1);
  }
}
function gf(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : lf(
    t.getFlag(d, "abilityUse")
  );
}
async function hf(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if (Ao(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, r = game.actors?.get?.(n);
  return Ao(r) ? r : null;
}
function bf() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function yf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function _f(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function Af(e, t) {
  const n = [Tf(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${Nn(e)}</strong>
      <span>${Nn(t.label)}</span>
      <small>${Nn(n.join(" · "))}</small>
    </div>
  `;
}
function Tf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${nl(e.damageType)}` : "Dano";
  }
}
function Rf(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function _o(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function Ao(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function Nn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const kf = "paranormal-toolkit-chat-message--full-width-card", To = ".paranormal-toolkit-ability-card", Ro = "li.chat-message";
let ko = !1;
function $f() {
  if (ko) return;
  ko = !0;
  const e = Hooks, t = (n, a) => {
    $o(Gt(a));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), $o(document);
}
function $o(e) {
  if (!e) return 0;
  const t = fr(e), n = wf(t), a = /* @__PURE__ */ new Set();
  for (const r of n) {
    const o = Ef(t, r);
    o?.classList && a.add(o);
  }
  for (const r of a)
    r.classList?.add(kf);
  return a.size;
}
function wf(e) {
  const t = [];
  e.matches?.(To) && t.push(e);
  const n = e.querySelectorAll?.(To);
  if (!n) return t;
  for (const a of Array.from(n)) {
    const r = fr(a);
    t.includes(r) || t.push(r);
  }
  return t;
}
function Ef(e, t) {
  if (e.matches?.(Ro)) return e;
  const n = t.closest?.(Ro);
  return n ? fr(n) : null;
}
function fr(e) {
  return e && typeof e == "object" ? e : {};
}
function Cf(e) {
  const t = Sf(e.cost), n = If(e.currentResource), a = t > 0 && !e.passive, r = n >= t;
  return {
    header: {
      eyebrow: e.passive ? "Habilidade passiva" : "Usar habilidade",
      title: e.abilityName,
      subtitle: `Execução: ${e.activationLabel}`,
      image: e.abilityImage,
      actorName: e.actorName
    },
    cost: {
      resource: e.resource,
      amount: t,
      current: n,
      after: Math.max(0, n - t),
      hasCost: a,
      canSpend: r,
      spendResourceChecked: a,
      toggleLabel: `Gastar ${t} ${e.resource} automaticamente`,
      costText: a ? `${t} ${e.resource}` : "Nenhum",
      currentText: `${n} ${e.resource}`,
      afterText: `${Math.max(0, n - t)} ${e.resource}`
    },
    passive: e.passive,
    primaryActionLabel: e.passive ? "Enviar ao chat" : "Usar habilidade"
  };
}
function Sf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function If(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Lf } = foundry.applications.api;
class lt extends Lf {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = Cf(t), this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  spendResource;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${d}-ability-use`,
    classes: [
      d,
      "paranormal-toolkit-ritual-cast-app",
      "paranormal-toolkit-ability-use-app"
    ],
    tag: "section",
    position: {
      width: 540,
      height: "auto"
    },
    window: {
      title: "Usar habilidade",
      icon: "fa-solid fa-bolt",
      resizable: !0
    },
    actions: {
      useAbility: lt.onUseAbility,
      cancel: lt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new lt(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const a = document.createElement("div");
    return a.className = "paranormal-toolkit-ritual-cast paranormal-toolkit-ability-use", a.innerHTML = this.renderContent(), a;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
    const r = n.querySelector(".paranormal-toolkit-ability-use") ?? n;
    this.bindSpendResourceToggle(r), this.updateInteractiveState(r);
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    const t = this.model.cost.hasCost ? this.renderPaidCostSection() : this.renderFreeCostSection();
    return `
      <header class="paranormal-toolkit-ritual-cast__header paranormal-toolkit-ability-use__header">
        <img
          class="paranormal-toolkit-ability-use__image"
          src="${vf(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${z(this.model.header.eyebrow)}</p>
          <h2>${z(this.model.header.title)}</h2>
          <p>${z(this.model.header.subtitle)}</p>
        </div>
      </header>

      ${t}

      <footer class="paranormal-toolkit-ritual-cast__footer">
        <button type="button" data-action="cancel">Cancelar</button>
        <button
          type="button"
          data-action="useAbility"
          class="paranormal-toolkit-ritual-cast__cast-button paranormal-toolkit-ability-use__submit"
        >
          <i class="fa-solid ${this.model.passive ? "fa-message" : "fa-bolt"}"></i>
          <span data-paranormal-toolkit-ability-submit-label>${z(this.model.primaryActionLabel)}</span>
        </button>
      </footer>
    `;
  }
  renderPaidCostSection() {
    const t = this.model.cost.canSpend ? "hidden" : "";
    return `
      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" checked>
            <span>${z(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${z(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${z(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${z(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${t}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${z(this.model.cost.resource)} suficiente para pagar este custo.</span>
        </div>
      </section>
    `;
  }
  renderFreeCostSection() {
    const t = this.model.passive ? "Esta é uma habilidade passiva e não consome recursos." : "Esta habilidade não possui custo de recurso.";
    return `
      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>Nenhum</dd></div>
          <div><dt>Personagem</dt><dd>${z(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${z(t)}</p>
      </section>
    `;
  }
  bindSpendResourceToggle(t) {
    const n = t.querySelector('input[name="spendResource"]');
    n && n.addEventListener("change", () => {
      this.spendResource = n.checked, this.updateInteractiveState(t);
    });
  }
  updateInteractiveState(t) {
    const n = t.querySelector(
      '[data-action="useAbility"]'
    ), a = t.querySelector(
      "[data-paranormal-toolkit-ability-submit-label]"
    ), r = t.querySelector(
      "[data-paranormal-toolkit-ability-after]"
    ), o = t.querySelector(
      "[data-paranormal-toolkit-ability-warning]"
    ), s = this.model.cost.hasCost && this.spendResource && !this.model.cost.canSpend;
    n && (n.disabled = s), o && (o.hidden = !s), r && (r.textContent = this.spendResource ? this.model.cost.afterText : "Não será alterado"), a && !this.model.passive && (a.textContent = this.model.cost.hasCost ? this.spendResource ? "Usar habilidade" : "Usar sem gastar" : this.model.primaryActionLabel);
  }
  static async onUseAbility(t) {
    t.preventDefault(), !(this.model.cost.hasCost && this.spendResource && !this.model.cost.canSpend) && (this.settle({
      spendResource: this.model.cost.hasCost && this.spendResource
    }), await this.close());
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function z(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function vf(e) {
  return z(e);
}
function Df(e, t) {
  const n = Ff(t.system), a = Ht(n.activation), r = Mf(a), o = Nf();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Bf(t),
    activation: a,
    activationLabel: Pf(a),
    description: Ht(n.description),
    chatDescription: xf(
      n.chatDescription,
      n.description
    ),
    cost: r ? 0 : Of(n.cost),
    resource: o,
    passive: r,
    rolls: Km(e, t)
  };
}
function xf(e, t) {
  const n = Ht(e);
  return n.trim().length > 0 ? n : Ht(t);
}
function Nf() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Pf(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, a = Uf()?.(t) ?? t;
  return a === t ? e : a;
}
function Mf(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Of(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Ff(e) {
  return e && typeof e == "object" ? e : {};
}
function Ht(e) {
  return typeof e == "string" ? e : "";
}
function Bf(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Uf() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class zf {
  async publish(t, n, a) {
    const r = await Wf(n), o = qf({
      abilityName: n.name,
      abilityImage: n.image,
      actorName: n.actor.name ?? "Personagem sem nome",
      activationLabel: n.activationLabel,
      description: r,
      resource: n.resource,
      cost: n.cost,
      passive: n.passive,
      spentResource: a.spentResource,
      resourceBefore: a.resourceBefore,
      resourceAfter: a.resourceAfter,
      rolls: n.rolls
    }), s = {
      version: 2,
      actorUuid: n.actor.uuid ?? n.actor.id ?? "",
      itemUuid: n.item.uuid ?? n.item.id ?? "",
      abilityName: n.name,
      rolls: n.rolls,
      resource: n.resource,
      cost: n.cost,
      spentResource: a.spentResource,
      resourceBefore: a.resourceBefore,
      resourceAfter: a.resourceAfter
    }, l = {
      speaker: ChatMessage.getSpeaker({ actor: n.actor }),
      content: o,
      flags: {
        [d]: {
          abilityUse: s
        }
      }
    }, c = Hf(t.message);
    if (Bs() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function qf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, a = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", r = jf(e.rolls), o = Vf(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${pa(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${se(e.abilityName)}</h3>
          <p>${se(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${se(e.activationLabel)}</span>
        <span><strong>Custo</strong>${se(t)}</span>
      </div>

      ${r}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${a}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${se(n)}</span>
      </footer>
    </article>
  `;
}
function jf(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const a = `paranormal-toolkit-ability-card__roll--${n.intent}`, r = Gf(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${a}"
          ${mr}="${pa(n.id)}"
          title="${pa(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${se(n.label)}</strong>
            <small>${se(r)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function Gf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${nl(e.damageType)}` : "Dano";
  }
}
function Vf(e) {
  return e.trim() ? `
    <details class="paranormal-toolkit-ability-card__description">
      <summary>
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        <span class="paranormal-toolkit-ability-card__description-show">Ver descrição</span>
        <span class="paranormal-toolkit-ability-card__description-hide">Ocultar descrição</span>
      </summary>
      <div class="paranormal-toolkit-ability-card__description-content">
        ${e}
      </div>
    </details>
  ` : "";
}
function Hf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function se(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function pa(e) {
  return se(e);
}
async function Wf(e) {
  const t = e.chatDescription || e.description, n = Kf();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: Yf(e.actor)
  });
}
function Kf() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function Yf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Xf {
  constructor(t, n, a = new zf()) {
    this.resources = t, this.resourceAdapter = n, this.chatCards = a;
  }
  resources;
  resourceAdapter;
  chatCards;
  async run(t) {
    const n = t.actor;
    if (!n)
      return this.fail(
        "missing-actor",
        "Não foi possível identificar o personagem desta habilidade."
      );
    if (!Qf(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const a = Df(n, t.item), r = this.readCurrentResource(a);
    if (!r.ok)
      return this.fail(
        "resource-unavailable",
        r.message
      );
    const o = await lt.request({
      abilityName: a.name,
      abilityImage: a.image,
      actorName: n.name ?? "Personagem sem nome",
      activationLabel: a.activationLabel,
      resource: a.resource,
      cost: a.cost,
      currentResource: r.value,
      passive: a.passive
    });
    if (!o) return { status: "cancelled" };
    let s = r.value, l = s, c = !1;
    if (o.spendResource && a.cost > 0) {
      const u = await this.resources.spend(
        n,
        a.resource,
        a.cost
      );
      if (!u.ok) {
        const m = u.error.reason === "insufficient-resource" ? "insufficient-resource" : "resource-update-failed";
        return this.fail(m, u.error.message);
      }
      s = u.value.before.value, l = u.value.after.value, c = !0;
    }
    try {
      await this.chatCards.publish(t, a, {
        spentResource: c,
        resourceBefore: s,
        resourceAfter: l
      });
    } catch (u) {
      const m = await this.restoreSpentResource(
        a,
        c,
        s
      );
      return console.error(`${d} | Falha ao criar card de habilidade.`, u), this.fail(
        "chat-message-failed",
        m ? "Não foi possível registrar o uso da habilidade no chat. O recurso gasto foi restaurado." : "Não foi possível registrar o uso da habilidade nem restaurar o recurso. Verifique a ficha manualmente."
      );
    }
    return {
      status: "completed",
      spentResource: c,
      resource: a.resource,
      cost: a.cost
    };
  }
  readCurrentResource(t) {
    if (t.passive || t.cost <= 0)
      return { ok: !0, value: 0 };
    const n = this.resourceAdapter.getResource(
      t.actor,
      t.resource
    );
    return n.ok ? { ok: !0, value: n.value.value } : { ok: !1, message: n.error.message };
  }
  async restoreSpentResource(t, n, a) {
    if (!n) return !0;
    try {
      return await this.resourceAdapter.updateResourceValue(
        t.actor,
        t.resource,
        a
      ), !0;
    } catch (r) {
      return console.error(
        `${d} | Falha ao restaurar recurso após erro no card de habilidade.`,
        r
      ), !1;
    }
  }
  fail(t, n) {
    return ui.notifications?.warn(n), { status: "failed", reason: t, message: n };
  }
}
function Qf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const wo = 1e3;
class Zf {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Xf(t, n), this.strategy = new Xs(
      (a) => this.handleItemUsed(a)
    );
  }
  register() {
    this.strategy.register(), $f(), mf(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (la().executionMode === "disabled" || !ep(t.item)) return;
    const n = tp(t);
    if (!this.isDuplicate(n)) {
      this.inFlight.add(n);
      try {
        const a = await this.workflow.run(t);
        a.status === "completed" && this.recentExecutions.set(n, Date.now()), a.status === "failed" && f.warn(
          `Uso genérico de habilidade falhou: ${a.reason}.`,
          a
        );
      } finally {
        this.inFlight.delete(n), this.pruneRecentExecutions();
      }
    }
  }
  isDuplicate(t) {
    if (this.inFlight.has(t)) return !0;
    const n = this.recentExecutions.get(t);
    return n !== void 0 && Date.now() - n < wo;
  }
  pruneRecentExecutions() {
    const t = Date.now() - wo;
    for (const [n, a] of this.recentExecutions)
      a < t && this.recentExecutions.delete(n);
  }
}
function Jf(e, t) {
  const n = new Zf(e, t);
  return n.register(), n;
}
function ep(e) {
  if (e.type !== "ability") return !1;
  const t = tr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function tp(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let Eo = !1, Pn = !1, Mn = !1, St = null;
const np = 1e3, ap = 750, rp = 1e3;
function op(e) {
  Eo || (Hooks.on("combatTurnChange", (t) => {
    sp(e, Co(t));
  }), Hooks.on("deleteCombat", (t) => {
    lp(e, Co(t));
  }), Eo = !0, ip(e));
}
function ip(e) {
  dn() && (Pn || (Pn = !0, globalThis.setTimeout(() => {
    Pn = !1, pr(e, "ready");
  }, np)));
}
function sp(e, t) {
  dn() && t && (St && globalThis.clearTimeout(St), St = globalThis.setTimeout(() => {
    St = null, pr(e, "combat-turn-change", t);
  }, ap));
}
function lp(e, t) {
  dn() && t && (Mn || (Mn = !0, globalThis.setTimeout(() => {
    Mn = !1, pr(e, "combat-deleted", t);
  }, rp)));
}
async function pr(e, t, n) {
  if (dn())
    try {
      const a = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      a.removedEffects > 0 && f.info(
        `Condition Engine removeu ${a.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const r of a.failures)
        f.warn(r.message);
    } catch (a) {
      f.warn("Condition Engine não conseguiu limpar condições expiradas.", a);
    }
}
function dn() {
  return game.user?.isGM === !0;
}
function Co(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ol = {
  enabled: "dice.animations.enabled"
};
function cp() {
  game.settings.register(d, ol.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function up() {
  return {
    enabled: game.settings.get(d, ol.enabled) === !0
  };
}
const mn = "chatCard", So = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, dp = `.${i}__title`, il = `.${i}__header`, mp = `.${i}__roll-card`, fp = `.${i}__roll-meta`, pp = `.${i}__roll-meta-pill`, gr = `.${i}__resistance`, gp = `.${i}__resistance-header`, sl = `.${i}__resistance-description`, fn = `.${i}__resistance-roll-button`, ll = `.${i}__resistance-roll-result`, Io = `${i}__resistance-content`, cl = `.${i}__workflow-section`, ul = `.${i}__workflow-roll`, hr = `${i}__workflow-roll--dice-open`, br = `.${i}__workflow-roll-formula`, yr = `${i}__workflow-roll-formula--toggle`, pn = `.${i}__workflow-dice-tray`, hp = `.${i}__roll-detail-toggle`, bp = `.${i}__roll-detail-list`, yp = `.${i}__ritual-element-badge`, _p = `.${i}__ritual-metadata`, Ap = "casting-backlash", Tp = "data-paranormal-toolkit-action-section", Rp = "data-paranormal-toolkit-prompt-id", kp = "data-paranormal-toolkit-pending-id", Lo = "data-paranormal-toolkit-casting-backlash-enhanced", vo = `.${i}`, $p = `.${i}__workflow-section--casting`, wp = `.${i}__workflow-section-header`, Ep = `.${i}__workflow-notes`, Cp = `[${Tp}="${Ap}"]`, Do = `${i}__workflow-section-title-row`, Sp = `${i}__workflow-section-header--casting-backlash`, dl = `${i}__casting-backlash-button`;
function Ip(e) {
  for (const t of Lp(e))
    vp(t), Mp(t);
}
function Lp(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(vo) && t.add(e);
  for (const n of e.querySelectorAll(vo))
    t.add(n);
  return Array.from(t);
}
function vp(e) {
  const t = e.querySelector(Cp);
  if (!t) return;
  const n = Dp(t);
  if (!n) return;
  const a = e.querySelector(`${$p} ${wp}`);
  a && (a.classList.add(Sp), xp(a), Np(n), a.append(n), t.remove());
}
function Dp(e) {
  return e.querySelector(
    `button[${kp}], button[${Rp}]`
  );
}
function xp(e) {
  const t = e.querySelector(`:scope > .${Do}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Do);
  const a = Array.from(e.childNodes);
  e.prepend(n);
  for (const r of a)
    r !== n && (r instanceof HTMLButtonElement && r.classList.contains(dl) || n.append(r));
  return n;
}
function Np(e) {
  if (e.getAttribute(Lo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Pp(t, e.disabled);
  e.classList.add(dl), e.setAttribute(Lo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Pp(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Mp(e) {
  for (const t of e.querySelectorAll(Ep)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Op(e) {
  for (const t of Array.from(e.querySelectorAll(cl)))
    for (const n of Array.from(t.querySelectorAll(`${hp}, ${bp}`)))
      n.remove();
}
const Fp = {
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
}, Bp = new Set(
  Object.values(Fp)
), Up = {
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
function zp(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = qp(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Up[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Bp.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ml(e) {
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
function qp(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class fl {
  async applyDamage(t) {
    const n = t.actor, a = n.name ?? "Ator sem nome", r = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: r,
        actorName: a,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const o = n.applyDamage;
    if (typeof o != "function")
      return p({
        actor: n,
        actorId: r,
        actorName: a,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let c = null;
    for (const [u, m] of t.instances.entries()) {
      const g = jp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = zp(m.damageType);
      if (!_.ok)
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (g.amount === 0) {
        s.push(
          Gp(g.id, m, _.value)
        );
        continue;
      }
      try {
        const k = await Promise.resolve(
          o.call(n, g.amount, {
            damageType: _.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const $ of Hp(k.conditions))
          l.add($);
        const R = Vp(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? ml(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: xo(k.finalDamage, g.amount),
          blocked: xo(k.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: _.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (k) {
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${a}.`,
          instance: m,
          cause: k
        });
      }
    }
    return y({
      actor: n,
      actorId: r,
      actorName: a,
      totalRawDamage: s.reduce(
        (u, m) => u + m.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (u, m) => u + m.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (u, m) => u + m.blocked,
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
function jp(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Gp(e, t, n) {
  return {
    id: e,
    label: t.label ?? ml(n),
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
function xo(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Vp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Hp(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class _r {
  async rollResistance(t) {
    const n = await Kp(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? $e(t.skill),
      roll: n,
      formula: Xp(n),
      total: Qp(n),
      diceBreakdown: Zp(n)
    };
  }
  getSkillLabel(t) {
    return $e(t);
  }
}
async function Wp(e, t) {
  return new _r().rollResistance({ actor: e, skill: t });
}
function $e(e) {
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
async function Kp(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const a = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Yp(a);
}
function Yp(e) {
  return No(e) ? e : Array.isArray(e) ? e.find(No) ?? null : null;
}
function No(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Xp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Qp(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Zp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Jp);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function Jp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class pl {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class gl {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async rollResistance(t) {
    const n = t.skillLabel ?? this.adapter.getSkillLabel?.(t.skill) ?? t.skill, a = await this.adapter.rollResistance({ ...t, skillLabel: n });
    return {
      ...a,
      skill: a.skill || t.skill,
      skillLabel: a.skillLabel || n
    };
  }
  getSkillLabel(t) {
    return this.adapter.getSkillLabel?.(t) ?? t;
  }
}
function eg(e, t) {
  const n = sg(e?.rounds);
  if (!n)
    return Po(null);
  const a = e?.anchor ?? hl(t);
  if (!a)
    return {
      ...Po(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: tg(),
    start: {
      combat: a.combatId,
      combatant: a.combatantId,
      initiative: a.initiative,
      round: a.round,
      turn: a.turn,
      time: a.time
    },
    requestedRounds: n,
    combatDurationApplied: !0,
    combatId: a.combatId,
    startCombatantId: a.combatantId,
    startInitiative: a.initiative,
    startRound: a.round,
    startTurn: a.turn,
    expiryEvent: r,
    durationMode: "combatantTurn",
    warning: null
  };
}
function hl(e) {
  const t = lg();
  if (!t?.id || !bl(t.round)) return null;
  const n = og(t), a = ng(e, n) ?? rg(t), r = ie(a?.id), o = ug(a?.initiative), s = ag(t, a, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: r,
    round: t.round,
    turn: s,
    initiative: o,
    time: cg()
  };
}
function tg() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Po(e) {
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
function ng(e, t) {
  return e?.id ? t.find((n) => ig(n) === e.id) ?? null : null;
}
function ag(e, t, n) {
  const a = ie(t?.id);
  if (a) {
    const r = n.findIndex((o) => o.id === a);
    if (r >= 0) return r;
  }
  return dg(e.turn) ? e.turn : null;
}
function rg(e) {
  return Ft(e.combatant) ? e.combatant : null;
}
function og(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Ft);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Ft);
    const a = t.values;
    if (typeof a == "function")
      return Array.from(a.call(t)).filter(Ft);
  }
  return [];
}
function ig(e) {
  return ie(e.actor?.id) ?? ie(e.actorId) ?? ie(e.token?.actor?.id) ?? ie(e.token?.actorId) ?? ie(e.document?.actor?.id) ?? ie(e.document?.actorId);
}
function sg(e) {
  return bl(e) ? Math.trunc(e) : null;
}
function lg() {
  return game.combat ?? null;
}
function cg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ft(e) {
  return !!(e && typeof e == "object");
}
function ie(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ug(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function bl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function dg(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class yl {
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
    const a = t.actor;
    if (!Tg(a))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const r = n.value, o = eg(t.duration, a), s = mg(r, t, o), c = t.refreshExisting ?? !0 ? Rg(a, r.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(Mo(a, r, c.id ?? null, !1, !0, o));
      } catch (u) {
        return p({
          actor: a,
          actorId: a.id ?? null,
          actorName: a.name ?? "Ator sem nome",
          conditionId: r.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${r.label} em ${a.name ?? "ator sem nome"}.`,
          cause: u
        });
      }
    try {
      const m = (await a.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return y(Mo(a, r, m, !0, !1, o));
    } catch (u) {
      return p({
        actor: a,
        actorId: a.id ?? null,
        actorName: a.name ?? "Ator sem nome",
        conditionId: r.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${r.label} em ${a.name ?? "ator sem nome"}.`,
        cause: u
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
    const a = this.resolveCanonicalConditionId(t.conditionId), r = Al(n, a);
    let o = 0;
    try {
      for (const s of r)
        await Oo(n, s) === "deleted" && (o += 1);
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
      conditionId: a,
      removed: o
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = wg(), a = [];
    let r = 0, o = 0;
    for (const s of n) {
      const l = Ar(s);
      r += l.length;
      for (const c of l) {
        if (!gg(c, t)) continue;
        const u = _l(c);
        try {
          await Oo(s, c) === "deleted" && (o += 1);
        } catch (m) {
          a.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: c.id ?? null,
            conditionId: u.conditionId,
            message: `Falha ao remover condição expirada ${u.conditionId ?? c.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: m
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: r,
      removedEffects: o,
      failures: a
    };
  }
}
function mg(e, t, n) {
  const a = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Pg(),
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
    changes: e.changes.map((r) => ({ ...r })),
    duration: fg(n.duration),
    start: pg(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: a
    }
  };
}
function fg(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function pg(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Ng(),
    ...e
  };
}
function Mo(e, t, n, a, r, o) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: a,
    refreshed: r,
    requestedRounds: o.requestedRounds,
    combatDurationApplied: o.combatDurationApplied,
    warning: o.warning
  };
}
function gg(e, t) {
  const n = _l(e);
  if (!n.conditionId || !hg(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const a = xg();
  return n.durationMode === "combatantTurn" || bg(n) ? _g(n, a) : yg(e) || !a?.id || n.combatId && n.combatId !== a.id ? !0 : !Y(n.startRound) || !Y(n.requestedRounds) || !Y(a.round) ? !1 : a.round >= n.startRound + n.requestedRounds;
}
function hg(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Y(e.requestedRounds);
}
function bg(e) {
  return !!(e.combatDurationApplied && Y(e.requestedRounds) && Y(e.startRound) && (e.startCombatantId || Wt(e.startTurn)));
}
function yg(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function _g(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !Y(e.startRound) || !Y(e.requestedRounds) || !Y(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const a = Ag(t);
  return e.startCombatantId ? a === e.startCombatantId : Wt(e.startTurn) && Wt(t.turn) ? t.turn === e.startTurn : !1;
}
function Ag(e) {
  return Pe(e.combatant?.id);
}
function _l(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Bt(e, "conditionId"),
    requestedRounds: Fo(e, "requestedRounds") ?? rt(t.value) ?? rt(t.rounds),
    combatDurationApplied: On(e, "combatDurationApplied"),
    combatId: Bt(e, "combatId") ?? Pe(n.combat) ?? Pe(t.combat),
    startCombatantId: Bt(e, "startCombatantId") ?? Pe(n.combatant),
    startInitiative: Ig(e, "startInitiative") ?? Tl(n.initiative),
    startRound: Fo(e, "startRound") ?? rt(n.round) ?? rt(t.startRound),
    startTurn: Sg(e, "startTurn") ?? ga(n.turn) ?? ga(t.startTurn),
    expiryEvent: Lg(e, "expiryEvent") ?? Rl(t.expiry),
    durationMode: vg(e, "durationMode"),
    deleteOnExpire: On(e, "deleteOnExpire"),
    expiresWithCombat: On(e, "expiresWithCombat")
  };
}
function Tg(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Rg(e, t) {
  return Al(e, t)[0] ?? null;
}
function Al(e, t) {
  return Ar(e).filter((n) => Cg(n) === t);
}
async function Oo(e, t) {
  const n = t.id ?? null, a = n ? kg(e, n) : t;
  if (!a) return "missing";
  try {
    return await Promise.resolve(a.delete?.()), "deleted";
  } catch (r) {
    if ($g(r)) return "missing";
    throw r;
  }
}
function kg(e, t) {
  return Ar(e).find((n) => n.id === t) ?? null;
}
function $g(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function wg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      It(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    It(e, n);
  });
  for (const n of Eg())
    It(e, n.actor), It(e, n.document?.actor);
  return Array.from(e.values());
}
function It(e, t) {
  if (!Dg(t)) return;
  const a = Pe(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(a, t);
}
function Eg() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ar(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Cg(e) {
  return Bt(e, "conditionId");
}
function Bt(e, t) {
  return Pe(Ce(e, t));
}
function Fo(e, t) {
  return rt(Ce(e, t));
}
function Sg(e, t) {
  return ga(Ce(e, t));
}
function Ig(e, t) {
  return Tl(Ce(e, t));
}
function Lg(e, t) {
  return Rl(Ce(e, t));
}
function vg(e, t) {
  const n = Ce(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function On(e, t) {
  return Ce(e, t) === !0;
}
function Ce(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const a = e.flags;
  if (!a || typeof a != "object") return;
  const r = a[d];
  if (!(!r || typeof r != "object"))
    return r[t];
}
function Pe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function rt(e) {
  return Y(e) ? Math.trunc(e) : null;
}
function ga(e) {
  return Wt(e) ? Math.trunc(e) : null;
}
function Tl(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Rl(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Dg(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function xg() {
  return game.combat ?? null;
}
function Ng() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Y(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Wt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Pg() {
  return game.user?.id ?? null;
}
const Mg = "icons/svg/downgrade.svg", Og = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Mg,
    description: Og,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Fg = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Bg = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Ug = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), zg = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), qg = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), jg = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Gg = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Vg = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Hg = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Wg = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Kg = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Yg = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Xg = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Qg = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Zg = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Jg = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), eh = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), th = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), nh = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), ah = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), rh = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), oh = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), ih = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), sh = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), lh = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), ch = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), uh = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), dh = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), mh = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), fh = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), ph = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), gh = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), hh = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), bh = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), yh = [
  Fg,
  Bg,
  Ug,
  zg,
  qg,
  jg,
  Gg,
  Vg,
  Hg,
  Wg,
  Kg,
  Yg,
  Xg,
  Qg,
  Zg,
  Jg,
  eh,
  th,
  nh,
  ah,
  rh,
  oh,
  ih,
  sh,
  lh,
  ch,
  uh,
  dh,
  mh,
  fh,
  ph,
  gh,
  hh,
  bh
];
class _h {
  definitions = /* @__PURE__ */ new Map();
  lookup = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const n of t) {
      this.definitions.set(n.id, n), this.registerLookup(n.id, n.id), this.registerLookup(n.label, n.id);
      for (const a of n.aliases ?? [])
        this.registerLookup(a, n.id);
    }
  }
  list() {
    return Array.from(this.definitions.values()).map(Bo);
  }
  get(t) {
    const n = this.lookup.get(Uo(t)), a = n ? this.definitions.get(n) : null;
    return a ? y(Bo(a)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const a = Uo(t);
    a && this.lookup.set(a, n);
  }
}
function kl() {
  return new _h(yh);
}
function Bo(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Uo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function ze(e) {
  return e.applyOnResistance ?? "failure";
}
function $l(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function wl(e, t) {
  const n = ze(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function El(e) {
  const t = ze(e);
  return t === "failure" || t === "success";
}
function Ah(e, t, n, a) {
  const r = e.filter((c) => wl(c, t));
  if (r.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? r.filter((c) => ze(c) === t) : [], s = o.length > 0 ? o : r;
  if (s.length === 1) return s[0] ?? null;
  const l = a(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => a(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Th = {
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
}, Rh = {
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
function kh(e) {
  return Sl(e, Th, !1);
}
function $h(e) {
  return Sl(e, Rh, !e.allowsSuccessfulResistance);
}
function Ke(e) {
  return e.kind === "waiting-resistance";
}
function Cl(e) {
  return e.kind === "resisted";
}
function Sl(e, t, n) {
  const a = { ...t, ...e.labels };
  return e.alreadyApplied ? ve("applied", !1, a.applied, a.appliedCompact, null) : e.unavailable ? ve("unavailable", !1, a.unavailable, a.unavailableCompact, a.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || sn(e.resistanceGateMode, e.resistanceState) ? ve(
    "waiting-resistance",
    !1,
    a.waitingResistance,
    a.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? ve("resisted", !1, a.resisted, a.resistedCompact, a.resisted) : ve("available", !0, a.available, a.availableCompact, null);
}
function ve(e, t, n, a, r) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: a,
    reason: r
  };
}
const ot = "data-paranormal-toolkit-prompt-id", wh = "data-paranormal-toolkit-resistance-roll-result", Eh = "Conjuração DT";
function Ch(e) {
  const t = e.querySelector(fn)?.getAttribute(wh), n = mt(t);
  if (n !== null) return n;
  const a = e.querySelector(ll)?.textContent ?? null, r = a ? /=\s*(-?\d+)\s*$/u.exec(a) : null;
  return mt(r?.[1] ?? null);
}
function Tr(e) {
  const t = Il(e), n = vh(t);
  if (n !== null) return n;
  const a = Lh(t);
  return a !== null ? a : Dh(e);
}
function Sh(e) {
  const t = Il(e);
  return t ? {
    actorId: Fn(t.actorId),
    itemId: Fn(t.itemId),
    itemName: Fn(t.itemName)
  } : null;
}
function Ih(e) {
  const t = e.getAttribute(ot);
  if (!t) return null;
  const n = Ll(e), a = vl(n), s = (Array.isArray(a?.prompts) ? a.prompts : []).find((l) => gn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function de(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function ha(e) {
  return de(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Lh(e) {
  const t = Nh(e);
  return t.length === 0 ? null : mt(Ph(t, Eh));
}
function vh(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const a = game.actors?.get?.(t);
  return !a || typeof a != "object" ? null : zo(a, ["system", "ritual", "DT"]) ?? zo(a, ["system", "ritual", "dt"]);
}
function Dh(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((a) => a.textContent).find((a) => typeof a == "string" && a.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return mt(n?.[1] ?? null);
}
function Il(e) {
  const t = xh(e);
  if (!t) return null;
  const n = Ll(e), a = vl(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => gn(o) ? o.pendingId === t : !1) ?? null;
}
function xh(e) {
  return (e.closest(`[${ot}]`) ?? e.querySelector(`[${ot}]`) ?? e.parentElement?.querySelector(`[${ot}]`) ?? null)?.getAttribute(ot) ?? null;
}
function Ll(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return Mh(r) ? r : null;
}
function vl(e) {
  const t = e?.getFlag?.(d, mn);
  return gn(t) ? t : null;
}
function Nh(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Ph(e, t) {
  const n = `${t}:`;
  for (const a of e) {
    if (!a.startsWith(n)) continue;
    const r = a.slice(n.length).trim();
    if (r.length > 0) return r;
  }
  return null;
}
function zo(e, t) {
  let n = e;
  for (const a of t) {
    if (!gn(n)) return null;
    n = n[a];
  }
  return typeof n == "number" ? Math.trunc(n) : mt(typeof n == "string" ? n : null);
}
function mt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Mh(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function gn(e) {
  return !!(e && typeof e == "object");
}
function Fn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function hn(e) {
  return Dl({
    hasResistance: !!e.querySelector(gr),
    difficulty: Tr(e),
    resistanceTotal: Ch(e)
  });
}
function Oh(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Dl({
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
function Dl(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Vd(e)
  };
}
function Se() {
  return game.user?.isGM === !0;
}
function we() {
  return Se();
}
function Fh(e) {
  const t = sn(e.resistanceGateMode, e.resistanceState), n = Bh(e.resistanceState, e.hasDamage), a = Uh(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), r = kh({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = $h({
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
    damageActionState: r,
    effectActionState: o,
    damageMode: n,
    effectMode: a,
    blocksPendingResistance: t
  };
}
function Bh(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Uh(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Rr(e) {
  const t = e.isGM ?? we();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Fh({
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
function zh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const a = document.createElement("strong");
  a.classList.add(`${i}__workflow-roll-total`), a.textContent = e.total === null ? "—" : String(e.total), t.append(n, a);
  const r = jh(e.formula, e.diceBreakdown ?? null);
  return r && t.append(r), t;
}
function qh(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function jh(e, t) {
  const n = Gh(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${i}__workflow-dice-tray`);
  for (const r of Vh(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), r.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function Gh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function Vh(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? qo(e, "highest") : n.includes("kl") ? qo(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function qo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
const Hh = "data-paranormal-toolkit-resistance-skill", Wh = "data-paranormal-toolkit-resistance-skill-label", Kh = "data-paranormal-toolkit-roll-card-target-names", Yh = "data-paranormal-toolkit-roll-card-resistance", Xh = "data-paranormal-toolkit-roll-card-resistance-skill", Qh = "data-paranormal-toolkit-roll-card-resistance-skill-label", xl = "pending", kr = "success", $r = "failure", Nl = "rolled";
function Zh(e) {
  const t = ab(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? tb(e.damageSection) : null, a = jo(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), r = Jh(e.rollCard).map((o, s) => {
    const l = eb(o, s), c = e.resistanceResults.get(l) ?? null, u = cb(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = Oh({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: pb(u)
    }).state, k = jo(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      $l(_)
    ) ?? a;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: g,
      effect: k,
      assistedActions: Rr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: _,
        damage: n,
        effect: k,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!g,
        effectCanApplyOnSuccessfulResistance: k?.applyOnResistance === "success" || k?.applyOnResistance === "always",
        effectRequiresResolvedResistance: k ? El(k) : !1
      })
    };
  });
  return r.length <= 1 || !n && !a && !t ? null : {
    rollCard: e.rollCard,
    targets: r,
    damage: n,
    effect: a,
    resistance: t
  };
}
function Jh(e) {
  const t = e.getAttribute(Kh), n = t ? fb(t) : [];
  if (n.length > 0) return n;
  const r = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = r.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && Pl(s) !== "nenhum alvo") : [];
}
function eb(e, t) {
  return `${Pl(e)}:${t}`;
}
function tb(e) {
  const t = ub(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: mb(e),
    formula: db(e) ?? "—",
    total: t,
    diceBreakdown: qh(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function jo(e, t, n, a) {
  const r = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, r ?? null, a);
  return o ? {
    label: r && r.length > 0 ? r : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: nb(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: ze(o)
  } : null;
}
function nb(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function ab(e, t) {
  const n = ob(t), a = rb(e), r = a.description ?? ib(n)?.textContent?.trim(), o = sb(n), s = a.skill ?? o?.getAttribute(Hh) ?? null, l = a.skillLabel ?? o?.getAttribute(Wh) ?? (s ? $e(s) : null);
  return !r && !s ? null : {
    description: r ?? "Resistência do alvo.",
    formula: lb(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: Tr(e)
  };
}
function rb(e) {
  return {
    description: Bn(e, Yh),
    skill: Bn(e, Xh),
    skillLabel: Bn(e, Qh)
  };
}
function ob(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function ib(e) {
  return wr(e, `.${i}__resistance-description`);
}
function sb(e) {
  return wr(e, fn);
}
function lb(e) {
  return wr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function wr(e, t) {
  for (const n of e) {
    const a = n.querySelector(t);
    if (a) return a;
  }
  return null;
}
function cb(e, t) {
  return e ? t === null ? Nl : e.total >= t ? kr : $r : xl;
}
function ub(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function db(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function mb(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function fb(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function Bn(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function Pl(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function pb(e) {
  return e === kr ? "succeeded" : e === $r ? "failed" : "pending";
}
function Ml(e) {
  if (!e) return null;
  const t = e.actorId ? bb(e.actorId) : null, n = t ? gb(t, e.itemId, e.itemName) : null;
  return n || hb(e.itemId, e.itemName);
}
function gb(e, t, n) {
  const a = e.items;
  if (t) {
    const o = a?.get?.(t);
    if (Me(o)) return o;
  }
  const r = Kt(n);
  if (r) {
    const o = a?.find?.((s) => Me(s) ? Kt(s.name) === r : !1);
    if (Me(o)) return o;
  }
  return null;
}
function hb(e, t) {
  const n = game.items;
  if (e) {
    const r = n?.get?.(e);
    if (Me(r)) return r;
  }
  const a = Kt(t);
  if (a) {
    const r = n?.find?.((o) => Me(o) ? Kt(o.name) === a : !1);
    if (Me(r)) return r;
  }
  return null;
}
function bb(e) {
  const n = game.actors?.get?.(e);
  return yb(n) ? n : null;
}
function yb(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Me(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Kt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Er(e) {
  const t = Un(e);
  if (!t) return null;
  const n = _b().filter((o) => Un(Ab(o)) === t).map((o) => Ol(o)).find(ct) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => ct(o) && Un(o.name) === t);
  return ct(r) ? r : null;
}
function _b() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Ab(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ol(e)?.name ?? null;
}
function Ol(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ct(t)) return t;
  const n = e.document?.actor;
  return ct(n) ? n : null;
}
function ct(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Un(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Fl(e) {
  const t = $b();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Tb(e)
  });
}
function Tb(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Ut(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", a = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", r = Rb(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Ut(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Ut(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${a}
        ${r}
        ${o}
      </ul>
    </div>
  `;
}
function Rb(e) {
  const t = kb(e.actor), n = e.newPV ?? t?.value ?? null, a = t?.max ?? null;
  if (n === null) return "";
  const r = a === null ? `${n}` : `${n}/${a}`;
  return `<li><strong>PV atual</strong>: ${Ut(r)}</li>`;
}
function kb(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, a = Go(n?.value);
  return a === null ? null : {
    value: a,
    max: Go(n?.max)
  };
}
function Go(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function $b() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Ut(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function wb(e) {
  await Fl(Eb(e));
}
function Eb(e) {
  if (Cb(e)) return e;
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
function Cb(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Bl(e) {
  return e.mode, `✓ ${Ul(e.inputAmount)} PV`;
}
function Sb(e) {
  const t = Ul(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ul(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Ib {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? we()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : sn(t.resistanceGateMode, t.resistanceState) ? {
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
class Lb {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? we()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : sn(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
  block(t, n, a) {
    return {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: n,
        message: a
      }
    };
  }
}
class vb {
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
const Db = `.${i}__actions`, Cr = `.${i}__actions-title`, qe = `.${i}__button`, xb = "data-paranormal-toolkit-action-section", Nb = `${i}__button--executed`, Pb = "data-paranormal-toolkit-executed-label";
function zl(e) {
  return de(e.querySelector(Cr)?.textContent);
}
function Mb(e, t) {
  const n = e.querySelector(Cr);
  n && (n.textContent = t);
}
function _t(e, t) {
  const n = de(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((a) => {
    const r = a.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return de(r) === n;
  }) ?? null;
}
function Sr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Ie(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function ql(e) {
  const t = Ob(e.difficulty);
  if (t === null) return null;
  const n = Vo(e.skillLabel) ?? "Resistência", a = Vo(e.description), r = Fb(a, n), o = Bb(r, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Ob(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Vo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Fb(e, t) {
  if (!e) return null;
  const n = Ho(e), a = Ho(t);
  if (!n.startsWith(a)) return e;
  const r = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return r.length > 0 ? r : null;
}
function Bb(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const a = Number(n[1]);
  if (!Number.isFinite(a) || a !== t) return e;
  const r = e.slice(n[0].length).trim();
  return r.length > 0 ? r : null;
}
function Ho(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const Lt = "data-paranormal-toolkit-prompt-id", jl = "multiTargetResistanceResults", Gl = "multiTargetDamageApplications", Vl = "multiTargetEffectApplications";
function Ub(e) {
  const t = /* @__PURE__ */ new Map(), a = bn(e)?.[jl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    Wb(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function zb(e, t) {
  await Ir(e, jl, t.targetId, t);
}
function qb(e) {
  const t = /* @__PURE__ */ new Map(), a = bn(e)?.[Gl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    Kb(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function jb(e, t) {
  await Ir(
    e,
    Gl,
    t.targetId,
    t
  );
}
function Gb(e) {
  const t = /* @__PURE__ */ new Map(), a = bn(e)?.[Vl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    Xb(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Vb(e, t) {
  await Ir(
    e,
    Vl,
    t.targetId,
    t
  );
}
function Hb(e) {
  const t = bn(e);
  return t ? {
    actorId: zn(t.actorId),
    itemId: zn(t.itemId),
    itemName: zn(t.itemName)
  } : null;
}
async function Ir(e, t, n, a) {
  const r = Hl(e);
  if (!r) return;
  const o = Wl(e), s = Kl(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!X(u) || u.pendingId !== r) return u;
    const m = X(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...m,
        [n]: a
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, mn, {
    ...s,
    prompts: c
  }));
}
function bn(e) {
  const t = Hl(e);
  if (!t) return null;
  const n = Wl(e), a = Kl(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => X(o) ? o.pendingId === t : !1) ?? null;
}
function Hl(e) {
  return (e.closest(`[${Lt}]`) ?? e.querySelector(`[${Lt}]`) ?? e.parentElement?.querySelector(`[${Lt}]`) ?? null)?.getAttribute(Lt) ?? null;
}
function Wl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return Qb(r) ? r : null;
}
function Kl(e) {
  const t = e?.getFlag?.(d, mn);
  return X(t) ? t : null;
}
function Wb(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Kb(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Yb(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Yb(e) {
  return e === "normal" || e === "half";
}
function Xb(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function zn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Qb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function X(e) {
  return !!(e && typeof e == "object");
}
const Zb = "data-paranormal-toolkit-resistance-skill", Jb = "data-paranormal-toolkit-resistance-skill-label", ba = "data-paranormal-toolkit-multi-target-section", Lr = "data-paranormal-toolkit-multi-target-damage-info", Yl = "data-paranormal-toolkit-multi-target-effect-info", Xl = "data-paranormal-toolkit-multi-target-toggle", Ql = "data-paranormal-toolkit-multi-target-details", V = "data-paranormal-toolkit-multi-target-target", ey = "data-paranormal-toolkit-multi-target-state", ya = "data-paranormal-toolkit-multi-target-roll-total", _a = "data-paranormal-toolkit-multi-target-roll-formula", zt = "data-paranormal-toolkit-multi-target-roll-dice", Aa = "data-paranormal-toolkit-multi-target-roll-skill", Ta = "data-paranormal-toolkit-multi-target-roll-skill-label", Ra = "data-paranormal-toolkit-multi-target-roll-target-name", ka = "data-paranormal-toolkit-multi-target-roll-rolled-at", $a = "data-paranormal-toolkit-multi-target-damage-mode", wa = "data-paranormal-toolkit-multi-target-damage-input-amount", Wo = "data-paranormal-toolkit-multi-target-damage-final-amount", Ko = "data-paranormal-toolkit-multi-target-damage-blocked", Ea = "data-paranormal-toolkit-multi-target-damage-target-name", Ca = "data-paranormal-toolkit-multi-target-damage-applied-at", Sa = "data-paranormal-toolkit-multi-target-effect-condition-id", Ia = "data-paranormal-toolkit-multi-target-effect-condition-label", La = "data-paranormal-toolkit-multi-target-effect-effect-id", va = "data-paranormal-toolkit-multi-target-effect-created", Da = "data-paranormal-toolkit-multi-target-effect-refreshed", xa = "data-paranormal-toolkit-multi-target-effect-target-name", Na = "data-paranormal-toolkit-multi-target-effect-applied-at", ty = new yl(kl()), ny = new pl(new fl()), ay = new gl(new _r()), ry = new vb(ay), oy = new Ib(ny), iy = new Lb(ty), sy = xl, Ye = kr, At = $r, ly = Nl;
function cy(e) {
  const t = Zl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), yy(e);
  const n = _y(e.rollCard, t), a = Ay(e.rollCard, t);
  !n && a && n_(e.rollCard, a, e.effectSection);
  const r = Ey(e.rollCard);
  return tc(r, t), Jy(
    e.rollCard,
    r,
    Ty(e.rollCard, {
      damageInfo: n,
      effectInfo: a,
      effectSection: e.effectSection
    })
  ), n && a && a_(e.rollCard, a, r), !0;
}
function Zl(e) {
  return Zh({
    ...e,
    resistanceResults: my(e.rollCard),
    damageApplications: fy(e.rollCard),
    effectApplications: py(e.rollCard),
    resolveTargetConditionApplication: uy,
    resistanceGateMode: Dr()
  });
}
function uy(e, t, n) {
  const a = Hb(e), r = Ml(a);
  if (!r) return null;
  const o = bt(r);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = dy(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function dy(e, t, n) {
  const a = Ah(
    e,
    n,
    t,
    qn
  );
  if (a) return a;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const r = qn(t);
  return r ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => qn(s) === r)) ?? null : null;
}
function my(e) {
  const t = Ub(e);
  for (const [n, a] of by(e))
    t.set(n, a);
  return t;
}
function fy(e) {
  const t = qb(e);
  for (const [n, a] of hy(e))
    t.set(n, a);
  return t;
}
function py(e) {
  const t = Gb(e);
  for (const [n, a] of gy(e))
    t.set(n, a);
  return t;
}
function gy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = n.getAttribute(Sa), o = n.getAttribute(Ia), s = n.getAttribute(La), l = Qo(n.getAttribute(va)), c = Qo(n.getAttribute(Da)), u = n.getAttribute(xa), m = n.getAttribute(Na);
    !a || !r || !o || l === null || c === null || !u || !m || t.set(a, {
      targetId: a,
      targetName: u,
      conditionId: r,
      conditionLabel: o,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: c,
      appliedAt: m
    });
  }
  return t;
}
function hy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = n.getAttribute($a), o = dc(n.getAttribute(wa)), s = n.getAttribute(Ea), l = n.getAttribute(Ca);
    !a || !i_(r) || o === null || !s || !l || t.set(a, {
      targetId: a,
      targetName: s,
      mode: r,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function by(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = dc(n.getAttribute(ya)), o = n.getAttribute(_a), s = n.getAttribute(Aa), l = n.getAttribute(Ta), c = n.getAttribute(Ra), u = n.getAttribute(ka);
    !a || r === null || !o || !s || !l || !c || !u || t.set(a, {
      targetId: a,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: r,
      diceBreakdown: n.getAttribute(zt),
      rolledAt: u
    });
  }
  return t;
}
function yy(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function _y(e, t) {
  if (!t.damage)
    return Jl(e)?.remove(), null;
  const n = Ry(e);
  return ky(n, t.damage), wy(e, n), n;
}
function Ay(e, t) {
  if (!t.effect)
    return uc(e)?.remove(), null;
  const n = e_(e);
  return t_(n, t.effect), n;
}
function Ty(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : _t(e, "Conjuração");
}
function Ry(e) {
  const t = Jl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Lr, "true"), n;
}
function Jl(e) {
  return e.querySelector(`[${Lr}="true"]`);
}
function ky(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const a = document.createElement("strong");
  if (a.textContent = "Dano", n.append(a), e.append(n), t.typeLabel) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-section-description`), r.textContent = t.typeLabel, e.append(r);
  }
  e.append(ec(t.formula, t.total, t.diceBreakdown));
}
function ec(e, t, n, a = !1) {
  const r = zh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return $y(r, a), r;
}
function $y(e, t) {
  const n = e.querySelector(pn), a = e.querySelector(br);
  if (!n || !a) return;
  e.classList.toggle(hr, t), n.hidden = !t, a.classList.add(yr), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-expanded", t ? "true" : "false"), a.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", a.setAttribute("aria-label", a.title);
  const r = a.querySelector("i") ?? document.createElement("i");
  r.classList.add("fa-solid"), r.classList.toggle("fa-chevron-down", !t), r.classList.toggle("fa-chevron-up", t), r.setAttribute("aria-hidden", "true"), r.parentElement || a.append(r);
}
function wy(e, t) {
  const n = _t(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Ey(e) {
  const t = e.querySelector(`[${ba}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(ba, "true"), n;
}
function tc(e, t) {
  const n = Cy(e), a = Iy(t.resistance), r = [Sy(t)];
  a && r.push(a), r.push(Dy(t, n)), e.replaceChildren(...r);
}
function Cy(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${V}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(V)).filter(o_)
  );
}
function Sy(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const a = document.createElement("span");
  return a.classList.add(`${i}__targets-status`), a.textContent = vy(e.targets), t.append(n, a), t;
}
function Iy(e) {
  const t = ql({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Ly(n, t), n;
}
function Ly(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${i}__resistance-label-skill`), n.textContent = t.skillLabel;
  const a = document.createElement("strong");
  a.classList.add(`${i}__resistance-label-difficulty`), a.textContent = t.difficultyLabel;
  const r = [n, document.createTextNode(" · "), a];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${i}__resistance-label-effect`), o.textContent = t.description, r.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...r);
}
function vy(e) {
  const t = e.length, n = e.filter((l) => l.state === At).length, a = e.filter((l) => l.state === Ye).length, r = e.filter((l) => l.state === sy).length, o = e.filter((l) => l.state === ly).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), a > 0 && s.push(`${a} ${a === 1 ? "sucesso" : "sucessos"}`), r > 0 && s.push(`${r} ${r === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Dy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const a of e.targets)
    n.append(xy(a, e, t.has(a.id)));
  return n;
}
function xy(e, t, n) {
  const a = document.createElement("article");
  a.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && a.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && a.classList.add(`${i}__target-row--effect-applied`), a.setAttribute(V, e.id), a.setAttribute(ey, e.state), a.setAttribute("aria-expanded", n ? "true" : "false"), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), nc(a, e.resistanceResult), ac(a, e.damageApplication), rc(a, e.effectApplication);
  const r = Ny(e, t, a), o = Yy(e, t);
  return o.hidden = !n, a.addEventListener("click", (s) => {
    Xo(s.target) || Yo(a);
  }), a.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Xo(s.target) || (s.preventDefault(), Yo(a));
  }), a.append(r, o), a;
}
function nc(e, t) {
  if (!t) {
    e.removeAttribute(ya), e.removeAttribute(_a), e.removeAttribute(zt), e.removeAttribute(Aa), e.removeAttribute(Ta), e.removeAttribute(Ra), e.removeAttribute(ka);
    return;
  }
  e.setAttribute(ya, String(t.total)), e.setAttribute(_a, t.formula), e.setAttribute(Aa, t.skill), e.setAttribute(Ta, t.skillLabel), e.setAttribute(Ra, t.targetName), e.setAttribute(ka, t.rolledAt), t.diceBreakdown ? e.setAttribute(zt, t.diceBreakdown) : e.removeAttribute(zt);
}
function ac(e, t) {
  if (!t) {
    e.removeAttribute($a), e.removeAttribute(wa), e.removeAttribute(Wo), e.removeAttribute(Ko), e.removeAttribute(Ea), e.removeAttribute(Ca);
    return;
  }
  e.setAttribute($a, t.mode), e.setAttribute(wa, String(t.inputAmount)), e.removeAttribute(Wo), e.removeAttribute(Ko), e.setAttribute(Ea, t.targetName), e.setAttribute(Ca, t.appliedAt);
}
function rc(e, t) {
  if (!t) {
    e.removeAttribute(Sa), e.removeAttribute(Ia), e.removeAttribute(La), e.removeAttribute(va), e.removeAttribute(Da), e.removeAttribute(xa), e.removeAttribute(Na);
    return;
  }
  e.setAttribute(Sa, t.conditionId), e.setAttribute(Ia, t.conditionLabel), e.setAttribute(La, t.effectId ?? ""), e.setAttribute(va, String(t.created)), e.setAttribute(Da, String(t.refreshed)), e.setAttribute(xa, t.targetName), e.setAttribute(Na, t.appliedAt);
}
function Ny(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary`);
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary-main`);
  const o = Py(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = My(e, t.resistance);
  Uy(l, n, e, t);
  const c = Ky(n);
  r.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), lc(u, [
    oc(e, t, "compact"),
    sc(e, t, "compact")
  ]), a.append(r, u), a;
}
function Py(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function My(e, t) {
  if (!Se())
    return Oy(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", By(e, t)), t?.skill && (n.setAttribute(Zb, t.skill), n.setAttribute(Jb, t.skillLabel ?? $e(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const o = document.createElement("i");
    o.classList.add("fa-solid", "fa-dice-d20"), o.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(o, s), n;
  }
  const a = document.createElement("span");
  a.classList.add(`${i}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === Ye ? "✓" : e.state === At ? "✕" : "", n.append(a, r), n;
}
function Oy(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Fy(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === Ye ? "✓" : e.state === At ? "✕" : "", n.append(a, r), n;
}
function Fy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const a = e.state === Ye ? "sucesso" : e.state === At ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}.`;
}
function By(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const a = e.state === Ye ? "sucesso" : e.state === At ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}. Rolar novamente`;
}
function Uy(e, t, n, a) {
  !(e instanceof HTMLButtonElement) || !Se() || e.addEventListener("click", (r) => {
    r.stopPropagation(), zy(t, e, n, a);
  });
}
async function zy(e, t, n, a) {
  if (!Se()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const r = a.resistance, o = r?.skill, s = r?.skillLabel ?? (o ? $e(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Er(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await ry.execute({ actor: l, skill: o, skillLabel: s });
    await r_(u.roll);
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: o,
      skillLabel: s,
      formula: u.formula,
      total: u.total,
      diceBreakdown: u.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    nc(e, m);
    try {
      await zb(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    vr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function vr(e) {
  const t = e.closest(`[${ba}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const a = Zl({
    rollCard: n,
    damageSection: qy(n) ?? _t(n, "Dano"),
    effectSection: jy(n)
  });
  a && tc(t, a);
}
function qy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Lr) !== "true") ?? null;
}
function jy(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Gy(e) {
  return Ke(e.assistedActions.policy.damageActionState);
}
function Vy(e) {
  return Ke(e.assistedActions.policy.effectActionState);
}
function Dr() {
  try {
    return lr();
  } catch {
    return "strict";
  }
}
function oc(e, t, n) {
  if (e.damageApplication)
    return ce(
      "✓",
      Bl({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const a = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Ke(a))
    return ce(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = ic(r, t.damage);
  if (o === null)
    return ce(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Sb({ inputAmount: o, mode: r, compact: n === "compact" }), l = r === "half" ? "🛡️" : "⚡", c = r === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = ce(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${V}]`);
    g && Hy(g, u, e, t);
  }), u;
}
function ic(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Hy(e, t, n, a) {
  if (n.damageApplication) return;
  if (Gy(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const r = a.damage;
  if (!r) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = ic(o, r);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Er(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await oy.execute({
      actor: l,
      amount: s,
      damageType: r.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Dr(),
      resistanceState: n.assistedActions.resistanceState
    });
    if (!u.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${u.error.message}`), t.innerHTML = c;
      return;
    }
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      mode: o,
      inputAmount: s,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ac(e, m);
    try {
      await jb(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await wb(u.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    vr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function sc(e, t, n) {
  const a = e.assistedActions.policy.effectActionState, r = e.effect ?? t.effect;
  if (e.effectApplication)
    return ce(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!r) return null;
  if (Ke(a))
    return ce(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Cl(a))
    return ce(
      "✓",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = ce(
    "✦",
    n === "full" ? `Aplicar ${r.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${r.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${V}]`);
    l && Wy(l, o, e, t);
  }), o;
}
async function Wy(e, t, n, a) {
  if (n.effectApplication) return;
  if (Vy(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.assistedActions.policy.effectMode === "resisted") {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const r = n.effect ?? a.effect;
  if (!r) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }
  const o = Er(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await iy.execute({
      actor: o,
      conditionId: r.conditionId,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source,
      resistanceGateMode: Dr(),
      resistanceState: n.assistedActions.resistanceState,
      allowSuccessfulResistance: r.applyOnResistance === "success" || r.applyOnResistance === "always",
      requiredResistanceOutcome: r.applyOnResistance === "success" ? "succeeded" : r.applyOnResistance === "failure" ? "failed" : null
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
    rc(e, c);
    try {
      await Vb(a.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), vr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function lc(e, t) {
  for (const n of t)
    n && e.append(n);
}
function ce(e, t, n, a) {
  const r = document.createElement("button");
  r.type = "button", r.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), r.disabled = a;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, r.append(o, s), r;
}
function Ky(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Xl, "true"), t.setAttribute("aria-hidden", "true"), cc(e, t), t;
}
function Yo(e) {
  const t = e.querySelector(`[${Ql}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const a = e.querySelector(`[${Xl}="true"]`);
  a && cc(e, a);
}
function cc(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Xo(e) {
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
function Yy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Ql, "true");
  const a = document.createElement("div");
  a.classList.add(`${i}__target-resistance-details`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", a.append(r, o);
  const s = Xy(e, t.resistance);
  s && a.append(s);
  const l = Qy(e, t.resistance), c = Zy(e, t);
  return n.append(a, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Xy(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const a = e.state === Ye ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${a}`, n;
}
function Qy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const a = e.resistanceResult?.formula ?? t?.formula ?? "—", r = e.resistanceResult?.total ?? null, o = ec(
    a,
    r,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Zy(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), lc(n, [
    oc(e, t, "full"),
    sc(e, t, "full")
  ]), n;
}
function Jy(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function e_(e) {
  const t = uc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Yl, "true"), n;
}
function uc(e) {
  return e.querySelector(`[${Yl}="true"]`);
}
function t_(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const a = document.createElement("strong");
  a.textContent = "Efeito", n.append(a);
  const r = document.createElement("div");
  r.classList.add(`${i}__effect-info-body`);
  const o = document.createElement("span");
  o.classList.add(`${i}__effect-info-label`), o.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", r.append(o, s), e.append(n, r);
}
function n_(e, t, n) {
  const a = n?.parentElement === e ? n : _t(e, "Conjuração");
  if (!a) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === a || e.insertBefore(t, a.nextElementSibling);
}
function a_(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function qn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function r_(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function o_(e) {
  return typeof e == "string" && e.length > 0;
}
function i_(e) {
  return e === "normal" || e === "half";
}
function Qo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function dc(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Zo = "data-paranormal-toolkit-card-layout-refresh-bound";
function s_(e) {
  const t = e.rollCard.querySelector(fn);
  t && t.getAttribute(Zo) !== "true" && (t.setAttribute(Zo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Oe = "data-paranormal-toolkit-prompt-id", l_ = "apply-damage", c_ = "data-paranormal-toolkit-multi-target-damage-info";
function u_(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(c_) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function d_(e) {
  const t = f_(e);
  return t.find((n) => n.getAttribute(xb) === l_) ?? t.find((n) => zl(n) === "aplicar danos") ?? null;
}
function m_(e) {
  const t = mc(e), n = Jo(t);
  return n || Jo(p_(e));
}
function Jo(e) {
  return e.find((t) => {
    const n = zl(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function f_(e) {
  const t = mc(e);
  return t.length > 0 ? t : xr(e);
}
function mc(e) {
  const t = b_(e);
  return t ? xr(e).filter((n) => h_(n, t)) : [];
}
function p_(e) {
  const t = fc(e);
  if (!t) return [];
  const n = g_(e, t);
  return xr(e).filter((a) => !a.closest(`.${i}__roll-card`)).filter((a) => pc(e, a)).filter((a) => !n || y_(a, n));
}
function xr(e) {
  const t = fc(e);
  return t ? Array.from(t.querySelectorAll(Db)) : [];
}
function fc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function g_(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && pc(e, n)) ?? null;
}
function h_(e, t) {
  return e.getAttribute(Oe) === t ? !0 : Array.from(e.querySelectorAll(`[${Oe}]`)).some((n) => n.getAttribute(Oe) === t);
}
function b_(e) {
  return e.getAttribute(Oe) ?? e.querySelector(`[${Oe}]`)?.getAttribute(Oe) ?? null;
}
function pc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function y_(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function __(e) {
  const t = gc(), n = hn(e.rollCard).state, a = Rr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), r = a.policy.effectActionState, o = Ke(r), s = Cl(r);
  return e.applied ? et({
    kind: "applied",
    visible: !0,
    enabled: !1,
    applied: !0,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
    resistanceState: n
  }) : a.policy.canShowApplyEffect ? et(o ? {
    kind: "waiting-resistance",
    visible: !0,
    enabled: !1,
    applied: !1,
    waitingForResistance: !0,
    resisted: !1,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
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
    actionState: r,
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
    actionState: r,
    resistanceState: n
  }) : et({
    kind: "hidden",
    visible: !1,
    enabled: !1,
    applied: !1,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
    resistanceState: n
  });
}
function et(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function A_(e) {
  const { rollCard: t } = e, n = k_(), a = gc(), r = hn(t).state, o = Rr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: a,
    resistanceState: r,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Ke(s), c = R_(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: P(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: P(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: T_(r)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: P("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: P("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      resistanceState: r,
      actionState: s,
      normalButton: P("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: P("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      resistanceState: r,
      actionState: s,
      normalButton: P("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: P("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  if (r.kind === "none")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: P("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: P("half", !0, !0, !1, !!e.halfButtonSkipped),
      summary: {
        state: "manual",
        message: "Sem DT confiável: escolha manualmente."
      }
    };
  if (r.kind === "pending")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: s,
      normalButton: P("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: P("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  const u = r.kind === "succeeded";
  return {
    mode: n,
    canShowApplyDamage: !0,
    waitingForResistance: l,
    resistanceState: r,
    actionState: s,
    normalButton: P("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: P("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${r.total} vs DT ${r.difficulty}.` : `Falhou: ${r.total} vs DT ${r.difficulty}.`
    }
  };
}
function T_(e) {
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
function P(e, t, n, a, r, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: a,
    skipped: r,
    waitingLabel: o
  };
}
function R_(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function k_() {
  try {
    return tm();
  } catch {
    return "assisted";
  }
}
function gc() {
  try {
    return lr();
  } catch {
    return "strict";
  }
}
const $_ = "data-paranormal-toolkit-damage-resolution-state", ei = "data-paranormal-toolkit-damage-icon-enhanced", Nr = "data-paranormal-toolkit-damage-original-label", w_ = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, hc = "Outra opção escolhida";
function E_(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Mb(t, "Aplicar dano"), C_(e, t);
}
function C_(e, t) {
  const n = Array.from(t.querySelectorAll(qe)), a = ni(n, "normal"), r = ni(n, "half");
  if (!a || !r) {
    S_(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  ai(a, "normal"), ai(r, "half");
  const o = A_({
    rollCard: e,
    normalButtonApplied: Yt(a),
    halfButtonApplied: Yt(r),
    normalButtonSkipped: Pa(a),
    halfButtonSkipped: Pa(r)
  });
  if (!o.canShowApplyDamage) {
    ri(a), ri(r), oi(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), ti(a, o.normalButton), ti(r, o.halfButton), oi(t, o.summary.state, o.summary.message);
}
function ti(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    L_(e, t.visible), v_(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function S_(e) {
  for (const t of e)
    Pa(t) && t.remove();
}
function Yt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(hc);
}
function Pa(e) {
  return e.textContent?.includes(hc) ?? !1;
}
function ni(e, t) {
  const n = w_[t];
  return e.find((a) => n.test(I_(a))) ?? null;
}
function I_(e) {
  return [
    e.getAttribute(Nr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function ai(e, t) {
  if (e.getAttribute(ei) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const a = document.createElement("i");
  a.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), a.setAttribute("aria-hidden", "true"), e.classList.add(
    `${i}__button--damage-resolution-action`,
    `${i}__button--damage-resolution-${t}`
  ), e.setAttribute(ei, "true"), e.setAttribute(Nr, n), e.setAttribute("aria-label", n), e.replaceChildren(a, Ie(n));
}
function ri(e) {
  Yt(e) || e.remove();
}
function L_(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function v_(e, t, n, a = "Role resistência") {
  if (!Yt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", a), e.replaceChildren(Ie(a));
      return;
    }
    e.removeAttribute("aria-disabled"), D_(e, n);
  }
}
function D_(e, t) {
  const n = e.getAttribute(Nr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(x_(t), Ie(n)));
}
function x_(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function oi(e, t, n) {
  e.setAttribute($_, t);
  const a = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    a?.remove();
    return;
  }
  const r = a ?? document.createElement("span");
  r.classList.add(`${i}__damage-resolution-summary`), r.textContent = n, a || e.querySelector(Cr)?.after(r);
}
const ft = "data-paranormal-toolkit-effect-icon-enhanced", je = "data-paranormal-toolkit-effect-action-compacted", yn = "data-paranormal-toolkit-effect-resistance-gate", Pr = "data-paranormal-toolkit-effect-section", Mr = "data-paranormal-toolkit-effect-label";
function N_(e) {
  return e.querySelector(`[${Pr}="true"]`);
}
function P_(e) {
  const t = O_(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? B_(), a = K_(n, e.sourceActions, t);
  return a && n.setAttribute(Mr, a), U_(n, t, a), H_(e.rollCard, n, e.after ?? e.fallbackAfter), W_(e.sourceActions, n), n;
}
function M_(e, t) {
  const n = t.querySelector(qe);
  if (!n) return;
  const a = n.textContent?.trim() ?? "", r = Ac(t, n, a), o = bc(e, n), s = __({
    rollCard: e,
    effectLabel: r,
    applied: Fr(n, a),
    effectCanApplyOnSuccessfulResistance: o ? ze(o) === "success" || ze(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? El(o) : !1
  });
  if (s.applied) {
    X_(n);
    return;
  }
  if (!s.visible) {
    Q_(n);
    return;
  }
  if (s.waitingForResistance) {
    Z_(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    J_(n, s.compactLabel);
    return;
  }
  eA(n), _c(n, s.displayLabel);
}
function O_(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(qe) ?? []), n = Array.from(e.existingSection?.querySelectorAll(qe) ?? []), a = [...t, ...n];
  return a.length === 0 ? null : F_(e.rollCard, a) ?? a[0] ?? null;
}
function F_(e, t) {
  const n = hn(e).state, a = $l(n), r = yc(e);
  if (r.length === 0) return null;
  for (const o of t) {
    const s = bc(e, o, r);
    if (s && wl(s, a)) return o;
  }
  return null;
}
function bc(e, t, n = yc(e)) {
  const a = Or(t, t.textContent?.trim() ?? ""), r = ha(a);
  return r ? n.find((o) => [o.label, o.conditionId].some((s) => ha(s) === r)) ?? null : null;
}
function yc(e) {
  const t = Ml(Sh(e));
  if (!t) return [];
  const n = bt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((a) => a.actor === "target") : [];
}
function B_() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Pr, "true"), e;
}
function U_(e, t, n) {
  e.setAttribute(Pr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const a = z_(e), r = q_(a);
  r.textContent = "Efeito";
  const o = j_(e, a), s = G_(o);
  s.textContent = tA(n ?? Ac(e, t, t.textContent?.trim() ?? ""));
  const l = V_(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(qe)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Fr(t, c) && !Y_(t, c) && _c(t, n ?? c);
}
function z_(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function q_(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function j_(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(`${i}__effect-section-body`), t.after(a), a;
}
function G_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function V_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function H_(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function W_(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(qe)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function K_(e, t, n) {
  const a = e.getAttribute(Mr);
  if (a && a.trim().length > 0) return a.trim();
  const r = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return r || Or(n, n.textContent?.trim() ?? "");
}
function Or(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && de(n) !== "efeito aplicado") return n;
  const a = Ih(e);
  if (a) return a;
  const r = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return r.length > 0 && de(r) !== "aplicado" ? r : null;
}
function Fr(e, t) {
  return e.classList.contains(Nb) || de(t).includes("aplicado");
}
function Y_(e, t) {
  const n = e.getAttribute(yn);
  if (n === "pending" || n === "resisted") return !0;
  const a = ha(t);
  return a.includes("resistiu") || a.includes("role resistencia");
}
function _c(e, t) {
  e.getAttribute(je) === "true" && e.getAttribute(ft) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(je, "true"), e.setAttribute(ft, "true"), e.setAttribute(Pb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Sr("✦", `${i}__button-icon--effect`),
    Ie("Aplicar")
  ));
}
function X_(e) {
  e.getAttribute(je) === "true" && de(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(je, "true"), e.setAttribute(ft, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Sr("✓", `${i}__button-icon--effect-applied`),
    Ie("Aplicado")
  ));
}
function Ac(e, t, n) {
  const a = e.getAttribute(Mr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return a && a.trim().length > 0 ? a.trim() : Or(t, n) ?? n;
}
function Q_(e) {
  Fr(e, e.textContent?.trim() ?? "") || e.remove();
}
function Z_(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(je), e.removeAttribute(ft), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(yn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Ie(t));
}
function J_(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(je), e.removeAttribute(ft), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(yn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Sr("✓", `${i}__button-icon--effect-resisted`),
    Ie(t)
  );
}
function eA(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(yn), e.removeAttribute("aria-disabled");
}
function tA(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const nA = "data-paranormal-toolkit-card-layout-normalized";
function aA(e) {
  const t = rA(e.rollCard), n = oA(t);
  return s_({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function rA(e) {
  return {
    rollCard: e,
    damageSection: u_(e),
    resistance: e.querySelector(gr),
    damageActions: d_(e),
    effectActionSource: m_(e),
    effectSection: N_(e)
  };
}
function oA(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: a,
    damageActions: r,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(nA, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = _t(t, "Conjuração"), c = iA({
    rollCard: t,
    damageSection: n,
    resistance: a,
    fallbackAfter: l
  });
  n && r && (r.parentElement !== n && n.append(r), E_(t, r));
  const u = P_({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: sA(n, c),
    fallbackAfter: l
  });
  return u && M_(t, u), u;
}
function iA(e) {
  const { rollCard: t, damageSection: n, resistance: a, fallbackAfter: r } = e;
  return a ? n ? (a.parentElement !== n && n.append(a), n) : r ? (a.parentElement === t && a.previousElementSibling === r || t.insertBefore(a, r.nextElementSibling), a) : ((a.parentElement !== t || a.previousElementSibling !== null) && t.prepend(a), a) : null;
}
function sA(e, t) {
  return e ?? t;
}
const Tc = [0, 80, 180, 400, 900, 1600, 3e3], ii = /* @__PURE__ */ new WeakSet();
function lA(e) {
  Rc(e), cA(e);
}
function Rc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    kc(t);
}
function cA(e) {
  if (!ii.has(e)) {
    ii.add(e);
    for (const t of Tc)
      globalThis.setTimeout(() => {
        Rc(e);
      }, t);
  }
}
function kc(e) {
  const t = aA({
    rollCard: e,
    refreshDelaysMs: Tc,
    onRefresh: () => kc(e)
  });
  cy({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const uA = "data-paranormal-toolkit-resistance-roll-result-enhanced", si = "data-paranormal-toolkit-resistance-original-description", dA = "data-paranormal-toolkit-resistance-skill", mA = "data-paranormal-toolkit-resistance-skill-label", fA = `${i}__resistance--without-roll-button`, pA = ["Fortitude", "Reflexos", "Vontade"];
function gA(e) {
  for (const t of Array.from(e.querySelectorAll(gr)))
    hA(t);
  lA(e);
}
function hA(e) {
  const t = e.querySelector(gp), n = e.querySelector(sl), a = e.querySelector(fn), r = TA(a) ? a : null, o = e.querySelector(ll);
  if (!t && !n && !o && !a) return;
  e.classList.toggle(fA, !r);
  const s = AA(e, a);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!a || !a.contains(o)) && e.append(o), $A(o)), bA(e, a, n), r && (IA(r), r.parentElement !== e && e.append(r));
}
function bA(e, t, n) {
  if (!n) return;
  const a = e.closest(`.${i}__roll-card`);
  if (!a) return;
  const r = _A(n), o = ql({
    description: r,
    skillLabel: RA(t, r),
    difficulty: Tr(a)
  });
  if (!o) {
    n.textContent = r, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  yA(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function yA(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${i}__resistance-label-skill`), n.textContent = t.skillLabel;
  const a = document.createElement("strong");
  a.classList.add(`${i}__resistance-label-difficulty`), a.textContent = t.difficultyLabel;
  const r = [n, document.createTextNode(" · "), a];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${i}__resistance-label-effect`), o.textContent = t.description, r.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...r);
}
function _A(e) {
  const t = e.getAttribute(si);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(si, n), n;
}
function AA(e, t) {
  const n = e.querySelector(`.${Io}`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(Io), e.insertBefore(a, t?.parentElement === e ? t : e.firstChild), a;
}
function TA(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function RA(e, t) {
  const n = e?.getAttribute(mA) ?? e?.getAttribute(dA) ?? null;
  return n || kA(t);
}
function kA(e) {
  const t = li(e);
  return pA.find((n) => t.startsWith(li(n))) ?? null;
}
function li(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function $A(e) {
  const t = wA(e.textContent ?? "");
  t && (e.setAttribute(uA, "true"), e.replaceChildren(SA(t)));
}
function wA(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, a, r] = t, o = n?.trim() ?? "Resistência", s = Number(r);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = EA(a ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function EA(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: CA(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function CA(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function SA(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const a = LA(e);
  return a && t.append(a), t;
}
function IA(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = hn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const a = n.kind === "succeeded" ? "succeeded" : "failed", r = a === "succeeded" ? "✓" : "✕", o = a === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${a}`), e.textContent = `${n.total} ${r}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function LA(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of vA(e.diceValues, e.formula)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), n.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(n.value), t.append(a);
  }
  return t;
}
function vA(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ci(e, "highest") : n.includes("kl") ? ci(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function ci(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function DA(e) {
  for (const t of Array.from(e.querySelectorAll(mp))) {
    const n = BA(t);
    xA(t), n && (NA(t, n), PA(t, n));
  }
}
function xA(e) {
  for (const t of Array.from(e.querySelectorAll(fp)))
    t.remove();
}
function NA(e, t) {
  const a = e.closest(`.${i}`)?.querySelector(il) ?? null, r = a?.querySelector(dp) ?? null, o = a ?? e, s = o.querySelector(yp);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = nT(t.elementTone), l.textContent = tT(t), !s) {
    if (r?.parentElement === o) {
      r.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function PA(e, t) {
  const n = MA(e);
  OA(e, n);
  const a = FA(t);
  if (a.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${i}__ritual-metadata`);
  for (const s of a) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, r.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", r);
      return;
    }
    n.append(r);
    return;
  }
  const o = e.querySelector(cl);
  if (o) {
    e.insertBefore(r, o);
    return;
  }
  e.prepend(r);
}
function MA(e) {
  return e.closest(`.${i}`)?.querySelector(il) ?? null;
}
function OA(e, t) {
  const n = [e, t].filter((a) => a !== null);
  for (const a of n)
    for (const r of Array.from(a.querySelectorAll(_p)))
      r.remove();
}
function FA(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${da(e.target)}` : null,
    e.duration ? `Duração: ${da(e.duration)}` : null,
    e.resistance ? `Resistência: ${Qs(e.resistance)}` : null
  ].filter(cn);
}
function BA(e) {
  const t = UA(e), n = HA(e), r = (t ? VA(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Br(K(r, "element")), l = ne("op.elementChoices", s) ?? di(_e(o, "Elemento")) ?? di(n.damageType), c = s ?? aT(l), u = K(r, "circle") ?? _e(o, "Círculo"), m = YA(r) ?? _e(o, "Alvo"), g = JA(r, "duration", "op.durationChoices") ?? _e(o, "Duração"), _ = WA(e) ?? QA(r) ?? _e(o, "Resistência"), k = KA(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: _
  };
  return eT(R) ? R : null;
}
function UA(e) {
  const t = zA(e);
  if (!t) return null;
  const n = t.getFlag?.(d, mn), a = jA(n);
  if (a.length === 0) return null;
  const r = qA(e);
  if (r.size > 0) {
    const o = a.find((s) => s.pendingId && r.has(s.pendingId));
    if (o) return o;
  }
  return a.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function zA(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? ur()?.messages?.get?.(n) ?? null : null;
}
function qA(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const a of Array.from(t.querySelectorAll(`[${So}]`))) {
    const r = a.getAttribute(So)?.trim();
    r && n.add(r);
  }
  return n;
}
function jA(e) {
  if (!ln(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(GA).filter((n) => n !== null) : [];
}
function GA(e) {
  return ln(e) ? {
    pendingId: Ot(e.pendingId),
    actorId: Ot(e.actorId),
    itemId: Ot(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(zm) : []
  } : null;
}
function VA(e) {
  if (!e.itemId) return null;
  const t = ur(), a = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return a || (t?.items?.get?.(e.itemId) ?? null);
}
function HA(e) {
  let t = null, n = null;
  for (const a of Array.from(e.querySelectorAll(pp))) {
    const r = We(a.textContent);
    if (!r) continue;
    const o = Um(r, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(r) && (t = r);
  }
  return { cost: t, damageType: n };
}
function WA(e) {
  const t = We(e.querySelector(sl)?.textContent);
  return t ? Qs(t) : null;
}
function _e(e, t) {
  const n = dt(t);
  for (const a of e) {
    const r = a.indexOf(":");
    if (!(r < 0 || dt(a.slice(0, r)) !== n))
      return We(a.slice(r + 1));
  }
  return null;
}
function KA(e) {
  const t = _e(e, "Custo") ?? _e(e, "PE");
  return t || (e.map(We).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function YA(e) {
  const t = K(e, "target");
  if (!t) return null;
  if (t === "area")
    return XA(e) ?? ne("op.targetChoices", t) ?? "Área";
  const n = ne("op.targetChoices", t) ?? ue(t);
  return [t === "people" || t === "creatures" ? K(e, "targetQtd") : null, n].filter(cn).join(" ");
}
function XA(e) {
  const t = K(e, "area.name"), n = K(e, "area.size"), a = K(e, "area.type"), r = t ? ne("op.areaChoices", t) ?? ue(t) : null, o = a ? ne("op.areaTypeChoices", a) ?? ue(a) : null;
  return r ? n ? o ? `${r} ${n}m ${da(o)}` : `${r} ${n}m` : r : null;
}
function QA(e) {
  const t = K(e, "skillResis"), n = K(e, "resistance");
  if (!t || !n) return null;
  const a = ne("op.skill", t) ?? ue(t), r = ZA(n);
  return [a, r].filter(cn).join(" ");
}
function ZA(e) {
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
      return ne("op.resistanceChoices", e) ?? ue(e);
  }
}
function JA(e, t, n) {
  const a = K(e, t);
  return a ? ne(n, a) ?? ue(a) : null;
}
function eT(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function tT(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function nT(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(cn).join(" ");
}
function Br(e) {
  const t = dt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function di(e) {
  const t = Br(e);
  return t ? ne("op.elementChoices", t) ?? ue(t) : e ? ue(e) : null;
}
function aT(e) {
  return Br(e);
}
function ne(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, a = ur()?.i18n?.localize?.(n);
  return !a || a === n ? null : a;
}
const mi = "data-paranormal-toolkit-dice-toggle-enhanced";
function rT(e) {
  for (const t of Array.from(e.querySelectorAll(ul)))
    $c(t);
}
function oT(e) {
  const t = Ec(e.target);
  if (!t) return;
  const n = Ur(t);
  n && (e.preventDefault(), wc(n, t));
}
function iT(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ec(e.target);
  if (!t) return;
  const n = Ur(t);
  n && (e.preventDefault(), wc(n, t));
}
function $c(e) {
  const t = e.querySelector(pn);
  if (!t) return;
  const n = e.querySelector(br);
  if (n && n.getAttribute(mi) !== "true" && (n.setAttribute(mi, "true"), n.classList.add(yr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-chevron-down"), a.setAttribute("aria-hidden", "true"), n.append(a);
  }
}
function wc(e, t) {
  const n = e.querySelector(pn);
  if (!n) return;
  const a = !e.classList.contains(hr);
  sT(e, t, n, a);
}
function sT(e, t, n, a) {
  e.classList.toggle(hr, a), n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.title = a ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const r = t.querySelector("i");
  r && (r.classList.toggle("fa-chevron-down", !a), r.classList.toggle("fa-chevron-up", a));
}
function Ec(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(br);
  if (!t) return null;
  const n = Ur(t);
  return n ? ($c(n), t.classList.contains(yr) ? t : null) : null;
}
function Ur(e) {
  const t = e.closest(ul);
  return t && t.querySelector(pn) ? t : null;
}
const fi = `${d}-workflow-dice-toggle-styles`;
function lT() {
  if (document.getElementById(fi)) return;
  const e = document.createElement("style");
  e.id = fi, e.textContent = `
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
const cT = [0, 100, 500, 1500, 3e3];
let pi = !1, jn = null;
function uT() {
  if (!pi) {
    pi = !0, lT(), Hooks.on("renderChatMessageHTML", (e, t) => {
      it(Gt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      it(Gt(t));
    }), Hooks.once("ready", () => {
      it(document), dT();
    }), document.addEventListener("click", oT), document.addEventListener("keydown", iT);
    for (const e of cT)
      globalThis.setTimeout(() => it(document), e);
  }
}
function dT() {
  jn || !document.body || (jn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && it(n);
  }), jn.observe(document.body, { childList: !0, subtree: !0 }));
}
function it(e) {
  e && (Op(e), DA(e), gA(e), rT(e), Ip(e));
}
function mT() {
  uT();
}
const fT = "data-paranormal-toolkit-action-section", pT = "ritual-log", gT = ".paranormal-toolkit-item-use-prompt__actions", hT = ".paranormal-toolkit-item-use-prompt__actions-title", bT = [0, 100, 500, 1500];
let gi = !1;
function yT() {
  if (gi) return;
  const e = (t, n) => {
    hi(RT(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), hi(document), gi = !0;
}
function hi(e) {
  for (const t of bT)
    globalThis.setTimeout(() => _T(e), t);
}
function _T(e) {
  AT(e), TT(e);
}
function AT(e) {
  for (const t of e.querySelectorAll(
    `[${fT}="${pT}"]`
  ))
    t.remove();
}
function TT(e) {
  for (const t of e.querySelectorAll(gT)) {
    if (bi(t.querySelector(hT)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => bi(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function RT(e) {
  if (e instanceof HTMLElement || kT(e))
    return e;
  if ($T(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function kT(e) {
  return e instanceof HTMLElement;
}
function $T(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function bi(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const st = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Cc = {
  PV: "system.attributes.hp"
}, Ma = {
  PV: [st.PV, Cc.PV],
  SAN: [st.SAN],
  PE: [st.PE],
  PD: [st.PD]
}, Oa = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class wT {
  getResource(t, n) {
    const a = yi(t, n);
    if (!a.ok)
      return p(a.error);
    const r = a.value, o = `${r}.value`, s = `${r}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = Ai(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = Ai(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, a) {
    const r = yi(t, n);
    if (!r.ok)
      throw new Error(r.error.message);
    await t.update({ [`${r.value}.value`]: a });
  }
}
function yi(e, t) {
  const n = ET(e.type, t);
  if (n && _i(e, n))
    return y(n);
  const a = Ma[t].find(
    (r) => _i(e, r)
  );
  return a ? y(a) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: CT(e, t),
    path: Ma[t].join(" | ")
  });
}
function ET(e, t) {
  return e === "threat" ? Cc[t] ?? null : e === "agent" ? st[t] : null;
}
function _i(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof a == "number" && Number.isFinite(a);
}
function CT(e, t) {
  const n = e.type ?? "unknown", a = Ma[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${a}.`;
}
function Ai(e, t, n, a, r) {
  return a == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${r} de ${t} não encontrado: ${n}.`,
    path: n,
    value: a
  } : typeof a != "number" || !Number.isFinite(a) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${r} de ${t} em ${n}.`,
    path: n,
    value: a
  } : null;
}
class ST {
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
      const s = Oa.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: r } = n, o = IT(r);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: r
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Oa.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, n);
      if (a != null)
        return { path: n, value: a };
    }
    return null;
  }
}
function IT(e) {
  if (Ti(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Ti(n))
      return n;
  }
  return null;
}
function Ti(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const LT = "dice-so-nice";
async function Sc(e) {
  if (!vT() || !DT()) return;
  const t = xT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function vT() {
  try {
    return up().enabled;
  } catch {
    return !1;
  }
}
function DT() {
  return game.modules?.get?.(LT)?.active === !0;
}
function xT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Ri = "occultism";
class Ic {
  getDifficulty(t) {
    return NT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const a = await MT(t, Ri);
    if (!a)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Sc(a);
    const r = BT(a);
    return {
      skill: Ri,
      skillLabel: "Ocultismo",
      roll: a,
      formula: FT(a),
      total: r,
      difficulty: n,
      success: r >= n,
      diceBreakdown: UT(a)
    };
  }
}
function NT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function PT(e) {
  return new Ic().rollCastingCheck(e);
}
async function MT(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const a = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return OT(a);
}
function OT(e) {
  return ki(e) ? e : Array.isArray(e) ? e.find(ki) ?? null : null;
}
function ki(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function FT(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function BT(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function UT(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(zT);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function zT(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const qT = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class jT {
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
    const a = n.value, r = GT(t.ritual, a);
    return r.ok ? r.value ? y(r.value) : y({
      resource: "PE",
      amount: qT[a],
      source: "default-by-circle",
      circle: a
    }) : p(r.error);
  }
}
function GT(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : VT(n) ? {
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
function VT(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class HT {
  async applyPresetItemPatch(t, n) {
    const a = n.itemPatch;
    if (!a) return Gn("missing-item-patch");
    if (t.type !== "ritual") return Gn("unsupported-item-type");
    const r = WT(a);
    return Object.keys(r).length === 0 ? Gn("empty-update") : (await t.update(r), {
      applied: !0,
      updateData: r
    });
  }
}
function WT(e) {
  const t = {};
  O(t, "name", e.name), O(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (O(t, "system.circle", n.circle), O(t, "system.element", n.element), O(t, "system.target", n.target), O(t, "system.targetQtd", n.targetQuantity), O(t, "system.execution", n.execution), O(t, "system.range", n.range), O(t, "system.duration", n.duration), O(t, "system.skillResis", n.resistanceSkill), O(t, "system.resistance", n.resistance), O(t, "system.studentForm", n.studentForm), O(t, "system.trueForm", n.trueForm)), t;
}
function O(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Gn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class KT {
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
    return this.getNumber(t, Oa.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, a = [];
    for (const r of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, r);
      o.ok ? n[r] = o.value : a.push(o.error);
    }
    return { values: n, errors: a };
  }
  getNumber(t, n, a) {
    const r = foundry.utils.getProperty(t, n);
    return typeof r == "number" && Number.isFinite(r) ? r : a;
  }
}
class YT {
  async applyPreset(t, n, a = {}) {
    const r = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: n.id,
        presetVersion: n.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: a.definition ?? n.automation
    };
    return await this.writeAutomationFlag(t, r), r;
  }
  async applyManualDefinition(t, n, a = n.label) {
    const r = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: a,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, r), r;
  }
  async clear(t) {
    await t.unsetFlag(d, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(d, "automation", n);
  }
}
class XT {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = QT(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Vn(t)), y(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const a of t) {
      const r = this.register(a);
      if (!r.ok)
        return r;
      n.push(r.value);
    }
    return y(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? Vn(n) : null;
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
    return Array.from(this.presets.values()).map(Vn);
  }
  findForItem(t) {
    return this.list().map((n) => ZT(n, t)).filter((n) => n !== null).sort((n, a) => a.score - n.score || n.preset.id.localeCompare(a.preset.id));
  }
}
function QT(e) {
  return !Hn(e.id) || !Hn(e.version) || !Hn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function ZT(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, n.push(`itemType:${t.type}`);
  }
  for (const r of e.matchers) {
    const o = JT(r, t);
    if (!o.matches)
      return null;
    a += o.score, n.push(o.reason);
  }
  return {
    preset: e,
    score: a,
    reasons: n
  };
}
function JT(e, t) {
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
      const n = $i(t.name), a = e.names.map($i).includes(n);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = eR(t), a = n !== null && e.circles.includes(n);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function $i(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function eR(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Vn(e) {
  return structuredClone(e);
}
function Hn(e) {
  return typeof e == "string" && e.length > 0;
}
function Xt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = _n(e.amountFrom);
    if (!n)
      return p({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const a = t.rolls[n];
    if (!a)
      return p({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const r = Math.trunc(a.total);
    return !Number.isInteger(r) || r <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : y(r);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function _n(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function tR(e, t, n) {
  if (!wi(e.id) || !wi(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const a = new Roll(e.formula), r = await Promise.resolve(a.evaluate()), o = r.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await Sc(r);
    const l = {
      ...n.rollRequests[e.id] ?? Lc(e, t),
      total: o,
      roll: r
    };
    return n.rolls[e.id] = l, y(l);
  } catch (a) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: a
    });
  }
}
function Lc(e, t) {
  const n = e.intent ?? nR(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function nR(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function wi(e) {
  return typeof e == "string" && e.length > 0;
}
async function Qt(e, t, n, a, r) {
  switch (a) {
    case "spend":
      return n !== "PE" && n !== "PD" ? vt(t, n, a, r) : e.spend(t, n, r);
    case "damage":
      return n !== "PV" && n !== "SAN" ? vt(t, n, a, r) : e.damage(t, n, r);
    case "heal":
      return n !== "PV" ? vt(t, n, a, r) : e.heal(t, n, r);
    case "recover":
      return n !== "SAN" ? vt(t, n, a, r) : e.recover(t, n, r);
  }
}
function vt(e, t, n, a) {
  return p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: n,
    reason: "invalid-resource-operation",
    message: `Operação ${n} não é válida para ${t}.`,
    requestedAmount: a
  });
}
function aR(e) {
  const { step: t, context: n, transaction: a, stepIndex: r, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = rR(t, n, a, r);
    n.damageInstances.push(s), o.emit("afterDamageResolution", n, {
      stepIndex: r,
      step: t,
      damage: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", n, {
      stepIndex: r,
      step: t,
      damage: s,
      resourceTransaction: a,
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
    const s = oR(t, n, a, r);
    n.healingInstances.push(s), o.emit("afterApplyHealing", n, {
      stepIndex: r,
      step: t,
      healing: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function rR(e, t, n, a) {
  const r = _n(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    id: vc(t.id, "damage", a, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: r ?? void 0,
    damageType: o?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function oR(e, t, n, a) {
  const r = _n(e.amountFrom);
  return {
    id: vc(t.id, "healing", a, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: r ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function vc(e, t, n, a) {
  return `${e}.${t}.${n}.${a}`;
}
function iR(e, t, n) {
  const a = _n(e.amountFrom), r = a ? t.rolls[a] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: a,
    rollIntent: r?.intent,
    damageType: r?.damageType
  };
}
function sR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: a, step: t, metadata: r }), Dc("before", e), Ei("before", e), Ei("resolve", e);
}
function lR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: a, step: t, metadata: r }), Dc("apply", e);
}
function cR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: a, step: t, metadata: r });
}
function Dc(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t, l = uR(e, n.operation);
  l && s.emit(l, a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function Ei(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function uR(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function dR(e, t, n) {
  return y(void 0);
}
async function mR(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return fR(e, t);
    case "spendRitualCost":
      return pR(e, t);
  }
}
async function fR(e, t) {
  const { context: n, resources: a } = e, r = Xt(t, n);
  return r.ok ? xc(await a.spend(n.sourceActor, t.resource, r.value), n) : p(r.error);
}
async function pR(e, t) {
  const { context: n, resources: a, ritualCosts: r } = e, o = r.getCost({
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
  }), xc(await a.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function xc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function gR(e) {
  const { step: t, context: n, stepIndex: a, lifecycle: r, execute: o } = e, s = hR(t);
  for (const c of s.before)
    r.emit(c, n, { stepIndex: a, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    r.emit(c, n, { stepIndex: a, step: t });
  return l;
}
function hR(e) {
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
class bR {
  constructor(t, n, a, r) {
    this.resources = t, this.ritualCosts = n, this.messages = a, this.lifecycle = r;
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
    for (const [a, r] of t.steps.entries()) {
      const o = await this.runStep(r, n, a);
      if (!o.ok)
        return o;
    }
    return y({ definition: t, context: n });
  }
  async runStep(t, n, a) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, a);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, a);
      default:
        return gR({
          step: t,
          context: n,
          stepIndex: a,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, n, a)
        });
    }
  }
  async executeStep(t, n, a) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, n, a);
      case "rollFormula":
        return this.runRollFormulaStep(t, n, a);
      case "modifyResource":
        return this.runModifyResourceStep(t, n, a);
      case "chatCard":
        return this.runChatCardStep(t, n, a);
      default:
        return p({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: a,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, a) {
    const r = await mR({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, a) {
    const r = Lc(t, a);
    n.rollRequests[r.id] = r, this.lifecycle.emit("beforeRoll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("before", r, n, a, t), this.lifecycle.emit("roll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("roll", r, n, a, t);
    const o = await this.runRollFormulaStep(t, n, a);
    if (!o.ok)
      return o;
    const s = n.rolls[r.id];
    return this.emitSpecificRollPhase("after", r, n, a, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: a, step: t, rollRequest: r, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, a) {
    const r = await tR(t, a, n);
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, a) {
    const r = Xt(t, n);
    if (!r.ok)
      return p({ ...r.error, stepIndex: a, step: t, context: n });
    const o = iR(t, n, r.value);
    sR({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), lR({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, n);
    if (s.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: n
      });
    for (const l of s) {
      const c = await Qt(this.resources, l, t.resource, t.operation, r.value), u = this.handleResourceOperationResult(c, n, a, t);
      if (!u.ok)
        return u;
      aR({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return cR({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, a) {
    const r = Xt(t, n);
    if (!r.ok)
      return p({ ...r.error, stepIndex: a, step: t, context: n });
    const o = this.resolveActors(t.actor, n);
    if (o.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: n
      });
    for (const s of o) {
      const l = await Qt(this.resources, s, t.resource, t.operation, r.value), c = this.handleResourceOperationResult(l, n, a, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, a) {
    const r = await dR(this.messages);
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  handleResourceOperationResult(t, n, a, r) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: a,
      step: r,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, a, r, o, s) {
    const l = yR(t, n.intent);
    l && this.lifecycle.emit(l, a, {
      stepIndex: r,
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
        return n.targets.flatMap((a) => a.actor ? [a.actor] : []);
    }
  }
}
function yR(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class _R {
  emitCastStarted(t) {
    Hooks.callAll(Mt.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Mt.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Mt.ritual.castFinished, t);
  }
}
class AR {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, n, a) {
    return this.execute(t, n, "spend", a);
  }
  async damage(t, n, a) {
    return this.execute(t, n, "damage", a);
  }
  async heal(t, n, a) {
    return this.execute(t, n, "heal", a);
  }
  async recover(t, n, a) {
    return this.execute(t, n, "recover", a);
  }
  async execute(t, n, a, r) {
    if (!Number.isInteger(r) || r <= 0)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: r
      });
    const o = this.adapter.getResource(t, n);
    if (!o.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: r,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, l = this.calculate(a, s, r);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: r,
        current: s.value,
        required: r
      });
    const { afterValue: c, appliedAmount: u } = l.value, m = {
      value: c,
      max: s.max
    };
    try {
      c !== s.value && await this.adapter.updateResourceValue(t, n, c);
    } catch (g) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: r,
        current: s.value,
        required: r,
        cause: g
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: a,
      requestedAmount: r,
      appliedAmount: u,
      before: s,
      after: m
    });
  }
  calculate(t, n, a) {
    switch (t) {
      case "spend":
        return n.value < a ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${a}.`
        }) : y({
          afterValue: n.value - a,
          appliedAmount: a
        });
      case "damage": {
        const r = Math.max(0, n.value - a);
        return y({
          afterValue: r,
          appliedAmount: n.value - r
        });
      }
      case "heal":
      case "recover": {
        const r = Math.min(n.max, n.value + a);
        return y({
          afterValue: r,
          appliedAmount: r - n.value
        });
      }
    }
  }
}
class TR {
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
function Nc(e) {
  return {
    id: RR(),
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
function RR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class kR {
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
    return xe(this.lastContext);
  }
  async runAutomation(t, n) {
    const a = Nc(n);
    this.lastContext = a, this.hooks.emit("created", a, {
      metadata: {
        definitionLabel: t.label,
        itemId: a.item.id ?? null,
        itemName: a.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", a), this.hooks.emit("resolveTargets", a, {
      metadata: {
        targetCount: a.targets.length
      }
    });
    const r = await this.automation.run(t, a);
    return r.ok ? (this.hooks.emit("completed", a), r) : (this.emitFailed(a, r.error), r);
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
class $R {
  emit(t, n, a = {}) {
    const r = {
      phase: t,
      context: n,
      stepIndex: a.stepIndex,
      step: a.step,
      rollRequest: a.rollRequest,
      rollResult: a.rollResult,
      damage: a.damage,
      healing: a.healing,
      resourceTransaction: a.resourceTransaction,
      metadata: a.metadata
    };
    return n.phases.push(t), n.lifecycleEvents.push({
      phase: t,
      stepIndex: a.stepIndex,
      stepType: a.step?.type,
      rollId: a.rollRequest?.id ?? a.rollResult?.id,
      rollIntent: a.rollRequest?.intent ?? a.rollResult?.intent,
      damageId: a.damage?.id,
      healingId: a.healing?.id,
      resourceOperation: a.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${d}.workflow.${t}`, r), Hooks.callAll(`${d}.workflow.phase`, r), r;
  }
}
class wR {
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
    const n = sa();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: ER(),
      flags: {
        ...t.flags,
        [d]: {
          ...CR(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const a = sa();
    if (!a.enabled)
      return;
    const r = n.notification ?? Ci(n);
    a.console && this.emitConsole(t, n), a.ui && this.emitUi(t, r);
  }
  emitConsole(t, n) {
    const a = Ci(n);
    switch (t) {
      case "info":
        f.info(a, n.data ?? "");
        return;
      case "warn":
        f.warn(a, n.data ?? "");
        return;
      case "error":
        f.error(a, n.data ?? "");
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
function Ci(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function ER() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function CR(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const SR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Pc = `${d}-inline-roll-neutralized`, IR = `${d}-inline-roll-notice`, zr = `data-${d}-inline-roll-neutralized`, Si = `data-${d}-inline-roll-notice`, LR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ii(e) {
  const t = GR(e.message), n = await vR(e.message), a = DR(t);
  return n.replacementCount + a.replacementCount > 0 && f.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: a.replacementCount
  }), {
    messageId: t,
    contentUpdated: n.updated,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: a.replacementCount
  };
}
async function vR(e) {
  const t = zR(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = xR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await qR(t, n.content), replacementCount: n.replacementCount };
}
function DR(e) {
  const t = e ? jR(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Mc(t);
  return n > 0 && Oc(FR(t)), { replacementCount: n };
}
function xR(e) {
  const t = NR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const a = Mc(n.content), r = t.replacementCount + a;
  return r === 0 ? { content: e, replacementCount: 0 } : (Oc(n.content), { content: n.innerHTML, replacementCount: r });
}
function NR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, r) => (t += 1, MR(r.trim()))), replacementCount: t };
}
function Mc(e) {
  const t = PR(e);
  for (const n of t)
    n.replaceWith(OR(BR(n)));
  return t.length;
}
function PR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(SR))
    n.getAttribute(zr) !== "true" && t.add(n);
  return Array.from(t);
}
function MR(e) {
  return `<span class="${Pc}" ${zr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${VR(e)}</span>`;
}
function OR(e) {
  const t = document.createElement("span");
  return t.classList.add(Pc), t.setAttribute(zr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Oc(e) {
  if (e.querySelector?.(`[${Si}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(IR), t.setAttribute(Si, "true"), t.textContent = LR, e.append(t);
}
function FR(e) {
  return e.querySelector(".message-content") ?? e;
}
function BR(e) {
  const n = e.getAttribute("data-formula") ?? UR(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function UR(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function zR(e) {
  return e && typeof e == "object" ? e : null;
}
async function qR(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function jR(e) {
  const t = HR(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function GR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function VR(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function HR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Zt = "ritualRollConfig", Jt = "ritual-roll", WR = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function An() {
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
function Fc(e) {
  const t = e.getFlag(d, Zt);
  return Fa(t);
}
function Bc(e) {
  return Fc(e) ?? An();
}
async function KR(e, t) {
  const n = Fa(t) ?? Fa({
    ...An(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Zt, n), n;
}
async function YR(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Zt));
    return;
  }
  await e.setFlag(d, Zt, null);
}
function Fa(e) {
  if (!Tn(e)) return null;
  const t = ok(e.intent);
  if (!t) return null;
  const n = An();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Ba(e.damageType),
    utilityLabel: Ba(e.utilityLabel) ?? n.utilityLabel,
    note: qr(e.note),
    forms: sk(e.forms)
  };
}
function XR(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function QR(e) {
  const t = Fc(e), n = Uc(e);
  if (!t)
    return Li(e, n);
  const a = ak(e, t);
  if (!a)
    return Li(e, n);
  const r = ZR(t, a), o = [
    { type: "spendRitualCost" },
    r,
    ...JR(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: tk(e, t),
    resistance: n
  };
}
function Li(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: nk(e),
    resistance: t
  } : null;
}
function ZR(e, t) {
  const n = {
    type: "rollFormula",
    id: Jt,
    formula: t,
    intent: rk(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function JR(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Jt}.total`,
          ...ek(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Jt}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function ek(e) {
  return e ? { damageType: e } : {};
}
function tk(e, t) {
  const n = {
    base: Wn("Padrão", t.forms.base.formula)
  };
  return Ge(e, "discente") && (n.discente = Wn("Discente", t.forms.discente.formula, 2)), Ge(e, "verdadeiro") && (n.verdadeiro = Wn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function Wn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Jt]: t.trim()
    }
  };
}
function nk(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Ge(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Ge(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function ak(e, t) {
  return [
    t.forms.base.formula.trim(),
    Ge(e, "discente") ? t.forms.discente.formula.trim() : "",
    Ge(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((a) => a.length > 0) ?? null;
}
function Uc(e) {
  const t = zc(e), n = Ba(t.skillResis), a = ik(t.resistance);
  if (!n || !a) return;
  const r = lk(n), o = WR[a];
  return {
    skill: n,
    label: r,
    effect: a,
    summary: `${r} ${o}`
  };
}
function rk(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function ok(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function ik(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function sk(e) {
  const t = An();
  return Tn(e) ? {
    base: Kn(e.base),
    discente: Kn(e.discente),
    verdadeiro: Kn(e.verdadeiro)
  } : t.forms;
}
function Kn(e) {
  return Tn(e) ? { formula: qr(e.formula) } : { formula: "" };
}
function Ge(e, t) {
  const n = zc(e), a = t === "discente" ? n.studentForm : n.trueForm;
  return ck(a);
}
function zc(e) {
  const t = e.system;
  return Tn(t) ? t : {};
}
function lk(e) {
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
function ck(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function qr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Ba(e) {
  const t = qr(e);
  return t.length > 0 ? t : null;
}
function Tn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function uk(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function dk(e) {
  switch (mk(e)) {
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
      return fk(String(e ?? ""));
  }
}
function mk(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function fk(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function pk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function gk(e) {
  return {
    ...jr(e),
    type: "ritual.cast.started"
  };
}
function hk(e) {
  return {
    ...jr(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function bk(e) {
  return {
    ...jr(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function yk(e) {
  if (e.type === "preset") {
    const t = ke(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: ke(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: ke(e.label),
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
function _k(e, t = {}) {
  const n = Nk(e), a = [
    ...Mk(t.candidates ?? []),
    ...Ok(e)
  ], r = Bk(a) ?? { x: 0, y: 0, width: 0, height: 0 }, o = Pk(t) ?? Uk(a) ?? qk(r), s = Gk(canvas?.grid?.size), l = Ak(o, r, a), c = Sk(a), u = Ck(l);
  return {
    type: "rectangleRay",
    sceneId: jk(e, n),
    regionId: Oi(n?.id) ?? Oi(e.id),
    gridSize: s,
    bounds: {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height
    },
    shape: l,
    center: {
      x: r.x + r.width / 2,
      y: r.y + r.height / 2
    },
    ray: c ?? u ?? {
      start: null,
      end: null
    },
    source: "lineArea",
    targetingMode: "lineArea"
  };
}
function Ak(e, t, n) {
  const a = {
    x: N(e, "x") ?? 0,
    y: N(e, "y") ?? 0,
    width: N(e, "width") ?? t.width,
    height: N(e, "height") ?? t.height,
    direction: N(e, "direction") ?? 0,
    elevation: N(e, "elevation")
  };
  return {
    ...a,
    direction: Tk(a, t, n)
  };
}
function Tk(e, t, n) {
  const a = Rk(n);
  return a !== null ? a : $k(e, t) ?? e.direction;
}
function Rk(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const a = vi(n, t);
    if (a !== null) return a;
    const r = Rn(n), o = vi(r, t);
    if (o !== null) return o;
  }
  return null;
}
function vi(e, t) {
  for (const n of t) {
    const a = kk(G(e, n));
    if (a !== null) return a;
  }
  return null;
}
function kk(e) {
  const t = pt(e);
  if (t === null) return null;
  const n = Vr(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function $k(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = xi(Di(e, e.direction), t), a = wk(e, t);
  if (a === null) return null;
  const o = Ek([
    a,
    -a,
    180 - a,
    180 + a,
    0,
    90,
    180,
    270
  ]).map((l) => ({
    direction: l,
    error: xi(Di(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? Vr(o.direction) : null;
}
function wk(e, t) {
  const n = e.width, a = e.height, r = n ** 2 - a ** 2;
  if (Math.abs(r) < 1e-3) return null;
  const o = (n * t.width - a * t.height) / r, s = (n * t.height - a * t.width) / r, l = Fi(o, 0, 1), c = Fi(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : Vk(Math.atan2(c, l));
}
function Di(e, t) {
  const n = jc(t), a = {
    x: Math.cos(n),
    y: Math.sin(n)
  }, r = {
    x: -Math.sin(n),
    y: Math.cos(n)
  }, o = [
    { x: e.x, y: e.y },
    {
      x: e.x + a.x * e.width,
      y: e.y + a.y * e.width
    },
    {
      x: e.x + r.x * e.height,
      y: e.y + r.y * e.height
    },
    {
      x: e.x + a.x * e.width + r.x * e.height,
      y: e.y + a.y * e.width + r.y * e.height
    }
  ], s = o.map((_) => _.x), l = o.map((_) => _.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), g = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: g - m
  };
}
function xi(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function Ek(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const a = Vr(n);
    t.add(Math.round(a * 1e3) / 1e3);
  }
  return [...t];
}
function Ck(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = jc(e.direction), n = {
    x: Math.cos(t),
    y: Math.sin(t)
  }, a = {
    x: -Math.sin(t),
    y: Math.cos(t)
  }, r = e.height / 2, o = {
    x: e.x + a.x * r,
    y: e.y + a.y * r
  };
  return {
    start: o,
    end: {
      x: o.x + n.x * e.width,
      y: o.y + n.y * e.width
    }
  };
}
function Sk(e) {
  for (const t of e) {
    const n = Ni(t, "ray.start"), a = Ni(t, "ray.end");
    if (n && a) return { start: n, end: a };
  }
  return null;
}
function Ni(e, t) {
  const n = G(e, t), a = pt(G(n, "x")), r = pt(G(n, "y"));
  return a === null || r === null ? null : { x: a, y: r };
}
function jr(e) {
  const t = yk(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: vk(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: Ik(e.context.item, e.form, e.formLabel, t),
    targets: n.map(Dk),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function Ik(e, t, n, a) {
  return {
    name: e.name,
    slug: Yn(e, "system.slug") ?? Yn(e, "slug"),
    presetId: a.presetId,
    presetVersion: a.presetVersion,
    element: Yn(e, "system.element"),
    circle: xk(e),
    form: Lk(t),
    formLabel: n
  };
}
function Lk(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function vk(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function Dk(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function xk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : ke(t);
}
function Yn(e, t) {
  return ke(foundry.utils.getProperty(e, t));
}
function ke(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function Nk(e) {
  return "document" in e && e.document ? e.document : e;
}
function Pk(e) {
  return qc(e.shape);
}
function Mk(e) {
  return e.filter(Gr);
}
function Ok(e) {
  return [
    e,
    Fk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Gr);
}
function Fk(e) {
  return "object" in e && Gr(e.object) ? e.object : null;
}
function Gr(e) {
  return !!(e && typeof e == "object");
}
function Bk(e) {
  for (const t of e) {
    const n = Pi(G(Rn(t), "bounds"));
    if (n) return n;
    const a = Pi(G(t, "bounds"));
    if (a) return a;
  }
  return null;
}
function Pi(e) {
  const t = N(e, "x"), n = N(e, "y"), a = N(e, "width"), r = N(e, "height");
  return t === null || n === null || a === null || r === null ? null : { x: t, y: n, width: a, height: r };
}
function N(e, t) {
  return pt(G(e, t));
}
function Uk(e) {
  for (const t of e) {
    const n = zk(t).find((a) => a.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function zk(e) {
  if (!e || typeof e != "object") return [];
  const t = Mi(Rn(e));
  return t.length > 0 ? t : Mi(e);
}
function Mi(e) {
  const t = G(e, "shapes");
  return Array.isArray(t) ? t.map(qc).filter((n) => n !== null) : [];
}
function qc(e) {
  const t = Rn(e) ?? e, n = G(t, "type");
  return typeof n != "string" ? null : {
    type: n,
    x: N(t, "x"),
    y: N(t, "y"),
    width: N(t, "width"),
    height: N(t, "height"),
    direction: N(t, "direction"),
    elevation: N(t, "elevation")
  };
}
function qk(e) {
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
function jk(e, t) {
  return Xn(e, "parent.id") ?? Xn(e, "document.parent.id") ?? Xn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Xn(e, t) {
  return ke(G(e, t));
}
function G(e, t) {
  if (!e || typeof e != "object") return;
  let n = e;
  for (const a of t.split(".")) {
    if (!n || typeof n != "object") return;
    try {
      n = n[a];
    } catch {
      return;
    }
  }
  return n;
}
function Rn(e) {
  if (!e || typeof e != "object") return null;
  const t = G(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function Oi(e) {
  return ke(e);
}
function pt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Gk(e) {
  const t = pt(e);
  return t !== null && t > 0 ? t : null;
}
function jc(e) {
  return e * Math.PI / 180;
}
function Vk(e) {
  return e * 180 / Math.PI;
}
function Vr(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Fi(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class Hk {
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
class kn {
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
    for (const a of this.getSceneTokens()) {
      if (typeof a.setTarget != "function") continue;
      const r = a.id ?? a.document?.id ?? null;
      a.setTarget(!!(r && n.has(r)), {
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
const Wk = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class Kk {
  constructor(t = new kn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = Yk(t, this.foundryAdapter);
    for (const a of n)
      try {
        await a.run(), a.method;
        return;
      } catch {
        a.method;
      }
    this.foundryAdapter.warn(Wk);
  }
}
function Yk(e, t) {
  const n = [], a = Xk(e), r = Bi(a), o = Bi(e);
  if (typeof a?.delete == "function") {
    const s = a.delete.bind(a);
    n.push({ method: "document.delete", run: s });
  }
  if (typeof e.delete == "function") {
    const s = e.delete.bind(e);
    n.push({ method: "region.delete", run: s });
  }
  return r && n.push({
    method: "scene.deleteEmbeddedDocuments(document.id)",
    run: () => t.deleteRegionDocumentById(r)
  }), o && o !== r && n.push({
    method: "scene.deleteEmbeddedDocuments(region.id)",
    run: () => t.deleteRegionDocumentById(o)
  }), n;
}
function Xk(e) {
  return Qk(e) ? e.document ?? null : e;
}
function Qk(e) {
  return "bounds" in e;
}
function Bi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const Zk = 100, Jk = 12;
class e$ {
  constructor(t = new kn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async placeLine(t = { shape: "rectangleRay" }, n = {}) {
    const a = this.foundryAdapter.canPlaceRegions();
    if (!a.ok)
      return {
        status: "failed",
        reason: a.reason,
        message: a.message
      };
    try {
      const r = this.foundryAdapter.getGridSize() ?? Zk, o = o$(n), s = await this.foundryAdapter.placeRegion(
        t$(t, this.foundryAdapter.getUserColor(), r),
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
    } catch (r) {
      return {
        status: "failed",
        reason: "region-placement-failed",
        message: r$(r)
      };
    }
  }
}
function t$(e, t, n) {
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
    shapes: [n$(e, n)]
  };
}
function n$(e, t) {
  const n = a$(e, t);
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
function a$(e, t) {
  return {
    length: Ui(e.length, Jk, t),
    width: Ui(e.width, 1, t)
  };
}
function Ui(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function r$(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function o$(e) {
  const t = (n) => {
    const a = i$(n);
    a && e.onChange?.(a);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function i$(e) {
  return s$(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function s$(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class l$ {
  constructor(t = new kn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(zi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(zi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = c$(t);
    u$(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function zi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function c$(e) {
  return Array.from(new Set(e));
}
function u$(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, a) => n === t[a]);
}
class d$ {
  constructor(t = new kn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(xs)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(m$(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(f$(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((a) => ({
      source: a.source,
      hasBounds: Ua(a.region)
    }));
    for (const a of t) {
      if (!Ua(a.region)) continue;
      const r = this.resolveRegionObjectTargetTokens(a.region);
      return a.source, r.tokens.length, r;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), a = g$(
      n.filter((r) => !r.actor || typeof r.document?.testInsideRegion != "function" ? !1 : r.document.testInsideRegion(t))
    );
    return n.length, a.length, { tokens: a, source: "regionObject" };
  }
}
function m$(e) {
  return [
    { source: "document", region: Re(e.document) },
    { source: "document.object", region: Re(e.document.object) },
    { source: "preview", region: Re(e.preview) },
    { source: "preview.document.object", region: Re(e.preview?.document?.object) }
  ];
}
function f$(e) {
  return [
    { source: "input", region: Re(e) },
    { source: "input.object", region: p$(e) ? Re(e.object) : null },
    { source: "input.document.object", region: Gc(e) ? Re(e.document?.object) : null }
  ];
}
function Re(e) {
  return Ua(e) ? e : null;
}
function Ua(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Dt(n.x) && Dt(n.y) && Dt(n.width) && Dt(n.height);
}
function Gc(e) {
  return "document" in e && "bounds" in e;
}
function p$(e) {
  return !Gc(e);
}
function g$(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return a ? t.has(a) ? !1 : (t.add(a), !0) : !0;
  });
}
function Dt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class h$ {
  async minimizeForPlacement() {
    const t = [];
    for (const n of _$())
      await b$(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await y$(n);
      }
    };
  }
}
async function b$(e) {
  if (Vc(e) || !C$(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function y$(e) {
  if (Vc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function _$() {
  const e = /* @__PURE__ */ new Set();
  for (const t of A$())
    k$(t) && $$(t) && e.add(t);
  return [...e];
}
function A$() {
  return [
    ...qi(T$()),
    ...qi(R$())
  ];
}
function qi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function T$() {
  return globalThis.ui?.windows ?? null;
}
function R$() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function k$(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function $$(e) {
  const t = w$(e), n = E$(t);
  return n === "Actor" || n === "Item";
}
function w$(e) {
  return e.document ?? e.object ?? null;
}
function E$(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function C$(e) {
  const t = S$(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function S$(e) {
  const t = e.element;
  if (ji(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (ji(n)) return n;
  }
  return null;
}
function ji(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function Vc(e) {
  return e.minimized === !0;
}
const I$ = "Nenhum alvo encontrado na linha.";
class L$ {
  constructor(t = new e$(), n = new d$(), a = new Kk(), r = new l$(), o = new Hk(), s = new h$()) {
    this.regionLinePlacement = t, this.regionTargetResolver = n, this.regionCleanup = a, this.regionTargetPreview = r, this.foundryAdapter = o, this.placementWindowManager = s;
  }
  regionLinePlacement;
  regionTargetResolver;
  regionCleanup;
  regionTargetPreview;
  foundryAdapter;
  placementWindowManager;
  async resolvePreCastTargets(t) {
    const n = t.castOptions.areaTargeting;
    if (!n || !n.enabled || n.mode === "selectedTokens")
      return {
        status: "confirmed",
        targets: t.currentTargets
      };
    if (n.mode === "lineArea") {
      const a = [], r = this.regionTargetPreview.captureCurrentTargets(), o = () => {
        this.regionTargetPreview.restorePreviousTargets(r);
      }, s = await this.placementWindowManager.minimizeForPlacement(), l = await (async () => {
        try {
          return await this.regionLinePlacement.placeLine(
            {
              shape: "rectangleRay",
              length: t.formTargeting?.template?.distance,
              width: t.formTargeting?.template?.width
            },
            {
              onChange: (c) => {
                a.push(c);
                try {
                  const u = this.regionTargetResolver.resolvePreviewTargetTokens(c);
                  this.regionTargetPreview.previewTargets(u.tokens);
                } catch {
                  this.regionTargetPreview.previewTargets([]);
                }
              }
            }
          );
        } finally {
          await s.restore();
        }
      })();
      if (l.status === "cancelled")
        return o(), l;
      if (l.status === "failed")
        return o(), this.foundryAdapter.warn(l.message), l;
      try {
        const c = this.regionTargetResolver.resolveTargets(l.region), u = D$(a), m = _k(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(I$), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = v$(c);
        return this.foundryAdapter.warn(u), {
          status: "failed",
          reason: "region-resolution-failed",
          message: u
        };
      } finally {
        l.wasCreated && await this.regionCleanup.deleteCreatedRegion(l.region);
      }
    }
    return {
      status: "failed",
      reason: "unsupported-targeting-mode",
      message: "Modo de seleção de alvos não suportado."
    };
  }
}
function v$(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function D$(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function x$(e) {
  return {
    header: {
      eyebrow: Ts,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: z$(e.ritual)
    },
    forms: e.variantOptions.map((t) => N$(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: O$(e.targetNames, e.variantOptions, e.ritual),
    automation: U$(e.automationStatus ?? "assisted")
  };
}
function N$(e, t) {
  const n = P$(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? M$(t) : "—",
    details: n
  };
}
function P$(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function M$(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function O$(e, t, n) {
  const a = e.map((r) => r.trim()).filter((r) => r.length > 0);
  return {
    targetNames: a,
    targetText: a.length > 0 ? a.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: a.length > 0,
    forms: t.map((r) => F$(r, n))
  };
}
function F$(e, t) {
  const n = e.targeting ?? B$(t, e.variant), a = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
  return {
    variant: e.variant,
    mode: a,
    modeLabel: n?.label ?? "Alvos selecionados",
    lineOptionLabel: a === "lineArea" && n?.optional === !0 ? n.optionLabel ?? "Usar linha na cena" : null,
    helperText: a === "lineArea" && n?.optional === !0 ? "Desmarque para usar os alvos selecionados manualmente." : null,
    showLineToggle: a === "lineArea" && n?.optional === !0,
    lineEnabledByDefault: n?.defaultEnabled === !0,
    checked: e.variant === "base"
  };
}
function B$(e, t) {
  const n = bt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function U$(e) {
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
function z$(e) {
  const t = e.system, n = [j$(t?.element), q$(t?.circle)].filter(H$);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function q$(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function j$(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (G$(e)) {
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
      return V$(e);
  }
}
function G$(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function V$(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function H$(e) {
  return typeof e == "string" && e.length > 0;
}
const Hc = ["base", "discente", "verdadeiro"];
function Hr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function en(e) {
  return typeof e == "string" && Hc.includes(e);
}
const { ApplicationV2: W$ } = foundry.applications.api;
class ut extends W$ {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = x$(t), this.selectedVariant = this.model.forms.find((a) => a.checked && a.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: ut.onCast,
      cancel: ut.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new ut(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const a = document.createElement("div");
    return a.className = "paranormal-toolkit-ritual-cast", a.innerHTML = this.renderContent(), a;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
    const r = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    X$(r, (o) => {
      this.selectedVariant = o, za(r, o);
    }), za(r, this.selectedVariant), Q$(r, (o) => {
      this.spendResource = o;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${D(this.model.header.eyebrow)}</p>
        <div>
          <h2>${D(this.model.header.title)}</h2>
          <p>${D(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(K$).join("")}
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
          <div><dt>Custo base</dt><dd>${D(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${D(this.model.cost.casterName)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--targets">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Alvos</h3>
          <span class="paranormal-toolkit-ritual-cast__automation-note paranormal-toolkit-ritual-cast__automation-note--${this.model.automation.status}">
            ${D(this.model.automation.title)}
          </span>
        </div>
        <div class="paranormal-toolkit-ritual-cast__targeting-forms">
          ${this.model.targets.forms.map(Y$).join("")}
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targets">
          <div class="paranormal-toolkit-ritual-cast__summary-targets"><dt>Alvos atuais</dt><dd>${D(this.model.targets.targetText)}</dd></div>
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
    const n = tw(t), a = Z$(n, this.spendResource, this.selectedVariant);
    this.settle(a), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function K$(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", a = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", r = e.details.map((o) => `<span>${D(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${a}"
      data-paranormal-toolkit-ritual-cast-form="${D(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${D(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${D(e.label)}</strong>
        <em>${D(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${r}</span>
    </label>
  `;
}
function Y$(e) {
  const t = e.checked ? "" : "hidden", n = e.showLineToggle && e.lineOptionLabel ? `
        <label class="paranormal-toolkit-ritual-cast__targeting-line-toggle">
            <input
              type="checkbox"
              name="areaTargeting-${D(e.variant)}"
              ${e.lineEnabledByDefault ? "checked" : ""}
              data-paranormal-toolkit-area-targeting-line-toggle
            >
            <span>
              <strong>${D(e.lineOptionLabel)}</strong>
              ${e.helperText ? `<em>${D(e.helperText)}</em>` : ""}
            </span>
        </label>
      ` : "";
  return `
    <div
      class="paranormal-toolkit-ritual-cast__targeting-form"
      data-paranormal-toolkit-targeting-form="${D(e.variant)}"
      data-paranormal-toolkit-targeting-mode="${D(e.mode)}"
      ${t}
    >
      <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targeting-mode">
        <div><dt>Modo</dt><dd>${D(e.modeLabel)}</dd></div>
      </dl>
      ${n}
    </div>
  `;
}
function X$(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of n)
    r.addEventListener("click", () => Gi(e, r, t)), r.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Gi(e, r, t));
    });
  const a = Wc(e);
  a && t(a);
}
function Gi(e, t, n) {
  const a = t.querySelector('input[name="variant"]');
  !a || a.disabled || !en(a.value) || (a.checked = !0, e.dataset.paranormalToolkitSelectedVariant = a.value, n(a.value), a.dispatchEvent(new Event("change", { bubbles: !0 })), Wc(e), za(e, a.value));
}
function Wc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const a of t) {
    const r = a.querySelector('input[name="variant"]'), o = r?.checked === !0;
    a.setAttribute("aria-checked", o ? "true" : "false"), o && en(r.value) && (n = r.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function za(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const a of n) {
    const r = a.dataset.paranormalToolkitTargetingForm === t;
    a.hidden = !r;
  }
}
function Q$(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Z$(e, t, n) {
  const a = ew(e) ?? n, r = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = J$(e, a);
  return {
    variant: a,
    spendResource: r,
    areaTargeting: o
  };
}
function J$(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function ew(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (en(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return en(n) ? n : null;
}
function tw(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function D(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function nw(e) {
  return ut.request(e);
}
const Wr = {
  label: "Padrão"
}, aw = {
  label: "Discente",
  extraCost: 2
}, rw = {
  label: "Verdadeiro",
  extraCost: 5
};
class ow {
  constructor(t, n, a, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = a, this.ritualEvents = r;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new L$();
  canHandle(t, n) {
    return t.item.type === "ritual" || n.steps.some((a) => a.type === "spendRitualCost");
  }
  async run(t, n, a) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(t), o = Jw(n), s = Xw(
      n,
      t.item,
      r,
      o
    ), l = await nw({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((w) => w.name),
      cost: r,
      defaultSpendResource: oE(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = iw(l), u = tE(
      n,
      t.item,
      c.variant,
      o
    ), m = pk(), g = u.label ?? Hr(c.variant), _ = mw(u), k = (w = t.targets) => ({
      castId: m,
      context: t,
      automationSource: a,
      form: c.variant,
      formLabel: g,
      targets: w
    }), R = (w, S = t.targets, U = {}) => {
      this.ritualEvents.emitCastFinished(
        bk({
          ...k(S),
          status: w,
          ...U
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      gk(k())
    );
    const $ = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if ($.status === "cancelled")
      return R("cancelled", t.targets, { reason: $.reason }), { status: "cancelled" };
    if ($.status === "failed")
      return R("failed", t.targets, {
        reason: $.reason,
        message: $.message
      }), {
        status: "failed",
        reason: $.reason,
        message: $.message
      };
    const b = sw(
      t,
      $.targets
    );
    $.areaSnapshot && this.ritualEvents.emitAreaResolved(
      hk({
        ...k($.targets),
        area: $.areaSnapshot
      })
    );
    const L = Us();
    let A = null;
    if (L) {
      const w = await cw(
        this.resources,
        b.actor,
        c,
        u,
        r
      );
      if (!w.ok)
        return R("failed", b.targets, {
          reason: w.reason,
          message: w.message
        }), {
          status: "failed",
          reason: w.reason,
          message: w.message
        };
      try {
        const S = await PT(
          b.actor
        );
        A = fw(
          S,
          u,
          r
        );
      } catch (S) {
        const U = S instanceof Error ? S.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return R("failed", b.targets, {
          reason: "ritual-casting-check-failed",
          message: U
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: U,
          cause: S
        };
      }
    }
    const B = lw(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !L
      }
    );
    if (B.steps.length === 0) {
      const w = eE(
        b,
        c
      ), S = Hi(
        n,
        b
      ), U = Vi(
        b.actor,
        A,
        u,
        r
      ), W = Wi(
        n,
        c,
        u,
        r,
        w,
        b,
        A
      );
      if (!S.ok)
        return R("failed", b.targets, {
          reason: S.reason,
          message: S.message
        }), {
          status: "failed",
          reason: S.reason,
          message: S.message
        };
      const $t = [
        ...U,
        ...S.actions
      ];
      return $t.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: w,
        itemUseContext: b,
        actions: $t,
        summaryLines: W
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: w,
        itemUseContext: b,
        summaryLines: W
      });
    }
    const x = await this.workflow.runAutomation(B, {
      sourceActor: b.actor,
      sourceToken: b.token,
      item: b.item,
      targets: b.targets,
      flags: {
        itemUse: {
          source: b.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: c.variant,
          spendResource: c.spendResource
        }
      }
    });
    if (!x.ok)
      return R("failed", b.targets, {
        reason: x.error.reason,
        message: x.error.message
      }), {
        status: "failed",
        reason: x.error.reason,
        message: x.error.message,
        cause: x.error
      };
    const H = x.value.context, v = _w(
      n,
      b,
      H,
      _
    ), q = Hi(
      n,
      b
    ), kt = Vi(
      b.actor,
      A,
      u,
      r
    ), fe = Wi(
      n,
      c,
      u,
      r,
      H,
      b,
      A
    );
    if (!v.ok)
      return R("failed", b.targets, {
        reason: v.reason,
        message: v.message
      }), {
        status: "failed",
        reason: v.reason,
        message: v.message
      };
    if (!q.ok)
      return R("failed", b.targets, {
        reason: q.reason,
        message: q.message
      }), {
        status: "failed",
        reason: q.reason,
        message: q.message
      };
    const C = [
      ...kt,
      ...v.actions,
      ...q.actions
    ];
    return C.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: H,
      itemUseContext: b,
      summaryLines: fe
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: H,
      itemUseContext: b,
      actions: C,
      summaryLines: fe
    });
  }
  async applyAction(t) {
    return Qt(
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
function iw(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function sw(e, t) {
  return {
    ...e,
    targets: t
  };
}
function lw(e, t, n, a, r) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Yr(l) && (!r.includeCostSteps || !s))
      continue;
    const c = uw(l, n);
    c && o.push(c);
  }
  return r.includeCostSteps && s && a && iE(n.extraCost) && o.push({
    type: "spendResource",
    actor: "self",
    resource: a.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: o
  };
}
async function cw(e, t, n, a, r) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Xe(r, a);
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
function uw(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = dw(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function dw(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const a = n[t];
  return typeof a == "string" ? a.trim() : "";
}
function mw(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function fw(e, t, n) {
  const r = pw(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: r,
    success: e.total >= r
  };
}
function pw(e, t) {
  const n = Xe(e, t);
  return n ? uk(n.amount) : null;
}
function Vi(e, t, n, a) {
  if (!t || t.success) return [];
  const r = Xe(a, n);
  if (!r || r.amount <= 0) return [];
  const o = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: o,
      resource: "SAN",
      operation: "damage",
      amount: r.amount,
      label: `Aplicar ${r.amount} SAN`,
      executedLabel: "✓ Dano na SAN aplicado",
      actionSectionId: "casting-backlash",
      actionSectionTitle: "Dano na sanidade"
    }
  ];
}
function Hi(e, t) {
  const n = [];
  for (const a of e.conditionApplications ?? []) {
    const r = Kr(a.actor, t);
    if (r.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${a.label ?? a.conditionId}.`
      };
    }
    for (const o of r) {
      const s = hl(o);
      n.push(
        gw(
          a,
          o,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function gw(e, t, n, a) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? yw(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: hw(
      e.duration ?? null,
      a
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: bw(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function hw(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function bw(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const a = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${a}`;
  }
  return e;
}
function yw(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function _w(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || Aw(s, a)) continue;
    const l = Xt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = Kr(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (Tw(s)) {
        Rw(
          o,
          u,
          kw(s, n, l.value)
        );
        continue;
      }
      r.push(ww(s, u, l.value));
    }
  }
  for (const s of o.values())
    r.push(
      ...$w(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: r };
}
function Aw(e, t) {
  const n = Kc(e.amountFrom);
  return n !== null && t.has(n);
}
function Tw(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Rw(e, t, n) {
  const a = Iw(t), r = e.get(a);
  if (r) {
    r.entries.push(n);
    return;
  }
  e.set(a, {
    actor: t,
    entries: [n]
  });
}
function kw(e, t, n) {
  const a = Kc(e.amountFrom), r = a ? t.rolls[a]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? r ?? null,
    sourceRollId: a
  };
}
function $w(e, t, n, a) {
  const r = xw(e), o = r.length > 1 ? Mw() : void 0;
  return r.map((s) => {
    const l = a.map(
      (u, m) => {
        const g = Nw(u.amount, s);
        return {
          id: Ew(u, s, m),
          amount: g,
          damageType: u.damageType,
          sourceRollId: u.sourceRollId,
          ignoreResistance: u.step.ignoreResistance === !0
        };
      }
    ), c = l.reduce(
      (u, m) => u + m.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: Cw(c, s, r.length > 1),
      executedLabel: Sw(
        n.name ?? "Ator sem nome",
        s,
        r.length > 1
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
function ww(e, t, n) {
  const a = t.name ?? "Ator sem nome", r = Dw(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Lw(e, a, n),
    executedLabel: vw(e, a),
    actionSectionId: r.id,
    actionSectionTitle: r.title
  };
}
function Ew(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Cw(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Sw(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Iw(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Kc(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Lw(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function vw(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Dw(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function xw(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Nw(e, t) {
  const n = e * t.multiplier, a = Pw(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, a);
}
function Pw(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Mw() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Kr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Wi(e, t, n, a, r, o, s = null) {
  return [
    `Forma: ${Hr(t.variant)}`,
    Uw(t, n, a),
    ...Bw(s),
    ...Object.values(r.rolls).flatMap(zw),
    ...Ow(e, o),
    ...qw(e.resistance),
    ...Kw(n)
  ];
}
function Ow(e, t) {
  return Fw(e) ? Kr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Fw(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Bw(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Uw(e, t, n) {
  const a = Xe(n, t);
  return a ? e.spendResource ? `Custo: ${a.amount} ${a.resource} gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function zw(e) {
  const n = [`${Yw(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = jw(e.roll);
  return a && n.push(`Dados: ${a}`), e.damageType && n.push(`Tipo: ${dk(e.damageType)}`), n;
}
function qw(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function jw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let a = "+";
  for (const r of t) {
    if (!r || typeof r != "object") continue;
    const o = r;
    if (o.operator === "+" || o.operator === "-") {
      a = o.operator;
      continue;
    }
    const s = Gw(o);
    s && (Ww(
      n,
      s.operator ?? a,
      s.value
    ), a = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Gw(e) {
  const t = Vw(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Hw(e);
}
function Vw(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Hw(e) {
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
function Ww(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Kw(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Yw(e) {
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
function Xw(e, t, n, a) {
  return Hc.map((r) => {
    const o = Yc(
      e,
      t,
      r,
      a
    ), s = o !== null;
    return {
      variant: r,
      label: o?.label ?? Hr(r),
      enabled: s,
      details: o ? Qw(o, n) : [],
      finalCostText: o ? Zw(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Qw(e, t, n) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  r.length > 0 ? a.push(r.join(", ")) : a.push("efeito manual");
  const o = Xe(t, e);
  return a.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), a;
}
function Xe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Zw(e, t) {
  const n = Xe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Jw(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Yr);
}
function eE(e, t) {
  return Nc({
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
function tE(e, t, n, a) {
  return Yc(e, t, n, a) ?? Wr;
}
function Yc(e, t, n, a) {
  const r = e.ritualForms?.[n] ?? null;
  return r || (a ? aE(t, n) ? nE(n) : null : n === "base" ? Wr : null);
}
function nE(e) {
  switch (e) {
    case "base":
      return Wr;
    case "discente":
      return aw;
    case "verdadeiro":
      return rw;
  }
}
function aE(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return rE(foundry.utils.getProperty(e, n));
}
function rE(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function oE(e) {
  return e.steps.some(Yr);
}
function Yr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function iE(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Xc = "itemUsePrompts", Qc = "chatCard", $n = "data-paranormal-toolkit-prompt-id", wn = "data-paranormal-toolkit-pending-id", Xr = "data-paranormal-toolkit-executed-label", qa = "data-paranormal-toolkit-choice-group", Zc = "data-paranormal-toolkit-skipped-label", tn = "data-paranormal-toolkit-action-section", Ki = "data-paranormal-toolkit-detail-key", Yi = "data-paranormal-toolkit-roll-card", Qr = "data-paranormal-toolkit-roll-detail-toggle", Jc = "data-paranormal-toolkit-roll-detail-id", eu = "data-paranormal-toolkit-resistance-roll-button", tu = "data-paranormal-toolkit-resistance-skill", nu = "data-paranormal-toolkit-resistance-skill-label", au = "data-paranormal-toolkit-resistance-target-actor-id", ru = "data-paranormal-toolkit-resistance-target-name", ou = "data-paranormal-toolkit-resistance-roll-result", Xi = "data-paranormal-toolkit-system-card-replaced", sE = `[${wn}]`, lE = `[${Qr}]`, cE = `[${eu}]`, ja = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, uE = `${h}__actions`, Qi = `${h}__details`, iu = `${h}__summary`, dE = `${h}__title`, su = `${h}__button--executed`, xt = `${h}__roll-card`, mE = "data-paranormal-toolkit-roll-card-target-mode", fE = "data-paranormal-toolkit-roll-card-target-names", pE = "data-paranormal-toolkit-roll-card-resistance", gE = "data-paranormal-toolkit-roll-card-resistance-skill", hE = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Zi = !1, Ga = null;
const Q = /* @__PURE__ */ new Map(), bE = [0, 100, 500, 1500, 3e3], yE = 3e4, _E = [0, 100, 500, 1500, 3e3];
function AE(e) {
  if (Ga = e, Zi) {
    es(e);
    return;
  }
  const t = (n, a) => {
    cu(n, a, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Zi = !0, es(e);
}
async function Ji(e) {
  const t = lu(e);
  Q.set(e.pendingId, t), await eo(t) || Tu(t), uu(e.pendingId);
}
async function TE(e) {
  const t = lu({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", Q.set(e.pendingId, t), await eo(t) || Tu(t), uu(e.pendingId);
}
async function Qn(e, t) {
  const n = Q.get(e);
  Q.delete(e), n && await wC(n, t);
}
function Zr(e) {
  const t = Cu();
  for (const n of t) {
    const a = re(n)[e];
    if (a) return { message: n, prompt: a };
  }
  return null;
}
async function RE(e, t) {
  const n = Zr(e);
  if (!n) return;
  const a = re(n.message), r = a[e];
  r && (a[e] = {
    ...r,
    executedLabel: r.executedLabel,
    executed: !0
  }, await Qe(n.message, a));
}
async function kE(e, t, n) {
  if (!t) return;
  const a = Zr(e);
  if (!a) return;
  const r = re(a.message);
  let o = !1;
  for (const [s, l] of Object.entries(r))
    s !== e && l.choiceGroupId === t && (r[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Qe(a.message, r);
}
function lu(e) {
  const t = me(e.context.message), n = e.context.targets.find((s) => Ka(s)), a = n ? Ka(n) : null, r = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? n?.name ?? r?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? r?.id ?? null,
    resistanceTargetName: o,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: QE(e.context),
    executed: !1
  };
}
function cu(e, t, n) {
  $C();
  const a = Cn(t);
  if (!a) return;
  const r = TC(e, a);
  r.length > 0 && nn(a);
  for (const o of r)
    Va(a, o);
  gu(a, n), Ha(a), Wa(a);
}
function es(e) {
  for (const t of _E)
    globalThis.setTimeout(() => {
      $E(e);
    }, t);
}
function $E(e) {
  for (const t of wE()) {
    const n = En(t);
    EE(n) && cu(n, t, e);
  }
}
function wE() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function EE(e) {
  return e ? to(e) ? !0 : CC(e).length > 0 : !1;
}
function uu(e) {
  const t = Q.get(e);
  if (!t) return;
  const n = t.messageId ? RC(t.messageId) : null;
  if (n) {
    os(n, t), nn(n), Va(n, t), ts(n), Ha(n), Wa(n);
    return;
  }
  if (t.messageId) {
    Xa(t);
    return;
  }
  const a = kC(t);
  if (a) {
    os(a, t), nn(a), Va(a, t), ts(a), Ha(a), Wa(a);
    return;
  }
  Xa(t);
}
function ts(e) {
  Ga && gu(e, Ga);
}
function nn(e) {
  const t = CE();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = pu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Xi) === "true") return;
  const a = n.querySelector(`.${ja}`);
  a ? n.replaceChildren(a) : n.replaceChildren(), n.setAttribute(Xi, "true");
}
function CE() {
  try {
    return Bs() === "replace";
  } catch {
    return !1;
  }
}
function Va(e, t) {
  if (nn(e), e.querySelector(`[${$n}="${Ze(t.pendingId)}"]`)) return;
  const n = IE(e, t);
  vE(n, t);
  const a = WE(t);
  if (SE(a)) return;
  HE(n, a).append(XE(t));
}
function SE(e) {
  return mu(e.id) && !we();
}
function du(e) {
  const n = e.closest(`[${tn}]`)?.getAttribute(tn) ?? null;
  return mu(n) && !we();
}
function mu(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function IE(e, t) {
  const n = e.querySelector(`.${ja}`);
  if (n)
    return n;
  const a = document.createElement("section");
  a.classList.add(ja, h);
  const r = document.createElement("header");
  r.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(dE), s.textContent = LE(t);
  const l = document.createElement("span");
  return l.classList.add(iu), l.textContent = t.summary, r.append(o, s, l), a.append(r), JE(e).append(a), a;
}
function LE(e) {
  const t = F(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function vE(e, t) {
  const n = t.summaryLines ?? [], a = _u(n, t);
  if (a) {
    DE(e, a, t);
    return;
  }
  KE(e, n);
}
function DE(e, t, n) {
  if (e.querySelector(`[${Yi}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(
    xt,
    `${xt}--${t.intent}`,
    `${xt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && a.classList.add(`${xt}--multi-target`), a.setAttribute(Yi, "true"), a.setAttribute(mE, t.targetMode), a.setAttribute(fE, JSON.stringify(t.targetNames)), zE(a, t), t.castingCheck && ns(a, NE(t.castingCheck), n.pendingId, "casting"), xE(t) && ns(a, PE(t), n.pendingId, "effect"), UE(a, t), qE(a, t, n), VE(a, t), e.append(a);
}
function xE(e) {
  return e.intent !== "casting";
}
function NE(e) {
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
function PE(e) {
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
function ns(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && r.classList.add(`${h}__workflow-section--${t.status}`);
  const o = document.createElement("div");
  o.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, o.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, o.append(l);
  }
  if (r.append(o), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, r.append(l);
  }
  ME(r, t), GE(r, t.detailRows, n, a, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(r);
}
function ME(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const a = document.createElement("span");
  a.classList.add(`${h}__workflow-roll-formula`), a.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${h}__workflow-roll-total`), r.textContent = String(t.total), n.append(a, r);
  const o = OE(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function OE(e, t) {
  const n = FE(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-dice-tray`);
  for (const r of BE(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), r.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function FE(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function BE(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? as(e, "highest") : n.includes("kl") ? as(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function as(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function UE(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(VC);
  if (n.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const r of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = r, a.append(o);
  }
  e.append(a);
}
function zE(e, t) {
  t.resistance && (e.setAttribute(pE, t.resistance), t.resistanceSkill && e.setAttribute(gE, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(hE, t.resistanceSkillLabel));
}
function qE(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = jE(t, n);
  r.append(o), s && r.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, a.append(r, l), t.resistanceRollResult && a.append(fu(t.resistanceRollResult)), e.append(a);
}
function jE(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Se())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute($n, t.pendingId), n.setAttribute(eu, "true"), n.setAttribute(tu, e.resistanceSkill), n.setAttribute(nu, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(au, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ru, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ou, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const r = document.createElement("span");
  return r.classList.add(`${h}__resistance-roll-fallback`), r.textContent = "d20", n.append(a, r), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function fu(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = bu(e), t;
}
function GE(e, t, n, a, r) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${a}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Qr, s), l.setAttribute("aria-expanded", "false"), l.textContent = r;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Jc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const g = document.createElement("dd");
    g.textContent = u.value, c.append(m, g);
  }
  e.append(l, c);
}
function VE(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const a of [...t.notes, ...t.details]) {
    const r = document.createElement("span");
    r.textContent = a, n.append(r);
  }
  e.append(n);
}
function HE(e, t) {
  const n = `[${tn}="${Ze(t.id)}"]`, a = e.querySelector(n);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add(uE), r.setAttribute(tn, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, r.append(o), e.append(r), r;
}
function WE(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const a = _u(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function KE(e, t) {
  if (t.length === 0) return;
  const n = YE(e);
  for (const a of t) {
    const r = HC(a);
    if (n.querySelector(`[${Ki}="${Ze(r)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(Ki, r), n.append(o);
  }
}
function YE(e) {
  const t = e.querySelector(`.${Qi}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Qi), e.append(n), n;
}
function XE(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute($n, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(su), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(wn, e.pendingId), t.setAttribute(Xr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(qa, e.choiceGroupId), t.setAttribute(Zc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function QE(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = ZE(e);
  return `${t} → ${n}`;
}
function ZE(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function JE(e) {
  return pu(e) ?? e;
}
function pu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function gu(e, t) {
  const n = Cn(e);
  if (!n) return;
  const a = n.querySelectorAll(sE);
  for (const r of a) {
    if (du(r)) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitBound !== "true" && (r.dataset.paranormalToolkitBound = "true", r.addEventListener("click", () => {
      fC(r, t);
    }));
  }
}
function Ha(e) {
  const t = Cn(e);
  if (!t) return;
  const n = t.querySelectorAll(lE);
  for (const a of n)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      eC(t, a);
    }));
}
function Wa(e) {
  const t = Cn(e);
  if (!t) return;
  const n = t.querySelectorAll(cE);
  for (const a of n) {
    if (!Se()) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      tC(t, a);
    }));
  }
}
function eC(e, t) {
  const n = t.getAttribute(Qr);
  if (!n) return;
  const a = e.querySelector(`[${Jc}="${Ze(n)}"]`);
  if (!a) return;
  const r = a.hidden;
  a.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.textContent = r ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function tC(e, t) {
  if (!Se()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute($n), a = t.getAttribute(tu), r = t.getAttribute(nu) ?? (a ? $e(a) : "Resistência");
  if (!n || !a) return;
  const o = rC(e, n), s = oC(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Wp(s, a);
    await uC(c.roll);
    const u = {
      skill: a,
      skillLabel: r,
      formula: c.formula,
      total: c.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    nC(t, u), aC(t, u), dC(n, u), await mC(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${r}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function nC(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ou, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function aC(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const a = n.querySelector(`.${h}__resistance-roll-result`), r = a ?? fu(t);
  if (a) {
    a.textContent = bu(t);
    return;
  }
  n.append(r);
}
function rC(e, t) {
  const n = Q.get(t);
  if (n) return n;
  const a = En(e);
  return re(a)[t] ?? null;
}
function oC(e, t) {
  const n = e?.resistanceTargetActor;
  if (te(n)) return n;
  const r = e?.context?.targets.map(Ka).find(te) ?? null;
  if (r) return r;
  const o = t.getAttribute(au) ?? e?.resistanceTargetActorId ?? null, s = o ? sC(o) : null;
  return s || lC(
    t.getAttribute(ru) ?? e?.resistanceTargetName ?? iC(t)
  );
}
function iC(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${iu}`)?.textContent ?? null;
  if (!n) return null;
  const a = "→";
  if (!n.includes(a)) return null;
  const r = n.split(a), o = r[r.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Ka(e) {
  const t = e.actor;
  if (te(t)) return t;
  const n = e.token, a = gt(n);
  if (a) return a;
  const r = e.document;
  return gt(r);
}
function gt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (te(t)) return t;
  const n = e.document?.actor;
  return te(n) ? n : null;
}
function sC(e) {
  const n = game.actors?.get?.(e);
  return te(n) ? n : hu().map((o) => gt(o)).find((o) => o?.id === e) ?? null;
}
function lC(e) {
  const t = Fe(e);
  if (!t) return null;
  const n = hu().filter((o) => Fe(cC(o)) === t).map((o) => gt(o)).find(te) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => te(o) && Fe(o.name) === t);
  return te(r) ? r : null;
}
function hu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function cC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : gt(e)?.name ?? null;
}
function Fe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function te(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function bu(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function uC(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function dC(e, t) {
  const n = Q.get(e);
  n && (n.resistanceRollResult = t);
}
async function mC(e, t, n) {
  const a = En(e);
  if (a)
    try {
      const r = re(a), o = r[t];
      if (!o) return;
      r[t] = {
        ...o,
        resistanceRollResult: n
      }, await Qe(a, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", r);
    }
}
function En(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages;
  return ae(a?.get?.(n));
}
async function fC(e, t) {
  if (du(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(wn);
  if (!n) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    yu(e, e.getAttribute(Xr) ?? "✓ Automação aplicada"), pC(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function yu(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(su), e.removeAttribute(wn), e.removeAttribute(Xr);
}
function pC(e) {
  const t = e.getAttribute(qa);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const a = `[${qa}="${Ze(t)}"]`;
  for (const r of n.querySelectorAll(a)) {
    if (r === e) continue;
    const o = r.getAttribute(Zc) ?? "✓ Outra opção escolhida";
    yu(r, o);
  }
}
function _u(e, t) {
  const n = e.map(Jr).filter(jC), a = n.find(($) => $.intent !== "casting") ?? n[0] ?? null;
  if (!a) return null;
  const r = F(e, "Forma"), o = F(e, "Custo"), s = F(e, "Dados") ?? F(e, `Dados (${a.label})`), l = F(e, "Tipo"), c = F(e, "Resistência"), u = F(e, "Resistência Perícia"), m = F(e, "Resistência Rótulo") ?? (u ? $e(u) : null), g = Au(e, "Observação"), _ = e.filter(($) => AC($, a)), k = yC(e), R = gC(t);
  return {
    ...a,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: r,
    cost: o,
    diceBreakdown: s,
    damageType: l,
    resistance: c,
    resistanceSkill: u,
    resistanceSkillLabel: m,
    targetMode: R.mode,
    targetNames: R.names,
    notes: g,
    details: _,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function gC(e) {
  const t = hC(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function hC(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && bC(n) !== "nenhum alvo") : [];
}
function bC(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function yC(e) {
  const t = e.map(Jr).find((o) => o?.intent === "casting") ?? null, n = F(e, "Conjuração DT"), a = F(e, "Conjuração Resultado");
  if (!t || !n || !a) return null;
  const r = Number(n);
  return Number.isFinite(r) ? {
    label: t.formula,
    formula: F(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(r),
    success: a.toLowerCase() === "sucesso",
    diceBreakdown: F(e, "Dados (Conjuração)")
  } : null;
}
function Jr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, a, r] = t, o = Number(r);
  return Number.isFinite(o) ? {
    label: n,
    formula: a,
    total: o,
    intent: _C(n)
  } : null;
}
function _C(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function F(e, t) {
  return Au(e, t)[0] ?? null;
}
function Au(e, t) {
  const n = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(n)) return [];
    const r = a.slice(n.length).trim();
    return r.length > 0 ? [r] : [];
  });
}
function AC(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Jr(e) ? !1 : e.trim().length > 0;
}
function TC(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of Q.values())
    Ya(a, e, t) && n.set(a.pendingId, a);
  for (const a of EC(e))
    Ya(a, e, t) && !n.has(a.pendingId) && n.set(a.pendingId, a);
  return Array.from(n.values()).sort((a, r) => a.createdAt - r.createdAt);
}
function Ya(e, t, n) {
  const a = me(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !rs(n, "itemId", e.itemId) ? !1 : !e.actorId || rs(n, "actorId", e.actorId);
}
function rs(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const a = `data-${WC(t)}`;
  for (const r of e.querySelectorAll(`[${a}]`))
    if (r.getAttribute(a) === n)
      return !0;
  return !1;
}
function RC(e) {
  const t = Ze(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function kC(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ya(e, null, t))
      return t;
  return null;
}
function $C() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, a] of Q.entries())
    e - a.createdAt > t && Q.delete(n);
}
async function os(e, t) {
  const n = En(e);
  if (!n) return !1;
  try {
    const a = re(n);
    return a[t.pendingId] = no(t, me(n)), await Qe(n, a), !0;
  } catch (a) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a), !1;
  }
}
async function eo(e) {
  const t = $u(e);
  if (!t) return !1;
  try {
    const n = re(t);
    return n[e.pendingId] = no(e, me(t)), await Qe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Tu(e) {
  for (const t of bE)
    globalThis.setTimeout(() => {
      Xa(e);
    }, t);
}
async function Xa(e) {
  const t = $u(e);
  if (to(t)?.prompts.some((r) => r.pendingId === e.pendingId))
    return !0;
  const a = await eo(e);
  return a || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), a;
}
async function wC(e, t) {
  const n = ku(e.context.message);
  if (n)
    try {
      const a = re(n), r = a[e.pendingId] ?? no(e, me(n));
      a[e.pendingId] = {
        ...r,
        executedLabel: t ?? r.executedLabel,
        executed: !0
      }, await Qe(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function EC(e) {
  return Object.values(re(ae(e))).filter(Tt);
}
function re(e) {
  if (!e) return {};
  const t = {}, n = to(e);
  for (const a of n?.prompts ?? [])
    t[a.pendingId] = a;
  for (const [a, r] of Object.entries(Ru(e)))
    t[a] ??= r;
  return t;
}
function CC(e) {
  return Object.values(Ru(ae(e))).filter(Tt);
}
function Ru(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Xc);
  if (!Ve(t))
    return {};
  const n = {};
  for (const [a, r] of Object.entries(t))
    Tt(r) && (n[a] = r);
  return n;
}
async function Qe(e, t) {
  typeof e.setFlag == "function" && (await IC(e, t), await SC(e, t));
}
async function SC(e, t) {
  await Promise.resolve(e.setFlag?.(d, Xc, t));
}
function to(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Qc);
  return zC(t) ? t : null;
}
async function IC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Tt).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const a = n[0];
  if (!a) return;
  const r = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: a.messageId ?? me(e) ?? null,
    source: {
      actorId: a.actorId,
      actorName: LC(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Qc, r));
}
function LC(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function no(e, t) {
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
function ku(e) {
  const t = ae(e);
  if (t?.setFlag)
    return t;
  const n = vC(e);
  if (n?.setFlag)
    return n;
  const a = me(e);
  if (!a) return null;
  const r = game.messages;
  return ae(r?.get?.(a));
}
function vC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ae).find((n) => typeof n?.setFlag == "function") ?? null;
}
function $u(e) {
  const t = ku(e.context.message);
  if (t) return t;
  const n = e.messageId ? DC(e.messageId) : null;
  if (n) return n;
  const a = Cu().slice().reverse();
  return a.find((r) => xC(r, e)) ?? a.find((r) => NC(r, e)) ?? null;
}
function DC(e) {
  const t = game.messages;
  return ae(t?.get?.(e));
}
function xC(e, t) {
  const n = me(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!wu(e, t)) return !1;
  const r = Eu(e);
  return !t.actorId || !r || r === t.actorId;
}
function NC(e, t) {
  if (!MC(e, t)) return !1;
  const n = Eu(e);
  return t.actorId && n === t.actorId ? !0 : wu(e, t);
}
function wu(e, t) {
  const n = Fe(PC(e));
  if (!n) return !1;
  const a = Fe(t.itemName);
  if (a && n.includes(a)) return !0;
  const r = Fe(t.itemId);
  return !!(r && n.includes(r));
}
function PC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Eu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function MC(e, t) {
  const n = OC(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= yE;
}
function OC(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ae(e) {
  return e && typeof e == "object" ? e : null;
}
function Tt(e) {
  return Ve(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && j(e.messageId) && j(e.itemId) && j(e.actorId) && j(e.itemName) && ye(e.resistanceTargetActorId) && ye(e.resistanceTargetName) && qC(e.resistanceRollResult) && FC(e.actionPayload) && Zn(e.title) && Zn(e.buttonLabel) && Zn(e.executedLabel) && ye(e.choiceGroupId) && ye(e.skippedLabel) && ye(e.actionSectionId) && ye(e.actionSectionTitle) && GC(e.summaryLines) : !1;
}
function FC(e) {
  return e == null ? !0 : Ve(e) ? e.kind === "resource-operation" && j(e.actorId) && j(e.actorUuid) && typeof e.actorName == "string" && BC(e.resource) && UC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function BC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function UC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function zC(e) {
  return Ve(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && j(e.messageId) && Ve(e.source) && j(e.source.actorId) && j(e.source.actorName) && j(e.source.itemId) && j(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Tt) : !1;
}
function qC(e) {
  return e == null ? !0 : Ve(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ye(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function jC(e) {
  return e !== null;
}
function Ve(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function j(e) {
  return e === null || typeof e == "string";
}
function Zn(e) {
  return e === void 0 || typeof e == "string";
}
function ye(e) {
  return e == null || typeof e == "string";
}
function GC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function VC(e) {
  return typeof e == "string" && e.length > 0;
}
function Cu() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(ae).filter((a) => a !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(ae).filter((a) => a !== null) : [];
}
function Cn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function me(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function HC(e) {
  return e.trim().toLowerCase();
}
function WC(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ze(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const is = 1e3;
class KC {
  constructor(t, n, a, r, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = r, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new ow(
      t,
      n,
      a,
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
      settings: la(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = la();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = tr(t.item);
    if (!a.ok) {
      if (a.error.reason === "missing-automation" && tS(t.item) && n.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const o = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await Ii(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ta(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const r = XC(
      t.item,
      a.value.definition
    );
    switch (n.executionMode) {
      case "ask":
        await this.handleAskMode(t, r, a.value.source);
        return;
      case "automatic":
        await this.executeAutomation(t, r, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const n = this.pendingExecutions.get(t);
    if (!n)
      return this.executePersistedPendingAutomation(t);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(t), await Qn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const a = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return a.ok ? (this.pendingExecutions.delete(t), await Qn(
      t,
      a.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Zr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const a = n.prompt.actionPayload, r = rS(a);
    if (!r)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${a.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Qt(
      this.resources,
      r,
      a.resource,
      a.operation,
      a.amount
    );
    return o.ok ? (await RE(t), await kE(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (AE(
      (t) => this.executePendingAutomation(t)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n, a) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n, a);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Ii(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ta(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      nS(t.item),
      { type: "generic" }
    );
  }
  async handleAssistedRitual(t, n, a) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(t, n, a);
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
        await this.registerCompletedRitualCard(
          r.itemUseContext,
          r.summaryLines
        ), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          xe(r.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          r.itemUseContext,
          r.workflowContext,
          r.actions,
          r.summaryLines
        );
        return;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const r = await this.ritualAssistant.applyAction(t);
      return r.ok ? (n.resourceTransactions.push(r.value), { ok: !0 }) : (this.handleResourceActionFailure(r), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      if (!we())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const r = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return r.ok ? (eS(n, r.value), await Fl(r.value), {
        ok: !0,
        executedLabel: YC(r.value)
      }) : (this.handleDamageActionFailure(r.error), { ok: !1 });
    }
    if (!we())
      return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar efeito assistido."), { ok: !1 };
    const a = await this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration,
      originUuid: t.originUuid,
      source: t.source ?? "item-use.condition-action"
    });
    return a.ok ? (a.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${a.value.warning}`), { ok: !0 }) : (this.handleConditionActionFailure(a), { ok: !1 });
  }
  async resolveAlternativeActions(t) {
    const n = Jn(t.action);
    if (!n) return;
    const a = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, r]) => r.kind === "assisted-action" && Jn(r.action) === n);
    for (const [r, o] of a)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(r), await Qn(
        r,
        ss(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const a = na();
    await TE({
      pendingId: a,
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
  async registerAssistedActions(t, n, a, r) {
    let o;
    for (const s of a) {
      const l = na();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Ji({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Jn(s),
        skippedLabel: ss(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: r,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: aS(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      xe(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const a = na();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ji({
      pendingId: a,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", a);
  }
  async executeAutomation(t, n, a) {
    this.setAttempt(t, "running");
    const r = await this.workflow.runAutomation(n, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: a
        }
      }
    });
    if (!r.ok) {
      this.setAttempt(t, "failed", r.error.reason), this.handleAutomationFailure(r.error);
      return;
    }
    this.setAttempt(t, "completed"), f.info(
      "Automação executada por uso normal de item.",
      xe(r.value.context)
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
    const n = Date.now(), a = ls(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > is && this.recentExecutionKeys.delete(o);
    const r = this.recentExecutionKeys.get(a);
    return r !== void 0 && n - r <= is;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ls(t), Date.now());
  }
  setAttempt(t, n, a, r) {
    this.lastAttempt = ta(
      t,
      n,
      a,
      r
    );
  }
}
function YC(e) {
  return Bl({ inputAmount: e.totalRawDamage });
}
function XC(e, t) {
  if (t.resistance || !QC(t))
    return t;
  const n = Uc(e);
  return n ? { ...t, resistance: n } : t;
}
function QC(e) {
  return ZC(e) && !JC(e);
}
function ZC(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function JC(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Jn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function ss(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function eS(e, t) {
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
function tS(e) {
  return e.type === "ritual";
}
function nS(e) {
  return QR(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function aS(e) {
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
function rS(e) {
  const t = e.actorUuid ? oS(e.actorUuid) : null;
  if (He(t)) return t;
  const n = e.actorId ? iS(e.actorId) : null;
  return n || sS(e.actorName);
}
function oS(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function iS(e) {
  const n = game.actors?.get?.(e);
  if (He(n)) return n;
  for (const a of Su()) {
    const r = ao(a);
    if (r?.id === e) return r;
  }
  return null;
}
function sS(e) {
  const t = ea(e);
  if (!t) return null;
  for (const r of Su()) {
    const o = lS(r);
    if (ea(o) === t) {
      const s = ao(r);
      if (s) return s;
    }
  }
  const a = game.actors?.find?.(
    (r) => He(r) && ea(r.name) === t
  );
  return He(a) ? a : null;
}
function Su() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function lS(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ao(e)?.name ?? null;
}
function ao(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (He(t)) return t;
  const n = e.document?.actor;
  return He(n) ? n : null;
}
function ea(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function He(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ta(e, t, n, a) {
  return {
    source: e.source,
    status: t,
    reason: n,
    pendingId: a,
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
function ls(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function na() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class cS {
  constructor(t, n, a) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = a;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), a = [], r = [], o = yt(t);
    for (const s of n) {
      const l = s.itemId ? o.find((m) => m.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
      if (!l || !c) {
        r.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, c);
      const u = await this.itemPatches.applyPresetItemPatch(l, c);
      a.push({
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
      applied: a,
      skipped: r
    };
  }
}
class uS {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = yt(t).map((l) => this.analyzeRitual(l)), a = n.filter(Nt("upToDate")), r = n.filter(Nt("available")), o = n.filter(Nt("outdated")), s = n.filter(Nt("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: a,
      available: r,
      outdated: o,
      unsupported: s,
      canApply: r.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, a = dS(t);
    return n ? a ? a.source.type !== "preset" ? tt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : a.source.presetId === n.preset.id && a.source.presetVersion === n.preset.version ? tt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : tt({
      ritual: t,
      status: "outdated",
      match: n,
      flag: a,
      reason: mS(a, n.preset)
    }) : tt({
      ritual: t,
      status: "available",
      match: n,
      flag: a,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : tt({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: a,
      reason: a ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function tt(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? on(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function dS(e) {
  const t = e.getFlag(d, "automation");
  return nr(t) ? t : null;
}
function mS(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Nt(e) {
  return (t) => t.status === e;
}
class fS {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), a = rr(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: a,
      flags: {
        [d]: {
          resourceTransaction: a
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = Pt(t.actorName), a = Pt(t.resource), r = Pt(pS(t)), o = Pt(gS(t));
    return `
      <section class="${d}-card ${d}-resource-card">
        <header class="${d}-card__header">
          <strong>${r}</strong>
          <span>${n}</span>
        </header>
        <div class="${d}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${a}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
}
function pS(e) {
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
function gS(e) {
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
function Pt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function hS() {
  const e = new wT(), t = new AR(e), n = new pl(new fl()), a = new gl(new _r()), r = new TR(new Ic()), o = new ST(), s = new jT(o), l = new KT(e), c = new XT(), u = c.registerMany(
    Ed()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new YT(), g = new HT(), _ = kl(), k = new yl(_), R = new uS(
    c
  ), $ = new cS(
    R,
    m,
    g
  ), b = new wR(), L = new fS(b), A = new $R(), B = new _R(), x = new bR(
    t,
    s,
    L,
    A
  ), H = new kR(x, A), v = new KC(
    H,
    t,
    s,
    n,
    k,
    b,
    B
  );
  return v.addStrategy(
    new Xs(
      (q) => v.handleItemUsed(q)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: o,
    ritualCosts: s,
    resources: t,
    damage: n,
    resistance: a,
    ritualCasting: r,
    automationRegistry: c,
    automationBinder: m,
    itemPatches: g,
    conditionRegistry: _,
    conditions: k,
    debugOutput: b,
    chatMessages: L,
    workflowHooks: A,
    ritualEvents: B,
    automation: x,
    workflow: H,
    itemUseIntegration: v,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: bS } = foundry.applications.api;
class an extends bS {
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
      apply: an.onApply,
      cancel: an.onCancel
    }
  };
  async _renderHTML(t, n) {
    const a = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), r = document.createElement("div");
    return r.className = "paranormal-toolkit-preset-manager", r.innerHTML = this.renderContent(a), r;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${J(Ts)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${J(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${aa("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${aa("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${aa("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, n = this.lastApplicationResult.skipped.length, a = n > 0 ? ` ${n} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${a}</span>
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
        const a = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${a} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function aa(e, t, n, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
        <span>${J(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? yS(n) : AS(t)}
    </section>
  `;
}
function yS(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(_S).join("")}</ol>`;
}
function _S(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", a = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${J(e.appliedPresetId)} v${J(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${J(e.itemName)}</strong>
        <span>${J(e.reason)}</span>
        ${a}
      </div>
      <em>${J(n)}</em>
    </li>
  `;
}
function AS(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${J({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function J(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const rn = `${d}.manageRitualPresets`, cs = `__${d}_ritualPresetHeaderControlRegistered`, TS = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function RS(e) {
  const t = globalThis;
  if (!t[cs]) {
    for (const n of TS)
      Hooks.on(n, (a, r) => {
        kS(a, r, e);
      });
    t[cs] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function kS(e, t, n) {
  Array.isArray(t) && wS(e) && ($S(e, n), !t.some((a) => a.action === rn) && t.push({
    action: rn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), Iu(e, n);
    }
  }));
}
function $S(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[rn] && (e.options.actions[rn] = (n) => {
    n.preventDefault(), n.stopPropagation(), Iu(e, t);
  }));
}
function wS(e) {
  if (!game.user?.isGM) return !1;
  const t = Lu(e);
  return t ? t.type === "agent" && yt(t).length > 0 : !1;
}
function Iu(e, t) {
  const n = Lu(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new an(n, t).render({ force: !0 });
}
function Lu(e) {
  return us(e.actor) ? e.actor : us(e.document) ? e.document : null;
}
function us(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Qa = "data-paranormal-toolkit-stylesheet";
function Za(e) {
  const t = LS(e), n = ES(t), a = SS(n), r = CS(n, t);
  if (r)
    return r.href = a, r.setAttribute(Qa, t), r;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = a, o.setAttribute(Qa, t), document.head.append(o), o;
}
function ES(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, a = n.getRoute;
  return typeof a == "function" ? a.call(n, t) : t;
}
function CS(e, t) {
  const n = ds(e);
  for (const a of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (a.getAttribute(Qa) === t || ds(a.href) === n)
      return a;
  return null;
}
function SS(e) {
  const t = IS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function IS() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function ds(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function LS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Ae(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const a = document.createElement("span");
  return a.textContent = e, n.append(a, t), n;
}
function Ja(e, t, n) {
  const a = document.createElement("input");
  return a.type = "text", a.value = e, a.placeholder = t, a.disabled = !n, a;
}
function qt(e, t, n) {
  const a = document.createElement("button");
  a.type = "button", n && a.classList.add(n);
  const r = document.createElement("i");
  r.className = t;
  const o = document.createElement("span");
  return o.textContent = e, a.append(r, o), a;
}
function vu(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const a = document.createElement("i");
  return a.className = t, n.append(a), n;
}
function nt(e, t, n = !1) {
  const a = document.createElement("option");
  return a.value = e, a.textContent = t, a.selected = n, a;
}
function vS(e) {
  const { roll: t, index: n, editable: a, onChange: r, onRemove: o } = e, s = document.createElement("article");
  s.classList.add(`${d}-ability-roll-config__card`), s.dataset.abilityRollId = t.id;
  const l = document.createElement("header");
  l.classList.add(`${d}-ability-roll-config__card-header`);
  const c = document.createElement("div");
  c.classList.add(`${d}-ability-roll-config__card-title`);
  const u = document.createElement("strong");
  u.textContent = `Rolagem ${n + 1}`;
  const m = document.createElement("span");
  c.append(u, m);
  const g = vu("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !a, g.addEventListener("click", o), l.append(c, g);
  const _ = document.createElement("div");
  _.classList.add(`${d}-ability-roll-config__fields`);
  const k = Ja(
    t.label,
    "Ex.: Dano adicional",
    a
  );
  k.addEventListener("input", () => {
    t.label = k.value, r();
  }), _.append(Ae("Nome da rolagem", k));
  const R = document.createElement("select");
  R.disabled = !a;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      nt(
        C,
        Qm(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = PS(R.value), kt(), r();
  }), _.append(Ae("Tipo da rolagem", R));
  const $ = document.createElement("div");
  $.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), _.append($);
  const b = document.createElement("section");
  b.classList.add(
    `${d}-ability-roll-config__formula-section`
  );
  const L = document.createElement("div");
  L.classList.add(
    `${d}-ability-roll-config__formula-header`
  );
  const A = document.createElement("strong");
  A.textContent = "Fórmula";
  const B = document.createElement("label");
  B.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const x = document.createElement("input");
  x.type = "checkbox", x.checked = t.formula.mode === "nex", x.disabled = !a;
  const H = document.createElement("span");
  H.textContent = "Varia conforme o NEX", B.append(x, H), L.append(A, B);
  const v = document.createElement("div");
  return v.classList.add(`${d}-ability-roll-config__formula`), b.append(L, v), x.addEventListener("change", () => {
    t.formula = x.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: xS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, q(), fe(), r();
  }), s.append(l, _, b), q(), kt(), fe(), s;
  function q() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function kt() {
    $.replaceChildren();
    const C = t.intent === "damage";
    if (_.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), $.hidden = !C, !C) return;
    const w = document.createElement("select");
    w.disabled = !a, w.append(nt("", "—", !t.damageType));
    for (const { value: S, label: U } of Zs)
      w.append(nt(S, U, t.damageType === S));
    w.addEventListener("change", () => {
      t.damageType = w.value || null, r();
    }), $.append(Ae("Tipo de dano", w));
  }
  function fe() {
    if (v.replaceChildren(), t.formula.mode === "fixed") {
      const W = Ja(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        a
      );
      W.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = W.value, r());
      }), v.append(Ae("Expressão", W));
      return;
    }
    const C = t.formula, w = document.createElement("select");
    w.disabled = !a, w.append(
      nt(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        C.resolution === "highest-unlocked"
      ),
      nt(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        C.resolution === "choose-unlocked"
      )
    ), w.addEventListener("change", () => {
      C.resolution = MS(w.value), r();
    }), v.append(Ae("Comportamento", w));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((W, $t) => {
      S.append(
        DS({
          step: W,
          editable: a,
          onChange: r,
          onRemove: () => {
            C.steps.splice($t, 1), fe(), r();
          }
        })
      );
    }), v.append(S);
    const U = qt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    U.disabled = !a || C.steps.length >= fa, U.addEventListener("click", () => {
      C.steps.length >= fa || (C.steps.push({
        minNex: NS(
          C.steps.map((W) => W.minNex)
        ),
        formula: ""
      }), fe(), r());
    }), v.append(U);
  }
}
function DS(e) {
  const { step: t, editable: n, onChange: a, onRemove: r } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = OS(Number(s.value)), s.value = String(t.minNex), a();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = Ja(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, a();
  });
  const m = vu("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", r), o.append(
    Ae("NEX mínimo", l),
    Ae("Fórmula", u),
    m
  ), o;
}
function xS(e) {
  const t = jm(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function NS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function PS(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function MS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function OS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function FS(e) {
  let t = ra(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const a = BS(t), r = document.createElement("p");
  r.classList.add(`${d}-ability-roll-config__hint`), r.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = qt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= ma || (t.rolls.push(el(t.rolls.length + 1)), _(), L("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = qt("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = qt("Limpar", "fa-solid fa-eraser");
  l.append(c, u);
  const m = document.createElement("footer");
  m.classList.add(`${d}-ability-roll-config__footer`), m.append(s, l);
  const g = document.createElement("p");
  return g.classList.add(`${d}-ability-roll-config__status`), g.textContent = e.editable ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", n.append(a, r, o, m, g), c.addEventListener("click", () => {
    e.editable && k();
  }), u.addEventListener("click", () => {
    e.editable && R();
  }), _(), n;
  function _() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const A = document.createElement("p");
      A.classList.add(`${d}-ability-roll-config__empty`), A.textContent = "Nenhuma rolagem configurada.", o.append(A);
    } else
      t.rolls.forEach((A, B) => {
        o.append(
          vS({
            roll: A,
            index: B,
            editable: e.editable,
            onChange: () => {
              er(a, t), L("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(B, 1), _(), L("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    er(a, t), b(!1);
  }
  async function k() {
    $(!0), L("Salvando configuração...");
    try {
      const A = dr(t);
      if (!A) throw new Error("Configuração inválida.");
      t = ra(await e.onSave(A)), _(), L("Configuração salva.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        A
      ), L("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      $(!1);
    }
  }
  async function R() {
    $(!0), L("Limpando configuração...");
    try {
      t = ra(await e.onClear()), _(), L("Configuração removida.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        A
      ), L("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      $(!1);
    }
  }
  function $(A) {
    n.classList.toggle(`${d}-ability-roll-config--busy`, A), b(A);
  }
  function b(A) {
    c.disabled = A || !e.editable, u.disabled = A || !e.editable, s.disabled = A || !e.editable || t.rolls.length >= ma;
  }
  function L(A) {
    g.textContent = A;
  }
}
function BS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const a = document.createElement("strong");
  a.textContent = "Paranormal Toolkit";
  const r = document.createElement("span");
  r.textContent = "Fórmulas de rolagem", n.append(a, r);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), er(t, e), t;
}
function er(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = Zm(t) ? "Configurada" : "Rascunho");
}
function ra(e) {
  return JSON.parse(JSON.stringify(e));
}
const US = "[data-paranormal-toolkit-ability-roll-config]", ms = `__${d}_abilityRollConfigBlockRegistered`, zS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function qS() {
  const e = globalThis;
  if (!e[ms]) {
    Za("styles/ability-roll-config.css");
    for (const t of zS)
      Hooks.on(t, (...n) => {
        jS(n[0], n[1]);
      });
    e[ms] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function jS(e, t) {
  const n = VS(e);
  if (!n || n.type !== "ability") return;
  const a = WS(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!r) return;
  for (const s of Array.from(
    r.querySelectorAll(US)
  ))
    s.remove();
  const o = FS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Vm(n),
    editable: HS(n),
    onSave: async (s) => {
      const l = await Hm(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Wm(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), Js())
  });
  GS(r, o);
}
function GS(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function VS(e) {
  return fs(e.item) ? e.item : fs(e.document) ? e.document : null;
}
function HS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function WS(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function fs(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Du = "data-paranormal-toolkit-ritual-roll-config", Rt = "data-paranormal-toolkit-ritual-roll-field", Ee = "data-paranormal-toolkit-ritual-roll-action", ps = `__${d}_ritualRollConfigBlockRegistered`, KS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], YS = [
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
function XS() {
  const e = globalThis;
  if (!e[ps]) {
    QS();
    for (const t of KS)
      Hooks.on(t, (...n) => {
        ZS(n[0], n[1]);
      });
    e[ps] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function QS() {
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
function ZS(e, t) {
  const n = mI(e);
  if (!n || n.type !== "ritual") return;
  const a = gI(t);
  if (!a) return;
  const r = a.querySelector('section[data-tab="ritualAttr"]');
  if (!r) return;
  eI(r);
  const o = Nu(n), s = Bc(n), l = fI(n), c = tI(n, s, o, l);
  sI(c, n, o, l), JS(r, c), ro(c);
}
function JS(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function eI(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Du}]`)))
    t.remove();
}
function tI(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config`), r.setAttribute(Du, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(gs("strong", "Paranormal Toolkit")), s.append(gs("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Mu(t) ? "Configurada" : "Rascunho", o.append(s, l), r.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", r.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(nI(t, a)), u.append(aI(t, a)), u.append(rI(t, a)), r.append(u), r.append(oI(t, n, a)), r.append(iI(a));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = a ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", r.append(m), r;
}
function nI(e, t) {
  const n = Sn("Tipo da rolagem"), a = document.createElement("select");
  a.setAttribute(Rt, "intent"), a.disabled = !t;
  for (const r of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = r, o.textContent = XR(r), o.selected = e.intent === r, a.append(o);
  }
  return n.append(a), n;
}
function aI(e, t) {
  const n = Sn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const a = document.createElement("select");
  a.setAttribute(Rt, "damageType"), a.disabled = !t;
  const r = document.createElement("option");
  r.value = "", r.textContent = "—", r.selected = !e.damageType, a.append(r);
  for (const o of YS) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, a.append(s);
  }
  return n.append(a), n;
}
function rI(e, t) {
  const n = Sn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const a = document.createElement("input");
  return a.type = "text", a.placeholder = "Resultado", a.value = e.utilityLabel ?? "Resultado", a.disabled = !t, a.setAttribute(Rt, "utilityLabel"), n.append(a), n;
}
function oI(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config__forms-section`);
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-roll-config__forms-title`), r.textContent = "Fórmulas por forma", a.append(r);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(oa("base", "Padrão", e.forms.base.formula, !0, n)), o.append(oa("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(oa("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), a.append(o), a;
}
function oa(e, t, n, a, r) {
  const o = Sn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !r || !a, s.setAttribute(Rt, `formula.${e}`), o.append(s), !a) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function iI(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(Ee, "save");
  const a = document.createElement("button");
  return a.type = "button", a.textContent = "Limpar", a.disabled = !e, a.setAttribute(Ee, "clear"), t.append(n, a), t;
}
function Sn(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function gs(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function sI(e, t, n, a) {
  Je(e, "intent")?.addEventListener("change", () => ro(e)), ys(e, "system.studentForm")?.addEventListener("change", () => hs(e, t)), ys(e, "system.trueForm")?.addEventListener("change", () => hs(e, t)), e.querySelector(`[${Ee}="save"]`)?.addEventListener("click", () => {
    a && lI(e, t, n);
  }), e.querySelector(`[${Ee}="clear"]`)?.addEventListener("click", () => {
    a && cI(e, t);
  });
}
async function lI(e, t, n) {
  const a = e.querySelector(`[${Ee}="save"]`);
  a?.setAttribute("disabled", "true"), Be(e, "Salvando configuração...");
  try {
    const r = uI(e, n);
    await KR(t, r), xu(e, r), Be(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", r), Be(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    a?.removeAttribute("disabled");
  }
}
async function cI(e, t) {
  const n = e.querySelector(`[${Ee}="clear"]`);
  n?.setAttribute("disabled", "true"), Be(e, "Limpando configuração...");
  try {
    await YR(t);
    const a = Bc(t);
    dI(e, a), xu(e, a), Be(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", a), Be(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function xu(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Mu(t) ? "Configurada" : "Rascunho");
}
function uI(e, t) {
  return {
    schemaVersion: 1,
    intent: Pu(Je(e, "intent")?.value),
    damageType: _s(e, "damageType"),
    utilityLabel: _s(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: jt(e, "formula.base") },
      discente: { formula: jt(e, "formula.discente") },
      verdadeiro: { formula: jt(e, "formula.verdadeiro") }
    }
  };
}
function dI(e, t) {
  De(e, "intent", t.intent), De(e, "damageType", t.damageType ?? ""), De(e, "utilityLabel", t.utilityLabel ?? "Resultado"), De(e, "formula.base", t.forms.base.formula), De(e, "formula.discente", t.forms.discente.formula), De(e, "formula.verdadeiro", t.forms.verdadeiro.formula), ro(e);
}
function ro(e) {
  const t = Pu(Je(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), a = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const r of Array.from(n))
    r.hidden = t !== "damage";
  for (const r of Array.from(a))
    r.hidden = t !== "utility";
}
function hs(e, t) {
  const n = Nu(t);
  bs(e, "discente", n.discente), bs(e, "verdadeiro", n.verdadeiro);
}
function bs(e, t, n) {
  const a = Je(e, `formula.${t}`);
  if (!a) return;
  const r = !e.querySelector(`[${Ee}="save"]`)?.disabled;
  a.disabled = !r || !n;
  const o = a.closest(`.${d}-ritual-roll-config__field`), s = o?.querySelector("small");
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
function Be(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Nu(e) {
  const t = pI(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function mI(e) {
  return As(e.item) ? e.item : As(e.document) ? e.document : null;
}
function fI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function pI(e) {
  const t = e.system;
  return hI(t) ? t : {};
}
function ys(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Je(e, t) {
  return e.querySelector(`[${Rt}="${bI(t)}"]`);
}
function jt(e, t) {
  return Je(e, t)?.value.trim() ?? "";
}
function _s(e, t) {
  const n = jt(e, t);
  return n.length > 0 ? n : null;
}
function De(e, t, n) {
  const a = Je(e, t);
  a && (a.value = n);
}
function Pu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Mu(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function gI(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function As(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function hI(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function bI(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Z = null;
Hooks.once("init", () => {
  Za("styles/components/chat-card-components.css"), Za("styles/components/component-gallery.css"), Im(), Rd(), em(), cp(), mT(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ho.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ho.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Z = hS(), Z.itemUseIntegration.registerStrategies(), Jf(Z.resources, Z.resourceAdapter), op(Z.conditions), Lm(Z), yT(), RS(Z), XS(), qS(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function yI() {
  if (!Z)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Z;
}
export {
  yI as getToolkitServices
};
//# sourceMappingURL=main.js.map
