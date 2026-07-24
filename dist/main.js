const d = "paranormal-toolkit", Cs = "Paranormal Toolkit", zu = "ordemparanormal";
class At {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function mn(e) {
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
  const t = lr(e);
  return t.ok ? y(t.value.definition) : t;
}
function lr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : cr(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function qu(e) {
  return cr(e.getFlag(d, "automation"));
}
function cr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ju(t.source) && Gu(t.definition);
}
function Gu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Vu) && (t.ritualForms === void 0 || Qu(t.ritualForms)) && (t.conditionApplications === void 0 || nd(t.conditionApplications));
}
function ju(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Vu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Hu(t);
    case "spendRitualCost":
      return Wu(t);
    case "rollFormula":
      return Ku(t);
    case "modifyResource":
      return Yu(t);
    case "chatCard":
      return Xu(t);
    default:
      return !1;
  }
}
function Hu(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ss(t);
}
function Wu(e) {
  return e.type === "spendRitualCost";
}
function Ku(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || cd(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Yu(e) {
  const t = e;
  return t.type === "modifyResource" && Is(t.actor) && sd(t.resource) && ld(t.operation) && Ss(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Xu(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Qu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([a, r]) => n.has(a) && Zu(r)
  );
}
function Zu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || dd(t.extraCost)) && (t.rollFormulaOverrides === void 0 || fd(t.rollFormulaOverrides)) && (t.notes === void 0 || md(t.notes)) && (t.targeting === void 0 || Ju(t.targeting));
}
function Ju(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return td(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || ed(t.template));
}
function ed(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || mo(t.distance)) && (t.width === void 0 || t.width === null || mo(t.width));
}
function td(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function nd(e) {
  return Array.isArray(e) && e.every(ad);
}
function ad(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Is(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || od(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || rd(t.applyOnResistance));
}
function rd(e) {
  return e === "failure" || e === "success" || e === "always";
}
function od(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || ud(t.rounds)) && (t.expiry === void 0 || t.expiry === null || id(t.expiry));
}
function id(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ss(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Is(e) {
  return e === "self" || e === "target";
}
function sd(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ld(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function cd(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function ud(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function dd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function mo(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function md(e) {
  return Array.isArray(e) && e.every(w);
}
function fd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function ur(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(fo);
    if (hd(t))
      return Array.from(t).filter(fo);
  }
  return [];
}
function pd(e) {
  return ur(e)[0] ?? null;
}
function gd(e) {
  return ur(e).find(qu) ?? null;
}
function hd(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function fo(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Rt(e) {
  return ur(e).filter((t) => t.type === "ritual");
}
function Ls(e) {
  return Rt(e)[0] ?? null;
}
function bd(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(mn);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = rt("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = It(t);
      if (!n) return [];
      const a = e.automationRegistry.findForItem(n).map(ho);
      return f.info(`Presets encontrados para ${n.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const n = rt("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const a = It(n);
      if (!a) return;
      const r = e.automationRegistry.require(t);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      const o = await fa(e, a, r.value);
      f.info(`Preset ${r.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = rt("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = It(t);
      if (!n) return;
      const a = e.automationRegistry.findForItem(n)[0];
      if (!a) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const r = await fa(e, n, a.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: ho(a), itemPatch: r }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return po(e);
    },
    async applyBestPresetsToActorRituals() {
      return po(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = rt("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = It(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function po(e) {
  const t = rt("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Rt(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), go(t);
  const a = go(t, n.length);
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
    const s = await fa(e, r, o.preset);
    a.applied.push(yd(r, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), _d(a), a;
}
async function fa(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function yd(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: mn(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function go(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function _d(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function ho(e) {
  return {
    preset: mn(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function rt(e) {
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function It(e) {
  const t = Ls(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ne(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ad(e.sourceActor),
      token: e.sourceToken
    },
    item: Td(e.item),
    targets: e.targets.map(Rd),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: bo(e.rollRequests, vs),
    rolls: bo(e.rolls, kd),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(dr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function dr(e) {
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
function Ad(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Td(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Rd(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function vs(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function kd(e) {
  return {
    ...vs(e),
    total: e.total
  };
}
function bo(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, a]) => [n, t(a)]));
}
function $d(e) {
  return {
    getSelected() {
      return At.getSelectedActor();
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
    Ed(r.error);
    return;
  }
  const o = r.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, dr(o));
}
function pe(e) {
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ed(e) {
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
function wd() {
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
function pa() {
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
function Cd() {
  return {
    status() {
      return pa();
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
const Ds = "ritual.costOnly", xs = "ritual.simpleHealing", Sd = "ritual.eletrocussao", Id = "ritual.definhar", Ns = "ritual.simpleDamage", Ps = "generic.simpleHealing", Ms = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, mr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ld() {
  return [
    vd(),
    Dd(),
    xd(),
    Nd(),
    Pd(),
    Md()
  ];
}
function vd() {
  return {
    id: Ds,
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
function Dd() {
  return {
    id: xs,
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
    automation: Os(),
    itemPatch: Ud()
  };
}
function xd() {
  return {
    id: Sd,
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
    automation: Fd(),
    itemPatch: qd()
  };
}
function Nd() {
  return {
    id: Id,
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
    automation: Bd(),
    itemPatch: zd()
  };
}
function Pd() {
  return {
    id: Ns,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: fr()
  };
}
function Md() {
  return {
    id: Ps,
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
function Os(e = Ms) {
  const t = Od(e);
  return Fs(
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
function Od(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Ms,
    ...e
  };
}
function Fd() {
  return {
    ...fr("3d6", {
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
function Bd() {
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
function fr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", r = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Fs(
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
function Ud() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: mr,
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
function zd() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: mr,
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
function qd() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: mr,
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
function Fs(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: n
    })
  };
}
function pr() {
  return Array.from(game.user?.targets ?? []).map(Bs);
}
function Bs(e) {
  return {
    tokenId: Pe(e.id),
    actorId: Pe(e.actor?.id),
    sceneId: Pe(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Us() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Pe(e.id),
    actorId: Pe(t?.id),
    sceneId: Pe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Pe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Gd(e) {
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
        if (!Hd(t, n)) {
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
      const a = e.automationRegistry.require(Ds);
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
      if (!yo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const r = e.automationRegistry.require(xs);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: Os(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = ge("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const a = he(n);
      if (!a) return;
      if (!yo(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const r = e.automationRegistry.require(Ns);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: fr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ge("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = he(t);
      n && await jd(e, t, n);
    }
  };
}
async function jd(e, t, n) {
  const a = Tt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Us(),
    item: n,
    targets: pr()
  });
  if (!r.ok) {
    Vd(r.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", Ne(r.value.context));
}
function Vd(e) {
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
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function he(e) {
  const t = Ls(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Hd(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function yo(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Wd = ["strict", "open"], zs = "strict";
function Kd(e) {
  return Wd.includes(e) ? e : zs;
}
function Yd(e) {
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
function fn(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Xd = ["disabled", "ask", "automatic"], Qd = ["buttons", "confirm"], qs = "ask";
function Zd(e) {
  return typeof e == "string" && Xd.includes(e);
}
function Jd(e) {
  return typeof e == "string" && Qd.includes(e);
}
function em(e) {
  return Zd(e) ? e : Jd(e) ? "ask" : qs;
}
const tm = ["keep", "replace"], nm = ["manual", "assisted"], Gs = "keep", js = "assisted", am = !0, M = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function rm() {
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
    default: qs
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
    default: Gs
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
    default: zs
  }), game.settings.register(d, M.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: am
  }), game.settings.register(d, M.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ga() {
  const e = em(game.settings.get(d, M.executionMode)), t = Ws(game.settings.get(d, M.systemCardMode)), n = Ks(game.settings.get(d, M.damageResolutionMode)), a = gr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: a,
    ritualCastingCheckEnabled: Hs()
  };
}
function Vs() {
  return Ws(game.settings.get(d, M.systemCardMode));
}
function om() {
  return Ks(game.settings.get(d, M.damageResolutionMode));
}
function gr() {
  return Kd(game.settings.get(d, M.resistanceGateMode));
}
function Hs() {
  return game.settings.get(d, M.ritualCastingCheckEnabled) === !0;
}
async function be(e) {
  await game.settings.set(d, M.executionMode, e);
}
function Ws(e) {
  return tm.includes(e) ? e : Gs;
}
function Ks(e) {
  return nm.includes(e) ? e : js;
}
function im(e) {
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
const sm = [
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
function lm(e) {
  return {
    phases() {
      return sm;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Pn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = gd(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await _o(e, t, n);
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
      if (!dm(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = um(n) ?? Pn("Nenhum ator encontrado para executar automação do item.");
      a && await _o(e, a, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Pn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = pd(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(Ps);
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
async function _o(e, t, n) {
  const a = Tt(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Us(),
    item: n,
    targets: pr()
  });
  if (!r.ok) {
    cm(r.error);
    return;
  }
  f.info("Automação executada com sucesso.", Ne(r.value.context));
}
function cm(e) {
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
function Pn(e) {
  const t = At.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function um(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function dm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function mm(e) {
  const t = $d(e), n = bd(e), a = Gd(e), r = lm(e), o = Cd(), s = im(e);
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
const zt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function fm(e) {
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
      const a = Ao();
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
      return pm(r), r;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Ao();
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
      return gm(a), a;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Ao() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = n.actor ?? n.document?.actor ?? null;
    if (!a) continue;
    const o = a.uuid ?? null ?? a.id ?? a.name ?? `selected-${t.size}`;
    t.set(o, a);
  }
  return Array.from(t.values());
}
function pm(e) {
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
function gm(e) {
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
function L(e) {
  return e == null ? "" : String(e).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
const hm = "icons/svg/mystery-man.svg";
function ot(e) {
  const t = e.image, n = t?.src || t?.fallbackSrc || hm, a = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(
    (r) => `<span class="paranormal-toolkit-chat-card-header__badge paranormal-toolkit-chat-card-header__badge--${r.tone ?? "neutral"}">${L(r.label)}</span>`
  ).join("")}</div>` : "";
  return `
    <header class="paranormal-toolkit-chat-card-header">
      <img
        class="paranormal-toolkit-chat-card-header__image"
        src="${L(n)}"
        alt="${L(t?.alt ?? "")}"
        width="46"
        height="46"
      >
      <div class="paranormal-toolkit-chat-card-header__body">
        <p class="paranormal-toolkit-chat-card-header__eyebrow">${L(e.eyebrow)}</p>
        <h3 class="paranormal-toolkit-chat-card-header__title">${L(e.title)}</h3>
        ${e.subtitle ? `<p class="paranormal-toolkit-chat-card-header__subtitle">${L(e.subtitle)}</p>` : ""}
        ${a}
      </div>
    </header>
  `;
}
function ye(e) {
  return `
    <section class="paranormal-toolkit-chat-card-section paranormal-toolkit-chat-card-section--${e.tone ?? "generic"}">
      <header class="paranormal-toolkit-chat-card-section__header">
        <h3 class="paranormal-toolkit-chat-card-section__title">${L(e.title)}</h3>
        ${e.description ? `<p class="paranormal-toolkit-chat-card-section__description">${L(e.description)}</p>` : ""}
      </header>
      <div class="paranormal-toolkit-chat-card-section__content">${e.content}</div>
    </section>
  `;
}
function it(e) {
  const t = e.entries.map(
    (n) => `
        <div class="paranormal-toolkit-chat-card-metadata__entry">
          <dt class="paranormal-toolkit-chat-card-metadata__label">${L(n.label)}</dt>
          <dd class="paranormal-toolkit-chat-card-metadata__value">${L(n.value)}</dd>
        </div>`
  ).join("");
  return `
    <dl class="paranormal-toolkit-chat-card-metadata">
      ${t}
    </dl>
  `;
}
function xe(e) {
  const t = e.dice?.length ? `<div class="paranormal-toolkit-chat-roll__dice">${e.dice.map(
    (r) => `<span class="paranormal-toolkit-chat-roll__die paranormal-toolkit-chat-roll__die--${r.state}"${r.label ? ` title="${L(r.label)}"` : ""}>${L(r.value)}</span>`
  ).join("")}</div>` : "", n = e.total == null ? '<span class="paranormal-toolkit-chat-roll__pending">Pendente</span>' : `<strong class="paranormal-toolkit-chat-roll__total">${L(e.total)}</strong>`, a = e.action ? `<button type="button" class="paranormal-toolkit-chat-roll__action"${e.action.disabled ? " disabled" : ""}>${L(e.action.label)}</button>` : "";
  return `
    <div class="paranormal-toolkit-chat-roll paranormal-toolkit-chat-roll--${e.tone ?? "generic"}">
      ${e.label ? `<span class="paranormal-toolkit-chat-roll__label">${L(e.label)}</span>` : ""}
      <div class="paranormal-toolkit-chat-roll__result">
        <code class="paranormal-toolkit-chat-roll__formula">${L(e.formula)}</code>
        ${n}
      </div>
      ${t}
      ${a}
    </div>
  `;
}
function Yt(e) {
  return `
    <aside class="paranormal-toolkit-chat-status paranormal-toolkit-chat-status--${e.tone}">
      ${e.title ? `<strong class="paranormal-toolkit-chat-status__title">${L(e.title)}</strong>` : ""}
      <p class="paranormal-toolkit-chat-status__message">${L(e.message)}</p>
    </aside>
  `;
}
const st = [
  { image: { src: "icons/svg/upgrade.svg", alt: "Símbolo geométrico" }, eyebrow: "Habilidade fictícia", title: "Pulso Vetorial", subtitle: "Movimento experimental", badges: [] },
  { image: { src: null, fallbackSrc: "icons/svg/mystery-man.svg" }, eyebrow: "Preview", title: "Eco", badges: [{ label: "Único", tone: "info" }] },
  { eyebrow: "Ritual fictício", title: "Órbita Prismática", subtitle: "Condensação de reflexos prismáticos", badges: [{ label: "Círculo alfa", tone: "accent" }, { label: "Cena", tone: "warning" }] },
  { eyebrow: "Equipamento fictício", title: "Lançador de Bruma", subtitle: "Categoria experimental", badges: [{ label: "Categoria Z", tone: "neutral" }] },
  { eyebrow: "Teste de largura", title: "Uma denominação deliberadamente extensa para observar quebras de linha", subtitle: "Subtítulo igualmente extenso, criado apenas para validar a composição visual em espaços reduzidos e sem qualquer regra de jogo.", badges: [{ label: "Alfa", tone: "success" }, { label: "Beta", tone: "resource" }, { label: "Gama", tone: "danger" }] }
], bm = ["generic", "test", "damage", "healing", "resistance"].map((e, t) => ({ title: `Seção ${e}`, description: t === 4 ? "Uma corrente luminosa percorre o ambiente e destaca suavemente as formas ao redor." : "Uma manifestação breve altera a cena por alguns instantes.", tone: e, text: `Conteúdo estático ${t + 1}.` })), ym = [
  { label: "Pendente", formula: "2d8 + 3", tone: "test", action: { label: "Ação visual" } },
  { label: "Resolvido", formula: "1d6", total: 7, tone: "generic", dice: [{ value: "6", state: "active" }] },
  { formula: "12d12 + 12345 + 2d6", total: "123456", tone: "damage", dice: [{ value: "12", state: "active" }, { value: "2", state: "discarded" }, { value: "7", state: "neutral" }], action: { label: "Indisponível", disabled: !0 } },
  { formula: "1d4", total: 4, tone: "healing" },
  { formula: "1d20", total: 19, tone: "resistance" }
], _m = ["success", "failure", "info", "resource", "warning", "manual"].map((e, t) => ({ tone: e, title: t % 2 ? void 0 : `Estado ${e}`, message: t === 5 ? "A corrente permanece estável enquanto as marcas luminosas continuarem alinhadas." : `Mensagem fictícia ${t + 1}.` }));
function Dt(e, t, n, a = !1) {
  return {
    kind: e,
    html: `
      <article class="paranormal-toolkit-chat-card paranormal-toolkit-chat-card--demo${a ? " paranormal-toolkit-chat-card--narrow" : ""}">
        <div class="paranormal-toolkit-chat-card__demo">Demonstração</div>
        ${t}
        <div class="paranormal-toolkit-chat-card__body">${n.join("")}</div>
      </article>
    `
  };
}
function Mn(e) {
  return `<p class="paranormal-toolkit-chat-card__copy">${L(e)}</p>`;
}
function Am(e) {
  return xe({
    ...e,
    action: e.action ? { label: e.action.label, disabled: !0 } : void 0
  });
}
function Ys(e = !1) {
  const t = e ? Am : xe, n = Dt("ability", ot(st[0]), [
    it({
      entries: [
        { label: "Execução", value: "Ação breve" },
        { label: "Custo", value: "2 cargas" }
      ]
    }),
    ye({
      title: "Descrição",
      content: Mn("Você concentra o impulso ao redor do corpo e avança com precisão por uma curta distância.")
    }),
    t({
      label: "Impulso",
      formula: "2d8 + 3",
      tone: "test",
      action: { label: "Realizar teste" }
    }),
    Yt({
      tone: "resource",
      title: "Cargas",
      message: "2 cargas reservadas para esta demonstração."
    })
  ]), a = Dt("ritual", ot(st[2]), [
    it({
      entries: [
        { label: "Execução", value: "Ação completa" },
        { label: "Alcance", value: "Médio" },
        { label: "Duração", value: "2 rodadas" }
      ]
    }),
    ye({
      title: "Conjuração",
      description: "Órbita estável",
      tone: "test",
      content: Mn("Fragmentos prismáticos orbitam o ponto escolhido e iluminam os contornos próximos.")
    }),
    ye({
      title: "Impacto prismático",
      tone: "damage",
      content: xe({
        label: "Resultado",
        formula: "3d6 + 2",
        total: 14,
        tone: "damage",
        dice: [
          { value: "6", state: "active" },
          { value: "3", state: "neutral" },
          { value: "3", state: "neutral" }
        ]
      })
    }),
    Yt({
      tone: "manual",
      title: "Duração",
      message: "A órbita permanece estável até o fim da segunda rodada."
    })
  ]), r = Dt("weapon", ot(st[3]), [
    it({
      entries: [
        { label: "Categoria", value: "Z" },
        { label: "Alcance", value: "Curto" }
      ]
    }),
    ye({
      title: "Disparo",
      tone: "test",
      content: t({
        label: "Ataque",
        formula: "1d20 + 4",
        tone: "test",
        action: { label: "Realizar ataque" }
      })
    }),
    ye({
      title: "Impacto",
      tone: "damage",
      content: xe({
        label: "Dano",
        formula: "2d5 + 1",
        total: 8,
        tone: "damage"
      })
    })
  ]), o = Dt("stress", ot(st[4]), [
    it({
      entries: [
        { label: "Execução prolongada", value: "Duas ações consecutivas" },
        { label: "Alcance variável", value: "Extremamente distante" },
        { label: "Custo acumulado", value: "12 cargas prismáticas" }
      ]
    }),
    ye({
      title: "Cascata de reflexos",
      description: "Uma descrição extensa para conferir a leitura em espaços muito estreitos.",
      content: Mn("Reflexos sucessivos atravessam a névoa, contornam cada obstáculo visível e convergem lentamente sobre o marco escolhido.")
    }),
    xe({
      label: "Resultado acumulado",
      formula: "12d12 + 8d8 + 12345 + 4d6",
      total: 987654,
      dice: [
        { value: "12", state: "active" },
        { value: "1", state: "discarded" },
        { value: "8", state: "neutral" },
        { value: "11", state: "active" },
        { value: "3", state: "discarded" },
        { value: "7", state: "neutral" },
        { value: "10", state: "active" }
      ],
      tone: "resistance"
    })
  ], !0);
  return [n, a, r, o];
}
const Xs = "uiExamples";
function Tm() {
  return game.messages?.contents ?? (game.messages.values ? Array.from(game.messages.values()) : []);
}
function Rm(e) {
  return e.getFlag?.(d, Xs)?.kind === "component-example";
}
async function Qs() {
  const e = Tm().filter(Rm);
  return await Promise.all(e.map((t) => t.delete?.())), { deleted: e.length };
}
async function km(e = {}) {
  const t = e.replaceExisting ?? !0, n = e.whisperToGm ?? !0, a = t ? (await Qs()).deleted : 0, r = foundry.utils.randomID(), o = [];
  for (const s of Ys(!0)) {
    const l = await ChatMessage.create({ content: s.html, whisper: n ? game.users.filter((c) => c.isGM && c.id).map((c) => c.id) : [], flags: { [d]: { [Xs]: { version: 1, kind: "component-example", batchId: r } } } });
    l?.id && o.push(l.id);
  }
  return { created: o.length, deletedBeforeCreate: a, messageIds: o };
}
const { ApplicationV2: $m } = foundry.applications.api;
class Em extends $m {
  static DEFAULT_OPTIONS = { id: `${d}-component-gallery`, classes: [`${d}-component-gallery`], tag: "section", position: { width: 920, height: 760 }, window: { title: "Paranormal Toolkit · Componentes", resizable: !0 } };
  async _renderHTML() {
    const t = document.createElement("div");
    t.className = "paranormal-toolkit-component-gallery";
    const n = [
      ["Headers", st.map(ot)],
      ["Metadados", [it({ entries: [{ label: "Execução", value: "Ação breve" }, { label: "Custo", value: "2 cargas" }, { label: "Alcance", value: "Curto" }] })]],
      ["Sections", bm.map((a) => ye({ ...a, content: Yt({ tone: "info", message: a.text }) }))],
      ["Roll displays", ym.map(xe)],
      ["Banners", _m.map(Yt)],
      ["Cards completos", Ys().map((a) => a.html)]
    ];
    return t.innerHTML = n.map(([a, r]) => `<section class="paranormal-toolkit-component-gallery__group"><h2>${a}</h2><div class="paranormal-toolkit-component-gallery__grid">${r.map((o, s) => `<div class="paranormal-toolkit-component-gallery__preview${a === "Cards completos" && s === 3 ? " paranormal-toolkit-component-gallery__preview--narrow" : ""}">${o}</div>`).join("")}</div></section>`).join(""), t;
  }
  _replaceHTML(t, n) {
    n.replaceChildren(t);
  }
}
let To = null;
function wm() {
  To ??= new Em(), To.render({ force: !0 });
}
function On() {
  return game.user?.isGM ? !0 : (ui.notifications?.warn("Apenas o mestre pode usar os exemplos visuais do Paranormal Toolkit."), !1);
}
function Zs() {
  return { openGallery() {
    On() && wm();
  }, async postChatCards(e) {
    return On() ? km(e) : { created: 0, deletedBeforeCreate: 0, messageIds: [] };
  }, async clearChatCards() {
    return On() ? Qs() : { deleted: 0 };
  } };
}
function Cm() {
  const e = Zs(), t = game.modules.get("paranormal-toolkit");
  return t && (t.api = { ...t.api ?? {}, uiExamples: e }), e;
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
    conditions: fm(e.conditions),
    debug: mm(e),
    hooks: zt,
    uiExamples: Zs()
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const a = game.modules.get(d);
  return a && (a.api = t), t;
}
class Ro {
  static isSupportedSystem() {
    return game.system.id === zu;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const Fn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Im(e) {
  if (!Pm(e.item)) return null;
  const t = ha(e.actor) ? e.actor : Lm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Dm(e.token) ?? vm(t),
    targets: pr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Lm(e) {
  const t = e;
  return ha(t.actor) ? t.actor : ha(e.parent) ? e.parent : null;
}
function vm(e) {
  const t = xm(e) ?? Nm(e);
  return t ? Js(t) : null;
}
function Dm(e) {
  return ba(e) ? Js(e) : null;
}
function xm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return ba(n) ? n : (t.getActiveTokens?.() ?? []).find(ba) ?? null;
}
function Nm(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Js(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Bn(e.id),
    actorId: Bn(t?.id),
    sceneId: Bn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Pm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ha(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ba(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Bn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class el {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Fn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${Fn.ITEM_USED} registrado como fonte de uso de item.`));
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
      f.warn(`${Fn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Mm(e) {
  return e && typeof e == "object" ? e : {};
}
function Xt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function hr() {
  const e = globalThis.game;
  return pn(e) ? e : null;
}
function K(e, t) {
  const n = Om(e, t);
  return qt(n);
}
function Om(e, t) {
  return t.split(".").reduce((n, a) => pn(n) ? n[a] : null, e);
}
function Fm(e, t) {
  const n = e.indexOf(":");
  return n < 0 || gt(e.slice(0, n)) !== gt(t) ? null : Ke(e.slice(n + 1));
}
function qt(e) {
  return typeof e == "string" ? Ke(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function pn(e) {
  return !!e && typeof e == "object";
}
function Bm(e) {
  return typeof e == "string";
}
function gn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Ke(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function gt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function ya(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ue(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function tl(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const Qt = "abilityRollConfig", nl = [
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
], _a = 20, Aa = 20, Um = [10, 40, 65, 99];
function al() {
  return {
    schemaVersion: 1,
    rolls: [rl(1)]
  };
}
function rl(e) {
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
function ol(e) {
  return br(
    e.getFlag(d, Qt)
  );
}
function Gm(e) {
  return ol(e) ?? al();
}
async function jm(e, t) {
  const n = br(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, Qt, n), n;
}
async function Vm(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, Qt)
    );
    return;
  }
  await e.setFlag(d, Qt, null);
}
function br(e) {
  if (!ze(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, _a).map((a, r) => Qm(a, r, t)).filter((a) => a !== null)
  };
}
function Hm(e, t) {
  const n = ol(t);
  return n ? Wm(n, Km(e)) : [];
}
function Wm(e, t) {
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
function Km(e) {
  const t = ze(e.system) ? e.system : {}, n = t.NEX ?? t.nex, a = ze(n) ? n.value : n, r = typeof a == "number" ? a : Number(a);
  return Number.isFinite(r) ? sl(r) : 0;
}
function il(e) {
  return nl.find((t) => t.value === e)?.label ?? e;
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
  if (!ze(e)) return null;
  const a = `roll-${t + 1}`, r = af(nf(e.id, a), n), o = ef(e.intent), s = Zm(e.formula);
  return !o || !s ? null : {
    id: r,
    label: hn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? rf(e.damageType) : null,
    formula: s
  };
}
function Zm(e) {
  if (!ze(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: hn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, Aa).map(Jm).filter((a) => a !== null) : [];
  t.sort((a, r) => a.minNex - r.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const a of t) n.set(a.minNex, a);
  return {
    mode: "nex",
    resolution: tf(e.resolution),
    steps: [...n.values()]
  };
}
function Jm(e) {
  if (!ze(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: sl(t),
    formula: hn(e.formula)
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
function af(e, t) {
  let n = e, a = 2;
  for (; t.has(n); )
    n = `${e}-${a}`, a += 1;
  return t.add(n), n;
}
function sl(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function hn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function rf(e) {
  const t = hn(e);
  return t.length > 0 ? t : null;
}
function ze(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const yr = "data-paranormal-toolkit-ability-roll-id";
function of(e) {
  if (!ll(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = le(e.actorUuid), n = le(e.itemUuid), a = le(e.abilityName);
  if (!t) return null;
  const r = e.rolls.map(sf).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: a || "Habilidade",
    rolls: r,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: Un(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: Un(e.resourceBefore),
    resourceAfter: Un(e.resourceAfter)
  };
}
function sf(e) {
  if (!ll(e)) return null;
  const t = le(e.id), n = le(e.sourceRollId), a = le(e.label), r = le(e.formula), o = lf(e.intent);
  if (!t || !n || !a || !r || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: a,
    formula: r,
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
function Un(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function ll(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const ko = "paranormalToolkitAbilityRollBound";
let $o = !1;
function uf() {
  if ($o) return;
  $o = !0;
  const e = (t, n) => {
    df(t, Xt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function df(e, t) {
  if (!t) return 0;
  const n = `[${yr}]`, a = Af(t, n);
  let r = 0;
  for (const o of a)
    o.dataset[ko] !== "true" && (o.dataset[ko] = "true", o.addEventListener("click", () => {
      mf(e, o);
    }), r += 1);
  return r;
}
async function mf(e, t) {
  const n = t.getAttribute(yr)?.trim();
  if (!n) return;
  const a = ff(e), r = a?.rolls.find((l) => l.id === n);
  if (!a || !r) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await pf(a.actorUuid);
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
  Eo(t, !0);
  try {
    const l = new s(
      r.formula,
      hf(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: yf(a.abilityName, r)
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
      if (wo(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, r = game.actors?.get?.(n);
  return wo(r) ? r : null;
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
      <strong>${zn(e)}</strong>
      <span>${zn(t.label)}</span>
      <small>${zn(n.join(" · "))}</small>
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
      return e.damageType ? `Dano · ${il(e.damageType)}` : "Dano";
  }
}
function Af(e, t) {
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
function wo(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function zn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const Tf = "paranormal-toolkit-chat-message--full-width-card", Co = ".paranormal-toolkit-ability-card", So = "li.chat-message";
let Io = !1;
function Rf() {
  if (Io) return;
  Io = !0;
  const e = Hooks, t = (n, a) => {
    Lo(Xt(a));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Lo(document);
}
function Lo(e) {
  if (!e) return 0;
  const t = _r(e), n = kf(t), a = /* @__PURE__ */ new Set();
  for (const r of n) {
    const o = $f(t, r);
    o?.classList && a.add(o);
  }
  for (const r of a)
    r.classList?.add(Tf);
  return a.size;
}
function kf(e) {
  const t = [];
  e.matches?.(Co) && t.push(e);
  const n = e.querySelectorAll?.(Co);
  if (!n) return t;
  for (const a of Array.from(n)) {
    const r = _r(a);
    t.includes(r) || t.push(r);
  }
  return t;
}
function $f(e, t) {
  if (e.matches?.(So)) return e;
  const n = t.closest?.(So);
  return n ? _r(n) : null;
}
function _r(e) {
  return e && typeof e == "object" ? e : {};
}
function Ef(e) {
  const t = wf(e.cost), n = Cf(e.currentResource), a = t > 0 && !e.passive, r = n >= t;
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
function wf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Cf(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Sf } = foundry.applications.api;
class mt extends Sf {
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
          src="${If(this.model.header.image)}"
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
function If(e) {
  return z(e);
}
function Lf(e, t) {
  const n = Mf(t.system), a = Zt(n.activation), r = Nf(a), o = Df();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Of(t),
    activation: a,
    activationLabel: xf(a),
    description: Zt(n.description),
    chatDescription: vf(
      n.chatDescription,
      n.description
    ),
    cost: r ? 0 : Pf(n.cost),
    resource: o,
    passive: r,
    rolls: Hm(e, t)
  };
}
function vf(e, t) {
  const n = Zt(e);
  return n.trim().length > 0 ? n : Zt(t);
}
function Df() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function xf(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, a = Ff()?.(t) ?? t;
  return a === t ? e : a;
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
function Zt(e) {
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
  async publish(t, n, a) {
    const r = await Vf(n), o = Uf({
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
    }, c = jf(t.message);
    if (Vs() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function Uf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, a = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", r = zf(e.rolls), o = Gf(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${Ta(e.abilityImage)}" alt="">
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
function zf(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const a = `paranormal-toolkit-ability-card__roll--${n.intent}`, r = qf(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${a}"
          ${yr}="${Ta(n.id)}"
          title="${Ta(n.formula)}"
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
function qf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${il(e.damageType)}` : "Dano";
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
function Ta(e) {
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
  constructor(t, n, a = new Bf()) {
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
    if (!Yf(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const a = Lf(n, t.item), r = this.readCurrentResource(a);
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
function Yf(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const vo = 1e3;
class Xf {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Kf(t, n), this.strategy = new el(
      (a) => this.handleItemUsed(a)
    );
  }
  register() {
    this.strategy.register(), Rf(), uf(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (ga().executionMode === "disabled" || !Zf(t.item)) return;
    const n = Jf(t);
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
    return n !== void 0 && Date.now() - n < vo;
  }
  pruneRecentExecutions() {
    const t = Date.now() - vo;
    for (const [n, a] of this.recentExecutions)
      a < t && this.recentExecutions.delete(n);
  }
}
function Qf(e, t) {
  const n = new Xf(e, t);
  return n.register(), n;
}
function Zf(e) {
  if (e.type !== "ability") return !1;
  const t = lr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function Jf(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let Do = !1, qn = !1, Gn = !1, xt = null;
const ep = 1e3, tp = 750, np = 1e3;
function ap(e) {
  Do || (Hooks.on("combatTurnChange", (t) => {
    op(e, xo(t));
  }), Hooks.on("deleteCombat", (t) => {
    ip(e, xo(t));
  }), Do = !0, rp(e));
}
function rp(e) {
  bn() && (qn || (qn = !0, globalThis.setTimeout(() => {
    qn = !1, Ar(e, "ready");
  }, ep)));
}
function op(e, t) {
  bn() && t && (xt && globalThis.clearTimeout(xt), xt = globalThis.setTimeout(() => {
    xt = null, Ar(e, "combat-turn-change", t);
  }, tp));
}
function ip(e, t) {
  bn() && t && (Gn || (Gn = !0, globalThis.setTimeout(() => {
    Gn = !1, Ar(e, "combat-deleted", t);
  }, np)));
}
async function Ar(e, t, n) {
  if (bn())
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
function bn() {
  return game.user?.isGM === !0;
}
function xo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const cl = {
  enabled: "dice.animations.enabled"
};
function sp() {
  game.settings.register(d, cl.enabled, {
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
    enabled: game.settings.get(d, cl.enabled) === !0
  };
}
const yn = "chatCard", No = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, cp = `.${i}__title`, ul = `.${i}__header`, up = `.${i}__roll-card`, dp = `.${i}__roll-meta`, mp = `.${i}__roll-meta-pill`, Tr = `.${i}__resistance`, fp = `.${i}__resistance-header`, dl = `.${i}__resistance-description`, _n = `.${i}__resistance-roll-button`, ml = `.${i}__resistance-roll-result`, Po = `${i}__resistance-content`, fl = `.${i}__workflow-section`, pl = `.${i}__workflow-roll`, Rr = `${i}__workflow-roll--dice-open`, kr = `.${i}__workflow-roll-formula`, $r = `${i}__workflow-roll-formula--toggle`, An = `.${i}__workflow-dice-tray`, pp = `.${i}__roll-detail-toggle`, gp = `.${i}__roll-detail-list`, hp = `.${i}__ritual-element-badge`, bp = `.${i}__ritual-metadata`, yp = "casting-backlash", _p = "data-paranormal-toolkit-action-section", Ap = "data-paranormal-toolkit-prompt-id", Tp = "data-paranormal-toolkit-pending-id", Mo = "data-paranormal-toolkit-casting-backlash-enhanced", Oo = `.${i}`, Rp = `.${i}__workflow-section--casting`, kp = `.${i}__workflow-section-header`, $p = `.${i}__workflow-notes`, Ep = `[${_p}="${yp}"]`, Fo = `${i}__workflow-section-title-row`, wp = `${i}__workflow-section-header--casting-backlash`, gl = `${i}__casting-backlash-button`;
function Cp(e) {
  for (const t of Sp(e))
    Ip(t), Np(t);
}
function Sp(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Oo) && t.add(e);
  for (const n of e.querySelectorAll(Oo))
    t.add(n);
  return Array.from(t);
}
function Ip(e) {
  const t = e.querySelector(Ep);
  if (!t) return;
  const n = Lp(t);
  if (!n) return;
  const a = e.querySelector(`${Rp} ${kp}`);
  a && (a.classList.add(wp), vp(a), Dp(n), a.append(n), t.remove());
}
function Lp(e) {
  return e.querySelector(
    `button[${Tp}], button[${Ap}]`
  );
}
function vp(e) {
  const t = e.querySelector(`:scope > .${Fo}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Fo);
  const a = Array.from(e.childNodes);
  e.prepend(n);
  for (const r of a)
    r !== n && (r instanceof HTMLButtonElement && r.classList.contains(gl) || n.append(r));
  return n;
}
function Dp(e) {
  if (e.getAttribute(Mo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = xp(t, e.disabled);
  e.classList.add(gl), e.setAttribute(Mo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
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
  for (const t of Array.from(e.querySelectorAll(fl)))
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
function hl(e) {
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
class bl {
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
      const g = zp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = Bp(m.damageType);
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
          label: m.label ?? hl(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: Bo(k.finalDamage, g.amount),
          blocked: Bo(k.blocked, 0),
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
    label: t.label ?? hl(n),
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
function Bo(e, t) {
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
class Er {
  async rollResistance(t) {
    const n = await Hp(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? $e(t.skill),
      roll: n,
      formula: Kp(n),
      total: Yp(n),
      diceBreakdown: Xp(n)
    };
  }
  getSkillLabel(t) {
    return $e(t);
  }
}
async function Vp(e, t) {
  return new Er().rollResistance({ actor: e, skill: t });
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
async function Hp(e, t) {
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
  return Wp(a);
}
function Wp(e) {
  return Uo(e) ? e : Array.isArray(e) ? e.find(Uo) ?? null : null;
}
function Uo(e) {
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
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function Qp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class yl {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class _l {
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
function Zp(e, t) {
  const n = og(e?.rounds);
  if (!n)
    return zo(null);
  const a = e?.anchor ?? Al(t);
  if (!a)
    return {
      ...zo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Jp(),
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
function Al(e) {
  const t = ig();
  if (!t?.id || !Tl(t.round)) return null;
  const n = ag(t), a = eg(e, n) ?? ng(t), r = ie(a?.id), o = lg(a?.initiative), s = tg(t, a, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: r,
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
function zo(e) {
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
  return e?.id ? t.find((n) => rg(n) === e.id) ?? null : null;
}
function tg(e, t, n) {
  const a = ie(t?.id);
  if (a) {
    const r = n.findIndex((o) => o.id === a);
    if (r >= 0) return r;
  }
  return cg(e.turn) ? e.turn : null;
}
function ng(e) {
  return Gt(e.combatant) ? e.combatant : null;
}
function ag(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Gt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Gt);
    const a = t.values;
    if (typeof a == "function")
      return Array.from(a.call(t)).filter(Gt);
  }
  return [];
}
function rg(e) {
  return ie(e.actor?.id) ?? ie(e.actorId) ?? ie(e.token?.actor?.id) ?? ie(e.token?.actorId) ?? ie(e.document?.actor?.id) ?? ie(e.document?.actorId);
}
function og(e) {
  return Tl(e) ? Math.trunc(e) : null;
}
function ig() {
  return game.combat ?? null;
}
function sg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Gt(e) {
  return !!(e && typeof e == "object");
}
function ie(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function lg(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Tl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function cg(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Rl {
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
    if (!_g(a))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const r = n.value, o = Zp(t.duration, a), s = ug(r, t, o), c = t.refreshExisting ?? !0 ? Ag(a, r.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(qo(a, r, c.id ?? null, !1, !0, o));
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
      return y(qo(a, r, m, !0, !1, o));
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
    const a = this.resolveCanonicalConditionId(t.conditionId), r = $l(n, a);
    let o = 0;
    try {
      for (const s of r)
        await Go(n, s) === "deleted" && (o += 1);
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
    const n = kg(), a = [];
    let r = 0, o = 0;
    for (const s of n) {
      const l = wr(s);
      r += l.length;
      for (const c of l) {
        if (!fg(c, t)) continue;
        const u = kl(c);
        try {
          await Go(s, c) === "deleted" && (o += 1);
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
function ug(e, t, n) {
  const a = {
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
    changes: e.changes.map((r) => ({ ...r })),
    duration: dg(n.duration),
    start: mg(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: a
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
function qo(e, t, n, a, r, o) {
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
function fg(e, t) {
  const n = kl(e);
  if (!n.conditionId || !pg(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const a = vg();
  return n.durationMode === "combatantTurn" || gg(n) ? bg(n, a) : hg(e) || !a?.id || n.combatId && n.combatId !== a.id ? !0 : !Y(n.startRound) || !Y(n.requestedRounds) || !Y(a.round) ? !1 : a.round >= n.startRound + n.requestedRounds;
}
function pg(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Y(e.requestedRounds);
}
function gg(e) {
  return !!(e.combatDurationApplied && Y(e.requestedRounds) && Y(e.startRound) && (e.startCombatantId || Jt(e.startTurn)));
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
  const a = yg(t);
  return e.startCombatantId ? a === e.startCombatantId : Jt(e.startTurn) && Jt(t.turn) ? t.turn === e.startTurn : !1;
}
function yg(e) {
  return Me(e.combatant?.id);
}
function kl(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: jt(e, "conditionId"),
    requestedRounds: jo(e, "requestedRounds") ?? lt(t.value) ?? lt(t.rounds),
    combatDurationApplied: jn(e, "combatDurationApplied"),
    combatId: jt(e, "combatId") ?? Me(n.combat) ?? Me(t.combat),
    startCombatantId: jt(e, "startCombatantId") ?? Me(n.combatant),
    startInitiative: Cg(e, "startInitiative") ?? El(n.initiative),
    startRound: jo(e, "startRound") ?? lt(n.round) ?? lt(t.startRound),
    startTurn: wg(e, "startTurn") ?? Ra(n.turn) ?? Ra(t.startTurn),
    expiryEvent: Sg(e, "expiryEvent") ?? wl(t.expiry),
    durationMode: Ig(e, "durationMode"),
    deleteOnExpire: jn(e, "deleteOnExpire"),
    expiresWithCombat: jn(e, "expiresWithCombat")
  };
}
function _g(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Ag(e, t) {
  return $l(e, t)[0] ?? null;
}
function $l(e, t) {
  return wr(e).filter((n) => Eg(n) === t);
}
async function Go(e, t) {
  const n = t.id ?? null, a = n ? Tg(e, n) : t;
  if (!a) return "missing";
  try {
    return await Promise.resolve(a.delete?.()), "deleted";
  } catch (r) {
    if (Rg(r)) return "missing";
    throw r;
  }
}
function Tg(e, t) {
  return wr(e).find((n) => n.id === t) ?? null;
}
function Rg(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function kg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Nt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Nt(e, n);
  });
  for (const n of $g())
    Nt(e, n.actor), Nt(e, n.document?.actor);
  return Array.from(e.values());
}
function Nt(e, t) {
  if (!Lg(t)) return;
  const a = Me(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(a, t);
}
function $g() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function wr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Eg(e) {
  return jt(e, "conditionId");
}
function jt(e, t) {
  return Me(Ce(e, t));
}
function jo(e, t) {
  return lt(Ce(e, t));
}
function wg(e, t) {
  return Ra(Ce(e, t));
}
function Cg(e, t) {
  return El(Ce(e, t));
}
function Sg(e, t) {
  return wl(Ce(e, t));
}
function Ig(e, t) {
  const n = Ce(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function jn(e, t) {
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
function Me(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function lt(e) {
  return Y(e) ? Math.trunc(e) : null;
}
function Ra(e) {
  return Jt(e) ? Math.trunc(e) : null;
}
function El(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function wl(e) {
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
function Jt(e) {
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
}), ah = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), rh = T({
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
  gh
];
class bh {
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
    return Array.from(this.definitions.values()).map(Vo);
  }
  get(t) {
    const n = this.lookup.get(Ho(t)), a = n ? this.definitions.get(n) : null;
    return a ? y(Vo(a)) : p({
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
function Cl() {
  return new bh(hh);
}
function Vo(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Ho(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function qe(e) {
  return e.applyOnResistance ?? "failure";
}
function Sl(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Il(e, t) {
  const n = qe(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Ll(e) {
  const t = qe(e);
  return t === "failure" || t === "success";
}
function yh(e, t, n, a) {
  const r = e.filter((c) => Il(c, t));
  if (r.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? r.filter((c) => qe(c) === t) : [], s = o.length > 0 ? o : r;
  if (s.length === 1) return s[0] ?? null;
  const l = a(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => a(u) === l)) ?? s[0] ?? null : s[0] ?? null;
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
  return Dl(e, _h, !1);
}
function Rh(e) {
  return Dl(e, Ah, !e.allowsSuccessfulResistance);
}
function Ye(e) {
  return e.kind === "waiting-resistance";
}
function vl(e) {
  return e.kind === "resisted";
}
function Dl(e, t, n) {
  const a = { ...t, ...e.labels };
  return e.alreadyApplied ? ve("applied", !1, a.applied, a.appliedCompact, null) : e.unavailable ? ve("unavailable", !1, a.unavailable, a.unavailableCompact, a.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || fn(e.resistanceGateMode, e.resistanceState) ? ve(
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
const ct = "data-paranormal-toolkit-prompt-id", kh = "data-paranormal-toolkit-resistance-roll-result", $h = "Conjuração DT";
function Eh(e) {
  const t = e.querySelector(_n)?.getAttribute(kh), n = ht(t);
  if (n !== null) return n;
  const a = e.querySelector(ml)?.textContent ?? null, r = a ? /=\s*(-?\d+)\s*$/u.exec(a) : null;
  return ht(r?.[1] ?? null);
}
function Cr(e) {
  const t = xl(e), n = Ih(t);
  if (n !== null) return n;
  const a = Sh(t);
  return a !== null ? a : Lh(e);
}
function wh(e) {
  const t = xl(e);
  return t ? {
    actorId: Vn(t.actorId),
    itemId: Vn(t.itemId),
    itemName: Vn(t.itemName)
  } : null;
}
function Ch(e) {
  const t = e.getAttribute(ct);
  if (!t) return null;
  const n = Nl(e), a = Pl(n), s = (Array.isArray(a?.prompts) ? a.prompts : []).find((l) => Tn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function de(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function ka(e) {
  return de(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Sh(e) {
  const t = Dh(e);
  return t.length === 0 ? null : ht(xh(t, $h));
}
function Ih(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const a = game.actors?.get?.(t);
  return !a || typeof a != "object" ? null : Wo(a, ["system", "ritual", "DT"]) ?? Wo(a, ["system", "ritual", "dt"]);
}
function Lh(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((a) => a.textContent).find((a) => typeof a == "string" && a.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return ht(n?.[1] ?? null);
}
function xl(e) {
  const t = vh(e);
  if (!t) return null;
  const n = Nl(e), a = Pl(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => Tn(o) ? o.pendingId === t : !1) ?? null;
}
function vh(e) {
  return (e.closest(`[${ct}]`) ?? e.querySelector(`[${ct}]`) ?? e.parentElement?.querySelector(`[${ct}]`) ?? null)?.getAttribute(ct) ?? null;
}
function Nl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return Nh(r) ? r : null;
}
function Pl(e) {
  const t = e?.getFlag?.(d, yn);
  return Tn(t) ? t : null;
}
function Dh(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function xh(e, t) {
  const n = `${t}:`;
  for (const a of e) {
    if (!a.startsWith(n)) continue;
    const r = a.slice(n.length).trim();
    if (r.length > 0) return r;
  }
  return null;
}
function Wo(e, t) {
  let n = e;
  for (const a of t) {
    if (!Tn(n)) return null;
    n = n[a];
  }
  return typeof n == "number" ? Math.trunc(n) : ht(typeof n == "string" ? n : null);
}
function ht(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Nh(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Tn(e) {
  return !!(e && typeof e == "object");
}
function Vn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Rn(e) {
  return Ml({
    hasResistance: !!e.querySelector(Tr),
    difficulty: Cr(e),
    resistanceTotal: Eh(e)
  });
}
function Ph(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Ml({
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
function Ml(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Yd(e)
  };
}
function Se() {
  return game.user?.isGM === !0;
}
function Ee() {
  return Se();
}
function Mh(e) {
  const t = fn(e.resistanceGateMode, e.resistanceState), n = Oh(e.resistanceState, e.hasDamage), a = Fh(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), r = Th({
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
    damageActionState: r,
    effectActionState: o,
    damageMode: n,
    effectMode: a,
    blocksPendingResistance: t
  };
}
function Oh(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Fh(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Sr(e) {
  const t = e.isGM ?? Ee();
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
  const a = document.createElement("strong");
  a.classList.add(`${i}__workflow-roll-total`), a.textContent = e.total === null ? "—" : String(e.total), t.append(n, a);
  const r = zh(e.formula, e.diceBreakdown ?? null);
  return r && t.append(r), t;
}
function Uh(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function zh(e, t) {
  const n = qh(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${i}__workflow-dice-tray`);
  for (const r of Gh(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), r.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function qh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function Gh(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ko(e, "highest") : n.includes("kl") ? Ko(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Ko(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
const jh = "data-paranormal-toolkit-resistance-skill", Vh = "data-paranormal-toolkit-resistance-skill-label", Hh = "data-paranormal-toolkit-roll-card-target-names", Wh = "data-paranormal-toolkit-roll-card-resistance", Kh = "data-paranormal-toolkit-roll-card-resistance-skill", Yh = "data-paranormal-toolkit-roll-card-resistance-skill-label", Ol = "pending", Ir = "success", Lr = "failure", Fl = "rolled";
function Xh(e) {
  const t = tb(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Jh(e.damageSection) : null, a = Yo(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), r = Qh(e.rollCard).map((o, s) => {
    const l = Zh(o, s), c = e.resistanceResults.get(l) ?? null, u = sb(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = Ph({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: mb(u)
    }).state, k = Yo(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Sl(_)
    ) ?? a;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: g,
      effect: k,
      assistedActions: Sr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: _,
        damage: n,
        effect: k,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!g,
        effectCanApplyOnSuccessfulResistance: k?.applyOnResistance === "success" || k?.applyOnResistance === "always",
        effectRequiresResolvedResistance: k ? Ll(k) : !1
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
function Qh(e) {
  const t = e.getAttribute(Hh), n = t ? db(t) : [];
  if (n.length > 0) return n;
  const r = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = r.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && Bl(s) !== "nenhum alvo") : [];
}
function Zh(e, t) {
  return `${Bl(e)}:${t}`;
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
function Yo(e, t, n, a) {
  const r = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, r ?? null, a);
  return o ? {
    label: r && r.length > 0 ? r : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: eb(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: qe(o)
  } : null;
}
function eb(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function tb(e, t) {
  const n = ab(t), a = nb(e), r = a.description ?? rb(n)?.textContent?.trim(), o = ob(n), s = a.skill ?? o?.getAttribute(jh) ?? null, l = a.skillLabel ?? o?.getAttribute(Vh) ?? (s ? $e(s) : null);
  return !r && !s ? null : {
    description: r ?? "Resistência do alvo.",
    formula: ib(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: Cr(e)
  };
}
function nb(e) {
  return {
    description: Hn(e, Wh),
    skill: Hn(e, Kh),
    skillLabel: Hn(e, Yh)
  };
}
function ab(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function rb(e) {
  return vr(e, `.${i}__resistance-description`);
}
function ob(e) {
  return vr(e, _n);
}
function ib(e) {
  return vr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function vr(e, t) {
  for (const n of e) {
    const a = n.querySelector(t);
    if (a) return a;
  }
  return null;
}
function sb(e, t) {
  return e ? t === null ? Fl : e.total >= t ? Ir : Lr : Ol;
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
function Hn(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function Bl(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function mb(e) {
  return e === Ir ? "succeeded" : e === Lr ? "failed" : "pending";
}
function Ul(e) {
  if (!e) return null;
  const t = e.actorId ? gb(e.actorId) : null, n = t ? fb(t, e.itemId, e.itemName) : null;
  return n || pb(e.itemId, e.itemName);
}
function fb(e, t, n) {
  const a = e.items;
  if (t) {
    const o = a?.get?.(t);
    if (Oe(o)) return o;
  }
  const r = en(n);
  if (r) {
    const o = a?.find?.((s) => Oe(s) ? en(s.name) === r : !1);
    if (Oe(o)) return o;
  }
  return null;
}
function pb(e, t) {
  const n = game.items;
  if (e) {
    const r = n?.get?.(e);
    if (Oe(r)) return r;
  }
  const a = en(t);
  if (a) {
    const r = n?.find?.((o) => Oe(o) ? en(o.name) === a : !1);
    if (Oe(r)) return r;
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
function Oe(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function en(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Dr(e) {
  const t = Wn(e);
  if (!t) return null;
  const n = bb().filter((o) => Wn(yb(o)) === t).map((o) => zl(o)).find(ft) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => ft(o) && Wn(o.name) === t);
  return ft(r) ? r : null;
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
  return typeof n == "string" ? n : zl(e)?.name ?? null;
}
function zl(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ft(t)) return t;
  const n = e.document?.actor;
  return ft(n) ? n : null;
}
function ft(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Wn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function ql(e) {
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
    return `<li><strong>${Vt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", a = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", r = Ab(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Vt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Vt(e.actorName)}</strong></p>
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
function Ab(e) {
  const t = Tb(e.actor), n = e.newPV ?? t?.value ?? null, a = t?.max ?? null;
  if (n === null) return "";
  const r = a === null ? `${n}` : `${n}/${a}`;
  return `<li><strong>PV atual</strong>: ${Vt(r)}</li>`;
}
function Tb(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, a = Xo(n?.value);
  return a === null ? null : {
    value: a,
    max: Xo(n?.max)
  };
}
function Xo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Rb() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Vt(e) {
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
  await ql($b(e));
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
function Gl(e) {
  return e.mode, `✓ ${jl(e.inputAmount)} PV`;
}
function wb(e) {
  const t = jl(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function jl(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Cb {
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
    } : fn(t.resistanceGateMode, t.resistanceState) ? {
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
    return (t.isGM ?? Ee()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : fn(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
const Lb = `.${i}__actions`, xr = `.${i}__actions-title`, Ge = `.${i}__button`, vb = "data-paranormal-toolkit-action-section", Db = `${i}__button--executed`, xb = "data-paranormal-toolkit-executed-label";
function Vl(e) {
  return de(e.querySelector(xr)?.textContent);
}
function Nb(e, t) {
  const n = e.querySelector(xr);
  n && (n.textContent = t);
}
function kt(e, t) {
  const n = de(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((a) => {
    const r = a.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return de(r) === n;
  }) ?? null;
}
function Nr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Ie(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Hl(e) {
  const t = Pb(e.difficulty);
  if (t === null) return null;
  const n = Qo(e.skillLabel) ?? "Resistência", a = Qo(e.description), r = Mb(a, n), o = Ob(r, t);
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
function Qo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Mb(e, t) {
  if (!e) return null;
  const n = Zo(e), a = Zo(t);
  if (!n.startsWith(a)) return e;
  const r = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return r.length > 0 ? r : null;
}
function Ob(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const a = Number(n[1]);
  if (!Number.isFinite(a) || a !== t) return e;
  const r = e.slice(n[0].length).trim();
  return r.length > 0 ? r : null;
}
function Zo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const Pt = "data-paranormal-toolkit-prompt-id", Wl = "multiTargetResistanceResults", Kl = "multiTargetDamageApplications", Yl = "multiTargetEffectApplications";
function Fb(e) {
  const t = /* @__PURE__ */ new Map(), a = kn(e)?.[Wl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    Vb(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Bb(e, t) {
  await Pr(e, Wl, t.targetId, t);
}
function Ub(e) {
  const t = /* @__PURE__ */ new Map(), a = kn(e)?.[Kl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    Hb(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function zb(e, t) {
  await Pr(
    e,
    Kl,
    t.targetId,
    t
  );
}
function qb(e) {
  const t = /* @__PURE__ */ new Map(), a = kn(e)?.[Yl];
  if (!X(a)) return t;
  for (const [r, o] of Object.entries(a))
    Kb(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function Gb(e, t) {
  await Pr(
    e,
    Yl,
    t.targetId,
    t
  );
}
function jb(e) {
  const t = kn(e);
  return t ? {
    actorId: Kn(t.actorId),
    itemId: Kn(t.itemId),
    itemName: Kn(t.itemName)
  } : null;
}
async function Pr(e, t, n, a) {
  const r = Xl(e);
  if (!r) return;
  const o = Ql(e), s = Zl(o);
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
  l && await Promise.resolve(o.setFlag?.(d, yn, {
    ...s,
    prompts: c
  }));
}
function kn(e) {
  const t = Xl(e);
  if (!t) return null;
  const n = Ql(e), a = Zl(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => X(o) ? o.pendingId === t : !1) ?? null;
}
function Xl(e) {
  return (e.closest(`[${Pt}]`) ?? e.querySelector(`[${Pt}]`) ?? e.parentElement?.querySelector(`[${Pt}]`) ?? null)?.getAttribute(Pt) ?? null;
}
function Ql(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return Yb(r) ? r : null;
}
function Zl(e) {
  const t = e?.getFlag?.(d, yn);
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
function Kn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Yb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function X(e) {
  return !!(e && typeof e == "object");
}
const Xb = "data-paranormal-toolkit-resistance-skill", Qb = "data-paranormal-toolkit-resistance-skill-label", $a = "data-paranormal-toolkit-multi-target-section", Mr = "data-paranormal-toolkit-multi-target-damage-info", Jl = "data-paranormal-toolkit-multi-target-effect-info", ec = "data-paranormal-toolkit-multi-target-toggle", tc = "data-paranormal-toolkit-multi-target-details", V = "data-paranormal-toolkit-multi-target-target", Zb = "data-paranormal-toolkit-multi-target-state", Ea = "data-paranormal-toolkit-multi-target-roll-total", wa = "data-paranormal-toolkit-multi-target-roll-formula", Ht = "data-paranormal-toolkit-multi-target-roll-dice", Ca = "data-paranormal-toolkit-multi-target-roll-skill", Sa = "data-paranormal-toolkit-multi-target-roll-skill-label", Ia = "data-paranormal-toolkit-multi-target-roll-target-name", La = "data-paranormal-toolkit-multi-target-roll-rolled-at", va = "data-paranormal-toolkit-multi-target-damage-mode", Da = "data-paranormal-toolkit-multi-target-damage-input-amount", Jo = "data-paranormal-toolkit-multi-target-damage-final-amount", ei = "data-paranormal-toolkit-multi-target-damage-blocked", xa = "data-paranormal-toolkit-multi-target-damage-target-name", Na = "data-paranormal-toolkit-multi-target-damage-applied-at", Pa = "data-paranormal-toolkit-multi-target-effect-condition-id", Ma = "data-paranormal-toolkit-multi-target-effect-condition-label", Oa = "data-paranormal-toolkit-multi-target-effect-effect-id", Fa = "data-paranormal-toolkit-multi-target-effect-created", Ba = "data-paranormal-toolkit-multi-target-effect-refreshed", Ua = "data-paranormal-toolkit-multi-target-effect-target-name", za = "data-paranormal-toolkit-multi-target-effect-applied-at", Jb = new Rl(Cl()), ey = new yl(new bl()), ty = new _l(new Er()), ny = new Ib(ty), ay = new Cb(ey), ry = new Sb(Jb), oy = Ol, Xe = Ir, $t = Lr, iy = Fl;
function sy(e) {
  const t = nc(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), hy(e);
  const n = by(e.rollCard, t), a = yy(e.rollCard, t);
  !n && a && e_(e.rollCard, a, e.effectSection);
  const r = $y(e.rollCard);
  return oc(r, t), Qy(
    e.rollCard,
    r,
    _y(e.rollCard, {
      damageInfo: n,
      effectInfo: a,
      effectSection: e.effectSection
    })
  ), n && a && t_(e.rollCard, a, r), !0;
}
function nc(e) {
  return Xh({
    ...e,
    resistanceResults: uy(e.rollCard),
    damageApplications: dy(e.rollCard),
    effectApplications: my(e.rollCard),
    resolveTargetConditionApplication: ly,
    resistanceGateMode: Fr()
  });
}
function ly(e, t, n) {
  const a = jb(e), r = Ul(a);
  if (!r) return null;
  const o = Tt(r);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = cy(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function cy(e, t, n) {
  const a = yh(
    e,
    n,
    t,
    Yn
  );
  if (a) return a;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const r = Yn(t);
  return r ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => Yn(s) === r)) ?? null : null;
}
function uy(e) {
  const t = Fb(e);
  for (const [n, a] of gy(e))
    t.set(n, a);
  return t;
}
function dy(e) {
  const t = Ub(e);
  for (const [n, a] of py(e))
    t.set(n, a);
  return t;
}
function my(e) {
  const t = qb(e);
  for (const [n, a] of fy(e))
    t.set(n, a);
  return t;
}
function fy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = n.getAttribute(Pa), o = n.getAttribute(Ma), s = n.getAttribute(Oa), l = ai(n.getAttribute(Fa)), c = ai(n.getAttribute(Ba)), u = n.getAttribute(Ua), m = n.getAttribute(za);
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
function py(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = n.getAttribute(va), o = gc(n.getAttribute(Da)), s = n.getAttribute(xa), l = n.getAttribute(Na);
    !a || !r_(r) || o === null || !s || !l || t.set(a, {
      targetId: a,
      targetName: s,
      mode: r,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function gy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${V}]`)) {
    const a = n.getAttribute(V), r = gc(n.getAttribute(Ea)), o = n.getAttribute(wa), s = n.getAttribute(Ca), l = n.getAttribute(Sa), c = n.getAttribute(Ia), u = n.getAttribute(La);
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
function hy(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function by(e, t) {
  if (!t.damage)
    return ac(e)?.remove(), null;
  const n = Ay(e);
  return Ty(n, t.damage), ky(e, n), n;
}
function yy(e, t) {
  if (!t.effect)
    return pc(e)?.remove(), null;
  const n = Zy(e);
  return Jy(n, t.effect), n;
}
function _y(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : kt(e, "Conjuração");
}
function Ay(e) {
  const t = ac(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Mr, "true"), n;
}
function ac(e) {
  return e.querySelector(`[${Mr}="true"]`);
}
function Ty(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const a = document.createElement("strong");
  if (a.textContent = "Dano", n.append(a), e.append(n), t.typeLabel) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-section-description`), r.textContent = t.typeLabel, e.append(r);
  }
  e.append(rc(t.formula, t.total, t.diceBreakdown));
}
function rc(e, t, n, a = !1) {
  const r = Bh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Ry(r, a), r;
}
function Ry(e, t) {
  const n = e.querySelector(An), a = e.querySelector(kr);
  if (!n || !a) return;
  e.classList.toggle(Rr, t), n.hidden = !t, a.classList.add($r), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-expanded", t ? "true" : "false"), a.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", a.setAttribute("aria-label", a.title);
  const r = a.querySelector("i") ?? document.createElement("i");
  r.classList.add("fa-solid"), r.classList.toggle("fa-chevron-down", !t), r.classList.toggle("fa-chevron-up", t), r.setAttribute("aria-hidden", "true"), r.parentElement || a.append(r);
}
function ky(e, t) {
  const n = kt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function $y(e) {
  const t = e.querySelector(`[${$a}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute($a, "true"), n;
}
function oc(e, t) {
  const n = Ey(e), a = Cy(t.resistance), r = [wy(t)];
  a && r.push(a), r.push(Ly(t, n)), e.replaceChildren(...r);
}
function Ey(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${V}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(V)).filter(a_)
  );
}
function wy(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const a = document.createElement("span");
  return a.classList.add(`${i}__targets-status`), a.textContent = Iy(e.targets), t.append(n, a), t;
}
function Cy(e) {
  const t = Hl({
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
  const a = document.createElement("strong");
  a.classList.add(`${i}__resistance-label-difficulty`), a.textContent = t.difficultyLabel;
  const r = [n, document.createTextNode(" · "), a];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${i}__resistance-label-effect`), o.textContent = t.description, r.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...r);
}
function Iy(e) {
  const t = e.length, n = e.filter((l) => l.state === $t).length, a = e.filter((l) => l.state === Xe).length, r = e.filter((l) => l.state === oy).length, o = e.filter((l) => l.state === iy).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), a > 0 && s.push(`${a} ${a === 1 ? "sucesso" : "sucessos"}`), r > 0 && s.push(`${r} ${r === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Ly(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const a of e.targets)
    n.append(vy(a, e, t.has(a.id)));
  return n;
}
function vy(e, t, n) {
  const a = document.createElement("article");
  a.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && a.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && a.classList.add(`${i}__target-row--effect-applied`), a.setAttribute(V, e.id), a.setAttribute(Zb, e.state), a.setAttribute("aria-expanded", n ? "true" : "false"), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), ic(a, e.resistanceResult), sc(a, e.damageApplication), lc(a, e.effectApplication);
  const r = Dy(e, t, a), o = Wy(e, t);
  return o.hidden = !n, a.addEventListener("click", (s) => {
    ni(s.target) || ti(a);
  }), a.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || ni(s.target) || (s.preventDefault(), ti(a));
  }), a.append(r, o), a;
}
function ic(e, t) {
  if (!t) {
    e.removeAttribute(Ea), e.removeAttribute(wa), e.removeAttribute(Ht), e.removeAttribute(Ca), e.removeAttribute(Sa), e.removeAttribute(Ia), e.removeAttribute(La);
    return;
  }
  e.setAttribute(Ea, String(t.total)), e.setAttribute(wa, t.formula), e.setAttribute(Ca, t.skill), e.setAttribute(Sa, t.skillLabel), e.setAttribute(Ia, t.targetName), e.setAttribute(La, t.rolledAt), t.diceBreakdown ? e.setAttribute(Ht, t.diceBreakdown) : e.removeAttribute(Ht);
}
function sc(e, t) {
  if (!t) {
    e.removeAttribute(va), e.removeAttribute(Da), e.removeAttribute(Jo), e.removeAttribute(ei), e.removeAttribute(xa), e.removeAttribute(Na);
    return;
  }
  e.setAttribute(va, t.mode), e.setAttribute(Da, String(t.inputAmount)), e.removeAttribute(Jo), e.removeAttribute(ei), e.setAttribute(xa, t.targetName), e.setAttribute(Na, t.appliedAt);
}
function lc(e, t) {
  if (!t) {
    e.removeAttribute(Pa), e.removeAttribute(Ma), e.removeAttribute(Oa), e.removeAttribute(Fa), e.removeAttribute(Ba), e.removeAttribute(Ua), e.removeAttribute(za);
    return;
  }
  e.setAttribute(Pa, t.conditionId), e.setAttribute(Ma, t.conditionLabel), e.setAttribute(Oa, t.effectId ?? ""), e.setAttribute(Fa, String(t.created)), e.setAttribute(Ba, String(t.refreshed)), e.setAttribute(Ua, t.targetName), e.setAttribute(za, t.appliedAt);
}
function Dy(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary`);
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary-main`);
  const o = xy(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Ny(e, t.resistance);
  Fy(l, n, e, t);
  const c = Hy(n);
  r.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), mc(u, [
    cc(e, t, "compact"),
    dc(e, t, "compact")
  ]), a.append(r, u), a;
}
function xy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Ny(e, t) {
  if (!Se())
    return Py(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Oy(e, t)), t?.skill && (n.setAttribute(Xb, t.skill), n.setAttribute(Qb, t.skillLabel ?? $e(t.skill))), !t?.skill)
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
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === Xe ? "✓" : e.state === $t ? "✕" : "", n.append(a, r), n;
}
function Py(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", My(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${i}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === Xe ? "✓" : e.state === $t ? "✕" : "", n.append(a, r), n;
}
function My(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const a = e.state === Xe ? "sucesso" : e.state === $t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}.`;
}
function Oy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const a = e.state === Xe ? "sucesso" : e.state === $t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}. Rolar novamente`;
}
function Fy(e, t, n, a) {
  !(e instanceof HTMLButtonElement) || !Se() || e.addEventListener("click", (r) => {
    r.stopPropagation(), By(t, e, n, a);
  });
}
async function By(e, t, n, a) {
  if (!Se()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const r = a.resistance, o = r?.skill, s = r?.skillLabel ?? (o ? $e(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Dr(n.name);
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
    ic(e, m);
    try {
      await Bb(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    Or(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Or(e) {
  const t = e.closest(`[${$a}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const a = nc({
    rollCard: n,
    damageSection: Uy(n) ?? kt(n, "Dano"),
    effectSection: zy(n)
  });
  a && oc(t, a);
}
function Uy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Mr) !== "true") ?? null;
}
function zy(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function qy(e) {
  return Ye(e.assistedActions.policy.damageActionState);
}
function Gy(e) {
  return Ye(e.assistedActions.policy.effectActionState);
}
function Fr() {
  try {
    return gr();
  } catch {
    return "strict";
  }
}
function cc(e, t, n) {
  if (e.damageApplication)
    return ce(
      "✓",
      Gl({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const a = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Ye(a))
    return ce(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = uc(r, t.damage);
  if (o === null)
    return ce(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = wb({ inputAmount: o, mode: r, compact: n === "compact" }), l = r === "half" ? "🛡️" : "⚡", c = r === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = ce(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${V}]`);
    g && jy(g, u, e, t);
  }), u;
}
function uc(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function jy(e, t, n, a) {
  if (n.damageApplication) return;
  if (qy(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const r = a.damage;
  if (!r) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = uc(o, r);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Dr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await ay.execute({
      actor: l,
      amount: s,
      damageType: r.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Fr(),
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
    sc(e, m);
    try {
      await zb(a.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await kb(u.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    Or(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function dc(e, t, n) {
  const a = e.assistedActions.policy.effectActionState, r = e.effect ?? t.effect;
  if (e.effectApplication)
    return ce(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!r) return null;
  if (Ye(a))
    return ce(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (vl(a))
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
    l && Vy(l, o, e, t);
  }), o;
}
async function Vy(e, t, n, a) {
  if (n.effectApplication) return;
  if (Gy(n)) {
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
  const o = Dr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await ry.execute({
      actor: o,
      conditionId: r.conditionId,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source,
      resistanceGateMode: Fr(),
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
    lc(e, c);
    try {
      await Gb(a.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Or(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function mc(e, t) {
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
function Hy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(ec, "true"), t.setAttribute("aria-hidden", "true"), fc(e, t), t;
}
function ti(e) {
  const t = e.querySelector(`[${tc}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const a = e.querySelector(`[${ec}="true"]`);
  a && fc(e, a);
}
function fc(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function ni(e) {
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
  n.classList.add(`${i}__target-details`), n.setAttribute(tc, "true");
  const a = document.createElement("div");
  a.classList.add(`${i}__target-resistance-details`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", a.append(r, o);
  const s = Ky(e, t.resistance);
  s && a.append(s);
  const l = Yy(e, t.resistance), c = Xy(e, t);
  return n.append(a, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Ky(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const a = e.state === Xe ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${a}`, n;
}
function Yy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const a = e.resistanceResult?.formula ?? t?.formula ?? "—", r = e.resistanceResult?.total ?? null, o = rc(
    a,
    r,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Xy(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), mc(n, [
    cc(e, t, "full"),
    dc(e, t, "full")
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
  const t = pc(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Jl, "true"), n;
}
function pc(e) {
  return e.querySelector(`[${Jl}="true"]`);
}
function Jy(e, t) {
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
function e_(e, t, n) {
  const a = n?.parentElement === e ? n : kt(e, "Conjuração");
  if (!a) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === a || e.insertBefore(t, a.nextElementSibling);
}
function t_(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Yn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function n_(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function a_(e) {
  return typeof e == "string" && e.length > 0;
}
function r_(e) {
  return e === "normal" || e === "half";
}
function ai(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function gc(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const ri = "data-paranormal-toolkit-card-layout-refresh-bound";
function o_(e) {
  const t = e.rollCard.querySelector(_n);
  t && t.getAttribute(ri) !== "true" && (t.setAttribute(ri, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Fe = "data-paranormal-toolkit-prompt-id", i_ = "apply-damage", s_ = "data-paranormal-toolkit-multi-target-damage-info";
function l_(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(s_) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function c_(e) {
  const t = d_(e);
  return t.find((n) => n.getAttribute(vb) === i_) ?? t.find((n) => Vl(n) === "aplicar danos") ?? null;
}
function u_(e) {
  const t = hc(e), n = oi(t);
  return n || oi(m_(e));
}
function oi(e) {
  return e.find((t) => {
    const n = Vl(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function d_(e) {
  const t = hc(e);
  return t.length > 0 ? t : Br(e);
}
function hc(e) {
  const t = g_(e);
  return t ? Br(e).filter((n) => p_(n, t)) : [];
}
function m_(e) {
  const t = bc(e);
  if (!t) return [];
  const n = f_(e, t);
  return Br(e).filter((a) => !a.closest(`.${i}__roll-card`)).filter((a) => yc(e, a)).filter((a) => !n || h_(a, n));
}
function Br(e) {
  const t = bc(e);
  return t ? Array.from(t.querySelectorAll(Lb)) : [];
}
function bc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function f_(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && yc(e, n)) ?? null;
}
function p_(e, t) {
  return e.getAttribute(Fe) === t ? !0 : Array.from(e.querySelectorAll(`[${Fe}]`)).some((n) => n.getAttribute(Fe) === t);
}
function g_(e) {
  return e.getAttribute(Fe) ?? e.querySelector(`[${Fe}]`)?.getAttribute(Fe) ?? null;
}
function yc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function h_(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function b_(e) {
  const t = _c(), n = Rn(e.rollCard).state, a = Sr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), r = a.policy.effectActionState, o = Ye(r), s = vl(r);
  return e.applied ? tt({
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
  }) : a.policy.canShowApplyEffect ? tt(o ? {
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
  }) : tt({
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
function tt(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function y_(e) {
  const { rollCard: t } = e, n = T_(), a = _c(), r = Rn(t).state, o = Sr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: a,
    resistanceState: r,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Ye(s), c = A_(e);
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
      summary: __(r)
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
function A_(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function T_() {
  try {
    return om();
  } catch {
    return "assisted";
  }
}
function _c() {
  try {
    return gr();
  } catch {
    return "strict";
  }
}
const R_ = "data-paranormal-toolkit-damage-resolution-state", ii = "data-paranormal-toolkit-damage-icon-enhanced", Ur = "data-paranormal-toolkit-damage-original-label", k_ = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, Ac = "Outra opção escolhida";
function $_(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Nb(t, "Aplicar dano"), E_(e, t);
}
function E_(e, t) {
  const n = Array.from(t.querySelectorAll(Ge)), a = li(n, "normal"), r = li(n, "half");
  if (!a || !r) {
    w_(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  ci(a, "normal"), ci(r, "half");
  const o = y_({
    rollCard: e,
    normalButtonApplied: tn(a),
    halfButtonApplied: tn(r),
    normalButtonSkipped: qa(a),
    halfButtonSkipped: qa(r)
  });
  if (!o.canShowApplyDamage) {
    di(a), di(r), mi(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), si(a, o.normalButton), si(r, o.halfButton), mi(t, o.summary.state, o.summary.message);
}
function si(e, t) {
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
    qa(t) && t.remove();
}
function tn(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(Ac);
}
function qa(e) {
  return e.textContent?.includes(Ac) ?? !1;
}
function li(e, t) {
  const n = k_[t];
  return e.find((a) => n.test(C_(a))) ?? null;
}
function C_(e) {
  return [
    e.getAttribute(Ur),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function ci(e, t) {
  if (e.getAttribute(ii) === "true") return;
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
  ), e.setAttribute(ii, "true"), e.setAttribute(Ur, n), e.setAttribute("aria-label", n), e.replaceChildren(a, Ie(n));
}
function di(e) {
  tn(e) || e.remove();
}
function S_(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function I_(e, t, n, a = "Role resistência") {
  if (!tn(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", a), e.replaceChildren(Ie(a));
      return;
    }
    e.removeAttribute("aria-disabled"), L_(e, n);
  }
}
function L_(e, t) {
  const n = e.getAttribute(Ur) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(v_(t), Ie(n)));
}
function v_(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function mi(e, t, n) {
  e.setAttribute(R_, t);
  const a = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    a?.remove();
    return;
  }
  const r = a ?? document.createElement("span");
  r.classList.add(`${i}__damage-resolution-summary`), r.textContent = n, a || e.querySelector(xr)?.after(r);
}
const bt = "data-paranormal-toolkit-effect-icon-enhanced", je = "data-paranormal-toolkit-effect-action-compacted", $n = "data-paranormal-toolkit-effect-resistance-gate", zr = "data-paranormal-toolkit-effect-section", qr = "data-paranormal-toolkit-effect-label";
function D_(e) {
  return e.querySelector(`[${zr}="true"]`);
}
function x_(e) {
  const t = P_(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? O_(), a = H_(n, e.sourceActions, t);
  return a && n.setAttribute(qr, a), F_(n, t, a), j_(e.rollCard, n, e.after ?? e.fallbackAfter), V_(e.sourceActions, n), n;
}
function N_(e, t) {
  const n = t.querySelector(Ge);
  if (!n) return;
  const a = n.textContent?.trim() ?? "", r = $c(t, n, a), o = Tc(e, n), s = b_({
    rollCard: e,
    effectLabel: r,
    applied: jr(n, a),
    effectCanApplyOnSuccessfulResistance: o ? qe(o) === "success" || qe(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Ll(o) : !1
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
  Z_(n), kc(n, s.displayLabel);
}
function P_(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ge) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ge) ?? []), a = [...t, ...n];
  return a.length === 0 ? null : M_(e.rollCard, a) ?? a[0] ?? null;
}
function M_(e, t) {
  const n = Rn(e).state, a = Sl(n), r = Rc(e);
  if (r.length === 0) return null;
  for (const o of t) {
    const s = Tc(e, o, r);
    if (s && Il(s, a)) return o;
  }
  return null;
}
function Tc(e, t, n = Rc(e)) {
  const a = Gr(t, t.textContent?.trim() ?? ""), r = ka(a);
  return r ? n.find((o) => [o.label, o.conditionId].some((s) => ka(s) === r)) ?? null : null;
}
function Rc(e) {
  const t = Ul(wh(e));
  if (!t) return [];
  const n = Tt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((a) => a.actor === "target") : [];
}
function O_() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(zr, "true"), e;
}
function F_(e, t, n) {
  e.setAttribute(zr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const a = B_(e), r = U_(a);
  r.textContent = "Efeito";
  const o = z_(e, a), s = q_(o);
  s.textContent = J_(n ?? $c(e, t, t.textContent?.trim() ?? ""));
  const l = G_(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ge)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !jr(t, c) && !W_(t, c) && kc(t, n ?? c);
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
  const a = document.createElement("div");
  return a.classList.add(`${i}__effect-section-body`), t.after(a), a;
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
    if (e.querySelector(Ge)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function H_(e, t, n) {
  const a = e.getAttribute(qr);
  if (a && a.trim().length > 0) return a.trim();
  const r = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return r || Gr(n, n.textContent?.trim() ?? "");
}
function Gr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && de(n) !== "efeito aplicado") return n;
  const a = Ch(e);
  if (a) return a;
  const r = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return r.length > 0 && de(r) !== "aplicado" ? r : null;
}
function jr(e, t) {
  return e.classList.contains(Db) || de(t).includes("aplicado");
}
function W_(e, t) {
  const n = e.getAttribute($n);
  if (n === "pending" || n === "resisted") return !0;
  const a = ka(t);
  return a.includes("resistiu") || a.includes("role resistencia");
}
function kc(e, t) {
  e.getAttribute(je) === "true" && e.getAttribute(bt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(je, "true"), e.setAttribute(bt, "true"), e.setAttribute(xb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Nr("✦", `${i}__button-icon--effect`),
    Ie("Aplicar")
  ));
}
function K_(e) {
  e.getAttribute(je) === "true" && de(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(je, "true"), e.setAttribute(bt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Nr("✓", `${i}__button-icon--effect-applied`),
    Ie("Aplicado")
  ));
}
function $c(e, t, n) {
  const a = e.getAttribute(qr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return a && a.trim().length > 0 ? a.trim() : Gr(t, n) ?? n;
}
function Y_(e) {
  jr(e, e.textContent?.trim() ?? "") || e.remove();
}
function X_(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(je), e.removeAttribute(bt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute($n, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Ie(t));
}
function Q_(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(je), e.removeAttribute(bt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute($n, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Nr("✓", `${i}__button-icon--effect-resisted`),
    Ie(t)
  );
}
function Z_(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute($n), e.removeAttribute("aria-disabled");
}
function J_(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const eA = "data-paranormal-toolkit-card-layout-normalized";
function tA(e) {
  const t = nA(e.rollCard), n = aA(t);
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
    resistance: e.querySelector(Tr),
    damageActions: c_(e),
    effectActionSource: u_(e),
    effectSection: D_(e)
  };
}
function aA(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: a,
    damageActions: r,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(eA, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = kt(t, "Conjuração"), c = rA({
    rollCard: t,
    damageSection: n,
    resistance: a,
    fallbackAfter: l
  });
  n && r && (r.parentElement !== n && n.append(r), $_(t, r));
  const u = x_({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: oA(n, c),
    fallbackAfter: l
  });
  return u && N_(t, u), u;
}
function rA(e) {
  const { rollCard: t, damageSection: n, resistance: a, fallbackAfter: r } = e;
  return a ? n ? (a.parentElement !== n && n.append(a), n) : r ? (a.parentElement === t && a.previousElementSibling === r || t.insertBefore(a, r.nextElementSibling), a) : ((a.parentElement !== t || a.previousElementSibling !== null) && t.prepend(a), a) : null;
}
function oA(e, t) {
  return e ?? t;
}
const Ec = [0, 80, 180, 400, 900, 1600, 3e3], fi = /* @__PURE__ */ new WeakSet();
function iA(e) {
  wc(e), sA(e);
}
function wc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Cc(t);
}
function sA(e) {
  if (!fi.has(e)) {
    fi.add(e);
    for (const t of Ec)
      globalThis.setTimeout(() => {
        wc(e);
      }, t);
  }
}
function Cc(e) {
  const t = tA({
    rollCard: e,
    refreshDelaysMs: Ec,
    onRefresh: () => Cc(e)
  });
  sy({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const lA = "data-paranormal-toolkit-resistance-roll-result-enhanced", pi = "data-paranormal-toolkit-resistance-original-description", cA = "data-paranormal-toolkit-resistance-skill", uA = "data-paranormal-toolkit-resistance-skill-label", dA = `${i}__resistance--without-roll-button`, mA = ["Fortitude", "Reflexos", "Vontade"];
function fA(e) {
  for (const t of Array.from(e.querySelectorAll(Tr)))
    pA(t);
  iA(e);
}
function pA(e) {
  const t = e.querySelector(fp), n = e.querySelector(dl), a = e.querySelector(_n), r = _A(a) ? a : null, o = e.querySelector(ml);
  if (!t && !n && !o && !a) return;
  e.classList.toggle(dA, !r);
  const s = yA(e, a);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!a || !a.contains(o)) && e.append(o), RA(o)), gA(e, a, n), r && (CA(r), r.parentElement !== e && e.append(r));
}
function gA(e, t, n) {
  if (!n) return;
  const a = e.closest(`.${i}__roll-card`);
  if (!a) return;
  const r = bA(n), o = Hl({
    description: r,
    skillLabel: AA(t, r),
    difficulty: Cr(a)
  });
  if (!o) {
    n.textContent = r, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  hA(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function hA(e, t) {
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
function bA(e) {
  const t = e.getAttribute(pi);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(pi, n), n;
}
function yA(e, t) {
  const n = e.querySelector(`.${Po}`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(Po), e.insertBefore(a, t?.parentElement === e ? t : e.firstChild), a;
}
function _A(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function AA(e, t) {
  const n = e?.getAttribute(uA) ?? e?.getAttribute(cA) ?? null;
  return n || TA(t);
}
function TA(e) {
  const t = gi(e);
  return mA.find((n) => t.startsWith(gi(n))) ?? null;
}
function gi(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function RA(e) {
  const t = kA(e.textContent ?? "");
  t && (e.setAttribute(lA, "true"), e.replaceChildren(wA(t)));
}
function kA(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, a, r] = t, o = n?.trim() ?? "Resistência", s = Number(r);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = $A(a ?? "");
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
  const a = SA(e);
  return a && t.append(a), t;
}
function CA(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Rn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const a = n.kind === "succeeded" ? "succeeded" : "failed", r = a === "succeeded" ? "✓" : "✕", o = a === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${a}`), e.textContent = `${n.total} ${r}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function SA(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of IA(e.diceValues, e.formula)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), n.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(n.value), t.append(a);
  }
  return t;
}
function IA(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? hi(e, "highest") : n.includes("kl") ? hi(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function hi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
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
  const a = e.closest(`.${i}`)?.querySelector(ul) ?? null, r = a?.querySelector(cp) ?? null, o = a ?? e, s = o.querySelector(hp);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = eT(t.elementTone), l.textContent = JA(t), !s) {
    if (r?.parentElement === o) {
      r.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function xA(e, t) {
  const n = NA(e);
  PA(e, n);
  const a = MA(t);
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
  const o = e.querySelector(fl);
  if (o) {
    e.insertBefore(r, o);
    return;
  }
  e.prepend(r);
}
function NA(e) {
  return e.closest(`.${i}`)?.querySelector(ul) ?? null;
}
function PA(e, t) {
  const n = [e, t].filter((a) => a !== null);
  for (const a of n)
    for (const r of Array.from(a.querySelectorAll(bp)))
      r.remove();
}
function MA(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ya(e.target)}` : null,
    e.duration ? `Duração: ${ya(e.duration)}` : null,
    e.resistance ? `Resistência: ${tl(e.resistance)}` : null
  ].filter(gn);
}
function OA(e) {
  const t = FA(e), n = jA(e), r = (t ? GA(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Vr(K(r, "element")), l = ne("op.elementChoices", s) ?? bi(Ae(o, "Elemento")) ?? bi(n.damageType), c = s ?? tT(l), u = K(r, "circle") ?? Ae(o, "Círculo"), m = WA(r) ?? Ae(o, "Alvo"), g = QA(r, "duration", "op.durationChoices") ?? Ae(o, "Duração"), _ = VA(e) ?? YA(r) ?? Ae(o, "Resistência"), k = HA(o) ?? n.cost, R = {
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
  const n = t.getFlag?.(d, yn), a = zA(n);
  if (a.length === 0) return null;
  const r = UA(e);
  if (r.size > 0) {
    const o = a.find((s) => s.pendingId && r.has(s.pendingId));
    if (o) return o;
  }
  return a.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function BA(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? hr()?.messages?.get?.(n) ?? null : null;
}
function UA(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const a of Array.from(t.querySelectorAll(`[${No}]`))) {
    const r = a.getAttribute(No)?.trim();
    r && n.add(r);
  }
  return n;
}
function zA(e) {
  if (!pn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(qA).filter((n) => n !== null) : [];
}
function qA(e) {
  return pn(e) ? {
    pendingId: qt(e.pendingId),
    actorId: qt(e.actorId),
    itemId: qt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Bm) : []
  } : null;
}
function GA(e) {
  if (!e.itemId) return null;
  const t = hr(), a = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return a || (t?.items?.get?.(e.itemId) ?? null);
}
function jA(e) {
  let t = null, n = null;
  for (const a of Array.from(e.querySelectorAll(mp))) {
    const r = Ke(a.textContent);
    if (!r) continue;
    const o = Fm(r, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(r) && (t = r);
  }
  return { cost: t, damageType: n };
}
function VA(e) {
  const t = Ke(e.querySelector(dl)?.textContent);
  return t ? tl(t) : null;
}
function Ae(e, t) {
  const n = gt(t);
  for (const a of e) {
    const r = a.indexOf(":");
    if (!(r < 0 || gt(a.slice(0, r)) !== n))
      return Ke(a.slice(r + 1));
  }
  return null;
}
function HA(e) {
  const t = Ae(e, "Custo") ?? Ae(e, "PE");
  return t || (e.map(Ke).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function WA(e) {
  const t = K(e, "target");
  if (!t) return null;
  if (t === "area")
    return KA(e) ?? ne("op.targetChoices", t) ?? "Área";
  const n = ne("op.targetChoices", t) ?? ue(t);
  return [t === "people" || t === "creatures" ? K(e, "targetQtd") : null, n].filter(gn).join(" ");
}
function KA(e) {
  const t = K(e, "area.name"), n = K(e, "area.size"), a = K(e, "area.type"), r = t ? ne("op.areaChoices", t) ?? ue(t) : null, o = a ? ne("op.areaTypeChoices", a) ?? ue(a) : null;
  return r ? n ? o ? `${r} ${n}m ${ya(o)}` : `${r} ${n}m` : r : null;
}
function YA(e) {
  const t = K(e, "skillResis"), n = K(e, "resistance");
  if (!t || !n) return null;
  const a = ne("op.skill", t) ?? ue(t), r = XA(n);
  return [a, r].filter(gn).join(" ");
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
  const a = K(e, t);
  return a ? ne(n, a) ?? ue(a) : null;
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
  ].filter(gn).join(" ");
}
function Vr(e) {
  const t = gt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function bi(e) {
  const t = Vr(e);
  return t ? ne("op.elementChoices", t) ?? ue(t) : e ? ue(e) : null;
}
function tT(e) {
  return Vr(e);
}
function ne(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, a = hr()?.i18n?.localize?.(n);
  return !a || a === n ? null : a;
}
const yi = "data-paranormal-toolkit-dice-toggle-enhanced";
function nT(e) {
  for (const t of Array.from(e.querySelectorAll(pl)))
    Sc(t);
}
function aT(e) {
  const t = Lc(e.target);
  if (!t) return;
  const n = Hr(t);
  n && (e.preventDefault(), Ic(n, t));
}
function rT(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Lc(e.target);
  if (!t) return;
  const n = Hr(t);
  n && (e.preventDefault(), Ic(n, t));
}
function Sc(e) {
  const t = e.querySelector(An);
  if (!t) return;
  const n = e.querySelector(kr);
  if (n && n.getAttribute(yi) !== "true" && (n.setAttribute(yi, "true"), n.classList.add($r), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-chevron-down"), a.setAttribute("aria-hidden", "true"), n.append(a);
  }
}
function Ic(e, t) {
  const n = e.querySelector(An);
  if (!n) return;
  const a = !e.classList.contains(Rr);
  oT(e, t, n, a);
}
function oT(e, t, n, a) {
  e.classList.toggle(Rr, a), n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.title = a ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const r = t.querySelector("i");
  r && (r.classList.toggle("fa-chevron-down", !a), r.classList.toggle("fa-chevron-up", a));
}
function Lc(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(kr);
  if (!t) return null;
  const n = Hr(t);
  return n ? (Sc(n), t.classList.contains($r) ? t : null) : null;
}
function Hr(e) {
  const t = e.closest(pl);
  return t && t.querySelector(An) ? t : null;
}
const _i = `${d}-workflow-dice-toggle-styles`;
function iT() {
  if (document.getElementById(_i)) return;
  const e = document.createElement("style");
  e.id = _i, e.textContent = `
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
let Ai = !1, Xn = null;
function lT() {
  if (!Ai) {
    Ai = !0, iT(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ut(Xt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ut(Xt(t));
    }), Hooks.once("ready", () => {
      ut(document), cT();
    }), document.addEventListener("click", aT), document.addEventListener("keydown", rT);
    for (const e of sT)
      globalThis.setTimeout(() => ut(document), e);
  }
}
function cT() {
  Xn || !document.body || (Xn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ut(n);
  }), Xn.observe(document.body, { childList: !0, subtree: !0 }));
}
function ut(e) {
  e && (Pp(e), LA(e), fA(e), nT(e), Cp(e));
}
function uT() {
  lT();
}
const dT = "data-paranormal-toolkit-action-section", mT = "ritual-log", fT = ".paranormal-toolkit-item-use-prompt__actions", pT = ".paranormal-toolkit-item-use-prompt__actions-title", gT = [0, 100, 500, 1500];
let Ti = !1;
function hT() {
  if (Ti) return;
  const e = (t, n) => {
    Ri(AT(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Ri(document), Ti = !0;
}
function Ri(e) {
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
    if (ki(t.querySelector(pT)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => ki(o.textContent ?? "")
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
function ki(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const dt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, vc = {
  PV: "system.attributes.hp"
}, Ga = {
  PV: [dt.PV, vc.PV],
  SAN: [dt.SAN],
  PE: [dt.PE],
  PD: [dt.PD]
}, ja = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class kT {
  getResource(t, n) {
    const a = $i(t, n);
    if (!a.ok)
      return p(a.error);
    const r = a.value, o = `${r}.value`, s = `${r}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = wi(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = wi(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, a) {
    const r = $i(t, n);
    if (!r.ok)
      throw new Error(r.error.message);
    await t.update({ [`${r.value}.value`]: a });
  }
}
function $i(e, t) {
  const n = $T(e.type, t);
  if (n && Ei(e, n))
    return y(n);
  const a = Ga[t].find(
    (r) => Ei(e, r)
  );
  return a ? y(a) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ET(e, t),
    path: Ga[t].join(" | ")
  });
}
function $T(e, t) {
  return e === "threat" ? vc[t] ?? null : e === "agent" ? dt[t] : null;
}
function Ei(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof a == "number" && Number.isFinite(a);
}
function ET(e, t) {
  const n = e.type ?? "unknown", a = Ga[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${a}.`;
}
function wi(e, t, n, a, r) {
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
      const s = ja.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: r } = n, o = CT(r);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: r
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of ja.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, n);
      if (a != null)
        return { path: n, value: a };
    }
    return null;
  }
}
function CT(e) {
  if (Ci(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Ci(n))
      return n;
  }
  return null;
}
function Ci(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const ST = "dice-so-nice";
async function Dc(e) {
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
const Si = "occultism";
class xc {
  getDifficulty(t) {
    return DT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const a = await NT(t, Si);
    if (!a)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Dc(a);
    const r = OT(a);
    return {
      skill: Si,
      skillLabel: "Ocultismo",
      roll: a,
      formula: MT(a),
      total: r,
      difficulty: n,
      success: r >= n,
      diceBreakdown: FT(a)
    };
  }
}
function DT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function xT(e) {
  return new xc().rollCastingCheck(e);
}
async function NT(e, t) {
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
  return PT(a);
}
function PT(e) {
  return Ii(e) ? e : Array.isArray(e) ? e.find(Ii) ?? null : null;
}
function Ii(e) {
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
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
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
    const a = n.value, r = qT(t.ritual, a);
    return r.ok ? r.value ? y(r.value) : y({
      resource: "PE",
      amount: UT[a],
      source: "default-by-circle",
      circle: a
    }) : p(r.error);
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
    const a = n.itemPatch;
    if (!a) return Qn("missing-item-patch");
    if (t.type !== "ritual") return Qn("unsupported-item-type");
    const r = VT(a);
    return Object.keys(r).length === 0 ? Qn("empty-update") : (await t.update(r), {
      applied: !0,
      updateData: r
    });
  }
}
function VT(e) {
  const t = {};
  O(t, "name", e.name), O(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (O(t, "system.circle", n.circle), O(t, "system.element", n.element), O(t, "system.target", n.target), O(t, "system.targetQtd", n.targetQuantity), O(t, "system.execution", n.execution), O(t, "system.range", n.range), O(t, "system.duration", n.duration), O(t, "system.skillResis", n.resistanceSkill), O(t, "system.resistance", n.resistance), O(t, "system.studentForm", n.studentForm), O(t, "system.trueForm", n.trueForm)), t;
}
function O(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Qn(e) {
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
    return this.getNumber(t, ja.ritual.dt, 0);
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
class WT {
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
class KT {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = YT(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Zn(t)), y(t)) : n;
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
    return n ? Zn(n) : null;
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
    return Array.from(this.presets.values()).map(Zn);
  }
  findForItem(t) {
    return this.list().map((n) => XT(n, t)).filter((n) => n !== null).sort((n, a) => a.score - n.score || n.preset.id.localeCompare(a.preset.id));
  }
}
function YT(e) {
  return !Jn(e.id) || !Jn(e.version) || !Jn(e.label) ? p({
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
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, n.push(`itemType:${t.type}`);
  }
  for (const r of e.matchers) {
    const o = QT(r, t);
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
      const n = Li(t.name), a = e.names.map(Li).includes(n);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = ZT(t), a = n !== null && e.circles.includes(n);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Li(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ZT(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Zn(e) {
  return structuredClone(e);
}
function Jn(e) {
  return typeof e == "string" && e.length > 0;
}
function nn(e, t) {
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
async function JT(e, t, n) {
  if (!vi(e.id) || !vi(e.formula))
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
    await Dc(r);
    const l = {
      ...n.rollRequests[e.id] ?? Nc(e, t),
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
function Nc(e, t) {
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
function vi(e) {
  return typeof e == "string" && e.length > 0;
}
async function an(e, t, n, a, r) {
  switch (a) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Mt(t, n, a, r) : e.spend(t, n, r);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Mt(t, n, a, r) : e.damage(t, n, r);
    case "heal":
      return n !== "PV" ? Mt(t, n, a, r) : e.heal(t, n, r);
    case "recover":
      return n !== "SAN" ? Mt(t, n, a, r) : e.recover(t, n, r);
  }
}
function Mt(e, t, n, a) {
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
function tR(e) {
  const { step: t, context: n, transaction: a, stepIndex: r, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = nR(t, n, a, r);
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
    const s = aR(t, n, a, r);
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
function nR(e, t, n, a) {
  const r = En(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    id: Pc(t.id, "damage", a, t.damageInstances.length),
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
function aR(e, t, n, a) {
  const r = En(e.amountFrom);
  return {
    id: Pc(t.id, "healing", a, t.healingInstances.length),
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
function Pc(e, t, n, a) {
  return `${e}.${t}.${n}.${a}`;
}
function rR(e, t, n) {
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
function oR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: a, step: t, metadata: r }), Mc("before", e), Di("before", e), Di("resolve", e);
}
function iR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: a, step: t, metadata: r }), Mc("apply", e);
}
function sR(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: a, step: t, metadata: r });
}
function Mc(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t, l = lR(e, n.operation);
  l && s.emit(l, a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function Di(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: r,
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
  const { context: n, resources: a } = e, r = nn(t, n);
  return r.ok ? Oc(await a.spend(n.sourceActor, t.resource, r.value), n) : p(r.error);
}
async function mR(e, t) {
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
  }), Oc(await a.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Oc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function fR(e) {
  const { step: t, context: n, stepIndex: a, lifecycle: r, execute: o } = e, s = pR(t);
  for (const c of s.before)
    r.emit(c, n, { stepIndex: a, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    r.emit(c, n, { stepIndex: a, step: t });
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
        return fR({
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
    const r = await uR({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, a) {
    const r = Nc(t, a);
    n.rollRequests[r.id] = r, this.lifecycle.emit("beforeRoll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("before", r, n, a, t), this.lifecycle.emit("roll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("roll", r, n, a, t);
    const o = await this.runRollFormulaStep(t, n, a);
    if (!o.ok)
      return o;
    const s = n.rolls[r.id];
    return this.emitSpecificRollPhase("after", r, n, a, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: a, step: t, rollRequest: r, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, a) {
    const r = await JT(t, a, n);
    return r.ok ? y(void 0) : p({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, a) {
    const r = nn(t, n);
    if (!r.ok)
      return p({ ...r.error, stepIndex: a, step: t, context: n });
    const o = rR(t, n, r.value);
    oR({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), iR({
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
      const c = await an(this.resources, l, t.resource, t.operation, r.value), u = this.handleResourceOperationResult(c, n, a, t);
      if (!u.ok)
        return u;
      tR({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return sR({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, a) {
    const r = nn(t, n);
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
      const l = await an(this.resources, s, t.resource, t.operation, r.value), c = this.handleResourceOperationResult(l, n, a, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, a) {
    const r = await cR(this.messages);
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
    const l = hR(t, n.intent);
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
function hR(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class bR {
  emitCastStarted(t) {
    Hooks.callAll(zt.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(zt.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(zt.ritual.castFinished, t);
  }
}
class yR {
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
function Fc(e) {
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
    return Ne(this.lastContext);
  }
  async runAutomation(t, n) {
    const a = Fc(n);
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
class RR {
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
    const n = pa();
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
    const a = pa();
    if (!a.enabled)
      return;
    const r = n.notification ?? xi(n);
    a.console && this.emitConsole(t, n), a.ui && this.emitUi(t, r);
  }
  emitConsole(t, n) {
    const a = xi(n);
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
function xi(e) {
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
const wR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Bc = `${d}-inline-roll-neutralized`, CR = `${d}-inline-roll-notice`, Wr = `data-${d}-inline-roll-neutralized`, Ni = `data-${d}-inline-roll-notice`, SR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Pi(e) {
  const t = qR(e.message), n = await IR(e.message), a = LR(t);
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
  const n = Uc(t);
  return n > 0 && zc(MR(t)), { replacementCount: n };
}
function vR(e) {
  const t = DR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const a = Uc(n.content), r = t.replacementCount + a;
  return r === 0 ? { content: e, replacementCount: 0 } : (zc(n.content), { content: n.innerHTML, replacementCount: r });
}
function DR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, r) => (t += 1, NR(r.trim()))), replacementCount: t };
}
function Uc(e) {
  const t = xR(e);
  for (const n of t)
    n.replaceWith(PR(OR(n)));
  return t.length;
}
function xR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(wR))
    n.getAttribute(Wr) !== "true" && t.add(n);
  return Array.from(t);
}
function NR(e) {
  return `<span class="${Bc}" ${Wr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${GR(e)}</span>`;
}
function PR(e) {
  const t = document.createElement("span");
  return t.classList.add(Bc), t.setAttribute(Wr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function zc(e) {
  if (e.querySelector?.(`[${Ni}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(CR), t.setAttribute(Ni, "true"), t.textContent = SR, e.append(t);
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
const rn = "ritualRollConfig", on = "ritual-roll", VR = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function wn() {
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
function qc(e) {
  const t = e.getFlag(d, rn);
  return Va(t);
}
function Gc(e) {
  return qc(e) ?? wn();
}
async function HR(e, t) {
  const n = Va(t) ?? Va({
    ...wn(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, rn, n), n;
}
async function WR(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, rn));
    return;
  }
  await e.setFlag(d, rn, null);
}
function Va(e) {
  if (!Cn(e)) return null;
  const t = ak(e.intent);
  if (!t) return null;
  const n = wn();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Ha(e.damageType),
    utilityLabel: Ha(e.utilityLabel) ?? n.utilityLabel,
    note: Kr(e.note),
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
  const t = qc(e), n = jc(e);
  if (!t)
    return Mi(e, n);
  const a = tk(e, t);
  if (!a)
    return Mi(e, n);
  const r = XR(t, a), o = [
    { type: "spendRitualCost" },
    r,
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
function Mi(e, t) {
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
    id: on,
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
          amountFrom: `${on}.total`,
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
          amountFrom: `${on}.total`
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
    base: ea("Padrão", t.forms.base.formula)
  };
  return Ve(e, "discente") && (n.discente = ea("Discente", t.forms.discente.formula, 2)), Ve(e, "verdadeiro") && (n.verdadeiro = ea("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function ea(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [on]: t.trim()
    }
  };
}
function ek(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Ve(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Ve(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function tk(e, t) {
  return [
    t.forms.base.formula.trim(),
    Ve(e, "discente") ? t.forms.discente.formula.trim() : "",
    Ve(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((a) => a.length > 0) ?? null;
}
function jc(e) {
  const t = Vc(e), n = Ha(t.skillResis), a = rk(t.resistance);
  if (!n || !a) return;
  const r = ik(n), o = VR[a];
  return {
    skill: n,
    label: r,
    effect: a,
    summary: `${r} ${o}`
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
function ak(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function rk(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function ok(e) {
  const t = wn();
  return Cn(e) ? {
    base: ta(e.base),
    discente: ta(e.discente),
    verdadeiro: ta(e.verdadeiro)
  } : t.forms;
}
function ta(e) {
  return Cn(e) ? { formula: Kr(e.formula) } : { formula: "" };
}
function Ve(e, t) {
  const n = Vc(e), a = t === "discente" ? n.studentForm : n.trueForm;
  return sk(a);
}
function Vc(e) {
  const t = e.system;
  return Cn(t) ? t : {};
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
function Kr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Ha(e) {
  const t = Kr(e);
  return t.length > 0 ? t : null;
}
function Cn(e) {
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
    ...Yr(e),
    type: "ritual.cast.started"
  };
}
function pk(e) {
  return {
    ...Yr(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function gk(e) {
  return {
    ...Yr(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function hk(e) {
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
function bk(e, t = {}) {
  const n = Dk(e), a = [
    ...Nk(t.candidates ?? []),
    ...Pk(e)
  ], r = Ok(a) ?? { x: 0, y: 0, width: 0, height: 0 }, o = xk(t) ?? Fk(a) ?? Uk(r), s = qk(canvas?.grid?.size), l = yk(o, r, a), c = wk(a), u = Ek(l);
  return {
    type: "rectangleRay",
    sceneId: zk(e, n),
    regionId: Gi(n?.id) ?? Gi(e.id),
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
function yk(e, t, n) {
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
    direction: _k(a, t, n)
  };
}
function _k(e, t, n) {
  const a = Ak(n);
  return a !== null ? a : Rk(e, t) ?? e.direction;
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
    const a = Oi(n, t);
    if (a !== null) return a;
    const r = Sn(n), o = Oi(r, t);
    if (o !== null) return o;
  }
  return null;
}
function Oi(e, t) {
  for (const n of t) {
    const a = Tk(j(e, n));
    if (a !== null) return a;
  }
  return null;
}
function Tk(e) {
  const t = yt(e);
  if (t === null) return null;
  const n = Qr(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function Rk(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Bi(Fi(e, e.direction), t), a = kk(e, t);
  if (a === null) return null;
  const o = $k([
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
    error: Bi(Fi(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? Qr(o.direction) : null;
}
function kk(e, t) {
  const n = e.width, a = e.height, r = n ** 2 - a ** 2;
  if (Math.abs(r) < 1e-3) return null;
  const o = (n * t.width - a * t.height) / r, s = (n * t.height - a * t.width) / r, l = ji(o, 0, 1), c = ji(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : Gk(Math.atan2(c, l));
}
function Fi(e, t) {
  const n = Wc(t), a = {
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
function Bi(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function $k(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const a = Qr(n);
    t.add(Math.round(a * 1e3) / 1e3);
  }
  return [...t];
}
function Ek(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Wc(e.direction), n = {
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
function wk(e) {
  for (const t of e) {
    const n = Ui(t, "ray.start"), a = Ui(t, "ray.end");
    if (n && a) return { start: n, end: a };
  }
  return null;
}
function Ui(e, t) {
  const n = j(e, t), a = yt(j(n, "x")), r = yt(j(n, "y"));
  return a === null || r === null ? null : { x: a, y: r };
}
function Yr(e) {
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
function Ck(e, t, n, a) {
  return {
    name: e.name,
    slug: na(e, "system.slug") ?? na(e, "slug"),
    presetId: a.presetId,
    presetVersion: a.presetVersion,
    element: na(e, "system.element"),
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
  return typeof t == "number" && Number.isFinite(t) ? t : ke(t);
}
function na(e, t) {
  return ke(foundry.utils.getProperty(e, t));
}
function ke(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function Dk(e) {
  return "document" in e && e.document ? e.document : e;
}
function xk(e) {
  return Hc(e.shape);
}
function Nk(e) {
  return e.filter(Xr);
}
function Pk(e) {
  return [
    e,
    Mk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Xr);
}
function Mk(e) {
  return "object" in e && Xr(e.object) ? e.object : null;
}
function Xr(e) {
  return !!(e && typeof e == "object");
}
function Ok(e) {
  for (const t of e) {
    const n = zi(j(Sn(t), "bounds"));
    if (n) return n;
    const a = zi(j(t, "bounds"));
    if (a) return a;
  }
  return null;
}
function zi(e) {
  const t = N(e, "x"), n = N(e, "y"), a = N(e, "width"), r = N(e, "height");
  return t === null || n === null || a === null || r === null ? null : { x: t, y: n, width: a, height: r };
}
function N(e, t) {
  return yt(j(e, t));
}
function Fk(e) {
  for (const t of e) {
    const n = Bk(t).find((a) => a.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function Bk(e) {
  if (!e || typeof e != "object") return [];
  const t = qi(Sn(e));
  return t.length > 0 ? t : qi(e);
}
function qi(e) {
  const t = j(e, "shapes");
  return Array.isArray(t) ? t.map(Hc).filter((n) => n !== null) : [];
}
function Hc(e) {
  const t = Sn(e) ?? e, n = j(t, "type");
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
  return aa(e, "parent.id") ?? aa(e, "document.parent.id") ?? aa(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function aa(e, t) {
  return ke(j(e, t));
}
function j(e, t) {
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
function Sn(e) {
  if (!e || typeof e != "object") return null;
  const t = j(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function Gi(e) {
  return ke(e);
}
function yt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function qk(e) {
  const t = yt(e);
  return t !== null && t > 0 ? t : null;
}
function Wc(e) {
  return e * Math.PI / 180;
}
function Gk(e) {
  return e * 180 / Math.PI;
}
function Qr(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function ji(e, t, n) {
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
class In {
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
const Vk = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class Hk {
  constructor(t = new In()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = Wk(t, this.foundryAdapter);
    for (const a of n)
      try {
        await a.run(), a.method;
        return;
      } catch {
        a.method;
      }
    this.foundryAdapter.warn(Vk);
  }
}
function Wk(e, t) {
  const n = [], a = Kk(e), r = Vi(a), o = Vi(e);
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
function Kk(e) {
  return Yk(e) ? e.document ?? null : e;
}
function Yk(e) {
  return "bounds" in e;
}
function Vi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const Xk = 100, Qk = 12;
class Zk {
  constructor(t = new In()) {
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
      const r = this.foundryAdapter.getGridSize() ?? Xk, o = a$(n), s = await this.foundryAdapter.placeRegion(
        Jk(t, this.foundryAdapter.getUserColor(), r),
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
        message: n$(r)
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
    length: Hi(e.length, Qk, t),
    width: Hi(e.width, 1, t)
  };
}
function Hi(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function n$(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function a$(e) {
  const t = (n) => {
    const a = r$(n);
    a && e.onChange?.(a);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function r$(e) {
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
  constructor(t = new In()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(Wi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Wi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = s$(t);
    l$(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Wi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function s$(e) {
  return Array.from(new Set(e));
}
function l$(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, a) => n === t[a]);
}
class c$ {
  constructor(t = new In()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Bs)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(u$(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(d$(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((a) => ({
      source: a.source,
      hasBounds: Wa(a.region)
    }));
    for (const a of t) {
      if (!Wa(a.region)) continue;
      const r = this.resolveRegionObjectTargetTokens(a.region);
      return a.source, r.tokens.length, r;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), a = f$(
      n.filter((r) => !r.actor || typeof r.document?.testInsideRegion != "function" ? !1 : r.document.testInsideRegion(t))
    );
    return n.length, a.length, { tokens: a, source: "regionObject" };
  }
}
function u$(e) {
  return [
    { source: "document", region: Re(e.document) },
    { source: "document.object", region: Re(e.document.object) },
    { source: "preview", region: Re(e.preview) },
    { source: "preview.document.object", region: Re(e.preview?.document?.object) }
  ];
}
function d$(e) {
  return [
    { source: "input", region: Re(e) },
    { source: "input.object", region: m$(e) ? Re(e.object) : null },
    { source: "input.document.object", region: Kc(e) ? Re(e.document?.object) : null }
  ];
}
function Re(e) {
  return Wa(e) ? e : null;
}
function Wa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Ot(n.x) && Ot(n.y) && Ot(n.width) && Ot(n.height);
}
function Kc(e) {
  return "document" in e && "bounds" in e;
}
function m$(e) {
  return !Kc(e);
}
function f$(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return a ? t.has(a) ? !1 : (t.add(a), !0) : !0;
  });
}
function Ot(e) {
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
  if (Yc(e) || !E$(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function h$(e) {
  if (Yc(e))
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
    ...Ki(_$()),
    ...Ki(A$())
  ];
}
function Ki(e) {
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
  if (Yi(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Yi(n)) return n;
  }
  return null;
}
function Yi(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function Yc(e) {
  return e.minimized === !0;
}
const C$ = "Nenhum alvo encontrado na linha.";
class S$ {
  constructor(t = new Zk(), n = new c$(), a = new Hk(), r = new i$(), o = new jk(), s = new p$()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = L$(a), m = bk(l.region, {
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
      eyebrow: Cs,
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
  const a = e.map((r) => r.trim()).filter((r) => r.length > 0);
  return {
    targetNames: a,
    targetText: a.length > 0 ? a.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: a.length > 0,
    forms: t.map((r) => M$(r, n))
  };
}
function M$(e, t) {
  const n = e.targeting ?? O$(t, e.variant), a = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function O$(e, t) {
  const n = Tt(e);
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
const Xc = ["base", "discente", "verdadeiro"];
function Zr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function sn(e) {
  return typeof e == "string" && Xc.includes(e);
}
const { ApplicationV2: V$ } = foundry.applications.api;
class pt extends V$ {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = v$(t), this.selectedVariant = this.model.forms.find((a) => a.checked && a.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    K$(r, (o) => {
      this.selectedVariant = o, Ka(r, o);
    }), Ka(r, this.selectedVariant), Y$(r, (o) => {
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
          ${this.model.targets.forms.map(W$).join("")}
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
    const n = J$(t), a = X$(n, this.spendResource, this.selectedVariant);
    this.settle(a), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function H$(e) {
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
function W$(e) {
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
function K$(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of n)
    r.addEventListener("click", () => Xi(e, r, t)), r.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Xi(e, r, t));
    });
  const a = Qc(e);
  a && t(a);
}
function Xi(e, t, n) {
  const a = t.querySelector('input[name="variant"]');
  !a || a.disabled || !sn(a.value) || (a.checked = !0, e.dataset.paranormalToolkitSelectedVariant = a.value, n(a.value), a.dispatchEvent(new Event("change", { bubbles: !0 })), Qc(e), Ka(e, a.value));
}
function Qc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const a of t) {
    const r = a.querySelector('input[name="variant"]'), o = r?.checked === !0;
    a.setAttribute("aria-checked", o ? "true" : "false"), o && sn(r.value) && (n = r.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Ka(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const a of n) {
    const r = a.dataset.paranormalToolkitTargetingForm === t;
    a.hidden = !r;
  }
}
function Y$(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function X$(e, t, n) {
  const a = Z$(e) ?? n, r = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = Q$(e, a);
  return {
    variant: a,
    spendResource: r,
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
  if (sn(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return sn(n) ? n : null;
}
function J$(e) {
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
async function eE(e) {
  return pt.request(e);
}
const Jr = {
  label: "Padrão"
}, tE = {
  label: "Discente",
  extraCost: 2
}, nE = {
  label: "Verdadeiro",
  extraCost: 5
};
class aE {
  constructor(t, n, a, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = a, this.ritualEvents = r;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new S$();
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
    const r = this.resolveCostPreview(t), o = QE(n), s = KE(
      n,
      t.item,
      r,
      o
    ), l = await eE({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((E) => E.name),
      cost: r,
      defaultSpendResource: aw(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = rE(l), u = JE(
      n,
      t.item,
      c.variant,
      o
    ), m = mk(), g = u.label ?? Zr(c.variant), _ = uE(u), k = (E = t.targets) => ({
      castId: m,
      context: t,
      automationSource: a,
      form: c.variant,
      formLabel: g,
      targets: E
    }), R = (E, S = t.targets, U = {}) => {
      this.ritualEvents.emitCastFinished(
        gk({
          ...k(S),
          status: E,
          ...U
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
    const I = Hs();
    let A = null;
    if (I) {
      const E = await sE(
        this.resources,
        b.actor,
        c,
        u,
        r
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
    const B = iE(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !I
      }
    );
    if (B.steps.length === 0) {
      const E = ZE(
        b,
        c
      ), S = Zi(
        n,
        b
      ), U = Qi(
        b.actor,
        A,
        u,
        r
      ), W = Ji(
        n,
        c,
        u,
        r,
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
      const St = [
        ...U,
        ...S.actions
      ];
      return St.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: E,
        itemUseContext: b,
        actions: St,
        summaryLines: W
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: E,
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
    const H = x.value.context, v = bE(
      n,
      b,
      H,
      _
    ), q = Zi(
      n,
      b
    ), Ct = Qi(
      b.actor,
      A,
      u,
      r
    ), fe = Ji(
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
      ...Ct,
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
    return an(
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
function rE(e) {
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
function iE(e, t, n, a, r) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || to(l) && (!r.includeCostSteps || !s))
      continue;
    const c = lE(l, n);
    c && o.push(c);
  }
  return r.includeCostSteps && s && a && rw(n.extraCost) && o.push({
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
async function sE(e, t, n, a, r) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Qe(r, a);
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
  const a = n[t];
  return typeof a == "string" ? a.trim() : "";
}
function uE(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function dE(e, t, n) {
  const r = mE(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: r,
    success: e.total >= r
  };
}
function mE(e, t) {
  const n = Qe(e, t);
  return n ? lk(n.amount) : null;
}
function Qi(e, t, n, a) {
  if (!t || t.success) return [];
  const r = Qe(a, n);
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
function Zi(e, t) {
  const n = [];
  for (const a of e.conditionApplications ?? []) {
    const r = eo(a.actor, t);
    if (r.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${a.label ?? a.conditionId}.`
      };
    }
    for (const o of r) {
      const s = Al(o);
      n.push(
        fE(
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
function fE(e, t, n, a) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? hE(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: pE(
      e.duration ?? null,
      a
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
    const a = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${a}`;
  }
  return e;
}
function hE(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function bE(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || yE(s, a)) continue;
    const l = nn(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = eo(s.actor, t);
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
      r.push(kE(s, u, l.value));
    }
  }
  for (const s of o.values())
    r.push(
      ...RE(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: r };
}
function yE(e, t) {
  const n = Zc(e.amountFrom);
  return n !== null && t.has(n);
}
function _E(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function AE(e, t, n) {
  const a = CE(t), r = e.get(a);
  if (r) {
    r.entries.push(n);
    return;
  }
  e.set(a, {
    actor: t,
    entries: [n]
  });
}
function TE(e, t, n) {
  const a = Zc(e.amountFrom), r = a ? t.rolls[a]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? r ?? null,
    sourceRollId: a
  };
}
function RE(e, t, n, a) {
  const r = vE(e), o = r.length > 1 ? NE() : void 0;
  return r.map((s) => {
    const l = a.map(
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
      label: EE(c, s, r.length > 1),
      executedLabel: wE(
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
function kE(e, t, n) {
  const a = t.name ?? "Ator sem nome", r = LE(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: SE(e, a, n),
    executedLabel: IE(e, a),
    actionSectionId: r.id,
    actionSectionTitle: r.title
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
function Zc(e) {
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
  const n = e * t.multiplier, a = xE(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, a);
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
function eo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Ji(e, t, n, a, r, o, s = null) {
  return [
    `Forma: ${Zr(t.variant)}`,
    FE(t, n, a),
    ...OE(s),
    ...Object.values(r.rolls).flatMap(BE),
    ...PE(e, o),
    ...UE(e.resistance),
    ...HE(n)
  ];
}
function PE(e, t) {
  return ME(e) ? eo("target", t).length > 0 ? [] : [
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
  const a = Qe(n, t);
  return a ? e.spendResource ? `Custo: ${a.amount} ${a.resource} gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function BE(e) {
  const n = [`${WE(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = zE(e.roll);
  return a && n.push(`Dados: ${a}`), e.damageType && n.push(`Tipo: ${ck(e.damageType)}`), n;
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
  let a = "+";
  for (const r of t) {
    if (!r || typeof r != "object") continue;
    const o = r;
    if (o.operator === "+" || o.operator === "-") {
      a = o.operator;
      continue;
    }
    const s = qE(o);
    s && (VE(
      n,
      s.operator ?? a,
      s.value
    ), a = "+");
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
function KE(e, t, n, a) {
  return Xc.map((r) => {
    const o = Jc(
      e,
      t,
      r,
      a
    ), s = o !== null;
    return {
      variant: r,
      label: o?.label ?? Zr(r),
      enabled: s,
      details: o ? YE(o, n) : [],
      finalCostText: o ? XE(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function YE(e, t, n) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  r.length > 0 ? a.push(r.join(", ")) : a.push("efeito manual");
  const o = Qe(t, e);
  return a.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), a;
}
function Qe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function XE(e, t) {
  const n = Qe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function QE(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(to);
}
function ZE(e, t) {
  return Fc({
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
function JE(e, t, n, a) {
  return Jc(e, t, n, a) ?? Jr;
}
function Jc(e, t, n, a) {
  const r = e.ritualForms?.[n] ?? null;
  return r || (a ? tw(t, n) ? ew(n) : null : n === "base" ? Jr : null);
}
function ew(e) {
  switch (e) {
    case "base":
      return Jr;
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
function aw(e) {
  return e.steps.some(to);
}
function to(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function rw(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const eu = "itemUsePrompts", tu = "chatCard", Ln = "data-paranormal-toolkit-prompt-id", vn = "data-paranormal-toolkit-pending-id", no = "data-paranormal-toolkit-executed-label", Ya = "data-paranormal-toolkit-choice-group", nu = "data-paranormal-toolkit-skipped-label", ln = "data-paranormal-toolkit-action-section", es = "data-paranormal-toolkit-detail-key", ts = "data-paranormal-toolkit-roll-card", ao = "data-paranormal-toolkit-roll-detail-toggle", au = "data-paranormal-toolkit-roll-detail-id", ru = "data-paranormal-toolkit-resistance-roll-button", ou = "data-paranormal-toolkit-resistance-skill", iu = "data-paranormal-toolkit-resistance-skill-label", su = "data-paranormal-toolkit-resistance-target-actor-id", lu = "data-paranormal-toolkit-resistance-target-name", cu = "data-paranormal-toolkit-resistance-roll-result", ns = "data-paranormal-toolkit-system-card-replaced", ow = `[${vn}]`, iw = `[${ao}]`, sw = `[${ru}]`, Xa = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, lw = `${h}__actions`, as = `${h}__details`, uu = `${h}__summary`, cw = `${h}__title`, du = `${h}__button--executed`, Ft = `${h}__roll-card`, uw = "data-paranormal-toolkit-roll-card-target-mode", dw = "data-paranormal-toolkit-roll-card-target-names", mw = "data-paranormal-toolkit-roll-card-resistance", fw = "data-paranormal-toolkit-roll-card-resistance-skill", pw = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let rs = !1, Qa = null;
const Q = /* @__PURE__ */ new Map(), gw = [0, 100, 500, 1500, 3e3], hw = 3e4, bw = [0, 100, 500, 1500, 3e3];
function yw(e) {
  if (Qa = e, rs) {
    is(e);
    return;
  }
  const t = (n, a) => {
    fu(n, a, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), rs = !0, is(e);
}
async function os(e) {
  const t = mu(e);
  Q.set(e.pendingId, t), await io(t) || Eu(t), pu(e.pendingId);
}
async function _w(e) {
  const t = mu({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", Q.set(e.pendingId, t), await io(t) || Eu(t), pu(e.pendingId);
}
async function ra(e, t) {
  const n = Q.get(e);
  Q.delete(e), n && await kC(n, t);
}
function ro(e) {
  const t = vu();
  for (const n of t) {
    const a = re(n)[e];
    if (a) return { message: n, prompt: a };
  }
  return null;
}
async function Aw(e, t) {
  const n = ro(e);
  if (!n) return;
  const a = re(n.message), r = a[e];
  r && (a[e] = {
    ...r,
    executedLabel: r.executedLabel,
    executed: !0
  }, await Ze(n.message, a));
}
async function Tw(e, t, n) {
  if (!t) return;
  const a = ro(e);
  if (!a) return;
  const r = re(a.message);
  let o = !1;
  for (const [s, l] of Object.entries(r))
    s !== e && l.choiceGroupId === t && (r[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Ze(a.message, r);
}
function mu(e) {
  const t = me(e.context.message), n = e.context.targets.find((s) => tr(s)), a = n ? tr(n) : null, r = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? n?.name ?? r?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Yw(e.context),
    executed: !1
  };
}
function fu(e, t, n) {
  RC();
  const a = xn(t);
  if (!a) return;
  const r = _C(e, a);
  r.length > 0 && cn(a);
  for (const o of r)
    Za(a, o);
  _u(a, n), Ja(a), er(a);
}
function is(e) {
  for (const t of bw)
    globalThis.setTimeout(() => {
      Rw(e);
    }, t);
}
function Rw(e) {
  for (const t of kw()) {
    const n = Dn(t);
    $w(n) && fu(n, t, e);
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
  return e ? so(e) ? !0 : EC(e).length > 0 : !1;
}
function pu(e) {
  const t = Q.get(e);
  if (!t) return;
  const n = t.messageId ? AC(t.messageId) : null;
  if (n) {
    ds(n, t), cn(n), Za(n, t), ss(n), Ja(n), er(n);
    return;
  }
  if (t.messageId) {
    ar(t);
    return;
  }
  const a = TC(t);
  if (a) {
    ds(a, t), cn(a), Za(a, t), ss(a), Ja(a), er(a);
    return;
  }
  ar(t);
}
function ss(e) {
  Qa && _u(e, Qa);
}
function cn(e) {
  const t = Ew();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = yu(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ns) === "true") return;
  const a = n.querySelector(`.${Xa}`);
  a ? n.replaceChildren(a) : n.replaceChildren(), n.setAttribute(ns, "true");
}
function Ew() {
  try {
    return Vs() === "replace";
  } catch {
    return !1;
  }
}
function Za(e, t) {
  if (cn(e), e.querySelector(`[${Ln}="${Je(t.pendingId)}"]`)) return;
  const n = Cw(e, t);
  Iw(n, t);
  const a = Vw(t);
  if (ww(a)) return;
  jw(n, a).append(Kw(t));
}
function ww(e) {
  return hu(e.id) && !Ee();
}
function gu(e) {
  const n = e.closest(`[${ln}]`)?.getAttribute(ln) ?? null;
  return hu(n) && !Ee();
}
function hu(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Cw(e, t) {
  const n = e.querySelector(`.${Xa}`);
  if (n)
    return n;
  const a = document.createElement("section");
  a.classList.add(Xa, h);
  const r = document.createElement("header");
  r.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(cw), s.textContent = Sw(t);
  const l = document.createElement("span");
  return l.classList.add(uu), l.textContent = t.summary, r.append(o, s, l), a.append(r), Qw(e).append(a), a;
}
function Sw(e) {
  const t = F(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Iw(e, t) {
  const n = t.summaryLines ?? [], a = ku(n, t);
  if (a) {
    Lw(e, a, t);
    return;
  }
  Hw(e, n);
}
function Lw(e, t, n) {
  if (e.querySelector(`[${ts}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(
    Ft,
    `${Ft}--${t.intent}`,
    `${Ft}--target-${t.targetMode}`
  ), t.targetMode === "multi" && a.classList.add(`${Ft}--multi-target`), a.setAttribute(ts, "true"), a.setAttribute(uw, t.targetMode), a.setAttribute(dw, JSON.stringify(t.targetNames)), Bw(a, t), t.castingCheck && ls(a, Dw(t.castingCheck), n.pendingId, "casting"), vw(t) && ls(a, xw(t), n.pendingId, "effect"), Fw(a, t), Uw(a, t, n), Gw(a, t), e.append(a);
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
function ls(e, t, n, a) {
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
  Nw(r, t), qw(r, t.detailRows, n, a, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(r);
}
function Nw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const a = document.createElement("span");
  a.classList.add(`${h}__workflow-roll-formula`), a.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${h}__workflow-roll-total`), r.textContent = String(t.total), n.append(a, r);
  const o = Pw(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function Pw(e, t) {
  const n = Mw(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-dice-tray`);
  for (const r of Ow(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), r.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function Mw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function Ow(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? cs(e, "highest") : n.includes("kl") ? cs(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function cs(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function Fw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(GC);
  if (n.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const r of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = r, a.append(o);
  }
  e.append(a);
}
function Bw(e, t) {
  t.resistance && (e.setAttribute(mw, t.resistance), t.resistanceSkill && e.setAttribute(fw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(pw, t.resistanceSkillLabel));
}
function Uw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = zw(t, n);
  r.append(o), s && r.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, a.append(r, l), t.resistanceRollResult && a.append(bu(t.resistanceRollResult)), e.append(a);
}
function zw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Se())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Ln, t.pendingId), n.setAttribute(ru, "true"), n.setAttribute(ou, e.resistanceSkill), n.setAttribute(iu, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(su, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(lu, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(cu, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const r = document.createElement("span");
  return r.classList.add(`${h}__resistance-roll-fallback`), r.textContent = "d20", n.append(a, r), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function bu(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Tu(e), t;
}
function qw(e, t, n, a, r) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${a}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(ao, s), l.setAttribute("aria-expanded", "false"), l.textContent = r;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(au, s), c.hidden = !0;
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
  for (const a of [...t.notes, ...t.details]) {
    const r = document.createElement("span");
    r.textContent = a, n.append(r);
  }
  e.append(n);
}
function jw(e, t) {
  const n = `[${ln}="${Je(t.id)}"]`, a = e.querySelector(n);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add(lw), r.setAttribute(ln, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, r.append(o), e.append(r), r;
}
function Vw(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const a = ku(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Hw(e, t) {
  if (t.length === 0) return;
  const n = Ww(e);
  for (const a of t) {
    const r = jC(a);
    if (n.querySelector(`[${es}="${Je(r)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(es, r), n.append(o);
  }
}
function Ww(e) {
  const t = e.querySelector(`.${as}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(as), e.append(n), n;
}
function Kw(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Ln, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(du), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(vn, e.pendingId), t.setAttribute(no, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ya, e.choiceGroupId), t.setAttribute(nu, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Yw(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Xw(e);
  return `${t} → ${n}`;
}
function Xw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Qw(e) {
  return yu(e) ?? e;
}
function yu(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function _u(e, t) {
  const n = xn(e);
  if (!n) return;
  const a = n.querySelectorAll(ow);
  for (const r of a) {
    if (gu(r)) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitBound !== "true" && (r.dataset.paranormalToolkitBound = "true", r.addEventListener("click", () => {
      dC(r, t);
    }));
  }
}
function Ja(e) {
  const t = xn(e);
  if (!t) return;
  const n = t.querySelectorAll(iw);
  for (const a of n)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      Zw(t, a);
    }));
}
function er(e) {
  const t = xn(e);
  if (!t) return;
  const n = t.querySelectorAll(sw);
  for (const a of n) {
    if (!Se()) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      Jw(t, a);
    }));
  }
}
function Zw(e, t) {
  const n = t.getAttribute(ao);
  if (!n) return;
  const a = e.querySelector(`[${au}="${Je(n)}"]`);
  if (!a) return;
  const r = a.hidden;
  a.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.textContent = r ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Jw(e, t) {
  if (!Se()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(Ln), a = t.getAttribute(ou), r = t.getAttribute(iu) ?? (a ? $e(a) : "Resistência");
  if (!n || !a) return;
  const o = nC(e, n), s = aC(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Vp(s, a);
    await lC(c.roll);
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
    eC(t, u), tC(t, u), cC(n, u), await uC(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${r}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function eC(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(cu, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function tC(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const a = n.querySelector(`.${h}__resistance-roll-result`), r = a ?? bu(t);
  if (a) {
    a.textContent = Tu(t);
    return;
  }
  n.append(r);
}
function nC(e, t) {
  const n = Q.get(t);
  if (n) return n;
  const a = Dn(e);
  return re(a)[t] ?? null;
}
function aC(e, t) {
  const n = e?.resistanceTargetActor;
  if (te(n)) return n;
  const r = e?.context?.targets.map(tr).find(te) ?? null;
  if (r) return r;
  const o = t.getAttribute(su) ?? e?.resistanceTargetActorId ?? null, s = o ? oC(o) : null;
  return s || iC(
    t.getAttribute(lu) ?? e?.resistanceTargetName ?? rC(t)
  );
}
function rC(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${uu}`)?.textContent ?? null;
  if (!n) return null;
  const a = "→";
  if (!n.includes(a)) return null;
  const r = n.split(a), o = r[r.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function tr(e) {
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
function oC(e) {
  const n = game.actors?.get?.(e);
  return te(n) ? n : Au().map((o) => _t(o)).find((o) => o?.id === e) ?? null;
}
function iC(e) {
  const t = Be(e);
  if (!t) return null;
  const n = Au().filter((o) => Be(sC(o)) === t).map((o) => _t(o)).find(te) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => te(o) && Be(o.name) === t);
  return te(r) ? r : null;
}
function Au() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function sC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : _t(e)?.name ?? null;
}
function Be(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function te(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Tu(e) {
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
  const a = Dn(e);
  if (a)
    try {
      const r = re(a), o = r[t];
      if (!o) return;
      r[t] = {
        ...o,
        resistanceRollResult: n
      }, await Ze(a, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", r);
    }
}
function Dn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages;
  return ae(a?.get?.(n));
}
async function dC(e, t) {
  if (gu(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(vn);
  if (!n) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Ru(e, e.getAttribute(no) ?? "✓ Automação aplicada"), mC(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function Ru(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(du), e.removeAttribute(vn), e.removeAttribute(no);
}
function mC(e) {
  const t = e.getAttribute(Ya);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const a = `[${Ya}="${Je(t)}"]`;
  for (const r of n.querySelectorAll(a)) {
    if (r === e) continue;
    const o = r.getAttribute(nu) ?? "✓ Outra opção escolhida";
    Ru(r, o);
  }
}
function ku(e, t) {
  const n = e.map(oo).filter(zC), a = n.find(($) => $.intent !== "casting") ?? n[0] ?? null;
  if (!a) return null;
  const r = F(e, "Forma"), o = F(e, "Custo"), s = F(e, "Dados") ?? F(e, `Dados (${a.label})`), l = F(e, "Tipo"), c = F(e, "Resistência"), u = F(e, "Resistência Perícia"), m = F(e, "Resistência Rótulo") ?? (u ? $e(u) : null), g = $u(e, "Observação"), _ = e.filter(($) => yC($, a)), k = hC(e), R = fC(t);
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
  const t = e.map(oo).find((o) => o?.intent === "casting") ?? null, n = F(e, "Conjuração DT"), a = F(e, "Conjuração Resultado");
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
function oo(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, a, r] = t, o = Number(r);
  return Number.isFinite(o) ? {
    label: n,
    formula: a,
    total: o,
    intent: bC(n)
  } : null;
}
function bC(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function F(e, t) {
  return $u(e, t)[0] ?? null;
}
function $u(e, t) {
  const n = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(n)) return [];
    const r = a.slice(n.length).trim();
    return r.length > 0 ? [r] : [];
  });
}
function yC(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || oo(e) ? !1 : e.trim().length > 0;
}
function _C(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of Q.values())
    nr(a, e, t) && n.set(a.pendingId, a);
  for (const a of $C(e))
    nr(a, e, t) && !n.has(a.pendingId) && n.set(a.pendingId, a);
  return Array.from(n.values()).sort((a, r) => a.createdAt - r.createdAt);
}
function nr(e, t, n) {
  const a = me(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !us(n, "itemId", e.itemId) ? !1 : !e.actorId || us(n, "actorId", e.actorId);
}
function us(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const a = `data-${VC(t)}`;
  for (const r of e.querySelectorAll(`[${a}]`))
    if (r.getAttribute(a) === n)
      return !0;
  return !1;
}
function AC(e) {
  const t = Je(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function TC(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (nr(e, null, t))
      return t;
  return null;
}
function RC() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, a] of Q.entries())
    e - a.createdAt > t && Q.delete(n);
}
async function ds(e, t) {
  const n = Dn(e);
  if (!n) return !1;
  try {
    const a = re(n);
    return a[t.pendingId] = lo(t, me(n)), await Ze(n, a), !0;
  } catch (a) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a), !1;
  }
}
async function io(e) {
  const t = Su(e);
  if (!t) return !1;
  try {
    const n = re(t);
    return n[e.pendingId] = lo(e, me(t)), await Ze(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Eu(e) {
  for (const t of gw)
    globalThis.setTimeout(() => {
      ar(e);
    }, t);
}
async function ar(e) {
  const t = Su(e);
  if (so(t)?.prompts.some((r) => r.pendingId === e.pendingId))
    return !0;
  const a = await io(e);
  return a || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), a;
}
async function kC(e, t) {
  const n = Cu(e.context.message);
  if (n)
    try {
      const a = re(n), r = a[e.pendingId] ?? lo(e, me(n));
      a[e.pendingId] = {
        ...r,
        executedLabel: t ?? r.executedLabel,
        executed: !0
      }, await Ze(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function $C(e) {
  return Object.values(re(ae(e))).filter(Et);
}
function re(e) {
  if (!e) return {};
  const t = {}, n = so(e);
  for (const a of n?.prompts ?? [])
    t[a.pendingId] = a;
  for (const [a, r] of Object.entries(wu(e)))
    t[a] ??= r;
  return t;
}
function EC(e) {
  return Object.values(wu(ae(e))).filter(Et);
}
function wu(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, eu);
  if (!He(t))
    return {};
  const n = {};
  for (const [a, r] of Object.entries(t))
    Et(r) && (n[a] = r);
  return n;
}
async function Ze(e, t) {
  typeof e.setFlag == "function" && (await CC(e, t), await wC(e, t));
}
async function wC(e, t) {
  await Promise.resolve(e.setFlag?.(d, eu, t));
}
function so(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, tu);
  return BC(t) ? t : null;
}
async function CC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Et).sort((o, s) => o.createdAt - s.createdAt);
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
      actorName: SC(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, tu, r));
}
function SC(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function lo(e, t) {
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
function Cu(e) {
  const t = ae(e);
  if (t?.setFlag)
    return t;
  const n = IC(e);
  if (n?.setFlag)
    return n;
  const a = me(e);
  if (!a) return null;
  const r = game.messages;
  return ae(r?.get?.(a));
}
function IC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ae).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Su(e) {
  const t = Cu(e.context.message);
  if (t) return t;
  const n = e.messageId ? LC(e.messageId) : null;
  if (n) return n;
  const a = vu().slice().reverse();
  return a.find((r) => vC(r, e)) ?? a.find((r) => DC(r, e)) ?? null;
}
function LC(e) {
  const t = game.messages;
  return ae(t?.get?.(e));
}
function vC(e, t) {
  const n = me(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Iu(e, t)) return !1;
  const r = Lu(e);
  return !t.actorId || !r || r === t.actorId;
}
function DC(e, t) {
  if (!NC(e, t)) return !1;
  const n = Lu(e);
  return t.actorId && n === t.actorId ? !0 : Iu(e, t);
}
function Iu(e, t) {
  const n = Be(xC(e));
  if (!n) return !1;
  const a = Be(t.itemName);
  if (a && n.includes(a)) return !0;
  const r = Be(t.itemId);
  return !!(r && n.includes(r));
}
function xC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Lu(e) {
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
function ae(e) {
  return e && typeof e == "object" ? e : null;
}
function Et(e) {
  return He(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && G(e.messageId) && G(e.itemId) && G(e.actorId) && G(e.itemName) && _e(e.resistanceTargetActorId) && _e(e.resistanceTargetName) && UC(e.resistanceRollResult) && MC(e.actionPayload) && oa(e.title) && oa(e.buttonLabel) && oa(e.executedLabel) && _e(e.choiceGroupId) && _e(e.skippedLabel) && _e(e.actionSectionId) && _e(e.actionSectionTitle) && qC(e.summaryLines) : !1;
}
function MC(e) {
  return e == null ? !0 : He(e) ? e.kind === "resource-operation" && G(e.actorId) && G(e.actorUuid) && typeof e.actorName == "string" && OC(e.resource) && FC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function OC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function FC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function BC(e) {
  return He(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && G(e.messageId) && He(e.source) && G(e.source.actorId) && G(e.source.actorName) && G(e.source.itemId) && G(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Et) : !1;
}
function UC(e) {
  return e == null ? !0 : He(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && _e(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function zC(e) {
  return e !== null;
}
function He(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function G(e) {
  return e === null || typeof e == "string";
}
function oa(e) {
  return e === void 0 || typeof e == "string";
}
function _e(e) {
  return e == null || typeof e == "string";
}
function qC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function GC(e) {
  return typeof e == "string" && e.length > 0;
}
function vu() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(ae).filter((a) => a !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(ae).filter((a) => a !== null) : [];
}
function xn(e) {
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
function Je(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ms = 1e3;
class HC {
  constructor(t, n, a, r, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = r, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new aE(
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
      settings: ga(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = ga();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = lr(t.item);
    if (!a.ok) {
      if (a.error.reason === "missing-automation" && JC(t.item) && n.executionMode === "ask") {
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
    if (await Pi(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: la(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const r = KC(
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
      return this.pendingExecutions.delete(t), await ra(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const a = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return a.ok ? (this.pendingExecutions.delete(t), await ra(
      t,
      a.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = ro(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const a = n.prompt.actionPayload, r = nS(a);
    if (!r)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${a.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await an(
      this.resources,
      r,
      a.resource,
      a.operation,
      a.amount
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
  async handleAskMode(t, n, a) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n, a);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Pi(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: la(t, "failed", "missing-actor")
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
          Ne(r.workflowContext)
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
      if (!Ee())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const r = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return r.ok ? (ZC(n, r.value), await ql(r.value), {
        ok: !0,
        executedLabel: WC(r.value)
      }) : (this.handleDamageActionFailure(r.error), { ok: !1 });
    }
    if (!Ee())
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
    const n = ia(t.action);
    if (!n) return;
    const a = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, r]) => r.kind === "assisted-action" && ia(r.action) === n);
    for (const [r, o] of a)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(r), await ra(
        r,
        fs(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const a = ca();
    await _w({
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
      const l = ca();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await os({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: ia(s),
        skippedLabel: fs(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: r,
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
      Ne(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const a = ca();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await os({
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
      Ne(r.value.context)
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
    const n = Date.now(), a = ps(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > ms && this.recentExecutionKeys.delete(o);
    const r = this.recentExecutionKeys.get(a);
    return r !== void 0 && n - r <= ms;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ps(t), Date.now());
  }
  setAttempt(t, n, a, r) {
    this.lastAttempt = la(
      t,
      n,
      a,
      r
    );
  }
}
function WC(e) {
  return Gl({ inputAmount: e.totalRawDamage });
}
function KC(e, t) {
  if (t.resistance || !YC(t))
    return t;
  const n = jc(e);
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
function ia(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function fs(e) {
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
  const t = e.actorUuid ? aS(e.actorUuid) : null;
  if (We(t)) return t;
  const n = e.actorId ? rS(e.actorId) : null;
  return n || oS(e.actorName);
}
function aS(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function rS(e) {
  const n = game.actors?.get?.(e);
  if (We(n)) return n;
  for (const a of Du()) {
    const r = co(a);
    if (r?.id === e) return r;
  }
  return null;
}
function oS(e) {
  const t = sa(e);
  if (!t) return null;
  for (const r of Du()) {
    const o = iS(r);
    if (sa(o) === t) {
      const s = co(r);
      if (s) return s;
    }
  }
  const a = game.actors?.find?.(
    (r) => We(r) && sa(r.name) === t
  );
  return We(a) ? a : null;
}
function Du() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function iS(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : co(e)?.name ?? null;
}
function co(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (We(t)) return t;
  const n = e.document?.actor;
  return We(n) ? n : null;
}
function sa(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function We(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function la(e, t, n, a) {
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
function ps(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function ca() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class sS {
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
class lS {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Rt(t).map((l) => this.analyzeRitual(l)), a = n.filter(Bt("upToDate")), r = n.filter(Bt("available")), o = n.filter(Bt("outdated")), s = n.filter(Bt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, a = cS(t);
    return n ? a ? a.source.type !== "preset" ? nt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : a.source.presetId === n.preset.id && a.source.presetVersion === n.preset.version ? nt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : nt({
      ritual: t,
      status: "outdated",
      match: n,
      flag: a,
      reason: uS(a, n.preset)
    }) : nt({
      ritual: t,
      status: "available",
      match: n,
      flag: a,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : nt({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: a,
      reason: a ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function nt(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? mn(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function cS(e) {
  const t = e.getFlag(d, "automation");
  return cr(t) ? t : null;
}
function uS(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Bt(e) {
  return (t) => t.status === e;
}
class dS {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), a = dr(t.transaction);
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
    const n = Ut(t.actorName), a = Ut(t.resource), r = Ut(mS(t)), o = Ut(fS(t));
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
function Ut(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function pS() {
  const e = new kT(), t = new yR(e), n = new yl(new bl()), a = new _l(new Er()), r = new _R(new xc()), o = new wT(), s = new zT(o), l = new HT(e), c = new KT(), u = c.registerMany(
    Ld()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new WT(), g = new jT(), _ = Cl(), k = new Rl(_), R = new lS(
    c
  ), $ = new sS(
    R,
    m,
    g
  ), b = new kR(), I = new dS(b), A = new RR(), B = new bR(), x = new gR(
    t,
    s,
    I,
    A
  ), H = new TR(x, A), v = new HC(
    H,
    t,
    s,
    n,
    k,
    b,
    B
  );
  return v.addStrategy(
    new el(
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
    chatMessages: I,
    workflowHooks: A,
    ritualEvents: B,
    automation: x,
    workflow: H,
    itemUseIntegration: v,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: gS } = foundry.applications.api;
class un extends gS {
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
      apply: un.onApply,
      cancel: un.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${J(Cs)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${J(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${ua("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${ua("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${ua("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function ua(e, t, n, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
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
const dn = `${d}.manageRitualPresets`, gs = `__${d}_ritualPresetHeaderControlRegistered`, _S = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function AS(e) {
  const t = globalThis;
  if (!t[gs]) {
    for (const n of _S)
      Hooks.on(n, (a, r) => {
        TS(a, r, e);
      });
    t[gs] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function TS(e, t, n) {
  Array.isArray(t) && kS(e) && (RS(e, n), !t.some((a) => a.action === dn) && t.push({
    action: dn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), xu(e, n);
    }
  }));
}
function RS(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[dn] && (e.options.actions[dn] = (n) => {
    n.preventDefault(), n.stopPropagation(), xu(e, t);
  }));
}
function kS(e) {
  if (!game.user?.isGM) return !1;
  const t = Nu(e);
  return t ? t.type === "agent" && Rt(t).length > 0 : !1;
}
function xu(e, t) {
  const n = Nu(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new un(n, t).render({ force: !0 });
}
function Nu(e) {
  return hs(e.actor) ? e.actor : hs(e.document) ? e.document : null;
}
function hs(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const rr = "data-paranormal-toolkit-stylesheet";
function or(e) {
  const t = SS(e), n = $S(t), a = wS(n), r = ES(n, t);
  if (r)
    return r.href = a, r.setAttribute(rr, t), r;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = a, o.setAttribute(rr, t), document.head.append(o), o;
}
function $S(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, a = n.getRoute;
  return typeof a == "function" ? a.call(n, t) : t;
}
function ES(e, t) {
  const n = bs(e);
  for (const a of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (a.getAttribute(rr) === t || bs(a.href) === n)
      return a;
  return null;
}
function wS(e) {
  const t = CS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function CS() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function bs(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function SS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Te(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const a = document.createElement("span");
  return a.textContent = e, n.append(a, t), n;
}
function ir(e, t, n) {
  const a = document.createElement("input");
  return a.type = "text", a.value = e, a.placeholder = t, a.disabled = !n, a;
}
function Wt(e, t, n) {
  const a = document.createElement("button");
  a.type = "button", n && a.classList.add(n);
  const r = document.createElement("i");
  r.className = t;
  const o = document.createElement("span");
  return o.textContent = e, a.append(r, o), a;
}
function Pu(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const a = document.createElement("i");
  return a.className = t, n.append(a), n;
}
function at(e, t, n = !1) {
  const a = document.createElement("option");
  return a.value = e, a.textContent = t, a.selected = n, a;
}
function IS(e) {
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
  const g = Pu("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !a, g.addEventListener("click", o), l.append(c, g);
  const _ = document.createElement("div");
  _.classList.add(`${d}-ability-roll-config__fields`);
  const k = ir(
    t.label,
    "Ex.: Dano adicional",
    a
  );
  k.addEventListener("input", () => {
    t.label = k.value, r();
  }), _.append(Te("Nome da rolagem", k));
  const R = document.createElement("select");
  R.disabled = !a;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      at(
        C,
        Ym(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = xS(R.value), Ct(), r();
  }), _.append(Te("Tipo da rolagem", R));
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
  const B = document.createElement("label");
  B.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const x = document.createElement("input");
  x.type = "checkbox", x.checked = t.formula.mode === "nex", x.disabled = !a;
  const H = document.createElement("span");
  H.textContent = "Varia conforme o NEX", B.append(x, H), I.append(A, B);
  const v = document.createElement("div");
  return v.classList.add(`${d}-ability-roll-config__formula`), b.append(I, v), x.addEventListener("change", () => {
    t.formula = x.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: vS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, q(), fe(), r();
  }), s.append(l, _, b), q(), Ct(), fe(), s;
  function q() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function Ct() {
    $.replaceChildren();
    const C = t.intent === "damage";
    if (_.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), $.hidden = !C, !C) return;
    const E = document.createElement("select");
    E.disabled = !a, E.append(at("", "—", !t.damageType));
    for (const { value: S, label: U } of nl)
      E.append(at(S, U, t.damageType === S));
    E.addEventListener("change", () => {
      t.damageType = E.value || null, r();
    }), $.append(Te("Tipo de dano", E));
  }
  function fe() {
    if (v.replaceChildren(), t.formula.mode === "fixed") {
      const W = ir(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        a
      );
      W.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = W.value, r());
      }), v.append(Te("Expressão", W));
      return;
    }
    const C = t.formula, E = document.createElement("select");
    E.disabled = !a, E.append(
      at(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        C.resolution === "highest-unlocked"
      ),
      at(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        C.resolution === "choose-unlocked"
      )
    ), E.addEventListener("change", () => {
      C.resolution = NS(E.value), r();
    }), v.append(Te("Comportamento", E));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((W, St) => {
      S.append(
        LS({
          step: W,
          editable: a,
          onChange: r,
          onRemove: () => {
            C.steps.splice(St, 1), fe(), r();
          }
        })
      );
    }), v.append(S);
    const U = Wt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    U.disabled = !a || C.steps.length >= Aa, U.addEventListener("click", () => {
      C.steps.length >= Aa || (C.steps.push({
        minNex: DS(
          C.steps.map((W) => W.minNex)
        ),
        formula: ""
      }), fe(), r());
    }), v.append(U);
  }
}
function LS(e) {
  const { step: t, editable: n, onChange: a, onRemove: r } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = PS(Number(s.value)), s.value = String(t.minNex), a();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = ir(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, a();
  });
  const m = Pu("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", r), o.append(
    Te("NEX mínimo", l),
    Te("Fórmula", u),
    m
  ), o;
}
function vS(e) {
  const t = zm(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function DS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function xS(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function NS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function PS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function MS(e) {
  let t = da(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const a = OS(t), r = document.createElement("p");
  r.classList.add(`${d}-ability-roll-config__hint`), r.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = Wt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= _a || (t.rolls.push(rl(t.rolls.length + 1)), _(), I("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = Wt("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = Wt("Limpar", "fa-solid fa-eraser");
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
          IS({
            roll: A,
            index: B,
            editable: e.editable,
            onChange: () => {
              sr(a, t), I("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(B, 1), _(), I("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    sr(a, t), b(!1);
  }
  async function k() {
    $(!0), I("Salvando configuração...");
    try {
      const A = br(t);
      if (!A) throw new Error("Configuração inválida.");
      t = da(await e.onSave(A)), _(), I("Configuração salva.");
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
      t = da(await e.onClear()), _(), I("Configuração removida.");
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
    c.disabled = A || !e.editable, u.disabled = A || !e.editable, s.disabled = A || !e.editable || t.rolls.length >= _a;
  }
  function I(A) {
    g.textContent = A;
  }
}
function OS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const a = document.createElement("strong");
  a.textContent = "Paranormal Toolkit";
  const r = document.createElement("span");
  r.textContent = "Fórmulas de rolagem", n.append(a, r);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), sr(t, e), t;
}
function sr(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = Xm(t) ? "Configurada" : "Rascunho");
}
function da(e) {
  return JSON.parse(JSON.stringify(e));
}
const FS = "[data-paranormal-toolkit-ability-roll-config]", ys = `__${d}_abilityRollConfigBlockRegistered`, BS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function US() {
  const e = globalThis;
  if (!e[ys]) {
    or("styles/ability-roll-config.css");
    for (const t of BS)
      Hooks.on(t, (...n) => {
        zS(n[0], n[1]);
      });
    e[ys] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function zS(e, t) {
  const n = GS(e);
  if (!n || n.type !== "ability") return;
  const a = VS(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!r) return;
  for (const s of Array.from(
    r.querySelectorAll(FS)
  ))
    s.remove();
  const o = MS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Gm(n),
    editable: jS(n),
    onSave: async (s) => {
      const l = await jm(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Vm(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), al())
  });
  qS(r, o);
}
function qS(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function GS(e) {
  return _s(e.item) ? e.item : _s(e.document) ? e.document : null;
}
function jS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function VS(e) {
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
const Mu = "data-paranormal-toolkit-ritual-roll-config", wt = "data-paranormal-toolkit-ritual-roll-field", we = "data-paranormal-toolkit-ritual-roll-action", As = `__${d}_ritualRollConfigBlockRegistered`, HS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], WS = [
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
function KS() {
  const e = globalThis;
  if (!e[As]) {
    YS();
    for (const t of HS)
      Hooks.on(t, (...n) => {
        XS(n[0], n[1]);
      });
    e[As] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function YS() {
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
function XS(e, t) {
  const n = uI(e);
  if (!n || n.type !== "ritual") return;
  const a = fI(t);
  if (!a) return;
  const r = a.querySelector('section[data-tab="ritualAttr"]');
  if (!r) return;
  ZS(r);
  const o = Fu(n), s = Gc(n), l = dI(n), c = JS(n, s, o, l);
  oI(c, n, o, l), QS(r, c), uo(c);
}
function QS(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function ZS(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Mu}]`)))
    t.remove();
}
function JS(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config`), r.setAttribute(Mu, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(Ts("strong", "Paranormal Toolkit")), s.append(Ts("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Uu(t) ? "Configurada" : "Rascunho", o.append(s, l), r.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", r.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(eI(t, a)), u.append(tI(t, a)), u.append(nI(t, a)), r.append(u), r.append(aI(t, n, a)), r.append(rI(a));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = a ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", r.append(m), r;
}
function eI(e, t) {
  const n = Nn("Tipo da rolagem"), a = document.createElement("select");
  a.setAttribute(wt, "intent"), a.disabled = !t;
  for (const r of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = r, o.textContent = KR(r), o.selected = e.intent === r, a.append(o);
  }
  return n.append(a), n;
}
function tI(e, t) {
  const n = Nn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const a = document.createElement("select");
  a.setAttribute(wt, "damageType"), a.disabled = !t;
  const r = document.createElement("option");
  r.value = "", r.textContent = "—", r.selected = !e.damageType, a.append(r);
  for (const o of WS) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, a.append(s);
  }
  return n.append(a), n;
}
function nI(e, t) {
  const n = Nn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const a = document.createElement("input");
  return a.type = "text", a.placeholder = "Resultado", a.value = e.utilityLabel ?? "Resultado", a.disabled = !t, a.setAttribute(wt, "utilityLabel"), n.append(a), n;
}
function aI(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config__forms-section`);
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-roll-config__forms-title`), r.textContent = "Fórmulas por forma", a.append(r);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(ma("base", "Padrão", e.forms.base.formula, !0, n)), o.append(ma("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(ma("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), a.append(o), a;
}
function ma(e, t, n, a, r) {
  const o = Nn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !r || !a, s.setAttribute(wt, `formula.${e}`), o.append(s), !a) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function rI(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(we, "save");
  const a = document.createElement("button");
  return a.type = "button", a.textContent = "Limpar", a.disabled = !e, a.setAttribute(we, "clear"), t.append(n, a), t;
}
function Nn(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Ts(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function oI(e, t, n, a) {
  et(e, "intent")?.addEventListener("change", () => uo(e)), $s(e, "system.studentForm")?.addEventListener("change", () => Rs(e, t)), $s(e, "system.trueForm")?.addEventListener("change", () => Rs(e, t)), e.querySelector(`[${we}="save"]`)?.addEventListener("click", () => {
    a && iI(e, t, n);
  }), e.querySelector(`[${we}="clear"]`)?.addEventListener("click", () => {
    a && sI(e, t);
  });
}
async function iI(e, t, n) {
  const a = e.querySelector(`[${we}="save"]`);
  a?.setAttribute("disabled", "true"), Ue(e, "Salvando configuração...");
  try {
    const r = lI(e, n);
    await HR(t, r), Ou(e, r), Ue(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", r), Ue(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    a?.removeAttribute("disabled");
  }
}
async function sI(e, t) {
  const n = e.querySelector(`[${we}="clear"]`);
  n?.setAttribute("disabled", "true"), Ue(e, "Limpando configuração...");
  try {
    await WR(t);
    const a = Gc(t);
    cI(e, a), Ou(e, a), Ue(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", a), Ue(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Ou(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Uu(t) ? "Configurada" : "Rascunho");
}
function lI(e, t) {
  return {
    schemaVersion: 1,
    intent: Bu(et(e, "intent")?.value),
    damageType: Es(e, "damageType"),
    utilityLabel: Es(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Kt(e, "formula.base") },
      discente: { formula: Kt(e, "formula.discente") },
      verdadeiro: { formula: Kt(e, "formula.verdadeiro") }
    }
  };
}
function cI(e, t) {
  De(e, "intent", t.intent), De(e, "damageType", t.damageType ?? ""), De(e, "utilityLabel", t.utilityLabel ?? "Resultado"), De(e, "formula.base", t.forms.base.formula), De(e, "formula.discente", t.forms.discente.formula), De(e, "formula.verdadeiro", t.forms.verdadeiro.formula), uo(e);
}
function uo(e) {
  const t = Bu(et(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), a = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const r of Array.from(n))
    r.hidden = t !== "damage";
  for (const r of Array.from(a))
    r.hidden = t !== "utility";
}
function Rs(e, t) {
  const n = Fu(t);
  ks(e, "discente", n.discente), ks(e, "verdadeiro", n.verdadeiro);
}
function ks(e, t, n) {
  const a = et(e, `formula.${t}`);
  if (!a) return;
  const r = !e.querySelector(`[${we}="save"]`)?.disabled;
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
function Ue(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Fu(e) {
  const t = mI(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function uI(e) {
  return ws(e.item) ? e.item : ws(e.document) ? e.document : null;
}
function dI(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function mI(e) {
  const t = e.system;
  return pI(t) ? t : {};
}
function $s(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function et(e, t) {
  return e.querySelector(`[${wt}="${gI(t)}"]`);
}
function Kt(e, t) {
  return et(e, t)?.value.trim() ?? "";
}
function Es(e, t) {
  const n = Kt(e, t);
  return n.length > 0 ? n : null;
}
function De(e, t, n) {
  const a = et(e, t);
  a && (a.value = n);
}
function Bu(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Uu(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function fI(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ws(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function pI(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function gI(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Z = null;
Hooks.once("init", () => {
  or("styles/components/chat-card-components.css"), or("styles/components/component-gallery.css"), Cm(), wd(), rm(), sp(), uT(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ro.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Ro.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Z = pS(), Z.itemUseIntegration.registerStrategies(), Qf(Z.resources, Z.resourceAdapter), ap(Z.conditions), Sm(Z), hT(), AS(Z), KS(), US(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function hI() {
  if (!Z)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Z;
}
export {
  hI as getToolkitServices
};
//# sourceMappingURL=main.js.map
