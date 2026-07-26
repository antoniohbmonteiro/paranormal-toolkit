const d = "paranormal-toolkit", ws = "Paranormal Toolkit", Ou = "ordemparanormal";
class At {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function un(e) {
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
function Tt(e) {
  const t = rr(e);
  return t.ok ? y(t.value.definition) : t;
}
function rr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : or(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Fu(e) {
  return or(e.getFlag(d, "automation"));
}
function or(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Uu(t.source) && Bu(t.definition);
}
function Bu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(zu) && (t.ritualForms === void 0 || Wu(t.ritualForms)) && (t.conditionApplications === void 0 || Zu(t.conditionApplications));
}
function Uu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
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
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Cs(t);
}
function ju(e) {
  return e.type === "spendRitualCost";
}
function Gu(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || od(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Vu(e) {
  const t = e;
  return t.type === "modifyResource" && Ss(t.actor) && ad(t.resource) && rd(t.operation) && Cs(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
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
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || sd(t.extraCost)) && (t.rollFormulaOverrides === void 0 || cd(t.rollFormulaOverrides)) && (t.notes === void 0 || ld(t.notes)) && (t.targeting === void 0 || Yu(t.targeting));
}
function Yu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Qu(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Xu(t.template));
}
function Xu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || lo(t.distance)) && (t.width === void 0 || t.width === null || lo(t.width));
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
  return w(t.id) && Ss(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || td(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || ed(t.applyOnResistance));
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
function Cs(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Ss(e) {
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
function lo(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function ld(e) {
  return Array.isArray(e) && e.every(w);
}
function cd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function ir(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(co);
    if (md(t))
      return Array.from(t).filter(co);
  }
  return [];
}
function ud(e) {
  return ir(e)[0] ?? null;
}
function dd(e) {
  return ir(e).find(Fu) ?? null;
}
function md(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function co(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Rt(e) {
  return ir(e).filter((t) => t.type === "ritual");
}
function Is(e) {
  return Rt(e)[0] ?? null;
}
function fd(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(un);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = st("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = It(t);
      if (!n) return [];
      const a = e.automationRegistry.findForItem(n).map(fo);
      return f.info(`Presets encontrados para ${n.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const n = st("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const a = It(n);
      if (!a) return;
      const r = e.automationRegistry.require(t);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      const o = await ua(e, a, r.value);
      f.info(`Preset ${r.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = st("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = It(t);
      if (!n) return;
      const a = e.automationRegistry.findForItem(n)[0];
      if (!a) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const r = await ua(e, n, a.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: fo(a), itemPatch: r }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return uo(e);
    },
    async applyBestPresetsToActorRituals() {
      return uo(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = st("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = It(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function uo(e) {
  const t = st("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Rt(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), mo(t);
  const a = mo(t, n.length);
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
    const s = await ua(e, r, o.preset);
    a.applied.push(pd(r, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), gd(a), a;
}
async function ua(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function pd(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: un(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function mo(e, t = 0) {
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
function fo(e) {
  return {
    preset: un(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function st(e) {
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function It(e) {
  const t = Is(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Pe(e) {
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
    rollRequests: po(e.rollRequests, Ls),
    rolls: po(e.rolls, _d),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(sr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function sr(e) {
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
function Ls(e) {
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
    ...Ls(e),
    total: e.total
  };
}
function po(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, a]) => [n, t(a)]));
}
function Ad(e) {
  return {
    getSelected() {
      return At.getSelectedActor();
    },
    logResources() {
      const t = ge(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await De(
        e,
        "Gasto de PE",
        ge("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await De(
        e,
        "Gasto de PD",
        ge("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await De(
        e,
        "Dano em PV",
        ge("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await De(
        e,
        "Cura de PV",
        ge("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await De(
        e,
        "Dano em SAN",
        ge("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await De(
        e,
        "Recuperação de SAN",
        ge("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function De(e, t, n, a) {
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
  f.info(`${t} realizado:`, sr(o));
}
function ge(e) {
  const t = At.getSelectedActor();
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
  Lt(ee.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Lt(ee.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Lt(ee.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Lt(ee.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function da() {
  return {
    enabled: vt(ee.enabled),
    console: vt(ee.console),
    ui: vt(ee.ui),
    chat: vt(ee.chat)
  };
}
async function oe(e, t) {
  await game.settings.set(d, ee[e], t);
}
function Lt(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function vt(e) {
  return game.settings.get(d, e) === !0;
}
function kd() {
  return {
    status() {
      return da();
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
const vs = "ritual.costOnly", Ds = "ritual.simpleHealing", Ed = "ritual.eletrocussao", $d = "ritual.definhar", xs = "ritual.simpleDamage", Ns = "generic.simpleHealing", Ps = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, lr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function wd() {
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
    id: vs,
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
    id: Ds,
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
    automation: Ms(),
    itemPatch: Md()
  };
}
function Id() {
  return {
    id: Ed,
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
    automation: Pd(),
    itemPatch: Od()
  };
}
function vd() {
  return {
    id: xs,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: cr()
  };
}
function Dd() {
  return {
    id: Ns,
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
function Ms(e = Ps) {
  const t = xd(e);
  return Os(
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
    ...Ps,
    ...e
  };
}
function Nd() {
  return {
    ...cr("3d6", {
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
function cr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", r = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Os(
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
    descriptionHtml: lr,
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
    descriptionHtml: lr,
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
    descriptionHtml: lr,
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
function Os(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: n
    })
  };
}
function ur() {
  return Array.from(game.user?.targets ?? []).map(Fs);
}
function Fs(e) {
  return {
    tokenId: Me(e.id),
    actorId: Me(e.actor?.id),
    sceneId: Me(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Bs() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Me(e.id),
    actorId: Me(t?.id),
    sceneId: Me(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Me(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Bd(e) {
  return {
    logFirstRitualCost() {
      const t = he("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = be(t);
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
      const a = he("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const r = be(a);
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
      const t = he("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = be(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = he("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = be(t);
      if (!n) return;
      const a = e.automationRegistry.require(vs);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = he("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const a = be(n);
      if (!a) return;
      if (!go(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const r = e.automationRegistry.require(Ds);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: Ms(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = he("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const a = be(n);
      if (!a) return;
      if (!go(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const r = e.automationRegistry.require(xs);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: cr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = he("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = be(t);
      n && await Ud(e, t, n);
    }
  };
}
async function Ud(e, t, n) {
  const a = Tt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Bs(),
    item: n,
    targets: ur()
  });
  if (!r.ok) {
    zd(r.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", Pe(r.value.context));
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
function he(e) {
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function be(e) {
  const t = Is(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function qd(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function go(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const jd = ["strict", "open"], Us = "strict";
function Gd(e) {
  return jd.includes(e) ? e : Us;
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
function dn(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Hd = ["disabled", "ask", "automatic"], Wd = ["buttons", "confirm"], zs = "ask";
function Kd(e) {
  return typeof e == "string" && Hd.includes(e);
}
function Yd(e) {
  return typeof e == "string" && Wd.includes(e);
}
function Xd(e) {
  return Kd(e) ? e : Yd(e) ? "ask" : zs;
}
const Qd = ["keep", "replace"], Zd = ["manual", "assisted"], qs = "keep", js = "assisted", Jd = !0, M = {
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
    default: zs
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
    default: qs
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
    default: js
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
    default: Us
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
function ma() {
  const e = Xd(game.settings.get(d, M.executionMode)), t = Hs(game.settings.get(d, M.systemCardMode)), n = Ws(game.settings.get(d, M.damageResolutionMode)), a = dr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: a,
    ritualCastingCheckEnabled: Vs()
  };
}
function Gs() {
  return Hs(game.settings.get(d, M.systemCardMode));
}
function tm() {
  return Ws(game.settings.get(d, M.damageResolutionMode));
}
function dr() {
  return Gd(game.settings.get(d, M.resistanceGateMode));
}
function Vs() {
  return game.settings.get(d, M.ritualCastingCheckEnabled) === !0;
}
async function ye(e) {
  await game.settings.set(d, M.executionMode, e);
}
function Hs(e) {
  return Qd.includes(e) ? e : qs;
}
function Ws(e) {
  return Zd.includes(e) ? e : js;
}
function nm(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await ye("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await ye("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await ye(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await ye("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await ye("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await ye("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await ye("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
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
      const t = Nn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = dd(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ho(e, t, n);
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
      const a = im(n) ?? Nn("Nenhum ator encontrado para executar automação do item.");
      a && await ho(e, a, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Nn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = ud(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(Ns);
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
async function ho(e, t, n) {
  const a = Tt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Bs(),
    item: n,
    targets: ur()
  });
  if (!r.ok) {
    om(r.error);
    return;
  }
  f.info("Automação executada com sucesso.", Pe(r.value.context));
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
function Nn(e) {
  const t = At.getSelectedActor();
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
const Ut = {
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
      const a = bo();
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
      const n = bo();
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
function bo() {
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
function N(e) {
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
function mm(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${N(e.label)}</span>`;
}
const fm = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function pm(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${N(t)}" alt="${N(e?.alt ?? "")}">` : fm;
}
function gm(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${N(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(mm).join("")}</div>` : "", a = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${N(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${pm(e.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${N(e.title)}</span>${t}
      </div>${n}
    </div>${a}
  </div>
</header>`;
}
function Se(e) {
  return `<article class="paranormal-toolkit-chat-card-shell">${e.content}</article>`;
}
const hm = '<svg class="paranormal-toolkit-dice-action-button__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 2 8v8l10 6 10-6V8L12 2Z"/><path d="m2 8 10 6 10-6M12 2v12"/></svg>';
function bm(e) {
  const t = e.disabled ? " disabled" : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${N(e.ariaLabel)}"${t}>${hm}</button>`;
}
const yo = {
  section: "paranormal-toolkit-roll-row__result--section",
  success: "paranormal-toolkit-roll-row__result--success",
  failure: "paranormal-toolkit-roll-row__result--failure"
};
function ym(e) {
  return yo[e ?? "section"] ?? yo.section;
}
function _m(e) {
  const t = `<span class="paranormal-toolkit-roll-row__formula-text">${N(e.formula)}</span>`;
  if (!e.diceResults?.length)
    return `<div class="paranormal-toolkit-roll-row__formula paranormal-toolkit-roll-row__formula--static">${t}</div>`;
  const n = e.diceResults.map(
    (r) => `<span class="paranormal-toolkit-roll-row__die">${N(String(r))}</span>`
  ).join("");
  return `<details class="paranormal-toolkit-roll-row__details"${e.expanded ? " open" : ""}>
  <summary class="paranormal-toolkit-roll-row__formula">${t}<span class="paranormal-toolkit-roll-row__chevron" aria-hidden="true"></span></summary>
  <div class="paranormal-toolkit-roll-row__breakdown" aria-label="Resultados dos dados">${n}</div>
</details>`;
}
function mr(e) {
  const t = e.total !== void 0, n = t ? "with-result" : "without-result", a = t ? N(String(e.total)) : "", r = t ? `<output class="paranormal-toolkit-roll-row__result ${ym(e.resultTone)}" aria-label="Resultado: ${a}">${a}</output>` : "";
  return `<div class="paranormal-toolkit-roll-row paranormal-toolkit-roll-row--${n}">${_m(e)}${r}</div>`;
}
const _o = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  resistance: "paranormal-toolkit-section-card--resistance"
};
function Am(e) {
  return _o[e] ?? _o.casting;
}
function Ye(e) {
  return `<section class="paranormal-toolkit-section-card ${Am(e.tone)}">${e.content}</section>`;
}
function Xe(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${N(e.title)}</span>${t}</div>`;
}
const Ao = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure"
}, Tm = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA"
};
function mn(e) {
  const t = Ao[e.state] ? e.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${Ao[t]}">${Tm[t]}</span>`;
}
function Rm(e) {
  const t = N(String(e.total)), n = N(String(e.difficultyClass)), a = `<p class="paranormal-toolkit-ritual-conjuration-section__result-description"><span class="paranormal-toolkit-ritual-conjuration-section__skill">${N(e.skillLabel)}:</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">${t}</strong> <span class="paranormal-toolkit-ritual-conjuration-section__comparison">vs</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">DT ${n}</strong></p>`, r = e.consequence?.trim(), o = r ? `<p class="paranormal-toolkit-ritual-conjuration-section__consequence"><span class="paranormal-toolkit-ritual-conjuration-section__consequence-label">Consequência:</span> ${N(r)}</p>` : "", s = Xe({
    title: "Conjuração",
    trailing: mn({ state: e.status })
  }) + a + mr({
    formula: e.formula,
    total: e.total,
    resultTone: e.status,
    diceResults: e.diceResults,
    expanded: e.expanded
  }) + o;
  return Ye({ tone: "casting", content: s });
}
function km(e) {
  const t = e.damageType.trim(), n = t ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${N(t)}</span>` : void 0, a = Xe({ title: "Dano", trailing: n }) + mr({
    formula: e.formula,
    total: e.total,
    resultTone: "section",
    diceResults: e.diceResults,
    expanded: e.expanded
  });
  return Ye({ tone: "damage", content: a });
}
const Ks = "devChatCardExample", Em = "devChatCardHeaderExample";
function ie() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function $m() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", a = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", r = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof r == "string" ? { src: r, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${a}`
  };
}
function wm(e) {
  return e === "runtime" ? $m() : e === "ability" ? {
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
function Cm(e) {
  switch (e) {
    case "casting-title":
      return { tone: "casting", title: "Conjuração" };
    case "casting-badge":
      return {
        tone: "casting",
        title: "Conjuração",
        trailing: mn({ state: "success" })
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
function Sm(e) {
  const t = Cm(e);
  return Se({
    content: Ye({
      tone: t.tone,
      content: Xe({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function Im(e) {
  return Se({
    content: Ye({
      tone: "casting",
      content: Xe({
        title: "Conjuração",
        trailing: mn({ state: e })
      })
    })
  });
}
function Lm(e) {
  const t = e === "disabled";
  return Se({
    content: Ye({
      tone: "resistance",
      content: Xe({
        title: "Resistência",
        trailing: bm({
          ariaLabel: t ? "Resistência indisponível" : "Rolar resistência",
          disabled: t
        })
      })
    })
  });
}
function vm(e) {
  const t = e.startsWith("with-result"), n = e.startsWith("damage"), a = e === "with-result-failure", r = t ? {
    formula: "1d20 + 10 + 5",
    total: a ? 17 : 23,
    resultTone: a ? "failure" : "success",
    diceResults: [a ? 2 : 8]
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
  }, o = n ? "damage" : t ? "casting" : "resistance", s = n ? "Dano" : t ? "Conjuração" : "Resistência", l = n ? '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>' : t ? mn({ state: a ? "failure" : "success" }) : void 0;
  return Se({
    content: Ye({
      tone: o,
      content: Xe({ title: s, trailing: l }) + mr(r)
    })
  });
}
function Dm(e) {
  const t = e === "failure" || e === "failure-consequence";
  return {
    status: t ? "failure" : "success",
    skillLabel: "Ocultismo",
    total: t ? 17 : 23,
    difficultyClass: 21,
    formula: "1d20 + 10 + 5",
    diceResults: [t ? 2 : 8],
    expanded: e === "expanded",
    consequence: e === "failure-consequence" ? "Dano de Sanidade" : void 0
  };
}
function xm(e) {
  return Se({
    content: Rm(Dm(e))
  });
}
function Nm(e) {
  return e === "long-type" ? {
    damageType: "Eletricidade paranormal prolongada",
    formula: "3d6 + 2d8 + 5",
    total: 21,
    diceResults: [2, 3, 4, 5, 2]
  } : {
    damageType: "Eletricidade",
    formula: "3d6",
    total: e === "without-result" ? void 0 : 9,
    diceResults: [2, 3, 4],
    expanded: e === "expanded"
  };
}
function Pm(e) {
  return Se({
    content: km(Nm(e))
  });
}
function _e(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [d]: { [Ks]: t } }
  });
}
function Mm() {
  const e = async () => {
    ie();
    const n = (game.messages.contents ?? []).filter(
      (a) => typeof a.getFlag?.(d, Ks) == "string" || a.getFlag?.(d, Em) === !0
    );
    await Promise.all(
      n.map(
        (a) => a.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return ie(), _e(
        Se({
          content: gm(wm(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      ie();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (a) => _e(Sm(a), "section")
        )
      );
    },
    async postStatusBadgeExample(t) {
      ie();
      const n = t === "both" ? ["success", "failure"] : [t];
      return Promise.all(
        n.map(
          (a) => _e(Im(a), "status")
        )
      );
    },
    async postDiceActionButtonExample(t) {
      ie();
      const n = t === "all" ? ["enabled", "disabled"] : [t];
      return Promise.all(
        n.map(
          (a) => _e(
            Lm(a),
            "dice-action-button"
          )
        )
      );
    },
    async postRollRowExample(t) {
      ie();
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
          (a) => _e(vm(a), "roll-row")
        )
      );
    },
    async postRitualConjurationSectionExample(t) {
      ie();
      const n = t === "all" ? ["success", "failure", "failure-consequence", "expanded"] : [t];
      return Promise.all(
        n.map(
          (a) => _e(
            xm(a),
            "ritual-conjuration"
          )
        )
      );
    },
    async postRitualDamageSectionExample(t) {
      ie();
      const n = t === "all" ? ["collapsed", "expanded", "without-result", "long-type"] : [t];
      return Promise.all(
        n.map(
          (a) => _e(
            Pm(a),
            "ritual-damage"
          )
        )
      );
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function Om(e) {
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
    dev: Mm(),
    hooks: Ut
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const a = game.modules.get(d);
  return a && (a.api = t), t;
}
class To {
  static isSupportedSystem() {
    return game.system.id === Ou;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const Pn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Fm(e) {
  if (!Gm(e.item)) return null;
  const t = fa(e.actor) ? e.actor : Bm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: zm(e.token) ?? Um(t),
    targets: ur(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Bm(e) {
  const t = e;
  return fa(t.actor) ? t.actor : fa(e.parent) ? e.parent : null;
}
function Um(e) {
  const t = qm(e) ?? jm(e);
  return t ? Ys(t) : null;
}
function zm(e) {
  return pa(e) ? Ys(e) : null;
}
function qm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return pa(n) ? n : (t.getActiveTokens?.() ?? []).find(pa) ?? null;
}
function jm(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ys(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Mn(e.id),
    actorId: Mn(t?.id),
    sceneId: Mn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Gm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function fa(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function pa(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Mn(e) {
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
    this.registered || (Hooks.on(Pn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${Pn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Fm(Vm(t));
    if (!n) {
      f.warn(`${Pn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Vm(e) {
  return e && typeof e == "object" ? e : {};
}
function Kt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function fr() {
  const e = globalThis.game;
  return fn(e) ? e : null;
}
function K(e, t) {
  const n = Hm(e, t);
  return zt(n);
}
function Hm(e, t) {
  return t.split(".").reduce((n, a) => fn(n) ? n[a] : null, e);
}
function Wm(e, t) {
  const n = e.indexOf(":");
  return n < 0 || gt(e.slice(0, n)) !== gt(t) ? null : Qe(e.slice(n + 1));
}
function zt(e) {
  return typeof e == "string" ? Qe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function fn(e) {
  return !!e && typeof e == "object";
}
function Km(e) {
  return typeof e == "string";
}
function pn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Qe(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function gt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function ga(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function de(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Qs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const Yt = "abilityRollConfig", Zs = [
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
], ha = 20, ba = 20, Ym = [10, 40, 65, 99];
function Js() {
  return {
    schemaVersion: 1,
    rolls: [el(1)]
  };
}
function el(e) {
  return {
    id: Qm(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function Xm() {
  return Ym.map((e) => ({ minNex: e, formula: "" }));
}
function Qm() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function tl(e) {
  return pr(
    e.getFlag(d, Yt)
  );
}
function Zm(e) {
  return tl(e) ?? Js();
}
async function Jm(e, t) {
  const n = pr(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, Yt, n), n;
}
async function ef(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, Yt)
    );
    return;
  }
  await e.setFlag(d, Yt, null);
}
function pr(e) {
  if (!qe(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, ha).map((a, r) => sf(a, r, t)).filter((a) => a !== null)
  };
}
function tf(e, t) {
  const n = tl(t);
  return n ? nf(n, af(e)) : [];
}
function nf(e, t) {
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
function af(e) {
  const t = qe(e.system) ? e.system : {}, n = t.NEX ?? t.nex, a = qe(n) ? n.value : n, r = typeof a == "number" ? a : Number(a);
  return Number.isFinite(r) ? al(r) : 0;
}
function nl(e) {
  return Zs.find((t) => t.value === e)?.label ?? e;
}
function rf(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function of(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function sf(e, t, n) {
  if (!qe(e)) return null;
  const a = `roll-${t + 1}`, r = ff(mf(e.id, a), n), o = uf(e.intent), s = lf(e.formula);
  return !o || !s ? null : {
    id: r,
    label: gn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? pf(e.damageType) : null,
    formula: s
  };
}
function lf(e) {
  if (!qe(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: gn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, ba).map(cf).filter((a) => a !== null) : [];
  t.sort((a, r) => a.minNex - r.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const a of t) n.set(a.minNex, a);
  return {
    mode: "nex",
    resolution: df(e.resolution),
    steps: [...n.values()]
  };
}
function cf(e) {
  if (!qe(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: al(t),
    formula: gn(e.formula)
  } : null;
}
function uf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function df(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function mf(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function ff(e, t) {
  let n = e, a = 2;
  for (; t.has(n); )
    n = `${e}-${a}`, a += 1;
  return t.add(n), n;
}
function al(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function gn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function pf(e) {
  const t = gn(e);
  return t.length > 0 ? t : null;
}
function qe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const gr = "data-paranormal-toolkit-ability-roll-id";
function gf(e) {
  if (!rl(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = ce(e.actorUuid), n = ce(e.itemUuid), a = ce(e.abilityName);
  if (!t) return null;
  const r = e.rolls.map(hf).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: a || "Habilidade",
    rolls: r,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: On(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: On(e.resourceBefore),
    resourceAfter: On(e.resourceAfter)
  };
}
function hf(e) {
  if (!rl(e)) return null;
  const t = ce(e.id), n = ce(e.sourceRollId), a = ce(e.label), r = ce(e.formula), o = bf(e.intent);
  if (!t || !n || !a || !r || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: a,
    formula: r,
    intent: o,
    damageType: o === "damage" ? yf(e.damageType) : null,
    nexThreshold: s
  };
}
function bf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function ce(e) {
  return typeof e == "string" ? e.trim() : "";
}
function yf(e) {
  const t = ce(e);
  return t.length > 0 ? t : null;
}
function On(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function rl(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Ro = "paranormalToolkitAbilityRollBound";
let ko = !1;
function _f() {
  if (ko) return;
  ko = !0;
  const e = (t, n) => {
    Af(t, Kt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function Af(e, t) {
  if (!t) return 0;
  const n = `[${gr}]`, a = If(t, n);
  let r = 0;
  for (const o of a)
    o.dataset[Ro] !== "true" && (o.dataset[Ro] = "true", o.addEventListener("click", () => {
      Tf(e, o);
    }), r += 1);
  return r;
}
async function Tf(e, t) {
  const n = t.getAttribute(gr)?.trim();
  if (!n) return;
  const a = Rf(e), r = a?.rolls.find((l) => l.id === n);
  if (!a || !r) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await kf(a.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!wf(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = Ef();
  if (!s) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  Eo(t, !0);
  try {
    const l = new s(
      r.formula,
      $f(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: Cf(a.abilityName, r)
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
    Eo(t, !1);
  }
}
function Rf(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : gf(
    t.getFlag(d, "abilityUse")
  );
}
async function kf(e) {
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
  const n = e.startsWith("Actor.") ? e.slice(6) : e, r = game.actors?.get?.(n);
  return $o(r) ? r : null;
}
function Ef() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function $f(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function wf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function Cf(e, t) {
  const n = [Sf(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${Fn(e)}</strong>
      <span>${Fn(t.label)}</span>
      <small>${Fn(n.join(" · "))}</small>
    </div>
  `;
}
function Sf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${nl(e.damageType)}` : "Dano";
  }
}
function If(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function Eo(e, t) {
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
function Fn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const Lf = "paranormal-toolkit-chat-message--full-width-card", wo = ".paranormal-toolkit-ability-card", Co = "li.chat-message";
let So = !1;
function vf() {
  if (So) return;
  So = !0;
  const e = Hooks, t = (n, a) => {
    Io(Kt(a));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Io(document);
}
function Io(e) {
  if (!e) return 0;
  const t = hr(e), n = Df(t), a = /* @__PURE__ */ new Set();
  for (const r of n) {
    const o = xf(t, r);
    o?.classList && a.add(o);
  }
  for (const r of a)
    r.classList?.add(Lf);
  return a.size;
}
function Df(e) {
  const t = [];
  e.matches?.(wo) && t.push(e);
  const n = e.querySelectorAll?.(wo);
  if (!n) return t;
  for (const a of Array.from(n)) {
    const r = hr(a);
    t.includes(r) || t.push(r);
  }
  return t;
}
function xf(e, t) {
  if (e.matches?.(Co)) return e;
  const n = t.closest?.(Co);
  return n ? hr(n) : null;
}
function hr(e) {
  return e && typeof e == "object" ? e : {};
}
function Nf(e) {
  const t = Pf(e.cost), n = Mf(e.currentResource), a = t > 0 && !e.passive, r = n >= t;
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
function Pf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Mf(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Of } = foundry.applications.api;
class mt extends Of {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = Nf(t), this.spendResource = this.model.cost.spendResourceChecked;
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
      useAbility: mt.onUseAbility,
      cancel: mt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new mt(t, n).render({ force: !0 });
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
          src="${Ff(this.model.header.image)}"
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
function Ff(e) {
  return z(e);
}
function Bf(e, t) {
  const n = Vf(t.system), a = Xt(n.activation), r = jf(a), o = zf();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Hf(t),
    activation: a,
    activationLabel: qf(a),
    description: Xt(n.description),
    chatDescription: Uf(
      n.chatDescription,
      n.description
    ),
    cost: r ? 0 : Gf(n.cost),
    resource: o,
    passive: r,
    rolls: tf(e, t)
  };
}
function Uf(e, t) {
  const n = Xt(e);
  return n.trim().length > 0 ? n : Xt(t);
}
function zf() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function qf(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, a = Wf()?.(t) ?? t;
  return a === t ? e : a;
}
function jf(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Gf(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Vf(e) {
  return e && typeof e == "object" ? e : {};
}
function Xt(e) {
  return typeof e == "string" ? e : "";
}
function Hf(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Wf() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Kf {
  async publish(t, n, a) {
    const r = await ep(n), o = Yf({
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
    }, c = Jf(t.message);
    if (Gs() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function Yf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, a = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", r = Xf(e.rolls), o = Zf(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${ya(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${le(e.abilityName)}</h3>
          <p>${le(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${le(e.activationLabel)}</span>
        <span><strong>Custo</strong>${le(t)}</span>
      </div>

      ${r}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${a}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${le(n)}</span>
      </footer>
    </article>
  `;
}
function Xf(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const a = `paranormal-toolkit-ability-card__roll--${n.intent}`, r = Qf(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${a}"
          ${gr}="${ya(n.id)}"
          title="${ya(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${le(n.label)}</strong>
            <small>${le(r)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function Qf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${nl(e.damageType)}` : "Dano";
  }
}
function Zf(e) {
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
function Jf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function le(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ya(e) {
  return le(e);
}
async function ep(e) {
  const t = e.chatDescription || e.description, n = tp();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: np(e.actor)
  });
}
function tp() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function np(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class ap {
  constructor(t, n, a = new Kf()) {
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
    if (!rp(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const a = Bf(n, t.item), r = this.readCurrentResource(a);
    if (!r.ok)
      return this.fail(
        "resource-unavailable",
        r.message
      );
    const o = await mt.request({
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
function rp(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Lo = 1e3;
class op {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new ap(t, n), this.strategy = new Xs(
      (a) => this.handleItemUsed(a)
    );
  }
  register() {
    this.strategy.register(), vf(), _f(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (ma().executionMode === "disabled" || !sp(t.item)) return;
    const n = lp(t);
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
    return n !== void 0 && Date.now() - n < Lo;
  }
  pruneRecentExecutions() {
    const t = Date.now() - Lo;
    for (const [n, a] of this.recentExecutions)
      a < t && this.recentExecutions.delete(n);
  }
}
function ip(e, t) {
  const n = new op(e, t);
  return n.register(), n;
}
function sp(e) {
  if (e.type !== "ability") return !1;
  const t = rr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function lp(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let vo = !1, Bn = !1, Un = !1, Dt = null;
const cp = 1e3, up = 750, dp = 1e3;
function mp(e) {
  vo || (Hooks.on("combatTurnChange", (t) => {
    pp(e, Do(t));
  }), Hooks.on("deleteCombat", (t) => {
    gp(e, Do(t));
  }), vo = !0, fp(e));
}
function fp(e) {
  hn() && (Bn || (Bn = !0, globalThis.setTimeout(() => {
    Bn = !1, br(e, "ready");
  }, cp)));
}
function pp(e, t) {
  hn() && t && (Dt && globalThis.clearTimeout(Dt), Dt = globalThis.setTimeout(() => {
    Dt = null, br(e, "combat-turn-change", t);
  }, up));
}
function gp(e, t) {
  hn() && t && (Un || (Un = !0, globalThis.setTimeout(() => {
    Un = !1, br(e, "combat-deleted", t);
  }, dp)));
}
async function br(e, t, n) {
  if (hn())
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
function hn() {
  return game.user?.isGM === !0;
}
function Do(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ol = {
  enabled: "dice.animations.enabled"
};
function hp() {
  game.settings.register(d, ol.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function bp() {
  return {
    enabled: game.settings.get(d, ol.enabled) === !0
  };
}
const bn = "chatCard", xo = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, yp = `.${i}__title`, il = `.${i}__header`, _p = `.${i}__roll-card`, Ap = `.${i}__roll-meta`, Tp = `.${i}__roll-meta-pill`, yr = `.${i}__resistance`, Rp = `.${i}__resistance-header`, sl = `.${i}__resistance-description`, yn = `.${i}__resistance-roll-button`, ll = `.${i}__resistance-roll-result`, No = `${i}__resistance-content`, cl = `.${i}__workflow-section`, ul = `.${i}__workflow-roll`, _r = `${i}__workflow-roll--dice-open`, Ar = `.${i}__workflow-roll-formula`, Tr = `${i}__workflow-roll-formula--toggle`, _n = `.${i}__workflow-dice-tray`, kp = `.${i}__roll-detail-toggle`, Ep = `.${i}__roll-detail-list`, $p = `.${i}__ritual-element-badge`, wp = `.${i}__ritual-metadata`, Cp = "casting-backlash", Sp = "data-paranormal-toolkit-action-section", Ip = "data-paranormal-toolkit-prompt-id", Lp = "data-paranormal-toolkit-pending-id", Po = "data-paranormal-toolkit-casting-backlash-enhanced", Mo = `.${i}`, vp = `.${i}__workflow-section--casting`, Dp = `.${i}__workflow-section-header`, xp = `.${i}__workflow-notes`, Np = `[${Sp}="${Cp}"]`, Oo = `${i}__workflow-section-title-row`, Pp = `${i}__workflow-section-header--casting-backlash`, dl = `${i}__casting-backlash-button`;
function Mp(e) {
  for (const t of Op(e))
    Fp(t), jp(t);
}
function Op(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Mo) && t.add(e);
  for (const n of e.querySelectorAll(Mo))
    t.add(n);
  return Array.from(t);
}
function Fp(e) {
  const t = e.querySelector(Np);
  if (!t) return;
  const n = Bp(t);
  if (!n) return;
  const a = e.querySelector(`${vp} ${Dp}`);
  a && (a.classList.add(Pp), Up(a), zp(n), a.append(n), t.remove());
}
function Bp(e) {
  return e.querySelector(
    `button[${Lp}], button[${Ip}]`
  );
}
function Up(e) {
  const t = e.querySelector(`:scope > .${Oo}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Oo);
  const a = Array.from(e.childNodes);
  e.prepend(n);
  for (const r of a)
    r !== n && (r instanceof HTMLButtonElement && r.classList.contains(dl) || n.append(r));
  return n;
}
function zp(e) {
  if (e.getAttribute(Po) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = qp(t, e.disabled);
  e.classList.add(dl), e.setAttribute(Po, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function qp(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function jp(e) {
  for (const t of e.querySelectorAll(xp)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Gp(e) {
  for (const t of Array.from(e.querySelectorAll(cl)))
    for (const n of Array.from(t.querySelectorAll(`${kp}, ${Ep}`)))
      n.remove();
}
const Vp = {
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
}, Hp = new Set(
  Object.values(Vp)
), Wp = {
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
function Kp(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Yp(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Wp[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Hp.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
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
function Yp(e) {
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
      const g = Xp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = Kp(m.damageType);
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
          Qp(g.id, m, _.value)
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
        for (const E of Jp(k.conditions))
          l.add(E);
        const R = Zp(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? ml(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: Fo(k.finalDamage, g.amount),
          blocked: Fo(k.blocked, 0),
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
function Xp(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Qp(e, t, n) {
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
function Fo(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Zp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Jp(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Rr {
  async rollResistance(t) {
    const n = await tg(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? $e(t.skill),
      roll: n,
      formula: ag(n),
      total: rg(n),
      diceBreakdown: og(n)
    };
  }
  getSkillLabel(t) {
    return $e(t);
  }
}
async function eg(e, t) {
  return new Rr().rollResistance({ actor: e, skill: t });
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
async function tg(e, t) {
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
  return ng(a);
}
function ng(e) {
  return Bo(e) ? e : Array.isArray(e) ? e.find(Bo) ?? null : null;
}
function Bo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function ag(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function rg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function og(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(ig);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function ig(e) {
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
function sg(e, t) {
  const n = pg(e?.rounds);
  if (!n)
    return Uo(null);
  const a = e?.anchor ?? hl(t);
  if (!a)
    return {
      ...Uo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: lg(),
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
  const t = gg();
  if (!t?.id || !bl(t.round)) return null;
  const n = mg(t), a = cg(e, n) ?? dg(t), r = se(a?.id), o = bg(a?.initiative), s = ug(t, a, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: r,
    round: t.round,
    turn: s,
    initiative: o,
    time: hg()
  };
}
function lg() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Uo(e) {
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
function cg(e, t) {
  return e?.id ? t.find((n) => fg(n) === e.id) ?? null : null;
}
function ug(e, t, n) {
  const a = se(t?.id);
  if (a) {
    const r = n.findIndex((o) => o.id === a);
    if (r >= 0) return r;
  }
  return yg(e.turn) ? e.turn : null;
}
function dg(e) {
  return qt(e.combatant) ? e.combatant : null;
}
function mg(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(qt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(qt);
    const a = t.values;
    if (typeof a == "function")
      return Array.from(a.call(t)).filter(qt);
  }
  return [];
}
function fg(e) {
  return se(e.actor?.id) ?? se(e.actorId) ?? se(e.token?.actor?.id) ?? se(e.token?.actorId) ?? se(e.document?.actor?.id) ?? se(e.document?.actorId);
}
function pg(e) {
  return bl(e) ? Math.trunc(e) : null;
}
function gg() {
  return game.combat ?? null;
}
function hg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function qt(e) {
  return !!(e && typeof e == "object");
}
function se(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function bg(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function bl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function yg(e) {
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
    if (!Sg(a))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const r = n.value, o = sg(t.duration, a), s = _g(r, t, o), c = t.refreshExisting ?? !0 ? Ig(a, r.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(zo(a, r, c.id ?? null, !1, !0, o));
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
      return y(zo(a, r, m, !0, !1, o));
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
        await qo(n, s) === "deleted" && (o += 1);
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
    const n = Dg(), a = [];
    let r = 0, o = 0;
    for (const s of n) {
      const l = kr(s);
      r += l.length;
      for (const c of l) {
        if (!Rg(c, t)) continue;
        const u = _l(c);
        try {
          await qo(s, c) === "deleted" && (o += 1);
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
function _g(e, t, n) {
  const a = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: qg(),
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
    duration: Ag(n.duration),
    start: Tg(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: a
    }
  };
}
function Ag(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Tg(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: zg(),
    ...e
  };
}
function zo(e, t, n, a, r, o) {
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
function Rg(e, t) {
  const n = _l(e);
  if (!n.conditionId || !kg(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const a = Ug();
  return n.durationMode === "combatantTurn" || Eg(n) ? wg(n, a) : $g(e) || !a?.id || n.combatId && n.combatId !== a.id ? !0 : !Y(n.startRound) || !Y(n.requestedRounds) || !Y(a.round) ? !1 : a.round >= n.startRound + n.requestedRounds;
}
function kg(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Y(e.requestedRounds);
}
function Eg(e) {
  return !!(e.combatDurationApplied && Y(e.requestedRounds) && Y(e.startRound) && (e.startCombatantId || Qt(e.startTurn)));
}
function $g(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function wg(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !Y(e.startRound) || !Y(e.requestedRounds) || !Y(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const a = Cg(t);
  return e.startCombatantId ? a === e.startCombatantId : Qt(e.startTurn) && Qt(t.turn) ? t.turn === e.startTurn : !1;
}
function Cg(e) {
  return Oe(e.combatant?.id);
}
function _l(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: jt(e, "conditionId"),
    requestedRounds: jo(e, "requestedRounds") ?? lt(t.value) ?? lt(t.rounds),
    combatDurationApplied: zn(e, "combatDurationApplied"),
    combatId: jt(e, "combatId") ?? Oe(n.combat) ?? Oe(t.combat),
    startCombatantId: jt(e, "startCombatantId") ?? Oe(n.combatant),
    startInitiative: Mg(e, "startInitiative") ?? Tl(n.initiative),
    startRound: jo(e, "startRound") ?? lt(n.round) ?? lt(t.startRound),
    startTurn: Pg(e, "startTurn") ?? _a(n.turn) ?? _a(t.startTurn),
    expiryEvent: Og(e, "expiryEvent") ?? Rl(t.expiry),
    durationMode: Fg(e, "durationMode"),
    deleteOnExpire: zn(e, "deleteOnExpire"),
    expiresWithCombat: zn(e, "expiresWithCombat")
  };
}
function Sg(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Ig(e, t) {
  return Al(e, t)[0] ?? null;
}
function Al(e, t) {
  return kr(e).filter((n) => Ng(n) === t);
}
async function qo(e, t) {
  const n = t.id ?? null, a = n ? Lg(e, n) : t;
  if (!a) return "missing";
  try {
    return await Promise.resolve(a.delete?.()), "deleted";
  } catch (r) {
    if (vg(r)) return "missing";
    throw r;
  }
}
function Lg(e, t) {
  return kr(e).find((n) => n.id === t) ?? null;
}
function vg(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Dg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      xt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    xt(e, n);
  });
  for (const n of xg())
    xt(e, n.actor), xt(e, n.document?.actor);
  return Array.from(e.values());
}
function xt(e, t) {
  if (!Bg(t)) return;
  const a = Oe(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(a, t);
}
function xg() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function kr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Ng(e) {
  return jt(e, "conditionId");
}
function jt(e, t) {
  return Oe(Ie(e, t));
}
function jo(e, t) {
  return lt(Ie(e, t));
}
function Pg(e, t) {
  return _a(Ie(e, t));
}
function Mg(e, t) {
  return Tl(Ie(e, t));
}
function Og(e, t) {
  return Rl(Ie(e, t));
}
function Fg(e, t) {
  const n = Ie(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function zn(e, t) {
  return Ie(e, t) === !0;
}
function Ie(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const a = e.flags;
  if (!a || typeof a != "object") return;
  const r = a[d];
  if (!(!r || typeof r != "object"))
    return r[t];
}
function Oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function lt(e) {
  return Y(e) ? Math.trunc(e) : null;
}
function _a(e) {
  return Qt(e) ? Math.trunc(e) : null;
}
function Tl(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Rl(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Bg(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Ug() {
  return game.combat ?? null;
}
function zg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Y(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Qt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function qg() {
  return game.user?.id ?? null;
}
const jg = "icons/svg/downgrade.svg", Gg = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? jg,
    description: Gg,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Vg = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Hg = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Wg = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Kg = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Yg = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Xg = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Qg = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Zg = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Jg = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), eh = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), th = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), nh = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), ah = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), rh = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), oh = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), ih = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), sh = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), lh = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), ch = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), uh = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), dh = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), mh = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), fh = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), ph = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), gh = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), hh = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), bh = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), yh = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), _h = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Ah = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Th = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Rh = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), kh = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Eh = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), $h = [
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
  bh,
  yh,
  _h,
  Ah,
  Th,
  Rh,
  kh,
  Eh
];
class wh {
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
    return Array.from(this.definitions.values()).map(Go);
  }
  get(t) {
    const n = this.lookup.get(Vo(t)), a = n ? this.definitions.get(n) : null;
    return a ? y(Go(a)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const a = Vo(t);
    a && this.lookup.set(a, n);
  }
}
function kl() {
  return new wh($h);
}
function Go(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Vo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function je(e) {
  return e.applyOnResistance ?? "failure";
}
function El(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function $l(e, t) {
  const n = je(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function wl(e) {
  const t = je(e);
  return t === "failure" || t === "success";
}
function Ch(e, t, n, a) {
  const r = e.filter((c) => $l(c, t));
  if (r.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? r.filter((c) => je(c) === t) : [], s = o.length > 0 ? o : r;
  if (s.length === 1) return s[0] ?? null;
  const l = a(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => a(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Sh = {
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
}, Ih = {
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
function Lh(e) {
  return Sl(e, Sh, !1);
}
function vh(e) {
  return Sl(e, Ih, !e.allowsSuccessfulResistance);
}
function Ze(e) {
  return e.kind === "waiting-resistance";
}
function Cl(e) {
  return e.kind === "resisted";
}
function Sl(e, t, n) {
  const a = { ...t, ...e.labels };
  return e.alreadyApplied ? xe("applied", !1, a.applied, a.appliedCompact, null) : e.unavailable ? xe("unavailable", !1, a.unavailable, a.unavailableCompact, a.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || dn(e.resistanceGateMode, e.resistanceState) ? xe(
    "waiting-resistance",
    !1,
    a.waitingResistance,
    a.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? xe("resisted", !1, a.resisted, a.resistedCompact, a.resisted) : xe("available", !0, a.available, a.availableCompact, null);
}
function xe(e, t, n, a, r) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: a,
    reason: r
  };
}
const ct = "data-paranormal-toolkit-prompt-id", Dh = "data-paranormal-toolkit-resistance-roll-result", xh = "Conjuração DT";
function Nh(e) {
  const t = e.querySelector(yn)?.getAttribute(Dh), n = ht(t);
  if (n !== null) return n;
  const a = e.querySelector(ll)?.textContent ?? null, r = a ? /=\s*(-?\d+)\s*$/u.exec(a) : null;
  return ht(r?.[1] ?? null);
}
function Er(e) {
  const t = Il(e), n = Fh(t);
  if (n !== null) return n;
  const a = Oh(t);
  return a !== null ? a : Bh(e);
}
function Ph(e) {
  const t = Il(e);
  return t ? {
    actorId: qn(t.actorId),
    itemId: qn(t.itemId),
    itemName: qn(t.itemName)
  } : null;
}
function Mh(e) {
  const t = e.getAttribute(ct);
  if (!t) return null;
  const n = Ll(e), a = vl(n), s = (Array.isArray(a?.prompts) ? a.prompts : []).find((l) => An(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function me(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Aa(e) {
  return me(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Oh(e) {
  const t = zh(e);
  return t.length === 0 ? null : ht(qh(t, xh));
}
function Fh(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const a = game.actors?.get?.(t);
  return !a || typeof a != "object" ? null : Ho(a, ["system", "ritual", "DT"]) ?? Ho(a, ["system", "ritual", "dt"]);
}
function Bh(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((a) => a.textContent).find((a) => typeof a == "string" && a.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return ht(n?.[1] ?? null);
}
function Il(e) {
  const t = Uh(e);
  if (!t) return null;
  const n = Ll(e), a = vl(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => An(o) ? o.pendingId === t : !1) ?? null;
}
function Uh(e) {
  return (e.closest(`[${ct}]`) ?? e.querySelector(`[${ct}]`) ?? e.parentElement?.querySelector(`[${ct}]`) ?? null)?.getAttribute(ct) ?? null;
}
function Ll(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return jh(r) ? r : null;
}
function vl(e) {
  const t = e?.getFlag?.(d, bn);
  return An(t) ? t : null;
}
function zh(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function qh(e, t) {
  const n = `${t}:`;
  for (const a of e) {
    if (!a.startsWith(n)) continue;
    const r = a.slice(n.length).trim();
    if (r.length > 0) return r;
  }
  return null;
}
function Ho(e, t) {
  let n = e;
  for (const a of t) {
    if (!An(n)) return null;
    n = n[a];
  }
  return typeof n == "number" ? Math.trunc(n) : ht(typeof n == "string" ? n : null);
}
function ht(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function jh(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function An(e) {
  return !!(e && typeof e == "object");
}
function qn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Tn(e) {
  return Dl({
    hasResistance: !!e.querySelector(yr),
    difficulty: Er(e),
    resistanceTotal: Nh(e)
  });
}
function Gh(e) {
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
function Le() {
  return game.user?.isGM === !0;
}
function we() {
  return Le();
}
function Vh(e) {
  const t = dn(e.resistanceGateMode, e.resistanceState), n = Hh(e.resistanceState, e.hasDamage), a = Wh(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), r = Lh({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = vh({
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
function Hh(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Wh(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function $r(e) {
  const t = e.isGM ?? we();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Vh({
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
function Kh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const a = document.createElement("strong");
  a.classList.add(`${i}__workflow-roll-total`), a.textContent = e.total === null ? "—" : String(e.total), t.append(n, a);
  const r = Xh(e.formula, e.diceBreakdown ?? null);
  return r && t.append(r), t;
}
function Yh(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Xh(e, t) {
  const n = Qh(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${i}__workflow-dice-tray`);
  for (const r of Zh(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), r.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function Qh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function Zh(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Wo(e, "highest") : n.includes("kl") ? Wo(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Wo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
const Jh = "data-paranormal-toolkit-resistance-skill", eb = "data-paranormal-toolkit-resistance-skill-label", tb = "data-paranormal-toolkit-roll-card-target-names", nb = "data-paranormal-toolkit-roll-card-resistance", ab = "data-paranormal-toolkit-roll-card-resistance-skill", rb = "data-paranormal-toolkit-roll-card-resistance-skill-label", xl = "pending", wr = "success", Cr = "failure", Nl = "rolled";
function ob(e) {
  const t = ub(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? lb(e.damageSection) : null, a = Ko(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), r = ib(e.rollCard).map((o, s) => {
    const l = sb(o, s), c = e.resistanceResults.get(l) ?? null, u = hb(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = Gh({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Tb(u)
    }).state, k = Ko(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      El(_)
    ) ?? a;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: g,
      effect: k,
      assistedActions: $r({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: _,
        damage: n,
        effect: k,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!g,
        effectCanApplyOnSuccessfulResistance: k?.applyOnResistance === "success" || k?.applyOnResistance === "always",
        effectRequiresResolvedResistance: k ? wl(k) : !1
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
function ib(e) {
  const t = e.getAttribute(tb), n = t ? Ab(t) : [];
  if (n.length > 0) return n;
  const r = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = r.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && Pl(s) !== "nenhum alvo") : [];
}
function sb(e, t) {
  return `${Pl(e)}:${t}`;
}
function lb(e) {
  const t = bb(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: _b(e),
    formula: yb(e) ?? "—",
    total: t,
    diceBreakdown: Yh(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Ko(e, t, n, a) {
  const r = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, r ?? null, a);
  return o ? {
    label: r && r.length > 0 ? r : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: cb(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: je(o)
  } : null;
}
function cb(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function ub(e, t) {
  const n = mb(t), a = db(e), r = a.description ?? fb(n)?.textContent?.trim(), o = pb(n), s = a.skill ?? o?.getAttribute(Jh) ?? null, l = a.skillLabel ?? o?.getAttribute(eb) ?? (s ? $e(s) : null);
  return !r && !s ? null : {
    description: r ?? "Resistência do alvo.",
    formula: gb(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: Er(e)
  };
}
function db(e) {
  return {
    description: jn(e, nb),
    skill: jn(e, ab),
    skillLabel: jn(e, rb)
  };
}
function mb(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function fb(e) {
  return Sr(e, `.${i}__resistance-description`);
}
function pb(e) {
  return Sr(e, yn);
}
function gb(e) {
  return Sr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Sr(e, t) {
  for (const n of e) {
    const a = n.querySelector(t);
    if (a) return a;
  }
  return null;
}
function hb(e, t) {
  return e ? t === null ? Nl : e.total >= t ? wr : Cr : xl;
}
function bb(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function yb(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function _b(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Ab(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function jn(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function Pl(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Tb(e) {
  return e === wr ? "succeeded" : e === Cr ? "failed" : "pending";
}
function Ml(e) {
  if (!e) return null;
  const t = e.actorId ? Eb(e.actorId) : null, n = t ? Rb(t, e.itemId, e.itemName) : null;
  return n || kb(e.itemId, e.itemName);
}
function Rb(e, t, n) {
  const a = e.items;
  if (t) {
    const o = a?.get?.(t);
    if (Fe(o)) return o;
  }
  const r = Zt(n);
  if (r) {
    const o = a?.find?.((s) => Fe(s) ? Zt(s.name) === r : !1);
    if (Fe(o)) return o;
  }
  return null;
}
function kb(e, t) {
  const n = game.items;
  if (e) {
    const r = n?.get?.(e);
    if (Fe(r)) return r;
  }
  const a = Zt(t);
  if (a) {
    const r = n?.find?.((o) => Fe(o) ? Zt(o.name) === a : !1);
    if (Fe(r)) return r;
  }
  return null;
}
function Eb(e) {
  const n = game.actors?.get?.(e);
  return $b(n) ? n : null;
}
function $b(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Fe(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Zt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ir(e) {
  const t = Gn(e);
  if (!t) return null;
  const n = wb().filter((o) => Gn(Cb(o)) === t).map((o) => Ol(o)).find(ft) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => ft(o) && Gn(o.name) === t);
  return ft(r) ? r : null;
}
function wb() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Cb(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ol(e)?.name ?? null;
}
function Ol(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ft(t)) return t;
  const n = e.document?.actor;
  return ft(n) ? n : null;
}
function ft(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Gn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Fl(e) {
  const t = vb();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Sb(e)
  });
}
function Sb(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Gt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", a = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", r = Ib(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Gt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Gt(e.actorName)}</strong></p>
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
function Ib(e) {
  const t = Lb(e.actor), n = e.newPV ?? t?.value ?? null, a = t?.max ?? null;
  if (n === null) return "";
  const r = a === null ? `${n}` : `${n}/${a}`;
  return `<li><strong>PV atual</strong>: ${Gt(r)}</li>`;
}
function Lb(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, a = Yo(n?.value);
  return a === null ? null : {
    value: a,
    max: Yo(n?.max)
  };
}
function Yo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function vb() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Gt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Db(e) {
  await Fl(xb(e));
}
function xb(e) {
  if (Nb(e)) return e;
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
function Nb(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Bl(e) {
  return e.mode, `✓ ${Ul(e.inputAmount)} PV`;
}
function Pb(e) {
  const t = Ul(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ul(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Mb {
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
    } : dn(t.resistanceGateMode, t.resistanceState) ? {
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
class Ob {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? we()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : dn(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Fb {
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
const Bb = `.${i}__actions`, Lr = `.${i}__actions-title`, Ge = `.${i}__button`, Ub = "data-paranormal-toolkit-action-section", zb = `${i}__button--executed`, qb = "data-paranormal-toolkit-executed-label";
function zl(e) {
  return me(e.querySelector(Lr)?.textContent);
}
function jb(e, t) {
  const n = e.querySelector(Lr);
  n && (n.textContent = t);
}
function kt(e, t) {
  const n = me(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((a) => {
    const r = a.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return me(r) === n;
  }) ?? null;
}
function vr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ve(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function ql(e) {
  const t = Gb(e.difficulty);
  if (t === null) return null;
  const n = Xo(e.skillLabel) ?? "Resistência", a = Xo(e.description), r = Vb(a, n), o = Hb(r, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Gb(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Xo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Vb(e, t) {
  if (!e) return null;
  const n = Qo(e), a = Qo(t);
  if (!n.startsWith(a)) return e;
  const r = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return r.length > 0 ? r : null;
}
function Hb(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const a = Number(n[1]);
  if (!Number.isFinite(a) || a !== t) return e;
  const r = e.slice(n[0].length).trim();
  return r.length > 0 ? r : null;
}
function Qo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const Nt = "data-paranormal-toolkit-prompt-id", jl = "multiTargetResistanceResults", Gl = "multiTargetDamageApplications", Vl = "multiTargetEffectApplications";
function Wb(e) {
  const t = /* @__PURE__ */ new Map(), a = Rn(e)?.[jl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    ey(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Kb(e, t) {
  await Dr(e, jl, t.targetId, t);
}
function Yb(e) {
  const t = /* @__PURE__ */ new Map(), a = Rn(e)?.[Gl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    ty(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Xb(e, t) {
  await Dr(
    e,
    Gl,
    t.targetId,
    t
  );
}
function Qb(e) {
  const t = /* @__PURE__ */ new Map(), a = Rn(e)?.[Vl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    ay(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Zb(e, t) {
  await Dr(
    e,
    Vl,
    t.targetId,
    t
  );
}
function Jb(e) {
  const t = Rn(e);
  return t ? {
    actorId: Vn(t.actorId),
    itemId: Vn(t.itemId),
    itemName: Vn(t.itemName)
  } : null;
}
async function Dr(e, t, n, a) {
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
  l && await Promise.resolve(o.setFlag?.(d, bn, {
    ...s,
    prompts: c
  }));
}
function Rn(e) {
  const t = Hl(e);
  if (!t) return null;
  const n = Wl(e), a = Kl(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => X(o) ? o.pendingId === t : !1) ?? null;
}
function Hl(e) {
  return (e.closest(`[${Nt}]`) ?? e.querySelector(`[${Nt}]`) ?? e.parentElement?.querySelector(`[${Nt}]`) ?? null)?.getAttribute(Nt) ?? null;
}
function Wl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return ry(r) ? r : null;
}
function Kl(e) {
  const t = e?.getFlag?.(d, bn);
  return X(t) ? t : null;
}
function ey(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function ty(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && ny(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function ny(e) {
  return e === "normal" || e === "half";
}
function ay(e) {
  return X(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Vn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ry(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function X(e) {
  return !!(e && typeof e == "object");
}
const oy = "data-paranormal-toolkit-resistance-skill", iy = "data-paranormal-toolkit-resistance-skill-label", Ta = "data-paranormal-toolkit-multi-target-section", xr = "data-paranormal-toolkit-multi-target-damage-info", Yl = "data-paranormal-toolkit-multi-target-effect-info", Xl = "data-paranormal-toolkit-multi-target-toggle", Ql = "data-paranormal-toolkit-multi-target-details", V = "data-paranormal-toolkit-multi-target-target", sy = "data-paranormal-toolkit-multi-target-state", Ra = "data-paranormal-toolkit-multi-target-roll-total", ka = "data-paranormal-toolkit-multi-target-roll-formula", Vt = "data-paranormal-toolkit-multi-target-roll-dice", Ea = "data-paranormal-toolkit-multi-target-roll-skill", $a = "data-paranormal-toolkit-multi-target-roll-skill-label", wa = "data-paranormal-toolkit-multi-target-roll-target-name", Ca = "data-paranormal-toolkit-multi-target-roll-rolled-at", Sa = "data-paranormal-toolkit-multi-target-damage-mode", Ia = "data-paranormal-toolkit-multi-target-damage-input-amount", Zo = "data-paranormal-toolkit-multi-target-damage-final-amount", Jo = "data-paranormal-toolkit-multi-target-damage-blocked", La = "data-paranormal-toolkit-multi-target-damage-target-name", va = "data-paranormal-toolkit-multi-target-damage-applied-at", Da = "data-paranormal-toolkit-multi-target-effect-condition-id", xa = "data-paranormal-toolkit-multi-target-effect-condition-label", Na = "data-paranormal-toolkit-multi-target-effect-effect-id", Pa = "data-paranormal-toolkit-multi-target-effect-created", Ma = "data-paranormal-toolkit-multi-target-effect-refreshed", Oa = "data-paranormal-toolkit-multi-target-effect-target-name", Fa = "data-paranormal-toolkit-multi-target-effect-applied-at", ly = new yl(kl()), cy = new pl(new fl()), uy = new gl(new Rr()), dy = new Fb(uy), my = new Mb(cy), fy = new Ob(ly), py = xl, Je = wr, Et = Cr, gy = Nl;
function hy(e) {
  const t = Zl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), $y(e);
  const n = wy(e.rollCard, t), a = Cy(e.rollCard, t);
  !n && a && c_(e.rollCard, a, e.effectSection);
  const r = xy(e.rollCard);
  return tc(r, t), i_(
    e.rollCard,
    r,
    Sy(e.rollCard, {
      damageInfo: n,
      effectInfo: a,
      effectSection: e.effectSection
    })
  ), n && a && u_(e.rollCard, a, r), !0;
}
function Zl(e) {
  return ob({
    ...e,
    resistanceResults: _y(e.rollCard),
    damageApplications: Ay(e.rollCard),
    effectApplications: Ty(e.rollCard),
    resolveTargetConditionApplication: by,
    resistanceGateMode: Pr()
  });
}
function by(e, t, n) {
  const a = Jb(e), r = Ml(a);
  if (!r) return null;
  const o = Tt(r);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = yy(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function yy(e, t, n) {
  const a = Ch(
    e,
    n,
    t,
    Hn
  );
  if (a) return a;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const r = Hn(t);
  return r ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => Hn(s) === r)) ?? null : null;
}
function _y(e) {
  const t = Wb(e);
  for (const [n, a] of Ey(e))
    t.set(n, a);
  return t;
}
function Ay(e) {
  const t = Yb(e);
  for (const [n, a] of ky(e))
    t.set(n, a);
  return t;
}
function Ty(e) {
  const t = Qb(e);
  for (const [n, a] of Ry(e))
    t.set(n, a);
  return t;
}
function Ry(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = n.getAttribute(Da), o = n.getAttribute(xa), s = n.getAttribute(Na), l = ni(n.getAttribute(Pa)), c = ni(n.getAttribute(Ma)), u = n.getAttribute(Oa), m = n.getAttribute(Fa);
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
function ky(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = n.getAttribute(Sa), o = dc(n.getAttribute(Ia)), s = n.getAttribute(La), l = n.getAttribute(va);
    !a || !f_(r) || o === null || !s || !l || t.set(a, {
      targetId: a,
      targetName: s,
      mode: r,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Ey(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = dc(n.getAttribute(Ra)), o = n.getAttribute(ka), s = n.getAttribute(Ea), l = n.getAttribute($a), c = n.getAttribute(wa), u = n.getAttribute(Ca);
    !a || r === null || !o || !s || !l || !c || !u || t.set(a, {
      targetId: a,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: r,
      diceBreakdown: n.getAttribute(Vt),
      rolledAt: u
    });
  }
  return t;
}
function $y(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function wy(e, t) {
  if (!t.damage)
    return Jl(e)?.remove(), null;
  const n = Iy(e);
  return Ly(n, t.damage), Dy(e, n), n;
}
function Cy(e, t) {
  if (!t.effect)
    return uc(e)?.remove(), null;
  const n = s_(e);
  return l_(n, t.effect), n;
}
function Sy(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : kt(e, "Conjuração");
}
function Iy(e) {
  const t = Jl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(xr, "true"), n;
}
function Jl(e) {
  return e.querySelector(`[${xr}="true"]`);
}
function Ly(e, t) {
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
  const r = Kh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return vy(r, a), r;
}
function vy(e, t) {
  const n = e.querySelector(_n), a = e.querySelector(Ar);
  if (!n || !a) return;
  e.classList.toggle(_r, t), n.hidden = !t, a.classList.add(Tr), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-expanded", t ? "true" : "false"), a.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", a.setAttribute("aria-label", a.title);
  const r = a.querySelector("i") ?? document.createElement("i");
  r.classList.add("fa-solid"), r.classList.toggle("fa-chevron-down", !t), r.classList.toggle("fa-chevron-up", t), r.setAttribute("aria-hidden", "true"), r.parentElement || a.append(r);
}
function Dy(e, t) {
  const n = kt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function xy(e) {
  const t = e.querySelector(`[${Ta}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Ta, "true"), n;
}
function tc(e, t) {
  const n = Ny(e), a = My(t.resistance), r = [Py(t)];
  a && r.push(a), r.push(By(t, n)), e.replaceChildren(...r);
}
function Ny(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${V}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(V)).filter(m_)
  );
}
function Py(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const a = document.createElement("span");
  return a.classList.add(`${i}__targets-status`), a.textContent = Fy(e.targets), t.append(n, a), t;
}
function My(e) {
  const t = ql({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Oy(n, t), n;
}
function Oy(e, t) {
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
function Fy(e) {
  const t = e.length, n = e.filter((l) => l.state === Et).length, a = e.filter((l) => l.state === Je).length, r = e.filter((l) => l.state === py).length, o = e.filter((l) => l.state === gy).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), a > 0 && s.push(`${a} ${a === 1 ? "sucesso" : "sucessos"}`), r > 0 && s.push(`${r} ${r === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function By(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const a of e.targets)
    n.append(Uy(a, e, t.has(a.id)));
  return n;
}
function Uy(e, t, n) {
  const a = document.createElement("article");
  a.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && a.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && a.classList.add(`${i}__target-row--effect-applied`), a.setAttribute(V, e.id), a.setAttribute(sy, e.state), a.setAttribute("aria-expanded", n ? "true" : "false"), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), nc(a, e.resistanceResult), ac(a, e.damageApplication), rc(a, e.effectApplication);
  const r = zy(e, t, a), o = n_(e, t);
  return o.hidden = !n, a.addEventListener("click", (s) => {
    ti(s.target) || ei(a);
  }), a.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || ti(s.target) || (s.preventDefault(), ei(a));
  }), a.append(r, o), a;
}
function nc(e, t) {
  if (!t) {
    e.removeAttribute(Ra), e.removeAttribute(ka), e.removeAttribute(Vt), e.removeAttribute(Ea), e.removeAttribute($a), e.removeAttribute(wa), e.removeAttribute(Ca);
    return;
  }
  e.setAttribute(Ra, String(t.total)), e.setAttribute(ka, t.formula), e.setAttribute(Ea, t.skill), e.setAttribute($a, t.skillLabel), e.setAttribute(wa, t.targetName), e.setAttribute(Ca, t.rolledAt), t.diceBreakdown ? e.setAttribute(Vt, t.diceBreakdown) : e.removeAttribute(Vt);
}
function ac(e, t) {
  if (!t) {
    e.removeAttribute(Sa), e.removeAttribute(Ia), e.removeAttribute(Zo), e.removeAttribute(Jo), e.removeAttribute(La), e.removeAttribute(va);
    return;
  }
  e.setAttribute(Sa, t.mode), e.setAttribute(Ia, String(t.inputAmount)), e.removeAttribute(Zo), e.removeAttribute(Jo), e.setAttribute(La, t.targetName), e.setAttribute(va, t.appliedAt);
}
function rc(e, t) {
  if (!t) {
    e.removeAttribute(Da), e.removeAttribute(xa), e.removeAttribute(Na), e.removeAttribute(Pa), e.removeAttribute(Ma), e.removeAttribute(Oa), e.removeAttribute(Fa);
    return;
  }
  e.setAttribute(Da, t.conditionId), e.setAttribute(xa, t.conditionLabel), e.setAttribute(Na, t.effectId ?? ""), e.setAttribute(Pa, String(t.created)), e.setAttribute(Ma, String(t.refreshed)), e.setAttribute(Oa, t.targetName), e.setAttribute(Fa, t.appliedAt);
}
function zy(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary`);
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary-main`);
  const o = qy(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = jy(e, t.resistance);
  Wy(l, n, e, t);
  const c = t_(n);
  r.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), lc(u, [
    oc(e, t, "compact"),
    sc(e, t, "compact")
  ]), a.append(r, u), a;
}
function qy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function jy(e, t) {
  if (!Le())
    return Gy(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Hy(e, t)), t?.skill && (n.setAttribute(oy, t.skill), n.setAttribute(iy, t.skillLabel ?? $e(t.skill))), !t?.skill)
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
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === Je ? "✓" : e.state === Et ? "✕" : "", n.append(a, r), n;
}
function Gy(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Vy(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === Je ? "✓" : e.state === Et ? "✕" : "", n.append(a, r), n;
}
function Vy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const a = e.state === Je ? "sucesso" : e.state === Et ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}.`;
}
function Hy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const a = e.state === Je ? "sucesso" : e.state === Et ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}. Rolar novamente`;
}
function Wy(e, t, n, a) {
  !(e instanceof HTMLButtonElement) || !Le() || e.addEventListener("click", (r) => {
    r.stopPropagation(), Ky(t, e, n, a);
  });
}
async function Ky(e, t, n, a) {
  if (!Le()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const r = a.resistance, o = r?.skill, s = r?.skillLabel ?? (o ? $e(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Ir(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await dy.execute({ actor: l, skill: o, skillLabel: s });
    await d_(u.roll);
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
      await Kb(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    Nr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Nr(e) {
  const t = e.closest(`[${Ta}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const a = Zl({
    rollCard: n,
    damageSection: Yy(n) ?? kt(n, "Dano"),
    effectSection: Xy(n)
  });
  a && tc(t, a);
}
function Yy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(xr) !== "true") ?? null;
}
function Xy(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Qy(e) {
  return Ze(e.assistedActions.policy.damageActionState);
}
function Zy(e) {
  return Ze(e.assistedActions.policy.effectActionState);
}
function Pr() {
  try {
    return dr();
  } catch {
    return "strict";
  }
}
function oc(e, t, n) {
  if (e.damageApplication)
    return ue(
      "✓",
      Bl({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const a = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Ze(a))
    return ue(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = ic(r, t.damage);
  if (o === null)
    return ue(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Pb({ inputAmount: o, mode: r, compact: n === "compact" }), l = r === "half" ? "🛡️" : "⚡", c = r === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = ue(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${V}]`);
    g && Jy(g, u, e, t);
  }), u;
}
function ic(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Jy(e, t, n, a) {
  if (n.damageApplication) return;
  if (Qy(n)) {
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
  const l = Ir(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await my.execute({
      actor: l,
      amount: s,
      damageType: r.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Pr(),
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
      await Xb(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await Db(u.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    Nr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function sc(e, t, n) {
  const a = e.assistedActions.policy.effectActionState, r = e.effect ?? t.effect;
  if (e.effectApplication)
    return ue(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!r) return null;
  if (Ze(a))
    return ue(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Cl(a))
    return ue(
      "✓",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = ue(
    "✦",
    n === "full" ? `Aplicar ${r.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${r.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${V}]`);
    l && e_(l, o, e, t);
  }), o;
}
async function e_(e, t, n, a) {
  if (n.effectApplication) return;
  if (Zy(n)) {
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
  const o = Ir(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await fy.execute({
      actor: o,
      conditionId: r.conditionId,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source,
      resistanceGateMode: Pr(),
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
      await Zb(a.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Nr(e);
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
function ue(e, t, n, a) {
  const r = document.createElement("button");
  r.type = "button", r.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), r.disabled = a;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, r.append(o, s), r;
}
function t_(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Xl, "true"), t.setAttribute("aria-hidden", "true"), cc(e, t), t;
}
function ei(e) {
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
function ti(e) {
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
function n_(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Ql, "true");
  const a = document.createElement("div");
  a.classList.add(`${i}__target-resistance-details`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", a.append(r, o);
  const s = a_(e, t.resistance);
  s && a.append(s);
  const l = r_(e, t.resistance), c = o_(e, t);
  return n.append(a, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function a_(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const a = e.state === Je ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${a}`, n;
}
function r_(e, t) {
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
function o_(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), lc(n, [
    oc(e, t, "full"),
    sc(e, t, "full")
  ]), n;
}
function i_(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function s_(e) {
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
function l_(e, t) {
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
function c_(e, t, n) {
  const a = n?.parentElement === e ? n : kt(e, "Conjuração");
  if (!a) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === a || e.insertBefore(t, a.nextElementSibling);
}
function u_(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Hn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function d_(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function m_(e) {
  return typeof e == "string" && e.length > 0;
}
function f_(e) {
  return e === "normal" || e === "half";
}
function ni(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function dc(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const ai = "data-paranormal-toolkit-card-layout-refresh-bound";
function p_(e) {
  const t = e.rollCard.querySelector(yn);
  t && t.getAttribute(ai) !== "true" && (t.setAttribute(ai, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Be = "data-paranormal-toolkit-prompt-id", g_ = "apply-damage", h_ = "data-paranormal-toolkit-multi-target-damage-info";
function b_(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(h_) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function y_(e) {
  const t = A_(e);
  return t.find((n) => n.getAttribute(Ub) === g_) ?? t.find((n) => zl(n) === "aplicar danos") ?? null;
}
function __(e) {
  const t = mc(e), n = ri(t);
  return n || ri(T_(e));
}
function ri(e) {
  return e.find((t) => {
    const n = zl(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function A_(e) {
  const t = mc(e);
  return t.length > 0 ? t : Mr(e);
}
function mc(e) {
  const t = E_(e);
  return t ? Mr(e).filter((n) => k_(n, t)) : [];
}
function T_(e) {
  const t = fc(e);
  if (!t) return [];
  const n = R_(e, t);
  return Mr(e).filter((a) => !a.closest(`.${i}__roll-card`)).filter((a) => pc(e, a)).filter((a) => !n || $_(a, n));
}
function Mr(e) {
  const t = fc(e);
  return t ? Array.from(t.querySelectorAll(Bb)) : [];
}
function fc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function R_(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && pc(e, n)) ?? null;
}
function k_(e, t) {
  return e.getAttribute(Be) === t ? !0 : Array.from(e.querySelectorAll(`[${Be}]`)).some((n) => n.getAttribute(Be) === t);
}
function E_(e) {
  return e.getAttribute(Be) ?? e.querySelector(`[${Be}]`)?.getAttribute(Be) ?? null;
}
function pc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function $_(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function w_(e) {
  const t = gc(), n = Tn(e.rollCard).state, a = $r({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), r = a.policy.effectActionState, o = Ze(r), s = Cl(r);
  return e.applied ? rt({
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
  }) : a.policy.canShowApplyEffect ? rt(o ? {
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
  }) : rt({
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
function rt(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function C_(e) {
  const { rollCard: t } = e, n = L_(), a = gc(), r = Tn(t).state, o = $r({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: a,
    resistanceState: r,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Ze(s), c = I_(e);
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
      summary: S_(r)
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
function S_(e) {
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
function I_(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function L_() {
  try {
    return tm();
  } catch {
    return "assisted";
  }
}
function gc() {
  try {
    return dr();
  } catch {
    return "strict";
  }
}
const v_ = "data-paranormal-toolkit-damage-resolution-state", oi = "data-paranormal-toolkit-damage-icon-enhanced", Or = "data-paranormal-toolkit-damage-original-label", D_ = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, hc = "Outra opção escolhida";
function x_(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), jb(t, "Aplicar dano"), N_(e, t);
}
function N_(e, t) {
  const n = Array.from(t.querySelectorAll(Ge)), a = si(n, "normal"), r = si(n, "half");
  if (!a || !r) {
    P_(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  li(a, "normal"), li(r, "half");
  const o = C_({
    rollCard: e,
    normalButtonApplied: Jt(a),
    halfButtonApplied: Jt(r),
    normalButtonSkipped: Ba(a),
    halfButtonSkipped: Ba(r)
  });
  if (!o.canShowApplyDamage) {
    ci(a), ci(r), di(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), ii(a, o.normalButton), ii(r, o.halfButton), di(t, o.summary.state, o.summary.message);
}
function ii(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    O_(e, t.visible), F_(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function P_(e) {
  for (const t of e)
    Ba(t) && t.remove();
}
function Jt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(hc);
}
function Ba(e) {
  return e.textContent?.includes(hc) ?? !1;
}
function si(e, t) {
  const n = D_[t];
  return e.find((a) => n.test(M_(a))) ?? null;
}
function M_(e) {
  return [
    e.getAttribute(Or),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function li(e, t) {
  if (e.getAttribute(oi) === "true") return;
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
  ), e.setAttribute(oi, "true"), e.setAttribute(Or, n), e.setAttribute("aria-label", n), e.replaceChildren(a, ve(n));
}
function ci(e) {
  Jt(e) || e.remove();
}
function O_(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function F_(e, t, n, a = "Role resistência") {
  if (!Jt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", a), e.replaceChildren(ve(a));
      return;
    }
    e.removeAttribute("aria-disabled"), B_(e, n);
  }
}
function B_(e, t) {
  const n = e.getAttribute(Or) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(U_(t), ve(n)));
}
function U_(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function di(e, t, n) {
  e.setAttribute(v_, t);
  const a = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    a?.remove();
    return;
  }
  const r = a ?? document.createElement("span");
  r.classList.add(`${i}__damage-resolution-summary`), r.textContent = n, a || e.querySelector(Lr)?.after(r);
}
const bt = "data-paranormal-toolkit-effect-icon-enhanced", Ve = "data-paranormal-toolkit-effect-action-compacted", kn = "data-paranormal-toolkit-effect-resistance-gate", Fr = "data-paranormal-toolkit-effect-section", Br = "data-paranormal-toolkit-effect-label";
function z_(e) {
  return e.querySelector(`[${Fr}="true"]`);
}
function q_(e) {
  const t = G_(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? H_(), a = tA(n, e.sourceActions, t);
  return a && n.setAttribute(Br, a), W_(n, t, a), J_(e.rollCard, n, e.after ?? e.fallbackAfter), eA(e.sourceActions, n), n;
}
function j_(e, t) {
  const n = t.querySelector(Ge);
  if (!n) return;
  const a = n.textContent?.trim() ?? "", r = Ac(t, n, a), o = bc(e, n), s = w_({
    rollCard: e,
    effectLabel: r,
    applied: zr(n, a),
    effectCanApplyOnSuccessfulResistance: o ? je(o) === "success" || je(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? wl(o) : !1
  });
  if (s.applied) {
    aA(n);
    return;
  }
  if (!s.visible) {
    rA(n);
    return;
  }
  if (s.waitingForResistance) {
    oA(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    iA(n, s.compactLabel);
    return;
  }
  sA(n), _c(n, s.displayLabel);
}
function G_(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ge) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ge) ?? []), a = [...t, ...n];
  return a.length === 0 ? null : V_(e.rollCard, a) ?? a[0] ?? null;
}
function V_(e, t) {
  const n = Tn(e).state, a = El(n), r = yc(e);
  if (r.length === 0) return null;
  for (const o of t) {
    const s = bc(e, o, r);
    if (s && $l(s, a)) return o;
  }
  return null;
}
function bc(e, t, n = yc(e)) {
  const a = Ur(t, t.textContent?.trim() ?? ""), r = Aa(a);
  return r ? n.find((o) => [o.label, o.conditionId].some((s) => Aa(s) === r)) ?? null : null;
}
function yc(e) {
  const t = Ml(Ph(e));
  if (!t) return [];
  const n = Tt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((a) => a.actor === "target") : [];
}
function H_() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Fr, "true"), e;
}
function W_(e, t, n) {
  e.setAttribute(Fr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const a = K_(e), r = Y_(a);
  r.textContent = "Efeito";
  const o = X_(e, a), s = Q_(o);
  s.textContent = lA(n ?? Ac(e, t, t.textContent?.trim() ?? ""));
  const l = Z_(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ge)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !zr(t, c) && !nA(t, c) && _c(t, n ?? c);
}
function K_(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Y_(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function X_(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(`${i}__effect-section-body`), t.after(a), a;
}
function Q_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function Z_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function J_(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function eA(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Ge)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function tA(e, t, n) {
  const a = e.getAttribute(Br);
  if (a && a.trim().length > 0) return a.trim();
  const r = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return r || Ur(n, n.textContent?.trim() ?? "");
}
function Ur(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && me(n) !== "efeito aplicado") return n;
  const a = Mh(e);
  if (a) return a;
  const r = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return r.length > 0 && me(r) !== "aplicado" ? r : null;
}
function zr(e, t) {
  return e.classList.contains(zb) || me(t).includes("aplicado");
}
function nA(e, t) {
  const n = e.getAttribute(kn);
  if (n === "pending" || n === "resisted") return !0;
  const a = Aa(t);
  return a.includes("resistiu") || a.includes("role resistencia");
}
function _c(e, t) {
  e.getAttribute(Ve) === "true" && e.getAttribute(bt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ve, "true"), e.setAttribute(bt, "true"), e.setAttribute(qb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    vr("✦", `${i}__button-icon--effect`),
    ve("Aplicar")
  ));
}
function aA(e) {
  e.getAttribute(Ve) === "true" && me(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ve, "true"), e.setAttribute(bt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    vr("✓", `${i}__button-icon--effect-applied`),
    ve("Aplicado")
  ));
}
function Ac(e, t, n) {
  const a = e.getAttribute(Br) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return a && a.trim().length > 0 ? a.trim() : Ur(t, n) ?? n;
}
function rA(e) {
  zr(e, e.textContent?.trim() ?? "") || e.remove();
}
function oA(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ve), e.removeAttribute(bt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(kn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ve(t));
}
function iA(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ve), e.removeAttribute(bt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(kn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    vr("✓", `${i}__button-icon--effect-resisted`),
    ve(t)
  );
}
function sA(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(kn), e.removeAttribute("aria-disabled");
}
function lA(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const cA = "data-paranormal-toolkit-card-layout-normalized";
function uA(e) {
  const t = dA(e.rollCard), n = mA(t);
  return p_({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function dA(e) {
  return {
    rollCard: e,
    damageSection: b_(e),
    resistance: e.querySelector(yr),
    damageActions: y_(e),
    effectActionSource: __(e),
    effectSection: z_(e)
  };
}
function mA(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: a,
    damageActions: r,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(cA, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = kt(t, "Conjuração"), c = fA({
    rollCard: t,
    damageSection: n,
    resistance: a,
    fallbackAfter: l
  });
  n && r && (r.parentElement !== n && n.append(r), x_(t, r));
  const u = q_({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: pA(n, c),
    fallbackAfter: l
  });
  return u && j_(t, u), u;
}
function fA(e) {
  const { rollCard: t, damageSection: n, resistance: a, fallbackAfter: r } = e;
  return a ? n ? (a.parentElement !== n && n.append(a), n) : r ? (a.parentElement === t && a.previousElementSibling === r || t.insertBefore(a, r.nextElementSibling), a) : ((a.parentElement !== t || a.previousElementSibling !== null) && t.prepend(a), a) : null;
}
function pA(e, t) {
  return e ?? t;
}
const Tc = [0, 80, 180, 400, 900, 1600, 3e3], mi = /* @__PURE__ */ new WeakSet();
function gA(e) {
  Rc(e), hA(e);
}
function Rc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    kc(t);
}
function hA(e) {
  if (!mi.has(e)) {
    mi.add(e);
    for (const t of Tc)
      globalThis.setTimeout(() => {
        Rc(e);
      }, t);
  }
}
function kc(e) {
  const t = uA({
    rollCard: e,
    refreshDelaysMs: Tc,
    onRefresh: () => kc(e)
  });
  hy({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const bA = "data-paranormal-toolkit-resistance-roll-result-enhanced", fi = "data-paranormal-toolkit-resistance-original-description", yA = "data-paranormal-toolkit-resistance-skill", _A = "data-paranormal-toolkit-resistance-skill-label", AA = `${i}__resistance--without-roll-button`, TA = ["Fortitude", "Reflexos", "Vontade"];
function RA(e) {
  for (const t of Array.from(e.querySelectorAll(yr)))
    kA(t);
  gA(e);
}
function kA(e) {
  const t = e.querySelector(Rp), n = e.querySelector(sl), a = e.querySelector(yn), r = SA(a) ? a : null, o = e.querySelector(ll);
  if (!t && !n && !o && !a) return;
  e.classList.toggle(AA, !r);
  const s = CA(e, a);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!a || !a.contains(o)) && e.append(o), vA(o)), EA(e, a, n), r && (MA(r), r.parentElement !== e && e.append(r));
}
function EA(e, t, n) {
  if (!n) return;
  const a = e.closest(`.${i}__roll-card`);
  if (!a) return;
  const r = wA(n), o = ql({
    description: r,
    skillLabel: IA(t, r),
    difficulty: Er(a)
  });
  if (!o) {
    n.textContent = r, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  $A(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function $A(e, t) {
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
function wA(e) {
  const t = e.getAttribute(fi);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(fi, n), n;
}
function CA(e, t) {
  const n = e.querySelector(`.${No}`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(No), e.insertBefore(a, t?.parentElement === e ? t : e.firstChild), a;
}
function SA(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function IA(e, t) {
  const n = e?.getAttribute(_A) ?? e?.getAttribute(yA) ?? null;
  return n || LA(t);
}
function LA(e) {
  const t = pi(e);
  return TA.find((n) => t.startsWith(pi(n))) ?? null;
}
function pi(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function vA(e) {
  const t = DA(e.textContent ?? "");
  t && (e.setAttribute(bA, "true"), e.replaceChildren(PA(t)));
}
function DA(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, a, r] = t, o = n?.trim() ?? "Resistência", s = Number(r);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = xA(a ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function xA(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: NA(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function NA(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function PA(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const a = OA(e);
  return a && t.append(a), t;
}
function MA(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Tn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const a = n.kind === "succeeded" ? "succeeded" : "failed", r = a === "succeeded" ? "✓" : "✕", o = a === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${a}`), e.textContent = `${n.total} ${r}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function OA(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of FA(e.diceValues, e.formula)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), n.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(n.value), t.append(a);
  }
  return t;
}
function FA(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? gi(e, "highest") : n.includes("kl") ? gi(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function gi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function BA(e) {
  for (const t of Array.from(e.querySelectorAll(_p))) {
    const n = HA(t);
    UA(t), n && (zA(t, n), qA(t, n));
  }
}
function UA(e) {
  for (const t of Array.from(e.querySelectorAll(Ap)))
    t.remove();
}
function zA(e, t) {
  const a = e.closest(`.${i}`)?.querySelector(il) ?? null, r = a?.querySelector(yp) ?? null, o = a ?? e, s = o.querySelector($p);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = cT(t.elementTone), l.textContent = lT(t), !s) {
    if (r?.parentElement === o) {
      r.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function qA(e, t) {
  const n = jA(e);
  GA(e, n);
  const a = VA(t);
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
function jA(e) {
  return e.closest(`.${i}`)?.querySelector(il) ?? null;
}
function GA(e, t) {
  const n = [e, t].filter((a) => a !== null);
  for (const a of n)
    for (const r of Array.from(a.querySelectorAll(wp)))
      r.remove();
}
function VA(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ga(e.target)}` : null,
    e.duration ? `Duração: ${ga(e.duration)}` : null,
    e.resistance ? `Resistência: ${Qs(e.resistance)}` : null
  ].filter(pn);
}
function HA(e) {
  const t = WA(e), n = JA(e), r = (t ? ZA(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = qr(K(r, "element")), l = ne("op.elementChoices", s) ?? hi(Te(o, "Elemento")) ?? hi(n.damageType), c = s ?? uT(l), u = K(r, "circle") ?? Te(o, "Círculo"), m = nT(r) ?? Te(o, "Alvo"), g = iT(r, "duration", "op.durationChoices") ?? Te(o, "Duração"), _ = eT(e) ?? rT(r) ?? Te(o, "Resistência"), k = tT(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: _
  };
  return sT(R) ? R : null;
}
function WA(e) {
  const t = KA(e);
  if (!t) return null;
  const n = t.getFlag?.(d, bn), a = XA(n);
  if (a.length === 0) return null;
  const r = YA(e);
  if (r.size > 0) {
    const o = a.find((s) => s.pendingId && r.has(s.pendingId));
    if (o) return o;
  }
  return a.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function KA(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? fr()?.messages?.get?.(n) ?? null : null;
}
function YA(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const a of Array.from(t.querySelectorAll(`[${xo}]`))) {
    const r = a.getAttribute(xo)?.trim();
    r && n.add(r);
  }
  return n;
}
function XA(e) {
  if (!fn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(QA).filter((n) => n !== null) : [];
}
function QA(e) {
  return fn(e) ? {
    pendingId: zt(e.pendingId),
    actorId: zt(e.actorId),
    itemId: zt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Km) : []
  } : null;
}
function ZA(e) {
  if (!e.itemId) return null;
  const t = fr(), a = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return a || (t?.items?.get?.(e.itemId) ?? null);
}
function JA(e) {
  let t = null, n = null;
  for (const a of Array.from(e.querySelectorAll(Tp))) {
    const r = Qe(a.textContent);
    if (!r) continue;
    const o = Wm(r, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(r) && (t = r);
  }
  return { cost: t, damageType: n };
}
function eT(e) {
  const t = Qe(e.querySelector(sl)?.textContent);
  return t ? Qs(t) : null;
}
function Te(e, t) {
  const n = gt(t);
  for (const a of e) {
    const r = a.indexOf(":");
    if (!(r < 0 || gt(a.slice(0, r)) !== n))
      return Qe(a.slice(r + 1));
  }
  return null;
}
function tT(e) {
  const t = Te(e, "Custo") ?? Te(e, "PE");
  return t || (e.map(Qe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function nT(e) {
  const t = K(e, "target");
  if (!t) return null;
  if (t === "area")
    return aT(e) ?? ne("op.targetChoices", t) ?? "Área";
  const n = ne("op.targetChoices", t) ?? de(t);
  return [t === "people" || t === "creatures" ? K(e, "targetQtd") : null, n].filter(pn).join(" ");
}
function aT(e) {
  const t = K(e, "area.name"), n = K(e, "area.size"), a = K(e, "area.type"), r = t ? ne("op.areaChoices", t) ?? de(t) : null, o = a ? ne("op.areaTypeChoices", a) ?? de(a) : null;
  return r ? n ? o ? `${r} ${n}m ${ga(o)}` : `${r} ${n}m` : r : null;
}
function rT(e) {
  const t = K(e, "skillResis"), n = K(e, "resistance");
  if (!t || !n) return null;
  const a = ne("op.skill", t) ?? de(t), r = oT(n);
  return [a, r].filter(pn).join(" ");
}
function oT(e) {
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
      return ne("op.resistanceChoices", e) ?? de(e);
  }
}
function iT(e, t, n) {
  const a = K(e, t);
  return a ? ne(n, a) ?? de(a) : null;
}
function sT(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function lT(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function cT(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(pn).join(" ");
}
function qr(e) {
  const t = gt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function hi(e) {
  const t = qr(e);
  return t ? ne("op.elementChoices", t) ?? de(t) : e ? de(e) : null;
}
function uT(e) {
  return qr(e);
}
function ne(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, a = fr()?.i18n?.localize?.(n);
  return !a || a === n ? null : a;
}
const bi = "data-paranormal-toolkit-dice-toggle-enhanced";
function dT(e) {
  for (const t of Array.from(e.querySelectorAll(ul)))
    Ec(t);
}
function mT(e) {
  const t = wc(e.target);
  if (!t) return;
  const n = jr(t);
  n && (e.preventDefault(), $c(n, t));
}
function fT(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = wc(e.target);
  if (!t) return;
  const n = jr(t);
  n && (e.preventDefault(), $c(n, t));
}
function Ec(e) {
  const t = e.querySelector(_n);
  if (!t) return;
  const n = e.querySelector(Ar);
  if (n && n.getAttribute(bi) !== "true" && (n.setAttribute(bi, "true"), n.classList.add(Tr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-chevron-down"), a.setAttribute("aria-hidden", "true"), n.append(a);
  }
}
function $c(e, t) {
  const n = e.querySelector(_n);
  if (!n) return;
  const a = !e.classList.contains(_r);
  pT(e, t, n, a);
}
function pT(e, t, n, a) {
  e.classList.toggle(_r, a), n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.title = a ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const r = t.querySelector("i");
  r && (r.classList.toggle("fa-chevron-down", !a), r.classList.toggle("fa-chevron-up", a));
}
function wc(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Ar);
  if (!t) return null;
  const n = jr(t);
  return n ? (Ec(n), t.classList.contains(Tr) ? t : null) : null;
}
function jr(e) {
  const t = e.closest(ul);
  return t && t.querySelector(_n) ? t : null;
}
const yi = `${d}-workflow-dice-toggle-styles`;
function gT() {
  if (document.getElementById(yi)) return;
  const e = document.createElement("style");
  e.id = yi, e.textContent = `
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
const hT = [0, 100, 500, 1500, 3e3];
let _i = !1, Wn = null;
function bT() {
  if (!_i) {
    _i = !0, gT(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ut(Kt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ut(Kt(t));
    }), Hooks.once("ready", () => {
      ut(document), yT();
    }), document.addEventListener("click", mT), document.addEventListener("keydown", fT);
    for (const e of hT)
      globalThis.setTimeout(() => ut(document), e);
  }
}
function yT() {
  Wn || !document.body || (Wn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ut(n);
  }), Wn.observe(document.body, { childList: !0, subtree: !0 }));
}
function ut(e) {
  e && (Gp(e), BA(e), RA(e), dT(e), Mp(e));
}
function _T() {
  bT();
}
const AT = "data-paranormal-toolkit-action-section", TT = "ritual-log", RT = ".paranormal-toolkit-item-use-prompt__actions", kT = ".paranormal-toolkit-item-use-prompt__actions-title", ET = [0, 100, 500, 1500];
let Ai = !1;
function $T() {
  if (Ai) return;
  const e = (t, n) => {
    Ti(IT(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Ti(document), Ai = !0;
}
function Ti(e) {
  for (const t of ET)
    globalThis.setTimeout(() => wT(e), t);
}
function wT(e) {
  CT(e), ST(e);
}
function CT(e) {
  for (const t of e.querySelectorAll(
    `[${AT}="${TT}"]`
  ))
    t.remove();
}
function ST(e) {
  for (const t of e.querySelectorAll(RT)) {
    if (Ri(t.querySelector(kT)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Ri(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function IT(e) {
  if (e instanceof HTMLElement || LT(e))
    return e;
  if (vT(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function LT(e) {
  return e instanceof HTMLElement;
}
function vT(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Ri(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const dt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Cc = {
  PV: "system.attributes.hp"
}, Ua = {
  PV: [dt.PV, Cc.PV],
  SAN: [dt.SAN],
  PE: [dt.PE],
  PD: [dt.PD]
}, za = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class DT {
  getResource(t, n) {
    const a = ki(t, n);
    if (!a.ok)
      return p(a.error);
    const r = a.value, o = `${r}.value`, s = `${r}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = $i(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = $i(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, a) {
    const r = ki(t, n);
    if (!r.ok)
      throw new Error(r.error.message);
    await t.update({ [`${r.value}.value`]: a });
  }
}
function ki(e, t) {
  const n = xT(e.type, t);
  if (n && Ei(e, n))
    return y(n);
  const a = Ua[t].find(
    (r) => Ei(e, r)
  );
  return a ? y(a) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: NT(e, t),
    path: Ua[t].join(" | ")
  });
}
function xT(e, t) {
  return e === "threat" ? Cc[t] ?? null : e === "agent" ? dt[t] : null;
}
function Ei(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof a == "number" && Number.isFinite(a);
}
function NT(e, t) {
  const n = e.type ?? "unknown", a = Ua[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${a}.`;
}
function $i(e, t, n, a, r) {
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
class PT {
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
      const s = za.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: r } = n, o = MT(r);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: r
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of za.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, n);
      if (a != null)
        return { path: n, value: a };
    }
    return null;
  }
}
function MT(e) {
  if (wi(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (wi(n))
      return n;
  }
  return null;
}
function wi(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const OT = "dice-so-nice";
async function Sc(e) {
  if (!FT() || !BT()) return;
  const t = UT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function FT() {
  try {
    return bp().enabled;
  } catch {
    return !1;
  }
}
function BT() {
  return game.modules?.get?.(OT)?.active === !0;
}
function UT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Ci = "occultism";
class Ic {
  getDifficulty(t) {
    return zT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const a = await jT(t, Ci);
    if (!a)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Sc(a);
    const r = HT(a);
    return {
      skill: Ci,
      skillLabel: "Ocultismo",
      roll: a,
      formula: VT(a),
      total: r,
      difficulty: n,
      success: r >= n,
      diceBreakdown: WT(a)
    };
  }
}
function zT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function qT(e) {
  return new Ic().rollCastingCheck(e);
}
async function jT(e, t) {
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
  return GT(a);
}
function GT(e) {
  return Si(e) ? e : Array.isArray(e) ? e.find(Si) ?? null : null;
}
function Si(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function VT(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function HT(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function WT(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(KT);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function KT(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const YT = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class XT {
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
    const a = n.value, r = QT(t.ritual, a);
    return r.ok ? r.value ? y(r.value) : y({
      resource: "PE",
      amount: YT[a],
      source: "default-by-circle",
      circle: a
    }) : p(r.error);
  }
}
function QT(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : ZT(n) ? {
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
function ZT(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class JT {
  async applyPresetItemPatch(t, n) {
    const a = n.itemPatch;
    if (!a) return Kn("missing-item-patch");
    if (t.type !== "ritual") return Kn("unsupported-item-type");
    const r = eR(a);
    return Object.keys(r).length === 0 ? Kn("empty-update") : (await t.update(r), {
      applied: !0,
      updateData: r
    });
  }
}
function eR(e) {
  const t = {};
  O(t, "name", e.name), O(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (O(t, "system.circle", n.circle), O(t, "system.element", n.element), O(t, "system.target", n.target), O(t, "system.targetQtd", n.targetQuantity), O(t, "system.execution", n.execution), O(t, "system.range", n.range), O(t, "system.duration", n.duration), O(t, "system.skillResis", n.resistanceSkill), O(t, "system.resistance", n.resistance), O(t, "system.studentForm", n.studentForm), O(t, "system.trueForm", n.trueForm)), t;
}
function O(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Kn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class tR {
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
    return this.getNumber(t, za.ritual.dt, 0);
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
class nR {
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
class aR {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = rR(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Yn(t)), y(t)) : n;
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
    return n ? Yn(n) : null;
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
    return Array.from(this.presets.values()).map(Yn);
  }
  findForItem(t) {
    return this.list().map((n) => oR(n, t)).filter((n) => n !== null).sort((n, a) => a.score - n.score || n.preset.id.localeCompare(a.preset.id));
  }
}
function rR(e) {
  return !Xn(e.id) || !Xn(e.version) || !Xn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function oR(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, n.push(`itemType:${t.type}`);
  }
  for (const r of e.matchers) {
    const o = iR(r, t);
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
function iR(e, t) {
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
      const n = Ii(t.name), a = e.names.map(Ii).includes(n);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = sR(t), a = n !== null && e.circles.includes(n);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Ii(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function sR(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Yn(e) {
  return structuredClone(e);
}
function Xn(e) {
  return typeof e == "string" && e.length > 0;
}
function en(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = En(e.amountFrom);
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
function En(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function lR(e, t, n) {
  if (!Li(e.id) || !Li(e.formula))
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
  const n = e.intent ?? cR(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function cR(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Li(e) {
  return typeof e == "string" && e.length > 0;
}
async function tn(e, t, n, a, r) {
  switch (a) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Pt(t, n, a, r) : e.spend(t, n, r);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Pt(t, n, a, r) : e.damage(t, n, r);
    case "heal":
      return n !== "PV" ? Pt(t, n, a, r) : e.heal(t, n, r);
    case "recover":
      return n !== "SAN" ? Pt(t, n, a, r) : e.recover(t, n, r);
  }
}
function Pt(e, t, n, a) {
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
function uR(e) {
  const { step: t, context: n, transaction: a, stepIndex: r, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = dR(t, n, a, r);
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
    const s = mR(t, n, a, r);
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
function dR(e, t, n, a) {
  const r = En(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function mR(e, t, n, a) {
  const r = En(e.amountFrom);
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
function fR(e, t, n) {
  const a = En(e.amountFrom), r = a ? t.rolls[a] : void 0;
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
function pR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: a, step: t, metadata: r }), Dc("before", e), vi("before", e), vi("resolve", e);
}
function gR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: a, step: t, metadata: r }), Dc("apply", e);
}
function hR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: a, step: t, metadata: r });
}
function Dc(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t, l = bR(e, n.operation);
  l && s.emit(l, a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function vi(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function bR(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function yR(e, t, n) {
  return y(void 0);
}
async function _R(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return AR(e, t);
    case "spendRitualCost":
      return TR(e, t);
  }
}
async function AR(e, t) {
  const { context: n, resources: a } = e, r = en(t, n);
  return r.ok ? xc(await a.spend(n.sourceActor, t.resource, r.value), n) : p(r.error);
}
async function TR(e, t) {
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
async function RR(e) {
  const { step: t, context: n, stepIndex: a, lifecycle: r, execute: o } = e, s = kR(t);
  for (const c of s.before)
    r.emit(c, n, { stepIndex: a, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    r.emit(c, n, { stepIndex: a, step: t });
  return l;
}
function kR(e) {
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
class ER {
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
        return RR({
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
    const r = await _R({
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
    const r = await lR(t, a, n);
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, a) {
    const r = en(t, n);
    if (!r.ok)
      return p({ ...r.error, stepIndex: a, step: t, context: n });
    const o = fR(t, n, r.value);
    pR({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), gR({
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
      const c = await tn(this.resources, l, t.resource, t.operation, r.value), u = this.handleResourceOperationResult(c, n, a, t);
      if (!u.ok)
        return u;
      uR({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return hR({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, a) {
    const r = en(t, n);
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
      const l = await tn(this.resources, s, t.resource, t.operation, r.value), c = this.handleResourceOperationResult(l, n, a, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, a) {
    const r = await yR(this.messages);
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
    const l = $R(t, n.intent);
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
function $R(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class wR {
  emitCastStarted(t) {
    Hooks.callAll(Ut.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Ut.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Ut.ritual.castFinished, t);
  }
}
class CR {
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
class SR {
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
    id: IR(),
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
function IR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class LR {
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
    return Pe(this.lastContext);
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
class vR {
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
class DR {
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
    const n = da();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: xR(),
      flags: {
        ...t.flags,
        [d]: {
          ...NR(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const a = da();
    if (!a.enabled)
      return;
    const r = n.notification ?? Di(n);
    a.console && this.emitConsole(t, n), a.ui && this.emitUi(t, r);
  }
  emitConsole(t, n) {
    const a = Di(n);
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
function Di(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function xR() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function NR(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const PR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Pc = `${d}-inline-roll-neutralized`, MR = `${d}-inline-roll-notice`, Gr = `data-${d}-inline-roll-neutralized`, xi = `data-${d}-inline-roll-notice`, OR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ni(e) {
  const t = QR(e.message), n = await FR(e.message), a = BR(t);
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
async function FR(e) {
  const t = KR(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = UR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await YR(t, n.content), replacementCount: n.replacementCount };
}
function BR(e) {
  const t = e ? XR(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Mc(t);
  return n > 0 && Oc(VR(t)), { replacementCount: n };
}
function UR(e) {
  const t = zR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const a = Mc(n.content), r = t.replacementCount + a;
  return r === 0 ? { content: e, replacementCount: 0 } : (Oc(n.content), { content: n.innerHTML, replacementCount: r });
}
function zR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, r) => (t += 1, jR(r.trim()))), replacementCount: t };
}
function Mc(e) {
  const t = qR(e);
  for (const n of t)
    n.replaceWith(GR(HR(n)));
  return t.length;
}
function qR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(PR))
    n.getAttribute(Gr) !== "true" && t.add(n);
  return Array.from(t);
}
function jR(e) {
  return `<span class="${Pc}" ${Gr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${ZR(e)}</span>`;
}
function GR(e) {
  const t = document.createElement("span");
  return t.classList.add(Pc), t.setAttribute(Gr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Oc(e) {
  if (e.querySelector?.(`[${xi}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(MR), t.setAttribute(xi, "true"), t.textContent = OR, e.append(t);
}
function VR(e) {
  return e.querySelector(".message-content") ?? e;
}
function HR(e) {
  const n = e.getAttribute("data-formula") ?? WR(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function WR(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function KR(e) {
  return e && typeof e == "object" ? e : null;
}
async function YR(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function XR(e) {
  const t = JR(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function QR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function ZR(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function JR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const nn = "ritualRollConfig", an = "ritual-roll", ek = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function $n() {
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
  const t = e.getFlag(d, nn);
  return qa(t);
}
function Bc(e) {
  return Fc(e) ?? $n();
}
async function tk(e, t) {
  const n = qa(t) ?? qa({
    ...$n(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, nn, n), n;
}
async function nk(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, nn));
    return;
  }
  await e.setFlag(d, nn, null);
}
function qa(e) {
  if (!wn(e)) return null;
  const t = mk(e.intent);
  if (!t) return null;
  const n = $n();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: ja(e.damageType),
    utilityLabel: ja(e.utilityLabel) ?? n.utilityLabel,
    note: Vr(e.note),
    forms: pk(e.forms)
  };
}
function ak(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function rk(e) {
  const t = Fc(e), n = Uc(e);
  if (!t)
    return Pi(e, n);
  const a = uk(e, t);
  if (!a)
    return Pi(e, n);
  const r = ok(t, a), o = [
    { type: "spendRitualCost" },
    r,
    ...ik(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: lk(e, t),
    resistance: n
  };
}
function Pi(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: ck(e),
    resistance: t
  } : null;
}
function ok(e, t) {
  const n = {
    type: "rollFormula",
    id: an,
    formula: t,
    intent: dk(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function ik(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${an}.total`,
          ...sk(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${an}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function sk(e) {
  return e ? { damageType: e } : {};
}
function lk(e, t) {
  const n = {
    base: Qn("Padrão", t.forms.base.formula)
  };
  return He(e, "discente") && (n.discente = Qn("Discente", t.forms.discente.formula, 2)), He(e, "verdadeiro") && (n.verdadeiro = Qn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function Qn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [an]: t.trim()
    }
  };
}
function ck(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return He(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), He(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function uk(e, t) {
  return [
    t.forms.base.formula.trim(),
    He(e, "discente") ? t.forms.discente.formula.trim() : "",
    He(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((a) => a.length > 0) ?? null;
}
function Uc(e) {
  const t = zc(e), n = ja(t.skillResis), a = fk(t.resistance);
  if (!n || !a) return;
  const r = gk(n), o = ek[a];
  return {
    skill: n,
    label: r,
    effect: a,
    summary: `${r} ${o}`
  };
}
function dk(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function mk(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function fk(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function pk(e) {
  const t = $n();
  return wn(e) ? {
    base: Zn(e.base),
    discente: Zn(e.discente),
    verdadeiro: Zn(e.verdadeiro)
  } : t.forms;
}
function Zn(e) {
  return wn(e) ? { formula: Vr(e.formula) } : { formula: "" };
}
function He(e, t) {
  const n = zc(e), a = t === "discente" ? n.studentForm : n.trueForm;
  return hk(a);
}
function zc(e) {
  const t = e.system;
  return wn(t) ? t : {};
}
function gk(e) {
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
function hk(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Vr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function ja(e) {
  const t = Vr(e);
  return t.length > 0 ? t : null;
}
function wn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function bk(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function yk(e) {
  switch (_k(e)) {
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
      return Ak(String(e ?? ""));
  }
}
function _k(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function Ak(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function Tk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Rk(e) {
  return {
    ...Hr(e),
    type: "ritual.cast.started"
  };
}
function kk(e) {
  return {
    ...Hr(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function Ek(e) {
  return {
    ...Hr(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function $k(e) {
  if (e.type === "preset") {
    const t = Ee(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: Ee(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: Ee(e.label),
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
function wk(e, t = {}) {
  const n = zk(e), a = [
    ...jk(t.candidates ?? []),
    ...Gk(e)
  ], r = Hk(a) ?? { x: 0, y: 0, width: 0, height: 0 }, o = qk(t) ?? Wk(a) ?? Yk(r), s = Qk(canvas?.grid?.size), l = Ck(o, r, a), c = Pk(a), u = Nk(l);
  return {
    type: "rectangleRay",
    sceneId: Xk(e, n),
    regionId: qi(n?.id) ?? qi(e.id),
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
function Ck(e, t, n) {
  const a = {
    x: x(e, "x") ?? 0,
    y: x(e, "y") ?? 0,
    width: x(e, "width") ?? t.width,
    height: x(e, "height") ?? t.height,
    direction: x(e, "direction") ?? 0,
    elevation: x(e, "elevation")
  };
  return {
    ...a,
    direction: Sk(a, t, n)
  };
}
function Sk(e, t, n) {
  const a = Ik(n);
  return a !== null ? a : vk(e, t) ?? e.direction;
}
function Ik(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const a = Mi(n, t);
    if (a !== null) return a;
    const r = Cn(n), o = Mi(r, t);
    if (o !== null) return o;
  }
  return null;
}
function Mi(e, t) {
  for (const n of t) {
    const a = Lk(G(e, n));
    if (a !== null) return a;
  }
  return null;
}
function Lk(e) {
  const t = yt(e);
  if (t === null) return null;
  const n = Kr(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function vk(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Fi(Oi(e, e.direction), t), a = Dk(e, t);
  if (a === null) return null;
  const o = xk([
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
    error: Fi(Oi(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? Kr(o.direction) : null;
}
function Dk(e, t) {
  const n = e.width, a = e.height, r = n ** 2 - a ** 2;
  if (Math.abs(r) < 1e-3) return null;
  const o = (n * t.width - a * t.height) / r, s = (n * t.height - a * t.width) / r, l = ji(o, 0, 1), c = ji(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : Zk(Math.atan2(c, l));
}
function Oi(e, t) {
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
function Fi(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function xk(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const a = Kr(n);
    t.add(Math.round(a * 1e3) / 1e3);
  }
  return [...t];
}
function Nk(e) {
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
function Pk(e) {
  for (const t of e) {
    const n = Bi(t, "ray.start"), a = Bi(t, "ray.end");
    if (n && a) return { start: n, end: a };
  }
  return null;
}
function Bi(e, t) {
  const n = G(e, t), a = yt(G(n, "x")), r = yt(G(n, "y"));
  return a === null || r === null ? null : { x: a, y: r };
}
function Hr(e) {
  const t = $k(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: Fk(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: Mk(e.context.item, e.form, e.formLabel, t),
    targets: n.map(Bk),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function Mk(e, t, n, a) {
  return {
    name: e.name,
    slug: Jn(e, "system.slug") ?? Jn(e, "slug"),
    presetId: a.presetId,
    presetVersion: a.presetVersion,
    element: Jn(e, "system.element"),
    circle: Uk(e),
    form: Ok(t),
    formLabel: n
  };
}
function Ok(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function Fk(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function Bk(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function Uk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : Ee(t);
}
function Jn(e, t) {
  return Ee(foundry.utils.getProperty(e, t));
}
function Ee(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function zk(e) {
  return "document" in e && e.document ? e.document : e;
}
function qk(e) {
  return qc(e.shape);
}
function jk(e) {
  return e.filter(Wr);
}
function Gk(e) {
  return [
    e,
    Vk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Wr);
}
function Vk(e) {
  return "object" in e && Wr(e.object) ? e.object : null;
}
function Wr(e) {
  return !!(e && typeof e == "object");
}
function Hk(e) {
  for (const t of e) {
    const n = Ui(G(Cn(t), "bounds"));
    if (n) return n;
    const a = Ui(G(t, "bounds"));
    if (a) return a;
  }
  return null;
}
function Ui(e) {
  const t = x(e, "x"), n = x(e, "y"), a = x(e, "width"), r = x(e, "height");
  return t === null || n === null || a === null || r === null ? null : { x: t, y: n, width: a, height: r };
}
function x(e, t) {
  return yt(G(e, t));
}
function Wk(e) {
  for (const t of e) {
    const n = Kk(t).find((a) => a.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function Kk(e) {
  if (!e || typeof e != "object") return [];
  const t = zi(Cn(e));
  return t.length > 0 ? t : zi(e);
}
function zi(e) {
  const t = G(e, "shapes");
  return Array.isArray(t) ? t.map(qc).filter((n) => n !== null) : [];
}
function qc(e) {
  const t = Cn(e) ?? e, n = G(t, "type");
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
function Yk(e) {
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
function Xk(e, t) {
  return ea(e, "parent.id") ?? ea(e, "document.parent.id") ?? ea(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function ea(e, t) {
  return Ee(G(e, t));
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
function Cn(e) {
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
function qi(e) {
  return Ee(e);
}
function yt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Qk(e) {
  const t = yt(e);
  return t !== null && t > 0 ? t : null;
}
function jc(e) {
  return e * Math.PI / 180;
}
function Zk(e) {
  return e * 180 / Math.PI;
}
function Kr(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function ji(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class Jk {
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
class Sn {
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
const eE = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class tE {
  constructor(t = new Sn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = nE(t, this.foundryAdapter);
    for (const a of n)
      try {
        await a.run(), a.method;
        return;
      } catch {
        a.method;
      }
    this.foundryAdapter.warn(eE);
  }
}
function nE(e, t) {
  const n = [], a = aE(e), r = Gi(a), o = Gi(e);
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
function aE(e) {
  return rE(e) ? e.document ?? null : e;
}
function rE(e) {
  return "bounds" in e;
}
function Gi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const oE = 100, iE = 12;
class sE {
  constructor(t = new Sn()) {
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
      const r = this.foundryAdapter.getGridSize() ?? oE, o = mE(n), s = await this.foundryAdapter.placeRegion(
        lE(t, this.foundryAdapter.getUserColor(), r),
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
        message: dE(r)
      };
    }
  }
}
function lE(e, t, n) {
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
    shapes: [cE(e, n)]
  };
}
function cE(e, t) {
  const n = uE(e, t);
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
function uE(e, t) {
  return {
    length: Vi(e.length, iE, t),
    width: Vi(e.width, 1, t)
  };
}
function Vi(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function dE(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function mE(e) {
  const t = (n) => {
    const a = fE(n);
    a && e.onChange?.(a);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function fE(e) {
  return pE(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function pE(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class gE {
  constructor(t = new Sn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(Hi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Hi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = hE(t);
    bE(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Hi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function hE(e) {
  return Array.from(new Set(e));
}
function bE(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, a) => n === t[a]);
}
class yE {
  constructor(t = new Sn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Fs)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(_E(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(AE(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((a) => ({
      source: a.source,
      hasBounds: Ga(a.region)
    }));
    for (const a of t) {
      if (!Ga(a.region)) continue;
      const r = this.resolveRegionObjectTargetTokens(a.region);
      return a.source, r.tokens.length, r;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), a = RE(
      n.filter((r) => !r.actor || typeof r.document?.testInsideRegion != "function" ? !1 : r.document.testInsideRegion(t))
    );
    return n.length, a.length, { tokens: a, source: "regionObject" };
  }
}
function _E(e) {
  return [
    { source: "document", region: ke(e.document) },
    { source: "document.object", region: ke(e.document.object) },
    { source: "preview", region: ke(e.preview) },
    { source: "preview.document.object", region: ke(e.preview?.document?.object) }
  ];
}
function AE(e) {
  return [
    { source: "input", region: ke(e) },
    { source: "input.object", region: TE(e) ? ke(e.object) : null },
    { source: "input.document.object", region: Gc(e) ? ke(e.document?.object) : null }
  ];
}
function ke(e) {
  return Ga(e) ? e : null;
}
function Ga(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Mt(n.x) && Mt(n.y) && Mt(n.width) && Mt(n.height);
}
function Gc(e) {
  return "document" in e && "bounds" in e;
}
function TE(e) {
  return !Gc(e);
}
function RE(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return a ? t.has(a) ? !1 : (t.add(a), !0) : !0;
  });
}
function Mt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class kE {
  async minimizeForPlacement() {
    const t = [];
    for (const n of wE())
      await EE(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await $E(n);
      }
    };
  }
}
async function EE(e) {
  if (Vc(e) || !NE(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function $E(e) {
  if (Vc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function wE() {
  const e = /* @__PURE__ */ new Set();
  for (const t of CE())
    LE(t) && vE(t) && e.add(t);
  return [...e];
}
function CE() {
  return [
    ...Wi(SE()),
    ...Wi(IE())
  ];
}
function Wi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function SE() {
  return globalThis.ui?.windows ?? null;
}
function IE() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function LE(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function vE(e) {
  const t = DE(e), n = xE(t);
  return n === "Actor" || n === "Item";
}
function DE(e) {
  return e.document ?? e.object ?? null;
}
function xE(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function NE(e) {
  const t = PE(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function PE(e) {
  const t = e.element;
  if (Ki(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Ki(n)) return n;
  }
  return null;
}
function Ki(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function Vc(e) {
  return e.minimized === !0;
}
const ME = "Nenhum alvo encontrado na linha.";
class OE {
  constructor(t = new sE(), n = new yE(), a = new tE(), r = new gE(), o = new Jk(), s = new kE()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = BE(a), m = wk(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(ME), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = FE(c);
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
function FE(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function BE(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function UE(e) {
  return {
    header: {
      eyebrow: ws,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: KE(e.ritual)
    },
    forms: e.variantOptions.map((t) => zE(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: GE(e.targetNames, e.variantOptions, e.ritual),
    automation: WE(e.automationStatus ?? "assisted")
  };
}
function zE(e, t) {
  const n = qE(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? jE(t) : "—",
    details: n
  };
}
function qE(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function jE(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function GE(e, t, n) {
  const a = e.map((r) => r.trim()).filter((r) => r.length > 0);
  return {
    targetNames: a,
    targetText: a.length > 0 ? a.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: a.length > 0,
    forms: t.map((r) => VE(r, n))
  };
}
function VE(e, t) {
  const n = e.targeting ?? HE(t, e.variant), a = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function HE(e, t) {
  const n = Tt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function WE(e) {
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
function KE(e) {
  const t = e.system, n = [XE(t?.element), YE(t?.circle)].filter(JE);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function YE(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function XE(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (QE(e)) {
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
      return ZE(e);
  }
}
function QE(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function ZE(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function JE(e) {
  return typeof e == "string" && e.length > 0;
}
const Hc = ["base", "discente", "verdadeiro"];
function Yr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function rn(e) {
  return typeof e == "string" && Hc.includes(e);
}
const { ApplicationV2: e$ } = foundry.applications.api;
class pt extends e$ {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = UE(t), this.selectedVariant = this.model.forms.find((a) => a.checked && a.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: pt.onCast,
      cancel: pt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new pt(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const a = document.createElement("div");
    return a.className = "paranormal-toolkit-ritual-cast", a.innerHTML = this.renderContent(), a;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
    const r = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    a$(r, (o) => {
      this.selectedVariant = o, Va(r, o);
    }), Va(r, this.selectedVariant), r$(r, (o) => {
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
          ${this.model.forms.map(t$).join("")}
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
          ${this.model.targets.forms.map(n$).join("")}
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
    const n = l$(t), a = o$(n, this.spendResource, this.selectedVariant);
    this.settle(a), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function t$(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", a = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", r = e.details.map((o) => `<span>${v(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${a}"
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
      <span class="paranormal-toolkit-ritual-cast__form-details">${r}</span>
    </label>
  `;
}
function n$(e) {
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
function a$(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of n)
    r.addEventListener("click", () => Yi(e, r, t)), r.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Yi(e, r, t));
    });
  const a = Wc(e);
  a && t(a);
}
function Yi(e, t, n) {
  const a = t.querySelector('input[name="variant"]');
  !a || a.disabled || !rn(a.value) || (a.checked = !0, e.dataset.paranormalToolkitSelectedVariant = a.value, n(a.value), a.dispatchEvent(new Event("change", { bubbles: !0 })), Wc(e), Va(e, a.value));
}
function Wc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const a of t) {
    const r = a.querySelector('input[name="variant"]'), o = r?.checked === !0;
    a.setAttribute("aria-checked", o ? "true" : "false"), o && rn(r.value) && (n = r.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Va(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const a of n) {
    const r = a.dataset.paranormalToolkitTargetingForm === t;
    a.hidden = !r;
  }
}
function r$(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function o$(e, t, n) {
  const a = s$(e) ?? n, r = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = i$(e, a);
  return {
    variant: a,
    spendResource: r,
    areaTargeting: o
  };
}
function i$(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function s$(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (rn(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return rn(n) ? n : null;
}
function l$(e) {
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
async function c$(e) {
  return pt.request(e);
}
const Xr = {
  label: "Padrão"
}, u$ = {
  label: "Discente",
  extraCost: 2
}, d$ = {
  label: "Verdadeiro",
  extraCost: 5
};
class m$ {
  constructor(t, n, a, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = a, this.ritualEvents = r;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new OE();
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
    const r = this.resolveCostPreview(t), o = iw(n), s = aw(
      n,
      t.item,
      r,
      o
    ), l = await c$({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map(($) => $.name),
      cost: r,
      defaultSpendResource: mw(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = f$(l), u = lw(
      n,
      t.item,
      c.variant,
      o
    ), m = Tk(), g = u.label ?? Yr(c.variant), _ = _$(u), k = ($ = t.targets) => ({
      castId: m,
      context: t,
      automationSource: a,
      form: c.variant,
      formLabel: g,
      targets: $
    }), R = ($, S = t.targets, U = {}) => {
      this.ritualEvents.emitCastFinished(
        Ek({
          ...k(S),
          status: $,
          ...U
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      Rk(k())
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
    const b = p$(
      t,
      E.targets
    );
    E.areaSnapshot && this.ritualEvents.emitAreaResolved(
      kk({
        ...k(E.targets),
        area: E.areaSnapshot
      })
    );
    const I = Vs();
    let A = null;
    if (I) {
      const $ = await h$(
        this.resources,
        b.actor,
        c,
        u,
        r
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
        const S = await qT(
          b.actor
        );
        A = A$(
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
    const B = g$(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !I
      }
    );
    if (B.steps.length === 0) {
      const $ = sw(
        b,
        c
      ), S = Qi(
        n,
        b
      ), U = Xi(
        b.actor,
        A,
        u,
        r
      ), W = Zi(
        n,
        c,
        u,
        r,
        $,
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
      const St = [
        ...U,
        ...S.actions
      ];
      return St.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: $,
        itemUseContext: b,
        actions: St,
        summaryLines: W
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: $,
        itemUseContext: b,
        summaryLines: W
      });
    }
    const D = await this.workflow.runAutomation(B, {
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
    const H = D.value.context, L = w$(
      n,
      b,
      H,
      _
    ), q = Qi(
      n,
      b
    ), Ct = Xi(
      b.actor,
      A,
      u,
      r
    ), pe = Zi(
      n,
      c,
      u,
      r,
      H,
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
      ...Ct,
      ...L.actions,
      ...q.actions
    ];
    return C.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: H,
      itemUseContext: b,
      summaryLines: pe
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: H,
      itemUseContext: b,
      actions: C,
      summaryLines: pe
    });
  }
  async applyAction(t) {
    return tn(
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
function f$(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function p$(e, t) {
  return {
    ...e,
    targets: t
  };
}
function g$(e, t, n, a, r) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Zr(l) && (!r.includeCostSteps || !s))
      continue;
    const c = b$(l, n);
    c && o.push(c);
  }
  return r.includeCostSteps && s && a && fw(n.extraCost) && o.push({
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
async function h$(e, t, n, a, r) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = et(r, a);
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
function b$(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = y$(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function y$(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const a = n[t];
  return typeof a == "string" ? a.trim() : "";
}
function _$(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function A$(e, t, n) {
  const r = T$(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: r,
    success: e.total >= r
  };
}
function T$(e, t) {
  const n = et(e, t);
  return n ? bk(n.amount) : null;
}
function Xi(e, t, n, a) {
  if (!t || t.success) return [];
  const r = et(a, n);
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
function Qi(e, t) {
  const n = [];
  for (const a of e.conditionApplications ?? []) {
    const r = Qr(a.actor, t);
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
        R$(
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
function R$(e, t, n, a) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? $$(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: k$(
      e.duration ?? null,
      a
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: E$(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function k$(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function E$(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const a = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${a}`;
  }
  return e;
}
function $$(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function w$(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || C$(s, a)) continue;
    const l = en(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = Qr(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (S$(s)) {
        I$(
          o,
          u,
          L$(s, n, l.value)
        );
        continue;
      }
      r.push(D$(s, u, l.value));
    }
  }
  for (const s of o.values())
    r.push(
      ...v$(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: r };
}
function C$(e, t) {
  const n = Kc(e.amountFrom);
  return n !== null && t.has(n);
}
function S$(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function I$(e, t, n) {
  const a = M$(t), r = e.get(a);
  if (r) {
    r.entries.push(n);
    return;
  }
  e.set(a, {
    actor: t,
    entries: [n]
  });
}
function L$(e, t, n) {
  const a = Kc(e.amountFrom), r = a ? t.rolls[a]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? r ?? null,
    sourceRollId: a
  };
}
function v$(e, t, n, a) {
  const r = U$(e), o = r.length > 1 ? j$() : void 0;
  return r.map((s) => {
    const l = a.map(
      (u, m) => {
        const g = z$(u.amount, s);
        return {
          id: x$(u, s, m),
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
      label: N$(c, s, r.length > 1),
      executedLabel: P$(
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
function D$(e, t, n) {
  const a = t.name ?? "Ator sem nome", r = B$(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: O$(e, a, n),
    executedLabel: F$(e, a),
    actionSectionId: r.id,
    actionSectionTitle: r.title
  };
}
function x$(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function N$(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function P$(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function M$(e) {
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
function O$(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function F$(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function B$(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function U$(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function z$(e, t) {
  const n = e * t.multiplier, a = q$(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, a);
}
function q$(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function j$() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Qr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Zi(e, t, n, a, r, o, s = null) {
  return [
    `Forma: ${Yr(t.variant)}`,
    W$(t, n, a),
    ...H$(s),
    ...Object.values(r.rolls).flatMap(K$),
    ...G$(e, o),
    ...Y$(e.resistance),
    ...tw(n)
  ];
}
function G$(e, t) {
  return V$(e) ? Qr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function V$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function H$(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function W$(e, t, n) {
  const a = et(n, t);
  return a ? e.spendResource ? `Custo: ${a.amount} ${a.resource} gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function K$(e) {
  const n = [`${nw(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = X$(e.roll);
  return a && n.push(`Dados: ${a}`), e.damageType && n.push(`Tipo: ${yk(e.damageType)}`), n;
}
function Y$(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function X$(e) {
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
    const s = Q$(o);
    s && (ew(
      n,
      s.operator ?? a,
      s.value
    ), a = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Q$(e) {
  const t = Z$(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : J$(e);
}
function Z$(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function J$(e) {
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
function ew(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function tw(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function nw(e) {
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
function aw(e, t, n, a) {
  return Hc.map((r) => {
    const o = Yc(
      e,
      t,
      r,
      a
    ), s = o !== null;
    return {
      variant: r,
      label: o?.label ?? Yr(r),
      enabled: s,
      details: o ? rw(o, n) : [],
      finalCostText: o ? ow(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function rw(e, t, n) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  r.length > 0 ? a.push(r.join(", ")) : a.push("efeito manual");
  const o = et(t, e);
  return a.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), a;
}
function et(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function ow(e, t) {
  const n = et(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function iw(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Zr);
}
function sw(e, t) {
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
function lw(e, t, n, a) {
  return Yc(e, t, n, a) ?? Xr;
}
function Yc(e, t, n, a) {
  const r = e.ritualForms?.[n] ?? null;
  return r || (a ? uw(t, n) ? cw(n) : null : n === "base" ? Xr : null);
}
function cw(e) {
  switch (e) {
    case "base":
      return Xr;
    case "discente":
      return u$;
    case "verdadeiro":
      return d$;
  }
}
function uw(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return dw(foundry.utils.getProperty(e, n));
}
function dw(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function mw(e) {
  return e.steps.some(Zr);
}
function Zr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function fw(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Xc = "itemUsePrompts", Qc = "chatCard", In = "data-paranormal-toolkit-prompt-id", Ln = "data-paranormal-toolkit-pending-id", Jr = "data-paranormal-toolkit-executed-label", Ha = "data-paranormal-toolkit-choice-group", Zc = "data-paranormal-toolkit-skipped-label", on = "data-paranormal-toolkit-action-section", Ji = "data-paranormal-toolkit-detail-key", es = "data-paranormal-toolkit-roll-card", eo = "data-paranormal-toolkit-roll-detail-toggle", Jc = "data-paranormal-toolkit-roll-detail-id", eu = "data-paranormal-toolkit-resistance-roll-button", tu = "data-paranormal-toolkit-resistance-skill", nu = "data-paranormal-toolkit-resistance-skill-label", au = "data-paranormal-toolkit-resistance-target-actor-id", ru = "data-paranormal-toolkit-resistance-target-name", ou = "data-paranormal-toolkit-resistance-roll-result", ts = "data-paranormal-toolkit-system-card-replaced", pw = `[${Ln}]`, gw = `[${eo}]`, hw = `[${eu}]`, Wa = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, bw = `${h}__actions`, ns = `${h}__details`, iu = `${h}__summary`, yw = `${h}__title`, su = `${h}__button--executed`, Ot = `${h}__roll-card`, _w = "data-paranormal-toolkit-roll-card-target-mode", Aw = "data-paranormal-toolkit-roll-card-target-names", Tw = "data-paranormal-toolkit-roll-card-resistance", Rw = "data-paranormal-toolkit-roll-card-resistance-skill", kw = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let as = !1, Ka = null;
const Q = /* @__PURE__ */ new Map(), Ew = [0, 100, 500, 1500, 3e3], $w = 3e4, ww = [0, 100, 500, 1500, 3e3];
function Cw(e) {
  if (Ka = e, as) {
    os(e);
    return;
  }
  const t = (n, a) => {
    cu(n, a, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), as = !0, os(e);
}
async function rs(e) {
  const t = lu(e);
  Q.set(e.pendingId, t), await ao(t) || Tu(t), uu(e.pendingId);
}
async function Sw(e) {
  const t = lu({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", Q.set(e.pendingId, t), await ao(t) || Tu(t), uu(e.pendingId);
}
async function ta(e, t) {
  const n = Q.get(e);
  Q.delete(e), n && await DC(n, t);
}
function to(e) {
  const t = Cu();
  for (const n of t) {
    const a = re(n)[e];
    if (a) return { message: n, prompt: a };
  }
  return null;
}
async function Iw(e, t) {
  const n = to(e);
  if (!n) return;
  const a = re(n.message), r = a[e];
  r && (a[e] = {
    ...r,
    executedLabel: r.executedLabel,
    executed: !0
  }, await tt(n.message, a));
}
async function Lw(e, t, n) {
  if (!t) return;
  const a = to(e);
  if (!a) return;
  const r = re(a.message);
  let o = !1;
  for (const [s, l] of Object.entries(r))
    s !== e && l.choiceGroupId === t && (r[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await tt(a.message, r);
}
function lu(e) {
  const t = fe(e.context.message), n = e.context.targets.find((s) => Za(s)), a = n ? Za(n) : null, r = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? n?.name ?? r?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: rC(e.context),
    executed: !1
  };
}
function cu(e, t, n) {
  vC();
  const a = Dn(t);
  if (!a) return;
  const r = SC(e, a);
  r.length > 0 && sn(a);
  for (const o of r)
    Ya(a, o);
  gu(a, n), Xa(a), Qa(a);
}
function os(e) {
  for (const t of ww)
    globalThis.setTimeout(() => {
      vw(e);
    }, t);
}
function vw(e) {
  for (const t of Dw()) {
    const n = vn(t);
    xw(n) && cu(n, t, e);
  }
}
function Dw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function xw(e) {
  return e ? ro(e) ? !0 : NC(e).length > 0 : !1;
}
function uu(e) {
  const t = Q.get(e);
  if (!t) return;
  const n = t.messageId ? IC(t.messageId) : null;
  if (n) {
    us(n, t), sn(n), Ya(n, t), is(n), Xa(n), Qa(n);
    return;
  }
  if (t.messageId) {
    er(t);
    return;
  }
  const a = LC(t);
  if (a) {
    us(a, t), sn(a), Ya(a, t), is(a), Xa(a), Qa(a);
    return;
  }
  er(t);
}
function is(e) {
  Ka && gu(e, Ka);
}
function sn(e) {
  const t = Nw();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = pu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ts) === "true") return;
  const a = n.querySelector(`.${Wa}`);
  a ? n.replaceChildren(a) : n.replaceChildren(), n.setAttribute(ts, "true");
}
function Nw() {
  try {
    return Gs() === "replace";
  } catch {
    return !1;
  }
}
function Ya(e, t) {
  if (sn(e), e.querySelector(`[${In}="${nt(t.pendingId)}"]`)) return;
  const n = Mw(e, t);
  Fw(n, t);
  const a = eC(t);
  if (Pw(a)) return;
  Jw(n, a).append(aC(t));
}
function Pw(e) {
  return mu(e.id) && !we();
}
function du(e) {
  const n = e.closest(`[${on}]`)?.getAttribute(on) ?? null;
  return mu(n) && !we();
}
function mu(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Mw(e, t) {
  const n = e.querySelector(`.${Wa}`);
  if (n)
    return n;
  const a = document.createElement("section");
  a.classList.add(Wa, h);
  const r = document.createElement("header");
  r.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(yw), s.textContent = Ow(t);
  const l = document.createElement("span");
  return l.classList.add(iu), l.textContent = t.summary, r.append(o, s, l), a.append(r), iC(e).append(a), a;
}
function Ow(e) {
  const t = F(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Fw(e, t) {
  const n = t.summaryLines ?? [], a = _u(n, t);
  if (a) {
    Bw(e, a, t);
    return;
  }
  tC(e, n);
}
function Bw(e, t, n) {
  if (e.querySelector(`[${es}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(
    Ot,
    `${Ot}--${t.intent}`,
    `${Ot}--target-${t.targetMode}`
  ), t.targetMode === "multi" && a.classList.add(`${Ot}--multi-target`), a.setAttribute(es, "true"), a.setAttribute(_w, t.targetMode), a.setAttribute(Aw, JSON.stringify(t.targetNames)), Kw(a, t), t.castingCheck && ss(a, zw(t.castingCheck), n.pendingId, "casting"), Uw(t) && ss(a, qw(t), n.pendingId, "effect"), Ww(a, t), Yw(a, t, n), Zw(a, t), e.append(a);
}
function Uw(e) {
  return e.intent !== "casting";
}
function zw(e) {
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
function qw(e) {
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
function ss(e, t, n, a) {
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
  jw(r, t), Qw(r, t.detailRows, n, a, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(r);
}
function jw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const a = document.createElement("span");
  a.classList.add(`${h}__workflow-roll-formula`), a.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${h}__workflow-roll-total`), r.textContent = String(t.total), n.append(a, r);
  const o = Gw(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function Gw(e, t) {
  const n = Vw(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-dice-tray`);
  for (const r of Hw(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), r.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function Vw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function Hw(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ls(e, "highest") : n.includes("kl") ? ls(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function ls(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function Ww(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(ZC);
  if (n.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const r of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = r, a.append(o);
  }
  e.append(a);
}
function Kw(e, t) {
  t.resistance && (e.setAttribute(Tw, t.resistance), t.resistanceSkill && e.setAttribute(Rw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(kw, t.resistanceSkillLabel));
}
function Yw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Xw(t, n);
  r.append(o), s && r.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, a.append(r, l), t.resistanceRollResult && a.append(fu(t.resistanceRollResult)), e.append(a);
}
function Xw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Le())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(In, t.pendingId), n.setAttribute(eu, "true"), n.setAttribute(tu, e.resistanceSkill), n.setAttribute(nu, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(au, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ru, t.resistanceTargetName), e.resistanceRollResult)
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
function Qw(e, t, n, a, r) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${a}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(eo, s), l.setAttribute("aria-expanded", "false"), l.textContent = r;
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
function Zw(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const a of [...t.notes, ...t.details]) {
    const r = document.createElement("span");
    r.textContent = a, n.append(r);
  }
  e.append(n);
}
function Jw(e, t) {
  const n = `[${on}="${nt(t.id)}"]`, a = e.querySelector(n);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add(bw), r.setAttribute(on, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, r.append(o), e.append(r), r;
}
function eC(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const a = _u(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function tC(e, t) {
  if (t.length === 0) return;
  const n = nC(e);
  for (const a of t) {
    const r = JC(a);
    if (n.querySelector(`[${Ji}="${nt(r)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(Ji, r), n.append(o);
  }
}
function nC(e) {
  const t = e.querySelector(`.${ns}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ns), e.append(n), n;
}
function aC(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(In, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(su), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ln, e.pendingId), t.setAttribute(Jr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ha, e.choiceGroupId), t.setAttribute(Zc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function rC(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = oC(e);
  return `${t} → ${n}`;
}
function oC(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function iC(e) {
  return pu(e) ?? e;
}
function pu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function gu(e, t) {
  const n = Dn(e);
  if (!n) return;
  const a = n.querySelectorAll(pw);
  for (const r of a) {
    if (du(r)) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitBound !== "true" && (r.dataset.paranormalToolkitBound = "true", r.addEventListener("click", () => {
      AC(r, t);
    }));
  }
}
function Xa(e) {
  const t = Dn(e);
  if (!t) return;
  const n = t.querySelectorAll(gw);
  for (const a of n)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      sC(t, a);
    }));
}
function Qa(e) {
  const t = Dn(e);
  if (!t) return;
  const n = t.querySelectorAll(hw);
  for (const a of n) {
    if (!Le()) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      lC(t, a);
    }));
  }
}
function sC(e, t) {
  const n = t.getAttribute(eo);
  if (!n) return;
  const a = e.querySelector(`[${Jc}="${nt(n)}"]`);
  if (!a) return;
  const r = a.hidden;
  a.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.textContent = r ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function lC(e, t) {
  if (!Le()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(In), a = t.getAttribute(tu), r = t.getAttribute(nu) ?? (a ? $e(a) : "Resistência");
  if (!n || !a) return;
  const o = dC(e, n), s = mC(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await eg(s, a);
    await bC(c.roll);
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
    cC(t, u), uC(t, u), yC(n, u), await _C(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${r}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function cC(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ou, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function uC(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const a = n.querySelector(`.${h}__resistance-roll-result`), r = a ?? fu(t);
  if (a) {
    a.textContent = bu(t);
    return;
  }
  n.append(r);
}
function dC(e, t) {
  const n = Q.get(t);
  if (n) return n;
  const a = vn(e);
  return re(a)[t] ?? null;
}
function mC(e, t) {
  const n = e?.resistanceTargetActor;
  if (te(n)) return n;
  const r = e?.context?.targets.map(Za).find(te) ?? null;
  if (r) return r;
  const o = t.getAttribute(au) ?? e?.resistanceTargetActorId ?? null, s = o ? pC(o) : null;
  return s || gC(
    t.getAttribute(ru) ?? e?.resistanceTargetName ?? fC(t)
  );
}
function fC(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${iu}`)?.textContent ?? null;
  if (!n) return null;
  const a = "→";
  if (!n.includes(a)) return null;
  const r = n.split(a), o = r[r.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Za(e) {
  const t = e.actor;
  if (te(t)) return t;
  const n = e.token, a = _t(n);
  if (a) return a;
  const r = e.document;
  return _t(r);
}
function _t(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (te(t)) return t;
  const n = e.document?.actor;
  return te(n) ? n : null;
}
function pC(e) {
  const n = game.actors?.get?.(e);
  return te(n) ? n : hu().map((o) => _t(o)).find((o) => o?.id === e) ?? null;
}
function gC(e) {
  const t = Ue(e);
  if (!t) return null;
  const n = hu().filter((o) => Ue(hC(o)) === t).map((o) => _t(o)).find(te) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => te(o) && Ue(o.name) === t);
  return te(r) ? r : null;
}
function hu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function hC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : _t(e)?.name ?? null;
}
function Ue(e) {
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
async function bC(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function yC(e, t) {
  const n = Q.get(e);
  n && (n.resistanceRollResult = t);
}
async function _C(e, t, n) {
  const a = vn(e);
  if (a)
    try {
      const r = re(a), o = r[t];
      if (!o) return;
      r[t] = {
        ...o,
        resistanceRollResult: n
      }, await tt(a, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", r);
    }
}
function vn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages;
  return ae(a?.get?.(n));
}
async function AC(e, t) {
  if (du(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(Ln);
  if (!n) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    yu(e, e.getAttribute(Jr) ?? "✓ Automação aplicada"), TC(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function yu(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(su), e.removeAttribute(Ln), e.removeAttribute(Jr);
}
function TC(e) {
  const t = e.getAttribute(Ha);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const a = `[${Ha}="${nt(t)}"]`;
  for (const r of n.querySelectorAll(a)) {
    if (r === e) continue;
    const o = r.getAttribute(Zc) ?? "✓ Outra opção escolhida";
    yu(r, o);
  }
}
function _u(e, t) {
  const n = e.map(no).filter(XC), a = n.find((E) => E.intent !== "casting") ?? n[0] ?? null;
  if (!a) return null;
  const r = F(e, "Forma"), o = F(e, "Custo"), s = F(e, "Dados") ?? F(e, `Dados (${a.label})`), l = F(e, "Tipo"), c = F(e, "Resistência"), u = F(e, "Resistência Perícia"), m = F(e, "Resistência Rótulo") ?? (u ? $e(u) : null), g = Au(e, "Observação"), _ = e.filter((E) => CC(E, a)), k = $C(e), R = RC(t);
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
function RC(e) {
  const t = kC(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function kC(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && EC(n) !== "nenhum alvo") : [];
}
function EC(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function $C(e) {
  const t = e.map(no).find((o) => o?.intent === "casting") ?? null, n = F(e, "Conjuração DT"), a = F(e, "Conjuração Resultado");
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
function no(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, a, r] = t, o = Number(r);
  return Number.isFinite(o) ? {
    label: n,
    formula: a,
    total: o,
    intent: wC(n)
  } : null;
}
function wC(e) {
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
function CC(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || no(e) ? !1 : e.trim().length > 0;
}
function SC(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of Q.values())
    Ja(a, e, t) && n.set(a.pendingId, a);
  for (const a of xC(e))
    Ja(a, e, t) && !n.has(a.pendingId) && n.set(a.pendingId, a);
  return Array.from(n.values()).sort((a, r) => a.createdAt - r.createdAt);
}
function Ja(e, t, n) {
  const a = fe(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !cs(n, "itemId", e.itemId) ? !1 : !e.actorId || cs(n, "actorId", e.actorId);
}
function cs(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const a = `data-${eS(t)}`;
  for (const r of e.querySelectorAll(`[${a}]`))
    if (r.getAttribute(a) === n)
      return !0;
  return !1;
}
function IC(e) {
  const t = nt(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function LC(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ja(e, null, t))
      return t;
  return null;
}
function vC() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, a] of Q.entries())
    e - a.createdAt > t && Q.delete(n);
}
async function us(e, t) {
  const n = vn(e);
  if (!n) return !1;
  try {
    const a = re(n);
    return a[t.pendingId] = oo(t, fe(n)), await tt(n, a), !0;
  } catch (a) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a), !1;
  }
}
async function ao(e) {
  const t = Eu(e);
  if (!t) return !1;
  try {
    const n = re(t);
    return n[e.pendingId] = oo(e, fe(t)), await tt(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Tu(e) {
  for (const t of Ew)
    globalThis.setTimeout(() => {
      er(e);
    }, t);
}
async function er(e) {
  const t = Eu(e);
  if (ro(t)?.prompts.some((r) => r.pendingId === e.pendingId))
    return !0;
  const a = await ao(e);
  return a || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), a;
}
async function DC(e, t) {
  const n = ku(e.context.message);
  if (n)
    try {
      const a = re(n), r = a[e.pendingId] ?? oo(e, fe(n));
      a[e.pendingId] = {
        ...r,
        executedLabel: t ?? r.executedLabel,
        executed: !0
      }, await tt(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function xC(e) {
  return Object.values(re(ae(e))).filter($t);
}
function re(e) {
  if (!e) return {};
  const t = {}, n = ro(e);
  for (const a of n?.prompts ?? [])
    t[a.pendingId] = a;
  for (const [a, r] of Object.entries(Ru(e)))
    t[a] ??= r;
  return t;
}
function NC(e) {
  return Object.values(Ru(ae(e))).filter($t);
}
function Ru(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Xc);
  if (!We(t))
    return {};
  const n = {};
  for (const [a, r] of Object.entries(t))
    $t(r) && (n[a] = r);
  return n;
}
async function tt(e, t) {
  typeof e.setFlag == "function" && (await MC(e, t), await PC(e, t));
}
async function PC(e, t) {
  await Promise.resolve(e.setFlag?.(d, Xc, t));
}
function ro(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Qc);
  return KC(t) ? t : null;
}
async function MC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter($t).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const a = n[0];
  if (!a) return;
  const r = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: a.messageId ?? fe(e) ?? null,
    source: {
      actorId: a.actorId,
      actorName: OC(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Qc, r));
}
function OC(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function oo(e, t) {
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
  const n = FC(e);
  if (n?.setFlag)
    return n;
  const a = fe(e);
  if (!a) return null;
  const r = game.messages;
  return ae(r?.get?.(a));
}
function FC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ae).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Eu(e) {
  const t = ku(e.context.message);
  if (t) return t;
  const n = e.messageId ? BC(e.messageId) : null;
  if (n) return n;
  const a = Cu().slice().reverse();
  return a.find((r) => UC(r, e)) ?? a.find((r) => zC(r, e)) ?? null;
}
function BC(e) {
  const t = game.messages;
  return ae(t?.get?.(e));
}
function UC(e, t) {
  const n = fe(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!$u(e, t)) return !1;
  const r = wu(e);
  return !t.actorId || !r || r === t.actorId;
}
function zC(e, t) {
  if (!jC(e, t)) return !1;
  const n = wu(e);
  return t.actorId && n === t.actorId ? !0 : $u(e, t);
}
function $u(e, t) {
  const n = Ue(qC(e));
  if (!n) return !1;
  const a = Ue(t.itemName);
  if (a && n.includes(a)) return !0;
  const r = Ue(t.itemId);
  return !!(r && n.includes(r));
}
function qC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function wu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function jC(e, t) {
  const n = GC(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= $w;
}
function GC(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ae(e) {
  return e && typeof e == "object" ? e : null;
}
function $t(e) {
  return We(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && j(e.messageId) && j(e.itemId) && j(e.actorId) && j(e.itemName) && Ae(e.resistanceTargetActorId) && Ae(e.resistanceTargetName) && YC(e.resistanceRollResult) && VC(e.actionPayload) && na(e.title) && na(e.buttonLabel) && na(e.executedLabel) && Ae(e.choiceGroupId) && Ae(e.skippedLabel) && Ae(e.actionSectionId) && Ae(e.actionSectionTitle) && QC(e.summaryLines) : !1;
}
function VC(e) {
  return e == null ? !0 : We(e) ? e.kind === "resource-operation" && j(e.actorId) && j(e.actorUuid) && typeof e.actorName == "string" && HC(e.resource) && WC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function HC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function WC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function KC(e) {
  return We(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && j(e.messageId) && We(e.source) && j(e.source.actorId) && j(e.source.actorName) && j(e.source.itemId) && j(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every($t) : !1;
}
function YC(e) {
  return e == null ? !0 : We(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Ae(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function XC(e) {
  return e !== null;
}
function We(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function j(e) {
  return e === null || typeof e == "string";
}
function na(e) {
  return e === void 0 || typeof e == "string";
}
function Ae(e) {
  return e == null || typeof e == "string";
}
function QC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function ZC(e) {
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
function Dn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function fe(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function JC(e) {
  return e.trim().toLowerCase();
}
function eS(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function nt(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ds = 1e3;
class tS {
  constructor(t, n, a, r, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = r, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new m$(
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
      settings: ma(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = ma();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = rr(t.item);
    if (!a.ok) {
      if (a.error.reason === "missing-automation" && lS(t.item) && n.executionMode === "ask") {
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
    if (await Ni(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: oa(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const r = aS(
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
      return this.pendingExecutions.delete(t), await ta(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const a = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return a.ok ? (this.pendingExecutions.delete(t), await ta(
      t,
      a.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = to(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const a = n.prompt.actionPayload, r = dS(a);
    if (!r)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${a.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await tn(
      this.resources,
      r,
      a.resource,
      a.operation,
      a.amount
    );
    return o.ok ? (await Iw(t), await Lw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Cw(
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
    if (await Ni(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: oa(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      cS(t.item),
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
          Pe(r.workflowContext)
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
      return r.ok ? (sS(n, r.value), await Fl(r.value), {
        ok: !0,
        executedLabel: nS(r.value)
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
    const n = aa(t.action);
    if (!n) return;
    const a = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, r]) => r.kind === "assisted-action" && aa(r.action) === n);
    for (const [r, o] of a)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(r), await ta(
        r,
        ms(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const a = ia();
    await Sw({
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
      const l = ia();
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
        choiceGroupId: aa(s),
        skippedLabel: ms(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: r,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: uS(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      Pe(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const a = ia();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await rs({
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
      Pe(r.value.context)
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
    const n = Date.now(), a = fs(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > ds && this.recentExecutionKeys.delete(o);
    const r = this.recentExecutionKeys.get(a);
    return r !== void 0 && n - r <= ds;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(fs(t), Date.now());
  }
  setAttempt(t, n, a, r) {
    this.lastAttempt = oa(
      t,
      n,
      a,
      r
    );
  }
}
function nS(e) {
  return Bl({ inputAmount: e.totalRawDamage });
}
function aS(e, t) {
  if (t.resistance || !rS(t))
    return t;
  const n = Uc(e);
  return n ? { ...t, resistance: n } : t;
}
function rS(e) {
  return oS(e) && !iS(e);
}
function oS(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function iS(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function aa(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function ms(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function sS(e, t) {
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
function lS(e) {
  return e.type === "ritual";
}
function cS(e) {
  return rk(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function uS(e) {
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
function dS(e) {
  const t = e.actorUuid ? mS(e.actorUuid) : null;
  if (Ke(t)) return t;
  const n = e.actorId ? fS(e.actorId) : null;
  return n || pS(e.actorName);
}
function mS(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function fS(e) {
  const n = game.actors?.get?.(e);
  if (Ke(n)) return n;
  for (const a of Su()) {
    const r = io(a);
    if (r?.id === e) return r;
  }
  return null;
}
function pS(e) {
  const t = ra(e);
  if (!t) return null;
  for (const r of Su()) {
    const o = gS(r);
    if (ra(o) === t) {
      const s = io(r);
      if (s) return s;
    }
  }
  const a = game.actors?.find?.(
    (r) => Ke(r) && ra(r.name) === t
  );
  return Ke(a) ? a : null;
}
function Su() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function gS(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : io(e)?.name ?? null;
}
function io(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ke(t)) return t;
  const n = e.document?.actor;
  return Ke(n) ? n : null;
}
function ra(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ke(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function oa(e, t, n, a) {
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
function fs(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function ia() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class hS {
  constructor(t, n, a) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = a;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), a = [], r = [], o = Rt(t);
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
class bS {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Rt(t).map((l) => this.analyzeRitual(l)), a = n.filter(Ft("upToDate")), r = n.filter(Ft("available")), o = n.filter(Ft("outdated")), s = n.filter(Ft("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, a = yS(t);
    return n ? a ? a.source.type !== "preset" ? ot({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : a.source.presetId === n.preset.id && a.source.presetVersion === n.preset.version ? ot({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : ot({
      ritual: t,
      status: "outdated",
      match: n,
      flag: a,
      reason: _S(a, n.preset)
    }) : ot({
      ritual: t,
      status: "available",
      match: n,
      flag: a,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : ot({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: a,
      reason: a ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function ot(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? un(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function yS(e) {
  const t = e.getFlag(d, "automation");
  return or(t) ? t : null;
}
function _S(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ft(e) {
  return (t) => t.status === e;
}
class AS {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), a = sr(t.transaction);
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
    const n = Bt(t.actorName), a = Bt(t.resource), r = Bt(TS(t)), o = Bt(RS(t));
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
function TS(e) {
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
function RS(e) {
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
function Bt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function kS() {
  const e = new DT(), t = new CR(e), n = new pl(new fl()), a = new gl(new Rr()), r = new SR(new Ic()), o = new PT(), s = new XT(o), l = new tR(e), c = new aR(), u = c.registerMany(
    wd()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new nR(), g = new JT(), _ = kl(), k = new yl(_), R = new bS(
    c
  ), E = new hS(
    R,
    m,
    g
  ), b = new DR(), I = new AS(b), A = new vR(), B = new wR(), D = new ER(
    t,
    s,
    I,
    A
  ), H = new LR(D, A), L = new tS(
    H,
    t,
    s,
    n,
    k,
    b,
    B
  );
  return L.addStrategy(
    new Xs(
      (q) => L.handleItemUsed(q)
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
    chatMessages: I,
    workflowHooks: A,
    ritualEvents: B,
    automation: D,
    workflow: H,
    itemUseIntegration: L,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: E
  };
}
const { ApplicationV2: ES } = foundry.applications.api;
class ln extends ES {
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
      apply: ln.onApply,
      cancel: ln.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${J(ws)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${J(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${sa("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${sa("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${sa("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function sa(e, t, n, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
        <span>${J(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? $S(n) : CS(t)}
    </section>
  `;
}
function $S(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(wS).join("")}</ol>`;
}
function wS(e) {
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
function CS(e) {
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
const cn = `${d}.manageRitualPresets`, ps = `__${d}_ritualPresetHeaderControlRegistered`, SS = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function IS(e) {
  const t = globalThis;
  if (!t[ps]) {
    for (const n of SS)
      Hooks.on(n, (a, r) => {
        LS(a, r, e);
      });
    t[ps] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function LS(e, t, n) {
  Array.isArray(t) && DS(e) && (vS(e, n), !t.some((a) => a.action === cn) && t.push({
    action: cn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), Iu(e, n);
    }
  }));
}
function vS(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[cn] && (e.options.actions[cn] = (n) => {
    n.preventDefault(), n.stopPropagation(), Iu(e, t);
  }));
}
function DS(e) {
  if (!game.user?.isGM) return !1;
  const t = Lu(e);
  return t ? t.type === "agent" && Rt(t).length > 0 : !1;
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
  new ln(n, t).render({ force: !0 });
}
function Lu(e) {
  return gs(e.actor) ? e.actor : gs(e.document) ? e.document : null;
}
function gs(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const tr = "data-paranormal-toolkit-stylesheet";
function xS(e) {
  const t = FS(e), n = NS(t), a = MS(n), r = PS(n, t);
  if (r)
    return r.href = a, r.setAttribute(tr, t), r;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = a, o.setAttribute(tr, t), document.head.append(o), o;
}
function NS(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, a = n.getRoute;
  return typeof a == "function" ? a.call(n, t) : t;
}
function PS(e, t) {
  const n = hs(e);
  for (const a of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (a.getAttribute(tr) === t || hs(a.href) === n)
      return a;
  return null;
}
function MS(e) {
  const t = OS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function OS() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function hs(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function FS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Re(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const a = document.createElement("span");
  return a.textContent = e, n.append(a, t), n;
}
function nr(e, t, n) {
  const a = document.createElement("input");
  return a.type = "text", a.value = e, a.placeholder = t, a.disabled = !n, a;
}
function Ht(e, t, n) {
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
function it(e, t, n = !1) {
  const a = document.createElement("option");
  return a.value = e, a.textContent = t, a.selected = n, a;
}
function BS(e) {
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
  const k = nr(
    t.label,
    "Ex.: Dano adicional",
    a
  );
  k.addEventListener("input", () => {
    t.label = k.value, r();
  }), _.append(Re("Nome da rolagem", k));
  const R = document.createElement("select");
  R.disabled = !a;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      it(
        C,
        rf(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = jS(R.value), Ct(), r();
  }), _.append(Re("Tipo da rolagem", R));
  const E = document.createElement("div");
  E.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), _.append(E);
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
  const B = document.createElement("label");
  B.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const D = document.createElement("input");
  D.type = "checkbox", D.checked = t.formula.mode === "nex", D.disabled = !a;
  const H = document.createElement("span");
  H.textContent = "Varia conforme o NEX", B.append(D, H), I.append(A, B);
  const L = document.createElement("div");
  return L.classList.add(`${d}-ability-roll-config__formula`), b.append(I, L), D.addEventListener("change", () => {
    t.formula = D.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: zS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, q(), pe(), r();
  }), s.append(l, _, b), q(), Ct(), pe(), s;
  function q() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function Ct() {
    E.replaceChildren();
    const C = t.intent === "damage";
    if (_.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), E.hidden = !C, !C) return;
    const $ = document.createElement("select");
    $.disabled = !a, $.append(it("", "—", !t.damageType));
    for (const { value: S, label: U } of Zs)
      $.append(it(S, U, t.damageType === S));
    $.addEventListener("change", () => {
      t.damageType = $.value || null, r();
    }), E.append(Re("Tipo de dano", $));
  }
  function pe() {
    if (L.replaceChildren(), t.formula.mode === "fixed") {
      const W = nr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        a
      );
      W.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = W.value, r());
      }), L.append(Re("Expressão", W));
      return;
    }
    const C = t.formula, $ = document.createElement("select");
    $.disabled = !a, $.append(
      it(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        C.resolution === "highest-unlocked"
      ),
      it(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        C.resolution === "choose-unlocked"
      )
    ), $.addEventListener("change", () => {
      C.resolution = GS($.value), r();
    }), L.append(Re("Comportamento", $));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((W, St) => {
      S.append(
        US({
          step: W,
          editable: a,
          onChange: r,
          onRemove: () => {
            C.steps.splice(St, 1), pe(), r();
          }
        })
      );
    }), L.append(S);
    const U = Ht(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    U.disabled = !a || C.steps.length >= ba, U.addEventListener("click", () => {
      C.steps.length >= ba || (C.steps.push({
        minNex: qS(
          C.steps.map((W) => W.minNex)
        ),
        formula: ""
      }), pe(), r());
    }), L.append(U);
  }
}
function US(e) {
  const { step: t, editable: n, onChange: a, onRemove: r } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = VS(Number(s.value)), s.value = String(t.minNex), a();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = nr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, a();
  });
  const m = vu("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", r), o.append(
    Re("NEX mínimo", l),
    Re("Fórmula", u),
    m
  ), o;
}
function zS(e) {
  const t = Xm(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function qS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function jS(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function GS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function VS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function HS(e) {
  let t = la(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const a = WS(t), r = document.createElement("p");
  r.classList.add(`${d}-ability-roll-config__hint`), r.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = Ht(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= ha || (t.rolls.push(el(t.rolls.length + 1)), _(), I("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = Ht("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = Ht("Limpar", "fa-solid fa-eraser");
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
          BS({
            roll: A,
            index: B,
            editable: e.editable,
            onChange: () => {
              ar(a, t), I("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(B, 1), _(), I("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    ar(a, t), b(!1);
  }
  async function k() {
    E(!0), I("Salvando configuração...");
    try {
      const A = pr(t);
      if (!A) throw new Error("Configuração inválida.");
      t = la(await e.onSave(A)), _(), I("Configuração salva.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        A
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
      t = la(await e.onClear()), _(), I("Configuração removida.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        A
      ), I("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      E(!1);
    }
  }
  function E(A) {
    n.classList.toggle(`${d}-ability-roll-config--busy`, A), b(A);
  }
  function b(A) {
    c.disabled = A || !e.editable, u.disabled = A || !e.editable, s.disabled = A || !e.editable || t.rolls.length >= ha;
  }
  function I(A) {
    g.textContent = A;
  }
}
function WS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const a = document.createElement("strong");
  a.textContent = "Paranormal Toolkit";
  const r = document.createElement("span");
  r.textContent = "Fórmulas de rolagem", n.append(a, r);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), ar(t, e), t;
}
function ar(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = of(t) ? "Configurada" : "Rascunho");
}
function la(e) {
  return JSON.parse(JSON.stringify(e));
}
const KS = "[data-paranormal-toolkit-ability-roll-config]", bs = `__${d}_abilityRollConfigBlockRegistered`, YS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function XS() {
  const e = globalThis;
  if (!e[bs]) {
    xS("styles/ability-roll-config.css");
    for (const t of YS)
      Hooks.on(t, (...n) => {
        QS(n[0], n[1]);
      });
    e[bs] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function QS(e, t) {
  const n = JS(e);
  if (!n || n.type !== "ability") return;
  const a = tI(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!r) return;
  for (const s of Array.from(
    r.querySelectorAll(KS)
  ))
    s.remove();
  const o = HS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Zm(n),
    editable: eI(n),
    onSave: async (s) => {
      const l = await Jm(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await ef(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), Js())
  });
  ZS(r, o);
}
function ZS(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function JS(e) {
  return ys(e.item) ? e.item : ys(e.document) ? e.document : null;
}
function eI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function tI(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ys(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Du = "data-paranormal-toolkit-ritual-roll-config", wt = "data-paranormal-toolkit-ritual-roll-field", Ce = "data-paranormal-toolkit-ritual-roll-action", _s = `__${d}_ritualRollConfigBlockRegistered`, nI = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], aI = [
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
function rI() {
  const e = globalThis;
  if (!e[_s]) {
    oI();
    for (const t of nI)
      Hooks.on(t, (...n) => {
        iI(n[0], n[1]);
      });
    e[_s] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function oI() {
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
function iI(e, t) {
  const n = AI(e);
  if (!n || n.type !== "ritual") return;
  const a = kI(t);
  if (!a) return;
  const r = a.querySelector('section[data-tab="ritualAttr"]');
  if (!r) return;
  lI(r);
  const o = Nu(n), s = Bc(n), l = TI(n), c = cI(n, s, o, l);
  gI(c, n, o, l), sI(r, c), so(c);
}
function sI(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function lI(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Du}]`)))
    t.remove();
}
function cI(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config`), r.setAttribute(Du, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(As("strong", "Paranormal Toolkit")), s.append(As("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Mu(t) ? "Configurada" : "Rascunho", o.append(s, l), r.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", r.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(uI(t, a)), u.append(dI(t, a)), u.append(mI(t, a)), r.append(u), r.append(fI(t, n, a)), r.append(pI(a));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = a ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", r.append(m), r;
}
function uI(e, t) {
  const n = xn("Tipo da rolagem"), a = document.createElement("select");
  a.setAttribute(wt, "intent"), a.disabled = !t;
  for (const r of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = r, o.textContent = ak(r), o.selected = e.intent === r, a.append(o);
  }
  return n.append(a), n;
}
function dI(e, t) {
  const n = xn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const a = document.createElement("select");
  a.setAttribute(wt, "damageType"), a.disabled = !t;
  const r = document.createElement("option");
  r.value = "", r.textContent = "—", r.selected = !e.damageType, a.append(r);
  for (const o of aI) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, a.append(s);
  }
  return n.append(a), n;
}
function mI(e, t) {
  const n = xn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const a = document.createElement("input");
  return a.type = "text", a.placeholder = "Resultado", a.value = e.utilityLabel ?? "Resultado", a.disabled = !t, a.setAttribute(wt, "utilityLabel"), n.append(a), n;
}
function fI(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config__forms-section`);
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-roll-config__forms-title`), r.textContent = "Fórmulas por forma", a.append(r);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(ca("base", "Padrão", e.forms.base.formula, !0, n)), o.append(ca("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(ca("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), a.append(o), a;
}
function ca(e, t, n, a, r) {
  const o = xn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !r || !a, s.setAttribute(wt, `formula.${e}`), o.append(s), !a) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function pI(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(Ce, "save");
  const a = document.createElement("button");
  return a.type = "button", a.textContent = "Limpar", a.disabled = !e, a.setAttribute(Ce, "clear"), t.append(n, a), t;
}
function xn(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function As(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function gI(e, t, n, a) {
  at(e, "intent")?.addEventListener("change", () => so(e)), ks(e, "system.studentForm")?.addEventListener("change", () => Ts(e, t)), ks(e, "system.trueForm")?.addEventListener("change", () => Ts(e, t)), e.querySelector(`[${Ce}="save"]`)?.addEventListener("click", () => {
    a && hI(e, t, n);
  }), e.querySelector(`[${Ce}="clear"]`)?.addEventListener("click", () => {
    a && bI(e, t);
  });
}
async function hI(e, t, n) {
  const a = e.querySelector(`[${Ce}="save"]`);
  a?.setAttribute("disabled", "true"), ze(e, "Salvando configuração...");
  try {
    const r = yI(e, n);
    await tk(t, r), xu(e, r), ze(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", r), ze(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    a?.removeAttribute("disabled");
  }
}
async function bI(e, t) {
  const n = e.querySelector(`[${Ce}="clear"]`);
  n?.setAttribute("disabled", "true"), ze(e, "Limpando configuração...");
  try {
    await nk(t);
    const a = Bc(t);
    _I(e, a), xu(e, a), ze(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", a), ze(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function xu(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Mu(t) ? "Configurada" : "Rascunho");
}
function yI(e, t) {
  return {
    schemaVersion: 1,
    intent: Pu(at(e, "intent")?.value),
    damageType: Es(e, "damageType"),
    utilityLabel: Es(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Wt(e, "formula.base") },
      discente: { formula: Wt(e, "formula.discente") },
      verdadeiro: { formula: Wt(e, "formula.verdadeiro") }
    }
  };
}
function _I(e, t) {
  Ne(e, "intent", t.intent), Ne(e, "damageType", t.damageType ?? ""), Ne(e, "utilityLabel", t.utilityLabel ?? "Resultado"), Ne(e, "formula.base", t.forms.base.formula), Ne(e, "formula.discente", t.forms.discente.formula), Ne(e, "formula.verdadeiro", t.forms.verdadeiro.formula), so(e);
}
function so(e) {
  const t = Pu(at(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), a = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const r of Array.from(n))
    r.hidden = t !== "damage";
  for (const r of Array.from(a))
    r.hidden = t !== "utility";
}
function Ts(e, t) {
  const n = Nu(t);
  Rs(e, "discente", n.discente), Rs(e, "verdadeiro", n.verdadeiro);
}
function Rs(e, t, n) {
  const a = at(e, `formula.${t}`);
  if (!a) return;
  const r = !e.querySelector(`[${Ce}="save"]`)?.disabled;
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
function ze(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Nu(e) {
  const t = RI(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function AI(e) {
  return $s(e.item) ? e.item : $s(e.document) ? e.document : null;
}
function TI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function RI(e) {
  const t = e.system;
  return EI(t) ? t : {};
}
function ks(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function at(e, t) {
  return e.querySelector(`[${wt}="${$I(t)}"]`);
}
function Wt(e, t) {
  return at(e, t)?.value.trim() ?? "";
}
function Es(e, t) {
  const n = Wt(e, t);
  return n.length > 0 ? n : null;
}
function Ne(e, t, n) {
  const a = at(e, t);
  a && (a.value = n);
}
function Pu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Mu(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function kI(e) {
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
function EI(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function $I(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Z = null;
Hooks.once("init", () => {
  Rd(), em(), hp(), _T(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!To.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${To.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Z = kS(), Z.itemUseIntegration.registerStrategies(), ip(Z.resources, Z.resourceAdapter), mp(Z.conditions), Om(Z), $T(), IS(Z), rI(), XS(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function wI() {
  if (!Z)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Z;
}
export {
  wI as getToolkitServices
};
//# sourceMappingURL=main.js.map
