const d = "paranormal-toolkit", Pl = "Paranormal Toolkit", ym = "ordemparanormal";
class Ct {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function In(e) {
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
function g(e) {
  return { ok: !1, error: e };
}
function St(e) {
  const t = Lr(e);
  return t.ok ? y(t.value.definition) : t;
}
function Lr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? g({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : vr(t) ? y(t) : g({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Am(e) {
  return vr(e.getFlag(d, "automation"));
}
function vr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Tm(t.source) && _m(t.definition);
}
function _m(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Rm) && (t.ritualForms === void 0 || Sm(t.ritualForms)) && (t.conditionApplications === void 0 || xm(t.conditionApplications));
}
function Tm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Rm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return km(t);
    case "spendRitualCost":
      return Em(t);
    case "rollFormula":
      return $m(t);
    case "modifyResource":
      return wm(t);
    case "chatCard":
      return Cm(t);
    default:
      return !1;
  }
}
function km(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ml(t);
}
function Em(e) {
  return e.type === "spendRitualCost";
}
function $m(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || Um(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function wm(e) {
  const t = e;
  return t.type === "modifyResource" && Ol(t.actor) && Fm(t.resource) && Bm(t.operation) && Ml(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Cm(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Sm(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([a, r]) => n.has(a) && Im(r)
  );
}
function Im(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || zm(t.extraCost)) && (t.rollFormulaOverrides === void 0 || Gm(t.rollFormulaOverrides)) && (t.notes === void 0 || jm(t.notes)) && (t.targeting === void 0 || Lm(t.targeting));
}
function Lm(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Dm(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || vm(t.template));
}
function vm(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || Qo(t.distance)) && (t.width === void 0 || t.width === null || Qo(t.width));
}
function Dm(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function xm(e) {
  return Array.isArray(e) && e.every(Nm);
}
function Nm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Ol(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || Mm(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Pm(t.applyOnResistance));
}
function Pm(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Mm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || qm(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Om(t.expiry));
}
function Om(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ml(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Ol(e) {
  return e === "self" || e === "target";
}
function Fm(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Bm(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Um(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function qm(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function zm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Qo(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function jm(e) {
  return Array.isArray(e) && e.every(w);
}
function Gm(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function Dr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Zo);
    if (Wm(t))
      return Array.from(t).filter(Zo);
  }
  return [];
}
function Vm(e) {
  return Dr(e)[0] ?? null;
}
function Hm(e) {
  return Dr(e).find(Am) ?? null;
}
function Wm(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Zo(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function It(e) {
  return Dr(e).filter((t) => t.type === "ritual");
}
function Fl(e) {
  return It(e)[0] ?? null;
}
function Km(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(In);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ft("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Ft(t);
      if (!n) return [];
      const a = e.automationRegistry.findForItem(n).map(ti);
      return f.info(`Presets encontrados para ${n.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const n = ft("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const a = Ft(n);
      if (!a) return;
      const r = e.automationRegistry.require(t);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      const o = await Da(e, a, r.value);
      f.info(`Preset ${r.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ft("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Ft(t);
      if (!n) return;
      const a = e.automationRegistry.findForItem(n)[0];
      if (!a) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const r = await Da(e, n, a.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: ti(a), itemPatch: r }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Jo(e);
    },
    async applyBestPresetsToActorRituals() {
      return Jo(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ft("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Ft(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Jo(e) {
  const t = ft("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = It(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), ei(t);
  const a = ei(t, n.length);
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
    const i = await Da(e, r, o.preset);
    a.applied.push(Ym(r, o, i));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), Xm(a), a;
}
async function Da(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Ym(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: In(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function ei(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Xm(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function ti(e) {
  return {
    preset: In(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ft(e) {
  const t = Ct.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ft(e) {
  const t = Fl(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ze(e) {
  return e ? {
    id: e.id,
    source: {
      ...Qm(e.sourceActor),
      token: e.sourceToken
    },
    item: Zm(e.item),
    targets: e.targets.map(Jm),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: ni(e.rollRequests, Bl),
    rolls: ni(e.rolls, ef),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(xr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function xr(e) {
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
function Qm(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Zm(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Jm(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Bl(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ef(e) {
  return {
    ...Bl(e),
    total: e.total
  };
}
function ni(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, a]) => [n, t(a)]));
}
function tf(e) {
  return {
    getSelected() {
      return Ct.getSelectedActor();
    },
    logResources() {
      const t = ke(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await Fe(
        e,
        "Gasto de PE",
        ke("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Fe(
        e,
        "Gasto de PD",
        ke("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Fe(
        e,
        "Dano em PV",
        ke("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Fe(
        e,
        "Cura de PV",
        ke("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Fe(
        e,
        "Dano em SAN",
        ke("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Fe(
        e,
        "Recuperação de SAN",
        ke("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Fe(e, t, n, a) {
  if (!n) return;
  const r = await a(n);
  if (!r.ok) {
    nf(r.error);
    return;
  }
  const o = r.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (i) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, xr(o));
}
function ke(e) {
  const t = Ct.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function nf(e) {
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
const ie = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function af() {
  Bt(ie.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Bt(ie.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Bt(ie.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Bt(ie.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function xa() {
  return {
    enabled: Ut(ie.enabled),
    console: Ut(ie.console),
    ui: Ut(ie.ui),
    chat: Ut(ie.chat)
  };
}
async function de(e, t) {
  await game.settings.set(d, ie[e], t);
}
function Bt(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Ut(e) {
  return game.settings.get(d, e) === !0;
}
function rf() {
  return {
    status() {
      return xa();
    },
    async enable() {
      await de("enabled", !0);
    },
    async disable() {
      await de("enabled", !1);
    },
    async enableConsole() {
      await de("console", !0);
    },
    async disableConsole() {
      await de("console", !1);
    },
    async enableUi() {
      await de("ui", !0);
    },
    async disableUi() {
      await de("ui", !1);
    },
    async enableChat() {
      await de("chat", !0);
    },
    async disableChat() {
      await de("chat", !1);
    }
  };
}
const Ul = "ritual.costOnly", ql = "ritual.simpleHealing", of = "ritual.eletrocussao", sf = "ritual.definhar", zl = "ritual.simpleDamage", jl = "generic.simpleHealing", Gl = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, Nr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function lf() {
  return [
    cf(),
    uf(),
    df(),
    mf(),
    ff(),
    pf()
  ];
}
function cf() {
  return {
    id: Ul,
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
function uf() {
  return {
    id: ql,
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
    automation: Vl(),
    itemPatch: yf()
  };
}
function df() {
  return {
    id: of,
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
    automation: hf(),
    itemPatch: _f()
  };
}
function mf() {
  return {
    id: sf,
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
    automation: bf(),
    itemPatch: Af()
  };
}
function ff() {
  return {
    id: zl,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Pr()
  };
}
function pf() {
  return {
    id: jl,
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
function Vl(e = Gl) {
  const t = gf(e);
  return Hl(
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
function gf(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Gl,
    ...e
  };
}
function hf() {
  return {
    ...Pr("3d6", {
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
function bf() {
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
function Pr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", r = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Hl(
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
function yf() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Nr,
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
function Af() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: Nr,
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
function _f() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Nr,
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
function Hl(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: n
    })
  };
}
function Mr() {
  return Array.from(game.user?.targets ?? []).map(Wl);
}
function Wl(e) {
  return {
    tokenId: je(e.id),
    actorId: je(e.actor?.id),
    sceneId: je(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Kl() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: je(e.id),
    actorId: je(t?.id),
    sceneId: je(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function je(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Tf(e) {
  return {
    logFirstRitualCost() {
      const t = Ee("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = $e(t);
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
      const a = Ee("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const r = $e(a);
      if (r) {
        if (!Ef(t, n)) {
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
      const t = Ee("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = $e(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = Ee("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = $e(t);
      if (!n) return;
      const a = e.automationRegistry.require(Ul);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = Ee("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const a = $e(n);
      if (!a) return;
      if (!ai(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const r = e.automationRegistry.require(ql);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: Vl(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = Ee("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const a = $e(n);
      if (!a) return;
      if (!ai(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const r = e.automationRegistry.require(zl);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: Pr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = Ee("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = $e(t);
      n && await Rf(e, t, n);
    }
  };
}
async function Rf(e, t, n) {
  const a = St(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Kl(),
    item: n,
    targets: Mr()
  });
  if (!r.ok) {
    kf(r.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", ze(r.value.context));
}
function kf(e) {
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
function Ee(e) {
  const t = Ct.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function $e(e) {
  const t = Fl(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ef(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function ai(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const $f = ["strict", "open"], Yl = "strict";
function wf(e) {
  return $f.includes(e) ? e : Yl;
}
function Cf(e) {
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
function Ln(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Sf = ["disabled", "ask", "automatic"], If = ["buttons", "confirm"], Xl = "ask";
function Lf(e) {
  return typeof e == "string" && Sf.includes(e);
}
function vf(e) {
  return typeof e == "string" && If.includes(e);
}
function Df(e) {
  return Lf(e) ? e : vf(e) ? "ask" : Xl;
}
const xf = ["keep", "replace"], Nf = ["manual", "assisted"], Pf = ["auto", "legacy"], Ql = "keep", Zl = "assisted", Mf = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled",
  ritualChatCardMode: "ritual.chatCard.mode"
};
function Of() {
  game.settings.register(d, N.executionMode, {
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
    default: Xl
  }), game.settings.register(d, N.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Ql
  }), game.settings.register(d, N.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Zl
  }), game.settings.register(d, N.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Yl
  }), game.settings.register(d, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Mf
  }), game.settings.register(d, N.ritualChatCardMode, {
    name: "Card de ritual do Paranormal Toolkit",
    hint: "Tenta usar o novo card para rituais com um alvo ou mantém sempre o card legado.",
    scope: "world",
    config: !0,
    type: String,
    choices: { auto: "Automático", legacy: "Legado" },
    default: "auto"
  }), game.settings.register(d, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Na() {
  const e = Df(game.settings.get(d, N.executionMode)), t = tc(game.settings.get(d, N.systemCardMode)), n = nc(game.settings.get(d, N.damageResolutionMode)), a = Fr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: a,
    ritualCastingCheckEnabled: ec(),
    ritualChatCardMode: Jl()
  };
}
function Jl() {
  const e = game.settings.get(d, N.ritualChatCardMode);
  return Pf.includes(e) ? e : "auto";
}
function Or() {
  return tc(game.settings.get(d, N.systemCardMode));
}
function Ff() {
  return nc(game.settings.get(d, N.damageResolutionMode));
}
function Fr() {
  return wf(game.settings.get(d, N.resistanceGateMode));
}
function ec() {
  return game.settings.get(d, N.ritualCastingCheckEnabled) === !0;
}
async function we(e) {
  await game.settings.set(d, N.executionMode, e);
}
function tc(e) {
  return xf.includes(e) ? e : Ql;
}
function nc(e) {
  return Nf.includes(e) ? e : Zl;
}
function Bf(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await we("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await we("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await we(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await we("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await we("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await we("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await we("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Uf = [
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
function qf(e) {
  return {
    phases() {
      return Uf;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ta("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Hm(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ri(e, t, n);
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
      if (!Gf(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = jf(n) ?? ta("Nenhum ator encontrado para executar automação do item.");
      a && await ri(e, a, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ta("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Vm(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(jl);
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
async function ri(e, t, n) {
  const a = St(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Kl(),
    item: n,
    targets: Mr()
  });
  if (!r.ok) {
    zf(r.error);
    return;
  }
  f.info("Automação executada com sucesso.", ze(r.value.context));
}
function zf(e) {
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
function ta(e) {
  const t = Ct.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function jf(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Gf(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Vf(e) {
  const t = tf(e), n = Km(e), a = Tf(e), r = qf(e), o = rf(), i = Bf(e);
  return {
    actor: t,
    automation: n,
    ritual: a,
    workflow: r,
    output: o,
    itemUseIntegration: i,
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
const Xt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function Hf(e) {
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
      const a = oi();
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
      return Wf(r), r;
    },
    removeFromSelectedTokens: async (t) => {
      const n = oi();
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
      return Kf(a), a;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function oi() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = n.actor ?? n.document?.actor ?? null;
    if (!a) continue;
    const o = a.uuid ?? null ?? a.id ?? a.name ?? `selected-${t.size}`;
    t.set(o, a);
  }
  return Array.from(t.values());
}
function Wf(e) {
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
function Kf(e) {
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
function R(e) {
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
function Yf(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${R(e.label)}</span>`;
}
const Xf = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function Qf(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${R(t)}" alt="${R(e?.alt ?? "")}">` : Xf;
}
function ac(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${R(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(Yf).join("")}</div>` : "", a = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${R(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${Qf(e.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${R(e.title)}</span>${t}
      </div>${n}
    </div>${a}
  </div>
</header>`;
}
function U(e) {
  return `<article class="paranormal-toolkit-chat-card-shell">${e.content}</article>`;
}
const Zf = '<i class="paranormal-toolkit-dice-action-button__icon fa-solid fa-dice-d20" aria-hidden="true"></i>';
function rc(e) {
  const t = e.disabled ? " disabled" : "", n = e.actionId ? ` data-paranormal-toolkit-card-action="roll-resistance" data-paranormal-toolkit-action-id="${R(e.actionId)}"` : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${R(e.ariaLabel)}"${n}${t}>${Zf}</button>`;
}
function oc(e) {
  const t = e.label.trim();
  return t ? `<button class="paranormal-toolkit-assisted-action-button" type="button"${e.actionId && e.actionKind ? ` data-paranormal-toolkit-card-action="${R(e.actionKind)}" data-paranormal-toolkit-action-id="${R(e.actionId)}"` : ""}${e.disabled ? " disabled" : ""}>${R(t)}</button>` : "";
}
function Jf(e) {
  const t = e.label.trim();
  return t ? `<span class="paranormal-toolkit-completion-indicator"><span class="paranormal-toolkit-completion-indicator__check" aria-hidden="true">✓</span><span class="paranormal-toolkit-completion-indicator__label">${R(t)}</span></span>` : "";
}
function ic(e) {
  const t = e.label.trim(), n = e.description.trim();
  if (!t || !n) return "";
  const a = e.control.state === "completed" ? Jf(e.control.indicator) : oc({ ...e.control.button, disabled: e.control.state === "disabled" });
  if (!a) return "";
  const r = ep(e.details);
  return `<div class="paranormal-toolkit-assisted-action-row"><div class="paranormal-toolkit-assisted-action-row__content"><span class="paranormal-toolkit-assisted-action-row__label">${R(t)}</span><span class="paranormal-toolkit-assisted-action-row__description">${R(n)}</span>${r}</div><div class="paranormal-toolkit-assisted-action-row__control">${a}</div></div>`;
}
function ep(e) {
  const t = e?.items.map((a) => a.trim()).filter(Boolean) ?? [];
  return t.length ? `<details class="paranormal-toolkit-assisted-action-row__details"><summary><span class="paranormal-toolkit-assisted-action-row__details-show">Ver efeitos</span><span class="paranormal-toolkit-assisted-action-row__details-hide">Ocultar efeitos</span></summary><ul>${t.map((a) => `<li>${R(a)}</li>`).join("")}</ul></details>` : "";
}
function sc(e) {
  const t = e.label.trim(), n = e.detailHtml.trim();
  return !t || !n ? "" : `<div class="paranormal-toolkit-metadata-detail-row"><span class="paranormal-toolkit-metadata-detail-row__accent" aria-hidden="true"></span><div class="paranormal-toolkit-metadata-detail-row__content"><span class="paranormal-toolkit-metadata-detail-row__label">${R(t)}</span><span class="paranormal-toolkit-metadata-detail-row__detail">${n}</span></div></div>`;
}
const ii = {
  section: "paranormal-toolkit-roll-row__result--section",
  success: "paranormal-toolkit-roll-row__result--success",
  failure: "paranormal-toolkit-roll-row__result--failure"
};
function tp(e) {
  return ii[e ?? "section"] ?? ii.section;
}
function np(e) {
  const t = `<span class="paranormal-toolkit-roll-row__formula-text">${R(e.formula)}</span>`;
  if (!e.diceResults?.length)
    return `<div class="paranormal-toolkit-roll-row__formula paranormal-toolkit-roll-row__formula--static">${t}</div>`;
  const n = e.diceResults.map(
    (r) => `<span class="paranormal-toolkit-roll-row__die">${R(String(r))}</span>`
  ).join("");
  return `<details class="paranormal-toolkit-roll-row__details"${e.expanded ? " open" : ""}>
  <summary class="paranormal-toolkit-roll-row__formula">${t}<span class="paranormal-toolkit-roll-row__chevron" aria-hidden="true"></span></summary>
  <div class="paranormal-toolkit-roll-row__breakdown" aria-label="Resultados dos dados">${n}</div>
</details>`;
}
function Lt(e) {
  const t = e.total !== void 0, n = t ? "with-result" : "without-result", a = t ? R(String(e.total)) : "", r = t ? `<output class="paranormal-toolkit-roll-row__result ${tp(e.resultTone)}" aria-label="Resultado: ${a}">${a}</output>` : "";
  return `<div class="paranormal-toolkit-roll-row paranormal-toolkit-roll-row--${n}">${np(e)}${r}</div>`;
}
const si = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  healing: "paranormal-toolkit-section-card--healing",
  resistance: "paranormal-toolkit-section-card--resistance",
  success: "paranormal-toolkit-section-card--success",
  failure: "paranormal-toolkit-section-card--failure"
};
function ap(e) {
  return si[e] ?? si.casting;
}
function Ae(e) {
  return `<section class="paranormal-toolkit-section-card ${ap(e.tone)}">${e.content}</section>`;
}
function _e(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${R(e.title)}</span>${t}</div>`;
}
const li = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure"
}, rp = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA"
};
function vt(e) {
  const t = li[e.state] ? e.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${li[t]}">${rp[t]}</span>`;
}
function lc(e) {
  const t = R(String(e.difficultyClass)), n = `<p class="paranormal-toolkit-ritual-conjuration-section__result-description"><span class="paranormal-toolkit-ritual-conjuration-section__skill">${R(e.skillLabel)}</span> <span class="paranormal-toolkit-ritual-conjuration-section__comparison">contra</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">DT ${t}</strong></p>`, a = e.consequence?.trim(), r = a ? `<p class="paranormal-toolkit-ritual-conjuration-section__consequence"><span class="paranormal-toolkit-ritual-conjuration-section__consequence-label">Consequência:</span> ${R(a)}</p>` : "", o = _e({
    title: "Conjuração",
    trailing: vt({ state: e.status })
  }) + n + Lt({
    formula: e.formula,
    total: e.total,
    resultTone: e.status,
    diceResults: e.diceResults,
    expanded: e.expanded
  }) + r;
  return Ae({ tone: "casting", content: o });
}
function cc(e) {
  const t = e.damageType.trim(), n = t ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${R(t)}</span>` : void 0, a = _e({ title: "Dano", trailing: n }) + Lt({
    formula: e.formula,
    total: e.total,
    resultTone: "section",
    diceResults: e.diceResults,
    expanded: e.expanded
  });
  return Ae({ tone: "damage", content: a });
}
function uc(e) {
  const t = e.status === "success" || e.status === "failure" ? e.status : null, n = _e({
    title: "Resistência",
    trailing: t ? vt({ state: t }) : void 0
  }), a = `<p class="paranormal-toolkit-ritual-resistance-section__summary"><strong class="paranormal-toolkit-ritual-resistance-section__metric">${R(e.skill)}</strong> <span>contra</span> <strong class="paranormal-toolkit-ritual-resistance-section__metric">${R(e.difficultyLabel)}</strong></p>`, r = e.status === "pending" && e.description?.trim() ? `<p class="paranormal-toolkit-ritual-resistance-section__description">${R(e.description)}</p>` : "", o = e.result ? Lt({ formula: e.result.formula, total: e.result.total, diceResults: e.result.diceResults, resultTone: t ?? "section" }) : "", l = `<div class="paranormal-toolkit-ritual-resistance-section${e.result ? " paranormal-toolkit-ritual-resistance-section--resolved" : ""}"><div class="paranormal-toolkit-ritual-resistance-section__text">${n}${a}${r}${o}</div>${e.result ? "" : rc(e.action)}</div>`;
  return Ae({ tone: "resistance", content: l });
}
function op(e) {
  const t = e.typeLabel?.trim() ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${R(e.typeLabel)}</span>` : void 0;
  return Ae({
    tone: e.title === "Dano" ? "damage" : e.title === "Cura" ? "healing" : "casting",
    content: _e({ title: e.title, trailing: t }) + Lt(e)
  });
}
function ip(e) {
  const t = e.text.trim();
  return t ? `<span class="paranormal-toolkit-metadata-pill">${R(t)}</span>` : "";
}
function dc(e) {
  const t = e.items.map(ip).filter(Boolean);
  return t.length === 0 ? "" : `<div class="paranormal-toolkit-ritual-metadata">${t.join("")}</div>`;
}
function mc(e) {
  const t = e.rows.map(ic).filter(Boolean);
  return t.length ? `<section class="paranormal-toolkit-ritual-assisted-actions-panel"><h4 class="paranormal-toolkit-ritual-assisted-actions-panel__title">AÇÕES ASSISTIDAS</h4><div class="paranormal-toolkit-ritual-assisted-actions-panel__rows">${t.join("")}</div></section>` : "";
}
function sp(e) {
  const t = e.html.trim();
  return t ? `<details class="paranormal-toolkit-ritual-description-section"><summary class="paranormal-toolkit-ritual-description-section__summary">Descrição</summary><div class="paranormal-toolkit-ritual-description-section__content">${t}</div></details>` : "";
}
function fc(e) {
  const t = [
    ac(e.header),
    e.description ? sp(e.description) : "",
    e.metadata ? dc(e.metadata) : "",
    ...e.detailRows?.map(sc) ?? [],
    e.conjuration ? lc(e.conjuration) : "",
    e.damage ? cc(e.damage) : "",
    e.effect ? op(e.effect) : "",
    e.resistance ? uc(e.resistance) : "",
    e.assistedActions ? mc(e.assistedActions) : ""
  ].filter(Boolean).join("");
  return U({
    content: `<div class="paranormal-toolkit-ritual-single-target-card">${t}</div>`
  });
}
const pc = "devChatCardExample", lp = "devChatCardHeaderExample";
function O() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function cp() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", a = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", r = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof r == "string" ? { src: r, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${a}`
  };
}
function up(e) {
  return e === "runtime" ? cp() : e === "ability" ? {
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
function dp(e) {
  switch (e) {
    case "casting-title":
      return { tone: "casting", title: "Conjuração" };
    case "casting-badge":
      return {
        tone: "casting",
        title: "Conjuração",
        trailing: vt({ state: "success" })
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
function mp(e) {
  const t = dp(e);
  return U({
    content: Ae({
      tone: t.tone,
      content: _e({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function fp(e) {
  return U({
    content: Ae({
      tone: "casting",
      content: _e({
        title: "Conjuração",
        trailing: vt({ state: e })
      })
    })
  });
}
function pp(e) {
  const t = e === "disabled";
  return U({
    content: Ae({
      tone: "resistance",
      content: _e({
        title: "Resistência",
        trailing: rc({
          ariaLabel: t ? "Resistência indisponível" : "Rolar resistência",
          disabled: t
        })
      })
    })
  });
}
function gp(e) {
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
  }, o = n ? "damage" : t ? "casting" : "resistance", i = n ? "Dano" : t ? "Conjuração" : "Resistência", l = n ? '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>' : t ? vt({ state: a ? "failure" : "success" }) : void 0;
  return U({
    content: Ae({
      tone: o,
      content: _e({ title: i, trailing: l }) + Lt(r)
    })
  });
}
function hp(e) {
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
function bp(e) {
  return U({
    content: lc(hp(e))
  });
}
function yp(e) {
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
function Ap(e) {
  return U({
    content: cc(yp(e))
  });
}
function _p(e) {
  return e === "disabled" ? {
    skill: "Reflexos",
    difficultyLabel: "DT 18",
    description: "evita o efeito",
    status: "pending",
    action: { ariaLabel: "Resistência indisponível", disabled: !0 }
  } : {
    skill: "Fortitude",
    difficultyLabel: "DT 22",
    description: e === "long" ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados" : "reduz dano à metade",
    status: "pending",
    action: { ariaLabel: "Rolar resistência de Fortitude" }
  };
}
function Tp(e) {
  return U({
    content: uc(_p(e))
  });
}
function Rp(e) {
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
function kp(e) {
  return U({
    content: dc(Rp(e))
  });
}
function Ep(e) {
  return U({ content: sc(e === "generic" ? { label: "Alcance:", detailHtml: "Médio · até 15 metros" } : e === "long" ? {
    label: "Resistência:",
    detailHtml: "Reflexos · <strong>DT 24</strong> · evita completamente os efeitos do ritual"
  } : {
    label: "Resistência:",
    detailHtml: "Fortitude · <strong>DT 22</strong> · reduz dano à metade"
  }) });
}
function Qt(e) {
  if (e === "completed") return { label: "Dano", description: "9 de dano aplicado em Malvadão.", control: { state: "completed", indicator: { label: "Aplicado" } } };
  const t = e === "disabled";
  return {
    label: "Dano",
    description: t ? "Aguardando a resistência do alvo." : "A resistência falhou. Aplique o dano completo.",
    control: { state: t ? "disabled" : "active", button: { label: t ? "Aguardando resistência" : "Aplicar 9 de dano" } }
  };
}
function gc(e) {
  if (e === "completed") return { rows: [
    Qt("completed"),
    { label: "Efeito", description: "Vulnerável aplicado em Malvadão.", control: { state: "completed", indicator: { label: "Aplicado" } } }
  ] };
  if (e === "damage-only") return { rows: [Qt("active")] };
  const t = e === "pending";
  return { rows: [
    Qt(t ? "disabled" : "active"),
    {
      label: "Efeito",
      description: t ? "Aguardando resistência antes da aplicação." : "Vulnerável · 1 rodada",
      control: { state: t ? "disabled" : "active", button: { label: t ? "Aguardando resistência" : "Aplicar efeito" } }
    }
  ] };
}
function $p(e) {
  const t = e === "disabled";
  return U({ content: oc({ label: t ? "Aguardando resistência" : "Aplicar 9 de dano", disabled: t }) });
}
function wp(e) {
  return U({ content: ic(Qt(e)) });
}
function Cp(e) {
  return U({ content: mc(gc(e)) });
}
function Sp(e) {
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
        { text: "Alcance: Uma distância paranormal excepcionalmente longa para validar a quebra defensiva" },
        { text: "Duração: Enquanto a concentração do conjurador for mantida" }
      ] : [
        { text: "1 PE gasto" },
        { text: "Alvo: 1 Ser" },
        { text: t ? "Alcance: Pessoal" : "Alcance: Curto" },
        { text: "Duração: Instantânea" }
      ]
    },
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
      description: n ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados" : "reduz dano à metade",
      status: "pending",
      action: { ariaLabel: "Rolar resistência de Fortitude" }
    },
    assistedActions: !t && !n ? gc("pending") : void 0
  };
}
function F(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [d]: { [pc]: t } }
  });
}
function Ip() {
  const e = async () => {
    O();
    const n = (game.messages.contents ?? []).filter(
      (a) => typeof a.getFlag?.(d, pc) == "string" || a.getFlag?.(d, lp) === !0
    );
    await Promise.all(
      n.map(
        (a) => a.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return O(), F(
        U({
          content: ac(up(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      O();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (a) => F(mp(a), "section")
        )
      );
    },
    async postStatusBadgeExample(t) {
      O();
      const n = t === "both" ? ["success", "failure"] : [t];
      return Promise.all(
        n.map(
          (a) => F(fp(a), "status")
        )
      );
    },
    async postDiceActionButtonExample(t) {
      O();
      const n = t === "all" ? ["enabled", "disabled"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            pp(a),
            "dice-action-button"
          )
        )
      );
    },
    async postRollRowExample(t) {
      O();
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
          (a) => F(gp(a), "roll-row")
        )
      );
    },
    async postRitualConjurationSectionExample(t) {
      O();
      const n = t === "all" ? ["success", "failure", "failure-consequence", "expanded"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            bp(a),
            "ritual-conjuration"
          )
        )
      );
    },
    async postRitualDamageSectionExample(t) {
      O();
      const n = t === "all" ? ["collapsed", "expanded", "without-result", "long-type"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            Ap(a),
            "ritual-damage"
          )
        )
      );
    },
    async postRitualResistanceSectionExample(t) {
      O();
      const n = t === "all" ? ["enabled", "disabled", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            Tp(a),
            "ritual-resistance"
          )
        )
      );
    },
    async postRitualMetadataExample(t) {
      O();
      const n = t === "all" ? ["default", "partial", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            kp(a),
            "ritual-metadata"
          )
        )
      );
    },
    async postMetadataDetailRowExample(t) {
      O();
      const n = t === "all" ? ["short", "long", "generic"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            Ep(a),
            "metadata-detail-row"
          )
        )
      );
    },
    async postRitualSingleTargetCardExample(t) {
      O();
      const n = t === "all" ? ["success", "failure", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            fc(Sp(a)),
            "ritual-single-target-card"
          )
        )
      );
    },
    async postAssistedActionButtonExample(t) {
      O();
      const n = t === "all" ? ["active", "disabled"] : [t];
      return Promise.all(n.map((a) => F($p(a), "assisted-action-button")));
    },
    async postAssistedActionRowExample(t) {
      O();
      const n = t === "all" ? ["active", "disabled", "completed"] : [t];
      return Promise.all(n.map((a) => F(wp(a), "assisted-action-row")));
    },
    async postRitualAssistedActionsPanelExample(t) {
      O();
      const n = t === "all" ? ["pending", "available", "completed", "damage-only"] : [t];
      return Promise.all(n.map((a) => F(Cp(a), "ritual-assisted-actions-panel")));
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function Lp(e) {
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
    conditions: Hf(e.conditions),
    debug: Vf(e),
    dev: Ip(),
    hooks: Xt
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const a = game.modules.get(d);
  return a && (a.api = t), t;
}
class ci {
  static isSupportedSystem() {
    return game.system.id === ym;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const na = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function vp(e) {
  if (!Op(e.item)) return null;
  const t = Pa(e.actor) ? e.actor : Dp(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Np(e.token) ?? xp(t),
    targets: Mr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Dp(e) {
  const t = e;
  return Pa(t.actor) ? t.actor : Pa(e.parent) ? e.parent : null;
}
function xp(e) {
  const t = Pp(e) ?? Mp(e);
  return t ? hc(t) : null;
}
function Np(e) {
  return Ma(e) ? hc(e) : null;
}
function Pp(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Ma(n) ? n : (t.getActiveTokens?.() ?? []).find(Ma) ?? null;
}
function Mp(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function hc(e) {
  const t = e.actor ?? null;
  return {
    tokenId: aa(e.id),
    actorId: aa(t?.id),
    sceneId: aa(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Op(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Pa(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Ma(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function aa(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class bc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(na.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${na.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = vp(Fp(t));
    if (!n) {
      f.warn(`${na.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Fp(e) {
  return e && typeof e == "object" ? e : {};
}
function cn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Br() {
  const e = globalThis.game;
  return vn(e) ? e : null;
}
function Q(e, t) {
  const n = Bp(e, t);
  return Zt(n);
}
function Bp(e, t) {
  return t.split(".").reduce((n, a) => vn(n) ? n[a] : null, e);
}
function Up(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Tt(e.slice(0, n)) !== Tt(t) ? null : rt(e.slice(n + 1));
}
function Zt(e) {
  return typeof e == "string" ? rt(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function vn(e) {
  return !!e && typeof e == "object";
}
function qp(e) {
  return typeof e == "string";
}
function Dn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function rt(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Tt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Oa(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function be(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function yc(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const un = "abilityRollConfig", Ac = [
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
], Fa = 20, Ba = 20, zp = [10, 40, 65, 99];
function _c() {
  return {
    schemaVersion: 1,
    rolls: [Tc(1)]
  };
}
function Tc(e) {
  return {
    id: Gp(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function jp() {
  return zp.map((e) => ({ minNex: e, formula: "" }));
}
function Gp() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Rc(e) {
  return Ur(
    e.getFlag(d, un)
  );
}
function Vp(e) {
  return Rc(e) ?? _c();
}
async function Hp(e, t) {
  const n = Ur(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, un, n), n;
}
async function Wp(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, un)
    );
    return;
  }
  await e.setFlag(d, un, null);
}
function Ur(e) {
  if (!Xe(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, Fa).map((a, r) => Jp(a, r, t)).filter((a) => a !== null)
  };
}
function Kp(e, t) {
  const n = Rc(t);
  return n ? Yp(n, Xp(e)) : [];
}
function Yp(e, t) {
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
    const i = a.formula.resolution === "choose-unlocked" ? r : [o];
    for (const l of i)
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
function Xp(e) {
  const t = Xe(e.system) ? e.system : {}, n = t.NEX ?? t.nex, a = Xe(n) ? n.value : n, r = typeof a == "number" ? a : Number(a);
  return Number.isFinite(r) ? Ec(r) : 0;
}
function kc(e) {
  return Ac.find((t) => t.value === e)?.label ?? e;
}
function Qp(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function Zp(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function Jp(e, t, n) {
  if (!Xe(e)) return null;
  const a = `roll-${t + 1}`, r = og(rg(e.id, a), n), o = ng(e.intent), i = eg(e.formula);
  return !o || !i ? null : {
    id: r,
    label: xn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? ig(e.damageType) : null,
    formula: i
  };
}
function eg(e) {
  if (!Xe(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: xn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, Ba).map(tg).filter((a) => a !== null) : [];
  t.sort((a, r) => a.minNex - r.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const a of t) n.set(a.minNex, a);
  return {
    mode: "nex",
    resolution: ag(e.resolution),
    steps: [...n.values()]
  };
}
function tg(e) {
  if (!Xe(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: Ec(t),
    formula: xn(e.formula)
  } : null;
}
function ng(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function ag(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function rg(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function og(e, t) {
  let n = e, a = 2;
  for (; t.has(n); )
    n = `${e}-${a}`, a += 1;
  return t.add(n), n;
}
function Ec(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function xn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function ig(e) {
  const t = xn(e);
  return t.length > 0 ? t : null;
}
function Xe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const qr = "data-paranormal-toolkit-ability-roll-id";
function sg(e) {
  if (!$c(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = pe(e.actorUuid), n = pe(e.itemUuid), a = pe(e.abilityName);
  if (!t) return null;
  const r = e.rolls.map(lg).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: a || "Habilidade",
    rolls: r,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: ra(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: ra(e.resourceBefore),
    resourceAfter: ra(e.resourceAfter)
  };
}
function lg(e) {
  if (!$c(e)) return null;
  const t = pe(e.id), n = pe(e.sourceRollId), a = pe(e.label), r = pe(e.formula), o = cg(e.intent);
  if (!t || !n || !a || !r || !o) return null;
  const i = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: a,
    formula: r,
    intent: o,
    damageType: o === "damage" ? ug(e.damageType) : null,
    nexThreshold: i
  };
}
function cg(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function pe(e) {
  return typeof e == "string" ? e.trim() : "";
}
function ug(e) {
  const t = pe(e);
  return t.length > 0 ? t : null;
}
function ra(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function $c(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const di = "paranormalToolkitAbilityRollBound";
let mi = !1;
function dg() {
  if (mi) return;
  mi = !0;
  const e = (t, n) => {
    mg(t, cn(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function mg(e, t) {
  if (!t) return 0;
  const n = `[${qr}]`, a = Tg(t, n);
  let r = 0;
  for (const o of a)
    o.dataset[di] !== "true" && (o.dataset[di] = "true", o.addEventListener("click", () => {
      fg(e, o);
    }), r += 1);
  return r;
}
async function fg(e, t) {
  const n = t.getAttribute(qr)?.trim();
  if (!n) return;
  const a = pg(e), r = a?.rolls.find((l) => l.id === n);
  if (!a || !r) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await gg(a.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!yg(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const i = hg();
  if (!i) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  fi(t, !0);
  try {
    const l = new i(
      r.formula,
      bg(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: Ag(a.abilityName, r)
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
    fi(t, !1);
  }
}
function pg(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : sg(
    t.getFlag(d, "abilityUse")
  );
}
async function gg(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if (pi(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, r = game.actors?.get?.(n);
  return pi(r) ? r : null;
}
function hg() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function bg(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function yg(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function Ag(e, t) {
  const n = [_g(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${oa(e)}</strong>
      <span>${oa(t.label)}</span>
      <small>${oa(n.join(" · "))}</small>
    </div>
  `;
}
function _g(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${kc(e.damageType)}` : "Dano";
  }
}
function Tg(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function fi(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function pi(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function oa(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const Rg = "paranormal-toolkit-chat-message--full-width-card", gi = ".paranormal-toolkit-ability-card", hi = "li.chat-message";
let bi = !1;
function kg() {
  if (bi) return;
  bi = !0;
  const e = Hooks, t = (n, a) => {
    yi(cn(a));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), yi(document);
}
function yi(e) {
  if (!e) return 0;
  const t = zr(e), n = Eg(t), a = /* @__PURE__ */ new Set();
  for (const r of n) {
    const o = $g(t, r);
    o?.classList && a.add(o);
  }
  for (const r of a)
    r.classList?.add(Rg);
  return a.size;
}
function Eg(e) {
  const t = [];
  e.matches?.(gi) && t.push(e);
  const n = e.querySelectorAll?.(gi);
  if (!n) return t;
  for (const a of Array.from(n)) {
    const r = zr(a);
    t.includes(r) || t.push(r);
  }
  return t;
}
function $g(e, t) {
  if (e.matches?.(hi)) return e;
  const n = t.closest?.(hi);
  return n ? zr(n) : null;
}
function zr(e) {
  return e && typeof e == "object" ? e : {};
}
function wg(e) {
  const t = Cg(e.cost), n = Sg(e.currentResource), a = t > 0 && !e.passive, r = n >= t;
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
function Cg(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Sg(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Ig } = foundry.applications.api;
class yt extends Ig {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = wg(t), this.spendResource = this.model.cost.spendResourceChecked;
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
      useAbility: yt.onUseAbility,
      cancel: yt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new yt(t, n).render({ force: !0 });
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
          src="${Lg(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${V(this.model.header.eyebrow)}</p>
          <h2>${V(this.model.header.title)}</h2>
          <p>${V(this.model.header.subtitle)}</p>
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
          <span data-paranormal-toolkit-ability-submit-label>${V(this.model.primaryActionLabel)}</span>
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
            <span>${V(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${V(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${V(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${V(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${t}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${V(this.model.cost.resource)} suficiente para pagar este custo.</span>
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
          <div><dt>Personagem</dt><dd>${V(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${V(t)}</p>
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
    ), i = this.model.cost.hasCost && this.spendResource && !this.model.cost.canSpend;
    n && (n.disabled = i), o && (o.hidden = !i), r && (r.textContent = this.spendResource ? this.model.cost.afterText : "Não será alterado"), a && !this.model.passive && (a.textContent = this.model.cost.hasCost ? this.spendResource ? "Usar habilidade" : "Usar sem gastar" : this.model.primaryActionLabel);
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
function V(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Lg(e) {
  return V(e);
}
function vg(e, t) {
  const n = Og(t.system), a = dn(n.activation), r = Pg(a), o = xg();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Fg(t),
    activation: a,
    activationLabel: Ng(a),
    description: dn(n.description),
    chatDescription: Dg(
      n.chatDescription,
      n.description
    ),
    cost: r ? 0 : Mg(n.cost),
    resource: o,
    passive: r,
    rolls: Kp(e, t)
  };
}
function Dg(e, t) {
  const n = dn(e);
  return n.trim().length > 0 ? n : dn(t);
}
function xg() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Ng(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, a = Bg()?.(t) ?? t;
  return a === t ? e : a;
}
function Pg(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Mg(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Og(e) {
  return e && typeof e == "object" ? e : {};
}
function dn(e) {
  return typeof e == "string" ? e : "";
}
function Fg(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Bg() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Ug {
  async publish(t, n, a) {
    const r = await Hg(n), o = qg({
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
    }), i = {
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
          abilityUse: i
        }
      }
    }, c = Vg(t.message);
    if (Or() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function qg(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, a = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", r = zg(e.rolls), o = Gg(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${Ua(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${fe(e.abilityName)}</h3>
          <p>${fe(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${fe(e.activationLabel)}</span>
        <span><strong>Custo</strong>${fe(t)}</span>
      </div>

      ${r}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${a}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${fe(n)}</span>
      </footer>
    </article>
  `;
}
function zg(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const a = `paranormal-toolkit-ability-card__roll--${n.intent}`, r = jg(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${a}"
          ${qr}="${Ua(n.id)}"
          title="${Ua(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${fe(n.label)}</strong>
            <small>${fe(r)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function jg(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${kc(e.damageType)}` : "Dano";
  }
}
function Gg(e) {
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
function Vg(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function fe(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Ua(e) {
  return fe(e);
}
async function Hg(e) {
  const t = e.chatDescription || e.description, n = Wg();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: Kg(e.actor)
  });
}
function Wg() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function Kg(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Yg {
  constructor(t, n, a = new Ug()) {
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
    if (!Xg(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const a = vg(n, t.item), r = this.readCurrentResource(a);
    if (!r.ok)
      return this.fail(
        "resource-unavailable",
        r.message
      );
    const o = await yt.request({
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
    let i = r.value, l = i, c = !1;
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
      i = u.value.before.value, l = u.value.after.value, c = !0;
    }
    try {
      await this.chatCards.publish(t, a, {
        spentResource: c,
        resourceBefore: i,
        resourceAfter: l
      });
    } catch (u) {
      const m = await this.restoreSpentResource(
        a,
        c,
        i
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
function Xg(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Ai = 1e3;
class Qg {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Yg(t, n), this.strategy = new bc(
      (a) => this.handleItemUsed(a)
    );
  }
  register() {
    this.strategy.register(), kg(), dg(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (Na().executionMode === "disabled" || !Jg(t.item)) return;
    const n = eh(t);
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
    return n !== void 0 && Date.now() - n < Ai;
  }
  pruneRecentExecutions() {
    const t = Date.now() - Ai;
    for (const [n, a] of this.recentExecutions)
      a < t && this.recentExecutions.delete(n);
  }
}
function Zg(e, t) {
  const n = new Qg(e, t);
  return n.register(), n;
}
function Jg(e) {
  if (e.type !== "ability") return !1;
  const t = Lr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function eh(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let _i = !1, ia = !1, sa = !1, qt = null;
const th = 1e3, nh = 750, ah = 1e3;
function rh(e) {
  _i || (Hooks.on("combatTurnChange", (t) => {
    ih(e, Ti(t));
  }), Hooks.on("deleteCombat", (t) => {
    sh(e, Ti(t));
  }), _i = !0, oh(e));
}
function oh(e) {
  Nn() && (ia || (ia = !0, globalThis.setTimeout(() => {
    ia = !1, jr(e, "ready");
  }, th)));
}
function ih(e, t) {
  Nn() && t && (qt && globalThis.clearTimeout(qt), qt = globalThis.setTimeout(() => {
    qt = null, jr(e, "combat-turn-change", t);
  }, nh));
}
function sh(e, t) {
  Nn() && t && (sa || (sa = !0, globalThis.setTimeout(() => {
    sa = !1, jr(e, "combat-deleted", t);
  }, ah)));
}
async function jr(e, t, n) {
  if (Nn())
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
function Nn() {
  return game.user?.isGM === !0;
}
function Ti(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const wc = {
  enabled: "dice.animations.enabled"
};
function lh() {
  game.settings.register(d, wc.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function ch() {
  return {
    enabled: game.settings.get(d, wc.enabled) === !0
  };
}
const Pn = "chatCard", Ri = "data-paranormal-toolkit-prompt-id", s = `${d}-item-use-prompt`, uh = `.${s}__title`, Cc = `.${s}__header`, dh = `.${s}__roll-card`, mh = `.${s}__roll-meta`, fh = `.${s}__roll-meta-pill`, Gr = `.${s}__resistance`, ph = `.${s}__resistance-header`, Sc = `.${s}__resistance-description`, Mn = `.${s}__resistance-roll-button`, Ic = `.${s}__resistance-roll-result`, ki = `${s}__resistance-content`, Lc = `.${s}__workflow-section`, vc = `.${s}__workflow-roll`, Vr = `${s}__workflow-roll--dice-open`, Hr = `.${s}__workflow-roll-formula`, Wr = `${s}__workflow-roll-formula--toggle`, On = `.${s}__workflow-dice-tray`, gh = `.${s}__roll-detail-toggle`, hh = `.${s}__roll-detail-list`, bh = `.${s}__ritual-element-badge`, yh = `.${s}__ritual-metadata`, Ah = "casting-backlash", _h = "data-paranormal-toolkit-action-section", Th = "data-paranormal-toolkit-prompt-id", Rh = "data-paranormal-toolkit-pending-id", Ei = "data-paranormal-toolkit-casting-backlash-enhanced", $i = `.${s}`, kh = `.${s}__workflow-section--casting`, Eh = `.${s}__workflow-section-header`, $h = `.${s}__workflow-notes`, wh = `[${_h}="${Ah}"]`, wi = `${s}__workflow-section-title-row`, Ch = `${s}__workflow-section-header--casting-backlash`, Dc = `${s}__casting-backlash-button`;
function Sh(e) {
  for (const t of Ih(e))
    Lh(t), Ph(t);
}
function Ih(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches($i) && t.add(e);
  for (const n of e.querySelectorAll($i))
    t.add(n);
  return Array.from(t);
}
function Lh(e) {
  const t = e.querySelector(wh);
  if (!t) return;
  const n = vh(t);
  if (!n) return;
  const a = e.querySelector(`${kh} ${Eh}`);
  a && (a.classList.add(Ch), Dh(a), xh(n), a.append(n), t.remove());
}
function vh(e) {
  return e.querySelector(
    `button[${Rh}], button[${Th}]`
  );
}
function Dh(e) {
  const t = e.querySelector(`:scope > .${wi}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(wi);
  const a = Array.from(e.childNodes);
  e.prepend(n);
  for (const r of a)
    r !== n && (r instanceof HTMLButtonElement && r.classList.contains(Dc) || n.append(r));
  return n;
}
function xh(e) {
  if (e.getAttribute(Ei) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Nh(t, e.disabled);
  e.classList.add(Dc), e.setAttribute(Ei, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Nh(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Ph(e) {
  for (const t of e.querySelectorAll($h)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Mh(e) {
  for (const t of Array.from(e.querySelectorAll(Lc)))
    for (const n of Array.from(t.querySelectorAll(`${gh}, ${hh}`)))
      n.remove();
}
const Oh = {
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
}, Fh = new Set(
  Object.values(Oh)
), Bh = {
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
function Uh(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = qh(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Bh[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Fh.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function xc(e) {
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
function qh(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Nc {
  async applyDamage(t) {
    const n = t.actor, a = n.name ?? "Ator sem nome", r = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return g({
        actor: n,
        actorId: r,
        actorName: a,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const o = n.applyDamage;
    if (typeof o != "function")
      return g({
        actor: n,
        actorId: r,
        actorName: a,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const i = [], l = /* @__PURE__ */ new Set();
    let c = null;
    for (const [u, m] of t.instances.entries()) {
      const p = zh(m, u);
      if (!p.ok)
        return g({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const A = Uh(m.damageType);
      if (!A.ok)
        return g({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (p.amount === 0) {
        i.push(
          jh(p.id, m, A.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          o.call(n, p.amount, {
            damageType: A.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const k of Vh($.conditions))
          l.add(k);
        const T = Gh($.newPV);
        T !== null && (c = T), i.push({
          id: p.id,
          label: m.label ?? xc(A.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: p.amount,
          finalDamage: Ci($.finalDamage, p.amount),
          blocked: Ci($.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: A.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch ($) {
        return g({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${a}.`,
          instance: m,
          cause: $
        });
      }
    }
    return y({
      actor: n,
      actorId: r,
      actorName: a,
      totalRawDamage: i.reduce(
        (u, m) => u + m.inputAmount,
        0
      ),
      totalFinalDamage: i.reduce(
        (u, m) => u + m.finalDamage,
        0
      ),
      totalBlocked: i.reduce(
        (u, m) => u + m.blocked,
        0
      ),
      newPV: c,
      conditions: Array.from(l),
      instances: i,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function zh(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function jh(e, t, n) {
  return {
    id: e,
    label: t.label ?? xc(n),
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
function Ci(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Gh(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Vh(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Fn {
  async rollResistance(t) {
    const n = await Wh(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? De(t.skill),
      roll: n,
      formula: Yh(n),
      total: Xh(n),
      diceBreakdown: Qh(n)
    };
  }
  getSkillLabel(t) {
    return De(t);
  }
}
async function Hh(e, t) {
  return new Fn().rollResistance({ actor: e, skill: t });
}
function De(e) {
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
async function Wh(e, t) {
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
  return Kh(a);
}
function Kh(e) {
  return Si(e) ? e : Array.isArray(e) ? e.find(Si) ?? null : null;
}
function Si(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Yh(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Xh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Qh(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Zh);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const i = o.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function Zh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class Pc {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class Kr {
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
function Jh(e, t) {
  const n = ib(e?.rounds);
  if (!n)
    return Ii(null);
  const a = e?.anchor ?? Mc(t);
  if (!a)
    return {
      ...Ii(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: eb(),
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
function Mc(e) {
  const t = sb();
  if (!t?.id || !Oc(t.round)) return null;
  const n = rb(t), a = tb(e, n) ?? ab(t), r = me(a?.id), o = cb(a?.initiative), i = nb(t, a, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: r,
    round: t.round,
    turn: i,
    initiative: o,
    time: lb()
  };
}
function eb() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Ii(e) {
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
function tb(e, t) {
  return e?.id ? t.find((n) => ob(n) === e.id) ?? null : null;
}
function nb(e, t, n) {
  const a = me(t?.id);
  if (a) {
    const r = n.findIndex((o) => o.id === a);
    if (r >= 0) return r;
  }
  return ub(e.turn) ? e.turn : null;
}
function ab(e) {
  return Jt(e.combatant) ? e.combatant : null;
}
function rb(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Jt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Jt);
    const a = t.values;
    if (typeof a == "function")
      return Array.from(a.call(t)).filter(Jt);
  }
  return [];
}
function ob(e) {
  return me(e.actor?.id) ?? me(e.actorId) ?? me(e.token?.actor?.id) ?? me(e.token?.actorId) ?? me(e.document?.actor?.id) ?? me(e.document?.actorId);
}
function ib(e) {
  return Oc(e) ? Math.trunc(e) : null;
}
function sb() {
  return game.combat ?? null;
}
function lb() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Jt(e) {
  return !!(e && typeof e == "object");
}
function me(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function cb(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Oc(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function ub(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Fc {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? y(n.value) : g({
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
    const a = t.actor;
    if (!_b(a))
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const r = n.value, o = Jh(t.duration, a), i = db(r, t, o), c = t.refreshExisting ?? !0 ? Tb(a, r.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(i)), y(Li(a, r, c.id ?? null, !1, !0, o));
      } catch (u) {
        return g({
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
      const m = (await a.createEmbeddedDocuments("ActiveEffect", [i]))[0]?.id ?? null;
      return y(Li(a, r, m, !0, !1, o));
    } catch (u) {
      return g({
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
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const a = this.resolveCanonicalConditionId(t.conditionId), r = Uc(n, a);
    let o = 0;
    try {
      for (const i of r)
        await vi(n, i) === "deleted" && (o += 1);
    } catch (i) {
      return g({
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
      conditionId: a,
      removed: o
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = Eb(), a = [];
    let r = 0, o = 0;
    for (const i of n) {
      const l = Yr(i);
      r += l.length;
      for (const c of l) {
        if (!pb(c, t)) continue;
        const u = Bc(c);
        try {
          await vi(i, c) === "deleted" && (o += 1);
        } catch (m) {
          a.push({
            actorId: i.id ?? null,
            actorName: i.name ?? "Ator sem nome",
            effectId: c.id ?? null,
            conditionId: u.conditionId,
            message: `Falha ao remover condição expirada ${u.conditionId ?? c.name ?? "desconhecida"} de ${i.name ?? "ator sem nome"}.`,
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
function db(e, t, n) {
  const a = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Nb(),
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
    duration: mb(n.duration),
    start: fb(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: a
    }
  };
}
function mb(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function fb(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: xb(),
    ...e
  };
}
function Li(e, t, n, a, r, o) {
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
function pb(e, t) {
  const n = Bc(e);
  if (!n.conditionId || !gb(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const a = Db();
  return n.durationMode === "combatantTurn" || hb(n) ? yb(n, a) : bb(e) || !a?.id || n.combatId && n.combatId !== a.id ? !0 : !Z(n.startRound) || !Z(n.requestedRounds) || !Z(a.round) ? !1 : a.round >= n.startRound + n.requestedRounds;
}
function gb(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Z(e.requestedRounds);
}
function hb(e) {
  return !!(e.combatDurationApplied && Z(e.requestedRounds) && Z(e.startRound) && (e.startCombatantId || mn(e.startTurn)));
}
function bb(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function yb(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !Z(e.startRound) || !Z(e.requestedRounds) || !Z(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const a = Ab(t);
  return e.startCombatantId ? a === e.startCombatantId : mn(e.startTurn) && mn(t.turn) ? t.turn === e.startTurn : !1;
}
function Ab(e) {
  return Ge(e.combatant?.id);
}
function Bc(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: en(e, "conditionId"),
    requestedRounds: Di(e, "requestedRounds") ?? pt(t.value) ?? pt(t.rounds),
    combatDurationApplied: la(e, "combatDurationApplied"),
    combatId: en(e, "combatId") ?? Ge(n.combat) ?? Ge(t.combat),
    startCombatantId: en(e, "startCombatantId") ?? Ge(n.combatant),
    startInitiative: Sb(e, "startInitiative") ?? qc(n.initiative),
    startRound: Di(e, "startRound") ?? pt(n.round) ?? pt(t.startRound),
    startTurn: Cb(e, "startTurn") ?? qa(n.turn) ?? qa(t.startTurn),
    expiryEvent: Ib(e, "expiryEvent") ?? zc(t.expiry),
    durationMode: Lb(e, "durationMode"),
    deleteOnExpire: la(e, "deleteOnExpire"),
    expiresWithCombat: la(e, "expiresWithCombat")
  };
}
function _b(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Tb(e, t) {
  return Uc(e, t)[0] ?? null;
}
function Uc(e, t) {
  return Yr(e).filter((n) => wb(n) === t);
}
async function vi(e, t) {
  const n = t.id ?? null, a = n ? Rb(e, n) : t;
  if (!a) return "missing";
  try {
    return await Promise.resolve(a.delete?.()), "deleted";
  } catch (r) {
    if (kb(r)) return "missing";
    throw r;
  }
}
function Rb(e, t) {
  return Yr(e).find((n) => n.id === t) ?? null;
}
function kb(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Eb() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      zt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    zt(e, n);
  });
  for (const n of $b())
    zt(e, n.actor), zt(e, n.document?.actor);
  return Array.from(e.values());
}
function zt(e, t) {
  if (!vb(t)) return;
  const a = Ge(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(a, t);
}
function $b() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Yr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function wb(e) {
  return en(e, "conditionId");
}
function en(e, t) {
  return Ge(Ne(e, t));
}
function Di(e, t) {
  return pt(Ne(e, t));
}
function Cb(e, t) {
  return qa(Ne(e, t));
}
function Sb(e, t) {
  return qc(Ne(e, t));
}
function Ib(e, t) {
  return zc(Ne(e, t));
}
function Lb(e, t) {
  const n = Ne(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function la(e, t) {
  return Ne(e, t) === !0;
}
function Ne(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const a = e.flags;
  if (!a || typeof a != "object") return;
  const r = a[d];
  if (!(!r || typeof r != "object"))
    return r[t];
}
function Ge(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function pt(e) {
  return Z(e) ? Math.trunc(e) : null;
}
function qa(e) {
  return mn(e) ? Math.trunc(e) : null;
}
function qc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function zc(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function vb(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Db() {
  return game.combat ?? null;
}
function xb() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Z(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function mn(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Nb() {
  return game.user?.id ?? null;
}
const Pb = "icons/svg/downgrade.svg", Mb = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Pb,
    description: Mb,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Ob = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Fb = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Bb = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Ub = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), qb = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), zb = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), jb = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Gb = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Vb = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Hb = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Wb = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Kb = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Yb = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Xb = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Qb = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Zb = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Jb = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), ey = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), ty = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), ny = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), ay = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), ry = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), oy = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), iy = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), sy = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), ly = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), cy = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), uy = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), dy = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), my = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), fy = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), py = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), gy = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), hy = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Xr = [
  Ob,
  Fb,
  Bb,
  Ub,
  qb,
  zb,
  jb,
  Gb,
  Vb,
  Hb,
  Wb,
  Kb,
  Yb,
  Xb,
  Qb,
  Zb,
  Jb,
  ey,
  ty,
  ny,
  ay,
  ry,
  oy,
  iy,
  sy,
  ly,
  cy,
  uy,
  dy,
  my,
  fy,
  py,
  gy,
  hy
];
class by {
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
    return Array.from(this.definitions.values()).map(xi);
  }
  get(t) {
    const n = this.lookup.get(Ni(t)), a = n ? this.definitions.get(n) : null;
    return a ? y(xi(a)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const a = Ni(t);
    a && this.lookup.set(a, n);
  }
}
function jc() {
  return new by(Xr);
}
function xi(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Ni(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Qe(e) {
  return e.applyOnResistance ?? "failure";
}
function Gc(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Vc(e, t) {
  const n = Qe(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Hc(e) {
  const t = Qe(e);
  return t === "failure" || t === "success";
}
function yy(e, t, n, a) {
  const r = e.filter((c) => Vc(c, t));
  if (r.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? r.filter((c) => Qe(c) === t) : [], i = o.length > 0 ? o : r;
  if (i.length === 1) return i[0] ?? null;
  const l = a(n);
  return l ? i.find((c) => [c.label, c.conditionId].some((u) => a(u) === l)) ?? i[0] ?? null : i[0] ?? null;
}
const Ay = {
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
}, _y = {
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
function Ty(e) {
  return Kc(e, Ay, !1);
}
function Ry(e) {
  return Kc(e, _y, !e.allowsSuccessfulResistance);
}
function ot(e) {
  return e.kind === "waiting-resistance";
}
function Wc(e) {
  return e.kind === "resisted";
}
function Kc(e, t, n) {
  const a = { ...t, ...e.labels };
  return e.alreadyApplied ? Be("applied", !1, a.applied, a.appliedCompact, null) : e.unavailable ? Be("unavailable", !1, a.unavailable, a.unavailableCompact, a.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || Ln(e.resistanceGateMode, e.resistanceState) ? Be(
    "waiting-resistance",
    !1,
    a.waitingResistance,
    a.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Be("resisted", !1, a.resisted, a.resistedCompact, a.resisted) : Be("available", !0, a.available, a.availableCompact, null);
}
function Be(e, t, n, a, r) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: a,
    reason: r
  };
}
const gt = "data-paranormal-toolkit-prompt-id", ky = "data-paranormal-toolkit-resistance-roll-result", Ey = "Conjuração DT";
function $y(e) {
  const t = e.querySelector(Mn)?.getAttribute(ky), n = Rt(t);
  if (n !== null) return n;
  const a = e.querySelector(Ic)?.textContent ?? null, r = a ? /=\s*(-?\d+)\s*$/u.exec(a) : null;
  return Rt(r?.[1] ?? null);
}
function Qr(e) {
  const t = Yc(e), n = Iy(t);
  if (n !== null) return n;
  const a = Sy(t);
  return a !== null ? a : Ly(e);
}
function wy(e) {
  const t = Yc(e);
  return t ? {
    actorId: ca(t.actorId),
    itemId: ca(t.itemId),
    itemName: ca(t.itemName)
  } : null;
}
function Cy(e) {
  const t = e.getAttribute(gt);
  if (!t) return null;
  const n = Xc(e), a = Qc(n), i = (Array.isArray(a?.prompts) ? a.prompts : []).find((l) => Bn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof i == "string" && i.trim().length > 0 ? i.trim() : null;
}
function ye(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function za(e) {
  return ye(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Sy(e) {
  const t = Dy(e);
  return t.length === 0 ? null : Rt(xy(t, Ey));
}
function Iy(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const a = game.actors?.get?.(t);
  return !a || typeof a != "object" ? null : Pi(a, ["system", "ritual", "DT"]) ?? Pi(a, ["system", "ritual", "dt"]);
}
function Ly(e) {
  const t = Array.from(e.querySelectorAll(`.${s}__workflow-section--casting .${s}__workflow-section-description`)).map((a) => a.textContent).find((a) => typeof a == "string" && a.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Rt(n?.[1] ?? null);
}
function Yc(e) {
  const t = vy(e);
  if (!t) return null;
  const n = Xc(e), a = Qc(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => Bn(o) ? o.pendingId === t : !1) ?? null;
}
function vy(e) {
  return (e.closest(`[${gt}]`) ?? e.querySelector(`[${gt}]`) ?? e.parentElement?.querySelector(`[${gt}]`) ?? null)?.getAttribute(gt) ?? null;
}
function Xc(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return Ny(r) ? r : null;
}
function Qc(e) {
  const t = e?.getFlag?.(d, Pn);
  return Bn(t) ? t : null;
}
function Dy(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function xy(e, t) {
  const n = `${t}:`;
  for (const a of e) {
    if (!a.startsWith(n)) continue;
    const r = a.slice(n.length).trim();
    if (r.length > 0) return r;
  }
  return null;
}
function Pi(e, t) {
  let n = e;
  for (const a of t) {
    if (!Bn(n)) return null;
    n = n[a];
  }
  return typeof n == "number" ? Math.trunc(n) : Rt(typeof n == "string" ? n : null);
}
function Rt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Ny(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Bn(e) {
  return !!(e && typeof e == "object");
}
function ca(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Un(e) {
  return Zc({
    hasResistance: !!e.querySelector(Gr),
    difficulty: Qr(e),
    resistanceTotal: $y(e)
  });
}
function Py(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Zc({
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
function Zc(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Cf(e)
  };
}
function Te() {
  return game.user?.isGM === !0;
}
function he() {
  return Te();
}
function My(e) {
  const t = Ln(e.resistanceGateMode, e.resistanceState), n = Oy(e.resistanceState, e.hasDamage), a = Fy(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), r = Ty({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Ry({
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
function Oy(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Fy(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Zr(e) {
  const t = e.isGM ?? he();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: My({
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
function By(e) {
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${s}__workflow-roll-formula`), n.textContent = e.formula;
  const a = document.createElement("strong");
  a.classList.add(`${s}__workflow-roll-total`), a.textContent = e.total === null ? "—" : String(e.total), t.append(n, a);
  const r = qy(e.formula, e.diceBreakdown ?? null);
  return r && t.append(r), t;
}
function Uy(e) {
  const t = Array.from(e?.querySelectorAll(`.${s}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function qy(e, t) {
  const n = zy(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${s}__workflow-dice-tray`);
  for (const r of jy(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${s}__workflow-die`), r.active || o.classList.add(`${s}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function zy(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function jy(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Mi(e, "highest") : n.includes("kl") ? Mi(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Mi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
const Gy = "data-paranormal-toolkit-resistance-skill", Vy = "data-paranormal-toolkit-resistance-skill-label", Hy = "data-paranormal-toolkit-roll-card-target-names", Wy = "data-paranormal-toolkit-roll-card-resistance", Ky = "data-paranormal-toolkit-roll-card-resistance-skill", Yy = "data-paranormal-toolkit-roll-card-resistance-skill-label", Jc = "pending", Jr = "success", eo = "failure", eu = "rolled";
function Xy(e) {
  const t = tA(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Jy(e.damageSection) : null, a = Oi(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), r = Qy(e.rollCard).map((o, i) => {
    const l = Zy(o, i), c = e.resistanceResults.get(l) ?? null, u = sA(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, p = e.effectApplications.get(l) ?? null, A = Py({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: mA(u)
    }).state, $ = Oi(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Gc(A)
    ) ?? a;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: p,
      effect: $,
      assistedActions: Zr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: A,
        damage: n,
        effect: $,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!p,
        effectCanApplyOnSuccessfulResistance: $?.applyOnResistance === "success" || $?.applyOnResistance === "always",
        effectRequiresResolvedResistance: $ ? Hc($) : !1
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
function Qy(e) {
  const t = e.getAttribute(Hy), n = t ? dA(t) : [];
  if (n.length > 0) return n;
  const r = e.closest(`.${s}`)?.querySelector(`.${s}__summary`)?.textContent ?? "", [, o] = r.split("→");
  return o ? o.split(",").map((i) => i.trim()).filter((i) => i.length > 0 && tu(i) !== "nenhum alvo") : [];
}
function Zy(e, t) {
  return `${tu(e)}:${t}`;
}
function Jy(e) {
  const t = lA(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: uA(e),
    formula: cA(e) ?? "—",
    total: t,
    diceBreakdown: Uy(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Oi(e, t, n, a) {
  const r = t?.querySelector(`.${s}__effect-section-label`)?.textContent?.trim(), o = n(e, r ?? null, a);
  return o ? {
    label: r && r.length > 0 ? r : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: eA(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Qe(o)
  } : null;
}
function eA(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function tA(e, t) {
  const n = aA(t), a = nA(e), r = a.description ?? rA(n)?.textContent?.trim(), o = oA(n), i = a.skill ?? o?.getAttribute(Gy) ?? null, l = a.skillLabel ?? o?.getAttribute(Vy) ?? (i ? De(i) : null);
  return !r && !i ? null : {
    description: r ?? "Resistência do alvo.",
    formula: iA(n)?.textContent?.trim() ?? null,
    skill: i,
    skillLabel: l,
    difficulty: Qr(e)
  };
}
function nA(e) {
  return {
    description: ua(e, Wy),
    skill: ua(e, Ky),
    skillLabel: ua(e, Yy)
  };
}
function aA(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function rA(e) {
  return to(e, `.${s}__resistance-description`);
}
function oA(e) {
  return to(e, Mn);
}
function iA(e) {
  return to(
    e,
    `.${s}__resistance .${s}__workflow-roll-formula`
  );
}
function to(e, t) {
  for (const n of e) {
    const a = n.querySelector(t);
    if (a) return a;
  }
  return null;
}
function sA(e, t) {
  return e ? t === null ? eu : e.total >= t ? Jr : eo : Jc;
}
function lA(e) {
  const t = e?.querySelector(`.${s}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function cA(e) {
  const t = e?.querySelector(`.${s}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function uA(e) {
  const t = e?.querySelector(`.${s}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function dA(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function ua(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function tu(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function mA(e) {
  return e === Jr ? "succeeded" : e === eo ? "failed" : "pending";
}
function nu(e) {
  if (!e) return null;
  const t = e.actorId ? gA(e.actorId) : null, n = t ? fA(t, e.itemId, e.itemName) : null;
  return n || pA(e.itemId, e.itemName);
}
function fA(e, t, n) {
  const a = e.items;
  if (t) {
    const o = a?.get?.(t);
    if (Ve(o)) return o;
  }
  const r = fn(n);
  if (r) {
    const o = a?.find?.((i) => Ve(i) ? fn(i.name) === r : !1);
    if (Ve(o)) return o;
  }
  return null;
}
function pA(e, t) {
  const n = game.items;
  if (e) {
    const r = n?.get?.(e);
    if (Ve(r)) return r;
  }
  const a = fn(t);
  if (a) {
    const r = n?.find?.((o) => Ve(o) ? fn(o.name) === a : !1);
    if (Ve(r)) return r;
  }
  return null;
}
function gA(e) {
  const n = game.actors?.get?.(e);
  return hA(n) ? n : null;
}
function hA(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ve(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function fn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function no(e) {
  const t = da(e);
  if (!t) return null;
  const n = bA().filter((o) => da(yA(o)) === t).map((o) => au(o)).find(At) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => At(o) && da(o.name) === t);
  return At(r) ? r : null;
}
function bA() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function yA(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : au(e)?.name ?? null;
}
function au(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (At(t)) return t;
  const n = e.document?.actor;
  return At(n) ? n : null;
}
function At(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function da(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function ja(e) {
  const t = RA();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: AA(e)
  });
}
function AA(e) {
  const t = e.instances.map((i) => {
    const l = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${tn(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", a = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", r = _A(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${tn(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${tn(e.actorName)}</strong></p>
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
function _A(e) {
  const t = TA(e.actor), n = e.newPV ?? t?.value ?? null, a = t?.max ?? null;
  if (n === null) return "";
  const r = a === null ? `${n}` : `${n}/${a}`;
  return `<li><strong>PV atual</strong>: ${tn(r)}</li>`;
}
function TA(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, a = Fi(n?.value);
  return a === null ? null : {
    value: a,
    max: Fi(n?.max)
  };
}
function Fi(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function RA() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function tn(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function kA(e) {
  await ja(EA(e));
}
function EA(e) {
  if ($A(e)) return e;
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
function $A(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function ru(e) {
  return e.mode, `✓ ${ou(e.inputAmount)} PV`;
}
function wA(e) {
  const t = ou(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function ou(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class CA {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? he()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : Ln(t.resistanceGateMode, t.resistanceState) ? {
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
class SA {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? he()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : Ln(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class iu {
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
const IA = `.${s}__actions`, ao = `.${s}__actions-title`, Ze = `.${s}__button`, LA = "data-paranormal-toolkit-action-section", vA = `${s}__button--executed`, DA = "data-paranormal-toolkit-executed-label";
function su(e) {
  return ye(e.querySelector(ao)?.textContent);
}
function xA(e, t) {
  const n = e.querySelector(ao);
  n && (n.textContent = t);
}
function Dt(e, t) {
  const n = ye(t);
  return Array.from(e.querySelectorAll(`.${s}__workflow-section`)).find((a) => {
    const r = a.querySelector(`.${s}__workflow-section-header strong`)?.textContent;
    return ye(r) === n;
  }) ?? null;
}
function ro(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${s}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Pe(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__button-label`), t.textContent = e, t;
}
function lu(e) {
  const t = NA(e.difficulty);
  if (t === null) return null;
  const n = Bi(e.skillLabel) ?? "Resistência", a = Bi(e.description), r = PA(a, n), o = MA(r, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function NA(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Bi(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function PA(e, t) {
  if (!e) return null;
  const n = Ui(e), a = Ui(t);
  if (!n.startsWith(a)) return e;
  const r = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return r.length > 0 ? r : null;
}
function MA(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const a = Number(n[1]);
  if (!Number.isFinite(a) || a !== t) return e;
  const r = e.slice(n[0].length).trim();
  return r.length > 0 ? r : null;
}
function Ui(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const jt = "data-paranormal-toolkit-prompt-id", cu = "multiTargetResistanceResults", uu = "multiTargetDamageApplications", du = "multiTargetEffectApplications";
function OA(e) {
  const t = /* @__PURE__ */ new Map(), a = qn(e)?.[cu];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    GA(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function FA(e, t) {
  await oo(e, cu, t.targetId, t);
}
function BA(e) {
  const t = /* @__PURE__ */ new Map(), a = qn(e)?.[uu];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    VA(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function UA(e, t) {
  await oo(
    e,
    uu,
    t.targetId,
    t
  );
}
function qA(e) {
  const t = /* @__PURE__ */ new Map(), a = qn(e)?.[du];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    WA(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function zA(e, t) {
  await oo(
    e,
    du,
    t.targetId,
    t
  );
}
function jA(e) {
  const t = qn(e);
  return t ? {
    actorId: ma(t.actorId),
    itemId: ma(t.itemId),
    itemName: ma(t.itemName)
  } : null;
}
async function oo(e, t, n, a) {
  const r = mu(e);
  if (!r) return;
  const o = fu(e), i = pu(o);
  if (!o || !i || !Array.isArray(i.prompts)) return;
  let l = !1;
  const c = i.prompts.map((u) => {
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
  l && await Promise.resolve(o.setFlag?.(d, Pn, {
    ...i,
    prompts: c
  }));
}
function qn(e) {
  const t = mu(e);
  if (!t) return null;
  const n = fu(e), a = pu(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => J(o) ? o.pendingId === t : !1) ?? null;
}
function mu(e) {
  return (e.closest(`[${jt}]`) ?? e.querySelector(`[${jt}]`) ?? e.parentElement?.querySelector(`[${jt}]`) ?? null)?.getAttribute(jt) ?? null;
}
function fu(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return KA(r) ? r : null;
}
function pu(e) {
  const t = e?.getFlag?.(d, Pn);
  return J(t) ? t : null;
}
function GA(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function VA(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && HA(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function HA(e) {
  return e === "normal" || e === "half";
}
function WA(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function ma(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function KA(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function J(e) {
  return !!(e && typeof e == "object");
}
const YA = "data-paranormal-toolkit-resistance-skill", XA = "data-paranormal-toolkit-resistance-skill-label", Ga = "data-paranormal-toolkit-multi-target-section", io = "data-paranormal-toolkit-multi-target-damage-info", gu = "data-paranormal-toolkit-multi-target-effect-info", hu = "data-paranormal-toolkit-multi-target-toggle", bu = "data-paranormal-toolkit-multi-target-details", X = "data-paranormal-toolkit-multi-target-target", QA = "data-paranormal-toolkit-multi-target-state", Va = "data-paranormal-toolkit-multi-target-roll-total", Ha = "data-paranormal-toolkit-multi-target-roll-formula", nn = "data-paranormal-toolkit-multi-target-roll-dice", Wa = "data-paranormal-toolkit-multi-target-roll-skill", Ka = "data-paranormal-toolkit-multi-target-roll-skill-label", Ya = "data-paranormal-toolkit-multi-target-roll-target-name", Xa = "data-paranormal-toolkit-multi-target-roll-rolled-at", Qa = "data-paranormal-toolkit-multi-target-damage-mode", Za = "data-paranormal-toolkit-multi-target-damage-input-amount", qi = "data-paranormal-toolkit-multi-target-damage-final-amount", zi = "data-paranormal-toolkit-multi-target-damage-blocked", Ja = "data-paranormal-toolkit-multi-target-damage-target-name", er = "data-paranormal-toolkit-multi-target-damage-applied-at", tr = "data-paranormal-toolkit-multi-target-effect-condition-id", nr = "data-paranormal-toolkit-multi-target-effect-condition-label", ar = "data-paranormal-toolkit-multi-target-effect-effect-id", rr = "data-paranormal-toolkit-multi-target-effect-created", or = "data-paranormal-toolkit-multi-target-effect-refreshed", ir = "data-paranormal-toolkit-multi-target-effect-target-name", sr = "data-paranormal-toolkit-multi-target-effect-applied-at", ZA = new Fc(jc()), JA = new Pc(new Nc()), e_ = new Kr(new Fn()), t_ = new iu(e_), n_ = new CA(JA), a_ = new SA(ZA), r_ = Jc, it = Jr, xt = eo, o_ = eu;
function i_(e) {
  const t = yu(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${s}__roll-card--multi-target`), g_(e);
  const n = h_(e.rollCard, t), a = b_(e.rollCard, t);
  !n && a && J_(e.rollCard, a, e.effectSection);
  const r = k_(e.rollCard);
  return Tu(r, t), X_(
    e.rollCard,
    r,
    y_(e.rollCard, {
      damageInfo: n,
      effectInfo: a,
      effectSection: e.effectSection
    })
  ), n && a && eT(e.rollCard, a, r), !0;
}
function yu(e) {
  return Xy({
    ...e,
    resistanceResults: c_(e.rollCard),
    damageApplications: u_(e.rollCard),
    effectApplications: d_(e.rollCard),
    resolveTargetConditionApplication: s_,
    resistanceGateMode: lo()
  });
}
function s_(e, t, n) {
  const a = jA(e), r = nu(a);
  if (!r) return null;
  const o = St(r);
  if (!o.ok) return null;
  const i = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (i.length === 0) return null;
  const l = l_(i, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function l_(e, t, n) {
  const a = yy(
    e,
    n,
    t,
    fa
  );
  if (a) return a;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const r = fa(t);
  return r ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((i) => fa(i) === r)) ?? null : null;
}
function c_(e) {
  const t = OA(e);
  for (const [n, a] of p_(e))
    t.set(n, a);
  return t;
}
function u_(e) {
  const t = BA(e);
  for (const [n, a] of f_(e))
    t.set(n, a);
  return t;
}
function d_(e) {
  const t = qA(e);
  for (const [n, a] of m_(e))
    t.set(n, a);
  return t;
}
function m_(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${X}]`)) {
    const a = n.getAttribute(X), r = n.getAttribute(tr), o = n.getAttribute(nr), i = n.getAttribute(ar), l = Vi(n.getAttribute(rr)), c = Vi(n.getAttribute(or)), u = n.getAttribute(ir), m = n.getAttribute(sr);
    !a || !r || !o || l === null || c === null || !u || !m || t.set(a, {
      targetId: a,
      targetName: u,
      conditionId: r,
      conditionLabel: o,
      effectId: i && i.length > 0 ? i : null,
      created: l,
      refreshed: c,
      appliedAt: m
    });
  }
  return t;
}
function f_(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${X}]`)) {
    const a = n.getAttribute(X), r = n.getAttribute(Qa), o = vu(n.getAttribute(Za)), i = n.getAttribute(Ja), l = n.getAttribute(er);
    !a || !aT(r) || o === null || !i || !l || t.set(a, {
      targetId: a,
      targetName: i,
      mode: r,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function p_(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${X}]`)) {
    const a = n.getAttribute(X), r = vu(n.getAttribute(Va)), o = n.getAttribute(Ha), i = n.getAttribute(Wa), l = n.getAttribute(Ka), c = n.getAttribute(Ya), u = n.getAttribute(Xa);
    !a || r === null || !o || !i || !l || !c || !u || t.set(a, {
      targetId: a,
      targetName: c,
      skill: i,
      skillLabel: l,
      formula: o,
      total: r,
      diceBreakdown: n.getAttribute(nn),
      rolledAt: u
    });
  }
  return t;
}
function g_(e) {
  e.damageSection?.classList.add(`${s}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${s}__workflow-section--multi-target-effect-source`);
}
function h_(e, t) {
  if (!t.damage)
    return Au(e)?.remove(), null;
  const n = A_(e);
  return __(n, t.damage), R_(e, n), n;
}
function b_(e, t) {
  if (!t.effect)
    return Lu(e)?.remove(), null;
  const n = Q_(e);
  return Z_(n, t.effect), n;
}
function y_(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : Dt(e, "Conjuração");
}
function A_(e) {
  const t = Au(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect`,
    `${s}__workflow-section--damage-info`
  ), n.setAttribute(io, "true"), n;
}
function Au(e) {
  return e.querySelector(`[${io}="true"]`);
}
function __(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${s}__workflow-section-header`);
  const a = document.createElement("strong");
  if (a.textContent = "Dano", n.append(a), e.append(n), t.typeLabel) {
    const r = document.createElement("span");
    r.classList.add(`${s}__workflow-section-description`), r.textContent = t.typeLabel, e.append(r);
  }
  e.append(_u(t.formula, t.total, t.diceBreakdown));
}
function _u(e, t, n, a = !1) {
  const r = By({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${s}__workflow-roll--compact-info`]
  });
  return T_(r, a), r;
}
function T_(e, t) {
  const n = e.querySelector(On), a = e.querySelector(Hr);
  if (!n || !a) return;
  e.classList.toggle(Vr, t), n.hidden = !t, a.classList.add(Wr), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-expanded", t ? "true" : "false"), a.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", a.setAttribute("aria-label", a.title);
  const r = a.querySelector("i") ?? document.createElement("i");
  r.classList.add("fa-solid"), r.classList.toggle("fa-chevron-down", !t), r.classList.toggle("fa-chevron-up", t), r.setAttribute("aria-hidden", "true"), r.parentElement || a.append(r);
}
function R_(e, t) {
  const n = Dt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function k_(e) {
  const t = e.querySelector(`[${Ga}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--targets`
  ), n.setAttribute(Ga, "true"), n;
}
function Tu(e, t) {
  const n = E_(e), a = w_(t.resistance), r = [$_(t)];
  a && r.push(a), r.push(I_(t, n)), e.replaceChildren(...r);
}
function E_(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${X}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(X)).filter(nT)
  );
}
function $_(e) {
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-section-header`, `${s}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const a = document.createElement("span");
  return a.classList.add(`${s}__targets-status`), a.textContent = S_(e.targets), t.append(n, a), t;
}
function w_(e) {
  const t = lu({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${s}__targets-resistance-info`), C_(n, t), n;
}
function C_(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${s}__resistance-label-skill`), n.textContent = t.skillLabel;
  const a = document.createElement("strong");
  a.classList.add(`${s}__resistance-label-difficulty`), a.textContent = t.difficultyLabel;
  const r = [n, document.createTextNode(" · "), a];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${s}__resistance-label-effect`), o.textContent = t.description, r.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...r);
}
function S_(e) {
  const t = e.length, n = e.filter((l) => l.state === xt).length, a = e.filter((l) => l.state === it).length, r = e.filter((l) => l.state === r_).length, o = e.filter((l) => l.state === o_).length, i = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && i.push(`${n} ${n === 1 ? "falha" : "falhas"}`), a > 0 && i.push(`${a} ${a === 1 ? "sucesso" : "sucessos"}`), r > 0 && i.push(`${r} ${r === 1 ? "pendente" : "pendentes"}`), o > 0 && i.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), i.join(" • ");
}
function I_(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${s}__targets-list`);
  for (const a of e.targets)
    n.append(L_(a, e, t.has(a.id)));
  return n;
}
function L_(e, t, n) {
  const a = document.createElement("article");
  a.classList.add(`${s}__target-row`, `${s}__target-row--${e.state}`), e.damageApplication && a.classList.add(`${s}__target-row--damage-applied`), e.effectApplication && a.classList.add(`${s}__target-row--effect-applied`), a.setAttribute(X, e.id), a.setAttribute(QA, e.state), a.setAttribute("aria-expanded", n ? "true" : "false"), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Ru(a, e.resistanceResult), ku(a, e.damageApplication), Eu(a, e.effectApplication);
  const r = v_(e, t, a), o = H_(e, t);
  return o.hidden = !n, a.addEventListener("click", (i) => {
    Gi(i.target) || ji(a);
  }), a.addEventListener("keydown", (i) => {
    i.key !== "Enter" && i.key !== " " || Gi(i.target) || (i.preventDefault(), ji(a));
  }), a.append(r, o), a;
}
function Ru(e, t) {
  if (!t) {
    e.removeAttribute(Va), e.removeAttribute(Ha), e.removeAttribute(nn), e.removeAttribute(Wa), e.removeAttribute(Ka), e.removeAttribute(Ya), e.removeAttribute(Xa);
    return;
  }
  e.setAttribute(Va, String(t.total)), e.setAttribute(Ha, t.formula), e.setAttribute(Wa, t.skill), e.setAttribute(Ka, t.skillLabel), e.setAttribute(Ya, t.targetName), e.setAttribute(Xa, t.rolledAt), t.diceBreakdown ? e.setAttribute(nn, t.diceBreakdown) : e.removeAttribute(nn);
}
function ku(e, t) {
  if (!t) {
    e.removeAttribute(Qa), e.removeAttribute(Za), e.removeAttribute(qi), e.removeAttribute(zi), e.removeAttribute(Ja), e.removeAttribute(er);
    return;
  }
  e.setAttribute(Qa, t.mode), e.setAttribute(Za, String(t.inputAmount)), e.removeAttribute(qi), e.removeAttribute(zi), e.setAttribute(Ja, t.targetName), e.setAttribute(er, t.appliedAt);
}
function Eu(e, t) {
  if (!t) {
    e.removeAttribute(tr), e.removeAttribute(nr), e.removeAttribute(ar), e.removeAttribute(rr), e.removeAttribute(or), e.removeAttribute(ir), e.removeAttribute(sr);
    return;
  }
  e.setAttribute(tr, t.conditionId), e.setAttribute(nr, t.conditionLabel), e.setAttribute(ar, t.effectId ?? ""), e.setAttribute(rr, String(t.created)), e.setAttribute(or, String(t.refreshed)), e.setAttribute(ir, t.targetName), e.setAttribute(sr, t.appliedAt);
}
function v_(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${s}__target-summary`);
  const r = document.createElement("div");
  r.classList.add(`${s}__target-summary-main`);
  const o = D_(e), i = document.createElement("strong");
  i.classList.add(`${s}__target-name`), i.textContent = e.name;
  const l = x_(e, t.resistance);
  O_(l, n, e, t);
  const c = V_(n);
  r.append(o, i, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${s}__target-summary-actions`), Su(u, [
    $u(e, t, "compact"),
    Cu(e, t, "compact")
  ]), a.append(r, u), a;
}
function D_(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function x_(e, t) {
  if (!Te())
    return N_(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${s}__target-resistance-button`, `${s}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", M_(e, t)), t?.skill && (n.setAttribute(YA, t.skill), n.setAttribute(XA, t.skillLabel ?? De(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const o = document.createElement("i");
    o.classList.add("fa-solid", "fa-dice-d20"), o.setAttribute("aria-hidden", "true");
    const i = document.createElement("span");
    return i.classList.add(`${s}__target-resistance-fallback`), i.textContent = "d20", n.append(o, i), n;
  }
  const a = document.createElement("span");
  a.classList.add(`${s}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${s}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === it ? "✓" : e.state === xt ? "✕" : "", n.append(a, r), n;
}
function N_(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${s}__target-resistance-button`, `${s}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", P_(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const a = document.createElement("span");
  a.classList.add(`${s}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${s}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === it ? "✓" : e.state === xt ? "✕" : "", n.append(a, r), n;
}
function P_(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const a = e.state === it ? "sucesso" : e.state === xt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}.`;
}
function M_(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const a = e.state === it ? "sucesso" : e.state === xt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}. Rolar novamente`;
}
function O_(e, t, n, a) {
  !(e instanceof HTMLButtonElement) || !Te() || e.addEventListener("click", (r) => {
    r.stopPropagation(), F_(t, e, n, a);
  });
}
async function F_(e, t, n, a) {
  if (!Te()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const r = a.resistance, o = r?.skill, i = r?.skillLabel ?? (o ? De(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = no(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${s}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await t_.execute({ actor: l, skill: o, skillLabel: i });
    await tT(u.roll);
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: o,
      skillLabel: i,
      formula: u.formula,
      total: u.total,
      diceBreakdown: u.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ru(e, m);
    try {
      await FA(a.rollCard, m);
    } catch (p) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", p);
    }
    so(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${i} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${s}__target-resistance-button--rolling`);
  }
}
function so(e) {
  const t = e.closest(`[${Ga}="true"]`), n = e.closest(`.${s}__roll-card`);
  if (!t || !n) return;
  const a = yu({
    rollCard: n,
    damageSection: B_(n) ?? Dt(n, "Dano"),
    effectSection: U_(n)
  });
  a && Tu(t, a);
}
function B_(e) {
  return Array.from(e.querySelectorAll(`.${s}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(io) !== "true") ?? null;
}
function U_(e) {
  return e.querySelector(`.${s}__workflow-section--multi-target-effect-source`);
}
function q_(e) {
  return ot(e.assistedActions.policy.damageActionState);
}
function z_(e) {
  return ot(e.assistedActions.policy.effectActionState);
}
function lo() {
  try {
    return Fr();
  } catch {
    return "strict";
  }
}
function $u(e, t, n) {
  if (e.damageApplication)
    return ge(
      "✓",
      ru({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${s}__target-action--damage`, `${s}__target-action--applied`],
      !0
    );
  const a = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (ot(a))
    return ge(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${s}__target-action--damage`, `${s}__target-action--waiting-damage`],
      !0
    );
  const r = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = wu(r, t.damage);
  if (o === null)
    return ge(
      "⚡",
      "Dano indisponível",
      [`${s}__target-action--damage`, `${s}__target-action--disabled`],
      !0
    );
  const i = wA({ inputAmount: o, mode: r, compact: n === "compact" }), l = r === "half" ? "🛡️" : "⚡", c = r === "half" ? `${s}__target-action--half-damage` : `${s}__target-action--normal-damage`, u = ge(
    l,
    i,
    [`${s}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${i} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const p = u.closest(`[${X}]`);
    p && j_(p, u, e, t);
  }), u;
}
function wu(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function j_(e, t, n, a) {
  if (n.damageApplication) return;
  if (q_(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const r = a.damage;
  if (!r) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", i = wu(o, r);
  if (i === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = no(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${s}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await n_.execute({
      actor: l,
      amount: i,
      damageType: r.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: lo(),
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
      inputAmount: i,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ku(e, m);
    try {
      await UA(a.rollCard, m);
    } catch (p) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", p);
    }
    try {
      await kA(u.value);
    } catch (p) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", p);
    }
    so(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${s}__target-action--applying`);
  }
}
function Cu(e, t, n) {
  const a = e.assistedActions.policy.effectActionState, r = e.effect ?? t.effect;
  if (e.effectApplication)
    return ge(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : a.compactLabel,
      [`${s}__target-action--effect`, `${s}__target-action--effect-applied`],
      !0
    );
  if (!r) return null;
  if (ot(a))
    return ge(
      "◇",
      n === "full" ? a.label : a.compactLabel,
      [`${s}__target-action--effect`, `${s}__target-action--waiting-effect`],
      !0
    );
  if (Wc(a))
    return ge(
      "✓",
      n === "full" ? a.label : a.compactLabel,
      [`${s}__target-action--effect`, `${s}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = ge(
    "✦",
    n === "full" ? `Aplicar ${r.conditionLabel}` : "Efeito",
    [`${s}__target-action--effect`, `${s}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${r.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (i) => {
    i.stopPropagation();
    const l = o.closest(`[${X}]`);
    l && G_(l, o, e, t);
  }), o;
}
async function G_(e, t, n, a) {
  if (n.effectApplication) return;
  if (z_(n)) {
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
  const o = no(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${s}__target-action--applying`);
  const i = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await a_.execute({
      actor: o,
      conditionId: r.conditionId,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source,
      resistanceGateMode: lo(),
      resistanceState: n.assistedActions.resistanceState,
      allowSuccessfulResistance: r.applyOnResistance === "success" || r.applyOnResistance === "always",
      requiredResistanceOutcome: r.applyOnResistance === "success" ? "succeeded" : r.applyOnResistance === "failure" ? "failed" : null
    });
    if (!l.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${l.error.message}`), t.innerHTML = i;
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
    Eu(e, c);
    try {
      await zA(a.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), so(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1, t.classList.remove(`${s}__target-action--applying`);
  }
}
function Su(e, t) {
  for (const n of t)
    n && e.append(n);
}
function ge(e, t, n, a) {
  const r = document.createElement("button");
  r.type = "button", r.classList.add(`${s}__target-action`, `${s}__target-action--pending`, ...n), r.disabled = a;
  const o = document.createElement("span");
  o.classList.add(`${s}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const i = document.createElement("span");
  return i.classList.add(`${s}__target-action-label`), i.textContent = t, r.append(o, i), r;
}
function V_(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__target-toggle`), t.setAttribute(hu, "true"), t.setAttribute("aria-hidden", "true"), Iu(e, t), t;
}
function ji(e) {
  const t = e.querySelector(`[${bu}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const a = e.querySelector(`[${hu}="true"]`);
  a && Iu(e, a);
}
function Iu(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Gi(e) {
  return e instanceof HTMLElement ? !!e.closest([
    "button",
    "a",
    "input",
    "select",
    "textarea",
    `.${s}__workflow-roll`,
    `.${s}__workflow-roll-formula`,
    `.${s}__workflow-dice-tray`
  ].join(", ")) : !1;
}
function H_(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${s}__target-details`), n.setAttribute(bu, "true");
  const a = document.createElement("div");
  a.classList.add(`${s}__target-resistance-details`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", a.append(r, o);
  const i = W_(e, t.resistance);
  i && a.append(i);
  const l = K_(e, t.resistance), c = Y_(e, t);
  return n.append(a, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function W_(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${s}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const a = e.state === it ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${a}`, n;
}
function K_(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${s}__target-resistance-roll`);
  const a = e.resistanceResult?.formula ?? t?.formula ?? "—", r = e.resistanceResult?.total ?? null, o = _u(
    a,
    r,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Y_(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${s}__target-details-actions`), Su(n, [
    $u(e, t, "full"),
    Cu(e, t, "full")
  ]), n;
}
function X_(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Q_(e) {
  const t = Lu(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect-info`
  ), n.setAttribute(gu, "true"), n;
}
function Lu(e) {
  return e.querySelector(`[${gu}="true"]`);
}
function Z_(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${s}__workflow-section-header`);
  const a = document.createElement("strong");
  a.textContent = "Efeito", n.append(a);
  const r = document.createElement("div");
  r.classList.add(`${s}__effect-info-body`);
  const o = document.createElement("span");
  o.classList.add(`${s}__effect-info-label`), o.textContent = t.label;
  const i = document.createElement("span");
  i.classList.add(`${s}__effect-info-hint`), i.textContent = "Aplicação por alvo", r.append(o, i), e.append(n, r);
}
function J_(e, t, n) {
  const a = n?.parentElement === e ? n : Dt(e, "Conjuração");
  if (!a) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === a || e.insertBefore(t, a.nextElementSibling);
}
function eT(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function fa(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function tT(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function nT(e) {
  return typeof e == "string" && e.length > 0;
}
function aT(e) {
  return e === "normal" || e === "half";
}
function Vi(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function vu(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Hi = "data-paranormal-toolkit-card-layout-refresh-bound";
function rT(e) {
  const t = e.rollCard.querySelector(Mn);
  t && t.getAttribute(Hi) !== "true" && (t.setAttribute(Hi, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const He = "data-paranormal-toolkit-prompt-id", oT = "apply-damage", iT = "data-paranormal-toolkit-multi-target-damage-info";
function sT(e) {
  return Array.from(e.querySelectorAll(`.${s}__workflow-section`)).find((t) => t.getAttribute(iT) === "true" ? !1 : t.querySelector(`.${s}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function lT(e) {
  const t = uT(e);
  return t.find((n) => n.getAttribute(LA) === oT) ?? t.find((n) => su(n) === "aplicar danos") ?? null;
}
function cT(e) {
  const t = Du(e), n = Wi(t);
  return n || Wi(dT(e));
}
function Wi(e) {
  return e.find((t) => {
    const n = su(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function uT(e) {
  const t = Du(e);
  return t.length > 0 ? t : co(e);
}
function Du(e) {
  const t = pT(e);
  return t ? co(e).filter((n) => fT(n, t)) : [];
}
function dT(e) {
  const t = xu(e);
  if (!t) return [];
  const n = mT(e, t);
  return co(e).filter((a) => !a.closest(`.${s}__roll-card`)).filter((a) => Nu(e, a)).filter((a) => !n || gT(a, n));
}
function co(e) {
  const t = xu(e);
  return t ? Array.from(t.querySelectorAll(IA)) : [];
}
function xu(e) {
  return e.closest(`.${s}`) ?? e.parentElement;
}
function mT(e, t) {
  return Array.from(t.querySelectorAll(`.${s}__roll-card`)).find((n) => n !== e && Nu(e, n)) ?? null;
}
function fT(e, t) {
  return e.getAttribute(He) === t ? !0 : Array.from(e.querySelectorAll(`[${He}]`)).some((n) => n.getAttribute(He) === t);
}
function pT(e) {
  return e.getAttribute(He) ?? e.querySelector(`[${He}]`)?.getAttribute(He) ?? null;
}
function Nu(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function gT(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function hT(e) {
  const t = Pu(), n = Un(e.rollCard).state, a = Zr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), r = a.policy.effectActionState, o = ot(r), i = Wc(r);
  return e.applied ? ut({
    kind: "applied",
    visible: !0,
    enabled: !1,
    applied: !0,
    waitingForResistance: o,
    resisted: i,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
    resistanceState: n
  }) : a.policy.canShowApplyEffect ? ut(o ? {
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
  } : i ? {
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
  }) : ut({
    kind: "hidden",
    visible: !1,
    enabled: !1,
    applied: !1,
    waitingForResistance: o,
    resisted: i,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: r,
    resistanceState: n
  });
}
function ut(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function bT(e) {
  const { rollCard: t } = e, n = _T(), a = Pu(), r = Un(t).state, o = Zr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: a,
    resistanceState: r,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), i = o.policy.damageActionState, l = ot(i), c = AT(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: i,
      normalButton: B(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: B(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: yT(r)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: r,
      actionState: i,
      normalButton: B("normal", !1, !1, !1, !!e.normalButtonSkipped, i.label),
      halfButton: B("half", !1, !1, !1, !!e.halfButtonSkipped, i.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? i.reason : null
      }
    };
  if (l)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: i,
      normalButton: B("normal", !0, !1, !1, !!e.normalButtonSkipped, i.label),
      halfButton: B("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: i.reason ?? "Role resistência para aplicar dano."
      }
    };
  if (n !== "assisted")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: i,
      normalButton: B("normal", !0, !0, !1, !!e.normalButtonSkipped, i.label),
      halfButton: B("half", !0, !0, !1, !!e.halfButtonSkipped, i.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? i.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  if (r.kind === "none")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: r,
      actionState: i,
      normalButton: B("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: B("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      actionState: i,
      normalButton: B("normal", !0, !0, !1, !!e.normalButtonSkipped, i.label),
      halfButton: B("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: l ? i.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  const u = r.kind === "succeeded";
  return {
    mode: n,
    canShowApplyDamage: !0,
    waitingForResistance: l,
    resistanceState: r,
    actionState: i,
    normalButton: B("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: B("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${r.total} vs DT ${r.difficulty}.` : `Falhou: ${r.total} vs DT ${r.difficulty}.`
    }
  };
}
function yT(e) {
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
function B(e, t, n, a, r, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: a,
    skipped: r,
    waitingLabel: o
  };
}
function AT(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function _T() {
  try {
    return Ff();
  } catch {
    return "assisted";
  }
}
function Pu() {
  try {
    return Fr();
  } catch {
    return "strict";
  }
}
const TT = "data-paranormal-toolkit-damage-resolution-state", Ki = "data-paranormal-toolkit-damage-icon-enhanced", uo = "data-paranormal-toolkit-damage-original-label", RT = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, Mu = "Outra opção escolhida";
function kT(e, t) {
  t.classList.add(`${s}__actions--embedded`, `${s}__actions--damage-resolution`), xA(t, "Aplicar dano"), ET(e, t);
}
function ET(e, t) {
  const n = Array.from(t.querySelectorAll(Ze)), a = Xi(n, "normal"), r = Xi(n, "half");
  if (!a || !r) {
    $T(n), t.classList.add(`${s}__actions--compact`);
    return;
  }
  Qi(a, "normal"), Qi(r, "half");
  const o = bT({
    rollCard: e,
    normalButtonApplied: pn(a),
    halfButtonApplied: pn(r),
    normalButtonSkipped: lr(a),
    halfButtonSkipped: lr(r)
  });
  if (!o.canShowApplyDamage) {
    Zi(a), Zi(r), Ji(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${s}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${s}__actions--manual`, o.mode !== "assisted"), Yi(a, o.normalButton), Yi(r, o.halfButton), Ji(t, o.summary.state, o.summary.message);
}
function Yi(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    CT(e, t.visible), ST(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function $T(e) {
  for (const t of e)
    lr(t) && t.remove();
}
function pn(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(Mu);
}
function lr(e) {
  return e.textContent?.includes(Mu) ?? !1;
}
function Xi(e, t) {
  const n = RT[t];
  return e.find((a) => n.test(wT(a))) ?? null;
}
function wT(e) {
  return [
    e.getAttribute(uo),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Qi(e, t) {
  if (e.getAttribute(Ki) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const a = document.createElement("i");
  a.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${s}__button-icon`
  ), a.setAttribute("aria-hidden", "true"), e.classList.add(
    `${s}__button--damage-resolution-action`,
    `${s}__button--damage-resolution-${t}`
  ), e.setAttribute(Ki, "true"), e.setAttribute(uo, n), e.setAttribute("aria-label", n), e.replaceChildren(a, Pe(n));
}
function Zi(e) {
  pn(e) || e.remove();
}
function CT(e, t) {
  e.hidden = !t, e.classList.toggle(`${s}__button--damage-resolution-selected`, t);
}
function ST(e, t, n, a = "Role resistência") {
  if (!pn(e)) {
    if (e.disabled = !t, e.classList.toggle(`${s}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", a), e.replaceChildren(Pe(a));
      return;
    }
    e.removeAttribute("aria-disabled"), IT(e, n);
  }
}
function IT(e, t) {
  const n = e.getAttribute(uo) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(LT(t), Pe(n)));
}
function LT(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${s}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function Ji(e, t, n) {
  e.setAttribute(TT, t);
  const a = e.querySelector(`.${s}__damage-resolution-summary`);
  if (!n) {
    a?.remove();
    return;
  }
  const r = a ?? document.createElement("span");
  r.classList.add(`${s}__damage-resolution-summary`), r.textContent = n, a || e.querySelector(ao)?.after(r);
}
const kt = "data-paranormal-toolkit-effect-icon-enhanced", Je = "data-paranormal-toolkit-effect-action-compacted", zn = "data-paranormal-toolkit-effect-resistance-gate", mo = "data-paranormal-toolkit-effect-section", fo = "data-paranormal-toolkit-effect-label";
function vT(e) {
  return e.querySelector(`[${mo}="true"]`);
}
function DT(e) {
  const t = NT(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? MT(), a = VT(n, e.sourceActions, t);
  return a && n.setAttribute(fo, a), OT(n, t, a), jT(e.rollCard, n, e.after ?? e.fallbackAfter), GT(e.sourceActions, n), n;
}
function xT(e, t) {
  const n = t.querySelector(Ze);
  if (!n) return;
  const a = n.textContent?.trim() ?? "", r = Uu(t, n, a), o = Ou(e, n), i = hT({
    rollCard: e,
    effectLabel: r,
    applied: go(n, a),
    effectCanApplyOnSuccessfulResistance: o ? Qe(o) === "success" || Qe(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Hc(o) : !1
  });
  if (i.applied) {
    WT(n);
    return;
  }
  if (!i.visible) {
    KT(n);
    return;
  }
  if (i.waitingForResistance) {
    YT(n, i.actionLabel);
    return;
  }
  if (i.resisted) {
    XT(n, i.compactLabel);
    return;
  }
  QT(n), Bu(n, i.displayLabel);
}
function NT(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ze) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ze) ?? []), a = [...t, ...n];
  return a.length === 0 ? null : PT(e.rollCard, a) ?? a[0] ?? null;
}
function PT(e, t) {
  const n = Un(e).state, a = Gc(n), r = Fu(e);
  if (r.length === 0) return null;
  for (const o of t) {
    const i = Ou(e, o, r);
    if (i && Vc(i, a)) return o;
  }
  return null;
}
function Ou(e, t, n = Fu(e)) {
  const a = po(t, t.textContent?.trim() ?? ""), r = za(a);
  return r ? n.find((o) => [o.label, o.conditionId].some((i) => za(i) === r)) ?? null : null;
}
function Fu(e) {
  const t = nu(wy(e));
  if (!t) return [];
  const n = St(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((a) => a.actor === "target") : [];
}
function MT() {
  const e = document.createElement("section");
  return e.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect-action`
  ), e.setAttribute(mo, "true"), e;
}
function OT(e, t, n) {
  e.setAttribute(mo, "true"), e.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect-action`
  ), e.classList.remove(`${s}__actions`, `${s}__actions--effect-resolution`);
  const a = FT(e), r = BT(a);
  r.textContent = "Efeito";
  const o = UT(e, a), i = qT(o);
  i.textContent = ZT(n ?? Uu(e, t, t.textContent?.trim() ?? ""));
  const l = zT(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ze)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !go(t, c) && !HT(t, c) && Bu(t, n ?? c);
}
function FT(e) {
  const t = e.querySelector(`:scope > .${s}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${s}__workflow-section-header`), e.prepend(n), n;
}
function BT(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function UT(e, t) {
  const n = e.querySelector(`:scope > .${s}__effect-section-body`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(`${s}__effect-section-body`), t.after(a), a;
}
function qT(e) {
  const t = e.querySelector(`:scope > .${s}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${s}__effect-section-label`), e.prepend(n), n;
}
function zT(e) {
  const t = e.querySelector(`:scope > .${s}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${s}__effect-section-action`), e.append(n), n;
}
function jT(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function GT(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Ze)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function VT(e, t, n) {
  const a = e.getAttribute(fo);
  if (a && a.trim().length > 0) return a.trim();
  const r = t?.querySelector(`.${s}__effect-resolution-label`)?.textContent?.trim();
  return r || po(n, n.textContent?.trim() ?? "");
}
function po(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ye(n) !== "efeito aplicado") return n;
  const a = Cy(e);
  if (a) return a;
  const r = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return r.length > 0 && ye(r) !== "aplicado" ? r : null;
}
function go(e, t) {
  return e.classList.contains(vA) || ye(t).includes("aplicado");
}
function HT(e, t) {
  const n = e.getAttribute(zn);
  if (n === "pending" || n === "resisted") return !0;
  const a = za(t);
  return a.includes("resistiu") || a.includes("role resistencia");
}
function Bu(e, t) {
  e.getAttribute(Je) === "true" && e.getAttribute(kt) === "true" || (e.disabled = !1, e.classList.add(`${s}__button--effect-resolution-action`), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.setAttribute(Je, "true"), e.setAttribute(kt, "true"), e.setAttribute(DA, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    ro("✦", `${s}__button-icon--effect`),
    Pe("Aplicar")
  ));
}
function WT(e) {
  e.getAttribute(Je) === "true" && ye(e.textContent) === "✓ aplicado" || (e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-applied`), e.classList.remove(
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.setAttribute(Je, "true"), e.setAttribute(kt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    ro("✓", `${s}__button-icon--effect-applied`),
    Pe("Aplicado")
  ));
}
function Uu(e, t, n) {
  const a = e.getAttribute(fo) ?? e.querySelector(`.${s}__effect-section-label`)?.textContent?.trim();
  return a && a.trim().length > 0 ? a.trim() : po(t, n) ?? n;
}
function KT(e) {
  go(e, e.textContent?.trim() ?? "") || e.remove();
}
function YT(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Je), e.removeAttribute(kt), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-resisted`
  ), e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-waiting`), e.setAttribute(zn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Pe(t));
}
function XT(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Je), e.removeAttribute(kt), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-waiting`
  ), e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-resisted`), e.setAttribute(zn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    ro("✓", `${s}__button-icon--effect-resisted`),
    Pe(t)
  );
}
function QT(e) {
  e.classList.remove(
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.removeAttribute(zn), e.removeAttribute("aria-disabled");
}
function ZT(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const JT = "data-paranormal-toolkit-card-layout-normalized";
function eR(e) {
  const t = tR(e.rollCard), n = nR(t);
  return rT({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function tR(e) {
  return {
    rollCard: e,
    damageSection: sT(e),
    resistance: e.querySelector(Gr),
    damageActions: lT(e),
    effectActionSource: cT(e),
    effectSection: vT(e)
  };
}
function nR(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: a,
    damageActions: r,
    effectActionSource: o,
    effectSection: i
  } = e;
  t.setAttribute(JT, "true"), t.classList.add(`${s}__roll-card--structured`);
  const l = Dt(t, "Conjuração"), c = aR({
    rollCard: t,
    damageSection: n,
    resistance: a,
    fallbackAfter: l
  });
  n && r && (r.parentElement !== n && n.append(r), kT(t, r));
  const u = DT({
    rollCard: t,
    existingSection: i,
    sourceActions: o,
    after: rR(n, c),
    fallbackAfter: l
  });
  return u && xT(t, u), u;
}
function aR(e) {
  const { rollCard: t, damageSection: n, resistance: a, fallbackAfter: r } = e;
  return a ? n ? (a.parentElement !== n && n.append(a), n) : r ? (a.parentElement === t && a.previousElementSibling === r || t.insertBefore(a, r.nextElementSibling), a) : ((a.parentElement !== t || a.previousElementSibling !== null) && t.prepend(a), a) : null;
}
function rR(e, t) {
  return e ?? t;
}
const qu = [0, 80, 180, 400, 900, 1600, 3e3], es = /* @__PURE__ */ new WeakSet();
function oR(e) {
  zu(e), iR(e);
}
function zu(e) {
  for (const t of Array.from(e.querySelectorAll(`.${s}__roll-card`)))
    ju(t);
}
function iR(e) {
  if (!es.has(e)) {
    es.add(e);
    for (const t of qu)
      globalThis.setTimeout(() => {
        zu(e);
      }, t);
  }
}
function ju(e) {
  const t = eR({
    rollCard: e,
    refreshDelaysMs: qu,
    onRefresh: () => ju(e)
  });
  i_({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const sR = "data-paranormal-toolkit-resistance-roll-result-enhanced", ts = "data-paranormal-toolkit-resistance-original-description", lR = "data-paranormal-toolkit-resistance-skill", cR = "data-paranormal-toolkit-resistance-skill-label", uR = `${s}__resistance--without-roll-button`, dR = ["Fortitude", "Reflexos", "Vontade"];
function mR(e) {
  for (const t of Array.from(e.querySelectorAll(Gr)))
    fR(t);
  oR(e);
}
function fR(e) {
  const t = e.querySelector(ph), n = e.querySelector(Sc), a = e.querySelector(Mn), r = yR(a) ? a : null, o = e.querySelector(Ic);
  if (!t && !n && !o && !a) return;
  e.classList.toggle(uR, !r);
  const i = bR(e, a);
  t && t.parentElement !== i && i.append(t), n && n.parentElement !== i && i.append(n), o && (o.parentElement !== e && (!a || !a.contains(o)) && e.append(o), TR(o)), pR(e, a, n), r && (wR(r), r.parentElement !== e && e.append(r));
}
function pR(e, t, n) {
  if (!n) return;
  const a = e.closest(`.${s}__roll-card`);
  if (!a) return;
  const r = hR(n), o = lu({
    description: r,
    skillLabel: AR(t, r),
    difficulty: Qr(a)
  });
  if (!o) {
    n.textContent = r, n.classList.remove(`${s}__resistance-description--difficulty`);
    return;
  }
  gR(n, o), n.classList.add(`${s}__resistance-description--difficulty`);
}
function gR(e, t) {
  const n = document.createElement("span");
  n.classList.add(`${s}__resistance-label-skill`), n.textContent = t.skillLabel;
  const a = document.createElement("strong");
  a.classList.add(`${s}__resistance-label-difficulty`), a.textContent = t.difficultyLabel;
  const r = [n, document.createTextNode(" · "), a];
  if (t.description) {
    const o = document.createElement("span");
    o.classList.add(`${s}__resistance-label-effect`), o.textContent = t.description, r.push(document.createTextNode(" · "), o);
  }
  e.replaceChildren(...r);
}
function hR(e) {
  const t = e.getAttribute(ts);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(ts, n), n;
}
function bR(e, t) {
  const n = e.querySelector(`.${ki}`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(ki), e.insertBefore(a, t?.parentElement === e ? t : e.firstChild), a;
}
function yR(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function AR(e, t) {
  const n = e?.getAttribute(cR) ?? e?.getAttribute(lR) ?? null;
  return n || _R(t);
}
function _R(e) {
  const t = ns(e);
  return dR.find((n) => t.startsWith(ns(n))) ?? null;
}
function ns(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function TR(e) {
  const t = RR(e.textContent ?? "");
  t && (e.setAttribute(sR, "true"), e.replaceChildren($R(t)));
}
function RR(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, a, r] = t, o = n?.trim() ?? "Resistência", i = Number(r);
  if (!Number.isFinite(i)) return null;
  const { formula: l, diceValues: c } = kR(a ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(i),
    diceValues: c
  } : null;
}
function kR(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: ER(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function ER(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function $R(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${s}__workflow-roll`,
    `${s}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${s}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const a = CR(e);
  return a && t.append(a), t;
}
function wR(e) {
  e.classList.remove(
    `${s}__resistance-roll-button--succeeded`,
    `${s}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${s}__roll-card`);
  if (!t) return;
  const n = Un(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const a = n.kind === "succeeded" ? "succeeded" : "failed", r = a === "succeeded" ? "✓" : "✕", o = a === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${s}__resistance-roll-button--${a}`), e.textContent = `${n.total} ${r}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function CR(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-dice-tray`);
  for (const n of SR(e.diceValues, e.formula)) {
    const a = document.createElement("span");
    a.classList.add(`${s}__workflow-die`), n.active || a.classList.add(`${s}__workflow-die--inactive`), a.textContent = String(n.value), t.append(a);
  }
  return t;
}
function SR(e, t) {
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
function IR(e) {
  for (const t of Array.from(e.querySelectorAll(dh))) {
    const n = MR(t);
    LR(t), n && (vR(t, n), DR(t, n));
  }
}
function LR(e) {
  for (const t of Array.from(e.querySelectorAll(mh)))
    t.remove();
}
function vR(e, t) {
  const a = e.closest(`.${s}`)?.querySelector(Cc) ?? null, r = a?.querySelector(uh) ?? null, o = a ?? e, i = o.querySelector(bh);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const l = i ?? document.createElement("span");
  if (l.className = JR(t.elementTone), l.textContent = ZR(t), !i) {
    if (r?.parentElement === o) {
      r.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function DR(e, t) {
  const n = xR(e);
  NR(e, n);
  const a = PR(t);
  if (a.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${s}__ritual-metadata`);
  for (const i of a) {
    const l = document.createElement("span");
    l.classList.add(`${s}__ritual-metadata-chip`), l.textContent = i, r.append(l);
  }
  if (n) {
    const i = n.querySelector(`.${s}__summary`);
    if (i?.parentElement === n) {
      i.insertAdjacentElement("afterend", r);
      return;
    }
    n.append(r);
    return;
  }
  const o = e.querySelector(Lc);
  if (o) {
    e.insertBefore(r, o);
    return;
  }
  e.prepend(r);
}
function xR(e) {
  return e.closest(`.${s}`)?.querySelector(Cc) ?? null;
}
function NR(e, t) {
  const n = [e, t].filter((a) => a !== null);
  for (const a of n)
    for (const r of Array.from(a.querySelectorAll(yh)))
      r.remove();
}
function PR(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Oa(e.target)}` : null,
    e.duration ? `Duração: ${Oa(e.duration)}` : null,
    e.resistance ? `Resistência: ${yc(e.resistance)}` : null
  ].filter(Dn);
}
function MR(e) {
  const t = OR(e), n = jR(e), r = (t ? zR(t) : null)?.system ?? null, o = t?.summaryLines ?? [], i = ho(Q(r, "element")), l = le("op.elementChoices", i) ?? rs(Se(o, "Elemento")) ?? rs(n.damageType), c = i ?? ek(l), u = Q(r, "circle") ?? Se(o, "Círculo"), m = HR(r) ?? Se(o, "Alvo"), p = XR(r, "duration", "op.durationChoices") ?? Se(o, "Duração"), A = GR(e) ?? KR(r) ?? Se(o, "Resistência"), $ = VR(o) ?? n.cost, T = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: $,
    target: m,
    duration: p,
    resistance: A
  };
  return QR(T) ? T : null;
}
function OR(e) {
  const t = FR(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Pn), a = UR(n);
  if (a.length === 0) return null;
  const r = BR(e);
  if (r.size > 0) {
    const o = a.find((i) => i.pendingId && r.has(i.pendingId));
    if (o) return o;
  }
  return a.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function FR(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Br()?.messages?.get?.(n) ?? null : null;
}
function BR(e) {
  const t = e.closest(`.${s}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const a of Array.from(t.querySelectorAll(`[${Ri}]`))) {
    const r = a.getAttribute(Ri)?.trim();
    r && n.add(r);
  }
  return n;
}
function UR(e) {
  if (!vn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(qR).filter((n) => n !== null) : [];
}
function qR(e) {
  return vn(e) ? {
    pendingId: Zt(e.pendingId),
    actorId: Zt(e.actorId),
    itemId: Zt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(qp) : []
  } : null;
}
function zR(e) {
  if (!e.itemId) return null;
  const t = Br(), a = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return a || (t?.items?.get?.(e.itemId) ?? null);
}
function jR(e) {
  let t = null, n = null;
  for (const a of Array.from(e.querySelectorAll(fh))) {
    const r = rt(a.textContent);
    if (!r) continue;
    const o = Up(r, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(r) && (t = r);
  }
  return { cost: t, damageType: n };
}
function GR(e) {
  const t = rt(e.querySelector(Sc)?.textContent);
  return t ? yc(t) : null;
}
function Se(e, t) {
  const n = Tt(t);
  for (const a of e) {
    const r = a.indexOf(":");
    if (!(r < 0 || Tt(a.slice(0, r)) !== n))
      return rt(a.slice(r + 1));
  }
  return null;
}
function VR(e) {
  const t = Se(e, "Custo") ?? Se(e, "PE");
  return t || (e.map(rt).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function HR(e) {
  const t = Q(e, "target");
  if (!t) return null;
  if (t === "area")
    return WR(e) ?? le("op.targetChoices", t) ?? "Área";
  const n = le("op.targetChoices", t) ?? be(t);
  return [t === "people" || t === "creatures" ? Q(e, "targetQtd") : null, n].filter(Dn).join(" ");
}
function WR(e) {
  const t = Q(e, "area.name"), n = Q(e, "area.size"), a = Q(e, "area.type"), r = t ? le("op.areaChoices", t) ?? be(t) : null, o = a ? le("op.areaTypeChoices", a) ?? be(a) : null;
  return r ? n ? o ? `${r} ${n}m ${Oa(o)}` : `${r} ${n}m` : r : null;
}
function KR(e) {
  const t = Q(e, "skillResis"), n = Q(e, "resistance");
  if (!t || !n) return null;
  const a = le("op.skill", t) ?? be(t), r = YR(n);
  return [a, r].filter(Dn).join(" ");
}
function YR(e) {
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
      return le("op.resistanceChoices", e) ?? be(e);
  }
}
function XR(e, t, n) {
  const a = Q(e, t);
  return a ? le(n, a) ?? be(a) : null;
}
function QR(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function ZR(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function JR(e) {
  return [
    `${s}__ritual-element-badge`,
    e ? `${s}__ritual-element-badge--${e}` : null
  ].filter(Dn).join(" ");
}
function ho(e) {
  const t = Tt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function rs(e) {
  const t = ho(e);
  return t ? le("op.elementChoices", t) ?? be(t) : e ? be(e) : null;
}
function ek(e) {
  return ho(e);
}
function le(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, a = Br()?.i18n?.localize?.(n);
  return !a || a === n ? null : a;
}
const os = "data-paranormal-toolkit-dice-toggle-enhanced";
function tk(e) {
  for (const t of Array.from(e.querySelectorAll(vc)))
    Gu(t);
}
function nk(e) {
  const t = Hu(e.target);
  if (!t) return;
  const n = bo(t);
  n && (e.preventDefault(), Vu(n, t));
}
function ak(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Hu(e.target);
  if (!t) return;
  const n = bo(t);
  n && (e.preventDefault(), Vu(n, t));
}
function Gu(e) {
  const t = e.querySelector(On);
  if (!t) return;
  const n = e.querySelector(Hr);
  if (n && n.getAttribute(os) !== "true" && (n.setAttribute(os, "true"), n.classList.add(Wr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-chevron-down"), a.setAttribute("aria-hidden", "true"), n.append(a);
  }
}
function Vu(e, t) {
  const n = e.querySelector(On);
  if (!n) return;
  const a = !e.classList.contains(Vr);
  rk(e, t, n, a);
}
function rk(e, t, n, a) {
  e.classList.toggle(Vr, a), n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.title = a ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const r = t.querySelector("i");
  r && (r.classList.toggle("fa-chevron-down", !a), r.classList.toggle("fa-chevron-up", a));
}
function Hu(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Hr);
  if (!t) return null;
  const n = bo(t);
  return n ? (Gu(n), t.classList.contains(Wr) ? t : null) : null;
}
function bo(e) {
  const t = e.closest(vc);
  return t && t.querySelector(On) ? t : null;
}
const is = `${d}-workflow-dice-toggle-styles`;
function ok() {
  if (document.getElementById(is)) return;
  const e = document.createElement("style");
  e.id = is, e.textContent = `
.${s}__workflow-section .${s}__roll-detail-toggle,
.${s}__workflow-section .${s}__roll-detail-list {
  display: none !important;
}

.${s}__workflow-roll:not(.${s}__workflow-roll--dice-open) .${s}__workflow-dice-tray,
.${s}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${s}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${s}__workflow-roll-formula--toggle:hover,
.${s}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${s}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${s}__header .${s}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${s}__ritual-element-badge {
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

.${s}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${s}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${s}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${s}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${s}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${s}__header .${s}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${s}__roll-card > .${s}__ritual-metadata {
  display: none !important;
}

.${s}__ritual-metadata-chip {
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

.${s}__resistance {
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

.${s}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${s}__resistance-content .${s}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${s}__resistance-content .${s}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${s}__resistance-content .${s}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${s}__resistance > .${s}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: start;
}

.${s}__resistance > .${s}__resistance-roll-result,
.${s}__resistance-content .${s}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${s}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
}

.${s}__resistance-workflow-roll .${s}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${s}__resistance-workflow-roll .${s}__workflow-roll-formula i {
  margin-left: auto;
}

.${s}__resistance > .${s}__resistance-roll-button--succeeded {
  border-color: rgba(34, 116, 70, 0.34);
  background: rgba(52, 168, 83, 0.12);
  color: #1f6f43;
}

.${s}__resistance > .${s}__resistance-roll-button--failed {
  border-color: rgba(150, 45, 52, 0.34);
  background: rgba(189, 54, 62, 0.12);
  color: #8f2f36;
}

.${s}__resistance-workflow-roll .${s}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${s}__resistance-workflow-roll .${s}__workflow-die {
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

.${s}__resistance-workflow-roll .${s}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${s}__workflow-section--casting .${s}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${s}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${s}__workflow-section-title-row .${s}__workflow-section-status {
  flex: 0 0 auto;
}

.${s}__casting-backlash-button {
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

.${s}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${s}__casting-backlash-button:hover,
.${s}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${s}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${s}__casting-backlash-button.${s}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${s}__workflow-section--effect .${s}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${s}__workflow-section--effect .${s}__resistance-content {
  gap: 0.22rem !important;
}

.${s}__workflow-section--effect .${s}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${s}__workflow-section--effect .${s}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${s}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${s}__actions--compact,
.${s}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${s}__actions--damage-resolution .${s}__actions-title {
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

.${s}__actions--damage-resolution .${s}__actions-title::before,
.${s}__actions--damage-resolution .${s}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${s}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${s}__actions--damage-resolution .${s}__button {
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

.${s}__actions--damage-resolution .${s}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${s}__actions--damage-resolution .${s}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${s}__button,
.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${s}__button,
.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${s}__button {
  grid-column: 1 / -1;
}

.${s}__actions--damage-resolution .${s}__button[hidden] {
  display: none !important;
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${s}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${s}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${s}__actions--effect-resolution {
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

.${s}__actions--effect-resolution .${s}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${s}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${s}__actions--effect-resolution .${s}__button {
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
.${s}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${s}__actions--effect-resolution .${s}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${s}__actions--effect-resolution .${s}__button:hover,
.${s}__actions--effect-resolution .${s}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${s}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${s}__button--effect-resolution-action .${s}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${s}__roll-card > .${s}__actions--effect-resolution {
  margin: 0 !important;
}

.${s}__roll-card > .${s}__workflow-section--effect + .${s}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${s}__actions--effect-resolution.${s}__workflow-section {
  align-items: center !important;
}

.${s}__actions--effect-resolution .${s}__button--executed,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${s}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${s}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.9 — Estados bloqueados de efeito não devem parecer clicáveis */
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting:hover,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting:focus,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:hover,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:focus,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting:disabled,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:hover,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:focus,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.22.0 — Card estruturado: remove moldura externa e mantém cards internos */
.${s}__roll-card--structured {
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${s}__roll-card--structured > .${s}__workflow-section,
.${s}__roll-card--structured > .${s}__actions--effect-resolution {
  margin-inline: 0 !important;
}

.${s}__roll-card--structured > .${s}__workflow-section + .${s}__workflow-section,
.${s}__roll-card--structured > .${s}__workflow-section + .${s}__actions--effect-resolution,
.${s}__roll-card--structured > .${s}__actions--effect-resolution + .${s}__workflow-section {
  margin-top: 0.28rem !important;
}

.${s}__roll-card--structured > .${s}__roll-meta,
.${s}__roll-card--structured > .${s}__workflow-notes {
  margin-inline: 0.08rem !important;
}

/* 0.22.2 — Unifica ritmo e tipografia do card de Efeito com Conjuração/Dano */
.${s}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${s}__roll-card--structured > .${s}__workflow-section,
.${s}__roll-card--structured > .${s}__actions--effect-resolution {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${s}__roll-card--structured > .${s}__actions--effect-resolution {
  gap: 0.14rem 0.5rem !important;
  padding: 0.54rem 0.58rem !important;
}

.${s}__roll-card--structured > .${s}__actions--effect-resolution .${s}__actions-title {
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

.${s}__roll-card--structured > .${s}__actions--effect-resolution .${s}__effect-resolution-label {
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
}

.${s}__roll-card--structured > .${s}__actions--effect-resolution .${s}__button {
  align-self: center !important;
}

/* 0.22.3 — Efeito como workflow-section real, sem card legado de actions */
.${s}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${s}__roll-card--structured > .${s}__workflow-section,
.${s}__roll-card--structured > .${s}__workflow-section--effect-action {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${s}__workflow-section--effect-action {
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

.${s}__workflow-section--effect-action > .${s}__workflow-section-header {
  grid-area: header;
  min-width: 0;
  margin: 0 !important;
}

.${s}__workflow-section--effect-action > .${s}__workflow-section-header strong {
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

.${s}__effect-section-body {
  display: contents !important;
}

.${s}__effect-section-label {
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

.${s}__effect-section-action {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  justify-self: end !important;
  align-self: center !important;
  min-width: 0;
}

.${s}__workflow-section--effect-action .${s}__button {
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

.${s}__workflow-section--effect-action .${s}__button:hover,
.${s}__workflow-section--effect-action .${s}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${s}__workflow-section--effect-action .${s}__button--executed,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${s}__workflow-section--effect-action .${s}__button--effect-resolution-waiting,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${s}__workflow-section--effect-action .${s}__button--effect-resolution-waiting:hover,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-waiting:focus,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-waiting:disabled,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted:hover,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted:focus,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted:hover,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted:focus,
.${s}__workflow-section--effect-action .${s}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.23.0 — Multi-target ritual card visual model */
.${s}__roll-card--multi-target
  > .${s}__workflow-section--multi-target-source,
.${s}__roll-card--multi-target
  > .${s}__workflow-section--multi-target-effect-source {
  display: none !important;
}

.${s}__workflow-section--targets {
  border-color: rgba(143, 54, 62, 0.24) !important;
  border-left: 3px solid rgba(133, 49, 59, 0.68) !important;
  background: linear-gradient(180deg, rgba(255, 248, 245, 0.84), rgba(250, 239, 235, 0.52)) !important;
}

.${s}__targets-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem !important;
}

.${s}__workflow-section--targets
  .${s}__workflow-section-header strong {
  color: rgba(117, 48, 58, 0.94) !important;
}

.${s}__targets-status {
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

.${s}__targets-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.3rem !important;
  margin-top: 0.42rem !important;
}

.${s}__target-row {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.34rem !important;
  border: 1px solid rgba(143, 54, 62, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.38rem !important;
  background: rgba(255, 255, 255, 0.34) !important;
  cursor: pointer !important;
}

.${s}__target-row:focus-visible {
  outline: 2px solid rgba(143, 54, 62, 0.34) !important;
  outline-offset: 2px !important;
}

.${s}__target-summary {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.32rem !important;
  min-width: 0 !important;
}

.${s}__target-summary-main {
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) auto auto !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${s}__target-summary-actions {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${s}__target-row[aria-expanded="true"] .${s}__target-summary-actions {
  display: none !important;
}

.${s}__target-avatar {
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

.${s}__target-name {
  min-width: 0 !important;
  color: rgba(36, 27, 24, 0.94) !important;
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1.12 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${s}__target-resistance-button,
.${s}__target-action {
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

.${s}__target-resistance-button {
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

.${s}__target-resistance-button i {
  font-size: 0.88rem !important;
}

.${s}__target-resistance-fallback {
  display: none !important;
}

.${s}__target-action {
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

.${s}__target-action:disabled {
  opacity: 0.74 !important;
}

.${s}__target-summary-actions .${s}__target-action {
  width: 100% !important;
}

.${s}__target-action-icon {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${s}__target-action-label {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${s}__target-toggle {
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

.${s}__target-details {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  gap: 0.36rem !important;
  border: 1px solid rgba(151, 111, 45, 0.22) !important;
  border-radius: 8px !important;
  padding: 0.48rem !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.76), rgba(255, 245, 219, 0.42)) !important;
}

.${s}__target-details[hidden] {
  display: none !important;
}

.${s}__target-resistance-details {
  grid-column: 1 / -1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${s}__target-resistance-details strong {
  color: rgba(107, 78, 35, 0.96) !important;
  font-size: 0.74rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${s}__target-resistance-details span {
  color: rgba(36, 27, 24, 0.84) !important;
  font-size: 0.78rem !important;
  font-weight: 700 !important;
  line-height: 1.22 !important;
}

.${s}__target-formula {
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

.${s}__target-formula span {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${s}__target-formula i {
  flex: 0 0 auto !important;
  font-size: 0.62rem !important;
  opacity: 0.68 !important;
}

.${s}__target-details-actions {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.32rem !important;
  grid-column: 1 / -1 !important;
}

.${s}__target-details-actions .${s}__target-action {
  justify-content: center !important;
  width: 100% !important;
  min-height: 2rem !important;
  padding-inline: 0.5rem !important;
}

.${s}__target-details-actions .${s}__target-action-label {
  overflow: visible !important;
  text-overflow: clip !important;
}

.${s}__workflow-section--effect-info {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${s}__workflow-section--effect-info
  > .${s}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
}

.${s}__effect-info-body {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${s}__effect-info-label {
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.81rem !important;
  font-weight: 850 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere !important;
}

.${s}__effect-info-hint {
  color: rgba(36, 27, 24, 0.68) !important;
  font-size: 0.74rem !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
}

`, document.head.append(e);
}
const ik = [0, 100, 500, 1500, 3e3];
let ss = !1, pa = null;
function sk() {
  if (!ss) {
    ss = !0, ok(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ht(cn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ht(cn(t));
    }), Hooks.once("ready", () => {
      ht(document), lk();
    }), document.addEventListener("click", nk), document.addEventListener("keydown", ak);
    for (const e of ik)
      globalThis.setTimeout(() => ht(document), e);
  }
}
function lk() {
  pa || !document.body || (pa = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ht(n);
  }), pa.observe(document.body, { childList: !0, subtree: !0 }));
}
function ht(e) {
  e && (e instanceof Element && (e.matches('[data-paranormal-toolkit-card-renderer="ritual-single-target"]') || e.querySelector('[data-paranormal-toolkit-card-renderer="ritual-single-target"]')) || (Mh(e), IR(e), mR(e), tk(e), Sh(e)));
}
function ck() {
  sk();
}
const uk = "data-paranormal-toolkit-action-section", dk = "ritual-log", mk = ".paranormal-toolkit-item-use-prompt__actions", fk = ".paranormal-toolkit-item-use-prompt__actions-title", pk = [0, 100, 500, 1500];
let ls = !1;
function gk() {
  if (ls) return;
  const e = (t, n) => {
    cs(Ak(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), cs(document), ls = !0;
}
function cs(e) {
  for (const t of pk)
    globalThis.setTimeout(() => hk(e), t);
}
function hk(e) {
  bk(e), yk(e);
}
function bk(e) {
  for (const t of e.querySelectorAll(
    `[${uk}="${dk}"]`
  ))
    t.remove();
}
function yk(e) {
  for (const t of e.querySelectorAll(mk)) {
    if (us(t.querySelector(fk)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => us(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function Ak(e) {
  if (e instanceof HTMLElement || _k(e))
    return e;
  if (Tk(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function _k(e) {
  return e instanceof HTMLElement;
}
function Tk(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function us(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const bt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Wu = {
  PV: "system.attributes.hp"
}, cr = {
  PV: [bt.PV, Wu.PV],
  SAN: [bt.SAN],
  PE: [bt.PE],
  PD: [bt.PD]
}, ur = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Rk {
  getResource(t, n) {
    const a = ds(t, n);
    if (!a.ok)
      return g(a.error);
    const r = a.value, o = `${r}.value`, i = `${r}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, i), u = fs(t, n, o, l, "valor atual");
    if (u) return g(u);
    const m = fs(t, n, i, c, "valor máximo");
    return m ? g(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, a) {
    const r = ds(t, n);
    if (!r.ok)
      throw new Error(r.error.message);
    await t.update({ [`${r.value}.value`]: a });
  }
}
function ds(e, t) {
  const n = kk(e.type, t);
  if (n && ms(e, n))
    return y(n);
  const a = cr[t].find(
    (r) => ms(e, r)
  );
  return a ? y(a) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ek(e, t),
    path: cr[t].join(" | ")
  });
}
function kk(e, t) {
  return e === "threat" ? Wu[t] ?? null : e === "agent" ? bt[t] : null;
}
function ms(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof a == "number" && Number.isFinite(a);
}
function Ek(e, t) {
  const n = e.type ?? "unknown", a = cr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${a}.`;
}
function fs(e, t, n, a, r) {
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
class Ku {
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
      const i = ur.ritualItem.circleCandidates;
      return g({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: a, value: r } = n, o = $k(r);
    return o ? y(o) : g({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: r
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of ur.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, n);
      if (a != null)
        return { path: n, value: a };
    }
    return null;
  }
}
function $k(e) {
  if (ps(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (ps(n))
      return n;
  }
  return null;
}
function ps(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const wk = "dice-so-nice";
async function yo(e) {
  if (!Ck() || !Sk()) return;
  const t = Ik();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Ck() {
  try {
    return ch().enabled;
  } catch {
    return !1;
  }
}
function Sk() {
  return game.modules?.get?.(wk)?.active === !0;
}
function Ik() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const gs = "occultism";
class Yu {
  getDifficulty(t) {
    return Xu(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const a = await vk(t, gs);
    if (!a)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await yo(a);
    const r = Nk(a);
    return {
      skill: gs,
      skillLabel: "Ocultismo",
      roll: a,
      formula: xk(a),
      total: r,
      difficulty: n,
      success: r >= n,
      diceBreakdown: Pk(a)
    };
  }
}
function Xu(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Lk(e) {
  return new Yu().rollCastingCheck(e);
}
async function vk(e, t) {
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
  return Dk(a);
}
function Dk(e) {
  return hs(e) ? e : Array.isArray(e) ? e.find(hs) ?? null : null;
}
function hs(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function xk(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Nk(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Pk(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Mk);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const i = o.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function Mk(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Ok = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Fk {
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
    const a = n.value, r = Bk(t.ritual, a);
    return r.ok ? r.value ? y(r.value) : y({
      resource: "PE",
      amount: Ok[a],
      source: "default-by-circle",
      circle: a
    }) : g(r.error);
  }
}
function Bk(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Uk(n) ? {
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
function Uk(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class qk {
  async applyPresetItemPatch(t, n) {
    const a = n.itemPatch;
    if (!a) return ga("missing-item-patch");
    if (t.type !== "ritual") return ga("unsupported-item-type");
    const r = zk(a);
    return Object.keys(r).length === 0 ? ga("empty-update") : (await t.update(r), {
      applied: !0,
      updateData: r
    });
  }
}
function zk(e) {
  const t = {};
  z(t, "name", e.name), z(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (z(t, "system.circle", n.circle), z(t, "system.element", n.element), z(t, "system.target", n.target), z(t, "system.targetQtd", n.targetQuantity), z(t, "system.execution", n.execution), z(t, "system.range", n.range), z(t, "system.duration", n.duration), z(t, "system.skillResis", n.resistanceSkill), z(t, "system.resistance", n.resistance), z(t, "system.studentForm", n.studentForm), z(t, "system.trueForm", n.trueForm)), t;
}
function z(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function ga(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class jk {
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
    return this.getNumber(t, ur.ritual.dt, 0);
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
class Gk {
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
class Vk {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Hk(t);
    return n.ok ? this.presets.has(t.id) ? g({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, ha(t)), y(t)) : n;
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
    return n ? ha(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? y(n) : g({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(ha);
  }
  findForItem(t) {
    return this.list().map((n) => Wk(n, t)).filter((n) => n !== null).sort((n, a) => a.score - n.score || n.preset.id.localeCompare(a.preset.id));
  }
}
function Hk(e) {
  return !ba(e.id) || !ba(e.version) || !ba(e.label) ? g({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? g({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Wk(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, n.push(`itemType:${t.type}`);
  }
  for (const r of e.matchers) {
    const o = Kk(r, t);
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
function Kk(e, t) {
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
      const n = bs(t.name), a = e.names.map(bs).includes(n);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Yk(t), a = n !== null && e.circles.includes(n);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function bs(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Yk(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function ha(e) {
  return structuredClone(e);
}
function ba(e) {
  return typeof e == "string" && e.length > 0;
}
function gn(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? g({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = jn(e.amountFrom);
    if (!n)
      return g({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const a = t.rolls[n];
    if (!a)
      return g({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const r = Math.trunc(a.total);
    return !Number.isInteger(r) || r <= 0 ? g({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : y(r);
  }
  return g({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function jn(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function Xk(e, t, n) {
  if (!ys(e.id) || !ys(e.formula))
    return g({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const a = new Roll(e.formula), r = await Promise.resolve(a.evaluate()), o = r.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return g({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await yo(r);
    const l = {
      ...n.rollRequests[e.id] ?? Qu(e, t),
      total: o,
      roll: r
    };
    return n.rolls[e.id] = l, y(l);
  } catch (a) {
    return g({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: a
    });
  }
}
function Qu(e, t) {
  const n = e.intent ?? Qk(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Qk(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function ys(e) {
  return typeof e == "string" && e.length > 0;
}
async function Et(e, t, n, a, r) {
  switch (a) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Gt(t, n, a, r) : e.spend(t, n, r);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Gt(t, n, a, r) : e.damage(t, n, r);
    case "heal":
      return n !== "PV" ? Gt(t, n, a, r) : e.heal(t, n, r);
    case "recover":
      return n !== "SAN" ? Gt(t, n, a, r) : e.recover(t, n, r);
  }
}
function Gt(e, t, n, a) {
  return g({
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
function Zk(e) {
  const { step: t, context: n, transaction: a, stepIndex: r, lifecycle: o } = e;
  if (t.operation === "damage") {
    const i = Jk(t, n, a, r);
    n.damageInstances.push(i), o.emit("afterDamageResolution", n, {
      stepIndex: r,
      step: t,
      damage: i,
      resourceTransaction: a,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    }), o.emit("afterApplyDamage", n, {
      stepIndex: r,
      step: t,
      damage: i,
      resourceTransaction: a,
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
    const i = eE(t, n, a, r);
    n.healingInstances.push(i), o.emit("afterApplyHealing", n, {
      stepIndex: r,
      step: t,
      healing: i,
      resourceTransaction: a,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount
      }
    });
  }
}
function Jk(e, t, n, a) {
  const r = jn(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    id: Zu(t.id, "damage", a, t.damageInstances.length),
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
function eE(e, t, n, a) {
  const r = jn(e.amountFrom);
  return {
    id: Zu(t.id, "healing", a, t.healingInstances.length),
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
function Zu(e, t, n, a) {
  return `${e}.${t}.${n}.${a}`;
}
function tE(e, t, n) {
  const a = jn(e.amountFrom), r = a ? t.rolls[a] : void 0;
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
function nE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: a, step: t, metadata: r }), Ju("before", e), As("before", e), As("resolve", e);
}
function aE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: a, step: t, metadata: r }), Ju("apply", e);
}
function rE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: a, step: t, metadata: r });
}
function Ju(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: i } = t, l = oE(e, n.operation);
  l && i.emit(l, a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function As(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function oE(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function iE(e, t, n) {
  return y(void 0);
}
async function sE(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return lE(e, t);
    case "spendRitualCost":
      return cE(e, t);
  }
}
async function lE(e, t) {
  const { context: n, resources: a } = e, r = gn(t, n);
  return r.ok ? ed(await a.spend(n.sourceActor, t.resource, r.value), n) : g(r.error);
}
async function cE(e, t) {
  const { context: n, resources: a, ritualCosts: r } = e, o = r.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!o.ok)
    return g({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const i = o.value;
  return n.ritualCosts.push({
    ...i,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), ed(await a.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function ed(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function uE(e) {
  const { step: t, context: n, stepIndex: a, lifecycle: r, execute: o } = e, i = dE(t);
  for (const c of i.before)
    r.emit(c, n, { stepIndex: a, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of i.after)
    r.emit(c, n, { stepIndex: a, step: t });
  return l;
}
function dE(e) {
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
class mE {
  constructor(t, n, a, r) {
    this.resources = t, this.ritualCosts = n, this.messages = a, this.lifecycle = r;
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
        return uE({
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
        return g({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: a,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, a) {
    const r = await sE({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return r.ok ? y(void 0) : g({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, a) {
    const r = Qu(t, a);
    n.rollRequests[r.id] = r, this.lifecycle.emit("beforeRoll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("before", r, n, a, t), this.lifecycle.emit("roll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("roll", r, n, a, t);
    const o = await this.runRollFormulaStep(t, n, a);
    if (!o.ok)
      return o;
    const i = n.rolls[r.id];
    return this.emitSpecificRollPhase("after", r, n, a, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: a, step: t, rollRequest: r, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, a) {
    const r = await Xk(t, a, n);
    return r.ok ? y(void 0) : g({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, a) {
    const r = gn(t, n);
    if (!r.ok)
      return g({ ...r.error, stepIndex: a, step: t, context: n });
    const o = tE(t, n, r.value);
    nE({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), aE({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const i = this.resolveActors(t.actor, n);
    if (i.length === 0)
      return g({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: n
      });
    for (const l of i) {
      const c = await Et(this.resources, l, t.resource, t.operation, r.value), u = this.handleResourceOperationResult(c, n, a, t);
      if (!u.ok)
        return u;
      Zk({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return rE({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, a) {
    const r = gn(t, n);
    if (!r.ok)
      return g({ ...r.error, stepIndex: a, step: t, context: n });
    const o = this.resolveActors(t.actor, n);
    if (o.length === 0)
      return g({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: n
      });
    for (const i of o) {
      const l = await Et(this.resources, i, t.resource, t.operation, r.value), c = this.handleResourceOperationResult(l, n, a, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, a) {
    const r = await iE(this.messages);
    return r.ok ? y(void 0) : g({ ...r.error, stepIndex: a, step: t, context: n });
  }
  handleResourceOperationResult(t, n, a, r) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : g({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: a,
      step: r,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, a, r, o, i) {
    const l = fE(t, n.intent);
    l && this.lifecycle.emit(l, a, {
      stepIndex: r,
      step: o,
      rollRequest: n,
      rollResult: i
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
function fE(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class pE {
  emitCastStarted(t) {
    Hooks.callAll(Xt.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Xt.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Xt.ritual.castFinished, t);
  }
}
class gE {
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
      return g({
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
      return g({
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
    const i = o.value, l = this.calculate(a, i, r);
    if (!l.ok)
      return g({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: r,
        current: i.value,
        required: r
      });
    const { afterValue: c, appliedAmount: u } = l.value, m = {
      value: c,
      max: i.max
    };
    try {
      c !== i.value && await this.adapter.updateResourceValue(t, n, c);
    } catch (p) {
      return g({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: r,
        current: i.value,
        required: r,
        cause: p
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
      before: i,
      after: m
    });
  }
  calculate(t, n, a) {
    switch (t) {
      case "spend":
        return n.value < a ? g({
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
class hE {
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
function td(e) {
  return {
    id: bE(),
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
function bE() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class yE {
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
    return ze(this.lastContext);
  }
  async runAutomation(t, n) {
    const a = td(n);
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
class AE {
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
class _E {
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
    const n = xa();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: TE(),
      flags: {
        ...t.flags,
        [d]: {
          ...RE(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const a = xa();
    if (!a.enabled)
      return;
    const r = n.notification ?? _s(n);
    a.console && this.emitConsole(t, n), a.ui && this.emitUi(t, r);
  }
  emitConsole(t, n) {
    const a = _s(n);
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
function _s(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function TE() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function RE(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const kE = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", nd = `${d}-inline-roll-neutralized`, EE = `${d}-inline-roll-notice`, Ao = `data-${d}-inline-roll-neutralized`, Ts = `data-${d}-inline-roll-notice`, $E = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Rs(e) {
  const t = BE(e.message), n = await wE(e.message), a = CE(t);
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
async function wE(e) {
  const t = ME(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = SE(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await OE(t, n.content), replacementCount: n.replacementCount };
}
function CE(e) {
  const t = e ? FE(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = ad(t);
  return n > 0 && rd(xE(t)), { replacementCount: n };
}
function SE(e) {
  const t = IE(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const a = ad(n.content), r = t.replacementCount + a;
  return r === 0 ? { content: e, replacementCount: 0 } : (rd(n.content), { content: n.innerHTML, replacementCount: r });
}
function IE(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, r) => (t += 1, vE(r.trim()))), replacementCount: t };
}
function ad(e) {
  const t = LE(e);
  for (const n of t)
    n.replaceWith(DE(NE(n)));
  return t.length;
}
function LE(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(kE))
    n.getAttribute(Ao) !== "true" && t.add(n);
  return Array.from(t);
}
function vE(e) {
  return `<span class="${nd}" ${Ao}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${UE(e)}</span>`;
}
function DE(e) {
  const t = document.createElement("span");
  return t.classList.add(nd), t.setAttribute(Ao, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function rd(e) {
  if (e.querySelector?.(`[${Ts}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(EE), t.setAttribute(Ts, "true"), t.textContent = $E, e.append(t);
}
function xE(e) {
  return e.querySelector(".message-content") ?? e;
}
function NE(e) {
  const n = e.getAttribute("data-formula") ?? PE(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function PE(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ME(e) {
  return e && typeof e == "object" ? e : null;
}
async function OE(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function FE(e) {
  const t = qE(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function BE(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function UE(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function qE(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const et = "ritualRollConfig", hn = "ritual-roll", zE = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function Nt() {
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
function od(e) {
  const t = e.getFlag(d, et);
  return bn(t);
}
function id(e) {
  return od(e) ?? Nt();
}
async function jE(e, t) {
  const n = bn(t) ?? bn({
    ...Nt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, et, n), n;
}
async function GE(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, et));
    return;
  }
  await e.setFlag(d, et, null);
}
function bn(e) {
  if (!Vn(e)) return null;
  const t = e$(e.intent);
  if (!t) return null;
  const n = Nt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: dr(e.damageType),
    utilityLabel: dr(e.utilityLabel) ?? n.utilityLabel,
    note: _o(e.note),
    forms: n$(e.forms)
  };
}
function VE(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function HE(e) {
  const t = od(e), n = Gn(e);
  if (!t)
    return ks(e, n);
  const a = ZE(e, t);
  if (!a)
    return ks(e, n);
  const r = WE(t, a), o = [
    { type: "spendRitualCost" },
    r,
    ...KE(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: XE(e, t),
    resistance: n
  };
}
function ks(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: QE(e),
    resistance: t
  } : null;
}
function WE(e, t) {
  const n = {
    type: "rollFormula",
    id: hn,
    formula: t,
    intent: JE(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function KE(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${hn}.total`,
          ...YE(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${hn}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function YE(e) {
  return e ? { damageType: e } : {};
}
function XE(e, t) {
  const n = {
    base: ya("Padrão", t.forms.base.formula)
  };
  return tt(e, "discente") && (n.discente = ya("Discente", t.forms.discente.formula, 2)), tt(e, "verdadeiro") && (n.verdadeiro = ya("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function ya(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [hn]: t.trim()
    }
  };
}
function QE(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return tt(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), tt(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function ZE(e, t) {
  return [
    t.forms.base.formula.trim(),
    tt(e, "discente") ? t.forms.discente.formula.trim() : "",
    tt(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((a) => a.length > 0) ?? null;
}
function Gn(e) {
  const t = sd(e), n = dr(t.skillResis), a = t$(t.resistance);
  if (!n || !a) return;
  const r = a$(n), o = zE[a];
  return {
    skill: n,
    label: r,
    effect: a,
    summary: `${r} ${o}`
  };
}
function JE(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function e$(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function t$(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function n$(e) {
  const t = Nt();
  return Vn(e) ? {
    base: Aa(e.base),
    discente: Aa(e.discente),
    verdadeiro: Aa(e.verdadeiro)
  } : t.forms;
}
function Aa(e) {
  return Vn(e) ? { formula: _o(e.formula) } : { formula: "" };
}
function tt(e, t) {
  const n = sd(e), a = t === "discente" ? n.studentForm : n.trueForm;
  return r$(a);
}
function sd(e) {
  const t = e.system;
  return Vn(t) ? t : {};
}
function a$(e) {
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
function r$(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function _o(e) {
  return typeof e == "string" ? e.trim() : "";
}
function dr(e) {
  const t = _o(e);
  return t.length > 0 ? t : null;
}
function Vn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function o$(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function ld(e) {
  switch (i$(e)) {
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
      return s$(String(e ?? ""));
  }
}
function i$(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function s$(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function l$() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function c$(e) {
  return {
    ...To(e),
    type: "ritual.cast.started"
  };
}
function u$(e) {
  return {
    ...To(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function d$(e) {
  return {
    ...To(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function m$(e) {
  if (e.type === "preset") {
    const t = ve(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: ve(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: ve(e.label),
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
function f$(e, t = {}) {
  const n = S$(e), a = [
    ...L$(t.candidates ?? []),
    ...v$(e)
  ], r = x$(a) ?? { x: 0, y: 0, width: 0, height: 0 }, o = I$(t) ?? N$(a) ?? M$(r), i = F$(canvas?.grid?.size), l = p$(o, r, a), c = R$(a), u = T$(l);
  return {
    type: "rectangleRay",
    sceneId: O$(e, n),
    regionId: Ls(n?.id) ?? Ls(e.id),
    gridSize: i,
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
function p$(e, t, n) {
  const a = {
    x: P(e, "x") ?? 0,
    y: P(e, "y") ?? 0,
    width: P(e, "width") ?? t.width,
    height: P(e, "height") ?? t.height,
    direction: P(e, "direction") ?? 0,
    elevation: P(e, "elevation")
  };
  return {
    ...a,
    direction: g$(a, t, n)
  };
}
function g$(e, t, n) {
  const a = h$(n);
  return a !== null ? a : y$(e, t) ?? e.direction;
}
function h$(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const a = Es(n, t);
    if (a !== null) return a;
    const r = Hn(n), o = Es(r, t);
    if (o !== null) return o;
  }
  return null;
}
function Es(e, t) {
  for (const n of t) {
    const a = b$(Y(e, n));
    if (a !== null) return a;
  }
  return null;
}
function b$(e) {
  const t = $t(e);
  if (t === null) return null;
  const n = ko(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function y$(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = ws($s(e, e.direction), t), a = A$(e, t);
  if (a === null) return null;
  const o = _$([
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
    error: ws($s(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const i = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= i ? ko(o.direction) : null;
}
function A$(e, t) {
  const n = e.width, a = e.height, r = n ** 2 - a ** 2;
  if (Math.abs(r) < 1e-3) return null;
  const o = (n * t.width - a * t.height) / r, i = (n * t.height - a * t.width) / r, l = vs(o, 0, 1), c = vs(i, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : B$(Math.atan2(c, l));
}
function $s(e, t) {
  const n = ud(t), a = {
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
  ], i = o.map((A) => A.x), l = o.map((A) => A.y), c = Math.min(...i), u = Math.max(...i), m = Math.min(...l), p = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: p - m
  };
}
function ws(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function _$(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const a = ko(n);
    t.add(Math.round(a * 1e3) / 1e3);
  }
  return [...t];
}
function T$(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = ud(e.direction), n = {
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
function R$(e) {
  for (const t of e) {
    const n = Cs(t, "ray.start"), a = Cs(t, "ray.end");
    if (n && a) return { start: n, end: a };
  }
  return null;
}
function Cs(e, t) {
  const n = Y(e, t), a = $t(Y(n, "x")), r = $t(Y(n, "y"));
  return a === null || r === null ? null : { x: a, y: r };
}
function To(e) {
  const t = m$(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: $$(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: k$(e.context.item, e.form, e.formLabel, t),
    targets: n.map(w$),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function k$(e, t, n, a) {
  return {
    name: e.name,
    slug: _a(e, "system.slug") ?? _a(e, "slug"),
    presetId: a.presetId,
    presetVersion: a.presetVersion,
    element: _a(e, "system.element"),
    circle: C$(e),
    form: E$(t),
    formLabel: n
  };
}
function E$(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function $$(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function w$(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function C$(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : ve(t);
}
function _a(e, t) {
  return ve(foundry.utils.getProperty(e, t));
}
function ve(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function S$(e) {
  return "document" in e && e.document ? e.document : e;
}
function I$(e) {
  return cd(e.shape);
}
function L$(e) {
  return e.filter(Ro);
}
function v$(e) {
  return [
    e,
    D$(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Ro);
}
function D$(e) {
  return "object" in e && Ro(e.object) ? e.object : null;
}
function Ro(e) {
  return !!(e && typeof e == "object");
}
function x$(e) {
  for (const t of e) {
    const n = Ss(Y(Hn(t), "bounds"));
    if (n) return n;
    const a = Ss(Y(t, "bounds"));
    if (a) return a;
  }
  return null;
}
function Ss(e) {
  const t = P(e, "x"), n = P(e, "y"), a = P(e, "width"), r = P(e, "height");
  return t === null || n === null || a === null || r === null ? null : { x: t, y: n, width: a, height: r };
}
function P(e, t) {
  return $t(Y(e, t));
}
function N$(e) {
  for (const t of e) {
    const n = P$(t).find((a) => a.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function P$(e) {
  if (!e || typeof e != "object") return [];
  const t = Is(Hn(e));
  return t.length > 0 ? t : Is(e);
}
function Is(e) {
  const t = Y(e, "shapes");
  return Array.isArray(t) ? t.map(cd).filter((n) => n !== null) : [];
}
function cd(e) {
  const t = Hn(e) ?? e, n = Y(t, "type");
  return typeof n != "string" ? null : {
    type: n,
    x: P(t, "x"),
    y: P(t, "y"),
    width: P(t, "width"),
    height: P(t, "height"),
    direction: P(t, "direction"),
    elevation: P(t, "elevation")
  };
}
function M$(e) {
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
function O$(e, t) {
  return Ta(e, "parent.id") ?? Ta(e, "document.parent.id") ?? Ta(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Ta(e, t) {
  return ve(Y(e, t));
}
function Y(e, t) {
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
function Hn(e) {
  if (!e || typeof e != "object") return null;
  const t = Y(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function Ls(e) {
  return ve(e);
}
function $t(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function F$(e) {
  const t = $t(e);
  return t !== null && t > 0 ? t : null;
}
function ud(e) {
  return e * Math.PI / 180;
}
function B$(e) {
  return e * 180 / Math.PI;
}
function ko(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function vs(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class U$ {
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
class Wn {
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
const q$ = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class z$ {
  constructor(t = new Wn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = j$(t, this.foundryAdapter);
    for (const a of n)
      try {
        await a.run(), a.method;
        return;
      } catch {
        a.method;
      }
    this.foundryAdapter.warn(q$);
  }
}
function j$(e, t) {
  const n = [], a = G$(e), r = Ds(a), o = Ds(e);
  if (typeof a?.delete == "function") {
    const i = a.delete.bind(a);
    n.push({ method: "document.delete", run: i });
  }
  if (typeof e.delete == "function") {
    const i = e.delete.bind(e);
    n.push({ method: "region.delete", run: i });
  }
  return r && n.push({
    method: "scene.deleteEmbeddedDocuments(document.id)",
    run: () => t.deleteRegionDocumentById(r)
  }), o && o !== r && n.push({
    method: "scene.deleteEmbeddedDocuments(region.id)",
    run: () => t.deleteRegionDocumentById(o)
  }), n;
}
function G$(e) {
  return V$(e) ? e.document ?? null : e;
}
function V$(e) {
  return "bounds" in e;
}
function Ds(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const H$ = 100, W$ = 12;
class K$ {
  constructor(t = new Wn()) {
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
      const r = this.foundryAdapter.getGridSize() ?? H$, o = J$(n), i = await this.foundryAdapter.placeRegion(
        Y$(t, this.foundryAdapter.getUserColor(), r),
        {
          create: !0,
          allowRotation: !0,
          ...o
        }
      );
      return i ? {
        status: "confirmed",
        region: i,
        wasCreated: !0
      } : {
        status: "cancelled",
        reason: "region-placement-cancelled"
      };
    } catch (r) {
      return {
        status: "failed",
        reason: "region-placement-failed",
        message: Z$(r)
      };
    }
  }
}
function Y$(e, t, n) {
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
    shapes: [X$(e, n)]
  };
}
function X$(e, t) {
  const n = Q$(e, t);
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
function Q$(e, t) {
  return {
    length: xs(e.length, W$, t),
    width: xs(e.width, 1, t)
  };
}
function xs(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function Z$(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function J$(e) {
  const t = (n) => {
    const a = ew(n);
    a && e.onChange?.(a);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function ew(e) {
  return tw(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function tw(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class nw {
  constructor(t = new Wn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(Ns(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Ns(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = aw(t);
    rw(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Ns(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function aw(e) {
  return Array.from(new Set(e));
}
function rw(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, a) => n === t[a]);
}
class ow {
  constructor(t = new Wn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Wl)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(iw(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(sw(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((a) => ({
      source: a.source,
      hasBounds: mr(a.region)
    }));
    for (const a of t) {
      if (!mr(a.region)) continue;
      const r = this.resolveRegionObjectTargetTokens(a.region);
      return a.source, r.tokens.length, r;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), a = cw(
      n.filter((r) => !r.actor || typeof r.document?.testInsideRegion != "function" ? !1 : r.document.testInsideRegion(t))
    );
    return n.length, a.length, { tokens: a, source: "regionObject" };
  }
}
function iw(e) {
  return [
    { source: "document", region: Le(e.document) },
    { source: "document.object", region: Le(e.document.object) },
    { source: "preview", region: Le(e.preview) },
    { source: "preview.document.object", region: Le(e.preview?.document?.object) }
  ];
}
function sw(e) {
  return [
    { source: "input", region: Le(e) },
    { source: "input.object", region: lw(e) ? Le(e.object) : null },
    { source: "input.document.object", region: dd(e) ? Le(e.document?.object) : null }
  ];
}
function Le(e) {
  return mr(e) ? e : null;
}
function mr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Vt(n.x) && Vt(n.y) && Vt(n.width) && Vt(n.height);
}
function dd(e) {
  return "document" in e && "bounds" in e;
}
function lw(e) {
  return !dd(e);
}
function cw(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return a ? t.has(a) ? !1 : (t.add(a), !0) : !0;
  });
}
function Vt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class uw {
  async minimizeForPlacement() {
    const t = [];
    for (const n of fw())
      await dw(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await mw(n);
      }
    };
  }
}
async function dw(e) {
  if (md(e) || !Tw(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function mw(e) {
  if (md(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function fw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of pw())
    bw(t) && yw(t) && e.add(t);
  return [...e];
}
function pw() {
  return [
    ...Ps(gw()),
    ...Ps(hw())
  ];
}
function Ps(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function gw() {
  return globalThis.ui?.windows ?? null;
}
function hw() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function bw(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function yw(e) {
  const t = Aw(e), n = _w(t);
  return n === "Actor" || n === "Item";
}
function Aw(e) {
  return e.document ?? e.object ?? null;
}
function _w(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function Tw(e) {
  const t = Rw(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function Rw(e) {
  const t = e.element;
  if (Ms(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Ms(n)) return n;
  }
  return null;
}
function Ms(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function md(e) {
  return e.minimized === !0;
}
const kw = "Nenhum alvo encontrado na linha.";
class Ew {
  constructor(t = new K$(), n = new ow(), a = new z$(), r = new nw(), o = new U$(), i = new uw()) {
    this.regionLinePlacement = t, this.regionTargetResolver = n, this.regionCleanup = a, this.regionTargetPreview = r, this.foundryAdapter = o, this.placementWindowManager = i;
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
      }, i = await this.placementWindowManager.minimizeForPlacement(), l = await (async () => {
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
          await i.restore();
        }
      })();
      if (l.status === "cancelled")
        return o(), l;
      if (l.status === "failed")
        return o(), this.foundryAdapter.warn(l.message), l;
      try {
        const c = this.regionTargetResolver.resolveTargets(l.region), u = ww(a), m = f$(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(kw), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = $w(c);
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
function $w(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function ww(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function Cw(e) {
  return {
    header: {
      eyebrow: Pl,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Pw(e.ritual)
    },
    forms: e.variantOptions.map((t) => Sw(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: vw(e.targetNames, e.variantOptions, e.ritual),
    automation: Nw(e.automationStatus ?? "assisted")
  };
}
function Sw(e, t) {
  const n = Iw(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Lw(t) : "—",
    details: n
  };
}
function Iw(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Lw(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function vw(e, t, n) {
  const a = e.map((r) => r.trim()).filter((r) => r.length > 0);
  return {
    targetNames: a,
    targetText: a.length > 0 ? a.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: a.length > 0,
    forms: t.map((r) => Dw(r, n))
  };
}
function Dw(e, t) {
  const n = e.targeting ?? xw(t, e.variant), a = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function xw(e, t) {
  const n = St(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function Nw(e) {
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
function Pw(e) {
  const t = e.system, n = [Ow(t?.element), Mw(t?.circle)].filter(Uw);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Mw(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Ow(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (Fw(e)) {
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
      return Bw(e);
  }
}
function Fw(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function Bw(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function Uw(e) {
  return typeof e == "string" && e.length > 0;
}
const fd = ["base", "discente", "verdadeiro"];
function Eo(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function yn(e) {
  return typeof e == "string" && fd.includes(e);
}
const { ApplicationV2: qw } = foundry.applications.api;
class _t extends qw {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = Cw(t), this.selectedVariant = this.model.forms.find((a) => a.checked && a.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: _t.onCast,
      cancel: _t.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new _t(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const a = document.createElement("div");
    return a.className = "paranormal-toolkit-ritual-cast", a.innerHTML = this.renderContent(), a;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
    const r = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    Gw(r, (o) => {
      this.selectedVariant = o, fr(r, o);
    }), fr(r, this.selectedVariant), Vw(r, (o) => {
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
          ${this.model.forms.map(zw).join("")}
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
          ${this.model.targets.forms.map(jw).join("")}
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
    const n = Yw(t), a = Hw(n, this.spendResource, this.selectedVariant);
    this.settle(a), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function zw(e) {
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
function jw(e) {
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
function Gw(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of n)
    r.addEventListener("click", () => Os(e, r, t)), r.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Os(e, r, t));
    });
  const a = pd(e);
  a && t(a);
}
function Os(e, t, n) {
  const a = t.querySelector('input[name="variant"]');
  !a || a.disabled || !yn(a.value) || (a.checked = !0, e.dataset.paranormalToolkitSelectedVariant = a.value, n(a.value), a.dispatchEvent(new Event("change", { bubbles: !0 })), pd(e), fr(e, a.value));
}
function pd(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const a of t) {
    const r = a.querySelector('input[name="variant"]'), o = r?.checked === !0;
    a.setAttribute("aria-checked", o ? "true" : "false"), o && yn(r.value) && (n = r.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function fr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const a of n) {
    const r = a.dataset.paranormalToolkitTargetingForm === t;
    a.hidden = !r;
  }
}
function Vw(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Hw(e, t, n) {
  const a = Kw(e) ?? n, r = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = Ww(e, a);
  return {
    variant: a,
    spendResource: r,
    areaTargeting: o
  };
}
function Ww(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function Kw(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (yn(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return yn(n) ? n : null;
}
function Yw(e) {
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
async function Xw(e) {
  return _t.request(e);
}
const $o = {
  label: "Padrão"
}, Qw = {
  label: "Discente",
  extraCost: 2
}, Zw = {
  label: "Verdadeiro",
  extraCost: 5
};
class Jw {
  constructor(t, n, a, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = a, this.ritualEvents = r;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new Ew();
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
    const r = this.resolveCostPreview(t), o = YC(n), i = HC(
      n,
      t.item,
      r,
      o
    ), l = await Xw({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((S) => S.name),
      cost: r,
      defaultSpendResource: tS(n),
      variantOptions: i,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = eC(l), u = QC(
      n,
      t.item,
      c.variant,
      o
    ), m = l$(), p = u.label ?? Eo(c.variant), A = iC(u), $ = (S = t.targets) => ({
      castId: m,
      context: t,
      automationSource: a,
      form: c.variant,
      formLabel: p,
      targets: S
    }), T = (S, I = t.targets, ue = {}) => {
      this.ritualEvents.emitCastFinished(
        d$({
          ...$(I),
          status: S,
          ...ue
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      c$($())
    );
    const k = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (k.status === "cancelled")
      return T("cancelled", t.targets, { reason: k.reason }), { status: "cancelled" };
    if (k.status === "failed")
      return T("failed", t.targets, {
        reason: k.reason,
        message: k.message
      }), {
        status: "failed",
        reason: k.reason,
        message: k.message
      };
    const b = tC(
      t,
      k.targets
    ), L = !!k.areaSnapshot;
    k.areaSnapshot && this.ritualEvents.emitAreaResolved(
      u$({
        ...$(k.targets),
        area: k.areaSnapshot
      })
    );
    const E = ec();
    let D = null;
    if (E) {
      const S = await aC(
        this.resources,
        b.actor,
        c,
        u,
        r
      );
      if (!S.ok)
        return T("failed", b.targets, {
          reason: S.reason,
          message: S.message
        }), {
          status: "failed",
          reason: S.reason,
          message: S.message
        };
      try {
        const I = await Lk(
          b.actor
        );
        D = sC(
          I,
          u,
          r
        );
      } catch (I) {
        const ue = I instanceof Error ? I.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return T("failed", b.targets, {
          reason: "ritual-casting-check-failed",
          message: ue
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: ue,
          cause: I
        };
      }
    }
    const G = nC(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !E
      }
    );
    if (G.steps.length === 0) {
      const S = XC(
        b,
        c
      ), I = Bs(
        n,
        b
      ), ue = Fs(
        b.actor,
        D,
        u,
        r
      ), Ko = qs(
        n,
        c,
        u,
        r,
        S,
        b,
        D
      ), Yo = Us(m, c, u, p, r, D, n, S, L);
      if (!I.ok)
        return T("failed", b.targets, {
          reason: I.reason,
          message: I.message
        }), {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      const Xo = [
        ...ue,
        ...I.actions
      ];
      return Xo.length > 0 ? (T("ready", b.targets), {
        status: "ready",
        workflowContext: S,
        itemUseContext: b,
        actions: Xo,
        summaryLines: Ko,
        castSnapshot: Yo
      }) : (T("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: S,
        itemUseContext: b,
        summaryLines: Ko,
        castSnapshot: Yo
      });
    }
    const q = await this.workflow.runAutomation(G, {
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
    if (!q.ok)
      return T("failed", b.targets, {
        reason: q.error.reason,
        message: q.error.message
      }), {
        status: "failed",
        reason: q.error.reason,
        message: q.error.message,
        cause: q.error
      };
    const x = q.value.context, W = pC(
      n,
      b,
      x,
      A
    ), ne = Bs(
      n,
      b
    ), Oe = Fs(
      b.actor,
      D,
      u,
      r
    ), C = qs(
      n,
      c,
      u,
      r,
      x,
      b,
      D
    ), M = Us(m, c, u, p, r, D, n, x, L);
    if (!W.ok)
      return T("failed", b.targets, {
        reason: W.reason,
        message: W.message
      }), {
        status: "failed",
        reason: W.reason,
        message: W.message
      };
    if (!ne.ok)
      return T("failed", b.targets, {
        reason: ne.reason,
        message: ne.message
      }), {
        status: "failed",
        reason: ne.reason,
        message: ne.message
      };
    const ae = [
      ...Oe,
      ...W.actions,
      ...ne.actions
    ];
    return ae.length === 0 ? (T("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: x,
      itemUseContext: b,
      summaryLines: C,
      castSnapshot: M
    }) : (T("ready", b.targets), {
      status: "ready",
      workflowContext: x,
      itemUseContext: b,
      actions: ae,
      summaryLines: C,
      castSnapshot: M
    });
  }
  async applyAction(t) {
    return Et(
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
function eC(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function tC(e, t) {
  return {
    ...e,
    targets: t
  };
}
function nC(e, t, n, a, r) {
  const o = [], i = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Co(l) && (!r.includeCostSteps || !i))
      continue;
    const c = rC(l, n);
    c && o.push(c);
  }
  return r.includeCostSteps && i && a && nS(n.extraCost) && o.push({
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
async function aC(e, t, n, a, r) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Me(r, a);
  if (!o)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (o.amount <= 0) return { ok: !0 };
  const i = await e.spend(
    t,
    o.resource,
    o.amount
  );
  return i.ok ? { ok: !0 } : {
    ok: !1,
    reason: i.error.reason,
    message: i.error.message
  };
}
function rC(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = oC(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function oC(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const a = n[t];
  return typeof a == "string" ? a.trim() : "";
}
function iC(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function sC(e, t, n) {
  const r = lC(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: r,
    success: e.total >= r
  };
}
function lC(e, t) {
  const n = Me(e, t);
  return n ? o$(n.amount) : null;
}
function Fs(e, t, n, a) {
  if (!t || t.success) return [];
  const r = Me(a, n);
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
function Bs(e, t) {
  const n = [];
  for (const a of e.conditionApplications ?? []) {
    const r = wo(a.actor, t);
    if (r.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${a.label ?? a.conditionId}.`
      };
    }
    for (const o of r) {
      const i = Mc(o);
      n.push(
        cC(
          a,
          o,
          t.item,
          i
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function cC(e, t, n, a) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? fC(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: dC(
      e.duration ?? null,
      a
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: mC(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito",
    resistanceOutcome: e.applyOnResistance
  };
}
function Us(e, t, n, a, r, o, i, l, c) {
  return {
    castId: e,
    form: { id: t.variant, label: a },
    cost: r ? { amount: Me(r, n)?.amount ?? r.amount, resource: r.resource, spent: t.spendResource } : null,
    castingCheck: o,
    resistance: i.resistance ?? null,
    rolls: Object.values(l.rolls).map((u) => ({
      id: u.id,
      formula: u.formula,
      total: u.total,
      intent: u.intent,
      damageType: u.damageType ?? null,
      diceResults: uC(u.roll)
    })),
    areaTargeting: c
  };
}
function uC(e) {
  const t = e.dice;
  return Array.isArray(t) ? t.flatMap((n) => {
    const a = n.results;
    return Array.isArray(a) ? a.flatMap((r) => {
      const o = r.result;
      return typeof o == "number" && Number.isFinite(o) ? [Math.trunc(o)] : [];
    }) : [];
  }) : [];
}
function dC(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function mC(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const a = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${a}`;
  }
  return e;
}
function fC(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function pC(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const i of e.steps) {
    if (i.type !== "modifyResource" || gC(i, a)) continue;
    const l = gn(i, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = wo(i.actor, t);
    if (c.length === 0) {
      if (i.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (hC(i)) {
        bC(
          o,
          u,
          yC(i, n, l.value)
        );
        continue;
      }
      r.push(TC(i, u, l.value));
    }
  }
  for (const i of o.values())
    r.push(
      ...AC(
        e,
        t.item,
        i.actor,
        i.entries
      )
    );
  return { ok: !0, actions: r };
}
function gC(e, t) {
  const n = gd(e.amountFrom);
  return n !== null && t.has(n);
}
function hC(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function bC(e, t, n) {
  const a = $C(t), r = e.get(a);
  if (r) {
    r.entries.push(n);
    return;
  }
  e.set(a, {
    actor: t,
    entries: [n]
  });
}
function yC(e, t, n) {
  const a = gd(e.amountFrom), r = a ? t.rolls[a]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? r ?? null,
    sourceRollId: a
  };
}
function AC(e, t, n, a) {
  const r = IC(e), o = r.length > 1 ? DC() : void 0;
  return r.map((i) => {
    const l = a.map(
      (u, m) => {
        const p = LC(u.amount, i);
        return {
          id: RC(u, i, m),
          amount: p,
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
      label: kC(c, i, r.length > 1),
      executedLabel: EC(
        n.name ?? "Ator sem nome",
        i,
        r.length > 1
      ),
      choiceGroupId: o,
      choiceGroupResolvedLabel: o ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null,
      resistanceOutcome: _C(e, i),
      resistanceLabel: i.label
    };
  });
}
function _C(e, t) {
  if (e.resistance?.effect === "reducesByHalf") {
    if (t.multiplier === 1) return "failure";
    if (t.multiplier < 1) return "success";
  }
}
function TC(e, t, n) {
  const a = t.name ?? "Ator sem nome", r = SC(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: wC(e, a, n),
    executedLabel: CC(e, a),
    actionSectionId: r.id,
    actionSectionTitle: r.title
  };
}
function RC(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function kC(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function EC(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function $C(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function gd(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function wC(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function CC(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function SC(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function IC(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function LC(e, t) {
  const n = e * t.multiplier, a = vC(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, a);
}
function vC(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function DC() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function wo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function qs(e, t, n, a, r, o, i = null) {
  return [
    `Forma: ${Eo(t.variant)}`,
    MC(t, n, a),
    ...PC(i),
    ...Object.values(r.rolls).flatMap(OC),
    ...xC(e, o),
    ...FC(e.resistance),
    ...GC(n)
  ];
}
function xC(e, t) {
  return NC(e) ? wo("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function NC(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function PC(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function MC(e, t, n) {
  const a = Me(n, t);
  return a ? e.spendResource ? `Custo: ${a.amount} ${a.resource} gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function OC(e) {
  const n = [`${VC(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = BC(e.roll);
  return a && n.push(`Dados: ${a}`), e.damageType && n.push(`Tipo: ${ld(e.damageType)}`), n;
}
function FC(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function BC(e) {
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
    const i = UC(o);
    i && (jC(
      n,
      i.operator ?? a,
      i.value
    ), a = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function UC(e) {
  const t = qC(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : zC(e);
}
function qC(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function zC(e) {
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
function jC(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function GC(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function VC(e) {
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
function HC(e, t, n, a) {
  return fd.map((r) => {
    const o = hd(
      e,
      t,
      r,
      a
    ), i = o !== null;
    return {
      variant: r,
      label: o?.label ?? Eo(r),
      enabled: i,
      details: o ? WC(o, n) : [],
      finalCostText: o ? KC(n, o) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function WC(e, t, n) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {}).map((i) => i.trim()).filter((i) => i.length > 0);
  r.length > 0 ? a.push(r.join(", ")) : a.push("efeito manual");
  const o = Me(t, e);
  return a.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), a;
}
function Me(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function KC(e, t) {
  const n = Me(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function YC(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Co);
}
function XC(e, t) {
  return td({
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
function QC(e, t, n, a) {
  return hd(e, t, n, a) ?? $o;
}
function hd(e, t, n, a) {
  const r = e.ritualForms?.[n] ?? null;
  return r || (a ? JC(t, n) ? ZC(n) : null : n === "base" ? $o : null);
}
function ZC(e) {
  switch (e) {
    case "base":
      return $o;
    case "discente":
      return Qw;
    case "verdadeiro":
      return Zw;
  }
}
function JC(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return eS(foundry.utils.getProperty(e, n));
}
function eS(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function tS(e) {
  return e.steps.some(Co);
}
function Co(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function nS(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
function bd(e) {
  if (!H(e) || e.schemaVersion !== 2 || e.kind !== "ritual" || e.renderer !== "single-target" || !pr(e.revision) || !pr(e.createdAt) || !(typeof e.messageId == "string" || e.messageId === null) || !oS(e.state)) return null;
  const t = e, n = t.state.actions.some((r) => r.state === "executing"), a = t.state.resistance?.status === "executing";
  return !n && !a ? t : {
    ...t,
    state: {
      ...t.state,
      actions: t.state.actions.map((r) => r.state === "executing" ? { ...r, state: "uncertain" } : r),
      resistance: a && t.state.resistance ? { ...t.state.resistance, status: "uncertain" } : t.state.resistance
    }
  };
}
function aS(e) {
  return bd(e) !== null;
}
function rS(e) {
  if (!H(e) || !H(e.legacyFallback)) return null;
  const t = typeof e.legacyFallback.itemName == "string" ? e.legacyFallback.itemName.trim() : "", n = Array.isArray(e.legacyFallback.summaryLines) ? e.legacyFallback.summaryLines.filter((a) => typeof a == "string") : [];
  return !t && n.length === 0 ? null : { itemName: t || "Ritual", summaryLines: n };
}
function oS(e) {
  return !H(e) || e.schemaVersion !== 1 || e.renderer !== "single-target" || typeof e.castId != "string" || !an(e.source) || !an(e.item) || !(e.target === null || an(e.target)) || !H(e.form) || typeof e.form.id != "string" || typeof e.form.label != "string" || !(e.itemImage === void 0 || e.itemImage === null || typeof e.itemImage == "string") || !(e.ritualIdentity === void 0 || e.ritualIdentity === null || iS(e.ritualIdentity)) || !(e.ritualMetadata === void 0 || sS(e.ritualMetadata)) || !(e.descriptionHtml === void 0 || e.descriptionHtml === null || typeof e.descriptionHtml == "string") || !Array.isArray(e.actions) || !e.actions.every(lS) || !(e.mainRoll === null || H(e.mainRoll)) || !(e.conjuration === null || H(e.conjuration)) || !(e.resistance === null || H(e.resistance)) ? !1 : pr(e.createdAt);
}
function iS(e) {
  return H(e) && typeof e.elementKey == "string" && typeof e.elementLabel == "string" && [1, 2, 3, 4].includes(e.circle);
}
function sS(e) {
  return H(e) && [e.execution, e.range, e.duration].every((t) => t === null || typeof t == "string");
}
function lS(e) {
  return !H(e) || typeof e.id != "string" || typeof e.label != "string" || typeof e.executedLabel != "string" || !an(e.actor) || !["pending", "available", "executing", "completed", "resolved", "uncertain"].includes(String(e.state)) ? !1 : ["resource-operation", "damage-application", "condition-application"].includes(String(e.kind));
}
function an(e) {
  return H(e) && (typeof e.id == "string" || e.id === null) && (typeof e.uuid == "string" || e.uuid === null) && typeof e.name == "string";
}
function pr(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function H(e) {
  return !!(e && typeof e == "object" && !Array.isArray(e));
}
const Ht = /* @__PURE__ */ new Map();
function Kn(e) {
  const t = e?.getFlag?.(d, "chatCard");
  return aS(t) ? t : null;
}
async function yd(e, t) {
  if (typeof e.setFlag != "function") throw new Error("ChatMessage não permite persistência de flags.");
  await Promise.resolve(e.setFlag(d, "chatCard", t));
}
async function Pt(e, t) {
  const n = typeof e.id == "string" ? e.id : "unknown", a = Ht.get(n) ?? Promise.resolve();
  let r, o;
  const i = new Promise((c, u) => {
    r = c, o = u;
  }), l = a.catch(() => {
  }).then(async () => {
    const c = Kn(e);
    if (!c) throw new Error("Card ritual v2 inválido ou ausente.");
    const m = { ...await t(c), revision: c.revision + 1 };
    await yd(e, m), r(m);
  }).catch(o).finally(() => {
    Ht.get(n) === l && Ht.delete(n);
  });
  return Ht.set(n, l), i;
}
function cS(e) {
  const t = e.mainRoll, n = e.resistance?.result?.outcome ?? null, a = dS(e.actions, n, e.target?.name ?? "");
  return {
    header: { image: e.itemImage?.trim() ? { src: e.itemImage, alt: e.item.name } : void 0, title: e.item.name, subtitle: e.form.label, context: e.target ? `${e.source.name} → ${e.target.name}` : e.source.name, badges: [{ label: e.ritualIdentity ? `${e.ritualIdentity.elementLabel} ${e.ritualIdentity.circle}` : "Ritual", tone: uS(e.ritualIdentity?.elementKey) }] },
    description: e.descriptionHtml?.trim() ? { html: e.descriptionHtml } : void 0,
    metadata: { items: [
      e.cost ? `${e.cost.amount} ${e.cost.resource}` : null,
      e.ritualMetadata?.execution ? `Execução: ${e.ritualMetadata.execution}` : null,
      e.ritualMetadata?.range ? `Alcance: ${e.ritualMetadata.range}` : null,
      e.ritualMetadata?.duration ? `Duração: ${e.ritualMetadata.duration}` : null
    ].filter((r) => !!r).map((r) => ({ text: r })) },
    conjuration: e.conjuration ? { status: e.conjuration.success ? "success" : "failure", skillLabel: e.conjuration.skillLabel, total: e.conjuration.total, difficultyClass: e.conjuration.difficulty, formula: e.conjuration.formula, diceResults: e.conjuration.diceResults, consequence: e.conjuration.consequence ?? void 0 } : void 0,
    effect: t ? { title: t.intent === "damage" ? "Dano" : t.intent === "healing" ? "Cura" : "Efeito", typeLabel: t.damageType ? ld(t.damageType) : void 0, formula: t.formula, total: t.total, diceResults: t.diceResults } : void 0,
    resistance: e.resistance ? {
      skill: e.resistance.skillLabel,
      difficultyLabel: `DT ${e.resistance.difficulty}`,
      description: e.resistance.status === "uncertain" ? "Resultado incerto; verifique o alvo antes de prosseguir." : e.resistance.effect,
      status: n ?? "pending",
      action: { ariaLabel: `Rolar ${e.resistance.skillLabel}`, actionId: `${e.castId}:resistance`, disabled: e.resistance.status !== "pending" },
      result: e.resistance.result ? { formula: e.resistance.result.formula, total: e.resistance.result.total, diceResults: e.resistance.result.diceResults } : void 0
    } : void 0,
    assistedActions: a.length ? { rows: a } : void 0
  };
}
function uS(e) {
  return ["energy", "blood", "knowledge", "death", "fear"].includes(e ?? "") ? e : "neutral";
}
function dS(e, t, n) {
  const a = e.filter((c) => c.kind === "condition-application" && c.outcome !== null), r = e.filter((c) => c.kind === "damage-application" && c.outcome !== null && c.choiceGroupId !== null), o = new Set([...a, ...r].map((c) => c.id)), l = e.filter((c) => !o.has(c.id)).map(hS);
  return r.length && l.push(mS(r, t)), a.length && l.push(pS(a, t, n)), l;
}
function mS(e, t) {
  if (!t) return { label: "Dano após resistência", description: "Aguardando resistência", control: { state: "disabled", button: { label: "Aplicar", disabled: !0 } } };
  const n = e.find((l) => l.outcome === t);
  if (!n) return { label: "Dano após resistência", description: "Alternativa não resolvida", control: { state: "disabled", button: { label: "Aplicar", disabled: !0 } } };
  const a = n.instances.reduce((l, c) => l + c.amount, 0), r = t === "success" ? "Sucesso" : "Falha", o = fS(n, t), i = `${r} · ${a} PV — ${o}`;
  return n.state === "completed" ? { label: "Dano após resistência", description: i, control: So() } : n.state === "uncertain" ? { label: "Dano após resistência", description: i, control: { state: "completed", indicator: { label: "Aplicação incerta" } } } : { label: "Dano após resistência", description: i, control: { state: n.state === "available" ? "active" : "disabled", button: { label: "Aplicar", disabled: n.state !== "available", actionId: n.id, actionKind: "apply-damage" } } };
}
function fS(e, t) {
  const n = e.resistanceLabel?.trim().toLocaleLowerCase();
  return n === "metade" ? "metade do dano" : n || (t === "success" ? "dano reduzido" : "dano normal");
}
function pS(e, t, n) {
  if (!t)
    return { label: "Efeitos da resistência", description: "Aguardando resistência", control: { state: "disabled", button: { label: "Aplicar", disabled: !0, actionId: "resistance-outcome-conditions", actionKind: "apply-resistance-outcome-conditions" } } };
  const a = e.filter((p) => p.outcome === t), r = a.filter((p) => p.state === "available"), o = a.filter((p) => p.state === "completed"), i = a.length, c = `${t === "success" ? "Sucesso" : "Falha"} · ${i} ${i === 1 ? "efeito" : "efeitos"}`, u = { items: a.map(gS) };
  if (a.length > 0 && o.length === a.length)
    return { label: "Efeitos da resistência", description: `${c} · ${n}`, details: u, control: So() };
  const m = o.length > 0;
  return {
    label: "Efeitos da resistência",
    description: m ? `${c} · aplicação parcial` : c,
    details: u,
    control: { state: r.length ? "active" : "disabled", button: { label: m ? "Aplicar pendentes" : "Aplicar", disabled: !r.length, actionId: "resistance-outcome-conditions", actionKind: "apply-resistance-outcome-conditions" } }
  };
}
function gS(e) {
  const t = e.label.replace(/^(?:Sucesso|Falha)\s*·\s*/iu, ""), [n, a] = t.split(/:\s*/u, 2);
  return `${n ?? "Condição"} · ${a ?? "duração indefinida"}`;
}
function hS(e) {
  const t = e.state === "completed" || e.state === "resolved" || e.state === "uncertain";
  return {
    label: e.label,
    description: e.state === "resolved" ? "Alternativa não aplicável" : e.state === "uncertain" ? "Verifique no alvo antes de tentar novamente" : e.actor.name,
    control: t ? e.state === "completed" ? So() : { state: "completed", indicator: { label: e.state === "resolved" ? "Resolvida" : "Aplicação incerta" } } : { state: e.state === "available" ? "active" : "disabled", button: { label: zs(e) ? "Curar" : "Aplicar", actionId: e.id, actionKind: e.kind === "damage-application" ? "apply-damage" : e.kind === "condition-application" ? "apply-condition" : zs(e) ? "apply-healing" : "apply-resource" } }
  };
}
function So() {
  return { state: "disabled", button: { label: "✓ Aplicado", disabled: !0 } };
}
function zs(e) {
  return e.kind === "resource-operation" && (e.operation === "heal" || e.operation === "recover");
}
const bS = '[data-paranormal-toolkit-card-renderer="ritual-single-target"]';
function Ad(e) {
  return fc(cS(e.state));
}
async function yS(e, t) {
  if (Ad(t), await yd(e, t), t.messageId) {
    const n = document.querySelector(`[data-message-id="${_S(t.messageId)}"]`);
    n && Io(e, n);
  }
}
function Io(e, t) {
  const n = e.getFlag?.(d, "chatCard");
  if (!n || typeof n != "object" || n.schemaVersion !== 2) return !1;
  const a = AS(t), r = bd(n);
  if (!r) return js(n, e, a, "invalid-state");
  try {
    const o = _d(a);
    return o.dataset.paranormalToolkitMessageId = typeof e.id == "string" ? e.id : "", o.innerHTML = Ad(r), Td(a, o), !0;
  } catch (o) {
    return console.warn("Paranormal Toolkit: falha ao reidratar card ritual v2.", { messageId: e.id, stage: "renderer", cause: o }), js(n, e, a, "renderer");
  }
}
function js(e, t, n, a) {
  try {
    const r = rS(e);
    if (!r)
      return console.warn("Paranormal Toolkit: card ritual v2 inválido e sem fallback seguro; conteúdo original preservado.", { messageId: t.id, stage: a }), !1;
    const o = _d(n);
    return o.dataset.paranormalToolkitMessageId = typeof t.id == "string" ? t.id : "", o.classList.add("paranormal-toolkit-item-use-prompt"), o.innerHTML = TS(r), Td(n, o), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: o fallback seguro também falhou; conteúdo original preservado.", { messageId: t.id, stage: `${a}:fallback`, cause: r }), !1;
  }
}
function AS(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content") ?? e;
}
function _d(e) {
  const t = e.querySelector(bS);
  if (t) return t;
  const n = document.createElement("section");
  return n.dataset.paranormalToolkitCardRenderer = "ritual-single-target", n;
}
function Td(e, t) {
  Or() === "replace" ? e.replaceChildren(t) : t.parentElement || e.append(t);
}
function _S(e) {
  return globalThis.CSS?.escape ? globalThis.CSS.escape(e) : e.replace(/["\\]/gu, "\\$&");
}
function TS(e) {
  const t = e.summaryLines.map((n) => `<li>${R(n)}</li>`).join("");
  return `<header><strong>${R(e.itemName)}</strong></header>${t ? `<ul>${t}</ul>` : ""}<p>O card interativo não pôde ser reidratado com segurança. Use o conteúdo original da mensagem.</p>`;
}
const Rd = "itemUsePrompts", kd = "chatCard", Yn = "data-paranormal-toolkit-prompt-id", Xn = "data-paranormal-toolkit-pending-id", Lo = "data-paranormal-toolkit-executed-label", gr = "data-paranormal-toolkit-choice-group", Ed = "data-paranormal-toolkit-skipped-label", An = "data-paranormal-toolkit-action-section", Gs = "data-paranormal-toolkit-detail-key", Vs = "data-paranormal-toolkit-roll-card", vo = "data-paranormal-toolkit-roll-detail-toggle", $d = "data-paranormal-toolkit-roll-detail-id", wd = "data-paranormal-toolkit-resistance-roll-button", Cd = "data-paranormal-toolkit-resistance-skill", Sd = "data-paranormal-toolkit-resistance-skill-label", Id = "data-paranormal-toolkit-resistance-target-actor-id", Ld = "data-paranormal-toolkit-resistance-target-name", vd = "data-paranormal-toolkit-resistance-roll-result", Hs = "data-paranormal-toolkit-system-card-replaced", RS = `[${Xn}]`, kS = `[${vo}]`, ES = `[${wd}]`, hr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, $S = `${h}__actions`, Ws = `${h}__details`, Dd = `${h}__summary`, wS = `${h}__title`, xd = `${h}__button--executed`, Wt = `${h}__roll-card`, CS = "data-paranormal-toolkit-roll-card-target-mode", SS = "data-paranormal-toolkit-roll-card-target-names", IS = "data-paranormal-toolkit-roll-card-resistance", LS = "data-paranormal-toolkit-roll-card-resistance-skill", vS = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Ks = !1, br = null;
const ee = /* @__PURE__ */ new Map(), DS = [0, 100, 500, 1500, 3e3], xS = 3e4, NS = [0, 100, 500, 1500, 3e3];
function PS(e) {
  if (br = e, Ks) {
    Xs(e);
    return;
  }
  const t = (n, a) => {
    Nd(n, a, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Ks = !0, Xs(e);
}
async function Ys(e) {
  const t = xo(e);
  ee.set(e.pendingId, t), await Po(t) || Hd(t), Pd(e.pendingId);
}
async function MS(e) {
  const t = xo({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", ee.set(e.pendingId, t), await Po(t) || Hd(t), Pd(e.pendingId);
}
async function Ra(e, t) {
  const n = ee.get(e);
  ee.delete(e), n && await qI(n, t);
}
function Do(e) {
  const t = Xd();
  for (const n of t) {
    const a = ce(n)[e];
    if (a) return { message: n, prompt: a };
  }
  return null;
}
async function OS(e, t) {
  const n = Do(e);
  if (!n) return;
  const a = ce(n.message), r = a[e];
  r && (a[e] = {
    ...r,
    executedLabel: r.executedLabel,
    executed: !0
  }, await st(n.message, a));
}
async function FS(e, t, n) {
  if (!t) return;
  const a = Do(e);
  if (!a) return;
  const r = ce(a.message);
  let o = !1;
  for (const [i, l] of Object.entries(r))
    i !== e && l.choiceGroupId === t && (r[i] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await st(a.message, r);
}
function xo(e) {
  const t = Re(e.context.message), n = e.context.targets.find((i) => Tr(i)), a = n ? Tr(n) : null, r = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? n?.name ?? r?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: fI(e.context),
    executed: !1
  };
}
function Nd(e, t, n) {
  UI();
  const a = Zn(t);
  if (!a) return;
  const r = te(e);
  if (r && Io(r, a)) return;
  const o = OI(e, a);
  o.length > 0 && _n(a);
  for (const i of o)
    yr(a, i);
  Ud(a, n), Ar(a), _r(a);
}
function BS(e) {
  const t = Fo(e.message);
  if (t) return t;
  const n = xo({ pendingId: `lookup-${Date.now()}`, context: e, mode: "ask" });
  return Bo(n);
}
function Xs(e) {
  for (const t of NS)
    globalThis.setTimeout(() => {
      US(e);
    }, t);
}
function US(e, t = qS(), n = Nd) {
  for (const a of t) {
    const r = Qn(a);
    !r || !zS(r) || n(r, a, e);
  }
}
function qS() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function zS(e) {
  return e ? Kn(e) || Mo(e) ? !0 : jI(e).length > 0 : !1;
}
function Pd(e) {
  const t = ee.get(e);
  if (!t) return;
  const n = t.messageId ? FI(t.messageId) : null;
  if (n) {
    tl(n, t), _n(n), yr(n, t), Qs(n), Ar(n), _r(n);
    return;
  }
  if (t.messageId) {
    kr(t);
    return;
  }
  const a = BI(t);
  if (a) {
    tl(a, t), _n(a), yr(a, t), Qs(a), Ar(a), _r(a);
    return;
  }
  kr(t);
}
function Qs(e) {
  br && Ud(e, br);
}
function _n(e) {
  const t = jS();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Bd(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Hs) === "true") return;
  const a = n.querySelector(`.${hr}`);
  a ? n.replaceChildren(a) : n.replaceChildren(), n.setAttribute(Hs, "true");
}
function jS() {
  try {
    return Or() === "replace";
  } catch {
    return !1;
  }
}
function yr(e, t) {
  if (_n(e), e.querySelector(`[${Yn}="${lt(t.pendingId)}"]`)) return;
  const n = VS(e, t);
  WS(n, t);
  const a = cI(t);
  if (GS(a)) return;
  lI(n, a).append(mI(t));
}
function GS(e) {
  return Od(e.id) && !he();
}
function Md(e) {
  const n = e.closest(`[${An}]`)?.getAttribute(An) ?? null;
  return Od(n) && !he();
}
function Od(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function VS(e, t) {
  const n = e.querySelector(`.${hr}`);
  if (n)
    return n;
  const a = document.createElement("section");
  a.classList.add(hr, h);
  const r = document.createElement("header");
  r.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(wS), i.textContent = HS(t);
  const l = document.createElement("span");
  return l.classList.add(Dd), l.textContent = t.summary, r.append(o, i, l), a.append(r), gI(e).append(a), a;
}
function HS(e) {
  const t = j(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function WS(e, t) {
  const n = t.summaryLines ?? [], a = Gd(n, t);
  if (a) {
    KS(e, a, t);
    return;
  }
  uI(e, n);
}
function KS(e, t, n) {
  if (e.querySelector(`[${Vs}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(
    Wt,
    `${Wt}--${t.intent}`,
    `${Wt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && a.classList.add(`${Wt}--multi-target`), a.setAttribute(Vs, "true"), a.setAttribute(CS, t.targetMode), a.setAttribute(SS, JSON.stringify(t.targetNames)), aI(a, t), t.castingCheck && Zs(a, XS(t.castingCheck), n.pendingId, "casting"), YS(t) && Zs(a, QS(t), n.pendingId, "effect"), nI(a, t), rI(a, t, n), sI(a, t), e.append(a);
}
function YS(e) {
  return e.intent !== "casting";
}
function XS(e) {
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
function QS(e) {
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
function Zs(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && r.classList.add(`${h}__workflow-section--${t.status}`);
  const o = document.createElement("div");
  o.classList.add(`${h}__workflow-section-header`);
  const i = document.createElement("strong");
  if (i.textContent = t.title, o.append(i), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, o.append(l);
  }
  if (r.append(o), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, r.append(l);
  }
  ZS(r, t), iI(r, t.detailRows, n, a, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(r);
}
function ZS(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const a = document.createElement("span");
  a.classList.add(`${h}__workflow-roll-formula`), a.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${h}__workflow-roll-total`), r.textContent = String(t.total), n.append(a, r);
  const o = JS(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function JS(e, t) {
  const n = eI(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-dice-tray`);
  for (const r of tI(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), r.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function eI(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function tI(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Js(e, "highest") : n.includes("kl") ? Js(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Js(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function nI(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(sL);
  if (n.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const r of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = r, a.append(o);
  }
  e.append(a);
}
function aI(e, t) {
  t.resistance && (e.setAttribute(IS, t.resistance), t.resistanceSkill && e.setAttribute(LS, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(vS, t.resistanceSkillLabel));
}
function rI(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const i = oI(t, n);
  r.append(o), i && r.append(i);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, a.append(r, l), t.resistanceRollResult && a.append(Fd(t.resistanceRollResult)), e.append(a);
}
function oI(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Te())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Yn, t.pendingId), n.setAttribute(wd, "true"), n.setAttribute(Cd, e.resistanceSkill), n.setAttribute(Sd, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Id, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Ld, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(vd, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const r = document.createElement("span");
  return r.classList.add(`${h}__resistance-roll-fallback`), r.textContent = "d20", n.append(a, r), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Fd(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = zd(e), t;
}
function iI(e, t, n, a, r) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const i = `${n}-roll-details-${a}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(vo, i), l.setAttribute("aria-expanded", "false"), l.textContent = r;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute($d, i), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const p = document.createElement("dd");
    p.textContent = u.value, c.append(m, p);
  }
  e.append(l, c);
}
function sI(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const a of [...t.notes, ...t.details]) {
    const r = document.createElement("span");
    r.textContent = a, n.append(r);
  }
  e.append(n);
}
function lI(e, t) {
  const n = `[${An}="${lt(t.id)}"]`, a = e.querySelector(n);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add($S), r.setAttribute(An, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, r.append(o), e.append(r), r;
}
function cI(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const a = Gd(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function uI(e, t) {
  if (t.length === 0) return;
  const n = dI(e);
  for (const a of t) {
    const r = lL(a);
    if (n.querySelector(`[${Gs}="${lt(r)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(Gs, r), n.append(o);
  }
}
function dI(e) {
  const t = e.querySelector(`.${Ws}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Ws), e.append(n), n;
}
function mI(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Yn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(xd), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Xn, e.pendingId), t.setAttribute(Lo, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(gr, e.choiceGroupId), t.setAttribute(Ed, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function fI(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = pI(e);
  return `${t} → ${n}`;
}
function pI(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function gI(e) {
  return Bd(e) ?? e;
}
function Bd(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Ud(e, t) {
  const n = Zn(e);
  if (!n) return;
  const a = n.querySelectorAll(RS);
  for (const r of a) {
    if (Md(r)) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitBound !== "true" && (r.dataset.paranormalToolkitBound = "true", r.addEventListener("click", () => {
      II(r, t);
    }));
  }
}
function Ar(e) {
  const t = Zn(e);
  if (!t) return;
  const n = t.querySelectorAll(kS);
  for (const a of n)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      hI(t, a);
    }));
}
function _r(e) {
  const t = Zn(e);
  if (!t) return;
  const n = t.querySelectorAll(ES);
  for (const a of n) {
    if (!Te()) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      bI(t, a);
    }));
  }
}
function hI(e, t) {
  const n = t.getAttribute(vo);
  if (!n) return;
  const a = e.querySelector(`[${$d}="${lt(n)}"]`);
  if (!a) return;
  const r = a.hidden;
  a.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.textContent = r ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function bI(e, t) {
  if (!Te()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(Yn), a = t.getAttribute(Cd), r = t.getAttribute(Sd) ?? (a ? De(a) : "Resistência");
  if (!n || !a) return;
  const o = _I(e, n), i = TI(o, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Hh(i, a);
    await wI(c.roll);
    const u = {
      skill: a,
      skillLabel: r,
      formula: c.formula,
      total: c.total,
      targetName: i.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    yI(t, u), AI(t, u), CI(n, u), await SI(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${r}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function yI(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(vd, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function AI(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const a = n.querySelector(`.${h}__resistance-roll-result`), r = a ?? Fd(t);
  if (a) {
    a.textContent = zd(t);
    return;
  }
  n.append(r);
}
function _I(e, t) {
  const n = ee.get(t);
  if (n) return n;
  const a = Qn(e);
  return ce(a)[t] ?? null;
}
function TI(e, t) {
  const n = e?.resistanceTargetActor;
  if (se(n)) return n;
  const r = e?.context?.targets.map(Tr).find(se) ?? null;
  if (r) return r;
  const o = t.getAttribute(Id) ?? e?.resistanceTargetActorId ?? null, i = o ? kI(o) : null;
  return i || EI(
    t.getAttribute(Ld) ?? e?.resistanceTargetName ?? RI(t)
  );
}
function RI(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Dd}`)?.textContent ?? null;
  if (!n) return null;
  const a = "→";
  if (!n.includes(a)) return null;
  const r = n.split(a), o = r[r.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Tr(e) {
  const t = e.actor;
  if (se(t)) return t;
  const n = e.token, a = wt(n);
  if (a) return a;
  const r = e.document;
  return wt(r);
}
function wt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (se(t)) return t;
  const n = e.document?.actor;
  return se(n) ? n : null;
}
function kI(e) {
  const n = game.actors?.get?.(e);
  return se(n) ? n : qd().map((o) => wt(o)).find((o) => o?.id === e) ?? null;
}
function EI(e) {
  const t = We(e);
  if (!t) return null;
  const n = qd().filter((o) => We($I(o)) === t).map((o) => wt(o)).find(se) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => se(o) && We(o.name) === t);
  return se(r) ? r : null;
}
function qd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function $I(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : wt(e)?.name ?? null;
}
function We(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function se(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function zd(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function wI(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function CI(e, t) {
  const n = ee.get(e);
  n && (n.resistanceRollResult = t);
}
async function SI(e, t, n) {
  const a = Qn(e);
  if (a)
    try {
      const r = ce(a), o = r[t];
      if (!o) return;
      r[t] = {
        ...o,
        resistanceRollResult: n
      }, await st(a, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", r);
    }
}
function Qn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages;
  return te(a?.get?.(n));
}
async function II(e, t) {
  if (Md(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(Xn);
  if (!n) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    jd(e, e.getAttribute(Lo) ?? "✓ Automação aplicada"), LI(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function jd(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(xd), e.removeAttribute(Xn), e.removeAttribute(Lo);
}
function LI(e) {
  const t = e.getAttribute(gr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const a = `[${gr}="${lt(t)}"]`;
  for (const r of n.querySelectorAll(a)) {
    if (r === e) continue;
    const o = r.getAttribute(Ed) ?? "✓ Outra opção escolhida";
    jd(r, o);
  }
}
function Gd(e, t) {
  const n = e.map(No).filter(oL), a = n.find((k) => k.intent !== "casting") ?? n[0] ?? null;
  if (!a) return null;
  const r = j(e, "Forma"), o = j(e, "Custo"), i = j(e, "Dados") ?? j(e, `Dados (${a.label})`), l = j(e, "Tipo"), c = j(e, "Resistência"), u = j(e, "Resistência Perícia"), m = j(e, "Resistência Rótulo") ?? (u ? De(u) : null), p = Vd(e, "Observação"), A = e.filter((k) => MI(k, a)), $ = NI(e), T = vI(t);
  return {
    ...a,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: r,
    cost: o,
    diceBreakdown: i,
    damageType: l,
    resistance: c,
    resistanceSkill: u,
    resistanceSkillLabel: m,
    targetMode: T.mode,
    targetNames: T.names,
    notes: p,
    details: A,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function vI(e) {
  const t = DI(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function DI(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && xI(n) !== "nenhum alvo") : [];
}
function xI(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function NI(e) {
  const t = e.map(No).find((o) => o?.intent === "casting") ?? null, n = j(e, "Conjuração DT"), a = j(e, "Conjuração Resultado");
  if (!t || !n || !a) return null;
  const r = Number(n);
  return Number.isFinite(r) ? {
    label: t.formula,
    formula: j(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(r),
    success: a.toLowerCase() === "sucesso",
    diceBreakdown: j(e, "Dados (Conjuração)")
  } : null;
}
function No(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, a, r] = t, o = Number(r);
  return Number.isFinite(o) ? {
    label: n,
    formula: a,
    total: o,
    intent: PI(n)
  } : null;
}
function PI(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function j(e, t) {
  return Vd(e, t)[0] ?? null;
}
function Vd(e, t) {
  const n = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(n)) return [];
    const r = a.slice(n.length).trim();
    return r.length > 0 ? [r] : [];
  });
}
function MI(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || No(e) ? !1 : e.trim().length > 0;
}
function OI(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of ee.values())
    Rr(a, e, t) && n.set(a.pendingId, a);
  for (const a of zI(e))
    Rr(a, e, t) && !n.has(a.pendingId) && n.set(a.pendingId, a);
  return Array.from(n.values()).sort((a, r) => a.createdAt - r.createdAt);
}
function Rr(e, t, n) {
  const a = Re(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !el(n, "itemId", e.itemId) ? !1 : !e.actorId || el(n, "actorId", e.actorId);
}
function el(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const a = `data-${cL(t)}`;
  for (const r of e.querySelectorAll(`[${a}]`))
    if (r.getAttribute(a) === n)
      return !0;
  return !1;
}
function FI(e) {
  const t = lt(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function BI(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Rr(e, null, t))
      return t;
  return null;
}
function UI() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, a] of ee.entries())
    e - a.createdAt > t && ee.delete(n);
}
async function tl(e, t) {
  const n = Qn(e);
  if (!n) return !1;
  try {
    const a = ce(n);
    return a[t.pendingId] = Oo(t, Re(n)), await st(n, a), !0;
  } catch (a) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a), !1;
  }
}
async function Po(e) {
  const t = Bo(e);
  if (!t) return !1;
  try {
    const n = ce(t);
    return n[e.pendingId] = Oo(e, Re(t)), await st(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Hd(e) {
  for (const t of DS)
    globalThis.setTimeout(() => {
      kr(e);
    }, t);
}
async function kr(e) {
  const t = Bo(e);
  if (Mo(t)?.prompts.some((r) => r.pendingId === e.pendingId))
    return !0;
  const a = await Po(e);
  return a || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), a;
}
async function qI(e, t) {
  const n = Fo(e.context.message);
  if (n)
    try {
      const a = ce(n), r = a[e.pendingId] ?? Oo(e, Re(n));
      a[e.pendingId] = {
        ...r,
        executedLabel: t ?? r.executedLabel,
        executed: !0
      }, await st(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function zI(e) {
  return Object.values(ce(te(e))).filter(Mt);
}
function ce(e) {
  if (!e) return {};
  const t = {}, n = Mo(e);
  for (const a of n?.prompts ?? [])
    t[a.pendingId] = a;
  for (const [a, r] of Object.entries(Wd(e)))
    t[a] ??= r;
  return t;
}
function jI(e) {
  return Object.values(Wd(te(e))).filter(Mt);
}
function Wd(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Rd);
  if (!nt(t))
    return {};
  const n = {};
  for (const [a, r] of Object.entries(t))
    Mt(r) && (n[a] = r);
  return n;
}
async function st(e, t) {
  typeof e.setFlag == "function" && (await VI(e, t), await GI(e, t));
}
async function GI(e, t) {
  await Promise.resolve(e.setFlag?.(d, Rd, t));
}
function Mo(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, kd);
  return aL(t) ? t : null;
}
async function VI(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Mt).sort((o, i) => o.createdAt - i.createdAt);
  if (n.length === 0) return;
  const a = n[0];
  if (!a) return;
  const r = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: a.messageId ?? Re(e) ?? null,
    source: {
      actorId: a.actorId,
      actorName: HI(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, kd, r));
}
function HI(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Oo(e, t) {
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
function Fo(e) {
  const t = te(e);
  if (t?.setFlag)
    return t;
  const n = WI(e);
  if (n?.setFlag)
    return n;
  const a = Re(e);
  if (!a) return null;
  const r = game.messages;
  return te(r?.get?.(a));
}
function WI(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(te).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Bo(e) {
  const t = Fo(e.context.message);
  if (t) return t;
  const n = e.messageId ? KI(e.messageId) : null;
  if (n) return n;
  const a = Xd().slice().reverse();
  return a.find((r) => YI(r, e)) ?? a.find((r) => XI(r, e)) ?? null;
}
function KI(e) {
  const t = game.messages;
  return te(t?.get?.(e));
}
function YI(e, t) {
  const n = Re(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Kd(e, t)) return !1;
  const r = Yd(e);
  return !t.actorId || !r || r === t.actorId;
}
function XI(e, t) {
  if (!ZI(e, t)) return !1;
  const n = Yd(e);
  return t.actorId && n === t.actorId ? !0 : Kd(e, t);
}
function Kd(e, t) {
  const n = We(QI(e));
  if (!n) return !1;
  const a = We(t.itemName);
  if (a && n.includes(a)) return !0;
  const r = We(t.itemId);
  return !!(r && n.includes(r));
}
function QI(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Yd(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function ZI(e, t) {
  const n = JI(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= xS;
}
function JI(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function te(e) {
  return e && typeof e == "object" ? e : null;
}
function Mt(e) {
  return nt(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && K(e.messageId) && K(e.itemId) && K(e.actorId) && K(e.itemName) && Ce(e.resistanceTargetActorId) && Ce(e.resistanceTargetName) && rL(e.resistanceRollResult) && eL(e.actionPayload) && ka(e.title) && ka(e.buttonLabel) && ka(e.executedLabel) && Ce(e.choiceGroupId) && Ce(e.skippedLabel) && Ce(e.actionSectionId) && Ce(e.actionSectionTitle) && iL(e.summaryLines) : !1;
}
function eL(e) {
  return e == null ? !0 : nt(e) ? e.kind === "resource-operation" && K(e.actorId) && K(e.actorUuid) && typeof e.actorName == "string" && tL(e.resource) && nL(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function tL(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function nL(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function aL(e) {
  return nt(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && K(e.messageId) && nt(e.source) && K(e.source.actorId) && K(e.source.actorName) && K(e.source.itemId) && K(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Mt) : !1;
}
function rL(e) {
  return e == null ? !0 : nt(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Ce(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function oL(e) {
  return e !== null;
}
function nt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function K(e) {
  return e === null || typeof e == "string";
}
function ka(e) {
  return e === void 0 || typeof e == "string";
}
function Ce(e) {
  return e == null || typeof e == "string";
}
function iL(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function sL(e) {
  return typeof e == "string" && e.length > 0;
}
function Xd() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(te).filter((a) => a !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(te).filter((a) => a !== null) : [];
}
function Zn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Re(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function lL(e) {
  return e.trim().toLowerCase();
}
function cL(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function lt(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Uo = "ritualResistanceOutcomes", uL = {
  success: "Sucesso",
  failure: "Falha"
};
function Qd() {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: [] },
      failure: { conditions: [] }
    }
  };
}
function Zd(e) {
  const t = e.getFlag(
    d,
    Uo
  );
  return Jd(t);
}
function dL(e) {
  return Zd(e) ?? Qd();
}
function Jd(e) {
  if (!Tn(e)) return null;
  const t = Tn(e.outcomes) ? e.outcomes : {};
  return {
    schemaVersion: 1,
    outcomes: {
      success: nl(t.success),
      failure: nl(t.failure)
    }
  };
}
function mL() {
  return Xr.map((e) => ({
    value: e.id,
    label: e.label
  })).sort((e, t) => e.label.localeCompare(t.label, "pt-BR"));
}
function em(e) {
  return Object.values(e.outcomes).some(
    (t) => t.conditions.length > 0
  );
}
function fL(e, t) {
  const n = t.resistance ?? Gn(e);
  if (!n) return t;
  const a = Zd(e);
  if (!a || !em(a))
    return t;
  const r = t.conditionApplications ?? [], o = new Set(r.map((l) => l.id)), i = pL(e, a).filter(
    (l) => !o.has(l.id)
  );
  return i.length === 0 ? t : {
    ...t,
    resistance: n,
    conditionApplications: [
      ...r,
      ...i
    ]
  };
}
function pL(e, t) {
  return ["success", "failure"].flatMap(
    (n) => t.outcomes[n].conditions.map(
      (a, r) => gL(e, n, a, r)
    )
  );
}
function gL(e, t, n, a) {
  const r = tm(n.conditionId), o = r?.id ?? n.conditionId, i = r?.label ?? yL(o);
  return {
    id: `generic-ritual-resistance-${t}-${a + 1}-${o}`,
    actor: "target",
    conditionId: o,
    label: `${uL[t]} · ${i}`,
    duration: n.rounds === null ? null : { rounds: n.rounds },
    source: `ritual.generic-resistance.${e.id ?? "item"}`,
    actionSectionId: "apply-effects",
    actionSectionTitle: "Aplicar efeito",
    executedLabel: `✓ ${i} aplicado`,
    applyOnResistance: t
  };
}
function nl(e) {
  if (!Tn(e) || !Array.isArray(e.conditions))
    return { conditions: [] };
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e.conditions) {
    const r = hL(a);
    !r || n.has(r.conditionId) || (n.add(r.conditionId), t.push(r));
  }
  return { conditions: t };
}
function hL(e) {
  if (!Tn(e)) return null;
  const t = tm(AL(e.conditionId));
  return t ? {
    conditionId: t.id,
    rounds: bL(e.rounds)
  } : null;
}
function tm(e) {
  const t = al(e);
  return t ? Xr.find((n) => [
    n.id,
    n.label,
    ...n.aliases ?? []
  ].some((r) => al(r) === t)) ?? null : null;
}
function bL(e) {
  if (e == null || e === "") return null;
  const t = typeof e == "number" ? e : typeof e == "string" ? Number(e.trim()) : Number.NaN;
  if (!Number.isFinite(t)) return null;
  const n = Math.trunc(t);
  return n > 0 ? n : null;
}
function yL(e) {
  return e.trim().split(/[._-]+/u).filter((t) => t.length > 0).map(
    (t) => `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`
  ).join(" ");
}
function al(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLocaleLowerCase();
}
function AL(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Tn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _L(e) {
  if (e.mode === "legacy") return { eligible: !1, reason: "mode-legacy" };
  if (e.systemId !== "ordemparanormal") return { eligible: !1, reason: "unsupported-system" };
  if (e.context.item.type !== "ritual") return { eligible: !1, reason: "not-ritual" };
  if (e.snapshot.areaTargeting) return { eligible: !1, reason: "unsupported-area-targeting" };
  if (e.context.targets.length > 1) return { eligible: !1, reason: "multiple-targets" };
  if (!e.context.actor?.id && !e.context.actor?.uuid) return { eligible: !1, reason: "missing-source" };
  if (!e.context.item.id && !e.context.item.uuid) return { eligible: !1, reason: "missing-item" };
  if (e.snapshot.rolls.some((n) => !["damage", "healing", "ritual", "generic"].includes(n.intent))) return { eligible: !1, reason: "unsupported-roll-intent" };
  if (e.snapshot.rolls.filter((n) => n.intent !== "ritual").length > 1) return { eligible: !1, reason: "multiple-effect-rolls" };
  if (e.actions.some((n) => !["resource-operation", "damage-application", "condition-application"].includes(n.kind))) return { eligible: !1, reason: "unsupported-action" };
  if (e.context.targets.length === 0)
    return TL(e) ? { eligible: !1, reason: "missing-required-target" } : { eligible: !0, reason: "no-target-supported" };
  const t = e.context.targets[0]?.actor;
  return !t || !t.id && !t.uuid ? { eligible: !1, reason: "missing-target-actor" } : e.snapshot.resistance && e.resistanceDifficulty === null ? { eligible: !1, reason: "missing-resistance-difficulty" } : { eligible: !0 };
}
function TL(e) {
  return e.snapshot.resistance || e.snapshot.rolls.some((t) => t.intent === "damage" || t.intent === "healing") ? !0 : e.actions.some((t) => t.kind === "damage-application" || t.kind === "condition-application" || t.actor !== e.context.actor);
}
const nm = {
  blood: "Sangue",
  death: "Morte",
  knowledge: "Conhecimento",
  energy: "Energia",
  fear: "Medo"
};
function RL(e) {
  const t = SL(e.system?.element), n = new Ku().getCircle(e);
  return !t || !n.ok ? null : { elementKey: t, elementLabel: nm[t], circle: n.value };
}
function kL(e) {
  const t = e.img;
  return typeof t == "string" && t.trim() ? t.trim() : null;
}
function EL(e) {
  const t = e.system;
  return {
    execution: Ea(t?.execution, "op.executionChoices", $L),
    range: Ea(t?.range, "op.rangeChoices", wL),
    duration: Ea(t?.duration, "op.durationChoices", CL)
  };
}
const $L = { default: "Padrão", standard: "Padrão", movement: "Movimento", free: "Livre", reaction: "Reação", complete: "Completa" }, wL = { personal: "Pessoal", touch: "Toque", short: "Curto", medium: "Médio", long: "Longo", extreme: "Extremo", unlimited: "Ilimitado" }, CL = { instantaneous: "Instantânea", scene: "Cena", sustained: "Sustentada", permanent: "Permanente", setduration: "Duração definida" };
function Ea(e, t, n) {
  if (typeof e != "string" || !e.trim()) return null;
  const a = e.trim(), r = a.toLocaleLowerCase().startsWith(`${t}.`.toLocaleLowerCase()) ? a.slice(t.length + 1) : a, o = `${t}.${r}`, i = globalThis.game?.i18n?.localize?.(o);
  return i && i !== o ? i : n[r.toLocaleLowerCase()] ?? `${a.charAt(0).toLocaleUpperCase("pt-BR")}${a.slice(1)}`;
}
function SL(e) {
  if (typeof e != "string") return null;
  const t = e.trim().toLocaleLowerCase(), n = t.startsWith("op.elementchoices.") ? t.slice(18) : t;
  return n in nm ? n : null;
}
const IL = /* @__PURE__ */ new Set(["p", "br", "strong", "b", "em", "i", "ul", "ol", "li"]), rl = "__PTK_SAFE_HTML_";
function LL(e) {
  const t = e.system?.description;
  if (typeof t != "string" || !DL(t).trim()) return null;
  const n = vL(t);
  return n.trim() ? n : null;
}
function vL(e) {
  const t = e.replace(/<!--[\s\S]*?-->/gu, "").replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/giu, "").replace(/<(script|style|iframe|object|embed)\b[^>]*\/?\s*>/giu, ""), n = [], a = t.replace(/<\/?([a-z0-9]+)\b[^>]*>/giu, (o, i) => {
    const l = i.toLowerCase();
    if (!IL.has(l)) return "";
    const c = /^<\s*\//u.test(o), u = l === "br" ? "<br>" : c ? `</${l}>` : `<${l}>`, m = `${rl}${n.length}__`;
    return n.push(u), m;
  });
  let r = R(a);
  return n.forEach((o, i) => {
    r = r.replace(`${rl}${i}__`, o);
  }), r;
}
function DL(e) {
  return e.replace(/<[^>]*>/gu, "").replace(/&nbsp;/giu, " ");
}
function xL(e) {
  const { context: t, snapshot: n } = e;
  if (!t.actor) throw new Error("Conjurador ausente.");
  const a = t.targets[0];
  if (a && !a.actor) throw new Error("Ator do alvo ausente.");
  const r = e.now ?? Date.now(), o = n.rolls.find((i) => i.intent !== "ritual") ?? null;
  return {
    schemaVersion: 1,
    castId: n.castId,
    renderer: "single-target",
    source: rn(t.actor),
    item: rn(t.item),
    itemImage: kL(t.item),
    form: n.form,
    ritualIdentity: RL(t.item),
    ritualMetadata: EL(t.item),
    descriptionHtml: LL(t.item),
    cost: n.cost,
    target: a?.actor ? { ...rn(a.actor), tokenId: a.tokenId, tokenUuid: a.sceneId && a.tokenId ? `Scene.${a.sceneId}.Token.${a.tokenId}` : null } : null,
    conjuration: n.castingCheck ? { ...n.castingCheck, diceResults: ML(n.castingCheck.diceBreakdown), consequence: NL(n.castingCheck.success, e.actions, t.actor) } : null,
    mainRoll: o ? { id: o.id, label: o.intent === "damage" ? "Dano" : o.intent === "healing" ? "Cura" : "Efeito", intent: o.intent === "damage" || o.intent === "healing" ? o.intent : "utility", formula: o.formula, total: o.total, diceResults: o.diceResults, damageType: o.damageType } : null,
    resistance: n.resistance && e.resistanceDifficulty !== null ? { skill: n.resistance.skill, skillLabel: n.resistance.label, difficulty: e.resistanceDifficulty, effect: n.resistance.summary, status: "pending", result: null } : null,
    actions: e.actions.map((i, l) => OL(n.castId, i, l)),
    createdAt: r
  };
}
function NL(e, t, n) {
  if (e) return null;
  const a = t.find((r) => r.kind === "resource-operation" && r.resource === "SAN" && r.operation === "damage" && r.actionSectionId === "casting-backlash" && PL(r.actor, n));
  return a && a.amount > 0 ? `Perde ${a.amount} SAN` : "Dano de Sanidade";
}
function PL(e, t) {
  return e === t ? !0 : e.uuid && t.uuid ? e.uuid === t.uuid : !!(e.id && t.id && e.id === t.id);
}
function rn(e) {
  return { id: e.id ?? null, uuid: e.uuid ?? null, name: e.name ?? "Documento sem nome" };
}
function ML(e) {
  return e?.match(/-?\d+/gu)?.map(Number).filter(Number.isFinite) ?? [];
}
function OL(e, t, n) {
  const a = t.kind === "condition-application" && t.resistanceOutcome !== "always" || t.kind === "damage-application" ? t.resistanceOutcome : void 0, r = { id: `${e}:action:${n + 1}`, state: a ? "pending" : "available", label: t.label, executedLabel: t.executedLabel, actor: rn(t.actor), choiceGroupId: t.kind !== "condition-application" ? t.choiceGroupId ?? null : null, outcome: a ?? null, completedAt: null, completedByUserId: null };
  return t.kind === "resource-operation" ? { ...r, kind: t.kind, resource: t.resource, operation: t.operation, amount: t.amount } : t.kind === "damage-application" ? { ...r, kind: t.kind, instances: t.instances.map((o) => ({ ...o })), source: t.source, originUuid: t.originUuid, resistanceLabel: t.resistanceLabel ?? null } : { ...r, kind: t.kind, conditionId: t.conditionId, duration: t.duration ? structuredClone(t.duration) : null, source: t.source, originUuid: t.originUuid };
}
let ol = !1, Er = null;
function FL(e) {
  Er = e, !ol && (ol = !0, document.addEventListener("click", (t) => {
    BL(t);
  }));
}
async function BL(e) {
  const t = e.target instanceof Element ? e.target.closest("[data-paranormal-toolkit-card-action]") : null, n = t?.closest('[data-paranormal-toolkit-card-renderer="ritual-single-target"]');
  if (!t || !n || !Er) return;
  const a = n.dataset.paranormalToolkitMessageId, r = a ? VL(game.messages?.get?.(a)) : null;
  r && (t.disabled = !0, await UL({ message: r, messageId: a, actionId: t.dataset.paranormalToolkitActionId ?? null, kind: t.dataset.paranormalToolkitCardAction ?? "", executor: Er, root: n }));
}
async function UL(e) {
  if (e.kind === "toggle-roll-details") return;
  let t = [], n = !1;
  try {
    const a = await Pt(e.message, (r) => {
      if (e.kind === "roll-resistance") {
        if (!r.state.resistance || r.state.resistance.status !== "pending") throw new Error("Resistência já rolada.");
        return { ...r, state: { ...r.state, resistance: { ...r.state.resistance, status: "executing" } } };
      }
      if (e.kind === "apply-resistance-outcome-conditions") {
        const i = r.state.resistance?.result?.outcome;
        if (!i) throw new Error("A resistência ainda não foi resolvida.");
        if (t = r.state.actions.filter((l) => l.kind === "condition-application" && l.outcome === i && l.state === "available").map((l) => l.id), !t.length) throw new Error("Não há condições pendentes para aplicar.");
        return { ...r, state: { ...r.state, actions: $r(r.state.actions, t, "executing") } };
      }
      const o = r.state.actions.find((i) => i.id === e.actionId);
      if (!o || o.state !== "available") throw new Error("Ação indisponível ou já executada.");
      return t = [o.id], { ...r, state: { ...r.state, actions: $r(r.state.actions, t, "executing") } };
    });
    if (e.kind === "roll-resistance") {
      const r = await il(() => e.executor({ message: e.message, action: null, kind: e.kind, card: a }));
      n = r.ok || r.sideEffect === "uncertain", await qL(e.message, r), sl(r);
    } else {
      const r = /* @__PURE__ */ new Map();
      for (const o of t) {
        const i = Kn(e.message) ?? a, l = i.state.actions.find((u) => u.id === o) ?? null, c = await il(() => e.executor({ message: e.message, action: l, kind: e.kind, card: i }));
        (c.ok || c.sideEffect === "uncertain") && (n = !0), r.set(o, c);
      }
      await zL(e.message, t, r);
      for (const o of r.values()) sl(o);
    }
    ll(e.message, e.root);
  } catch (a) {
    const r = n ? "finalize-after-side-effect" : "claim-or-execute";
    console.warn("Paranormal Toolkit: falha ao concluir interação do card ritual.", { messageId: e.messageId ?? e.message.id, actionId: e.actionId, stage: r, cause: a }), t.length && await jL(e.message, t, n ? "uncertain" : "available"), e.kind === "roll-resistance" && !n && await GL(e.message), ui.notifications?.warn(n ? "Paranormal Toolkit: a ação pode ter sido aplicada, mas não foi possível confirmar. Verifique o alvo antes de tentar novamente." : `Paranormal Toolkit: ${a instanceof Error ? a.message : "ação não executada"}`), ll(e.message, e.root);
  }
}
async function qL(e, t) {
  await Pt(e, (n) => {
    if (!n.state.resistance) return n;
    if (!t.ok || !t.resistance) return { ...n, state: { ...n.state, resistance: { ...n.state.resistance, status: "pending" } } };
    const a = t.resistance.outcome;
    return { ...n, state: { ...n.state, resistance: { ...n.state.resistance, status: "completed", result: t.resistance }, actions: n.state.actions.map((r) => r.outcome ? { ...r, state: r.outcome === a ? "available" : "resolved" } : r) } };
  });
}
async function zL(e, t, n) {
  await Pt(e, (a) => {
    let r = a.state.actions.map((o) => {
      if (!t.includes(o.id)) return o;
      const i = n.get(o.id);
      return i ? i.ok ? { ...o, state: "completed", completedAt: (/* @__PURE__ */ new Date()).toISOString(), completedByUserId: HL() } : { ...o, state: i.sideEffect === "none" ? "available" : "uncertain" } : { ...o, state: "available" };
    });
    for (const o of t) {
      const i = r.find((l) => l.id === o);
      i?.state === "completed" && i.choiceGroupId && (r = r.map((l) => l.id !== o && l.choiceGroupId === i.choiceGroupId ? { ...l, state: "resolved" } : l));
    }
    return { ...a, state: { ...a.state, actions: r } };
  });
}
async function il(e) {
  try {
    return await e();
  } catch (t) {
    return { ok: !1, sideEffect: "uncertain", message: t instanceof Error ? t.message : "falha inesperada durante a execução" };
  }
}
async function jL(e, t, n) {
  try {
    await Pt(e, (a) => ({ ...a, state: { ...a.state, actions: $r(a.state.actions, t, n) } }));
  } catch (a) {
    console.warn("Paranormal Toolkit: recovery de ações falhou.", { messageId: e.id, actionIds: t, stage: "recovery", cause: a });
  }
}
async function GL(e) {
  try {
    await Pt(e, (t) => t.state.resistance ? { ...t, state: { ...t.state, resistance: { ...t.state.resistance, status: "pending" } } } : t);
  } catch (t) {
    console.warn("Paranormal Toolkit: recovery da resistência falhou.", { messageId: e.id, stage: "resistance-recovery", cause: t });
  }
}
function $r(e, t, n) {
  return e.map((a) => t.includes(a.id) ? { ...a, state: n } : a);
}
function sl(e) {
  e.ok || ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function ll(e, t) {
  t && Kn(e) && Io(e, t.closest(".chat-message") ?? t);
}
function VL(e) {
  return e && typeof e == "object" ? e : null;
}
function HL() {
  const e = game.user?.id;
  return typeof e == "string" ? e : null;
}
const cl = 1e3;
class WL {
  constructor(t, n, a, r, o, i, l) {
    this.workflow = t, this.resources = n, this.damage = r, this.conditions = o, this.debugOutput = i, this.ritualAssistant = new Jw(
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
      settings: Na(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Na();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = Lr(t.item);
    if (!a.ok) {
      if (a.error.reason === "missing-automation" && nv(t.item) && n.executionMode === "ask") {
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
    if (await Rs(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ca(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const r = QL(
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
      return this.pendingExecutions.delete(t), await Ra(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const a = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return a.ok ? (this.pendingExecutions.delete(t), await Ra(
      t,
      a.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Do(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const a = n.prompt.actionPayload, r = ov(a);
    if (!r)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${a.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Et(
      this.resources,
      r,
      a.resource,
      a.operation,
      a.amount
    );
    return o.ok ? (await OS(t), await FS(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (PS(
      (t) => this.executePendingAutomation(t)
    ), FL((t) => this.executeRitualCardAction(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n, a) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n, a);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Rs(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ca(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      av(t.item),
      { type: "generic" }
    );
  }
  async handleAssistedRitual(t, n, a) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = fL(t.item, n), o = await this.ritualAssistant.run(t, r, a);
    switch (o.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", o.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: o.message,
          data: o.cause ?? o
        }), ui.notifications?.warn(`Paranormal Toolkit: ${o.message}`);
        return;
      case "completed-without-actions":
        if (await this.tryRegisterSingleTargetRitualCard(o.itemUseContext, o.castSnapshot, [], o.summaryLines)) {
          this.setAttempt(t, "completed", "ritual-single-target-card");
          return;
        }
        await this.registerCompletedRitualCard(
          o.itemUseContext,
          o.summaryLines
        ), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          ze(o.workflowContext)
        );
        return;
      case "ready":
        if (await this.tryRegisterSingleTargetRitualCard(o.itemUseContext, o.castSnapshot, o.actions, o.summaryLines)) {
          this.setAttempt(t, "pending", "ritual-single-target-card");
          return;
        }
        await this.registerAssistedActions(
          o.itemUseContext,
          o.workflowContext,
          o.actions,
          o.summaryLines
        );
        return;
    }
  }
  async tryRegisterSingleTargetRitualCard(t, n, a, r) {
    const o = t.actor ? Xu(t.actor) : null, i = _L({ mode: Jl(), systemId: game.system.id, context: t, snapshot: n, actions: a, resistanceDifficulty: o });
    if (!i.eligible)
      return i.reason !== "mode-legacy" && f.warn("Fallback para card ritual legado.", { reason: i.reason, castId: n.castId, itemId: t.item.id, targetCount: t.targets.length, stage: "eligibility" }), !1;
    try {
      const l = xL({ context: t, snapshot: n, actions: a, resistanceDifficulty: o }), c = BS(t);
      if (!c) throw new Error("ChatMessage ainda não resolvida.");
      const u = { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: l.createdAt, messageId: typeof c.id == "string" ? c.id : null, state: l, legacyFallback: { summaryLines: [...r], itemName: t.item.name ?? "Ritual", actorId: t.actor?.id ?? null, itemId: t.item.id ?? null } };
      return await yS(c, u), !0;
    } catch (l) {
      return f.warn("Fallback para card ritual legado.", { reason: "card-build-or-persist-failed", castId: n.castId, itemId: t.item.id, targetCount: t.targets.length, stage: "build-render-persist", cause: l }), !1;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const r = await this.ritualAssistant.applyAction(t);
      return r.ok ? (n.resourceTransactions.push(r.value), { ok: !0 }) : (this.handleResourceActionFailure(r), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      if (!he())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const r = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return r.ok ? (tv(n, r.value), await ja(r.value), {
        ok: !0,
        executedLabel: KL(r.value)
      }) : (this.handleDamageActionFailure(r.error), { ok: !1 });
    }
    if (!he())
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
  async executeRitualCardAction(t) {
    if (t.kind === "roll-resistance") {
      if (!Te()) return { ok: !1, sideEffect: "none", message: "apenas um usuário autorizado pode rolar resistência." };
      const o = t.card.state.resistance, i = t.card.state.target;
      if (!i) return { ok: !1, sideEffect: "none", message: "alvo da resistência não encontrado." };
      let l;
      try {
        l = await ul(i);
      } catch (c) {
        return { ok: !1, sideEffect: "none", message: c instanceof Error ? c.message : "não foi possível resolver o alvo." };
      }
      if (!o || !l) return { ok: !1, sideEffect: "none", message: "alvo ou resistência não encontrado." };
      try {
        const u = await new iu(new Kr(new Fn())).execute({ actor: l, skill: o.skill, skillLabel: o.skillLabel });
        return await yo(u.roll), { ok: !0, resistance: {
          skill: u.skill,
          skillLabel: u.skillLabel,
          formula: u.formula,
          total: u.total,
          diceResults: YL(u.roll),
          difficulty: o.difficulty,
          outcome: u.total >= o.difficulty ? "success" : "failure",
          targetActorId: l.id ?? null,
          targetActorUuid: l.uuid ?? null,
          targetName: l.name ?? i.name,
          rolledAt: (/* @__PURE__ */ new Date()).toISOString(),
          userId: XL(),
          usedFallbackBonus: !1
        } };
      } catch (c) {
        return { ok: !1, sideEffect: "none", message: c instanceof Error ? c.message : "não foi possível rolar resistência." };
      }
    }
    const n = t.action;
    if (!n) return { ok: !1, sideEffect: "none", message: "ação persistida não encontrada." };
    if (!he()) return { ok: !1, sideEffect: "none", message: "apenas o Mestre pode aplicar ações assistidas." };
    let a;
    try {
      a = await ul(n.actor);
    } catch (o) {
      return { ok: !1, sideEffect: "none", message: o instanceof Error ? o.message : `não foi possível encontrar ${n.actor.name}.` };
    }
    if (!a) return { ok: !1, sideEffect: "none", message: `não foi possível encontrar ${n.actor.name}.` };
    if (n.kind === "resource-operation") {
      const o = await Et(this.resources, a, n.resource, n.operation, n.amount);
      return o.ok ? { ok: !0 } : { ok: !1, sideEffect: "none", message: o.error.message };
    }
    if (n.kind === "damage-application") {
      const o = await this.damage.applyDamage({ actor: a, instances: n.instances, source: n.source, originUuid: n.originUuid });
      return o.ok ? (await ja(o.value), { ok: !0 }) : { ok: !1, sideEffect: "none", message: o.error.message };
    }
    const r = await this.conditions.applyCondition({ actor: a, conditionId: n.conditionId, duration: n.duration, originUuid: n.originUuid, source: n.source ?? "ritual.chat-card" });
    return r.ok ? { ok: !0 } : { ok: !1, sideEffect: "none", message: r.error.message };
  }
  async resolveAlternativeActions(t) {
    const n = $a(t.action);
    if (!n) return;
    const a = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, r]) => r.kind === "assisted-action" && $a(r.action) === n);
    for (const [r, o] of a)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(r), await Ra(
        r,
        dl(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const a = Sa();
    await MS({
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
    for (const i of a) {
      const l = Sa();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Ys({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: $a(i),
        skippedLabel: dl(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: r,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: rv(i)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      ze(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const a = Sa();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ys({
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
      ze(r.value.context)
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
    const n = Date.now(), a = ml(t);
    for (const [o, i] of this.recentExecutionKeys.entries())
      n - i > cl && this.recentExecutionKeys.delete(o);
    const r = this.recentExecutionKeys.get(a);
    return r !== void 0 && n - r <= cl;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ml(t), Date.now());
  }
  setAttempt(t, n, a, r) {
    this.lastAttempt = Ca(
      t,
      n,
      a,
      r
    );
  }
}
function KL(e) {
  return ru({ inputAmount: e.totalRawDamage });
}
async function ul(e) {
  if (e.uuid) {
    const n = await fromUuid(e.uuid);
    if (n && typeof n == "object" && "system" in n) return n;
  }
  const t = e.id ? game.actors?.get?.(e.id) : null;
  return t && typeof t == "object" && "system" in t ? t : null;
}
function YL(e) {
  const t = e.dice;
  return Array.isArray(t) ? t.flatMap((n) => Array.isArray(n.results) ? n.results.flatMap((a) => typeof a.result == "number" ? [a.result] : []) : []) : [];
}
function XL() {
  const e = game.user?.id;
  return typeof e == "string" ? e : null;
}
function QL(e, t) {
  if (t.resistance || !ZL(t))
    return t;
  const n = Gn(e);
  return n ? { ...t, resistance: n } : t;
}
function ZL(e) {
  return JL(e) && !ev(e);
}
function JL(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function ev(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function $a(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function dl(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function tv(e, t) {
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
function nv(e) {
  return e.type === "ritual";
}
function av(e) {
  return HE(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function rv(e) {
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
function ov(e) {
  const t = e.actorUuid ? iv(e.actorUuid) : null;
  if (at(t)) return t;
  const n = e.actorId ? sv(e.actorId) : null;
  return n || lv(e.actorName);
}
function iv(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function sv(e) {
  const n = game.actors?.get?.(e);
  if (at(n)) return n;
  for (const a of am()) {
    const r = qo(a);
    if (r?.id === e) return r;
  }
  return null;
}
function lv(e) {
  const t = wa(e);
  if (!t) return null;
  for (const r of am()) {
    const o = cv(r);
    if (wa(o) === t) {
      const i = qo(r);
      if (i) return i;
    }
  }
  const a = game.actors?.find?.(
    (r) => at(r) && wa(r.name) === t
  );
  return at(a) ? a : null;
}
function am() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function cv(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : qo(e)?.name ?? null;
}
function qo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (at(t)) return t;
  const n = e.document?.actor;
  return at(n) ? n : null;
}
function wa(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function at(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ca(e, t, n, a) {
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
function ml(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Sa() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class uv {
  constructor(t, n, a) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = a;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), a = [], r = [], o = It(t);
    for (const i of n) {
      const l = i.itemId ? o.find((m) => m.id === i.itemId) ?? null : null, c = i.match?.preset ?? null;
      if (!l || !c) {
        r.push(i);
        continue;
      }
      await this.automationBinder.applyPreset(l, c);
      const u = await this.itemPatches.applyPresetItemPatch(l, c);
      a.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: c.id,
        presetLabel: c.label,
        previousStatus: i.status,
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
class dv {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = It(t).map((l) => this.analyzeRitual(l)), a = n.filter(Kt("upToDate")), r = n.filter(Kt("available")), o = n.filter(Kt("outdated")), i = n.filter(Kt("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: a,
      available: r,
      outdated: o,
      unsupported: i,
      canApply: r.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, a = mv(t);
    return n ? a ? a.source.type !== "preset" ? dt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : a.source.presetId === n.preset.id && a.source.presetVersion === n.preset.version ? dt({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: a,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : dt({
      ritual: t,
      status: "outdated",
      match: n,
      flag: a,
      reason: fv(a, n.preset)
    }) : dt({
      ritual: t,
      status: "available",
      match: n,
      flag: a,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : dt({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: a,
      reason: a ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function dt(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? In(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function mv(e) {
  const t = e.getFlag(d, "automation");
  return vr(t) ? t : null;
}
function fv(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Kt(e) {
  return (t) => t.status === e;
}
class pv {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), a = xr(t.transaction);
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
    const n = Yt(t.actorName), a = Yt(t.resource), r = Yt(gv(t)), o = Yt(hv(t));
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
function gv(e) {
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
function hv(e) {
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
function Yt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function bv() {
  const e = new Rk(), t = new gE(e), n = new Pc(new Nc()), a = new Kr(new Fn()), r = new hE(new Yu()), o = new Ku(), i = new Fk(o), l = new jk(e), c = new Vk(), u = c.registerMany(
    lf()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new Gk(), p = new qk(), A = jc(), $ = new Fc(A), T = new dv(
    c
  ), k = new uv(
    T,
    m,
    p
  ), b = new _E(), L = new pv(b), E = new AE(), D = new pE(), G = new mE(
    t,
    i,
    L,
    E
  ), q = new yE(G, E), x = new WL(
    q,
    t,
    i,
    n,
    $,
    b,
    D
  );
  return x.addStrategy(
    new bc(
      (W) => x.handleItemUsed(W)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: o,
    ritualCosts: i,
    resources: t,
    damage: n,
    resistance: a,
    ritualCasting: r,
    automationRegistry: c,
    automationBinder: m,
    itemPatches: p,
    conditionRegistry: A,
    conditions: $,
    debugOutput: b,
    chatMessages: L,
    workflowHooks: E,
    ritualEvents: D,
    automation: G,
    workflow: q,
    itemUseIntegration: x,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: k
  };
}
const { ApplicationV2: yv } = foundry.applications.api;
class Rn extends yv {
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
      apply: Rn.onApply,
      cancel: Rn.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${oe(Pl)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${oe(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ia("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ia("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ia("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ia(e, t, n, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
        <span>${oe(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Av(n) : Tv(t)}
    </section>
  `;
}
function Av(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(_v).join("")}</ol>`;
}
function _v(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", a = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${oe(e.appliedPresetId)} v${oe(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${oe(e.itemName)}</strong>
        <span>${oe(e.reason)}</span>
        ${a}
      </div>
      <em>${oe(n)}</em>
    </li>
  `;
}
function Tv(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${oe({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function oe(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const kn = `${d}.manageRitualPresets`, fl = `__${d}_ritualPresetHeaderControlRegistered`, Rv = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function kv(e) {
  const t = globalThis;
  if (!t[fl]) {
    for (const n of Rv)
      Hooks.on(n, (a, r) => {
        Ev(a, r, e);
      });
    t[fl] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Ev(e, t, n) {
  Array.isArray(t) && wv(e) && ($v(e, n), !t.some((a) => a.action === kn) && t.push({
    action: kn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), rm(e, n);
    }
  }));
}
function $v(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[kn] && (e.options.actions[kn] = (n) => {
    n.preventDefault(), n.stopPropagation(), rm(e, t);
  }));
}
function wv(e) {
  if (!game.user?.isGM) return !1;
  const t = om(e);
  return t ? t.type === "agent" && It(t).length > 0 : !1;
}
function rm(e, t) {
  const n = om(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Rn(n, t).render({ force: !0 });
}
function om(e) {
  return pl(e.actor) ? e.actor : pl(e.document) ? e.document : null;
}
function pl(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const wr = "data-paranormal-toolkit-stylesheet";
function Cv(e) {
  const t = Dv(e), n = Sv(t), a = Lv(n), r = Iv(n, t);
  if (r)
    return r.href = a, r.setAttribute(wr, t), r;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = a, o.setAttribute(wr, t), document.head.append(o), o;
}
function Sv(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, a = n.getRoute;
  return typeof a == "function" ? a.call(n, t) : t;
}
function Iv(e, t) {
  const n = gl(e);
  for (const a of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (a.getAttribute(wr) === t || gl(a.href) === n)
      return a;
  return null;
}
function Lv(e) {
  const t = vv();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function vv() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function gl(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function Dv(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Ie(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const a = document.createElement("span");
  return a.textContent = e, n.append(a, t), n;
}
function Cr(e, t, n) {
  const a = document.createElement("input");
  return a.type = "text", a.value = e, a.placeholder = t, a.disabled = !n, a;
}
function on(e, t, n) {
  const a = document.createElement("button");
  a.type = "button", n && a.classList.add(n);
  const r = document.createElement("i");
  r.className = t;
  const o = document.createElement("span");
  return o.textContent = e, a.append(r, o), a;
}
function im(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const a = document.createElement("i");
  return a.className = t, n.append(a), n;
}
function mt(e, t, n = !1) {
  const a = document.createElement("option");
  return a.value = e, a.textContent = t, a.selected = n, a;
}
function xv(e) {
  const { roll: t, index: n, editable: a, onChange: r, onRemove: o } = e, i = document.createElement("article");
  i.classList.add(`${d}-ability-roll-config__card`), i.dataset.abilityRollId = t.id;
  const l = document.createElement("header");
  l.classList.add(`${d}-ability-roll-config__card-header`);
  const c = document.createElement("div");
  c.classList.add(`${d}-ability-roll-config__card-title`);
  const u = document.createElement("strong");
  u.textContent = `Rolagem ${n + 1}`;
  const m = document.createElement("span");
  c.append(u, m);
  const p = im("Remover rolagem", "fa-solid fa-trash");
  p.disabled = !a, p.addEventListener("click", o), l.append(c, p);
  const A = document.createElement("div");
  A.classList.add(`${d}-ability-roll-config__fields`);
  const $ = Cr(
    t.label,
    "Ex.: Dano adicional",
    a
  );
  $.addEventListener("input", () => {
    t.label = $.value, r();
  }), A.append(Ie("Nome da rolagem", $));
  const T = document.createElement("select");
  T.disabled = !a;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    T.append(
      mt(
        C,
        Qp(C),
        t.intent === C
      )
    );
  T.addEventListener("change", () => {
    t.intent = Ov(T.value), ne(), r();
  }), A.append(Ie("Tipo da rolagem", T));
  const k = document.createElement("div");
  k.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), A.append(k);
  const b = document.createElement("section");
  b.classList.add(
    `${d}-ability-roll-config__formula-section`
  );
  const L = document.createElement("div");
  L.classList.add(
    `${d}-ability-roll-config__formula-header`
  );
  const E = document.createElement("strong");
  E.textContent = "Fórmula";
  const D = document.createElement("label");
  D.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const G = document.createElement("input");
  G.type = "checkbox", G.checked = t.formula.mode === "nex", G.disabled = !a;
  const q = document.createElement("span");
  q.textContent = "Varia conforme o NEX", D.append(G, q), L.append(E, D);
  const x = document.createElement("div");
  return x.classList.add(`${d}-ability-roll-config__formula`), b.append(L, x), G.addEventListener("change", () => {
    t.formula = G.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: Pv(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, W(), Oe(), r();
  }), i.append(l, A, b), W(), ne(), Oe(), i;
  function W() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function ne() {
    k.replaceChildren();
    const C = t.intent === "damage";
    if (A.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), k.hidden = !C, !C) return;
    const M = document.createElement("select");
    M.disabled = !a, M.append(mt("", "—", !t.damageType));
    for (const { value: ae, label: S } of Ac)
      M.append(mt(ae, S, t.damageType === ae));
    M.addEventListener("change", () => {
      t.damageType = M.value || null, r();
    }), k.append(Ie("Tipo de dano", M));
  }
  function Oe() {
    if (x.replaceChildren(), t.formula.mode === "fixed") {
      const I = Cr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        a
      );
      I.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = I.value, r());
      }), x.append(Ie("Expressão", I));
      return;
    }
    const C = t.formula, M = document.createElement("select");
    M.disabled = !a, M.append(
      mt(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        C.resolution === "highest-unlocked"
      ),
      mt(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        C.resolution === "choose-unlocked"
      )
    ), M.addEventListener("change", () => {
      C.resolution = Fv(M.value), r();
    }), x.append(Ie("Comportamento", M));
    const ae = document.createElement("div");
    ae.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((I, ue) => {
      ae.append(
        Nv({
          step: I,
          editable: a,
          onChange: r,
          onRemove: () => {
            C.steps.splice(ue, 1), Oe(), r();
          }
        })
      );
    }), x.append(ae);
    const S = on(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    S.disabled = !a || C.steps.length >= Ba, S.addEventListener("click", () => {
      C.steps.length >= Ba || (C.steps.push({
        minNex: Mv(
          C.steps.map((I) => I.minNex)
        ),
        formula: ""
      }), Oe(), r());
    }), x.append(S);
  }
}
function Nv(e) {
  const { step: t, editable: n, onChange: a, onRemove: r } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const i = document.createElement("input");
  i.type = "number", i.min = "0", i.max = "99", i.step = "1", i.value = String(t.minNex), i.disabled = !n, i.setAttribute("aria-label", "NEX mínimo"), i.addEventListener("change", () => {
    t.minNex = Bv(Number(i.value)), i.value = String(t.minNex), a();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(i, c);
  const u = Cr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, a();
  });
  const m = im("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", r), o.append(
    Ie("NEX mínimo", l),
    Ie("Fórmula", u),
    m
  ), o;
}
function Pv(e) {
  const t = jp(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function Mv(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function Ov(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function Fv(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function Bv(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function Uv(e) {
  let t = La(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const a = qv(t), r = document.createElement("p");
  r.classList.add(`${d}-ability-roll-config__hint`), r.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const i = on(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  i.addEventListener("click", () => {
    t.rolls.length >= Fa || (t.rolls.push(Tc(t.rolls.length + 1)), A(), L("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = on("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = on("Limpar", "fa-solid fa-eraser");
  l.append(c, u);
  const m = document.createElement("footer");
  m.classList.add(`${d}-ability-roll-config__footer`), m.append(i, l);
  const p = document.createElement("p");
  return p.classList.add(`${d}-ability-roll-config__status`), p.textContent = e.editable ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", n.append(a, r, o, m, p), c.addEventListener("click", () => {
    e.editable && $();
  }), u.addEventListener("click", () => {
    e.editable && T();
  }), A(), n;
  function A() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const E = document.createElement("p");
      E.classList.add(`${d}-ability-roll-config__empty`), E.textContent = "Nenhuma rolagem configurada.", o.append(E);
    } else
      t.rolls.forEach((E, D) => {
        o.append(
          xv({
            roll: E,
            index: D,
            editable: e.editable,
            onChange: () => {
              Sr(a, t), L("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(D, 1), A(), L("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    Sr(a, t), b(!1);
  }
  async function $() {
    k(!0), L("Salvando configuração...");
    try {
      const E = Ur(t);
      if (!E) throw new Error("Configuração inválida.");
      t = La(await e.onSave(E)), A(), L("Configuração salva.");
    } catch (E) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        E
      ), L("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      k(!1);
    }
  }
  async function T() {
    k(!0), L("Limpando configuração...");
    try {
      t = La(await e.onClear()), A(), L("Configuração removida.");
    } catch (E) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        E
      ), L("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      k(!1);
    }
  }
  function k(E) {
    n.classList.toggle(`${d}-ability-roll-config--busy`, E), b(E);
  }
  function b(E) {
    c.disabled = E || !e.editable, u.disabled = E || !e.editable, i.disabled = E || !e.editable || t.rolls.length >= Fa;
  }
  function L(E) {
    p.textContent = E;
  }
}
function qv(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const a = document.createElement("strong");
  a.textContent = "Paranormal Toolkit";
  const r = document.createElement("span");
  r.textContent = "Fórmulas de rolagem", n.append(a, r);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), Sr(t, e), t;
}
function Sr(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = Zp(t) ? "Configurada" : "Rascunho");
}
function La(e) {
  return JSON.parse(JSON.stringify(e));
}
const zv = "[data-paranormal-toolkit-ability-roll-config]", hl = `__${d}_abilityRollConfigBlockRegistered`, jv = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function Gv() {
  const e = globalThis;
  if (!e[hl]) {
    Cv("styles/ability-roll-config.css");
    for (const t of jv)
      Hooks.on(t, (...n) => {
        Vv(n[0], n[1]);
      });
    e[hl] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function Vv(e, t) {
  const n = Wv(e);
  if (!n || n.type !== "ability") return;
  const a = Yv(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!r) return;
  for (const i of Array.from(
    r.querySelectorAll(zv)
  ))
    i.remove();
  const o = Uv({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: Vp(n),
    editable: Kv(n),
    onSave: async (i) => {
      const l = await Hp(n, i);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Wp(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), _c())
  });
  Hv(r, o);
}
function Hv(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function Wv(e) {
  return bl(e.item) ? e.item : bl(e.document) ? e.document : null;
}
function Kv(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Yv(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function bl(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Ir = "data-paranormal-toolkit-ritual-resistance-outcome-editor", En = "data-paranormal-toolkit-ritual-resistance-outcome", $n = "data-paranormal-toolkit-ritual-resistance-outcome-row", wn = "data-paranormal-toolkit-ritual-resistance-outcome-field", Cn = "data-paranormal-toolkit-ritual-resistance-outcome-editor-action", Xv = {
  success: "Sucesso na resistência",
  failure: "Falha na resistência"
}, Qv = mL();
function Zv(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${d}-ritual-resistance-outcomes__grid`), n.setAttribute(Ir, "true"), n.append(
    yl(
      "success",
      e.outcomes.success.conditions,
      t
    ),
    yl(
      "failure",
      e.outcomes.failure.conditions,
      t
    )
  ), n.addEventListener("click", (a) => {
    const r = a.target;
    if (!(r instanceof Element)) return;
    const o = r.closest(
      `button[${Cn}]`
    );
    if (!(!o || !n.contains(o) || !t))
      switch (o.getAttribute(Cn)) {
        case "add":
          e0(n, o);
          return;
        case "remove":
          t0(o);
          return;
      }
  }), n;
}
function Jv(e) {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: Al(e, "success") },
      failure: { conditions: Al(e, "failure") }
    }
  };
}
function sm(e, t, n) {
  for (const a of ["success", "failure"]) {
    const r = zo(e, a);
    r && r.replaceChildren(
      ...lm(t.outcomes[a].conditions).map(
        (o) => Jn(a, o, n)
      )
    );
  }
}
function yl(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-resistance-outcomes__card`), a.setAttribute(En, e);
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-resistance-outcomes__card-title`), r.textContent = Xv[e], a.append(r);
  const o = document.createElement("div");
  o.classList.add(`${d}-ritual-resistance-outcomes__rows`), o.append(
    ...lm(t).map(
      (l) => Jn(e, l, n)
    )
  ), a.append(o);
  const i = document.createElement("button");
  return i.type = "button", i.textContent = "+ Adicionar condição", i.disabled = !n, i.classList.add(`${d}-ritual-resistance-outcomes__add`), i.setAttribute(Cn, "add"), i.setAttribute(En, e), a.append(i), a;
}
function Jn(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${d}-ritual-resistance-outcomes__row`), a.setAttribute($n, e);
  const r = _l("Condição");
  r.classList.add(
    `${d}-ritual-resistance-outcomes__condition-field`
  );
  const o = document.createElement("select");
  o.disabled = !n, o.setAttribute(wn, "conditionId");
  const i = document.createElement("option");
  i.value = "", i.textContent = "Nenhuma condição", i.selected = t.conditionId.length === 0, o.append(i);
  for (const m of Qv) {
    const p = document.createElement("option");
    p.value = m.value, p.textContent = m.label, p.selected = t.conditionId === m.value, o.append(p);
  }
  r.append(o);
  const l = _l("Rodadas");
  l.classList.add(
    `${d}-ritual-resistance-outcomes__rounds-field`
  );
  const c = document.createElement("input");
  c.type = "number", c.min = "1", c.step = "1", c.placeholder = "Sem limite", c.value = t.rounds === null ? "" : String(t.rounds), c.disabled = !n, c.setAttribute(wn, "rounds"), l.append(c);
  const u = document.createElement("button");
  return u.type = "button", u.textContent = "×", u.title = "Remover condição", u.setAttribute("aria-label", u.title), u.disabled = !n, u.classList.add(`${d}-ritual-resistance-outcomes__remove`), u.setAttribute(Cn, "remove"), a.append(r, l, u), a;
}
function Al(e, t) {
  const n = zo(e, t);
  return n ? Array.from(
    n.querySelectorAll(`[${$n}]`)
  ).flatMap((a) => {
    const r = a.querySelector(
      `[${wn}="conditionId"]`
    )?.value.trim();
    if (!r) return [];
    const o = a.querySelector(`[${wn}="rounds"]`)?.value.trim();
    return [{ conditionId: r, rounds: n0(o) }];
  }) : [];
}
function e0(e, t) {
  const n = cm(
    t.getAttribute(En)
  );
  if (!n) return;
  zo(e, n)?.append(Jn(n, jo(), !0));
}
function t0(e) {
  const t = e.closest(`[${$n}]`), n = cm(t?.getAttribute($n)), a = t?.parentElement;
  !t || !n || !a || (t.remove(), a.childElementCount === 0 && a.append(Jn(n, jo(), !0)));
}
function zo(e, t) {
  return (e.matches(`[${Ir}]`) ? e : e.querySelector(`[${Ir}]`))?.querySelector(
    `.${d}-ritual-resistance-outcomes__card[${En}="${t}"]`
  )?.querySelector(
    `.${d}-ritual-resistance-outcomes__rows`
  ) ?? null;
}
function lm(e) {
  return e.length > 0 ? e : [jo()];
}
function jo() {
  return { conditionId: "", rounds: null };
}
function _l(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-resistance-outcomes__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function n0(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = Number(e);
  if (!Number.isFinite(t)) return null;
  const n = Math.trunc(t);
  return n > 0 ? n : null;
}
function cm(e) {
  return e === "success" || e === "failure" ? e : null;
}
const Go = "data-paranormal-toolkit-ritual-resistance-outcomes", Tl = "data-paranormal-toolkit-ritual-roll-section-title", a0 = "data-paranormal-toolkit-ritual-roll-field", Rl = "data-paranormal-toolkit-ritual-roll-action", kl = "data-paranormal-toolkit-ritual-unified-actions-bound", El = `__${d}_ritualResistanceOutcomeBlockRegistered`, r0 = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function o0() {
  const e = globalThis;
  if (!e[El]) {
    for (const t of r0)
      Hooks.on(t, (...n) => {
        i0(
          n[0],
          n[1]
        );
      });
    e[El] = !0, f.info(
      "Seção de efeitos por resistência registrada na configuração genérica de ritual."
    );
  }
}
function i0(e, t) {
  const n = b0(e);
  if (!n || n.type !== "ritual") return;
  const a = A0(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="ritualAttr"]'
  );
  if (!r) return;
  const o = r.querySelector(
    "[data-paranormal-toolkit-ritual-roll-config]"
  );
  if (!o) return;
  c0(o), s0(o);
  const i = dL(n), l = y0(n), c = Gn(n), u = u0(
    i,
    l,
    c?.summary ?? null
  );
  l0(o, u), d0(o, n, l), Vo(o, i);
}
function s0(e) {
  const t = e.querySelector(
    `.${d}-ritual-roll-config__title span`
  );
  t && (t.textContent = "Configuração genérica do ritual");
  const n = e.querySelector(
    `.${d}-ritual-roll-config__hint`
  );
  n && (n.textContent = "Configure as rolagens e os efeitos de resistência usados pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.");
  const a = e.querySelector(
    `.${d}-ritual-roll-config__fields`
  );
  if (!a) return;
  e.querySelector(`[${Tl}]`)?.remove();
  const r = document.createElement("strong");
  r.classList.add(
    `${d}-ritual-resistance-outcomes__formula-title`
  ), r.setAttribute(Tl, "true"), r.textContent = "Fórmula de rolagem", a.insertAdjacentElement("beforebegin", r);
}
function l0(e, t) {
  const n = e.querySelector(
    `.${d}-ritual-roll-config__actions`
  );
  if (n) {
    n.insertAdjacentElement("beforebegin", t);
    return;
  }
  e.append(t);
}
function c0(e) {
  for (const t of Array.from(
    e.querySelectorAll(`[${Go}]`)
  ))
    t.remove();
}
function u0(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-resistance-outcomes`), a.setAttribute(Go, "true");
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-resistance-outcomes__section-title`), r.textContent = "Efeitos da resistência", a.append(r);
  const o = document.createElement("p");
  return o.classList.add(`${d}-ritual-resistance-outcomes__hint`), o.textContent = n ? `${n}. Configure quais condições ficam disponíveis em cada resultado.` : "Configure uma perícia e um resultado de resistência nos campos do sistema antes de usar estes efeitos.", a.append(o), a.append(Zv(e, t)), a;
}
function d0(e, t, n) {
  const a = e.querySelector(
    `button[${Rl}="save"]`
  ), r = e.querySelector(
    `button[${Rl}="clear"]`
  );
  a && (a.textContent = "Salvar configuração"), r && (r.textContent = "Limpar configuração"), !e.hasAttribute(kl) && (e.setAttribute(kl, "true"), a?.addEventListener(
    "click",
    (o) => {
      if (o.preventDefault(), o.stopImmediatePropagation(), !n) return;
      const i = $l(e);
      i && m0(e, i, t, a, r);
    },
    { capture: !0 }
  ), r?.addEventListener(
    "click",
    (o) => {
      if (o.preventDefault(), o.stopImmediatePropagation(), !n) return;
      const i = $l(e);
      i && f0(e, i, t, a, r);
    },
    { capture: !0 }
  ));
}
function $l(e) {
  return e.querySelector(`[${Go}]`);
}
async function m0(e, t, n, a, r) {
  Sn(a, r, !0), Ke(e, "Salvando configuração...");
  try {
    const o = um(e), i = Jd(
      Jv(t)
    );
    if (!o || !i)
      throw new Error("Configuração genérica do ritual inválida.");
    await mm(n).update({
      [`flags.${d}.${et}`]: o,
      [`flags.${d}.${Uo}`]: i
    }), dm(e, o), sm(
      t,
      i,
      !0
    ), Vo(e, i), Ke(e, "Configuração salva."), ui.notifications?.info(
      "Paranormal Toolkit: configuração genérica do ritual salva."
    );
  } catch (o) {
    console.warn(
      "Paranormal Toolkit: não foi possível salvar a configuração genérica do ritual.",
      o
    ), Ke(e, "Não foi possível salvar a configuração."), ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível salvar a configuração genérica do ritual."
    );
  } finally {
    Sn(a, r, !1);
  }
}
async function f0(e, t, n, a, r) {
  Sn(a, r, !0), Ke(e, "Limpando configuração...");
  try {
    await mm(n).update({
      [`flags.${d}.-=${et}`]: null,
      [`flags.${d}.-=${Uo}`]: null
    });
    const o = Nt(), i = Qd();
    dm(e, o), sm(
      t,
      i,
      !0
    ), Vo(e, i), Ke(e, "Configuração removida."), ui.notifications?.info(
      "Paranormal Toolkit: configuração genérica do ritual removida."
    );
  } catch (o) {
    console.warn(
      "Paranormal Toolkit: não foi possível limpar a configuração genérica do ritual.",
      o
    ), Ke(e, "Não foi possível limpar a configuração."), ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível limpar a configuração genérica do ritual."
    );
  } finally {
    Sn(a, r, !1);
  }
}
function um(e) {
  const t = h0(
    Ho(e, "intent")?.value
  );
  return t ? bn({
    schemaVersion: 1,
    intent: t,
    damageType: wl(e, "damageType"),
    utilityLabel: wl(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: {
        formula: sn(e, "formula.base")
      },
      discente: {
        formula: sn(e, "formula.discente")
      },
      verdadeiro: {
        formula: sn(e, "formula.verdadeiro")
      }
    }
  }) : null;
}
function dm(e, t) {
  Ue(e, "intent", t.intent), Ue(
    e,
    "damageType",
    t.damageType ?? ""
  ), Ue(
    e,
    "utilityLabel",
    t.utilityLabel ?? "Resultado"
  ), Ue(
    e,
    "formula.base",
    t.forms.base.formula
  ), Ue(
    e,
    "formula.discente",
    t.forms.discente.formula
  ), Ue(
    e,
    "formula.verdadeiro",
    t.forms.verdadeiro.formula
  ), p0(e, t.intent);
}
function p0(e, t) {
  for (const n of Array.from(
    e.querySelectorAll(
      '[data-paranormal-toolkit-ritual-roll-damage-row="true"]'
    )
  ))
    n.hidden = t !== "damage";
  for (const n of Array.from(
    e.querySelectorAll(
      '[data-paranormal-toolkit-ritual-roll-utility-row="true"]'
    )
  ))
    n.hidden = t !== "utility";
}
function Vo(e, t) {
  const n = e.querySelector(
    `.${d}-ritual-roll-config__badge`
  );
  if (!n) return;
  const a = um(e);
  n.textContent = a && g0(a) || em(t) ? "Configurada" : "Rascunho";
}
function g0(e) {
  return Object.values(e.forms).some(
    (t) => t.formula.trim().length > 0
  );
}
function Ho(e, t) {
  return e.querySelector(
    `[${a0}="${t}"]`
  );
}
function sn(e, t) {
  return Ho(
    e,
    t
  )?.value.trim() ?? "";
}
function wl(e, t) {
  const n = sn(e, t);
  return n.length > 0 ? n : null;
}
function Ue(e, t, n) {
  const a = Ho(
    e,
    t
  );
  a && (a.value = n);
}
function h0(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Sn(e, t, n) {
  e && (e.disabled = n), t && (t.disabled = n);
}
function Ke(e, t) {
  const n = e.querySelector(
    `.${d}-ritual-roll-config__status`
  );
  n && (n.textContent = t);
}
function mm(e) {
  if (typeof e.update != "function")
    throw new Error("O item não suporta atualização de configuração.");
  return e;
}
function b0(e) {
  return Cl(e.item) ? e.item : Cl(e.document) ? e.document : null;
}
function y0(e) {
  return !!(game.user?.isGM || e.isOwner);
}
function A0(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Cl(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const fm = "data-paranormal-toolkit-ritual-roll-config", Ot = "data-paranormal-toolkit-ritual-roll-field", xe = "data-paranormal-toolkit-ritual-roll-action", Sl = `__${d}_ritualRollConfigBlockRegistered`, _0 = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], T0 = [
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
function R0() {
  const e = globalThis;
  if (!e[Sl]) {
    k0();
    for (const t of _0)
      Hooks.on(t, (...n) => {
        E0(n[0], n[1]);
      });
    e[Sl] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function k0() {
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
function E0(e, t) {
  const n = F0(e);
  if (!n || n.type !== "ritual") return;
  const a = q0(t);
  if (!a) return;
  const r = a.querySelector('section[data-tab="ritualAttr"]');
  if (!r) return;
  w0(r);
  const o = gm(n), i = id(n), l = B0(n), c = C0(n, i, o, l);
  x0(c, n, o, l), $0(r, c), Wo(c);
}
function $0(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function w0(e) {
  for (const t of Array.from(e.querySelectorAll(`[${fm}]`)))
    t.remove();
}
function C0(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config`), r.setAttribute(fm, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${d}-ritual-roll-config__title`), i.append(Il("strong", "Paranormal Toolkit")), i.append(Il("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = bm(t) ? "Configurada" : "Rascunho", o.append(i, l), r.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", r.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(S0(t, a)), u.append(I0(t, a)), u.append(L0(t, a)), r.append(u), r.append(v0(t, n, a)), r.append(D0(a));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = a ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", r.append(m), r;
}
function S0(e, t) {
  const n = ea("Tipo da rolagem"), a = document.createElement("select");
  a.setAttribute(Ot, "intent"), a.disabled = !t;
  for (const r of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = r, o.textContent = VE(r), o.selected = e.intent === r, a.append(o);
  }
  return n.append(a), n;
}
function I0(e, t) {
  const n = ea("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const a = document.createElement("select");
  a.setAttribute(Ot, "damageType"), a.disabled = !t;
  const r = document.createElement("option");
  r.value = "", r.textContent = "—", r.selected = !e.damageType, a.append(r);
  for (const o of T0) {
    const i = document.createElement("option");
    i.value = o.value, i.textContent = o.label, i.selected = e.damageType === o.value, a.append(i);
  }
  return n.append(a), n;
}
function L0(e, t) {
  const n = ea("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const a = document.createElement("input");
  return a.type = "text", a.placeholder = "Resultado", a.value = e.utilityLabel ?? "Resultado", a.disabled = !t, a.setAttribute(Ot, "utilityLabel"), n.append(a), n;
}
function v0(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config__forms-section`);
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-roll-config__forms-title`), r.textContent = "Fórmulas por forma", a.append(r);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(va("base", "Padrão", e.forms.base.formula, !0, n)), o.append(va("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(va("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), a.append(o), a;
}
function va(e, t, n, a, r) {
  const o = ea(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !r || !a, i.setAttribute(Ot, `formula.${e}`), o.append(i), !a) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function D0(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(xe, "save");
  const a = document.createElement("button");
  return a.type = "button", a.textContent = "Limpar", a.disabled = !e, a.setAttribute(xe, "clear"), t.append(n, a), t;
}
function ea(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Il(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function x0(e, t, n, a) {
  ct(e, "intent")?.addEventListener("change", () => Wo(e)), Dl(e, "system.studentForm")?.addEventListener("change", () => Ll(e, t)), Dl(e, "system.trueForm")?.addEventListener("change", () => Ll(e, t)), e.querySelector(`[${xe}="save"]`)?.addEventListener("click", () => {
    a && N0(e, t, n);
  }), e.querySelector(`[${xe}="clear"]`)?.addEventListener("click", () => {
    a && P0(e, t);
  });
}
async function N0(e, t, n) {
  const a = e.querySelector(`[${xe}="save"]`);
  a?.setAttribute("disabled", "true"), Ye(e, "Salvando configuração...");
  try {
    const r = M0(e, n);
    await jE(t, r), pm(e, r), Ye(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", r), Ye(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    a?.removeAttribute("disabled");
  }
}
async function P0(e, t) {
  const n = e.querySelector(`[${xe}="clear"]`);
  n?.setAttribute("disabled", "true"), Ye(e, "Limpando configuração...");
  try {
    await GE(t);
    const a = id(t);
    O0(e, a), pm(e, a), Ye(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", a), Ye(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function pm(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = bm(t) ? "Configurada" : "Rascunho");
}
function M0(e, t) {
  return {
    schemaVersion: 1,
    intent: hm(ct(e, "intent")?.value),
    damageType: xl(e, "damageType"),
    utilityLabel: xl(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: ln(e, "formula.base") },
      discente: { formula: ln(e, "formula.discente") },
      verdadeiro: { formula: ln(e, "formula.verdadeiro") }
    }
  };
}
function O0(e, t) {
  qe(e, "intent", t.intent), qe(e, "damageType", t.damageType ?? ""), qe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), qe(e, "formula.base", t.forms.base.formula), qe(e, "formula.discente", t.forms.discente.formula), qe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Wo(e);
}
function Wo(e) {
  const t = hm(ct(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), a = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const r of Array.from(n))
    r.hidden = t !== "damage";
  for (const r of Array.from(a))
    r.hidden = t !== "utility";
}
function Ll(e, t) {
  const n = gm(t);
  vl(e, "discente", n.discente), vl(e, "verdadeiro", n.verdadeiro);
}
function vl(e, t, n) {
  const a = ct(e, `formula.${t}`);
  if (!a) return;
  const r = !e.querySelector(`[${xe}="save"]`)?.disabled;
  a.disabled = !r || !n;
  const o = a.closest(`.${d}-ritual-roll-config__field`), i = o?.querySelector("small");
  if (o) {
    if (n) {
      i?.remove();
      return;
    }
    if (!i) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", o.append(l);
    }
  }
}
function Ye(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function gm(e) {
  const t = U0(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function F0(e) {
  return Nl(e.item) ? e.item : Nl(e.document) ? e.document : null;
}
function B0(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function U0(e) {
  const t = e.system;
  return z0(t) ? t : {};
}
function Dl(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ct(e, t) {
  return e.querySelector(`[${Ot}="${j0(t)}"]`);
}
function ln(e, t) {
  return ct(e, t)?.value.trim() ?? "";
}
function xl(e, t) {
  const n = ln(e, t);
  return n.length > 0 ? n : null;
}
function qe(e, t, n) {
  const a = ct(e, t);
  a && (a.value = n);
}
function hm(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function bm(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function q0(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Nl(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function z0(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function j0(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let re = null;
Hooks.once("init", () => {
  af(), Of(), lh(), ck(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ci.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ci.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  re = bv(), re.itemUseIntegration.registerStrategies(), Zg(re.resources, re.resourceAdapter), rh(re.conditions), Lp(re), gk(), kv(re), R0(), o0(), Gv(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function G0() {
  if (!re)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return re;
}
export {
  G0 as getToolkitServices
};
//# sourceMappingURL=main.js.map
