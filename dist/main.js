const d = "paranormal-toolkit", xl = "Paranormal Toolkit", gm = "ordemparanormal";
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
  const t = Sr(e);
  return t.ok ? y(t.value.definition) : t;
}
function Sr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? g({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Ir(t) ? y(t) : g({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function hm(e) {
  return Ir(e.getFlag(d, "automation"));
}
function Ir(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ym(t.source) && bm(t.definition);
}
function bm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(_m) && (t.ritualForms === void 0 || $m(t.ritualForms)) && (t.conditionApplications === void 0 || Lm(t.conditionApplications));
}
function ym(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function _m(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Am(t);
    case "spendRitualCost":
      return Tm(t);
    case "rollFormula":
      return Rm(t);
    case "modifyResource":
      return km(t);
    case "chatCard":
      return Em(t);
    default:
      return !1;
  }
}
function Am(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Nl(t);
}
function Tm(e) {
  return e.type === "spendRitualCost";
}
function Rm(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || Mm(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function km(e) {
  const t = e;
  return t.type === "modifyResource" && Pl(t.actor) && Pm(t.resource) && Om(t.operation) && Nl(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Em(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function $m(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([a, r]) => n.has(a) && wm(r)
  );
}
function wm(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || Bm(t.extraCost)) && (t.rollFormulaOverrides === void 0 || qm(t.rollFormulaOverrides)) && (t.notes === void 0 || Um(t.notes)) && (t.targeting === void 0 || Cm(t.targeting));
}
function Cm(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Im(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Sm(t.template));
}
function Sm(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || Yo(t.distance)) && (t.width === void 0 || t.width === null || Yo(t.width));
}
function Im(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Lm(e) {
  return Array.isArray(e) && e.every(vm);
}
function vm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Pl(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || xm(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Dm(t.applyOnResistance));
}
function Dm(e) {
  return e === "failure" || e === "success" || e === "always";
}
function xm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Fm(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Nm(t.expiry));
}
function Nm(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Nl(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Pl(e) {
  return e === "self" || e === "target";
}
function Pm(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Om(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Mm(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Fm(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Bm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Yo(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function Um(e) {
  return Array.isArray(e) && e.every(w);
}
function qm(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function Lr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Xo);
    if (Gm(t))
      return Array.from(t).filter(Xo);
  }
  return [];
}
function jm(e) {
  return Lr(e)[0] ?? null;
}
function zm(e) {
  return Lr(e).find(hm) ?? null;
}
function Gm(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Xo(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function It(e) {
  return Lr(e).filter((t) => t.type === "ritual");
}
function Ol(e) {
  return It(e)[0] ?? null;
}
function Vm(e) {
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
      const a = e.automationRegistry.findForItem(n).map(Jo);
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
      const o = await La(e, a, r.value);
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
      const r = await La(e, n, a.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Jo(a), itemPatch: r }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Qo(e);
    },
    async applyBestPresetsToActorRituals() {
      return Qo(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ft("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Ft(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Qo(e) {
  const t = ft("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = It(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Zo(t);
  const a = Zo(t, n.length);
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
    const i = await La(e, r, o.preset);
    a.applied.push(Hm(r, o, i));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), Wm(a), a;
}
async function La(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Hm(e, t, n) {
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
function Zo(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Wm(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Jo(e) {
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
  const t = Ol(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function je(e) {
  return e ? {
    id: e.id,
    source: {
      ...Km(e.sourceActor),
      token: e.sourceToken
    },
    item: Ym(e.item),
    targets: e.targets.map(Xm),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: ei(e.rollRequests, Ml),
    rolls: ei(e.rolls, Qm),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(vr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function vr(e) {
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
function Km(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Ym(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Xm(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ml(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Qm(e) {
  return {
    ...Ml(e),
    total: e.total
  };
}
function ei(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, a]) => [n, t(a)]));
}
function Zm(e) {
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
    Jm(r.error);
    return;
  }
  const o = r.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (i) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, vr(o));
}
function ke(e) {
  const t = Ct.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Jm(e) {
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
function ef() {
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
function va() {
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
function tf() {
  return {
    status() {
      return va();
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
const Fl = "ritual.costOnly", Bl = "ritual.simpleHealing", nf = "ritual.eletrocussao", af = "ritual.definhar", Ul = "ritual.simpleDamage", ql = "generic.simpleHealing", jl = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, Dr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function rf() {
  return [
    of(),
    sf(),
    lf(),
    cf(),
    uf(),
    df()
  ];
}
function of() {
  return {
    id: Fl,
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
function sf() {
  return {
    id: Bl,
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
    automation: zl(),
    itemPatch: gf()
  };
}
function lf() {
  return {
    id: nf,
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
    automation: ff(),
    itemPatch: bf()
  };
}
function cf() {
  return {
    id: af,
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
    automation: pf(),
    itemPatch: hf()
  };
}
function uf() {
  return {
    id: Ul,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: xr()
  };
}
function df() {
  return {
    id: ql,
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
function zl(e = jl) {
  const t = mf(e);
  return Gl(
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
function mf(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...jl,
    ...e
  };
}
function ff() {
  return {
    ...xr("3d6", {
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
function pf() {
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
function xr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", r = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Gl(
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
function gf() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Dr,
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
function hf() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: Dr,
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
function bf() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Dr,
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
function Gl(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: n
    })
  };
}
function Nr() {
  return Array.from(game.user?.targets ?? []).map(Vl);
}
function Vl(e) {
  return {
    tokenId: ze(e.id),
    actorId: ze(e.actor?.id),
    sceneId: ze(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Hl() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ze(e.id),
    actorId: ze(t?.id),
    sceneId: ze(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ze(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function yf(e) {
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
        if (!Tf(t, n)) {
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
      const a = e.automationRegistry.require(Fl);
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
      if (!ti(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const r = e.automationRegistry.require(Bl);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: zl(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = Ee("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const a = $e(n);
      if (!a) return;
      if (!ti(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const r = e.automationRegistry.require(Ul);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value, {
        definition: xr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = Ee("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = $e(t);
      n && await _f(e, t, n);
    }
  };
}
async function _f(e, t, n) {
  const a = St(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Hl(),
    item: n,
    targets: Nr()
  });
  if (!r.ok) {
    Af(r.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", je(r.value.context));
}
function Af(e) {
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
  const t = Ol(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Tf(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function ti(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Rf = ["strict", "open"], Wl = "strict";
function kf(e) {
  return Rf.includes(e) ? e : Wl;
}
function Ef(e) {
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
const $f = ["disabled", "ask", "automatic"], wf = ["buttons", "confirm"], Kl = "ask";
function Cf(e) {
  return typeof e == "string" && $f.includes(e);
}
function Sf(e) {
  return typeof e == "string" && wf.includes(e);
}
function If(e) {
  return Cf(e) ? e : Sf(e) ? "ask" : Kl;
}
const Lf = ["keep", "replace"], vf = ["manual", "assisted"], Df = ["auto", "legacy"], Yl = "keep", Xl = "assisted", xf = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled",
  ritualChatCardMode: "ritual.chatCard.mode"
};
function Nf() {
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
    default: Kl
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
    default: Yl
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
    default: Xl
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
    default: Wl
  }), game.settings.register(d, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: xf
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
function Da() {
  const e = If(game.settings.get(d, N.executionMode)), t = Jl(game.settings.get(d, N.systemCardMode)), n = ec(game.settings.get(d, N.damageResolutionMode)), a = Or();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: a,
    ritualCastingCheckEnabled: Zl(),
    ritualChatCardMode: Ql()
  };
}
function Ql() {
  const e = game.settings.get(d, N.ritualChatCardMode);
  return Df.includes(e) ? e : "auto";
}
function Pr() {
  return Jl(game.settings.get(d, N.systemCardMode));
}
function Pf() {
  return ec(game.settings.get(d, N.damageResolutionMode));
}
function Or() {
  return kf(game.settings.get(d, N.resistanceGateMode));
}
function Zl() {
  return game.settings.get(d, N.ritualCastingCheckEnabled) === !0;
}
async function we(e) {
  await game.settings.set(d, N.executionMode, e);
}
function Jl(e) {
  return Lf.includes(e) ? e : Yl;
}
function ec(e) {
  return vf.includes(e) ? e : Xl;
}
function Of(e) {
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
const Mf = [
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
function Ff(e) {
  return {
    phases() {
      return Mf;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ea("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = zm(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ni(e, t, n);
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
      if (!qf(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = Uf(n) ?? ea("Nenhum ator encontrado para executar automação do item.");
      a && await ni(e, a, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ea("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = jm(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(ql);
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
async function ni(e, t, n) {
  const a = St(n);
  if (!a.ok) {
    f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const r = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Hl(),
    item: n,
    targets: Nr()
  });
  if (!r.ok) {
    Bf(r.error);
    return;
  }
  f.info("Automação executada com sucesso.", je(r.value.context));
}
function Bf(e) {
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
function ea(e) {
  const t = Ct.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Uf(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function qf(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function jf(e) {
  const t = Zm(e), n = Vm(e), a = yf(e), r = Ff(e), o = tf(), i = Of(e);
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
function zf(e) {
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
      const a = ai();
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
      return Gf(r), r;
    },
    removeFromSelectedTokens: async (t) => {
      const n = ai();
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
      return Vf(a), a;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function ai() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = n.actor ?? n.document?.actor ?? null;
    if (!a) continue;
    const o = a.uuid ?? null ?? a.id ?? a.name ?? `selected-${t.size}`;
    t.set(o, a);
  }
  return Array.from(t.values());
}
function Gf(e) {
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
function Vf(e) {
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
function Hf(e) {
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${e.tone ?? "accent"}">${R(e.label)}</span>`;
}
const Wf = '<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function Kf(e) {
  const t = e?.src?.trim();
  return t ? `<img class="paranormal-toolkit-chat-card-header__image-content" src="${R(t)}" alt="${R(e?.alt ?? "")}">` : Wf;
}
function tc(e) {
  const t = e.subtitle ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${R(e.subtitle)}</span>` : "", n = e.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${e.badges.map(Hf).join("")}</div>` : "", a = e.context ? `<div class="paranormal-toolkit-chat-card-header__context">${R(e.context)}</div>` : "";
  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${Kf(e.image)}</div>
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
const Yf = '<i class="paranormal-toolkit-dice-action-button__icon fa-solid fa-dice-d20" aria-hidden="true"></i>';
function nc(e) {
  const t = e.disabled ? " disabled" : "", n = e.actionId ? ` data-paranormal-toolkit-card-action="roll-resistance" data-paranormal-toolkit-action-id="${R(e.actionId)}"` : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${R(e.ariaLabel)}"${n}${t}>${Yf}</button>`;
}
function ac(e) {
  const t = e.label.trim();
  return t ? `<button class="paranormal-toolkit-assisted-action-button" type="button"${e.actionId && e.actionKind ? ` data-paranormal-toolkit-card-action="${R(e.actionKind)}" data-paranormal-toolkit-action-id="${R(e.actionId)}"` : ""}${e.disabled ? " disabled" : ""}>${R(t)}</button>` : "";
}
function Xf(e) {
  const t = e.label.trim();
  return t ? `<span class="paranormal-toolkit-completion-indicator"><span class="paranormal-toolkit-completion-indicator__check" aria-hidden="true">✓</span><span class="paranormal-toolkit-completion-indicator__label">${R(t)}</span></span>` : "";
}
function rc(e) {
  const t = e.label.trim(), n = e.description.trim();
  if (!t || !n) return "";
  const a = e.control.state === "completed" ? Xf(e.control.indicator) : ac({ ...e.control.button, disabled: e.control.state === "disabled" });
  if (!a) return "";
  const r = Qf(e.details);
  return `<div class="paranormal-toolkit-assisted-action-row"><div class="paranormal-toolkit-assisted-action-row__content"><span class="paranormal-toolkit-assisted-action-row__label">${R(t)}</span><span class="paranormal-toolkit-assisted-action-row__description">${R(n)}</span>${r}</div><div class="paranormal-toolkit-assisted-action-row__control">${a}</div></div>`;
}
function Qf(e) {
  const t = e?.items.map((a) => a.trim()).filter(Boolean) ?? [];
  return t.length ? `<details class="paranormal-toolkit-assisted-action-row__details"><summary><span class="paranormal-toolkit-assisted-action-row__details-show">Ver efeitos</span><span class="paranormal-toolkit-assisted-action-row__details-hide">Ocultar efeitos</span></summary><ul>${t.map((a) => `<li>${R(a)}</li>`).join("")}</ul></details>` : "";
}
function oc(e) {
  const t = e.label.trim(), n = e.detailHtml.trim();
  return !t || !n ? "" : `<div class="paranormal-toolkit-metadata-detail-row"><span class="paranormal-toolkit-metadata-detail-row__accent" aria-hidden="true"></span><div class="paranormal-toolkit-metadata-detail-row__content"><span class="paranormal-toolkit-metadata-detail-row__label">${R(t)}</span><span class="paranormal-toolkit-metadata-detail-row__detail">${n}</span></div></div>`;
}
const ri = {
  section: "paranormal-toolkit-roll-row__result--section",
  success: "paranormal-toolkit-roll-row__result--success",
  failure: "paranormal-toolkit-roll-row__result--failure"
};
function Zf(e) {
  return ri[e ?? "section"] ?? ri.section;
}
function Jf(e) {
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
  const t = e.total !== void 0, n = t ? "with-result" : "without-result", a = t ? R(String(e.total)) : "", r = t ? `<output class="paranormal-toolkit-roll-row__result ${Zf(e.resultTone)}" aria-label="Resultado: ${a}">${a}</output>` : "";
  return `<div class="paranormal-toolkit-roll-row paranormal-toolkit-roll-row--${n}">${Jf(e)}${r}</div>`;
}
const oi = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  healing: "paranormal-toolkit-section-card--healing",
  resistance: "paranormal-toolkit-section-card--resistance",
  success: "paranormal-toolkit-section-card--success",
  failure: "paranormal-toolkit-section-card--failure"
};
function ep(e) {
  return oi[e] ?? oi.casting;
}
function _e(e) {
  return `<section class="paranormal-toolkit-section-card ${ep(e.tone)}">${e.content}</section>`;
}
function Ae(e) {
  const t = e.trailing ? `<div class="paranormal-toolkit-section-header__trailing">${e.trailing}</div>` : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${R(e.title)}</span>${t}</div>`;
}
const ii = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure"
}, tp = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA"
};
function vt(e) {
  const t = ii[e.state] ? e.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${ii[t]}">${tp[t]}</span>`;
}
function ic(e) {
  const t = R(String(e.difficultyClass)), n = `<p class="paranormal-toolkit-ritual-conjuration-section__result-description"><span class="paranormal-toolkit-ritual-conjuration-section__skill">${R(e.skillLabel)}</span> <span class="paranormal-toolkit-ritual-conjuration-section__comparison">contra</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">DT ${t}</strong></p>`, a = e.consequence?.trim(), r = a ? `<p class="paranormal-toolkit-ritual-conjuration-section__consequence"><span class="paranormal-toolkit-ritual-conjuration-section__consequence-label">Consequência:</span> ${R(a)}</p>` : "", o = Ae({
    title: "Conjuração",
    trailing: vt({ state: e.status })
  }) + n + Lt({
    formula: e.formula,
    total: e.total,
    resultTone: e.status,
    diceResults: e.diceResults,
    expanded: e.expanded
  }) + r;
  return _e({ tone: "casting", content: o });
}
function sc(e) {
  const t = e.damageType.trim(), n = t ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${R(t)}</span>` : void 0, a = Ae({ title: "Dano", trailing: n }) + Lt({
    formula: e.formula,
    total: e.total,
    resultTone: "section",
    diceResults: e.diceResults,
    expanded: e.expanded
  });
  return _e({ tone: "damage", content: a });
}
function lc(e) {
  const t = e.status === "success" || e.status === "failure" ? e.status : null, n = Ae({
    title: "Resistência",
    trailing: t ? vt({ state: t }) : void 0
  }), a = `<p class="paranormal-toolkit-ritual-resistance-section__summary"><strong class="paranormal-toolkit-ritual-resistance-section__metric">${R(e.skill)}</strong> <span>contra</span> <strong class="paranormal-toolkit-ritual-resistance-section__metric">${R(e.difficultyLabel)}</strong></p>`, r = e.status === "pending" && e.description?.trim() ? `<p class="paranormal-toolkit-ritual-resistance-section__description">${R(e.description)}</p>` : "", o = e.result ? Lt({ formula: e.result.formula, total: e.result.total, diceResults: e.result.diceResults, resultTone: t ?? "section" }) : "", l = `<div class="paranormal-toolkit-ritual-resistance-section${e.result ? " paranormal-toolkit-ritual-resistance-section--resolved" : ""}"><div class="paranormal-toolkit-ritual-resistance-section__text">${n}${a}${r}${o}</div>${e.result ? "" : nc(e.action)}</div>`;
  return _e({ tone: "resistance", content: l });
}
function np(e) {
  const t = e.typeLabel?.trim() ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${R(e.typeLabel)}</span>` : void 0;
  return _e({
    tone: e.title === "Dano" ? "damage" : e.title === "Cura" ? "healing" : "casting",
    content: Ae({ title: e.title, trailing: t }) + Lt(e)
  });
}
function ap(e) {
  const t = e.text.trim();
  return t ? `<span class="paranormal-toolkit-metadata-pill">${R(t)}</span>` : "";
}
function cc(e) {
  const t = e.items.map(ap).filter(Boolean);
  return t.length === 0 ? "" : `<div class="paranormal-toolkit-ritual-metadata">${t.join("")}</div>`;
}
function uc(e) {
  const t = e.rows.map(rc).filter(Boolean);
  return t.length ? `<section class="paranormal-toolkit-ritual-assisted-actions-panel"><h4 class="paranormal-toolkit-ritual-assisted-actions-panel__title">AÇÕES ASSISTIDAS</h4><div class="paranormal-toolkit-ritual-assisted-actions-panel__rows">${t.join("")}</div></section>` : "";
}
function rp(e) {
  const t = e.html.trim();
  return t ? `<details class="paranormal-toolkit-ritual-description-section"><summary class="paranormal-toolkit-ritual-description-section__summary">Descrição</summary><div class="paranormal-toolkit-ritual-description-section__content">${t}</div></details>` : "";
}
function dc(e) {
  const t = [
    tc(e.header),
    e.description ? rp(e.description) : "",
    e.metadata ? cc(e.metadata) : "",
    ...e.detailRows?.map(oc) ?? [],
    e.conjuration ? ic(e.conjuration) : "",
    e.damage ? sc(e.damage) : "",
    e.effect ? np(e.effect) : "",
    e.resistance ? lc(e.resistance) : "",
    e.assistedActions ? uc(e.assistedActions) : ""
  ].filter(Boolean).join("");
  return U({
    content: `<div class="paranormal-toolkit-ritual-single-target-card">${t}</div>`
  });
}
const mc = "devChatCardExample", op = "devChatCardHeaderExample";
function M() {
  if (!game.user?.isGM)
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
}
function ip() {
  const e = canvas?.tokens?.controlled?.[0], t = [...game.user?.targets ?? []], n = e?.name || e?.actor?.name || "Mercy", a = t.length > 1 ? `${t.length} alvos` : t[0]?.name || t[0]?.actor?.name || "Nenhum alvo", r = foundry.utils.getProperty(e, "document.texture.src") ?? foundry.utils.getProperty(e, "actor.img");
  return {
    image: typeof r == "string" ? { src: r, alt: `Imagem de ${n}` } : void 0,
    title: n,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${n} → ${a}`
  };
}
function sp(e) {
  return e === "runtime" ? ip() : e === "ability" ? {
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
function lp(e) {
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
function cp(e) {
  const t = lp(e);
  return U({
    content: _e({
      tone: t.tone,
      content: Ae({
        title: t.title,
        trailing: t.trailing
      })
    })
  });
}
function up(e) {
  return U({
    content: _e({
      tone: "casting",
      content: Ae({
        title: "Conjuração",
        trailing: vt({ state: e })
      })
    })
  });
}
function dp(e) {
  const t = e === "disabled";
  return U({
    content: _e({
      tone: "resistance",
      content: Ae({
        title: "Resistência",
        trailing: nc({
          ariaLabel: t ? "Resistência indisponível" : "Rolar resistência",
          disabled: t
        })
      })
    })
  });
}
function mp(e) {
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
    content: _e({
      tone: o,
      content: Ae({ title: i, trailing: l }) + Lt(r)
    })
  });
}
function fp(e) {
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
function pp(e) {
  return U({
    content: ic(fp(e))
  });
}
function gp(e) {
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
function hp(e) {
  return U({
    content: sc(gp(e))
  });
}
function bp(e) {
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
function yp(e) {
  return U({
    content: lc(bp(e))
  });
}
function _p(e) {
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
function Ap(e) {
  return U({
    content: cc(_p(e))
  });
}
function Tp(e) {
  return U({ content: oc(e === "generic" ? { label: "Alcance:", detailHtml: "Médio · até 15 metros" } : e === "long" ? {
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
function fc(e) {
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
function Rp(e) {
  const t = e === "disabled";
  return U({ content: ac({ label: t ? "Aguardando resistência" : "Aplicar 9 de dano", disabled: t }) });
}
function kp(e) {
  return U({ content: rc(Qt(e)) });
}
function Ep(e) {
  return U({ content: uc(fc(e)) });
}
function $p(e) {
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
    assistedActions: !t && !n ? fc("pending") : void 0
  };
}
function F(e, t) {
  return ChatMessage.create({
    content: e,
    flags: { [d]: { [mc]: t } }
  });
}
function wp() {
  const e = async () => {
    M();
    const n = (game.messages.contents ?? []).filter(
      (a) => typeof a.getFlag?.(d, mc) == "string" || a.getFlag?.(d, op) === !0
    );
    await Promise.all(
      n.map(
        (a) => a.delete?.()
      )
    );
  };
  return {
    async postChatCardHeaderExample(t) {
      return M(), F(
        U({
          content: tc(sp(t))
        }),
        "header"
      );
    },
    async postSectionCardExample(t) {
      M();
      const n = t === "all" ? [
        "casting-title",
        "casting-badge",
        "damage-text",
        "resistance-button"
      ] : [t];
      return Promise.all(
        n.map(
          (a) => F(cp(a), "section")
        )
      );
    },
    async postStatusBadgeExample(t) {
      M();
      const n = t === "both" ? ["success", "failure"] : [t];
      return Promise.all(
        n.map(
          (a) => F(up(a), "status")
        )
      );
    },
    async postDiceActionButtonExample(t) {
      M();
      const n = t === "all" ? ["enabled", "disabled"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            dp(a),
            "dice-action-button"
          )
        )
      );
    },
    async postRollRowExample(t) {
      M();
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
          (a) => F(mp(a), "roll-row")
        )
      );
    },
    async postRitualConjurationSectionExample(t) {
      M();
      const n = t === "all" ? ["success", "failure", "failure-consequence", "expanded"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            pp(a),
            "ritual-conjuration"
          )
        )
      );
    },
    async postRitualDamageSectionExample(t) {
      M();
      const n = t === "all" ? ["collapsed", "expanded", "without-result", "long-type"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            hp(a),
            "ritual-damage"
          )
        )
      );
    },
    async postRitualResistanceSectionExample(t) {
      M();
      const n = t === "all" ? ["enabled", "disabled", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            yp(a),
            "ritual-resistance"
          )
        )
      );
    },
    async postRitualMetadataExample(t) {
      M();
      const n = t === "all" ? ["default", "partial", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            Ap(a),
            "ritual-metadata"
          )
        )
      );
    },
    async postMetadataDetailRowExample(t) {
      M();
      const n = t === "all" ? ["short", "long", "generic"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            Tp(a),
            "metadata-detail-row"
          )
        )
      );
    },
    async postRitualSingleTargetCardExample(t) {
      M();
      const n = t === "all" ? ["success", "failure", "long"] : [t];
      return Promise.all(
        n.map(
          (a) => F(
            dc($p(a)),
            "ritual-single-target-card"
          )
        )
      );
    },
    async postAssistedActionButtonExample(t) {
      M();
      const n = t === "all" ? ["active", "disabled"] : [t];
      return Promise.all(n.map((a) => F(Rp(a), "assisted-action-button")));
    },
    async postAssistedActionRowExample(t) {
      M();
      const n = t === "all" ? ["active", "disabled", "completed"] : [t];
      return Promise.all(n.map((a) => F(kp(a), "assisted-action-row")));
    },
    async postRitualAssistedActionsPanelExample(t) {
      M();
      const n = t === "all" ? ["pending", "available", "completed", "damage-only"] : [t];
      return Promise.all(n.map((a) => F(Ep(a), "ritual-assisted-actions-panel")));
    },
    clearChatCardExamples: e,
    clearChatCardHeaderExamples: e
  };
}
function Cp(e) {
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
    conditions: zf(e.conditions),
    debug: jf(e),
    dev: wp(),
    hooks: Xt
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const a = game.modules.get(d);
  return a && (a.api = t), t;
}
class si {
  static isSupportedSystem() {
    return game.system.id === gm;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const ta = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Sp(e) {
  if (!Np(e.item)) return null;
  const t = xa(e.actor) ? e.actor : Ip(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: vp(e.token) ?? Lp(t),
    targets: Nr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Ip(e) {
  const t = e;
  return xa(t.actor) ? t.actor : xa(e.parent) ? e.parent : null;
}
function Lp(e) {
  const t = Dp(e) ?? xp(e);
  return t ? pc(t) : null;
}
function vp(e) {
  return Na(e) ? pc(e) : null;
}
function Dp(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Na(n) ? n : (t.getActiveTokens?.() ?? []).find(Na) ?? null;
}
function xp(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function pc(e) {
  const t = e.actor ?? null;
  return {
    tokenId: na(e.id),
    actorId: na(t?.id),
    sceneId: na(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Np(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function xa(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Na(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function na(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class gc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(ta.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${ta.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Sp(Pp(t));
    if (!n) {
      f.warn(`${ta.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Pp(e) {
  return e && typeof e == "object" ? e : {};
}
function cn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Mr() {
  const e = globalThis.game;
  return vn(e) ? e : null;
}
function Q(e, t) {
  const n = Op(e, t);
  return Zt(n);
}
function Op(e, t) {
  return t.split(".").reduce((n, a) => vn(n) ? n[a] : null, e);
}
function Mp(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Tt(e.slice(0, n)) !== Tt(t) ? null : rt(e.slice(n + 1));
}
function Zt(e) {
  return typeof e == "string" ? rt(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function vn(e) {
  return !!e && typeof e == "object";
}
function Fp(e) {
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
function Pa(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function be(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function hc(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const un = "abilityRollConfig", bc = [
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
], Oa = 20, Ma = 20, Bp = [10, 40, 65, 99];
function yc() {
  return {
    schemaVersion: 1,
    rolls: [_c(1)]
  };
}
function _c(e) {
  return {
    id: qp(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function Up() {
  return Bp.map((e) => ({ minNex: e, formula: "" }));
}
function qp() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Ac(e) {
  return Fr(
    e.getFlag(d, un)
  );
}
function jp(e) {
  return Ac(e) ?? yc();
}
async function zp(e, t) {
  const n = Fr(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, un, n), n;
}
async function Gp(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, un)
    );
    return;
  }
  await e.setFlag(d, un, null);
}
function Fr(e) {
  if (!Xe(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, Oa).map((a, r) => Xp(a, r, t)).filter((a) => a !== null)
  };
}
function Vp(e, t) {
  const n = Ac(t);
  return n ? Hp(n, Wp(e)) : [];
}
function Hp(e, t) {
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
function Wp(e) {
  const t = Xe(e.system) ? e.system : {}, n = t.NEX ?? t.nex, a = Xe(n) ? n.value : n, r = typeof a == "number" ? a : Number(a);
  return Number.isFinite(r) ? Rc(r) : 0;
}
function Tc(e) {
  return bc.find((t) => t.value === e)?.label ?? e;
}
function Kp(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function Yp(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function Xp(e, t, n) {
  if (!Xe(e)) return null;
  const a = `roll-${t + 1}`, r = ng(tg(e.id, a), n), o = Jp(e.intent), i = Qp(e.formula);
  return !o || !i ? null : {
    id: r,
    label: xn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? ag(e.damageType) : null,
    formula: i
  };
}
function Qp(e) {
  if (!Xe(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: xn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, Ma).map(Zp).filter((a) => a !== null) : [];
  t.sort((a, r) => a.minNex - r.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const a of t) n.set(a.minNex, a);
  return {
    mode: "nex",
    resolution: eg(e.resolution),
    steps: [...n.values()]
  };
}
function Zp(e) {
  if (!Xe(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: Rc(t),
    formula: xn(e.formula)
  } : null;
}
function Jp(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function eg(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function tg(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function ng(e, t) {
  let n = e, a = 2;
  for (; t.has(n); )
    n = `${e}-${a}`, a += 1;
  return t.add(n), n;
}
function Rc(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function xn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function ag(e) {
  const t = xn(e);
  return t.length > 0 ? t : null;
}
function Xe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Br = "data-paranormal-toolkit-ability-roll-id";
function rg(e) {
  if (!kc(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = pe(e.actorUuid), n = pe(e.itemUuid), a = pe(e.abilityName);
  if (!t) return null;
  const r = e.rolls.map(og).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: a || "Habilidade",
    rolls: r,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: aa(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: aa(e.resourceBefore),
    resourceAfter: aa(e.resourceAfter)
  };
}
function og(e) {
  if (!kc(e)) return null;
  const t = pe(e.id), n = pe(e.sourceRollId), a = pe(e.label), r = pe(e.formula), o = ig(e.intent);
  if (!t || !n || !a || !r || !o) return null;
  const i = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: a,
    formula: r,
    intent: o,
    damageType: o === "damage" ? sg(e.damageType) : null,
    nexThreshold: i
  };
}
function ig(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function pe(e) {
  return typeof e == "string" ? e.trim() : "";
}
function sg(e) {
  const t = pe(e);
  return t.length > 0 ? t : null;
}
function aa(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function kc(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const li = "paranormalToolkitAbilityRollBound";
let ci = !1;
function lg() {
  if (ci) return;
  ci = !0;
  const e = (t, n) => {
    cg(t, cn(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function cg(e, t) {
  if (!t) return 0;
  const n = `[${Br}]`, a = yg(t, n);
  let r = 0;
  for (const o of a)
    o.dataset[li] !== "true" && (o.dataset[li] = "true", o.addEventListener("click", () => {
      ug(e, o);
    }), r += 1);
  return r;
}
async function ug(e, t) {
  const n = t.getAttribute(Br)?.trim();
  if (!n) return;
  const a = dg(e), r = a?.rolls.find((l) => l.id === n);
  if (!a || !r) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await mg(a.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!gg(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const i = fg();
  if (!i) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  di(t, !0);
  try {
    const l = new i(
      r.formula,
      pg(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: hg(a.abilityName, r)
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
    di(t, !1);
  }
}
function dg(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : rg(
    t.getFlag(d, "abilityUse")
  );
}
async function mg(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if (mi(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, r = game.actors?.get?.(n);
  return mi(r) ? r : null;
}
function fg() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function pg(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function gg(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function hg(e, t) {
  const n = [bg(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${ra(e)}</strong>
      <span>${ra(t.label)}</span>
      <small>${ra(n.join(" · "))}</small>
    </div>
  `;
}
function bg(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Tc(e.damageType)}` : "Dano";
  }
}
function yg(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function di(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function mi(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function ra(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const _g = "paranormal-toolkit-chat-message--full-width-card", fi = ".paranormal-toolkit-ability-card", pi = "li.chat-message";
let gi = !1;
function Ag() {
  if (gi) return;
  gi = !0;
  const e = Hooks, t = (n, a) => {
    hi(cn(a));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), hi(document);
}
function hi(e) {
  if (!e) return 0;
  const t = Ur(e), n = Tg(t), a = /* @__PURE__ */ new Set();
  for (const r of n) {
    const o = Rg(t, r);
    o?.classList && a.add(o);
  }
  for (const r of a)
    r.classList?.add(_g);
  return a.size;
}
function Tg(e) {
  const t = [];
  e.matches?.(fi) && t.push(e);
  const n = e.querySelectorAll?.(fi);
  if (!n) return t;
  for (const a of Array.from(n)) {
    const r = Ur(a);
    t.includes(r) || t.push(r);
  }
  return t;
}
function Rg(e, t) {
  if (e.matches?.(pi)) return e;
  const n = t.closest?.(pi);
  return n ? Ur(n) : null;
}
function Ur(e) {
  return e && typeof e == "object" ? e : {};
}
function kg(e) {
  const t = Eg(e.cost), n = $g(e.currentResource), a = t > 0 && !e.passive, r = n >= t;
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
function Eg(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function $g(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: wg } = foundry.applications.api;
class yt extends wg {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = kg(t), this.spendResource = this.model.cost.spendResourceChecked;
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
          src="${Cg(this.model.header.image)}"
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
function Cg(e) {
  return V(e);
}
function Sg(e, t) {
  const n = Ng(t.system), a = dn(n.activation), r = Dg(a), o = Lg();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Pg(t),
    activation: a,
    activationLabel: vg(a),
    description: dn(n.description),
    chatDescription: Ig(
      n.chatDescription,
      n.description
    ),
    cost: r ? 0 : xg(n.cost),
    resource: o,
    passive: r,
    rolls: Vp(e, t)
  };
}
function Ig(e, t) {
  const n = dn(e);
  return n.trim().length > 0 ? n : dn(t);
}
function Lg() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function vg(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, a = Og()?.(t) ?? t;
  return a === t ? e : a;
}
function Dg(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function xg(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Ng(e) {
  return e && typeof e == "object" ? e : {};
}
function dn(e) {
  return typeof e == "string" ? e : "";
}
function Pg(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Og() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Mg {
  async publish(t, n, a) {
    const r = await zg(n), o = Fg({
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
    }, c = jg(t.message);
    if (Pr() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function Fg(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, a = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", r = Bg(e.rolls), o = qg(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${Fa(e.abilityImage)}" alt="">
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
function Bg(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const a = `paranormal-toolkit-ability-card__roll--${n.intent}`, r = Ug(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${a}"
          ${Br}="${Fa(n.id)}"
          title="${Fa(n.formula)}"
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
function Ug(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Tc(e.damageType)}` : "Dano";
  }
}
function qg(e) {
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
function jg(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function fe(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Fa(e) {
  return fe(e);
}
async function zg(e) {
  const t = e.chatDescription || e.description, n = Gg();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: Vg(e.actor)
  });
}
function Gg() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function Vg(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Hg {
  constructor(t, n, a = new Mg()) {
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
    if (!Wg(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const a = Sg(n, t.item), r = this.readCurrentResource(a);
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
function Wg(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const bi = 1e3;
class Kg {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Hg(t, n), this.strategy = new gc(
      (a) => this.handleItemUsed(a)
    );
  }
  register() {
    this.strategy.register(), Ag(), lg(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (Da().executionMode === "disabled" || !Xg(t.item)) return;
    const n = Qg(t);
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
    return n !== void 0 && Date.now() - n < bi;
  }
  pruneRecentExecutions() {
    const t = Date.now() - bi;
    for (const [n, a] of this.recentExecutions)
      a < t && this.recentExecutions.delete(n);
  }
}
function Yg(e, t) {
  const n = new Kg(e, t);
  return n.register(), n;
}
function Xg(e) {
  if (e.type !== "ability") return !1;
  const t = Sr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function Qg(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let yi = !1, oa = !1, ia = !1, qt = null;
const Zg = 1e3, Jg = 750, eh = 1e3;
function th(e) {
  yi || (Hooks.on("combatTurnChange", (t) => {
    ah(e, _i(t));
  }), Hooks.on("deleteCombat", (t) => {
    rh(e, _i(t));
  }), yi = !0, nh(e));
}
function nh(e) {
  Nn() && (oa || (oa = !0, globalThis.setTimeout(() => {
    oa = !1, qr(e, "ready");
  }, Zg)));
}
function ah(e, t) {
  Nn() && t && (qt && globalThis.clearTimeout(qt), qt = globalThis.setTimeout(() => {
    qt = null, qr(e, "combat-turn-change", t);
  }, Jg));
}
function rh(e, t) {
  Nn() && t && (ia || (ia = !0, globalThis.setTimeout(() => {
    ia = !1, qr(e, "combat-deleted", t);
  }, eh)));
}
async function qr(e, t, n) {
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
function _i(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Ec = {
  enabled: "dice.animations.enabled"
};
function oh() {
  game.settings.register(d, Ec.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function ih() {
  return {
    enabled: game.settings.get(d, Ec.enabled) === !0
  };
}
const Pn = "chatCard", Ai = "data-paranormal-toolkit-prompt-id", s = `${d}-item-use-prompt`, sh = `.${s}__title`, $c = `.${s}__header`, lh = `.${s}__roll-card`, ch = `.${s}__roll-meta`, uh = `.${s}__roll-meta-pill`, jr = `.${s}__resistance`, dh = `.${s}__resistance-header`, wc = `.${s}__resistance-description`, On = `.${s}__resistance-roll-button`, Cc = `.${s}__resistance-roll-result`, Ti = `${s}__resistance-content`, Sc = `.${s}__workflow-section`, Ic = `.${s}__workflow-roll`, zr = `${s}__workflow-roll--dice-open`, Gr = `.${s}__workflow-roll-formula`, Vr = `${s}__workflow-roll-formula--toggle`, Mn = `.${s}__workflow-dice-tray`, mh = `.${s}__roll-detail-toggle`, fh = `.${s}__roll-detail-list`, ph = `.${s}__ritual-element-badge`, gh = `.${s}__ritual-metadata`, hh = "casting-backlash", bh = "data-paranormal-toolkit-action-section", yh = "data-paranormal-toolkit-prompt-id", _h = "data-paranormal-toolkit-pending-id", Ri = "data-paranormal-toolkit-casting-backlash-enhanced", ki = `.${s}`, Ah = `.${s}__workflow-section--casting`, Th = `.${s}__workflow-section-header`, Rh = `.${s}__workflow-notes`, kh = `[${bh}="${hh}"]`, Ei = `${s}__workflow-section-title-row`, Eh = `${s}__workflow-section-header--casting-backlash`, Lc = `${s}__casting-backlash-button`;
function $h(e) {
  for (const t of wh(e))
    Ch(t), Dh(t);
}
function wh(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ki) && t.add(e);
  for (const n of e.querySelectorAll(ki))
    t.add(n);
  return Array.from(t);
}
function Ch(e) {
  const t = e.querySelector(kh);
  if (!t) return;
  const n = Sh(t);
  if (!n) return;
  const a = e.querySelector(`${Ah} ${Th}`);
  a && (a.classList.add(Eh), Ih(a), Lh(n), a.append(n), t.remove());
}
function Sh(e) {
  return e.querySelector(
    `button[${_h}], button[${yh}]`
  );
}
function Ih(e) {
  const t = e.querySelector(`:scope > .${Ei}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Ei);
  const a = Array.from(e.childNodes);
  e.prepend(n);
  for (const r of a)
    r !== n && (r instanceof HTMLButtonElement && r.classList.contains(Lc) || n.append(r));
  return n;
}
function Lh(e) {
  if (e.getAttribute(Ri) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = vh(t, e.disabled);
  e.classList.add(Lc), e.setAttribute(Ri, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function vh(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Dh(e) {
  for (const t of e.querySelectorAll(Rh)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function xh(e) {
  for (const t of Array.from(e.querySelectorAll(Sc)))
    for (const n of Array.from(t.querySelectorAll(`${mh}, ${fh}`)))
      n.remove();
}
const Nh = {
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
}, Ph = new Set(
  Object.values(Nh)
), Oh = {
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
function Mh(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Fh(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Oh[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Ph.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function vc(e) {
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
function Fh(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Dc {
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
      const p = Bh(m, u);
      if (!p.ok)
        return g({
          actor: n,
          actorId: r,
          actorName: a,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = Mh(m.damageType);
      if (!_.ok)
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
          Uh(p.id, m, _.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          o.call(n, p.amount, {
            damageType: _.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const k of jh($.conditions))
          l.add(k);
        const T = qh($.newPV);
        T !== null && (c = T), i.push({
          id: p.id,
          label: m.label ?? vc(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: p.amount,
          finalDamage: $i($.finalDamage, p.amount),
          blocked: $i($.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: _.value,
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
function Bh(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Uh(e, t, n) {
  return {
    id: e,
    label: t.label ?? vc(n),
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
function $i(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function qh(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function jh(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Fn {
  async rollResistance(t) {
    const n = await Gh(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? De(t.skill),
      roll: n,
      formula: Hh(n),
      total: Wh(n),
      diceBreakdown: Kh(n)
    };
  }
  getSkillLabel(t) {
    return De(t);
  }
}
async function zh(e, t) {
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
async function Gh(e, t) {
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
  return Vh(a);
}
function Vh(e) {
  return wi(e) ? e : Array.isArray(e) ? e.find(wi) ?? null : null;
}
function wi(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Hh(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Wh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Kh(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Yh);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const i = o.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function Yh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class xc {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class Hr {
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
function Xh(e, t) {
  const n = ab(e?.rounds);
  if (!n)
    return Ci(null);
  const a = e?.anchor ?? Nc(t);
  if (!a)
    return {
      ...Ci(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Qh(),
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
function Nc(e) {
  const t = rb();
  if (!t?.id || !Pc(t.round)) return null;
  const n = tb(t), a = Zh(e, n) ?? eb(t), r = me(a?.id), o = ib(a?.initiative), i = Jh(t, a, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: r,
    round: t.round,
    turn: i,
    initiative: o,
    time: ob()
  };
}
function Qh() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Ci(e) {
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
function Zh(e, t) {
  return e?.id ? t.find((n) => nb(n) === e.id) ?? null : null;
}
function Jh(e, t, n) {
  const a = me(t?.id);
  if (a) {
    const r = n.findIndex((o) => o.id === a);
    if (r >= 0) return r;
  }
  return sb(e.turn) ? e.turn : null;
}
function eb(e) {
  return Jt(e.combatant) ? e.combatant : null;
}
function tb(e) {
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
function nb(e) {
  return me(e.actor?.id) ?? me(e.actorId) ?? me(e.token?.actor?.id) ?? me(e.token?.actorId) ?? me(e.document?.actor?.id) ?? me(e.document?.actorId);
}
function ab(e) {
  return Pc(e) ? Math.trunc(e) : null;
}
function rb() {
  return game.combat ?? null;
}
function ob() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Jt(e) {
  return !!(e && typeof e == "object");
}
function me(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ib(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Pc(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function sb(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Oc {
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
    if (!bb(a))
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const r = n.value, o = Xh(t.duration, a), i = lb(r, t, o), c = t.refreshExisting ?? !0 ? yb(a, r.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(i)), y(Si(a, r, c.id ?? null, !1, !0, o));
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
      return y(Si(a, r, m, !0, !1, o));
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
    const a = this.resolveCanonicalConditionId(t.conditionId), r = Fc(n, a);
    let o = 0;
    try {
      for (const i of r)
        await Ii(n, i) === "deleted" && (o += 1);
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
    const n = Tb(), a = [];
    let r = 0, o = 0;
    for (const i of n) {
      const l = Wr(i);
      r += l.length;
      for (const c of l) {
        if (!db(c, t)) continue;
        const u = Mc(c);
        try {
          await Ii(i, c) === "deleted" && (o += 1);
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
function lb(e, t, n) {
  const a = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: vb(),
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
    duration: cb(n.duration),
    start: ub(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: a
    }
  };
}
function cb(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function ub(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Lb(),
    ...e
  };
}
function Si(e, t, n, a, r, o) {
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
function db(e, t) {
  const n = Mc(e);
  if (!n.conditionId || !mb(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const a = Ib();
  return n.durationMode === "combatantTurn" || fb(n) ? gb(n, a) : pb(e) || !a?.id || n.combatId && n.combatId !== a.id ? !0 : !Z(n.startRound) || !Z(n.requestedRounds) || !Z(a.round) ? !1 : a.round >= n.startRound + n.requestedRounds;
}
function mb(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && Z(e.requestedRounds);
}
function fb(e) {
  return !!(e.combatDurationApplied && Z(e.requestedRounds) && Z(e.startRound) && (e.startCombatantId || mn(e.startTurn)));
}
function pb(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function gb(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !Z(e.startRound) || !Z(e.requestedRounds) || !Z(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const a = hb(t);
  return e.startCombatantId ? a === e.startCombatantId : mn(e.startTurn) && mn(t.turn) ? t.turn === e.startTurn : !1;
}
function hb(e) {
  return Ge(e.combatant?.id);
}
function Mc(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: en(e, "conditionId"),
    requestedRounds: Li(e, "requestedRounds") ?? pt(t.value) ?? pt(t.rounds),
    combatDurationApplied: sa(e, "combatDurationApplied"),
    combatId: en(e, "combatId") ?? Ge(n.combat) ?? Ge(t.combat),
    startCombatantId: en(e, "startCombatantId") ?? Ge(n.combatant),
    startInitiative: $b(e, "startInitiative") ?? Bc(n.initiative),
    startRound: Li(e, "startRound") ?? pt(n.round) ?? pt(t.startRound),
    startTurn: Eb(e, "startTurn") ?? Ba(n.turn) ?? Ba(t.startTurn),
    expiryEvent: wb(e, "expiryEvent") ?? Uc(t.expiry),
    durationMode: Cb(e, "durationMode"),
    deleteOnExpire: sa(e, "deleteOnExpire"),
    expiresWithCombat: sa(e, "expiresWithCombat")
  };
}
function bb(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function yb(e, t) {
  return Fc(e, t)[0] ?? null;
}
function Fc(e, t) {
  return Wr(e).filter((n) => kb(n) === t);
}
async function Ii(e, t) {
  const n = t.id ?? null, a = n ? _b(e, n) : t;
  if (!a) return "missing";
  try {
    return await Promise.resolve(a.delete?.()), "deleted";
  } catch (r) {
    if (Ab(r)) return "missing";
    throw r;
  }
}
function _b(e, t) {
  return Wr(e).find((n) => n.id === t) ?? null;
}
function Ab(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Tb() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      jt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    jt(e, n);
  });
  for (const n of Rb())
    jt(e, n.actor), jt(e, n.document?.actor);
  return Array.from(e.values());
}
function jt(e, t) {
  if (!Sb(t)) return;
  const a = Ge(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(a, t);
}
function Rb() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Wr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function kb(e) {
  return en(e, "conditionId");
}
function en(e, t) {
  return Ge(Ne(e, t));
}
function Li(e, t) {
  return pt(Ne(e, t));
}
function Eb(e, t) {
  return Ba(Ne(e, t));
}
function $b(e, t) {
  return Bc(Ne(e, t));
}
function wb(e, t) {
  return Uc(Ne(e, t));
}
function Cb(e, t) {
  const n = Ne(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function sa(e, t) {
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
function Ba(e) {
  return mn(e) ? Math.trunc(e) : null;
}
function Bc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Uc(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Sb(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Ib() {
  return game.combat ?? null;
}
function Lb() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Z(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function mn(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function vb() {
  return game.user?.id ?? null;
}
const Db = "icons/svg/downgrade.svg", xb = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function A(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Db,
    description: xb,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Nb = A({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Pb = A({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Ob = A({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Mb = A({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Fb = A({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Bb = A({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Ub = A({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), qb = A({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), jb = A({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), zb = A({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Gb = A({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Vb = A({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Hb = A({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Wb = A({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Kb = A({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Yb = A({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Xb = A({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Qb = A({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Zb = A({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Jb = A({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), ey = A({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), ty = A({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), ny = A({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), ay = A({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), ry = A({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), oy = A({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), iy = A({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), sy = A({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), ly = A({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), cy = A({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), uy = A({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), dy = A({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), my = A({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), fy = A({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Kr = [
  Nb,
  Pb,
  Ob,
  Mb,
  Fb,
  Bb,
  Ub,
  qb,
  jb,
  zb,
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
  fy
];
class py {
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
    return Array.from(this.definitions.values()).map(vi);
  }
  get(t) {
    const n = this.lookup.get(Di(t)), a = n ? this.definitions.get(n) : null;
    return a ? y(vi(a)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const a = Di(t);
    a && this.lookup.set(a, n);
  }
}
function qc() {
  return new py(Kr);
}
function vi(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Di(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Qe(e) {
  return e.applyOnResistance ?? "failure";
}
function jc(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function zc(e, t) {
  const n = Qe(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Gc(e) {
  const t = Qe(e);
  return t === "failure" || t === "success";
}
function gy(e, t, n, a) {
  const r = e.filter((c) => zc(c, t));
  if (r.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? r.filter((c) => Qe(c) === t) : [], i = o.length > 0 ? o : r;
  if (i.length === 1) return i[0] ?? null;
  const l = a(n);
  return l ? i.find((c) => [c.label, c.conditionId].some((u) => a(u) === l)) ?? i[0] ?? null : i[0] ?? null;
}
const hy = {
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
}, by = {
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
function yy(e) {
  return Hc(e, hy, !1);
}
function _y(e) {
  return Hc(e, by, !e.allowsSuccessfulResistance);
}
function ot(e) {
  return e.kind === "waiting-resistance";
}
function Vc(e) {
  return e.kind === "resisted";
}
function Hc(e, t, n) {
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
const gt = "data-paranormal-toolkit-prompt-id", Ay = "data-paranormal-toolkit-resistance-roll-result", Ty = "Conjuração DT";
function Ry(e) {
  const t = e.querySelector(On)?.getAttribute(Ay), n = Rt(t);
  if (n !== null) return n;
  const a = e.querySelector(Cc)?.textContent ?? null, r = a ? /=\s*(-?\d+)\s*$/u.exec(a) : null;
  return Rt(r?.[1] ?? null);
}
function Yr(e) {
  const t = Wc(e), n = wy(t);
  if (n !== null) return n;
  const a = $y(t);
  return a !== null ? a : Cy(e);
}
function ky(e) {
  const t = Wc(e);
  return t ? {
    actorId: la(t.actorId),
    itemId: la(t.itemId),
    itemName: la(t.itemName)
  } : null;
}
function Ey(e) {
  const t = e.getAttribute(gt);
  if (!t) return null;
  const n = Kc(e), a = Yc(n), i = (Array.isArray(a?.prompts) ? a.prompts : []).find((l) => Bn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof i == "string" && i.trim().length > 0 ? i.trim() : null;
}
function ye(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Ua(e) {
  return ye(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function $y(e) {
  const t = Iy(e);
  return t.length === 0 ? null : Rt(Ly(t, Ty));
}
function wy(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const a = game.actors?.get?.(t);
  return !a || typeof a != "object" ? null : xi(a, ["system", "ritual", "DT"]) ?? xi(a, ["system", "ritual", "dt"]);
}
function Cy(e) {
  const t = Array.from(e.querySelectorAll(`.${s}__workflow-section--casting .${s}__workflow-section-description`)).map((a) => a.textContent).find((a) => typeof a == "string" && a.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Rt(n?.[1] ?? null);
}
function Wc(e) {
  const t = Sy(e);
  if (!t) return null;
  const n = Kc(e), a = Yc(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => Bn(o) ? o.pendingId === t : !1) ?? null;
}
function Sy(e) {
  return (e.closest(`[${gt}]`) ?? e.querySelector(`[${gt}]`) ?? e.parentElement?.querySelector(`[${gt}]`) ?? null)?.getAttribute(gt) ?? null;
}
function Kc(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return vy(r) ? r : null;
}
function Yc(e) {
  const t = e?.getFlag?.(d, Pn);
  return Bn(t) ? t : null;
}
function Iy(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Ly(e, t) {
  const n = `${t}:`;
  for (const a of e) {
    if (!a.startsWith(n)) continue;
    const r = a.slice(n.length).trim();
    if (r.length > 0) return r;
  }
  return null;
}
function xi(e, t) {
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
function vy(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Bn(e) {
  return !!(e && typeof e == "object");
}
function la(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Un(e) {
  return Xc({
    hasResistance: !!e.querySelector(jr),
    difficulty: Yr(e),
    resistanceTotal: Ry(e)
  });
}
function Dy(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Xc({
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
function Xc(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Ef(e)
  };
}
function Te() {
  return game.user?.isGM === !0;
}
function he() {
  return Te();
}
function xy(e) {
  const t = Ln(e.resistanceGateMode, e.resistanceState), n = Ny(e.resistanceState, e.hasDamage), a = Py(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), r = yy({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = _y({
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
function Ny(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Py(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Xr(e) {
  const t = e.isGM ?? he();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: xy({
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
function Oy(e) {
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${s}__workflow-roll-formula`), n.textContent = e.formula;
  const a = document.createElement("strong");
  a.classList.add(`${s}__workflow-roll-total`), a.textContent = e.total === null ? "—" : String(e.total), t.append(n, a);
  const r = Fy(e.formula, e.diceBreakdown ?? null);
  return r && t.append(r), t;
}
function My(e) {
  const t = Array.from(e?.querySelectorAll(`.${s}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Fy(e, t) {
  const n = By(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${s}__workflow-dice-tray`);
  for (const r of Uy(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${s}__workflow-die`), r.active || o.classList.add(`${s}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function By(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function Uy(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ni(e, "highest") : n.includes("kl") ? Ni(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Ni(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
const qy = "data-paranormal-toolkit-resistance-skill", jy = "data-paranormal-toolkit-resistance-skill-label", zy = "data-paranormal-toolkit-roll-card-target-names", Gy = "data-paranormal-toolkit-roll-card-resistance", Vy = "data-paranormal-toolkit-roll-card-resistance-skill", Hy = "data-paranormal-toolkit-roll-card-resistance-skill-label", Qc = "pending", Qr = "success", Zr = "failure", Zc = "rolled";
function Wy(e) {
  const t = Zy(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Xy(e.damageSection) : null, a = Pi(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), r = Ky(e.rollCard).map((o, i) => {
    const l = Yy(o, i), c = e.resistanceResults.get(l) ?? null, u = r_(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, p = e.effectApplications.get(l) ?? null, _ = Dy({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: c_(u)
    }).state, $ = Pi(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      jc(_)
    ) ?? a;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: p,
      effect: $,
      assistedActions: Xr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: _,
        damage: n,
        effect: $,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!p,
        effectCanApplyOnSuccessfulResistance: $?.applyOnResistance === "success" || $?.applyOnResistance === "always",
        effectRequiresResolvedResistance: $ ? Gc($) : !1
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
function Ky(e) {
  const t = e.getAttribute(zy), n = t ? l_(t) : [];
  if (n.length > 0) return n;
  const r = e.closest(`.${s}`)?.querySelector(`.${s}__summary`)?.textContent ?? "", [, o] = r.split("→");
  return o ? o.split(",").map((i) => i.trim()).filter((i) => i.length > 0 && Jc(i) !== "nenhum alvo") : [];
}
function Yy(e, t) {
  return `${Jc(e)}:${t}`;
}
function Xy(e) {
  const t = o_(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: s_(e),
    formula: i_(e) ?? "—",
    total: t,
    diceBreakdown: My(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Pi(e, t, n, a) {
  const r = t?.querySelector(`.${s}__effect-section-label`)?.textContent?.trim(), o = n(e, r ?? null, a);
  return o ? {
    label: r && r.length > 0 ? r : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Qy(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Qe(o)
  } : null;
}
function Qy(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Zy(e, t) {
  const n = e_(t), a = Jy(e), r = a.description ?? t_(n)?.textContent?.trim(), o = n_(n), i = a.skill ?? o?.getAttribute(qy) ?? null, l = a.skillLabel ?? o?.getAttribute(jy) ?? (i ? De(i) : null);
  return !r && !i ? null : {
    description: r ?? "Resistência do alvo.",
    formula: a_(n)?.textContent?.trim() ?? null,
    skill: i,
    skillLabel: l,
    difficulty: Yr(e)
  };
}
function Jy(e) {
  return {
    description: ca(e, Gy),
    skill: ca(e, Vy),
    skillLabel: ca(e, Hy)
  };
}
function e_(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function t_(e) {
  return Jr(e, `.${s}__resistance-description`);
}
function n_(e) {
  return Jr(e, On);
}
function a_(e) {
  return Jr(
    e,
    `.${s}__resistance .${s}__workflow-roll-formula`
  );
}
function Jr(e, t) {
  for (const n of e) {
    const a = n.querySelector(t);
    if (a) return a;
  }
  return null;
}
function r_(e, t) {
  return e ? t === null ? Zc : e.total >= t ? Qr : Zr : Qc;
}
function o_(e) {
  const t = e?.querySelector(`.${s}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function i_(e) {
  const t = e?.querySelector(`.${s}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function s_(e) {
  const t = e?.querySelector(`.${s}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function l_(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function ca(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function Jc(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function c_(e) {
  return e === Qr ? "succeeded" : e === Zr ? "failed" : "pending";
}
function eu(e) {
  if (!e) return null;
  const t = e.actorId ? m_(e.actorId) : null, n = t ? u_(t, e.itemId, e.itemName) : null;
  return n || d_(e.itemId, e.itemName);
}
function u_(e, t, n) {
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
function d_(e, t) {
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
function m_(e) {
  const n = game.actors?.get?.(e);
  return f_(n) ? n : null;
}
function f_(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ve(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function fn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function eo(e) {
  const t = ua(e);
  if (!t) return null;
  const n = p_().filter((o) => ua(g_(o)) === t).map((o) => tu(o)).find(_t) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => _t(o) && ua(o.name) === t);
  return _t(r) ? r : null;
}
function p_() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function g_(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : tu(e)?.name ?? null;
}
function tu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (_t(t)) return t;
  const n = e.document?.actor;
  return _t(n) ? n : null;
}
function _t(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ua(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function qa(e) {
  const t = __();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: h_(e)
  });
}
function h_(e) {
  const t = e.instances.map((i) => {
    const l = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${tn(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", a = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", r = b_(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${tn(e.conditions.join(", "))}</li>` : "";
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
function b_(e) {
  const t = y_(e.actor), n = e.newPV ?? t?.value ?? null, a = t?.max ?? null;
  if (n === null) return "";
  const r = a === null ? `${n}` : `${n}/${a}`;
  return `<li><strong>PV atual</strong>: ${tn(r)}</li>`;
}
function y_(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, a = Oi(n?.value);
  return a === null ? null : {
    value: a,
    max: Oi(n?.max)
  };
}
function Oi(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function __() {
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
async function A_(e) {
  await qa(T_(e));
}
function T_(e) {
  if (R_(e)) return e;
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
function R_(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function nu(e) {
  return e.mode, `✓ ${au(e.inputAmount)} PV`;
}
function k_(e) {
  const t = au(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function au(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class E_ {
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
class $_ {
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
class ru {
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
const w_ = `.${s}__actions`, to = `.${s}__actions-title`, Ze = `.${s}__button`, C_ = "data-paranormal-toolkit-action-section", S_ = `${s}__button--executed`, I_ = "data-paranormal-toolkit-executed-label";
function ou(e) {
  return ye(e.querySelector(to)?.textContent);
}
function L_(e, t) {
  const n = e.querySelector(to);
  n && (n.textContent = t);
}
function Dt(e, t) {
  const n = ye(t);
  return Array.from(e.querySelectorAll(`.${s}__workflow-section`)).find((a) => {
    const r = a.querySelector(`.${s}__workflow-section-header strong`)?.textContent;
    return ye(r) === n;
  }) ?? null;
}
function no(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${s}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Pe(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__button-label`), t.textContent = e, t;
}
function iu(e) {
  const t = v_(e.difficulty);
  if (t === null) return null;
  const n = Mi(e.skillLabel) ?? "Resistência", a = Mi(e.description), r = D_(a, n), o = x_(r, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function v_(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Mi(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function D_(e, t) {
  if (!e) return null;
  const n = Fi(e), a = Fi(t);
  if (!n.startsWith(a)) return e;
  const r = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return r.length > 0 ? r : null;
}
function x_(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const a = Number(n[1]);
  if (!Number.isFinite(a) || a !== t) return e;
  const r = e.slice(n[0].length).trim();
  return r.length > 0 ? r : null;
}
function Fi(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const zt = "data-paranormal-toolkit-prompt-id", su = "multiTargetResistanceResults", lu = "multiTargetDamageApplications", cu = "multiTargetEffectApplications";
function N_(e) {
  const t = /* @__PURE__ */ new Map(), a = qn(e)?.[su];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    q_(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function P_(e, t) {
  await ao(e, su, t.targetId, t);
}
function O_(e) {
  const t = /* @__PURE__ */ new Map(), a = qn(e)?.[lu];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    j_(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function M_(e, t) {
  await ao(
    e,
    lu,
    t.targetId,
    t
  );
}
function F_(e) {
  const t = /* @__PURE__ */ new Map(), a = qn(e)?.[cu];
  if (!J(a)) return t;
  for (const [r, o] of Object.entries(a))
    G_(o) && o.targetId === r && t.set(r, o);
  return t;
}
async function B_(e, t) {
  await ao(
    e,
    cu,
    t.targetId,
    t
  );
}
function U_(e) {
  const t = qn(e);
  return t ? {
    actorId: da(t.actorId),
    itemId: da(t.itemId),
    itemName: da(t.itemName)
  } : null;
}
async function ao(e, t, n, a) {
  const r = uu(e);
  if (!r) return;
  const o = du(e), i = mu(o);
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
  const t = uu(e);
  if (!t) return null;
  const n = du(e), a = mu(n);
  return (Array.isArray(a?.prompts) ? a.prompts : []).find((o) => J(o) ? o.pendingId === t : !1) ?? null;
}
function uu(e) {
  return (e.closest(`[${zt}]`) ?? e.querySelector(`[${zt}]`) ?? e.parentElement?.querySelector(`[${zt}]`) ?? null)?.getAttribute(zt) ?? null;
}
function du(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages?.get?.(n);
  return V_(r) ? r : null;
}
function mu(e) {
  const t = e?.getFlag?.(d, Pn);
  return J(t) ? t : null;
}
function q_(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function j_(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && z_(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function z_(e) {
  return e === "normal" || e === "half";
}
function G_(e) {
  return J(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function da(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function V_(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function J(e) {
  return !!(e && typeof e == "object");
}
const H_ = "data-paranormal-toolkit-resistance-skill", W_ = "data-paranormal-toolkit-resistance-skill-label", ja = "data-paranormal-toolkit-multi-target-section", ro = "data-paranormal-toolkit-multi-target-damage-info", fu = "data-paranormal-toolkit-multi-target-effect-info", pu = "data-paranormal-toolkit-multi-target-toggle", gu = "data-paranormal-toolkit-multi-target-details", Y = "data-paranormal-toolkit-multi-target-target", K_ = "data-paranormal-toolkit-multi-target-state", za = "data-paranormal-toolkit-multi-target-roll-total", Ga = "data-paranormal-toolkit-multi-target-roll-formula", nn = "data-paranormal-toolkit-multi-target-roll-dice", Va = "data-paranormal-toolkit-multi-target-roll-skill", Ha = "data-paranormal-toolkit-multi-target-roll-skill-label", Wa = "data-paranormal-toolkit-multi-target-roll-target-name", Ka = "data-paranormal-toolkit-multi-target-roll-rolled-at", Ya = "data-paranormal-toolkit-multi-target-damage-mode", Xa = "data-paranormal-toolkit-multi-target-damage-input-amount", Bi = "data-paranormal-toolkit-multi-target-damage-final-amount", Ui = "data-paranormal-toolkit-multi-target-damage-blocked", Qa = "data-paranormal-toolkit-multi-target-damage-target-name", Za = "data-paranormal-toolkit-multi-target-damage-applied-at", Ja = "data-paranormal-toolkit-multi-target-effect-condition-id", er = "data-paranormal-toolkit-multi-target-effect-condition-label", tr = "data-paranormal-toolkit-multi-target-effect-effect-id", nr = "data-paranormal-toolkit-multi-target-effect-created", ar = "data-paranormal-toolkit-multi-target-effect-refreshed", rr = "data-paranormal-toolkit-multi-target-effect-target-name", or = "data-paranormal-toolkit-multi-target-effect-applied-at", Y_ = new Oc(qc()), X_ = new xc(new Dc()), Q_ = new Hr(new Fn()), Z_ = new ru(Q_), J_ = new E_(X_), eA = new $_(Y_), tA = Qc, it = Qr, xt = Zr, nA = Zc;
function aA(e) {
  const t = hu(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${s}__roll-card--multi-target`), mA(e);
  const n = fA(e.rollCard, t), a = pA(e.rollCard, t);
  !n && a && XA(e.rollCard, a, e.effectSection);
  const r = AA(e.rollCard);
  return _u(r, t), WA(
    e.rollCard,
    r,
    gA(e.rollCard, {
      damageInfo: n,
      effectInfo: a,
      effectSection: e.effectSection
    })
  ), n && a && QA(e.rollCard, a, r), !0;
}
function hu(e) {
  return Wy({
    ...e,
    resistanceResults: iA(e.rollCard),
    damageApplications: sA(e.rollCard),
    effectApplications: lA(e.rollCard),
    resolveTargetConditionApplication: rA,
    resistanceGateMode: io()
  });
}
function rA(e, t, n) {
  const a = U_(e), r = eu(a);
  if (!r) return null;
  const o = St(r);
  if (!o.ok) return null;
  const i = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (i.length === 0) return null;
  const l = oA(i, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function oA(e, t, n) {
  const a = gy(
    e,
    n,
    t,
    ma
  );
  if (a) return a;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const r = ma(t);
  return r ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((i) => ma(i) === r)) ?? null : null;
}
function iA(e) {
  const t = N_(e);
  for (const [n, a] of dA(e))
    t.set(n, a);
  return t;
}
function sA(e) {
  const t = O_(e);
  for (const [n, a] of uA(e))
    t.set(n, a);
  return t;
}
function lA(e) {
  const t = F_(e);
  for (const [n, a] of cA(e))
    t.set(n, a);
  return t;
}
function cA(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${Y}]`)) {
    const a = n.getAttribute(Y), r = n.getAttribute(Ja), o = n.getAttribute(er), i = n.getAttribute(tr), l = zi(n.getAttribute(nr)), c = zi(n.getAttribute(ar)), u = n.getAttribute(rr), m = n.getAttribute(or);
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
function uA(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${Y}]`)) {
    const a = n.getAttribute(Y), r = n.getAttribute(Ya), o = Iu(n.getAttribute(Xa)), i = n.getAttribute(Qa), l = n.getAttribute(Za);
    !a || !eT(r) || o === null || !i || !l || t.set(a, {
      targetId: a,
      targetName: i,
      mode: r,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function dA(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${Y}]`)) {
    const a = n.getAttribute(Y), r = Iu(n.getAttribute(za)), o = n.getAttribute(Ga), i = n.getAttribute(Va), l = n.getAttribute(Ha), c = n.getAttribute(Wa), u = n.getAttribute(Ka);
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
function mA(e) {
  e.damageSection?.classList.add(`${s}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${s}__workflow-section--multi-target-effect-source`);
}
function fA(e, t) {
  if (!t.damage)
    return bu(e)?.remove(), null;
  const n = hA(e);
  return bA(n, t.damage), _A(e, n), n;
}
function pA(e, t) {
  if (!t.effect)
    return Su(e)?.remove(), null;
  const n = KA(e);
  return YA(n, t.effect), n;
}
function gA(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : Dt(e, "Conjuração");
}
function hA(e) {
  const t = bu(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect`,
    `${s}__workflow-section--damage-info`
  ), n.setAttribute(ro, "true"), n;
}
function bu(e) {
  return e.querySelector(`[${ro}="true"]`);
}
function bA(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${s}__workflow-section-header`);
  const a = document.createElement("strong");
  if (a.textContent = "Dano", n.append(a), e.append(n), t.typeLabel) {
    const r = document.createElement("span");
    r.classList.add(`${s}__workflow-section-description`), r.textContent = t.typeLabel, e.append(r);
  }
  e.append(yu(t.formula, t.total, t.diceBreakdown));
}
function yu(e, t, n, a = !1) {
  const r = Oy({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${s}__workflow-roll--compact-info`]
  });
  return yA(r, a), r;
}
function yA(e, t) {
  const n = e.querySelector(Mn), a = e.querySelector(Gr);
  if (!n || !a) return;
  e.classList.toggle(zr, t), n.hidden = !t, a.classList.add(Vr), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-expanded", t ? "true" : "false"), a.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", a.setAttribute("aria-label", a.title);
  const r = a.querySelector("i") ?? document.createElement("i");
  r.classList.add("fa-solid"), r.classList.toggle("fa-chevron-down", !t), r.classList.toggle("fa-chevron-up", t), r.setAttribute("aria-hidden", "true"), r.parentElement || a.append(r);
}
function _A(e, t) {
  const n = Dt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function AA(e) {
  const t = e.querySelector(`[${ja}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--targets`
  ), n.setAttribute(ja, "true"), n;
}
function _u(e, t) {
  const n = TA(e), a = kA(t.resistance), r = [RA(t)];
  a && r.push(a), r.push(wA(t, n)), e.replaceChildren(...r);
}
function TA(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${Y}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(Y)).filter(JA)
  );
}
function RA(e) {
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-section-header`, `${s}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const a = document.createElement("span");
  return a.classList.add(`${s}__targets-status`), a.textContent = $A(e.targets), t.append(n, a), t;
}
function kA(e) {
  const t = iu({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${s}__targets-resistance-info`), EA(n, t), n;
}
function EA(e, t) {
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
function $A(e) {
  const t = e.length, n = e.filter((l) => l.state === xt).length, a = e.filter((l) => l.state === it).length, r = e.filter((l) => l.state === tA).length, o = e.filter((l) => l.state === nA).length, i = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && i.push(`${n} ${n === 1 ? "falha" : "falhas"}`), a > 0 && i.push(`${a} ${a === 1 ? "sucesso" : "sucessos"}`), r > 0 && i.push(`${r} ${r === 1 ? "pendente" : "pendentes"}`), o > 0 && i.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), i.join(" • ");
}
function wA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${s}__targets-list`);
  for (const a of e.targets)
    n.append(CA(a, e, t.has(a.id)));
  return n;
}
function CA(e, t, n) {
  const a = document.createElement("article");
  a.classList.add(`${s}__target-row`, `${s}__target-row--${e.state}`), e.damageApplication && a.classList.add(`${s}__target-row--damage-applied`), e.effectApplication && a.classList.add(`${s}__target-row--effect-applied`), a.setAttribute(Y, e.id), a.setAttribute(K_, e.state), a.setAttribute("aria-expanded", n ? "true" : "false"), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Au(a, e.resistanceResult), Tu(a, e.damageApplication), Ru(a, e.effectApplication);
  const r = SA(e, t, a), o = zA(e, t);
  return o.hidden = !n, a.addEventListener("click", (i) => {
    ji(i.target) || qi(a);
  }), a.addEventListener("keydown", (i) => {
    i.key !== "Enter" && i.key !== " " || ji(i.target) || (i.preventDefault(), qi(a));
  }), a.append(r, o), a;
}
function Au(e, t) {
  if (!t) {
    e.removeAttribute(za), e.removeAttribute(Ga), e.removeAttribute(nn), e.removeAttribute(Va), e.removeAttribute(Ha), e.removeAttribute(Wa), e.removeAttribute(Ka);
    return;
  }
  e.setAttribute(za, String(t.total)), e.setAttribute(Ga, t.formula), e.setAttribute(Va, t.skill), e.setAttribute(Ha, t.skillLabel), e.setAttribute(Wa, t.targetName), e.setAttribute(Ka, t.rolledAt), t.diceBreakdown ? e.setAttribute(nn, t.diceBreakdown) : e.removeAttribute(nn);
}
function Tu(e, t) {
  if (!t) {
    e.removeAttribute(Ya), e.removeAttribute(Xa), e.removeAttribute(Bi), e.removeAttribute(Ui), e.removeAttribute(Qa), e.removeAttribute(Za);
    return;
  }
  e.setAttribute(Ya, t.mode), e.setAttribute(Xa, String(t.inputAmount)), e.removeAttribute(Bi), e.removeAttribute(Ui), e.setAttribute(Qa, t.targetName), e.setAttribute(Za, t.appliedAt);
}
function Ru(e, t) {
  if (!t) {
    e.removeAttribute(Ja), e.removeAttribute(er), e.removeAttribute(tr), e.removeAttribute(nr), e.removeAttribute(ar), e.removeAttribute(rr), e.removeAttribute(or);
    return;
  }
  e.setAttribute(Ja, t.conditionId), e.setAttribute(er, t.conditionLabel), e.setAttribute(tr, t.effectId ?? ""), e.setAttribute(nr, String(t.created)), e.setAttribute(ar, String(t.refreshed)), e.setAttribute(rr, t.targetName), e.setAttribute(or, t.appliedAt);
}
function SA(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${s}__target-summary`);
  const r = document.createElement("div");
  r.classList.add(`${s}__target-summary-main`);
  const o = IA(e), i = document.createElement("strong");
  i.classList.add(`${s}__target-name`), i.textContent = e.name;
  const l = LA(e, t.resistance);
  NA(l, n, e, t);
  const c = jA(n);
  r.append(o, i, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${s}__target-summary-actions`), wu(u, [
    ku(e, t, "compact"),
    $u(e, t, "compact")
  ]), a.append(r, u), a;
}
function IA(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function LA(e, t) {
  if (!Te())
    return vA(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${s}__target-resistance-button`, `${s}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", xA(e, t)), t?.skill && (n.setAttribute(H_, t.skill), n.setAttribute(W_, t.skillLabel ?? De(t.skill))), !t?.skill)
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
function vA(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${s}__target-resistance-button`, `${s}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", DA(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const a = document.createElement("span");
  a.classList.add(`${s}__target-resistance-total`), a.textContent = String(e.resistanceResult.total);
  const r = document.createElement("span");
  return r.classList.add(`${s}__target-resistance-mark`), r.setAttribute("aria-hidden", "true"), r.textContent = e.state === it ? "✓" : e.state === xt ? "✕" : "", n.append(a, r), n;
}
function DA(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const a = e.state === it ? "sucesso" : e.state === xt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}.`;
}
function xA(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const a = e.state === it ? "sucesso" : e.state === xt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${a}. Rolar novamente`;
}
function NA(e, t, n, a) {
  !(e instanceof HTMLButtonElement) || !Te() || e.addEventListener("click", (r) => {
    r.stopPropagation(), PA(t, e, n, a);
  });
}
async function PA(e, t, n, a) {
  if (!Te()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const r = a.resistance, o = r?.skill, i = r?.skillLabel ?? (o ? De(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = eo(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${s}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Z_.execute({ actor: l, skill: o, skillLabel: i });
    await ZA(u.roll);
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
    Au(e, m);
    try {
      await P_(a.rollCard, m);
    } catch (p) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", p);
    }
    oo(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${i} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${s}__target-resistance-button--rolling`);
  }
}
function oo(e) {
  const t = e.closest(`[${ja}="true"]`), n = e.closest(`.${s}__roll-card`);
  if (!t || !n) return;
  const a = hu({
    rollCard: n,
    damageSection: OA(n) ?? Dt(n, "Dano"),
    effectSection: MA(n)
  });
  a && _u(t, a);
}
function OA(e) {
  return Array.from(e.querySelectorAll(`.${s}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(ro) !== "true") ?? null;
}
function MA(e) {
  return e.querySelector(`.${s}__workflow-section--multi-target-effect-source`);
}
function FA(e) {
  return ot(e.assistedActions.policy.damageActionState);
}
function BA(e) {
  return ot(e.assistedActions.policy.effectActionState);
}
function io() {
  try {
    return Or();
  } catch {
    return "strict";
  }
}
function ku(e, t, n) {
  if (e.damageApplication)
    return ge(
      "✓",
      nu({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
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
  const o = Eu(r, t.damage);
  if (o === null)
    return ge(
      "⚡",
      "Dano indisponível",
      [`${s}__target-action--damage`, `${s}__target-action--disabled`],
      !0
    );
  const i = k_({ inputAmount: o, mode: r, compact: n === "compact" }), l = r === "half" ? "🛡️" : "⚡", c = r === "half" ? `${s}__target-action--half-damage` : `${s}__target-action--normal-damage`, u = ge(
    l,
    i,
    [`${s}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${i} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const p = u.closest(`[${Y}]`);
    p && UA(p, u, e, t);
  }), u;
}
function Eu(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function UA(e, t, n, a) {
  if (n.damageApplication) return;
  if (FA(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const r = a.damage;
  if (!r) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", i = Eu(o, r);
  if (i === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = eo(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${s}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await J_.execute({
      actor: l,
      amount: i,
      damageType: r.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: io(),
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
    Tu(e, m);
    try {
      await M_(a.rollCard, m);
    } catch (p) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", p);
    }
    try {
      await A_(u.value);
    } catch (p) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", p);
    }
    oo(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${s}__target-action--applying`);
  }
}
function $u(e, t, n) {
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
  if (Vc(a))
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
    const l = o.closest(`[${Y}]`);
    l && qA(l, o, e, t);
  }), o;
}
async function qA(e, t, n, a) {
  if (n.effectApplication) return;
  if (BA(n)) {
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
  const o = eo(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${s}__target-action--applying`);
  const i = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await eA.execute({
      actor: o,
      conditionId: r.conditionId,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source,
      resistanceGateMode: io(),
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
    Ru(e, c);
    try {
      await B_(a.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), oo(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1, t.classList.remove(`${s}__target-action--applying`);
  }
}
function wu(e, t) {
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
function jA(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__target-toggle`), t.setAttribute(pu, "true"), t.setAttribute("aria-hidden", "true"), Cu(e, t), t;
}
function qi(e) {
  const t = e.querySelector(`[${gu}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const a = e.querySelector(`[${pu}="true"]`);
  a && Cu(e, a);
}
function Cu(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function ji(e) {
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
function zA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${s}__target-details`), n.setAttribute(gu, "true");
  const a = document.createElement("div");
  a.classList.add(`${s}__target-resistance-details`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", a.append(r, o);
  const i = GA(e, t.resistance);
  i && a.append(i);
  const l = VA(e, t.resistance), c = HA(e, t);
  return n.append(a, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function GA(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${s}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const a = e.state === it ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${a}`, n;
}
function VA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${s}__target-resistance-roll`);
  const a = e.resistanceResult?.formula ?? t?.formula ?? "—", r = e.resistanceResult?.total ?? null, o = yu(
    a,
    r,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function HA(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${s}__target-details-actions`), wu(n, [
    ku(e, t, "full"),
    $u(e, t, "full")
  ]), n;
}
function WA(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function KA(e) {
  const t = Su(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect-info`
  ), n.setAttribute(fu, "true"), n;
}
function Su(e) {
  return e.querySelector(`[${fu}="true"]`);
}
function YA(e, t) {
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
function XA(e, t, n) {
  const a = n?.parentElement === e ? n : Dt(e, "Conjuração");
  if (!a) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === a || e.insertBefore(t, a.nextElementSibling);
}
function QA(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ma(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function ZA(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function JA(e) {
  return typeof e == "string" && e.length > 0;
}
function eT(e) {
  return e === "normal" || e === "half";
}
function zi(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function Iu(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Gi = "data-paranormal-toolkit-card-layout-refresh-bound";
function tT(e) {
  const t = e.rollCard.querySelector(On);
  t && t.getAttribute(Gi) !== "true" && (t.setAttribute(Gi, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const He = "data-paranormal-toolkit-prompt-id", nT = "apply-damage", aT = "data-paranormal-toolkit-multi-target-damage-info";
function rT(e) {
  return Array.from(e.querySelectorAll(`.${s}__workflow-section`)).find((t) => t.getAttribute(aT) === "true" ? !1 : t.querySelector(`.${s}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function oT(e) {
  const t = sT(e);
  return t.find((n) => n.getAttribute(C_) === nT) ?? t.find((n) => ou(n) === "aplicar danos") ?? null;
}
function iT(e) {
  const t = Lu(e), n = Vi(t);
  return n || Vi(lT(e));
}
function Vi(e) {
  return e.find((t) => {
    const n = ou(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function sT(e) {
  const t = Lu(e);
  return t.length > 0 ? t : so(e);
}
function Lu(e) {
  const t = dT(e);
  return t ? so(e).filter((n) => uT(n, t)) : [];
}
function lT(e) {
  const t = vu(e);
  if (!t) return [];
  const n = cT(e, t);
  return so(e).filter((a) => !a.closest(`.${s}__roll-card`)).filter((a) => Du(e, a)).filter((a) => !n || mT(a, n));
}
function so(e) {
  const t = vu(e);
  return t ? Array.from(t.querySelectorAll(w_)) : [];
}
function vu(e) {
  return e.closest(`.${s}`) ?? e.parentElement;
}
function cT(e, t) {
  return Array.from(t.querySelectorAll(`.${s}__roll-card`)).find((n) => n !== e && Du(e, n)) ?? null;
}
function uT(e, t) {
  return e.getAttribute(He) === t ? !0 : Array.from(e.querySelectorAll(`[${He}]`)).some((n) => n.getAttribute(He) === t);
}
function dT(e) {
  return e.getAttribute(He) ?? e.querySelector(`[${He}]`)?.getAttribute(He) ?? null;
}
function Du(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function mT(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function fT(e) {
  const t = xu(), n = Un(e.rollCard).state, a = Xr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), r = a.policy.effectActionState, o = ot(r), i = Vc(r);
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
function pT(e) {
  const { rollCard: t } = e, n = bT(), a = xu(), r = Un(t).state, o = Xr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: a,
    resistanceState: r,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), i = o.policy.damageActionState, l = ot(i), c = hT(e);
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
      summary: gT(r)
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
function gT(e) {
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
function hT(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function bT() {
  try {
    return Pf();
  } catch {
    return "assisted";
  }
}
function xu() {
  try {
    return Or();
  } catch {
    return "strict";
  }
}
const yT = "data-paranormal-toolkit-damage-resolution-state", Hi = "data-paranormal-toolkit-damage-icon-enhanced", lo = "data-paranormal-toolkit-damage-original-label", _T = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, Nu = "Outra opção escolhida";
function AT(e, t) {
  t.classList.add(`${s}__actions--embedded`, `${s}__actions--damage-resolution`), L_(t, "Aplicar dano"), TT(e, t);
}
function TT(e, t) {
  const n = Array.from(t.querySelectorAll(Ze)), a = Ki(n, "normal"), r = Ki(n, "half");
  if (!a || !r) {
    RT(n), t.classList.add(`${s}__actions--compact`);
    return;
  }
  Yi(a, "normal"), Yi(r, "half");
  const o = pT({
    rollCard: e,
    normalButtonApplied: pn(a),
    halfButtonApplied: pn(r),
    normalButtonSkipped: ir(a),
    halfButtonSkipped: ir(r)
  });
  if (!o.canShowApplyDamage) {
    Xi(a), Xi(r), Qi(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${s}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${s}__actions--manual`, o.mode !== "assisted"), Wi(a, o.normalButton), Wi(r, o.halfButton), Qi(t, o.summary.state, o.summary.message);
}
function Wi(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    ET(e, t.visible), $T(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function RT(e) {
  for (const t of e)
    ir(t) && t.remove();
}
function pn(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(Nu);
}
function ir(e) {
  return e.textContent?.includes(Nu) ?? !1;
}
function Ki(e, t) {
  const n = _T[t];
  return e.find((a) => n.test(kT(a))) ?? null;
}
function kT(e) {
  return [
    e.getAttribute(lo),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Yi(e, t) {
  if (e.getAttribute(Hi) === "true") return;
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
  ), e.setAttribute(Hi, "true"), e.setAttribute(lo, n), e.setAttribute("aria-label", n), e.replaceChildren(a, Pe(n));
}
function Xi(e) {
  pn(e) || e.remove();
}
function ET(e, t) {
  e.hidden = !t, e.classList.toggle(`${s}__button--damage-resolution-selected`, t);
}
function $T(e, t, n, a = "Role resistência") {
  if (!pn(e)) {
    if (e.disabled = !t, e.classList.toggle(`${s}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", a), e.replaceChildren(Pe(a));
      return;
    }
    e.removeAttribute("aria-disabled"), wT(e, n);
  }
}
function wT(e, t) {
  const n = e.getAttribute(lo) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(CT(t), Pe(n)));
}
function CT(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${s}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function Qi(e, t, n) {
  e.setAttribute(yT, t);
  const a = e.querySelector(`.${s}__damage-resolution-summary`);
  if (!n) {
    a?.remove();
    return;
  }
  const r = a ?? document.createElement("span");
  r.classList.add(`${s}__damage-resolution-summary`), r.textContent = n, a || e.querySelector(to)?.after(r);
}
const kt = "data-paranormal-toolkit-effect-icon-enhanced", Je = "data-paranormal-toolkit-effect-action-compacted", jn = "data-paranormal-toolkit-effect-resistance-gate", co = "data-paranormal-toolkit-effect-section", uo = "data-paranormal-toolkit-effect-label";
function ST(e) {
  return e.querySelector(`[${co}="true"]`);
}
function IT(e) {
  const t = vT(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? xT(), a = jT(n, e.sourceActions, t);
  return a && n.setAttribute(uo, a), NT(n, t, a), UT(e.rollCard, n, e.after ?? e.fallbackAfter), qT(e.sourceActions, n), n;
}
function LT(e, t) {
  const n = t.querySelector(Ze);
  if (!n) return;
  const a = n.textContent?.trim() ?? "", r = Fu(t, n, a), o = Pu(e, n), i = fT({
    rollCard: e,
    effectLabel: r,
    applied: fo(n, a),
    effectCanApplyOnSuccessfulResistance: o ? Qe(o) === "success" || Qe(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Gc(o) : !1
  });
  if (i.applied) {
    GT(n);
    return;
  }
  if (!i.visible) {
    VT(n);
    return;
  }
  if (i.waitingForResistance) {
    HT(n, i.actionLabel);
    return;
  }
  if (i.resisted) {
    WT(n, i.compactLabel);
    return;
  }
  KT(n), Mu(n, i.displayLabel);
}
function vT(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ze) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ze) ?? []), a = [...t, ...n];
  return a.length === 0 ? null : DT(e.rollCard, a) ?? a[0] ?? null;
}
function DT(e, t) {
  const n = Un(e).state, a = jc(n), r = Ou(e);
  if (r.length === 0) return null;
  for (const o of t) {
    const i = Pu(e, o, r);
    if (i && zc(i, a)) return o;
  }
  return null;
}
function Pu(e, t, n = Ou(e)) {
  const a = mo(t, t.textContent?.trim() ?? ""), r = Ua(a);
  return r ? n.find((o) => [o.label, o.conditionId].some((i) => Ua(i) === r)) ?? null : null;
}
function Ou(e) {
  const t = eu(ky(e));
  if (!t) return [];
  const n = St(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((a) => a.actor === "target") : [];
}
function xT() {
  const e = document.createElement("section");
  return e.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect-action`
  ), e.setAttribute(co, "true"), e;
}
function NT(e, t, n) {
  e.setAttribute(co, "true"), e.classList.add(
    `${s}__workflow-section`,
    `${s}__workflow-section--effect-action`
  ), e.classList.remove(`${s}__actions`, `${s}__actions--effect-resolution`);
  const a = PT(e), r = OT(a);
  r.textContent = "Efeito";
  const o = MT(e, a), i = FT(o);
  i.textContent = YT(n ?? Fu(e, t, t.textContent?.trim() ?? ""));
  const l = BT(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ze)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !fo(t, c) && !zT(t, c) && Mu(t, n ?? c);
}
function PT(e) {
  const t = e.querySelector(`:scope > .${s}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${s}__workflow-section-header`), e.prepend(n), n;
}
function OT(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function MT(e, t) {
  const n = e.querySelector(`:scope > .${s}__effect-section-body`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(`${s}__effect-section-body`), t.after(a), a;
}
function FT(e) {
  const t = e.querySelector(`:scope > .${s}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${s}__effect-section-label`), e.prepend(n), n;
}
function BT(e) {
  const t = e.querySelector(`:scope > .${s}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${s}__effect-section-action`), e.append(n), n;
}
function UT(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function qT(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Ze)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function jT(e, t, n) {
  const a = e.getAttribute(uo);
  if (a && a.trim().length > 0) return a.trim();
  const r = t?.querySelector(`.${s}__effect-resolution-label`)?.textContent?.trim();
  return r || mo(n, n.textContent?.trim() ?? "");
}
function mo(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ye(n) !== "efeito aplicado") return n;
  const a = Ey(e);
  if (a) return a;
  const r = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return r.length > 0 && ye(r) !== "aplicado" ? r : null;
}
function fo(e, t) {
  return e.classList.contains(S_) || ye(t).includes("aplicado");
}
function zT(e, t) {
  const n = e.getAttribute(jn);
  if (n === "pending" || n === "resisted") return !0;
  const a = Ua(t);
  return a.includes("resistiu") || a.includes("role resistencia");
}
function Mu(e, t) {
  e.getAttribute(Je) === "true" && e.getAttribute(kt) === "true" || (e.disabled = !1, e.classList.add(`${s}__button--effect-resolution-action`), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.setAttribute(Je, "true"), e.setAttribute(kt, "true"), e.setAttribute(I_, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    no("✦", `${s}__button-icon--effect`),
    Pe("Aplicar")
  ));
}
function GT(e) {
  e.getAttribute(Je) === "true" && ye(e.textContent) === "✓ aplicado" || (e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-applied`), e.classList.remove(
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.setAttribute(Je, "true"), e.setAttribute(kt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    no("✓", `${s}__button-icon--effect-applied`),
    Pe("Aplicado")
  ));
}
function Fu(e, t, n) {
  const a = e.getAttribute(uo) ?? e.querySelector(`.${s}__effect-section-label`)?.textContent?.trim();
  return a && a.trim().length > 0 ? a.trim() : mo(t, n) ?? n;
}
function VT(e) {
  fo(e, e.textContent?.trim() ?? "") || e.remove();
}
function HT(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Je), e.removeAttribute(kt), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-resisted`
  ), e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-waiting`), e.setAttribute(jn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Pe(t));
}
function WT(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Je), e.removeAttribute(kt), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-waiting`
  ), e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-resisted`), e.setAttribute(jn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    no("✓", `${s}__button-icon--effect-resisted`),
    Pe(t)
  );
}
function KT(e) {
  e.classList.remove(
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.removeAttribute(jn), e.removeAttribute("aria-disabled");
}
function YT(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const XT = "data-paranormal-toolkit-card-layout-normalized";
function QT(e) {
  const t = ZT(e.rollCard), n = JT(t);
  return tT({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function ZT(e) {
  return {
    rollCard: e,
    damageSection: rT(e),
    resistance: e.querySelector(jr),
    damageActions: oT(e),
    effectActionSource: iT(e),
    effectSection: ST(e)
  };
}
function JT(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: a,
    damageActions: r,
    effectActionSource: o,
    effectSection: i
  } = e;
  t.setAttribute(XT, "true"), t.classList.add(`${s}__roll-card--structured`);
  const l = Dt(t, "Conjuração"), c = eR({
    rollCard: t,
    damageSection: n,
    resistance: a,
    fallbackAfter: l
  });
  n && r && (r.parentElement !== n && n.append(r), AT(t, r));
  const u = IT({
    rollCard: t,
    existingSection: i,
    sourceActions: o,
    after: tR(n, c),
    fallbackAfter: l
  });
  return u && LT(t, u), u;
}
function eR(e) {
  const { rollCard: t, damageSection: n, resistance: a, fallbackAfter: r } = e;
  return a ? n ? (a.parentElement !== n && n.append(a), n) : r ? (a.parentElement === t && a.previousElementSibling === r || t.insertBefore(a, r.nextElementSibling), a) : ((a.parentElement !== t || a.previousElementSibling !== null) && t.prepend(a), a) : null;
}
function tR(e, t) {
  return e ?? t;
}
const Bu = [0, 80, 180, 400, 900, 1600, 3e3], Zi = /* @__PURE__ */ new WeakSet();
function nR(e) {
  Uu(e), aR(e);
}
function Uu(e) {
  for (const t of Array.from(e.querySelectorAll(`.${s}__roll-card`)))
    qu(t);
}
function aR(e) {
  if (!Zi.has(e)) {
    Zi.add(e);
    for (const t of Bu)
      globalThis.setTimeout(() => {
        Uu(e);
      }, t);
  }
}
function qu(e) {
  const t = QT({
    rollCard: e,
    refreshDelaysMs: Bu,
    onRefresh: () => qu(e)
  });
  aA({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const rR = "data-paranormal-toolkit-resistance-roll-result-enhanced", Ji = "data-paranormal-toolkit-resistance-original-description", oR = "data-paranormal-toolkit-resistance-skill", iR = "data-paranormal-toolkit-resistance-skill-label", sR = `${s}__resistance--without-roll-button`, lR = ["Fortitude", "Reflexos", "Vontade"];
function cR(e) {
  for (const t of Array.from(e.querySelectorAll(jr)))
    uR(t);
  nR(e);
}
function uR(e) {
  const t = e.querySelector(dh), n = e.querySelector(wc), a = e.querySelector(On), r = gR(a) ? a : null, o = e.querySelector(Cc);
  if (!t && !n && !o && !a) return;
  e.classList.toggle(sR, !r);
  const i = pR(e, a);
  t && t.parentElement !== i && i.append(t), n && n.parentElement !== i && i.append(n), o && (o.parentElement !== e && (!a || !a.contains(o)) && e.append(o), yR(o)), dR(e, a, n), r && (kR(r), r.parentElement !== e && e.append(r));
}
function dR(e, t, n) {
  if (!n) return;
  const a = e.closest(`.${s}__roll-card`);
  if (!a) return;
  const r = fR(n), o = iu({
    description: r,
    skillLabel: hR(t, r),
    difficulty: Yr(a)
  });
  if (!o) {
    n.textContent = r, n.classList.remove(`${s}__resistance-description--difficulty`);
    return;
  }
  mR(n, o), n.classList.add(`${s}__resistance-description--difficulty`);
}
function mR(e, t) {
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
function fR(e) {
  const t = e.getAttribute(Ji);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(Ji, n), n;
}
function pR(e, t) {
  const n = e.querySelector(`.${Ti}`);
  if (n) return n;
  const a = document.createElement("div");
  return a.classList.add(Ti), e.insertBefore(a, t?.parentElement === e ? t : e.firstChild), a;
}
function gR(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function hR(e, t) {
  const n = e?.getAttribute(iR) ?? e?.getAttribute(oR) ?? null;
  return n || bR(t);
}
function bR(e) {
  const t = es(e);
  return lR.find((n) => t.startsWith(es(n))) ?? null;
}
function es(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function yR(e) {
  const t = _R(e.textContent ?? "");
  t && (e.setAttribute(rR, "true"), e.replaceChildren(RR(t)));
}
function _R(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, a, r] = t, o = n?.trim() ?? "Resistência", i = Number(r);
  if (!Number.isFinite(i)) return null;
  const { formula: l, diceValues: c } = AR(a ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(i),
    diceValues: c
  } : null;
}
function AR(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: TR(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function TR(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function RR(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${s}__workflow-roll`,
    `${s}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${s}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const a = ER(e);
  return a && t.append(a), t;
}
function kR(e) {
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
function ER(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-dice-tray`);
  for (const n of $R(e.diceValues, e.formula)) {
    const a = document.createElement("span");
    a.classList.add(`${s}__workflow-die`), n.active || a.classList.add(`${s}__workflow-die--inactive`), a.textContent = String(n.value), t.append(a);
  }
  return t;
}
function $R(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ts(e, "highest") : n.includes("kl") ? ts(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function ts(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function wR(e) {
  for (const t of Array.from(e.querySelectorAll(lh))) {
    const n = xR(t);
    CR(t), n && (SR(t, n), IR(t, n));
  }
}
function CR(e) {
  for (const t of Array.from(e.querySelectorAll(ch)))
    t.remove();
}
function SR(e, t) {
  const a = e.closest(`.${s}`)?.querySelector($c) ?? null, r = a?.querySelector(sh) ?? null, o = a ?? e, i = o.querySelector(ph);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const l = i ?? document.createElement("span");
  if (l.className = XR(t.elementTone), l.textContent = YR(t), !i) {
    if (r?.parentElement === o) {
      r.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function IR(e, t) {
  const n = LR(e);
  vR(e, n);
  const a = DR(t);
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
  const o = e.querySelector(Sc);
  if (o) {
    e.insertBefore(r, o);
    return;
  }
  e.prepend(r);
}
function LR(e) {
  return e.closest(`.${s}`)?.querySelector($c) ?? null;
}
function vR(e, t) {
  const n = [e, t].filter((a) => a !== null);
  for (const a of n)
    for (const r of Array.from(a.querySelectorAll(gh)))
      r.remove();
}
function DR(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Pa(e.target)}` : null,
    e.duration ? `Duração: ${Pa(e.duration)}` : null,
    e.resistance ? `Resistência: ${hc(e.resistance)}` : null
  ].filter(Dn);
}
function xR(e) {
  const t = NR(e), n = UR(e), r = (t ? BR(t) : null)?.system ?? null, o = t?.summaryLines ?? [], i = po(Q(r, "element")), l = le("op.elementChoices", i) ?? ns(Se(o, "Elemento")) ?? ns(n.damageType), c = i ?? QR(l), u = Q(r, "circle") ?? Se(o, "Círculo"), m = zR(r) ?? Se(o, "Alvo"), p = WR(r, "duration", "op.durationChoices") ?? Se(o, "Duração"), _ = qR(e) ?? VR(r) ?? Se(o, "Resistência"), $ = jR(o) ?? n.cost, T = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: $,
    target: m,
    duration: p,
    resistance: _
  };
  return KR(T) ? T : null;
}
function NR(e) {
  const t = PR(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Pn), a = MR(n);
  if (a.length === 0) return null;
  const r = OR(e);
  if (r.size > 0) {
    const o = a.find((i) => i.pendingId && r.has(i.pendingId));
    if (o) return o;
  }
  return a.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function PR(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Mr()?.messages?.get?.(n) ?? null : null;
}
function OR(e) {
  const t = e.closest(`.${s}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const a of Array.from(t.querySelectorAll(`[${Ai}]`))) {
    const r = a.getAttribute(Ai)?.trim();
    r && n.add(r);
  }
  return n;
}
function MR(e) {
  if (!vn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(FR).filter((n) => n !== null) : [];
}
function FR(e) {
  return vn(e) ? {
    pendingId: Zt(e.pendingId),
    actorId: Zt(e.actorId),
    itemId: Zt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Fp) : []
  } : null;
}
function BR(e) {
  if (!e.itemId) return null;
  const t = Mr(), a = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return a || (t?.items?.get?.(e.itemId) ?? null);
}
function UR(e) {
  let t = null, n = null;
  for (const a of Array.from(e.querySelectorAll(uh))) {
    const r = rt(a.textContent);
    if (!r) continue;
    const o = Mp(r, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(r) && (t = r);
  }
  return { cost: t, damageType: n };
}
function qR(e) {
  const t = rt(e.querySelector(wc)?.textContent);
  return t ? hc(t) : null;
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
function jR(e) {
  const t = Se(e, "Custo") ?? Se(e, "PE");
  return t || (e.map(rt).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function zR(e) {
  const t = Q(e, "target");
  if (!t) return null;
  if (t === "area")
    return GR(e) ?? le("op.targetChoices", t) ?? "Área";
  const n = le("op.targetChoices", t) ?? be(t);
  return [t === "people" || t === "creatures" ? Q(e, "targetQtd") : null, n].filter(Dn).join(" ");
}
function GR(e) {
  const t = Q(e, "area.name"), n = Q(e, "area.size"), a = Q(e, "area.type"), r = t ? le("op.areaChoices", t) ?? be(t) : null, o = a ? le("op.areaTypeChoices", a) ?? be(a) : null;
  return r ? n ? o ? `${r} ${n}m ${Pa(o)}` : `${r} ${n}m` : r : null;
}
function VR(e) {
  const t = Q(e, "skillResis"), n = Q(e, "resistance");
  if (!t || !n) return null;
  const a = le("op.skill", t) ?? be(t), r = HR(n);
  return [a, r].filter(Dn).join(" ");
}
function HR(e) {
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
function WR(e, t, n) {
  const a = Q(e, t);
  return a ? le(n, a) ?? be(a) : null;
}
function KR(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function YR(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function XR(e) {
  return [
    `${s}__ritual-element-badge`,
    e ? `${s}__ritual-element-badge--${e}` : null
  ].filter(Dn).join(" ");
}
function po(e) {
  const t = Tt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function ns(e) {
  const t = po(e);
  return t ? le("op.elementChoices", t) ?? be(t) : e ? be(e) : null;
}
function QR(e) {
  return po(e);
}
function le(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, a = Mr()?.i18n?.localize?.(n);
  return !a || a === n ? null : a;
}
const as = "data-paranormal-toolkit-dice-toggle-enhanced";
function ZR(e) {
  for (const t of Array.from(e.querySelectorAll(Ic)))
    ju(t);
}
function JR(e) {
  const t = Gu(e.target);
  if (!t) return;
  const n = go(t);
  n && (e.preventDefault(), zu(n, t));
}
function ek(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Gu(e.target);
  if (!t) return;
  const n = go(t);
  n && (e.preventDefault(), zu(n, t));
}
function ju(e) {
  const t = e.querySelector(Mn);
  if (!t) return;
  const n = e.querySelector(Gr);
  if (n && n.getAttribute(as) !== "true" && (n.setAttribute(as, "true"), n.classList.add(Vr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-chevron-down"), a.setAttribute("aria-hidden", "true"), n.append(a);
  }
}
function zu(e, t) {
  const n = e.querySelector(Mn);
  if (!n) return;
  const a = !e.classList.contains(zr);
  tk(e, t, n, a);
}
function tk(e, t, n, a) {
  e.classList.toggle(zr, a), n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.title = a ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const r = t.querySelector("i");
  r && (r.classList.toggle("fa-chevron-down", !a), r.classList.toggle("fa-chevron-up", a));
}
function Gu(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Gr);
  if (!t) return null;
  const n = go(t);
  return n ? (ju(n), t.classList.contains(Vr) ? t : null) : null;
}
function go(e) {
  const t = e.closest(Ic);
  return t && t.querySelector(Mn) ? t : null;
}
const rs = `${d}-workflow-dice-toggle-styles`;
function nk() {
  if (document.getElementById(rs)) return;
  const e = document.createElement("style");
  e.id = rs, e.textContent = `
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
const ak = [0, 100, 500, 1500, 3e3];
let os = !1, fa = null;
function rk() {
  if (!os) {
    os = !0, nk(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ht(cn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ht(cn(t));
    }), Hooks.once("ready", () => {
      ht(document), ok();
    }), document.addEventListener("click", JR), document.addEventListener("keydown", ek);
    for (const e of ak)
      globalThis.setTimeout(() => ht(document), e);
  }
}
function ok() {
  fa || !document.body || (fa = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ht(n);
  }), fa.observe(document.body, { childList: !0, subtree: !0 }));
}
function ht(e) {
  e && (e instanceof Element && (e.matches('[data-paranormal-toolkit-card-renderer="ritual-single-target"]') || e.querySelector('[data-paranormal-toolkit-card-renderer="ritual-single-target"]')) || (xh(e), wR(e), cR(e), ZR(e), $h(e)));
}
function ik() {
  rk();
}
const sk = "data-paranormal-toolkit-action-section", lk = "ritual-log", ck = ".paranormal-toolkit-item-use-prompt__actions", uk = ".paranormal-toolkit-item-use-prompt__actions-title", dk = [0, 100, 500, 1500];
let is = !1;
function mk() {
  if (is) return;
  const e = (t, n) => {
    ss(hk(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), ss(document), is = !0;
}
function ss(e) {
  for (const t of dk)
    globalThis.setTimeout(() => fk(e), t);
}
function fk(e) {
  pk(e), gk(e);
}
function pk(e) {
  for (const t of e.querySelectorAll(
    `[${sk}="${lk}"]`
  ))
    t.remove();
}
function gk(e) {
  for (const t of e.querySelectorAll(ck)) {
    if (ls(t.querySelector(uk)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => ls(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function hk(e) {
  if (e instanceof HTMLElement || bk(e))
    return e;
  if (yk(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function bk(e) {
  return e instanceof HTMLElement;
}
function yk(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function ls(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const bt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Vu = {
  PV: "system.attributes.hp"
}, sr = {
  PV: [bt.PV, Vu.PV],
  SAN: [bt.SAN],
  PE: [bt.PE],
  PD: [bt.PD]
}, lr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class _k {
  getResource(t, n) {
    const a = cs(t, n);
    if (!a.ok)
      return g(a.error);
    const r = a.value, o = `${r}.value`, i = `${r}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, i), u = ds(t, n, o, l, "valor atual");
    if (u) return g(u);
    const m = ds(t, n, i, c, "valor máximo");
    return m ? g(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, a) {
    const r = cs(t, n);
    if (!r.ok)
      throw new Error(r.error.message);
    await t.update({ [`${r.value}.value`]: a });
  }
}
function cs(e, t) {
  const n = Ak(e.type, t);
  if (n && us(e, n))
    return y(n);
  const a = sr[t].find(
    (r) => us(e, r)
  );
  return a ? y(a) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Tk(e, t),
    path: sr[t].join(" | ")
  });
}
function Ak(e, t) {
  return e === "threat" ? Vu[t] ?? null : e === "agent" ? bt[t] : null;
}
function us(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof a == "number" && Number.isFinite(a);
}
function Tk(e, t) {
  const n = e.type ?? "unknown", a = sr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${a}.`;
}
function ds(e, t, n, a, r) {
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
class Rk {
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
      const i = lr.ritualItem.circleCandidates;
      return g({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: a, value: r } = n, o = kk(r);
    return o ? y(o) : g({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(r)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: r
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of lr.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, n);
      if (a != null)
        return { path: n, value: a };
    }
    return null;
  }
}
function kk(e) {
  if (ms(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (ms(n))
      return n;
  }
  return null;
}
function ms(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ek = "dice-so-nice";
async function ho(e) {
  if (!$k() || !wk()) return;
  const t = Ck();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function $k() {
  try {
    return ih().enabled;
  } catch {
    return !1;
  }
}
function wk() {
  return game.modules?.get?.(Ek)?.active === !0;
}
function Ck() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const fs = "occultism";
class Hu {
  getDifficulty(t) {
    return Wu(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const a = await Ik(t, fs);
    if (!a)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await ho(a);
    const r = Dk(a);
    return {
      skill: fs,
      skillLabel: "Ocultismo",
      roll: a,
      formula: vk(a),
      total: r,
      difficulty: n,
      success: r >= n,
      diceBreakdown: xk(a)
    };
  }
}
function Wu(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Sk(e) {
  return new Hu().rollCastingCheck(e);
}
async function Ik(e, t) {
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
  return Lk(a);
}
function Lk(e) {
  return ps(e) ? e : Array.isArray(e) ? e.find(ps) ?? null : null;
}
function ps(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function vk(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Dk(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function xk(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Nk);
  if (!n) return null;
  const r = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const i = o.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return r.length > 0 ? `(${r.join(", ")})` : null;
}
function Nk(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Pk = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Ok {
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
    const a = n.value, r = Mk(t.ritual, a);
    return r.ok ? r.value ? y(r.value) : y({
      resource: "PE",
      amount: Pk[a],
      source: "default-by-circle",
      circle: a
    }) : g(r.error);
  }
}
function Mk(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Fk(n) ? {
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
function Fk(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class Bk {
  async applyPresetItemPatch(t, n) {
    const a = n.itemPatch;
    if (!a) return pa("missing-item-patch");
    if (t.type !== "ritual") return pa("unsupported-item-type");
    const r = Uk(a);
    return Object.keys(r).length === 0 ? pa("empty-update") : (await t.update(r), {
      applied: !0,
      updateData: r
    });
  }
}
function Uk(e) {
  const t = {};
  j(t, "name", e.name), j(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (j(t, "system.circle", n.circle), j(t, "system.element", n.element), j(t, "system.target", n.target), j(t, "system.targetQtd", n.targetQuantity), j(t, "system.execution", n.execution), j(t, "system.range", n.range), j(t, "system.duration", n.duration), j(t, "system.skillResis", n.resistanceSkill), j(t, "system.resistance", n.resistance), j(t, "system.studentForm", n.studentForm), j(t, "system.trueForm", n.trueForm)), t;
}
function j(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function pa(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class qk {
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
    return this.getNumber(t, lr.ritual.dt, 0);
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
class jk {
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
class zk {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Gk(t);
    return n.ok ? this.presets.has(t.id) ? g({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, ga(t)), y(t)) : n;
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
    return n ? ga(n) : null;
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
    return Array.from(this.presets.values()).map(ga);
  }
  findForItem(t) {
    return this.list().map((n) => Vk(n, t)).filter((n) => n !== null).sort((n, a) => a.score - n.score || n.preset.id.localeCompare(a.preset.id));
  }
}
function Gk(e) {
  return !ha(e.id) || !ha(e.version) || !ha(e.label) ? g({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? g({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Vk(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, n.push(`itemType:${t.type}`);
  }
  for (const r of e.matchers) {
    const o = Hk(r, t);
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
function Hk(e, t) {
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
      const n = gs(t.name), a = e.names.map(gs).includes(n);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Wk(t), a = n !== null && e.circles.includes(n);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function gs(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Wk(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function ga(e) {
  return structuredClone(e);
}
function ha(e) {
  return typeof e == "string" && e.length > 0;
}
function gn(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? g({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = zn(e.amountFrom);
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
function zn(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function Kk(e, t, n) {
  if (!hs(e.id) || !hs(e.formula))
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
    await ho(r);
    const l = {
      ...n.rollRequests[e.id] ?? Ku(e, t),
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
function Ku(e, t) {
  const n = e.intent ?? Yk(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Yk(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function hs(e) {
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
function Xk(e) {
  const { step: t, context: n, transaction: a, stepIndex: r, lifecycle: o } = e;
  if (t.operation === "damage") {
    const i = Qk(t, n, a, r);
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
    const i = Zk(t, n, a, r);
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
function Qk(e, t, n, a) {
  const r = zn(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    id: Yu(t.id, "damage", a, t.damageInstances.length),
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
function Zk(e, t, n, a) {
  const r = zn(e.amountFrom);
  return {
    id: Yu(t.id, "healing", a, t.healingInstances.length),
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
function Yu(e, t, n, a) {
  return `${e}.${t}.${n}.${a}`;
}
function Jk(e, t, n) {
  const a = zn(e.amountFrom), r = a ? t.rolls[a] : void 0;
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
function eE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: a, step: t, metadata: r }), Xu("before", e), bs("before", e), bs("resolve", e);
}
function tE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: a, step: t, metadata: r }), Xu("apply", e);
}
function nE(e) {
  const { step: t, context: n, stepIndex: a, metadata: r, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: a, step: t, metadata: r });
}
function Xu(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: i } = t, l = aE(e, n.operation);
  l && i.emit(l, a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function bs(e, t) {
  const { step: n, context: a, stepIndex: r, metadata: o, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: r,
    step: n,
    metadata: o
  });
}
function aE(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function rE(e, t, n) {
  return y(void 0);
}
async function oE(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return iE(e, t);
    case "spendRitualCost":
      return sE(e, t);
  }
}
async function iE(e, t) {
  const { context: n, resources: a } = e, r = gn(t, n);
  return r.ok ? Qu(await a.spend(n.sourceActor, t.resource, r.value), n) : g(r.error);
}
async function sE(e, t) {
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
  }), Qu(await a.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function Qu(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function lE(e) {
  const { step: t, context: n, stepIndex: a, lifecycle: r, execute: o } = e, i = cE(t);
  for (const c of i.before)
    r.emit(c, n, { stepIndex: a, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of i.after)
    r.emit(c, n, { stepIndex: a, step: t });
  return l;
}
function cE(e) {
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
class uE {
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
        return lE({
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
    const r = await oE({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return r.ok ? y(void 0) : g({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, a) {
    const r = Ku(t, a);
    n.rollRequests[r.id] = r, this.lifecycle.emit("beforeRoll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("before", r, n, a, t), this.lifecycle.emit("roll", n, { stepIndex: a, step: t, rollRequest: r }), this.emitSpecificRollPhase("roll", r, n, a, t);
    const o = await this.runRollFormulaStep(t, n, a);
    if (!o.ok)
      return o;
    const i = n.rolls[r.id];
    return this.emitSpecificRollPhase("after", r, n, a, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: a, step: t, rollRequest: r, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, a) {
    const r = await Kk(t, a, n);
    return r.ok ? y(void 0) : g({ ...r.error, stepIndex: a, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, a) {
    const r = gn(t, n);
    if (!r.ok)
      return g({ ...r.error, stepIndex: a, step: t, context: n });
    const o = Jk(t, n, r.value);
    eE({
      step: t,
      context: n,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), tE({
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
      Xk({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return nE({
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
    const r = await rE(this.messages);
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
    const l = dE(t, n.intent);
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
function dE(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class mE {
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
class fE {
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
class pE {
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
function Zu(e) {
  return {
    id: gE(),
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
function gE() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class hE {
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
    return je(this.lastContext);
  }
  async runAutomation(t, n) {
    const a = Zu(n);
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
class bE {
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
class yE {
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
    const n = va();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: _E(),
      flags: {
        ...t.flags,
        [d]: {
          ...AE(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const a = va();
    if (!a.enabled)
      return;
    const r = n.notification ?? ys(n);
    a.console && this.emitConsole(t, n), a.ui && this.emitUi(t, r);
  }
  emitConsole(t, n) {
    const a = ys(n);
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
function ys(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function _E() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function AE(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const TE = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ju = `${d}-inline-roll-neutralized`, RE = `${d}-inline-roll-notice`, bo = `data-${d}-inline-roll-neutralized`, _s = `data-${d}-inline-roll-notice`, kE = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function As(e) {
  const t = ME(e.message), n = await EE(e.message), a = $E(t);
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
async function EE(e) {
  const t = NE(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = wE(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await PE(t, n.content), replacementCount: n.replacementCount };
}
function $E(e) {
  const t = e ? OE(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = ed(t);
  return n > 0 && td(vE(t)), { replacementCount: n };
}
function wE(e) {
  const t = CE(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const a = ed(n.content), r = t.replacementCount + a;
  return r === 0 ? { content: e, replacementCount: 0 } : (td(n.content), { content: n.innerHTML, replacementCount: r });
}
function CE(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, r) => (t += 1, IE(r.trim()))), replacementCount: t };
}
function ed(e) {
  const t = SE(e);
  for (const n of t)
    n.replaceWith(LE(DE(n)));
  return t.length;
}
function SE(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(TE))
    n.getAttribute(bo) !== "true" && t.add(n);
  return Array.from(t);
}
function IE(e) {
  return `<span class="${Ju}" ${bo}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${FE(e)}</span>`;
}
function LE(e) {
  const t = document.createElement("span");
  return t.classList.add(Ju), t.setAttribute(bo, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function td(e) {
  if (e.querySelector?.(`[${_s}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(RE), t.setAttribute(_s, "true"), t.textContent = kE, e.append(t);
}
function vE(e) {
  return e.querySelector(".message-content") ?? e;
}
function DE(e) {
  const n = e.getAttribute("data-formula") ?? xE(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function xE(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function NE(e) {
  return e && typeof e == "object" ? e : null;
}
async function PE(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function OE(e) {
  const t = BE(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function ME(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function FE(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function BE(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const et = "ritualRollConfig", hn = "ritual-roll", UE = {
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
function nd(e) {
  const t = e.getFlag(d, et);
  return bn(t);
}
function ad(e) {
  return nd(e) ?? Nt();
}
async function qE(e, t) {
  const n = bn(t) ?? bn({
    ...Nt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, et, n), n;
}
async function jE(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, et));
    return;
  }
  await e.setFlag(d, et, null);
}
function bn(e) {
  if (!Vn(e)) return null;
  const t = ZE(e.intent);
  if (!t) return null;
  const n = Nt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: cr(e.damageType),
    utilityLabel: cr(e.utilityLabel) ?? n.utilityLabel,
    note: yo(e.note),
    forms: e$(e.forms)
  };
}
function zE(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function GE(e) {
  const t = nd(e), n = Gn(e);
  if (!t)
    return Ts(e, n);
  const a = XE(e, t);
  if (!a)
    return Ts(e, n);
  const r = VE(t, a), o = [
    { type: "spendRitualCost" },
    r,
    ...HE(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: KE(e, t),
    resistance: n
  };
}
function Ts(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: YE(e),
    resistance: t
  } : null;
}
function VE(e, t) {
  const n = {
    type: "rollFormula",
    id: hn,
    formula: t,
    intent: QE(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function HE(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${hn}.total`,
          ...WE(e.damageType)
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
function WE(e) {
  return e ? { damageType: e } : {};
}
function KE(e, t) {
  const n = {
    base: ba("Padrão", t.forms.base.formula)
  };
  return tt(e, "discente") && (n.discente = ba("Discente", t.forms.discente.formula, 2)), tt(e, "verdadeiro") && (n.verdadeiro = ba("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function ba(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [hn]: t.trim()
    }
  };
}
function YE(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return tt(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), tt(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function XE(e, t) {
  return [
    t.forms.base.formula.trim(),
    tt(e, "discente") ? t.forms.discente.formula.trim() : "",
    tt(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((a) => a.length > 0) ?? null;
}
function Gn(e) {
  const t = rd(e), n = cr(t.skillResis), a = JE(t.resistance);
  if (!n || !a) return;
  const r = t$(n), o = UE[a];
  return {
    skill: n,
    label: r,
    effect: a,
    summary: `${r} ${o}`
  };
}
function QE(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function ZE(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function JE(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function e$(e) {
  const t = Nt();
  return Vn(e) ? {
    base: ya(e.base),
    discente: ya(e.discente),
    verdadeiro: ya(e.verdadeiro)
  } : t.forms;
}
function ya(e) {
  return Vn(e) ? { formula: yo(e.formula) } : { formula: "" };
}
function tt(e, t) {
  const n = rd(e), a = t === "discente" ? n.studentForm : n.trueForm;
  return n$(a);
}
function rd(e) {
  const t = e.system;
  return Vn(t) ? t : {};
}
function t$(e) {
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
function n$(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function yo(e) {
  return typeof e == "string" ? e.trim() : "";
}
function cr(e) {
  const t = yo(e);
  return t.length > 0 ? t : null;
}
function Vn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function a$(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function od(e) {
  switch (r$(e)) {
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
      return o$(String(e ?? ""));
  }
}
function r$(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function o$(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function i$() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function s$(e) {
  return {
    ..._o(e),
    type: "ritual.cast.started"
  };
}
function l$(e) {
  return {
    ..._o(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function c$(e) {
  return {
    ..._o(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function u$(e) {
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
function d$(e, t = {}) {
  const n = w$(e), a = [
    ...S$(t.candidates ?? []),
    ...I$(e)
  ], r = v$(a) ?? { x: 0, y: 0, width: 0, height: 0 }, o = C$(t) ?? D$(a) ?? N$(r), i = O$(canvas?.grid?.size), l = m$(o, r, a), c = A$(a), u = _$(l);
  return {
    type: "rectangleRay",
    sceneId: P$(e, n),
    regionId: Ss(n?.id) ?? Ss(e.id),
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
function m$(e, t, n) {
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
    direction: f$(a, t, n)
  };
}
function f$(e, t, n) {
  const a = p$(n);
  return a !== null ? a : h$(e, t) ?? e.direction;
}
function p$(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const a = Rs(n, t);
    if (a !== null) return a;
    const r = Hn(n), o = Rs(r, t);
    if (o !== null) return o;
  }
  return null;
}
function Rs(e, t) {
  for (const n of t) {
    const a = g$(K(e, n));
    if (a !== null) return a;
  }
  return null;
}
function g$(e) {
  const t = $t(e);
  if (t === null) return null;
  const n = To(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function h$(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Es(ks(e, e.direction), t), a = b$(e, t);
  if (a === null) return null;
  const o = y$([
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
    error: Es(ks(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const i = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= i ? To(o.direction) : null;
}
function b$(e, t) {
  const n = e.width, a = e.height, r = n ** 2 - a ** 2;
  if (Math.abs(r) < 1e-3) return null;
  const o = (n * t.width - a * t.height) / r, i = (n * t.height - a * t.width) / r, l = Is(o, 0, 1), c = Is(i, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : M$(Math.atan2(c, l));
}
function ks(e, t) {
  const n = sd(t), a = {
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
  ], i = o.map((_) => _.x), l = o.map((_) => _.y), c = Math.min(...i), u = Math.max(...i), m = Math.min(...l), p = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: p - m
  };
}
function Es(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function y$(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const a = To(n);
    t.add(Math.round(a * 1e3) / 1e3);
  }
  return [...t];
}
function _$(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = sd(e.direction), n = {
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
function A$(e) {
  for (const t of e) {
    const n = $s(t, "ray.start"), a = $s(t, "ray.end");
    if (n && a) return { start: n, end: a };
  }
  return null;
}
function $s(e, t) {
  const n = K(e, t), a = $t(K(n, "x")), r = $t(K(n, "y"));
  return a === null || r === null ? null : { x: a, y: r };
}
function _o(e) {
  const t = u$(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: k$(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: T$(e.context.item, e.form, e.formLabel, t),
    targets: n.map(E$),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function T$(e, t, n, a) {
  return {
    name: e.name,
    slug: _a(e, "system.slug") ?? _a(e, "slug"),
    presetId: a.presetId,
    presetVersion: a.presetVersion,
    element: _a(e, "system.element"),
    circle: $$(e),
    form: R$(t),
    formLabel: n
  };
}
function R$(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function k$(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function E$(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function $$(e) {
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
function w$(e) {
  return "document" in e && e.document ? e.document : e;
}
function C$(e) {
  return id(e.shape);
}
function S$(e) {
  return e.filter(Ao);
}
function I$(e) {
  return [
    e,
    L$(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Ao);
}
function L$(e) {
  return "object" in e && Ao(e.object) ? e.object : null;
}
function Ao(e) {
  return !!(e && typeof e == "object");
}
function v$(e) {
  for (const t of e) {
    const n = ws(K(Hn(t), "bounds"));
    if (n) return n;
    const a = ws(K(t, "bounds"));
    if (a) return a;
  }
  return null;
}
function ws(e) {
  const t = P(e, "x"), n = P(e, "y"), a = P(e, "width"), r = P(e, "height");
  return t === null || n === null || a === null || r === null ? null : { x: t, y: n, width: a, height: r };
}
function P(e, t) {
  return $t(K(e, t));
}
function D$(e) {
  for (const t of e) {
    const n = x$(t).find((a) => a.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function x$(e) {
  if (!e || typeof e != "object") return [];
  const t = Cs(Hn(e));
  return t.length > 0 ? t : Cs(e);
}
function Cs(e) {
  const t = K(e, "shapes");
  return Array.isArray(t) ? t.map(id).filter((n) => n !== null) : [];
}
function id(e) {
  const t = Hn(e) ?? e, n = K(t, "type");
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
function N$(e) {
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
function P$(e, t) {
  return Aa(e, "parent.id") ?? Aa(e, "document.parent.id") ?? Aa(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Aa(e, t) {
  return ve(K(e, t));
}
function K(e, t) {
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
  const t = K(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function Ss(e) {
  return ve(e);
}
function $t(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function O$(e) {
  const t = $t(e);
  return t !== null && t > 0 ? t : null;
}
function sd(e) {
  return e * Math.PI / 180;
}
function M$(e) {
  return e * 180 / Math.PI;
}
function To(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Is(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class F$ {
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
const B$ = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class U$ {
  constructor(t = new Wn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = q$(t, this.foundryAdapter);
    for (const a of n)
      try {
        await a.run(), a.method;
        return;
      } catch {
        a.method;
      }
    this.foundryAdapter.warn(B$);
  }
}
function q$(e, t) {
  const n = [], a = j$(e), r = Ls(a), o = Ls(e);
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
function j$(e) {
  return z$(e) ? e.document ?? null : e;
}
function z$(e) {
  return "bounds" in e;
}
function Ls(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const G$ = 100, V$ = 12;
class H$ {
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
      const r = this.foundryAdapter.getGridSize() ?? G$, o = Q$(n), i = await this.foundryAdapter.placeRegion(
        W$(t, this.foundryAdapter.getUserColor(), r),
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
        message: X$(r)
      };
    }
  }
}
function W$(e, t, n) {
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
    shapes: [K$(e, n)]
  };
}
function K$(e, t) {
  const n = Y$(e, t);
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
function Y$(e, t) {
  return {
    length: vs(e.length, V$, t),
    width: vs(e.width, 1, t)
  };
}
function vs(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function X$(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function Q$(e) {
  const t = (n) => {
    const a = Z$(n);
    a && e.onChange?.(a);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function Z$(e) {
  return J$(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function J$(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class ew {
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
    this.applyTargets(Ds(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Ds(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = tw(t);
    nw(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Ds(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function tw(e) {
  return Array.from(new Set(e));
}
function nw(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, a) => n === t[a]);
}
class aw {
  constructor(t = new Wn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Vl)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(rw(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(ow(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((a) => ({
      source: a.source,
      hasBounds: ur(a.region)
    }));
    for (const a of t) {
      if (!ur(a.region)) continue;
      const r = this.resolveRegionObjectTargetTokens(a.region);
      return a.source, r.tokens.length, r;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), a = sw(
      n.filter((r) => !r.actor || typeof r.document?.testInsideRegion != "function" ? !1 : r.document.testInsideRegion(t))
    );
    return n.length, a.length, { tokens: a, source: "regionObject" };
  }
}
function rw(e) {
  return [
    { source: "document", region: Le(e.document) },
    { source: "document.object", region: Le(e.document.object) },
    { source: "preview", region: Le(e.preview) },
    { source: "preview.document.object", region: Le(e.preview?.document?.object) }
  ];
}
function ow(e) {
  return [
    { source: "input", region: Le(e) },
    { source: "input.object", region: iw(e) ? Le(e.object) : null },
    { source: "input.document.object", region: ld(e) ? Le(e.document?.object) : null }
  ];
}
function Le(e) {
  return ur(e) ? e : null;
}
function ur(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Vt(n.x) && Vt(n.y) && Vt(n.width) && Vt(n.height);
}
function ld(e) {
  return "document" in e && "bounds" in e;
}
function iw(e) {
  return !ld(e);
}
function sw(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return a ? t.has(a) ? !1 : (t.add(a), !0) : !0;
  });
}
function Vt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class lw {
  async minimizeForPlacement() {
    const t = [];
    for (const n of dw())
      await cw(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await uw(n);
      }
    };
  }
}
async function cw(e) {
  if (cd(e) || !_w(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function uw(e) {
  if (cd(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function dw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of mw())
    gw(t) && hw(t) && e.add(t);
  return [...e];
}
function mw() {
  return [
    ...xs(fw()),
    ...xs(pw())
  ];
}
function xs(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function fw() {
  return globalThis.ui?.windows ?? null;
}
function pw() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function gw(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function hw(e) {
  const t = bw(e), n = yw(t);
  return n === "Actor" || n === "Item";
}
function bw(e) {
  return e.document ?? e.object ?? null;
}
function yw(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function _w(e) {
  const t = Aw(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function Aw(e) {
  const t = e.element;
  if (Ns(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Ns(n)) return n;
  }
  return null;
}
function Ns(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function cd(e) {
  return e.minimized === !0;
}
const Tw = "Nenhum alvo encontrado na linha.";
class Rw {
  constructor(t = new H$(), n = new aw(), a = new U$(), r = new ew(), o = new F$(), i = new lw()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = Ew(a), m = d$(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(Tw), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = kw(c);
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
function kw(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function Ew(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function $w(e) {
  return {
    header: {
      eyebrow: xl,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: xw(e.ritual)
    },
    forms: e.variantOptions.map((t) => ww(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: Iw(e.targetNames, e.variantOptions, e.ritual),
    automation: Dw(e.automationStatus ?? "assisted")
  };
}
function ww(e, t) {
  const n = Cw(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Sw(t) : "—",
    details: n
  };
}
function Cw(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Sw(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Iw(e, t, n) {
  const a = e.map((r) => r.trim()).filter((r) => r.length > 0);
  return {
    targetNames: a,
    targetText: a.length > 0 ? a.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: a.length > 0,
    forms: t.map((r) => Lw(r, n))
  };
}
function Lw(e, t) {
  const n = e.targeting ?? vw(t, e.variant), a = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function vw(e, t) {
  const n = St(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function Dw(e) {
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
function xw(e) {
  const t = e.system, n = [Pw(t?.element), Nw(t?.circle)].filter(Fw);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Nw(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Pw(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (Ow(e)) {
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
      return Mw(e);
  }
}
function Ow(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function Mw(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function Fw(e) {
  return typeof e == "string" && e.length > 0;
}
const ud = ["base", "discente", "verdadeiro"];
function Ro(e) {
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
  return typeof e == "string" && ud.includes(e);
}
const { ApplicationV2: Bw } = foundry.applications.api;
class At extends Bw {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = $w(t), this.selectedVariant = this.model.forms.find((a) => a.checked && a.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: At.onCast,
      cancel: At.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new At(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const a = document.createElement("div");
    return a.className = "paranormal-toolkit-ritual-cast", a.innerHTML = this.renderContent(), a;
  }
  _replaceHTML(t, n, a) {
    n.replaceChildren(t);
    const r = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    jw(r, (o) => {
      this.selectedVariant = o, dr(r, o);
    }), dr(r, this.selectedVariant), zw(r, (o) => {
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
          ${this.model.forms.map(Uw).join("")}
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
          ${this.model.targets.forms.map(qw).join("")}
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
    const n = Ww(t), a = Gw(n, this.spendResource, this.selectedVariant);
    this.settle(a), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Uw(e) {
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
function qw(e) {
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
function jw(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const r of n)
    r.addEventListener("click", () => Ps(e, r, t)), r.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Ps(e, r, t));
    });
  const a = dd(e);
  a && t(a);
}
function Ps(e, t, n) {
  const a = t.querySelector('input[name="variant"]');
  !a || a.disabled || !yn(a.value) || (a.checked = !0, e.dataset.paranormalToolkitSelectedVariant = a.value, n(a.value), a.dispatchEvent(new Event("change", { bubbles: !0 })), dd(e), dr(e, a.value));
}
function dd(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const a of t) {
    const r = a.querySelector('input[name="variant"]'), o = r?.checked === !0;
    a.setAttribute("aria-checked", o ? "true" : "false"), o && yn(r.value) && (n = r.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function dr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const a of n) {
    const r = a.dataset.paranormalToolkitTargetingForm === t;
    a.hidden = !r;
  }
}
function zw(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Gw(e, t, n) {
  const a = Hw(e) ?? n, r = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = Vw(e, a);
  return {
    variant: a,
    spendResource: r,
    areaTargeting: o
  };
}
function Vw(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function Hw(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (yn(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return yn(n) ? n : null;
}
function Ww(e) {
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
async function Kw(e) {
  return At.request(e);
}
const ko = {
  label: "Padrão"
}, Yw = {
  label: "Discente",
  extraCost: 2
}, Xw = {
  label: "Verdadeiro",
  extraCost: 5
};
class Qw {
  constructor(t, n, a, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = a, this.ritualEvents = r;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new Rw();
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
    const r = this.resolveCostPreview(t), o = HC(n), i = zC(
      n,
      t.item,
      r,
      o
    ), l = await Kw({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((S) => S.name),
      cost: r,
      defaultSpendResource: ZC(n),
      variantOptions: i,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = Zw(l), u = KC(
      n,
      t.item,
      c.variant,
      o
    ), m = i$(), p = u.label ?? Ro(c.variant), _ = rC(u), $ = (S = t.targets) => ({
      castId: m,
      context: t,
      automationSource: a,
      form: c.variant,
      formLabel: p,
      targets: S
    }), T = (S, I = t.targets, ue = {}) => {
      this.ritualEvents.emitCastFinished(
        c$({
          ...$(I),
          status: S,
          ...ue
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      s$($())
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
    const b = Jw(
      t,
      k.targets
    ), L = !!k.areaSnapshot;
    k.areaSnapshot && this.ritualEvents.emitAreaResolved(
      l$({
        ...$(k.targets),
        area: k.areaSnapshot
      })
    );
    const E = Zl();
    let D = null;
    if (E) {
      const S = await tC(
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
        const I = await Sk(
          b.actor
        );
        D = oC(
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
    const G = eC(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !E
      }
    );
    if (G.steps.length === 0) {
      const S = WC(
        b,
        c
      ), I = Ms(
        n,
        b
      ), ue = Os(
        b.actor,
        D,
        u,
        r
      ), Ho = Bs(
        n,
        c,
        u,
        r,
        S,
        b,
        D
      ), Wo = Fs(m, c, u, p, r, D, n, S, L);
      if (!I.ok)
        return T("failed", b.targets, {
          reason: I.reason,
          message: I.message
        }), {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      const Ko = [
        ...ue,
        ...I.actions
      ];
      return Ko.length > 0 ? (T("ready", b.targets), {
        status: "ready",
        workflowContext: S,
        itemUseContext: b,
        actions: Ko,
        summaryLines: Ho,
        castSnapshot: Wo
      }) : (T("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: S,
        itemUseContext: b,
        summaryLines: Ho,
        castSnapshot: Wo
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
    const x = q.value.context, H = mC(
      n,
      b,
      x,
      _
    ), ne = Ms(
      n,
      b
    ), Me = Os(
      b.actor,
      D,
      u,
      r
    ), C = Bs(
      n,
      c,
      u,
      r,
      x,
      b,
      D
    ), O = Fs(m, c, u, p, r, D, n, x, L);
    if (!H.ok)
      return T("failed", b.targets, {
        reason: H.reason,
        message: H.message
      }), {
        status: "failed",
        reason: H.reason,
        message: H.message
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
      ...Me,
      ...H.actions,
      ...ne.actions
    ];
    return ae.length === 0 ? (T("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: x,
      itemUseContext: b,
      summaryLines: C,
      castSnapshot: O
    }) : (T("ready", b.targets), {
      status: "ready",
      workflowContext: x,
      itemUseContext: b,
      actions: ae,
      summaryLines: C,
      castSnapshot: O
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
function Zw(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function Jw(e, t) {
  return {
    ...e,
    targets: t
  };
}
function eC(e, t, n, a, r) {
  const o = [], i = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || $o(l) && (!r.includeCostSteps || !i))
      continue;
    const c = nC(l, n);
    c && o.push(c);
  }
  return r.includeCostSteps && i && a && JC(n.extraCost) && o.push({
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
async function tC(e, t, n, a, r) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Oe(r, a);
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
function nC(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = aC(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function aC(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const a = n[t];
  return typeof a == "string" ? a.trim() : "";
}
function rC(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function oC(e, t, n) {
  const r = iC(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: r,
    success: e.total >= r
  };
}
function iC(e, t) {
  const n = Oe(e, t);
  return n ? a$(n.amount) : null;
}
function Os(e, t, n, a) {
  if (!t || t.success) return [];
  const r = Oe(a, n);
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
function Ms(e, t) {
  const n = [];
  for (const a of e.conditionApplications ?? []) {
    const r = Eo(a.actor, t);
    if (r.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${a.label ?? a.conditionId}.`
      };
    }
    for (const o of r) {
      const i = Nc(o);
      n.push(
        sC(
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
function sC(e, t, n, a) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? dC(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: cC(
      e.duration ?? null,
      a
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: uC(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito",
    resistanceOutcome: e.applyOnResistance
  };
}
function Fs(e, t, n, a, r, o, i, l, c) {
  return {
    castId: e,
    form: { id: t.variant, label: a },
    cost: r ? { amount: Oe(r, n)?.amount ?? r.amount, resource: r.resource, spent: t.spendResource } : null,
    castingCheck: o,
    resistance: i.resistance ?? null,
    rolls: Object.values(l.rolls).map((u) => ({
      id: u.id,
      formula: u.formula,
      total: u.total,
      intent: u.intent,
      damageType: u.damageType ?? null,
      diceResults: lC(u.roll)
    })),
    areaTargeting: c
  };
}
function lC(e) {
  const t = e.dice;
  return Array.isArray(t) ? t.flatMap((n) => {
    const a = n.results;
    return Array.isArray(a) ? a.flatMap((r) => {
      const o = r.result;
      return typeof o == "number" && Number.isFinite(o) ? [Math.trunc(o)] : [];
    }) : [];
  }) : [];
}
function cC(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function uC(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const a = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${a}`;
  }
  return e;
}
function dC(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function mC(e, t, n, a = /* @__PURE__ */ new Set()) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const i of e.steps) {
    if (i.type !== "modifyResource" || fC(i, a)) continue;
    const l = gn(i, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = Eo(i.actor, t);
    if (c.length === 0) {
      if (i.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (pC(i)) {
        gC(
          o,
          u,
          hC(i, n, l.value)
        );
        continue;
      }
      r.push(yC(i, u, l.value));
    }
  }
  for (const i of o.values())
    r.push(
      ...bC(
        e,
        t.item,
        i.actor,
        i.entries
      )
    );
  return { ok: !0, actions: r };
}
function fC(e, t) {
  const n = md(e.amountFrom);
  return n !== null && t.has(n);
}
function pC(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function gC(e, t, n) {
  const a = RC(t), r = e.get(a);
  if (r) {
    r.entries.push(n);
    return;
  }
  e.set(a, {
    actor: t,
    entries: [n]
  });
}
function hC(e, t, n) {
  const a = md(e.amountFrom), r = a ? t.rolls[a]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? r ?? null,
    sourceRollId: a
  };
}
function bC(e, t, n, a) {
  const r = wC(e), o = r.length > 1 ? IC() : void 0;
  return r.map((i) => {
    const l = a.map(
      (u, m) => {
        const p = CC(u.amount, i);
        return {
          id: _C(u, i, m),
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
      label: AC(c, i, r.length > 1),
      executedLabel: TC(
        n.name ?? "Ator sem nome",
        i,
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
function yC(e, t, n) {
  const a = t.name ?? "Ator sem nome", r = $C(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: kC(e, a, n),
    executedLabel: EC(e, a),
    actionSectionId: r.id,
    actionSectionTitle: r.title
  };
}
function _C(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function AC(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function TC(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function RC(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function md(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function kC(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function EC(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function $C(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function wC(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function CC(e, t) {
  const n = e * t.multiplier, a = SC(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, a);
}
function SC(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function IC() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Eo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Bs(e, t, n, a, r, o, i = null) {
  return [
    `Forma: ${Ro(t.variant)}`,
    xC(t, n, a),
    ...DC(i),
    ...Object.values(r.rolls).flatMap(NC),
    ...LC(e, o),
    ...PC(e.resistance),
    ...qC(n)
  ];
}
function LC(e, t) {
  return vC(e) ? Eo("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function vC(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function DC(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function xC(e, t, n) {
  const a = Oe(n, t);
  return a ? e.spendResource ? `Custo: ${a.amount} ${a.resource} gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function NC(e) {
  const n = [`${jC(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = OC(e.roll);
  return a && n.push(`Dados: ${a}`), e.damageType && n.push(`Tipo: ${od(e.damageType)}`), n;
}
function PC(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function OC(e) {
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
    const i = MC(o);
    i && (UC(
      n,
      i.operator ?? a,
      i.value
    ), a = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function MC(e) {
  const t = FC(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : BC(e);
}
function FC(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function BC(e) {
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
function UC(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function qC(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function jC(e) {
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
function zC(e, t, n, a) {
  return ud.map((r) => {
    const o = fd(
      e,
      t,
      r,
      a
    ), i = o !== null;
    return {
      variant: r,
      label: o?.label ?? Ro(r),
      enabled: i,
      details: o ? GC(o, n) : [],
      finalCostText: o ? VC(n, o) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function GC(e, t, n) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {}).map((i) => i.trim()).filter((i) => i.length > 0);
  r.length > 0 ? a.push(r.join(", ")) : a.push("efeito manual");
  const o = Oe(t, e);
  return a.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), a;
}
function Oe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function VC(e, t) {
  const n = Oe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function HC(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every($o);
}
function WC(e, t) {
  return Zu({
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
function KC(e, t, n, a) {
  return fd(e, t, n, a) ?? ko;
}
function fd(e, t, n, a) {
  const r = e.ritualForms?.[n] ?? null;
  return r || (a ? XC(t, n) ? YC(n) : null : n === "base" ? ko : null);
}
function YC(e) {
  switch (e) {
    case "base":
      return ko;
    case "discente":
      return Yw;
    case "verdadeiro":
      return Xw;
  }
}
function XC(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return QC(foundry.utils.getProperty(e, n));
}
function QC(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ZC(e) {
  return e.steps.some($o);
}
function $o(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function JC(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
function pd(e) {
  if (!X(e) || e.schemaVersion !== 2 || e.kind !== "ritual" || e.renderer !== "single-target" || !mr(e.revision) || !mr(e.createdAt) || !(typeof e.messageId == "string" || e.messageId === null) || !nS(e.state)) return null;
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
function eS(e) {
  return pd(e) !== null;
}
function tS(e) {
  if (!X(e) || !X(e.legacyFallback)) return null;
  const t = typeof e.legacyFallback.itemName == "string" ? e.legacyFallback.itemName.trim() : "", n = Array.isArray(e.legacyFallback.summaryLines) ? e.legacyFallback.summaryLines.filter((a) => typeof a == "string") : [];
  return !t && n.length === 0 ? null : { itemName: t || "Ritual", summaryLines: n };
}
function nS(e) {
  return !X(e) || e.schemaVersion !== 1 || e.renderer !== "single-target" || typeof e.castId != "string" || !an(e.source) || !an(e.item) || !an(e.target) || !X(e.form) || typeof e.form.id != "string" || typeof e.form.label != "string" || !(e.descriptionHtml === void 0 || e.descriptionHtml === null || typeof e.descriptionHtml == "string") || !Array.isArray(e.actions) || !e.actions.every(aS) || !(e.mainRoll === null || X(e.mainRoll)) || !(e.conjuration === null || X(e.conjuration)) || !(e.resistance === null || X(e.resistance)) ? !1 : mr(e.createdAt);
}
function aS(e) {
  return !X(e) || typeof e.id != "string" || typeof e.label != "string" || typeof e.executedLabel != "string" || !an(e.actor) || !["pending", "available", "executing", "completed", "resolved", "uncertain"].includes(String(e.state)) ? !1 : ["resource-operation", "damage-application", "condition-application"].includes(String(e.kind));
}
function an(e) {
  return X(e) && (typeof e.id == "string" || e.id === null) && (typeof e.uuid == "string" || e.uuid === null) && typeof e.name == "string";
}
function mr(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function X(e) {
  return !!(e && typeof e == "object" && !Array.isArray(e));
}
const Ht = /* @__PURE__ */ new Map();
function wo(e) {
  const t = e?.getFlag?.(d, "chatCard");
  return eS(t) ? t : null;
}
async function gd(e, t) {
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
    const c = wo(e);
    if (!c) throw new Error("Card ritual v2 inválido ou ausente.");
    const m = { ...await t(c), revision: c.revision + 1 };
    await gd(e, m), r(m);
  }).catch(o).finally(() => {
    Ht.get(n) === l && Ht.delete(n);
  });
  return Ht.set(n, l), i;
}
function rS(e) {
  const t = e.mainRoll, n = e.resistance?.result?.outcome ?? null, a = oS(e.actions, n, e.target.name);
  return {
    header: { title: e.item.name, subtitle: e.form.label, context: `${e.source.name} → ${e.target.name}`, badges: [{ label: "Ritual", tone: "wine" }] },
    description: e.descriptionHtml?.trim() ? { html: e.descriptionHtml } : void 0,
    metadata: { items: [e.cost ? `${e.cost.amount} ${e.cost.resource}` : null, e.target.name].filter((r) => !!r).map((r) => ({ text: r })) },
    conjuration: e.conjuration ? { status: e.conjuration.success ? "success" : "failure", skillLabel: e.conjuration.skillLabel, total: e.conjuration.total, difficultyClass: e.conjuration.difficulty, formula: e.conjuration.formula, diceResults: e.conjuration.diceResults, consequence: e.conjuration.consequence ?? void 0 } : void 0,
    effect: t ? { title: t.intent === "damage" ? "Dano" : t.intent === "healing" ? "Cura" : "Efeito", typeLabel: t.damageType ? od(t.damageType) : void 0, formula: t.formula, total: t.total, diceResults: t.diceResults } : void 0,
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
function oS(e, t, n) {
  const a = e.filter((i) => i.kind === "condition-application" && i.outcome !== null), o = e.filter((i) => !(i.kind === "condition-application" && i.outcome !== null)).map(lS);
  return a.length && o.push(iS(a, t, n)), o;
}
function iS(e, t, n) {
  if (!t)
    return { label: "Efeitos da resistência", description: "Aguardando resistência", control: { state: "disabled", button: { label: "Aplicar", disabled: !0, actionId: "resistance-outcome-conditions", actionKind: "apply-resistance-outcome-conditions" } } };
  const a = e.filter((p) => p.outcome === t), r = a.filter((p) => p.state === "available"), o = a.filter((p) => p.state === "completed"), i = a.length, c = `${t === "success" ? "Sucesso" : "Falha"} · ${i} ${i === 1 ? "efeito" : "efeitos"}`, u = { items: a.map(sS) };
  if (a.length > 0 && o.length === a.length)
    return { label: "Efeitos da resistência", description: `${c} · ${n}`, details: u, control: hd() };
  const m = o.length > 0;
  return {
    label: "Efeitos da resistência",
    description: m ? `${c} · aplicação parcial` : c,
    details: u,
    control: { state: r.length ? "active" : "disabled", button: { label: m ? "Aplicar pendentes" : "Aplicar", disabled: !r.length, actionId: "resistance-outcome-conditions", actionKind: "apply-resistance-outcome-conditions" } }
  };
}
function sS(e) {
  const t = e.label.replace(/^(?:Sucesso|Falha)\s*·\s*/iu, ""), [n, a] = t.split(/:\s*/u, 2);
  return `${n ?? "Condição"} · ${a ?? "duração indefinida"}`;
}
function lS(e) {
  const t = e.state === "completed" || e.state === "resolved" || e.state === "uncertain";
  return {
    label: e.label,
    description: e.state === "resolved" ? "Alternativa não aplicável" : e.state === "uncertain" ? "Verifique no alvo antes de tentar novamente" : e.actor.name,
    control: t ? e.state === "completed" ? hd() : { state: "completed", indicator: { label: e.state === "resolved" ? "Resolvida" : "Aplicação incerta" } } : { state: e.state === "available" ? "active" : "disabled", button: { label: Us(e) ? "Curar" : "Aplicar", actionId: e.id, actionKind: e.kind === "damage-application" ? "apply-damage" : e.kind === "condition-application" ? "apply-condition" : Us(e) ? "apply-healing" : "apply-resource" } }
  };
}
function hd() {
  return { state: "disabled", button: { label: "✓ Aplicado", disabled: !0 } };
}
function Us(e) {
  return e.kind === "resource-operation" && (e.operation === "heal" || e.operation === "recover");
}
const cS = '[data-paranormal-toolkit-card-renderer="ritual-single-target"]';
function bd(e) {
  return dc(rS(e.state));
}
async function uS(e, t) {
  if (bd(t), await gd(e, t), t.messageId) {
    const n = document.querySelector(`[data-message-id="${mS(t.messageId)}"]`);
    n && Co(e, n);
  }
}
function Co(e, t) {
  const n = e.getFlag?.(d, "chatCard");
  if (!n || typeof n != "object" || n.schemaVersion !== 2) return !1;
  const a = dS(t), r = pd(n);
  if (!r) return qs(n, e, a, "invalid-state");
  try {
    const o = yd(a);
    return o.dataset.paranormalToolkitMessageId = typeof e.id == "string" ? e.id : "", o.innerHTML = bd(r), _d(a, o), !0;
  } catch (o) {
    return console.warn("Paranormal Toolkit: falha ao reidratar card ritual v2.", { messageId: e.id, stage: "renderer", cause: o }), qs(n, e, a, "renderer");
  }
}
function qs(e, t, n, a) {
  try {
    const r = tS(e);
    if (!r)
      return console.warn("Paranormal Toolkit: card ritual v2 inválido e sem fallback seguro; conteúdo original preservado.", { messageId: t.id, stage: a }), !1;
    const o = yd(n);
    return o.dataset.paranormalToolkitMessageId = typeof t.id == "string" ? t.id : "", o.classList.add("paranormal-toolkit-item-use-prompt"), o.innerHTML = fS(r), _d(n, o), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: o fallback seguro também falhou; conteúdo original preservado.", { messageId: t.id, stage: `${a}:fallback`, cause: r }), !1;
  }
}
function dS(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content") ?? e;
}
function yd(e) {
  const t = e.querySelector(cS);
  if (t) return t;
  const n = document.createElement("section");
  return n.dataset.paranormalToolkitCardRenderer = "ritual-single-target", n;
}
function _d(e, t) {
  Pr() === "replace" ? e.replaceChildren(t) : t.parentElement || e.append(t);
}
function mS(e) {
  return globalThis.CSS?.escape ? globalThis.CSS.escape(e) : e.replace(/["\\]/gu, "\\$&");
}
function fS(e) {
  const t = e.summaryLines.map((n) => `<li>${R(n)}</li>`).join("");
  return `<header><strong>${R(e.itemName)}</strong></header>${t ? `<ul>${t}</ul>` : ""}<p>O card interativo não pôde ser reidratado com segurança. Use o conteúdo original da mensagem.</p>`;
}
const Ad = "itemUsePrompts", Td = "chatCard", Kn = "data-paranormal-toolkit-prompt-id", Yn = "data-paranormal-toolkit-pending-id", So = "data-paranormal-toolkit-executed-label", fr = "data-paranormal-toolkit-choice-group", Rd = "data-paranormal-toolkit-skipped-label", _n = "data-paranormal-toolkit-action-section", js = "data-paranormal-toolkit-detail-key", zs = "data-paranormal-toolkit-roll-card", Io = "data-paranormal-toolkit-roll-detail-toggle", kd = "data-paranormal-toolkit-roll-detail-id", Ed = "data-paranormal-toolkit-resistance-roll-button", $d = "data-paranormal-toolkit-resistance-skill", wd = "data-paranormal-toolkit-resistance-skill-label", Cd = "data-paranormal-toolkit-resistance-target-actor-id", Sd = "data-paranormal-toolkit-resistance-target-name", Id = "data-paranormal-toolkit-resistance-roll-result", Gs = "data-paranormal-toolkit-system-card-replaced", pS = `[${Yn}]`, gS = `[${Io}]`, hS = `[${Ed}]`, pr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, bS = `${h}__actions`, Vs = `${h}__details`, Ld = `${h}__summary`, yS = `${h}__title`, vd = `${h}__button--executed`, Wt = `${h}__roll-card`, _S = "data-paranormal-toolkit-roll-card-target-mode", AS = "data-paranormal-toolkit-roll-card-target-names", TS = "data-paranormal-toolkit-roll-card-resistance", RS = "data-paranormal-toolkit-roll-card-resistance-skill", kS = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Hs = !1, gr = null;
const ee = /* @__PURE__ */ new Map(), ES = [0, 100, 500, 1500, 3e3], $S = 3e4, wS = [0, 100, 500, 1500, 3e3];
function CS(e) {
  if (gr = e, Hs) {
    Ks(e);
    return;
  }
  const t = (n, a) => {
    Dd(n, a, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Hs = !0, Ks(e);
}
async function Ws(e) {
  const t = vo(e);
  ee.set(e.pendingId, t), await xo(t) || Gd(t), xd(e.pendingId);
}
async function SS(e) {
  const t = vo({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", ee.set(e.pendingId, t), await xo(t) || Gd(t), xd(e.pendingId);
}
async function Ta(e, t) {
  const n = ee.get(e);
  ee.delete(e), n && await xI(n, t);
}
function Lo(e) {
  const t = Kd();
  for (const n of t) {
    const a = ce(n)[e];
    if (a) return { message: n, prompt: a };
  }
  return null;
}
async function IS(e, t) {
  const n = Lo(e);
  if (!n) return;
  const a = ce(n.message), r = a[e];
  r && (a[e] = {
    ...r,
    executedLabel: r.executedLabel,
    executed: !0
  }, await st(n.message, a));
}
async function LS(e, t, n) {
  if (!t) return;
  const a = Lo(e);
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
function vo(e) {
  const t = Re(e.context.message), n = e.context.targets.find((i) => _r(i)), a = n ? _r(n) : null, r = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? n?.name ?? r?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: oI(e.context),
    executed: !1
  };
}
function Dd(e, t, n) {
  DI();
  const a = Qn(t);
  if (!a) return;
  const r = te(e);
  if (r && Co(r, a)) return;
  const o = II(e, a);
  o.length > 0 && An(a);
  for (const i of o)
    hr(a, i);
  Fd(a, n), br(a), yr(a);
}
function vS(e) {
  const t = Oo(e.message);
  if (t) return t;
  const n = vo({ pendingId: `lookup-${Date.now()}`, context: e, mode: "ask" });
  return Mo(n);
}
function Ks(e) {
  for (const t of wS)
    globalThis.setTimeout(() => {
      DS(e);
    }, t);
}
function DS(e) {
  for (const t of xS()) {
    const n = Xn(t);
    NS(n) && Dd(n, t, e);
  }
}
function xS() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function NS(e) {
  return e ? No(e) ? !0 : PI(e).length > 0 : !1;
}
function xd(e) {
  const t = ee.get(e);
  if (!t) return;
  const n = t.messageId ? LI(t.messageId) : null;
  if (n) {
    Js(n, t), An(n), hr(n, t), Ys(n), br(n), yr(n);
    return;
  }
  if (t.messageId) {
    Tr(t);
    return;
  }
  const a = vI(t);
  if (a) {
    Js(a, t), An(a), hr(a, t), Ys(a), br(a), yr(a);
    return;
  }
  Tr(t);
}
function Ys(e) {
  gr && Fd(e, gr);
}
function An(e) {
  const t = PS();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Md(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Gs) === "true") return;
  const a = n.querySelector(`.${pr}`);
  a ? n.replaceChildren(a) : n.replaceChildren(), n.setAttribute(Gs, "true");
}
function PS() {
  try {
    return Pr() === "replace";
  } catch {
    return !1;
  }
}
function hr(e, t) {
  if (An(e), e.querySelector(`[${Kn}="${lt(t.pendingId)}"]`)) return;
  const n = MS(e, t);
  BS(n, t);
  const a = tI(t);
  if (OS(a)) return;
  eI(n, a).append(rI(t));
}
function OS(e) {
  return Pd(e.id) && !he();
}
function Nd(e) {
  const n = e.closest(`[${_n}]`)?.getAttribute(_n) ?? null;
  return Pd(n) && !he();
}
function Pd(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function MS(e, t) {
  const n = e.querySelector(`.${pr}`);
  if (n)
    return n;
  const a = document.createElement("section");
  a.classList.add(pr, h);
  const r = document.createElement("header");
  r.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(yS), i.textContent = FS(t);
  const l = document.createElement("span");
  return l.classList.add(Ld), l.textContent = t.summary, r.append(o, i, l), a.append(r), sI(e).append(a), a;
}
function FS(e) {
  const t = z(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function BS(e, t) {
  const n = t.summaryLines ?? [], a = jd(n, t);
  if (a) {
    US(e, a, t);
    return;
  }
  nI(e, n);
}
function US(e, t, n) {
  if (e.querySelector(`[${zs}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(
    Wt,
    `${Wt}--${t.intent}`,
    `${Wt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && a.classList.add(`${Wt}--multi-target`), a.setAttribute(zs, "true"), a.setAttribute(_S, t.targetMode), a.setAttribute(AS, JSON.stringify(t.targetNames)), YS(a, t), t.castingCheck && Xs(a, jS(t.castingCheck), n.pendingId, "casting"), qS(t) && Xs(a, zS(t), n.pendingId, "effect"), KS(a, t), XS(a, t, n), JS(a, t), e.append(a);
}
function qS(e) {
  return e.intent !== "casting";
}
function jS(e) {
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
function zS(e) {
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
function Xs(e, t, n, a) {
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
  GS(r, t), ZS(r, t.detailRows, n, a, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(r);
}
function GS(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const a = document.createElement("span");
  a.classList.add(`${h}__workflow-roll-formula`), a.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${h}__workflow-roll-total`), r.textContent = String(t.total), n.append(a, r);
  const o = VS(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function VS(e, t) {
  const n = HS(t);
  if (n.length === 0) return null;
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-dice-tray`);
  for (const r of WS(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), r.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(r.value), a.append(o);
  }
  return a;
}
function HS(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((a) => Number(a.trim())).filter((a) => Number.isFinite(a)).map((a) => Math.trunc(a)) : [];
}
function WS(e, t) {
  if (e.length <= 1) return e.map((a) => ({ value: a, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Qs(e, "highest") : n.includes("kl") ? Qs(e, "lowest") : e.map((a) => ({ value: a, active: !0 }));
}
function Qs(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let a = !1;
  return e.map((r) => {
    const o = !a && r === n;
    return o && (a = !0), { value: r, active: o };
  });
}
function KS(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(JI);
  if (n.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const r of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = r, a.append(o);
  }
  e.append(a);
}
function YS(e, t) {
  t.resistance && (e.setAttribute(TS, t.resistance), t.resistanceSkill && e.setAttribute(RS, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(kS, t.resistanceSkillLabel));
}
function XS(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const i = QS(t, n);
  r.append(o), i && r.append(i);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, a.append(r, l), t.resistanceRollResult && a.append(Od(t.resistanceRollResult)), e.append(a);
}
function QS(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !Te())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Kn, t.pendingId), n.setAttribute(Ed, "true"), n.setAttribute($d, e.resistanceSkill), n.setAttribute(wd, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Cd, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Sd, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Id, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const r = document.createElement("span");
  return r.classList.add(`${h}__resistance-roll-fallback`), r.textContent = "d20", n.append(a, r), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Od(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Ud(e), t;
}
function ZS(e, t, n, a, r) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const i = `${n}-roll-details-${a}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Io, i), l.setAttribute("aria-expanded", "false"), l.textContent = r;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(kd, i), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const p = document.createElement("dd");
    p.textContent = u.value, c.append(m, p);
  }
  e.append(l, c);
}
function JS(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const a of [...t.notes, ...t.details]) {
    const r = document.createElement("span");
    r.textContent = a, n.append(r);
  }
  e.append(n);
}
function eI(e, t) {
  const n = `[${_n}="${lt(t.id)}"]`, a = e.querySelector(n);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add(bS), r.setAttribute(_n, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, r.append(o), e.append(r), r;
}
function tI(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const a = jd(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function nI(e, t) {
  if (t.length === 0) return;
  const n = aI(e);
  for (const a of t) {
    const r = eL(a);
    if (n.querySelector(`[${js}="${lt(r)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(js, r), n.append(o);
  }
}
function aI(e) {
  const t = e.querySelector(`.${Vs}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Vs), e.append(n), n;
}
function rI(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Kn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(vd), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Yn, e.pendingId), t.setAttribute(So, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(fr, e.choiceGroupId), t.setAttribute(Rd, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function oI(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = iI(e);
  return `${t} → ${n}`;
}
function iI(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function sI(e) {
  return Md(e) ?? e;
}
function Md(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Fd(e, t) {
  const n = Qn(e);
  if (!n) return;
  const a = n.querySelectorAll(pS);
  for (const r of a) {
    if (Nd(r)) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitBound !== "true" && (r.dataset.paranormalToolkitBound = "true", r.addEventListener("click", () => {
      TI(r, t);
    }));
  }
}
function br(e) {
  const t = Qn(e);
  if (!t) return;
  const n = t.querySelectorAll(gS);
  for (const a of n)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      lI(t, a);
    }));
}
function yr(e) {
  const t = Qn(e);
  if (!t) return;
  const n = t.querySelectorAll(hS);
  for (const a of n) {
    if (!Te()) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      cI(t, a);
    }));
  }
}
function lI(e, t) {
  const n = t.getAttribute(Io);
  if (!n) return;
  const a = e.querySelector(`[${kd}="${lt(n)}"]`);
  if (!a) return;
  const r = a.hidden;
  a.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.textContent = r ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function cI(e, t) {
  if (!Te()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(Kn), a = t.getAttribute($d), r = t.getAttribute(wd) ?? (a ? De(a) : "Resistência");
  if (!n || !a) return;
  const o = mI(e, n), i = fI(o, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await zh(i, a);
    await yI(c.roll);
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
    uI(t, u), dI(t, u), _I(n, u), await AI(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${r}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function uI(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Id, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function dI(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const a = n.querySelector(`.${h}__resistance-roll-result`), r = a ?? Od(t);
  if (a) {
    a.textContent = Ud(t);
    return;
  }
  n.append(r);
}
function mI(e, t) {
  const n = ee.get(t);
  if (n) return n;
  const a = Xn(e);
  return ce(a)[t] ?? null;
}
function fI(e, t) {
  const n = e?.resistanceTargetActor;
  if (se(n)) return n;
  const r = e?.context?.targets.map(_r).find(se) ?? null;
  if (r) return r;
  const o = t.getAttribute(Cd) ?? e?.resistanceTargetActorId ?? null, i = o ? gI(o) : null;
  return i || hI(
    t.getAttribute(Sd) ?? e?.resistanceTargetName ?? pI(t)
  );
}
function pI(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Ld}`)?.textContent ?? null;
  if (!n) return null;
  const a = "→";
  if (!n.includes(a)) return null;
  const r = n.split(a), o = r[r.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function _r(e) {
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
function gI(e) {
  const n = game.actors?.get?.(e);
  return se(n) ? n : Bd().map((o) => wt(o)).find((o) => o?.id === e) ?? null;
}
function hI(e) {
  const t = We(e);
  if (!t) return null;
  const n = Bd().filter((o) => We(bI(o)) === t).map((o) => wt(o)).find(se) ?? null;
  if (n) return n;
  const r = game.actors?.find?.((o) => se(o) && We(o.name) === t);
  return se(r) ? r : null;
}
function Bd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function bI(e) {
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
function Ud(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function yI(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function _I(e, t) {
  const n = ee.get(e);
  n && (n.resistanceRollResult = t);
}
async function AI(e, t, n) {
  const a = Xn(e);
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
function Xn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages;
  return te(a?.get?.(n));
}
async function TI(e, t) {
  if (Nd(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(Yn);
  if (!n) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    qd(e, e.getAttribute(So) ?? "✓ Automação aplicada"), RI(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function qd(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(vd), e.removeAttribute(Yn), e.removeAttribute(So);
}
function RI(e) {
  const t = e.getAttribute(fr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const a = `[${fr}="${lt(t)}"]`;
  for (const r of n.querySelectorAll(a)) {
    if (r === e) continue;
    const o = r.getAttribute(Rd) ?? "✓ Outra opção escolhida";
    qd(r, o);
  }
}
function jd(e, t) {
  const n = e.map(Do).filter(QI), a = n.find((k) => k.intent !== "casting") ?? n[0] ?? null;
  if (!a) return null;
  const r = z(e, "Forma"), o = z(e, "Custo"), i = z(e, "Dados") ?? z(e, `Dados (${a.label})`), l = z(e, "Tipo"), c = z(e, "Resistência"), u = z(e, "Resistência Perícia"), m = z(e, "Resistência Rótulo") ?? (u ? De(u) : null), p = zd(e, "Observação"), _ = e.filter((k) => SI(k, a)), $ = wI(e), T = kI(t);
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
    details: _,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function kI(e) {
  const t = EI(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function EI(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && $I(n) !== "nenhum alvo") : [];
}
function $I(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function wI(e) {
  const t = e.map(Do).find((o) => o?.intent === "casting") ?? null, n = z(e, "Conjuração DT"), a = z(e, "Conjuração Resultado");
  if (!t || !n || !a) return null;
  const r = Number(n);
  return Number.isFinite(r) ? {
    label: t.formula,
    formula: z(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(r),
    success: a.toLowerCase() === "sucesso",
    diceBreakdown: z(e, "Dados (Conjuração)")
  } : null;
}
function Do(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, a, r] = t, o = Number(r);
  return Number.isFinite(o) ? {
    label: n,
    formula: a,
    total: o,
    intent: CI(n)
  } : null;
}
function CI(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function z(e, t) {
  return zd(e, t)[0] ?? null;
}
function zd(e, t) {
  const n = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(n)) return [];
    const r = a.slice(n.length).trim();
    return r.length > 0 ? [r] : [];
  });
}
function SI(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Do(e) ? !1 : e.trim().length > 0;
}
function II(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of ee.values())
    Ar(a, e, t) && n.set(a.pendingId, a);
  for (const a of NI(e))
    Ar(a, e, t) && !n.has(a.pendingId) && n.set(a.pendingId, a);
  return Array.from(n.values()).sort((a, r) => a.createdAt - r.createdAt);
}
function Ar(e, t, n) {
  const a = Re(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !Zs(n, "itemId", e.itemId) ? !1 : !e.actorId || Zs(n, "actorId", e.actorId);
}
function Zs(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const a = `data-${tL(t)}`;
  for (const r of e.querySelectorAll(`[${a}]`))
    if (r.getAttribute(a) === n)
      return !0;
  return !1;
}
function LI(e) {
  const t = lt(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function vI(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ar(e, null, t))
      return t;
  return null;
}
function DI() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, a] of ee.entries())
    e - a.createdAt > t && ee.delete(n);
}
async function Js(e, t) {
  const n = Xn(e);
  if (!n) return !1;
  try {
    const a = ce(n);
    return a[t.pendingId] = Po(t, Re(n)), await st(n, a), !0;
  } catch (a) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a), !1;
  }
}
async function xo(e) {
  const t = Mo(e);
  if (!t) return !1;
  try {
    const n = ce(t);
    return n[e.pendingId] = Po(e, Re(t)), await st(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Gd(e) {
  for (const t of ES)
    globalThis.setTimeout(() => {
      Tr(e);
    }, t);
}
async function Tr(e) {
  const t = Mo(e);
  if (No(t)?.prompts.some((r) => r.pendingId === e.pendingId))
    return !0;
  const a = await xo(e);
  return a || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), a;
}
async function xI(e, t) {
  const n = Oo(e.context.message);
  if (n)
    try {
      const a = ce(n), r = a[e.pendingId] ?? Po(e, Re(n));
      a[e.pendingId] = {
        ...r,
        executedLabel: t ?? r.executedLabel,
        executed: !0
      }, await st(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function NI(e) {
  return Object.values(ce(te(e))).filter(Ot);
}
function ce(e) {
  if (!e) return {};
  const t = {}, n = No(e);
  for (const a of n?.prompts ?? [])
    t[a.pendingId] = a;
  for (const [a, r] of Object.entries(Vd(e)))
    t[a] ??= r;
  return t;
}
function PI(e) {
  return Object.values(Vd(te(e))).filter(Ot);
}
function Vd(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Ad);
  if (!nt(t))
    return {};
  const n = {};
  for (const [a, r] of Object.entries(t))
    Ot(r) && (n[a] = r);
  return n;
}
async function st(e, t) {
  typeof e.setFlag == "function" && (await MI(e, t), await OI(e, t));
}
async function OI(e, t) {
  await Promise.resolve(e.setFlag?.(d, Ad, t));
}
function No(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Td);
  return YI(t) ? t : null;
}
async function MI(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Ot).sort((o, i) => o.createdAt - i.createdAt);
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
      actorName: FI(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Td, r));
}
function FI(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Po(e, t) {
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
function Oo(e) {
  const t = te(e);
  if (t?.setFlag)
    return t;
  const n = BI(e);
  if (n?.setFlag)
    return n;
  const a = Re(e);
  if (!a) return null;
  const r = game.messages;
  return te(r?.get?.(a));
}
function BI(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(te).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Mo(e) {
  const t = Oo(e.context.message);
  if (t) return t;
  const n = e.messageId ? UI(e.messageId) : null;
  if (n) return n;
  const a = Kd().slice().reverse();
  return a.find((r) => qI(r, e)) ?? a.find((r) => jI(r, e)) ?? null;
}
function UI(e) {
  const t = game.messages;
  return te(t?.get?.(e));
}
function qI(e, t) {
  const n = Re(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Hd(e, t)) return !1;
  const r = Wd(e);
  return !t.actorId || !r || r === t.actorId;
}
function jI(e, t) {
  if (!GI(e, t)) return !1;
  const n = Wd(e);
  return t.actorId && n === t.actorId ? !0 : Hd(e, t);
}
function Hd(e, t) {
  const n = We(zI(e));
  if (!n) return !1;
  const a = We(t.itemName);
  if (a && n.includes(a)) return !0;
  const r = We(t.itemId);
  return !!(r && n.includes(r));
}
function zI(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Wd(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function GI(e, t) {
  const n = VI(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= $S;
}
function VI(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function te(e) {
  return e && typeof e == "object" ? e : null;
}
function Ot(e) {
  return nt(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && W(e.messageId) && W(e.itemId) && W(e.actorId) && W(e.itemName) && Ce(e.resistanceTargetActorId) && Ce(e.resistanceTargetName) && XI(e.resistanceRollResult) && HI(e.actionPayload) && Ra(e.title) && Ra(e.buttonLabel) && Ra(e.executedLabel) && Ce(e.choiceGroupId) && Ce(e.skippedLabel) && Ce(e.actionSectionId) && Ce(e.actionSectionTitle) && ZI(e.summaryLines) : !1;
}
function HI(e) {
  return e == null ? !0 : nt(e) ? e.kind === "resource-operation" && W(e.actorId) && W(e.actorUuid) && typeof e.actorName == "string" && WI(e.resource) && KI(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function WI(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function KI(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function YI(e) {
  return nt(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && W(e.messageId) && nt(e.source) && W(e.source.actorId) && W(e.source.actorName) && W(e.source.itemId) && W(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ot) : !1;
}
function XI(e) {
  return e == null ? !0 : nt(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Ce(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function QI(e) {
  return e !== null;
}
function nt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function W(e) {
  return e === null || typeof e == "string";
}
function Ra(e) {
  return e === void 0 || typeof e == "string";
}
function Ce(e) {
  return e == null || typeof e == "string";
}
function ZI(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function JI(e) {
  return typeof e == "string" && e.length > 0;
}
function Kd() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(te).filter((a) => a !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(te).filter((a) => a !== null) : [];
}
function Qn(e) {
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
function eL(e) {
  return e.trim().toLowerCase();
}
function tL(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function lt(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Fo = "ritualResistanceOutcomes", nL = {
  success: "Sucesso",
  failure: "Falha"
};
function Yd() {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: [] },
      failure: { conditions: [] }
    }
  };
}
function Xd(e) {
  const t = e.getFlag(
    d,
    Fo
  );
  return Qd(t);
}
function aL(e) {
  return Xd(e) ?? Yd();
}
function Qd(e) {
  if (!Tn(e)) return null;
  const t = Tn(e.outcomes) ? e.outcomes : {};
  return {
    schemaVersion: 1,
    outcomes: {
      success: el(t.success),
      failure: el(t.failure)
    }
  };
}
function rL() {
  return Kr.map((e) => ({
    value: e.id,
    label: e.label
  })).sort((e, t) => e.label.localeCompare(t.label, "pt-BR"));
}
function Zd(e) {
  return Object.values(e.outcomes).some(
    (t) => t.conditions.length > 0
  );
}
function oL(e, t) {
  const n = t.resistance ?? Gn(e);
  if (!n) return t;
  const a = Xd(e);
  if (!a || !Zd(a))
    return t;
  const r = t.conditionApplications ?? [], o = new Set(r.map((l) => l.id)), i = iL(e, a).filter(
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
function iL(e, t) {
  return ["success", "failure"].flatMap(
    (n) => t.outcomes[n].conditions.map(
      (a, r) => sL(e, n, a, r)
    )
  );
}
function sL(e, t, n, a) {
  const r = Jd(n.conditionId), o = r?.id ?? n.conditionId, i = r?.label ?? uL(o);
  return {
    id: `generic-ritual-resistance-${t}-${a + 1}-${o}`,
    actor: "target",
    conditionId: o,
    label: `${nL[t]} · ${i}`,
    duration: n.rounds === null ? null : { rounds: n.rounds },
    source: `ritual.generic-resistance.${e.id ?? "item"}`,
    actionSectionId: "apply-effects",
    actionSectionTitle: "Aplicar efeito",
    executedLabel: `✓ ${i} aplicado`,
    applyOnResistance: t
  };
}
function el(e) {
  if (!Tn(e) || !Array.isArray(e.conditions))
    return { conditions: [] };
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e.conditions) {
    const r = lL(a);
    !r || n.has(r.conditionId) || (n.add(r.conditionId), t.push(r));
  }
  return { conditions: t };
}
function lL(e) {
  if (!Tn(e)) return null;
  const t = Jd(dL(e.conditionId));
  return t ? {
    conditionId: t.id,
    rounds: cL(e.rounds)
  } : null;
}
function Jd(e) {
  const t = tl(e);
  return t ? Kr.find((n) => [
    n.id,
    n.label,
    ...n.aliases ?? []
  ].some((r) => tl(r) === t)) ?? null : null;
}
function cL(e) {
  if (e == null || e === "") return null;
  const t = typeof e == "number" ? e : typeof e == "string" ? Number(e.trim()) : Number.NaN;
  if (!Number.isFinite(t)) return null;
  const n = Math.trunc(t);
  return n > 0 ? n : null;
}
function uL(e) {
  return e.trim().split(/[._-]+/u).filter((t) => t.length > 0).map(
    (t) => `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`
  ).join(" ");
}
function tl(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLocaleLowerCase();
}
function dL(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Tn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function mL(e) {
  if (e.mode === "legacy") return { eligible: !1, reason: "mode-legacy" };
  if (e.systemId !== "ordemparanormal") return { eligible: !1, reason: "unsupported-system" };
  if (e.context.item.type !== "ritual") return { eligible: !1, reason: "not-ritual" };
  if (e.snapshot.areaTargeting) return { eligible: !1, reason: "area-targeting" };
  if (e.context.targets.length === 0) return { eligible: !1, reason: "no-target" };
  if (e.context.targets.length > 1) return { eligible: !1, reason: "multiple-targets" };
  if (!e.context.actor?.id && !e.context.actor?.uuid) return { eligible: !1, reason: "missing-source" };
  if (!e.context.item.id && !e.context.item.uuid) return { eligible: !1, reason: "missing-item" };
  const t = e.context.targets[0]?.actor;
  return !t || !t.id && !t.uuid ? { eligible: !1, reason: "missing-target-actor" } : e.snapshot.rolls.some((n) => !["damage", "healing", "ritual", "generic"].includes(n.intent)) ? { eligible: !1, reason: "unsupported-roll-intent" } : e.snapshot.rolls.filter((n) => n.intent !== "ritual").length > 1 ? { eligible: !1, reason: "multiple-effect-rolls" } : e.actions.some((n) => !["resource-operation", "damage-application", "condition-application"].includes(n.kind)) ? { eligible: !1, reason: "unsupported-action" } : e.snapshot.resistance && e.resistanceDifficulty === null ? { eligible: !1, reason: "missing-resistance-difficulty" } : { eligible: !0 };
}
const fL = /* @__PURE__ */ new Set(["p", "br", "strong", "b", "em", "i", "ul", "ol", "li"]), nl = "__PTK_SAFE_HTML_";
function pL(e) {
  const t = e.system?.description;
  if (typeof t != "string" || !hL(t).trim()) return null;
  const n = gL(t);
  return n.trim() ? n : null;
}
function gL(e) {
  const t = e.replace(/<!--[\s\S]*?-->/gu, "").replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/giu, "").replace(/<(script|style|iframe|object|embed)\b[^>]*\/?\s*>/giu, ""), n = [], a = t.replace(/<\/?([a-z0-9]+)\b[^>]*>/giu, (o, i) => {
    const l = i.toLowerCase();
    if (!fL.has(l)) return "";
    const c = /^<\s*\//u.test(o), u = l === "br" ? "<br>" : c ? `</${l}>` : `<${l}>`, m = `${nl}${n.length}__`;
    return n.push(u), m;
  });
  let r = R(a);
  return n.forEach((o, i) => {
    r = r.replace(`${nl}${i}__`, o);
  }), r;
}
function hL(e) {
  return e.replace(/<[^>]*>/gu, "").replace(/&nbsp;/giu, " ");
}
function bL(e) {
  const { context: t, snapshot: n } = e;
  if (!t.actor) throw new Error("Conjurador ausente.");
  const a = t.targets[0];
  if (!a?.actor) throw new Error("Alvo ausente.");
  const r = e.now ?? Date.now(), o = n.rolls.find((i) => i.intent !== "ritual") ?? null;
  return {
    schemaVersion: 1,
    castId: n.castId,
    renderer: "single-target",
    source: rn(t.actor),
    item: rn(t.item),
    form: n.form,
    descriptionHtml: pL(t.item),
    cost: n.cost,
    target: { ...rn(a.actor), tokenId: a.tokenId, tokenUuid: a.sceneId && a.tokenId ? `Scene.${a.sceneId}.Token.${a.tokenId}` : null },
    conjuration: n.castingCheck ? { ...n.castingCheck, diceResults: yL(n.castingCheck.diceBreakdown), consequence: n.castingCheck.success ? null : "Falha na conjuração" } : null,
    mainRoll: o ? { id: o.id, label: o.intent === "damage" ? "Dano" : o.intent === "healing" ? "Cura" : "Efeito", intent: o.intent === "damage" || o.intent === "healing" ? o.intent : "utility", formula: o.formula, total: o.total, diceResults: o.diceResults, damageType: o.damageType } : null,
    resistance: n.resistance && e.resistanceDifficulty !== null ? { skill: n.resistance.skill, skillLabel: n.resistance.label, difficulty: e.resistanceDifficulty, effect: n.resistance.summary, status: "pending", result: null } : null,
    actions: e.actions.map((i, l) => _L(n.castId, i, l)),
    createdAt: r
  };
}
function rn(e) {
  return { id: e.id ?? null, uuid: e.uuid ?? null, name: e.name ?? "Documento sem nome" };
}
function yL(e) {
  return e?.match(/-?\d+/gu)?.map(Number).filter(Number.isFinite) ?? [];
}
function _L(e, t, n) {
  const a = { id: `${e}:action:${n + 1}`, state: t.kind === "condition-application" && t.resistanceOutcome && t.resistanceOutcome !== "always" ? "pending" : "available", label: t.label, executedLabel: t.executedLabel, actor: rn(t.actor), choiceGroupId: t.kind !== "condition-application" ? t.choiceGroupId ?? null : null, outcome: t.kind === "condition-application" && t.resistanceOutcome !== "always" ? t.resistanceOutcome ?? null : null, completedAt: null, completedByUserId: null };
  return t.kind === "resource-operation" ? { ...a, kind: t.kind, resource: t.resource, operation: t.operation, amount: t.amount } : t.kind === "damage-application" ? { ...a, kind: t.kind, instances: t.instances.map((r) => ({ ...r })), source: t.source, originUuid: t.originUuid } : { ...a, kind: t.kind, conditionId: t.conditionId, duration: t.duration ? structuredClone(t.duration) : null, source: t.source, originUuid: t.originUuid };
}
let al = !1, Rr = null;
function AL(e) {
  Rr = e, !al && (al = !0, document.addEventListener("click", (t) => {
    TL(t);
  }));
}
async function TL(e) {
  const t = e.target instanceof Element ? e.target.closest("[data-paranormal-toolkit-card-action]") : null, n = t?.closest('[data-paranormal-toolkit-card-renderer="ritual-single-target"]');
  if (!t || !n || !Rr) return;
  const a = n.dataset.paranormalToolkitMessageId, r = a ? CL(game.messages?.get?.(a)) : null;
  r && (t.disabled = !0, await RL({ message: r, messageId: a, actionId: t.dataset.paranormalToolkitActionId ?? null, kind: t.dataset.paranormalToolkitCardAction ?? "", executor: Rr, root: n }));
}
async function RL(e) {
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
        return { ...r, state: { ...r.state, actions: kr(r.state.actions, t, "executing") } };
      }
      const o = r.state.actions.find((i) => i.id === e.actionId);
      if (!o || o.state !== "available") throw new Error("Ação indisponível ou já executada.");
      return t = [o.id], { ...r, state: { ...r.state, actions: kr(r.state.actions, t, "executing") } };
    });
    if (e.kind === "roll-resistance") {
      const r = await rl(() => e.executor({ message: e.message, action: null, kind: e.kind, card: a }));
      n = r.ok || r.sideEffect === "uncertain", await kL(e.message, r), ol(r);
    } else {
      const r = /* @__PURE__ */ new Map();
      for (const o of t) {
        const i = wo(e.message) ?? a, l = i.state.actions.find((u) => u.id === o) ?? null, c = await rl(() => e.executor({ message: e.message, action: l, kind: e.kind, card: i }));
        (c.ok || c.sideEffect === "uncertain") && (n = !0), r.set(o, c);
      }
      await EL(e.message, t, r);
      for (const o of r.values()) ol(o);
    }
    il(e.message, e.root);
  } catch (a) {
    const r = n ? "finalize-after-side-effect" : "claim-or-execute";
    console.warn("Paranormal Toolkit: falha ao concluir interação do card ritual.", { messageId: e.messageId ?? e.message.id, actionId: e.actionId, stage: r, cause: a }), t.length && await $L(e.message, t, n ? "uncertain" : "available"), e.kind === "roll-resistance" && !n && await wL(e.message), ui.notifications?.warn(n ? "Paranormal Toolkit: a ação pode ter sido aplicada, mas não foi possível confirmar. Verifique o alvo antes de tentar novamente." : `Paranormal Toolkit: ${a instanceof Error ? a.message : "ação não executada"}`), il(e.message, e.root);
  }
}
async function kL(e, t) {
  await Pt(e, (n) => {
    if (!n.state.resistance) return n;
    if (!t.ok || !t.resistance) return { ...n, state: { ...n.state, resistance: { ...n.state.resistance, status: "pending" } } };
    const a = t.resistance.outcome;
    return { ...n, state: { ...n.state, resistance: { ...n.state.resistance, status: "completed", result: t.resistance }, actions: n.state.actions.map((r) => r.outcome ? { ...r, state: r.outcome === a ? "available" : "resolved" } : r) } };
  });
}
async function EL(e, t, n) {
  await Pt(e, (a) => {
    let r = a.state.actions.map((o) => {
      if (!t.includes(o.id)) return o;
      const i = n.get(o.id);
      return i ? i.ok ? { ...o, state: "completed", completedAt: (/* @__PURE__ */ new Date()).toISOString(), completedByUserId: SL() } : { ...o, state: i.sideEffect === "none" ? "available" : "uncertain" } : { ...o, state: "available" };
    });
    for (const o of t) {
      const i = r.find((l) => l.id === o);
      i?.state === "completed" && i.choiceGroupId && (r = r.map((l) => l.id !== o && l.choiceGroupId === i.choiceGroupId ? { ...l, state: "resolved" } : l));
    }
    return { ...a, state: { ...a.state, actions: r } };
  });
}
async function rl(e) {
  try {
    return await e();
  } catch (t) {
    return { ok: !1, sideEffect: "uncertain", message: t instanceof Error ? t.message : "falha inesperada durante a execução" };
  }
}
async function $L(e, t, n) {
  try {
    await Pt(e, (a) => ({ ...a, state: { ...a.state, actions: kr(a.state.actions, t, n) } }));
  } catch (a) {
    console.warn("Paranormal Toolkit: recovery de ações falhou.", { messageId: e.id, actionIds: t, stage: "recovery", cause: a });
  }
}
async function wL(e) {
  try {
    await Pt(e, (t) => t.state.resistance ? { ...t, state: { ...t.state, resistance: { ...t.state.resistance, status: "pending" } } } : t);
  } catch (t) {
    console.warn("Paranormal Toolkit: recovery da resistência falhou.", { messageId: e.id, stage: "resistance-recovery", cause: t });
  }
}
function kr(e, t, n) {
  return e.map((a) => t.includes(a.id) ? { ...a, state: n } : a);
}
function ol(e) {
  e.ok || ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function il(e, t) {
  t && wo(e) && Co(e, t.closest(".chat-message") ?? t);
}
function CL(e) {
  return e && typeof e == "object" ? e : null;
}
function SL() {
  const e = game.user?.id;
  return typeof e == "string" ? e : null;
}
const sl = 1e3;
class IL {
  constructor(t, n, a, r, o, i, l) {
    this.workflow = t, this.resources = n, this.damage = r, this.conditions = o, this.debugOutput = i, this.ritualAssistant = new Qw(
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
      settings: Da(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Da();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = Sr(t.item);
    if (!a.ok) {
      if (a.error.reason === "missing-automation" && FL(t.item) && n.executionMode === "ask") {
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
    if (await As(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: $a(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const r = xL(
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
      return this.pendingExecutions.delete(t), await Ta(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const a = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return a.ok ? (this.pendingExecutions.delete(t), await Ta(
      t,
      a.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Lo(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const a = n.prompt.actionPayload, r = qL(a);
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
    return o.ok ? (await IS(t), await LS(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (CS(
      (t) => this.executePendingAutomation(t)
    ), AL((t) => this.executeRitualCardAction(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n, a) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n, a);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await As(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: $a(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      BL(t.item),
      { type: "generic" }
    );
  }
  async handleAssistedRitual(t, n, a) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = oL(t.item, n), o = await this.ritualAssistant.run(t, r, a);
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
          je(o.workflowContext)
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
    const o = t.actor ? Wu(t.actor) : null, i = mL({ mode: Ql(), systemId: game.system.id, context: t, snapshot: n, actions: a, resistanceDifficulty: o });
    if (!i.eligible)
      return i.reason !== "mode-legacy" && f.warn("Fallback para card ritual legado.", { reason: i.reason, castId: n.castId, itemId: t.item.id, targetCount: t.targets.length, stage: "eligibility" }), !1;
    try {
      const l = bL({ context: t, snapshot: n, actions: a, resistanceDifficulty: o }), c = vS(t);
      if (!c) throw new Error("ChatMessage ainda não resolvida.");
      const u = { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: l.createdAt, messageId: typeof c.id == "string" ? c.id : null, state: l, legacyFallback: { summaryLines: [...r], itemName: t.item.name ?? "Ritual", actorId: t.actor?.id ?? null, itemId: t.item.id ?? null } };
      return await uS(c, u), !0;
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
      return r.ok ? (ML(n, r.value), await qa(r.value), {
        ok: !0,
        executedLabel: LL(r.value)
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
      const o = t.card.state.resistance;
      let i;
      try {
        i = await ll(t.card.state.target);
      } catch (l) {
        return { ok: !1, sideEffect: "none", message: l instanceof Error ? l.message : "não foi possível resolver o alvo." };
      }
      if (!o || !i) return { ok: !1, sideEffect: "none", message: "alvo ou resistência não encontrado." };
      try {
        const c = await new ru(new Hr(new Fn())).execute({ actor: i, skill: o.skill, skillLabel: o.skillLabel });
        return await ho(c.roll), { ok: !0, resistance: {
          skill: c.skill,
          skillLabel: c.skillLabel,
          formula: c.formula,
          total: c.total,
          diceResults: vL(c.roll),
          difficulty: o.difficulty,
          outcome: c.total >= o.difficulty ? "success" : "failure",
          targetActorId: i.id ?? null,
          targetActorUuid: i.uuid ?? null,
          targetName: i.name ?? t.card.state.target.name,
          rolledAt: (/* @__PURE__ */ new Date()).toISOString(),
          userId: DL(),
          usedFallbackBonus: !1
        } };
      } catch (l) {
        return { ok: !1, sideEffect: "none", message: l instanceof Error ? l.message : "não foi possível rolar resistência." };
      }
    }
    const n = t.action;
    if (!n) return { ok: !1, sideEffect: "none", message: "ação persistida não encontrada." };
    if (!he()) return { ok: !1, sideEffect: "none", message: "apenas o Mestre pode aplicar ações assistidas." };
    let a;
    try {
      a = await ll(n.actor);
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
      return o.ok ? (await qa(o.value), { ok: !0 }) : { ok: !1, sideEffect: "none", message: o.error.message };
    }
    const r = await this.conditions.applyCondition({ actor: a, conditionId: n.conditionId, duration: n.duration, originUuid: n.originUuid, source: n.source ?? "ritual.chat-card" });
    return r.ok ? { ok: !0 } : { ok: !1, sideEffect: "none", message: r.error.message };
  }
  async resolveAlternativeActions(t) {
    const n = ka(t.action);
    if (!n) return;
    const a = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, r]) => r.kind === "assisted-action" && ka(r.action) === n);
    for (const [r, o] of a)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(r), await Ta(
        r,
        cl(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const a = wa();
    await SS({
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
      const l = wa();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Ws({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: ka(i),
        skippedLabel: cl(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: r,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: UL(i)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      je(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const a = wa();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ws({
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
      je(r.value.context)
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
    const n = Date.now(), a = ul(t);
    for (const [o, i] of this.recentExecutionKeys.entries())
      n - i > sl && this.recentExecutionKeys.delete(o);
    const r = this.recentExecutionKeys.get(a);
    return r !== void 0 && n - r <= sl;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ul(t), Date.now());
  }
  setAttempt(t, n, a, r) {
    this.lastAttempt = $a(
      t,
      n,
      a,
      r
    );
  }
}
function LL(e) {
  return nu({ inputAmount: e.totalRawDamage });
}
async function ll(e) {
  if (e.uuid) {
    const n = await fromUuid(e.uuid);
    if (n && typeof n == "object" && "system" in n) return n;
  }
  const t = e.id ? game.actors?.get?.(e.id) : null;
  return t && typeof t == "object" && "system" in t ? t : null;
}
function vL(e) {
  const t = e.dice;
  return Array.isArray(t) ? t.flatMap((n) => Array.isArray(n.results) ? n.results.flatMap((a) => typeof a.result == "number" ? [a.result] : []) : []) : [];
}
function DL() {
  const e = game.user?.id;
  return typeof e == "string" ? e : null;
}
function xL(e, t) {
  if (t.resistance || !NL(t))
    return t;
  const n = Gn(e);
  return n ? { ...t, resistance: n } : t;
}
function NL(e) {
  return PL(e) && !OL(e);
}
function PL(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function OL(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function ka(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function cl(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function ML(e, t) {
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
function FL(e) {
  return e.type === "ritual";
}
function BL(e) {
  return GE(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function UL(e) {
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
function qL(e) {
  const t = e.actorUuid ? jL(e.actorUuid) : null;
  if (at(t)) return t;
  const n = e.actorId ? zL(e.actorId) : null;
  return n || GL(e.actorName);
}
function jL(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function zL(e) {
  const n = game.actors?.get?.(e);
  if (at(n)) return n;
  for (const a of em()) {
    const r = Bo(a);
    if (r?.id === e) return r;
  }
  return null;
}
function GL(e) {
  const t = Ea(e);
  if (!t) return null;
  for (const r of em()) {
    const o = VL(r);
    if (Ea(o) === t) {
      const i = Bo(r);
      if (i) return i;
    }
  }
  const a = game.actors?.find?.(
    (r) => at(r) && Ea(r.name) === t
  );
  return at(a) ? a : null;
}
function em() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function VL(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Bo(e)?.name ?? null;
}
function Bo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (at(t)) return t;
  const n = e.document?.actor;
  return at(n) ? n : null;
}
function Ea(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function at(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function $a(e, t, n, a) {
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
function ul(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function wa() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class HL {
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
class WL {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, a = KL(t);
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
      reason: YL(a, n.preset)
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
function KL(e) {
  const t = e.getFlag(d, "automation");
  return Ir(t) ? t : null;
}
function YL(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Kt(e) {
  return (t) => t.status === e;
}
class XL {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), a = vr(t.transaction);
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
    const n = Yt(t.actorName), a = Yt(t.resource), r = Yt(QL(t)), o = Yt(ZL(t));
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
function QL(e) {
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
function ZL(e) {
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
function JL() {
  const e = new _k(), t = new fE(e), n = new xc(new Dc()), a = new Hr(new Fn()), r = new pE(new Hu()), o = new Rk(), i = new Ok(o), l = new qk(e), c = new zk(), u = c.registerMany(
    rf()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new jk(), p = new Bk(), _ = qc(), $ = new Oc(_), T = new WL(
    c
  ), k = new HL(
    T,
    m,
    p
  ), b = new yE(), L = new XL(b), E = new bE(), D = new mE(), G = new uE(
    t,
    i,
    L,
    E
  ), q = new hE(G, E), x = new IL(
    q,
    t,
    i,
    n,
    $,
    b,
    D
  );
  return x.addStrategy(
    new gc(
      (H) => x.handleItemUsed(H)
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
    conditionRegistry: _,
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
const { ApplicationV2: ev } = foundry.applications.api;
class Rn extends ev {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${oe(xl)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${oe(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ca("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ca("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ca("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ca(e, t, n, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
        <span>${oe(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? tv(n) : av(t)}
    </section>
  `;
}
function tv(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(nv).join("")}</ol>`;
}
function nv(e) {
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
function av(e) {
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
const kn = `${d}.manageRitualPresets`, dl = `__${d}_ritualPresetHeaderControlRegistered`, rv = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function ov(e) {
  const t = globalThis;
  if (!t[dl]) {
    for (const n of rv)
      Hooks.on(n, (a, r) => {
        iv(a, r, e);
      });
    t[dl] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function iv(e, t, n) {
  Array.isArray(t) && lv(e) && (sv(e, n), !t.some((a) => a.action === kn) && t.push({
    action: kn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), tm(e, n);
    }
  }));
}
function sv(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[kn] && (e.options.actions[kn] = (n) => {
    n.preventDefault(), n.stopPropagation(), tm(e, t);
  }));
}
function lv(e) {
  if (!game.user?.isGM) return !1;
  const t = nm(e);
  return t ? t.type === "agent" && It(t).length > 0 : !1;
}
function tm(e, t) {
  const n = nm(e);
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
function nm(e) {
  return ml(e.actor) ? e.actor : ml(e.document) ? e.document : null;
}
function ml(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Er = "data-paranormal-toolkit-stylesheet";
function cv(e) {
  const t = pv(e), n = uv(t), a = mv(n), r = dv(n, t);
  if (r)
    return r.href = a, r.setAttribute(Er, t), r;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = a, o.setAttribute(Er, t), document.head.append(o), o;
}
function uv(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, a = n.getRoute;
  return typeof a == "function" ? a.call(n, t) : t;
}
function dv(e, t) {
  const n = fl(e);
  for (const a of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (a.getAttribute(Er) === t || fl(a.href) === n)
      return a;
  return null;
}
function mv(e) {
  const t = fv();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function fv() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function fl(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function pv(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function Ie(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const a = document.createElement("span");
  return a.textContent = e, n.append(a, t), n;
}
function $r(e, t, n) {
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
function am(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const a = document.createElement("i");
  return a.className = t, n.append(a), n;
}
function mt(e, t, n = !1) {
  const a = document.createElement("option");
  return a.value = e, a.textContent = t, a.selected = n, a;
}
function gv(e) {
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
  const p = am("Remover rolagem", "fa-solid fa-trash");
  p.disabled = !a, p.addEventListener("click", o), l.append(c, p);
  const _ = document.createElement("div");
  _.classList.add(`${d}-ability-roll-config__fields`);
  const $ = $r(
    t.label,
    "Ex.: Dano adicional",
    a
  );
  $.addEventListener("input", () => {
    t.label = $.value, r();
  }), _.append(Ie("Nome da rolagem", $));
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
        Kp(C),
        t.intent === C
      )
    );
  T.addEventListener("change", () => {
    t.intent = _v(T.value), ne(), r();
  }), _.append(Ie("Tipo da rolagem", T));
  const k = document.createElement("div");
  k.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), _.append(k);
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
      steps: bv(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, H(), Me(), r();
  }), i.append(l, _, b), H(), ne(), Me(), i;
  function H() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function ne() {
    k.replaceChildren();
    const C = t.intent === "damage";
    if (_.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), k.hidden = !C, !C) return;
    const O = document.createElement("select");
    O.disabled = !a, O.append(mt("", "—", !t.damageType));
    for (const { value: ae, label: S } of bc)
      O.append(mt(ae, S, t.damageType === ae));
    O.addEventListener("change", () => {
      t.damageType = O.value || null, r();
    }), k.append(Ie("Tipo de dano", O));
  }
  function Me() {
    if (x.replaceChildren(), t.formula.mode === "fixed") {
      const I = $r(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        a
      );
      I.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = I.value, r());
      }), x.append(Ie("Expressão", I));
      return;
    }
    const C = t.formula, O = document.createElement("select");
    O.disabled = !a, O.append(
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
    ), O.addEventListener("change", () => {
      C.resolution = Av(O.value), r();
    }), x.append(Ie("Comportamento", O));
    const ae = document.createElement("div");
    ae.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((I, ue) => {
      ae.append(
        hv({
          step: I,
          editable: a,
          onChange: r,
          onRemove: () => {
            C.steps.splice(ue, 1), Me(), r();
          }
        })
      );
    }), x.append(ae);
    const S = on(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    S.disabled = !a || C.steps.length >= Ma, S.addEventListener("click", () => {
      C.steps.length >= Ma || (C.steps.push({
        minNex: yv(
          C.steps.map((I) => I.minNex)
        ),
        formula: ""
      }), Me(), r());
    }), x.append(S);
  }
}
function hv(e) {
  const { step: t, editable: n, onChange: a, onRemove: r } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const i = document.createElement("input");
  i.type = "number", i.min = "0", i.max = "99", i.step = "1", i.value = String(t.minNex), i.disabled = !n, i.setAttribute("aria-label", "NEX mínimo"), i.addEventListener("change", () => {
    t.minNex = Tv(Number(i.value)), i.value = String(t.minNex), a();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(i, c);
  const u = $r(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, a();
  });
  const m = am("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", r), o.append(
    Ie("NEX mínimo", l),
    Ie("Fórmula", u),
    m
  ), o;
}
function bv(e) {
  const t = Up(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function yv(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function _v(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function Av(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function Tv(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function Rv(e) {
  let t = Sa(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const a = kv(t), r = document.createElement("p");
  r.classList.add(`${d}-ability-roll-config__hint`), r.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const i = on(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  i.addEventListener("click", () => {
    t.rolls.length >= Oa || (t.rolls.push(_c(t.rolls.length + 1)), _(), L("Rolagem adicionada. Salve para confirmar."));
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
  }), _(), n;
  function _() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const E = document.createElement("p");
      E.classList.add(`${d}-ability-roll-config__empty`), E.textContent = "Nenhuma rolagem configurada.", o.append(E);
    } else
      t.rolls.forEach((E, D) => {
        o.append(
          gv({
            roll: E,
            index: D,
            editable: e.editable,
            onChange: () => {
              wr(a, t), L("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(D, 1), _(), L("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    wr(a, t), b(!1);
  }
  async function $() {
    k(!0), L("Salvando configuração...");
    try {
      const E = Fr(t);
      if (!E) throw new Error("Configuração inválida.");
      t = Sa(await e.onSave(E)), _(), L("Configuração salva.");
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
      t = Sa(await e.onClear()), _(), L("Configuração removida.");
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
    c.disabled = E || !e.editable, u.disabled = E || !e.editable, i.disabled = E || !e.editable || t.rolls.length >= Oa;
  }
  function L(E) {
    p.textContent = E;
  }
}
function kv(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const a = document.createElement("strong");
  a.textContent = "Paranormal Toolkit";
  const r = document.createElement("span");
  r.textContent = "Fórmulas de rolagem", n.append(a, r);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), wr(t, e), t;
}
function wr(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = Yp(t) ? "Configurada" : "Rascunho");
}
function Sa(e) {
  return JSON.parse(JSON.stringify(e));
}
const Ev = "[data-paranormal-toolkit-ability-roll-config]", pl = `__${d}_abilityRollConfigBlockRegistered`, $v = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function wv() {
  const e = globalThis;
  if (!e[pl]) {
    cv("styles/ability-roll-config.css");
    for (const t of $v)
      Hooks.on(t, (...n) => {
        Cv(n[0], n[1]);
      });
    e[pl] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function Cv(e, t) {
  const n = Iv(e);
  if (!n || n.type !== "ability") return;
  const a = vv(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!r) return;
  for (const i of Array.from(
    r.querySelectorAll(Ev)
  ))
    i.remove();
  const o = Rv({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: jp(n),
    editable: Lv(n),
    onSave: async (i) => {
      const l = await zp(n, i);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Gp(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), yc())
  });
  Sv(r, o);
}
function Sv(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function Iv(e) {
  return gl(e.item) ? e.item : gl(e.document) ? e.document : null;
}
function Lv(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function vv(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function gl(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Cr = "data-paranormal-toolkit-ritual-resistance-outcome-editor", En = "data-paranormal-toolkit-ritual-resistance-outcome", $n = "data-paranormal-toolkit-ritual-resistance-outcome-row", wn = "data-paranormal-toolkit-ritual-resistance-outcome-field", Cn = "data-paranormal-toolkit-ritual-resistance-outcome-editor-action", Dv = {
  success: "Sucesso na resistência",
  failure: "Falha na resistência"
}, xv = rL();
function Nv(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${d}-ritual-resistance-outcomes__grid`), n.setAttribute(Cr, "true"), n.append(
    hl(
      "success",
      e.outcomes.success.conditions,
      t
    ),
    hl(
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
          Ov(n, o);
          return;
        case "remove":
          Mv(o);
          return;
      }
  }), n;
}
function Pv(e) {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: bl(e, "success") },
      failure: { conditions: bl(e, "failure") }
    }
  };
}
function rm(e, t, n) {
  for (const a of ["success", "failure"]) {
    const r = Uo(e, a);
    r && r.replaceChildren(
      ...om(t.outcomes[a].conditions).map(
        (o) => Zn(a, o, n)
      )
    );
  }
}
function hl(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-resistance-outcomes__card`), a.setAttribute(En, e);
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-resistance-outcomes__card-title`), r.textContent = Dv[e], a.append(r);
  const o = document.createElement("div");
  o.classList.add(`${d}-ritual-resistance-outcomes__rows`), o.append(
    ...om(t).map(
      (l) => Zn(e, l, n)
    )
  ), a.append(o);
  const i = document.createElement("button");
  return i.type = "button", i.textContent = "+ Adicionar condição", i.disabled = !n, i.classList.add(`${d}-ritual-resistance-outcomes__add`), i.setAttribute(Cn, "add"), i.setAttribute(En, e), a.append(i), a;
}
function Zn(e, t, n) {
  const a = document.createElement("div");
  a.classList.add(`${d}-ritual-resistance-outcomes__row`), a.setAttribute($n, e);
  const r = yl("Condição");
  r.classList.add(
    `${d}-ritual-resistance-outcomes__condition-field`
  );
  const o = document.createElement("select");
  o.disabled = !n, o.setAttribute(wn, "conditionId");
  const i = document.createElement("option");
  i.value = "", i.textContent = "Nenhuma condição", i.selected = t.conditionId.length === 0, o.append(i);
  for (const m of xv) {
    const p = document.createElement("option");
    p.value = m.value, p.textContent = m.label, p.selected = t.conditionId === m.value, o.append(p);
  }
  r.append(o);
  const l = yl("Rodadas");
  l.classList.add(
    `${d}-ritual-resistance-outcomes__rounds-field`
  );
  const c = document.createElement("input");
  c.type = "number", c.min = "1", c.step = "1", c.placeholder = "Sem limite", c.value = t.rounds === null ? "" : String(t.rounds), c.disabled = !n, c.setAttribute(wn, "rounds"), l.append(c);
  const u = document.createElement("button");
  return u.type = "button", u.textContent = "×", u.title = "Remover condição", u.setAttribute("aria-label", u.title), u.disabled = !n, u.classList.add(`${d}-ritual-resistance-outcomes__remove`), u.setAttribute(Cn, "remove"), a.append(r, l, u), a;
}
function bl(e, t) {
  const n = Uo(e, t);
  return n ? Array.from(
    n.querySelectorAll(`[${$n}]`)
  ).flatMap((a) => {
    const r = a.querySelector(
      `[${wn}="conditionId"]`
    )?.value.trim();
    if (!r) return [];
    const o = a.querySelector(`[${wn}="rounds"]`)?.value.trim();
    return [{ conditionId: r, rounds: Fv(o) }];
  }) : [];
}
function Ov(e, t) {
  const n = im(
    t.getAttribute(En)
  );
  if (!n) return;
  Uo(e, n)?.append(Zn(n, qo(), !0));
}
function Mv(e) {
  const t = e.closest(`[${$n}]`), n = im(t?.getAttribute($n)), a = t?.parentElement;
  !t || !n || !a || (t.remove(), a.childElementCount === 0 && a.append(Zn(n, qo(), !0)));
}
function Uo(e, t) {
  return (e.matches(`[${Cr}]`) ? e : e.querySelector(`[${Cr}]`))?.querySelector(
    `.${d}-ritual-resistance-outcomes__card[${En}="${t}"]`
  )?.querySelector(
    `.${d}-ritual-resistance-outcomes__rows`
  ) ?? null;
}
function om(e) {
  return e.length > 0 ? e : [qo()];
}
function qo() {
  return { conditionId: "", rounds: null };
}
function yl(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-resistance-outcomes__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Fv(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = Number(e);
  if (!Number.isFinite(t)) return null;
  const n = Math.trunc(t);
  return n > 0 ? n : null;
}
function im(e) {
  return e === "success" || e === "failure" ? e : null;
}
const jo = "data-paranormal-toolkit-ritual-resistance-outcomes", _l = "data-paranormal-toolkit-ritual-roll-section-title", Bv = "data-paranormal-toolkit-ritual-roll-field", Al = "data-paranormal-toolkit-ritual-roll-action", Tl = "data-paranormal-toolkit-ritual-unified-actions-bound", Rl = `__${d}_ritualResistanceOutcomeBlockRegistered`, Uv = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function qv() {
  const e = globalThis;
  if (!e[Rl]) {
    for (const t of Uv)
      Hooks.on(t, (...n) => {
        jv(
          n[0],
          n[1]
        );
      });
    e[Rl] = !0, f.info(
      "Seção de efeitos por resistência registrada na configuração genérica de ritual."
    );
  }
}
function jv(e, t) {
  const n = Jv(e);
  if (!n || n.type !== "ritual") return;
  const a = t0(t);
  if (!a) return;
  const r = a.querySelector(
    'section[data-tab="ritualAttr"]'
  );
  if (!r) return;
  const o = r.querySelector(
    "[data-paranormal-toolkit-ritual-roll-config]"
  );
  if (!o) return;
  Vv(o), zv(o);
  const i = aL(n), l = e0(n), c = Gn(n), u = Hv(
    i,
    l,
    c?.summary ?? null
  );
  Gv(o, u), Wv(o, n, l), zo(o, i);
}
function zv(e) {
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
  e.querySelector(`[${_l}]`)?.remove();
  const r = document.createElement("strong");
  r.classList.add(
    `${d}-ritual-resistance-outcomes__formula-title`
  ), r.setAttribute(_l, "true"), r.textContent = "Fórmula de rolagem", a.insertAdjacentElement("beforebegin", r);
}
function Gv(e, t) {
  const n = e.querySelector(
    `.${d}-ritual-roll-config__actions`
  );
  if (n) {
    n.insertAdjacentElement("beforebegin", t);
    return;
  }
  e.append(t);
}
function Vv(e) {
  for (const t of Array.from(
    e.querySelectorAll(`[${jo}]`)
  ))
    t.remove();
}
function Hv(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-resistance-outcomes`), a.setAttribute(jo, "true");
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-resistance-outcomes__section-title`), r.textContent = "Efeitos da resistência", a.append(r);
  const o = document.createElement("p");
  return o.classList.add(`${d}-ritual-resistance-outcomes__hint`), o.textContent = n ? `${n}. Configure quais condições ficam disponíveis em cada resultado.` : "Configure uma perícia e um resultado de resistência nos campos do sistema antes de usar estes efeitos.", a.append(o), a.append(Nv(e, t)), a;
}
function Wv(e, t, n) {
  const a = e.querySelector(
    `button[${Al}="save"]`
  ), r = e.querySelector(
    `button[${Al}="clear"]`
  );
  a && (a.textContent = "Salvar configuração"), r && (r.textContent = "Limpar configuração"), !e.hasAttribute(Tl) && (e.setAttribute(Tl, "true"), a?.addEventListener(
    "click",
    (o) => {
      if (o.preventDefault(), o.stopImmediatePropagation(), !n) return;
      const i = kl(e);
      i && Kv(e, i, t, a, r);
    },
    { capture: !0 }
  ), r?.addEventListener(
    "click",
    (o) => {
      if (o.preventDefault(), o.stopImmediatePropagation(), !n) return;
      const i = kl(e);
      i && Yv(e, i, t, a, r);
    },
    { capture: !0 }
  ));
}
function kl(e) {
  return e.querySelector(`[${jo}]`);
}
async function Kv(e, t, n, a, r) {
  Sn(a, r, !0), Ke(e, "Salvando configuração...");
  try {
    const o = sm(e), i = Qd(
      Pv(t)
    );
    if (!o || !i)
      throw new Error("Configuração genérica do ritual inválida.");
    await cm(n).update({
      [`flags.${d}.${et}`]: o,
      [`flags.${d}.${Fo}`]: i
    }), lm(e, o), rm(
      t,
      i,
      !0
    ), zo(e, i), Ke(e, "Configuração salva."), ui.notifications?.info(
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
async function Yv(e, t, n, a, r) {
  Sn(a, r, !0), Ke(e, "Limpando configuração...");
  try {
    await cm(n).update({
      [`flags.${d}.-=${et}`]: null,
      [`flags.${d}.-=${Fo}`]: null
    });
    const o = Nt(), i = Yd();
    lm(e, o), rm(
      t,
      i,
      !0
    ), zo(e, i), Ke(e, "Configuração removida."), ui.notifications?.info(
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
function sm(e) {
  const t = Zv(
    Go(e, "intent")?.value
  );
  return t ? bn({
    schemaVersion: 1,
    intent: t,
    damageType: El(e, "damageType"),
    utilityLabel: El(e, "utilityLabel") ?? "Resultado",
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
function lm(e, t) {
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
  ), Xv(e, t.intent);
}
function Xv(e, t) {
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
function zo(e, t) {
  const n = e.querySelector(
    `.${d}-ritual-roll-config__badge`
  );
  if (!n) return;
  const a = sm(e);
  n.textContent = a && Qv(a) || Zd(t) ? "Configurada" : "Rascunho";
}
function Qv(e) {
  return Object.values(e.forms).some(
    (t) => t.formula.trim().length > 0
  );
}
function Go(e, t) {
  return e.querySelector(
    `[${Bv}="${t}"]`
  );
}
function sn(e, t) {
  return Go(
    e,
    t
  )?.value.trim() ?? "";
}
function El(e, t) {
  const n = sn(e, t);
  return n.length > 0 ? n : null;
}
function Ue(e, t, n) {
  const a = Go(
    e,
    t
  );
  a && (a.value = n);
}
function Zv(e) {
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
function cm(e) {
  if (typeof e.update != "function")
    throw new Error("O item não suporta atualização de configuração.");
  return e;
}
function Jv(e) {
  return $l(e.item) ? e.item : $l(e.document) ? e.document : null;
}
function e0(e) {
  return !!(game.user?.isGM || e.isOwner);
}
function t0(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function $l(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const um = "data-paranormal-toolkit-ritual-roll-config", Mt = "data-paranormal-toolkit-ritual-roll-field", xe = "data-paranormal-toolkit-ritual-roll-action", wl = `__${d}_ritualRollConfigBlockRegistered`, n0 = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], a0 = [
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
function r0() {
  const e = globalThis;
  if (!e[wl]) {
    o0();
    for (const t of n0)
      Hooks.on(t, (...n) => {
        i0(n[0], n[1]);
      });
    e[wl] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function o0() {
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
function i0(e, t) {
  const n = A0(e);
  if (!n || n.type !== "ritual") return;
  const a = k0(t);
  if (!a) return;
  const r = a.querySelector('section[data-tab="ritualAttr"]');
  if (!r) return;
  l0(r);
  const o = mm(n), i = ad(n), l = T0(n), c = c0(n, i, o, l);
  g0(c, n, o, l), s0(r, c), Vo(c);
}
function s0(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function l0(e) {
  for (const t of Array.from(e.querySelectorAll(`[${um}]`)))
    t.remove();
}
function c0(e, t, n, a) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config`), r.setAttribute(um, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${d}-ritual-roll-config__title`), i.append(Cl("strong", "Paranormal Toolkit")), i.append(Cl("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = pm(t) ? "Configurada" : "Rascunho", o.append(i, l), r.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", r.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(u0(t, a)), u.append(d0(t, a)), u.append(m0(t, a)), r.append(u), r.append(f0(t, n, a)), r.append(p0(a));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = a ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", r.append(m), r;
}
function u0(e, t) {
  const n = Jn("Tipo da rolagem"), a = document.createElement("select");
  a.setAttribute(Mt, "intent"), a.disabled = !t;
  for (const r of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = r, o.textContent = zE(r), o.selected = e.intent === r, a.append(o);
  }
  return n.append(a), n;
}
function d0(e, t) {
  const n = Jn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const a = document.createElement("select");
  a.setAttribute(Mt, "damageType"), a.disabled = !t;
  const r = document.createElement("option");
  r.value = "", r.textContent = "—", r.selected = !e.damageType, a.append(r);
  for (const o of a0) {
    const i = document.createElement("option");
    i.value = o.value, i.textContent = o.label, i.selected = e.damageType === o.value, a.append(i);
  }
  return n.append(a), n;
}
function m0(e, t) {
  const n = Jn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const a = document.createElement("input");
  return a.type = "text", a.placeholder = "Resultado", a.value = e.utilityLabel ?? "Resultado", a.disabled = !t, a.setAttribute(Mt, "utilityLabel"), n.append(a), n;
}
function f0(e, t, n) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config__forms-section`);
  const r = document.createElement("strong");
  r.classList.add(`${d}-ritual-roll-config__forms-title`), r.textContent = "Fórmulas por forma", a.append(r);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(Ia("base", "Padrão", e.forms.base.formula, !0, n)), o.append(Ia("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(Ia("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), a.append(o), a;
}
function Ia(e, t, n, a, r) {
  const o = Jn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !r || !a, i.setAttribute(Mt, `formula.${e}`), o.append(i), !a) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function p0(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(xe, "save");
  const a = document.createElement("button");
  return a.type = "button", a.textContent = "Limpar", a.disabled = !e, a.setAttribute(xe, "clear"), t.append(n, a), t;
}
function Jn(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Cl(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function g0(e, t, n, a) {
  ct(e, "intent")?.addEventListener("change", () => Vo(e)), Ll(e, "system.studentForm")?.addEventListener("change", () => Sl(e, t)), Ll(e, "system.trueForm")?.addEventListener("change", () => Sl(e, t)), e.querySelector(`[${xe}="save"]`)?.addEventListener("click", () => {
    a && h0(e, t, n);
  }), e.querySelector(`[${xe}="clear"]`)?.addEventListener("click", () => {
    a && b0(e, t);
  });
}
async function h0(e, t, n) {
  const a = e.querySelector(`[${xe}="save"]`);
  a?.setAttribute("disabled", "true"), Ye(e, "Salvando configuração...");
  try {
    const r = y0(e, n);
    await qE(t, r), dm(e, r), Ye(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", r), Ye(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    a?.removeAttribute("disabled");
  }
}
async function b0(e, t) {
  const n = e.querySelector(`[${xe}="clear"]`);
  n?.setAttribute("disabled", "true"), Ye(e, "Limpando configuração...");
  try {
    await jE(t);
    const a = ad(t);
    _0(e, a), dm(e, a), Ye(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", a), Ye(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function dm(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = pm(t) ? "Configurada" : "Rascunho");
}
function y0(e, t) {
  return {
    schemaVersion: 1,
    intent: fm(ct(e, "intent")?.value),
    damageType: vl(e, "damageType"),
    utilityLabel: vl(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: ln(e, "formula.base") },
      discente: { formula: ln(e, "formula.discente") },
      verdadeiro: { formula: ln(e, "formula.verdadeiro") }
    }
  };
}
function _0(e, t) {
  qe(e, "intent", t.intent), qe(e, "damageType", t.damageType ?? ""), qe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), qe(e, "formula.base", t.forms.base.formula), qe(e, "formula.discente", t.forms.discente.formula), qe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Vo(e);
}
function Vo(e) {
  const t = fm(ct(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), a = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const r of Array.from(n))
    r.hidden = t !== "damage";
  for (const r of Array.from(a))
    r.hidden = t !== "utility";
}
function Sl(e, t) {
  const n = mm(t);
  Il(e, "discente", n.discente), Il(e, "verdadeiro", n.verdadeiro);
}
function Il(e, t, n) {
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
function mm(e) {
  const t = R0(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function A0(e) {
  return Dl(e.item) ? e.item : Dl(e.document) ? e.document : null;
}
function T0(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function R0(e) {
  const t = e.system;
  return E0(t) ? t : {};
}
function Ll(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ct(e, t) {
  return e.querySelector(`[${Mt}="${$0(t)}"]`);
}
function ln(e, t) {
  return ct(e, t)?.value.trim() ?? "";
}
function vl(e, t) {
  const n = ln(e, t);
  return n.length > 0 ? n : null;
}
function qe(e, t, n) {
  const a = ct(e, t);
  a && (a.value = n);
}
function fm(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function pm(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function k0(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Dl(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function E0(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function $0(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let re = null;
Hooks.once("init", () => {
  ef(), Nf(), oh(), ik(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!si.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${si.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  re = JL(), re.itemUseIntegration.registerStrategies(), Yg(re.resources, re.resourceAdapter), th(re.conditions), Cp(re), mk(), ov(re), r0(), qv(), wv(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function w0() {
  if (!re)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return re;
}
export {
  w0 as getToolkitServices
};
//# sourceMappingURL=main.js.map
