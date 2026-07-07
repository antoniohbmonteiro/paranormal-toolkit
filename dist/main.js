const u = "paranormal-toolkit", ur = "Paranormal Toolkit", ec = "ordemparanormal";
class Xe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function vt(e) {
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
function Se(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : dr(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function tc(e) {
  return dr(e.getFlag(u, "automation"));
}
function dr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && rc(t.source) && nc(t.definition);
}
function nc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(ac) && (t.ritualForms === void 0 || uc(t.ritualForms)) && (t.conditionApplications === void 0 || gc(t.conditionApplications));
}
function rc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function ac(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return oc(t);
    case "spendRitualCost":
      return ic(t);
    case "rollFormula":
      return sc(t);
    case "modifyResource":
      return lc(t);
    case "chatCard":
      return cc(t);
    default:
      return !1;
  }
}
function oc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ni(t);
}
function ic(e) {
  return e.type === "spendRitualCost";
}
function sc(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || Rc(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function lc(e) {
  const t = e;
  return t.type === "modifyResource" && ri(t.actor) && _c(t.resource) && Tc(t.operation) && ni(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function cc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function uc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && dc(a)
  );
}
function dc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || R(t.label)) && (t.extraCost === void 0 || kc(t.extraCost)) && (t.rollFormulaOverrides === void 0 || Ec(t.rollFormulaOverrides)) && (t.notes === void 0 || wc(t.notes)) && (t.targeting === void 0 || mc(t.targeting));
}
function mc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return pc(t.mode) && R(t.label) && (t.optionLabel === void 0 || R(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || fc(t.template));
}
function fc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || sa(t.distance)) && (t.width === void 0 || t.width === null || sa(t.width));
}
function pc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function gc(e) {
  return Array.isArray(e) && e.every(hc);
}
function hc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && ri(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || yc(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel)) && (t.applyOnResistance === void 0 || bc(t.applyOnResistance));
}
function bc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function yc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || $c(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Ac(t.expiry));
}
function Ac(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ni(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function ri(e) {
  return e === "self" || e === "target";
}
function _c(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Tc(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Rc(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function $c(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function kc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function sa(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function wc(e) {
  return Array.isArray(e) && e.every(R);
}
function Ec(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => R(t) && R(n)
  );
}
function mr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(la);
    if (Sc(t))
      return Array.from(t).filter(la);
  }
  return [];
}
function Cc(e) {
  return mr(e)[0] ?? null;
}
function Ic(e) {
  return mr(e).find(tc) ?? null;
}
function Sc(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function la(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Je(e) {
  return mr(e).filter((t) => t.type === "ritual");
}
function ai(e) {
  return Je(e)[0] ?? null;
}
function Lc(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(vt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = qe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = ot(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(da);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = qe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = ot(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await $n(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = qe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = ot(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await $n(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: da(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ca(e);
    },
    async applyBestPresetsToActorRituals() {
      return ca(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = qe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = ot(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function ca(e) {
  const t = qe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Je(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), ua(t);
  const r = ua(t, n.length);
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
    const s = await $n(e, a, o.preset);
    r.applied.push(Dc(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), vc(r), r;
}
async function $n(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Dc(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: vt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function ua(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function vc(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function da(e) {
  return {
    preset: vt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function qe(e) {
  const t = Xe.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ot(e) {
  const t = ai(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ie(e) {
  return e ? {
    id: e.id,
    source: {
      ...Pc(e.sourceActor),
      token: e.sourceToken
    },
    item: Nc(e.item),
    targets: e.targets.map(Oc),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: ma(e.rollRequests, oi),
    rolls: ma(e.rolls, xc),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(fr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function fr(e) {
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
function Pc(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Nc(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Oc(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function oi(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function xc(e) {
  return {
    ...oi(e),
    total: e.total
  };
}
function ma(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Mc(e) {
  return {
    getSelected() {
      return Xe.getSelectedActor();
    },
    logResources() {
      const t = X(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await fe(
        e,
        "Gasto de PE",
        X("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await fe(
        e,
        "Gasto de PD",
        X("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await fe(
        e,
        "Dano em PV",
        X("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await fe(
        e,
        "Cura de PV",
        X("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await fe(
        e,
        "Dano em SAN",
        X("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await fe(
        e,
        "Recuperação de SAN",
        X("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function fe(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    Fc(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, fr(o));
}
function X(e) {
  const t = Xe.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Fc(e) {
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
function Bc() {
  it(B.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), it(B.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), it(B.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), it(B.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function kn() {
  return {
    enabled: st(B.enabled),
    console: st(B.console),
    ui: st(B.ui),
    chat: st(B.chat)
  };
}
async function H(e, t) {
  await game.settings.set(u, B[e], t);
}
function it(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function st(e) {
  return game.settings.get(u, e) === !0;
}
function Uc() {
  return {
    status() {
      return kn();
    },
    async enable() {
      await H("enabled", !0);
    },
    async disable() {
      await H("enabled", !1);
    },
    async enableConsole() {
      await H("console", !0);
    },
    async disableConsole() {
      await H("console", !1);
    },
    async enableUi() {
      await H("ui", !0);
    },
    async disableUi() {
      await H("ui", !1);
    },
    async enableChat() {
      await H("chat", !0);
    },
    async disableChat() {
      await H("chat", !1);
    }
  };
}
const ii = "ritual.costOnly", si = "ritual.simpleHealing", qc = "ritual.eletrocussao", Gc = "ritual.definhar", li = "ritual.simpleDamage", ci = "generic.simpleHealing", pr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function jc() {
  return [
    zc(),
    Vc(),
    Hc(),
    Wc(),
    Kc(),
    Yc()
  ];
}
function zc() {
  return {
    id: ii,
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
function Vc() {
  return {
    id: si,
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
    automation: di(),
    itemPatch: Xc()
  };
}
function Hc() {
  return {
    id: qc,
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
    automation: Qc(),
    itemPatch: eu()
  };
}
function Wc() {
  return {
    id: Gc,
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
    automation: Zc(),
    itemPatch: Jc()
  };
}
function Kc() {
  return {
    id: li,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: gr()
  };
}
function Yc() {
  return {
    id: ci,
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
function di(e = "2d8+2") {
  return mi(
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
function Qc() {
  return {
    ...gr("3d6", {
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
function Zc() {
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
function gr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return mi(
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
function Xc() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: pr,
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
function Jc() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: pr,
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
function eu() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: pr,
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
function mi(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function hr() {
  return Array.from(game.user?.targets ?? []).map(fi);
}
function fi(e) {
  return {
    tokenId: he(e.id),
    actorId: he(e.actor?.id),
    sceneId: he(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function pi() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: he(e.id),
    actorId: he(t?.id),
    sceneId: he(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function he(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function tu(e) {
  return {
    logFirstRitualCost() {
      const t = J("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ee(t);
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
      const r = J("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = ee(r);
      if (a) {
        if (!au(t, n)) {
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
      const t = J("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ee(t);
      n && (await n.unsetFlag(u, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = J("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ee(t);
      if (!n) return;
      const r = e.automationRegistry.require(ii);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = J("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ee(n);
      if (!r) return;
      if (!fa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(si);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: di(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = J("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ee(n);
      if (!r) return;
      if (!fa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(li);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: gr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = J("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ee(t);
      n && await nu(e, t, n);
    }
  };
}
async function nu(e, t, n) {
  const r = Se(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: pi(),
    item: n,
    targets: hr()
  });
  if (!a.ok) {
    ru(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", ie(a.value.context));
}
function ru(e) {
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
function J(e) {
  const t = Xe.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ee(e) {
  const t = ai(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function au(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function fa(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ou = ["strict", "open"], gi = "strict";
function iu(e) {
  return ou.includes(e) ? e : gi;
}
function su(e) {
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
function Pt(e, t) {
  return e === "strict" && t.kind === "pending";
}
const lu = ["disabled", "ask", "automatic"], cu = ["buttons", "confirm"], hi = "ask";
function uu(e) {
  return typeof e == "string" && lu.includes(e);
}
function du(e) {
  return typeof e == "string" && cu.includes(e);
}
function mu(e) {
  return uu(e) ? e : du(e) ? "ask" : hi;
}
const fu = ["keep", "replace"], pu = ["manual", "assisted"], bi = "keep", yi = "assisted", gu = !0, E = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function hu() {
  game.settings.register(u, E.executionMode, {
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
    default: hi
  }), game.settings.register(u, E.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: bi
  }), game.settings.register(u, E.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: yi
  }), game.settings.register(u, E.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: gi
  }), game.settings.register(u, E.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: gu
  }), game.settings.register(u, E.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function pa() {
  const e = mu(game.settings.get(u, E.executionMode)), t = _i(game.settings.get(u, E.systemCardMode)), n = Ti(game.settings.get(u, E.damageResolutionMode)), r = br();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Ai()
  };
}
function bu() {
  return _i(game.settings.get(u, E.systemCardMode));
}
function yu() {
  return Ti(game.settings.get(u, E.damageResolutionMode));
}
function br() {
  return iu(game.settings.get(u, E.resistanceGateMode));
}
function Ai() {
  return game.settings.get(u, E.ritualCastingCheckEnabled) === !0;
}
async function te(e) {
  await game.settings.set(u, E.executionMode, e);
}
function _i(e) {
  return fu.includes(e) ? e : bi;
}
function Ti(e) {
  return pu.includes(e) ? e : yi;
}
function Au(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await te("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await te(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await te("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const _u = [
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
function Tu(e) {
  return {
    phases() {
      return _u;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Jt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Ic(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ga(e, t, n);
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
      if (!ku(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = $u(n) ?? Jt("Nenhum ator encontrado para executar automação do item.");
      r && await ga(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Jt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Cc(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(ci);
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
async function ga(e, t, n) {
  const r = Se(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: pi(),
    item: n,
    targets: hr()
  });
  if (!a.ok) {
    Ru(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", ie(a.value.context));
}
function Ru(e) {
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
function Jt(e) {
  const t = Xe.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function $u(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ku(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function wu(e) {
  const t = Mc(e), n = Lc(e), r = tu(e), a = Tu(e), o = Uc(), s = Au(e);
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
function Eu(e) {
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
      const r = ha();
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
      return Cu(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = ha();
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
      return Iu(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function ha() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function Cu(e) {
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
function Iu(e) {
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
function Su(e) {
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
    conditions: Eu(e.conditions),
    debug: wu(e)
  }, n = globalThis;
  return n[u] = t, n.ParanormalToolkit = t, t;
}
class ba {
  static isSupportedSystem() {
    return game.system.id === ec;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Lu() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: be(t.id),
    actorId: be(t.actor?.id),
    sceneId: be(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Ri() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: be(e.id),
    actorId: be(t?.id),
    sceneId: be(e.scene?.id),
    name: n
  };
}
function Du(e, t = Ri()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function vu(e) {
  if (!Ou(e)) return null;
  const t = e.getFlag(u, "workflow");
  return Nu(t) ? t : null;
}
function Pu() {
  return `flags.${u}.workflow`;
}
function ya(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), n = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || n !== void 0;
}
function Aa(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return wn(t) || wn(n);
}
function Nu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ou(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function be(e) {
  return wn(e) ? e : null;
}
function wn(e) {
  return typeof e == "string" && e.length > 0;
}
function xu() {
  const e = (t, n) => {
    Mu(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Mu(e, t) {
  const n = vu(e);
  if (!n || n.targets.length === 0) return;
  const r = Bu(t);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Fu(n));
}
function Fu(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(_a("Origem", e.source.name)), t.append(_a("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function _a(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function Bu(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Uu() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!qu(r) || !Gu(e) || ya(e) || ya(t)) return;
    const a = Lu();
    if (a.length === 0 || !Aa(e) && !Aa(t)) return;
    const o = Ri();
    e.updateSource({
      [Pu()]: Du(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function qu(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Gu(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Ta = !1, en = !1, tn = !1, lt = null;
const ju = 1e3, zu = 750, Vu = 1e3;
function Hu(e) {
  Ta || (Hooks.on("combatTurnChange", (t) => {
    Ku(e, Ra(t));
  }), Hooks.on("deleteCombat", (t) => {
    Yu(e, Ra(t));
  }), Ta = !0, Wu(e));
}
function Wu(e) {
  Nt() && (en || (en = !0, globalThis.setTimeout(() => {
    en = !1, yr(e, "ready");
  }, ju)));
}
function Ku(e, t) {
  Nt() && t && (lt && globalThis.clearTimeout(lt), lt = globalThis.setTimeout(() => {
    lt = null, yr(e, "combat-turn-change", t);
  }, zu));
}
function Yu(e, t) {
  Nt() && t && (tn || (tn = !0, globalThis.setTimeout(() => {
    tn = !1, yr(e, "combat-deleted", t);
  }, Vu)));
}
async function yr(e, t, n) {
  if (Nt())
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
function Nt() {
  return game.user?.isGM === !0;
}
function Ra(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const $i = {
  enabled: "dice.animations.enabled"
};
function Qu() {
  game.settings.register(u, $i.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Zu() {
  return {
    enabled: game.settings.get(u, $i.enabled) === !0
  };
}
const Ot = "chatCard", $a = "data-paranormal-toolkit-prompt-id", i = `${u}-item-use-prompt`, Xu = `.${i}__title`, ki = `.${i}__header`, Ju = `.${i}__roll-card`, ed = `.${i}__roll-meta`, td = `.${i}__roll-meta-pill`, Ar = `.${i}__resistance`, nd = `.${i}__resistance-header`, wi = `.${i}__resistance-description`, xt = `.${i}__resistance-roll-button`, Ei = `.${i}__resistance-roll-result`, ka = `${i}__resistance-content`, Ci = `.${i}__workflow-section`, Ii = `.${i}__workflow-roll`, _r = `${i}__workflow-roll--dice-open`, Tr = `.${i}__workflow-roll-formula`, Rr = `${i}__workflow-roll-formula--toggle`, Mt = `.${i}__workflow-dice-tray`, rd = `.${i}__roll-detail-toggle`, ad = `.${i}__roll-detail-list`, od = `.${i}__ritual-element-badge`, id = `.${i}__ritual-metadata`, sd = "casting-backlash", ld = "data-paranormal-toolkit-action-section", cd = "data-paranormal-toolkit-prompt-id", ud = "data-paranormal-toolkit-pending-id", wa = "data-paranormal-toolkit-casting-backlash-enhanced", Ea = `.${i}`, dd = `.${i}__workflow-section--casting`, md = `.${i}__workflow-section-header`, fd = `.${i}__workflow-notes`, pd = `[${ld}="${sd}"]`, Ca = `${i}__workflow-section-title-row`, gd = `${i}__workflow-section-header--casting-backlash`, Si = `${i}__casting-backlash-button`;
function hd(e) {
  for (const t of bd(e))
    yd(t), $d(t);
}
function bd(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Ea) && t.add(e);
  for (const n of e.querySelectorAll(Ea))
    t.add(n);
  return Array.from(t);
}
function yd(e) {
  const t = e.querySelector(pd);
  if (!t) return;
  const n = Ad(t);
  if (!n) return;
  const r = e.querySelector(`${dd} ${md}`);
  r && (r.classList.add(gd), _d(r), Td(n), r.append(n), t.remove());
}
function Ad(e) {
  return e.querySelector(
    `button[${ud}], button[${cd}]`
  );
}
function _d(e) {
  const t = e.querySelector(`:scope > .${Ca}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Ca);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(Si) || n.append(a));
  return n;
}
function Td(e) {
  if (e.getAttribute(wa) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Rd(t, e.disabled);
  e.classList.add(Si), e.setAttribute(wa, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Rd(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function $d(e) {
  for (const t of e.querySelectorAll(fd)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function kd(e) {
  for (const t of Array.from(e.querySelectorAll(Ci)))
    for (const n of Array.from(t.querySelectorAll(`${rd}, ${ad}`)))
      n.remove();
}
const wd = {
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
}, Ed = new Set(
  Object.values(wd)
), Cd = {
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
function Id(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Sd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Cd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Ed.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Li(e) {
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
function Sd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Di {
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
      const b = Ld(m, d);
      if (!b.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const T = Id(m.damageType);
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
          Dd(b.id, m, T.value)
        );
        continue;
      }
      try {
        const _ = await Promise.resolve(
          o.call(n, b.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const z of Pd(_.conditions))
          l.add(z);
        const g = vd(_.newPV);
        g !== null && (c = g), s.push({
          id: b.id,
          label: m.label ?? Li(T.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: b.amount,
          finalDamage: Ia(_.finalDamage, b.amount),
          blocked: Ia(_.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (_) {
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: _
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
function Ld(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Dd(e, t, n) {
  return {
    id: e,
    label: t.label ?? Li(n),
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
function Ia(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function vd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Pd(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class $r {
  async rollResistance(t) {
    const n = await Od(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? se(t.skill),
      roll: n,
      formula: Md(n),
      total: Fd(n),
      diceBreakdown: Bd(n)
    };
  }
  getSkillLabel(t) {
    return se(t);
  }
}
async function Nd(e, t) {
  return new $r().rollResistance({ actor: e, skill: t });
}
function se(e) {
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
async function Od(e, t) {
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
  return xd(r);
}
function xd(e) {
  return Sa(e) ? e : Array.isArray(e) ? e.find(Sa) ?? null : null;
}
function Sa(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Md(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Fd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Bd(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Ud);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Ud(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class vi {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class Pi {
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
function qd(e, t) {
  const n = Kd(e?.rounds);
  if (!n)
    return La(null);
  const r = e?.anchor ?? Ni(t);
  if (!r)
    return {
      ...La(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Gd(),
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
function Ni(e) {
  const t = Yd();
  if (!t?.id || !Oi(t.round)) return null;
  const n = Hd(t), r = jd(e, n) ?? Vd(t), a = W(r?.id), o = Zd(r?.initiative), s = zd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Qd()
  };
}
function Gd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function La(e) {
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
function jd(e, t) {
  return e?.id ? t.find((n) => Wd(n) === e.id) ?? null : null;
}
function zd(e, t, n) {
  const r = W(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Xd(e.turn) ? e.turn : null;
}
function Vd(e) {
  return pt(e.combatant) ? e.combatant : null;
}
function Hd(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(pt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(pt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(pt);
  }
  return [];
}
function Wd(e) {
  return W(e.actor?.id) ?? W(e.actorId) ?? W(e.token?.actor?.id) ?? W(e.token?.actorId) ?? W(e.document?.actor?.id) ?? W(e.document?.actorId);
}
function Kd(e) {
  return Oi(e) ? Math.trunc(e) : null;
}
function Yd() {
  return game.combat ?? null;
}
function Qd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function pt(e) {
  return !!(e && typeof e == "object");
}
function W(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Zd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Oi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Xd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class xi {
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
    if (!lm(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = qd(t.duration, r), s = Jd(a, t, o), c = t.refreshExisting ?? !0 ? cm(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(Da(r, a, c.id ?? null, !1, !0, o));
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
      return y(Da(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = Fi(n, r);
    let o = 0;
    try {
      for (const s of a)
        await va(n, s) === "deleted" && (o += 1);
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
    const n = mm(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = kr(s);
      a += l.length;
      for (const c of l) {
        if (!nm(c, t)) continue;
        const d = Mi(c);
        try {
          await va(s, c) === "deleted" && (o += 1);
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
function Jd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Rm(),
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
    duration: em(n.duration),
    start: tm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [u]: r
    }
  };
}
function em(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function tm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Tm(),
    ...e
  };
}
function Da(e, t, n, r, a, o) {
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
function nm(e, t) {
  const n = Mi(e);
  if (!n.conditionId || !rm(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = _m();
  return n.durationMode === "combatantTurn" || am(n) ? im(n, r) : om(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !P(n.startRound) || !P(n.requestedRounds) || !P(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function rm(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && P(e.requestedRounds);
}
function am(e) {
  return !!(e.combatDurationApplied && P(e.requestedRounds) && P(e.startRound) && (e.startCombatantId || _t(e.startTurn)));
}
function om(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function im(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !P(e.startRound) || !P(e.requestedRounds) || !P(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = sm(t);
  return e.startCombatantId ? r === e.startCombatantId : _t(e.startTurn) && _t(t.turn) ? t.turn === e.startTurn : !1;
}
function sm(e) {
  return ye(e.combatant?.id);
}
function Mi(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: gt(e, "conditionId"),
    requestedRounds: Pa(e, "requestedRounds") ?? Ge(t.value) ?? Ge(t.rounds),
    combatDurationApplied: nn(e, "combatDurationApplied"),
    combatId: gt(e, "combatId") ?? ye(n.combat) ?? ye(t.combat),
    startCombatantId: gt(e, "startCombatantId") ?? ye(n.combatant),
    startInitiative: hm(e, "startInitiative") ?? Bi(n.initiative),
    startRound: Pa(e, "startRound") ?? Ge(n.round) ?? Ge(t.startRound),
    startTurn: gm(e, "startTurn") ?? En(n.turn) ?? En(t.startTurn),
    expiryEvent: bm(e, "expiryEvent") ?? Ui(t.expiry),
    durationMode: ym(e, "durationMode"),
    deleteOnExpire: nn(e, "deleteOnExpire"),
    expiresWithCombat: nn(e, "expiresWithCombat")
  };
}
function lm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function cm(e, t) {
  return Fi(e, t)[0] ?? null;
}
function Fi(e, t) {
  return kr(e).filter((n) => pm(n) === t);
}
async function va(e, t) {
  const n = t.id ?? null, r = n ? um(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (dm(a)) return "missing";
    throw a;
  }
}
function um(e, t) {
  return kr(e).find((n) => n.id === t) ?? null;
}
function dm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function mm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      ct(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    ct(e, n);
  });
  for (const n of fm())
    ct(e, n.actor), ct(e, n.document?.actor);
  return Array.from(e.values());
}
function ct(e, t) {
  if (!Am(t)) return;
  const r = ye(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function fm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function kr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function pm(e) {
  return gt(e, "conditionId");
}
function gt(e, t) {
  return ye(ue(e, t));
}
function Pa(e, t) {
  return Ge(ue(e, t));
}
function gm(e, t) {
  return En(ue(e, t));
}
function hm(e, t) {
  return Bi(ue(e, t));
}
function bm(e, t) {
  return Ui(ue(e, t));
}
function ym(e, t) {
  const n = ue(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function nn(e, t) {
  return ue(e, t) === !0;
}
function ue(e, t) {
  const n = e.getFlag?.(u, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[u];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function ye(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ge(e) {
  return P(e) ? Math.trunc(e) : null;
}
function En(e) {
  return _t(e) ? Math.trunc(e) : null;
}
function Bi(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ui(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Am(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function _m() {
  return game.combat ?? null;
}
function Tm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function P(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function _t(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Rm() {
  return game.user?.id ?? null;
}
const $m = "icons/svg/downgrade.svg", km = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function A(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? $m,
    description: km,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const wm = A({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Em = A({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Cm = A({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Im = A({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Sm = A({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Lm = A({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Dm = A({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), vm = A({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Pm = A({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Nm = A({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Om = A({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), xm = A({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Mm = A({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Fm = A({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Bm = A({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Um = A({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), qm = A({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Gm = A({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), jm = A({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), zm = A({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Vm = A({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Hm = A({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Wm = A({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Km = A({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Ym = A({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Qm = A({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Zm = A({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Xm = A({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Jm = A({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), ef = A({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), tf = A({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), nf = A({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), rf = A({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), af = A({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), of = [
  wm,
  Em,
  Cm,
  Im,
  Sm,
  Lm,
  Dm,
  vm,
  Pm,
  Nm,
  Om,
  xm,
  Mm,
  Fm,
  Bm,
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
  af
];
class sf {
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
    return Array.from(this.definitions.values()).map(Na);
  }
  get(t) {
    const n = this.lookup.get(Oa(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Na(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Oa(t);
    r && this.lookup.set(r, n);
  }
}
function qi() {
  return new sf(of);
}
function Na(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Oa(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function ke(e) {
  return e.applyOnResistance ?? "failure";
}
function Gi(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function ji(e, t) {
  const n = ke(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function zi(e) {
  const t = ke(e);
  return t === "failure" || t === "success";
}
function lf(e, t, n, r) {
  const a = e.filter((c) => ji(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => ke(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((d) => r(d) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const cf = {
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
}, uf = {
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
function df(e) {
  return Hi(e, cf, !1);
}
function mf(e) {
  return Hi(e, uf, !e.allowsSuccessfulResistance);
}
function Le(e) {
  return e.kind === "waiting-resistance";
}
function Vi(e) {
  return e.kind === "resisted";
}
function Hi(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? pe("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? pe("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || Pt(e.resistanceGateMode, e.resistanceState) ? pe(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? pe("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : pe("available", !0, r.available, r.availableCompact, null);
}
function pe(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const je = "data-paranormal-toolkit-prompt-id", ff = "data-paranormal-toolkit-resistance-roll-result", pf = "Conjuração DT";
function gf(e) {
  const t = e.querySelector(xt)?.getAttribute(ff), n = Ke(t);
  if (n !== null) return n;
  const r = e.querySelector(Ei)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Ke(a?.[1] ?? null);
}
function Wi(e) {
  const t = Ki(e), n = yf(t);
  if (n !== null) return n;
  const r = Af(t);
  return r !== null ? r : _f(e);
}
function hf(e) {
  const t = Ki(e);
  return t ? {
    actorId: rn(t.actorId),
    itemId: rn(t.itemId),
    itemName: rn(t.itemName)
  } : null;
}
function bf(e) {
  const t = e.getAttribute(je);
  if (!t) return null;
  const n = Yi(e), r = Qi(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Ft(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function K(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Cn(e) {
  return K(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function yf(e) {
  const t = Rf(e);
  return t.length === 0 ? null : Ke($f(t, pf));
}
function Af(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : xa(r, ["system", "ritual", "DT"]) ?? xa(r, ["system", "ritual", "dt"]);
}
function _f(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Ke(n?.[1] ?? null);
}
function Ki(e) {
  const t = Tf(e);
  if (!t) return null;
  const n = Yi(e), r = Qi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Ft(o) ? o.pendingId === t : !1) ?? null;
}
function Tf(e) {
  return (e.closest(`[${je}]`) ?? e.querySelector(`[${je}]`) ?? e.parentElement?.querySelector(`[${je}]`) ?? null)?.getAttribute(je) ?? null;
}
function Yi(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return kf(a) ? a : null;
}
function Qi(e) {
  const t = e?.getFlag?.(u, Ot);
  return Ft(t) ? t : null;
}
function Rf(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function $f(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function xa(e, t) {
  let n = e;
  for (const r of t) {
    if (!Ft(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Ke(typeof n == "string" ? n : null);
}
function Ke(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function kf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Ft(e) {
  return !!(e && typeof e == "object");
}
function rn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Bt(e) {
  return Zi({
    hasResistance: !!e.querySelector(Ar),
    difficulty: Wi(e),
    resistanceTotal: gf(e)
  });
}
function wf(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Zi({
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
function Zi(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: su(e)
  };
}
function de() {
  return game.user?.isGM === !0;
}
function le() {
  return de();
}
function Ef(e) {
  const t = Pt(e.resistanceGateMode, e.resistanceState), n = Cf(e.resistanceState, e.hasDamage), r = If(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = df({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = mf({
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
function Cf(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function If(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function wr(e) {
  const t = e.isGM ?? le();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Ef({
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
function Sf(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Df(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Lf(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Df(e, t) {
  const n = vf(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of Pf(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function vf(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Pf(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ma(e, "highest") : n.includes("kl") ? Ma(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ma(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Nf = "data-paranormal-toolkit-resistance-skill", Of = "data-paranormal-toolkit-resistance-skill-label", Xi = "pending", Er = "success", Cr = "failure", Ji = "rolled";
function xf(e) {
  const t = qf(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Bf(e.damageSection) : null, r = Fa(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Mf(e.rollCard).map((o, s) => {
    const l = Ff(o, s), c = e.resistanceResults.get(l) ?? null, d = Hf(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, b = e.effectApplications.get(l) ?? null, T = wf({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Qf(d)
    }).state, _ = Fa(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Gi(T)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: d,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: b,
      effect: _,
      assistedActions: wr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: T,
        damage: n,
        effect: _,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!b,
        effectCanApplyOnSuccessfulResistance: _?.applyOnResistance === "success" || _?.applyOnResistance === "always",
        effectRequiresResolvedResistance: _ ? zi(_) : !1
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
function Mf(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && es(a) !== "nenhum alvo") : [];
}
function Ff(e, t) {
  return `${es(e)}:${t}`;
}
function Bf(e) {
  const t = Wf(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Yf(e),
    formula: Kf(e) ?? "—",
    total: t,
    diceBreakdown: Lf(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Fa(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Uf(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: ke(o)
  } : null;
}
function Uf(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function qf(e, t) {
  const n = Gf(t), r = jf(n)?.textContent?.trim(), a = zf(n), o = a?.getAttribute(Nf) ?? null, s = a?.getAttribute(Of) ?? (o ? se(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: Vf(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: Wi(e)
  };
}
function Gf(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function jf(e) {
  return Ir(e, `.${i}__resistance-description`);
}
function zf(e) {
  return Ir(e, xt);
}
function Vf(e) {
  return Ir(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Ir(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function Hf(e, t) {
  return e ? t === null ? Ji : e.total >= t ? Er : Cr : Xi;
}
function Wf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Kf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Yf(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function es(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Qf(e) {
  return e === Er ? "succeeded" : e === Cr ? "failed" : "pending";
}
function ts(e) {
  if (!e) return null;
  const t = e.actorId ? Jf(e.actorId) : null, n = t ? Zf(t, e.itemId, e.itemName) : null;
  return n || Xf(e.itemId, e.itemName);
}
function Zf(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Ae(o)) return o;
  }
  const a = Tt(n);
  if (a) {
    const o = r?.find?.((s) => Ae(s) ? Tt(s.name) === a : !1);
    if (Ae(o)) return o;
  }
  return null;
}
function Xf(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Ae(a)) return a;
  }
  const r = Tt(t);
  if (r) {
    const a = n?.find?.((o) => Ae(o) ? Tt(o.name) === r : !1);
    if (Ae(a)) return a;
  }
  return null;
}
function Jf(e) {
  const n = game.actors?.get?.(e);
  return ep(n) ? n : null;
}
function ep(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ae(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Tt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Sr(e) {
  const t = an(e);
  if (!t) return null;
  const n = tp().filter((o) => an(np(o)) === t).map((o) => ns(o)).find(He) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => He(o) && an(o.name) === t);
  return He(a) ? a : null;
}
function tp() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function np(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ns(e)?.name ?? null;
}
function ns(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (He(t)) return t;
  const n = e.document?.actor;
  return He(n) ? n : null;
}
function He(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function an(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function rs(e) {
  const t = ip();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: rp(e)
  });
}
function rp(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${ht(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = ap(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${ht(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${ht(e.actorName)}</strong></p>
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
function ap(e) {
  const t = op(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${ht(a)}</li>`;
}
function op(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Ba(n?.value);
  return r === null ? null : {
    value: r,
    max: Ba(n?.max)
  };
}
function Ba(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ip() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function ht(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function sp(e) {
  await rs(lp(e));
}
function lp(e) {
  if (cp(e)) return e;
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
function cp(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function as(e) {
  return e.mode, `✓ ${os(e.inputAmount)} PV`;
}
function up(e) {
  const t = os(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function os(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class dp {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? le()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : Pt(t.resistanceGateMode, t.resistanceState) ? {
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
class mp {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? le()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : Pt(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class fp {
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
const pp = `.${i}__actions`, Lr = `.${i}__actions-title`, we = `.${i}__button`, gp = "data-paranormal-toolkit-action-section", hp = `${i}__button--executed`, bp = "data-paranormal-toolkit-executed-label";
function is(e) {
  return K(e.querySelector(Lr)?.textContent);
}
function yp(e, t) {
  const n = e.querySelector(Lr);
  n && (n.textContent = t);
}
function et(e, t) {
  const n = K(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return K(a) === n;
  }) ?? null;
}
function Dr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function me(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const ut = "data-paranormal-toolkit-prompt-id", ss = "multiTargetResistanceResults", ls = "multiTargetDamageApplications", cs = "multiTargetEffectApplications";
function Ap(e) {
  const t = /* @__PURE__ */ new Map(), r = Ut(e)?.[ss];
  if (!O(r)) return t;
  for (const [a, o] of Object.entries(r))
    Ep(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function _p(e, t) {
  await vr(e, ss, t.targetId, t);
}
function Tp(e) {
  const t = /* @__PURE__ */ new Map(), r = Ut(e)?.[ls];
  if (!O(r)) return t;
  for (const [a, o] of Object.entries(r))
    Cp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Rp(e, t) {
  await vr(
    e,
    ls,
    t.targetId,
    t
  );
}
function $p(e) {
  const t = /* @__PURE__ */ new Map(), r = Ut(e)?.[cs];
  if (!O(r)) return t;
  for (const [a, o] of Object.entries(r))
    Sp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function kp(e, t) {
  await vr(
    e,
    cs,
    t.targetId,
    t
  );
}
function wp(e) {
  const t = Ut(e);
  return t ? {
    actorId: on(t.actorId),
    itemId: on(t.itemId),
    itemName: on(t.itemName)
  } : null;
}
async function vr(e, t, n, r) {
  const a = us(e);
  if (!a) return;
  const o = ds(e), s = ms(o);
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
  l && await Promise.resolve(o.setFlag?.(u, Ot, {
    ...s,
    prompts: c
  }));
}
function Ut(e) {
  const t = us(e);
  if (!t) return null;
  const n = ds(e), r = ms(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => O(o) ? o.pendingId === t : !1) ?? null;
}
function us(e) {
  return (e.closest(`[${ut}]`) ?? e.querySelector(`[${ut}]`) ?? e.parentElement?.querySelector(`[${ut}]`) ?? null)?.getAttribute(ut) ?? null;
}
function ds(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Lp(a) ? a : null;
}
function ms(e) {
  const t = e?.getFlag?.(u, Ot);
  return O(t) ? t : null;
}
function Ep(e) {
  return O(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Cp(e) {
  return O(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Ip(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Ip(e) {
  return e === "normal" || e === "half";
}
function Sp(e) {
  return O(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function on(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Lp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function O(e) {
  return !!(e && typeof e == "object");
}
const Dp = "data-paranormal-toolkit-resistance-skill", vp = "data-paranormal-toolkit-resistance-skill-label", In = "data-paranormal-toolkit-multi-target-section", Pr = "data-paranormal-toolkit-multi-target-damage-info", fs = "data-paranormal-toolkit-multi-target-effect-info", ps = "data-paranormal-toolkit-multi-target-toggle", gs = "data-paranormal-toolkit-multi-target-details", D = "data-paranormal-toolkit-multi-target-target", Pp = "data-paranormal-toolkit-multi-target-state", Sn = "data-paranormal-toolkit-multi-target-roll-total", Ln = "data-paranormal-toolkit-multi-target-roll-formula", bt = "data-paranormal-toolkit-multi-target-roll-dice", Dn = "data-paranormal-toolkit-multi-target-roll-skill", vn = "data-paranormal-toolkit-multi-target-roll-skill-label", Pn = "data-paranormal-toolkit-multi-target-roll-target-name", Nn = "data-paranormal-toolkit-multi-target-roll-rolled-at", On = "data-paranormal-toolkit-multi-target-damage-mode", xn = "data-paranormal-toolkit-multi-target-damage-input-amount", Ua = "data-paranormal-toolkit-multi-target-damage-final-amount", qa = "data-paranormal-toolkit-multi-target-damage-blocked", Mn = "data-paranormal-toolkit-multi-target-damage-target-name", Fn = "data-paranormal-toolkit-multi-target-damage-applied-at", Bn = "data-paranormal-toolkit-multi-target-effect-condition-id", Un = "data-paranormal-toolkit-multi-target-effect-condition-label", qn = "data-paranormal-toolkit-multi-target-effect-effect-id", Gn = "data-paranormal-toolkit-multi-target-effect-created", jn = "data-paranormal-toolkit-multi-target-effect-refreshed", zn = "data-paranormal-toolkit-multi-target-effect-target-name", Vn = "data-paranormal-toolkit-multi-target-effect-applied-at", Np = new xi(qi()), Op = new vi(new Di()), xp = new Pi(new $r()), Mp = new fp(xp), Fp = new dp(Op), Bp = new mp(Np), Up = Xi, De = Er, tt = Cr, qp = Ji;
function Gp(e) {
  const t = hs(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Zp(e);
  const n = Xp(e.rollCard, t), r = Jp(e.rollCard, t);
  !n && r && Pg(e.rollCard, r, e.effectSection);
  const a = og(e.rollCard);
  return As(a, t), Lg(
    e.rollCard,
    a,
    eg(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Ng(e.rollCard, r, a), !0;
}
function hs(e) {
  return xf({
    ...e,
    resistanceResults: Vp(e.rollCard),
    damageApplications: Hp(e.rollCard),
    effectApplications: Wp(e.rollCard),
    resolveTargetConditionApplication: jp,
    resistanceGateMode: Or()
  });
}
function jp(e, t, n) {
  const r = wp(e), a = ts(r);
  if (!a) return null;
  const o = Se(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = zp(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function zp(e, t, n) {
  const r = lf(
    e,
    n,
    t,
    sn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = sn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => sn(s) === a)) ?? null : null;
}
function Vp(e) {
  const t = Ap(e);
  for (const [n, r] of Qp(e))
    t.set(n, r);
  return t;
}
function Hp(e) {
  const t = Tp(e);
  for (const [n, r] of Yp(e))
    t.set(n, r);
  return t;
}
function Wp(e) {
  const t = $p(e);
  for (const [n, r] of Kp(e))
    t.set(n, r);
  return t;
}
function Kp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = n.getAttribute(Bn), o = n.getAttribute(Un), s = n.getAttribute(qn), l = za(n.getAttribute(Gn)), c = za(n.getAttribute(jn)), d = n.getAttribute(zn), m = n.getAttribute(Vn);
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
function Yp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = n.getAttribute(On), o = Ss(n.getAttribute(xn)), s = n.getAttribute(Mn), l = n.getAttribute(Fn);
    !r || !Mg(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Qp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = Ss(n.getAttribute(Sn)), o = n.getAttribute(Ln), s = n.getAttribute(Dn), l = n.getAttribute(vn), c = n.getAttribute(Pn), d = n.getAttribute(Nn);
    !r || a === null || !o || !s || !l || !c || !d || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(bt),
      rolledAt: d
    });
  }
  return t;
}
function Zp(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Xp(e, t) {
  if (!t.damage)
    return bs(e)?.remove(), null;
  const n = tg(e);
  return ng(n, t.damage), ag(e, n), n;
}
function Jp(e, t) {
  if (!t.effect)
    return Is(e)?.remove(), null;
  const n = Dg(e);
  return vg(n, t.effect), n;
}
function eg(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : et(e, "Conjuração");
}
function tg(e) {
  const t = bs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Pr, "true"), n;
}
function bs(e) {
  return e.querySelector(`[${Pr}="true"]`);
}
function ng(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(ys(t.formula, t.total, t.diceBreakdown));
}
function ys(e, t, n, r = !1) {
  const a = Sf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return rg(a, r), a;
}
function rg(e, t) {
  const n = e.querySelector(Mt), r = e.querySelector(Tr);
  if (!n || !r) return;
  e.classList.toggle(_r, t), n.hidden = !t, r.classList.add(Rr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function ag(e, t) {
  const n = et(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function og(e) {
  const t = e.querySelector(`[${In}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(In, "true"), n;
}
function As(e, t) {
  const n = ig(e);
  e.replaceChildren(sg(t), cg(t, n));
}
function ig(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${D}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(D)).filter(xg)
  );
}
function sg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = lg(e.targets), t.append(n, r), t;
}
function lg(e) {
  const t = e.length, n = e.filter((l) => l.state === tt).length, r = e.filter((l) => l.state === De).length, a = e.filter((l) => l.state === Up).length, o = e.filter((l) => l.state === qp).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function cg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(ug(r, e, t.has(r.id)));
  return n;
}
function ug(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(D, e.id), r.setAttribute(Pp, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), _s(r, e.resistanceResult), Ts(r, e.damageApplication), Rs(r, e.effectApplication);
  const a = dg(e, t, r), o = Eg(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    ja(s.target) || Ga(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || ja(s.target) || (s.preventDefault(), Ga(r));
  }), r.append(a, o), r;
}
function _s(e, t) {
  if (!t) {
    e.removeAttribute(Sn), e.removeAttribute(Ln), e.removeAttribute(bt), e.removeAttribute(Dn), e.removeAttribute(vn), e.removeAttribute(Pn), e.removeAttribute(Nn);
    return;
  }
  e.setAttribute(Sn, String(t.total)), e.setAttribute(Ln, t.formula), e.setAttribute(Dn, t.skill), e.setAttribute(vn, t.skillLabel), e.setAttribute(Pn, t.targetName), e.setAttribute(Nn, t.rolledAt), t.diceBreakdown ? e.setAttribute(bt, t.diceBreakdown) : e.removeAttribute(bt);
}
function Ts(e, t) {
  if (!t) {
    e.removeAttribute(On), e.removeAttribute(xn), e.removeAttribute(Ua), e.removeAttribute(qa), e.removeAttribute(Mn), e.removeAttribute(Fn);
    return;
  }
  e.setAttribute(On, t.mode), e.setAttribute(xn, String(t.inputAmount)), e.removeAttribute(Ua), e.removeAttribute(qa), e.setAttribute(Mn, t.targetName), e.setAttribute(Fn, t.appliedAt);
}
function Rs(e, t) {
  if (!t) {
    e.removeAttribute(Bn), e.removeAttribute(Un), e.removeAttribute(qn), e.removeAttribute(Gn), e.removeAttribute(jn), e.removeAttribute(zn), e.removeAttribute(Vn);
    return;
  }
  e.setAttribute(Bn, t.conditionId), e.setAttribute(Un, t.conditionLabel), e.setAttribute(qn, t.effectId ?? ""), e.setAttribute(Gn, String(t.created)), e.setAttribute(jn, String(t.refreshed)), e.setAttribute(zn, t.targetName), e.setAttribute(Vn, t.appliedAt);
}
function dg(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = mg(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = fg(e, t.resistance);
  bg(l, n, e, t);
  const c = wg(n);
  a.append(o, s, l, c);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), Es(d, [
    $s(e, t, "compact"),
    ws(e, t, "compact")
  ]), r.append(a, d), r;
}
function mg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function fg(e, t) {
  if (!de())
    return pg(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", hg(e, t)), t?.skill && (n.setAttribute(Dp, t.skill), n.setAttribute(vp, t.skillLabel ?? se(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === De ? "✓" : e.state === tt ? "✕" : "", n.append(r, a), n;
}
function pg(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", gg(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === De ? "✓" : e.state === tt ? "✕" : "", n.append(r, a), n;
}
function gg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === De ? "sucesso" : e.state === tt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function hg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === De ? "sucesso" : e.state === tt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function bg(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !de() || e.addEventListener("click", (a) => {
    a.stopPropagation(), yg(t, e, n, r);
  });
}
async function yg(e, t, n, r) {
  if (!de()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? se(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Sr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Mp.execute({ actor: l, skill: o, skillLabel: s });
    await Og(d.roll);
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
    _s(e, m);
    try {
      await _p(r.rollCard, m);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", b);
    }
    Nr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Nr(e) {
  const t = e.closest(`[${In}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = hs({
    rollCard: n,
    damageSection: Ag(n) ?? et(n, "Dano"),
    effectSection: _g(n)
  });
  r && As(t, r);
}
function Ag(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Pr) !== "true") ?? null;
}
function _g(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Tg(e) {
  return Le(e.assistedActions.policy.damageActionState);
}
function Rg(e) {
  return Le(e.assistedActions.policy.effectActionState);
}
function Or() {
  try {
    return br();
  } catch {
    return "strict";
  }
}
function $s(e, t, n) {
  if (e.damageApplication)
    return M(
      "✓",
      as({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Le(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = ks(a, t.damage);
  if (o === null)
    return M(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = up({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, d = M(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return d.title = `Aplicar ${s} em ${e.name}`, d.setAttribute("aria-label", d.title), d.addEventListener("click", (m) => {
    m.stopPropagation();
    const b = d.closest(`[${D}]`);
    b && $g(b, d, e, t);
  }), d;
}
function ks(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function $g(e, t, n, r) {
  if (n.damageApplication) return;
  if (Tg(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = ks(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Sr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const d = await Fp.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Or(),
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
    Ts(e, m);
    try {
      await Rp(r.rollCard, m);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", b);
    }
    try {
      await sp(d.value);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", b);
    }
    Nr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ws(e, t, n) {
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
  if (Le(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Vi(r))
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
    const l = o.closest(`[${D}]`);
    l && kg(l, o, e, t);
  }), o;
}
async function kg(e, t, n, r) {
  if (n.effectApplication) return;
  if (Rg(n)) {
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
  const o = Sr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await Bp.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Or(),
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
    Rs(e, c);
    try {
      await kp(r.rollCard, c);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Nr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Es(e, t) {
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
function wg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(ps, "true"), t.setAttribute("aria-hidden", "true"), Cs(e, t), t;
}
function Ga(e) {
  const t = e.querySelector(`[${gs}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${ps}="true"]`);
  r && Cs(e, r);
}
function Cs(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function ja(e) {
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
function Eg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(gs, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Cg(e, t.resistance);
  s && r.append(s);
  const l = Ig(e, t.resistance), c = Sg(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Cg(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === De ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Ig(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = ys(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Sg(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), Es(n, [
    $s(e, t, "full"),
    ws(e, t, "full")
  ]), n;
}
function Lg(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Dg(e) {
  const t = Is(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(fs, "true"), n;
}
function Is(e) {
  return e.querySelector(`[${fs}="true"]`);
}
function vg(e, t) {
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
function Pg(e, t, n) {
  const r = n?.parentElement === e ? n : et(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Ng(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function sn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Og(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function xg(e) {
  return typeof e == "string" && e.length > 0;
}
function Mg(e) {
  return e === "normal" || e === "half";
}
function za(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function Ss(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Va = "data-paranormal-toolkit-card-layout-refresh-bound";
function Fg(e) {
  const t = e.rollCard.querySelector(xt);
  t && t.getAttribute(Va) !== "true" && (t.setAttribute(Va, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const _e = "data-paranormal-toolkit-prompt-id", Bg = "apply-damage", Ug = "data-paranormal-toolkit-multi-target-damage-info";
function qg(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(Ug) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Gg(e) {
  const t = zg(e);
  return t.find((n) => n.getAttribute(gp) === Bg) ?? t.find((n) => is(n) === "aplicar danos") ?? null;
}
function jg(e) {
  const t = Ls(e), n = Ha(t);
  return n || Ha(Vg(e));
}
function Ha(e) {
  return e.find((t) => {
    const n = is(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function zg(e) {
  const t = Ls(e);
  return t.length > 0 ? t : xr(e);
}
function Ls(e) {
  const t = Kg(e);
  return t ? xr(e).filter((n) => Wg(n, t)) : [];
}
function Vg(e) {
  const t = Ds(e);
  if (!t) return [];
  const n = Hg(e, t);
  return xr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => vs(e, r)).filter((r) => !n || Yg(r, n));
}
function xr(e) {
  const t = Ds(e);
  return t ? Array.from(t.querySelectorAll(pp)) : [];
}
function Ds(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Hg(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && vs(e, n)) ?? null;
}
function Wg(e, t) {
  return e.getAttribute(_e) === t ? !0 : Array.from(e.querySelectorAll(`[${_e}]`)).some((n) => n.getAttribute(_e) === t);
}
function Kg(e) {
  return e.getAttribute(_e) ?? e.querySelector(`[${_e}]`)?.getAttribute(_e) ?? null;
}
function vs(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Yg(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Qg(e) {
  const t = Ps(), n = Bt(e.rollCard).state, r = wr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Le(a), s = Vi(a);
  return e.applied ? Be({
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
  }) : r.policy.canShowApplyEffect ? Be(o ? {
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
  }) : Be({
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
function Be(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function Zg(e) {
  const { rollCard: t } = e, n = eh(), r = Ps(), a = Bt(t).state, o = wr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Le(s), c = Jg(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: w(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: Xg(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: w("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: w("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: w("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: w("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: w("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !1, !1, !1, !!e.halfButtonSkipped),
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
    normalButton: w("normal", !d, !d, !1, !!e.normalButtonSkipped),
    halfButton: w("half", d, d, !1, !!e.halfButtonSkipped),
    summary: {
      state: d ? "resisted" : "failed",
      message: d ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function Xg(e) {
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
function w(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function Jg(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function eh() {
  try {
    return yu();
  } catch {
    return "assisted";
  }
}
function Ps() {
  try {
    return br();
  } catch {
    return "strict";
  }
}
const th = "data-paranormal-toolkit-damage-resolution-state", Wa = "data-paranormal-toolkit-damage-icon-enhanced", Mr = "data-paranormal-toolkit-damage-original-label", nh = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, Ns = "Outra opção escolhida";
function rh(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), yp(t, "Aplicar dano"), ah(e, t);
}
function ah(e, t) {
  const n = Array.from(t.querySelectorAll(we)), r = Ya(n, "normal"), a = Ya(n, "half");
  if (!r || !a) {
    oh(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Qa(r, "normal"), Qa(a, "half");
  const o = Zg({
    rollCard: e,
    normalButtonApplied: Rt(r),
    halfButtonApplied: Rt(a),
    normalButtonSkipped: Hn(r),
    halfButtonSkipped: Hn(a)
  });
  if (!o.canShowApplyDamage) {
    Za(r), Za(a), Xa(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), Ka(r, o.normalButton), Ka(a, o.halfButton), Xa(t, o.summary.state, o.summary.message);
}
function Ka(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    sh(e, t.visible), lh(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function oh(e) {
  for (const t of e)
    Hn(t) && t.remove();
}
function Rt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(Ns);
}
function Hn(e) {
  return e.textContent?.includes(Ns) ?? !1;
}
function Ya(e, t) {
  const n = nh[t];
  return e.find((r) => n.test(ih(r))) ?? null;
}
function ih(e) {
  return [
    e.getAttribute(Mr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Qa(e, t) {
  if (e.getAttribute(Wa) === "true") return;
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
  ), e.setAttribute(Wa, "true"), e.setAttribute(Mr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, me(n));
}
function Za(e) {
  Rt(e) || e.remove();
}
function sh(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function lh(e, t, n, r = "Role resistência") {
  if (!Rt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(me(r));
      return;
    }
    e.removeAttribute("aria-disabled"), ch(e, n);
  }
}
function ch(e, t) {
  const n = e.getAttribute(Mr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(uh(t), me(n)));
}
function uh(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function Xa(e, t, n) {
  e.setAttribute(th, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Lr)?.after(a);
}
const Ye = "data-paranormal-toolkit-effect-icon-enhanced", Ee = "data-paranormal-toolkit-effect-action-compacted", qt = "data-paranormal-toolkit-effect-resistance-gate", Fr = "data-paranormal-toolkit-effect-section", Br = "data-paranormal-toolkit-effect-label";
function dh(e) {
  return e.querySelector(`[${Fr}="true"]`);
}
function mh(e) {
  const t = ph(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? hh(), r = wh(n, e.sourceActions, t);
  return r && n.setAttribute(Br, r), bh(n, t, r), $h(e.rollCard, n, e.after ?? e.fallbackAfter), kh(e.sourceActions, n), n;
}
function fh(e, t) {
  const n = t.querySelector(we);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = Fs(t, n, r), o = Os(e, n), s = Qg({
    rollCard: e,
    effectLabel: a,
    applied: qr(n, r),
    effectCanApplyOnSuccessfulResistance: o ? ke(o) === "success" || ke(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? zi(o) : !1
  });
  if (s.applied) {
    Ch(n);
    return;
  }
  if (!s.visible) {
    Ih(n);
    return;
  }
  if (s.waitingForResistance) {
    Sh(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    Lh(n, s.compactLabel);
    return;
  }
  Dh(n), Ms(n, s.displayLabel);
}
function ph(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(we) ?? []), n = Array.from(e.existingSection?.querySelectorAll(we) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : gh(e.rollCard, r) ?? r[0] ?? null;
}
function gh(e, t) {
  const n = Bt(e).state, r = Gi(n), a = xs(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = Os(e, o, a);
    if (s && ji(s, r)) return o;
  }
  return null;
}
function Os(e, t, n = xs(e)) {
  const r = Ur(t, t.textContent?.trim() ?? ""), a = Cn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Cn(s) === a)) ?? null : null;
}
function xs(e) {
  const t = ts(hf(e));
  if (!t) return [];
  const n = Se(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function hh() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Fr, "true"), e;
}
function bh(e, t, n) {
  e.setAttribute(Fr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = yh(e), a = Ah(r);
  a.textContent = "Efeito";
  const o = _h(e, r), s = Th(o);
  s.textContent = vh(n ?? Fs(e, t, t.textContent?.trim() ?? ""));
  const l = Rh(o);
  t.parentElement !== l && l.append(t);
  for (const d of Array.from(l.querySelectorAll(we)))
    d.hidden = d !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !qr(t, c) && !Eh(t, c) && Ms(t, n ?? c);
}
function yh(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Ah(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function _h(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function Th(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function Rh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function $h(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function kh(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(we)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function wh(e, t, n) {
  const r = e.getAttribute(Br);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Ur(n, n.textContent?.trim() ?? "");
}
function Ur(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && K(n) !== "efeito aplicado") return n;
  const r = bf(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && K(a) !== "aplicado" ? a : null;
}
function qr(e, t) {
  return e.classList.contains(hp) || K(t).includes("aplicado");
}
function Eh(e, t) {
  const n = e.getAttribute(qt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Cn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Ms(e, t) {
  e.getAttribute(Ee) === "true" && e.getAttribute(Ye) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ee, "true"), e.setAttribute(Ye, "true"), e.setAttribute(bp, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Dr("✦", `${i}__button-icon--effect`),
    me("Aplicar")
  ));
}
function Ch(e) {
  e.getAttribute(Ee) === "true" && K(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ee, "true"), e.setAttribute(Ye, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Dr("✓", `${i}__button-icon--effect-applied`),
    me("Aplicado")
  ));
}
function Fs(e, t, n) {
  const r = e.getAttribute(Br) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Ur(t, n) ?? n;
}
function Ih(e) {
  qr(e, e.textContent?.trim() ?? "") || e.remove();
}
function Sh(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ee), e.removeAttribute(Ye), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(qt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(me(t));
}
function Lh(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ee), e.removeAttribute(Ye), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(qt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Dr("✓", `${i}__button-icon--effect-resisted`),
    me(t)
  );
}
function Dh(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(qt), e.removeAttribute("aria-disabled");
}
function vh(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Ph = "data-paranormal-toolkit-card-layout-normalized";
function Nh(e) {
  const t = Oh(e.rollCard), n = xh(t);
  return Fg({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function Oh(e) {
  return {
    rollCard: e,
    damageSection: qg(e),
    resistance: e.querySelector(Ar),
    damageActions: Gg(e),
    effectActionSource: jg(e),
    effectSection: dh(e)
  };
}
function xh(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(Ph, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = et(t, "Conjuração"), c = Mh({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), rh(t, a));
  const d = mh({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: Fh(n, c),
    fallbackAfter: l
  });
  return d && fh(t, d), d;
}
function Mh(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function Fh(e, t) {
  return e ?? t;
}
const Bs = [0, 80, 180, 400, 900, 1600, 3e3], Ja = /* @__PURE__ */ new WeakSet();
function Bh(e) {
  Us(e), Uh(e);
}
function Us(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    qs(t);
}
function Uh(e) {
  if (!Ja.has(e)) {
    Ja.add(e);
    for (const t of Bs)
      globalThis.setTimeout(() => {
        Us(e);
      }, t);
  }
}
function qs(e) {
  const t = Nh({
    rollCard: e,
    refreshDelaysMs: Bs,
    onRefresh: () => qs(e)
  });
  Gp({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const qh = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Gh(e) {
  for (const t of Array.from(e.querySelectorAll(Ar)))
    jh(t);
  Bh(e);
}
function jh(e) {
  const t = e.querySelector(nd), n = e.querySelector(wi), r = e.querySelector(xt), a = e.querySelector(Ei);
  if (!r || !t && !n && !a) return;
  const o = zh(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), Vh(a)), Qh(r), r.parentElement !== e && e.append(r);
}
function zh(e, t) {
  const n = e.querySelector(`.${ka}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(ka), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Vh(e) {
  const t = Hh(e.textContent ?? "");
  t && (e.setAttribute(qh, "true"), e.replaceChildren(Yh(t)));
}
function Hh(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Wh(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Wh(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Kh(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Kh(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Yh(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Zh(e);
  return r && t.append(r), t;
}
function Qh(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Bt(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function Zh(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Xh(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Xh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? eo(e, "highest") : n.includes("kl") ? eo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function eo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function to(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Gr() {
  const e = globalThis.game;
  return Gt(e) ? e : null;
}
function N(e, t) {
  const n = Jh(e, t);
  return yt(n);
}
function Jh(e, t) {
  return t.split(".").reduce((n, r) => Gt(n) ? n[r] : null, e);
}
function eb(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Qe(e.slice(0, n)) !== Qe(t) ? null : ve(e.slice(n + 1));
}
function yt(e) {
  return typeof e == "string" ? ve(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Gt(e) {
  return !!e && typeof e == "object";
}
function tb(e) {
  return typeof e == "string";
}
function jt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function ve(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Qe(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Wn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function Y(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Gs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function nb(e) {
  for (const t of Array.from(e.querySelectorAll(Ju))) {
    const n = cb(t);
    rb(t), n && (ab(t, n), ob(t, n));
  }
}
function rb(e) {
  for (const t of Array.from(e.querySelectorAll(ed)))
    t.remove();
}
function ab(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(ki) ?? null, a = r?.querySelector(Xu) ?? null, o = r ?? e, s = o.querySelector(od);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Eb(t.elementTone), l.textContent = wb(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function ob(e, t) {
  const n = ib(e);
  sb(e, n);
  const r = lb(t);
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
  const o = e.querySelector(Ci);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function ib(e) {
  return e.closest(`.${i}`)?.querySelector(ki) ?? null;
}
function sb(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(id)))
      a.remove();
}
function lb(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Wn(e.target)}` : null,
    e.duration ? `Duração: ${Wn(e.duration)}` : null,
    e.resistance ? `Resistência: ${Gs(e.resistance)}` : null
  ].filter(jt);
}
function cb(e) {
  const t = ub(e), n = hb(e), a = (t ? gb(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = jr(N(a, "element")), l = q("op.elementChoices", s) ?? no(re(o, "Elemento")) ?? no(n.damageType), c = s ?? Cb(l), d = N(a, "circle") ?? re(o, "Círculo"), m = Ab(a) ?? re(o, "Alvo"), b = $b(a, "duration", "op.durationChoices") ?? re(o, "Duração"), T = bb(e) ?? Tb(a) ?? re(o, "Resistência"), _ = yb(o) ?? n.cost, g = {
    elementLabel: l,
    elementTone: c,
    circle: d,
    cost: _,
    target: m,
    duration: b,
    resistance: T
  };
  return kb(g) ? g : null;
}
function ub(e) {
  const t = db(e);
  if (!t) return null;
  const n = t.getFlag?.(u, Ot), r = fb(n);
  if (r.length === 0) return null;
  const a = mb(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function db(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Gr()?.messages?.get?.(n) ?? null : null;
}
function mb(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${$a}]`))) {
    const a = r.getAttribute($a)?.trim();
    a && n.add(a);
  }
  return n;
}
function fb(e) {
  if (!Gt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(pb).filter((n) => n !== null) : [];
}
function pb(e) {
  return Gt(e) ? {
    pendingId: yt(e.pendingId),
    actorId: yt(e.actorId),
    itemId: yt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(tb) : []
  } : null;
}
function gb(e) {
  if (!e.itemId) return null;
  const t = Gr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function hb(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(td))) {
    const a = ve(r.textContent);
    if (!a) continue;
    const o = eb(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function bb(e) {
  const t = ve(e.querySelector(wi)?.textContent);
  return t ? Gs(t) : null;
}
function re(e, t) {
  const n = Qe(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || Qe(r.slice(0, a)) !== n))
      return ve(r.slice(a + 1));
  }
  return null;
}
function yb(e) {
  const t = re(e, "Custo") ?? re(e, "PE");
  return t || (e.map(ve).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Ab(e) {
  const t = N(e, "target");
  if (!t) return null;
  if (t === "area")
    return _b(e) ?? q("op.targetChoices", t) ?? "Área";
  const n = q("op.targetChoices", t) ?? Y(t);
  return [t === "people" || t === "creatures" ? N(e, "targetQtd") : null, n].filter(jt).join(" ");
}
function _b(e) {
  const t = N(e, "area.name"), n = N(e, "area.size"), r = N(e, "area.type"), a = t ? q("op.areaChoices", t) ?? Y(t) : null, o = r ? q("op.areaTypeChoices", r) ?? Y(r) : null;
  return a ? n ? o ? `${a} ${n}m ${Wn(o)}` : `${a} ${n}m` : a : null;
}
function Tb(e) {
  const t = N(e, "skillResis"), n = N(e, "resistance");
  if (!t || !n) return null;
  const r = q("op.skill", t) ?? Y(t), a = Rb(n);
  return [r, a].filter(jt).join(" ");
}
function Rb(e) {
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
      return q("op.resistanceChoices", e) ?? Y(e);
  }
}
function $b(e, t, n) {
  const r = N(e, t);
  return r ? q(n, r) ?? Y(r) : null;
}
function kb(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function wb(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Eb(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(jt).join(" ");
}
function jr(e) {
  const t = Qe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function no(e) {
  const t = jr(e);
  return t ? q("op.elementChoices", t) ?? Y(t) : e ? Y(e) : null;
}
function Cb(e) {
  return jr(e);
}
function q(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Gr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const ro = "data-paranormal-toolkit-dice-toggle-enhanced";
function Ib(e) {
  for (const t of Array.from(e.querySelectorAll(Ii)))
    js(t);
}
function Sb(e) {
  const t = Vs(e.target);
  if (!t) return;
  const n = zr(t);
  n && (e.preventDefault(), zs(n, t));
}
function Lb(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Vs(e.target);
  if (!t) return;
  const n = zr(t);
  n && (e.preventDefault(), zs(n, t));
}
function js(e) {
  const t = e.querySelector(Mt);
  if (!t) return;
  const n = e.querySelector(Tr);
  if (n && n.getAttribute(ro) !== "true" && (n.setAttribute(ro, "true"), n.classList.add(Rr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function zs(e, t) {
  const n = e.querySelector(Mt);
  if (!n) return;
  const r = !e.classList.contains(_r);
  Db(e, t, n, r);
}
function Db(e, t, n, r) {
  e.classList.toggle(_r, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Vs(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Tr);
  if (!t) return null;
  const n = zr(t);
  return n ? (js(n), t.classList.contains(Rr) ? t : null) : null;
}
function zr(e) {
  const t = e.closest(Ii);
  return t && t.querySelector(Mt) ? t : null;
}
const ao = `${u}-workflow-dice-toggle-styles`;
function vb() {
  if (document.getElementById(ao)) return;
  const e = document.createElement("style");
  e.id = ao, e.textContent = `
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
const Pb = [0, 100, 500, 1500, 3e3];
let oo = !1, ln = null;
function Nb() {
  if (!oo) {
    oo = !0, vb(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ze(to(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ze(to(t));
    }), Hooks.once("ready", () => {
      ze(document), Ob();
    }), document.addEventListener("click", Sb), document.addEventListener("keydown", Lb);
    for (const e of Pb)
      globalThis.setTimeout(() => ze(document), e);
  }
}
function Ob() {
  ln || !document.body || (ln = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ze(n);
  }), ln.observe(document.body, { childList: !0, subtree: !0 }));
}
function ze(e) {
  e && (kd(e), nb(e), Gh(e), Ib(e), hd(e));
}
function xb() {
  Nb();
}
const Mb = "data-paranormal-toolkit-action-section", Fb = "ritual-log", Bb = ".paranormal-toolkit-item-use-prompt__actions", Ub = ".paranormal-toolkit-item-use-prompt__actions-title", qb = [0, 100, 500, 1500];
let io = !1;
function Gb() {
  if (io) return;
  const e = (t, n) => {
    so(Hb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), so(document), io = !0;
}
function so(e) {
  for (const t of qb)
    globalThis.setTimeout(() => jb(e), t);
}
function jb(e) {
  zb(e), Vb(e);
}
function zb(e) {
  for (const t of e.querySelectorAll(
    `[${Mb}="${Fb}"]`
  ))
    t.remove();
}
function Vb(e) {
  for (const t of e.querySelectorAll(Bb)) {
    if (lo(t.querySelector(Ub)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => lo(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function Hb(e) {
  if (e instanceof HTMLElement || Wb(e))
    return e;
  if (Kb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Wb(e) {
  return e instanceof HTMLElement;
}
function Kb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function lo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ve = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Hs = {
  PV: "system.attributes.hp"
}, Kn = {
  PV: [Ve.PV, Hs.PV],
  SAN: [Ve.SAN],
  PE: [Ve.PE],
  PD: [Ve.PD]
}, Yn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Yb {
  getResource(t, n) {
    const r = co(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), d = mo(t, n, o, l, "valor atual");
    if (d) return p(d);
    const m = mo(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = co(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function co(e, t) {
  const n = Qb(e.type, t);
  if (n && uo(e, n))
    return y(n);
  const r = Kn[t].find(
    (a) => uo(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Zb(e, t),
    path: Kn[t].join(" | ")
  });
}
function Qb(e, t) {
  return e === "threat" ? Hs[t] ?? null : e === "agent" ? Ve[t] : null;
}
function uo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Zb(e, t) {
  const n = e.type ?? "unknown", r = Kn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function mo(e, t, n, r, a) {
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
class Xb {
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
      const s = Yn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = Jb(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Yn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Jb(e) {
  if (fo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (fo(n))
      return n;
  }
  return null;
}
function fo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const ey = "dice-so-nice";
async function Ws(e) {
  if (!ty() || !ny()) return;
  const t = ry();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function ty() {
  try {
    return Zu().enabled;
  } catch {
    return !1;
  }
}
function ny() {
  return game.modules?.get?.(ey)?.active === !0;
}
function ry() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const po = "occultism";
class Ks {
  getDifficulty(t) {
    return ay(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await iy(t, po);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Ws(r);
    const a = cy(r);
    return {
      skill: po,
      skillLabel: "Ocultismo",
      roll: r,
      formula: ly(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: uy(r)
    };
  }
}
function ay(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function oy(e) {
  return new Ks().rollCastingCheck(e);
}
async function iy(e, t) {
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
  return sy(r);
}
function sy(e) {
  return go(e) ? e : Array.isArray(e) ? e.find(go) ?? null : null;
}
function go(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function ly(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function cy(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function uy(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(dy);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function dy(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const my = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class fy {
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
    const r = n.value, a = py(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: my[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function py(e, t) {
  const n = e.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : gy(n) ? {
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
function gy(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const cn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function hy(e) {
  if (!Ry(e.item)) return null;
  const t = Qn(e.actor) ? e.actor : by(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Ay(e.token) ?? yy(t),
    targets: hr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function by(e) {
  const t = e;
  return Qn(t.actor) ? t.actor : Qn(e.parent) ? e.parent : null;
}
function yy(e) {
  const t = _y(e) ?? Ty(e);
  return t ? Ys(t) : null;
}
function Ay(e) {
  return Zn(e) ? Ys(e) : null;
}
function _y(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Zn(n) ? n : (t.getActiveTokens?.() ?? []).find(Zn) ?? null;
}
function Ty(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ys(e) {
  const t = e.actor ?? null;
  return {
    tokenId: un(e.id),
    actorId: un(t?.id),
    sceneId: un(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Ry(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Qn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Zn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function un(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class $y {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(cn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${cn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = hy(ky(t));
    if (!n) {
      f.warn(`${cn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function ky(e) {
  return e && typeof e == "object" ? e : {};
}
class wy {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return dn("missing-item-patch");
    if (t.type !== "ritual") return dn("unsupported-item-type");
    const a = Ey(r);
    return Object.keys(a).length === 0 ? dn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function Ey(e) {
  const t = {};
  I(t, "name", e.name), I(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (I(t, "system.circle", n.circle), I(t, "system.element", n.element), I(t, "system.target", n.target), I(t, "system.targetQtd", n.targetQuantity), I(t, "system.execution", n.execution), I(t, "system.range", n.range), I(t, "system.duration", n.duration), I(t, "system.skillResis", n.resistanceSkill), I(t, "system.resistance", n.resistance), I(t, "system.studentForm", n.studentForm), I(t, "system.trueForm", n.trueForm)), t;
}
function I(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function dn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Cy {
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
    return this.getNumber(t, Yn.ritual.dt, 0);
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
class Iy {
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
class Sy {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Ly(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, mn(t)), y(t)) : n;
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
    return n ? mn(n) : null;
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
    return Array.from(this.presets.values()).map(mn);
  }
  findForItem(t) {
    return this.list().map((n) => Dy(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Ly(e) {
  return !fn(e.id) || !fn(e.version) || !fn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Dy(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = vy(a, t);
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
function vy(e, t) {
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
      const n = ho(t.name), r = e.names.map(ho).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Py(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function ho(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Py(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function mn(e) {
  return structuredClone(e);
}
function fn(e) {
  return typeof e == "string" && e.length > 0;
}
function $t(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = zt(e.amountFrom);
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
function zt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function Ny(e, t, n) {
  if (!bo(e.id) || !bo(e.formula))
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
    await Ws(a);
    const l = {
      ...n.rollRequests[e.id] ?? Qs(e, t),
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
function Qs(e, t) {
  const n = e.intent ?? Oy(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Oy(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function bo(e) {
  return typeof e == "string" && e.length > 0;
}
async function kt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? dt(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? dt(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? dt(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? dt(t, n, r, a) : e.recover(t, n, a);
  }
}
function dt(e, t, n, r) {
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
function xy(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = My(t, n, r, a);
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
    const s = Fy(t, n, r, a);
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
function My(e, t, n, r) {
  const a = zt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Zs(t.id, "damage", r, t.damageInstances.length),
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
function Fy(e, t, n, r) {
  const a = zt(e.amountFrom);
  return {
    id: Zs(t.id, "healing", r, t.healingInstances.length),
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
function Zs(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function By(e, t, n) {
  const r = zt(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function Uy(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Xs("before", e), yo("before", e), yo("resolve", e);
}
function qy(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Xs("apply", e);
}
function Gy(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Xs(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = jy(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function yo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function jy(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function zy(e, t, n) {
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
async function Vy(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Hy(e, t);
    case "spendRitualCost":
      return Wy(e, t);
  }
}
async function Hy(e, t) {
  const { context: n, resources: r } = e, a = $t(t, n);
  return a.ok ? Js(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function Wy(e, t) {
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
  }), Js(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Js(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ky(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = Yy(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function Yy(e) {
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
class Qy {
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
        return Ky({
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
    const a = await Vy({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Qs(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await Ny(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = $t(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = By(t, n, a.value);
    Uy({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), qy({
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
      const c = await kt(this.resources, l, t.resource, t.operation, a.value), d = this.handleResourceOperationResult(c, n, r, t);
      if (!d.ok)
        return d;
      xy({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Gy({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = $t(t, n);
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
      const l = await kt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await zy(this.messages, t, n);
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
    const l = Zy(t, n.intent);
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
function Zy(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Xy {
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
class Jy {
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
function el(e) {
  return {
    id: eA(),
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
function eA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class tA {
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
    return ie(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = el(n);
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
class nA {
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
class rA {
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
    const n = kn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: aA(),
      flags: {
        ...t.flags,
        [u]: {
          ...oA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = kn();
    if (!r.enabled)
      return;
    const a = n.notification ?? Ao(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Ao(n);
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
function Ao(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function aA() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function oA(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const iA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", tl = `${u}-inline-roll-neutralized`, sA = `${u}-inline-roll-notice`, Vr = `data-${u}-inline-roll-neutralized`, _o = `data-${u}-inline-roll-notice`, lA = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function To(e) {
  const t = RA(e.message), n = await cA(e.message), r = uA(t);
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
async function cA(e) {
  const t = AA(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = dA(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await _A(t, n.content), replacementCount: n.replacementCount };
}
function uA(e) {
  const t = e ? TA(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = nl(t);
  return n > 0 && rl(hA(t)), { replacementCount: n };
}
function dA(e) {
  const t = mA(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = nl(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (rl(n.content), { content: n.innerHTML, replacementCount: a });
}
function mA(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, pA(a.trim()))), replacementCount: t };
}
function nl(e) {
  const t = fA(e);
  for (const n of t)
    n.replaceWith(gA(bA(n)));
  return t.length;
}
function fA(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(iA))
    n.getAttribute(Vr) !== "true" && t.add(n);
  return Array.from(t);
}
function pA(e) {
  return `<span class="${tl}" ${Vr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${$A(e)}</span>`;
}
function gA(e) {
  const t = document.createElement("span");
  return t.classList.add(tl), t.setAttribute(Vr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function rl(e) {
  if (e.querySelector?.(`[${_o}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(sA), t.setAttribute(_o, "true"), t.textContent = lA, e.append(t);
}
function hA(e) {
  return e.querySelector(".message-content") ?? e;
}
function bA(e) {
  const n = e.getAttribute("data-formula") ?? yA(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function yA(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function AA(e) {
  return e && typeof e == "object" ? e : null;
}
async function _A(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function TA(e) {
  const t = kA(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function RA(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function $A(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function kA(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const wt = "ritualRollConfig", Te = "ritual-roll";
function Vt() {
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
function al(e) {
  const t = e.getFlag(u, wt);
  return Xn(t);
}
function ol(e) {
  return al(e) ?? Vt();
}
async function wA(e, t) {
  const n = Xn(t) ?? Xn({
    ...Vt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(u, wt, n), n;
}
async function EA(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, u, wt));
    return;
  }
  await e.setFlag(u, wt, null);
}
function Xn(e) {
  if (!Ht(e)) return null;
  const t = NA(e.intent);
  if (!t) return null;
  const n = Vt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Et(e.damageType),
    utilityLabel: Et(e.utilityLabel) ?? n.utilityLabel,
    note: Hr(e.note),
    forms: OA(e.forms)
  };
}
function CA(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function IA(e) {
  const t = al(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = SA(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...LA(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: vA(e, t),
    resistance: t.intent === "damage" ? il(e) : void 0
  };
}
function SA(e, t) {
  const n = {
    type: "rollFormula",
    id: Te,
    formula: t,
    intent: PA(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function LA(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Te}.total`,
          ...DA(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Te}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function DA(e) {
  return e ? { damageType: e } : {};
}
function vA(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Te]: n
      }
    }
  };
  return Ro(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Te]: t.forms.discente.formula.trim()
    }
  }), Ro(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Te]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function il(e) {
  const t = sl(e), n = Et(t.skillResis), r = Et(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = xA(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function PA(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function NA(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function OA(e) {
  const t = Vt();
  return Ht(e) ? {
    base: pn(e.base),
    discente: pn(e.discente),
    verdadeiro: pn(e.verdadeiro)
  } : t.forms;
}
function pn(e) {
  return Ht(e) ? { formula: Hr(e.formula) } : { formula: "" };
}
function Ro(e, t) {
  const n = sl(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return MA(r);
}
function sl(e) {
  const t = e.system;
  return Ht(t) ? t : {};
}
function xA(e) {
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
function MA(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Hr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Et(e) {
  const t = Hr(e);
  return t.length > 0 ? t : null;
}
function Ht(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function FA(e) {
  switch (BA(e)) {
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
      return UA(String(e ?? ""));
  }
}
function BA(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function UA(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
class qA {
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
class Wt {
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
const GA = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class jA {
  constructor(t = new Wt()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = zA(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(GA);
  }
}
function zA(e, t) {
  const n = [], r = VA(e), a = $o(r), o = $o(e);
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
function VA(e) {
  return HA(e) ? e.document ?? null : e;
}
function HA(e) {
  return "bounds" in e;
}
function $o(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const WA = 100, KA = 12;
class YA {
  constructor(t = new Wt()) {
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
      const a = this.foundryAdapter.getGridSize() ?? WA, o = e_(n), s = await this.foundryAdapter.placeRegion(
        QA(t, this.foundryAdapter.getUserColor(), a),
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
        message: JA(a)
      };
    }
  }
}
function QA(e, t, n) {
  return {
    name: "Ritual: Linha de efeito",
    color: t ?? void 0,
    displayMeasurements: !0,
    highlightMode: "coverage",
    flags: {
      [u]: {
        temporary: !0,
        purpose: "ritual-line-targeting"
      }
    },
    shapes: [ZA(e, n)]
  };
}
function ZA(e, t) {
  const n = XA(e, t);
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
function XA(e, t) {
  return {
    length: ko(e.length, KA, t),
    width: ko(e.width, 1, t)
  };
}
function ko(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function JA(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function e_(e) {
  const t = (n) => {
    const r = t_(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function t_(e) {
  return n_(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function n_(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class r_ {
  constructor(t = new Wt()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(wo(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(wo(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = a_(t);
    o_(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function wo(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function a_(e) {
  return Array.from(new Set(e));
}
function o_(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class i_ {
  constructor(t = new Wt()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(fi)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(s_(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(l_(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: Jn(r.region)
    }));
    for (const r of t) {
      if (!Jn(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = u_(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function s_(e) {
  return [
    { source: "document", region: oe(e.document) },
    { source: "document.object", region: oe(e.document.object) },
    { source: "preview", region: oe(e.preview) },
    { source: "preview.document.object", region: oe(e.preview?.document?.object) }
  ];
}
function l_(e) {
  return [
    { source: "input", region: oe(e) },
    { source: "input.object", region: c_(e) ? oe(e.object) : null },
    { source: "input.document.object", region: ll(e) ? oe(e.document?.object) : null }
  ];
}
function oe(e) {
  return Jn(e) ? e : null;
}
function Jn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return mt(n.x) && mt(n.y) && mt(n.width) && mt(n.height);
}
function ll(e) {
  return "document" in e && "bounds" in e;
}
function c_(e) {
  return !ll(e);
}
function u_(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function mt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const d_ = "Nenhum alvo encontrado na linha.";
class m_ {
  constructor(t = new YA(), n = new i_(), r = new jA(), a = new r_(), o = new qA()) {
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
        const s = this.regionTargetResolver.resolveTargets(o.region);
        return s.targets.length === 0 ? (a(), this.foundryAdapter.warn(d_), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(s.tokens), {
          status: "confirmed",
          targets: s.targets
        });
      } catch (s) {
        a();
        const l = f_(s);
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
function f_(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function p_(e) {
  return {
    header: {
      eyebrow: ur,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: R_(e.ritual)
    },
    forms: e.variantOptions.map((t) => g_(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: y_(e.targetNames, e.variantOptions, e.ritual),
    automation: T_(e.automationStatus ?? "assisted")
  };
}
function g_(e, t) {
  const n = h_(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? b_(t) : "—",
    details: n
  };
}
function h_(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function b_(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function y_(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => A_(a, n))
  };
}
function A_(e, t) {
  const n = e.targeting ?? __(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function __(e, t) {
  const n = Se(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function T_(e) {
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
function R_(e) {
  const t = e.system, n = [k_(t?.element), $_(t?.circle)].filter(C_);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function $_(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function k_(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (w_(e)) {
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
      return E_(e);
  }
}
function w_(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function E_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function C_(e) {
  return typeof e == "string" && e.length > 0;
}
const cl = ["base", "discente", "verdadeiro"];
function ul(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ct(e) {
  return typeof e == "string" && cl.includes(e);
}
const { ApplicationV2: I_ } = foundry.applications.api;
class We extends I_ {
  constructor(t, n) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = p_(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: We.onCast,
      cancel: We.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new We(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    D_(a, (o) => {
      this.selectedVariant = o, er(a, o);
    }), er(a, this.selectedVariant), v_(a, (o) => {
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
          ${this.model.forms.map(S_).join("")}
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
          ${this.model.targets.forms.map(L_).join("")}
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
    const n = x_(t), r = P_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function S_(e) {
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
function L_(e) {
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
function D_(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => Eo(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Eo(e, a, t));
    });
  const r = dl(e);
  r && t(r);
}
function Eo(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Ct(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), dl(e), er(e, r.value));
}
function dl(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Ct(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function er(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function v_(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function P_(e, t, n) {
  const r = O_(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = N_(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function N_(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function O_(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Ct(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Ct(n) ? n : null;
}
function x_(e) {
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
async function M_(e) {
  return We.request(e);
}
const Wr = {
  label: "Padrão"
}, F_ = {
  label: "Discente",
  extraCost: 2
}, B_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class U_ {
  constructor(t, n, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = r;
  }
  workflow;
  resources;
  ritualCosts;
  areaTargeting = new m_();
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
    const r = this.resolveCostPreview(t), a = LT(n), o = CT(
      n,
      t.item,
      r,
      a
    ), s = await M_({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: r,
      defaultSpendResource: xT(n),
      variantOptions: o,
      automationStatus: a ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = q_(s), c = vT(
      n,
      t.item,
      l.variant,
      a
    ), d = await this.areaTargeting.resolvePreCastTargets({
      castOptions: l,
      formTargeting: c.targeting,
      currentTargets: t.targets
    });
    if (d.status === "cancelled")
      return { status: "cancelled" };
    if (d.status === "failed")
      return {
        status: "failed",
        reason: d.reason,
        message: d.message
      };
    const m = G_(
      t,
      d.targets
    ), b = Ai();
    let T = null;
    if (b) {
      const C = await z_(
        this.resources,
        m.actor,
        l,
        c,
        r
      );
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        T = await oy(
          m.actor
        );
      } catch (v) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: v instanceof Error ? v.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: v
        };
      }
    }
    const _ = j_(
      n,
      l,
      c,
      r,
      {
        includeCostSteps: !b
      }
    );
    if (_.steps.length === 0) {
      const C = DT(
        m,
        l
      ), v = Io(
        n,
        m
      ), Jl = Co(
        m.actor,
        T,
        c,
        r
      ), oa = So(
        n,
        l,
        c,
        r,
        C,
        m,
        T
      );
      if (!v.ok)
        return {
          status: "failed",
          reason: v.reason,
          message: v.message
        };
      const ia = [
        ...Jl,
        ...v.actions
      ];
      return ia.length > 0 ? {
        status: "ready",
        workflowContext: C,
        itemUseContext: m,
        actions: ia,
        summaryLines: oa
      } : {
        status: "completed-without-actions",
        workflowContext: C,
        itemUseContext: m,
        summaryLines: oa
      };
    }
    const g = await this.workflow.runAutomation(_, {
      sourceActor: m.actor,
      sourceToken: m.token,
      item: m.item,
      targets: m.targets,
      flags: {
        itemUse: {
          source: m.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: l.variant,
          spendResource: l.spendResource
        }
      }
    });
    if (!g.ok)
      return {
        status: "failed",
        reason: g.error.reason,
        message: g.error.message,
        cause: g.error
      };
    const z = g.value.context, V = Q_(
      n,
      m,
      z
    ), Z = Io(
      n,
      m
    ), xe = Co(
      m.actor,
      T,
      c,
      r
    ), Me = So(
      n,
      l,
      c,
      r,
      z,
      m,
      T
    );
    if (!V.ok)
      return {
        status: "failed",
        reason: V.reason,
        message: V.message
      };
    if (!Z.ok)
      return {
        status: "failed",
        reason: Z.reason,
        message: Z.message
      };
    const Fe = [
      ...xe,
      ...V.actions,
      ...Z.actions
    ];
    return Fe.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: z,
      itemUseContext: m,
      summaryLines: Me
    } : {
      status: "ready",
      workflowContext: z,
      itemUseContext: m,
      actions: Fe,
      summaryLines: Me
    };
  }
  async applyAction(t) {
    return kt(
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
function q_(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function G_(e, t) {
  return {
    ...e,
    targets: t
  };
}
function j_(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Yr(l) && (!a.includeCostSteps || !s) || o.push(V_(l, n));
  return a.includeCostSteps && s && r && MT(n.extraCost) && o.push({
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
async function z_(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = nt(a, r);
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
function Co(e, t, n, r) {
  if (!t || t.success) return [];
  const a = nt(r, n);
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
function Io(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = Kr(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = Ni(o);
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
    const s = $t(o, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Kr(o.actor, t);
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
      r.push(tT(o, c, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...eT(
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
  const r = oT(t), a = e.get(r);
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
  const r = iT(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function eT(e, t, n, r) {
  const a = uT(e), o = a.length > 1 ? fT() : void 0;
  return a.map((s) => {
    const l = r.map(
      (d, m) => {
        const b = dT(d.amount, s);
        return {
          id: nT(d, s, m),
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
      label: rT(c, s, a.length > 1),
      executedLabel: aT(
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
function tT(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = cT(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: sT(e, r, n),
    executedLabel: lT(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function nT(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function rT(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function aT(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function oT(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function iT(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function sT(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function lT(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function cT(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function uT(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function dT(e, t) {
  const n = e * t.multiplier, r = mT(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function mT(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function fT() {
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
function So(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${ul(t.variant)}`,
    bT(t, n, r),
    ...hT(s),
    ...Object.values(a.rolls).flatMap(yT),
    ...pT(e, o),
    ...AT(e.resistance),
    ...wT(n)
  ];
}
function pT(e, t) {
  return gT(e) ? Kr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function gT(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function hT(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function bT(e, t, n) {
  const r = nt(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function yT(e) {
  const n = [`${ET(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = _T(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${FA(e.damageType)}`), n;
}
function AT(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function _T(e) {
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
    const s = TT(o);
    s && (kT(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function TT(e) {
  const t = RT(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : $T(e);
}
function RT(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function $T(e) {
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
function kT(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function wT(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function ET(e) {
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
function CT(e, t, n, r) {
  return cl.map((a) => {
    const o = ml(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? ul(a),
      enabled: s,
      details: o ? IT(o, n, r) : [],
      finalCostText: o ? ST(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function IT(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  a.length > 0 ? r.push(a.join(", ")) : n && r.push("efeito manual");
  const o = nt(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function nt(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function ST(e, t) {
  const n = nt(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function LT(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Yr);
}
function DT(e, t) {
  return el({
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
function vT(e, t, n, r) {
  return ml(e, t, n, r) ?? Wr;
}
function ml(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? NT(t, n) ? PT(n) : null : n === "base" ? Wr : null);
}
function PT(e) {
  switch (e) {
    case "base":
      return Wr;
    case "discente":
      return F_;
    case "verdadeiro":
      return B_;
  }
}
function NT(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return OT(foundry.utils.getProperty(e, n));
}
function OT(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function xT(e) {
  return e.steps.some(Yr);
}
function Yr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function MT(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const fl = "itemUsePrompts", pl = "chatCard", Kt = "data-paranormal-toolkit-prompt-id", Yt = "data-paranormal-toolkit-pending-id", Qr = "data-paranormal-toolkit-executed-label", tr = "data-paranormal-toolkit-choice-group", gl = "data-paranormal-toolkit-skipped-label", It = "data-paranormal-toolkit-action-section", Lo = "data-paranormal-toolkit-detail-key", Do = "data-paranormal-toolkit-roll-card", Zr = "data-paranormal-toolkit-roll-detail-toggle", hl = "data-paranormal-toolkit-roll-detail-id", bl = "data-paranormal-toolkit-resistance-roll-button", yl = "data-paranormal-toolkit-resistance-skill", Al = "data-paranormal-toolkit-resistance-skill-label", _l = "data-paranormal-toolkit-resistance-target-actor-id", Tl = "data-paranormal-toolkit-resistance-target-name", Rl = "data-paranormal-toolkit-resistance-roll-result", vo = "data-paranormal-toolkit-system-card-replaced", FT = `[${Yt}]`, BT = `[${Zr}]`, UT = `[${bl}]`, nr = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, qT = `${h}__actions`, Po = `${h}__details`, $l = `${h}__summary`, GT = `${h}__title`, kl = `${h}__button--executed`, No = `${h}__roll-card`;
let Oo = !1, rr = null;
const x = /* @__PURE__ */ new Map(), jT = [0, 100, 500, 1500, 3e3], zT = 3e4, VT = [0, 100, 500, 1500, 3e3];
function HT(e) {
  if (rr = e, Oo) {
    Mo(e);
    return;
  }
  const t = (n, r) => {
    El(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Oo = !0, Mo(e);
}
async function xo(e) {
  const t = wl(e);
  x.set(e.pendingId, t), await ea(t) || Fl(t), Cl(e.pendingId);
}
async function WT(e) {
  const t = wl({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", x.set(e.pendingId, t), await ea(t) || Fl(t), Cl(e.pendingId);
}
async function gn(e, t) {
  const n = x.get(e);
  x.delete(e), n && await WR(n, t);
}
function Xr(e) {
  const t = zl();
  for (const n of t) {
    const r = j(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function KT(e, t) {
  const n = Xr(e);
  if (!n) return;
  const r = j(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Pe(n.message, r));
}
async function YT(e, t, n) {
  if (!t) return;
  const r = Xr(e);
  if (!r) return;
  const a = j(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Pe(r.message, a);
}
function wl(e) {
  const t = Q(e.context.message), n = e.context.targets.find((s) => sr(s)), r = n ? sr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: RR(e.context),
    executed: !1
  };
}
function El(e, t, n) {
  HR();
  const r = Zt(t);
  if (!r) return;
  const a = jR(e, r);
  a.length > 0 && St(r);
  for (const o of a)
    ar(r, o);
  vl(r, n), or(r), ir(r);
}
function Mo(e) {
  for (const t of VT)
    globalThis.setTimeout(() => {
      QT(e);
    }, t);
}
function QT(e) {
  for (const t of ZT()) {
    const n = Qt(t);
    XT(n) && El(n, t, e);
  }
}
function ZT() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function XT(e) {
  return e ? ta(e) ? !0 : YR(e).length > 0 : !1;
}
function Cl(e) {
  const t = x.get(e);
  if (!t) return;
  const n = t.messageId ? zR(t.messageId) : null;
  if (n) {
    Go(n, t), St(n), ar(n, t), Fo(n), or(n), ir(n);
    return;
  }
  if (t.messageId) {
    cr(t);
    return;
  }
  const r = VR(t);
  if (r) {
    Go(r, t), St(r), ar(r, t), Fo(r), or(r), ir(r);
    return;
  }
  cr(t);
}
function Fo(e) {
  rr && vl(e, rr);
}
function St(e) {
  const t = JT();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Dl(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(vo) === "true") return;
  const r = n.querySelector(`.${nr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(vo, "true");
}
function JT() {
  try {
    return bu() === "replace";
  } catch {
    return !1;
  }
}
function ar(e, t) {
  if (St(e), e.querySelector(`[${Kt}="${Ne(t.pendingId)}"]`)) return;
  const n = tR(e, t);
  rR(n, t);
  const r = yR(t);
  if (eR(r)) return;
  bR(n, r).append(TR(t));
}
function eR(e) {
  return Sl(e.id) && !le();
}
function Il(e) {
  const n = e.closest(`[${It}]`)?.getAttribute(It) ?? null;
  return Sl(n) && !le();
}
function Sl(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function tR(e, t) {
  const n = e.querySelector(`.${nr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(nr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(GT), s.textContent = nR(t);
  const l = document.createElement("span");
  return l.classList.add($l), l.textContent = t.summary, a.append(o, s, l), r.append(a), kR(e).append(r), r;
}
function nR(e) {
  const t = S(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function rR(e, t) {
  const n = t.summaryLines ?? [], r = xl(n, t);
  if (r) {
    aR(e, r, t);
    return;
  }
  AR(e, n);
}
function aR(e, t, n) {
  if (e.querySelector(`[${Do}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(No, `${No}--${t.intent}`), r.setAttribute(Do, "true"), t.castingCheck && Bo(r, iR(t.castingCheck), n.pendingId, "casting"), oR(t) && Bo(r, sR(t), n.pendingId, "effect"), mR(r, t), fR(r, t, n), hR(r, t), e.append(r);
}
function oR(e) {
  return e.intent !== "casting";
}
function iR(e) {
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
function sR(e) {
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
function Bo(e, t, n, r) {
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
  lR(a, t), gR(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function lR(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = cR(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function cR(e, t) {
  const n = uR(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of dR(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function uR(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function dR(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Uo(e, "highest") : n.includes("kl") ? Uo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Uo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function mR(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(f$);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function fR(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = pR(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(Ll(t.resistanceRollResult)), e.append(r);
}
function pR(e, t) {
  if (!e.resistanceSkill || !de()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Kt, t.pendingId), n.setAttribute(bl, "true"), n.setAttribute(yl, e.resistanceSkill), n.setAttribute(Al, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(_l, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Tl, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Rl, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Ll(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Nl(e), t;
}
function gR(e, t, n, r, a) {
  const o = t.filter((d) => d.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Zr, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(hl, s), c.hidden = !0;
  for (const d of o) {
    const m = document.createElement("dt");
    m.textContent = d.label;
    const b = document.createElement("dd");
    b.textContent = d.value, c.append(m, b);
  }
  e.append(l, c);
}
function hR(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function bR(e, t) {
  const n = `[${It}="${Ne(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(qT), a.setAttribute(It, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function yR(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = xl(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function AR(e, t) {
  if (t.length === 0) return;
  const n = _R(e);
  for (const r of t) {
    const a = p$(r);
    if (n.querySelector(`[${Lo}="${Ne(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Lo, a), n.append(o);
  }
}
function _R(e) {
  const t = e.querySelector(`.${Po}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Po), e.append(n), n;
}
function TR(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Kt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(kl), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Yt, e.pendingId), t.setAttribute(Qr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(tr, e.choiceGroupId), t.setAttribute(gl, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function RR(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = $R(e);
  return `${t} → ${n}`;
}
function $R(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function kR(e) {
  return Dl(e) ?? e;
}
function Dl(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function vl(e, t) {
  const n = Zt(e);
  if (!n) return;
  const r = n.querySelectorAll(FT);
  for (const a of r) {
    if (Il(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      FR(a, t);
    }));
  }
}
function or(e) {
  const t = Zt(e);
  if (!t) return;
  const n = t.querySelectorAll(BT);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      wR(t, r);
    }));
}
function ir(e) {
  const t = Zt(e);
  if (!t) return;
  const n = t.querySelectorAll(UT);
  for (const r of n) {
    if (!de()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      ER(t, r);
    }));
  }
}
function wR(e, t) {
  const n = t.getAttribute(Zr);
  if (!n) return;
  const r = e.querySelector(`[${hl}="${Ne(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function ER(e, t) {
  if (!de()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(Kt), r = t.getAttribute(yl), a = t.getAttribute(Al) ?? (r ? se(r) : "Resistência");
  if (!n || !r) return;
  const o = SR(e, n), s = LR(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Nd(s, r);
    await OR(c.roll);
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
    CR(t, d), IR(t, d), xR(n, d), await MR(e, n, d);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function CR(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Rl, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function IR(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? Ll(t);
  if (r) {
    r.textContent = Nl(t);
    return;
  }
  n.append(a);
}
function SR(e, t) {
  const n = x.get(t);
  if (n) return n;
  const r = Qt(e);
  return j(r)[t] ?? null;
}
function LR(e, t) {
  const n = e?.resistanceTargetActor;
  if (U(n)) return n;
  const a = e?.context?.targets.map(sr).find(U) ?? null;
  if (a) return a;
  const o = t.getAttribute(_l) ?? e?.resistanceTargetActorId ?? null, s = o ? vR(o) : null;
  return s || PR(
    t.getAttribute(Tl) ?? e?.resistanceTargetName ?? DR(t)
  );
}
function DR(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${$l}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function sr(e) {
  const t = e.actor;
  if (U(t)) return t;
  const n = e.token, r = Ze(n);
  if (r) return r;
  const a = e.document;
  return Ze(a);
}
function Ze(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (U(t)) return t;
  const n = e.document?.actor;
  return U(n) ? n : null;
}
function vR(e) {
  const n = game.actors?.get?.(e);
  return U(n) ? n : Pl().map((o) => Ze(o)).find((o) => o?.id === e) ?? null;
}
function PR(e) {
  const t = Re(e);
  if (!t) return null;
  const n = Pl().filter((o) => Re(NR(o)) === t).map((o) => Ze(o)).find(U) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => U(o) && Re(o.name) === t);
  return U(a) ? a : null;
}
function Pl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function NR(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ze(e)?.name ?? null;
}
function Re(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function U(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Nl(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function OR(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function xR(e, t) {
  const n = x.get(e);
  n && (n.resistanceRollResult = t);
}
async function MR(e, t, n) {
  const r = Qt(e);
  if (r)
    try {
      const a = j(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Pe(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function Qt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return G(r?.get?.(n));
}
async function FR(e, t) {
  if (Il(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(Yt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Ol(e, e.getAttribute(Qr) ?? "✓ Automação aplicada"), BR(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Ol(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(kl), e.removeAttribute(Yt), e.removeAttribute(Qr);
}
function BR(e) {
  const t = e.getAttribute(tr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${tr}="${Ne(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(gl) ?? "✓ Outra opção escolhida";
    Ol(a, o);
  }
}
function xl(e, t) {
  const n = e.map(Jr).filter(d$), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = S(e, "Forma"), o = S(e, "Custo"), s = S(e, "Dados") ?? S(e, `Dados (${r.label})`), l = S(e, "Tipo"), c = S(e, "Resistência"), d = S(e, "Resistência Perícia"), m = S(e, "Resistência Rótulo") ?? (d ? se(d) : null), b = Ml(e, "Observação"), T = e.filter((g) => GR(g, r)), _ = UR(e);
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
    castingCheck: _,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function UR(e) {
  const t = e.map(Jr).find((o) => o?.intent === "casting") ?? null, n = S(e, "Conjuração DT"), r = S(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: S(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: S(e, "Dados (Conjuração)")
  } : null;
}
function Jr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: qR(n)
  } : null;
}
function qR(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function S(e, t) {
  return Ml(e, t)[0] ?? null;
}
function Ml(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function GR(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Jr(e) ? !1 : e.trim().length > 0;
}
function jR(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of x.values())
    lr(r, e, t) && n.set(r.pendingId, r);
  for (const r of KR(e))
    lr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function lr(e, t, n) {
  const r = Q(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !qo(n, "itemId", e.itemId) ? !1 : !e.actorId || qo(n, "actorId", e.actorId);
}
function qo(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${g$(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function zR(e) {
  const t = Ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function VR(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (lr(e, null, t))
      return t;
  return null;
}
function HR() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of x.entries())
    e - r.createdAt > t && x.delete(n);
}
async function Go(e, t) {
  const n = Qt(e);
  if (!n) return !1;
  try {
    const r = j(n);
    return r[t.pendingId] = na(t, Q(n)), await Pe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function ea(e) {
  const t = ql(e);
  if (!t) return !1;
  try {
    const n = j(t);
    return n[e.pendingId] = na(e, Q(t)), await Pe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Fl(e) {
  for (const t of jT)
    globalThis.setTimeout(() => {
      cr(e);
    }, t);
}
async function cr(e) {
  const t = ql(e);
  if (ta(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await ea(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function WR(e, t) {
  const n = Ul(e.context.message);
  if (n)
    try {
      const r = j(n), a = r[e.pendingId] ?? na(e, Q(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Pe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function KR(e) {
  return Object.values(j(G(e))).filter(rt);
}
function j(e) {
  if (!e) return {};
  const t = {}, n = ta(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(Bl(e)))
    t[r] ??= a;
  return t;
}
function YR(e) {
  return Object.values(Bl(G(e))).filter(rt);
}
function Bl(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, fl);
  if (!Ce(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    rt(a) && (n[r] = a);
  return n;
}
async function Pe(e, t) {
  typeof e.setFlag == "function" && (await ZR(e, t), await QR(e, t));
}
async function QR(e, t) {
  await Promise.resolve(e.setFlag?.(u, fl, t));
}
function ta(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, pl);
  return c$(t) ? t : null;
}
async function ZR(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(rt).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? Q(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: XR(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(u, pl, a));
}
function XR(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function na(e, t) {
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
function Ul(e) {
  const t = G(e);
  if (t?.setFlag)
    return t;
  const n = JR(e);
  if (n?.setFlag)
    return n;
  const r = Q(e);
  if (!r) return null;
  const a = game.messages;
  return G(a?.get?.(r));
}
function JR(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(G).find((n) => typeof n?.setFlag == "function") ?? null;
}
function ql(e) {
  const t = Ul(e.context.message);
  if (t) return t;
  const n = e.messageId ? e$(e.messageId) : null;
  if (n) return n;
  const r = zl().slice().reverse();
  return r.find((a) => t$(a, e)) ?? r.find((a) => n$(a, e)) ?? null;
}
function e$(e) {
  const t = game.messages;
  return G(t?.get?.(e));
}
function t$(e, t) {
  const n = Q(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Gl(e, t)) return !1;
  const a = jl(e);
  return !t.actorId || !a || a === t.actorId;
}
function n$(e, t) {
  if (!a$(e, t)) return !1;
  const n = jl(e);
  return t.actorId && n === t.actorId ? !0 : Gl(e, t);
}
function Gl(e, t) {
  const n = Re(r$(e));
  if (!n) return !1;
  const r = Re(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Re(t.itemId);
  return !!(a && n.includes(a));
}
function r$(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function jl(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function a$(e, t) {
  const n = o$(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= zT;
}
function o$(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function G(e) {
  return e && typeof e == "object" ? e : null;
}
function rt(e) {
  return Ce(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && L(e.messageId) && L(e.itemId) && L(e.actorId) && L(e.itemName) && ne(e.resistanceTargetActorId) && ne(e.resistanceTargetName) && u$(e.resistanceRollResult) && i$(e.actionPayload) && hn(e.title) && hn(e.buttonLabel) && hn(e.executedLabel) && ne(e.choiceGroupId) && ne(e.skippedLabel) && ne(e.actionSectionId) && ne(e.actionSectionTitle) && m$(e.summaryLines) : !1;
}
function i$(e) {
  return e == null ? !0 : Ce(e) ? e.kind === "resource-operation" && L(e.actorId) && L(e.actorUuid) && typeof e.actorName == "string" && s$(e.resource) && l$(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function s$(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function l$(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function c$(e) {
  return Ce(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && L(e.messageId) && Ce(e.source) && L(e.source.actorId) && L(e.source.actorName) && L(e.source.itemId) && L(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(rt) : !1;
}
function u$(e) {
  return e == null ? !0 : Ce(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ne(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function d$(e) {
  return e !== null;
}
function Ce(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function L(e) {
  return e === null || typeof e == "string";
}
function hn(e) {
  return e === void 0 || typeof e == "string";
}
function ne(e) {
  return e == null || typeof e == "string";
}
function m$(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function f$(e) {
  return typeof e == "string" && e.length > 0;
}
function zl() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(G).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(G).filter((r) => r !== null) : [];
}
function Zt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Q(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function p$(e) {
  return e.trim().toLowerCase();
}
function g$(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const jo = 1e3;
class h$ {
  constructor(t, n, r, a, o, s) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new U_(
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
      settings: pa(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = pa();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Se(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && $$(t.item) && n.executionMode === "ask") {
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
    if (await To(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: An(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = y$(
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
      return this.pendingExecutions.delete(t), await gn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await gn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Xr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = E$(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await kt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await KT(t), await YT(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (HT(
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
    if (await To(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: An(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      k$(t.item)
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
        await this.registerCompletedRitualCard(
          r.itemUseContext,
          r.summaryLines
        ), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          ie(r.workflowContext)
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
      const a = await this.ritualAssistant.applyAction(t);
      return a.ok ? (n.resourceTransactions.push(a.value), { ok: !0 }) : (this.handleResourceActionFailure(a), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      if (!le())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (R$(n, a.value), await rs(a.value), {
        ok: !0,
        executedLabel: b$(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!le())
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
    const n = bn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && bn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await gn(
        a,
        zo(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = _n();
    await WT({
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
      const l = _n();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await xo({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: bn(s),
        skippedLabel: zo(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: w$(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      ie(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = _n();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await xo({
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
      ie(a.value.context)
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
    const n = Date.now(), r = Vo(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > jo && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= jo;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Vo(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = An(
      t,
      n,
      r,
      a
    );
  }
}
function b$(e) {
  return as({ inputAmount: e.totalRawDamage });
}
function y$(e, t) {
  if (t.resistance || !A$(t))
    return t;
  const n = il(e);
  return n ? { ...t, resistance: n } : t;
}
function A$(e) {
  return _$(e) && !T$(e);
}
function _$(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function T$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function bn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function zo(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function R$(e, t) {
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
function $$(e) {
  return e.type === "ritual";
}
function k$(e) {
  return IA(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function w$(e) {
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
function E$(e) {
  const t = e.actorUuid ? C$(e.actorUuid) : null;
  if (Ie(t)) return t;
  const n = e.actorId ? I$(e.actorId) : null;
  return n || S$(e.actorName);
}
function C$(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function I$(e) {
  const n = game.actors?.get?.(e);
  if (Ie(n)) return n;
  for (const r of Vl()) {
    const a = ra(r);
    if (a?.id === e) return a;
  }
  return null;
}
function S$(e) {
  const t = yn(e);
  if (!t) return null;
  for (const a of Vl()) {
    const o = L$(a);
    if (yn(o) === t) {
      const s = ra(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Ie(a) && yn(a.name) === t
  );
  return Ie(r) ? r : null;
}
function Vl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function L$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ra(e)?.name ?? null;
}
function ra(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ie(t)) return t;
  const n = e.document?.actor;
  return Ie(n) ? n : null;
}
function yn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ie(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function An(e, t, n, r) {
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
function Vo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function _n() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class D$ {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = Je(t);
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
class v$ {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Je(t).map((l) => this.analyzeRitual(l)), r = n.filter(ft("upToDate")), a = n.filter(ft("available")), o = n.filter(ft("outdated")), s = n.filter(ft("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = P$(t);
    return n ? r ? r.source.type !== "preset" ? Ue({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ue({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ue({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: N$(r, n.preset)
    }) : Ue({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ue({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ue(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? vt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function P$(e) {
  const t = e.getFlag(u, "automation");
  return dr(t) ? t : null;
}
function N$(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function ft(e) {
  return (t) => t.status === e;
}
class O$ {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = fr(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), a = ie(t);
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
    const n = $(t.actorName), r = $(t.resource), a = $(Ho(t)), o = $(M$(t));
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
    const r = $(n.title ?? "Automação"), a = n.message ? `<p>${$(n.message)}</p>` : "", o = $(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = $(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => $(g.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map(
      (g) => `<li><strong>${$(g.id)}:</strong> ${$(g.formula)} = ${g.total} <em>(${$(x$(g.intent))})</em>${g.damageType ? ` — ${$(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${$(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${$(g.resource)} (${$(F$(g.source))})</li>`
    ), m = t.damageInstances.map(
      (g) => `<li><strong>${$(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${$(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (g) => `<li><strong>${$(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${$(g.actorName)}:</strong> ${$(Ho(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), _ = t.phases.map((g) => $(g)).join(" &rarr; ");
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
          ${_.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${_}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function x$(e) {
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
function Ho(e) {
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
function M$(e) {
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
function F$(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function $(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function B$() {
  const e = new Yb(), t = new Xy(e), n = new vi(new Di()), r = new Pi(new $r()), a = new Jy(new Ks()), o = new Xb(), s = new fy(o), l = new Cy(e), c = new Sy(), d = c.registerMany(
    jc()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const m = new Iy(), b = new wy(), T = qi(), _ = new xi(T), g = new v$(
    c
  ), z = new D$(
    g,
    m,
    b
  ), V = new rA(), Z = new O$(V), xe = new nA(), Me = new Qy(
    t,
    s,
    Z,
    xe
  ), Fe = new tA(Me, xe), C = new h$(
    Fe,
    t,
    s,
    n,
    _,
    V
  );
  return C.addStrategy(
    new $y(
      (v) => C.handleItemUsed(v)
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
    conditions: _,
    debugOutput: V,
    chatMessages: Z,
    workflowHooks: xe,
    automation: Me,
    workflow: Fe,
    itemUseIntegration: C,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: z
  };
}
const { ApplicationV2: U$ } = foundry.applications.api;
class Lt extends U$ {
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
      apply: Lt.onApply,
      cancel: Lt.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${F(ur)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${F(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Tn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Tn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Tn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Tn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${F(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? q$(n) : j$(t)}
    </section>
  `;
}
function q$(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(G$).join("")}</ol>`;
}
function G$(e) {
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
function j$(e) {
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
const Dt = `${u}.manageRitualPresets`, Wo = `__${u}_ritualPresetHeaderControlRegistered`, z$ = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function V$(e) {
  const t = globalThis;
  if (!t[Wo]) {
    for (const n of z$)
      Hooks.on(n, (r, a) => {
        H$(r, a, e);
      });
    t[Wo] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function H$(e, t, n) {
  Array.isArray(t) && K$(e) && (W$(e, n), !t.some((r) => r.action === Dt) && t.push({
    action: Dt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Hl(e, n);
    }
  }));
}
function W$(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Dt] && (e.options.actions[Dt] = (n) => {
    n.preventDefault(), n.stopPropagation(), Hl(e, t);
  }));
}
function K$(e) {
  if (!game.user?.isGM) return !1;
  const t = Wl(e);
  return t ? t.type === "agent" && Je(t).length > 0 : !1;
}
function Hl(e, t) {
  const n = Wl(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Lt(n, t).render({ force: !0 });
}
function Wl(e) {
  return Ko(e.actor) ? e.actor : Ko(e.document) ? e.document : null;
}
function Ko(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Kl = "data-paranormal-toolkit-ritual-roll-config", at = "data-paranormal-toolkit-ritual-roll-field", ce = "data-paranormal-toolkit-ritual-roll-action", Yo = `__${u}_ritualRollConfigBlockRegistered`, Y$ = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Q$ = [
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
function Z$() {
  const e = globalThis;
  if (!e[Yo]) {
    X$();
    for (const t of Y$)
      Hooks.on(t, (...n) => {
        J$(n[0], n[1]);
      });
    e[Yo] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function X$() {
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
function J$(e, t) {
  const n = fk(e);
  if (!n || n.type !== "ritual") return;
  const r = hk(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  tk(a);
  const o = Ql(n), s = ol(n), l = pk(n), c = nk(n, s, o, l);
  lk(c, n, o, l), ek(a, c), aa(c);
}
function ek(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function tk(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Kl}]`)))
    t.remove();
}
function nk(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${u}-ritual-roll-config`), a.setAttribute(Kl, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${u}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${u}-ritual-roll-config__title`), s.append(Qo("strong", "Paranormal Toolkit")), s.append(Qo("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${u}-ritual-roll-config__badge`), l.textContent = Xl(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${u}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const d = document.createElement("div");
  d.classList.add(`${u}-ritual-roll-config__fields`), d.append(rk(t, r)), d.append(ak(t, r)), d.append(ok(t, r)), a.append(d), a.append(ik(t, n, r)), a.append(sk(r));
  const m = document.createElement("p");
  return m.classList.add(`${u}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function rk(e, t) {
  const n = Xt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(at, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = CA(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function ak(e, t) {
  const n = Xt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(at, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of Q$) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function ok(e, t) {
  const n = Xt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(at, "utilityLabel"), n.append(r), n;
}
function ik(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${u}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${u}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${u}-ritual-roll-config__forms-grid`), o.append(Rn("base", "Padrão", e.forms.base.formula, !0, n)), o.append(Rn("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(Rn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function Rn(e, t, n, r, a) {
  const o = Xt(t);
  o.classList.add(`${u}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(at, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function sk(e) {
  const t = document.createElement("div");
  t.classList.add(`${u}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ce, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ce, "clear"), t.append(n, r), t;
}
function Xt(e) {
  const t = document.createElement("label");
  t.classList.add(`${u}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Qo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function lk(e, t, n, r) {
  Oe(e, "intent")?.addEventListener("change", () => aa(e)), Jo(e, "system.studentForm")?.addEventListener("change", () => Zo(e, t)), Jo(e, "system.trueForm")?.addEventListener("change", () => Zo(e, t)), e.querySelector(`[${ce}="save"]`)?.addEventListener("click", () => {
    r && ck(e, t, n);
  }), e.querySelector(`[${ce}="clear"]`)?.addEventListener("click", () => {
    r && uk(e, t);
  });
}
async function ck(e, t, n) {
  const r = e.querySelector(`[${ce}="save"]`);
  r?.setAttribute("disabled", "true"), $e(e, "Salvando configuração...");
  try {
    const a = dk(e, n);
    await wA(t, a), Yl(e, a), $e(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), $e(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function uk(e, t) {
  const n = e.querySelector(`[${ce}="clear"]`);
  n?.setAttribute("disabled", "true"), $e(e, "Limpando configuração...");
  try {
    await EA(t);
    const r = ol(t);
    mk(e, r), Yl(e, r), $e(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), $e(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Yl(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__badge`);
  n && (n.textContent = Xl(t) ? "Configurada" : "Rascunho");
}
function dk(e, t) {
  return {
    schemaVersion: 1,
    intent: Zl(Oe(e, "intent")?.value),
    damageType: ei(e, "damageType"),
    utilityLabel: ei(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: At(e, "formula.base") },
      discente: { formula: At(e, "formula.discente") },
      verdadeiro: { formula: At(e, "formula.verdadeiro") }
    }
  };
}
function mk(e, t) {
  ge(e, "intent", t.intent), ge(e, "damageType", t.damageType ?? ""), ge(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ge(e, "formula.base", t.forms.base.formula), ge(e, "formula.discente", t.forms.discente.formula), ge(e, "formula.verdadeiro", t.forms.verdadeiro.formula), aa(e);
}
function aa(e) {
  const t = Zl(Oe(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Zo(e, t) {
  const n = Ql(t);
  Xo(e, "discente", n.discente), Xo(e, "verdadeiro", n.verdadeiro);
}
function Xo(e, t, n) {
  const r = Oe(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${ce}="save"]`)?.disabled;
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
function $e(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Ql(e) {
  const t = gk(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function fk(e) {
  return ti(e.item) ? e.item : ti(e.document) ? e.document : null;
}
function pk(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function gk(e) {
  const t = e.system;
  return bk(t) ? t : {};
}
function Jo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Oe(e, t) {
  return e.querySelector(`[${at}="${yk(t)}"]`);
}
function At(e, t) {
  return Oe(e, t)?.value.trim() ?? "";
}
function ei(e, t) {
  const n = At(e, t);
  return n.length > 0 ? n : null;
}
function ge(e, t, n) {
  const r = Oe(e, t);
  r && (r.value = n);
}
function Zl(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Xl(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function hk(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ti(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function bk(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function yk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ae = null;
Hooks.once("init", () => {
  Bc(), hu(), Qu(), xb(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ba.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ba.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ae = B$(), ae.itemUseIntegration.registerStrategies(), Hu(ae.conditions), Su(ae), Uu(), xu(), Gb(), V$(ae), Z$(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${ur} inicializado.`);
});
function Ak() {
  if (!ae)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ae;
}
export {
  Ak as getToolkitServices
};
//# sourceMappingURL=main.js.map
