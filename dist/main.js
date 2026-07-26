const d = "paranormal-toolkit", Es = "Paranormal Toolkit", Mu = "ordemparanormal";
class ht {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function sn(e) {
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
  const t = ta(e);
  return t.ok ? y(t.value.definition) : t;
}
function ta(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : na(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Ou(e) {
  return na(e.getFlag(d, "automation"));
}
function na(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Bu(t.source) && Fu(t.definition);
}
function Fu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Uu) && (t.ritualForms === void 0 || Hu(t.ritualForms)) && (t.conditionApplications === void 0 || Qu(t.conditionApplications));
}
function Bu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Uu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return zu(t);
    case "spendRitualCost":
      return qu(t);
    case "rollFormula":
      return Gu(t);
    case "modifyResource":
      return ju(t);
    case "chatCard":
      return Vu(t);
    default:
      return !1;
  }
}
function zu(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ws(t);
}
function qu(e) {
  return e.type === "spendRitualCost";
}
function Gu(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || ad(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function ju(e) {
  const t = e;
  return t.type === "modifyResource" && Cs(t.actor) && nd(t.resource) && rd(t.operation) && ws(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Vu(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Hu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Wu(a)
  );
}
function Wu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || id(t.extraCost)) && (t.rollFormulaOverrides === void 0 || ld(t.rollFormulaOverrides)) && (t.notes === void 0 || sd(t.notes)) && (t.targeting === void 0 || Ku(t.targeting));
}
function Ku(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Xu(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Yu(t.template));
}
function Yu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || so(t.distance)) && (t.width === void 0 || t.width === null || so(t.width));
}
function Xu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Qu(e) {
  return Array.isArray(e) && e.every(Zu);
}
function Zu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Cs(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || ed(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Ju(t.applyOnResistance));
}
function Ju(e) {
  return e === "failure" || e === "success" || e === "always";
}
function ed(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || od(t.rounds)) && (t.expiry === void 0 || t.expiry === null || td(t.expiry));
}
function td(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ws(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Cs(e) {
  return e === "self" || e === "target";
}
function nd(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function rd(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ad(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function od(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function id(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function so(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function sd(e) {
  return Array.isArray(e) && e.every(w);
}
function ld(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function ra(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(lo);
    if (dd(t))
      return Array.from(t).filter(lo);
  }
  return [];
}
function cd(e) {
  return ra(e)[0] ?? null;
}
function ud(e) {
  return ra(e).find(Ou) ?? null;
}
function dd(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function lo(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function yt(e) {
  return ra(e).filter((t) => t.type === "ritual");
}
function Ss(e) {
  return yt(e)[0] ?? null;
}
function md(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(sn);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = rt("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Et(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(mo);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = rt("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Et(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await sr(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = rt("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Et(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await sr(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: mo(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return co(e);
    },
    async applyBestPresetsToActorRituals() {
      return co(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = rt("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Et(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function co(e) {
  const t = rt("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = yt(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), uo(t);
  const r = uo(t, n.length);
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
    const s = await sr(e, a, o.preset);
    r.applied.push(fd(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), pd(r), r;
}
async function sr(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function fd(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: sn(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function uo(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function pd(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function mo(e) {
  return {
    preset: sn(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function rt(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Et(e) {
  const t = Ss(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function De(e) {
  return e ? {
    id: e.id,
    source: {
      ...gd(e.sourceActor),
      token: e.sourceToken
    },
    item: hd(e.item),
    targets: e.targets.map(bd),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: fo(e.rollRequests, Is),
    rolls: fo(e.rolls, yd),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(aa),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function aa(e) {
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
function gd(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function hd(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function bd(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Is(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function yd(e) {
  return {
    ...Is(e),
    total: e.total
  };
}
function fo(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function _d(e) {
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
      await Ie(
        e,
        "Gasto de PE",
        pe("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Ie(
        e,
        "Gasto de PD",
        pe("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Ie(
        e,
        "Dano em PV",
        pe("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Ie(
        e,
        "Cura de PV",
        pe("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Ie(
        e,
        "Dano em SAN",
        pe("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Ie(
        e,
        "Recuperação de SAN",
        pe("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Ie(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    Ad(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, aa(o));
}
function pe(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ad(e) {
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
function Td() {
  wt(ee.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), wt(ee.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), wt(ee.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), wt(ee.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function lr() {
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
function wt(e, t) {
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
function Rd() {
  return {
    status() {
      return lr();
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
const Ls = "ritual.costOnly", vs = "ritual.simpleHealing", kd = "ritual.eletrocussao", $d = "ritual.definhar", Ds = "ritual.simpleDamage", xs = "generic.simpleHealing", Ns = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, oa = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ed() {
  return [
    wd(),
    Cd(),
    Sd(),
    Id(),
    Ld(),
    vd()
  ];
}
function wd() {
  return {
    id: Ls,
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
function Cd() {
  return {
    id: vs,
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
    automation: Ps(),
    itemPatch: Pd()
  };
}
function Sd() {
  return {
    id: kd,
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
    automation: xd(),
    itemPatch: Od()
  };
}
function Id() {
  return {
    id: $d,
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
    automation: Nd(),
    itemPatch: Md()
  };
}
function Ld() {
  return {
    id: Ds,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ia()
  };
}
function vd() {
  return {
    id: xs,
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
function Ps(e = Ns) {
  const t = Dd(e);
  return Ms(
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
function Dd(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Ns,
    ...e
  };
}
function xd() {
  return {
    ...ia("3d6", {
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
function Nd() {
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
function ia(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ms(
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
function Pd() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: oa,
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
function Md() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: oa,
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
function Od() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: oa,
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
function Ms(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function sa() {
  return Array.from(game.user?.targets ?? []).map(Os);
}
function Os(e) {
  return {
    tokenId: xe(e.id),
    actorId: xe(e.actor?.id),
    sceneId: xe(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Fs() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: xe(e.id),
    actorId: xe(t?.id),
    sceneId: xe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function xe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Fd(e) {
  return {
    logFirstRitualCost() {
      const t = ge("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = he(t);
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
      const r = ge("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = he(r);
      if (a) {
        if (!zd(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await a.setFlag(d, "ritual.cost", {
          resource: n,
          amount: t
        }), f.info(`Custo customizado aplicado em ${a.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${t} ${n}.`);
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
      const r = e.automationRegistry.require(Ls);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = ge("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = he(n);
      if (!r) return;
      if (!po(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(vs);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Ps(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = ge("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = he(n);
      if (!r) return;
      if (!po(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Ds);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: ia(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ge("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = he(t);
      n && await Bd(e, t, n);
    }
  };
}
async function Bd(e, t, n) {
  const r = bt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Fs(),
    item: n,
    targets: sa()
  });
  if (!a.ok) {
    Ud(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", De(a.value.context));
}
function Ud(e) {
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
  const t = Ss(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function zd(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function po(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const qd = ["strict", "open"], Bs = "strict";
function Gd(e) {
  return qd.includes(e) ? e : Bs;
}
function jd(e) {
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
function ln(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Vd = ["disabled", "ask", "automatic"], Hd = ["buttons", "confirm"], Us = "ask";
function Wd(e) {
  return typeof e == "string" && Vd.includes(e);
}
function Kd(e) {
  return typeof e == "string" && Hd.includes(e);
}
function Yd(e) {
  return Wd(e) ? e : Kd(e) ? "ask" : Us;
}
const Xd = ["keep", "replace"], Qd = ["manual", "assisted"], zs = "keep", qs = "assisted", Zd = !0, P = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Jd() {
  game.settings.register(d, P.executionMode, {
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
    default: Us
  }), game.settings.register(d, P.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: zs
  }), game.settings.register(d, P.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: qs
  }), game.settings.register(d, P.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Bs
  }), game.settings.register(d, P.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Zd
  }), game.settings.register(d, P.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function cr() {
  const e = Yd(game.settings.get(d, P.executionMode)), t = Vs(game.settings.get(d, P.systemCardMode)), n = Hs(game.settings.get(d, P.damageResolutionMode)), r = la();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: js()
  };
}
function Gs() {
  return Vs(game.settings.get(d, P.systemCardMode));
}
function em() {
  return Hs(game.settings.get(d, P.damageResolutionMode));
}
function la() {
  return Gd(game.settings.get(d, P.resistanceGateMode));
}
function js() {
  return game.settings.get(d, P.ritualCastingCheckEnabled) === !0;
}
async function be(e) {
  await game.settings.set(d, P.executionMode, e);
}
function Vs(e) {
  return Xd.includes(e) ? e : zs;
}
function Hs(e) {
  return Qd.includes(e) ? e : qs;
}
function tm(e) {
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
const nm = [
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
      return nm;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = vn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ud(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await go(e, t, n);
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
      if (!im(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = om(n) ?? vn("Nenhum ator encontrado para executar automação do item.");
      r && await go(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = vn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = cd(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(xs);
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
async function go(e, t, n) {
  const r = bt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Fs(),
    item: n,
    targets: sa()
  });
  if (!a.ok) {
    am(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", De(a.value.context));
}
function am(e) {
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
function vn(e) {
  const t = ht.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function om(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function im(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function sm(e) {
  const t = _d(e), n = md(e), r = Fd(e), a = rm(e), o = Rd(), s = tm(e);
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
const Ot = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function lm(e) {
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
      const r = ho();
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
      return cm(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = ho();
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
      return um(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function ho() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function cm(e) {
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
function um(e) {
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
function W(e) {
  return e.replace(
    /[&<>"']/g,
    (t) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[t] ?? t
  );
}
function dm(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${W(e.label)}</span>`;
}
const mm = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function fm(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${W(t)}" alt="${W(e?.alt ?? "")}">` : mm;
}
function pm(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${W(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(dm).join("")}</div>` : "", r = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${W(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${fm(e.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${W(e.title)}</span>${t}
      </div>${n}
    </div>${r}
  </div>
</header>`;
}
function cn(e) {
  return `<article class="paranormal-toolkit-chat-card-shell">${e.content}</article>`;
}
const bo = {
  section: "paranormal-toolkit-roll-row__result--section",
  success: "paranormal-toolkit-roll-row__result--success",
  failure: "paranormal-toolkit-roll-row__result--failure"
};
function gm(e) {
  return bo[e ?? "section"] ?? bo.section;
}
function hm(e) {
  const t = `<span class="paranormal-toolkit-roll-row__formula-text">${W(e.formula)}</span>`;
  if (!e.diceResults?.length)
    return `<div class="paranormal-toolkit-roll-row__formula paranormal-toolkit-roll-row__formula--static">${t}</div>`;
  const n = e.diceResults.map(
    (a) => `<span class="paranormal-toolkit-roll-row__die">${W(String(a))}</span>`
  ).join("");
  return `<details class="paranormal-toolkit-roll-row__details"${e.expanded ? " open" : ""}>
  <summary class="paranormal-toolkit-roll-row__formula">${t}<span class="paranormal-toolkit-roll-row__chevron" aria-hidden="true"></span></summary>
  <div class="paranormal-toolkit-roll-row__breakdown" aria-label="Resultados dos dados">${n}</div>
</details>`;
}
function bm(e) {
  const t = e.total !== void 0, n = t ? "with-result" : "without-result", r = t ? W(String(e.total)) : "", a = t ? `<output class="paranormal-toolkit-roll-row__result ${gm(e.resultTone)}" aria-label="Resultado: ${r}">${r}</output>` : "";
  return `<div class="paranormal-toolkit-roll-row paranormal-toolkit-roll-row--${n}">${hm(e)}${a}</div>`;
}
const yo = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  resistance: "paranormal-toolkit-section-card--resistance"
};
function ym(e) {
  return yo[e] ?? yo.casting;
}
function ca(e) {
  return `<section class="paranormal-toolkit-section-card ${ym(e.tone)}">${e.content}</section>`;
}
function ua(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${W(e.title)}</span>${t}</div>`;
}
const _o = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure"
}, _m = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA"
};
function da(e) {
  const t = _o[e.state] ? e.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${_o[t]}">${_m[t]}</span>`;
}
const Ws = "devChatCardExample", Am = "devChatCardHeaderExample";
function Je() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function Tm() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", r = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", a = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof a == "string" ? { src: a, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${r}`
  };
}
function Rm(e) {
  return e === "runtime" ? Tm() : e === "ability" ? {
    title: "Habilidade Genérica",
    subtitle: "Habilidade",
    badges: [{ label: "HABILIDADE", tone: "wine" }],
    context: "Mercy → Cultista"
  } : {
    title: e === "long-title" ? "Eletrocussão Extraordinariamente Prolongada para Validar a Quebra Natural do Título" : "Eletrocussão",
    subtitle: "Padrão",
    badges: [{ label: "ENERGIA 1" }],
    context: {
      single: "Mercy → Malvadão",
      none: "Mercy → Nenhum alvo",
      multi: "Mercy → 3 alvos",
      "long-title": "Mercy → Malvadão",
      "long-context": "Mercy → Criatura paranormal com um nome excepcionalmente longo para validar a quebra natural do contexto"
    }[e]
  };
}
function km(e) {
  switch (e) {
    case "casting-title":
      return { tone: "casting", title: "Conjuração" };
    case "casting-badge":
      return {
        tone: "casting",
        title: "Conjuração",
        trailing: da({ state: "success" })
      };
    case "damage-text":
      return {
        tone: "damage",
        title: "Dano",
        trailing: '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>'
      };
    case "resistance-button":
      return {
        tone: "resistance",
        title: "Resistência",
        trailing: '<button class="paranormal-toolkit-section-header__demo-button" type="button" aria-label="Botão visual de demonstração">◇</button>'
      };
  }
}
function $m(e) {
  const t = km(e);
  return cn({
    content: ca({
      tone: t.tone,
      content: ua({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function Em(e) {
  return cn({
    content: ca({
      tone: "casting",
      content: ua({
        title: "Conjuração",
        trailing: da({ state: e })
      })
    })
  });
}
function wm(e) {
  const t = e.startsWith("with-result"), n = e.startsWith("damage"), r = e === "with-result-failure", a = t ? {
    formula: "1d20 + 10 + 5",
    total: r ? 17 : 23,
    resultTone: r ? "failure" : "success",
    diceResults: [r ? 2 : 8]
  } : n ? {
    formula: "3d6",
    total: 9,
    resultTone: "section",
    diceResults: [2, 3, 4],
    expanded: e === "damage-expanded"
  } : {
    formula: "1d20 + 4",
    diceResults: [17],
    expanded: e === "without-result-expanded"
  }, o = n ? "damage" : t ? "casting" : "resistance", s = n ? "Dano" : t ? "Conjuração" : "Resistência", l = n ? '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>' : t ? da({ state: r ? "failure" : "success" }) : void 0;
  return cn({
    content: ca({
      tone: o,
      content: ua({ title: s, trailing: l }) + bm(a)
    })
  });
}
function St(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [d]: { [Ws]: t } }
  });
}
function Cm() {
  const e = async () => {
    Je();
    const n = (game.messages.contents ?? []).filter(
      (r) => typeof r.getFlag?.(d, Ws) == "string" || r.getFlag?.(d, Am) === !0
    );
    await Promise.all(
      n.map(
        (r) => r.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return Je(), St(
        cn({
          content: pm(Rm(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      Je();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (r) => St($m(r), "section")
        )
      );
    },
    async postStatusBadgeExample(t) {
      Je();
      const n = t === "both" ? ["success", "failure"] : [t];
      return Promise.all(
        n.map(
          (r) => St(Em(r), "status")
        )
      );
    },
    async postRollRowExample(t) {
      Je();
      const n = t === "all" ? [
        "with-result-success",
        "with-result-failure",
        "damage-collapsed",
        "damage-expanded",
        "without-result-collapsed",
        "without-result-expanded"
      ] : [t];
      return Promise.all(
        n.map(
          (r) => St(wm(r), "roll-row")
        )
      );
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function Sm(e) {
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
    conditions: lm(e.conditions),
    debug: sm(e),
    dev: Cm(),
    hooks: Ot
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const r = game.modules.get(d);
  return r && (r.api = t), t;
}
class Ao {
  static isSupportedSystem() {
    return game.system.id === Mu;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const Dn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Im(e) {
  if (!Pm(e.item)) return null;
  const t = ur(e.actor) ? e.actor : Lm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Dm(e.token) ?? vm(t),
    targets: sa(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Lm(e) {
  const t = e;
  return ur(t.actor) ? t.actor : ur(e.parent) ? e.parent : null;
}
function vm(e) {
  const t = xm(e) ?? Nm(e);
  return t ? Ks(t) : null;
}
function Dm(e) {
  return dr(e) ? Ks(e) : null;
}
function xm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return dr(n) ? n : (t.getActiveTokens?.() ?? []).find(dr) ?? null;
}
function Nm(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ks(e) {
  const t = e.actor ?? null;
  return {
    tokenId: xn(e.id),
    actorId: xn(t?.id),
    sceneId: xn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Pm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ur(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function dr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function xn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Ys {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Dn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${Dn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Im(Mm(t));
    if (!n) {
      f.warn(`${Dn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Mm(e) {
  return e && typeof e == "object" ? e : {};
}
function Vt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function ma() {
  const e = globalThis.game;
  return un(e) ? e : null;
}
function K(e, t) {
  const n = Om(e, t);
  return Ft(n);
}
function Om(e, t) {
  return t.split(".").reduce((n, r) => un(n) ? n[r] : null, e);
}
function Fm(e, t) {
  const n = e.indexOf(":");
  return n < 0 || dt(e.slice(0, n)) !== dt(t) ? null : He(e.slice(n + 1));
}
function Ft(e) {
  return typeof e == "string" ? He(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function un(e) {
  return !!e && typeof e == "object";
}
function Bm(e) {
  return typeof e == "string";
}
function dn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function He(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function dt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function mr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ue(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Xs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const Ht = "abilityRollConfig", Qs = [
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
], fr = 20, pr = 20, Um = [10, 40, 65, 99];
function Zs() {
  return {
    schemaVersion: 1,
    rolls: [Js(1)]
  };
}
function Js(e) {
  return {
    id: qm(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function zm() {
  return Um.map((e) => ({ minNex: e, formula: "" }));
}
function qm() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function el(e) {
  return fa(
    e.getFlag(d, Ht)
  );
}
function Gm(e) {
  return el(e) ?? Zs();
}
async function jm(e, t) {
  const n = fa(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, Ht, n), n;
}
async function Vm(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, Ht)
    );
    return;
  }
  await e.setFlag(d, Ht, null);
}
function fa(e) {
  if (!Be(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, fr).map((r, a) => Qm(r, a, t)).filter((r) => r !== null)
  };
}
function Hm(e, t) {
  const n = el(t);
  return n ? Wm(n, Km(e)) : [];
}
function Wm(e, t) {
  const n = [];
  for (const r of e.rolls) {
    if (r.formula.mode === "fixed") {
      const l = r.formula.formula.trim();
      if (!l) continue;
      n.push({
        id: r.id,
        sourceRollId: r.id,
        label: r.label,
        intent: r.intent,
        damageType: r.intent === "damage" ? r.damageType : null,
        formula: l,
        nexThreshold: null
      });
      continue;
    }
    const a = r.formula.steps.filter(
      (l) => l.formula.trim().length > 0 && l.minNex <= t
    );
    if (a.length === 0) continue;
    const o = a.at(-1);
    if (!o) continue;
    const s = r.formula.resolution === "choose-unlocked" ? a : [o];
    for (const l of s)
      n.push({
        id: r.formula.resolution === "choose-unlocked" ? `${r.id}--nex-${l.minNex}` : r.id,
        sourceRollId: r.id,
        label: r.label,
        intent: r.intent,
        damageType: r.intent === "damage" ? r.damageType : null,
        formula: l.formula.trim(),
        nexThreshold: l.minNex
      });
  }
  return n;
}
function Km(e) {
  const t = Be(e.system) ? e.system : {}, n = t.NEX ?? t.nex, r = Be(n) ? n.value : n, a = typeof r == "number" ? r : Number(r);
  return Number.isFinite(a) ? nl(a) : 0;
}
function tl(e) {
  return Qs.find((t) => t.value === e)?.label ?? e;
}
function Ym(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function Xm(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function Qm(e, t, n) {
  if (!Be(e)) return null;
  const r = `roll-${t + 1}`, a = rf(nf(e.id, r), n), o = ef(e.intent), s = Zm(e.formula);
  return !o || !s ? null : {
    id: a,
    label: mn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? af(e.damageType) : null,
    formula: s
  };
}
function Zm(e) {
  if (!Be(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: mn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, pr).map(Jm).filter((r) => r !== null) : [];
  t.sort((r, a) => r.minNex - a.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const r of t) n.set(r.minNex, r);
  return {
    mode: "nex",
    resolution: tf(e.resolution),
    steps: [...n.values()]
  };
}
function Jm(e) {
  if (!Be(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: nl(t),
    formula: mn(e.formula)
  } : null;
}
function ef(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function tf(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function nf(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function rf(e, t) {
  let n = e, r = 2;
  for (; t.has(n); )
    n = `${e}-${r}`, r += 1;
  return t.add(n), n;
}
function nl(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function mn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function af(e) {
  const t = mn(e);
  return t.length > 0 ? t : null;
}
function Be(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const pa = "data-paranormal-toolkit-ability-roll-id";
function of(e) {
  if (!rl(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = le(e.actorUuid), n = le(e.itemUuid), r = le(e.abilityName);
  if (!t) return null;
  const a = e.rolls.map(sf).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: r || "Habilidade",
    rolls: a,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: Nn(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: Nn(e.resourceBefore),
    resourceAfter: Nn(e.resourceAfter)
  };
}
function sf(e) {
  if (!rl(e)) return null;
  const t = le(e.id), n = le(e.sourceRollId), r = le(e.label), a = le(e.formula), o = lf(e.intent);
  if (!t || !n || !r || !a || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: r,
    formula: a,
    intent: o,
    damageType: o === "damage" ? cf(e.damageType) : null,
    nexThreshold: s
  };
}
function lf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function le(e) {
  return typeof e == "string" ? e.trim() : "";
}
function cf(e) {
  const t = le(e);
  return t.length > 0 ? t : null;
}
function Nn(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function rl(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const To = "paranormalToolkitAbilityRollBound";
let Ro = !1;
function uf() {
  if (Ro) return;
  Ro = !0;
  const e = (t, n) => {
    df(t, Vt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function df(e, t) {
  if (!t) return 0;
  const n = `[${pa}]`, r = Af(t, n);
  let a = 0;
  for (const o of r)
    o.dataset[To] !== "true" && (o.dataset[To] = "true", o.addEventListener("click", () => {
      mf(e, o);
    }), a += 1);
  return a;
}
async function mf(e, t) {
  const n = t.getAttribute(pa)?.trim();
  if (!n) return;
  const r = ff(e), a = r?.rolls.find((l) => l.id === n);
  if (!r || !a) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await pf(r.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!bf(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = gf();
  if (!s) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  ko(t, !0);
  try {
    const l = new s(
      a.formula,
      hf(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: yf(r.abilityName, a)
      })
    );
  } catch (l) {
    console.warn(
      "Paranormal Toolkit: não foi possível executar a rolagem da habilidade.",
      l
    ), ui.notifications?.warn(
      `Paranormal Toolkit: não foi possível rolar ${a.label}. Revise a fórmula configurada.`
    );
  } finally {
    ko(t, !1);
  }
}
function ff(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : of(
    t.getFlag(d, "abilityUse")
  );
}
async function pf(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if ($o(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, a = game.actors?.get?.(n);
  return $o(a) ? a : null;
}
function gf() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function hf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function bf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function yf(e, t) {
  const n = [_f(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${Pn(e)}</strong>
      <span>${Pn(t.label)}</span>
      <small>${Pn(n.join(" · "))}</small>
    </div>
  `;
}
function _f(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${tl(e.damageType)}` : "Dano";
  }
}
function Af(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function ko(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function $o(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function Pn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const Tf = "paranormal-toolkit-chat-message--full-width-card", Eo = ".paranormal-toolkit-ability-card", wo = "li.chat-message";
let Co = !1;
function Rf() {
  if (Co) return;
  Co = !0;
  const e = Hooks, t = (n, r) => {
    So(Vt(r));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), So(document);
}
function So(e) {
  if (!e) return 0;
  const t = ga(e), n = kf(t), r = /* @__PURE__ */ new Set();
  for (const a of n) {
    const o = $f(t, a);
    o?.classList && r.add(o);
  }
  for (const a of r)
    a.classList?.add(Tf);
  return r.size;
}
function kf(e) {
  const t = [];
  e.matches?.(Eo) && t.push(e);
  const n = e.querySelectorAll?.(Eo);
  if (!n) return t;
  for (const r of Array.from(n)) {
    const a = ga(r);
    t.includes(a) || t.push(a);
  }
  return t;
}
function $f(e, t) {
  if (e.matches?.(wo)) return e;
  const n = t.closest?.(wo);
  return n ? ga(n) : null;
}
function ga(e) {
  return e && typeof e == "object" ? e : {};
}
function Ef(e) {
  const t = wf(e.cost), n = Cf(e.currentResource), r = t > 0 && !e.passive, a = n >= t;
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
      hasCost: r,
      canSpend: a,
      spendResourceChecked: r,
      toggleLabel: `Gastar ${t} ${e.resource} automaticamente`,
      costText: r ? `${t} ${e.resource}` : "Nenhum",
      currentText: `${n} ${e.resource}`,
      afterText: `${Math.max(0, n - t)} ${e.resource}`
    },
    passive: e.passive,
    primaryActionLabel: e.passive ? "Enviar ao chat" : "Usar habilidade"
  };
}
function wf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Cf(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Sf } = foundry.applications.api;
class lt extends Sf {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = Ef(t), this.spendResource = this.model.cost.spendResourceChecked;
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
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast paranormal-toolkit-ability-use", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ability-use") ?? n;
    this.bindSpendResourceToggle(a), this.updateInteractiveState(a);
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
          src="${If(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${U(this.model.header.eyebrow)}</p>
          <h2>${U(this.model.header.title)}</h2>
          <p>${U(this.model.header.subtitle)}</p>
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
          <span data-paranormal-toolkit-ability-submit-label>${U(this.model.primaryActionLabel)}</span>
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
            <span>${U(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${U(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${U(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${U(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${t}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${U(this.model.cost.resource)} suficiente para pagar este custo.</span>
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
          <div><dt>Personagem</dt><dd>${U(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${U(t)}</p>
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
    ), r = t.querySelector(
      "[data-paranormal-toolkit-ability-submit-label]"
    ), a = t.querySelector(
      "[data-paranormal-toolkit-ability-after]"
    ), o = t.querySelector(
      "[data-paranormal-toolkit-ability-warning]"
    ), s = this.model.cost.hasCost && this.spendResource && !this.model.cost.canSpend;
    n && (n.disabled = s), o && (o.hidden = !s), a && (a.textContent = this.spendResource ? this.model.cost.afterText : "Não será alterado"), r && !this.model.passive && (r.textContent = this.model.cost.hasCost ? this.spendResource ? "Usar habilidade" : "Usar sem gastar" : this.model.primaryActionLabel);
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
function U(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function If(e) {
  return U(e);
}
function Lf(e, t) {
  const n = Mf(t.system), r = Wt(n.activation), a = Nf(r), o = Df();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Of(t),
    activation: r,
    activationLabel: xf(r),
    description: Wt(n.description),
    chatDescription: vf(
      n.chatDescription,
      n.description
    ),
    cost: a ? 0 : Pf(n.cost),
    resource: o,
    passive: a,
    rolls: Hm(e, t)
  };
}
function vf(e, t) {
  const n = Wt(e);
  return n.trim().length > 0 ? n : Wt(t);
}
function Df() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function xf(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, r = Ff()?.(t) ?? t;
  return r === t ? e : r;
}
function Nf(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Pf(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Mf(e) {
  return e && typeof e == "object" ? e : {};
}
function Wt(e) {
  return typeof e == "string" ? e : "";
}
function Of(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Ff() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Bf {
  async publish(t, n, r) {
    const a = await Vf(n), o = Uf({
      abilityName: n.name,
      abilityImage: n.image,
      actorName: n.actor.name ?? "Personagem sem nome",
      activationLabel: n.activationLabel,
      description: a,
      resource: n.resource,
      cost: n.cost,
      passive: n.passive,
      spentResource: r.spentResource,
      resourceBefore: r.resourceBefore,
      resourceAfter: r.resourceAfter,
      rolls: n.rolls
    }), s = {
      version: 2,
      actorUuid: n.actor.uuid ?? n.actor.id ?? "",
      itemUuid: n.item.uuid ?? n.item.id ?? "",
      abilityName: n.name,
      rolls: n.rolls,
      resource: n.resource,
      cost: n.cost,
      spentResource: r.spentResource,
      resourceBefore: r.resourceBefore,
      resourceAfter: r.resourceAfter
    }, l = {
      speaker: ChatMessage.getSpeaker({ actor: n.actor }),
      content: o,
      flags: {
        [d]: {
          abilityUse: s
        }
      }
    }, c = jf(t.message);
    if (Gs() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function Uf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, r = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", a = zf(e.rolls), o = Gf(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${gr(e.abilityImage)}" alt="">
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

      ${a}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${r}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${se(n)}</span>
      </footer>
    </article>
  `;
}
function zf(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const r = `paranormal-toolkit-ability-card__roll--${n.intent}`, a = qf(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${r}"
          ${pa}="${gr(n.id)}"
          title="${gr(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${se(n.label)}</strong>
            <small>${se(a)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function qf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${tl(e.damageType)}` : "Dano";
  }
}
function Gf(e) {
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
function jf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function se(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function gr(e) {
  return se(e);
}
async function Vf(e) {
  const t = e.chatDescription || e.description, n = Hf();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: Wf(e.actor)
  });
}
function Hf() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function Wf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Kf {
  constructor(t, n, r = new Bf()) {
    this.resources = t, this.resourceAdapter = n, this.chatCards = r;
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
    if (!Yf(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const r = Lf(n, t.item), a = this.readCurrentResource(r);
    if (!a.ok)
      return this.fail(
        "resource-unavailable",
        a.message
      );
    const o = await lt.request({
      abilityName: r.name,
      abilityImage: r.image,
      actorName: n.name ?? "Personagem sem nome",
      activationLabel: r.activationLabel,
      resource: r.resource,
      cost: r.cost,
      currentResource: a.value,
      passive: r.passive
    });
    if (!o) return { status: "cancelled" };
    let s = a.value, l = s, c = !1;
    if (o.spendResource && r.cost > 0) {
      const u = await this.resources.spend(
        n,
        r.resource,
        r.cost
      );
      if (!u.ok) {
        const m = u.error.reason === "insufficient-resource" ? "insufficient-resource" : "resource-update-failed";
        return this.fail(m, u.error.message);
      }
      s = u.value.before.value, l = u.value.after.value, c = !0;
    }
    try {
      await this.chatCards.publish(t, r, {
        spentResource: c,
        resourceBefore: s,
        resourceAfter: l
      });
    } catch (u) {
      const m = await this.restoreSpentResource(
        r,
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
      resource: r.resource,
      cost: r.cost
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
  async restoreSpentResource(t, n, r) {
    if (!n) return !0;
    try {
      return await this.resourceAdapter.updateResourceValue(
        t.actor,
        t.resource,
        r
      ), !0;
    } catch (a) {
      return console.error(
        `${d} | Falha ao restaurar recurso após erro no card de habilidade.`,
        a
      ), !1;
    }
  }
  fail(t, n) {
    return ui.notifications?.warn(n), { status: "failed", reason: t, message: n };
  }
}
function Yf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Io = 1e3;
class Xf {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Kf(t, n), this.strategy = new Ys(
      (r) => this.handleItemUsed(r)
    );
  }
  register() {
    this.strategy.register(), Rf(), uf(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (cr().executionMode === "disabled" || !Zf(t.item)) return;
    const n = Jf(t);
    if (!this.isDuplicate(n)) {
      this.inFlight.add(n);
      try {
        const r = await this.workflow.run(t);
        r.status === "completed" && this.recentExecutions.set(n, Date.now()), r.status === "failed" && f.warn(
          `Uso genérico de habilidade falhou: ${r.reason}.`,
          r
        );
      } finally {
        this.inFlight.delete(n), this.pruneRecentExecutions();
      }
    }
  }
  isDuplicate(t) {
    if (this.inFlight.has(t)) return !0;
    const n = this.recentExecutions.get(t);
    return n !== void 0 && Date.now() - n < Io;
  }
  pruneRecentExecutions() {
    const t = Date.now() - Io;
    for (const [n, r] of this.recentExecutions)
      r < t && this.recentExecutions.delete(n);
  }
}
function Qf(e, t) {
  const n = new Xf(e, t);
  return n.register(), n;
}
function Zf(e) {
  if (e.type !== "ability") return !1;
  const t = ta(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function Jf(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let Lo = !1, Mn = !1, On = !1, It = null;
const ep = 1e3, tp = 750, np = 1e3;
function rp(e) {
  Lo || (Hooks.on("combatTurnChange", (t) => {
    op(e, vo(t));
  }), Hooks.on("deleteCombat", (t) => {
    ip(e, vo(t));
  }), Lo = !0, ap(e));
}
function ap(e) {
  fn() && (Mn || (Mn = !0, globalThis.setTimeout(() => {
    Mn = !1, ha(e, "ready");
  }, ep)));
}
function op(e, t) {
  fn() && t && (It && globalThis.clearTimeout(It), It = globalThis.setTimeout(() => {
    It = null, ha(e, "combat-turn-change", t);
  }, tp));
}
function ip(e, t) {
  fn() && t && (On || (On = !0, globalThis.setTimeout(() => {
    On = !1, ha(e, "combat-deleted", t);
  }, np)));
}
async function ha(e, t, n) {
  if (fn())
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
function fn() {
  return game.user?.isGM === !0;
}
function vo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const al = {
  enabled: "dice.animations.enabled"
};
function sp() {
  game.settings.register(d, al.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function lp() {
  return {
    enabled: game.settings.get(d, al.enabled) === !0
  };
}
const pn = "chatCard", Do = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, cp = `.${i}__title`, ol = `.${i}__header`, up = `.${i}__roll-card`, dp = `.${i}__roll-meta`, mp = `.${i}__roll-meta-pill`, ba = `.${i}__resistance`, fp = `.${i}__resistance-header`, il = `.${i}__resistance-description`, gn = `.${i}__resistance-roll-button`, sl = `.${i}__resistance-roll-result`, xo = `${i}__resistance-content`, ll = `.${i}__workflow-section`, cl = `.${i}__workflow-roll`, ya = `${i}__workflow-roll--dice-open`, _a = `.${i}__workflow-roll-formula`, Aa = `${i}__workflow-roll-formula--toggle`, hn = `.${i}__workflow-dice-tray`, pp = `.${i}__roll-detail-toggle`, gp = `.${i}__roll-detail-list`, hp = `.${i}__ritual-element-badge`, bp = `.${i}__ritual-metadata`, yp = "casting-backlash", _p = "data-paranormal-toolkit-action-section", Ap = "data-paranormal-toolkit-prompt-id", Tp = "data-paranormal-toolkit-pending-id", No = "data-paranormal-toolkit-casting-backlash-enhanced", Po = `.${i}`, Rp = `.${i}__workflow-section--casting`, kp = `.${i}__workflow-section-header`, $p = `.${i}__workflow-notes`, Ep = `[${_p}="${yp}"]`, Mo = `${i}__workflow-section-title-row`, wp = `${i}__workflow-section-header--casting-backlash`, ul = `${i}__casting-backlash-button`;
function Cp(e) {
  for (const t of Sp(e))
    Ip(t), Np(t);
}
function Sp(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Po) && t.add(e);
  for (const n of e.querySelectorAll(Po))
    t.add(n);
  return Array.from(t);
}
function Ip(e) {
  const t = e.querySelector(Ep);
  if (!t) return;
  const n = Lp(t);
  if (!n) return;
  const r = e.querySelector(`${Rp} ${kp}`);
  r && (r.classList.add(wp), vp(r), Dp(n), r.append(n), t.remove());
}
function Lp(e) {
  return e.querySelector(
    `button[${Tp}], button[${Ap}]`
  );
}
function vp(e) {
  const t = e.querySelector(`:scope > .${Mo}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Mo);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(ul) || n.append(a));
  return n;
}
function Dp(e) {
  if (e.getAttribute(No) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = xp(t, e.disabled);
  e.classList.add(ul), e.setAttribute(No, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function xp(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Np(e) {
  for (const t of e.querySelectorAll($p)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Pp(e) {
  for (const t of Array.from(e.querySelectorAll(ll)))
    for (const n of Array.from(t.querySelectorAll(`${pp}, ${gp}`)))
      n.remove();
}
const Mp = {
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
}, Op = new Set(
  Object.values(Mp)
), Fp = {
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
function Bp(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Up(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Fp[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Op.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function dl(e) {
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
function Up(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class ml {
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
    for (const [u, m] of t.instances.entries()) {
      const g = zp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = Bp(m.damageType);
      if (!_.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (g.amount === 0) {
        s.push(
          qp(g.id, m, _.value)
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
        for (const $ of jp(k.conditions))
          l.add($);
        const R = Gp(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? dl(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: Oo(k.finalDamage, g.amount),
          blocked: Oo(k.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: _.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (k) {
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: k
        });
      }
    }
    return y({
      actor: n,
      actorId: a,
      actorName: r,
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
function zp(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function qp(e, t, n) {
  return {
    id: e,
    label: t.label ?? dl(n),
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
function Oo(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Gp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function jp(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Ta {
  async rollResistance(t) {
    const n = await Hp(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? ke(t.skill),
      roll: n,
      formula: Kp(n),
      total: Yp(n),
      diceBreakdown: Xp(n)
    };
  }
  getSkillLabel(t) {
    return ke(t);
  }
}
async function Vp(e, t) {
  return new Ta().rollResistance({ actor: e, skill: t });
}
function ke(e) {
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
async function Hp(e, t) {
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
  return Wp(r);
}
function Wp(e) {
  return Fo(e) ? e : Array.isArray(e) ? e.find(Fo) ?? null : null;
}
function Fo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Kp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Yp(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Xp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Qp);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Qp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class fl {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class pl {
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
function Zp(e, t) {
  const n = og(e?.rounds);
  if (!n)
    return Bo(null);
  const r = e?.anchor ?? gl(t);
  if (!r)
    return {
      ...Bo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Jp(),
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
function gl(e) {
  const t = ig();
  if (!t?.id || !hl(t.round)) return null;
  const n = rg(t), r = eg(e, n) ?? ng(t), a = ie(r?.id), o = lg(r?.initiative), s = tg(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: sg()
  };
}
function Jp() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Bo(e) {
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
function eg(e, t) {
  return e?.id ? t.find((n) => ag(n) === e.id) ?? null : null;
}
function tg(e, t, n) {
  const r = ie(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return cg(e.turn) ? e.turn : null;
}
function ng(e) {
  return Bt(e.combatant) ? e.combatant : null;
}
function rg(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Bt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Bt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Bt);
  }
  return [];
}
function ag(e) {
  return ie(e.actor?.id) ?? ie(e.actorId) ?? ie(e.token?.actor?.id) ?? ie(e.token?.actorId) ?? ie(e.document?.actor?.id) ?? ie(e.document?.actorId);
}
function og(e) {
  return hl(e) ? Math.trunc(e) : null;
}
function ig() {
  return game.combat ?? null;
}
function sg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Bt(e) {
  return !!(e && typeof e == "object");
}
function ie(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function lg(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function hl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function cg(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class bl {
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
    if (!_g(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = Zp(t.duration, r), s = ug(a, t, o), c = t.refreshExisting ?? !0 ? Ag(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(Uo(r, a, c.id ?? null, !1, !0, o));
      } catch (u) {
        return p({
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
      const m = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return y(Uo(r, a, m, !0, !1, o));
    } catch (u) {
      return p({
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
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(t.conditionId), a = _l(n, r);
    let o = 0;
    try {
      for (const s of a)
        await zo(n, s) === "deleted" && (o += 1);
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
    const n = kg(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = Ra(s);
      a += l.length;
      for (const c of l) {
        if (!fg(c, t)) continue;
        const u = yl(c);
        try {
          await zo(s, c) === "deleted" && (o += 1);
        } catch (m) {
          r.push({
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
      scannedEffects: a,
      removedEffects: o,
      failures: r
    };
  }
}
function ug(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: xg(),
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
    duration: dg(n.duration),
    start: mg(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function dg(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function mg(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Dg(),
    ...e
  };
}
function Uo(e, t, n, r, a, o) {
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
function fg(e, t) {
  const n = yl(e);
  if (!n.conditionId || !pg(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = vg();
  return n.durationMode === "combatantTurn" || gg(n) ? bg(n, r) : hg(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !Y(n.startRound) || !Y(n.requestedRounds) || !Y(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function pg(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Y(e.requestedRounds);
}
function gg(e) {
  return !!(e.combatDurationApplied && Y(e.requestedRounds) && Y(e.startRound) && (e.startCombatantId || Kt(e.startTurn)));
}
function hg(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function bg(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !Y(e.startRound) || !Y(e.requestedRounds) || !Y(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = yg(t);
  return e.startCombatantId ? r === e.startCombatantId : Kt(e.startTurn) && Kt(t.turn) ? t.turn === e.startTurn : !1;
}
function yg(e) {
  return Ne(e.combatant?.id);
}
function yl(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ut(e, "conditionId"),
    requestedRounds: qo(e, "requestedRounds") ?? at(t.value) ?? at(t.rounds),
    combatDurationApplied: Fn(e, "combatDurationApplied"),
    combatId: Ut(e, "combatId") ?? Ne(n.combat) ?? Ne(t.combat),
    startCombatantId: Ut(e, "startCombatantId") ?? Ne(n.combatant),
    startInitiative: Cg(e, "startInitiative") ?? Al(n.initiative),
    startRound: qo(e, "startRound") ?? at(n.round) ?? at(t.startRound),
    startTurn: wg(e, "startTurn") ?? hr(n.turn) ?? hr(t.startTurn),
    expiryEvent: Sg(e, "expiryEvent") ?? Tl(t.expiry),
    durationMode: Ig(e, "durationMode"),
    deleteOnExpire: Fn(e, "deleteOnExpire"),
    expiresWithCombat: Fn(e, "expiresWithCombat")
  };
}
function _g(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Ag(e, t) {
  return _l(e, t)[0] ?? null;
}
function _l(e, t) {
  return Ra(e).filter((n) => Eg(n) === t);
}
async function zo(e, t) {
  const n = t.id ?? null, r = n ? Tg(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Rg(a)) return "missing";
    throw a;
  }
}
function Tg(e, t) {
  return Ra(e).find((n) => n.id === t) ?? null;
}
function Rg(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function kg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Lt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Lt(e, n);
  });
  for (const n of $g())
    Lt(e, n.actor), Lt(e, n.document?.actor);
  return Array.from(e.values());
}
function Lt(e, t) {
  if (!Lg(t)) return;
  const r = Ne(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function $g() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ra(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Eg(e) {
  return Ut(e, "conditionId");
}
function Ut(e, t) {
  return Ne(we(e, t));
}
function qo(e, t) {
  return at(we(e, t));
}
function wg(e, t) {
  return hr(we(e, t));
}
function Cg(e, t) {
  return Al(we(e, t));
}
function Sg(e, t) {
  return Tl(we(e, t));
}
function Ig(e, t) {
  const n = we(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Fn(e, t) {
  return we(e, t) === !0;
}
function we(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[d];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function Ne(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function at(e) {
  return Y(e) ? Math.trunc(e) : null;
}
function hr(e) {
  return Kt(e) ? Math.trunc(e) : null;
}
function Al(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Tl(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Lg(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function vg() {
  return game.combat ?? null;
}
function Dg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Y(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Kt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function xg() {
  return game.user?.id ?? null;
}
const Ng = "icons/svg/downgrade.svg", Pg = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Ng,
    description: Pg,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Mg = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Og = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Fg = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Bg = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Ug = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), zg = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), qg = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Gg = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), jg = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Vg = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Hg = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Wg = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Kg = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Yg = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Xg = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Qg = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Zg = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Jg = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), eh = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), th = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), nh = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), rh = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), ah = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), oh = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), ih = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), sh = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), lh = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ch = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), uh = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), dh = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), mh = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), fh = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), ph = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), gh = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), hh = [
  Mg,
  Og,
  Fg,
  Bg,
  Ug,
  zg,
  qg,
  Gg,
  jg,
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
  rh,
  ah,
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
  gh
];
class bh {
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
    return Array.from(this.definitions.values()).map(Go);
  }
  get(t) {
    const n = this.lookup.get(jo(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Go(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = jo(t);
    r && this.lookup.set(r, n);
  }
}
function Rl() {
  return new bh(hh);
}
function Go(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function jo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Ue(e) {
  return e.applyOnResistance ?? "failure";
}
function kl(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function $l(e, t) {
  const n = Ue(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function El(e) {
  const t = Ue(e);
  return t === "failure" || t === "success";
}
function yh(e, t, n, r) {
  const a = e.filter((c) => $l(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Ue(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const _h = {
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
}, Ah = {
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
function Th(e) {
  return Cl(e, _h, !1);
}
function Rh(e) {
  return Cl(e, Ah, !e.allowsSuccessfulResistance);
}
function We(e) {
  return e.kind === "waiting-resistance";
}
function wl(e) {
  return e.kind === "resisted";
}
function Cl(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Le("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Le("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || ln(e.resistanceGateMode, e.resistanceState) ? Le(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Le("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : Le("available", !0, r.available, r.availableCompact, null);
}
function Le(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const ot = "data-paranormal-toolkit-prompt-id", kh = "data-paranormal-toolkit-resistance-roll-result", $h = "Conjuração DT";
function Eh(e) {
  const t = e.querySelector(gn)?.getAttribute(kh), n = mt(t);
  if (n !== null) return n;
  const r = e.querySelector(sl)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return mt(a?.[1] ?? null);
}
function ka(e) {
  const t = Sl(e), n = Ih(t);
  if (n !== null) return n;
  const r = Sh(t);
  return r !== null ? r : Lh(e);
}
function wh(e) {
  const t = Sl(e);
  return t ? {
    actorId: Bn(t.actorId),
    itemId: Bn(t.itemId),
    itemName: Bn(t.itemName)
  } : null;
}
function Ch(e) {
  const t = e.getAttribute(ot);
  if (!t) return null;
  const n = Il(e), r = Ll(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => bn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function de(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function br(e) {
  return de(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Sh(e) {
  const t = Dh(e);
  return t.length === 0 ? null : mt(xh(t, $h));
}
function Ih(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Vo(r, ["system", "ritual", "DT"]) ?? Vo(r, ["system", "ritual", "dt"]);
}
function Lh(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return mt(n?.[1] ?? null);
}
function Sl(e) {
  const t = vh(e);
  if (!t) return null;
  const n = Il(e), r = Ll(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => bn(o) ? o.pendingId === t : !1) ?? null;
}
function vh(e) {
  return (e.closest(`[${ot}]`) ?? e.querySelector(`[${ot}]`) ?? e.parentElement?.querySelector(`[${ot}]`) ?? null)?.getAttribute(ot) ?? null;
}
function Il(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Nh(a) ? a : null;
}
function Ll(e) {
  const t = e?.getFlag?.(d, pn);
  return bn(t) ? t : null;
}
function Dh(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function xh(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Vo(e, t) {
  let n = e;
  for (const r of t) {
    if (!bn(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : mt(typeof n == "string" ? n : null);
}
function mt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Nh(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function bn(e) {
  return !!(e && typeof e == "object");
}
function Bn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function yn(e) {
  return vl({
    hasResistance: !!e.querySelector(ba),
    difficulty: ka(e),
    resistanceTotal: Eh(e)
  });
}
function Ph(e) {
  if (!e.hasResistance || e.difficulty === null)
    return vl({
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
function vl(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: jd(e)
  };
}
function Ce() {
  return game.user?.isGM === !0;
}
function $e() {
  return Ce();
}
function Mh(e) {
  const t = ln(e.resistanceGateMode, e.resistanceState), n = Oh(e.resistanceState, e.hasDamage), r = Fh(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Th({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Rh({
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
function Oh(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Fh(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function $a(e) {
  const t = e.isGM ?? $e();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Mh({
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
function Bh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = zh(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Uh(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function zh(e, t) {
  const n = qh(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of Gh(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function qh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Gh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ho(e, "highest") : n.includes("kl") ? Ho(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ho(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const jh = "data-paranormal-toolkit-resistance-skill", Vh = "data-paranormal-toolkit-resistance-skill-label", Hh = "data-paranormal-toolkit-roll-card-target-names", Wh = "data-paranormal-toolkit-roll-card-resistance", Kh = "data-paranormal-toolkit-roll-card-resistance-skill", Yh = "data-paranormal-toolkit-roll-card-resistance-skill-label", Dl = "pending", Ea = "success", wa = "failure", xl = "rolled";
function Xh(e) {
  const t = tb(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Jh(e.damageSection) : null, r = Wo(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Qh(e.rollCard).map((o, s) => {
    const l = Zh(o, s), c = e.resistanceResults.get(l) ?? null, u = sb(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = Ph({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: mb(u)
    }).state, k = Wo(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      kl(_)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: g,
      effect: k,
      assistedActions: $a({
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
  return a.length <= 1 || !n && !r && !t ? null : {
    rollCard: e.rollCard,
    targets: a,
    damage: n,
    effect: r,
    resistance: t
  };
}
function Qh(e) {
  const t = e.getAttribute(Hh), n = t ? db(t) : [];
  if (n.length > 0) return n;
  const a = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = a.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && Nl(s) !== "nenhum alvo") : [];
}
function Zh(e, t) {
  return `${Nl(e)}:${t}`;
}
function Jh(e) {
  const t = lb(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: ub(e),
    formula: cb(e) ?? "—",
    total: t,
    diceBreakdown: Uh(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Wo(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: eb(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Ue(o)
  } : null;
}
function eb(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function tb(e, t) {
  const n = rb(t), r = nb(e), a = r.description ?? ab(n)?.textContent?.trim(), o = ob(n), s = r.skill ?? o?.getAttribute(jh) ?? null, l = r.skillLabel ?? o?.getAttribute(Vh) ?? (s ? ke(s) : null);
  return !a && !s ? null : {
    description: a ?? "Resistência do alvo.",
    formula: ib(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: ka(e)
  };
}
function nb(e) {
  return {
    description: Un(e, Wh),
    skill: Un(e, Kh),
    skillLabel: Un(e, Yh)
  };
}
function rb(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function ab(e) {
  return Ca(e, `.${i}__resistance-description`);
}
function ob(e) {
  return Ca(e, gn);
}
function ib(e) {
  return Ca(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Ca(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function sb(e, t) {
  return e ? t === null ? xl : e.total >= t ? Ea : wa : Dl;
}
function lb(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function cb(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function ub(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function db(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function Un(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function Nl(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function mb(e) {
  return e === Ea ? "succeeded" : e === wa ? "failed" : "pending";
}
function Pl(e) {
  if (!e) return null;
  const t = e.actorId ? gb(e.actorId) : null, n = t ? fb(t, e.itemId, e.itemName) : null;
  return n || pb(e.itemId, e.itemName);
}
function fb(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Pe(o)) return o;
  }
  const a = Yt(n);
  if (a) {
    const o = r?.find?.((s) => Pe(s) ? Yt(s.name) === a : !1);
    if (Pe(o)) return o;
  }
  return null;
}
function pb(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Pe(a)) return a;
  }
  const r = Yt(t);
  if (r) {
    const a = n?.find?.((o) => Pe(o) ? Yt(o.name) === r : !1);
    if (Pe(a)) return a;
  }
  return null;
}
function gb(e) {
  const n = game.actors?.get?.(e);
  return hb(n) ? n : null;
}
function hb(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Pe(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Yt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Sa(e) {
  const t = zn(e);
  if (!t) return null;
  const n = bb().filter((o) => zn(yb(o)) === t).map((o) => Ml(o)).find(ct) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => ct(o) && zn(o.name) === t);
  return ct(a) ? a : null;
}
function bb() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function yb(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ml(e)?.name ?? null;
}
function Ml(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ct(t)) return t;
  const n = e.document?.actor;
  return ct(n) ? n : null;
}
function ct(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function zn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Ol(e) {
  const t = Rb();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: _b(e)
  });
}
function _b(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${zt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Ab(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${zt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${zt(e.actorName)}</strong></p>
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
function Ab(e) {
  const t = Tb(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${zt(a)}</li>`;
}
function Tb(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Ko(n?.value);
  return r === null ? null : {
    value: r,
    max: Ko(n?.max)
  };
}
function Ko(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Rb() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function zt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function kb(e) {
  await Ol($b(e));
}
function $b(e) {
  if (Eb(e)) return e;
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
function Eb(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Fl(e) {
  return e.mode, `✓ ${Bl(e.inputAmount)} PV`;
}
function wb(e) {
  const t = Bl(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Bl(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Cb {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? $e()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : ln(t.resistanceGateMode, t.resistanceState) ? {
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
class Sb {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? $e()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : ln(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Ib {
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
const Lb = `.${i}__actions`, Ia = `.${i}__actions-title`, ze = `.${i}__button`, vb = "data-paranormal-toolkit-action-section", Db = `${i}__button--executed`, xb = "data-paranormal-toolkit-executed-label";
function Ul(e) {
  return de(e.querySelector(Ia)?.textContent);
}
function Nb(e, t) {
  const n = e.querySelector(Ia);
  n && (n.textContent = t);
}
function _t(e, t) {
  const n = de(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return de(a) === n;
  }) ?? null;
}
function La(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Se(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function zl(e) {
  const t = Pb(e.difficulty);
  if (t === null) return null;
  const n = Yo(e.skillLabel) ?? "Resistência", r = Yo(e.description), a = Mb(r, n), o = Ob(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Pb(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Yo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Mb(e, t) {
  if (!e) return null;
  const n = Xo(e), r = Xo(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function Ob(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function Xo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const vt = "data-paranormal-toolkit-prompt-id", ql = "multiTargetResistanceResults", Gl = "multiTargetDamageApplications", jl = "multiTargetEffectApplications";
function Fb(e) {
  const t = /* @__PURE__ */ new Map(), r = _n(e)?.[ql];
  if (!X(r)) return t;
  for (const [a, o] of Object.entries(r))
    Vb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Bb(e, t) {
  await va(e, ql, t.targetId, t);
}
function Ub(e) {
  const t = /* @__PURE__ */ new Map(), r = _n(e)?.[Gl];
  if (!X(r)) return t;
  for (const [a, o] of Object.entries(r))
    Hb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function zb(e, t) {
  await va(
    e,
    Gl,
    t.targetId,
    t
  );
}
function qb(e) {
  const t = /* @__PURE__ */ new Map(), r = _n(e)?.[jl];
  if (!X(r)) return t;
  for (const [a, o] of Object.entries(r))
    Kb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Gb(e, t) {
  await va(
    e,
    jl,
    t.targetId,
    t
  );
}
function jb(e) {
  const t = _n(e);
  return t ? {
    actorId: qn(t.actorId),
    itemId: qn(t.itemId),
    itemName: qn(t.itemName)
  } : null;
}
async function va(e, t, n, r) {
  const a = Vl(e);
  if (!a) return;
  const o = Hl(e), s = Wl(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!X(u) || u.pendingId !== a) return u;
    const m = X(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, pn, {
    ...s,
    prompts: c
  }));
}
function _n(e) {
  const t = Vl(e);
  if (!t) return null;
  const n = Hl(e), r = Wl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => X(o) ? o.pendingId === t : !1) ?? null;
}
function Vl(e) {
  return (e.closest(`[${vt}]`) ?? e.querySelector(`[${vt}]`) ?? e.parentElement?.querySelector(`[${vt}]`) ?? null)?.getAttribute(vt) ?? null;
}
function Hl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Yb(a) ? a : null;
}
function Wl(e) {
  const t = e?.getFlag?.(d, pn);
  return X(t) ? t : null;
}
function Vb(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Hb(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Wb(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Wb(e) {
  return e === "normal" || e === "half";
}
function Kb(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function qn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Yb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function X(e) {
  return !!(e && typeof e == "object");
}
const Xb = "data-paranormal-toolkit-resistance-skill", Qb = "data-paranormal-toolkit-resistance-skill-label", yr = "data-paranormal-toolkit-multi-target-section", Da = "data-paranormal-toolkit-multi-target-damage-info", Kl = "data-paranormal-toolkit-multi-target-effect-info", Yl = "data-paranormal-toolkit-multi-target-toggle", Xl = "data-paranormal-toolkit-multi-target-details", j = "data-paranormal-toolkit-multi-target-target", Zb = "data-paranormal-toolkit-multi-target-state", _r = "data-paranormal-toolkit-multi-target-roll-total", Ar = "data-paranormal-toolkit-multi-target-roll-formula", qt = "data-paranormal-toolkit-multi-target-roll-dice", Tr = "data-paranormal-toolkit-multi-target-roll-skill", Rr = "data-paranormal-toolkit-multi-target-roll-skill-label", kr = "data-paranormal-toolkit-multi-target-roll-target-name", $r = "data-paranormal-toolkit-multi-target-roll-rolled-at", Er = "data-paranormal-toolkit-multi-target-damage-mode", wr = "data-paranormal-toolkit-multi-target-damage-input-amount", Qo = "data-paranormal-toolkit-multi-target-damage-final-amount", Zo = "data-paranormal-toolkit-multi-target-damage-blocked", Cr = "data-paranormal-toolkit-multi-target-damage-target-name", Sr = "data-paranormal-toolkit-multi-target-damage-applied-at", Ir = "data-paranormal-toolkit-multi-target-effect-condition-id", Lr = "data-paranormal-toolkit-multi-target-effect-condition-label", vr = "data-paranormal-toolkit-multi-target-effect-effect-id", Dr = "data-paranormal-toolkit-multi-target-effect-created", xr = "data-paranormal-toolkit-multi-target-effect-refreshed", Nr = "data-paranormal-toolkit-multi-target-effect-target-name", Pr = "data-paranormal-toolkit-multi-target-effect-applied-at", Jb = new bl(Rl()), ey = new fl(new ml()), ty = new pl(new Ta()), ny = new Ib(ty), ry = new Cb(ey), ay = new Sb(Jb), oy = Dl, Ke = Ea, At = wa, iy = xl;
function sy(e) {
  const t = Ql(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), hy(e);
  const n = by(e.rollCard, t), r = yy(e.rollCard, t);
  !n && r && e_(e.rollCard, r, e.effectSection);
  const a = $y(e.rollCard);
  return ec(a, t), Qy(
    e.rollCard,
    a,
    _y(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && t_(e.rollCard, r, a), !0;
}
function Ql(e) {
  return Xh({
    ...e,
    resistanceResults: uy(e.rollCard),
    damageApplications: dy(e.rollCard),
    effectApplications: my(e.rollCard),
    resolveTargetConditionApplication: ly,
    resistanceGateMode: Na()
  });
}
function ly(e, t, n) {
  const r = jb(e), a = Pl(r);
  if (!a) return null;
  const o = bt(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = cy(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function cy(e, t, n) {
  const r = yh(
    e,
    n,
    t,
    Gn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = Gn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => Gn(s) === a)) ?? null : null;
}
function uy(e) {
  const t = Fb(e);
  for (const [n, r] of gy(e))
    t.set(n, r);
  return t;
}
function dy(e) {
  const t = Ub(e);
  for (const [n, r] of py(e))
    t.set(n, r);
  return t;
}
function my(e) {
  const t = qb(e);
  for (const [n, r] of fy(e))
    t.set(n, r);
  return t;
}
function fy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(Ir), o = n.getAttribute(Lr), s = n.getAttribute(vr), l = ti(n.getAttribute(Dr)), c = ti(n.getAttribute(xr)), u = n.getAttribute(Nr), m = n.getAttribute(Pr);
    !r || !a || !o || l === null || c === null || !u || !m || t.set(r, {
      targetId: r,
      targetName: u,
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
function py(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(Er), o = uc(n.getAttribute(wr)), s = n.getAttribute(Cr), l = n.getAttribute(Sr);
    !r || !a_(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function gy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = uc(n.getAttribute(_r)), o = n.getAttribute(Ar), s = n.getAttribute(Tr), l = n.getAttribute(Rr), c = n.getAttribute(kr), u = n.getAttribute($r);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(qt),
      rolledAt: u
    });
  }
  return t;
}
function hy(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function by(e, t) {
  if (!t.damage)
    return Zl(e)?.remove(), null;
  const n = Ay(e);
  return Ty(n, t.damage), ky(e, n), n;
}
function yy(e, t) {
  if (!t.effect)
    return cc(e)?.remove(), null;
  const n = Zy(e);
  return Jy(n, t.effect), n;
}
function _y(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : _t(e, "Conjuração");
}
function Ay(e) {
  const t = Zl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Da, "true"), n;
}
function Zl(e) {
  return e.querySelector(`[${Da}="true"]`);
}
function Ty(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Jl(t.formula, t.total, t.diceBreakdown));
}
function Jl(e, t, n, r = !1) {
  const a = Bh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Ry(a, r), a;
}
function Ry(e, t) {
  const n = e.querySelector(hn), r = e.querySelector(_a);
  if (!n || !r) return;
  e.classList.toggle(ya, t), n.hidden = !t, r.classList.add(Aa), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function ky(e, t) {
  const n = _t(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function $y(e) {
  const t = e.querySelector(`[${yr}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(yr, "true"), n;
}
function ec(e, t) {
  const n = Ey(e), r = Cy(t.resistance), a = [wy(t)];
  r && a.push(r), a.push(Ly(t, n)), e.replaceChildren(...a);
}
function Ey(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${j}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(j)).filter(r_)
  );
}
function wy(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Iy(e.targets), t.append(n, r), t;
}
function Cy(e) {
  const t = zl({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Sy(n, t), n;
}
function Sy(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${i}__resistance-label-skill`), n.textContent = t.skillLabel;
  const r = document.createElement("strong");
  r.classList.add(`${i}__resistance-label-difficulty`), r.textContent = t.difficultyLabel;
  const a = [n, document.createTextNode(" · "), r];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${i}__resistance-label-effect`), o.textContent = t.description, a.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...a);
}
function Iy(e) {
  const t = e.length, n = e.filter((l) => l.state === At).length, r = e.filter((l) => l.state === Ke).length, a = e.filter((l) => l.state === oy).length, o = e.filter((l) => l.state === iy).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Ly(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(vy(r, e, t.has(r.id)));
  return n;
}
function vy(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(j, e.id), r.setAttribute(Zb, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), tc(r, e.resistanceResult), nc(r, e.damageApplication), rc(r, e.effectApplication);
  const a = Dy(e, t, r), o = Wy(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    ei(s.target) || Jo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || ei(s.target) || (s.preventDefault(), Jo(r));
  }), r.append(a, o), r;
}
function tc(e, t) {
  if (!t) {
    e.removeAttribute(_r), e.removeAttribute(Ar), e.removeAttribute(qt), e.removeAttribute(Tr), e.removeAttribute(Rr), e.removeAttribute(kr), e.removeAttribute($r);
    return;
  }
  e.setAttribute(_r, String(t.total)), e.setAttribute(Ar, t.formula), e.setAttribute(Tr, t.skill), e.setAttribute(Rr, t.skillLabel), e.setAttribute(kr, t.targetName), e.setAttribute($r, t.rolledAt), t.diceBreakdown ? e.setAttribute(qt, t.diceBreakdown) : e.removeAttribute(qt);
}
function nc(e, t) {
  if (!t) {
    e.removeAttribute(Er), e.removeAttribute(wr), e.removeAttribute(Qo), e.removeAttribute(Zo), e.removeAttribute(Cr), e.removeAttribute(Sr);
    return;
  }
  e.setAttribute(Er, t.mode), e.setAttribute(wr, String(t.inputAmount)), e.removeAttribute(Qo), e.removeAttribute(Zo), e.setAttribute(Cr, t.targetName), e.setAttribute(Sr, t.appliedAt);
}
function rc(e, t) {
  if (!t) {
    e.removeAttribute(Ir), e.removeAttribute(Lr), e.removeAttribute(vr), e.removeAttribute(Dr), e.removeAttribute(xr), e.removeAttribute(Nr), e.removeAttribute(Pr);
    return;
  }
  e.setAttribute(Ir, t.conditionId), e.setAttribute(Lr, t.conditionLabel), e.setAttribute(vr, t.effectId ?? ""), e.setAttribute(Dr, String(t.created)), e.setAttribute(xr, String(t.refreshed)), e.setAttribute(Nr, t.targetName), e.setAttribute(Pr, t.appliedAt);
}
function Dy(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = xy(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Ny(e, t.resistance);
  Fy(l, n, e, t);
  const c = Hy(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), sc(u, [
    ac(e, t, "compact"),
    ic(e, t, "compact")
  ]), r.append(a, u), r;
}
function xy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Ny(e, t) {
  if (!Ce())
    return Py(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Oy(e, t)), t?.skill && (n.setAttribute(Xb, t.skill), n.setAttribute(Qb, t.skillLabel ?? ke(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ke ? "✓" : e.state === At ? "✕" : "", n.append(r, a), n;
}
function Py(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", My(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ke ? "✓" : e.state === At ? "✕" : "", n.append(r, a), n;
}
function My(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Ke ? "sucesso" : e.state === At ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Oy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Ke ? "sucesso" : e.state === At ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Fy(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !Ce() || e.addEventListener("click", (a) => {
    a.stopPropagation(), By(t, e, n, r);
  });
}
async function By(e, t, n, r) {
  if (!Ce()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? ke(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Sa(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await ny.execute({ actor: l, skill: o, skillLabel: s });
    await n_(u.roll);
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
    tc(e, m);
    try {
      await Bb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    xa(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function xa(e) {
  const t = e.closest(`[${yr}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Ql({
    rollCard: n,
    damageSection: Uy(n) ?? _t(n, "Dano"),
    effectSection: zy(n)
  });
  r && ec(t, r);
}
function Uy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Da) !== "true") ?? null;
}
function zy(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function qy(e) {
  return We(e.assistedActions.policy.damageActionState);
}
function Gy(e) {
  return We(e.assistedActions.policy.effectActionState);
}
function Na() {
  try {
    return la();
  } catch {
    return "strict";
  }
}
function ac(e, t, n) {
  if (e.damageApplication)
    return ce(
      "✓",
      Fl({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (We(r))
    return ce(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = oc(a, t.damage);
  if (o === null)
    return ce(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = wb({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = ce(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${j}]`);
    g && jy(g, u, e, t);
  }), u;
}
function oc(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function jy(e, t, n, r) {
  if (n.damageApplication) return;
  if (qy(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = oc(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Sa(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await ry.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Na(),
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
    nc(e, m);
    try {
      await zb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await kb(u.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    xa(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ic(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (e.effectApplication)
    return ce(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!a) return null;
  if (We(r))
    return ce(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (wl(r))
    return ce(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = ce(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${j}]`);
    l && Vy(l, o, e, t);
  }), o;
}
async function Vy(e, t, n, r) {
  if (n.effectApplication) return;
  if (Gy(n)) {
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
  const o = Sa(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await ay.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Na(),
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
    rc(e, c);
    try {
      await Gb(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), xa(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function sc(e, t) {
  for (const n of t)
    n && e.append(n);
}
function ce(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function Hy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Yl, "true"), t.setAttribute("aria-hidden", "true"), lc(e, t), t;
}
function Jo(e) {
  const t = e.querySelector(`[${Xl}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Yl}="true"]`);
  r && lc(e, r);
}
function lc(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function ei(e) {
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
function Wy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Xl, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Ky(e, t.resistance);
  s && r.append(s);
  const l = Yy(e, t.resistance), c = Xy(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Ky(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Ke ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Yy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Jl(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Xy(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), sc(n, [
    ac(e, t, "full"),
    ic(e, t, "full")
  ]), n;
}
function Qy(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Zy(e) {
  const t = cc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Kl, "true"), n;
}
function cc(e) {
  return e.querySelector(`[${Kl}="true"]`);
}
function Jy(e, t) {
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
function e_(e, t, n) {
  const r = n?.parentElement === e ? n : _t(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function t_(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Gn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function n_(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function r_(e) {
  return typeof e == "string" && e.length > 0;
}
function a_(e) {
  return e === "normal" || e === "half";
}
function ti(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function uc(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const ni = "data-paranormal-toolkit-card-layout-refresh-bound";
function o_(e) {
  const t = e.rollCard.querySelector(gn);
  t && t.getAttribute(ni) !== "true" && (t.setAttribute(ni, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Me = "data-paranormal-toolkit-prompt-id", i_ = "apply-damage", s_ = "data-paranormal-toolkit-multi-target-damage-info";
function l_(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(s_) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function c_(e) {
  const t = d_(e);
  return t.find((n) => n.getAttribute(vb) === i_) ?? t.find((n) => Ul(n) === "aplicar danos") ?? null;
}
function u_(e) {
  const t = dc(e), n = ri(t);
  return n || ri(m_(e));
}
function ri(e) {
  return e.find((t) => {
    const n = Ul(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function d_(e) {
  const t = dc(e);
  return t.length > 0 ? t : Pa(e);
}
function dc(e) {
  const t = g_(e);
  return t ? Pa(e).filter((n) => p_(n, t)) : [];
}
function m_(e) {
  const t = mc(e);
  if (!t) return [];
  const n = f_(e, t);
  return Pa(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => fc(e, r)).filter((r) => !n || h_(r, n));
}
function Pa(e) {
  const t = mc(e);
  return t ? Array.from(t.querySelectorAll(Lb)) : [];
}
function mc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function f_(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && fc(e, n)) ?? null;
}
function p_(e, t) {
  return e.getAttribute(Me) === t ? !0 : Array.from(e.querySelectorAll(`[${Me}]`)).some((n) => n.getAttribute(Me) === t);
}
function g_(e) {
  return e.getAttribute(Me) ?? e.querySelector(`[${Me}]`)?.getAttribute(Me) ?? null;
}
function fc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function h_(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function b_(e) {
  const t = pc(), n = yn(e.rollCard).state, r = $a({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = We(a), s = wl(a);
  return e.applied ? et({
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
  }) : r.policy.canShowApplyEffect ? et(o ? {
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
  }) : et({
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
function et(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function y_(e) {
  const { rollCard: t } = e, n = T_(), r = pc(), a = yn(t).state, o = $a({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = We(s), c = A_(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: N(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: N(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: __(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: N("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: N("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: N("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: N("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: N("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: N("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: N("half", !1, !1, !1, !!e.halfButtonSkipped),
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
    normalButton: N("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: N("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function __(e) {
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
function N(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function A_(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function T_() {
  try {
    return em();
  } catch {
    return "assisted";
  }
}
function pc() {
  try {
    return la();
  } catch {
    return "strict";
  }
}
const R_ = "data-paranormal-toolkit-damage-resolution-state", ai = "data-paranormal-toolkit-damage-icon-enhanced", Ma = "data-paranormal-toolkit-damage-original-label", k_ = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, gc = "Outra opção escolhida";
function $_(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Nb(t, "Aplicar dano"), E_(e, t);
}
function E_(e, t) {
  const n = Array.from(t.querySelectorAll(ze)), r = ii(n, "normal"), a = ii(n, "half");
  if (!r || !a) {
    w_(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  si(r, "normal"), si(a, "half");
  const o = y_({
    rollCard: e,
    normalButtonApplied: Xt(r),
    halfButtonApplied: Xt(a),
    normalButtonSkipped: Mr(r),
    halfButtonSkipped: Mr(a)
  });
  if (!o.canShowApplyDamage) {
    li(r), li(a), ci(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), oi(r, o.normalButton), oi(a, o.halfButton), ci(t, o.summary.state, o.summary.message);
}
function oi(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    S_(e, t.visible), I_(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function w_(e) {
  for (const t of e)
    Mr(t) && t.remove();
}
function Xt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(gc);
}
function Mr(e) {
  return e.textContent?.includes(gc) ?? !1;
}
function ii(e, t) {
  const n = k_[t];
  return e.find((r) => n.test(C_(r))) ?? null;
}
function C_(e) {
  return [
    e.getAttribute(Ma),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function si(e, t) {
  if (e.getAttribute(ai) === "true") return;
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
  ), e.setAttribute(ai, "true"), e.setAttribute(Ma, n), e.setAttribute("aria-label", n), e.replaceChildren(r, Se(n));
}
function li(e) {
  Xt(e) || e.remove();
}
function S_(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function I_(e, t, n, r = "Role resistência") {
  if (!Xt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(Se(r));
      return;
    }
    e.removeAttribute("aria-disabled"), L_(e, n);
  }
}
function L_(e, t) {
  const n = e.getAttribute(Ma) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(v_(t), Se(n)));
}
function v_(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function ci(e, t, n) {
  e.setAttribute(R_, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Ia)?.after(a);
}
const ft = "data-paranormal-toolkit-effect-icon-enhanced", qe = "data-paranormal-toolkit-effect-action-compacted", An = "data-paranormal-toolkit-effect-resistance-gate", Oa = "data-paranormal-toolkit-effect-section", Fa = "data-paranormal-toolkit-effect-label";
function D_(e) {
  return e.querySelector(`[${Oa}="true"]`);
}
function x_(e) {
  const t = P_(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? O_(), r = H_(n, e.sourceActions, t);
  return r && n.setAttribute(Fa, r), F_(n, t, r), j_(e.rollCard, n, e.after ?? e.fallbackAfter), V_(e.sourceActions, n), n;
}
function N_(e, t) {
  const n = t.querySelector(ze);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = _c(t, n, r), o = hc(e, n), s = b_({
    rollCard: e,
    effectLabel: a,
    applied: Ua(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Ue(o) === "success" || Ue(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? El(o) : !1
  });
  if (s.applied) {
    K_(n);
    return;
  }
  if (!s.visible) {
    Y_(n);
    return;
  }
  if (s.waitingForResistance) {
    X_(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    Q_(n, s.compactLabel);
    return;
  }
  Z_(n), yc(n, s.displayLabel);
}
function P_(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(ze) ?? []), n = Array.from(e.existingSection?.querySelectorAll(ze) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : M_(e.rollCard, r) ?? r[0] ?? null;
}
function M_(e, t) {
  const n = yn(e).state, r = kl(n), a = bc(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = hc(e, o, a);
    if (s && $l(s, r)) return o;
  }
  return null;
}
function hc(e, t, n = bc(e)) {
  const r = Ba(t, t.textContent?.trim() ?? ""), a = br(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => br(s) === a)) ?? null : null;
}
function bc(e) {
  const t = Pl(wh(e));
  if (!t) return [];
  const n = bt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function O_() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Oa, "true"), e;
}
function F_(e, t, n) {
  e.setAttribute(Oa, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = B_(e), a = U_(r);
  a.textContent = "Efeito";
  const o = z_(e, r), s = q_(o);
  s.textContent = J_(n ?? _c(e, t, t.textContent?.trim() ?? ""));
  const l = G_(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(ze)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Ua(t, c) && !W_(t, c) && yc(t, n ?? c);
}
function B_(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function U_(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function z_(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function q_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function G_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function j_(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function V_(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(ze)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function H_(e, t, n) {
  const r = e.getAttribute(Fa);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Ba(n, n.textContent?.trim() ?? "");
}
function Ba(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && de(n) !== "efeito aplicado") return n;
  const r = Ch(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && de(a) !== "aplicado" ? a : null;
}
function Ua(e, t) {
  return e.classList.contains(Db) || de(t).includes("aplicado");
}
function W_(e, t) {
  const n = e.getAttribute(An);
  if (n === "pending" || n === "resisted") return !0;
  const r = br(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function yc(e, t) {
  e.getAttribute(qe) === "true" && e.getAttribute(ft) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(ft, "true"), e.setAttribute(xb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    La("✦", `${i}__button-icon--effect`),
    Se("Aplicar")
  ));
}
function K_(e) {
  e.getAttribute(qe) === "true" && de(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(ft, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    La("✓", `${i}__button-icon--effect-applied`),
    Se("Aplicado")
  ));
}
function _c(e, t, n) {
  const r = e.getAttribute(Fa) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Ba(t, n) ?? n;
}
function Y_(e) {
  Ua(e, e.textContent?.trim() ?? "") || e.remove();
}
function X_(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(qe), e.removeAttribute(ft), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(An, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Se(t));
}
function Q_(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(qe), e.removeAttribute(ft), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(An, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    La("✓", `${i}__button-icon--effect-resisted`),
    Se(t)
  );
}
function Z_(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(An), e.removeAttribute("aria-disabled");
}
function J_(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const eA = "data-paranormal-toolkit-card-layout-normalized";
function tA(e) {
  const t = nA(e.rollCard), n = rA(t);
  return o_({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function nA(e) {
  return {
    rollCard: e,
    damageSection: l_(e),
    resistance: e.querySelector(ba),
    damageActions: c_(e),
    effectActionSource: u_(e),
    effectSection: D_(e)
  };
}
function rA(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(eA, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = _t(t, "Conjuração"), c = aA({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), $_(t, a));
  const u = x_({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: oA(n, c),
    fallbackAfter: l
  });
  return u && N_(t, u), u;
}
function aA(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function oA(e, t) {
  return e ?? t;
}
const Ac = [0, 80, 180, 400, 900, 1600, 3e3], di = /* @__PURE__ */ new WeakSet();
function iA(e) {
  Tc(e), sA(e);
}
function Tc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Rc(t);
}
function sA(e) {
  if (!di.has(e)) {
    di.add(e);
    for (const t of Ac)
      globalThis.setTimeout(() => {
        Tc(e);
      }, t);
  }
}
function Rc(e) {
  const t = tA({
    rollCard: e,
    refreshDelaysMs: Ac,
    onRefresh: () => Rc(e)
  });
  sy({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const lA = "data-paranormal-toolkit-resistance-roll-result-enhanced", mi = "data-paranormal-toolkit-resistance-original-description", cA = "data-paranormal-toolkit-resistance-skill", uA = "data-paranormal-toolkit-resistance-skill-label", dA = `${i}__resistance--without-roll-button`, mA = ["Fortitude", "Reflexos", "Vontade"];
function fA(e) {
  for (const t of Array.from(e.querySelectorAll(ba)))
    pA(t);
  iA(e);
}
function pA(e) {
  const t = e.querySelector(fp), n = e.querySelector(il), r = e.querySelector(gn), a = _A(r) ? r : null, o = e.querySelector(sl);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(dA, !a);
  const s = yA(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), RA(o)), gA(e, r, n), a && (CA(a), a.parentElement !== e && e.append(a));
}
function gA(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = bA(n), o = zl({
    description: a,
    skillLabel: AA(t, a),
    difficulty: ka(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  hA(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function hA(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${i}__resistance-label-skill`), n.textContent = t.skillLabel;
  const r = document.createElement("strong");
  r.classList.add(`${i}__resistance-label-difficulty`), r.textContent = t.difficultyLabel;
  const a = [n, document.createTextNode(" · "), r];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${i}__resistance-label-effect`), o.textContent = t.description, a.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...a);
}
function bA(e) {
  const t = e.getAttribute(mi);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(mi, n), n;
}
function yA(e, t) {
  const n = e.querySelector(`.${xo}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(xo), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function _A(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function AA(e, t) {
  const n = e?.getAttribute(uA) ?? e?.getAttribute(cA) ?? null;
  return n || TA(t);
}
function TA(e) {
  const t = fi(e);
  return mA.find((n) => t.startsWith(fi(n))) ?? null;
}
function fi(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function RA(e) {
  const t = kA(e.textContent ?? "");
  t && (e.setAttribute(lA, "true"), e.replaceChildren(wA(t)));
}
function kA(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = $A(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function $A(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: EA(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function EA(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function wA(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = SA(e);
  return r && t.append(r), t;
}
function CA(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = yn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function SA(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of IA(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function IA(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? pi(e, "highest") : n.includes("kl") ? pi(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function pi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function LA(e) {
  for (const t of Array.from(e.querySelectorAll(up))) {
    const n = OA(t);
    vA(t), n && (DA(t, n), xA(t, n));
  }
}
function vA(e) {
  for (const t of Array.from(e.querySelectorAll(dp)))
    t.remove();
}
function DA(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(ol) ?? null, a = r?.querySelector(cp) ?? null, o = r ?? e, s = o.querySelector(hp);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = eT(t.elementTone), l.textContent = JA(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function xA(e, t) {
  const n = NA(e);
  PA(e, n);
  const r = MA(t);
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
  const o = e.querySelector(ll);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function NA(e) {
  return e.closest(`.${i}`)?.querySelector(ol) ?? null;
}
function PA(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(bp)))
      a.remove();
}
function MA(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${mr(e.target)}` : null,
    e.duration ? `Duração: ${mr(e.duration)}` : null,
    e.resistance ? `Resistência: ${Xs(e.resistance)}` : null
  ].filter(dn);
}
function OA(e) {
  const t = FA(e), n = jA(e), a = (t ? GA(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = za(K(a, "element")), l = ne("op.elementChoices", s) ?? gi(_e(o, "Elemento")) ?? gi(n.damageType), c = s ?? tT(l), u = K(a, "circle") ?? _e(o, "Círculo"), m = WA(a) ?? _e(o, "Alvo"), g = QA(a, "duration", "op.durationChoices") ?? _e(o, "Duração"), _ = VA(e) ?? YA(a) ?? _e(o, "Resistência"), k = HA(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: _
  };
  return ZA(R) ? R : null;
}
function FA(e) {
  const t = BA(e);
  if (!t) return null;
  const n = t.getFlag?.(d, pn), r = zA(n);
  if (r.length === 0) return null;
  const a = UA(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function BA(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? ma()?.messages?.get?.(n) ?? null : null;
}
function UA(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Do}]`))) {
    const a = r.getAttribute(Do)?.trim();
    a && n.add(a);
  }
  return n;
}
function zA(e) {
  if (!un(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(qA).filter((n) => n !== null) : [];
}
function qA(e) {
  return un(e) ? {
    pendingId: Ft(e.pendingId),
    actorId: Ft(e.actorId),
    itemId: Ft(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Bm) : []
  } : null;
}
function GA(e) {
  if (!e.itemId) return null;
  const t = ma(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function jA(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(mp))) {
    const a = He(r.textContent);
    if (!a) continue;
    const o = Fm(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function VA(e) {
  const t = He(e.querySelector(il)?.textContent);
  return t ? Xs(t) : null;
}
function _e(e, t) {
  const n = dt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || dt(r.slice(0, a)) !== n))
      return He(r.slice(a + 1));
  }
  return null;
}
function HA(e) {
  const t = _e(e, "Custo") ?? _e(e, "PE");
  return t || (e.map(He).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function WA(e) {
  const t = K(e, "target");
  if (!t) return null;
  if (t === "area")
    return KA(e) ?? ne("op.targetChoices", t) ?? "Área";
  const n = ne("op.targetChoices", t) ?? ue(t);
  return [t === "people" || t === "creatures" ? K(e, "targetQtd") : null, n].filter(dn).join(" ");
}
function KA(e) {
  const t = K(e, "area.name"), n = K(e, "area.size"), r = K(e, "area.type"), a = t ? ne("op.areaChoices", t) ?? ue(t) : null, o = r ? ne("op.areaTypeChoices", r) ?? ue(r) : null;
  return a ? n ? o ? `${a} ${n}m ${mr(o)}` : `${a} ${n}m` : a : null;
}
function YA(e) {
  const t = K(e, "skillResis"), n = K(e, "resistance");
  if (!t || !n) return null;
  const r = ne("op.skill", t) ?? ue(t), a = XA(n);
  return [r, a].filter(dn).join(" ");
}
function XA(e) {
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
function QA(e, t, n) {
  const r = K(e, t);
  return r ? ne(n, r) ?? ue(r) : null;
}
function ZA(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function JA(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function eT(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(dn).join(" ");
}
function za(e) {
  const t = dt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function gi(e) {
  const t = za(e);
  return t ? ne("op.elementChoices", t) ?? ue(t) : e ? ue(e) : null;
}
function tT(e) {
  return za(e);
}
function ne(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = ma()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const hi = "data-paranormal-toolkit-dice-toggle-enhanced";
function nT(e) {
  for (const t of Array.from(e.querySelectorAll(cl)))
    kc(t);
}
function rT(e) {
  const t = Ec(e.target);
  if (!t) return;
  const n = qa(t);
  n && (e.preventDefault(), $c(n, t));
}
function aT(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ec(e.target);
  if (!t) return;
  const n = qa(t);
  n && (e.preventDefault(), $c(n, t));
}
function kc(e) {
  const t = e.querySelector(hn);
  if (!t) return;
  const n = e.querySelector(_a);
  if (n && n.getAttribute(hi) !== "true" && (n.setAttribute(hi, "true"), n.classList.add(Aa), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function $c(e, t) {
  const n = e.querySelector(hn);
  if (!n) return;
  const r = !e.classList.contains(ya);
  oT(e, t, n, r);
}
function oT(e, t, n, r) {
  e.classList.toggle(ya, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Ec(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(_a);
  if (!t) return null;
  const n = qa(t);
  return n ? (kc(n), t.classList.contains(Aa) ? t : null) : null;
}
function qa(e) {
  const t = e.closest(cl);
  return t && t.querySelector(hn) ? t : null;
}
const bi = `${d}-workflow-dice-toggle-styles`;
function iT() {
  if (document.getElementById(bi)) return;
  const e = document.createElement("style");
  e.id = bi, e.textContent = `
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
const sT = [0, 100, 500, 1500, 3e3];
let yi = !1, jn = null;
function lT() {
  if (!yi) {
    yi = !0, iT(), Hooks.on("renderChatMessageHTML", (e, t) => {
      it(Vt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      it(Vt(t));
    }), Hooks.once("ready", () => {
      it(document), cT();
    }), document.addEventListener("click", rT), document.addEventListener("keydown", aT);
    for (const e of sT)
      globalThis.setTimeout(() => it(document), e);
  }
}
function cT() {
  jn || !document.body || (jn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && it(n);
  }), jn.observe(document.body, { childList: !0, subtree: !0 }));
}
function it(e) {
  e && (Pp(e), LA(e), fA(e), nT(e), Cp(e));
}
function uT() {
  lT();
}
const dT = "data-paranormal-toolkit-action-section", mT = "ritual-log", fT = ".paranormal-toolkit-item-use-prompt__actions", pT = ".paranormal-toolkit-item-use-prompt__actions-title", gT = [0, 100, 500, 1500];
let _i = !1;
function hT() {
  if (_i) return;
  const e = (t, n) => {
    Ai(AT(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Ai(document), _i = !0;
}
function Ai(e) {
  for (const t of gT)
    globalThis.setTimeout(() => bT(e), t);
}
function bT(e) {
  yT(e), _T(e);
}
function yT(e) {
  for (const t of e.querySelectorAll(
    `[${dT}="${mT}"]`
  ))
    t.remove();
}
function _T(e) {
  for (const t of e.querySelectorAll(fT)) {
    if (Ti(t.querySelector(pT)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Ti(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function AT(e) {
  if (e instanceof HTMLElement || TT(e))
    return e;
  if (RT(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function TT(e) {
  return e instanceof HTMLElement;
}
function RT(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Ti(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const st = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, wc = {
  PV: "system.attributes.hp"
}, Or = {
  PV: [st.PV, wc.PV],
  SAN: [st.SAN],
  PE: [st.PE],
  PD: [st.PD]
}, Fr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class kT {
  getResource(t, n) {
    const r = Ri(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = $i(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = $i(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Ri(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Ri(e, t) {
  const n = $T(e.type, t);
  if (n && ki(e, n))
    return y(n);
  const r = Or[t].find(
    (a) => ki(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ET(e, t),
    path: Or[t].join(" | ")
  });
}
function $T(e, t) {
  return e === "threat" ? wc[t] ?? null : e === "agent" ? st[t] : null;
}
function ki(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function ET(e, t) {
  const n = e.type ?? "unknown", r = Or[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function $i(e, t, n, r, a) {
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
class wT {
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
      const s = Fr.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = CT(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Fr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function CT(e) {
  if (Ei(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Ei(n))
      return n;
  }
  return null;
}
function Ei(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const ST = "dice-so-nice";
async function Cc(e) {
  if (!IT() || !LT()) return;
  const t = vT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function IT() {
  try {
    return lp().enabled;
  } catch {
    return !1;
  }
}
function LT() {
  return game.modules?.get?.(ST)?.active === !0;
}
function vT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const wi = "occultism";
class Sc {
  getDifficulty(t) {
    return DT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await NT(t, wi);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Cc(r);
    const a = OT(r);
    return {
      skill: wi,
      skillLabel: "Ocultismo",
      roll: r,
      formula: MT(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: FT(r)
    };
  }
}
function DT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function xT(e) {
  return new Sc().rollCastingCheck(e);
}
async function NT(e, t) {
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
  return PT(r);
}
function PT(e) {
  return Ci(e) ? e : Array.isArray(e) ? e.find(Ci) ?? null : null;
}
function Ci(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function MT(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function OT(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function FT(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(BT);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function BT(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const UT = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class zT {
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
    const r = n.value, a = qT(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: UT[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function qT(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : GT(n) ? {
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
function GT(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class jT {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Vn("missing-item-patch");
    if (t.type !== "ritual") return Vn("unsupported-item-type");
    const a = VT(r);
    return Object.keys(a).length === 0 ? Vn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function VT(e) {
  const t = {};
  M(t, "name", e.name), M(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (M(t, "system.circle", n.circle), M(t, "system.element", n.element), M(t, "system.target", n.target), M(t, "system.targetQtd", n.targetQuantity), M(t, "system.execution", n.execution), M(t, "system.range", n.range), M(t, "system.duration", n.duration), M(t, "system.skillResis", n.resistanceSkill), M(t, "system.resistance", n.resistance), M(t, "system.studentForm", n.studentForm), M(t, "system.trueForm", n.trueForm)), t;
}
function M(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Vn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class HT {
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
    return this.getNumber(t, Fr.ritual.dt, 0);
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
class WT {
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
class KT {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = YT(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Hn(t)), y(t)) : n;
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
    return n ? Hn(n) : null;
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
    return Array.from(this.presets.values()).map(Hn);
  }
  findForItem(t) {
    return this.list().map((n) => XT(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function YT(e) {
  return !Wn(e.id) || !Wn(e.version) || !Wn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function XT(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = QT(a, t);
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
function QT(e, t) {
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
      const n = Si(t.name), r = e.names.map(Si).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = ZT(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Si(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ZT(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Hn(e) {
  return structuredClone(e);
}
function Wn(e) {
  return typeof e == "string" && e.length > 0;
}
function Qt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Tn(e.amountFrom);
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
function Tn(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function JT(e, t, n) {
  if (!Ii(e.id) || !Ii(e.formula))
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
    await Cc(a);
    const l = {
      ...n.rollRequests[e.id] ?? Ic(e, t),
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
function Ic(e, t) {
  const n = e.intent ?? eR(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function eR(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Ii(e) {
  return typeof e == "string" && e.length > 0;
}
async function Zt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Dt(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Dt(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? Dt(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? Dt(t, n, r, a) : e.recover(t, n, a);
  }
}
function Dt(e, t, n, r) {
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
function tR(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = nR(t, n, r, a);
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
    const s = rR(t, n, r, a);
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
function nR(e, t, n, r) {
  const a = Tn(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Lc(t.id, "damage", r, t.damageInstances.length),
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
function rR(e, t, n, r) {
  const a = Tn(e.amountFrom);
  return {
    id: Lc(t.id, "healing", r, t.healingInstances.length),
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
function Lc(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function aR(e, t, n) {
  const r = Tn(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function oR(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), vc("before", e), Li("before", e), Li("resolve", e);
}
function iR(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), vc("apply", e);
}
function sR(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function vc(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = lR(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Li(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function lR(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function cR(e, t, n) {
  return y(void 0);
}
async function uR(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return dR(e, t);
    case "spendRitualCost":
      return mR(e, t);
  }
}
async function dR(e, t) {
  const { context: n, resources: r } = e, a = Qt(t, n);
  return a.ok ? Dc(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function mR(e, t) {
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
  }), Dc(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Dc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function fR(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = pR(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function pR(e) {
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
class gR {
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
        return fR({
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
    const a = await uR({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Ic(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await JT(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Qt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = aR(t, n, a.value);
    oR({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), iR({
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
      const c = await Zt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      tR({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return sR({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Qt(t, n);
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
      const l = await Zt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await cR(this.messages);
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
    const l = hR(t, n.intent);
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
function hR(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class bR {
  emitCastStarted(t) {
    Hooks.callAll(Ot.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Ot.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Ot.ritual.castFinished, t);
  }
}
class yR {
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
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: a,
        current: s.value,
        required: a,
        cause: g
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: a,
      appliedAmount: u,
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
class _R {
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
function xc(e) {
  return {
    id: AR(),
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
function AR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class TR {
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
    return De(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = xc(n);
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
class RR {
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
class kR {
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
    const n = lr();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: $R(),
      flags: {
        ...t.flags,
        [d]: {
          ...ER(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = lr();
    if (!r.enabled)
      return;
    const a = n.notification ?? vi(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = vi(n);
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
function vi(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function $R() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function ER(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const wR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Nc = `${d}-inline-roll-neutralized`, CR = `${d}-inline-roll-notice`, Ga = `data-${d}-inline-roll-neutralized`, Di = `data-${d}-inline-roll-notice`, SR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function xi(e) {
  const t = qR(e.message), n = await IR(e.message), r = LR(t);
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
async function IR(e) {
  const t = BR(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = vR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await UR(t, n.content), replacementCount: n.replacementCount };
}
function LR(e) {
  const t = e ? zR(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Pc(t);
  return n > 0 && Mc(MR(t)), { replacementCount: n };
}
function vR(e) {
  const t = DR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Pc(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Mc(n.content), { content: n.innerHTML, replacementCount: a });
}
function DR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, NR(a.trim()))), replacementCount: t };
}
function Pc(e) {
  const t = xR(e);
  for (const n of t)
    n.replaceWith(PR(OR(n)));
  return t.length;
}
function xR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(wR))
    n.getAttribute(Ga) !== "true" && t.add(n);
  return Array.from(t);
}
function NR(e) {
  return `<span class="${Nc}" ${Ga}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${GR(e)}</span>`;
}
function PR(e) {
  const t = document.createElement("span");
  return t.classList.add(Nc), t.setAttribute(Ga, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Mc(e) {
  if (e.querySelector?.(`[${Di}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(CR), t.setAttribute(Di, "true"), t.textContent = SR, e.append(t);
}
function MR(e) {
  return e.querySelector(".message-content") ?? e;
}
function OR(e) {
  const n = e.getAttribute("data-formula") ?? FR(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function FR(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function BR(e) {
  return e && typeof e == "object" ? e : null;
}
async function UR(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function zR(e) {
  const t = jR(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function qR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function GR(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function jR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Jt = "ritualRollConfig", en = "ritual-roll", VR = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function Rn() {
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
function Oc(e) {
  const t = e.getFlag(d, Jt);
  return Br(t);
}
function Fc(e) {
  return Oc(e) ?? Rn();
}
async function HR(e, t) {
  const n = Br(t) ?? Br({
    ...Rn(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Jt, n), n;
}
async function WR(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Jt));
    return;
  }
  await e.setFlag(d, Jt, null);
}
function Br(e) {
  if (!kn(e)) return null;
  const t = rk(e.intent);
  if (!t) return null;
  const n = Rn();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Ur(e.damageType),
    utilityLabel: Ur(e.utilityLabel) ?? n.utilityLabel,
    note: ja(e.note),
    forms: ok(e.forms)
  };
}
function KR(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function YR(e) {
  const t = Oc(e), n = Bc(e);
  if (!t)
    return Ni(e, n);
  const r = tk(e, t);
  if (!r)
    return Ni(e, n);
  const a = XR(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...QR(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: JR(e, t),
    resistance: n
  };
}
function Ni(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: ek(e),
    resistance: t
  } : null;
}
function XR(e, t) {
  const n = {
    type: "rollFormula",
    id: en,
    formula: t,
    intent: nk(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function QR(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${en}.total`,
          ...ZR(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${en}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function ZR(e) {
  return e ? { damageType: e } : {};
}
function JR(e, t) {
  const n = {
    base: Kn("Padrão", t.forms.base.formula)
  };
  return Ge(e, "discente") && (n.discente = Kn("Discente", t.forms.discente.formula, 2)), Ge(e, "verdadeiro") && (n.verdadeiro = Kn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function Kn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [en]: t.trim()
    }
  };
}
function ek(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Ge(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Ge(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function tk(e, t) {
  return [
    t.forms.base.formula.trim(),
    Ge(e, "discente") ? t.forms.discente.formula.trim() : "",
    Ge(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Bc(e) {
  const t = Uc(e), n = Ur(t.skillResis), r = ak(t.resistance);
  if (!n || !r) return;
  const a = ik(n), o = VR[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function nk(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function rk(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function ak(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function ok(e) {
  const t = Rn();
  return kn(e) ? {
    base: Yn(e.base),
    discente: Yn(e.discente),
    verdadeiro: Yn(e.verdadeiro)
  } : t.forms;
}
function Yn(e) {
  return kn(e) ? { formula: ja(e.formula) } : { formula: "" };
}
function Ge(e, t) {
  const n = Uc(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return sk(r);
}
function Uc(e) {
  const t = e.system;
  return kn(t) ? t : {};
}
function ik(e) {
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
function sk(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ja(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Ur(e) {
  const t = ja(e);
  return t.length > 0 ? t : null;
}
function kn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function lk(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function ck(e) {
  switch (uk(e)) {
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
      return dk(String(e ?? ""));
  }
}
function uk(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function dk(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function mk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function fk(e) {
  return {
    ...Va(e),
    type: "ritual.cast.started"
  };
}
function pk(e) {
  return {
    ...Va(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function gk(e) {
  return {
    ...Va(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function hk(e) {
  if (e.type === "preset") {
    const t = Re(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: Re(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: Re(e.label),
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
function bk(e, t = {}) {
  const n = Dk(e), r = [
    ...Nk(t.candidates ?? []),
    ...Pk(e)
  ], a = Ok(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = xk(t) ?? Fk(r) ?? Uk(a), s = qk(canvas?.grid?.size), l = yk(o, a, r), c = wk(r), u = Ek(l);
  return {
    type: "rectangleRay",
    sceneId: zk(e, n),
    regionId: zi(n?.id) ?? zi(e.id),
    gridSize: s,
    bounds: {
      x: a.x,
      y: a.y,
      width: a.width,
      height: a.height
    },
    shape: l,
    center: {
      x: a.x + a.width / 2,
      y: a.y + a.height / 2
    },
    ray: c ?? u ?? {
      start: null,
      end: null
    },
    source: "lineArea",
    targetingMode: "lineArea"
  };
}
function yk(e, t, n) {
  const r = {
    x: x(e, "x") ?? 0,
    y: x(e, "y") ?? 0,
    width: x(e, "width") ?? t.width,
    height: x(e, "height") ?? t.height,
    direction: x(e, "direction") ?? 0,
    elevation: x(e, "elevation")
  };
  return {
    ...r,
    direction: _k(r, t, n)
  };
}
function _k(e, t, n) {
  const r = Ak(n);
  return r !== null ? r : Rk(e, t) ?? e.direction;
}
function Ak(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = Pi(n, t);
    if (r !== null) return r;
    const a = $n(n), o = Pi(a, t);
    if (o !== null) return o;
  }
  return null;
}
function Pi(e, t) {
  for (const n of t) {
    const r = Tk(G(e, n));
    if (r !== null) return r;
  }
  return null;
}
function Tk(e) {
  const t = pt(e);
  if (t === null) return null;
  const n = Wa(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function Rk(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Oi(Mi(e, e.direction), t), r = kk(e, t);
  if (r === null) return null;
  const o = $k([
    r,
    -r,
    180 - r,
    180 + r,
    0,
    90,
    180,
    270
  ]).map((l) => ({
    direction: l,
    error: Oi(Mi(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? Wa(o.direction) : null;
}
function kk(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = qi(o, 0, 1), c = qi(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : Gk(Math.atan2(c, l));
}
function Mi(e, t) {
  const n = qc(t), r = {
    x: Math.cos(n),
    y: Math.sin(n)
  }, a = {
    x: -Math.sin(n),
    y: Math.cos(n)
  }, o = [
    { x: e.x, y: e.y },
    {
      x: e.x + r.x * e.width,
      y: e.y + r.y * e.width
    },
    {
      x: e.x + a.x * e.height,
      y: e.y + a.y * e.height
    },
    {
      x: e.x + r.x * e.width + a.x * e.height,
      y: e.y + r.y * e.width + a.y * e.height
    }
  ], s = o.map((_) => _.x), l = o.map((_) => _.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), g = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: g - m
  };
}
function Oi(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function $k(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = Wa(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function Ek(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = qc(e.direction), n = {
    x: Math.cos(t),
    y: Math.sin(t)
  }, r = {
    x: -Math.sin(t),
    y: Math.cos(t)
  }, a = e.height / 2, o = {
    x: e.x + r.x * a,
    y: e.y + r.y * a
  };
  return {
    start: o,
    end: {
      x: o.x + n.x * e.width,
      y: o.y + n.y * e.width
    }
  };
}
function wk(e) {
  for (const t of e) {
    const n = Fi(t, "ray.start"), r = Fi(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Fi(e, t) {
  const n = G(e, t), r = pt(G(n, "x")), a = pt(G(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function Va(e) {
  const t = hk(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: Ik(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: Ck(e.context.item, e.form, e.formLabel, t),
    targets: n.map(Lk),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function Ck(e, t, n, r) {
  return {
    name: e.name,
    slug: Xn(e, "system.slug") ?? Xn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: Xn(e, "system.element"),
    circle: vk(e),
    form: Sk(t),
    formLabel: n
  };
}
function Sk(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function Ik(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function Lk(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function vk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : Re(t);
}
function Xn(e, t) {
  return Re(foundry.utils.getProperty(e, t));
}
function Re(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function Dk(e) {
  return "document" in e && e.document ? e.document : e;
}
function xk(e) {
  return zc(e.shape);
}
function Nk(e) {
  return e.filter(Ha);
}
function Pk(e) {
  return [
    e,
    Mk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Ha);
}
function Mk(e) {
  return "object" in e && Ha(e.object) ? e.object : null;
}
function Ha(e) {
  return !!(e && typeof e == "object");
}
function Ok(e) {
  for (const t of e) {
    const n = Bi(G($n(t), "bounds"));
    if (n) return n;
    const r = Bi(G(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function Bi(e) {
  const t = x(e, "x"), n = x(e, "y"), r = x(e, "width"), a = x(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function x(e, t) {
  return pt(G(e, t));
}
function Fk(e) {
  for (const t of e) {
    const n = Bk(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function Bk(e) {
  if (!e || typeof e != "object") return [];
  const t = Ui($n(e));
  return t.length > 0 ? t : Ui(e);
}
function Ui(e) {
  const t = G(e, "shapes");
  return Array.isArray(t) ? t.map(zc).filter((n) => n !== null) : [];
}
function zc(e) {
  const t = $n(e) ?? e, n = G(t, "type");
  return typeof n != "string" ? null : {
    type: n,
    x: x(t, "x"),
    y: x(t, "y"),
    width: x(t, "width"),
    height: x(t, "height"),
    direction: x(t, "direction"),
    elevation: x(t, "elevation")
  };
}
function Uk(e) {
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
function zk(e, t) {
  return Qn(e, "parent.id") ?? Qn(e, "document.parent.id") ?? Qn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Qn(e, t) {
  return Re(G(e, t));
}
function G(e, t) {
  if (!e || typeof e != "object") return;
  let n = e;
  for (const r of t.split(".")) {
    if (!n || typeof n != "object") return;
    try {
      n = n[r];
    } catch {
      return;
    }
  }
  return n;
}
function $n(e) {
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
function zi(e) {
  return Re(e);
}
function pt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function qk(e) {
  const t = pt(e);
  return t !== null && t > 0 ? t : null;
}
function qc(e) {
  return e * Math.PI / 180;
}
function Gk(e) {
  return e * 180 / Math.PI;
}
function Wa(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function qi(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class jk {
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
class En {
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
const Vk = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class Hk {
  constructor(t = new En()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = Wk(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(Vk);
  }
}
function Wk(e, t) {
  const n = [], r = Kk(e), a = Gi(r), o = Gi(e);
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
function Kk(e) {
  return Yk(e) ? e.document ?? null : e;
}
function Yk(e) {
  return "bounds" in e;
}
function Gi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const Xk = 100, Qk = 12;
class Zk {
  constructor(t = new En()) {
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
      const a = this.foundryAdapter.getGridSize() ?? Xk, o = r$(n), s = await this.foundryAdapter.placeRegion(
        Jk(t, this.foundryAdapter.getUserColor(), a),
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
        message: n$(a)
      };
    }
  }
}
function Jk(e, t, n) {
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
    shapes: [e$(e, n)]
  };
}
function e$(e, t) {
  const n = t$(e, t);
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
function t$(e, t) {
  return {
    length: ji(e.length, Qk, t),
    width: ji(e.width, 1, t)
  };
}
function ji(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function n$(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function r$(e) {
  const t = (n) => {
    const r = a$(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function a$(e) {
  return o$(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function o$(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class i$ {
  constructor(t = new En()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(Vi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Vi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = s$(t);
    l$(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Vi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function s$(e) {
  return Array.from(new Set(e));
}
function l$(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class c$ {
  constructor(t = new En()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Os)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(u$(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(d$(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: zr(r.region)
    }));
    for (const r of t) {
      if (!zr(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = f$(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function u$(e) {
  return [
    { source: "document", region: Te(e.document) },
    { source: "document.object", region: Te(e.document.object) },
    { source: "preview", region: Te(e.preview) },
    { source: "preview.document.object", region: Te(e.preview?.document?.object) }
  ];
}
function d$(e) {
  return [
    { source: "input", region: Te(e) },
    { source: "input.object", region: m$(e) ? Te(e.object) : null },
    { source: "input.document.object", region: Gc(e) ? Te(e.document?.object) : null }
  ];
}
function Te(e) {
  return zr(e) ? e : null;
}
function zr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return xt(n.x) && xt(n.y) && xt(n.width) && xt(n.height);
}
function Gc(e) {
  return "document" in e && "bounds" in e;
}
function m$(e) {
  return !Gc(e);
}
function f$(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function xt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class p$ {
  async minimizeForPlacement() {
    const t = [];
    for (const n of b$())
      await g$(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await h$(n);
      }
    };
  }
}
async function g$(e) {
  if (jc(e) || !E$(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function h$(e) {
  if (jc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function b$() {
  const e = /* @__PURE__ */ new Set();
  for (const t of y$())
    T$(t) && R$(t) && e.add(t);
  return [...e];
}
function y$() {
  return [
    ...Hi(_$()),
    ...Hi(A$())
  ];
}
function Hi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function _$() {
  return globalThis.ui?.windows ?? null;
}
function A$() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function T$(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function R$(e) {
  const t = k$(e), n = $$(t);
  return n === "Actor" || n === "Item";
}
function k$(e) {
  return e.document ?? e.object ?? null;
}
function $$(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function E$(e) {
  const t = w$(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function w$(e) {
  const t = e.element;
  if (Wi(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Wi(n)) return n;
  }
  return null;
}
function Wi(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function jc(e) {
  return e.minimized === !0;
}
const C$ = "Nenhum alvo encontrado na linha.";
class S$ {
  constructor(t = new Zk(), n = new c$(), r = new Hk(), a = new i$(), o = new jk(), s = new p$()) {
    this.regionLinePlacement = t, this.regionTargetResolver = n, this.regionCleanup = r, this.regionTargetPreview = a, this.foundryAdapter = o, this.placementWindowManager = s;
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
      const r = [], a = this.regionTargetPreview.captureCurrentTargets(), o = () => {
        this.regionTargetPreview.restorePreviousTargets(a);
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
                r.push(c);
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = L$(r), m = bk(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(C$), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = I$(c);
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
function I$(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function L$(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function v$(e) {
  return {
    header: {
      eyebrow: Es,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: B$(e.ritual)
    },
    forms: e.variantOptions.map((t) => D$(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: P$(e.targetNames, e.variantOptions, e.ritual),
    automation: F$(e.automationStatus ?? "assisted")
  };
}
function D$(e, t) {
  const n = x$(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? N$(t) : "—",
    details: n
  };
}
function x$(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function N$(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function P$(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => M$(a, n))
  };
}
function M$(e, t) {
  const n = e.targeting ?? O$(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function O$(e, t) {
  const n = bt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function F$(e) {
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
function B$(e) {
  const t = e.system, n = [z$(t?.element), U$(t?.circle)].filter(j$);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function U$(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function z$(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (q$(e)) {
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
      return G$(e);
  }
}
function q$(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function G$(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function j$(e) {
  return typeof e == "string" && e.length > 0;
}
const Vc = ["base", "discente", "verdadeiro"];
function Ka(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function tn(e) {
  return typeof e == "string" && Vc.includes(e);
}
const { ApplicationV2: V$ } = foundry.applications.api;
class ut extends V$ {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = v$(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    K$(a, (o) => {
      this.selectedVariant = o, qr(a, o);
    }), qr(a, this.selectedVariant), Y$(a, (o) => {
      this.spendResource = o;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${v(this.model.header.eyebrow)}</p>
        <div>
          <h2>${v(this.model.header.title)}</h2>
          <p>${v(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(H$).join("")}
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
          <div><dt>Custo base</dt><dd>${v(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${v(this.model.cost.casterName)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--targets">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Alvos</h3>
          <span class="paranormal-toolkit-ritual-cast__automation-note paranormal-toolkit-ritual-cast__automation-note--${this.model.automation.status}">
            ${v(this.model.automation.title)}
          </span>
        </div>
        <div class="paranormal-toolkit-ritual-cast__targeting-forms">
          ${this.model.targets.forms.map(W$).join("")}
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targets">
          <div class="paranormal-toolkit-ritual-cast__summary-targets"><dt>Alvos atuais</dt><dd>${v(this.model.targets.targetText)}</dd></div>
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
    const n = J$(t), r = X$(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function H$(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.details.map((o) => `<span>${v(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${v(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${v(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${v(e.label)}</strong>
        <em>${v(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${a}</span>
    </label>
  `;
}
function W$(e) {
  const t = e.checked ? "" : "hidden", n = e.showLineToggle && e.lineOptionLabel ? `
        <label class="paranormal-toolkit-ritual-cast__targeting-line-toggle">
            <input
              type="checkbox"
              name="areaTargeting-${v(e.variant)}"
              ${e.lineEnabledByDefault ? "checked" : ""}
              data-paranormal-toolkit-area-targeting-line-toggle
            >
            <span>
              <strong>${v(e.lineOptionLabel)}</strong>
              ${e.helperText ? `<em>${v(e.helperText)}</em>` : ""}
            </span>
        </label>
      ` : "";
  return `
    <div
      class="paranormal-toolkit-ritual-cast__targeting-form"
      data-paranormal-toolkit-targeting-form="${v(e.variant)}"
      data-paranormal-toolkit-targeting-mode="${v(e.mode)}"
      ${t}
    >
      <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targeting-mode">
        <div><dt>Modo</dt><dd>${v(e.modeLabel)}</dd></div>
      </dl>
      ${n}
    </div>
  `;
}
function K$(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => Ki(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Ki(e, a, t));
    });
  const r = Hc(e);
  r && t(r);
}
function Ki(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !tn(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Hc(e), qr(e, r.value));
}
function Hc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && tn(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function qr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function Y$(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function X$(e, t, n) {
  const r = Z$(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = Q$(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function Q$(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function Z$(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (tn(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return tn(n) ? n : null;
}
function J$(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function v(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function eE(e) {
  return ut.request(e);
}
const Ya = {
  label: "Padrão"
}, tE = {
  label: "Discente",
  extraCost: 2
}, nE = {
  label: "Verdadeiro",
  extraCost: 5
};
class rE {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new S$();
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
    const a = this.resolveCostPreview(t), o = QE(n), s = KE(
      n,
      t.item,
      a,
      o
    ), l = await eE({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((E) => E.name),
      cost: a,
      defaultSpendResource: rw(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = aE(l), u = JE(
      n,
      t.item,
      c.variant,
      o
    ), m = mk(), g = u.label ?? Ka(c.variant), _ = uE(u), k = (E = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: g,
      targets: E
    }), R = (E, S = t.targets, B = {}) => {
      this.ritualEvents.emitCastFinished(
        gk({
          ...k(S),
          status: E,
          ...B
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      fk(k())
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
    const b = oE(
      t,
      $.targets
    );
    $.areaSnapshot && this.ritualEvents.emitAreaResolved(
      pk({
        ...k($.targets),
        area: $.areaSnapshot
      })
    );
    const I = js();
    let A = null;
    if (I) {
      const E = await sE(
        this.resources,
        b.actor,
        c,
        u,
        a
      );
      if (!E.ok)
        return R("failed", b.targets, {
          reason: E.reason,
          message: E.message
        }), {
          status: "failed",
          reason: E.reason,
          message: E.message
        };
      try {
        const S = await xT(
          b.actor
        );
        A = dE(
          S,
          u,
          a
        );
      } catch (S) {
        const B = S instanceof Error ? S.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return R("failed", b.targets, {
          reason: "ritual-casting-check-failed",
          message: B
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: B,
          cause: S
        };
      }
    }
    const F = iE(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !I
      }
    );
    if (F.steps.length === 0) {
      const E = ZE(
        b,
        c
      ), S = Xi(
        n,
        b
      ), B = Yi(
        b.actor,
        A,
        u,
        a
      ), H = Qi(
        n,
        c,
        u,
        a,
        E,
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
        ...B,
        ...S.actions
      ];
      return $t.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: E,
        itemUseContext: b,
        actions: $t,
        summaryLines: H
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: E,
        itemUseContext: b,
        summaryLines: H
      });
    }
    const D = await this.workflow.runAutomation(F, {
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
    if (!D.ok)
      return R("failed", b.targets, {
        reason: D.error.reason,
        message: D.error.message
      }), {
        status: "failed",
        reason: D.error.reason,
        message: D.error.message,
        cause: D.error
      };
    const V = D.value.context, L = bE(
      n,
      b,
      V,
      _
    ), z = Xi(
      n,
      b
    ), kt = Yi(
      b.actor,
      A,
      u,
      a
    ), fe = Qi(
      n,
      c,
      u,
      a,
      V,
      b,
      A
    );
    if (!L.ok)
      return R("failed", b.targets, {
        reason: L.reason,
        message: L.message
      }), {
        status: "failed",
        reason: L.reason,
        message: L.message
      };
    if (!z.ok)
      return R("failed", b.targets, {
        reason: z.reason,
        message: z.message
      }), {
        status: "failed",
        reason: z.reason,
        message: z.message
      };
    const C = [
      ...kt,
      ...L.actions,
      ...z.actions
    ];
    return C.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: V,
      itemUseContext: b,
      summaryLines: fe
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: V,
      itemUseContext: b,
      actions: C,
      summaryLines: fe
    });
  }
  async applyAction(t) {
    return Zt(
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
function aE(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function oE(e, t) {
  return {
    ...e,
    targets: t
  };
}
function iE(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Qa(l) && (!a.includeCostSteps || !s))
      continue;
    const c = lE(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && aw(n.extraCost) && o.push({
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
async function sE(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Ye(a, r);
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
function lE(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = cE(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function cE(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function uE(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function dE(e, t, n) {
  const a = mE(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function mE(e, t) {
  const n = Ye(e, t);
  return n ? lk(n.amount) : null;
}
function Yi(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Ye(r, n);
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
function Xi(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = Xa(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = gl(o);
      n.push(
        fE(
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
function fE(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? hE(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: pE(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: gE(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function pE(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function gE(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function hE(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function bE(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || yE(s, r)) continue;
    const l = Qt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = Xa(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (_E(s)) {
        AE(
          o,
          u,
          TE(s, n, l.value)
        );
        continue;
      }
      a.push(kE(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...RE(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function yE(e, t) {
  const n = Wc(e.amountFrom);
  return n !== null && t.has(n);
}
function _E(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function AE(e, t, n) {
  const r = CE(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function TE(e, t, n) {
  const r = Wc(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function RE(e, t, n, r) {
  const a = vE(e), o = a.length > 1 ? NE() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const g = DE(u.amount, s);
        return {
          id: $E(u, s, m),
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
      label: EE(c, s, a.length > 1),
      executedLabel: wE(
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
function kE(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = LE(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: SE(e, r, n),
    executedLabel: IE(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function $E(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function EE(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function wE(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function CE(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Wc(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function SE(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function IE(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function LE(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function vE(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function DE(e, t) {
  const n = e * t.multiplier, r = xE(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function xE(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function NE() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Xa(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Qi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${Ka(t.variant)}`,
    FE(t, n, r),
    ...OE(s),
    ...Object.values(a.rolls).flatMap(BE),
    ...PE(e, o),
    ...UE(e.resistance),
    ...HE(n)
  ];
}
function PE(e, t) {
  return ME(e) ? Xa("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function ME(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function OE(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function FE(e, t, n) {
  const r = Ye(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function BE(e) {
  const n = [`${WE(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = zE(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${ck(e.damageType)}`), n;
}
function UE(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function zE(e) {
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
    const s = qE(o);
    s && (VE(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function qE(e) {
  const t = GE(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : jE(e);
}
function GE(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function jE(e) {
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
function VE(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function HE(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function WE(e) {
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
function KE(e, t, n, r) {
  return Vc.map((a) => {
    const o = Kc(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? Ka(a),
      enabled: s,
      details: o ? YE(o, n) : [],
      finalCostText: o ? XE(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function YE(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  a.length > 0 ? r.push(a.join(", ")) : r.push("efeito manual");
  const o = Ye(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Ye(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function XE(e, t) {
  const n = Ye(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function QE(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Qa);
}
function ZE(e, t) {
  return xc({
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
function JE(e, t, n, r) {
  return Kc(e, t, n, r) ?? Ya;
}
function Kc(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? tw(t, n) ? ew(n) : null : n === "base" ? Ya : null);
}
function ew(e) {
  switch (e) {
    case "base":
      return Ya;
    case "discente":
      return tE;
    case "verdadeiro":
      return nE;
  }
}
function tw(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return nw(foundry.utils.getProperty(e, n));
}
function nw(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function rw(e) {
  return e.steps.some(Qa);
}
function Qa(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function aw(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Yc = "itemUsePrompts", Xc = "chatCard", wn = "data-paranormal-toolkit-prompt-id", Cn = "data-paranormal-toolkit-pending-id", Za = "data-paranormal-toolkit-executed-label", Gr = "data-paranormal-toolkit-choice-group", Qc = "data-paranormal-toolkit-skipped-label", nn = "data-paranormal-toolkit-action-section", Zi = "data-paranormal-toolkit-detail-key", Ji = "data-paranormal-toolkit-roll-card", Ja = "data-paranormal-toolkit-roll-detail-toggle", Zc = "data-paranormal-toolkit-roll-detail-id", Jc = "data-paranormal-toolkit-resistance-roll-button", eu = "data-paranormal-toolkit-resistance-skill", tu = "data-paranormal-toolkit-resistance-skill-label", nu = "data-paranormal-toolkit-resistance-target-actor-id", ru = "data-paranormal-toolkit-resistance-target-name", au = "data-paranormal-toolkit-resistance-roll-result", es = "data-paranormal-toolkit-system-card-replaced", ow = `[${Cn}]`, iw = `[${Ja}]`, sw = `[${Jc}]`, jr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, lw = `${h}__actions`, ts = `${h}__details`, ou = `${h}__summary`, cw = `${h}__title`, iu = `${h}__button--executed`, Nt = `${h}__roll-card`, uw = "data-paranormal-toolkit-roll-card-target-mode", dw = "data-paranormal-toolkit-roll-card-target-names", mw = "data-paranormal-toolkit-roll-card-resistance", fw = "data-paranormal-toolkit-roll-card-resistance-skill", pw = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let ns = !1, Vr = null;
const Q = /* @__PURE__ */ new Map(), gw = [0, 100, 500, 1500, 3e3], hw = 3e4, bw = [0, 100, 500, 1500, 3e3];
function yw(e) {
  if (Vr = e, ns) {
    as(e);
    return;
  }
  const t = (n, r) => {
    lu(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ns = !0, as(e);
}
async function rs(e) {
  const t = su(e);
  Q.set(e.pendingId, t), await no(t) || Au(t), cu(e.pendingId);
}
async function _w(e) {
  const t = su({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", Q.set(e.pendingId, t), await no(t) || Au(t), cu(e.pendingId);
}
async function Zn(e, t) {
  const n = Q.get(e);
  Q.delete(e), n && await kC(n, t);
}
function eo(e) {
  const t = wu();
  for (const n of t) {
    const r = ae(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Aw(e, t) {
  const n = eo(e);
  if (!n) return;
  const r = ae(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Xe(n.message, r));
}
async function Tw(e, t, n) {
  if (!t) return;
  const r = eo(e);
  if (!r) return;
  const a = ae(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Xe(r.message, a);
}
function su(e) {
  const t = me(e.context.message), n = e.context.targets.find((s) => Yr(s)), r = n ? Yr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Yw(e.context),
    executed: !1
  };
}
function lu(e, t, n) {
  RC();
  const r = In(t);
  if (!r) return;
  const a = _C(e, r);
  a.length > 0 && rn(r);
  for (const o of a)
    Hr(r, o);
  pu(r, n), Wr(r), Kr(r);
}
function as(e) {
  for (const t of bw)
    globalThis.setTimeout(() => {
      Rw(e);
    }, t);
}
function Rw(e) {
  for (const t of kw()) {
    const n = Sn(t);
    $w(n) && lu(n, t, e);
  }
}
function kw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function $w(e) {
  return e ? ro(e) ? !0 : EC(e).length > 0 : !1;
}
function cu(e) {
  const t = Q.get(e);
  if (!t) return;
  const n = t.messageId ? AC(t.messageId) : null;
  if (n) {
    cs(n, t), rn(n), Hr(n, t), os(n), Wr(n), Kr(n);
    return;
  }
  if (t.messageId) {
    Qr(t);
    return;
  }
  const r = TC(t);
  if (r) {
    cs(r, t), rn(r), Hr(r, t), os(r), Wr(r), Kr(r);
    return;
  }
  Qr(t);
}
function os(e) {
  Vr && pu(e, Vr);
}
function rn(e) {
  const t = Ew();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = fu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(es) === "true") return;
  const r = n.querySelector(`.${jr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(es, "true");
}
function Ew() {
  try {
    return Gs() === "replace";
  } catch {
    return !1;
  }
}
function Hr(e, t) {
  if (rn(e), e.querySelector(`[${wn}="${Qe(t.pendingId)}"]`)) return;
  const n = Cw(e, t);
  Iw(n, t);
  const r = Vw(t);
  if (ww(r)) return;
  jw(n, r).append(Kw(t));
}
function ww(e) {
  return du(e.id) && !$e();
}
function uu(e) {
  const n = e.closest(`[${nn}]`)?.getAttribute(nn) ?? null;
  return du(n) && !$e();
}
function du(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Cw(e, t) {
  const n = e.querySelector(`.${jr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(jr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(cw), s.textContent = Sw(t);
  const l = document.createElement("span");
  return l.classList.add(ou), l.textContent = t.summary, a.append(o, s, l), r.append(a), Qw(e).append(r), r;
}
function Sw(e) {
  const t = O(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Iw(e, t) {
  const n = t.summaryLines ?? [], r = yu(n, t);
  if (r) {
    Lw(e, r, t);
    return;
  }
  Hw(e, n);
}
function Lw(e, t, n) {
  if (e.querySelector(`[${Ji}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(
    Nt,
    `${Nt}--${t.intent}`,
    `${Nt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && r.classList.add(`${Nt}--multi-target`), r.setAttribute(Ji, "true"), r.setAttribute(uw, t.targetMode), r.setAttribute(dw, JSON.stringify(t.targetNames)), Bw(r, t), t.castingCheck && is(r, Dw(t.castingCheck), n.pendingId, "casting"), vw(t) && is(r, xw(t), n.pendingId, "effect"), Fw(r, t), Uw(r, t, n), Gw(r, t), e.append(r);
}
function vw(e) {
  return e.intent !== "casting";
}
function Dw(e) {
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
function xw(e) {
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
function is(e, t, n, r) {
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
  Nw(a, t), qw(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function Nw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = Pw(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function Pw(e, t) {
  const n = Mw(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of Ow(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Mw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Ow(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ss(e, "highest") : n.includes("kl") ? ss(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ss(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Fw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(GC);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function Bw(e, t) {
  t.resistance && (e.setAttribute(mw, t.resistance), t.resistanceSkill && e.setAttribute(fw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(pw, t.resistanceSkillLabel));
}
function Uw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = zw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(mu(t.resistanceRollResult)), e.append(r);
}
function zw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Ce())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(wn, t.pendingId), n.setAttribute(Jc, "true"), n.setAttribute(eu, e.resistanceSkill), n.setAttribute(tu, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(nu, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ru, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(au, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function mu(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = hu(e), t;
}
function qw(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Ja, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Zc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const g = document.createElement("dd");
    g.textContent = u.value, c.append(m, g);
  }
  e.append(l, c);
}
function Gw(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function jw(e, t) {
  const n = `[${nn}="${Qe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(lw), a.setAttribute(nn, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Vw(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = yu(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Hw(e, t) {
  if (t.length === 0) return;
  const n = Ww(e);
  for (const r of t) {
    const a = jC(r);
    if (n.querySelector(`[${Zi}="${Qe(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Zi, a), n.append(o);
  }
}
function Ww(e) {
  const t = e.querySelector(`.${ts}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ts), e.append(n), n;
}
function Kw(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(wn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(iu), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Cn, e.pendingId), t.setAttribute(Za, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Gr, e.choiceGroupId), t.setAttribute(Qc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Yw(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Xw(e);
  return `${t} → ${n}`;
}
function Xw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Qw(e) {
  return fu(e) ?? e;
}
function fu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function pu(e, t) {
  const n = In(e);
  if (!n) return;
  const r = n.querySelectorAll(ow);
  for (const a of r) {
    if (uu(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      dC(a, t);
    }));
  }
}
function Wr(e) {
  const t = In(e);
  if (!t) return;
  const n = t.querySelectorAll(iw);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Zw(t, r);
    }));
}
function Kr(e) {
  const t = In(e);
  if (!t) return;
  const n = t.querySelectorAll(sw);
  for (const r of n) {
    if (!Ce()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Jw(t, r);
    }));
  }
}
function Zw(e, t) {
  const n = t.getAttribute(Ja);
  if (!n) return;
  const r = e.querySelector(`[${Zc}="${Qe(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Jw(e, t) {
  if (!Ce()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(wn), r = t.getAttribute(eu), a = t.getAttribute(tu) ?? (r ? ke(r) : "Resistência");
  if (!n || !r) return;
  const o = nC(e, n), s = rC(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Vp(s, r);
    await lC(c.roll);
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
    eC(t, u), tC(t, u), cC(n, u), await uC(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function eC(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(au, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function tC(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? mu(t);
  if (r) {
    r.textContent = hu(t);
    return;
  }
  n.append(a);
}
function nC(e, t) {
  const n = Q.get(t);
  if (n) return n;
  const r = Sn(e);
  return ae(r)[t] ?? null;
}
function rC(e, t) {
  const n = e?.resistanceTargetActor;
  if (te(n)) return n;
  const a = e?.context?.targets.map(Yr).find(te) ?? null;
  if (a) return a;
  const o = t.getAttribute(nu) ?? e?.resistanceTargetActorId ?? null, s = o ? oC(o) : null;
  return s || iC(
    t.getAttribute(ru) ?? e?.resistanceTargetName ?? aC(t)
  );
}
function aC(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${ou}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Yr(e) {
  const t = e.actor;
  if (te(t)) return t;
  const n = e.token, r = gt(n);
  if (r) return r;
  const a = e.document;
  return gt(a);
}
function gt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (te(t)) return t;
  const n = e.document?.actor;
  return te(n) ? n : null;
}
function oC(e) {
  const n = game.actors?.get?.(e);
  return te(n) ? n : gu().map((o) => gt(o)).find((o) => o?.id === e) ?? null;
}
function iC(e) {
  const t = Oe(e);
  if (!t) return null;
  const n = gu().filter((o) => Oe(sC(o)) === t).map((o) => gt(o)).find(te) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => te(o) && Oe(o.name) === t);
  return te(a) ? a : null;
}
function gu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function sC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : gt(e)?.name ?? null;
}
function Oe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function te(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function hu(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function lC(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function cC(e, t) {
  const n = Q.get(e);
  n && (n.resistanceRollResult = t);
}
async function uC(e, t, n) {
  const r = Sn(e);
  if (r)
    try {
      const a = ae(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Xe(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function Sn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return re(r?.get?.(n));
}
async function dC(e, t) {
  if (uu(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(Cn);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    bu(e, e.getAttribute(Za) ?? "✓ Automação aplicada"), mC(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function bu(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(iu), e.removeAttribute(Cn), e.removeAttribute(Za);
}
function mC(e) {
  const t = e.getAttribute(Gr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Gr}="${Qe(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Qc) ?? "✓ Outra opção escolhida";
    bu(a, o);
  }
}
function yu(e, t) {
  const n = e.map(to).filter(zC), r = n.find(($) => $.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = O(e, "Forma"), o = O(e, "Custo"), s = O(e, "Dados") ?? O(e, `Dados (${r.label})`), l = O(e, "Tipo"), c = O(e, "Resistência"), u = O(e, "Resistência Perícia"), m = O(e, "Resistência Rótulo") ?? (u ? ke(u) : null), g = _u(e, "Observação"), _ = e.filter(($) => yC($, r)), k = hC(e), R = fC(t);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
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
function fC(e) {
  const t = pC(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function pC(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && gC(n) !== "nenhum alvo") : [];
}
function gC(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function hC(e) {
  const t = e.map(to).find((o) => o?.intent === "casting") ?? null, n = O(e, "Conjuração DT"), r = O(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: O(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: O(e, "Dados (Conjuração)")
  } : null;
}
function to(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: bC(n)
  } : null;
}
function bC(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function O(e, t) {
  return _u(e, t)[0] ?? null;
}
function _u(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function yC(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || to(e) ? !1 : e.trim().length > 0;
}
function _C(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of Q.values())
    Xr(r, e, t) && n.set(r.pendingId, r);
  for (const r of $C(e))
    Xr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Xr(e, t, n) {
  const r = me(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !ls(n, "itemId", e.itemId) ? !1 : !e.actorId || ls(n, "actorId", e.actorId);
}
function ls(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${VC(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function AC(e) {
  const t = Qe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function TC(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Xr(e, null, t))
      return t;
  return null;
}
function RC() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of Q.entries())
    e - r.createdAt > t && Q.delete(n);
}
async function cs(e, t) {
  const n = Sn(e);
  if (!n) return !1;
  try {
    const r = ae(n);
    return r[t.pendingId] = ao(t, me(n)), await Xe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function no(e) {
  const t = ku(e);
  if (!t) return !1;
  try {
    const n = ae(t);
    return n[e.pendingId] = ao(e, me(t)), await Xe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Au(e) {
  for (const t of gw)
    globalThis.setTimeout(() => {
      Qr(e);
    }, t);
}
async function Qr(e) {
  const t = ku(e);
  if (ro(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await no(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function kC(e, t) {
  const n = Ru(e.context.message);
  if (n)
    try {
      const r = ae(n), a = r[e.pendingId] ?? ao(e, me(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Xe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function $C(e) {
  return Object.values(ae(re(e))).filter(Tt);
}
function ae(e) {
  if (!e) return {};
  const t = {}, n = ro(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(Tu(e)))
    t[r] ??= a;
  return t;
}
function EC(e) {
  return Object.values(Tu(re(e))).filter(Tt);
}
function Tu(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Yc);
  if (!je(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    Tt(a) && (n[r] = a);
  return n;
}
async function Xe(e, t) {
  typeof e.setFlag == "function" && (await CC(e, t), await wC(e, t));
}
async function wC(e, t) {
  await Promise.resolve(e.setFlag?.(d, Yc, t));
}
function ro(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Xc);
  return BC(t) ? t : null;
}
async function CC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Tt).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? me(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: SC(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Xc, a));
}
function SC(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function ao(e, t) {
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
function Ru(e) {
  const t = re(e);
  if (t?.setFlag)
    return t;
  const n = IC(e);
  if (n?.setFlag)
    return n;
  const r = me(e);
  if (!r) return null;
  const a = game.messages;
  return re(a?.get?.(r));
}
function IC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(re).find((n) => typeof n?.setFlag == "function") ?? null;
}
function ku(e) {
  const t = Ru(e.context.message);
  if (t) return t;
  const n = e.messageId ? LC(e.messageId) : null;
  if (n) return n;
  const r = wu().slice().reverse();
  return r.find((a) => vC(a, e)) ?? r.find((a) => DC(a, e)) ?? null;
}
function LC(e) {
  const t = game.messages;
  return re(t?.get?.(e));
}
function vC(e, t) {
  const n = me(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!$u(e, t)) return !1;
  const a = Eu(e);
  return !t.actorId || !a || a === t.actorId;
}
function DC(e, t) {
  if (!NC(e, t)) return !1;
  const n = Eu(e);
  return t.actorId && n === t.actorId ? !0 : $u(e, t);
}
function $u(e, t) {
  const n = Oe(xC(e));
  if (!n) return !1;
  const r = Oe(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Oe(t.itemId);
  return !!(a && n.includes(a));
}
function xC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Eu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function NC(e, t) {
  const n = PC(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= hw;
}
function PC(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function re(e) {
  return e && typeof e == "object" ? e : null;
}
function Tt(e) {
  return je(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && q(e.messageId) && q(e.itemId) && q(e.actorId) && q(e.itemName) && ye(e.resistanceTargetActorId) && ye(e.resistanceTargetName) && UC(e.resistanceRollResult) && MC(e.actionPayload) && Jn(e.title) && Jn(e.buttonLabel) && Jn(e.executedLabel) && ye(e.choiceGroupId) && ye(e.skippedLabel) && ye(e.actionSectionId) && ye(e.actionSectionTitle) && qC(e.summaryLines) : !1;
}
function MC(e) {
  return e == null ? !0 : je(e) ? e.kind === "resource-operation" && q(e.actorId) && q(e.actorUuid) && typeof e.actorName == "string" && OC(e.resource) && FC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function OC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function FC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function BC(e) {
  return je(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && q(e.messageId) && je(e.source) && q(e.source.actorId) && q(e.source.actorName) && q(e.source.itemId) && q(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Tt) : !1;
}
function UC(e) {
  return e == null ? !0 : je(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ye(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function zC(e) {
  return e !== null;
}
function je(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function q(e) {
  return e === null || typeof e == "string";
}
function Jn(e) {
  return e === void 0 || typeof e == "string";
}
function ye(e) {
  return e == null || typeof e == "string";
}
function qC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function GC(e) {
  return typeof e == "string" && e.length > 0;
}
function wu() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(re).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(re).filter((r) => r !== null) : [];
}
function In(e) {
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
function jC(e) {
  return e.trim().toLowerCase();
}
function VC(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Qe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const us = 1e3;
class HC {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new rE(
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
      settings: cr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = cr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = ta(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && JC(t.item) && n.executionMode === "ask") {
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
    if (await xi(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: nr(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = KC(
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
      return this.pendingExecutions.delete(t), await Zn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Zn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = eo(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = nS(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Zt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await Aw(t), await Tw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (yw(
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
    if (await xi(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: nr(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      eS(t.item),
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
        ), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          De(a.workflowContext)
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
      if (!$e())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (ZC(n, a.value), await Ol(a.value), {
        ok: !0,
        executedLabel: WC(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!$e())
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
    const n = er(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && er(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Zn(
        a,
        ds(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = rr();
    await _w({
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
      const l = rr();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await rs({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: er(s),
        skippedLabel: ds(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: tS(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      De(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = rr();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await rs({
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
      De(a.value.context)
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
    const n = Date.now(), r = ms(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > us && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= us;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ms(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = nr(
      t,
      n,
      r,
      a
    );
  }
}
function WC(e) {
  return Fl({ inputAmount: e.totalRawDamage });
}
function KC(e, t) {
  if (t.resistance || !YC(t))
    return t;
  const n = Bc(e);
  return n ? { ...t, resistance: n } : t;
}
function YC(e) {
  return XC(e) && !QC(e);
}
function XC(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function QC(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function er(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function ds(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function ZC(e, t) {
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
function JC(e) {
  return e.type === "ritual";
}
function eS(e) {
  return YR(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function tS(e) {
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
function nS(e) {
  const t = e.actorUuid ? rS(e.actorUuid) : null;
  if (Ve(t)) return t;
  const n = e.actorId ? aS(e.actorId) : null;
  return n || oS(e.actorName);
}
function rS(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function aS(e) {
  const n = game.actors?.get?.(e);
  if (Ve(n)) return n;
  for (const r of Cu()) {
    const a = oo(r);
    if (a?.id === e) return a;
  }
  return null;
}
function oS(e) {
  const t = tr(e);
  if (!t) return null;
  for (const a of Cu()) {
    const o = iS(a);
    if (tr(o) === t) {
      const s = oo(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Ve(a) && tr(a.name) === t
  );
  return Ve(r) ? r : null;
}
function Cu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function iS(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : oo(e)?.name ?? null;
}
function oo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ve(t)) return t;
  const n = e.document?.actor;
  return Ve(n) ? n : null;
}
function tr(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ve(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function nr(e, t, n, r) {
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
function ms(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function rr() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class sS {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = yt(t);
    for (const s of n) {
      const l = s.itemId ? o.find((m) => m.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
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
class lS {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = yt(t).map((l) => this.analyzeRitual(l)), r = n.filter(Pt("upToDate")), a = n.filter(Pt("available")), o = n.filter(Pt("outdated")), s = n.filter(Pt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = cS(t);
    return n ? r ? r.source.type !== "preset" ? tt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? tt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : tt({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: uS(r, n.preset)
    }) : tt({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : tt({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
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
    preset: e.match ? sn(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function cS(e) {
  const t = e.getFlag(d, "automation");
  return na(t) ? t : null;
}
function uS(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Pt(e) {
  return (t) => t.status === e;
}
class dS {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = aa(t.transaction);
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
  createResourceOperationContent(t) {
    const n = Mt(t.actorName), r = Mt(t.resource), a = Mt(mS(t)), o = Mt(fS(t));
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
}
function mS(e) {
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
function fS(e) {
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
function Mt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function pS() {
  const e = new kT(), t = new yR(e), n = new fl(new ml()), r = new pl(new Ta()), a = new _R(new Sc()), o = new wT(), s = new zT(o), l = new HT(e), c = new KT(), u = c.registerMany(
    Ed()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new WT(), g = new jT(), _ = Rl(), k = new bl(_), R = new lS(
    c
  ), $ = new sS(
    R,
    m,
    g
  ), b = new kR(), I = new dS(b), A = new RR(), F = new bR(), D = new gR(
    t,
    s,
    I,
    A
  ), V = new TR(D, A), L = new HC(
    V,
    t,
    s,
    n,
    k,
    b,
    F
  );
  return L.addStrategy(
    new Ys(
      (z) => L.handleItemUsed(z)
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
    itemPatches: g,
    conditionRegistry: _,
    conditions: k,
    debugOutput: b,
    chatMessages: I,
    workflowHooks: A,
    ritualEvents: F,
    automation: D,
    workflow: V,
    itemUseIntegration: L,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: gS } = foundry.applications.api;
class an extends gS {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${J(Es)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${J(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${ar("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${ar("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${ar("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function ar(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${J(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? hS(n) : yS(t)}
    </section>
  `;
}
function hS(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(bS).join("")}</ol>`;
}
function bS(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${J(e.appliedPresetId)} v${J(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${J(e.itemName)}</strong>
        <span>${J(e.reason)}</span>
        ${r}
      </div>
      <em>${J(n)}</em>
    </li>
  `;
}
function yS(e) {
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
const on = `${d}.manageRitualPresets`, fs = `__${d}_ritualPresetHeaderControlRegistered`, _S = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function AS(e) {
  const t = globalThis;
  if (!t[fs]) {
    for (const n of _S)
      Hooks.on(n, (r, a) => {
        TS(r, a, e);
      });
    t[fs] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function TS(e, t, n) {
  Array.isArray(t) && kS(e) && (RS(e, n), !t.some((r) => r.action === on) && t.push({
    action: on,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Su(e, n);
    }
  }));
}
function RS(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[on] && (e.options.actions[on] = (n) => {
    n.preventDefault(), n.stopPropagation(), Su(e, t);
  }));
}
function kS(e) {
  if (!game.user?.isGM) return !1;
  const t = Iu(e);
  return t ? t.type === "agent" && yt(t).length > 0 : !1;
}
function Su(e, t) {
  const n = Iu(e);
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
function Iu(e) {
  return ps(e.actor) ? e.actor : ps(e.document) ? e.document : null;
}
function ps(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Zr = "data-paranormal-toolkit-stylesheet";
function $S(e) {
  const t = IS(e), n = ES(t), r = CS(n), a = wS(n, t);
  if (a)
    return a.href = r, a.setAttribute(Zr, t), a;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = r, o.setAttribute(Zr, t), document.head.append(o), o;
}
function ES(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, r = n.getRoute;
  return typeof r == "function" ? r.call(n, t) : t;
}
function wS(e, t) {
  const n = gs(e);
  for (const r of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (r.getAttribute(Zr) === t || gs(r.href) === n)
      return r;
  return null;
}
function CS(e) {
  const t = SS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function SS() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function gs(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function IS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Ae(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const r = document.createElement("span");
  return r.textContent = e, n.append(r, t), n;
}
function Jr(e, t, n) {
  const r = document.createElement("input");
  return r.type = "text", r.value = e, r.placeholder = t, r.disabled = !n, r;
}
function Gt(e, t, n) {
  const r = document.createElement("button");
  r.type = "button", n && r.classList.add(n);
  const a = document.createElement("i");
  a.className = t;
  const o = document.createElement("span");
  return o.textContent = e, r.append(a, o), r;
}
function Lu(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const r = document.createElement("i");
  return r.className = t, n.append(r), n;
}
function nt(e, t, n = !1) {
  const r = document.createElement("option");
  return r.value = e, r.textContent = t, r.selected = n, r;
}
function LS(e) {
  const { roll: t, index: n, editable: r, onChange: a, onRemove: o } = e, s = document.createElement("article");
  s.classList.add(`${d}-ability-roll-config__card`), s.dataset.abilityRollId = t.id;
  const l = document.createElement("header");
  l.classList.add(`${d}-ability-roll-config__card-header`);
  const c = document.createElement("div");
  c.classList.add(`${d}-ability-roll-config__card-title`);
  const u = document.createElement("strong");
  u.textContent = `Rolagem ${n + 1}`;
  const m = document.createElement("span");
  c.append(u, m);
  const g = Lu("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !r, g.addEventListener("click", o), l.append(c, g);
  const _ = document.createElement("div");
  _.classList.add(`${d}-ability-roll-config__fields`);
  const k = Jr(
    t.label,
    "Ex.: Dano adicional",
    r
  );
  k.addEventListener("input", () => {
    t.label = k.value, a();
  }), _.append(Ae("Nome da rolagem", k));
  const R = document.createElement("select");
  R.disabled = !r;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      nt(
        C,
        Ym(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = NS(R.value), kt(), a();
  }), _.append(Ae("Tipo da rolagem", R));
  const $ = document.createElement("div");
  $.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), _.append($);
  const b = document.createElement("section");
  b.classList.add(
    `${d}-ability-roll-config__formula-section`
  );
  const I = document.createElement("div");
  I.classList.add(
    `${d}-ability-roll-config__formula-header`
  );
  const A = document.createElement("strong");
  A.textContent = "Fórmula";
  const F = document.createElement("label");
  F.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const D = document.createElement("input");
  D.type = "checkbox", D.checked = t.formula.mode === "nex", D.disabled = !r;
  const V = document.createElement("span");
  V.textContent = "Varia conforme o NEX", F.append(D, V), I.append(A, F);
  const L = document.createElement("div");
  return L.classList.add(`${d}-ability-roll-config__formula`), b.append(I, L), D.addEventListener("change", () => {
    t.formula = D.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: DS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, z(), fe(), a();
  }), s.append(l, _, b), z(), kt(), fe(), s;
  function z() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function kt() {
    $.replaceChildren();
    const C = t.intent === "damage";
    if (_.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), $.hidden = !C, !C) return;
    const E = document.createElement("select");
    E.disabled = !r, E.append(nt("", "—", !t.damageType));
    for (const { value: S, label: B } of Qs)
      E.append(nt(S, B, t.damageType === S));
    E.addEventListener("change", () => {
      t.damageType = E.value || null, a();
    }), $.append(Ae("Tipo de dano", E));
  }
  function fe() {
    if (L.replaceChildren(), t.formula.mode === "fixed") {
      const H = Jr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        r
      );
      H.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = H.value, a());
      }), L.append(Ae("Expressão", H));
      return;
    }
    const C = t.formula, E = document.createElement("select");
    E.disabled = !r, E.append(
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
    ), E.addEventListener("change", () => {
      C.resolution = PS(E.value), a();
    }), L.append(Ae("Comportamento", E));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((H, $t) => {
      S.append(
        vS({
          step: H,
          editable: r,
          onChange: a,
          onRemove: () => {
            C.steps.splice($t, 1), fe(), a();
          }
        })
      );
    }), L.append(S);
    const B = Gt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    B.disabled = !r || C.steps.length >= pr, B.addEventListener("click", () => {
      C.steps.length >= pr || (C.steps.push({
        minNex: xS(
          C.steps.map((H) => H.minNex)
        ),
        formula: ""
      }), fe(), a());
    }), L.append(B);
  }
}
function vS(e) {
  const { step: t, editable: n, onChange: r, onRemove: a } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = MS(Number(s.value)), s.value = String(t.minNex), r();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = Jr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, r();
  });
  const m = Lu("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", a), o.append(
    Ae("NEX mínimo", l),
    Ae("Fórmula", u),
    m
  ), o;
}
function DS(e) {
  const t = zm(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function xS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function NS(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function PS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function MS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function OS(e) {
  let t = or(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const r = FS(t), a = document.createElement("p");
  a.classList.add(`${d}-ability-roll-config__hint`), a.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = Gt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= fr || (t.rolls.push(Js(t.rolls.length + 1)), _(), I("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = Gt("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = Gt("Limpar", "fa-solid fa-eraser");
  l.append(c, u);
  const m = document.createElement("footer");
  m.classList.add(`${d}-ability-roll-config__footer`), m.append(s, l);
  const g = document.createElement("p");
  return g.classList.add(`${d}-ability-roll-config__status`), g.textContent = e.editable ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", n.append(r, a, o, m, g), c.addEventListener("click", () => {
    e.editable && k();
  }), u.addEventListener("click", () => {
    e.editable && R();
  }), _(), n;
  function _() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const A = document.createElement("p");
      A.classList.add(`${d}-ability-roll-config__empty`), A.textContent = "Nenhuma rolagem configurada.", o.append(A);
    } else
      t.rolls.forEach((A, F) => {
        o.append(
          LS({
            roll: A,
            index: F,
            editable: e.editable,
            onChange: () => {
              ea(r, t), I("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(F, 1), _(), I("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    ea(r, t), b(!1);
  }
  async function k() {
    $(!0), I("Salvando configuração...");
    try {
      const A = fa(t);
      if (!A) throw new Error("Configuração inválida.");
      t = or(await e.onSave(A)), _(), I("Configuração salva.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        A
      ), I("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      $(!1);
    }
  }
  async function R() {
    $(!0), I("Limpando configuração...");
    try {
      t = or(await e.onClear()), _(), I("Configuração removida.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        A
      ), I("Não foi possível limpar a configuração."), ui.notifications?.warn(
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
    c.disabled = A || !e.editable, u.disabled = A || !e.editable, s.disabled = A || !e.editable || t.rolls.length >= fr;
  }
  function I(A) {
    g.textContent = A;
  }
}
function FS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const r = document.createElement("strong");
  r.textContent = "Paranormal Toolkit";
  const a = document.createElement("span");
  a.textContent = "Fórmulas de rolagem", n.append(r, a);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), ea(t, e), t;
}
function ea(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = Xm(t) ? "Configurada" : "Rascunho");
}
function or(e) {
  return JSON.parse(JSON.stringify(e));
}
const BS = "[data-paranormal-toolkit-ability-roll-config]", hs = `__${d}_abilityRollConfigBlockRegistered`, US = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function zS() {
  const e = globalThis;
  if (!e[hs]) {
    $S("styles/ability-roll-config.css");
    for (const t of US)
      Hooks.on(t, (...n) => {
        qS(n[0], n[1]);
      });
    e[hs] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function qS(e, t) {
  const n = jS(e);
  if (!n || n.type !== "ability") return;
  const r = HS(t);
  if (!r) return;
  const a = r.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!a) return;
  for (const s of Array.from(
    a.querySelectorAll(BS)
  ))
    s.remove();
  const o = OS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Gm(n),
    editable: VS(n),
    onSave: async (s) => {
      const l = await jm(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Vm(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), Zs())
  });
  GS(a, o);
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
function jS(e) {
  return bs(e.item) ? e.item : bs(e.document) ? e.document : null;
}
function VS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function HS(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function bs(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const vu = "data-paranormal-toolkit-ritual-roll-config", Rt = "data-paranormal-toolkit-ritual-roll-field", Ee = "data-paranormal-toolkit-ritual-roll-action", ys = `__${d}_ritualRollConfigBlockRegistered`, WS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], KS = [
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
function YS() {
  const e = globalThis;
  if (!e[ys]) {
    XS();
    for (const t of WS)
      Hooks.on(t, (...n) => {
        QS(n[0], n[1]);
      });
    e[ys] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function XS() {
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
function QS(e, t) {
  const n = dI(e);
  if (!n || n.type !== "ritual") return;
  const r = pI(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  JS(a);
  const o = xu(n), s = Fc(n), l = mI(n), c = eI(n, s, o, l);
  iI(c, n, o, l), ZS(a, c), io(c);
}
function ZS(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function JS(e) {
  for (const t of Array.from(e.querySelectorAll(`[${vu}]`)))
    t.remove();
}
function eI(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(vu, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(_s("strong", "Paranormal Toolkit")), s.append(_s("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Pu(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(tI(t, r)), u.append(nI(t, r)), u.append(rI(t, r)), a.append(u), a.append(aI(t, n, r)), a.append(oI(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function tI(e, t) {
  const n = Ln("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Rt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = KR(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function nI(e, t) {
  const n = Ln("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Rt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of KS) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function rI(e, t) {
  const n = Ln("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Rt, "utilityLabel"), n.append(r), n;
}
function aI(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(ir("base", "Padrão", e.forms.base.formula, !0, n)), o.append(ir("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(ir("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function ir(e, t, n, r, a) {
  const o = Ln(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(Rt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function oI(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(Ee, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(Ee, "clear"), t.append(n, r), t;
}
function Ln(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function _s(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function iI(e, t, n, r) {
  Ze(e, "intent")?.addEventListener("change", () => io(e)), Rs(e, "system.studentForm")?.addEventListener("change", () => As(e, t)), Rs(e, "system.trueForm")?.addEventListener("change", () => As(e, t)), e.querySelector(`[${Ee}="save"]`)?.addEventListener("click", () => {
    r && sI(e, t, n);
  }), e.querySelector(`[${Ee}="clear"]`)?.addEventListener("click", () => {
    r && lI(e, t);
  });
}
async function sI(e, t, n) {
  const r = e.querySelector(`[${Ee}="save"]`);
  r?.setAttribute("disabled", "true"), Fe(e, "Salvando configuração...");
  try {
    const a = cI(e, n);
    await HR(t, a), Du(e, a), Fe(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Fe(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function lI(e, t) {
  const n = e.querySelector(`[${Ee}="clear"]`);
  n?.setAttribute("disabled", "true"), Fe(e, "Limpando configuração...");
  try {
    await WR(t);
    const r = Fc(t);
    uI(e, r), Du(e, r), Fe(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Fe(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Du(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Pu(t) ? "Configurada" : "Rascunho");
}
function cI(e, t) {
  return {
    schemaVersion: 1,
    intent: Nu(Ze(e, "intent")?.value),
    damageType: ks(e, "damageType"),
    utilityLabel: ks(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: jt(e, "formula.base") },
      discente: { formula: jt(e, "formula.discente") },
      verdadeiro: { formula: jt(e, "formula.verdadeiro") }
    }
  };
}
function uI(e, t) {
  ve(e, "intent", t.intent), ve(e, "damageType", t.damageType ?? ""), ve(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ve(e, "formula.base", t.forms.base.formula), ve(e, "formula.discente", t.forms.discente.formula), ve(e, "formula.verdadeiro", t.forms.verdadeiro.formula), io(e);
}
function io(e) {
  const t = Nu(Ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function As(e, t) {
  const n = xu(t);
  Ts(e, "discente", n.discente), Ts(e, "verdadeiro", n.verdadeiro);
}
function Ts(e, t, n) {
  const r = Ze(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${Ee}="save"]`)?.disabled;
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
function Fe(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function xu(e) {
  const t = fI(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function dI(e) {
  return $s(e.item) ? e.item : $s(e.document) ? e.document : null;
}
function mI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function fI(e) {
  const t = e.system;
  return gI(t) ? t : {};
}
function Rs(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ze(e, t) {
  return e.querySelector(`[${Rt}="${hI(t)}"]`);
}
function jt(e, t) {
  return Ze(e, t)?.value.trim() ?? "";
}
function ks(e, t) {
  const n = jt(e, t);
  return n.length > 0 ? n : null;
}
function ve(e, t, n) {
  const r = Ze(e, t);
  r && (r.value = n);
}
function Nu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Pu(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function pI(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function $s(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function gI(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function hI(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Z = null;
Hooks.once("init", () => {
  Td(), Jd(), sp(), uT(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ao.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Ao.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Z = pS(), Z.itemUseIntegration.registerStrategies(), Qf(Z.resources, Z.resourceAdapter), rp(Z.conditions), Sm(Z), hT(), AS(Z), YS(), zS(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function bI() {
  if (!Z)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Z;
}
export {
  bI as getToolkitServices
};
//# sourceMappingURL=main.js.map
