const d = "paranormal-toolkit", ws = "Paranormal Toolkit", Gu = "ordemparanormal";
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
function Hu(e) {
  return or(e.getFlag(d, "automation"));
}
function or(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Wu(t.source) && Vu(t.definition);
}
function Vu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Ku) && (t.ritualForms === void 0 || ed(t.ritualForms)) && (t.conditionApplications === void 0 || od(t.conditionApplications));
}
function Wu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Ku(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Yu(t);
    case "spendRitualCost":
      return Xu(t);
    case "rollFormula":
      return Qu(t);
    case "modifyResource":
      return Zu(t);
    case "chatCard":
      return Ju(t);
    default:
      return !1;
  }
}
function Yu(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Cs(t);
}
function Xu(e) {
  return e.type === "spendRitualCost";
}
function Qu(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || md(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Zu(e) {
  const t = e;
  return t.type === "modifyResource" && Ss(t.actor) && ud(t.resource) && dd(t.operation) && Cs(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Ju(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ed(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([a, r]) => n.has(a) && td(r)
  );
}
function td(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || pd(t.extraCost)) && (t.rollFormulaOverrides === void 0 || hd(t.rollFormulaOverrides)) && (t.notes === void 0 || gd(t.notes)) && (t.targeting === void 0 || nd(t.targeting));
}
function nd(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return rd(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || ad(t.template));
}
function ad(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || lo(t.distance)) && (t.width === void 0 || t.width === null || lo(t.width));
}
function rd(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function od(e) {
  return Array.isArray(e) && e.every(id);
}
function id(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Ss(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || ld(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || sd(t.applyOnResistance));
}
function sd(e) {
  return e === "failure" || e === "success" || e === "always";
}
function ld(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || fd(t.rounds)) && (t.expiry === void 0 || t.expiry === null || cd(t.expiry));
}
function cd(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Cs(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Ss(e) {
  return e === "self" || e === "target";
}
function ud(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function dd(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function md(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function fd(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function pd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function lo(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function gd(e) {
  return Array.isArray(e) && e.every(w);
}
function hd(e) {
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
    if (_d(t))
      return Array.from(t).filter(co);
  }
  return [];
}
function bd(e) {
  return ir(e)[0] ?? null;
}
function yd(e) {
  return ir(e).find(Hu) ?? null;
}
function _d(e) {
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
function Ad(e) {
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
    a.applied.push(Td(r, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), Rd(a), a;
}
async function ua(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Td(e, t, n) {
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
function Rd(e) {
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
function Me(e) {
  return e ? {
    id: e.id,
    source: {
      ...kd(e.sourceActor),
      token: e.sourceToken
    },
    item: Ed(e.item),
    targets: e.targets.map($d),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: po(e.rollRequests, Ls),
    rolls: po(e.rolls, wd),
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
function kd(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Ed(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function $d(e) {
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
function wd(e) {
  return {
    ...Ls(e),
    total: e.total
  };
}
function po(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, a]) => [n, t(a)]));
}
function Cd(e) {
  return {
    getSelected() {
      return At.getSelectedActor();
    },
    logResources() {
      const t = be(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await xe(
        e,
        "Gasto de PE",
        be("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await xe(
        e,
        "Gasto de PD",
        be("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await xe(
        e,
        "Dano em PV",
        be("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await xe(
        e,
        "Cura de PV",
        be("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await xe(
        e,
        "Dano em SAN",
        be("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await xe(
        e,
        "Recuperação de SAN",
        be("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function xe(e, t, n, a) {
  if (!n) return;
  const r = await a(n);
  if (!r.ok) {
    Sd(r.error);
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
function be(e) {
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Sd(e) {
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
const ae = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Id() {
  Lt(ae.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Lt(ae.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Lt(ae.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Lt(ae.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function da() {
  return {
    enabled: vt(ae.enabled),
    console: vt(ae.console),
    ui: vt(ae.ui),
    chat: vt(ae.chat)
  };
}
async function le(e, t) {
  await game.settings.set(d, ae[e], t);
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
function Ld() {
  return {
    status() {
      return da();
    },
    async enable() {
      await le("enabled", !0);
    },
    async disable() {
      await le("enabled", !1);
    },
    async enableConsole() {
      await le("console", !0);
    },
    async disableConsole() {
      await le("console", !1);
    },
    async enableUi() {
      await le("ui", !0);
    },
    async disableUi() {
      await le("ui", !1);
    },
    async enableChat() {
      await le("chat", !0);
    },
    async disableChat() {
      await le("chat", !1);
    }
  };
}
const vs = "ritual.costOnly", Ds = "ritual.simpleHealing", vd = "ritual.eletrocussao", Dd = "ritual.definhar", xs = "ritual.simpleDamage", Ns = "generic.simpleHealing", Ps = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, lr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function xd() {
  return [
    Nd(),
    Pd(),
    Md(),
    Od(),
    Fd(),
    Bd()
  ];
}
function Nd() {
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
function Pd() {
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
    itemPatch: jd()
  };
}
function Md() {
  return {
    id: vd,
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
    automation: zd(),
    itemPatch: Hd()
  };
}
function Od() {
  return {
    id: Dd,
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
    automation: qd(),
    itemPatch: Gd()
  };
}
function Fd() {
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
function Bd() {
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
  const t = Ud(e);
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
function Ud(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Ps,
    ...e
  };
}
function zd() {
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
function qd() {
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
function jd() {
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
function Gd() {
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
function Hd() {
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
    tokenId: Oe(e.id),
    actorId: Oe(e.actor?.id),
    sceneId: Oe(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Bs() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Oe(e.id),
    actorId: Oe(t?.id),
    sceneId: Oe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Vd(e) {
  return {
    logFirstRitualCost() {
      const t = ye("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = _e(t);
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
      const a = ye("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const r = _e(a);
      if (r) {
        if (!Yd(t, n)) {
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
      const t = ye("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = _e(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = ye("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = _e(t);
      if (!n) return;
      const a = e.automationRegistry.require(vs);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = ye("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const a = _e(n);
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
      const n = ye("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const a = _e(n);
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
      const t = ye("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = _e(t);
      n && await Wd(e, t, n);
    }
  };
}
async function Wd(e, t, n) {
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
    Kd(r.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", Me(r.value.context));
}
function Kd(e) {
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
function ye(e) {
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function _e(e) {
  const t = Is(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Yd(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function go(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Xd = ["strict", "open"], Us = "strict";
function Qd(e) {
  return Xd.includes(e) ? e : Us;
}
function Zd(e) {
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
const Jd = ["disabled", "ask", "automatic"], em = ["buttons", "confirm"], zs = "ask";
function tm(e) {
  return typeof e == "string" && Jd.includes(e);
}
function nm(e) {
  return typeof e == "string" && em.includes(e);
}
function am(e) {
  return tm(e) ? e : nm(e) ? "ask" : zs;
}
const rm = ["keep", "replace"], om = ["manual", "assisted"], qs = "keep", js = "assisted", im = !0, M = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function sm() {
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
    default: im
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
  const e = am(game.settings.get(d, M.executionMode)), t = Vs(game.settings.get(d, M.systemCardMode)), n = Ws(game.settings.get(d, M.damageResolutionMode)), a = dr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: a,
    ritualCastingCheckEnabled: Hs()
  };
}
function Gs() {
  return Vs(game.settings.get(d, M.systemCardMode));
}
function lm() {
  return Ws(game.settings.get(d, M.damageResolutionMode));
}
function dr() {
  return Qd(game.settings.get(d, M.resistanceGateMode));
}
function Hs() {
  return game.settings.get(d, M.ritualCastingCheckEnabled) === !0;
}
async function Ae(e) {
  await game.settings.set(d, M.executionMode, e);
}
function Vs(e) {
  return rm.includes(e) ? e : qs;
}
function Ws(e) {
  return om.includes(e) ? e : js;
}
function cm(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await Ae("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await Ae(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await Ae("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await Ae("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const um = [
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
function dm(e) {
  return {
    phases() {
      return um;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Nn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = yd(t);
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
      if (!pm(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = fm(n) ?? Nn("Nenhum ator encontrado para executar automação do item.");
      a && await ho(e, a, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Nn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = bd(t);
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
    mm(r.error);
    return;
  }
  f.info("Automação executada com sucesso.", Me(r.value.context));
}
function mm(e) {
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
function fm(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function pm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function gm(e) {
  const t = Cd(e), n = Ad(e), a = Vd(e), r = dm(e), o = Ld(), s = cm(e);
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
function hm(e) {
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
      return bm(r), r;
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
      return ym(a), a;
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
function bm(e) {
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
function ym(e) {
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
function _m(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${I(e.label)}</span>`;
}
const Am = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function Tm(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${I(t)}" alt="${I(e?.alt ?? "")}">` : Am;
}
function Ks(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${I(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(_m).join("")}</div>` : "", a = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${I(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${Tm(e.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${I(e.title)}</span>${t}
      </div>${n}
    </div>${a}
  </div>
</header>`;
}
function K(e) {
  return `<article class="paranormal-toolkit-chat-card-shell">${e.content}</article>`;
}
const Rm = '<i class="paranormal-toolkit-dice-action-button__icon fa-solid fa-dice-d20" aria-hidden="true"></i>';
function Ys(e) {
  const t = e.disabled ? " disabled" : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${I(e.ariaLabel)}"${t}>${Rm}</button>`;
}
function Xs(e) {
  const t = e.label.trim(), n = e.detailHtml.trim();
  return !t || !n ? "" : `<div class="paranormal-toolkit-metadata-detail-row"><span class="paranormal-toolkit-metadata-detail-row__accent" aria-hidden="true"></span><div class="paranormal-toolkit-metadata-detail-row__content"><span class="paranormal-toolkit-metadata-detail-row__label">${I(t)}</span><span class="paranormal-toolkit-metadata-detail-row__detail">${n}</span></div></div>`;
}
const yo = {
  section: "paranormal-toolkit-roll-row__result--section",
  success: "paranormal-toolkit-roll-row__result--success",
  failure: "paranormal-toolkit-roll-row__result--failure"
};
function km(e) {
  return yo[e ?? "section"] ?? yo.section;
}
function Em(e) {
  const t = `<span class="paranormal-toolkit-roll-row__formula-text">${I(e.formula)}</span>`;
  if (!e.diceResults?.length)
    return `<div class="paranormal-toolkit-roll-row__formula paranormal-toolkit-roll-row__formula--static">${t}</div>`;
  const n = e.diceResults.map(
    (r) => `<span class="paranormal-toolkit-roll-row__die">${I(String(r))}</span>`
  ).join("");
  return `<details class="paranormal-toolkit-roll-row__details"${e.expanded ? " open" : ""}>
  <summary class="paranormal-toolkit-roll-row__formula">${t}<span class="paranormal-toolkit-roll-row__chevron" aria-hidden="true"></span></summary>
  <div class="paranormal-toolkit-roll-row__breakdown" aria-label="Resultados dos dados">${n}</div>
</details>`;
}
function mr(e) {
  const t = e.total !== void 0, n = t ? "with-result" : "without-result", a = t ? I(String(e.total)) : "", r = t ? `<output class="paranormal-toolkit-roll-row__result ${km(e.resultTone)}" aria-label="Resultado: ${a}">${a}</output>` : "";
  return `<div class="paranormal-toolkit-roll-row paranormal-toolkit-roll-row--${n}">${Em(e)}${r}</div>`;
}
const _o = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  resistance: "paranormal-toolkit-section-card--resistance"
};
function $m(e) {
  return _o[e] ?? _o.casting;
}
function Ie(e) {
  return `<section class="paranormal-toolkit-section-card ${$m(e.tone)}">${e.content}</section>`;
}
function Xe(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${I(e.title)}</span>${t}</div>`;
}
const Ao = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure"
}, wm = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA"
};
function mn(e) {
  const t = Ao[e.state] ? e.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${Ao[t]}">${wm[t]}</span>`;
}
function Qs(e) {
  const t = I(String(e.total)), n = I(String(e.difficultyClass)), a = `<p class="paranormal-toolkit-ritual-conjuration-section__result-description"><span class="paranormal-toolkit-ritual-conjuration-section__skill">${I(e.skillLabel)}:</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">${t}</strong> <span class="paranormal-toolkit-ritual-conjuration-section__comparison">vs</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">DT ${n}</strong></p>`, r = e.consequence?.trim(), o = r ? `<p class="paranormal-toolkit-ritual-conjuration-section__consequence"><span class="paranormal-toolkit-ritual-conjuration-section__consequence-label">Consequência:</span> ${I(r)}</p>` : "", s = Xe({
    title: "Conjuração",
    trailing: mn({ state: e.status })
  }) + a + mr({
    formula: e.formula,
    total: e.total,
    resultTone: e.status,
    diceResults: e.diceResults,
    expanded: e.expanded
  }) + o;
  return Ie({ tone: "casting", content: s });
}
function Zs(e) {
  const t = e.damageType.trim(), n = t ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${I(t)}</span>` : void 0, a = Xe({ title: "Dano", trailing: n }) + mr({
    formula: e.formula,
    total: e.total,
    resultTone: "section",
    diceResults: e.diceResults,
    expanded: e.expanded
  });
  return Ie({ tone: "damage", content: a });
}
function Js(e) {
  const n = `<div class="paranormal-toolkit-ritual-resistance-section"><div class="paranormal-toolkit-ritual-resistance-section__text"><div class="paranormal-toolkit-ritual-resistance-section__title">Resistência</div>${`<p class="paranormal-toolkit-ritual-resistance-section__summary"><strong class="paranormal-toolkit-ritual-resistance-section__metric">${I(e.skill)}</strong><span class="paranormal-toolkit-ritual-resistance-section__separator" aria-hidden="true"> · </span><strong class="paranormal-toolkit-ritual-resistance-section__metric">${I(e.difficultyLabel)}</strong><span class="paranormal-toolkit-ritual-resistance-section__separator" aria-hidden="true"> · </span><span class="paranormal-toolkit-ritual-resistance-section__outcome">${I(e.outcome)}</span></p>`}</div>${Ys(e.action)}</div>`;
  return Ie({ tone: "resistance", content: n });
}
function Cm(e) {
  const t = e.text.trim();
  return t ? `<span class="paranormal-toolkit-metadata-pill">${I(t)}</span>` : "";
}
function el(e) {
  const t = e.items.map(Cm).filter(Boolean);
  return t.length === 0 ? "" : `<div class="paranormal-toolkit-ritual-metadata">${t.join("")}</div>`;
}
function Sm(e) {
  const t = [
    Ks(e.header),
    e.metadata ? el(e.metadata) : "",
    ...e.detailRows?.map(Xs) ?? [],
    Qs(e.conjuration),
    e.damage ? Zs(e.damage) : "",
    e.resistance ? Js(e.resistance) : ""
  ].filter(Boolean).join("");
  return K({
    content: `<div class="paranormal-toolkit-ritual-single-target-card">${t}</div>`
  });
}
const tl = "devChatCardExample", Im = "devChatCardHeaderExample";
function z() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function Lm() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", a = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", r = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof r == "string" ? { src: r, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${a}`
  };
}
function vm(e) {
  return e === "runtime" ? Lm() : e === "ability" ? {
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
function Dm(e) {
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
function xm(e) {
  const t = Dm(e);
  return K({
    content: Ie({
      tone: t.tone,
      content: Xe({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function Nm(e) {
  return K({
    content: Ie({
      tone: "casting",
      content: Xe({
        title: "Conjuração",
        trailing: mn({ state: e })
      })
    })
  });
}
function Pm(e) {
  const t = e === "disabled";
  return K({
    content: Ie({
      tone: "resistance",
      content: Xe({
        title: "Resistência",
        trailing: Ys({
          ariaLabel: t ? "Resistência indisponível" : "Rolar resistência",
          disabled: t
        })
      })
    })
  });
}
function Mm(e) {
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
  return K({
    content: Ie({
      tone: o,
      content: Xe({ title: s, trailing: l }) + mr(r)
    })
  });
}
function Om(e) {
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
function Fm(e) {
  return K({
    content: Qs(Om(e))
  });
}
function Bm(e) {
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
function Um(e) {
  return K({
    content: Zs(Bm(e))
  });
}
function zm(e) {
  return e === "disabled" ? {
    skill: "Reflexos",
    difficultyLabel: "DT 18",
    outcome: "evita o efeito",
    action: { ariaLabel: "Resistência indisponível", disabled: !0 }
  } : {
    skill: "Fortitude",
    difficultyLabel: "DT 22",
    outcome: e === "long" ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados" : "reduz dano à metade",
    action: { ariaLabel: "Rolar resistência de Fortitude" }
  };
}
function qm(e) {
  return K({
    content: Js(zm(e))
  });
}
function jm(e) {
  return e === "partial" ? {
    items: [
      { text: "Alcance: Pessoal" },
      { text: "Duração: Cena" }
    ]
  } : e === "long" ? {
    items: [
      { text: "Execução: Uma ação completa cuidadosamente preparada" },
      { text: "Alcance: Uma distância paranormal excepcionalmente longa" },
      { text: "Duração: Enquanto a concentração do conjurador for mantida" }
    ]
  } : {
    items: [
      { text: "1 PE gasto" },
      { text: "Alvo: 1 Ser" },
      { text: "Duração: Instantânea" }
    ]
  };
}
function Gm(e) {
  return K({
    content: el(jm(e))
  });
}
function Hm(e) {
  return K({ content: Xs(e === "generic" ? { label: "Alcance:", detailHtml: "Médio · até 15 metros" } : e === "long" ? {
    label: "Resistência:",
    detailHtml: "Reflexos · <strong>DT 24</strong> · evita completamente os efeitos do ritual"
  } : {
    label: "Resistência:",
    detailHtml: "Fortitude · <strong>DT 22</strong> · reduz dano à metade"
  }) });
}
function Vm(e) {
  const t = e === "failure", n = e === "long";
  return {
    header: {
      title: n ? "Eletrocussão Extraordinariamente Prolongada para Validar Quebras Naturais" : "Eletrocussão",
      subtitle: "Padrão",
      badges: [{ label: "ENERGIA 1" }],
      context: n ? "Mercy → Criatura paranormal com um nome excepcionalmente longo para validar o contexto" : "Mercy → Malvadão"
    },
    metadata: {
      items: n ? [
        { text: "1 PE gasto em uma conjuração cuidadosamente preparada" },
        { text: "Alvo: Uma criatura paranormal excepcionalmente distante" },
        { text: "Duração: Enquanto a concentração do conjurador for mantida" }
      ] : [
        { text: "1 PE gasto" },
        { text: "Alvo: 1 Ser" },
        { text: "Duração: Instantânea" }
      ]
    },
    detailRows: [
      {
        label: "Alcance:",
        detailHtml: n ? "Extremamente longo · até uma distância paranormal que exige quebra defensiva" : "Curto · até 9 metros"
      }
    ],
    conjuration: {
      status: t ? "failure" : "success",
      skillLabel: "Ocultismo",
      total: t ? 17 : 23,
      difficultyClass: 21,
      formula: "1d20 + 10 + 5",
      diceResults: [t ? 2 : 8],
      consequence: t ? "Dano de Sanidade" : void 0
    },
    damage: t ? void 0 : {
      damageType: n ? "Eletricidade paranormal prolongada e intensamente concentrada" : "Eletricidade",
      formula: n ? "3d6 + 2d8 + 5" : "3d6",
      total: n ? 21 : 9,
      diceResults: n ? [2, 3, 4, 5, 2] : [2, 3, 4]
    },
    resistance: t ? void 0 : {
      skill: "Fortitude",
      difficultyLabel: "DT 22",
      outcome: n ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados" : "reduz dano à metade",
      action: { ariaLabel: "Rolar resistência de Fortitude" }
    }
  };
}
function G(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [d]: { [tl]: t } }
  });
}
function Wm() {
  const e = async () => {
    z();
    const n = (game.messages.contents ?? []).filter(
      (a) => typeof a.getFlag?.(d, tl) == "string" || a.getFlag?.(d, Im) === !0
    );
    await Promise.all(
      n.map(
        (a) => a.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return z(), G(
        K({
          content: Ks(vm(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      z();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (a) => G(xm(a), "section")
        )
      );
    },
    async postStatusBadgeExample(t) {
      z();
      const n = t === "both" ? ["success", "failure"] : [t];
      return Promise.all(
        n.map(
          (a) => G(Nm(a), "status")
        )
      );
    },
    async postDiceActionButtonExample(t) {
      z();
      const n = t === "all" ? ["enabled", "disabled"] : [t];
      return Promise.all(
        n.map(
          (a) => G(
            Pm(a),
            "dice-action-button"
          )
        )
      );
    },
    async postRollRowExample(t) {
      z();
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
          (a) => G(Mm(a), "roll-row")
        )
      );
    },
    async postRitualConjurationSectionExample(t) {
      z();
      const n = t === "all" ? ["success", "failure", "failure-consequence", "expanded"] : [t];
      return Promise.all(
        n.map(
          (a) => G(
            Fm(a),
            "ritual-conjuration"
          )
        )
      );
    },
    async postRitualDamageSectionExample(t) {
      z();
      const n = t === "all" ? ["collapsed", "expanded", "without-result", "long-type"] : [t];
      return Promise.all(
        n.map(
          (a) => G(
            Um(a),
            "ritual-damage"
          )
        )
      );
    },
    async postRitualResistanceSectionExample(t) {
      z();
      const n = t === "all" ? ["enabled", "disabled", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => G(
            qm(a),
            "ritual-resistance"
          )
        )
      );
    },
    async postRitualMetadataExample(t) {
      z();
      const n = t === "all" ? ["default", "partial", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => G(
            Gm(a),
            "ritual-metadata"
          )
        )
      );
    },
    async postMetadataDetailRowExample(t) {
      z();
      const n = t === "all" ? ["short", "long", "generic"] : [t];
      return Promise.all(
        n.map(
          (a) => G(
            Hm(a),
            "metadata-detail-row"
          )
        )
      );
    },
    async postRitualSingleTargetCardExample(t) {
      z();
      const n = t === "all" ? ["success", "failure", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => G(
            Sm(Vm(a)),
            "ritual-single-target-card"
          )
        )
      );
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function Km(e) {
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
    conditions: hm(e.conditions),
    debug: gm(e),
    dev: Wm(),
    hooks: Ut
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const a = game.modules.get(d);
  return a && (a.api = t), t;
}
class To {
  static isSupportedSystem() {
    return game.system.id === Gu;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const Pn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ym(e) {
  if (!tf(e.item)) return null;
  const t = fa(e.actor) ? e.actor : Xm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Zm(e.token) ?? Qm(t),
    targets: ur(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Xm(e) {
  const t = e;
  return fa(t.actor) ? t.actor : fa(e.parent) ? e.parent : null;
}
function Qm(e) {
  const t = Jm(e) ?? ef(e);
  return t ? nl(t) : null;
}
function Zm(e) {
  return pa(e) ? nl(e) : null;
}
function Jm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return pa(n) ? n : (t.getActiveTokens?.() ?? []).find(pa) ?? null;
}
function ef(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function nl(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Mn(e.id),
    actorId: Mn(t?.id),
    sceneId: Mn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function tf(e) {
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
class al {
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
    const n = Ym(nf(t));
    if (!n) {
      f.warn(`${Pn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function nf(e) {
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
function Q(e, t) {
  const n = af(e, t);
  return zt(n);
}
function af(e, t) {
  return t.split(".").reduce((n, a) => fn(n) ? n[a] : null, e);
}
function rf(e, t) {
  const n = e.indexOf(":");
  return n < 0 || gt(e.slice(0, n)) !== gt(t) ? null : Qe(e.slice(n + 1));
}
function zt(e) {
  return typeof e == "string" ? Qe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function fn(e) {
  return !!e && typeof e == "object";
}
function of(e) {
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
function fe(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function rl(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const Yt = "abilityRollConfig", ol = [
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
], ha = 20, ba = 20, sf = [10, 40, 65, 99];
function il() {
  return {
    schemaVersion: 1,
    rolls: [sl(1)]
  };
}
function sl(e) {
  return {
    id: cf(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function lf() {
  return sf.map((e) => ({ minNex: e, formula: "" }));
}
function cf() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function ll(e) {
  return pr(
    e.getFlag(d, Yt)
  );
}
function uf(e) {
  return ll(e) ?? il();
}
async function df(e, t) {
  const n = pr(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, Yt, n), n;
}
async function mf(e) {
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
  if (!je(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, ha).map((a, r) => yf(a, r, t)).filter((a) => a !== null)
  };
}
function ff(e, t) {
  const n = ll(t);
  return n ? pf(n, gf(e)) : [];
}
function pf(e, t) {
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
function gf(e) {
  const t = je(e.system) ? e.system : {}, n = t.NEX ?? t.nex, a = je(n) ? n.value : n, r = typeof a == "number" ? a : Number(a);
  return Number.isFinite(r) ? ul(r) : 0;
}
function cl(e) {
  return ol.find((t) => t.value === e)?.label ?? e;
}
function hf(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function bf(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function yf(e, t, n) {
  if (!je(e)) return null;
  const a = `roll-${t + 1}`, r = Ef(kf(e.id, a), n), o = Tf(e.intent), s = _f(e.formula);
  return !o || !s ? null : {
    id: r,
    label: gn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? $f(e.damageType) : null,
    formula: s
  };
}
function _f(e) {
  if (!je(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: gn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, ba).map(Af).filter((a) => a !== null) : [];
  t.sort((a, r) => a.minNex - r.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const a of t) n.set(a.minNex, a);
  return {
    mode: "nex",
    resolution: Rf(e.resolution),
    steps: [...n.values()]
  };
}
function Af(e) {
  if (!je(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: ul(t),
    formula: gn(e.formula)
  } : null;
}
function Tf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function Rf(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function kf(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function Ef(e, t) {
  let n = e, a = 2;
  for (; t.has(n); )
    n = `${e}-${a}`, a += 1;
  return t.add(n), n;
}
function ul(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function gn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function $f(e) {
  const t = gn(e);
  return t.length > 0 ? t : null;
}
function je(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const gr = "data-paranormal-toolkit-ability-roll-id";
function wf(e) {
  if (!dl(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = de(e.actorUuid), n = de(e.itemUuid), a = de(e.abilityName);
  if (!t) return null;
  const r = e.rolls.map(Cf).filter((o) => o !== null);
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
function Cf(e) {
  if (!dl(e)) return null;
  const t = de(e.id), n = de(e.sourceRollId), a = de(e.label), r = de(e.formula), o = Sf(e.intent);
  if (!t || !n || !a || !r || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: a,
    formula: r,
    intent: o,
    damageType: o === "damage" ? If(e.damageType) : null,
    nexThreshold: s
  };
}
function Sf(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function de(e) {
  return typeof e == "string" ? e.trim() : "";
}
function If(e) {
  const t = de(e);
  return t.length > 0 ? t : null;
}
function On(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function dl(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Ro = "paranormalToolkitAbilityRollBound";
let ko = !1;
function Lf() {
  if (ko) return;
  ko = !0;
  const e = (t, n) => {
    vf(t, Kt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function vf(e, t) {
  if (!t) return 0;
  const n = `[${gr}]`, a = Uf(t, n);
  let r = 0;
  for (const o of a)
    o.dataset[Ro] !== "true" && (o.dataset[Ro] = "true", o.addEventListener("click", () => {
      Df(e, o);
    }), r += 1);
  return r;
}
async function Df(e, t) {
  const n = t.getAttribute(gr)?.trim();
  if (!n) return;
  const a = xf(e), r = a?.rolls.find((l) => l.id === n);
  if (!a || !r) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await Nf(a.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!Of(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = Pf();
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
      Mf(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: Ff(a.abilityName, r)
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
function xf(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : wf(
    t.getFlag(d, "abilityUse")
  );
}
async function Nf(e) {
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
function Pf() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function Mf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function Of(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function Ff(e, t) {
  const n = [Bf(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${Fn(e)}</strong>
      <span>${Fn(t.label)}</span>
      <small>${Fn(n.join(" · "))}</small>
    </div>
  `;
}
function Bf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${cl(e.damageType)}` : "Dano";
  }
}
function Uf(e, t) {
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
const zf = "paranormal-toolkit-chat-message--full-width-card", wo = ".paranormal-toolkit-ability-card", Co = "li.chat-message";
let So = !1;
function qf() {
  if (So) return;
  So = !0;
  const e = Hooks, t = (n, a) => {
    Io(Kt(a));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Io(document);
}
function Io(e) {
  if (!e) return 0;
  const t = hr(e), n = jf(t), a = /* @__PURE__ */ new Set();
  for (const r of n) {
    const o = Gf(t, r);
    o?.classList && a.add(o);
  }
  for (const r of a)
    r.classList?.add(zf);
  return a.size;
}
function jf(e) {
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
function Gf(e, t) {
  if (e.matches?.(Co)) return e;
  const n = t.closest?.(Co);
  return n ? hr(n) : null;
}
function hr(e) {
  return e && typeof e == "object" ? e : {};
}
function Hf(e) {
  const t = Vf(e.cost), n = Wf(e.currentResource), a = t > 0 && !e.passive, r = n >= t;
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
function Vf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Wf(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Kf } = foundry.applications.api;
class mt extends Kf {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = Hf(t), this.spendResource = this.model.cost.spendResourceChecked;
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
          src="${Yf(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${q(this.model.header.eyebrow)}</p>
          <h2>${q(this.model.header.title)}</h2>
          <p>${q(this.model.header.subtitle)}</p>
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
          <span data-paranormal-toolkit-ability-submit-label>${q(this.model.primaryActionLabel)}</span>
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
            <span>${q(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${q(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${q(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${q(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${t}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${q(this.model.cost.resource)} suficiente para pagar este custo.</span>
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
          <div><dt>Personagem</dt><dd>${q(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${q(t)}</p>
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
function q(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Yf(e) {
  return q(e);
}
function Xf(e, t) {
  const n = np(t.system), a = Xt(n.activation), r = ep(a), o = Zf();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: ap(t),
    activation: a,
    activationLabel: Jf(a),
    description: Xt(n.description),
    chatDescription: Qf(
      n.chatDescription,
      n.description
    ),
    cost: r ? 0 : tp(n.cost),
    resource: o,
    passive: r,
    rolls: ff(e, t)
  };
}
function Qf(e, t) {
  const n = Xt(e);
  return n.trim().length > 0 ? n : Xt(t);
}
function Zf() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Jf(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, a = rp()?.(t) ?? t;
  return a === t ? e : a;
}
function ep(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function tp(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function np(e) {
  return e && typeof e == "object" ? e : {};
}
function Xt(e) {
  return typeof e == "string" ? e : "";
}
function ap(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function rp() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class op {
  async publish(t, n, a) {
    const r = await dp(n), o = ip({
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
    }, c = up(t.message);
    if (Gs() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function ip(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, a = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", r = sp(e.rolls), o = cp(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${ya(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${ue(e.abilityName)}</h3>
          <p>${ue(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${ue(e.activationLabel)}</span>
        <span><strong>Custo</strong>${ue(t)}</span>
      </div>

      ${r}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${a}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${ue(n)}</span>
      </footer>
    </article>
  `;
}
function sp(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const a = `paranormal-toolkit-ability-card__roll--${n.intent}`, r = lp(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${a}"
          ${gr}="${ya(n.id)}"
          title="${ya(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${ue(n.label)}</strong>
            <small>${ue(r)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function lp(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${cl(e.damageType)}` : "Dano";
  }
}
function cp(e) {
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
function up(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function ue(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ya(e) {
  return ue(e);
}
async function dp(e) {
  const t = e.chatDescription || e.description, n = mp();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: fp(e.actor)
  });
}
function mp() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function fp(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class pp {
  constructor(t, n, a = new op()) {
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
    if (!gp(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const a = Xf(n, t.item), r = this.readCurrentResource(a);
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
function gp(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Lo = 1e3;
class hp {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new pp(t, n), this.strategy = new al(
      (a) => this.handleItemUsed(a)
    );
  }
  register() {
    this.strategy.register(), qf(), Lf(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (ma().executionMode === "disabled" || !yp(t.item)) return;
    const n = _p(t);
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
function bp(e, t) {
  const n = new hp(e, t);
  return n.register(), n;
}
function yp(e) {
  if (e.type !== "ability") return !1;
  const t = rr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function _p(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let vo = !1, Bn = !1, Un = !1, Dt = null;
const Ap = 1e3, Tp = 750, Rp = 1e3;
function kp(e) {
  vo || (Hooks.on("combatTurnChange", (t) => {
    $p(e, Do(t));
  }), Hooks.on("deleteCombat", (t) => {
    wp(e, Do(t));
  }), vo = !0, Ep(e));
}
function Ep(e) {
  hn() && (Bn || (Bn = !0, globalThis.setTimeout(() => {
    Bn = !1, br(e, "ready");
  }, Ap)));
}
function $p(e, t) {
  hn() && t && (Dt && globalThis.clearTimeout(Dt), Dt = globalThis.setTimeout(() => {
    Dt = null, br(e, "combat-turn-change", t);
  }, Tp));
}
function wp(e, t) {
  hn() && t && (Un || (Un = !0, globalThis.setTimeout(() => {
    Un = !1, br(e, "combat-deleted", t);
  }, Rp)));
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
const ml = {
  enabled: "dice.animations.enabled"
};
function Cp() {
  game.settings.register(d, ml.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Sp() {
  return {
    enabled: game.settings.get(d, ml.enabled) === !0
  };
}
const bn = "chatCard", xo = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Ip = `.${i}__title`, fl = `.${i}__header`, Lp = `.${i}__roll-card`, vp = `.${i}__roll-meta`, Dp = `.${i}__roll-meta-pill`, yr = `.${i}__resistance`, xp = `.${i}__resistance-header`, pl = `.${i}__resistance-description`, yn = `.${i}__resistance-roll-button`, gl = `.${i}__resistance-roll-result`, No = `${i}__resistance-content`, hl = `.${i}__workflow-section`, bl = `.${i}__workflow-roll`, _r = `${i}__workflow-roll--dice-open`, Ar = `.${i}__workflow-roll-formula`, Tr = `${i}__workflow-roll-formula--toggle`, _n = `.${i}__workflow-dice-tray`, Np = `.${i}__roll-detail-toggle`, Pp = `.${i}__roll-detail-list`, Mp = `.${i}__ritual-element-badge`, Op = `.${i}__ritual-metadata`, Fp = "casting-backlash", Bp = "data-paranormal-toolkit-action-section", Up = "data-paranormal-toolkit-prompt-id", zp = "data-paranormal-toolkit-pending-id", Po = "data-paranormal-toolkit-casting-backlash-enhanced", Mo = `.${i}`, qp = `.${i}__workflow-section--casting`, jp = `.${i}__workflow-section-header`, Gp = `.${i}__workflow-notes`, Hp = `[${Bp}="${Fp}"]`, Oo = `${i}__workflow-section-title-row`, Vp = `${i}__workflow-section-header--casting-backlash`, yl = `${i}__casting-backlash-button`;
function Wp(e) {
  for (const t of Kp(e))
    Yp(t), eg(t);
}
function Kp(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Mo) && t.add(e);
  for (const n of e.querySelectorAll(Mo))
    t.add(n);
  return Array.from(t);
}
function Yp(e) {
  const t = e.querySelector(Hp);
  if (!t) return;
  const n = Xp(t);
  if (!n) return;
  const a = e.querySelector(`${qp} ${jp}`);
  a && (a.classList.add(Vp), Qp(a), Zp(n), a.append(n), t.remove());
}
function Xp(e) {
  return e.querySelector(
    `button[${zp}], button[${Up}]`
  );
}
function Qp(e) {
  const t = e.querySelector(`:scope > .${Oo}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Oo);
  const a = Array.from(e.childNodes);
  e.prepend(n);
  for (const r of a)
    r !== n && (r instanceof HTMLButtonElement && r.classList.contains(yl) || n.append(r));
  return n;
}
function Zp(e) {
  if (e.getAttribute(Po) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Jp(t, e.disabled);
  e.classList.add(yl), e.setAttribute(Po, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Jp(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function eg(e) {
  for (const t of e.querySelectorAll(Gp)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function tg(e) {
  for (const t of Array.from(e.querySelectorAll(hl)))
    for (const n of Array.from(t.querySelectorAll(`${Np}, ${Pp}`)))
      n.remove();
}
const ng = {
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
}, ag = new Set(
  Object.values(ng)
), rg = {
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
function og(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = ig(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = rg[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : ag.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function _l(e) {
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
function ig(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Al {
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
      const g = sg(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = og(m.damageType);
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
          lg(g.id, m, _.value)
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
        for (const E of ug(k.conditions))
          l.add(E);
        const R = cg(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? _l(_.value),
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
function sg(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function lg(e, t, n) {
  return {
    id: e,
    label: t.label ?? _l(n),
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
function cg(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ug(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Rr {
  async rollResistance(t) {
    const n = await mg(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? we(t.skill),
      roll: n,
      formula: pg(n),
      total: gg(n),
      diceBreakdown: hg(n)
    };
  }
  getSkillLabel(t) {
    return we(t);
  }
}
async function dg(e, t) {
  return new Rr().rollResistance({ actor: e, skill: t });
}
function we(e) {
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
async function mg(e, t) {
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
  return fg(a);
}
function fg(e) {
  return Bo(e) ? e : Array.isArray(e) ? e.find(Bo) ?? null : null;
}
function Bo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function pg(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function gg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function hg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(bg);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function bg(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class Tl {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class Rl {
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
function yg(e, t) {
  const n = $g(e?.rounds);
  if (!n)
    return Uo(null);
  const a = e?.anchor ?? kl(t);
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
    duration: _g(),
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
function kl(e) {
  const t = wg();
  if (!t?.id || !El(t.round)) return null;
  const n = kg(t), a = Ag(e, n) ?? Rg(t), r = ce(a?.id), o = Sg(a?.initiative), s = Tg(t, a, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: r,
    round: t.round,
    turn: s,
    initiative: o,
    time: Cg()
  };
}
function _g() {
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
function Ag(e, t) {
  return e?.id ? t.find((n) => Eg(n) === e.id) ?? null : null;
}
function Tg(e, t, n) {
  const a = ce(t?.id);
  if (a) {
    const r = n.findIndex((o) => o.id === a);
    if (r >= 0) return r;
  }
  return Ig(e.turn) ? e.turn : null;
}
function Rg(e) {
  return qt(e.combatant) ? e.combatant : null;
}
function kg(e) {
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
function Eg(e) {
  return ce(e.actor?.id) ?? ce(e.actorId) ?? ce(e.token?.actor?.id) ?? ce(e.token?.actorId) ?? ce(e.document?.actor?.id) ?? ce(e.document?.actorId);
}
function $g(e) {
  return El(e) ? Math.trunc(e) : null;
}
function wg() {
  return game.combat ?? null;
}
function Cg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function qt(e) {
  return !!(e && typeof e == "object");
}
function ce(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Sg(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function El(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ig(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class $l {
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
    if (!Bg(a))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const r = n.value, o = yg(t.duration, a), s = Lg(r, t, o), c = t.refreshExisting ?? !0 ? Ug(a, r.id) : null;
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
    const a = this.resolveCanonicalConditionId(t.conditionId), r = Cl(n, a);
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
    const n = jg(), a = [];
    let r = 0, o = 0;
    for (const s of n) {
      const l = kr(s);
      r += l.length;
      for (const c of l) {
        if (!xg(c, t)) continue;
        const u = wl(c);
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
function Lg(e, t, n) {
  const a = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Jg(),
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
    duration: vg(n.duration),
    start: Dg(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: a
    }
  };
}
function vg(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Dg(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Zg(),
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
function xg(e, t) {
  const n = wl(e);
  if (!n.conditionId || !Ng(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const a = Qg();
  return n.durationMode === "combatantTurn" || Pg(n) ? Og(n, a) : Mg(e) || !a?.id || n.combatId && n.combatId !== a.id ? !0 : !Z(n.startRound) || !Z(n.requestedRounds) || !Z(a.round) ? !1 : a.round >= n.startRound + n.requestedRounds;
}
function Ng(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Z(e.requestedRounds);
}
function Pg(e) {
  return !!(e.combatDurationApplied && Z(e.requestedRounds) && Z(e.startRound) && (e.startCombatantId || Qt(e.startTurn)));
}
function Mg(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Og(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !Z(e.startRound) || !Z(e.requestedRounds) || !Z(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const a = Fg(t);
  return e.startCombatantId ? a === e.startCombatantId : Qt(e.startTurn) && Qt(t.turn) ? t.turn === e.startTurn : !1;
}
function Fg(e) {
  return Fe(e.combatant?.id);
}
function wl(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: jt(e, "conditionId"),
    requestedRounds: jo(e, "requestedRounds") ?? lt(t.value) ?? lt(t.rounds),
    combatDurationApplied: zn(e, "combatDurationApplied"),
    combatId: jt(e, "combatId") ?? Fe(n.combat) ?? Fe(t.combat),
    startCombatantId: jt(e, "startCombatantId") ?? Fe(n.combatant),
    startInitiative: Wg(e, "startInitiative") ?? Sl(n.initiative),
    startRound: jo(e, "startRound") ?? lt(n.round) ?? lt(t.startRound),
    startTurn: Vg(e, "startTurn") ?? _a(n.turn) ?? _a(t.startTurn),
    expiryEvent: Kg(e, "expiryEvent") ?? Il(t.expiry),
    durationMode: Yg(e, "durationMode"),
    deleteOnExpire: zn(e, "deleteOnExpire"),
    expiresWithCombat: zn(e, "expiresWithCombat")
  };
}
function Bg(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Ug(e, t) {
  return Cl(e, t)[0] ?? null;
}
function Cl(e, t) {
  return kr(e).filter((n) => Hg(n) === t);
}
async function qo(e, t) {
  const n = t.id ?? null, a = n ? zg(e, n) : t;
  if (!a) return "missing";
  try {
    return await Promise.resolve(a.delete?.()), "deleted";
  } catch (r) {
    if (qg(r)) return "missing";
    throw r;
  }
}
function zg(e, t) {
  return kr(e).find((n) => n.id === t) ?? null;
}
function qg(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function jg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      xt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    xt(e, n);
  });
  for (const n of Gg())
    xt(e, n.actor), xt(e, n.document?.actor);
  return Array.from(e.values());
}
function xt(e, t) {
  if (!Xg(t)) return;
  const a = Fe(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(a, t);
}
function Gg() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function kr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Hg(e) {
  return jt(e, "conditionId");
}
function jt(e, t) {
  return Fe(Le(e, t));
}
function jo(e, t) {
  return lt(Le(e, t));
}
function Vg(e, t) {
  return _a(Le(e, t));
}
function Wg(e, t) {
  return Sl(Le(e, t));
}
function Kg(e, t) {
  return Il(Le(e, t));
}
function Yg(e, t) {
  const n = Le(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function zn(e, t) {
  return Le(e, t) === !0;
}
function Le(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const a = e.flags;
  if (!a || typeof a != "object") return;
  const r = a[d];
  if (!(!r || typeof r != "object"))
    return r[t];
}
function Fe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function lt(e) {
  return Z(e) ? Math.trunc(e) : null;
}
function _a(e) {
  return Qt(e) ? Math.trunc(e) : null;
}
function Sl(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Il(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Xg(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Qg() {
  return game.combat ?? null;
}
function Zg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Z(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Qt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Jg() {
  return game.user?.id ?? null;
}
const eh = "icons/svg/downgrade.svg", th = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? eh,
    description: th,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const nh = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), ah = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), rh = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), oh = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), ih = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), sh = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), lh = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), ch = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), uh = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), dh = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), mh = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), fh = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), ph = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), gh = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), hh = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), bh = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), yh = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), _h = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Ah = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Th = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Rh = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), kh = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Eh = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), $h = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), wh = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Ch = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Sh = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Ih = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Lh = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), vh = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Dh = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), xh = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Nh = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Ph = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Mh = [
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
  Eh,
  $h,
  wh,
  Ch,
  Sh,
  Ih,
  Lh,
  vh,
  Dh,
  xh,
  Nh,
  Ph
];
class Oh {
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
    const n = this.lookup.get(Ho(t)), a = n ? this.definitions.get(n) : null;
    return a ? y(Go(a)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const a = Ho(t);
    a && this.lookup.set(a, n);
  }
}
function Ll() {
  return new Oh(Mh);
}
function Go(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Ho(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Ge(e) {
  return e.applyOnResistance ?? "failure";
}
function vl(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Dl(e, t) {
  const n = Ge(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function xl(e) {
  const t = Ge(e);
  return t === "failure" || t === "success";
}
function Fh(e, t, n, a) {
  const r = e.filter((c) => Dl(c, t));
  if (r.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? r.filter((c) => Ge(c) === t) : [], s = o.length > 0 ? o : r;
  if (s.length === 1) return s[0] ?? null;
  const l = a(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => a(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Bh = {
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
}, Uh = {
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
function zh(e) {
  return Pl(e, Bh, !1);
}
function qh(e) {
  return Pl(e, Uh, !e.allowsSuccessfulResistance);
}
function Ze(e) {
  return e.kind === "waiting-resistance";
}
function Nl(e) {
  return e.kind === "resisted";
}
function Pl(e, t, n) {
  const a = { ...t, ...e.labels };
  return e.alreadyApplied ? Ne("applied", !1, a.applied, a.appliedCompact, null) : e.unavailable ? Ne("unavailable", !1, a.unavailable, a.unavailableCompact, a.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || dn(e.resistanceGateMode, e.resistanceState) ? Ne(
    "waiting-resistance",
    !1,
    a.waitingResistance,
    a.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Ne("resisted", !1, a.resisted, a.resistedCompact, a.resisted) : Ne("available", !0, a.available, a.availableCompact, null);
}
function Ne(e, t, n, a, r) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: a,
    reason: r
  };
}
const ct = "data-paranormal-toolkit-prompt-id", jh = "data-paranormal-toolkit-resistance-roll-result", Gh = "Conjuração DT";
function Hh(e) {
  const t = e.querySelector(yn)?.getAttribute(jh), n = ht(t);
  if (n !== null) return n;
  const a = e.querySelector(gl)?.textContent ?? null, r = a ? /=\s*(-?\d+)\s*$/u.exec(a) : null;
  return ht(r?.[1] ?? null);
}
function Er(e) {
  const t = Ml(e), n = Yh(t);
  if (n !== null) return n;
  const a = Kh(t);
  return a !== null ? a : Xh(e);
}
function Vh(e) {
  const t = Ml(e);
  return t ? {
    actorId: qn(t.actorId),
    itemId: qn(t.itemId),
    itemName: qn(t.itemName)
  } : null;
}
function Wh(e) {
  const t = e.getAttribute(ct);
  if (!t) return null;
  const n = Ol(e), a = Fl(n), s = (Array.isArray(a?.prompts) ? a.prompts : []).find((l) => An(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function pe(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Aa(e) {
  return pe(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Kh(e) {
  const t = Zh(e);
  return t.length === 0 ? null : ht(Jh(t, Gh));
}
function Yh(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const a = game.actors?.get?.(t);
  return !a || typeof a != "object" ? null : Vo(a, ["system", "ritual", "DT"]) ?? Vo(a, ["system", "ritual", "dt"]);
}
function Xh(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((a) => a.textContent).find((a) => typeof a == "string" && a.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return ht(n?.[1] ?? null);
}
function Ml(e) {
  const t = Qh(e);
  if (!t) return null;
  const n = Ol(e), a = Fl(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => An(o) ? o.pendingId === t : !1) ?? null;
}
function Qh(e) {
  return (e.closest(`[${ct}]`) ?? e.querySelector(`[${ct}]`) ?? e.parentElement?.querySelector(`[${ct}]`) ?? null)?.getAttribute(ct) ?? null;
}
function Ol(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return eb(r) ? r : null;
}
function Fl(e) {
  const t = e?.getFlag?.(d, bn);
  return An(t) ? t : null;
}
function Zh(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Jh(e, t) {
  const n = `${t}:`;
  for (const a of e) {
    if (!a.startsWith(n)) continue;
    const r = a.slice(n.length).trim();
    if (r.length > 0) return r;
  }
  return null;
}
function Vo(e, t) {
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
function eb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function An(e) {
  return !!(e && typeof e == "object");
}
function qn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Tn(e) {
  return Bl({
    hasResistance: !!e.querySelector(yr),
    difficulty: Er(e),
    resistanceTotal: Hh(e)
  });
}
function tb(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Bl({
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
function Bl(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Zd(e)
  };
}
function ve() {
  return game.user?.isGM === !0;
}
function Ce() {
  return ve();
}
function nb(e) {
  const t = dn(e.resistanceGateMode, e.resistanceState), n = ab(e.resistanceState, e.hasDamage), a = rb(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), r = zh({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = qh({
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
function ab(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function rb(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function $r(e) {
  const t = e.isGM ?? Ce();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: nb({
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
function ob(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const a = document.createElement("strong");
  a.classList.add(`${i}__workflow-roll-total`), a.textContent = e.total === null ? "—" : String(e.total), t.append(n, a);
  const r = sb(e.formula, e.diceBreakdown ?? null);
  return r && t.append(r), t;
}
function ib(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function sb(e, t) {
  const n = lb(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${i}__workflow-dice-tray`);
  for (const r of cb(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), r.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function lb(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function cb(e, t) {
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
const ub = "data-paranormal-toolkit-resistance-skill", db = "data-paranormal-toolkit-resistance-skill-label", mb = "data-paranormal-toolkit-roll-card-target-names", fb = "data-paranormal-toolkit-roll-card-resistance", pb = "data-paranormal-toolkit-roll-card-resistance-skill", gb = "data-paranormal-toolkit-roll-card-resistance-skill-label", Ul = "pending", wr = "success", Cr = "failure", zl = "rolled";
function hb(e) {
  const t = Tb(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? _b(e.damageSection) : null, a = Ko(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), r = bb(e.rollCard).map((o, s) => {
    const l = yb(o, s), c = e.resistanceResults.get(l) ?? null, u = Cb(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = tb({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Db(u)
    }).state, k = Ko(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      vl(_)
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
        effectRequiresResolvedResistance: k ? xl(k) : !1
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
function bb(e) {
  const t = e.getAttribute(mb), n = t ? vb(t) : [];
  if (n.length > 0) return n;
  const r = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = r.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && ql(s) !== "nenhum alvo") : [];
}
function yb(e, t) {
  return `${ql(e)}:${t}`;
}
function _b(e) {
  const t = Sb(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Lb(e),
    formula: Ib(e) ?? "—",
    total: t,
    diceBreakdown: ib(e),
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
    duration: Ab(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Ge(o)
  } : null;
}
function Ab(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Tb(e, t) {
  const n = kb(t), a = Rb(e), r = a.description ?? Eb(n)?.textContent?.trim(), o = $b(n), s = a.skill ?? o?.getAttribute(ub) ?? null, l = a.skillLabel ?? o?.getAttribute(db) ?? (s ? we(s) : null);
  return !r && !s ? null : {
    description: r ?? "Resistência do alvo.",
    formula: wb(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: Er(e)
  };
}
function Rb(e) {
  return {
    description: jn(e, fb),
    skill: jn(e, pb),
    skillLabel: jn(e, gb)
  };
}
function kb(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function Eb(e) {
  return Sr(e, `.${i}__resistance-description`);
}
function $b(e) {
  return Sr(e, yn);
}
function wb(e) {
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
function Cb(e, t) {
  return e ? t === null ? zl : e.total >= t ? wr : Cr : Ul;
}
function Sb(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Ib(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Lb(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function vb(e) {
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
function ql(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Db(e) {
  return e === wr ? "succeeded" : e === Cr ? "failed" : "pending";
}
function jl(e) {
  if (!e) return null;
  const t = e.actorId ? Pb(e.actorId) : null, n = t ? xb(t, e.itemId, e.itemName) : null;
  return n || Nb(e.itemId, e.itemName);
}
function xb(e, t, n) {
  const a = e.items;
  if (t) {
    const o = a?.get?.(t);
    if (Be(o)) return o;
  }
  const r = Zt(n);
  if (r) {
    const o = a?.find?.((s) => Be(s) ? Zt(s.name) === r : !1);
    if (Be(o)) return o;
  }
  return null;
}
function Nb(e, t) {
  const n = game.items;
  if (e) {
    const r = n?.get?.(e);
    if (Be(r)) return r;
  }
  const a = Zt(t);
  if (a) {
    const r = n?.find?.((o) => Be(o) ? Zt(o.name) === a : !1);
    if (Be(r)) return r;
  }
  return null;
}
function Pb(e) {
  const n = game.actors?.get?.(e);
  return Mb(n) ? n : null;
}
function Mb(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Be(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Zt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ir(e) {
  const t = Gn(e);
  if (!t) return null;
  const n = Ob().filter((o) => Gn(Fb(o)) === t).map((o) => Gl(o)).find(ft) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => ft(o) && Gn(o.name) === t);
  return ft(r) ? r : null;
}
function Ob() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Fb(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Gl(e)?.name ?? null;
}
function Gl(e) {
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
async function Hl(e) {
  const t = qb();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Bb(e)
  });
}
function Bb(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Gt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", a = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", r = Ub(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Gt(e.conditions.join(", "))}</li>` : "";
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
function Ub(e) {
  const t = zb(e.actor), n = e.newPV ?? t?.value ?? null, a = t?.max ?? null;
  if (n === null) return "";
  const r = a === null ? `${n}` : `${n}/${a}`;
  return `<li><strong>PV atual</strong>: ${Gt(r)}</li>`;
}
function zb(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, a = Yo(n?.value);
  return a === null ? null : {
    value: a,
    max: Yo(n?.max)
  };
}
function Yo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function qb() {
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
async function jb(e) {
  await Hl(Gb(e));
}
function Gb(e) {
  if (Hb(e)) return e;
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
function Hb(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Vl(e) {
  return e.mode, `✓ ${Wl(e.inputAmount)} PV`;
}
function Vb(e) {
  const t = Wl(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Wl(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Wb {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? Ce()) !== !0 ? {
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
class Kb {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? Ce()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : dn(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Yb {
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
const Xb = `.${i}__actions`, Lr = `.${i}__actions-title`, He = `.${i}__button`, Qb = "data-paranormal-toolkit-action-section", Zb = `${i}__button--executed`, Jb = "data-paranormal-toolkit-executed-label";
function Kl(e) {
  return pe(e.querySelector(Lr)?.textContent);
}
function ey(e, t) {
  const n = e.querySelector(Lr);
  n && (n.textContent = t);
}
function kt(e, t) {
  const n = pe(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((a) => {
    const r = a.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return pe(r) === n;
  }) ?? null;
}
function vr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function De(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Yl(e) {
  const t = ty(e.difficulty);
  if (t === null) return null;
  const n = Xo(e.skillLabel) ?? "Resistência", a = Xo(e.description), r = ny(a, n), o = ay(r, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function ty(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Xo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function ny(e, t) {
  if (!e) return null;
  const n = Qo(e), a = Qo(t);
  if (!n.startsWith(a)) return e;
  const r = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return r.length > 0 ? r : null;
}
function ay(e, t) {
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
const Nt = "data-paranormal-toolkit-prompt-id", Xl = "multiTargetResistanceResults", Ql = "multiTargetDamageApplications", Zl = "multiTargetEffectApplications";
function ry(e) {
  const t = /* @__PURE__ */ new Map(), a = Rn(e)?.[Xl];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    dy(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function oy(e, t) {
  await Dr(e, Xl, t.targetId, t);
}
function iy(e) {
  const t = /* @__PURE__ */ new Map(), a = Rn(e)?.[Ql];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    my(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function sy(e, t) {
  await Dr(
    e,
    Ql,
    t.targetId,
    t
  );
}
function ly(e) {
  const t = /* @__PURE__ */ new Map(), a = Rn(e)?.[Zl];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    py(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function cy(e, t) {
  await Dr(
    e,
    Zl,
    t.targetId,
    t
  );
}
function uy(e) {
  const t = Rn(e);
  return t ? {
    actorId: Hn(t.actorId),
    itemId: Hn(t.itemId),
    itemName: Hn(t.itemName)
  } : null;
}
async function Dr(e, t, n, a) {
  const r = Jl(e);
  if (!r) return;
  const o = ec(e), s = tc(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!J(u) || u.pendingId !== r) return u;
    const m = J(u[t]) ? u[t] : {};
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
  const t = Jl(e);
  if (!t) return null;
  const n = ec(e), a = tc(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => J(o) ? o.pendingId === t : !1) ?? null;
}
function Jl(e) {
  return (e.closest(`[${Nt}]`) ?? e.querySelector(`[${Nt}]`) ?? e.parentElement?.querySelector(`[${Nt}]`) ?? null)?.getAttribute(Nt) ?? null;
}
function ec(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return gy(r) ? r : null;
}
function tc(e) {
  const t = e?.getFlag?.(d, bn);
  return J(t) ? t : null;
}
function dy(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function my(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && fy(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function fy(e) {
  return e === "normal" || e === "half";
}
function py(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Hn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function gy(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function J(e) {
  return !!(e && typeof e == "object");
}
const hy = "data-paranormal-toolkit-resistance-skill", by = "data-paranormal-toolkit-resistance-skill-label", Ta = "data-paranormal-toolkit-multi-target-section", xr = "data-paranormal-toolkit-multi-target-damage-info", nc = "data-paranormal-toolkit-multi-target-effect-info", ac = "data-paranormal-toolkit-multi-target-toggle", rc = "data-paranormal-toolkit-multi-target-details", W = "data-paranormal-toolkit-multi-target-target", yy = "data-paranormal-toolkit-multi-target-state", Ra = "data-paranormal-toolkit-multi-target-roll-total", ka = "data-paranormal-toolkit-multi-target-roll-formula", Ht = "data-paranormal-toolkit-multi-target-roll-dice", Ea = "data-paranormal-toolkit-multi-target-roll-skill", $a = "data-paranormal-toolkit-multi-target-roll-skill-label", wa = "data-paranormal-toolkit-multi-target-roll-target-name", Ca = "data-paranormal-toolkit-multi-target-roll-rolled-at", Sa = "data-paranormal-toolkit-multi-target-damage-mode", Ia = "data-paranormal-toolkit-multi-target-damage-input-amount", Zo = "data-paranormal-toolkit-multi-target-damage-final-amount", Jo = "data-paranormal-toolkit-multi-target-damage-blocked", La = "data-paranormal-toolkit-multi-target-damage-target-name", va = "data-paranormal-toolkit-multi-target-damage-applied-at", Da = "data-paranormal-toolkit-multi-target-effect-condition-id", xa = "data-paranormal-toolkit-multi-target-effect-condition-label", Na = "data-paranormal-toolkit-multi-target-effect-effect-id", Pa = "data-paranormal-toolkit-multi-target-effect-created", Ma = "data-paranormal-toolkit-multi-target-effect-refreshed", Oa = "data-paranormal-toolkit-multi-target-effect-target-name", Fa = "data-paranormal-toolkit-multi-target-effect-applied-at", _y = new $l(Ll()), Ay = new Tl(new Al()), Ty = new Rl(new Rr()), Ry = new Yb(Ty), ky = new Wb(Ay), Ey = new Kb(_y), $y = Ul, Je = wr, Et = Cr, wy = zl;
function Cy(e) {
  const t = oc(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), My(e);
  const n = Oy(e.rollCard, t), a = Fy(e.rollCard, t);
  !n && a && A_(e.rollCard, a, e.effectSection);
  const r = Gy(e.rollCard);
  return lc(r, t), b_(
    e.rollCard,
    r,
    By(e.rollCard, {
      damageInfo: n,
      effectInfo: a,
      effectSection: e.effectSection
    })
  ), n && a && T_(e.rollCard, a, r), !0;
}
function oc(e) {
  return hb({
    ...e,
    resistanceResults: Ly(e.rollCard),
    damageApplications: vy(e.rollCard),
    effectApplications: Dy(e.rollCard),
    resolveTargetConditionApplication: Sy,
    resistanceGateMode: Pr()
  });
}
function Sy(e, t, n) {
  const a = uy(e), r = jl(a);
  if (!r) return null;
  const o = Tt(r);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = Iy(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function Iy(e, t, n) {
  const a = Fh(
    e,
    n,
    t,
    Vn
  );
  if (a) return a;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const r = Vn(t);
  return r ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => Vn(s) === r)) ?? null : null;
}
function Ly(e) {
  const t = ry(e);
  for (const [n, a] of Py(e))
    t.set(n, a);
  return t;
}
function vy(e) {
  const t = iy(e);
  for (const [n, a] of Ny(e))
    t.set(n, a);
  return t;
}
function Dy(e) {
  const t = ly(e);
  for (const [n, a] of xy(e))
    t.set(n, a);
  return t;
}
function xy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${W}]`)) {
    const a = n.getAttribute(W), r = n.getAttribute(Da), o = n.getAttribute(xa), s = n.getAttribute(Na), l = ni(n.getAttribute(Pa)), c = ni(n.getAttribute(Ma)), u = n.getAttribute(Oa), m = n.getAttribute(Fa);
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
function Ny(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${W}]`)) {
    const a = n.getAttribute(W), r = n.getAttribute(Sa), o = yc(n.getAttribute(Ia)), s = n.getAttribute(La), l = n.getAttribute(va);
    !a || !E_(r) || o === null || !s || !l || t.set(a, {
      targetId: a,
      targetName: s,
      mode: r,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Py(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${W}]`)) {
    const a = n.getAttribute(W), r = yc(n.getAttribute(Ra)), o = n.getAttribute(ka), s = n.getAttribute(Ea), l = n.getAttribute($a), c = n.getAttribute(wa), u = n.getAttribute(Ca);
    !a || r === null || !o || !s || !l || !c || !u || t.set(a, {
      targetId: a,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: r,
      diceBreakdown: n.getAttribute(Ht),
      rolledAt: u
    });
  }
  return t;
}
function My(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Oy(e, t) {
  if (!t.damage)
    return ic(e)?.remove(), null;
  const n = Uy(e);
  return zy(n, t.damage), jy(e, n), n;
}
function Fy(e, t) {
  if (!t.effect)
    return bc(e)?.remove(), null;
  const n = y_(e);
  return __(n, t.effect), n;
}
function By(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : kt(e, "Conjuração");
}
function Uy(e) {
  const t = ic(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(xr, "true"), n;
}
function ic(e) {
  return e.querySelector(`[${xr}="true"]`);
}
function zy(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const a = document.createElement("strong");
  if (a.textContent = "Dano", n.append(a), e.append(n), t.typeLabel) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-section-description`), r.textContent = t.typeLabel, e.append(r);
  }
  e.append(sc(t.formula, t.total, t.diceBreakdown));
}
function sc(e, t, n, a = !1) {
  const r = ob({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return qy(r, a), r;
}
function qy(e, t) {
  const n = e.querySelector(_n), a = e.querySelector(Ar);
  if (!n || !a) return;
  e.classList.toggle(_r, t), n.hidden = !t, a.classList.add(Tr), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-expanded", t ? "true" : "false"), a.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", a.setAttribute("aria-label", a.title);
  const r = a.querySelector("i") ?? document.createElement("i");
  r.classList.add("fa-solid"), r.classList.toggle("fa-chevron-down", !t), r.classList.toggle("fa-chevron-up", t), r.setAttribute("aria-hidden", "true"), r.parentElement || a.append(r);
}
function jy(e, t) {
  const n = kt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Gy(e) {
  const t = e.querySelector(`[${Ta}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Ta, "true"), n;
}
function lc(e, t) {
  const n = Hy(e), a = Wy(t.resistance), r = [Vy(t)];
  a && r.push(a), r.push(Xy(t, n)), e.replaceChildren(...r);
}
function Hy(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${W}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(W)).filter(k_)
  );
}
function Vy(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const a = document.createElement("span");
  return a.classList.add(`${i}__targets-status`), a.textContent = Yy(e.targets), t.append(n, a), t;
}
function Wy(e) {
  const t = Yl({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Ky(n, t), n;
}
function Ky(e, t) {
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
function Yy(e) {
  const t = e.length, n = e.filter((l) => l.state === Et).length, a = e.filter((l) => l.state === Je).length, r = e.filter((l) => l.state === $y).length, o = e.filter((l) => l.state === wy).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), a > 0 && s.push(`${a} ${a === 1 ? "sucesso" : "sucessos"}`), r > 0 && s.push(`${r} ${r === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Xy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const a of e.targets)
    n.append(Qy(a, e, t.has(a.id)));
  return n;
}
function Qy(e, t, n) {
  const a = document.createElement("article");
  a.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && a.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && a.classList.add(`${i}__target-row--effect-applied`), a.setAttribute(W, e.id), a.setAttribute(yy, e.state), a.setAttribute("aria-expanded", n ? "true" : "false"), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), cc(a, e.resistanceResult), uc(a, e.damageApplication), dc(a, e.effectApplication);
  const r = Zy(e, t, a), o = f_(e, t);
  return o.hidden = !n, a.addEventListener("click", (s) => {
    ti(s.target) || ei(a);
  }), a.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || ti(s.target) || (s.preventDefault(), ei(a));
  }), a.append(r, o), a;
}
function cc(e, t) {
  if (!t) {
    e.removeAttribute(Ra), e.removeAttribute(ka), e.removeAttribute(Ht), e.removeAttribute(Ea), e.removeAttribute($a), e.removeAttribute(wa), e.removeAttribute(Ca);
    return;
  }
  e.setAttribute(Ra, String(t.total)), e.setAttribute(ka, t.formula), e.setAttribute(Ea, t.skill), e.setAttribute($a, t.skillLabel), e.setAttribute(wa, t.targetName), e.setAttribute(Ca, t.rolledAt), t.diceBreakdown ? e.setAttribute(Ht, t.diceBreakdown) : e.removeAttribute(Ht);
}
function uc(e, t) {
  if (!t) {
    e.removeAttribute(Sa), e.removeAttribute(Ia), e.removeAttribute(Zo), e.removeAttribute(Jo), e.removeAttribute(La), e.removeAttribute(va);
    return;
  }
  e.setAttribute(Sa, t.mode), e.setAttribute(Ia, String(t.inputAmount)), e.removeAttribute(Zo), e.removeAttribute(Jo), e.setAttribute(La, t.targetName), e.setAttribute(va, t.appliedAt);
}
function dc(e, t) {
  if (!t) {
    e.removeAttribute(Da), e.removeAttribute(xa), e.removeAttribute(Na), e.removeAttribute(Pa), e.removeAttribute(Ma), e.removeAttribute(Oa), e.removeAttribute(Fa);
    return;
  }
  e.setAttribute(Da, t.conditionId), e.setAttribute(xa, t.conditionLabel), e.setAttribute(Na, t.effectId ?? ""), e.setAttribute(Pa, String(t.created)), e.setAttribute(Ma, String(t.refreshed)), e.setAttribute(Oa, t.targetName), e.setAttribute(Fa, t.appliedAt);
}
function Zy(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary`);
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary-main`);
  const o = Jy(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = e_(e, t.resistance);
  r_(l, n, e, t);
  const c = m_(n);
  r.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), gc(u, [
    mc(e, t, "compact"),
    pc(e, t, "compact")
  ]), a.append(r, u), a;
}
function Jy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function e_(e, t) {
  if (!ve())
    return t_(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", a_(e, t)), t?.skill && (n.setAttribute(hy, t.skill), n.setAttribute(by, t.skillLabel ?? we(t.skill))), !t?.skill)
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
function t_(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", n_(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === Je ? "✓" : e.state === Et ? "✕" : "", n.append(a, r), n;
}
function n_(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const a = e.state === Je ? "sucesso" : e.state === Et ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}.`;
}
function a_(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const a = e.state === Je ? "sucesso" : e.state === Et ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}. Rolar novamente`;
}
function r_(e, t, n, a) {
  !(e instanceof HTMLButtonElement) || !ve() || e.addEventListener("click", (r) => {
    r.stopPropagation(), o_(t, e, n, a);
  });
}
async function o_(e, t, n, a) {
  if (!ve()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const r = a.resistance, o = r?.skill, s = r?.skillLabel ?? (o ? we(o) : "Resistência");
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
    const u = await Ry.execute({ actor: l, skill: o, skillLabel: s });
    await R_(u.roll);
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
    cc(e, m);
    try {
      await oy(a.rollCard, m);
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
  const a = oc({
    rollCard: n,
    damageSection: i_(n) ?? kt(n, "Dano"),
    effectSection: s_(n)
  });
  a && lc(t, a);
}
function i_(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(xr) !== "true") ?? null;
}
function s_(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function l_(e) {
  return Ze(e.assistedActions.policy.damageActionState);
}
function c_(e) {
  return Ze(e.assistedActions.policy.effectActionState);
}
function Pr() {
  try {
    return dr();
  } catch {
    return "strict";
  }
}
function mc(e, t, n) {
  if (e.damageApplication)
    return me(
      "✓",
      Vl({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const a = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Ze(a))
    return me(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = fc(r, t.damage);
  if (o === null)
    return me(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Vb({ inputAmount: o, mode: r, compact: n === "compact" }), l = r === "half" ? "🛡️" : "⚡", c = r === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = me(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${W}]`);
    g && u_(g, u, e, t);
  }), u;
}
function fc(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function u_(e, t, n, a) {
  if (n.damageApplication) return;
  if (l_(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const r = a.damage;
  if (!r) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = fc(o, r);
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
    const u = await ky.execute({
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
    uc(e, m);
    try {
      await sy(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await jb(u.value);
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
function pc(e, t, n) {
  const a = e.assistedActions.policy.effectActionState, r = e.effect ?? t.effect;
  if (e.effectApplication)
    return me(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!r) return null;
  if (Ze(a))
    return me(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Nl(a))
    return me(
      "✓",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = me(
    "✦",
    n === "full" ? `Aplicar ${r.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${r.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${W}]`);
    l && d_(l, o, e, t);
  }), o;
}
async function d_(e, t, n, a) {
  if (n.effectApplication) return;
  if (c_(n)) {
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
    const l = await Ey.execute({
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
    dc(e, c);
    try {
      await cy(a.rollCard, c);
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
function gc(e, t) {
  for (const n of t)
    n && e.append(n);
}
function me(e, t, n, a) {
  const r = document.createElement("button");
  r.type = "button", r.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), r.disabled = a;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, r.append(o, s), r;
}
function m_(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(ac, "true"), t.setAttribute("aria-hidden", "true"), hc(e, t), t;
}
function ei(e) {
  const t = e.querySelector(`[${rc}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const a = e.querySelector(`[${ac}="true"]`);
  a && hc(e, a);
}
function hc(e, t) {
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
function f_(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(rc, "true");
  const a = document.createElement("div");
  a.classList.add(`${i}__target-resistance-details`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", a.append(r, o);
  const s = p_(e, t.resistance);
  s && a.append(s);
  const l = g_(e, t.resistance), c = h_(e, t);
  return n.append(a, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function p_(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const a = e.state === Je ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${a}`, n;
}
function g_(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const a = e.resistanceResult?.formula ?? t?.formula ?? "—", r = e.resistanceResult?.total ?? null, o = sc(
    a,
    r,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function h_(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), gc(n, [
    mc(e, t, "full"),
    pc(e, t, "full")
  ]), n;
}
function b_(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function y_(e) {
  const t = bc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(nc, "true"), n;
}
function bc(e) {
  return e.querySelector(`[${nc}="true"]`);
}
function __(e, t) {
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
function A_(e, t, n) {
  const a = n?.parentElement === e ? n : kt(e, "Conjuração");
  if (!a) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === a || e.insertBefore(t, a.nextElementSibling);
}
function T_(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Vn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function R_(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function k_(e) {
  return typeof e == "string" && e.length > 0;
}
function E_(e) {
  return e === "normal" || e === "half";
}
function ni(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function yc(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const ai = "data-paranormal-toolkit-card-layout-refresh-bound";
function $_(e) {
  const t = e.rollCard.querySelector(yn);
  t && t.getAttribute(ai) !== "true" && (t.setAttribute(ai, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Ue = "data-paranormal-toolkit-prompt-id", w_ = "apply-damage", C_ = "data-paranormal-toolkit-multi-target-damage-info";
function S_(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(C_) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function I_(e) {
  const t = v_(e);
  return t.find((n) => n.getAttribute(Qb) === w_) ?? t.find((n) => Kl(n) === "aplicar danos") ?? null;
}
function L_(e) {
  const t = _c(e), n = ri(t);
  return n || ri(D_(e));
}
function ri(e) {
  return e.find((t) => {
    const n = Kl(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function v_(e) {
  const t = _c(e);
  return t.length > 0 ? t : Mr(e);
}
function _c(e) {
  const t = P_(e);
  return t ? Mr(e).filter((n) => N_(n, t)) : [];
}
function D_(e) {
  const t = Ac(e);
  if (!t) return [];
  const n = x_(e, t);
  return Mr(e).filter((a) => !a.closest(`.${i}__roll-card`)).filter((a) => Tc(e, a)).filter((a) => !n || M_(a, n));
}
function Mr(e) {
  const t = Ac(e);
  return t ? Array.from(t.querySelectorAll(Xb)) : [];
}
function Ac(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function x_(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && Tc(e, n)) ?? null;
}
function N_(e, t) {
  return e.getAttribute(Ue) === t ? !0 : Array.from(e.querySelectorAll(`[${Ue}]`)).some((n) => n.getAttribute(Ue) === t);
}
function P_(e) {
  return e.getAttribute(Ue) ?? e.querySelector(`[${Ue}]`)?.getAttribute(Ue) ?? null;
}
function Tc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function M_(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function O_(e) {
  const t = Rc(), n = Tn(e.rollCard).state, a = $r({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), r = a.policy.effectActionState, o = Ze(r), s = Nl(r);
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
function F_(e) {
  const { rollCard: t } = e, n = z_(), a = Rc(), r = Tn(t).state, o = $r({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: a,
    resistanceState: r,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Ze(s), c = U_(e);
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
      summary: B_(r)
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
function B_(e) {
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
function U_(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function z_() {
  try {
    return lm();
  } catch {
    return "assisted";
  }
}
function Rc() {
  try {
    return dr();
  } catch {
    return "strict";
  }
}
const q_ = "data-paranormal-toolkit-damage-resolution-state", oi = "data-paranormal-toolkit-damage-icon-enhanced", Or = "data-paranormal-toolkit-damage-original-label", j_ = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, kc = "Outra opção escolhida";
function G_(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), ey(t, "Aplicar dano"), H_(e, t);
}
function H_(e, t) {
  const n = Array.from(t.querySelectorAll(He)), a = si(n, "normal"), r = si(n, "half");
  if (!a || !r) {
    V_(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  li(a, "normal"), li(r, "half");
  const o = F_({
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
    K_(e, t.visible), Y_(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function V_(e) {
  for (const t of e)
    Ba(t) && t.remove();
}
function Jt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(kc);
}
function Ba(e) {
  return e.textContent?.includes(kc) ?? !1;
}
function si(e, t) {
  const n = j_[t];
  return e.find((a) => n.test(W_(a))) ?? null;
}
function W_(e) {
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
  ), e.setAttribute(oi, "true"), e.setAttribute(Or, n), e.setAttribute("aria-label", n), e.replaceChildren(a, De(n));
}
function ci(e) {
  Jt(e) || e.remove();
}
function K_(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function Y_(e, t, n, a = "Role resistência") {
  if (!Jt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", a), e.replaceChildren(De(a));
      return;
    }
    e.removeAttribute("aria-disabled"), X_(e, n);
  }
}
function X_(e, t) {
  const n = e.getAttribute(Or) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Q_(t), De(n)));
}
function Q_(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function di(e, t, n) {
  e.setAttribute(q_, t);
  const a = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    a?.remove();
    return;
  }
  const r = a ?? document.createElement("span");
  r.classList.add(`${i}__damage-resolution-summary`), r.textContent = n, a || e.querySelector(Lr)?.after(r);
}
const bt = "data-paranormal-toolkit-effect-icon-enhanced", Ve = "data-paranormal-toolkit-effect-action-compacted", kn = "data-paranormal-toolkit-effect-resistance-gate", Fr = "data-paranormal-toolkit-effect-section", Br = "data-paranormal-toolkit-effect-label";
function Z_(e) {
  return e.querySelector(`[${Fr}="true"]`);
}
function J_(e) {
  const t = tA(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? aA(), a = mA(n, e.sourceActions, t);
  return a && n.setAttribute(Br, a), rA(n, t, a), uA(e.rollCard, n, e.after ?? e.fallbackAfter), dA(e.sourceActions, n), n;
}
function eA(e, t) {
  const n = t.querySelector(He);
  if (!n) return;
  const a = n.textContent?.trim() ?? "", r = Cc(t, n, a), o = Ec(e, n), s = O_({
    rollCard: e,
    effectLabel: r,
    applied: zr(n, a),
    effectCanApplyOnSuccessfulResistance: o ? Ge(o) === "success" || Ge(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? xl(o) : !1
  });
  if (s.applied) {
    pA(n);
    return;
  }
  if (!s.visible) {
    gA(n);
    return;
  }
  if (s.waitingForResistance) {
    hA(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    bA(n, s.compactLabel);
    return;
  }
  yA(n), wc(n, s.displayLabel);
}
function tA(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(He) ?? []), n = Array.from(e.existingSection?.querySelectorAll(He) ?? []), a = [...t, ...n];
  return a.length === 0 ? null : nA(e.rollCard, a) ?? a[0] ?? null;
}
function nA(e, t) {
  const n = Tn(e).state, a = vl(n), r = $c(e);
  if (r.length === 0) return null;
  for (const o of t) {
    const s = Ec(e, o, r);
    if (s && Dl(s, a)) return o;
  }
  return null;
}
function Ec(e, t, n = $c(e)) {
  const a = Ur(t, t.textContent?.trim() ?? ""), r = Aa(a);
  return r ? n.find((o) => [o.label, o.conditionId].some((s) => Aa(s) === r)) ?? null : null;
}
function $c(e) {
  const t = jl(Vh(e));
  if (!t) return [];
  const n = Tt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((a) => a.actor === "target") : [];
}
function aA() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Fr, "true"), e;
}
function rA(e, t, n) {
  e.setAttribute(Fr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const a = oA(e), r = iA(a);
  r.textContent = "Efeito";
  const o = sA(e, a), s = lA(o);
  s.textContent = _A(n ?? Cc(e, t, t.textContent?.trim() ?? ""));
  const l = cA(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(He)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !zr(t, c) && !fA(t, c) && wc(t, n ?? c);
}
function oA(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function iA(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function sA(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(`${i}__effect-section-body`), t.after(a), a;
}
function lA(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function cA(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function uA(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function dA(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(He)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function mA(e, t, n) {
  const a = e.getAttribute(Br);
  if (a && a.trim().length > 0) return a.trim();
  const r = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return r || Ur(n, n.textContent?.trim() ?? "");
}
function Ur(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && pe(n) !== "efeito aplicado") return n;
  const a = Wh(e);
  if (a) return a;
  const r = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return r.length > 0 && pe(r) !== "aplicado" ? r : null;
}
function zr(e, t) {
  return e.classList.contains(Zb) || pe(t).includes("aplicado");
}
function fA(e, t) {
  const n = e.getAttribute(kn);
  if (n === "pending" || n === "resisted") return !0;
  const a = Aa(t);
  return a.includes("resistiu") || a.includes("role resistencia");
}
function wc(e, t) {
  e.getAttribute(Ve) === "true" && e.getAttribute(bt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ve, "true"), e.setAttribute(bt, "true"), e.setAttribute(Jb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    vr("✦", `${i}__button-icon--effect`),
    De("Aplicar")
  ));
}
function pA(e) {
  e.getAttribute(Ve) === "true" && pe(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ve, "true"), e.setAttribute(bt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    vr("✓", `${i}__button-icon--effect-applied`),
    De("Aplicado")
  ));
}
function Cc(e, t, n) {
  const a = e.getAttribute(Br) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return a && a.trim().length > 0 ? a.trim() : Ur(t, n) ?? n;
}
function gA(e) {
  zr(e, e.textContent?.trim() ?? "") || e.remove();
}
function hA(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ve), e.removeAttribute(bt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(kn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(De(t));
}
function bA(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ve), e.removeAttribute(bt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(kn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    vr("✓", `${i}__button-icon--effect-resisted`),
    De(t)
  );
}
function yA(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(kn), e.removeAttribute("aria-disabled");
}
function _A(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const AA = "data-paranormal-toolkit-card-layout-normalized";
function TA(e) {
  const t = RA(e.rollCard), n = kA(t);
  return $_({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function RA(e) {
  return {
    rollCard: e,
    damageSection: S_(e),
    resistance: e.querySelector(yr),
    damageActions: I_(e),
    effectActionSource: L_(e),
    effectSection: Z_(e)
  };
}
function kA(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: a,
    damageActions: r,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(AA, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = kt(t, "Conjuração"), c = EA({
    rollCard: t,
    damageSection: n,
    resistance: a,
    fallbackAfter: l
  });
  n && r && (r.parentElement !== n && n.append(r), G_(t, r));
  const u = J_({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: $A(n, c),
    fallbackAfter: l
  });
  return u && eA(t, u), u;
}
function EA(e) {
  const { rollCard: t, damageSection: n, resistance: a, fallbackAfter: r } = e;
  return a ? n ? (a.parentElement !== n && n.append(a), n) : r ? (a.parentElement === t && a.previousElementSibling === r || t.insertBefore(a, r.nextElementSibling), a) : ((a.parentElement !== t || a.previousElementSibling !== null) && t.prepend(a), a) : null;
}
function $A(e, t) {
  return e ?? t;
}
const Sc = [0, 80, 180, 400, 900, 1600, 3e3], mi = /* @__PURE__ */ new WeakSet();
function wA(e) {
  Ic(e), CA(e);
}
function Ic(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Lc(t);
}
function CA(e) {
  if (!mi.has(e)) {
    mi.add(e);
    for (const t of Sc)
      globalThis.setTimeout(() => {
        Ic(e);
      }, t);
  }
}
function Lc(e) {
  const t = TA({
    rollCard: e,
    refreshDelaysMs: Sc,
    onRefresh: () => Lc(e)
  });
  Cy({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const SA = "data-paranormal-toolkit-resistance-roll-result-enhanced", fi = "data-paranormal-toolkit-resistance-original-description", IA = "data-paranormal-toolkit-resistance-skill", LA = "data-paranormal-toolkit-resistance-skill-label", vA = `${i}__resistance--without-roll-button`, DA = ["Fortitude", "Reflexos", "Vontade"];
function xA(e) {
  for (const t of Array.from(e.querySelectorAll(yr)))
    NA(t);
  wA(e);
}
function NA(e) {
  const t = e.querySelector(xp), n = e.querySelector(pl), a = e.querySelector(yn), r = BA(a) ? a : null, o = e.querySelector(gl);
  if (!t && !n && !o && !a) return;
  e.classList.toggle(vA, !r);
  const s = FA(e, a);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!a || !a.contains(o)) && e.append(o), qA(o)), PA(e, a, n), r && (WA(r), r.parentElement !== e && e.append(r));
}
function PA(e, t, n) {
  if (!n) return;
  const a = e.closest(`.${i}__roll-card`);
  if (!a) return;
  const r = OA(n), o = Yl({
    description: r,
    skillLabel: UA(t, r),
    difficulty: Er(a)
  });
  if (!o) {
    n.textContent = r, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  MA(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function MA(e, t) {
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
function OA(e) {
  const t = e.getAttribute(fi);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(fi, n), n;
}
function FA(e, t) {
  const n = e.querySelector(`.${No}`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(No), e.insertBefore(a, t?.parentElement === e ? t : e.firstChild), a;
}
function BA(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function UA(e, t) {
  const n = e?.getAttribute(LA) ?? e?.getAttribute(IA) ?? null;
  return n || zA(t);
}
function zA(e) {
  const t = pi(e);
  return DA.find((n) => t.startsWith(pi(n))) ?? null;
}
function pi(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function qA(e) {
  const t = jA(e.textContent ?? "");
  t && (e.setAttribute(SA, "true"), e.replaceChildren(VA(t)));
}
function jA(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, a, r] = t, o = n?.trim() ?? "Resistência", s = Number(r);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = GA(a ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function GA(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: HA(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function HA(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function VA(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const a = KA(e);
  return a && t.append(a), t;
}
function WA(e) {
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
function KA(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of YA(e.diceValues, e.formula)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), n.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(n.value), t.append(a);
  }
  return t;
}
function YA(e, t) {
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
function XA(e) {
  for (const t of Array.from(e.querySelectorAll(Lp))) {
    const n = aT(t);
    QA(t), n && (ZA(t, n), JA(t, n));
  }
}
function QA(e) {
  for (const t of Array.from(e.querySelectorAll(vp)))
    t.remove();
}
function ZA(e, t) {
  const a = e.closest(`.${i}`)?.querySelector(fl) ?? null, r = a?.querySelector(Ip) ?? null, o = a ?? e, s = o.querySelector(Mp);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = AT(t.elementTone), l.textContent = _T(t), !s) {
    if (r?.parentElement === o) {
      r.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function JA(e, t) {
  const n = eT(e);
  tT(e, n);
  const a = nT(t);
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
  const o = e.querySelector(hl);
  if (o) {
    e.insertBefore(r, o);
    return;
  }
  e.prepend(r);
}
function eT(e) {
  return e.closest(`.${i}`)?.querySelector(fl) ?? null;
}
function tT(e, t) {
  const n = [e, t].filter((a) => a !== null);
  for (const a of n)
    for (const r of Array.from(a.querySelectorAll(Op)))
      r.remove();
}
function nT(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ga(e.target)}` : null,
    e.duration ? `Duração: ${ga(e.duration)}` : null,
    e.resistance ? `Resistência: ${rl(e.resistance)}` : null
  ].filter(pn);
}
function aT(e) {
  const t = rT(e), n = uT(e), r = (t ? cT(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = qr(Q(r, "element")), l = oe("op.elementChoices", s) ?? hi(Re(o, "Elemento")) ?? hi(n.damageType), c = s ?? TT(l), u = Q(r, "circle") ?? Re(o, "Círculo"), m = fT(r) ?? Re(o, "Alvo"), g = bT(r, "duration", "op.durationChoices") ?? Re(o, "Duração"), _ = dT(e) ?? gT(r) ?? Re(o, "Resistência"), k = mT(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: _
  };
  return yT(R) ? R : null;
}
function rT(e) {
  const t = oT(e);
  if (!t) return null;
  const n = t.getFlag?.(d, bn), a = sT(n);
  if (a.length === 0) return null;
  const r = iT(e);
  if (r.size > 0) {
    const o = a.find((s) => s.pendingId && r.has(s.pendingId));
    if (o) return o;
  }
  return a.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function oT(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? fr()?.messages?.get?.(n) ?? null : null;
}
function iT(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const a of Array.from(t.querySelectorAll(`[${xo}]`))) {
    const r = a.getAttribute(xo)?.trim();
    r && n.add(r);
  }
  return n;
}
function sT(e) {
  if (!fn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(lT).filter((n) => n !== null) : [];
}
function lT(e) {
  return fn(e) ? {
    pendingId: zt(e.pendingId),
    actorId: zt(e.actorId),
    itemId: zt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(of) : []
  } : null;
}
function cT(e) {
  if (!e.itemId) return null;
  const t = fr(), a = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return a || (t?.items?.get?.(e.itemId) ?? null);
}
function uT(e) {
  let t = null, n = null;
  for (const a of Array.from(e.querySelectorAll(Dp))) {
    const r = Qe(a.textContent);
    if (!r) continue;
    const o = rf(r, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(r) && (t = r);
  }
  return { cost: t, damageType: n };
}
function dT(e) {
  const t = Qe(e.querySelector(pl)?.textContent);
  return t ? rl(t) : null;
}
function Re(e, t) {
  const n = gt(t);
  for (const a of e) {
    const r = a.indexOf(":");
    if (!(r < 0 || gt(a.slice(0, r)) !== n))
      return Qe(a.slice(r + 1));
  }
  return null;
}
function mT(e) {
  const t = Re(e, "Custo") ?? Re(e, "PE");
  return t || (e.map(Qe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function fT(e) {
  const t = Q(e, "target");
  if (!t) return null;
  if (t === "area")
    return pT(e) ?? oe("op.targetChoices", t) ?? "Área";
  const n = oe("op.targetChoices", t) ?? fe(t);
  return [t === "people" || t === "creatures" ? Q(e, "targetQtd") : null, n].filter(pn).join(" ");
}
function pT(e) {
  const t = Q(e, "area.name"), n = Q(e, "area.size"), a = Q(e, "area.type"), r = t ? oe("op.areaChoices", t) ?? fe(t) : null, o = a ? oe("op.areaTypeChoices", a) ?? fe(a) : null;
  return r ? n ? o ? `${r} ${n}m ${ga(o)}` : `${r} ${n}m` : r : null;
}
function gT(e) {
  const t = Q(e, "skillResis"), n = Q(e, "resistance");
  if (!t || !n) return null;
  const a = oe("op.skill", t) ?? fe(t), r = hT(n);
  return [a, r].filter(pn).join(" ");
}
function hT(e) {
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
      return oe("op.resistanceChoices", e) ?? fe(e);
  }
}
function bT(e, t, n) {
  const a = Q(e, t);
  return a ? oe(n, a) ?? fe(a) : null;
}
function yT(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function _T(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function AT(e) {
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
  return t ? oe("op.elementChoices", t) ?? fe(t) : e ? fe(e) : null;
}
function TT(e) {
  return qr(e);
}
function oe(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, a = fr()?.i18n?.localize?.(n);
  return !a || a === n ? null : a;
}
const bi = "data-paranormal-toolkit-dice-toggle-enhanced";
function RT(e) {
  for (const t of Array.from(e.querySelectorAll(bl)))
    vc(t);
}
function kT(e) {
  const t = xc(e.target);
  if (!t) return;
  const n = jr(t);
  n && (e.preventDefault(), Dc(n, t));
}
function ET(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = xc(e.target);
  if (!t) return;
  const n = jr(t);
  n && (e.preventDefault(), Dc(n, t));
}
function vc(e) {
  const t = e.querySelector(_n);
  if (!t) return;
  const n = e.querySelector(Ar);
  if (n && n.getAttribute(bi) !== "true" && (n.setAttribute(bi, "true"), n.classList.add(Tr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-chevron-down"), a.setAttribute("aria-hidden", "true"), n.append(a);
  }
}
function Dc(e, t) {
  const n = e.querySelector(_n);
  if (!n) return;
  const a = !e.classList.contains(_r);
  $T(e, t, n, a);
}
function $T(e, t, n, a) {
  e.classList.toggle(_r, a), n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.title = a ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const r = t.querySelector("i");
  r && (r.classList.toggle("fa-chevron-down", !a), r.classList.toggle("fa-chevron-up", a));
}
function xc(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Ar);
  if (!t) return null;
  const n = jr(t);
  return n ? (vc(n), t.classList.contains(Tr) ? t : null) : null;
}
function jr(e) {
  const t = e.closest(bl);
  return t && t.querySelector(_n) ? t : null;
}
const yi = `${d}-workflow-dice-toggle-styles`;
function wT() {
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
const CT = [0, 100, 500, 1500, 3e3];
let _i = !1, Wn = null;
function ST() {
  if (!_i) {
    _i = !0, wT(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ut(Kt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ut(Kt(t));
    }), Hooks.once("ready", () => {
      ut(document), IT();
    }), document.addEventListener("click", kT), document.addEventListener("keydown", ET);
    for (const e of CT)
      globalThis.setTimeout(() => ut(document), e);
  }
}
function IT() {
  Wn || !document.body || (Wn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ut(n);
  }), Wn.observe(document.body, { childList: !0, subtree: !0 }));
}
function ut(e) {
  e && (tg(e), XA(e), xA(e), RT(e), Wp(e));
}
function LT() {
  ST();
}
const vT = "data-paranormal-toolkit-action-section", DT = "ritual-log", xT = ".paranormal-toolkit-item-use-prompt__actions", NT = ".paranormal-toolkit-item-use-prompt__actions-title", PT = [0, 100, 500, 1500];
let Ai = !1;
function MT() {
  if (Ai) return;
  const e = (t, n) => {
    Ti(UT(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Ti(document), Ai = !0;
}
function Ti(e) {
  for (const t of PT)
    globalThis.setTimeout(() => OT(e), t);
}
function OT(e) {
  FT(e), BT(e);
}
function FT(e) {
  for (const t of e.querySelectorAll(
    `[${vT}="${DT}"]`
  ))
    t.remove();
}
function BT(e) {
  for (const t of e.querySelectorAll(xT)) {
    if (Ri(t.querySelector(NT)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Ri(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function UT(e) {
  if (e instanceof HTMLElement || zT(e))
    return e;
  if (qT(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function zT(e) {
  return e instanceof HTMLElement;
}
function qT(e) {
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
}, Nc = {
  PV: "system.attributes.hp"
}, Ua = {
  PV: [dt.PV, Nc.PV],
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
class jT {
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
  const n = GT(e.type, t);
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
    message: HT(e, t),
    path: Ua[t].join(" | ")
  });
}
function GT(e, t) {
  return e === "threat" ? Nc[t] ?? null : e === "agent" ? dt[t] : null;
}
function Ei(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof a == "number" && Number.isFinite(a);
}
function HT(e, t) {
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
class VT {
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
    const { path: a, value: r } = n, o = WT(r);
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
function WT(e) {
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
const KT = "dice-so-nice";
async function Pc(e) {
  if (!YT() || !XT()) return;
  const t = QT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function YT() {
  try {
    return Sp().enabled;
  } catch {
    return !1;
  }
}
function XT() {
  return game.modules?.get?.(KT)?.active === !0;
}
function QT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Ci = "occultism";
class Mc {
  getDifficulty(t) {
    return ZT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const a = await eR(t, Ci);
    if (!a)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Pc(a);
    const r = aR(a);
    return {
      skill: Ci,
      skillLabel: "Ocultismo",
      roll: a,
      formula: nR(a),
      total: r,
      difficulty: n,
      success: r >= n,
      diceBreakdown: rR(a)
    };
  }
}
function ZT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function JT(e) {
  return new Mc().rollCastingCheck(e);
}
async function eR(e, t) {
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
  return tR(a);
}
function tR(e) {
  return Si(e) ? e : Array.isArray(e) ? e.find(Si) ?? null : null;
}
function Si(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function nR(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function aR(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function rR(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(oR);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function oR(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const iR = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class sR {
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
    const a = n.value, r = lR(t.ritual, a);
    return r.ok ? r.value ? y(r.value) : y({
      resource: "PE",
      amount: iR[a],
      source: "default-by-circle",
      circle: a
    }) : p(r.error);
  }
}
function lR(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : cR(n) ? {
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
function cR(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class uR {
  async applyPresetItemPatch(t, n) {
    const a = n.itemPatch;
    if (!a) return Kn("missing-item-patch");
    if (t.type !== "ritual") return Kn("unsupported-item-type");
    const r = dR(a);
    return Object.keys(r).length === 0 ? Kn("empty-update") : (await t.update(r), {
      applied: !0,
      updateData: r
    });
  }
}
function dR(e) {
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
class mR {
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
class fR {
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
class pR {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = gR(t);
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
    return this.list().map((n) => hR(n, t)).filter((n) => n !== null).sort((n, a) => a.score - n.score || n.preset.id.localeCompare(a.preset.id));
  }
}
function gR(e) {
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
function hR(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, n.push(`itemType:${t.type}`);
  }
  for (const r of e.matchers) {
    const o = bR(r, t);
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
function bR(e, t) {
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
      const n = yR(t), a = n !== null && e.circles.includes(n);
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
function yR(e) {
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
async function _R(e, t, n) {
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
    await Pc(r);
    const l = {
      ...n.rollRequests[e.id] ?? Oc(e, t),
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
function Oc(e, t) {
  const n = e.intent ?? AR(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function AR(e) {
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
function TR(e) {
  const { step: t, context: n, transaction: a, stepIndex: r, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = RR(t, n, a, r);
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
    const s = kR(t, n, a, r);
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
function RR(e, t, n, a) {
  const r = En(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    id: Fc(t.id, "damage", a, t.damageInstances.length),
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
function kR(e, t, n, a) {
  const r = En(e.amountFrom);
  return {
    id: Fc(t.id, "healing", a, t.healingInstances.length),
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
function Fc(e, t, n, a) {
  return `${e}.${t}.${n}.${a}`;
}
function ER(e, t, n) {
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
function $R(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: a, step: t, metadata: r }), Bc("before", e), vi("before", e), vi("resolve", e);
}
function wR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: a, step: t, metadata: r }), Bc("apply", e);
}
function CR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: a, step: t, metadata: r });
}
function Bc(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t, l = SR(e, n.operation);
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
function SR(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function IR(e, t, n) {
  return y(void 0);
}
async function LR(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return vR(e, t);
    case "spendRitualCost":
      return DR(e, t);
  }
}
async function vR(e, t) {
  const { context: n, resources: a } = e, r = en(t, n);
  return r.ok ? Uc(await a.spend(n.sourceActor, t.resource, r.value), n) : p(r.error);
}
async function DR(e, t) {
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
  }), Uc(await a.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Uc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function xR(e) {
  const { step: t, context: n, stepIndex: a, lifecycle: r, execute: o } = e, s = NR(t);
  for (const c of s.before)
    r.emit(c, n, { stepIndex: a, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    r.emit(c, n, { stepIndex: a, step: t });
  return l;
}
function NR(e) {
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
class PR {
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
        return xR({
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
    const r = await LR({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, a) {
    const r = Oc(t, a);
    n.rollRequests[r.id] = r, this.lifecycle.emit("beforeRoll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("before", r, n, a, t), this.lifecycle.emit("roll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("roll", r, n, a, t);
    const o = await this.runRollFormulaStep(t, n, a);
    if (!o.ok)
      return o;
    const s = n.rolls[r.id];
    return this.emitSpecificRollPhase("after", r, n, a, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: a, step: t, rollRequest: r, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, a) {
    const r = await _R(t, a, n);
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, a) {
    const r = en(t, n);
    if (!r.ok)
      return p({ ...r.error, stepIndex: a, step: t, context: n });
    const o = ER(t, n, r.value);
    $R({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), wR({
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
      TR({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return CR({
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
    const r = await IR(this.messages);
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
    const l = MR(t, n.intent);
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
function MR(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class OR {
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
class FR {
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
class BR {
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
function zc(e) {
  return {
    id: UR(),
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
function UR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class zR {
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
    return Me(this.lastContext);
  }
  async runAutomation(t, n) {
    const a = zc(n);
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
class qR {
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
class jR {
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
      whisper: GR(),
      flags: {
        ...t.flags,
        [d]: {
          ...HR(t.flags),
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
function GR() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function HR(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const VR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", qc = `${d}-inline-roll-neutralized`, WR = `${d}-inline-roll-notice`, Gr = `data-${d}-inline-roll-neutralized`, xi = `data-${d}-inline-roll-notice`, KR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ni(e) {
  const t = lk(e.message), n = await YR(e.message), a = XR(t);
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
async function YR(e) {
  const t = ok(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = QR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await ik(t, n.content), replacementCount: n.replacementCount };
}
function XR(e) {
  const t = e ? sk(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = jc(t);
  return n > 0 && Gc(nk(t)), { replacementCount: n };
}
function QR(e) {
  const t = ZR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const a = jc(n.content), r = t.replacementCount + a;
  return r === 0 ? { content: e, replacementCount: 0 } : (Gc(n.content), { content: n.innerHTML, replacementCount: r });
}
function ZR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, r) => (t += 1, ek(r.trim()))), replacementCount: t };
}
function jc(e) {
  const t = JR(e);
  for (const n of t)
    n.replaceWith(tk(ak(n)));
  return t.length;
}
function JR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(VR))
    n.getAttribute(Gr) !== "true" && t.add(n);
  return Array.from(t);
}
function ek(e) {
  return `<span class="${qc}" ${Gr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${ck(e)}</span>`;
}
function tk(e) {
  const t = document.createElement("span");
  return t.classList.add(qc), t.setAttribute(Gr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Gc(e) {
  if (e.querySelector?.(`[${xi}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(WR), t.setAttribute(xi, "true"), t.textContent = KR, e.append(t);
}
function nk(e) {
  return e.querySelector(".message-content") ?? e;
}
function ak(e) {
  const n = e.getAttribute("data-formula") ?? rk(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function rk(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ok(e) {
  return e && typeof e == "object" ? e : null;
}
async function ik(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function sk(e) {
  const t = uk(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function lk(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function ck(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function uk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const nn = "ritualRollConfig", an = "ritual-roll", dk = {
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
function Hc(e) {
  const t = e.getFlag(d, nn);
  return qa(t);
}
function Vc(e) {
  return Hc(e) ?? $n();
}
async function mk(e, t) {
  const n = qa(t) ?? qa({
    ...$n(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, nn, n), n;
}
async function fk(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, nn));
    return;
  }
  await e.setFlag(d, nn, null);
}
function qa(e) {
  if (!wn(e)) return null;
  const t = kk(e.intent);
  if (!t) return null;
  const n = $n();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: ja(e.damageType),
    utilityLabel: ja(e.utilityLabel) ?? n.utilityLabel,
    note: Hr(e.note),
    forms: $k(e.forms)
  };
}
function pk(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function gk(e) {
  const t = Hc(e), n = Wc(e);
  if (!t)
    return Pi(e, n);
  const a = Tk(e, t);
  if (!a)
    return Pi(e, n);
  const r = hk(t, a), o = [
    { type: "spendRitualCost" },
    r,
    ...bk(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: _k(e, t),
    resistance: n
  };
}
function Pi(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: Ak(e),
    resistance: t
  } : null;
}
function hk(e, t) {
  const n = {
    type: "rollFormula",
    id: an,
    formula: t,
    intent: Rk(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function bk(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${an}.total`,
          ...yk(e.damageType)
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
function yk(e) {
  return e ? { damageType: e } : {};
}
function _k(e, t) {
  const n = {
    base: Qn("Padrão", t.forms.base.formula)
  };
  return We(e, "discente") && (n.discente = Qn("Discente", t.forms.discente.formula, 2)), We(e, "verdadeiro") && (n.verdadeiro = Qn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
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
function Ak(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return We(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), We(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function Tk(e, t) {
  return [
    t.forms.base.formula.trim(),
    We(e, "discente") ? t.forms.discente.formula.trim() : "",
    We(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((a) => a.length > 0) ?? null;
}
function Wc(e) {
  const t = Kc(e), n = ja(t.skillResis), a = Ek(t.resistance);
  if (!n || !a) return;
  const r = wk(n), o = dk[a];
  return {
    skill: n,
    label: r,
    effect: a,
    summary: `${r} ${o}`
  };
}
function Rk(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function kk(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Ek(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function $k(e) {
  const t = $n();
  return wn(e) ? {
    base: Zn(e.base),
    discente: Zn(e.discente),
    verdadeiro: Zn(e.verdadeiro)
  } : t.forms;
}
function Zn(e) {
  return wn(e) ? { formula: Hr(e.formula) } : { formula: "" };
}
function We(e, t) {
  const n = Kc(e), a = t === "discente" ? n.studentForm : n.trueForm;
  return Ck(a);
}
function Kc(e) {
  const t = e.system;
  return wn(t) ? t : {};
}
function wk(e) {
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
function Ck(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Hr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function ja(e) {
  const t = Hr(e);
  return t.length > 0 ? t : null;
}
function wn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Sk(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function Ik(e) {
  switch (Lk(e)) {
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
      return vk(String(e ?? ""));
  }
}
function Lk(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function vk(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function Dk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function xk(e) {
  return {
    ...Vr(e),
    type: "ritual.cast.started"
  };
}
function Nk(e) {
  return {
    ...Vr(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function Pk(e) {
  return {
    ...Vr(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function Mk(e) {
  if (e.type === "preset") {
    const t = $e(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: $e(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: $e(e.label),
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
function Ok(e, t = {}) {
  const n = Zk(e), a = [
    ...eE(t.candidates ?? []),
    ...tE(e)
  ], r = aE(a) ?? { x: 0, y: 0, width: 0, height: 0 }, o = Jk(t) ?? rE(a) ?? iE(r), s = lE(canvas?.grid?.size), l = Fk(o, r, a), c = Vk(a), u = Hk(l);
  return {
    type: "rectangleRay",
    sceneId: sE(e, n),
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
function Fk(e, t, n) {
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
    direction: Bk(a, t, n)
  };
}
function Bk(e, t, n) {
  const a = Uk(n);
  return a !== null ? a : qk(e, t) ?? e.direction;
}
function Uk(e) {
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
    const a = zk(V(e, n));
    if (a !== null) return a;
  }
  return null;
}
function zk(e) {
  const t = yt(e);
  if (t === null) return null;
  const n = Kr(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function qk(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Fi(Oi(e, e.direction), t), a = jk(e, t);
  if (a === null) return null;
  const o = Gk([
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
function jk(e, t) {
  const n = e.width, a = e.height, r = n ** 2 - a ** 2;
  if (Math.abs(r) < 1e-3) return null;
  const o = (n * t.width - a * t.height) / r, s = (n * t.height - a * t.width) / r, l = ji(o, 0, 1), c = ji(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : cE(Math.atan2(c, l));
}
function Oi(e, t) {
  const n = Xc(t), a = {
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
function Gk(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const a = Kr(n);
    t.add(Math.round(a * 1e3) / 1e3);
  }
  return [...t];
}
function Hk(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Xc(e.direction), n = {
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
function Vk(e) {
  for (const t of e) {
    const n = Bi(t, "ray.start"), a = Bi(t, "ray.end");
    if (n && a) return { start: n, end: a };
  }
  return null;
}
function Bi(e, t) {
  const n = V(e, t), a = yt(V(n, "x")), r = yt(V(n, "y"));
  return a === null || r === null ? null : { x: a, y: r };
}
function Vr(e) {
  const t = Mk(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: Yk(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: Wk(e.context.item, e.form, e.formLabel, t),
    targets: n.map(Xk),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function Wk(e, t, n, a) {
  return {
    name: e.name,
    slug: Jn(e, "system.slug") ?? Jn(e, "slug"),
    presetId: a.presetId,
    presetVersion: a.presetVersion,
    element: Jn(e, "system.element"),
    circle: Qk(e),
    form: Kk(t),
    formLabel: n
  };
}
function Kk(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function Yk(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function Xk(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function Qk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : $e(t);
}
function Jn(e, t) {
  return $e(foundry.utils.getProperty(e, t));
}
function $e(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function Zk(e) {
  return "document" in e && e.document ? e.document : e;
}
function Jk(e) {
  return Yc(e.shape);
}
function eE(e) {
  return e.filter(Wr);
}
function tE(e) {
  return [
    e,
    nE(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Wr);
}
function nE(e) {
  return "object" in e && Wr(e.object) ? e.object : null;
}
function Wr(e) {
  return !!(e && typeof e == "object");
}
function aE(e) {
  for (const t of e) {
    const n = Ui(V(Cn(t), "bounds"));
    if (n) return n;
    const a = Ui(V(t, "bounds"));
    if (a) return a;
  }
  return null;
}
function Ui(e) {
  const t = N(e, "x"), n = N(e, "y"), a = N(e, "width"), r = N(e, "height");
  return t === null || n === null || a === null || r === null ? null : { x: t, y: n, width: a, height: r };
}
function N(e, t) {
  return yt(V(e, t));
}
function rE(e) {
  for (const t of e) {
    const n = oE(t).find((a) => a.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function oE(e) {
  if (!e || typeof e != "object") return [];
  const t = zi(Cn(e));
  return t.length > 0 ? t : zi(e);
}
function zi(e) {
  const t = V(e, "shapes");
  return Array.isArray(t) ? t.map(Yc).filter((n) => n !== null) : [];
}
function Yc(e) {
  const t = Cn(e) ?? e, n = V(t, "type");
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
function iE(e) {
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
function sE(e, t) {
  return ea(e, "parent.id") ?? ea(e, "document.parent.id") ?? ea(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function ea(e, t) {
  return $e(V(e, t));
}
function V(e, t) {
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
  const t = V(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function qi(e) {
  return $e(e);
}
function yt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function lE(e) {
  const t = yt(e);
  return t !== null && t > 0 ? t : null;
}
function Xc(e) {
  return e * Math.PI / 180;
}
function cE(e) {
  return e * 180 / Math.PI;
}
function Kr(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function ji(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class uE {
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
const dE = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class mE {
  constructor(t = new Sn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = fE(t, this.foundryAdapter);
    for (const a of n)
      try {
        await a.run(), a.method;
        return;
      } catch {
        a.method;
      }
    this.foundryAdapter.warn(dE);
  }
}
function fE(e, t) {
  const n = [], a = pE(e), r = Gi(a), o = Gi(e);
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
function pE(e) {
  return gE(e) ? e.document ?? null : e;
}
function gE(e) {
  return "bounds" in e;
}
function Gi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const hE = 100, bE = 12;
class yE {
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
      const r = this.foundryAdapter.getGridSize() ?? hE, o = kE(n), s = await this.foundryAdapter.placeRegion(
        _E(t, this.foundryAdapter.getUserColor(), r),
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
        message: RE(r)
      };
    }
  }
}
function _E(e, t, n) {
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
    shapes: [AE(e, n)]
  };
}
function AE(e, t) {
  const n = TE(e, t);
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
function TE(e, t) {
  return {
    length: Hi(e.length, bE, t),
    width: Hi(e.width, 1, t)
  };
}
function Hi(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function RE(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function kE(e) {
  const t = (n) => {
    const a = EE(n);
    a && e.onChange?.(a);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function EE(e) {
  return $E(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function $E(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class wE {
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
    this.applyTargets(Vi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Vi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = CE(t);
    SE(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Vi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function CE(e) {
  return Array.from(new Set(e));
}
function SE(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, a) => n === t[a]);
}
class IE {
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
    return this.resolveFirstRegionCandidate(LE(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(vE(t), "final");
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
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), a = xE(
      n.filter((r) => !r.actor || typeof r.document?.testInsideRegion != "function" ? !1 : r.document.testInsideRegion(t))
    );
    return n.length, a.length, { tokens: a, source: "regionObject" };
  }
}
function LE(e) {
  return [
    { source: "document", region: Ee(e.document) },
    { source: "document.object", region: Ee(e.document.object) },
    { source: "preview", region: Ee(e.preview) },
    { source: "preview.document.object", region: Ee(e.preview?.document?.object) }
  ];
}
function vE(e) {
  return [
    { source: "input", region: Ee(e) },
    { source: "input.object", region: DE(e) ? Ee(e.object) : null },
    { source: "input.document.object", region: Qc(e) ? Ee(e.document?.object) : null }
  ];
}
function Ee(e) {
  return Ga(e) ? e : null;
}
function Ga(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Mt(n.x) && Mt(n.y) && Mt(n.width) && Mt(n.height);
}
function Qc(e) {
  return "document" in e && "bounds" in e;
}
function DE(e) {
  return !Qc(e);
}
function xE(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return a ? t.has(a) ? !1 : (t.add(a), !0) : !0;
  });
}
function Mt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class NE {
  async minimizeForPlacement() {
    const t = [];
    for (const n of OE())
      await PE(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await ME(n);
      }
    };
  }
}
async function PE(e) {
  if (Zc(e) || !HE(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function ME(e) {
  if (Zc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function OE() {
  const e = /* @__PURE__ */ new Set();
  for (const t of FE())
    zE(t) && qE(t) && e.add(t);
  return [...e];
}
function FE() {
  return [
    ...Wi(BE()),
    ...Wi(UE())
  ];
}
function Wi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function BE() {
  return globalThis.ui?.windows ?? null;
}
function UE() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function zE(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function qE(e) {
  const t = jE(e), n = GE(t);
  return n === "Actor" || n === "Item";
}
function jE(e) {
  return e.document ?? e.object ?? null;
}
function GE(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function HE(e) {
  const t = VE(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function VE(e) {
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
function Zc(e) {
  return e.minimized === !0;
}
const WE = "Nenhum alvo encontrado na linha.";
class KE {
  constructor(t = new yE(), n = new IE(), a = new mE(), r = new wE(), o = new uE(), s = new NE()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = XE(a), m = Ok(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(WE), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = YE(c);
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
function YE(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function XE(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function QE(e) {
  return {
    header: {
      eyebrow: ws,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: o$(e.ritual)
    },
    forms: e.variantOptions.map((t) => ZE(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: t$(e.targetNames, e.variantOptions, e.ritual),
    automation: r$(e.automationStatus ?? "assisted")
  };
}
function ZE(e, t) {
  const n = JE(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? e$(t) : "—",
    details: n
  };
}
function JE(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function e$(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function t$(e, t, n) {
  const a = e.map((r) => r.trim()).filter((r) => r.length > 0);
  return {
    targetNames: a,
    targetText: a.length > 0 ? a.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: a.length > 0,
    forms: t.map((r) => n$(r, n))
  };
}
function n$(e, t) {
  const n = e.targeting ?? a$(t, e.variant), a = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function a$(e, t) {
  const n = Tt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function r$(e) {
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
function o$(e) {
  const t = e.system, n = [s$(t?.element), i$(t?.circle)].filter(u$);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function i$(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function s$(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (l$(e)) {
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
      return c$(e);
  }
}
function l$(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function c$(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function u$(e) {
  return typeof e == "string" && e.length > 0;
}
const Jc = ["base", "discente", "verdadeiro"];
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
  return typeof e == "string" && Jc.includes(e);
}
const { ApplicationV2: d$ } = foundry.applications.api;
class pt extends d$ {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = QE(t), this.selectedVariant = this.model.forms.find((a) => a.checked && a.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    p$(r, (o) => {
      this.selectedVariant = o, Ha(r, o);
    }), Ha(r, this.selectedVariant), g$(r, (o) => {
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
          ${this.model.forms.map(m$).join("")}
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
          ${this.model.targets.forms.map(f$).join("")}
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
    const n = _$(t), a = h$(n, this.spendResource, this.selectedVariant);
    this.settle(a), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function m$(e) {
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
function f$(e) {
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
function p$(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of n)
    r.addEventListener("click", () => Yi(e, r, t)), r.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Yi(e, r, t));
    });
  const a = eu(e);
  a && t(a);
}
function Yi(e, t, n) {
  const a = t.querySelector('input[name="variant"]');
  !a || a.disabled || !rn(a.value) || (a.checked = !0, e.dataset.paranormalToolkitSelectedVariant = a.value, n(a.value), a.dispatchEvent(new Event("change", { bubbles: !0 })), eu(e), Ha(e, a.value));
}
function eu(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const a of t) {
    const r = a.querySelector('input[name="variant"]'), o = r?.checked === !0;
    a.setAttribute("aria-checked", o ? "true" : "false"), o && rn(r.value) && (n = r.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Ha(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const a of n) {
    const r = a.dataset.paranormalToolkitTargetingForm === t;
    a.hidden = !r;
  }
}
function g$(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function h$(e, t, n) {
  const a = y$(e) ?? n, r = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = b$(e, a);
  return {
    variant: a,
    spendResource: r,
    areaTargeting: o
  };
}
function b$(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function y$(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (rn(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return rn(n) ? n : null;
}
function _$(e) {
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
async function A$(e) {
  return pt.request(e);
}
const Xr = {
  label: "Padrão"
}, T$ = {
  label: "Discente",
  extraCost: 2
}, R$ = {
  label: "Verdadeiro",
  extraCost: 5
};
class k$ {
  constructor(t, n, a, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = a, this.ritualEvents = r;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new KE();
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
    const r = this.resolveCostPreview(t), o = bw(n), s = pw(
      n,
      t.item,
      r,
      o
    ), l = await A$({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map(($) => $.name),
      cost: r,
      defaultSpendResource: kw(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = E$(l), u = _w(
      n,
      t.item,
      c.variant,
      o
    ), m = Dk(), g = u.label ?? Yr(c.variant), _ = L$(u), k = ($ = t.targets) => ({
      castId: m,
      context: t,
      automationSource: a,
      form: c.variant,
      formLabel: g,
      targets: $
    }), R = ($, S = t.targets, U = {}) => {
      this.ritualEvents.emitCastFinished(
        Pk({
          ...k(S),
          status: $,
          ...U
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      xk(k())
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
    const b = $$(
      t,
      E.targets
    );
    E.areaSnapshot && this.ritualEvents.emitAreaResolved(
      Nk({
        ...k(E.targets),
        area: E.areaSnapshot
      })
    );
    const L = Hs();
    let A = null;
    if (L) {
      const $ = await C$(
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
        const S = await JT(
          b.actor
        );
        A = v$(
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
    const B = w$(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !L
      }
    );
    if (B.steps.length === 0) {
      const $ = yw(
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
      ), X = Zi(
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
        summaryLines: X
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: $,
        itemUseContext: b,
        summaryLines: X
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
    const Y = x.value.context, v = O$(
      n,
      b,
      Y,
      _
    ), j = Qi(
      n,
      b
    ), Ct = Xi(
      b.actor,
      A,
      u,
      r
    ), he = Zi(
      n,
      c,
      u,
      r,
      Y,
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
    if (!j.ok)
      return R("failed", b.targets, {
        reason: j.reason,
        message: j.message
      }), {
        status: "failed",
        reason: j.reason,
        message: j.message
      };
    const C = [
      ...Ct,
      ...v.actions,
      ...j.actions
    ];
    return C.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: Y,
      itemUseContext: b,
      summaryLines: he
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: Y,
      itemUseContext: b,
      actions: C,
      summaryLines: he
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
function E$(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function $$(e, t) {
  return {
    ...e,
    targets: t
  };
}
function w$(e, t, n, a, r) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Zr(l) && (!r.includeCostSteps || !s))
      continue;
    const c = S$(l, n);
    c && o.push(c);
  }
  return r.includeCostSteps && s && a && Ew(n.extraCost) && o.push({
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
async function C$(e, t, n, a, r) {
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
function S$(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = I$(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function I$(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const a = n[t];
  return typeof a == "string" ? a.trim() : "";
}
function L$(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function v$(e, t, n) {
  const r = D$(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: r,
    success: e.total >= r
  };
}
function D$(e, t) {
  const n = et(e, t);
  return n ? Sk(n.amount) : null;
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
      const s = kl(o);
      n.push(
        x$(
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
function x$(e, t, n, a) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? M$(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: N$(
      e.duration ?? null,
      a
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: P$(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function N$(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function P$(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const a = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${a}`;
  }
  return e;
}
function M$(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function O$(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || F$(s, a)) continue;
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
      if (B$(s)) {
        U$(
          o,
          u,
          z$(s, n, l.value)
        );
        continue;
      }
      r.push(j$(s, u, l.value));
    }
  }
  for (const s of o.values())
    r.push(
      ...q$(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: r };
}
function F$(e, t) {
  const n = tu(e.amountFrom);
  return n !== null && t.has(n);
}
function B$(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function U$(e, t, n) {
  const a = W$(t), r = e.get(a);
  if (r) {
    r.entries.push(n);
    return;
  }
  e.set(a, {
    actor: t,
    entries: [n]
  });
}
function z$(e, t, n) {
  const a = tu(e.amountFrom), r = a ? t.rolls[a]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? r ?? null,
    sourceRollId: a
  };
}
function q$(e, t, n, a) {
  const r = Q$(e), o = r.length > 1 ? ew() : void 0;
  return r.map((s) => {
    const l = a.map(
      (u, m) => {
        const g = Z$(u.amount, s);
        return {
          id: G$(u, s, m),
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
      label: H$(c, s, r.length > 1),
      executedLabel: V$(
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
function j$(e, t, n) {
  const a = t.name ?? "Ator sem nome", r = X$(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: K$(e, a, n),
    executedLabel: Y$(e, a),
    actionSectionId: r.id,
    actionSectionTitle: r.title
  };
}
function G$(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function H$(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function V$(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function W$(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function tu(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function K$(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Y$(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function X$(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Q$(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Z$(e, t) {
  const n = e * t.multiplier, a = J$(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, a);
}
function J$(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function ew() {
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
    rw(t, n, a),
    ...aw(s),
    ...Object.values(r.rolls).flatMap(ow),
    ...tw(e, o),
    ...iw(e.resistance),
    ...mw(n)
  ];
}
function tw(e, t) {
  return nw(e) ? Qr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function nw(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function aw(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function rw(e, t, n) {
  const a = et(n, t);
  return a ? e.spendResource ? `Custo: ${a.amount} ${a.resource} gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function ow(e) {
  const n = [`${fw(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = sw(e.roll);
  return a && n.push(`Dados: ${a}`), e.damageType && n.push(`Tipo: ${Ik(e.damageType)}`), n;
}
function iw(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function sw(e) {
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
    const s = lw(o);
    s && (dw(
      n,
      s.operator ?? a,
      s.value
    ), a = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function lw(e) {
  const t = cw(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : uw(e);
}
function cw(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function uw(e) {
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
function dw(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function mw(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function fw(e) {
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
function pw(e, t, n, a) {
  return Jc.map((r) => {
    const o = nu(
      e,
      t,
      r,
      a
    ), s = o !== null;
    return {
      variant: r,
      label: o?.label ?? Yr(r),
      enabled: s,
      details: o ? gw(o, n) : [],
      finalCostText: o ? hw(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function gw(e, t, n) {
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
function hw(e, t) {
  const n = et(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function bw(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Zr);
}
function yw(e, t) {
  return zc({
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
function _w(e, t, n, a) {
  return nu(e, t, n, a) ?? Xr;
}
function nu(e, t, n, a) {
  const r = e.ritualForms?.[n] ?? null;
  return r || (a ? Tw(t, n) ? Aw(n) : null : n === "base" ? Xr : null);
}
function Aw(e) {
  switch (e) {
    case "base":
      return Xr;
    case "discente":
      return T$;
    case "verdadeiro":
      return R$;
  }
}
function Tw(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Rw(foundry.utils.getProperty(e, n));
}
function Rw(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function kw(e) {
  return e.steps.some(Zr);
}
function Zr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Ew(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const au = "itemUsePrompts", ru = "chatCard", In = "data-paranormal-toolkit-prompt-id", Ln = "data-paranormal-toolkit-pending-id", Jr = "data-paranormal-toolkit-executed-label", Va = "data-paranormal-toolkit-choice-group", ou = "data-paranormal-toolkit-skipped-label", on = "data-paranormal-toolkit-action-section", Ji = "data-paranormal-toolkit-detail-key", es = "data-paranormal-toolkit-roll-card", eo = "data-paranormal-toolkit-roll-detail-toggle", iu = "data-paranormal-toolkit-roll-detail-id", su = "data-paranormal-toolkit-resistance-roll-button", lu = "data-paranormal-toolkit-resistance-skill", cu = "data-paranormal-toolkit-resistance-skill-label", uu = "data-paranormal-toolkit-resistance-target-actor-id", du = "data-paranormal-toolkit-resistance-target-name", mu = "data-paranormal-toolkit-resistance-roll-result", ts = "data-paranormal-toolkit-system-card-replaced", $w = `[${Ln}]`, ww = `[${eo}]`, Cw = `[${su}]`, Wa = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, Sw = `${h}__actions`, ns = `${h}__details`, fu = `${h}__summary`, Iw = `${h}__title`, pu = `${h}__button--executed`, Ot = `${h}__roll-card`, Lw = "data-paranormal-toolkit-roll-card-target-mode", vw = "data-paranormal-toolkit-roll-card-target-names", Dw = "data-paranormal-toolkit-roll-card-resistance", xw = "data-paranormal-toolkit-roll-card-resistance-skill", Nw = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let as = !1, Ka = null;
const ee = /* @__PURE__ */ new Map(), Pw = [0, 100, 500, 1500, 3e3], Mw = 3e4, Ow = [0, 100, 500, 1500, 3e3];
function Fw(e) {
  if (Ka = e, as) {
    os(e);
    return;
  }
  const t = (n, a) => {
    hu(n, a, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), as = !0, os(e);
}
async function rs(e) {
  const t = gu(e);
  ee.set(e.pendingId, t), await ao(t) || Su(t), bu(e.pendingId);
}
async function Bw(e) {
  const t = gu({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", ee.set(e.pendingId, t), await ao(t) || Su(t), bu(e.pendingId);
}
async function ta(e, t) {
  const n = ee.get(e);
  ee.delete(e), n && await jC(n, t);
}
function to(e) {
  const t = Nu();
  for (const n of t) {
    const a = se(n)[e];
    if (a) return { message: n, prompt: a };
  }
  return null;
}
async function Uw(e, t) {
  const n = to(e);
  if (!n) return;
  const a = se(n.message), r = a[e];
  r && (a[e] = {
    ...r,
    executedLabel: r.executedLabel,
    executed: !0
  }, await tt(n.message, a));
}
async function zw(e, t, n) {
  if (!t) return;
  const a = to(e);
  if (!a) return;
  const r = se(a.message);
  let o = !1;
  for (const [s, l] of Object.entries(r))
    s !== e && l.choiceGroupId === t && (r[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await tt(a.message, r);
}
function gu(e) {
  const t = ge(e.context.message), n = e.context.targets.find((s) => Za(s)), a = n ? Za(n) : null, r = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? n?.name ?? r?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: gC(e.context),
    executed: !1
  };
}
function hu(e, t, n) {
  qC();
  const a = Dn(t);
  if (!a) return;
  const r = BC(e, a);
  r.length > 0 && sn(a);
  for (const o of r)
    Ya(a, o);
  Ru(a, n), Xa(a), Qa(a);
}
function os(e) {
  for (const t of Ow)
    globalThis.setTimeout(() => {
      qw(e);
    }, t);
}
function qw(e) {
  for (const t of jw()) {
    const n = vn(t);
    Gw(n) && hu(n, t, e);
  }
}
function jw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Gw(e) {
  return e ? ro(e) ? !0 : HC(e).length > 0 : !1;
}
function bu(e) {
  const t = ee.get(e);
  if (!t) return;
  const n = t.messageId ? UC(t.messageId) : null;
  if (n) {
    us(n, t), sn(n), Ya(n, t), is(n), Xa(n), Qa(n);
    return;
  }
  if (t.messageId) {
    er(t);
    return;
  }
  const a = zC(t);
  if (a) {
    us(a, t), sn(a), Ya(a, t), is(a), Xa(a), Qa(a);
    return;
  }
  er(t);
}
function is(e) {
  Ka && Ru(e, Ka);
}
function sn(e) {
  const t = Hw();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Tu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ts) === "true") return;
  const a = n.querySelector(`.${Wa}`);
  a ? n.replaceChildren(a) : n.replaceChildren(), n.setAttribute(ts, "true");
}
function Hw() {
  try {
    return Gs() === "replace";
  } catch {
    return !1;
  }
}
function Ya(e, t) {
  if (sn(e), e.querySelector(`[${In}="${nt(t.pendingId)}"]`)) return;
  const n = Ww(e, t);
  Yw(n, t);
  const a = dC(t);
  if (Vw(a)) return;
  uC(n, a).append(pC(t));
}
function Vw(e) {
  return _u(e.id) && !Ce();
}
function yu(e) {
  const n = e.closest(`[${on}]`)?.getAttribute(on) ?? null;
  return _u(n) && !Ce();
}
function _u(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Ww(e, t) {
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
  s.classList.add(Iw), s.textContent = Kw(t);
  const l = document.createElement("span");
  return l.classList.add(fu), l.textContent = t.summary, r.append(o, s, l), a.append(r), bC(e).append(a), a;
}
function Kw(e) {
  const t = F(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Yw(e, t) {
  const n = t.summaryLines ?? [], a = wu(n, t);
  if (a) {
    Xw(e, a, t);
    return;
  }
  mC(e, n);
}
function Xw(e, t, n) {
  if (e.querySelector(`[${es}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(
    Ot,
    `${Ot}--${t.intent}`,
    `${Ot}--target-${t.targetMode}`
  ), t.targetMode === "multi" && a.classList.add(`${Ot}--multi-target`), a.setAttribute(es, "true"), a.setAttribute(Lw, t.targetMode), a.setAttribute(vw, JSON.stringify(t.targetNames)), oC(a, t), t.castingCheck && ss(a, Zw(t.castingCheck), n.pendingId, "casting"), Qw(t) && ss(a, Jw(t), n.pendingId, "effect"), rC(a, t), iC(a, t, n), cC(a, t), e.append(a);
}
function Qw(e) {
  return e.intent !== "casting";
}
function Zw(e) {
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
function Jw(e) {
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
  eC(r, t), lC(r, t.detailRows, n, a, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(r);
}
function eC(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const a = document.createElement("span");
  a.classList.add(`${h}__workflow-roll-formula`), a.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${h}__workflow-roll-total`), r.textContent = String(t.total), n.append(a, r);
  const o = tC(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function tC(e, t) {
  const n = nC(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-dice-tray`);
  for (const r of aC(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), r.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function nC(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function aC(e, t) {
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
function rC(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(cS);
  if (n.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const r of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = r, a.append(o);
  }
  e.append(a);
}
function oC(e, t) {
  t.resistance && (e.setAttribute(Dw, t.resistance), t.resistanceSkill && e.setAttribute(xw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(Nw, t.resistanceSkillLabel));
}
function iC(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = sC(t, n);
  r.append(o), s && r.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, a.append(r, l), t.resistanceRollResult && a.append(Au(t.resistanceRollResult)), e.append(a);
}
function sC(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !ve())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(In, t.pendingId), n.setAttribute(su, "true"), n.setAttribute(lu, e.resistanceSkill), n.setAttribute(cu, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(uu, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(du, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(mu, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const r = document.createElement("span");
  return r.classList.add(`${h}__resistance-roll-fallback`), r.textContent = "d20", n.append(a, r), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Au(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Eu(e), t;
}
function lC(e, t, n, a, r) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${a}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(eo, s), l.setAttribute("aria-expanded", "false"), l.textContent = r;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(iu, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const g = document.createElement("dd");
    g.textContent = u.value, c.append(m, g);
  }
  e.append(l, c);
}
function cC(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const a of [...t.notes, ...t.details]) {
    const r = document.createElement("span");
    r.textContent = a, n.append(r);
  }
  e.append(n);
}
function uC(e, t) {
  const n = `[${on}="${nt(t.id)}"]`, a = e.querySelector(n);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add(Sw), r.setAttribute(on, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, r.append(o), e.append(r), r;
}
function dC(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const a = wu(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function mC(e, t) {
  if (t.length === 0) return;
  const n = fC(e);
  for (const a of t) {
    const r = uS(a);
    if (n.querySelector(`[${Ji}="${nt(r)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(Ji, r), n.append(o);
  }
}
function fC(e) {
  const t = e.querySelector(`.${ns}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ns), e.append(n), n;
}
function pC(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(In, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(pu), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ln, e.pendingId), t.setAttribute(Jr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Va, e.choiceGroupId), t.setAttribute(ou, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function gC(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = hC(e);
  return `${t} → ${n}`;
}
function hC(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function bC(e) {
  return Tu(e) ?? e;
}
function Tu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Ru(e, t) {
  const n = Dn(e);
  if (!n) return;
  const a = n.querySelectorAll($w);
  for (const r of a) {
    if (yu(r)) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitBound !== "true" && (r.dataset.paranormalToolkitBound = "true", r.addEventListener("click", () => {
      vC(r, t);
    }));
  }
}
function Xa(e) {
  const t = Dn(e);
  if (!t) return;
  const n = t.querySelectorAll(ww);
  for (const a of n)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      yC(t, a);
    }));
}
function Qa(e) {
  const t = Dn(e);
  if (!t) return;
  const n = t.querySelectorAll(Cw);
  for (const a of n) {
    if (!ve()) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      _C(t, a);
    }));
  }
}
function yC(e, t) {
  const n = t.getAttribute(eo);
  if (!n) return;
  const a = e.querySelector(`[${iu}="${nt(n)}"]`);
  if (!a) return;
  const r = a.hidden;
  a.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.textContent = r ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function _C(e, t) {
  if (!ve()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(In), a = t.getAttribute(lu), r = t.getAttribute(cu) ?? (a ? we(a) : "Resistência");
  if (!n || !a) return;
  const o = RC(e, n), s = kC(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await dg(s, a);
    await SC(c.roll);
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
    AC(t, u), TC(t, u), IC(n, u), await LC(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${r}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function AC(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(mu, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function TC(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const a = n.querySelector(`.${h}__resistance-roll-result`), r = a ?? Au(t);
  if (a) {
    a.textContent = Eu(t);
    return;
  }
  n.append(r);
}
function RC(e, t) {
  const n = ee.get(t);
  if (n) return n;
  const a = vn(e);
  return se(a)[t] ?? null;
}
function kC(e, t) {
  const n = e?.resistanceTargetActor;
  if (re(n)) return n;
  const r = e?.context?.targets.map(Za).find(re) ?? null;
  if (r) return r;
  const o = t.getAttribute(uu) ?? e?.resistanceTargetActorId ?? null, s = o ? $C(o) : null;
  return s || wC(
    t.getAttribute(du) ?? e?.resistanceTargetName ?? EC(t)
  );
}
function EC(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${fu}`)?.textContent ?? null;
  if (!n) return null;
  const a = "→";
  if (!n.includes(a)) return null;
  const r = n.split(a), o = r[r.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Za(e) {
  const t = e.actor;
  if (re(t)) return t;
  const n = e.token, a = _t(n);
  if (a) return a;
  const r = e.document;
  return _t(r);
}
function _t(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (re(t)) return t;
  const n = e.document?.actor;
  return re(n) ? n : null;
}
function $C(e) {
  const n = game.actors?.get?.(e);
  return re(n) ? n : ku().map((o) => _t(o)).find((o) => o?.id === e) ?? null;
}
function wC(e) {
  const t = ze(e);
  if (!t) return null;
  const n = ku().filter((o) => ze(CC(o)) === t).map((o) => _t(o)).find(re) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => re(o) && ze(o.name) === t);
  return re(r) ? r : null;
}
function ku() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function CC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : _t(e)?.name ?? null;
}
function ze(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function re(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Eu(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function SC(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function IC(e, t) {
  const n = ee.get(e);
  n && (n.resistanceRollResult = t);
}
async function LC(e, t, n) {
  const a = vn(e);
  if (a)
    try {
      const r = se(a), o = r[t];
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
  return ie(a?.get?.(n));
}
async function vC(e, t) {
  if (yu(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(Ln);
  if (!n) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    $u(e, e.getAttribute(Jr) ?? "✓ Automação aplicada"), DC(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function $u(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(pu), e.removeAttribute(Ln), e.removeAttribute(Jr);
}
function DC(e) {
  const t = e.getAttribute(Va);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const a = `[${Va}="${nt(t)}"]`;
  for (const r of n.querySelectorAll(a)) {
    if (r === e) continue;
    const o = r.getAttribute(ou) ?? "✓ Outra opção escolhida";
    $u(r, o);
  }
}
function wu(e, t) {
  const n = e.map(no).filter(sS), a = n.find((E) => E.intent !== "casting") ?? n[0] ?? null;
  if (!a) return null;
  const r = F(e, "Forma"), o = F(e, "Custo"), s = F(e, "Dados") ?? F(e, `Dados (${a.label})`), l = F(e, "Tipo"), c = F(e, "Resistência"), u = F(e, "Resistência Perícia"), m = F(e, "Resistência Rótulo") ?? (u ? we(u) : null), g = Cu(e, "Observação"), _ = e.filter((E) => FC(E, a)), k = MC(e), R = xC(t);
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
function xC(e) {
  const t = NC(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function NC(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && PC(n) !== "nenhum alvo") : [];
}
function PC(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function MC(e) {
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
    intent: OC(n)
  } : null;
}
function OC(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function F(e, t) {
  return Cu(e, t)[0] ?? null;
}
function Cu(e, t) {
  const n = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(n)) return [];
    const r = a.slice(n.length).trim();
    return r.length > 0 ? [r] : [];
  });
}
function FC(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || no(e) ? !1 : e.trim().length > 0;
}
function BC(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of ee.values())
    Ja(a, e, t) && n.set(a.pendingId, a);
  for (const a of GC(e))
    Ja(a, e, t) && !n.has(a.pendingId) && n.set(a.pendingId, a);
  return Array.from(n.values()).sort((a, r) => a.createdAt - r.createdAt);
}
function Ja(e, t, n) {
  const a = ge(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !cs(n, "itemId", e.itemId) ? !1 : !e.actorId || cs(n, "actorId", e.actorId);
}
function cs(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const a = `data-${dS(t)}`;
  for (const r of e.querySelectorAll(`[${a}]`))
    if (r.getAttribute(a) === n)
      return !0;
  return !1;
}
function UC(e) {
  const t = nt(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function zC(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ja(e, null, t))
      return t;
  return null;
}
function qC() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, a] of ee.entries())
    e - a.createdAt > t && ee.delete(n);
}
async function us(e, t) {
  const n = vn(e);
  if (!n) return !1;
  try {
    const a = se(n);
    return a[t.pendingId] = oo(t, ge(n)), await tt(n, a), !0;
  } catch (a) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a), !1;
  }
}
async function ao(e) {
  const t = vu(e);
  if (!t) return !1;
  try {
    const n = se(t);
    return n[e.pendingId] = oo(e, ge(t)), await tt(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Su(e) {
  for (const t of Pw)
    globalThis.setTimeout(() => {
      er(e);
    }, t);
}
async function er(e) {
  const t = vu(e);
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
async function jC(e, t) {
  const n = Lu(e.context.message);
  if (n)
    try {
      const a = se(n), r = a[e.pendingId] ?? oo(e, ge(n));
      a[e.pendingId] = {
        ...r,
        executedLabel: t ?? r.executedLabel,
        executed: !0
      }, await tt(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function GC(e) {
  return Object.values(se(ie(e))).filter($t);
}
function se(e) {
  if (!e) return {};
  const t = {}, n = ro(e);
  for (const a of n?.prompts ?? [])
    t[a.pendingId] = a;
  for (const [a, r] of Object.entries(Iu(e)))
    t[a] ??= r;
  return t;
}
function HC(e) {
  return Object.values(Iu(ie(e))).filter($t);
}
function Iu(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, au);
  if (!Ke(t))
    return {};
  const n = {};
  for (const [a, r] of Object.entries(t))
    $t(r) && (n[a] = r);
  return n;
}
async function tt(e, t) {
  typeof e.setFlag == "function" && (await WC(e, t), await VC(e, t));
}
async function VC(e, t) {
  await Promise.resolve(e.setFlag?.(d, au, t));
}
function ro(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, ru);
  return oS(t) ? t : null;
}
async function WC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter($t).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const a = n[0];
  if (!a) return;
  const r = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: a.messageId ?? ge(e) ?? null,
    source: {
      actorId: a.actorId,
      actorName: KC(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, ru, r));
}
function KC(e) {
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
function Lu(e) {
  const t = ie(e);
  if (t?.setFlag)
    return t;
  const n = YC(e);
  if (n?.setFlag)
    return n;
  const a = ge(e);
  if (!a) return null;
  const r = game.messages;
  return ie(r?.get?.(a));
}
function YC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ie).find((n) => typeof n?.setFlag == "function") ?? null;
}
function vu(e) {
  const t = Lu(e.context.message);
  if (t) return t;
  const n = e.messageId ? XC(e.messageId) : null;
  if (n) return n;
  const a = Nu().slice().reverse();
  return a.find((r) => QC(r, e)) ?? a.find((r) => ZC(r, e)) ?? null;
}
function XC(e) {
  const t = game.messages;
  return ie(t?.get?.(e));
}
function QC(e, t) {
  const n = ge(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Du(e, t)) return !1;
  const r = xu(e);
  return !t.actorId || !r || r === t.actorId;
}
function ZC(e, t) {
  if (!eS(e, t)) return !1;
  const n = xu(e);
  return t.actorId && n === t.actorId ? !0 : Du(e, t);
}
function Du(e, t) {
  const n = ze(JC(e));
  if (!n) return !1;
  const a = ze(t.itemName);
  if (a && n.includes(a)) return !0;
  const r = ze(t.itemId);
  return !!(r && n.includes(r));
}
function JC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function xu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function eS(e, t) {
  const n = tS(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Mw;
}
function tS(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ie(e) {
  return e && typeof e == "object" ? e : null;
}
function $t(e) {
  return Ke(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && H(e.messageId) && H(e.itemId) && H(e.actorId) && H(e.itemName) && Te(e.resistanceTargetActorId) && Te(e.resistanceTargetName) && iS(e.resistanceRollResult) && nS(e.actionPayload) && na(e.title) && na(e.buttonLabel) && na(e.executedLabel) && Te(e.choiceGroupId) && Te(e.skippedLabel) && Te(e.actionSectionId) && Te(e.actionSectionTitle) && lS(e.summaryLines) : !1;
}
function nS(e) {
  return e == null ? !0 : Ke(e) ? e.kind === "resource-operation" && H(e.actorId) && H(e.actorUuid) && typeof e.actorName == "string" && aS(e.resource) && rS(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function aS(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function rS(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function oS(e) {
  return Ke(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && H(e.messageId) && Ke(e.source) && H(e.source.actorId) && H(e.source.actorName) && H(e.source.itemId) && H(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every($t) : !1;
}
function iS(e) {
  return e == null ? !0 : Ke(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Te(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function sS(e) {
  return e !== null;
}
function Ke(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function H(e) {
  return e === null || typeof e == "string";
}
function na(e) {
  return e === void 0 || typeof e == "string";
}
function Te(e) {
  return e == null || typeof e == "string";
}
function lS(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function cS(e) {
  return typeof e == "string" && e.length > 0;
}
function Nu() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(ie).filter((a) => a !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(ie).filter((a) => a !== null) : [];
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
function ge(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function uS(e) {
  return e.trim().toLowerCase();
}
function dS(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function nt(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ds = 1e3;
class mS {
  constructor(t, n, a, r, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = r, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new k$(
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
      if (a.error.reason === "missing-automation" && _S(t.item) && n.executionMode === "ask") {
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
    const r = pS(
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
    const a = n.prompt.actionPayload, r = RS(a);
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
    return o.ok ? (await Uw(t), await zw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Fw(
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
      AS(t.item),
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
          Me(r.workflowContext)
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
      if (!Ce())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const r = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return r.ok ? (yS(n, r.value), await Hl(r.value), {
        ok: !0,
        executedLabel: fS(r.value)
      }) : (this.handleDamageActionFailure(r.error), { ok: !1 });
    }
    if (!Ce())
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
    await Bw({
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
        actionPayload: TS(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      Me(n)
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
      Me(r.value.context)
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
function fS(e) {
  return Vl({ inputAmount: e.totalRawDamage });
}
function pS(e, t) {
  if (t.resistance || !gS(t))
    return t;
  const n = Wc(e);
  return n ? { ...t, resistance: n } : t;
}
function gS(e) {
  return hS(e) && !bS(e);
}
function hS(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function bS(e) {
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
function yS(e, t) {
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
function _S(e) {
  return e.type === "ritual";
}
function AS(e) {
  return gk(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function TS(e) {
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
function RS(e) {
  const t = e.actorUuid ? kS(e.actorUuid) : null;
  if (Ye(t)) return t;
  const n = e.actorId ? ES(e.actorId) : null;
  return n || $S(e.actorName);
}
function kS(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function ES(e) {
  const n = game.actors?.get?.(e);
  if (Ye(n)) return n;
  for (const a of Pu()) {
    const r = io(a);
    if (r?.id === e) return r;
  }
  return null;
}
function $S(e) {
  const t = ra(e);
  if (!t) return null;
  for (const r of Pu()) {
    const o = wS(r);
    if (ra(o) === t) {
      const s = io(r);
      if (s) return s;
    }
  }
  const a = game.actors?.find?.(
    (r) => Ye(r) && ra(r.name) === t
  );
  return Ye(a) ? a : null;
}
function Pu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function wS(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : io(e)?.name ?? null;
}
function io(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ye(t)) return t;
  const n = e.document?.actor;
  return Ye(n) ? n : null;
}
function ra(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ye(e) {
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
class CS {
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
class SS {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, a = IS(t);
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
      reason: LS(a, n.preset)
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
function IS(e) {
  const t = e.getFlag(d, "automation");
  return or(t) ? t : null;
}
function LS(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ft(e) {
  return (t) => t.status === e;
}
class vS {
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
    const n = Bt(t.actorName), a = Bt(t.resource), r = Bt(DS(t)), o = Bt(xS(t));
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
function DS(e) {
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
function xS(e) {
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
function NS() {
  const e = new jT(), t = new FR(e), n = new Tl(new Al()), a = new Rl(new Rr()), r = new BR(new Mc()), o = new VT(), s = new sR(o), l = new mR(e), c = new pR(), u = c.registerMany(
    xd()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new fR(), g = new uR(), _ = Ll(), k = new $l(_), R = new SS(
    c
  ), E = new CS(
    R,
    m,
    g
  ), b = new jR(), L = new vS(b), A = new qR(), B = new OR(), x = new PR(
    t,
    s,
    L,
    A
  ), Y = new zR(x, A), v = new mS(
    Y,
    t,
    s,
    n,
    k,
    b,
    B
  );
  return v.addStrategy(
    new al(
      (j) => v.handleItemUsed(j)
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
    workflow: Y,
    itemUseIntegration: v,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: E
  };
}
const { ApplicationV2: PS } = foundry.applications.api;
class ln extends PS {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${ne(ws)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${ne(t.actorName)}</strong></p>
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
        <span>${ne(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? MS(n) : FS(t)}
    </section>
  `;
}
function MS(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(OS).join("")}</ol>`;
}
function OS(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", a = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${ne(e.appliedPresetId)} v${ne(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${ne(e.itemName)}</strong>
        <span>${ne(e.reason)}</span>
        ${a}
      </div>
      <em>${ne(n)}</em>
    </li>
  `;
}
function FS(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${ne({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function ne(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const cn = `${d}.manageRitualPresets`, ps = `__${d}_ritualPresetHeaderControlRegistered`, BS = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function US(e) {
  const t = globalThis;
  if (!t[ps]) {
    for (const n of BS)
      Hooks.on(n, (a, r) => {
        zS(a, r, e);
      });
    t[ps] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function zS(e, t, n) {
  Array.isArray(t) && jS(e) && (qS(e, n), !t.some((a) => a.action === cn) && t.push({
    action: cn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), Mu(e, n);
    }
  }));
}
function qS(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[cn] && (e.options.actions[cn] = (n) => {
    n.preventDefault(), n.stopPropagation(), Mu(e, t);
  }));
}
function jS(e) {
  if (!game.user?.isGM) return !1;
  const t = Ou(e);
  return t ? t.type === "agent" && Rt(t).length > 0 : !1;
}
function Mu(e, t) {
  const n = Ou(e);
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
function Ou(e) {
  return gs(e.actor) ? e.actor : gs(e.document) ? e.document : null;
}
function gs(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const tr = "data-paranormal-toolkit-stylesheet";
function GS(e) {
  const t = YS(e), n = HS(t), a = WS(n), r = VS(n, t);
  if (r)
    return r.href = a, r.setAttribute(tr, t), r;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = a, o.setAttribute(tr, t), document.head.append(o), o;
}
function HS(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, a = n.getRoute;
  return typeof a == "function" ? a.call(n, t) : t;
}
function VS(e, t) {
  const n = hs(e);
  for (const a of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (a.getAttribute(tr) === t || hs(a.href) === n)
      return a;
  return null;
}
function WS(e) {
  const t = KS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function KS() {
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
function YS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function ke(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const a = document.createElement("span");
  return a.textContent = e, n.append(a, t), n;
}
function nr(e, t, n) {
  const a = document.createElement("input");
  return a.type = "text", a.value = e, a.placeholder = t, a.disabled = !n, a;
}
function Vt(e, t, n) {
  const a = document.createElement("button");
  a.type = "button", n && a.classList.add(n);
  const r = document.createElement("i");
  r.className = t;
  const o = document.createElement("span");
  return o.textContent = e, a.append(r, o), a;
}
function Fu(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const a = document.createElement("i");
  return a.className = t, n.append(a), n;
}
function it(e, t, n = !1) {
  const a = document.createElement("option");
  return a.value = e, a.textContent = t, a.selected = n, a;
}
function XS(e) {
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
  const g = Fu("Remover rolagem", "fa-solid fa-trash");
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
  }), _.append(ke("Nome da rolagem", k));
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
        hf(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = eI(R.value), Ct(), r();
  }), _.append(ke("Tipo da rolagem", R));
  const E = document.createElement("div");
  E.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), _.append(E);
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
  const Y = document.createElement("span");
  Y.textContent = "Varia conforme o NEX", B.append(x, Y), L.append(A, B);
  const v = document.createElement("div");
  return v.classList.add(`${d}-ability-roll-config__formula`), b.append(L, v), x.addEventListener("change", () => {
    t.formula = x.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: ZS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, j(), he(), r();
  }), s.append(l, _, b), j(), Ct(), he(), s;
  function j() {
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
    for (const { value: S, label: U } of ol)
      $.append(it(S, U, t.damageType === S));
    $.addEventListener("change", () => {
      t.damageType = $.value || null, r();
    }), E.append(ke("Tipo de dano", $));
  }
  function he() {
    if (v.replaceChildren(), t.formula.mode === "fixed") {
      const X = nr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        a
      );
      X.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = X.value, r());
      }), v.append(ke("Expressão", X));
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
      C.resolution = tI($.value), r();
    }), v.append(ke("Comportamento", $));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((X, St) => {
      S.append(
        QS({
          step: X,
          editable: a,
          onChange: r,
          onRemove: () => {
            C.steps.splice(St, 1), he(), r();
          }
        })
      );
    }), v.append(S);
    const U = Vt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    U.disabled = !a || C.steps.length >= ba, U.addEventListener("click", () => {
      C.steps.length >= ba || (C.steps.push({
        minNex: JS(
          C.steps.map((X) => X.minNex)
        ),
        formula: ""
      }), he(), r());
    }), v.append(U);
  }
}
function QS(e) {
  const { step: t, editable: n, onChange: a, onRemove: r } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = nI(Number(s.value)), s.value = String(t.minNex), a();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = nr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, a();
  });
  const m = Fu("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", r), o.append(
    ke("NEX mínimo", l),
    ke("Fórmula", u),
    m
  ), o;
}
function ZS(e) {
  const t = lf(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function JS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function eI(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function tI(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function nI(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function aI(e) {
  let t = la(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const a = rI(t), r = document.createElement("p");
  r.classList.add(`${d}-ability-roll-config__hint`), r.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = Vt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= ha || (t.rolls.push(sl(t.rolls.length + 1)), _(), L("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = Vt("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = Vt("Limpar", "fa-solid fa-eraser");
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
          XS({
            roll: A,
            index: B,
            editable: e.editable,
            onChange: () => {
              ar(a, t), L("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(B, 1), _(), L("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    ar(a, t), b(!1);
  }
  async function k() {
    E(!0), L("Salvando configuração...");
    try {
      const A = pr(t);
      if (!A) throw new Error("Configuração inválida.");
      t = la(await e.onSave(A)), _(), L("Configuração salva.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        A
      ), L("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      E(!1);
    }
  }
  async function R() {
    E(!0), L("Limpando configuração...");
    try {
      t = la(await e.onClear()), _(), L("Configuração removida.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        A
      ), L("Não foi possível limpar a configuração."), ui.notifications?.warn(
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
  function L(A) {
    g.textContent = A;
  }
}
function rI(e) {
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
  n && (n.textContent = bf(t) ? "Configurada" : "Rascunho");
}
function la(e) {
  return JSON.parse(JSON.stringify(e));
}
const oI = "[data-paranormal-toolkit-ability-roll-config]", bs = `__${d}_abilityRollConfigBlockRegistered`, iI = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function sI() {
  const e = globalThis;
  if (!e[bs]) {
    GS("styles/ability-roll-config.css");
    for (const t of iI)
      Hooks.on(t, (...n) => {
        lI(n[0], n[1]);
      });
    e[bs] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function lI(e, t) {
  const n = uI(e);
  if (!n || n.type !== "ability") return;
  const a = mI(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!r) return;
  for (const s of Array.from(
    r.querySelectorAll(oI)
  ))
    s.remove();
  const o = aI({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: uf(n),
    editable: dI(n),
    onSave: async (s) => {
      const l = await df(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await mf(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), il())
  });
  cI(r, o);
}
function cI(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function uI(e) {
  return ys(e.item) ? e.item : ys(e.document) ? e.document : null;
}
function dI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function mI(e) {
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
const Bu = "data-paranormal-toolkit-ritual-roll-config", wt = "data-paranormal-toolkit-ritual-roll-field", Se = "data-paranormal-toolkit-ritual-roll-action", _s = `__${d}_ritualRollConfigBlockRegistered`, fI = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], pI = [
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
function gI() {
  const e = globalThis;
  if (!e[_s]) {
    hI();
    for (const t of fI)
      Hooks.on(t, (...n) => {
        bI(n[0], n[1]);
      });
    e[_s] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function hI() {
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
function bI(e, t) {
  const n = vI(e);
  if (!n || n.type !== "ritual") return;
  const a = NI(t);
  if (!a) return;
  const r = a.querySelector('section[data-tab="ritualAttr"]');
  if (!r) return;
  _I(r);
  const o = zu(n), s = Vc(n), l = DI(n), c = AI(n, s, o, l);
  wI(c, n, o, l), yI(r, c), so(c);
}
function yI(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function _I(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Bu}]`)))
    t.remove();
}
function AI(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config`), r.setAttribute(Bu, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(As("strong", "Paranormal Toolkit")), s.append(As("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = ju(t) ? "Configurada" : "Rascunho", o.append(s, l), r.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", r.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(TI(t, a)), u.append(RI(t, a)), u.append(kI(t, a)), r.append(u), r.append(EI(t, n, a)), r.append($I(a));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = a ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", r.append(m), r;
}
function TI(e, t) {
  const n = xn("Tipo da rolagem"), a = document.createElement("select");
  a.setAttribute(wt, "intent"), a.disabled = !t;
  for (const r of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = r, o.textContent = pk(r), o.selected = e.intent === r, a.append(o);
  }
  return n.append(a), n;
}
function RI(e, t) {
  const n = xn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const a = document.createElement("select");
  a.setAttribute(wt, "damageType"), a.disabled = !t;
  const r = document.createElement("option");
  r.value = "", r.textContent = "—", r.selected = !e.damageType, a.append(r);
  for (const o of pI) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, a.append(s);
  }
  return n.append(a), n;
}
function kI(e, t) {
  const n = xn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const a = document.createElement("input");
  return a.type = "text", a.placeholder = "Resultado", a.value = e.utilityLabel ?? "Resultado", a.disabled = !t, a.setAttribute(wt, "utilityLabel"), n.append(a), n;
}
function EI(e, t, n) {
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
function $I(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(Se, "save");
  const a = document.createElement("button");
  return a.type = "button", a.textContent = "Limpar", a.disabled = !e, a.setAttribute(Se, "clear"), t.append(n, a), t;
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
function wI(e, t, n, a) {
  at(e, "intent")?.addEventListener("change", () => so(e)), ks(e, "system.studentForm")?.addEventListener("change", () => Ts(e, t)), ks(e, "system.trueForm")?.addEventListener("change", () => Ts(e, t)), e.querySelector(`[${Se}="save"]`)?.addEventListener("click", () => {
    a && CI(e, t, n);
  }), e.querySelector(`[${Se}="clear"]`)?.addEventListener("click", () => {
    a && SI(e, t);
  });
}
async function CI(e, t, n) {
  const a = e.querySelector(`[${Se}="save"]`);
  a?.setAttribute("disabled", "true"), qe(e, "Salvando configuração...");
  try {
    const r = II(e, n);
    await mk(t, r), Uu(e, r), qe(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", r), qe(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    a?.removeAttribute("disabled");
  }
}
async function SI(e, t) {
  const n = e.querySelector(`[${Se}="clear"]`);
  n?.setAttribute("disabled", "true"), qe(e, "Limpando configuração...");
  try {
    await fk(t);
    const a = Vc(t);
    LI(e, a), Uu(e, a), qe(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", a), qe(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Uu(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = ju(t) ? "Configurada" : "Rascunho");
}
function II(e, t) {
  return {
    schemaVersion: 1,
    intent: qu(at(e, "intent")?.value),
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
function LI(e, t) {
  Pe(e, "intent", t.intent), Pe(e, "damageType", t.damageType ?? ""), Pe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), Pe(e, "formula.base", t.forms.base.formula), Pe(e, "formula.discente", t.forms.discente.formula), Pe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), so(e);
}
function so(e) {
  const t = qu(at(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), a = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const r of Array.from(n))
    r.hidden = t !== "damage";
  for (const r of Array.from(a))
    r.hidden = t !== "utility";
}
function Ts(e, t) {
  const n = zu(t);
  Rs(e, "discente", n.discente), Rs(e, "verdadeiro", n.verdadeiro);
}
function Rs(e, t, n) {
  const a = at(e, `formula.${t}`);
  if (!a) return;
  const r = !e.querySelector(`[${Se}="save"]`)?.disabled;
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
function qe(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function zu(e) {
  const t = xI(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function vI(e) {
  return $s(e.item) ? e.item : $s(e.document) ? e.document : null;
}
function DI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function xI(e) {
  const t = e.system;
  return PI(t) ? t : {};
}
function ks(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function at(e, t) {
  return e.querySelector(`[${wt}="${MI(t)}"]`);
}
function Wt(e, t) {
  return at(e, t)?.value.trim() ?? "";
}
function Es(e, t) {
  const n = Wt(e, t);
  return n.length > 0 ? n : null;
}
function Pe(e, t, n) {
  const a = at(e, t);
  a && (a.value = n);
}
function qu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function ju(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function NI(e) {
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
function PI(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function MI(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let te = null;
Hooks.once("init", () => {
  Id(), sm(), Cp(), LT(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!To.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${To.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  te = NS(), te.itemUseIntegration.registerStrategies(), bp(te.resources, te.resourceAdapter), kp(te.conditions), Km(te), MT(), US(te), gI(), sI(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function OI() {
  if (!te)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return te;
}
export {
  OI as getToolkitServices
};
//# sourceMappingURL=main.js.map
