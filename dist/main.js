const d = "paranormal-toolkit", Ts = "Paranormal Toolkit", Pu = "ordemparanormal";
class gt {
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
function ht(e) {
  const t = ea(e);
  return t.ok ? y(t.value.definition) : t;
}
function ea(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ta(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Mu(e) {
  return ta(e.getFlag(d, "automation"));
}
function ta(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Fu(t.source) && Ou(t.definition);
}
function Ou(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Bu) && (t.ritualForms === void 0 || Vu(t.ritualForms)) && (t.conditionApplications === void 0 || Xu(t.conditionApplications));
}
function Fu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Bu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Uu(t);
    case "spendRitualCost":
      return zu(t);
    case "rollFormula":
      return qu(t);
    case "modifyResource":
      return Gu(t);
    case "chatCard":
      return ju(t);
    default:
      return !1;
  }
}
function Uu(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Rs(t);
}
function zu(e) {
  return e.type === "spendRitualCost";
}
function qu(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || rd(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Gu(e) {
  const t = e;
  return t.type === "modifyResource" && ks(t.actor) && td(t.resource) && nd(t.operation) && Rs(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function ju(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Vu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Hu(a)
  );
}
function Hu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || od(t.extraCost)) && (t.rollFormulaOverrides === void 0 || sd(t.rollFormulaOverrides)) && (t.notes === void 0 || id(t.notes)) && (t.targeting === void 0 || Wu(t.targeting));
}
function Wu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Yu(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Ku(t.template));
}
function Ku(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || ao(t.distance)) && (t.width === void 0 || t.width === null || ao(t.width));
}
function Yu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Xu(e) {
  return Array.isArray(e) && e.every(Qu);
}
function Qu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && ks(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || Ju(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Zu(t.applyOnResistance));
}
function Zu(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Ju(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || ad(t.rounds)) && (t.expiry === void 0 || t.expiry === null || ed(t.expiry));
}
function ed(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Rs(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function ks(e) {
  return e === "self" || e === "target";
}
function td(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function nd(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function rd(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function ad(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function od(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function ao(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function id(e) {
  return Array.isArray(e) && e.every(w);
}
function sd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function na(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(oo);
    if (ud(t))
      return Array.from(t).filter(oo);
  }
  return [];
}
function ld(e) {
  return na(e)[0] ?? null;
}
function cd(e) {
  return na(e).find(Mu) ?? null;
}
function ud(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function oo(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function bt(e) {
  return na(e).filter((t) => t.type === "ritual");
}
function Es(e) {
  return bt(e)[0] ?? null;
}
function dd(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(on);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = nt("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Et(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(lo);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = nt("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Et(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await ir(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = nt("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Et(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await ir(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: lo(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return io(e);
    },
    async applyBestPresetsToActorRituals() {
      return io(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = nt("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Et(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function io(e) {
  const t = nt("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = bt(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), so(t);
  const r = so(t, n.length);
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
    const s = await ir(e, a, o.preset);
    r.applied.push(md(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), fd(r), r;
}
async function ir(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function md(e, t, n) {
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
function so(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function fd(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function lo(e) {
  return {
    preset: on(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function nt(e) {
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Et(e) {
  const t = Es(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function De(e) {
  return e ? {
    id: e.id,
    source: {
      ...pd(e.sourceActor),
      token: e.sourceToken
    },
    item: gd(e.item),
    targets: e.targets.map(hd),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: co(e.rollRequests, $s),
    rolls: co(e.rolls, bd),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(ra),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function ra(e) {
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
function pd(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function gd(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function hd(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function $s(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function bd(e) {
  return {
    ...$s(e),
    total: e.total
  };
}
function co(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function yd(e) {
  return {
    getSelected() {
      return gt.getSelectedActor();
    },
    logResources() {
      const t = fe(
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
        fe("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Ie(
        e,
        "Gasto de PD",
        fe("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Ie(
        e,
        "Dano em PV",
        fe("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Ie(
        e,
        "Cura de PV",
        fe("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Ie(
        e,
        "Dano em SAN",
        fe("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Ie(
        e,
        "Recuperação de SAN",
        fe("Nenhum ator encontrado para recuperar SAN."),
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
  f.info(`${t} realizado:`, ra(o));
}
function fe(e) {
  const t = gt.getSelectedActor();
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
const J = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function _d() {
  $t(J.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), $t(J.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), $t(J.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), $t(J.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function sr() {
  return {
    enabled: wt(J.enabled),
    console: wt(J.console),
    ui: wt(J.ui),
    chat: wt(J.chat)
  };
}
async function ae(e, t) {
  await game.settings.set(d, J[e], t);
}
function $t(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function wt(e) {
  return game.settings.get(d, e) === !0;
}
function Td() {
  return {
    status() {
      return sr();
    },
    async enable() {
      await ae("enabled", !0);
    },
    async disable() {
      await ae("enabled", !1);
    },
    async enableConsole() {
      await ae("console", !0);
    },
    async disableConsole() {
      await ae("console", !1);
    },
    async enableUi() {
      await ae("ui", !0);
    },
    async disableUi() {
      await ae("ui", !1);
    },
    async enableChat() {
      await ae("chat", !0);
    },
    async disableChat() {
      await ae("chat", !1);
    }
  };
}
const ws = "ritual.costOnly", Cs = "ritual.simpleHealing", Rd = "ritual.eletrocussao", kd = "ritual.definhar", Ss = "ritual.simpleDamage", Is = "generic.simpleHealing", Ls = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, aa = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ed() {
  return [
    $d(),
    wd(),
    Cd(),
    Sd(),
    Id(),
    Ld()
  ];
}
function $d() {
  return {
    id: ws,
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
function wd() {
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
    itemPatch: Nd()
  };
}
function Cd() {
  return {
    id: Rd,
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
    automation: Dd(),
    itemPatch: Md()
  };
}
function Sd() {
  return {
    id: kd,
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
    automation: xd(),
    itemPatch: Pd()
  };
}
function Id() {
  return {
    id: Ss,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: oa()
  };
}
function Ld() {
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
  const t = vd(e);
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
function vd(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Ls,
    ...e
  };
}
function Dd() {
  return {
    ...oa("3d6", {
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
function xd() {
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
function oa(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
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
function Nd() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: aa,
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
function Pd() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: aa,
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
function Md() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: aa,
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
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function ia() {
  return Array.from(game.user?.targets ?? []).map(xs);
}
function xs(e) {
  return {
    tokenId: xe(e.id),
    actorId: xe(e.actor?.id),
    sceneId: xe(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Ns() {
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
function Od(e) {
  return {
    logFirstRitualCost() {
      const t = pe("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ge(t);
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
      const r = pe("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = ge(r);
      if (a) {
        if (!Ud(t, n)) {
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
      const t = pe("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ge(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = pe("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ge(t);
      if (!n) return;
      const r = e.automationRegistry.require(ws);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = pe("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ge(n);
      if (!r) return;
      if (!uo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Cs);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: vs(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = pe("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ge(n);
      if (!r) return;
      if (!uo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Ss);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: oa(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = pe("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ge(t);
      n && await Fd(e, t, n);
    }
  };
}
async function Fd(e, t, n) {
  const r = ht(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ns(),
    item: n,
    targets: ia()
  });
  if (!a.ok) {
    Bd(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", De(a.value.context));
}
function Bd(e) {
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
function pe(e) {
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ge(e) {
  const t = Es(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ud(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function uo(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const zd = ["strict", "open"], Ps = "strict";
function qd(e) {
  return zd.includes(e) ? e : Ps;
}
function Gd(e) {
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
const jd = ["disabled", "ask", "automatic"], Vd = ["buttons", "confirm"], Ms = "ask";
function Hd(e) {
  return typeof e == "string" && jd.includes(e);
}
function Wd(e) {
  return typeof e == "string" && Vd.includes(e);
}
function Kd(e) {
  return Hd(e) ? e : Wd(e) ? "ask" : Ms;
}
const Yd = ["keep", "replace"], Xd = ["manual", "assisted"], Os = "keep", Fs = "assisted", Qd = !0, P = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Zd() {
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
    default: Ms
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
    default: Os
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
    default: Fs
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
    default: Ps
  }), game.settings.register(d, P.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Qd
  }), game.settings.register(d, P.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function lr() {
  const e = Kd(game.settings.get(d, P.executionMode)), t = zs(game.settings.get(d, P.systemCardMode)), n = qs(game.settings.get(d, P.damageResolutionMode)), r = sa();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Us()
  };
}
function Bs() {
  return zs(game.settings.get(d, P.systemCardMode));
}
function Jd() {
  return qs(game.settings.get(d, P.damageResolutionMode));
}
function sa() {
  return qd(game.settings.get(d, P.resistanceGateMode));
}
function Us() {
  return game.settings.get(d, P.ritualCastingCheckEnabled) === !0;
}
async function he(e) {
  await game.settings.set(d, P.executionMode, e);
}
function zs(e) {
  return Yd.includes(e) ? e : Os;
}
function qs(e) {
  return Xd.includes(e) ? e : Fs;
}
function em(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await he("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await he(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await he("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const tm = [
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
function nm(e) {
  return {
    phases() {
      return tm;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = In("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = cd(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await mo(e, t, n);
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
      if (!om(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = am(n) ?? In("Nenhum ator encontrado para executar automação do item.");
      r && await mo(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = In("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = ld(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Is);
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
async function mo(e, t, n) {
  const r = ht(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ns(),
    item: n,
    targets: ia()
  });
  if (!a.ok) {
    rm(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", De(a.value.context));
}
function rm(e) {
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
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function am(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function om(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function im(e) {
  const t = yd(e), n = dd(e), r = Od(e), a = nm(e), o = Td(), s = em(e);
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
const Mt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function sm(e) {
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
      const r = fo();
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
      return lm(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = fo();
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
      return cm(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function fo() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function lm(e) {
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
function cm(e) {
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
function Te(e) {
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
function um(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${Te(e.label)}</span>`;
}
const dm = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function mm(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${Te(t)}" alt="${Te(e?.alt ?? "")}">` : dm;
}
function fm(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${Te(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(um).join("")}</div>` : "", r = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${Te(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${mm(e.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${Te(e.title)}</span>${t}
      </div>${n}
    </div>${r}
  </div>
</header>`;
}
function la(e) {
  return `<article class="paranormal-toolkit-chat-card-shell">${e.content}</article>`;
}
const po = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  resistance: "paranormal-toolkit-section-card--resistance"
};
function pm(e) {
  return po[e] ?? po.casting;
}
function Gs(e) {
  return `<section class="paranormal-toolkit-section-card ${pm(e.tone)}">${e.content}</section>`;
}
function js(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${Te(e.title)}</span>${t}</div>`;
}
const go = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure"
}, gm = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA"
};
function Vs(e) {
  const t = go[e.state] ? e.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${go[t]}">${gm[t]}</span>`;
}
const Hs = "devChatCardExample", hm = "devChatCardHeaderExample";
function Ct() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function bm() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", r = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", a = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof a == "string" ? { src: a, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${r}`
  };
}
function ym(e) {
  return e === "runtime" ? bm() : e === "ability" ? {
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
function Am(e) {
  switch (e) {
    case "casting-title":
      return { tone: "casting", title: "Conjuração" };
    case "casting-badge":
      return {
        tone: "casting",
        title: "Conjuração",
        trailing: Vs({ state: "success" })
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
function _m(e) {
  const t = Am(e);
  return la({
    content: Gs({
      tone: t.tone,
      content: js({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function Tm(e) {
  return la({
    content: Gs({
      tone: "casting",
      content: js({
        title: "Conjuração",
        trailing: Vs({ state: e })
      })
    })
  });
}
function Ln(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [d]: { [Hs]: t } }
  });
}
function Rm() {
  const e = async () => {
    Ct();
    const n = (game.messages.contents ?? []).filter(
      (r) => typeof r.getFlag?.(d, Hs) == "string" || r.getFlag?.(d, hm) === !0
    );
    await Promise.all(
      n.map(
        (r) => r.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return Ct(), Ln(
        la({
          content: fm(ym(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      Ct();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (r) => Ln(_m(r), "section")
        )
      );
    },
    async postStatusBadgeExample(t) {
      Ct();
      const n = t === "both" ? ["success", "failure"] : [t];
      return Promise.all(
        n.map(
          (r) => Ln(Tm(r), "status")
        )
      );
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function km(e) {
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
    conditions: sm(e.conditions),
    debug: im(e),
    dev: Rm(),
    hooks: Mt
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const r = game.modules.get(d);
  return r && (r.api = t), t;
}
class ho {
  static isSupportedSystem() {
    return game.system.id === Pu;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const vn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Em(e) {
  if (!Lm(e.item)) return null;
  const t = cr(e.actor) ? e.actor : $m(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Cm(e.token) ?? wm(t),
    targets: ia(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function $m(e) {
  const t = e;
  return cr(t.actor) ? t.actor : cr(e.parent) ? e.parent : null;
}
function wm(e) {
  const t = Sm(e) ?? Im(e);
  return t ? Ws(t) : null;
}
function Cm(e) {
  return ur(e) ? Ws(e) : null;
}
function Sm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return ur(n) ? n : (t.getActiveTokens?.() ?? []).find(ur) ?? null;
}
function Im(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ws(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Dn(e.id),
    actorId: Dn(t?.id),
    sceneId: Dn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Lm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function cr(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ur(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Dn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Ks {
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
    const n = Em(vm(t));
    if (!n) {
      f.warn(`${vn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function vm(e) {
  return e && typeof e == "object" ? e : {};
}
function jt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function ca() {
  const e = globalThis.game;
  return ln(e) ? e : null;
}
function W(e, t) {
  const n = Dm(e, t);
  return Ot(n);
}
function Dm(e, t) {
  return t.split(".").reduce((n, r) => ln(n) ? n[r] : null, e);
}
function xm(e, t) {
  const n = e.indexOf(":");
  return n < 0 || ut(e.slice(0, n)) !== ut(t) ? null : He(e.slice(n + 1));
}
function Ot(e) {
  return typeof e == "string" ? He(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function ln(e) {
  return !!e && typeof e == "object";
}
function Nm(e) {
  return typeof e == "string";
}
function cn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function He(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function ut(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function dr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ce(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Ys(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const Vt = "abilityRollConfig", Xs = [
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
], mr = 20, fr = 20, Pm = [10, 40, 65, 99];
function Qs() {
  return {
    schemaVersion: 1,
    rolls: [Zs(1)]
  };
}
function Zs(e) {
  return {
    id: Om(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function Mm() {
  return Pm.map((e) => ({ minNex: e, formula: "" }));
}
function Om() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Js(e) {
  return ua(
    e.getFlag(d, Vt)
  );
}
function Fm(e) {
  return Js(e) ?? Qs();
}
async function Bm(e, t) {
  const n = ua(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, Vt, n), n;
}
async function Um(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, Vt)
    );
    return;
  }
  await e.setFlag(d, Vt, null);
}
function ua(e) {
  if (!Be(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, mr).map((r, a) => Hm(r, a, t)).filter((r) => r !== null)
  };
}
function zm(e, t) {
  const n = Js(t);
  return n ? qm(n, Gm(e)) : [];
}
function qm(e, t) {
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
function Gm(e) {
  const t = Be(e.system) ? e.system : {}, n = t.NEX ?? t.nex, r = Be(n) ? n.value : n, a = typeof r == "number" ? r : Number(r);
  return Number.isFinite(a) ? tl(a) : 0;
}
function el(e) {
  return Xs.find((t) => t.value === e)?.label ?? e;
}
function jm(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function Vm(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function Hm(e, t, n) {
  if (!Be(e)) return null;
  const r = `roll-${t + 1}`, a = Zm(Qm(e.id, r), n), o = Ym(e.intent), s = Wm(e.formula);
  return !o || !s ? null : {
    id: a,
    label: un(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? Jm(e.damageType) : null,
    formula: s
  };
}
function Wm(e) {
  if (!Be(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: un(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, fr).map(Km).filter((r) => r !== null) : [];
  t.sort((r, a) => r.minNex - a.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const r of t) n.set(r.minNex, r);
  return {
    mode: "nex",
    resolution: Xm(e.resolution),
    steps: [...n.values()]
  };
}
function Km(e) {
  if (!Be(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: tl(t),
    formula: un(e.formula)
  } : null;
}
function Ym(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function Xm(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function Qm(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function Zm(e, t) {
  let n = e, r = 2;
  for (; t.has(n); )
    n = `${e}-${r}`, r += 1;
  return t.add(n), n;
}
function tl(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function un(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Jm(e) {
  const t = un(e);
  return t.length > 0 ? t : null;
}
function Be(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const da = "data-paranormal-toolkit-ability-roll-id";
function ef(e) {
  if (!nl(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = se(e.actorUuid), n = se(e.itemUuid), r = se(e.abilityName);
  if (!t) return null;
  const a = e.rolls.map(tf).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: r || "Habilidade",
    rolls: a,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: xn(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: xn(e.resourceBefore),
    resourceAfter: xn(e.resourceAfter)
  };
}
function tf(e) {
  if (!nl(e)) return null;
  const t = se(e.id), n = se(e.sourceRollId), r = se(e.label), a = se(e.formula), o = nf(e.intent);
  if (!t || !n || !r || !a || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: r,
    formula: a,
    intent: o,
    damageType: o === "damage" ? rf(e.damageType) : null,
    nexThreshold: s
  };
}
function nf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function se(e) {
  return typeof e == "string" ? e.trim() : "";
}
function rf(e) {
  const t = se(e);
  return t.length > 0 ? t : null;
}
function xn(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function nl(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const bo = "paranormalToolkitAbilityRollBound";
let yo = !1;
function af() {
  if (yo) return;
  yo = !0;
  const e = (t, n) => {
    of(t, jt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function of(e, t) {
  if (!t) return 0;
  const n = `[${da}]`, r = gf(t, n);
  let a = 0;
  for (const o of r)
    o.dataset[bo] !== "true" && (o.dataset[bo] = "true", o.addEventListener("click", () => {
      sf(e, o);
    }), a += 1);
  return a;
}
async function sf(e, t) {
  const n = t.getAttribute(da)?.trim();
  if (!n) return;
  const r = lf(e), a = r?.rolls.find((l) => l.id === n);
  if (!r || !a) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await cf(r.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!mf(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = uf();
  if (!s) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  Ao(t, !0);
  try {
    const l = new s(
      a.formula,
      df(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: ff(r.abilityName, a)
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
    Ao(t, !1);
  }
}
function lf(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : ef(
    t.getFlag(d, "abilityUse")
  );
}
async function cf(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if (_o(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, a = game.actors?.get?.(n);
  return _o(a) ? a : null;
}
function uf() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function df(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function mf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function ff(e, t) {
  const n = [pf(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${Nn(e)}</strong>
      <span>${Nn(t.label)}</span>
      <small>${Nn(n.join(" · "))}</small>
    </div>
  `;
}
function pf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${el(e.damageType)}` : "Dano";
  }
}
function gf(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function Ao(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function _o(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function Nn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const hf = "paranormal-toolkit-chat-message--full-width-card", To = ".paranormal-toolkit-ability-card", Ro = "li.chat-message";
let ko = !1;
function bf() {
  if (ko) return;
  ko = !0;
  const e = Hooks, t = (n, r) => {
    Eo(jt(r));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Eo(document);
}
function Eo(e) {
  if (!e) return 0;
  const t = ma(e), n = yf(t), r = /* @__PURE__ */ new Set();
  for (const a of n) {
    const o = Af(t, a);
    o?.classList && r.add(o);
  }
  for (const a of r)
    a.classList?.add(hf);
  return r.size;
}
function yf(e) {
  const t = [];
  e.matches?.(To) && t.push(e);
  const n = e.querySelectorAll?.(To);
  if (!n) return t;
  for (const r of Array.from(n)) {
    const a = ma(r);
    t.includes(a) || t.push(a);
  }
  return t;
}
function Af(e, t) {
  if (e.matches?.(Ro)) return e;
  const n = t.closest?.(Ro);
  return n ? ma(n) : null;
}
function ma(e) {
  return e && typeof e == "object" ? e : {};
}
function _f(e) {
  const t = Tf(e.cost), n = Rf(e.currentResource), r = t > 0 && !e.passive, a = n >= t;
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
function Tf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Rf(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: kf } = foundry.applications.api;
class st extends kf {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = _f(t), this.spendResource = this.model.cost.spendResourceChecked;
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
      useAbility: st.onUseAbility,
      cancel: st.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new st(t, n).render({ force: !0 });
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
          src="${Ef(this.model.header.image)}"
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
function Ef(e) {
  return U(e);
}
function $f(e, t) {
  const n = vf(t.system), r = Ht(n.activation), a = If(r), o = Cf();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Df(t),
    activation: r,
    activationLabel: Sf(r),
    description: Ht(n.description),
    chatDescription: wf(
      n.chatDescription,
      n.description
    ),
    cost: a ? 0 : Lf(n.cost),
    resource: o,
    passive: a,
    rolls: zm(e, t)
  };
}
function wf(e, t) {
  const n = Ht(e);
  return n.trim().length > 0 ? n : Ht(t);
}
function Cf() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Sf(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, r = xf()?.(t) ?? t;
  return r === t ? e : r;
}
function If(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Lf(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function vf(e) {
  return e && typeof e == "object" ? e : {};
}
function Ht(e) {
  return typeof e == "string" ? e : "";
}
function Df(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function xf() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Nf {
  async publish(t, n, r) {
    const a = await Uf(n), o = Pf({
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
    }, c = Bf(t.message);
    if (Bs() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function Pf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, r = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", a = Mf(e.rolls), o = Ff(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${pr(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${ie(e.abilityName)}</h3>
          <p>${ie(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${ie(e.activationLabel)}</span>
        <span><strong>Custo</strong>${ie(t)}</span>
      </div>

      ${a}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${r}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${ie(n)}</span>
      </footer>
    </article>
  `;
}
function Mf(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const r = `paranormal-toolkit-ability-card__roll--${n.intent}`, a = Of(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${r}"
          ${da}="${pr(n.id)}"
          title="${pr(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${ie(n.label)}</strong>
            <small>${ie(a)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function Of(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${el(e.damageType)}` : "Dano";
  }
}
function Ff(e) {
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
function Bf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function ie(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function pr(e) {
  return ie(e);
}
async function Uf(e) {
  const t = e.chatDescription || e.description, n = zf();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: qf(e.actor)
  });
}
function zf() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function qf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Gf {
  constructor(t, n, r = new Nf()) {
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
    if (!jf(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const r = $f(n, t.item), a = this.readCurrentResource(r);
    if (!a.ok)
      return this.fail(
        "resource-unavailable",
        a.message
      );
    const o = await st.request({
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
function jf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const $o = 1e3;
class Vf {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Gf(t, n), this.strategy = new Ks(
      (r) => this.handleItemUsed(r)
    );
  }
  register() {
    this.strategy.register(), bf(), af(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (lr().executionMode === "disabled" || !Wf(t.item)) return;
    const n = Kf(t);
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
    return n !== void 0 && Date.now() - n < $o;
  }
  pruneRecentExecutions() {
    const t = Date.now() - $o;
    for (const [n, r] of this.recentExecutions)
      r < t && this.recentExecutions.delete(n);
  }
}
function Hf(e, t) {
  const n = new Vf(e, t);
  return n.register(), n;
}
function Wf(e) {
  if (e.type !== "ability") return !1;
  const t = ea(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function Kf(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let wo = !1, Pn = !1, Mn = !1, St = null;
const Yf = 1e3, Xf = 750, Qf = 1e3;
function Zf(e) {
  wo || (Hooks.on("combatTurnChange", (t) => {
    ep(e, Co(t));
  }), Hooks.on("deleteCombat", (t) => {
    tp(e, Co(t));
  }), wo = !0, Jf(e));
}
function Jf(e) {
  dn() && (Pn || (Pn = !0, globalThis.setTimeout(() => {
    Pn = !1, fa(e, "ready");
  }, Yf)));
}
function ep(e, t) {
  dn() && t && (St && globalThis.clearTimeout(St), St = globalThis.setTimeout(() => {
    St = null, fa(e, "combat-turn-change", t);
  }, Xf));
}
function tp(e, t) {
  dn() && t && (Mn || (Mn = !0, globalThis.setTimeout(() => {
    Mn = !1, fa(e, "combat-deleted", t);
  }, Qf)));
}
async function fa(e, t, n) {
  if (dn())
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
function dn() {
  return game.user?.isGM === !0;
}
function Co(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const rl = {
  enabled: "dice.animations.enabled"
};
function np() {
  game.settings.register(d, rl.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function rp() {
  return {
    enabled: game.settings.get(d, rl.enabled) === !0
  };
}
const mn = "chatCard", So = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, ap = `.${i}__title`, al = `.${i}__header`, op = `.${i}__roll-card`, ip = `.${i}__roll-meta`, sp = `.${i}__roll-meta-pill`, pa = `.${i}__resistance`, lp = `.${i}__resistance-header`, ol = `.${i}__resistance-description`, fn = `.${i}__resistance-roll-button`, il = `.${i}__resistance-roll-result`, Io = `${i}__resistance-content`, sl = `.${i}__workflow-section`, ll = `.${i}__workflow-roll`, ga = `${i}__workflow-roll--dice-open`, ha = `.${i}__workflow-roll-formula`, ba = `${i}__workflow-roll-formula--toggle`, pn = `.${i}__workflow-dice-tray`, cp = `.${i}__roll-detail-toggle`, up = `.${i}__roll-detail-list`, dp = `.${i}__ritual-element-badge`, mp = `.${i}__ritual-metadata`, fp = "casting-backlash", pp = "data-paranormal-toolkit-action-section", gp = "data-paranormal-toolkit-prompt-id", hp = "data-paranormal-toolkit-pending-id", Lo = "data-paranormal-toolkit-casting-backlash-enhanced", vo = `.${i}`, bp = `.${i}__workflow-section--casting`, yp = `.${i}__workflow-section-header`, Ap = `.${i}__workflow-notes`, _p = `[${pp}="${fp}"]`, Do = `${i}__workflow-section-title-row`, Tp = `${i}__workflow-section-header--casting-backlash`, cl = `${i}__casting-backlash-button`;
function Rp(e) {
  for (const t of kp(e))
    Ep(t), Ip(t);
}
function kp(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(vo) && t.add(e);
  for (const n of e.querySelectorAll(vo))
    t.add(n);
  return Array.from(t);
}
function Ep(e) {
  const t = e.querySelector(_p);
  if (!t) return;
  const n = $p(t);
  if (!n) return;
  const r = e.querySelector(`${bp} ${yp}`);
  r && (r.classList.add(Tp), wp(r), Cp(n), r.append(n), t.remove());
}
function $p(e) {
  return e.querySelector(
    `button[${hp}], button[${gp}]`
  );
}
function wp(e) {
  const t = e.querySelector(`:scope > .${Do}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Do);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(cl) || n.append(a));
  return n;
}
function Cp(e) {
  if (e.getAttribute(Lo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Sp(t, e.disabled);
  e.classList.add(cl), e.setAttribute(Lo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Sp(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Ip(e) {
  for (const t of e.querySelectorAll(Ap)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Lp(e) {
  for (const t of Array.from(e.querySelectorAll(sl)))
    for (const n of Array.from(t.querySelectorAll(`${cp}, ${up}`)))
      n.remove();
}
const vp = {
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
}, Dp = new Set(
  Object.values(vp)
), xp = {
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
function Np(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Pp(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = xp[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Dp.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ul(e) {
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
function Pp(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class dl {
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
      const g = Mp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const A = Np(m.damageType);
      if (!A.ok)
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
          Op(g.id, m, A.value)
        );
        continue;
      }
      try {
        const k = await Promise.resolve(
          o.call(n, g.amount, {
            damageType: A.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const E of Bp(k.conditions))
          l.add(E);
        const R = Fp(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? ul(A.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: xo(k.finalDamage, g.amount),
          blocked: xo(k.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: A.value,
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
function Mp(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Op(e, t, n) {
  return {
    id: e,
    label: t.label ?? ul(n),
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
function Fp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Bp(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class ya {
  async rollResistance(t) {
    const n = await zp(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? ke(t.skill),
      roll: n,
      formula: Gp(n),
      total: jp(n),
      diceBreakdown: Vp(n)
    };
  }
  getSkillLabel(t) {
    return ke(t);
  }
}
async function Up(e, t) {
  return new ya().rollResistance({ actor: e, skill: t });
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
async function zp(e, t) {
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
  return qp(r);
}
function qp(e) {
  return No(e) ? e : Array.isArray(e) ? e.find(No) ?? null : null;
}
function No(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Gp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function jp(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Vp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Hp);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Hp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class ml {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class fl {
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
function Wp(e, t) {
  const n = eg(e?.rounds);
  if (!n)
    return Po(null);
  const r = e?.anchor ?? pl(t);
  if (!r)
    return {
      ...Po(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Kp(),
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
function pl(e) {
  const t = tg();
  if (!t?.id || !gl(t.round)) return null;
  const n = Zp(t), r = Yp(e, n) ?? Qp(t), a = oe(r?.id), o = rg(r?.initiative), s = Xp(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: ng()
  };
}
function Kp() {
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
function Yp(e, t) {
  return e?.id ? t.find((n) => Jp(n) === e.id) ?? null : null;
}
function Xp(e, t, n) {
  const r = oe(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return ag(e.turn) ? e.turn : null;
}
function Qp(e) {
  return Ft(e.combatant) ? e.combatant : null;
}
function Zp(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Ft);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Ft);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Ft);
  }
  return [];
}
function Jp(e) {
  return oe(e.actor?.id) ?? oe(e.actorId) ?? oe(e.token?.actor?.id) ?? oe(e.token?.actorId) ?? oe(e.document?.actor?.id) ?? oe(e.document?.actorId);
}
function eg(e) {
  return gl(e) ? Math.trunc(e) : null;
}
function tg() {
  return game.combat ?? null;
}
function ng() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ft(e) {
  return !!(e && typeof e == "object");
}
function oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function rg(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function gl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function ag(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class hl {
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
    if (!pg(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = Wp(t.duration, r), s = og(a, t, o), c = t.refreshExisting ?? !0 ? gg(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(Mo(r, a, c.id ?? null, !1, !0, o));
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
      return y(Mo(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = yl(n, r);
    let o = 0;
    try {
      for (const s of a)
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
      conditionId: r,
      removed: o
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = yg(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = Aa(s);
      a += l.length;
      for (const c of l) {
        if (!lg(c, t)) continue;
        const u = bl(c);
        try {
          await Oo(s, c) === "deleted" && (o += 1);
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
function og(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Sg(),
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
    duration: ig(n.duration),
    start: sg(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function ig(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function sg(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Cg(),
    ...e
  };
}
function Mo(e, t, n, r, a, o) {
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
function lg(e, t) {
  const n = bl(e);
  if (!n.conditionId || !cg(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = wg();
  return n.durationMode === "combatantTurn" || ug(n) ? mg(n, r) : dg(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !K(n.startRound) || !K(n.requestedRounds) || !K(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function cg(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && K(e.requestedRounds);
}
function ug(e) {
  return !!(e.combatDurationApplied && K(e.requestedRounds) && K(e.startRound) && (e.startCombatantId || Wt(e.startTurn)));
}
function dg(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function mg(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !K(e.startRound) || !K(e.requestedRounds) || !K(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = fg(t);
  return e.startCombatantId ? r === e.startCombatantId : Wt(e.startTurn) && Wt(t.turn) ? t.turn === e.startTurn : !1;
}
function fg(e) {
  return Ne(e.combatant?.id);
}
function bl(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Bt(e, "conditionId"),
    requestedRounds: Fo(e, "requestedRounds") ?? rt(t.value) ?? rt(t.rounds),
    combatDurationApplied: On(e, "combatDurationApplied"),
    combatId: Bt(e, "combatId") ?? Ne(n.combat) ?? Ne(t.combat),
    startCombatantId: Bt(e, "startCombatantId") ?? Ne(n.combatant),
    startInitiative: Rg(e, "startInitiative") ?? Al(n.initiative),
    startRound: Fo(e, "startRound") ?? rt(n.round) ?? rt(t.startRound),
    startTurn: Tg(e, "startTurn") ?? gr(n.turn) ?? gr(t.startTurn),
    expiryEvent: kg(e, "expiryEvent") ?? _l(t.expiry),
    durationMode: Eg(e, "durationMode"),
    deleteOnExpire: On(e, "deleteOnExpire"),
    expiresWithCombat: On(e, "expiresWithCombat")
  };
}
function pg(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function gg(e, t) {
  return yl(e, t)[0] ?? null;
}
function yl(e, t) {
  return Aa(e).filter((n) => _g(n) === t);
}
async function Oo(e, t) {
  const n = t.id ?? null, r = n ? hg(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (bg(a)) return "missing";
    throw a;
  }
}
function hg(e, t) {
  return Aa(e).find((n) => n.id === t) ?? null;
}
function bg(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function yg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      It(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    It(e, n);
  });
  for (const n of Ag())
    It(e, n.actor), It(e, n.document?.actor);
  return Array.from(e.values());
}
function It(e, t) {
  if (!$g(t)) return;
  const r = Ne(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Ag() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Aa(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function _g(e) {
  return Bt(e, "conditionId");
}
function Bt(e, t) {
  return Ne(we(e, t));
}
function Fo(e, t) {
  return rt(we(e, t));
}
function Tg(e, t) {
  return gr(we(e, t));
}
function Rg(e, t) {
  return Al(we(e, t));
}
function kg(e, t) {
  return _l(we(e, t));
}
function Eg(e, t) {
  const n = we(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function On(e, t) {
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
function rt(e) {
  return K(e) ? Math.trunc(e) : null;
}
function gr(e) {
  return Wt(e) ? Math.trunc(e) : null;
}
function Al(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function _l(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function $g(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function wg() {
  return game.combat ?? null;
}
function Cg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function K(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Wt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Sg() {
  return game.user?.id ?? null;
}
const Ig = "icons/svg/downgrade.svg", Lg = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Ig,
    description: Lg,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const vg = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Dg = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), xg = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Ng = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Pg = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Mg = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Og = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Fg = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Bg = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Ug = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), zg = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), qg = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Gg = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), jg = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Vg = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Hg = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Wg = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Kg = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Yg = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Xg = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Qg = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Zg = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Jg = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), eh = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), th = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), nh = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), rh = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ah = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), oh = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), ih = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), sh = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), lh = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), ch = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), uh = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), dh = [
  vg,
  Dg,
  xg,
  Ng,
  Pg,
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
  uh
];
class mh {
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
    return Array.from(this.definitions.values()).map(Bo);
  }
  get(t) {
    const n = this.lookup.get(Uo(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Bo(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Uo(t);
    r && this.lookup.set(r, n);
  }
}
function Tl() {
  return new mh(dh);
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
function Ue(e) {
  return e.applyOnResistance ?? "failure";
}
function Rl(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function kl(e, t) {
  const n = Ue(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function El(e) {
  const t = Ue(e);
  return t === "failure" || t === "success";
}
function fh(e, t, n, r) {
  const a = e.filter((c) => kl(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Ue(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const ph = {
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
}, gh = {
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
function hh(e) {
  return wl(e, ph, !1);
}
function bh(e) {
  return wl(e, gh, !e.allowsSuccessfulResistance);
}
function We(e) {
  return e.kind === "waiting-resistance";
}
function $l(e) {
  return e.kind === "resisted";
}
function wl(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Le("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Le("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || sn(e.resistanceGateMode, e.resistanceState) ? Le(
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
const at = "data-paranormal-toolkit-prompt-id", yh = "data-paranormal-toolkit-resistance-roll-result", Ah = "Conjuração DT";
function _h(e) {
  const t = e.querySelector(fn)?.getAttribute(yh), n = dt(t);
  if (n !== null) return n;
  const r = e.querySelector(il)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return dt(a?.[1] ?? null);
}
function _a(e) {
  const t = Cl(e), n = Eh(t);
  if (n !== null) return n;
  const r = kh(t);
  return r !== null ? r : $h(e);
}
function Th(e) {
  const t = Cl(e);
  return t ? {
    actorId: Fn(t.actorId),
    itemId: Fn(t.itemId),
    itemName: Fn(t.itemName)
  } : null;
}
function Rh(e) {
  const t = e.getAttribute(at);
  if (!t) return null;
  const n = Sl(e), r = Il(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => gn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function ue(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function hr(e) {
  return ue(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function kh(e) {
  const t = Ch(e);
  return t.length === 0 ? null : dt(Sh(t, Ah));
}
function Eh(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : zo(r, ["system", "ritual", "DT"]) ?? zo(r, ["system", "ritual", "dt"]);
}
function $h(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return dt(n?.[1] ?? null);
}
function Cl(e) {
  const t = wh(e);
  if (!t) return null;
  const n = Sl(e), r = Il(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => gn(o) ? o.pendingId === t : !1) ?? null;
}
function wh(e) {
  return (e.closest(`[${at}]`) ?? e.querySelector(`[${at}]`) ?? e.parentElement?.querySelector(`[${at}]`) ?? null)?.getAttribute(at) ?? null;
}
function Sl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Ih(a) ? a : null;
}
function Il(e) {
  const t = e?.getFlag?.(d, mn);
  return gn(t) ? t : null;
}
function Ch(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Sh(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function zo(e, t) {
  let n = e;
  for (const r of t) {
    if (!gn(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : dt(typeof n == "string" ? n : null);
}
function dt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Ih(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function gn(e) {
  return !!(e && typeof e == "object");
}
function Fn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function hn(e) {
  return Ll({
    hasResistance: !!e.querySelector(pa),
    difficulty: _a(e),
    resistanceTotal: _h(e)
  });
}
function Lh(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Ll({
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
function Ll(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Gd(e)
  };
}
function Ce() {
  return game.user?.isGM === !0;
}
function Ee() {
  return Ce();
}
function vh(e) {
  const t = sn(e.resistanceGateMode, e.resistanceState), n = Dh(e.resistanceState, e.hasDamage), r = xh(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = hh({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = bh({
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
function Dh(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function xh(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Ta(e) {
  const t = e.isGM ?? Ee();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: vh({
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
function Nh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Mh(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Ph(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Mh(e, t) {
  const n = Oh(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of Fh(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Oh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Fh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? qo(e, "highest") : n.includes("kl") ? qo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function qo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Bh = "data-paranormal-toolkit-resistance-skill", Uh = "data-paranormal-toolkit-resistance-skill-label", zh = "data-paranormal-toolkit-roll-card-target-names", qh = "data-paranormal-toolkit-roll-card-resistance", Gh = "data-paranormal-toolkit-roll-card-resistance-skill", jh = "data-paranormal-toolkit-roll-card-resistance-skill-label", vl = "pending", Ra = "success", ka = "failure", Dl = "rolled";
function Vh(e) {
  const t = Xh(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Kh(e.damageSection) : null, r = Go(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Hh(e.rollCard).map((o, s) => {
    const l = Wh(o, s), c = e.resistanceResults.get(l) ?? null, u = nb(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, A = Lh({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: sb(u)
    }).state, k = Go(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Rl(A)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: g,
      effect: k,
      assistedActions: Ta({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: A,
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
function Hh(e) {
  const t = e.getAttribute(zh), n = t ? ib(t) : [];
  if (n.length > 0) return n;
  const a = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = a.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && xl(s) !== "nenhum alvo") : [];
}
function Wh(e, t) {
  return `${xl(e)}:${t}`;
}
function Kh(e) {
  const t = rb(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: ob(e),
    formula: ab(e) ?? "—",
    total: t,
    diceBreakdown: Ph(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Go(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Yh(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Ue(o)
  } : null;
}
function Yh(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Xh(e, t) {
  const n = Zh(t), r = Qh(e), a = r.description ?? Jh(n)?.textContent?.trim(), o = eb(n), s = r.skill ?? o?.getAttribute(Bh) ?? null, l = r.skillLabel ?? o?.getAttribute(Uh) ?? (s ? ke(s) : null);
  return !a && !s ? null : {
    description: a ?? "Resistência do alvo.",
    formula: tb(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: _a(e)
  };
}
function Qh(e) {
  return {
    description: Bn(e, qh),
    skill: Bn(e, Gh),
    skillLabel: Bn(e, jh)
  };
}
function Zh(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function Jh(e) {
  return Ea(e, `.${i}__resistance-description`);
}
function eb(e) {
  return Ea(e, fn);
}
function tb(e) {
  return Ea(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Ea(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function nb(e, t) {
  return e ? t === null ? Dl : e.total >= t ? Ra : ka : vl;
}
function rb(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function ab(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function ob(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function ib(e) {
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
function xl(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function sb(e) {
  return e === Ra ? "succeeded" : e === ka ? "failed" : "pending";
}
function Nl(e) {
  if (!e) return null;
  const t = e.actorId ? ub(e.actorId) : null, n = t ? lb(t, e.itemId, e.itemName) : null;
  return n || cb(e.itemId, e.itemName);
}
function lb(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Pe(o)) return o;
  }
  const a = Kt(n);
  if (a) {
    const o = r?.find?.((s) => Pe(s) ? Kt(s.name) === a : !1);
    if (Pe(o)) return o;
  }
  return null;
}
function cb(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Pe(a)) return a;
  }
  const r = Kt(t);
  if (r) {
    const a = n?.find?.((o) => Pe(o) ? Kt(o.name) === r : !1);
    if (Pe(a)) return a;
  }
  return null;
}
function ub(e) {
  const n = game.actors?.get?.(e);
  return db(n) ? n : null;
}
function db(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Pe(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Kt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function $a(e) {
  const t = Un(e);
  if (!t) return null;
  const n = mb().filter((o) => Un(fb(o)) === t).map((o) => Pl(o)).find(lt) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => lt(o) && Un(o.name) === t);
  return lt(a) ? a : null;
}
function mb() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function fb(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Pl(e)?.name ?? null;
}
function Pl(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (lt(t)) return t;
  const n = e.document?.actor;
  return lt(n) ? n : null;
}
function lt(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Un(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Ml(e) {
  const t = bb();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: pb(e)
  });
}
function pb(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Ut(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = gb(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Ut(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Ut(e.actorName)}</strong></p>
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
function gb(e) {
  const t = hb(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Ut(a)}</li>`;
}
function hb(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = jo(n?.value);
  return r === null ? null : {
    value: r,
    max: jo(n?.max)
  };
}
function jo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function bb() {
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
async function yb(e) {
  await Ml(Ab(e));
}
function Ab(e) {
  if (_b(e)) return e;
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
function _b(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Ol(e) {
  return e.mode, `✓ ${Fl(e.inputAmount)} PV`;
}
function Tb(e) {
  const t = Fl(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Fl(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Rb {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? Ee()) !== !0 ? {
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
class kb {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? Ee()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : sn(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Eb {
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
const $b = `.${i}__actions`, wa = `.${i}__actions-title`, ze = `.${i}__button`, wb = "data-paranormal-toolkit-action-section", Cb = `${i}__button--executed`, Sb = "data-paranormal-toolkit-executed-label";
function Bl(e) {
  return ue(e.querySelector(wa)?.textContent);
}
function Ib(e, t) {
  const n = e.querySelector(wa);
  n && (n.textContent = t);
}
function yt(e, t) {
  const n = ue(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return ue(a) === n;
  }) ?? null;
}
function Ca(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Se(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Ul(e) {
  const t = Lb(e.difficulty);
  if (t === null) return null;
  const n = Vo(e.skillLabel) ?? "Resistência", r = Vo(e.description), a = vb(r, n), o = Db(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Lb(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Vo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function vb(e, t) {
  if (!e) return null;
  const n = Ho(e), r = Ho(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function Db(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function Ho(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const Lt = "data-paranormal-toolkit-prompt-id", zl = "multiTargetResistanceResults", ql = "multiTargetDamageApplications", Gl = "multiTargetEffectApplications";
function xb(e) {
  const t = /* @__PURE__ */ new Map(), r = bn(e)?.[zl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Ub(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Nb(e, t) {
  await Sa(e, zl, t.targetId, t);
}
function Pb(e) {
  const t = /* @__PURE__ */ new Map(), r = bn(e)?.[ql];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    zb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Mb(e, t) {
  await Sa(
    e,
    ql,
    t.targetId,
    t
  );
}
function Ob(e) {
  const t = /* @__PURE__ */ new Map(), r = bn(e)?.[Gl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Gb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Fb(e, t) {
  await Sa(
    e,
    Gl,
    t.targetId,
    t
  );
}
function Bb(e) {
  const t = bn(e);
  return t ? {
    actorId: zn(t.actorId),
    itemId: zn(t.itemId),
    itemName: zn(t.itemName)
  } : null;
}
async function Sa(e, t, n, r) {
  const a = jl(e);
  if (!a) return;
  const o = Vl(e), s = Hl(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!Y(u) || u.pendingId !== a) return u;
    const m = Y(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, mn, {
    ...s,
    prompts: c
  }));
}
function bn(e) {
  const t = jl(e);
  if (!t) return null;
  const n = Vl(e), r = Hl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Y(o) ? o.pendingId === t : !1) ?? null;
}
function jl(e) {
  return (e.closest(`[${Lt}]`) ?? e.querySelector(`[${Lt}]`) ?? e.parentElement?.querySelector(`[${Lt}]`) ?? null)?.getAttribute(Lt) ?? null;
}
function Vl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return jb(a) ? a : null;
}
function Hl(e) {
  const t = e?.getFlag?.(d, mn);
  return Y(t) ? t : null;
}
function Ub(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function zb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && qb(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function qb(e) {
  return e === "normal" || e === "half";
}
function Gb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function zn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function jb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Y(e) {
  return !!(e && typeof e == "object");
}
const Vb = "data-paranormal-toolkit-resistance-skill", Hb = "data-paranormal-toolkit-resistance-skill-label", br = "data-paranormal-toolkit-multi-target-section", Ia = "data-paranormal-toolkit-multi-target-damage-info", Wl = "data-paranormal-toolkit-multi-target-effect-info", Kl = "data-paranormal-toolkit-multi-target-toggle", Yl = "data-paranormal-toolkit-multi-target-details", j = "data-paranormal-toolkit-multi-target-target", Wb = "data-paranormal-toolkit-multi-target-state", yr = "data-paranormal-toolkit-multi-target-roll-total", Ar = "data-paranormal-toolkit-multi-target-roll-formula", zt = "data-paranormal-toolkit-multi-target-roll-dice", _r = "data-paranormal-toolkit-multi-target-roll-skill", Tr = "data-paranormal-toolkit-multi-target-roll-skill-label", Rr = "data-paranormal-toolkit-multi-target-roll-target-name", kr = "data-paranormal-toolkit-multi-target-roll-rolled-at", Er = "data-paranormal-toolkit-multi-target-damage-mode", $r = "data-paranormal-toolkit-multi-target-damage-input-amount", Wo = "data-paranormal-toolkit-multi-target-damage-final-amount", Ko = "data-paranormal-toolkit-multi-target-damage-blocked", wr = "data-paranormal-toolkit-multi-target-damage-target-name", Cr = "data-paranormal-toolkit-multi-target-damage-applied-at", Sr = "data-paranormal-toolkit-multi-target-effect-condition-id", Ir = "data-paranormal-toolkit-multi-target-effect-condition-label", Lr = "data-paranormal-toolkit-multi-target-effect-effect-id", vr = "data-paranormal-toolkit-multi-target-effect-created", Dr = "data-paranormal-toolkit-multi-target-effect-refreshed", xr = "data-paranormal-toolkit-multi-target-effect-target-name", Nr = "data-paranormal-toolkit-multi-target-effect-applied-at", Kb = new hl(Tl()), Yb = new ml(new dl()), Xb = new fl(new ya()), Qb = new Eb(Xb), Zb = new Rb(Yb), Jb = new kb(Kb), ey = vl, Ke = Ra, At = ka, ty = Dl;
function ny(e) {
  const t = Xl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), dy(e);
  const n = my(e.rollCard, t), r = fy(e.rollCard, t);
  !n && r && Yy(e.rollCard, r, e.effectSection);
  const a = Ay(e.rollCard);
  return Jl(a, t), Hy(
    e.rollCard,
    a,
    py(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Xy(e.rollCard, r, a), !0;
}
function Xl(e) {
  return Vh({
    ...e,
    resistanceResults: oy(e.rollCard),
    damageApplications: iy(e.rollCard),
    effectApplications: sy(e.rollCard),
    resolveTargetConditionApplication: ry,
    resistanceGateMode: va()
  });
}
function ry(e, t, n) {
  const r = Bb(e), a = Nl(r);
  if (!a) return null;
  const o = ht(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = ay(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function ay(e, t, n) {
  const r = fh(
    e,
    n,
    t,
    qn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = qn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => qn(s) === a)) ?? null : null;
}
function oy(e) {
  const t = xb(e);
  for (const [n, r] of uy(e))
    t.set(n, r);
  return t;
}
function iy(e) {
  const t = Pb(e);
  for (const [n, r] of cy(e))
    t.set(n, r);
  return t;
}
function sy(e) {
  const t = Ob(e);
  for (const [n, r] of ly(e))
    t.set(n, r);
  return t;
}
function ly(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(Sr), o = n.getAttribute(Ir), s = n.getAttribute(Lr), l = Qo(n.getAttribute(vr)), c = Qo(n.getAttribute(Dr)), u = n.getAttribute(xr), m = n.getAttribute(Nr);
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
function cy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(Er), o = cc(n.getAttribute($r)), s = n.getAttribute(wr), l = n.getAttribute(Cr);
    !r || !Jy(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function uy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = cc(n.getAttribute(yr)), o = n.getAttribute(Ar), s = n.getAttribute(_r), l = n.getAttribute(Tr), c = n.getAttribute(Rr), u = n.getAttribute(kr);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(zt),
      rolledAt: u
    });
  }
  return t;
}
function dy(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function my(e, t) {
  if (!t.damage)
    return Ql(e)?.remove(), null;
  const n = gy(e);
  return hy(n, t.damage), yy(e, n), n;
}
function fy(e, t) {
  if (!t.effect)
    return lc(e)?.remove(), null;
  const n = Wy(e);
  return Ky(n, t.effect), n;
}
function py(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : yt(e, "Conjuração");
}
function gy(e) {
  const t = Ql(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Ia, "true"), n;
}
function Ql(e) {
  return e.querySelector(`[${Ia}="true"]`);
}
function hy(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Zl(t.formula, t.total, t.diceBreakdown));
}
function Zl(e, t, n, r = !1) {
  const a = Nh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return by(a, r), a;
}
function by(e, t) {
  const n = e.querySelector(pn), r = e.querySelector(ha);
  if (!n || !r) return;
  e.classList.toggle(ga, t), n.hidden = !t, r.classList.add(ba), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function yy(e, t) {
  const n = yt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Ay(e) {
  const t = e.querySelector(`[${br}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(br, "true"), n;
}
function Jl(e, t) {
  const n = _y(e), r = Ry(t.resistance), a = [Ty(t)];
  r && a.push(r), a.push($y(t, n)), e.replaceChildren(...a);
}
function _y(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${j}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(j)).filter(Zy)
  );
}
function Ty(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Ey(e.targets), t.append(n, r), t;
}
function Ry(e) {
  const t = Ul({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), ky(n, t), n;
}
function ky(e, t) {
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
function Ey(e) {
  const t = e.length, n = e.filter((l) => l.state === At).length, r = e.filter((l) => l.state === Ke).length, a = e.filter((l) => l.state === ey).length, o = e.filter((l) => l.state === ty).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function $y(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(wy(r, e, t.has(r.id)));
  return n;
}
function wy(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(j, e.id), r.setAttribute(Wb, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), ec(r, e.resistanceResult), tc(r, e.damageApplication), nc(r, e.effectApplication);
  const a = Cy(e, t, r), o = qy(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    Xo(s.target) || Yo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Xo(s.target) || (s.preventDefault(), Yo(r));
  }), r.append(a, o), r;
}
function ec(e, t) {
  if (!t) {
    e.removeAttribute(yr), e.removeAttribute(Ar), e.removeAttribute(zt), e.removeAttribute(_r), e.removeAttribute(Tr), e.removeAttribute(Rr), e.removeAttribute(kr);
    return;
  }
  e.setAttribute(yr, String(t.total)), e.setAttribute(Ar, t.formula), e.setAttribute(_r, t.skill), e.setAttribute(Tr, t.skillLabel), e.setAttribute(Rr, t.targetName), e.setAttribute(kr, t.rolledAt), t.diceBreakdown ? e.setAttribute(zt, t.diceBreakdown) : e.removeAttribute(zt);
}
function tc(e, t) {
  if (!t) {
    e.removeAttribute(Er), e.removeAttribute($r), e.removeAttribute(Wo), e.removeAttribute(Ko), e.removeAttribute(wr), e.removeAttribute(Cr);
    return;
  }
  e.setAttribute(Er, t.mode), e.setAttribute($r, String(t.inputAmount)), e.removeAttribute(Wo), e.removeAttribute(Ko), e.setAttribute(wr, t.targetName), e.setAttribute(Cr, t.appliedAt);
}
function nc(e, t) {
  if (!t) {
    e.removeAttribute(Sr), e.removeAttribute(Ir), e.removeAttribute(Lr), e.removeAttribute(vr), e.removeAttribute(Dr), e.removeAttribute(xr), e.removeAttribute(Nr);
    return;
  }
  e.setAttribute(Sr, t.conditionId), e.setAttribute(Ir, t.conditionLabel), e.setAttribute(Lr, t.effectId ?? ""), e.setAttribute(vr, String(t.created)), e.setAttribute(Dr, String(t.refreshed)), e.setAttribute(xr, t.targetName), e.setAttribute(Nr, t.appliedAt);
}
function Cy(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Sy(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Iy(e, t.resistance);
  xy(l, n, e, t);
  const c = zy(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), ic(u, [
    rc(e, t, "compact"),
    oc(e, t, "compact")
  ]), r.append(a, u), r;
}
function Sy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Iy(e, t) {
  if (!Ce())
    return Ly(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Dy(e, t)), t?.skill && (n.setAttribute(Vb, t.skill), n.setAttribute(Hb, t.skillLabel ?? ke(t.skill))), !t?.skill)
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
function Ly(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", vy(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ke ? "✓" : e.state === At ? "✕" : "", n.append(r, a), n;
}
function vy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Ke ? "sucesso" : e.state === At ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Dy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Ke ? "sucesso" : e.state === At ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function xy(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !Ce() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Ny(t, e, n, r);
  });
}
async function Ny(e, t, n, r) {
  if (!Ce()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? ke(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = $a(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Qb.execute({ actor: l, skill: o, skillLabel: s });
    await Qy(u.roll);
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
    ec(e, m);
    try {
      await Nb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    La(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function La(e) {
  const t = e.closest(`[${br}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Xl({
    rollCard: n,
    damageSection: Py(n) ?? yt(n, "Dano"),
    effectSection: My(n)
  });
  r && Jl(t, r);
}
function Py(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Ia) !== "true") ?? null;
}
function My(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Oy(e) {
  return We(e.assistedActions.policy.damageActionState);
}
function Fy(e) {
  return We(e.assistedActions.policy.effectActionState);
}
function va() {
  try {
    return sa();
  } catch {
    return "strict";
  }
}
function rc(e, t, n) {
  if (e.damageApplication)
    return le(
      "✓",
      Ol({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (We(r))
    return le(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = ac(a, t.damage);
  if (o === null)
    return le(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Tb({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = le(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${j}]`);
    g && By(g, u, e, t);
  }), u;
}
function ac(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function By(e, t, n, r) {
  if (n.damageApplication) return;
  if (Oy(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = ac(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = $a(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await Zb.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: va(),
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
    tc(e, m);
    try {
      await Mb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await yb(u.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    La(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function oc(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (e.effectApplication)
    return le(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!a) return null;
  if (We(r))
    return le(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if ($l(r))
    return le(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = le(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${j}]`);
    l && Uy(l, o, e, t);
  }), o;
}
async function Uy(e, t, n, r) {
  if (n.effectApplication) return;
  if (Fy(n)) {
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
  const o = $a(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await Jb.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: va(),
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
    nc(e, c);
    try {
      await Fb(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), La(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ic(e, t) {
  for (const n of t)
    n && e.append(n);
}
function le(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function zy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Kl, "true"), t.setAttribute("aria-hidden", "true"), sc(e, t), t;
}
function Yo(e) {
  const t = e.querySelector(`[${Yl}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Kl}="true"]`);
  r && sc(e, r);
}
function sc(e, t) {
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
function qy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Yl, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Gy(e, t.resistance);
  s && r.append(s);
  const l = jy(e, t.resistance), c = Vy(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Gy(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Ke ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function jy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Zl(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Vy(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), ic(n, [
    rc(e, t, "full"),
    oc(e, t, "full")
  ]), n;
}
function Hy(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Wy(e) {
  const t = lc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Wl, "true"), n;
}
function lc(e) {
  return e.querySelector(`[${Wl}="true"]`);
}
function Ky(e, t) {
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
function Yy(e, t, n) {
  const r = n?.parentElement === e ? n : yt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Xy(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function qn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Qy(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Zy(e) {
  return typeof e == "string" && e.length > 0;
}
function Jy(e) {
  return e === "normal" || e === "half";
}
function Qo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function cc(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Zo = "data-paranormal-toolkit-card-layout-refresh-bound";
function eA(e) {
  const t = e.rollCard.querySelector(fn);
  t && t.getAttribute(Zo) !== "true" && (t.setAttribute(Zo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Me = "data-paranormal-toolkit-prompt-id", tA = "apply-damage", nA = "data-paranormal-toolkit-multi-target-damage-info";
function rA(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(nA) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function aA(e) {
  const t = iA(e);
  return t.find((n) => n.getAttribute(wb) === tA) ?? t.find((n) => Bl(n) === "aplicar danos") ?? null;
}
function oA(e) {
  const t = uc(e), n = Jo(t);
  return n || Jo(sA(e));
}
function Jo(e) {
  return e.find((t) => {
    const n = Bl(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function iA(e) {
  const t = uc(e);
  return t.length > 0 ? t : Da(e);
}
function uc(e) {
  const t = uA(e);
  return t ? Da(e).filter((n) => cA(n, t)) : [];
}
function sA(e) {
  const t = dc(e);
  if (!t) return [];
  const n = lA(e, t);
  return Da(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => mc(e, r)).filter((r) => !n || dA(r, n));
}
function Da(e) {
  const t = dc(e);
  return t ? Array.from(t.querySelectorAll($b)) : [];
}
function dc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function lA(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && mc(e, n)) ?? null;
}
function cA(e, t) {
  return e.getAttribute(Me) === t ? !0 : Array.from(e.querySelectorAll(`[${Me}]`)).some((n) => n.getAttribute(Me) === t);
}
function uA(e) {
  return e.getAttribute(Me) ?? e.querySelector(`[${Me}]`)?.getAttribute(Me) ?? null;
}
function mc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function dA(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function mA(e) {
  const t = fc(), n = hn(e.rollCard).state, r = Ta({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = We(a), s = $l(a);
  return e.applied ? Je({
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
  }) : r.policy.canShowApplyEffect ? Je(o ? {
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
  }) : Je({
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
function Je(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function fA(e) {
  const { rollCard: t } = e, n = hA(), r = fc(), a = hn(t).state, o = Ta({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = We(s), c = gA(e);
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
      summary: pA(a)
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
function pA(e) {
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
function gA(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function hA() {
  try {
    return Jd();
  } catch {
    return "assisted";
  }
}
function fc() {
  try {
    return sa();
  } catch {
    return "strict";
  }
}
const bA = "data-paranormal-toolkit-damage-resolution-state", ei = "data-paranormal-toolkit-damage-icon-enhanced", xa = "data-paranormal-toolkit-damage-original-label", yA = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, pc = "Outra opção escolhida";
function AA(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Ib(t, "Aplicar dano"), _A(e, t);
}
function _A(e, t) {
  const n = Array.from(t.querySelectorAll(ze)), r = ni(n, "normal"), a = ni(n, "half");
  if (!r || !a) {
    TA(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  ri(r, "normal"), ri(a, "half");
  const o = fA({
    rollCard: e,
    normalButtonApplied: Yt(r),
    halfButtonApplied: Yt(a),
    normalButtonSkipped: Pr(r),
    halfButtonSkipped: Pr(a)
  });
  if (!o.canShowApplyDamage) {
    ai(r), ai(a), oi(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), ti(r, o.normalButton), ti(a, o.halfButton), oi(t, o.summary.state, o.summary.message);
}
function ti(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    kA(e, t.visible), EA(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function TA(e) {
  for (const t of e)
    Pr(t) && t.remove();
}
function Yt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(pc);
}
function Pr(e) {
  return e.textContent?.includes(pc) ?? !1;
}
function ni(e, t) {
  const n = yA[t];
  return e.find((r) => n.test(RA(r))) ?? null;
}
function RA(e) {
  return [
    e.getAttribute(xa),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function ri(e, t) {
  if (e.getAttribute(ei) === "true") return;
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
  ), e.setAttribute(ei, "true"), e.setAttribute(xa, n), e.setAttribute("aria-label", n), e.replaceChildren(r, Se(n));
}
function ai(e) {
  Yt(e) || e.remove();
}
function kA(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function EA(e, t, n, r = "Role resistência") {
  if (!Yt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(Se(r));
      return;
    }
    e.removeAttribute("aria-disabled"), $A(e, n);
  }
}
function $A(e, t) {
  const n = e.getAttribute(xa) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(wA(t), Se(n)));
}
function wA(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function oi(e, t, n) {
  e.setAttribute(bA, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(wa)?.after(a);
}
const mt = "data-paranormal-toolkit-effect-icon-enhanced", qe = "data-paranormal-toolkit-effect-action-compacted", yn = "data-paranormal-toolkit-effect-resistance-gate", Na = "data-paranormal-toolkit-effect-section", Pa = "data-paranormal-toolkit-effect-label";
function CA(e) {
  return e.querySelector(`[${Na}="true"]`);
}
function SA(e) {
  const t = LA(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? DA(), r = zA(n, e.sourceActions, t);
  return r && n.setAttribute(Pa, r), xA(n, t, r), BA(e.rollCard, n, e.after ?? e.fallbackAfter), UA(e.sourceActions, n), n;
}
function IA(e, t) {
  const n = t.querySelector(ze);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = yc(t, n, r), o = gc(e, n), s = mA({
    rollCard: e,
    effectLabel: a,
    applied: Oa(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Ue(o) === "success" || Ue(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? El(o) : !1
  });
  if (s.applied) {
    GA(n);
    return;
  }
  if (!s.visible) {
    jA(n);
    return;
  }
  if (s.waitingForResistance) {
    VA(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    HA(n, s.compactLabel);
    return;
  }
  WA(n), bc(n, s.displayLabel);
}
function LA(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(ze) ?? []), n = Array.from(e.existingSection?.querySelectorAll(ze) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : vA(e.rollCard, r) ?? r[0] ?? null;
}
function vA(e, t) {
  const n = hn(e).state, r = Rl(n), a = hc(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = gc(e, o, a);
    if (s && kl(s, r)) return o;
  }
  return null;
}
function gc(e, t, n = hc(e)) {
  const r = Ma(t, t.textContent?.trim() ?? ""), a = hr(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => hr(s) === a)) ?? null : null;
}
function hc(e) {
  const t = Nl(Th(e));
  if (!t) return [];
  const n = ht(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function DA() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Na, "true"), e;
}
function xA(e, t, n) {
  e.setAttribute(Na, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = NA(e), a = PA(r);
  a.textContent = "Efeito";
  const o = MA(e, r), s = OA(o);
  s.textContent = KA(n ?? yc(e, t, t.textContent?.trim() ?? ""));
  const l = FA(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(ze)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Oa(t, c) && !qA(t, c) && bc(t, n ?? c);
}
function NA(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function PA(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function MA(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function OA(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function FA(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function BA(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function UA(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(ze)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function zA(e, t, n) {
  const r = e.getAttribute(Pa);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Ma(n, n.textContent?.trim() ?? "");
}
function Ma(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ue(n) !== "efeito aplicado") return n;
  const r = Rh(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && ue(a) !== "aplicado" ? a : null;
}
function Oa(e, t) {
  return e.classList.contains(Cb) || ue(t).includes("aplicado");
}
function qA(e, t) {
  const n = e.getAttribute(yn);
  if (n === "pending" || n === "resisted") return !0;
  const r = hr(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function bc(e, t) {
  e.getAttribute(qe) === "true" && e.getAttribute(mt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(mt, "true"), e.setAttribute(Sb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Ca("✦", `${i}__button-icon--effect`),
    Se("Aplicar")
  ));
}
function GA(e) {
  e.getAttribute(qe) === "true" && ue(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(mt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Ca("✓", `${i}__button-icon--effect-applied`),
    Se("Aplicado")
  ));
}
function yc(e, t, n) {
  const r = e.getAttribute(Pa) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Ma(t, n) ?? n;
}
function jA(e) {
  Oa(e, e.textContent?.trim() ?? "") || e.remove();
}
function VA(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(qe), e.removeAttribute(mt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(yn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Se(t));
}
function HA(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(qe), e.removeAttribute(mt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(yn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Ca("✓", `${i}__button-icon--effect-resisted`),
    Se(t)
  );
}
function WA(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(yn), e.removeAttribute("aria-disabled");
}
function KA(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const YA = "data-paranormal-toolkit-card-layout-normalized";
function XA(e) {
  const t = QA(e.rollCard), n = ZA(t);
  return eA({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function QA(e) {
  return {
    rollCard: e,
    damageSection: rA(e),
    resistance: e.querySelector(pa),
    damageActions: aA(e),
    effectActionSource: oA(e),
    effectSection: CA(e)
  };
}
function ZA(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(YA, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = yt(t, "Conjuração"), c = JA({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), AA(t, a));
  const u = SA({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: e_(n, c),
    fallbackAfter: l
  });
  return u && IA(t, u), u;
}
function JA(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function e_(e, t) {
  return e ?? t;
}
const Ac = [0, 80, 180, 400, 900, 1600, 3e3], ii = /* @__PURE__ */ new WeakSet();
function t_(e) {
  _c(e), n_(e);
}
function _c(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Tc(t);
}
function n_(e) {
  if (!ii.has(e)) {
    ii.add(e);
    for (const t of Ac)
      globalThis.setTimeout(() => {
        _c(e);
      }, t);
  }
}
function Tc(e) {
  const t = XA({
    rollCard: e,
    refreshDelaysMs: Ac,
    onRefresh: () => Tc(e)
  });
  ny({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const r_ = "data-paranormal-toolkit-resistance-roll-result-enhanced", si = "data-paranormal-toolkit-resistance-original-description", a_ = "data-paranormal-toolkit-resistance-skill", o_ = "data-paranormal-toolkit-resistance-skill-label", i_ = `${i}__resistance--without-roll-button`, s_ = ["Fortitude", "Reflexos", "Vontade"];
function l_(e) {
  for (const t of Array.from(e.querySelectorAll(pa)))
    c_(t);
  t_(e);
}
function c_(e) {
  const t = e.querySelector(lp), n = e.querySelector(ol), r = e.querySelector(fn), a = p_(r) ? r : null, o = e.querySelector(il);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(i_, !a);
  const s = f_(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), b_(o)), u_(e, r, n), a && (R_(a), a.parentElement !== e && e.append(a));
}
function u_(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = m_(n), o = Ul({
    description: a,
    skillLabel: g_(t, a),
    difficulty: _a(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  d_(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function d_(e, t) {
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
function m_(e) {
  const t = e.getAttribute(si);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(si, n), n;
}
function f_(e, t) {
  const n = e.querySelector(`.${Io}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Io), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function p_(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function g_(e, t) {
  const n = e?.getAttribute(o_) ?? e?.getAttribute(a_) ?? null;
  return n || h_(t);
}
function h_(e) {
  const t = li(e);
  return s_.find((n) => t.startsWith(li(n))) ?? null;
}
function li(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function b_(e) {
  const t = y_(e.textContent ?? "");
  t && (e.setAttribute(r_, "true"), e.replaceChildren(T_(t)));
}
function y_(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = A_(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function A_(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: __(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function __(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function T_(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = k_(e);
  return r && t.append(r), t;
}
function R_(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = hn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function k_(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of E_(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function E_(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ci(e, "highest") : n.includes("kl") ? ci(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ci(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function $_(e) {
  for (const t of Array.from(e.querySelectorAll(op))) {
    const n = D_(t);
    w_(t), n && (C_(t, n), S_(t, n));
  }
}
function w_(e) {
  for (const t of Array.from(e.querySelectorAll(ip)))
    t.remove();
}
function C_(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(al) ?? null, a = r?.querySelector(ap) ?? null, o = r ?? e, s = o.querySelector(dp);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Y_(t.elementTone), l.textContent = K_(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function S_(e, t) {
  const n = I_(e);
  L_(e, n);
  const r = v_(t);
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
  const o = e.querySelector(sl);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function I_(e) {
  return e.closest(`.${i}`)?.querySelector(al) ?? null;
}
function L_(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(mp)))
      a.remove();
}
function v_(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${dr(e.target)}` : null,
    e.duration ? `Duração: ${dr(e.duration)}` : null,
    e.resistance ? `Resistência: ${Ys(e.resistance)}` : null
  ].filter(cn);
}
function D_(e) {
  const t = x_(e), n = B_(e), a = (t ? F_(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Fa(W(a, "element")), l = te("op.elementChoices", s) ?? di(ye(o, "Elemento")) ?? di(n.damageType), c = s ?? X_(l), u = W(a, "circle") ?? ye(o, "Círculo"), m = q_(a) ?? ye(o, "Alvo"), g = H_(a, "duration", "op.durationChoices") ?? ye(o, "Duração"), A = U_(e) ?? j_(a) ?? ye(o, "Resistência"), k = z_(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: A
  };
  return W_(R) ? R : null;
}
function x_(e) {
  const t = N_(e);
  if (!t) return null;
  const n = t.getFlag?.(d, mn), r = M_(n);
  if (r.length === 0) return null;
  const a = P_(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function N_(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? ca()?.messages?.get?.(n) ?? null : null;
}
function P_(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${So}]`))) {
    const a = r.getAttribute(So)?.trim();
    a && n.add(a);
  }
  return n;
}
function M_(e) {
  if (!ln(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(O_).filter((n) => n !== null) : [];
}
function O_(e) {
  return ln(e) ? {
    pendingId: Ot(e.pendingId),
    actorId: Ot(e.actorId),
    itemId: Ot(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Nm) : []
  } : null;
}
function F_(e) {
  if (!e.itemId) return null;
  const t = ca(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function B_(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(sp))) {
    const a = He(r.textContent);
    if (!a) continue;
    const o = xm(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function U_(e) {
  const t = He(e.querySelector(ol)?.textContent);
  return t ? Ys(t) : null;
}
function ye(e, t) {
  const n = ut(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || ut(r.slice(0, a)) !== n))
      return He(r.slice(a + 1));
  }
  return null;
}
function z_(e) {
  const t = ye(e, "Custo") ?? ye(e, "PE");
  return t || (e.map(He).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function q_(e) {
  const t = W(e, "target");
  if (!t) return null;
  if (t === "area")
    return G_(e) ?? te("op.targetChoices", t) ?? "Área";
  const n = te("op.targetChoices", t) ?? ce(t);
  return [t === "people" || t === "creatures" ? W(e, "targetQtd") : null, n].filter(cn).join(" ");
}
function G_(e) {
  const t = W(e, "area.name"), n = W(e, "area.size"), r = W(e, "area.type"), a = t ? te("op.areaChoices", t) ?? ce(t) : null, o = r ? te("op.areaTypeChoices", r) ?? ce(r) : null;
  return a ? n ? o ? `${a} ${n}m ${dr(o)}` : `${a} ${n}m` : a : null;
}
function j_(e) {
  const t = W(e, "skillResis"), n = W(e, "resistance");
  if (!t || !n) return null;
  const r = te("op.skill", t) ?? ce(t), a = V_(n);
  return [r, a].filter(cn).join(" ");
}
function V_(e) {
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
      return te("op.resistanceChoices", e) ?? ce(e);
  }
}
function H_(e, t, n) {
  const r = W(e, t);
  return r ? te(n, r) ?? ce(r) : null;
}
function W_(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function K_(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Y_(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(cn).join(" ");
}
function Fa(e) {
  const t = ut(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function di(e) {
  const t = Fa(e);
  return t ? te("op.elementChoices", t) ?? ce(t) : e ? ce(e) : null;
}
function X_(e) {
  return Fa(e);
}
function te(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = ca()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const mi = "data-paranormal-toolkit-dice-toggle-enhanced";
function Q_(e) {
  for (const t of Array.from(e.querySelectorAll(ll)))
    Rc(t);
}
function Z_(e) {
  const t = Ec(e.target);
  if (!t) return;
  const n = Ba(t);
  n && (e.preventDefault(), kc(n, t));
}
function J_(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ec(e.target);
  if (!t) return;
  const n = Ba(t);
  n && (e.preventDefault(), kc(n, t));
}
function Rc(e) {
  const t = e.querySelector(pn);
  if (!t) return;
  const n = e.querySelector(ha);
  if (n && n.getAttribute(mi) !== "true" && (n.setAttribute(mi, "true"), n.classList.add(ba), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function kc(e, t) {
  const n = e.querySelector(pn);
  if (!n) return;
  const r = !e.classList.contains(ga);
  eT(e, t, n, r);
}
function eT(e, t, n, r) {
  e.classList.toggle(ga, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Ec(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(ha);
  if (!t) return null;
  const n = Ba(t);
  return n ? (Rc(n), t.classList.contains(ba) ? t : null) : null;
}
function Ba(e) {
  const t = e.closest(ll);
  return t && t.querySelector(pn) ? t : null;
}
const fi = `${d}-workflow-dice-toggle-styles`;
function tT() {
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
const nT = [0, 100, 500, 1500, 3e3];
let pi = !1, Gn = null;
function rT() {
  if (!pi) {
    pi = !0, tT(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ot(jt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ot(jt(t));
    }), Hooks.once("ready", () => {
      ot(document), aT();
    }), document.addEventListener("click", Z_), document.addEventListener("keydown", J_);
    for (const e of nT)
      globalThis.setTimeout(() => ot(document), e);
  }
}
function aT() {
  Gn || !document.body || (Gn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ot(n);
  }), Gn.observe(document.body, { childList: !0, subtree: !0 }));
}
function ot(e) {
  e && (Lp(e), $_(e), l_(e), Q_(e), Rp(e));
}
function oT() {
  rT();
}
const iT = "data-paranormal-toolkit-action-section", sT = "ritual-log", lT = ".paranormal-toolkit-item-use-prompt__actions", cT = ".paranormal-toolkit-item-use-prompt__actions-title", uT = [0, 100, 500, 1500];
let gi = !1;
function dT() {
  if (gi) return;
  const e = (t, n) => {
    hi(gT(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), hi(document), gi = !0;
}
function hi(e) {
  for (const t of uT)
    globalThis.setTimeout(() => mT(e), t);
}
function mT(e) {
  fT(e), pT(e);
}
function fT(e) {
  for (const t of e.querySelectorAll(
    `[${iT}="${sT}"]`
  ))
    t.remove();
}
function pT(e) {
  for (const t of e.querySelectorAll(lT)) {
    if (bi(t.querySelector(cT)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => bi(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function gT(e) {
  if (e instanceof HTMLElement || hT(e))
    return e;
  if (bT(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function hT(e) {
  return e instanceof HTMLElement;
}
function bT(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function bi(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const it = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, $c = {
  PV: "system.attributes.hp"
}, Mr = {
  PV: [it.PV, $c.PV],
  SAN: [it.SAN],
  PE: [it.PE],
  PD: [it.PD]
}, Or = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class yT {
  getResource(t, n) {
    const r = yi(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = _i(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = _i(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = yi(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function yi(e, t) {
  const n = AT(e.type, t);
  if (n && Ai(e, n))
    return y(n);
  const r = Mr[t].find(
    (a) => Ai(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: _T(e, t),
    path: Mr[t].join(" | ")
  });
}
function AT(e, t) {
  return e === "threat" ? $c[t] ?? null : e === "agent" ? it[t] : null;
}
function Ai(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function _T(e, t) {
  const n = e.type ?? "unknown", r = Mr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function _i(e, t, n, r, a) {
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
class TT {
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
      const s = Or.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = RT(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Or.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function RT(e) {
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
const kT = "dice-so-nice";
async function wc(e) {
  if (!ET() || !$T()) return;
  const t = wT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function ET() {
  try {
    return rp().enabled;
  } catch {
    return !1;
  }
}
function $T() {
  return game.modules?.get?.(kT)?.active === !0;
}
function wT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Ri = "occultism";
class Cc {
  getDifficulty(t) {
    return CT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await IT(t, Ri);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await wc(r);
    const a = DT(r);
    return {
      skill: Ri,
      skillLabel: "Ocultismo",
      roll: r,
      formula: vT(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: xT(r)
    };
  }
}
function CT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function ST(e) {
  return new Cc().rollCastingCheck(e);
}
async function IT(e, t) {
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
  return LT(r);
}
function LT(e) {
  return ki(e) ? e : Array.isArray(e) ? e.find(ki) ?? null : null;
}
function ki(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function vT(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function DT(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function xT(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(NT);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function NT(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const PT = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class MT {
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
    const r = n.value, a = OT(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: PT[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function OT(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : FT(n) ? {
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
function FT(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class BT {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return jn("missing-item-patch");
    if (t.type !== "ritual") return jn("unsupported-item-type");
    const a = UT(r);
    return Object.keys(a).length === 0 ? jn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function UT(e) {
  const t = {};
  M(t, "name", e.name), M(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (M(t, "system.circle", n.circle), M(t, "system.element", n.element), M(t, "system.target", n.target), M(t, "system.targetQtd", n.targetQuantity), M(t, "system.execution", n.execution), M(t, "system.range", n.range), M(t, "system.duration", n.duration), M(t, "system.skillResis", n.resistanceSkill), M(t, "system.resistance", n.resistance), M(t, "system.studentForm", n.studentForm), M(t, "system.trueForm", n.trueForm)), t;
}
function M(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function jn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class zT {
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
    return this.getNumber(t, Or.ritual.dt, 0);
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
class qT {
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
class GT {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = jT(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Vn(t)), y(t)) : n;
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
    return this.list().map((n) => VT(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function jT(e) {
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
function VT(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = HT(a, t);
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
function HT(e, t) {
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
      const n = Ei(t.name), r = e.names.map(Ei).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = WT(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Ei(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function WT(e) {
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
    const n = An(e.amountFrom);
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
function An(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function KT(e, t, n) {
  if (!$i(e.id) || !$i(e.formula))
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
    await wc(a);
    const l = {
      ...n.rollRequests[e.id] ?? Sc(e, t),
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
function Sc(e, t) {
  const n = e.intent ?? YT(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function YT(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function $i(e) {
  return typeof e == "string" && e.length > 0;
}
async function Qt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? vt(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? vt(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? vt(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? vt(t, n, r, a) : e.recover(t, n, a);
  }
}
function vt(e, t, n, r) {
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
function XT(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = QT(t, n, r, a);
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
    const s = ZT(t, n, r, a);
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
function QT(e, t, n, r) {
  const a = An(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Ic(t.id, "damage", r, t.damageInstances.length),
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
function ZT(e, t, n, r) {
  const a = An(e.amountFrom);
  return {
    id: Ic(t.id, "healing", r, t.healingInstances.length),
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
function Ic(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function JT(e, t, n) {
  const r = An(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function eR(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Lc("before", e), wi("before", e), wi("resolve", e);
}
function tR(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Lc("apply", e);
}
function nR(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Lc(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = rR(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function wi(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function rR(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function aR(e, t, n) {
  return y(void 0);
}
async function oR(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return iR(e, t);
    case "spendRitualCost":
      return sR(e, t);
  }
}
async function iR(e, t) {
  const { context: n, resources: r } = e, a = Xt(t, n);
  return a.ok ? vc(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function sR(e, t) {
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
  }), vc(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function vc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function lR(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = cR(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function cR(e) {
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
class uR {
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
        return lR({
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
    const a = await oR({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Sc(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await KT(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Xt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = JT(t, n, a.value);
    eR({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), tR({
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
      const c = await Qt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      XT({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return nR({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Xt(t, n);
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
      const l = await Qt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await aR(this.messages);
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
    const l = dR(t, n.intent);
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
function dR(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class mR {
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
class fR {
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
class pR {
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
function Dc(e) {
  return {
    id: gR(),
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
function gR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class hR {
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
    const r = Dc(n);
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
class bR {
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
class yR {
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
    const n = sr();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: AR(),
      flags: {
        ...t.flags,
        [d]: {
          ..._R(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = sr();
    if (!r.enabled)
      return;
    const a = n.notification ?? Ci(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Ci(n);
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
function Ci(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function AR() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function _R(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const TR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", xc = `${d}-inline-roll-neutralized`, RR = `${d}-inline-roll-notice`, Ua = `data-${d}-inline-roll-neutralized`, Si = `data-${d}-inline-roll-notice`, kR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ii(e) {
  const t = OR(e.message), n = await ER(e.message), r = $R(t);
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
async function ER(e) {
  const t = NR(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = wR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await PR(t, n.content), replacementCount: n.replacementCount };
}
function $R(e) {
  const t = e ? MR(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Nc(t);
  return n > 0 && Pc(vR(t)), { replacementCount: n };
}
function wR(e) {
  const t = CR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Nc(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Pc(n.content), { content: n.innerHTML, replacementCount: a });
}
function CR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, IR(a.trim()))), replacementCount: t };
}
function Nc(e) {
  const t = SR(e);
  for (const n of t)
    n.replaceWith(LR(DR(n)));
  return t.length;
}
function SR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(TR))
    n.getAttribute(Ua) !== "true" && t.add(n);
  return Array.from(t);
}
function IR(e) {
  return `<span class="${xc}" ${Ua}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${FR(e)}</span>`;
}
function LR(e) {
  const t = document.createElement("span");
  return t.classList.add(xc), t.setAttribute(Ua, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Pc(e) {
  if (e.querySelector?.(`[${Si}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(RR), t.setAttribute(Si, "true"), t.textContent = kR, e.append(t);
}
function vR(e) {
  return e.querySelector(".message-content") ?? e;
}
function DR(e) {
  const n = e.getAttribute("data-formula") ?? xR(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function xR(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function NR(e) {
  return e && typeof e == "object" ? e : null;
}
async function PR(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function MR(e) {
  const t = BR(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function OR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function FR(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function BR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Zt = "ritualRollConfig", Jt = "ritual-roll", UR = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function _n() {
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
function Mc(e) {
  const t = e.getFlag(d, Zt);
  return Fr(t);
}
function Oc(e) {
  return Mc(e) ?? _n();
}
async function zR(e, t) {
  const n = Fr(t) ?? Fr({
    ..._n(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Zt, n), n;
}
async function qR(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Zt));
    return;
  }
  await e.setFlag(d, Zt, null);
}
function Fr(e) {
  if (!Tn(e)) return null;
  const t = ZR(e.intent);
  if (!t) return null;
  const n = _n();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Br(e.damageType),
    utilityLabel: Br(e.utilityLabel) ?? n.utilityLabel,
    note: za(e.note),
    forms: ek(e.forms)
  };
}
function GR(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function jR(e) {
  const t = Mc(e), n = Fc(e);
  if (!t)
    return Li(e, n);
  const r = XR(e, t);
  if (!r)
    return Li(e, n);
  const a = VR(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...HR(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: KR(e, t),
    resistance: n
  };
}
function Li(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: YR(e),
    resistance: t
  } : null;
}
function VR(e, t) {
  const n = {
    type: "rollFormula",
    id: Jt,
    formula: t,
    intent: QR(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function HR(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Jt}.total`,
          ...WR(e.damageType)
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
function WR(e) {
  return e ? { damageType: e } : {};
}
function KR(e, t) {
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
function YR(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Ge(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Ge(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function XR(e, t) {
  return [
    t.forms.base.formula.trim(),
    Ge(e, "discente") ? t.forms.discente.formula.trim() : "",
    Ge(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Fc(e) {
  const t = Bc(e), n = Br(t.skillResis), r = JR(t.resistance);
  if (!n || !r) return;
  const a = tk(n), o = UR[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function QR(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function ZR(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function JR(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function ek(e) {
  const t = _n();
  return Tn(e) ? {
    base: Kn(e.base),
    discente: Kn(e.discente),
    verdadeiro: Kn(e.verdadeiro)
  } : t.forms;
}
function Kn(e) {
  return Tn(e) ? { formula: za(e.formula) } : { formula: "" };
}
function Ge(e, t) {
  const n = Bc(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return nk(r);
}
function Bc(e) {
  const t = e.system;
  return Tn(t) ? t : {};
}
function tk(e) {
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
function nk(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function za(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Br(e) {
  const t = za(e);
  return t.length > 0 ? t : null;
}
function Tn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function rk(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function ak(e) {
  switch (ok(e)) {
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
      return ik(String(e ?? ""));
  }
}
function ok(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function ik(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function sk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function lk(e) {
  return {
    ...qa(e),
    type: "ritual.cast.started"
  };
}
function ck(e) {
  return {
    ...qa(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function uk(e) {
  return {
    ...qa(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function dk(e) {
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
function mk(e, t = {}) {
  const n = Ck(e), r = [
    ...Ik(t.candidates ?? []),
    ...Lk(e)
  ], a = Dk(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = Sk(t) ?? xk(r) ?? Pk(a), s = Ok(canvas?.grid?.size), l = fk(o, a, r), c = Tk(r), u = _k(l);
  return {
    type: "rectangleRay",
    sceneId: Mk(e, n),
    regionId: Oi(n?.id) ?? Oi(e.id),
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
function fk(e, t, n) {
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
    direction: pk(r, t, n)
  };
}
function pk(e, t, n) {
  const r = gk(n);
  return r !== null ? r : bk(e, t) ?? e.direction;
}
function gk(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = vi(n, t);
    if (r !== null) return r;
    const a = Rn(n), o = vi(a, t);
    if (o !== null) return o;
  }
  return null;
}
function vi(e, t) {
  for (const n of t) {
    const r = hk(G(e, n));
    if (r !== null) return r;
  }
  return null;
}
function hk(e) {
  const t = ft(e);
  if (t === null) return null;
  const n = ja(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function bk(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = xi(Di(e, e.direction), t), r = yk(e, t);
  if (r === null) return null;
  const o = Ak([
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
    error: xi(Di(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? ja(o.direction) : null;
}
function yk(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Fi(o, 0, 1), c = Fi(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : Fk(Math.atan2(c, l));
}
function Di(e, t) {
  const n = zc(t), r = {
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
  ], s = o.map((A) => A.x), l = o.map((A) => A.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), g = Math.max(...l);
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
function Ak(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = ja(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function _k(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = zc(e.direction), n = {
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
function Tk(e) {
  for (const t of e) {
    const n = Ni(t, "ray.start"), r = Ni(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Ni(e, t) {
  const n = G(e, t), r = ft(G(n, "x")), a = ft(G(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function qa(e) {
  const t = dk(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: Ek(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: Rk(e.context.item, e.form, e.formLabel, t),
    targets: n.map($k),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function Rk(e, t, n, r) {
  return {
    name: e.name,
    slug: Yn(e, "system.slug") ?? Yn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: Yn(e, "system.element"),
    circle: wk(e),
    form: kk(t),
    formLabel: n
  };
}
function kk(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function Ek(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function $k(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function wk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : Re(t);
}
function Yn(e, t) {
  return Re(foundry.utils.getProperty(e, t));
}
function Re(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function Ck(e) {
  return "document" in e && e.document ? e.document : e;
}
function Sk(e) {
  return Uc(e.shape);
}
function Ik(e) {
  return e.filter(Ga);
}
function Lk(e) {
  return [
    e,
    vk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Ga);
}
function vk(e) {
  return "object" in e && Ga(e.object) ? e.object : null;
}
function Ga(e) {
  return !!(e && typeof e == "object");
}
function Dk(e) {
  for (const t of e) {
    const n = Pi(G(Rn(t), "bounds"));
    if (n) return n;
    const r = Pi(G(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function Pi(e) {
  const t = x(e, "x"), n = x(e, "y"), r = x(e, "width"), a = x(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function x(e, t) {
  return ft(G(e, t));
}
function xk(e) {
  for (const t of e) {
    const n = Nk(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function Nk(e) {
  if (!e || typeof e != "object") return [];
  const t = Mi(Rn(e));
  return t.length > 0 ? t : Mi(e);
}
function Mi(e) {
  const t = G(e, "shapes");
  return Array.isArray(t) ? t.map(Uc).filter((n) => n !== null) : [];
}
function Uc(e) {
  const t = Rn(e) ?? e, n = G(t, "type");
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
function Pk(e) {
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
function Mk(e, t) {
  return Xn(e, "parent.id") ?? Xn(e, "document.parent.id") ?? Xn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Xn(e, t) {
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
  return Re(e);
}
function ft(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ok(e) {
  const t = ft(e);
  return t !== null && t > 0 ? t : null;
}
function zc(e) {
  return e * Math.PI / 180;
}
function Fk(e) {
  return e * 180 / Math.PI;
}
function ja(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Fi(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class Bk {
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
const Uk = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class zk {
  constructor(t = new kn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = qk(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(Uk);
  }
}
function qk(e, t) {
  const n = [], r = Gk(e), a = Bi(r), o = Bi(e);
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
function Gk(e) {
  return jk(e) ? e.document ?? null : e;
}
function jk(e) {
  return "bounds" in e;
}
function Bi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const Vk = 100, Hk = 12;
class Wk {
  constructor(t = new kn()) {
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
      const a = this.foundryAdapter.getGridSize() ?? Vk, o = Zk(n), s = await this.foundryAdapter.placeRegion(
        Kk(t, this.foundryAdapter.getUserColor(), a),
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
        message: Qk(a)
      };
    }
  }
}
function Kk(e, t, n) {
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
    shapes: [Yk(e, n)]
  };
}
function Yk(e, t) {
  const n = Xk(e, t);
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
function Xk(e, t) {
  return {
    length: Ui(e.length, Hk, t),
    width: Ui(e.width, 1, t)
  };
}
function Ui(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function Qk(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function Zk(e) {
  const t = (n) => {
    const r = Jk(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function Jk(e) {
  return eE(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function eE(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class tE {
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
    const n = nE(t);
    rE(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function zi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function nE(e) {
  return Array.from(new Set(e));
}
function rE(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class aE {
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
    return this.resolveFirstRegionCandidate(oE(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(iE(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: Ur(r.region)
    }));
    for (const r of t) {
      if (!Ur(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = lE(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function oE(e) {
  return [
    { source: "document", region: _e(e.document) },
    { source: "document.object", region: _e(e.document.object) },
    { source: "preview", region: _e(e.preview) },
    { source: "preview.document.object", region: _e(e.preview?.document?.object) }
  ];
}
function iE(e) {
  return [
    { source: "input", region: _e(e) },
    { source: "input.object", region: sE(e) ? _e(e.object) : null },
    { source: "input.document.object", region: qc(e) ? _e(e.document?.object) : null }
  ];
}
function _e(e) {
  return Ur(e) ? e : null;
}
function Ur(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Dt(n.x) && Dt(n.y) && Dt(n.width) && Dt(n.height);
}
function qc(e) {
  return "document" in e && "bounds" in e;
}
function sE(e) {
  return !qc(e);
}
function lE(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function Dt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class cE {
  async minimizeForPlacement() {
    const t = [];
    for (const n of mE())
      await uE(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await dE(n);
      }
    };
  }
}
async function uE(e) {
  if (Gc(e) || !_E(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function dE(e) {
  if (Gc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function mE() {
  const e = /* @__PURE__ */ new Set();
  for (const t of fE())
    hE(t) && bE(t) && e.add(t);
  return [...e];
}
function fE() {
  return [
    ...qi(pE()),
    ...qi(gE())
  ];
}
function qi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function pE() {
  return globalThis.ui?.windows ?? null;
}
function gE() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function hE(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function bE(e) {
  const t = yE(e), n = AE(t);
  return n === "Actor" || n === "Item";
}
function yE(e) {
  return e.document ?? e.object ?? null;
}
function AE(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function _E(e) {
  const t = TE(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function TE(e) {
  const t = e.element;
  if (Gi(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Gi(n)) return n;
  }
  return null;
}
function Gi(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function Gc(e) {
  return e.minimized === !0;
}
const RE = "Nenhum alvo encontrado na linha.";
class kE {
  constructor(t = new Wk(), n = new aE(), r = new zk(), a = new tE(), o = new Bk(), s = new cE()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = $E(r), m = mk(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(RE), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = EE(c);
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
function EE(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function $E(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function wE(e) {
  return {
    header: {
      eyebrow: Ts,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: NE(e.ritual)
    },
    forms: e.variantOptions.map((t) => CE(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: LE(e.targetNames, e.variantOptions, e.ritual),
    automation: xE(e.automationStatus ?? "assisted")
  };
}
function CE(e, t) {
  const n = SE(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? IE(t) : "—",
    details: n
  };
}
function SE(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function IE(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function LE(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => vE(a, n))
  };
}
function vE(e, t) {
  const n = e.targeting ?? DE(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function DE(e, t) {
  const n = ht(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function xE(e) {
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
function NE(e) {
  const t = e.system, n = [ME(t?.element), PE(t?.circle)].filter(BE);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function PE(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function ME(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (OE(e)) {
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
      return FE(e);
  }
}
function OE(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function FE(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function BE(e) {
  return typeof e == "string" && e.length > 0;
}
const jc = ["base", "discente", "verdadeiro"];
function Va(e) {
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
  return typeof e == "string" && jc.includes(e);
}
const { ApplicationV2: UE } = foundry.applications.api;
class ct extends UE {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = wE(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: ct.onCast,
      cancel: ct.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new ct(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    GE(a, (o) => {
      this.selectedVariant = o, zr(a, o);
    }), zr(a, this.selectedVariant), jE(a, (o) => {
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
          ${this.model.forms.map(zE).join("")}
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
          ${this.model.targets.forms.map(qE).join("")}
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
    const n = KE(t), r = VE(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function zE(e) {
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
function qE(e) {
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
function GE(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => ji(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), ji(e, a, t));
    });
  const r = Vc(e);
  r && t(r);
}
function ji(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !en(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Vc(e), zr(e, r.value));
}
function Vc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && en(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function zr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function jE(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function VE(e, t, n) {
  const r = WE(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = HE(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function HE(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function WE(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (en(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return en(n) ? n : null;
}
function KE(e) {
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
async function YE(e) {
  return ct.request(e);
}
const Ha = {
  label: "Padrão"
}, XE = {
  label: "Discente",
  extraCost: 2
}, QE = {
  label: "Verdadeiro",
  extraCost: 5
};
class ZE {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new kE();
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
    const a = this.resolveCostPreview(t), o = H$(n), s = G$(
      n,
      t.item,
      a,
      o
    ), l = await YE({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map(($) => $.name),
      cost: a,
      defaultSpendResource: Z$(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = JE(l), u = K$(
      n,
      t.item,
      c.variant,
      o
    ), m = sk(), g = u.label ?? Va(c.variant), A = o$(u), k = ($ = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: g,
      targets: $
    }), R = ($, S = t.targets, B = {}) => {
      this.ritualEvents.emitCastFinished(
        uk({
          ...k(S),
          status: $,
          ...B
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      lk(k())
    );
    const E = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (E.status === "cancelled")
      return R("cancelled", t.targets, { reason: E.reason }), { status: "cancelled" };
    if (E.status === "failed")
      return R("failed", t.targets, {
        reason: E.reason,
        message: E.message
      }), {
        status: "failed",
        reason: E.reason,
        message: E.message
      };
    const b = e$(
      t,
      E.targets
    );
    E.areaSnapshot && this.ritualEvents.emitAreaResolved(
      ck({
        ...k(E.targets),
        area: E.areaSnapshot
      })
    );
    const I = Us();
    let _ = null;
    if (I) {
      const $ = await n$(
        this.resources,
        b.actor,
        c,
        u,
        a
      );
      if (!$.ok)
        return R("failed", b.targets, {
          reason: $.reason,
          message: $.message
        }), {
          status: "failed",
          reason: $.reason,
          message: $.message
        };
      try {
        const S = await ST(
          b.actor
        );
        _ = i$(
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
    const F = t$(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !I
      }
    );
    if (F.steps.length === 0) {
      const $ = W$(
        b,
        c
      ), S = Hi(
        n,
        b
      ), B = Vi(
        b.actor,
        _,
        u,
        a
      ), H = Wi(
        n,
        c,
        u,
        a,
        $,
        b,
        _
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
      const kt = [
        ...B,
        ...S.actions
      ];
      return kt.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: $,
        itemUseContext: b,
        actions: kt,
        summaryLines: H
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: $,
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
    const V = D.value.context, L = m$(
      n,
      b,
      V,
      A
    ), z = Hi(
      n,
      b
    ), Rt = Vi(
      b.actor,
      _,
      u,
      a
    ), me = Wi(
      n,
      c,
      u,
      a,
      V,
      b,
      _
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
      ...Rt,
      ...L.actions,
      ...z.actions
    ];
    return C.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: V,
      itemUseContext: b,
      summaryLines: me
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: V,
      itemUseContext: b,
      actions: C,
      summaryLines: me
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
function JE(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function e$(e, t) {
  return {
    ...e,
    targets: t
  };
}
function t$(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Ka(l) && (!a.includeCostSteps || !s))
      continue;
    const c = r$(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && J$(n.extraCost) && o.push({
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
async function n$(e, t, n, r, a) {
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
function r$(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = a$(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function a$(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function o$(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function i$(e, t, n) {
  const a = s$(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function s$(e, t) {
  const n = Ye(e, t);
  return n ? rk(n.amount) : null;
}
function Vi(e, t, n, r) {
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
function Hi(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = Wa(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = pl(o);
      n.push(
        l$(
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
function l$(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? d$(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: c$(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: u$(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function c$(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function u$(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function d$(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function m$(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || f$(s, r)) continue;
    const l = Xt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = Wa(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (p$(s)) {
        g$(
          o,
          u,
          h$(s, n, l.value)
        );
        continue;
      }
      a.push(y$(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...b$(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function f$(e, t) {
  const n = Hc(e.amountFrom);
  return n !== null && t.has(n);
}
function p$(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function g$(e, t, n) {
  const r = R$(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function h$(e, t, n) {
  const r = Hc(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function b$(e, t, n, r) {
  const a = w$(e), o = a.length > 1 ? I$() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const g = C$(u.amount, s);
        return {
          id: A$(u, s, m),
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
      label: _$(c, s, a.length > 1),
      executedLabel: T$(
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
function y$(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = $$(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: k$(e, r, n),
    executedLabel: E$(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function A$(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function _$(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function T$(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function R$(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Hc(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function k$(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function E$(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function $$(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function w$(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function C$(e, t) {
  const n = e * t.multiplier, r = S$(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function S$(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function I$() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Wa(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Wi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${Va(t.variant)}`,
    x$(t, n, r),
    ...D$(s),
    ...Object.values(a.rolls).flatMap(N$),
    ...L$(e, o),
    ...P$(e.resistance),
    ...z$(n)
  ];
}
function L$(e, t) {
  return v$(e) ? Wa("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function v$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function D$(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function x$(e, t, n) {
  const r = Ye(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function N$(e) {
  const n = [`${q$(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = M$(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${ak(e.damageType)}`), n;
}
function P$(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function M$(e) {
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
    const s = O$(o);
    s && (U$(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function O$(e) {
  const t = F$(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : B$(e);
}
function F$(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function B$(e) {
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
function U$(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function z$(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function q$(e) {
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
function G$(e, t, n, r) {
  return jc.map((a) => {
    const o = Wc(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? Va(a),
      enabled: s,
      details: o ? j$(o, n) : [],
      finalCostText: o ? V$(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function j$(e, t, n) {
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
function V$(e, t) {
  const n = Ye(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function H$(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Ka);
}
function W$(e, t) {
  return Dc({
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
function K$(e, t, n, r) {
  return Wc(e, t, n, r) ?? Ha;
}
function Wc(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? X$(t, n) ? Y$(n) : null : n === "base" ? Ha : null);
}
function Y$(e) {
  switch (e) {
    case "base":
      return Ha;
    case "discente":
      return XE;
    case "verdadeiro":
      return QE;
  }
}
function X$(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Q$(foundry.utils.getProperty(e, n));
}
function Q$(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Z$(e) {
  return e.steps.some(Ka);
}
function Ka(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function J$(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Kc = "itemUsePrompts", Yc = "chatCard", En = "data-paranormal-toolkit-prompt-id", $n = "data-paranormal-toolkit-pending-id", Ya = "data-paranormal-toolkit-executed-label", qr = "data-paranormal-toolkit-choice-group", Xc = "data-paranormal-toolkit-skipped-label", tn = "data-paranormal-toolkit-action-section", Ki = "data-paranormal-toolkit-detail-key", Yi = "data-paranormal-toolkit-roll-card", Xa = "data-paranormal-toolkit-roll-detail-toggle", Qc = "data-paranormal-toolkit-roll-detail-id", Zc = "data-paranormal-toolkit-resistance-roll-button", Jc = "data-paranormal-toolkit-resistance-skill", eu = "data-paranormal-toolkit-resistance-skill-label", tu = "data-paranormal-toolkit-resistance-target-actor-id", nu = "data-paranormal-toolkit-resistance-target-name", ru = "data-paranormal-toolkit-resistance-roll-result", Xi = "data-paranormal-toolkit-system-card-replaced", ew = `[${$n}]`, tw = `[${Xa}]`, nw = `[${Zc}]`, Gr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, rw = `${h}__actions`, Qi = `${h}__details`, au = `${h}__summary`, aw = `${h}__title`, ou = `${h}__button--executed`, xt = `${h}__roll-card`, ow = "data-paranormal-toolkit-roll-card-target-mode", iw = "data-paranormal-toolkit-roll-card-target-names", sw = "data-paranormal-toolkit-roll-card-resistance", lw = "data-paranormal-toolkit-roll-card-resistance-skill", cw = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Zi = !1, jr = null;
const X = /* @__PURE__ */ new Map(), uw = [0, 100, 500, 1500, 3e3], dw = 3e4, mw = [0, 100, 500, 1500, 3e3];
function fw(e) {
  if (jr = e, Zi) {
    es(e);
    return;
  }
  const t = (n, r) => {
    su(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Zi = !0, es(e);
}
async function Ji(e) {
  const t = iu(e);
  X.set(e.pendingId, t), await Ja(t) || Au(t), lu(e.pendingId);
}
async function pw(e) {
  const t = iu({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", X.set(e.pendingId, t), await Ja(t) || Au(t), lu(e.pendingId);
}
async function Qn(e, t) {
  const n = X.get(e);
  X.delete(e), n && await yC(n, t);
}
function Qa(e) {
  const t = $u();
  for (const n of t) {
    const r = re(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function gw(e, t) {
  const n = Qa(e);
  if (!n) return;
  const r = re(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Xe(n.message, r));
}
async function hw(e, t, n) {
  if (!t) return;
  const r = Qa(e);
  if (!r) return;
  const a = re(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Xe(r.message, a);
}
function iu(e) {
  const t = de(e.context.message), n = e.context.targets.find((s) => Kr(s)), r = n ? Kr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: jw(e.context),
    executed: !1
  };
}
function su(e, t, n) {
  bC();
  const r = Cn(t);
  if (!r) return;
  const a = pC(e, r);
  a.length > 0 && nn(r);
  for (const o of a)
    Vr(r, o);
  fu(r, n), Hr(r), Wr(r);
}
function es(e) {
  for (const t of mw)
    globalThis.setTimeout(() => {
      bw(e);
    }, t);
}
function bw(e) {
  for (const t of yw()) {
    const n = wn(t);
    Aw(n) && su(n, t, e);
  }
}
function yw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Aw(e) {
  return e ? eo(e) ? !0 : _C(e).length > 0 : !1;
}
function lu(e) {
  const t = X.get(e);
  if (!t) return;
  const n = t.messageId ? gC(t.messageId) : null;
  if (n) {
    os(n, t), nn(n), Vr(n, t), ts(n), Hr(n), Wr(n);
    return;
  }
  if (t.messageId) {
    Xr(t);
    return;
  }
  const r = hC(t);
  if (r) {
    os(r, t), nn(r), Vr(r, t), ts(r), Hr(r), Wr(r);
    return;
  }
  Xr(t);
}
function ts(e) {
  jr && fu(e, jr);
}
function nn(e) {
  const t = _w();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = mu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Xi) === "true") return;
  const r = n.querySelector(`.${Gr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Xi, "true");
}
function _w() {
  try {
    return Bs() === "replace";
  } catch {
    return !1;
  }
}
function Vr(e, t) {
  if (nn(e), e.querySelector(`[${En}="${Qe(t.pendingId)}"]`)) return;
  const n = Rw(e, t);
  Ew(n, t);
  const r = Uw(t);
  if (Tw(r)) return;
  Bw(n, r).append(Gw(t));
}
function Tw(e) {
  return uu(e.id) && !Ee();
}
function cu(e) {
  const n = e.closest(`[${tn}]`)?.getAttribute(tn) ?? null;
  return uu(n) && !Ee();
}
function uu(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Rw(e, t) {
  const n = e.querySelector(`.${Gr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Gr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(aw), s.textContent = kw(t);
  const l = document.createElement("span");
  return l.classList.add(au), l.textContent = t.summary, a.append(o, s, l), r.append(a), Hw(e).append(r), r;
}
function kw(e) {
  const t = O(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Ew(e, t) {
  const n = t.summaryLines ?? [], r = bu(n, t);
  if (r) {
    $w(e, r, t);
    return;
  }
  zw(e, n);
}
function $w(e, t, n) {
  if (e.querySelector(`[${Yi}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(
    xt,
    `${xt}--${t.intent}`,
    `${xt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && r.classList.add(`${xt}--multi-target`), r.setAttribute(Yi, "true"), r.setAttribute(ow, t.targetMode), r.setAttribute(iw, JSON.stringify(t.targetNames)), Nw(r, t), t.castingCheck && ns(r, Cw(t.castingCheck), n.pendingId, "casting"), ww(t) && ns(r, Sw(t), n.pendingId, "effect"), xw(r, t), Pw(r, t, n), Fw(r, t), e.append(r);
}
function ww(e) {
  return e.intent !== "casting";
}
function Cw(e) {
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
function Sw(e) {
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
function ns(e, t, n, r) {
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
  Iw(a, t), Ow(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function Iw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = Lw(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function Lw(e, t) {
  const n = vw(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of Dw(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function vw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Dw(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? rs(e, "highest") : n.includes("kl") ? rs(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function rs(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function xw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(FC);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function Nw(e, t) {
  t.resistance && (e.setAttribute(sw, t.resistance), t.resistanceSkill && e.setAttribute(lw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(cw, t.resistanceSkillLabel));
}
function Pw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Mw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(du(t.resistanceRollResult)), e.append(r);
}
function Mw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Ce())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(En, t.pendingId), n.setAttribute(Zc, "true"), n.setAttribute(Jc, e.resistanceSkill), n.setAttribute(eu, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(tu, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(nu, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ru, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function du(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = gu(e), t;
}
function Ow(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Xa, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Qc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const g = document.createElement("dd");
    g.textContent = u.value, c.append(m, g);
  }
  e.append(l, c);
}
function Fw(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function Bw(e, t) {
  const n = `[${tn}="${Qe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(rw), a.setAttribute(tn, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Uw(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = bu(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function zw(e, t) {
  if (t.length === 0) return;
  const n = qw(e);
  for (const r of t) {
    const a = BC(r);
    if (n.querySelector(`[${Ki}="${Qe(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Ki, a), n.append(o);
  }
}
function qw(e) {
  const t = e.querySelector(`.${Qi}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Qi), e.append(n), n;
}
function Gw(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(En, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(ou), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute($n, e.pendingId), t.setAttribute(Ya, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(qr, e.choiceGroupId), t.setAttribute(Xc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function jw(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Vw(e);
  return `${t} → ${n}`;
}
function Vw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Hw(e) {
  return mu(e) ?? e;
}
function mu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function fu(e, t) {
  const n = Cn(e);
  if (!n) return;
  const r = n.querySelectorAll(ew);
  for (const a of r) {
    if (cu(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      iC(a, t);
    }));
  }
}
function Hr(e) {
  const t = Cn(e);
  if (!t) return;
  const n = t.querySelectorAll(tw);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Ww(t, r);
    }));
}
function Wr(e) {
  const t = Cn(e);
  if (!t) return;
  const n = t.querySelectorAll(nw);
  for (const r of n) {
    if (!Ce()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Kw(t, r);
    }));
  }
}
function Ww(e, t) {
  const n = t.getAttribute(Xa);
  if (!n) return;
  const r = e.querySelector(`[${Qc}="${Qe(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Kw(e, t) {
  if (!Ce()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(En), r = t.getAttribute(Jc), a = t.getAttribute(eu) ?? (r ? ke(r) : "Resistência");
  if (!n || !r) return;
  const o = Qw(e, n), s = Zw(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Up(s, r);
    await rC(c.roll);
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
    Yw(t, u), Xw(t, u), aC(n, u), await oC(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Yw(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ru, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Xw(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? du(t);
  if (r) {
    r.textContent = gu(t);
    return;
  }
  n.append(a);
}
function Qw(e, t) {
  const n = X.get(t);
  if (n) return n;
  const r = wn(e);
  return re(r)[t] ?? null;
}
function Zw(e, t) {
  const n = e?.resistanceTargetActor;
  if (ee(n)) return n;
  const a = e?.context?.targets.map(Kr).find(ee) ?? null;
  if (a) return a;
  const o = t.getAttribute(tu) ?? e?.resistanceTargetActorId ?? null, s = o ? eC(o) : null;
  return s || tC(
    t.getAttribute(nu) ?? e?.resistanceTargetName ?? Jw(t)
  );
}
function Jw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${au}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Kr(e) {
  const t = e.actor;
  if (ee(t)) return t;
  const n = e.token, r = pt(n);
  if (r) return r;
  const a = e.document;
  return pt(a);
}
function pt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const n = e.document?.actor;
  return ee(n) ? n : null;
}
function eC(e) {
  const n = game.actors?.get?.(e);
  return ee(n) ? n : pu().map((o) => pt(o)).find((o) => o?.id === e) ?? null;
}
function tC(e) {
  const t = Oe(e);
  if (!t) return null;
  const n = pu().filter((o) => Oe(nC(o)) === t).map((o) => pt(o)).find(ee) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => ee(o) && Oe(o.name) === t);
  return ee(a) ? a : null;
}
function pu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function nC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : pt(e)?.name ?? null;
}
function Oe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function gu(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function rC(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function aC(e, t) {
  const n = X.get(e);
  n && (n.resistanceRollResult = t);
}
async function oC(e, t, n) {
  const r = wn(e);
  if (r)
    try {
      const a = re(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Xe(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function wn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return ne(r?.get?.(n));
}
async function iC(e, t) {
  if (cu(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute($n);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    hu(e, e.getAttribute(Ya) ?? "✓ Automação aplicada"), sC(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function hu(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(ou), e.removeAttribute($n), e.removeAttribute(Ya);
}
function sC(e) {
  const t = e.getAttribute(qr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${qr}="${Qe(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Xc) ?? "✓ Outra opção escolhida";
    hu(a, o);
  }
}
function bu(e, t) {
  const n = e.map(Za).filter(MC), r = n.find((E) => E.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = O(e, "Forma"), o = O(e, "Custo"), s = O(e, "Dados") ?? O(e, `Dados (${r.label})`), l = O(e, "Tipo"), c = O(e, "Resistência"), u = O(e, "Resistência Perícia"), m = O(e, "Resistência Rótulo") ?? (u ? ke(u) : null), g = yu(e, "Observação"), A = e.filter((E) => fC(E, r)), k = dC(e), R = lC(t);
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
    details: A,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function lC(e) {
  const t = cC(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function cC(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && uC(n) !== "nenhum alvo") : [];
}
function uC(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function dC(e) {
  const t = e.map(Za).find((o) => o?.intent === "casting") ?? null, n = O(e, "Conjuração DT"), r = O(e, "Conjuração Resultado");
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
function Za(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: mC(n)
  } : null;
}
function mC(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function O(e, t) {
  return yu(e, t)[0] ?? null;
}
function yu(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function fC(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Za(e) ? !1 : e.trim().length > 0;
}
function pC(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of X.values())
    Yr(r, e, t) && n.set(r.pendingId, r);
  for (const r of AC(e))
    Yr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Yr(e, t, n) {
  const r = de(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !as(n, "itemId", e.itemId) ? !1 : !e.actorId || as(n, "actorId", e.actorId);
}
function as(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${UC(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function gC(e) {
  const t = Qe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function hC(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Yr(e, null, t))
      return t;
  return null;
}
function bC() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of X.entries())
    e - r.createdAt > t && X.delete(n);
}
async function os(e, t) {
  const n = wn(e);
  if (!n) return !1;
  try {
    const r = re(n);
    return r[t.pendingId] = to(t, de(n)), await Xe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Ja(e) {
  const t = Ru(e);
  if (!t) return !1;
  try {
    const n = re(t);
    return n[e.pendingId] = to(e, de(t)), await Xe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Au(e) {
  for (const t of uw)
    globalThis.setTimeout(() => {
      Xr(e);
    }, t);
}
async function Xr(e) {
  const t = Ru(e);
  if (eo(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await Ja(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function yC(e, t) {
  const n = Tu(e.context.message);
  if (n)
    try {
      const r = re(n), a = r[e.pendingId] ?? to(e, de(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Xe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function AC(e) {
  return Object.values(re(ne(e))).filter(_t);
}
function re(e) {
  if (!e) return {};
  const t = {}, n = eo(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(_u(e)))
    t[r] ??= a;
  return t;
}
function _C(e) {
  return Object.values(_u(ne(e))).filter(_t);
}
function _u(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Kc);
  if (!je(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    _t(a) && (n[r] = a);
  return n;
}
async function Xe(e, t) {
  typeof e.setFlag == "function" && (await RC(e, t), await TC(e, t));
}
async function TC(e, t) {
  await Promise.resolve(e.setFlag?.(d, Kc, t));
}
function eo(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Yc);
  return NC(t) ? t : null;
}
async function RC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(_t).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? de(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: kC(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Yc, a));
}
function kC(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function to(e, t) {
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
function Tu(e) {
  const t = ne(e);
  if (t?.setFlag)
    return t;
  const n = EC(e);
  if (n?.setFlag)
    return n;
  const r = de(e);
  if (!r) return null;
  const a = game.messages;
  return ne(a?.get?.(r));
}
function EC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ne).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Ru(e) {
  const t = Tu(e.context.message);
  if (t) return t;
  const n = e.messageId ? $C(e.messageId) : null;
  if (n) return n;
  const r = $u().slice().reverse();
  return r.find((a) => wC(a, e)) ?? r.find((a) => CC(a, e)) ?? null;
}
function $C(e) {
  const t = game.messages;
  return ne(t?.get?.(e));
}
function wC(e, t) {
  const n = de(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!ku(e, t)) return !1;
  const a = Eu(e);
  return !t.actorId || !a || a === t.actorId;
}
function CC(e, t) {
  if (!IC(e, t)) return !1;
  const n = Eu(e);
  return t.actorId && n === t.actorId ? !0 : ku(e, t);
}
function ku(e, t) {
  const n = Oe(SC(e));
  if (!n) return !1;
  const r = Oe(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Oe(t.itemId);
  return !!(a && n.includes(a));
}
function SC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Eu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function IC(e, t) {
  const n = LC(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= dw;
}
function LC(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ne(e) {
  return e && typeof e == "object" ? e : null;
}
function _t(e) {
  return je(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && q(e.messageId) && q(e.itemId) && q(e.actorId) && q(e.itemName) && be(e.resistanceTargetActorId) && be(e.resistanceTargetName) && PC(e.resistanceRollResult) && vC(e.actionPayload) && Zn(e.title) && Zn(e.buttonLabel) && Zn(e.executedLabel) && be(e.choiceGroupId) && be(e.skippedLabel) && be(e.actionSectionId) && be(e.actionSectionTitle) && OC(e.summaryLines) : !1;
}
function vC(e) {
  return e == null ? !0 : je(e) ? e.kind === "resource-operation" && q(e.actorId) && q(e.actorUuid) && typeof e.actorName == "string" && DC(e.resource) && xC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function DC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function xC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function NC(e) {
  return je(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && q(e.messageId) && je(e.source) && q(e.source.actorId) && q(e.source.actorName) && q(e.source.itemId) && q(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(_t) : !1;
}
function PC(e) {
  return e == null ? !0 : je(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && be(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function MC(e) {
  return e !== null;
}
function je(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function q(e) {
  return e === null || typeof e == "string";
}
function Zn(e) {
  return e === void 0 || typeof e == "string";
}
function be(e) {
  return e == null || typeof e == "string";
}
function OC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function FC(e) {
  return typeof e == "string" && e.length > 0;
}
function $u() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(ne).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(ne).filter((r) => r !== null) : [];
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
function de(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function BC(e) {
  return e.trim().toLowerCase();
}
function UC(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Qe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const is = 1e3;
class zC {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new ZE(
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
      settings: lr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = lr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = ea(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && KC(t.item) && n.executionMode === "ask") {
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
    if (await Ii(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: tr(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = GC(
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
      return this.pendingExecutions.delete(t), await Qn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Qn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Qa(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = QC(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Qt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await gw(t), await hw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (fw(
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
    if (await Ii(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: tr(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      YC(t.item),
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
      if (!Ee())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (WC(n, a.value), await Ml(a.value), {
        ok: !0,
        executedLabel: qC(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!Ee())
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
    const n = Jn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && Jn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Qn(
        a,
        ss(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = nr();
    await pw({
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
      const l = nr();
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
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: XC(s)
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
    const r = nr();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ji({
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
    const n = Date.now(), r = ls(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > is && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= is;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ls(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = tr(
      t,
      n,
      r,
      a
    );
  }
}
function qC(e) {
  return Ol({ inputAmount: e.totalRawDamage });
}
function GC(e, t) {
  if (t.resistance || !jC(t))
    return t;
  const n = Fc(e);
  return n ? { ...t, resistance: n } : t;
}
function jC(e) {
  return VC(e) && !HC(e);
}
function VC(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function HC(e) {
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
function WC(e, t) {
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
function KC(e) {
  return e.type === "ritual";
}
function YC(e) {
  return jR(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function XC(e) {
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
function QC(e) {
  const t = e.actorUuid ? ZC(e.actorUuid) : null;
  if (Ve(t)) return t;
  const n = e.actorId ? JC(e.actorId) : null;
  return n || eS(e.actorName);
}
function ZC(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function JC(e) {
  const n = game.actors?.get?.(e);
  if (Ve(n)) return n;
  for (const r of wu()) {
    const a = no(r);
    if (a?.id === e) return a;
  }
  return null;
}
function eS(e) {
  const t = er(e);
  if (!t) return null;
  for (const a of wu()) {
    const o = tS(a);
    if (er(o) === t) {
      const s = no(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Ve(a) && er(a.name) === t
  );
  return Ve(r) ? r : null;
}
function wu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function tS(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : no(e)?.name ?? null;
}
function no(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ve(t)) return t;
  const n = e.document?.actor;
  return Ve(n) ? n : null;
}
function er(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ve(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function tr(e, t, n, r) {
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
function ls(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function nr() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class nS {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = bt(t);
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
class rS {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = bt(t).map((l) => this.analyzeRitual(l)), r = n.filter(Nt("upToDate")), a = n.filter(Nt("available")), o = n.filter(Nt("outdated")), s = n.filter(Nt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = aS(t);
    return n ? r ? r.source.type !== "preset" ? et({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? et({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : et({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: oS(r, n.preset)
    }) : et({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : et({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function et(e) {
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
function aS(e) {
  const t = e.getFlag(d, "automation");
  return ta(t) ? t : null;
}
function oS(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Nt(e) {
  return (t) => t.status === e;
}
class iS {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = ra(t.transaction);
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
    const n = Pt(t.actorName), r = Pt(t.resource), a = Pt(sS(t)), o = Pt(lS(t));
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
function sS(e) {
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
function lS(e) {
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
function cS() {
  const e = new yT(), t = new fR(e), n = new ml(new dl()), r = new fl(new ya()), a = new pR(new Cc()), o = new TT(), s = new MT(o), l = new zT(e), c = new GT(), u = c.registerMany(
    Ed()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new qT(), g = new BT(), A = Tl(), k = new hl(A), R = new rS(
    c
  ), E = new nS(
    R,
    m,
    g
  ), b = new yR(), I = new iS(b), _ = new bR(), F = new mR(), D = new uR(
    t,
    s,
    I,
    _
  ), V = new hR(D, _), L = new zC(
    V,
    t,
    s,
    n,
    k,
    b,
    F
  );
  return L.addStrategy(
    new Ks(
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
    conditionRegistry: A,
    conditions: k,
    debugOutput: b,
    chatMessages: I,
    workflowHooks: _,
    ritualEvents: F,
    automation: D,
    workflow: V,
    itemUseIntegration: L,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: E
  };
}
const { ApplicationV2: uS } = foundry.applications.api;
class rn extends uS {
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
      apply: rn.onApply,
      cancel: rn.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${Z(Ts)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${Z(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${rr("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${rr("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${rr("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function rr(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${Z(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? dS(n) : fS(t)}
    </section>
  `;
}
function dS(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(mS).join("")}</ol>`;
}
function mS(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${Z(e.appliedPresetId)} v${Z(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${Z(e.itemName)}</strong>
        <span>${Z(e.reason)}</span>
        ${r}
      </div>
      <em>${Z(n)}</em>
    </li>
  `;
}
function fS(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${Z({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function Z(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const an = `${d}.manageRitualPresets`, cs = `__${d}_ritualPresetHeaderControlRegistered`, pS = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function gS(e) {
  const t = globalThis;
  if (!t[cs]) {
    for (const n of pS)
      Hooks.on(n, (r, a) => {
        hS(r, a, e);
      });
    t[cs] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function hS(e, t, n) {
  Array.isArray(t) && yS(e) && (bS(e, n), !t.some((r) => r.action === an) && t.push({
    action: an,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Cu(e, n);
    }
  }));
}
function bS(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[an] && (e.options.actions[an] = (n) => {
    n.preventDefault(), n.stopPropagation(), Cu(e, t);
  }));
}
function yS(e) {
  if (!game.user?.isGM) return !1;
  const t = Su(e);
  return t ? t.type === "agent" && bt(t).length > 0 : !1;
}
function Cu(e, t) {
  const n = Su(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new rn(n, t).render({ force: !0 });
}
function Su(e) {
  return us(e.actor) ? e.actor : us(e.document) ? e.document : null;
}
function us(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Qr = "data-paranormal-toolkit-stylesheet";
function AS(e) {
  const t = ES(e), n = _S(t), r = RS(n), a = TS(n, t);
  if (a)
    return a.href = r, a.setAttribute(Qr, t), a;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = r, o.setAttribute(Qr, t), document.head.append(o), o;
}
function _S(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, r = n.getRoute;
  return typeof r == "function" ? r.call(n, t) : t;
}
function TS(e, t) {
  const n = ds(e);
  for (const r of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (r.getAttribute(Qr) === t || ds(r.href) === n)
      return r;
  return null;
}
function RS(e) {
  const t = kS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function kS() {
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
function ES(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Ae(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const r = document.createElement("span");
  return r.textContent = e, n.append(r, t), n;
}
function Zr(e, t, n) {
  const r = document.createElement("input");
  return r.type = "text", r.value = e, r.placeholder = t, r.disabled = !n, r;
}
function qt(e, t, n) {
  const r = document.createElement("button");
  r.type = "button", n && r.classList.add(n);
  const a = document.createElement("i");
  a.className = t;
  const o = document.createElement("span");
  return o.textContent = e, r.append(a, o), r;
}
function Iu(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const r = document.createElement("i");
  return r.className = t, n.append(r), n;
}
function tt(e, t, n = !1) {
  const r = document.createElement("option");
  return r.value = e, r.textContent = t, r.selected = n, r;
}
function $S(e) {
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
  const g = Iu("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !r, g.addEventListener("click", o), l.append(c, g);
  const A = document.createElement("div");
  A.classList.add(`${d}-ability-roll-config__fields`);
  const k = Zr(
    t.label,
    "Ex.: Dano adicional",
    r
  );
  k.addEventListener("input", () => {
    t.label = k.value, a();
  }), A.append(Ae("Nome da rolagem", k));
  const R = document.createElement("select");
  R.disabled = !r;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      tt(
        C,
        jm(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = IS(R.value), Rt(), a();
  }), A.append(Ae("Tipo da rolagem", R));
  const E = document.createElement("div");
  E.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), A.append(E);
  const b = document.createElement("section");
  b.classList.add(
    `${d}-ability-roll-config__formula-section`
  );
  const I = document.createElement("div");
  I.classList.add(
    `${d}-ability-roll-config__formula-header`
  );
  const _ = document.createElement("strong");
  _.textContent = "Fórmula";
  const F = document.createElement("label");
  F.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const D = document.createElement("input");
  D.type = "checkbox", D.checked = t.formula.mode === "nex", D.disabled = !r;
  const V = document.createElement("span");
  V.textContent = "Varia conforme o NEX", F.append(D, V), I.append(_, F);
  const L = document.createElement("div");
  return L.classList.add(`${d}-ability-roll-config__formula`), b.append(I, L), D.addEventListener("change", () => {
    t.formula = D.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: CS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, z(), me(), a();
  }), s.append(l, A, b), z(), Rt(), me(), s;
  function z() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function Rt() {
    E.replaceChildren();
    const C = t.intent === "damage";
    if (A.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), E.hidden = !C, !C) return;
    const $ = document.createElement("select");
    $.disabled = !r, $.append(tt("", "—", !t.damageType));
    for (const { value: S, label: B } of Xs)
      $.append(tt(S, B, t.damageType === S));
    $.addEventListener("change", () => {
      t.damageType = $.value || null, a();
    }), E.append(Ae("Tipo de dano", $));
  }
  function me() {
    if (L.replaceChildren(), t.formula.mode === "fixed") {
      const H = Zr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        r
      );
      H.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = H.value, a());
      }), L.append(Ae("Expressão", H));
      return;
    }
    const C = t.formula, $ = document.createElement("select");
    $.disabled = !r, $.append(
      tt(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        C.resolution === "highest-unlocked"
      ),
      tt(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        C.resolution === "choose-unlocked"
      )
    ), $.addEventListener("change", () => {
      C.resolution = LS($.value), a();
    }), L.append(Ae("Comportamento", $));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((H, kt) => {
      S.append(
        wS({
          step: H,
          editable: r,
          onChange: a,
          onRemove: () => {
            C.steps.splice(kt, 1), me(), a();
          }
        })
      );
    }), L.append(S);
    const B = qt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    B.disabled = !r || C.steps.length >= fr, B.addEventListener("click", () => {
      C.steps.length >= fr || (C.steps.push({
        minNex: SS(
          C.steps.map((H) => H.minNex)
        ),
        formula: ""
      }), me(), a());
    }), L.append(B);
  }
}
function wS(e) {
  const { step: t, editable: n, onChange: r, onRemove: a } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = vS(Number(s.value)), s.value = String(t.minNex), r();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = Zr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, r();
  });
  const m = Iu("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", a), o.append(
    Ae("NEX mínimo", l),
    Ae("Fórmula", u),
    m
  ), o;
}
function CS(e) {
  const t = Mm(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function SS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function IS(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function LS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function vS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function DS(e) {
  let t = ar(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const r = xS(t), a = document.createElement("p");
  a.classList.add(`${d}-ability-roll-config__hint`), a.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = qt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= mr || (t.rolls.push(Zs(t.rolls.length + 1)), A(), I("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = qt("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = qt("Limpar", "fa-solid fa-eraser");
  l.append(c, u);
  const m = document.createElement("footer");
  m.classList.add(`${d}-ability-roll-config__footer`), m.append(s, l);
  const g = document.createElement("p");
  return g.classList.add(`${d}-ability-roll-config__status`), g.textContent = e.editable ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", n.append(r, a, o, m, g), c.addEventListener("click", () => {
    e.editable && k();
  }), u.addEventListener("click", () => {
    e.editable && R();
  }), A(), n;
  function A() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const _ = document.createElement("p");
      _.classList.add(`${d}-ability-roll-config__empty`), _.textContent = "Nenhuma rolagem configurada.", o.append(_);
    } else
      t.rolls.forEach((_, F) => {
        o.append(
          $S({
            roll: _,
            index: F,
            editable: e.editable,
            onChange: () => {
              Jr(r, t), I("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(F, 1), A(), I("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    Jr(r, t), b(!1);
  }
  async function k() {
    E(!0), I("Salvando configuração...");
    try {
      const _ = ua(t);
      if (!_) throw new Error("Configuração inválida.");
      t = ar(await e.onSave(_)), A(), I("Configuração salva.");
    } catch (_) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        _
      ), I("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      E(!1);
    }
  }
  async function R() {
    E(!0), I("Limpando configuração...");
    try {
      t = ar(await e.onClear()), A(), I("Configuração removida.");
    } catch (_) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        _
      ), I("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      E(!1);
    }
  }
  function E(_) {
    n.classList.toggle(`${d}-ability-roll-config--busy`, _), b(_);
  }
  function b(_) {
    c.disabled = _ || !e.editable, u.disabled = _ || !e.editable, s.disabled = _ || !e.editable || t.rolls.length >= mr;
  }
  function I(_) {
    g.textContent = _;
  }
}
function xS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const r = document.createElement("strong");
  r.textContent = "Paranormal Toolkit";
  const a = document.createElement("span");
  a.textContent = "Fórmulas de rolagem", n.append(r, a);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), Jr(t, e), t;
}
function Jr(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = Vm(t) ? "Configurada" : "Rascunho");
}
function ar(e) {
  return JSON.parse(JSON.stringify(e));
}
const NS = "[data-paranormal-toolkit-ability-roll-config]", ms = `__${d}_abilityRollConfigBlockRegistered`, PS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function MS() {
  const e = globalThis;
  if (!e[ms]) {
    AS("styles/ability-roll-config.css");
    for (const t of PS)
      Hooks.on(t, (...n) => {
        OS(n[0], n[1]);
      });
    e[ms] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function OS(e, t) {
  const n = BS(e);
  if (!n || n.type !== "ability") return;
  const r = zS(t);
  if (!r) return;
  const a = r.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!a) return;
  for (const s of Array.from(
    a.querySelectorAll(NS)
  ))
    s.remove();
  const o = DS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Fm(n),
    editable: US(n),
    onSave: async (s) => {
      const l = await Bm(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Um(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), Qs())
  });
  FS(a, o);
}
function FS(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function BS(e) {
  return fs(e.item) ? e.item : fs(e.document) ? e.document : null;
}
function US(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function zS(e) {
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
const Lu = "data-paranormal-toolkit-ritual-roll-config", Tt = "data-paranormal-toolkit-ritual-roll-field", $e = "data-paranormal-toolkit-ritual-roll-action", ps = `__${d}_ritualRollConfigBlockRegistered`, qS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], GS = [
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
function jS() {
  const e = globalThis;
  if (!e[ps]) {
    VS();
    for (const t of qS)
      Hooks.on(t, (...n) => {
        HS(n[0], n[1]);
      });
    e[ps] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function VS() {
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
function HS(e, t) {
  const n = iI(e);
  if (!n || n.type !== "ritual") return;
  const r = cI(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  KS(a);
  const o = Du(n), s = Oc(n), l = sI(n), c = YS(n, s, o, l);
  tI(c, n, o, l), WS(a, c), ro(c);
}
function WS(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function KS(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Lu}]`)))
    t.remove();
}
function YS(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Lu, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(gs("strong", "Paranormal Toolkit")), s.append(gs("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Nu(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(XS(t, r)), u.append(QS(t, r)), u.append(ZS(t, r)), a.append(u), a.append(JS(t, n, r)), a.append(eI(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function XS(e, t) {
  const n = Sn("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Tt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = GR(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function QS(e, t) {
  const n = Sn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Tt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of GS) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function ZS(e, t) {
  const n = Sn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Tt, "utilityLabel"), n.append(r), n;
}
function JS(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(or("base", "Padrão", e.forms.base.formula, !0, n)), o.append(or("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(or("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function or(e, t, n, r, a) {
  const o = Sn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(Tt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function eI(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute($e, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute($e, "clear"), t.append(n, r), t;
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
function tI(e, t, n, r) {
  Ze(e, "intent")?.addEventListener("change", () => ro(e)), ys(e, "system.studentForm")?.addEventListener("change", () => hs(e, t)), ys(e, "system.trueForm")?.addEventListener("change", () => hs(e, t)), e.querySelector(`[${$e}="save"]`)?.addEventListener("click", () => {
    r && nI(e, t, n);
  }), e.querySelector(`[${$e}="clear"]`)?.addEventListener("click", () => {
    r && rI(e, t);
  });
}
async function nI(e, t, n) {
  const r = e.querySelector(`[${$e}="save"]`);
  r?.setAttribute("disabled", "true"), Fe(e, "Salvando configuração...");
  try {
    const a = aI(e, n);
    await zR(t, a), vu(e, a), Fe(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Fe(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function rI(e, t) {
  const n = e.querySelector(`[${$e}="clear"]`);
  n?.setAttribute("disabled", "true"), Fe(e, "Limpando configuração...");
  try {
    await qR(t);
    const r = Oc(t);
    oI(e, r), vu(e, r), Fe(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Fe(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function vu(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Nu(t) ? "Configurada" : "Rascunho");
}
function aI(e, t) {
  return {
    schemaVersion: 1,
    intent: xu(Ze(e, "intent")?.value),
    damageType: As(e, "damageType"),
    utilityLabel: As(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Gt(e, "formula.base") },
      discente: { formula: Gt(e, "formula.discente") },
      verdadeiro: { formula: Gt(e, "formula.verdadeiro") }
    }
  };
}
function oI(e, t) {
  ve(e, "intent", t.intent), ve(e, "damageType", t.damageType ?? ""), ve(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ve(e, "formula.base", t.forms.base.formula), ve(e, "formula.discente", t.forms.discente.formula), ve(e, "formula.verdadeiro", t.forms.verdadeiro.formula), ro(e);
}
function ro(e) {
  const t = xu(Ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function hs(e, t) {
  const n = Du(t);
  bs(e, "discente", n.discente), bs(e, "verdadeiro", n.verdadeiro);
}
function bs(e, t, n) {
  const r = Ze(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${$e}="save"]`)?.disabled;
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
function Du(e) {
  const t = lI(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function iI(e) {
  return _s(e.item) ? e.item : _s(e.document) ? e.document : null;
}
function sI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function lI(e) {
  const t = e.system;
  return uI(t) ? t : {};
}
function ys(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ze(e, t) {
  return e.querySelector(`[${Tt}="${dI(t)}"]`);
}
function Gt(e, t) {
  return Ze(e, t)?.value.trim() ?? "";
}
function As(e, t) {
  const n = Gt(e, t);
  return n.length > 0 ? n : null;
}
function ve(e, t, n) {
  const r = Ze(e, t);
  r && (r.value = n);
}
function xu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Nu(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function cI(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function _s(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function uI(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function dI(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Q = null;
Hooks.once("init", () => {
  _d(), Zd(), np(), oT(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ho.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ho.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = cS(), Q.itemUseIntegration.registerStrategies(), Hf(Q.resources, Q.resourceAdapter), Zf(Q.conditions), km(Q), dT(), gS(Q), jS(), MS(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function mI() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  mI as getToolkitServices
};
//# sourceMappingURL=main.js.map
