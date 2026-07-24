const d = "paranormal-toolkit", Fi = "Paranormal Toolkit", zc = "ordemparanormal";
class st {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function jt(e) {
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
function b(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function lt(e) {
  const t = Sr(e);
  return t.ok ? b(t.value.definition) : t;
}
function Sr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Cr(t) ? b(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function qc(e) {
  return Cr(e.getFlag(d, "automation"));
}
function Cr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && jc(t.source) && Gc(t.definition);
}
function Gc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Vc) && (t.ritualForms === void 0 || Zc(t.ritualForms)) && (t.conditionApplications === void 0 || nu(t.conditionApplications));
}
function jc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Vc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Hc(t);
    case "spendRitualCost":
      return Wc(t);
    case "rollFormula":
      return Kc(t);
    case "modifyResource":
      return Yc(t);
    case "chatCard":
      return Qc(t);
    default:
      return !1;
  }
}
function Hc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Bi(t);
}
function Wc(e) {
  return e.type === "spendRitualCost";
}
function Kc(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || cu(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Yc(e) {
  const t = e;
  return t.type === "modifyResource" && Ui(t.actor) && su(t.resource) && lu(t.operation) && Bi(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Qc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Zc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Xc(a)
  );
}
function Xc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || R(t.label)) && (t.extraCost === void 0 || du(t.extraCost)) && (t.rollFormulaOverrides === void 0 || fu(t.rollFormulaOverrides)) && (t.notes === void 0 || mu(t.notes)) && (t.targeting === void 0 || Jc(t.targeting));
}
function Jc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return tu(t.mode) && R(t.label) && (t.optionLabel === void 0 || R(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || eu(t.template));
}
function eu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || Da(t.distance)) && (t.width === void 0 || t.width === null || Da(t.width));
}
function tu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function nu(e) {
  return Array.isArray(e) && e.every(ru);
}
function ru(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Ui(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || ou(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel)) && (t.applyOnResistance === void 0 || au(t.applyOnResistance));
}
function au(e) {
  return e === "failure" || e === "success" || e === "always";
}
function ou(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || uu(t.rounds)) && (t.expiry === void 0 || t.expiry === null || iu(t.expiry));
}
function iu(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Bi(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Ui(e) {
  return e === "self" || e === "target";
}
function su(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function lu(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function cu(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function uu(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function du(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Da(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function mu(e) {
  return Array.isArray(e) && e.every(R);
}
function fu(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => R(t) && R(n)
  );
}
function Lr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Na);
    if (hu(t))
      return Array.from(t).filter(Na);
  }
  return [];
}
function pu(e) {
  return Lr(e)[0] ?? null;
}
function gu(e) {
  return Lr(e).find(qc) ?? null;
}
function hu(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Na(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ct(e) {
  return Lr(e).filter((t) => t.type === "ritual");
}
function zi(e) {
  return ct(e)[0] ?? null;
}
function bu(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(jt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Ke("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = pt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Oa);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Ke("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = pt(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await Un(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Ke("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = pt(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await Un(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Oa(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Pa(e);
    },
    async applyBestPresetsToActorRituals() {
      return Pa(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Ke("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = pt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Pa(e) {
  const t = Ke("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ct(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), xa(t);
  const r = xa(t, n.length);
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
    const s = await Un(e, a, o.preset);
    r.applied.push(yu(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Au(r), r;
}
async function Un(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function yu(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: jt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function xa(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Au(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Oa(e) {
  return {
    preset: jt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Ke(e) {
  const t = st.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function pt(e) {
  const t = zi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function we(e) {
  return e ? {
    id: e.id,
    source: {
      ..._u(e.sourceActor),
      token: e.sourceToken
    },
    item: Tu(e.item),
    targets: e.targets.map(Ru),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Ma(e.rollRequests, qi),
    rolls: Ma(e.rolls, ku),
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
function _u(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Tu(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Ru(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function qi(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ku(e) {
  return {
    ...qi(e),
    total: e.total
  };
}
function Ma(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function wu(e) {
  return {
    getSelected() {
      return st.getSelectedActor();
    },
    logResources() {
      const t = oe(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await _e(
        e,
        "Gasto de PE",
        oe("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await _e(
        e,
        "Gasto de PD",
        oe("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await _e(
        e,
        "Dano em PV",
        oe("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await _e(
        e,
        "Cura de PV",
        oe("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await _e(
        e,
        "Dano em SAN",
        oe("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await _e(
        e,
        "Recuperação de SAN",
        oe("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function _e(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    $u(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, vr(o));
}
function oe(e) {
  const t = st.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function $u(e) {
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
const H = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Eu() {
  gt(H.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), gt(H.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), gt(H.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), gt(H.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function zn() {
  return {
    enabled: ht(H.enabled),
    console: ht(H.console),
    ui: ht(H.ui),
    chat: ht(H.chat)
  };
}
async function X(e, t) {
  await game.settings.set(d, H[e], t);
}
function gt(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ht(e) {
  return game.settings.get(d, e) === !0;
}
function Iu() {
  return {
    status() {
      return zn();
    },
    async enable() {
      await X("enabled", !0);
    },
    async disable() {
      await X("enabled", !1);
    },
    async enableConsole() {
      await X("console", !0);
    },
    async disableConsole() {
      await X("console", !1);
    },
    async enableUi() {
      await X("ui", !0);
    },
    async disableUi() {
      await X("ui", !1);
    },
    async enableChat() {
      await X("chat", !0);
    },
    async disableChat() {
      await X("chat", !1);
    }
  };
}
const Gi = "ritual.costOnly", ji = "ritual.simpleHealing", Su = "ritual.eletrocussao", Cu = "ritual.definhar", Vi = "ritual.simpleDamage", Hi = "generic.simpleHealing", Wi = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, Dr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Lu() {
  return [
    vu(),
    Du(),
    Nu(),
    Pu(),
    xu(),
    Ou()
  ];
}
function vu() {
  return {
    id: Gi,
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
function Du() {
  return {
    id: ji,
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
    automation: Ki(),
    itemPatch: Uu()
  };
}
function Nu() {
  return {
    id: Su,
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
    automation: Fu(),
    itemPatch: qu()
  };
}
function Pu() {
  return {
    id: Cu,
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
    automation: Bu(),
    itemPatch: zu()
  };
}
function xu() {
  return {
    id: Vi,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Nr()
  };
}
function Ou() {
  return {
    id: Hi,
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
function Ki(e = Wi) {
  const t = Mu(e);
  return Yi(
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
function Mu(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Wi,
    ...e
  };
}
function Fu() {
  return {
    ...Nr("3d6", {
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
function Bu() {
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
function Nr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Yi(
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
function Uu() {
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
function zu() {
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
function qu() {
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
function Yi(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Pr() {
  return Array.from(game.user?.targets ?? []).map(Qi);
}
function Qi(e) {
  return {
    tokenId: $e(e.id),
    actorId: $e(e.actor?.id),
    sceneId: $e(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Zi() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: $e(e.id),
    actorId: $e(t?.id),
    sceneId: $e(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function $e(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Gu(e) {
  return {
    logFirstRitualCost() {
      const t = ie("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = se(t);
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
      const r = ie("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = se(r);
      if (a) {
        if (!Hu(t, n)) {
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
      const t = ie("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = se(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = ie("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = se(t);
      if (!n) return;
      const r = e.automationRegistry.require(Gi);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = ie("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = se(n);
      if (!r) return;
      if (!Fa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(ji);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Ki(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = ie("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = se(n);
      if (!r) return;
      if (!Fa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Vi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Nr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ie("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = se(t);
      n && await ju(e, t, n);
    }
  };
}
async function ju(e, t, n) {
  const r = lt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Zi(),
    item: n,
    targets: Pr()
  });
  if (!a.ok) {
    Vu(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", we(a.value.context));
}
function Vu(e) {
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
function ie(e) {
  const t = st.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function se(e) {
  const t = zi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Hu(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Fa(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Wu = ["strict", "open"], Xi = "strict";
function Ku(e) {
  return Wu.includes(e) ? e : Xi;
}
function Yu(e) {
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
function Vt(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Qu = ["disabled", "ask", "automatic"], Zu = ["buttons", "confirm"], Ji = "ask";
function Xu(e) {
  return typeof e == "string" && Qu.includes(e);
}
function Ju(e) {
  return typeof e == "string" && Zu.includes(e);
}
function ed(e) {
  return Xu(e) ? e : Ju(e) ? "ask" : Ji;
}
const td = ["keep", "replace"], nd = ["manual", "assisted"], es = "keep", ts = "assisted", rd = !0, L = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ad() {
  game.settings.register(d, L.executionMode, {
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
    default: Ji
  }), game.settings.register(d, L.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: es
  }), game.settings.register(d, L.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: ts
  }), game.settings.register(d, L.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Xi
  }), game.settings.register(d, L.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: rd
  }), game.settings.register(d, L.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function qn() {
  const e = ed(game.settings.get(d, L.executionMode)), t = as(game.settings.get(d, L.systemCardMode)), n = os(game.settings.get(d, L.damageResolutionMode)), r = xr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: rs()
  };
}
function ns() {
  return as(game.settings.get(d, L.systemCardMode));
}
function od() {
  return os(game.settings.get(d, L.damageResolutionMode));
}
function xr() {
  return Ku(game.settings.get(d, L.resistanceGateMode));
}
function rs() {
  return game.settings.get(d, L.ritualCastingCheckEnabled) === !0;
}
async function le(e) {
  await game.settings.set(d, L.executionMode, e);
}
function as(e) {
  return td.includes(e) ? e : es;
}
function os(e) {
  return nd.includes(e) ? e : ts;
}
function id(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await le("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await le("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await le(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await le("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await le("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await le("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await le("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const sd = [
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
function ld(e) {
  return {
    phases() {
      return sd;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = fn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = gu(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Ba(e, t, n);
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
      if (!dd(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = ud(n) ?? fn("Nenhum ator encontrado para executar automação do item.");
      r && await Ba(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = fn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = pu(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Hi);
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
async function Ba(e, t, n) {
  const r = lt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Zi(),
    item: n,
    targets: Pr()
  });
  if (!a.ok) {
    cd(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", we(a.value.context));
}
function cd(e) {
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
function fn(e) {
  const t = st.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ud(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function dd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function md(e) {
  const t = wu(e), n = bu(e), r = Gu(e), a = ld(e), o = Iu(), s = id(e);
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
const $t = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function fd(e) {
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
      const r = Ua();
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
      return pd(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Ua();
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
      return gd(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Ua() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function pd(e) {
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
function gd(e) {
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
function hd(e) {
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
    conditions: fd(e.conditions),
    debug: md(e),
    hooks: $t
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class za {
  static isSupportedSystem() {
    return game.system.id === zc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const pn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function bd(e) {
  if (!kd(e.item)) return null;
  const t = Gn(e.actor) ? e.actor : yd(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: _d(e.token) ?? Ad(t),
    targets: Pr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function yd(e) {
  const t = e;
  return Gn(t.actor) ? t.actor : Gn(e.parent) ? e.parent : null;
}
function Ad(e) {
  const t = Td(e) ?? Rd(e);
  return t ? is(t) : null;
}
function _d(e) {
  return jn(e) ? is(e) : null;
}
function Td(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return jn(n) ? n : (t.getActiveTokens?.() ?? []).find(jn) ?? null;
}
function Rd(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function is(e) {
  const t = e.actor ?? null;
  return {
    tokenId: gn(e.id),
    actorId: gn(t?.id),
    sceneId: gn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function kd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Gn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function jn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function gn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class ss {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(pn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${pn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = bd(wd(t));
    if (!n) {
      f.warn(`${pn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function wd(e) {
  return e && typeof e == "object" ? e : {};
}
function $d(e) {
  const t = Ed(e.cost), n = Id(e.currentResource), r = t > 0 && !e.passive, a = n >= t;
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
function Ed(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Id(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Sd } = foundry.applications.api;
class Je extends Sd {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = $d(t), this.spendResource = this.model.cost.spendResourceChecked;
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
      useAbility: Je.onUseAbility,
      cancel: Je.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Je(t, n).render({ force: !0 });
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
          src="${Cd(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${N(this.model.header.eyebrow)}</p>
          <h2>${N(this.model.header.title)}</h2>
          <p>${N(this.model.header.subtitle)}</p>
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
          <span data-paranormal-toolkit-ability-submit-label>${N(this.model.primaryActionLabel)}</span>
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
            <span>${N(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${N(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${N(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${N(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${t}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${N(this.model.cost.resource)} suficiente para pagar este custo.</span>
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
          <div><dt>Personagem</dt><dd>${N(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${N(t)}</p>
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
function N(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Cd(e) {
  return N(e);
}
function Ld(e, t) {
  const n = xd(t.system), r = qa(n.activation), a = Nd(r), o = vd();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Od(t),
    activation: r,
    activationLabel: Dd(r),
    description: qa(n.description),
    cost: a ? 0 : Pd(n.cost),
    resource: o,
    passive: a
  };
}
function vd() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Dd(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, r = Md()?.(t) ?? t;
  return r === t ? e : r;
}
function Nd(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Pd(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function xd(e) {
  return e && typeof e == "object" ? e : {};
}
function qa(e) {
  return typeof e == "string" ? e : "";
}
function Od(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Md() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Fd {
  async publish(t, n, r) {
    const a = await qd(n), o = Bd({
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
      resourceAfter: r.resourceAfter
    }), s = {
      speaker: ChatMessage.getSpeaker({ actor: n.actor }),
      content: o,
      flags: {
        [d]: {
          abilityUse: {
            version: 1,
            actorUuid: n.actor.uuid,
            itemUuid: n.item.uuid,
            resource: n.resource,
            cost: n.cost,
            spentResource: r.spentResource,
            resourceBefore: r.resourceBefore,
            resourceAfter: r.resourceAfter
          }
        }
      }
    }, l = Ud(t.message);
    if (ns() === "replace" && l) {
      await l.update(s);
      return;
    }
    await ChatMessage.create(s);
  }
}
function Bd(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, r = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent";
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${zd(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${ke(e.abilityName)}</h3>
          <p>${ke(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${ke(e.activationLabel)}</span>
        <span><strong>Custo</strong>${ke(t)}</span>
      </div>

      ${e.description ? `<section class="paranormal-toolkit-ability-card__description">${e.description}</section>` : ""}

      <footer class="paranormal-toolkit-ability-card__status ${r}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${ke(n)}</span>
      </footer>
    </article>
  `;
}
function Ud(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function ke(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function zd(e) {
  return ke(e);
}
async function qd(e) {
  const t = Gd();
  return !t || !e.description ? e.description : t.enrichHTML(e.description, {
    relativeTo: e.item,
    rollData: jd(e.actor)
  });
}
function Gd() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function jd(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class Vd {
  constructor(t, n, r = new Fd()) {
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
    if (!Hd(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const r = Ld(n, t.item), a = this.readCurrentResource(r);
    if (!a.ok)
      return this.fail(
        "resource-unavailable",
        a.message
      );
    const o = await Je.request({
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
function Hd(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Ga = 1e3;
class Wd {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new Vd(t, n), this.strategy = new ss(
      (r) => this.handleItemUsed(r)
    );
  }
  register() {
    this.strategy.register(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (qn().executionMode === "disabled" || !Yd(t.item)) return;
    const n = Qd(t);
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
    return n !== void 0 && Date.now() - n < Ga;
  }
  pruneRecentExecutions() {
    const t = Date.now() - Ga;
    for (const [n, r] of this.recentExecutions)
      r < t && this.recentExecutions.delete(n);
  }
}
function Kd(e, t) {
  const n = new Wd(e, t);
  return n.register(), n;
}
function Yd(e) {
  if (e.type !== "ability") return !1;
  const t = Sr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function Qd(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let ja = !1, hn = !1, bn = !1, bt = null;
const Zd = 1e3, Xd = 750, Jd = 1e3;
function em(e) {
  ja || (Hooks.on("combatTurnChange", (t) => {
    nm(e, Va(t));
  }), Hooks.on("deleteCombat", (t) => {
    rm(e, Va(t));
  }), ja = !0, tm(e));
}
function tm(e) {
  Ht() && (hn || (hn = !0, globalThis.setTimeout(() => {
    hn = !1, Or(e, "ready");
  }, Zd)));
}
function nm(e, t) {
  Ht() && t && (bt && globalThis.clearTimeout(bt), bt = globalThis.setTimeout(() => {
    bt = null, Or(e, "combat-turn-change", t);
  }, Xd));
}
function rm(e, t) {
  Ht() && t && (bn || (bn = !0, globalThis.setTimeout(() => {
    bn = !1, Or(e, "combat-deleted", t);
  }, Jd)));
}
async function Or(e, t, n) {
  if (Ht())
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
function Ht() {
  return game.user?.isGM === !0;
}
function Va(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ls = {
  enabled: "dice.animations.enabled"
};
function am() {
  game.settings.register(d, ls.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function om() {
  return {
    enabled: game.settings.get(d, ls.enabled) === !0
  };
}
const Wt = "chatCard", Ha = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, im = `.${i}__title`, cs = `.${i}__header`, sm = `.${i}__roll-card`, lm = `.${i}__roll-meta`, cm = `.${i}__roll-meta-pill`, Mr = `.${i}__resistance`, um = `.${i}__resistance-header`, us = `.${i}__resistance-description`, Kt = `.${i}__resistance-roll-button`, ds = `.${i}__resistance-roll-result`, Wa = `${i}__resistance-content`, ms = `.${i}__workflow-section`, fs = `.${i}__workflow-roll`, Fr = `${i}__workflow-roll--dice-open`, Br = `.${i}__workflow-roll-formula`, Ur = `${i}__workflow-roll-formula--toggle`, Yt = `.${i}__workflow-dice-tray`, dm = `.${i}__roll-detail-toggle`, mm = `.${i}__roll-detail-list`, fm = `.${i}__ritual-element-badge`, pm = `.${i}__ritual-metadata`, gm = "casting-backlash", hm = "data-paranormal-toolkit-action-section", bm = "data-paranormal-toolkit-prompt-id", ym = "data-paranormal-toolkit-pending-id", Ka = "data-paranormal-toolkit-casting-backlash-enhanced", Ya = `.${i}`, Am = `.${i}__workflow-section--casting`, _m = `.${i}__workflow-section-header`, Tm = `.${i}__workflow-notes`, Rm = `[${hm}="${gm}"]`, Qa = `${i}__workflow-section-title-row`, km = `${i}__workflow-section-header--casting-backlash`, ps = `${i}__casting-backlash-button`;
function wm(e) {
  for (const t of $m(e))
    Em(t), vm(t);
}
function $m(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Ya) && t.add(e);
  for (const n of e.querySelectorAll(Ya))
    t.add(n);
  return Array.from(t);
}
function Em(e) {
  const t = e.querySelector(Rm);
  if (!t) return;
  const n = Im(t);
  if (!n) return;
  const r = e.querySelector(`${Am} ${_m}`);
  r && (r.classList.add(km), Sm(r), Cm(n), r.append(n), t.remove());
}
function Im(e) {
  return e.querySelector(
    `button[${ym}], button[${bm}]`
  );
}
function Sm(e) {
  const t = e.querySelector(`:scope > .${Qa}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Qa);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(ps) || n.append(a));
  return n;
}
function Cm(e) {
  if (e.getAttribute(Ka) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Lm(t, e.disabled);
  e.classList.add(ps), e.setAttribute(Ka, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Lm(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function vm(e) {
  for (const t of e.querySelectorAll(Tm)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Dm(e) {
  for (const t of Array.from(e.querySelectorAll(ms)))
    for (const n of Array.from(t.querySelectorAll(`${dm}, ${mm}`)))
      n.remove();
}
const Nm = {
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
}, Pm = new Set(
  Object.values(Nm)
), xm = {
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
function Om(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Mm(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = xm[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Pm.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function gs(e) {
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
function Mm(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class hs {
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
      const h = Fm(m, u);
      if (!h.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const k = Om(m.damageType);
      if (!k.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (h.amount === 0) {
        s.push(
          Bm(h.id, m, k.value)
        );
        continue;
      }
      try {
        const _ = await Promise.resolve(
          o.call(n, h.amount, {
            damageType: k.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const w of zm(_.conditions))
          l.add(w);
        const T = Um(_.newPV);
        T !== null && (c = T), s.push({
          id: h.id,
          label: m.label ?? gs(k.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: h.amount,
          finalDamage: Za(_.finalDamage, h.amount),
          blocked: Za(_.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: k.value,
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
    return b({
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
function Fm(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Bm(e, t, n) {
  return {
    id: e,
    label: t.label ?? gs(n),
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
function Za(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Um(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function zm(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class zr {
  async rollResistance(t) {
    const n = await Gm(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? fe(t.skill),
      roll: n,
      formula: Vm(n),
      total: Hm(n),
      diceBreakdown: Wm(n)
    };
  }
  getSkillLabel(t) {
    return fe(t);
  }
}
async function qm(e, t) {
  return new zr().rollResistance({ actor: e, skill: t });
}
function fe(e) {
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
async function Gm(e, t) {
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
  return jm(r);
}
function jm(e) {
  return Xa(e) ? e : Array.isArray(e) ? e.find(Xa) ?? null : null;
}
function Xa(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Vm(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Hm(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Wm(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Km);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Km(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class bs {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class ys {
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
function Ym(e, t) {
  const n = nf(e?.rounds);
  if (!n)
    return Ja(null);
  const r = e?.anchor ?? As(t);
  if (!r)
    return {
      ...Ja(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Qm(),
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
function As(e) {
  const t = rf();
  if (!t?.id || !_s(t.round)) return null;
  const n = ef(t), r = Zm(e, n) ?? Jm(t), a = J(r?.id), o = of(r?.initiative), s = Xm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: af()
  };
}
function Qm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Ja(e) {
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
function Zm(e, t) {
  return e?.id ? t.find((n) => tf(n) === e.id) ?? null : null;
}
function Xm(e, t, n) {
  const r = J(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return sf(e.turn) ? e.turn : null;
}
function Jm(e) {
  return Et(e.combatant) ? e.combatant : null;
}
function ef(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Et);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Et);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Et);
  }
  return [];
}
function tf(e) {
  return J(e.actor?.id) ?? J(e.actorId) ?? J(e.token?.actor?.id) ?? J(e.token?.actorId) ?? J(e.document?.actor?.id) ?? J(e.document?.actorId);
}
function nf(e) {
  return _s(e) ? Math.trunc(e) : null;
}
function rf() {
  return game.combat ?? null;
}
function af() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Et(e) {
  return !!(e && typeof e == "object");
}
function J(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function of(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function _s(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function sf(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Ts {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? b(n.value) : p({
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
    if (!bf(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = Ym(t.duration, r), s = lf(a, t, o), c = t.refreshExisting ?? !0 ? yf(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), b(eo(r, a, c.id ?? null, !1, !0, o));
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
      return b(eo(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = ks(n, r);
    let o = 0;
    try {
      for (const s of a)
        await to(n, s) === "deleted" && (o += 1);
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
    return b({
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
    const n = Tf(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = qr(s);
      a += l.length;
      for (const c of l) {
        if (!df(c, t)) continue;
        const u = Rs(c);
        try {
          await to(s, c) === "deleted" && (o += 1);
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
function lf(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: vf(),
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
    duration: cf(n.duration),
    start: uf(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function cf(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function uf(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Lf(),
    ...e
  };
}
function eo(e, t, n, r, a, o) {
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
function df(e, t) {
  const n = Rs(e);
  if (!n.conditionId || !mf(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Cf();
  return n.durationMode === "combatantTurn" || ff(n) ? gf(n, r) : pf(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !B(n.startRound) || !B(n.requestedRounds) || !B(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function mf(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && B(e.requestedRounds);
}
function ff(e) {
  return !!(e.combatDurationApplied && B(e.requestedRounds) && B(e.startRound) && (e.startCombatantId || Dt(e.startTurn)));
}
function pf(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function gf(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !B(e.startRound) || !B(e.requestedRounds) || !B(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = hf(t);
  return e.startCombatantId ? r === e.startCombatantId : Dt(e.startTurn) && Dt(t.turn) ? t.turn === e.startTurn : !1;
}
function hf(e) {
  return Ee(e.combatant?.id);
}
function Rs(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: It(e, "conditionId"),
    requestedRounds: no(e, "requestedRounds") ?? Ye(t.value) ?? Ye(t.rounds),
    combatDurationApplied: yn(e, "combatDurationApplied"),
    combatId: It(e, "combatId") ?? Ee(n.combat) ?? Ee(t.combat),
    startCombatantId: It(e, "startCombatantId") ?? Ee(n.combatant),
    startInitiative: $f(e, "startInitiative") ?? ws(n.initiative),
    startRound: no(e, "startRound") ?? Ye(n.round) ?? Ye(t.startRound),
    startTurn: wf(e, "startTurn") ?? Vn(n.turn) ?? Vn(t.startTurn),
    expiryEvent: Ef(e, "expiryEvent") ?? $s(t.expiry),
    durationMode: If(e, "durationMode"),
    deleteOnExpire: yn(e, "deleteOnExpire"),
    expiresWithCombat: yn(e, "expiresWithCombat")
  };
}
function bf(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function yf(e, t) {
  return ks(e, t)[0] ?? null;
}
function ks(e, t) {
  return qr(e).filter((n) => kf(n) === t);
}
async function to(e, t) {
  const n = t.id ?? null, r = n ? Af(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (_f(a)) return "missing";
    throw a;
  }
}
function Af(e, t) {
  return qr(e).find((n) => n.id === t) ?? null;
}
function _f(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Tf() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      yt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    yt(e, n);
  });
  for (const n of Rf())
    yt(e, n.actor), yt(e, n.document?.actor);
  return Array.from(e.values());
}
function yt(e, t) {
  if (!Sf(t)) return;
  const r = Ee(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Rf() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function qr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function kf(e) {
  return It(e, "conditionId");
}
function It(e, t) {
  return Ee(he(e, t));
}
function no(e, t) {
  return Ye(he(e, t));
}
function wf(e, t) {
  return Vn(he(e, t));
}
function $f(e, t) {
  return ws(he(e, t));
}
function Ef(e, t) {
  return $s(he(e, t));
}
function If(e, t) {
  const n = he(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function yn(e, t) {
  return he(e, t) === !0;
}
function he(e, t) {
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
function Ye(e) {
  return B(e) ? Math.trunc(e) : null;
}
function Vn(e) {
  return Dt(e) ? Math.trunc(e) : null;
}
function ws(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function $s(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Sf(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Cf() {
  return game.combat ?? null;
}
function Lf() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function B(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Dt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function vf() {
  return game.user?.id ?? null;
}
const Df = "icons/svg/downgrade.svg", Nf = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function y(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Df,
    description: Nf,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Pf = y({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), xf = y({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Of = y({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Mf = y({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Ff = y({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Bf = y({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Uf = y({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), zf = y({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), qf = y({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Gf = y({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), jf = y({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Vf = y({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Hf = y({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Wf = y({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Kf = y({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Yf = y({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Qf = y({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Zf = y({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Xf = y({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Jf = y({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), ep = y({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), tp = y({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), np = y({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), rp = y({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), ap = y({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), op = y({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), ip = y({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), sp = y({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), lp = y({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), cp = y({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), up = y({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), dp = y({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), mp = y({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), fp = y({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), pp = [
  Pf,
  xf,
  Of,
  Mf,
  Ff,
  Bf,
  Uf,
  zf,
  qf,
  Gf,
  jf,
  Vf,
  Hf,
  Wf,
  Kf,
  Yf,
  Qf,
  Zf,
  Xf,
  Jf,
  ep,
  tp,
  np,
  rp,
  ap,
  op,
  ip,
  sp,
  lp,
  cp,
  up,
  dp,
  mp,
  fp
];
class gp {
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
    return Array.from(this.definitions.values()).map(ro);
  }
  get(t) {
    const n = this.lookup.get(ao(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(ro(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = ao(t);
    r && this.lookup.set(r, n);
  }
}
function Es() {
  return new gp(pp);
}
function ro(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function ao(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function ve(e) {
  return e.applyOnResistance ?? "failure";
}
function Is(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Ss(e, t) {
  const n = ve(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Cs(e) {
  const t = ve(e);
  return t === "failure" || t === "success";
}
function hp(e, t, n, r) {
  const a = e.filter((c) => Ss(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => ve(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const bp = {
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
}, yp = {
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
function Ap(e) {
  return vs(e, bp, !1);
}
function _p(e) {
  return vs(e, yp, !e.allowsSuccessfulResistance);
}
function Me(e) {
  return e.kind === "waiting-resistance";
}
function Ls(e) {
  return e.kind === "resisted";
}
function vs(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Te("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Te("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || Vt(e.resistanceGateMode, e.resistanceState) ? Te(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Te("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : Te("available", !0, r.available, r.availableCompact, null);
}
function Te(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Qe = "data-paranormal-toolkit-prompt-id", Tp = "data-paranormal-toolkit-resistance-roll-result", Rp = "Conjuração DT";
function kp(e) {
  const t = e.querySelector(Kt)?.getAttribute(Tp), n = nt(t);
  if (n !== null) return n;
  const r = e.querySelector(ds)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return nt(a?.[1] ?? null);
}
function Gr(e) {
  const t = Ds(e), n = Ip(t);
  if (n !== null) return n;
  const r = Ep(t);
  return r !== null ? r : Sp(e);
}
function wp(e) {
  const t = Ds(e);
  return t ? {
    actorId: An(t.actorId),
    itemId: An(t.itemId),
    itemName: An(t.itemName)
  } : null;
}
function $p(e) {
  const t = e.getAttribute(Qe);
  if (!t) return null;
  const n = Ns(e), r = Ps(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Qt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function te(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Hn(e) {
  return te(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Ep(e) {
  const t = Lp(e);
  return t.length === 0 ? null : nt(vp(t, Rp));
}
function Ip(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : oo(r, ["system", "ritual", "DT"]) ?? oo(r, ["system", "ritual", "dt"]);
}
function Sp(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return nt(n?.[1] ?? null);
}
function Ds(e) {
  const t = Cp(e);
  if (!t) return null;
  const n = Ns(e), r = Ps(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Qt(o) ? o.pendingId === t : !1) ?? null;
}
function Cp(e) {
  return (e.closest(`[${Qe}]`) ?? e.querySelector(`[${Qe}]`) ?? e.parentElement?.querySelector(`[${Qe}]`) ?? null)?.getAttribute(Qe) ?? null;
}
function Ns(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Dp(a) ? a : null;
}
function Ps(e) {
  const t = e?.getFlag?.(d, Wt);
  return Qt(t) ? t : null;
}
function Lp(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function vp(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function oo(e, t) {
  let n = e;
  for (const r of t) {
    if (!Qt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : nt(typeof n == "string" ? n : null);
}
function nt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Dp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Qt(e) {
  return !!(e && typeof e == "object");
}
function An(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Zt(e) {
  return xs({
    hasResistance: !!e.querySelector(Mr),
    difficulty: Gr(e),
    resistanceTotal: kp(e)
  });
}
function Np(e) {
  if (!e.hasResistance || e.difficulty === null)
    return xs({
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
function xs(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Yu(e)
  };
}
function be() {
  return game.user?.isGM === !0;
}
function pe() {
  return be();
}
function Pp(e) {
  const t = Vt(e.resistanceGateMode, e.resistanceState), n = xp(e.resistanceState, e.hasDamage), r = Op(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Ap({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = _p({
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
function xp(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Op(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function jr(e) {
  const t = e.isGM ?? pe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Pp({
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
function Mp(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Bp(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Fp(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Bp(e, t) {
  const n = Up(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of zp(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Up(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function zp(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? io(e, "highest") : n.includes("kl") ? io(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function io(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const qp = "data-paranormal-toolkit-resistance-skill", Gp = "data-paranormal-toolkit-resistance-skill-label", jp = "data-paranormal-toolkit-roll-card-target-names", Vp = "data-paranormal-toolkit-roll-card-resistance", Hp = "data-paranormal-toolkit-roll-card-resistance-skill", Wp = "data-paranormal-toolkit-roll-card-resistance-skill-label", Os = "pending", Vr = "success", Hr = "failure", Ms = "rolled";
function Kp(e) {
  const t = Jp(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Zp(e.damageSection) : null, r = so(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Yp(e.rollCard).map((o, s) => {
    const l = Qp(o, s), c = e.resistanceResults.get(l) ?? null, u = og(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, h = e.effectApplications.get(l) ?? null, k = Np({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: ug(u)
    }).state, _ = so(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Is(k)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: h,
      effect: _,
      assistedActions: jr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: k,
        damage: n,
        effect: _,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!h,
        effectCanApplyOnSuccessfulResistance: _?.applyOnResistance === "success" || _?.applyOnResistance === "always",
        effectRequiresResolvedResistance: _ ? Cs(_) : !1
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
function Yp(e) {
  const t = e.getAttribute(jp), n = t ? cg(t) : [];
  if (n.length > 0) return n;
  const a = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = a.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && Fs(s) !== "nenhum alvo") : [];
}
function Qp(e, t) {
  return `${Fs(e)}:${t}`;
}
function Zp(e) {
  const t = ig(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: lg(e),
    formula: sg(e) ?? "—",
    total: t,
    diceBreakdown: Fp(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function so(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Xp(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: ve(o)
  } : null;
}
function Xp(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Jp(e, t) {
  const n = tg(t), r = eg(e), a = r.description ?? ng(n)?.textContent?.trim(), o = rg(n), s = r.skill ?? o?.getAttribute(qp) ?? null, l = r.skillLabel ?? o?.getAttribute(Gp) ?? (s ? fe(s) : null);
  return !a && !s ? null : {
    description: a ?? "Resistência do alvo.",
    formula: ag(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: Gr(e)
  };
}
function eg(e) {
  return {
    description: _n(e, Vp),
    skill: _n(e, Hp),
    skillLabel: _n(e, Wp)
  };
}
function tg(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function ng(e) {
  return Wr(e, `.${i}__resistance-description`);
}
function rg(e) {
  return Wr(e, Kt);
}
function ag(e) {
  return Wr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Wr(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function og(e, t) {
  return e ? t === null ? Ms : e.total >= t ? Vr : Hr : Os;
}
function ig(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function sg(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function lg(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function cg(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function _n(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function Fs(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function ug(e) {
  return e === Vr ? "succeeded" : e === Hr ? "failed" : "pending";
}
function Bs(e) {
  if (!e) return null;
  const t = e.actorId ? fg(e.actorId) : null, n = t ? dg(t, e.itemId, e.itemName) : null;
  return n || mg(e.itemId, e.itemName);
}
function dg(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Ie(o)) return o;
  }
  const a = Nt(n);
  if (a) {
    const o = r?.find?.((s) => Ie(s) ? Nt(s.name) === a : !1);
    if (Ie(o)) return o;
  }
  return null;
}
function mg(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Ie(a)) return a;
  }
  const r = Nt(t);
  if (r) {
    const a = n?.find?.((o) => Ie(o) ? Nt(o.name) === r : !1);
    if (Ie(a)) return a;
  }
  return null;
}
function fg(e) {
  const n = game.actors?.get?.(e);
  return pg(n) ? n : null;
}
function pg(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ie(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Nt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Kr(e) {
  const t = Tn(e);
  if (!t) return null;
  const n = gg().filter((o) => Tn(hg(o)) === t).map((o) => Us(o)).find(et) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => et(o) && Tn(o.name) === t);
  return et(a) ? a : null;
}
function gg() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function hg(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Us(e)?.name ?? null;
}
function Us(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (et(t)) return t;
  const n = e.document?.actor;
  return et(n) ? n : null;
}
function et(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Tn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function zs(e) {
  const t = _g();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: bg(e)
  });
}
function bg(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${St(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = yg(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${St(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${St(e.actorName)}</strong></p>
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
function yg(e) {
  const t = Ag(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${St(a)}</li>`;
}
function Ag(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = lo(n?.value);
  return r === null ? null : {
    value: r,
    max: lo(n?.max)
  };
}
function lo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function _g() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function St(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Tg(e) {
  await zs(Rg(e));
}
function Rg(e) {
  if (kg(e)) return e;
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
function kg(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function qs(e) {
  return e.mode, `✓ ${Gs(e.inputAmount)} PV`;
}
function wg(e) {
  const t = Gs(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Gs(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class $g {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? pe()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : Vt(t.resistanceGateMode, t.resistanceState) ? {
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
class Eg {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? pe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : Vt(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Ig {
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
const Sg = `.${i}__actions`, Yr = `.${i}__actions-title`, De = `.${i}__button`, Cg = "data-paranormal-toolkit-action-section", Lg = `${i}__button--executed`, vg = "data-paranormal-toolkit-executed-label";
function js(e) {
  return te(e.querySelector(Yr)?.textContent);
}
function Dg(e, t) {
  const n = e.querySelector(Yr);
  n && (n.textContent = t);
}
function ut(e, t) {
  const n = te(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return te(a) === n;
  }) ?? null;
}
function Qr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ye(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Vs(e) {
  const t = Ng(e.difficulty);
  if (t === null) return null;
  const n = co(e.skillLabel) ?? "Resistência", r = co(e.description), a = Pg(r, n), o = xg(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Ng(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function co(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Pg(e, t) {
  if (!e) return null;
  const n = uo(e), r = uo(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function xg(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function uo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const At = "data-paranormal-toolkit-prompt-id", Hs = "multiTargetResistanceResults", Ws = "multiTargetDamageApplications", Ks = "multiTargetEffectApplications";
function Og(e) {
  const t = /* @__PURE__ */ new Map(), r = Xt(e)?.[Hs];
  if (!z(r)) return t;
  for (const [a, o] of Object.entries(r))
    Gg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Mg(e, t) {
  await Zr(e, Hs, t.targetId, t);
}
function Fg(e) {
  const t = /* @__PURE__ */ new Map(), r = Xt(e)?.[Ws];
  if (!z(r)) return t;
  for (const [a, o] of Object.entries(r))
    jg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Bg(e, t) {
  await Zr(
    e,
    Ws,
    t.targetId,
    t
  );
}
function Ug(e) {
  const t = /* @__PURE__ */ new Map(), r = Xt(e)?.[Ks];
  if (!z(r)) return t;
  for (const [a, o] of Object.entries(r))
    Hg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function zg(e, t) {
  await Zr(
    e,
    Ks,
    t.targetId,
    t
  );
}
function qg(e) {
  const t = Xt(e);
  return t ? {
    actorId: Rn(t.actorId),
    itemId: Rn(t.itemId),
    itemName: Rn(t.itemName)
  } : null;
}
async function Zr(e, t, n, r) {
  const a = Ys(e);
  if (!a) return;
  const o = Qs(e), s = Zs(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!z(u) || u.pendingId !== a) return u;
    const m = z(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, Wt, {
    ...s,
    prompts: c
  }));
}
function Xt(e) {
  const t = Ys(e);
  if (!t) return null;
  const n = Qs(e), r = Zs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => z(o) ? o.pendingId === t : !1) ?? null;
}
function Ys(e) {
  return (e.closest(`[${At}]`) ?? e.querySelector(`[${At}]`) ?? e.parentElement?.querySelector(`[${At}]`) ?? null)?.getAttribute(At) ?? null;
}
function Qs(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Wg(a) ? a : null;
}
function Zs(e) {
  const t = e?.getFlag?.(d, Wt);
  return z(t) ? t : null;
}
function Gg(e) {
  return z(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function jg(e) {
  return z(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Vg(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Vg(e) {
  return e === "normal" || e === "half";
}
function Hg(e) {
  return z(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Rn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Wg(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function z(e) {
  return !!(e && typeof e == "object");
}
const Kg = "data-paranormal-toolkit-resistance-skill", Yg = "data-paranormal-toolkit-resistance-skill-label", Wn = "data-paranormal-toolkit-multi-target-section", Xr = "data-paranormal-toolkit-multi-target-damage-info", Xs = "data-paranormal-toolkit-multi-target-effect-info", Js = "data-paranormal-toolkit-multi-target-toggle", el = "data-paranormal-toolkit-multi-target-details", O = "data-paranormal-toolkit-multi-target-target", Qg = "data-paranormal-toolkit-multi-target-state", Kn = "data-paranormal-toolkit-multi-target-roll-total", Yn = "data-paranormal-toolkit-multi-target-roll-formula", Ct = "data-paranormal-toolkit-multi-target-roll-dice", Qn = "data-paranormal-toolkit-multi-target-roll-skill", Zn = "data-paranormal-toolkit-multi-target-roll-skill-label", Xn = "data-paranormal-toolkit-multi-target-roll-target-name", Jn = "data-paranormal-toolkit-multi-target-roll-rolled-at", er = "data-paranormal-toolkit-multi-target-damage-mode", tr = "data-paranormal-toolkit-multi-target-damage-input-amount", mo = "data-paranormal-toolkit-multi-target-damage-final-amount", fo = "data-paranormal-toolkit-multi-target-damage-blocked", nr = "data-paranormal-toolkit-multi-target-damage-target-name", rr = "data-paranormal-toolkit-multi-target-damage-applied-at", ar = "data-paranormal-toolkit-multi-target-effect-condition-id", or = "data-paranormal-toolkit-multi-target-effect-condition-label", ir = "data-paranormal-toolkit-multi-target-effect-effect-id", sr = "data-paranormal-toolkit-multi-target-effect-created", lr = "data-paranormal-toolkit-multi-target-effect-refreshed", cr = "data-paranormal-toolkit-multi-target-effect-target-name", ur = "data-paranormal-toolkit-multi-target-effect-applied-at", Zg = new Ts(Es()), Xg = new bs(new hs()), Jg = new ys(new zr()), eh = new Ig(Jg), th = new $g(Xg), nh = new Eg(Zg), rh = Os, Fe = Vr, dt = Hr, ah = Ms;
function oh(e) {
  const t = tl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), ph(e);
  const n = gh(e.rollCard, t), r = hh(e.rollCard, t);
  !n && r && Xh(e.rollCard, r, e.effectSection);
  const a = Rh(e.rollCard);
  return al(a, t), Yh(
    e.rollCard,
    a,
    bh(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Jh(e.rollCard, r, a), !0;
}
function tl(e) {
  return Kp({
    ...e,
    resistanceResults: lh(e.rollCard),
    damageApplications: ch(e.rollCard),
    effectApplications: uh(e.rollCard),
    resolveTargetConditionApplication: ih,
    resistanceGateMode: ea()
  });
}
function ih(e, t, n) {
  const r = qg(e), a = Bs(r);
  if (!a) return null;
  const o = lt(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = sh(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function sh(e, t, n) {
  const r = hp(
    e,
    n,
    t,
    kn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = kn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => kn(s) === a)) ?? null : null;
}
function lh(e) {
  const t = Og(e);
  for (const [n, r] of fh(e))
    t.set(n, r);
  return t;
}
function ch(e) {
  const t = Fg(e);
  for (const [n, r] of mh(e))
    t.set(n, r);
  return t;
}
function uh(e) {
  const t = Ug(e);
  for (const [n, r] of dh(e))
    t.set(n, r);
  return t;
}
function dh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = n.getAttribute(ar), o = n.getAttribute(or), s = n.getAttribute(ir), l = ho(n.getAttribute(sr)), c = ho(n.getAttribute(lr)), u = n.getAttribute(cr), m = n.getAttribute(ur);
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
function mh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = n.getAttribute(er), o = pl(n.getAttribute(tr)), s = n.getAttribute(nr), l = n.getAttribute(rr);
    !r || !nb(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function fh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = pl(n.getAttribute(Kn)), o = n.getAttribute(Yn), s = n.getAttribute(Qn), l = n.getAttribute(Zn), c = n.getAttribute(Xn), u = n.getAttribute(Jn);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(Ct),
      rolledAt: u
    });
  }
  return t;
}
function ph(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function gh(e, t) {
  if (!t.damage)
    return nl(e)?.remove(), null;
  const n = yh(e);
  return Ah(n, t.damage), Th(e, n), n;
}
function hh(e, t) {
  if (!t.effect)
    return fl(e)?.remove(), null;
  const n = Qh(e);
  return Zh(n, t.effect), n;
}
function bh(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : ut(e, "Conjuração");
}
function yh(e) {
  const t = nl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Xr, "true"), n;
}
function nl(e) {
  return e.querySelector(`[${Xr}="true"]`);
}
function Ah(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(rl(t.formula, t.total, t.diceBreakdown));
}
function rl(e, t, n, r = !1) {
  const a = Mp({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return _h(a, r), a;
}
function _h(e, t) {
  const n = e.querySelector(Yt), r = e.querySelector(Br);
  if (!n || !r) return;
  e.classList.toggle(Fr, t), n.hidden = !t, r.classList.add(Ur), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Th(e, t) {
  const n = ut(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Rh(e) {
  const t = e.querySelector(`[${Wn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Wn, "true"), n;
}
function al(e, t) {
  const n = kh(e), r = $h(t.resistance), a = [wh(t)];
  r && a.push(r), a.push(Sh(t, n)), e.replaceChildren(...a);
}
function kh(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${O}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(O)).filter(tb)
  );
}
function wh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Ih(e.targets), t.append(n, r), t;
}
function $h(e) {
  const t = Vs({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Eh(n, t), n;
}
function Eh(e, t) {
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
function Ih(e) {
  const t = e.length, n = e.filter((l) => l.state === dt).length, r = e.filter((l) => l.state === Fe).length, a = e.filter((l) => l.state === rh).length, o = e.filter((l) => l.state === ah).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Sh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Ch(r, e, t.has(r.id)));
  return n;
}
function Ch(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(O, e.id), r.setAttribute(Qg, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), ol(r, e.resistanceResult), il(r, e.damageApplication), sl(r, e.effectApplication);
  const a = Lh(e, t, r), o = Vh(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    go(s.target) || po(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || go(s.target) || (s.preventDefault(), po(r));
  }), r.append(a, o), r;
}
function ol(e, t) {
  if (!t) {
    e.removeAttribute(Kn), e.removeAttribute(Yn), e.removeAttribute(Ct), e.removeAttribute(Qn), e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Jn);
    return;
  }
  e.setAttribute(Kn, String(t.total)), e.setAttribute(Yn, t.formula), e.setAttribute(Qn, t.skill), e.setAttribute(Zn, t.skillLabel), e.setAttribute(Xn, t.targetName), e.setAttribute(Jn, t.rolledAt), t.diceBreakdown ? e.setAttribute(Ct, t.diceBreakdown) : e.removeAttribute(Ct);
}
function il(e, t) {
  if (!t) {
    e.removeAttribute(er), e.removeAttribute(tr), e.removeAttribute(mo), e.removeAttribute(fo), e.removeAttribute(nr), e.removeAttribute(rr);
    return;
  }
  e.setAttribute(er, t.mode), e.setAttribute(tr, String(t.inputAmount)), e.removeAttribute(mo), e.removeAttribute(fo), e.setAttribute(nr, t.targetName), e.setAttribute(rr, t.appliedAt);
}
function sl(e, t) {
  if (!t) {
    e.removeAttribute(ar), e.removeAttribute(or), e.removeAttribute(ir), e.removeAttribute(sr), e.removeAttribute(lr), e.removeAttribute(cr), e.removeAttribute(ur);
    return;
  }
  e.setAttribute(ar, t.conditionId), e.setAttribute(or, t.conditionLabel), e.setAttribute(ir, t.effectId ?? ""), e.setAttribute(sr, String(t.created)), e.setAttribute(lr, String(t.refreshed)), e.setAttribute(cr, t.targetName), e.setAttribute(ur, t.appliedAt);
}
function Lh(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = vh(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Dh(e, t.resistance);
  Oh(l, n, e, t);
  const c = jh(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), dl(u, [
    ll(e, t, "compact"),
    ul(e, t, "compact")
  ]), r.append(a, u), r;
}
function vh(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Dh(e, t) {
  if (!be())
    return Nh(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", xh(e, t)), t?.skill && (n.setAttribute(Kg, t.skill), n.setAttribute(Yg, t.skillLabel ?? fe(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Fe ? "✓" : e.state === dt ? "✕" : "", n.append(r, a), n;
}
function Nh(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Ph(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Fe ? "✓" : e.state === dt ? "✕" : "", n.append(r, a), n;
}
function Ph(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Fe ? "sucesso" : e.state === dt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function xh(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Fe ? "sucesso" : e.state === dt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Oh(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !be() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Mh(t, e, n, r);
  });
}
async function Mh(e, t, n, r) {
  if (!be()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? fe(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Kr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await eh.execute({ actor: l, skill: o, skillLabel: s });
    await eb(u.roll);
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
    ol(e, m);
    try {
      await Mg(r.rollCard, m);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", h);
    }
    Jr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Jr(e) {
  const t = e.closest(`[${Wn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = tl({
    rollCard: n,
    damageSection: Fh(n) ?? ut(n, "Dano"),
    effectSection: Bh(n)
  });
  r && al(t, r);
}
function Fh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Xr) !== "true") ?? null;
}
function Bh(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Uh(e) {
  return Me(e.assistedActions.policy.damageActionState);
}
function zh(e) {
  return Me(e.assistedActions.policy.effectActionState);
}
function ea() {
  try {
    return xr();
  } catch {
    return "strict";
  }
}
function ll(e, t, n) {
  if (e.damageApplication)
    return ee(
      "✓",
      qs({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Me(r))
    return ee(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = cl(a, t.damage);
  if (o === null)
    return ee(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = wg({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = ee(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const h = u.closest(`[${O}]`);
    h && qh(h, u, e, t);
  }), u;
}
function cl(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function qh(e, t, n, r) {
  if (n.damageApplication) return;
  if (Uh(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = cl(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Kr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await th.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: ea(),
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
    il(e, m);
    try {
      await Bg(r.rollCard, m);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", h);
    }
    try {
      await Tg(u.value);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", h);
    }
    Jr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ul(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (e.effectApplication)
    return ee(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!a) return null;
  if (Me(r))
    return ee(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Ls(r))
    return ee(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = ee(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${O}]`);
    l && Gh(l, o, e, t);
  }), o;
}
async function Gh(e, t, n, r) {
  if (n.effectApplication) return;
  if (zh(n)) {
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
  const o = Kr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await nh.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: ea(),
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
    sl(e, c);
    try {
      await zg(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Jr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function dl(e, t) {
  for (const n of t)
    n && e.append(n);
}
function ee(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function jh(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Js, "true"), t.setAttribute("aria-hidden", "true"), ml(e, t), t;
}
function po(e) {
  const t = e.querySelector(`[${el}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Js}="true"]`);
  r && ml(e, r);
}
function ml(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function go(e) {
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
function Vh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(el, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Hh(e, t.resistance);
  s && r.append(s);
  const l = Wh(e, t.resistance), c = Kh(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Hh(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Fe ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Wh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = rl(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Kh(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), dl(n, [
    ll(e, t, "full"),
    ul(e, t, "full")
  ]), n;
}
function Yh(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Qh(e) {
  const t = fl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Xs, "true"), n;
}
function fl(e) {
  return e.querySelector(`[${Xs}="true"]`);
}
function Zh(e, t) {
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
function Xh(e, t, n) {
  const r = n?.parentElement === e ? n : ut(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Jh(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function kn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function eb(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function tb(e) {
  return typeof e == "string" && e.length > 0;
}
function nb(e) {
  return e === "normal" || e === "half";
}
function ho(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function pl(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const bo = "data-paranormal-toolkit-card-layout-refresh-bound";
function rb(e) {
  const t = e.rollCard.querySelector(Kt);
  t && t.getAttribute(bo) !== "true" && (t.setAttribute(bo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Se = "data-paranormal-toolkit-prompt-id", ab = "apply-damage", ob = "data-paranormal-toolkit-multi-target-damage-info";
function ib(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(ob) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function sb(e) {
  const t = cb(e);
  return t.find((n) => n.getAttribute(Cg) === ab) ?? t.find((n) => js(n) === "aplicar danos") ?? null;
}
function lb(e) {
  const t = gl(e), n = yo(t);
  return n || yo(ub(e));
}
function yo(e) {
  return e.find((t) => {
    const n = js(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function cb(e) {
  const t = gl(e);
  return t.length > 0 ? t : ta(e);
}
function gl(e) {
  const t = fb(e);
  return t ? ta(e).filter((n) => mb(n, t)) : [];
}
function ub(e) {
  const t = hl(e);
  if (!t) return [];
  const n = db(e, t);
  return ta(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => bl(e, r)).filter((r) => !n || pb(r, n));
}
function ta(e) {
  const t = hl(e);
  return t ? Array.from(t.querySelectorAll(Sg)) : [];
}
function hl(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function db(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && bl(e, n)) ?? null;
}
function mb(e, t) {
  return e.getAttribute(Se) === t ? !0 : Array.from(e.querySelectorAll(`[${Se}]`)).some((n) => n.getAttribute(Se) === t);
}
function fb(e) {
  return e.getAttribute(Se) ?? e.querySelector(`[${Se}]`)?.getAttribute(Se) ?? null;
}
function bl(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function pb(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function gb(e) {
  const t = yl(), n = Zt(e.rollCard).state, r = jr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Me(a), s = Ls(a);
  return e.applied ? He({
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
  }) : r.policy.canShowApplyEffect ? He(o ? {
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
  }) : He({
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
function He(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function hb(e) {
  const { rollCard: t } = e, n = Ab(), r = yl(), a = Zt(t).state, o = jr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Me(s), c = yb(e);
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
      summary: bb(a)
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
function bb(e) {
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
function yb(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Ab() {
  try {
    return od();
  } catch {
    return "assisted";
  }
}
function yl() {
  try {
    return xr();
  } catch {
    return "strict";
  }
}
const _b = "data-paranormal-toolkit-damage-resolution-state", Ao = "data-paranormal-toolkit-damage-icon-enhanced", na = "data-paranormal-toolkit-damage-original-label", Tb = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, Al = "Outra opção escolhida";
function Rb(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Dg(t, "Aplicar dano"), kb(e, t);
}
function kb(e, t) {
  const n = Array.from(t.querySelectorAll(De)), r = To(n, "normal"), a = To(n, "half");
  if (!r || !a) {
    wb(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Ro(r, "normal"), Ro(a, "half");
  const o = hb({
    rollCard: e,
    normalButtonApplied: Pt(r),
    halfButtonApplied: Pt(a),
    normalButtonSkipped: dr(r),
    halfButtonSkipped: dr(a)
  });
  if (!o.canShowApplyDamage) {
    ko(r), ko(a), wo(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), _o(r, o.normalButton), _o(a, o.halfButton), wo(t, o.summary.state, o.summary.message);
}
function _o(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Eb(e, t.visible), Ib(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function wb(e) {
  for (const t of e)
    dr(t) && t.remove();
}
function Pt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(Al);
}
function dr(e) {
  return e.textContent?.includes(Al) ?? !1;
}
function To(e, t) {
  const n = Tb[t];
  return e.find((r) => n.test($b(r))) ?? null;
}
function $b(e) {
  return [
    e.getAttribute(na),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Ro(e, t) {
  if (e.getAttribute(Ao) === "true") return;
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
  ), e.setAttribute(Ao, "true"), e.setAttribute(na, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ye(n));
}
function ko(e) {
  Pt(e) || e.remove();
}
function Eb(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function Ib(e, t, n, r = "Role resistência") {
  if (!Pt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ye(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Sb(e, n);
  }
}
function Sb(e, t) {
  const n = e.getAttribute(na) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Cb(t), ye(n)));
}
function Cb(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function wo(e, t, n) {
  e.setAttribute(_b, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Yr)?.after(a);
}
const rt = "data-paranormal-toolkit-effect-icon-enhanced", Ne = "data-paranormal-toolkit-effect-action-compacted", Jt = "data-paranormal-toolkit-effect-resistance-gate", ra = "data-paranormal-toolkit-effect-section", aa = "data-paranormal-toolkit-effect-label";
function Lb(e) {
  return e.querySelector(`[${ra}="true"]`);
}
function vb(e) {
  const t = Nb(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? xb(), r = jb(n, e.sourceActions, t);
  return r && n.setAttribute(aa, r), Ob(n, t, r), qb(e.rollCard, n, e.after ?? e.fallbackAfter), Gb(e.sourceActions, n), n;
}
function Db(e, t) {
  const n = t.querySelector(De);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = kl(t, n, r), o = _l(e, n), s = gb({
    rollCard: e,
    effectLabel: a,
    applied: ia(n, r),
    effectCanApplyOnSuccessfulResistance: o ? ve(o) === "success" || ve(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Cs(o) : !1
  });
  if (s.applied) {
    Hb(n);
    return;
  }
  if (!s.visible) {
    Wb(n);
    return;
  }
  if (s.waitingForResistance) {
    Kb(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    Yb(n, s.compactLabel);
    return;
  }
  Qb(n), Rl(n, s.displayLabel);
}
function Nb(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(De) ?? []), n = Array.from(e.existingSection?.querySelectorAll(De) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Pb(e.rollCard, r) ?? r[0] ?? null;
}
function Pb(e, t) {
  const n = Zt(e).state, r = Is(n), a = Tl(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = _l(e, o, a);
    if (s && Ss(s, r)) return o;
  }
  return null;
}
function _l(e, t, n = Tl(e)) {
  const r = oa(t, t.textContent?.trim() ?? ""), a = Hn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Hn(s) === a)) ?? null : null;
}
function Tl(e) {
  const t = Bs(wp(e));
  if (!t) return [];
  const n = lt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function xb() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(ra, "true"), e;
}
function Ob(e, t, n) {
  e.setAttribute(ra, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Mb(e), a = Fb(r);
  a.textContent = "Efeito";
  const o = Bb(e, r), s = Ub(o);
  s.textContent = Zb(n ?? kl(e, t, t.textContent?.trim() ?? ""));
  const l = zb(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(De)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !ia(t, c) && !Vb(t, c) && Rl(t, n ?? c);
}
function Mb(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Fb(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Bb(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function Ub(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function zb(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function qb(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Gb(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(De)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function jb(e, t, n) {
  const r = e.getAttribute(aa);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || oa(n, n.textContent?.trim() ?? "");
}
function oa(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && te(n) !== "efeito aplicado") return n;
  const r = $p(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && te(a) !== "aplicado" ? a : null;
}
function ia(e, t) {
  return e.classList.contains(Lg) || te(t).includes("aplicado");
}
function Vb(e, t) {
  const n = e.getAttribute(Jt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Hn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Rl(e, t) {
  e.getAttribute(Ne) === "true" && e.getAttribute(rt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(rt, "true"), e.setAttribute(vg, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Qr("✦", `${i}__button-icon--effect`),
    ye("Aplicar")
  ));
}
function Hb(e) {
  e.getAttribute(Ne) === "true" && te(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(rt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Qr("✓", `${i}__button-icon--effect-applied`),
    ye("Aplicado")
  ));
}
function kl(e, t, n) {
  const r = e.getAttribute(aa) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : oa(t, n) ?? n;
}
function Wb(e) {
  ia(e, e.textContent?.trim() ?? "") || e.remove();
}
function Kb(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ne), e.removeAttribute(rt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Jt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ye(t));
}
function Yb(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ne), e.removeAttribute(rt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Jt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Qr("✓", `${i}__button-icon--effect-resisted`),
    ye(t)
  );
}
function Qb(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Jt), e.removeAttribute("aria-disabled");
}
function Zb(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Xb = "data-paranormal-toolkit-card-layout-normalized";
function Jb(e) {
  const t = ey(e.rollCard), n = ty(t);
  return rb({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function ey(e) {
  return {
    rollCard: e,
    damageSection: ib(e),
    resistance: e.querySelector(Mr),
    damageActions: sb(e),
    effectActionSource: lb(e),
    effectSection: Lb(e)
  };
}
function ty(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(Xb, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = ut(t, "Conjuração"), c = ny({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), Rb(t, a));
  const u = vb({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: ry(n, c),
    fallbackAfter: l
  });
  return u && Db(t, u), u;
}
function ny(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function ry(e, t) {
  return e ?? t;
}
const wl = [0, 80, 180, 400, 900, 1600, 3e3], $o = /* @__PURE__ */ new WeakSet();
function ay(e) {
  $l(e), oy(e);
}
function $l(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    El(t);
}
function oy(e) {
  if (!$o.has(e)) {
    $o.add(e);
    for (const t of wl)
      globalThis.setTimeout(() => {
        $l(e);
      }, t);
  }
}
function El(e) {
  const t = Jb({
    rollCard: e,
    refreshDelaysMs: wl,
    onRefresh: () => El(e)
  });
  oh({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const iy = "data-paranormal-toolkit-resistance-roll-result-enhanced", Eo = "data-paranormal-toolkit-resistance-original-description", sy = "data-paranormal-toolkit-resistance-skill", ly = "data-paranormal-toolkit-resistance-skill-label", cy = `${i}__resistance--without-roll-button`, uy = ["Fortitude", "Reflexos", "Vontade"];
function dy(e) {
  for (const t of Array.from(e.querySelectorAll(Mr)))
    my(t);
  ay(e);
}
function my(e) {
  const t = e.querySelector(um), n = e.querySelector(us), r = e.querySelector(Kt), a = by(r) ? r : null, o = e.querySelector(ds);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(cy, !a);
  const s = hy(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), _y(o)), fy(e, r, n), a && ($y(a), a.parentElement !== e && e.append(a));
}
function fy(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = gy(n), o = Vs({
    description: a,
    skillLabel: yy(t, a),
    difficulty: Gr(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  py(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function py(e, t) {
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
function gy(e) {
  const t = e.getAttribute(Eo);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(Eo, n), n;
}
function hy(e, t) {
  const n = e.querySelector(`.${Wa}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Wa), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function by(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function yy(e, t) {
  const n = e?.getAttribute(ly) ?? e?.getAttribute(sy) ?? null;
  return n || Ay(t);
}
function Ay(e) {
  const t = Io(e);
  return uy.find((n) => t.startsWith(Io(n))) ?? null;
}
function Io(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function _y(e) {
  const t = Ty(e.textContent ?? "");
  t && (e.setAttribute(iy, "true"), e.replaceChildren(wy(t)));
}
function Ty(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Ry(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Ry(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: ky(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function ky(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function wy(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Ey(e);
  return r && t.append(r), t;
}
function $y(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Zt(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function Ey(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Iy(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Iy(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? So(e, "highest") : n.includes("kl") ? So(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function So(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Co(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function sa() {
  const e = globalThis.game;
  return en(e) ? e : null;
}
function U(e, t) {
  const n = Sy(e, t);
  return Lt(n);
}
function Sy(e, t) {
  return t.split(".").reduce((n, r) => en(n) ? n[r] : null, e);
}
function Cy(e, t) {
  const n = e.indexOf(":");
  return n < 0 || at(e.slice(0, n)) !== at(t) ? null : Be(e.slice(n + 1));
}
function Lt(e) {
  return typeof e == "string" ? Be(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function en(e) {
  return !!e && typeof e == "object";
}
function Ly(e) {
  return typeof e == "string";
}
function tn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Be(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function at(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function mr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ne(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Il(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function vy(e) {
  for (const t of Array.from(e.querySelectorAll(sm))) {
    const n = Fy(t);
    Dy(t), n && (Ny(t, n), Py(t, n));
  }
}
function Dy(e) {
  for (const t of Array.from(e.querySelectorAll(lm)))
    t.remove();
}
function Ny(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(cs) ?? null, a = r?.querySelector(im) ?? null, o = r ?? e, s = o.querySelector(fm);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = tA(t.elementTone), l.textContent = eA(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Py(e, t) {
  const n = xy(e);
  Oy(e, n);
  const r = My(t);
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
  const o = e.querySelector(ms);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function xy(e) {
  return e.closest(`.${i}`)?.querySelector(cs) ?? null;
}
function Oy(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(pm)))
      a.remove();
}
function My(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${mr(e.target)}` : null,
    e.duration ? `Duração: ${mr(e.duration)}` : null,
    e.resistance ? `Resistência: ${Il(e.resistance)}` : null
  ].filter(tn);
}
function Fy(e) {
  const t = By(e), n = Vy(e), a = (t ? jy(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = la(U(a, "element")), l = K("op.elementChoices", s) ?? Lo(ue(o, "Elemento")) ?? Lo(n.damageType), c = s ?? nA(l), u = U(a, "circle") ?? ue(o, "Círculo"), m = Ky(a) ?? ue(o, "Alvo"), h = Xy(a, "duration", "op.durationChoices") ?? ue(o, "Duração"), k = Hy(e) ?? Qy(a) ?? ue(o, "Resistência"), _ = Wy(o) ?? n.cost, T = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: _,
    target: m,
    duration: h,
    resistance: k
  };
  return Jy(T) ? T : null;
}
function By(e) {
  const t = Uy(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Wt), r = qy(n);
  if (r.length === 0) return null;
  const a = zy(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Uy(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? sa()?.messages?.get?.(n) ?? null : null;
}
function zy(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Ha}]`))) {
    const a = r.getAttribute(Ha)?.trim();
    a && n.add(a);
  }
  return n;
}
function qy(e) {
  if (!en(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Gy).filter((n) => n !== null) : [];
}
function Gy(e) {
  return en(e) ? {
    pendingId: Lt(e.pendingId),
    actorId: Lt(e.actorId),
    itemId: Lt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Ly) : []
  } : null;
}
function jy(e) {
  if (!e.itemId) return null;
  const t = sa(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Vy(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(cm))) {
    const a = Be(r.textContent);
    if (!a) continue;
    const o = Cy(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function Hy(e) {
  const t = Be(e.querySelector(us)?.textContent);
  return t ? Il(t) : null;
}
function ue(e, t) {
  const n = at(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || at(r.slice(0, a)) !== n))
      return Be(r.slice(a + 1));
  }
  return null;
}
function Wy(e) {
  const t = ue(e, "Custo") ?? ue(e, "PE");
  return t || (e.map(Be).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Ky(e) {
  const t = U(e, "target");
  if (!t) return null;
  if (t === "area")
    return Yy(e) ?? K("op.targetChoices", t) ?? "Área";
  const n = K("op.targetChoices", t) ?? ne(t);
  return [t === "people" || t === "creatures" ? U(e, "targetQtd") : null, n].filter(tn).join(" ");
}
function Yy(e) {
  const t = U(e, "area.name"), n = U(e, "area.size"), r = U(e, "area.type"), a = t ? K("op.areaChoices", t) ?? ne(t) : null, o = r ? K("op.areaTypeChoices", r) ?? ne(r) : null;
  return a ? n ? o ? `${a} ${n}m ${mr(o)}` : `${a} ${n}m` : a : null;
}
function Qy(e) {
  const t = U(e, "skillResis"), n = U(e, "resistance");
  if (!t || !n) return null;
  const r = K("op.skill", t) ?? ne(t), a = Zy(n);
  return [r, a].filter(tn).join(" ");
}
function Zy(e) {
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
      return K("op.resistanceChoices", e) ?? ne(e);
  }
}
function Xy(e, t, n) {
  const r = U(e, t);
  return r ? K(n, r) ?? ne(r) : null;
}
function Jy(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function eA(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function tA(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(tn).join(" ");
}
function la(e) {
  const t = at(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Lo(e) {
  const t = la(e);
  return t ? K("op.elementChoices", t) ?? ne(t) : e ? ne(e) : null;
}
function nA(e) {
  return la(e);
}
function K(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = sa()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const vo = "data-paranormal-toolkit-dice-toggle-enhanced";
function rA(e) {
  for (const t of Array.from(e.querySelectorAll(fs)))
    Sl(t);
}
function aA(e) {
  const t = Ll(e.target);
  if (!t) return;
  const n = ca(t);
  n && (e.preventDefault(), Cl(n, t));
}
function oA(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ll(e.target);
  if (!t) return;
  const n = ca(t);
  n && (e.preventDefault(), Cl(n, t));
}
function Sl(e) {
  const t = e.querySelector(Yt);
  if (!t) return;
  const n = e.querySelector(Br);
  if (n && n.getAttribute(vo) !== "true" && (n.setAttribute(vo, "true"), n.classList.add(Ur), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Cl(e, t) {
  const n = e.querySelector(Yt);
  if (!n) return;
  const r = !e.classList.contains(Fr);
  iA(e, t, n, r);
}
function iA(e, t, n, r) {
  e.classList.toggle(Fr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Ll(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Br);
  if (!t) return null;
  const n = ca(t);
  return n ? (Sl(n), t.classList.contains(Ur) ? t : null) : null;
}
function ca(e) {
  const t = e.closest(fs);
  return t && t.querySelector(Yt) ? t : null;
}
const Do = `${d}-workflow-dice-toggle-styles`;
function sA() {
  if (document.getElementById(Do)) return;
  const e = document.createElement("style");
  e.id = Do, e.textContent = `
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
const lA = [0, 100, 500, 1500, 3e3];
let No = !1, wn = null;
function cA() {
  if (!No) {
    No = !0, sA(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ze(Co(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ze(Co(t));
    }), Hooks.once("ready", () => {
      Ze(document), uA();
    }), document.addEventListener("click", aA), document.addEventListener("keydown", oA);
    for (const e of lA)
      globalThis.setTimeout(() => Ze(document), e);
  }
}
function uA() {
  wn || !document.body || (wn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ze(n);
  }), wn.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ze(e) {
  e && (Dm(e), vy(e), dy(e), rA(e), wm(e));
}
function dA() {
  cA();
}
const mA = "data-paranormal-toolkit-action-section", fA = "ritual-log", pA = ".paranormal-toolkit-item-use-prompt__actions", gA = ".paranormal-toolkit-item-use-prompt__actions-title", hA = [0, 100, 500, 1500];
let Po = !1;
function bA() {
  if (Po) return;
  const e = (t, n) => {
    xo(TA(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), xo(document), Po = !0;
}
function xo(e) {
  for (const t of hA)
    globalThis.setTimeout(() => yA(e), t);
}
function yA(e) {
  AA(e), _A(e);
}
function AA(e) {
  for (const t of e.querySelectorAll(
    `[${mA}="${fA}"]`
  ))
    t.remove();
}
function _A(e) {
  for (const t of e.querySelectorAll(pA)) {
    if (Oo(t.querySelector(gA)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Oo(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function TA(e) {
  if (e instanceof HTMLElement || RA(e))
    return e;
  if (kA(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function RA(e) {
  return e instanceof HTMLElement;
}
function kA(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Oo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Xe = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, vl = {
  PV: "system.attributes.hp"
}, fr = {
  PV: [Xe.PV, vl.PV],
  SAN: [Xe.SAN],
  PE: [Xe.PE],
  PD: [Xe.PD]
}, pr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class wA {
  getResource(t, n) {
    const r = Mo(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = Bo(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = Bo(t, n, s, c, "valor máximo");
    return m ? p(m) : b({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Mo(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Mo(e, t) {
  const n = $A(e.type, t);
  if (n && Fo(e, n))
    return b(n);
  const r = fr[t].find(
    (a) => Fo(e, a)
  );
  return r ? b(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: EA(e, t),
    path: fr[t].join(" | ")
  });
}
function $A(e, t) {
  return e === "threat" ? vl[t] ?? null : e === "agent" ? Xe[t] : null;
}
function Fo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function EA(e, t) {
  const n = e.type ?? "unknown", r = fr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Bo(e, t, n, r, a) {
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
class IA {
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
      const s = pr.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = SA(a);
    return o ? b(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of pr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function SA(e) {
  if (Uo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Uo(n))
      return n;
  }
  return null;
}
function Uo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const CA = "dice-so-nice";
async function Dl(e) {
  if (!LA() || !vA()) return;
  const t = DA();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function LA() {
  try {
    return om().enabled;
  } catch {
    return !1;
  }
}
function vA() {
  return game.modules?.get?.(CA)?.active === !0;
}
function DA() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const zo = "occultism";
class Nl {
  getDifficulty(t) {
    return NA(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await xA(t, zo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Dl(r);
    const a = FA(r);
    return {
      skill: zo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: MA(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: BA(r)
    };
  }
}
function NA(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function PA(e) {
  return new Nl().rollCastingCheck(e);
}
async function xA(e, t) {
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
  return OA(r);
}
function OA(e) {
  return qo(e) ? e : Array.isArray(e) ? e.find(qo) ?? null : null;
}
function qo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function MA(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function FA(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function BA(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(UA);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function UA(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const zA = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class qA {
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
    const r = n.value, a = GA(t.ritual, r);
    return a.ok ? a.value ? b(a.value) : b({
      resource: "PE",
      amount: zA[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function GA(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : jA(n) ? {
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
function jA(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class VA {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return $n("missing-item-patch");
    if (t.type !== "ritual") return $n("unsupported-item-type");
    const a = HA(r);
    return Object.keys(a).length === 0 ? $n("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function HA(e) {
  const t = {};
  v(t, "name", e.name), v(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (v(t, "system.circle", n.circle), v(t, "system.element", n.element), v(t, "system.target", n.target), v(t, "system.targetQtd", n.targetQuantity), v(t, "system.execution", n.execution), v(t, "system.range", n.range), v(t, "system.duration", n.duration), v(t, "system.skillResis", n.resistanceSkill), v(t, "system.resistance", n.resistance), v(t, "system.studentForm", n.studentForm), v(t, "system.trueForm", n.trueForm)), t;
}
function v(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function $n(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class WA {
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
    return this.getNumber(t, pr.ritual.dt, 0);
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
class KA {
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
class YA {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = QA(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, En(t)), b(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const a = this.register(r);
      if (!a.ok)
        return a;
      n.push(a.value);
    }
    return b(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? En(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? b(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(En);
  }
  findForItem(t) {
    return this.list().map((n) => ZA(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function QA(e) {
  return !In(e.id) || !In(e.version) || !In(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : b(e);
}
function ZA(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = XA(a, t);
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
function XA(e, t) {
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
      const n = Go(t.name), r = e.names.map(Go).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = JA(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Go(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function JA(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function En(e) {
  return structuredClone(e);
}
function In(e) {
  return typeof e == "string" && e.length > 0;
}
function xt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : b(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = nn(e.amountFrom);
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
    }) : b(a);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function nn(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function e_(e, t, n) {
  if (!jo(e.id) || !jo(e.formula))
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
    await Dl(a);
    const l = {
      ...n.rollRequests[e.id] ?? Pl(e, t),
      total: o,
      roll: a
    };
    return n.rolls[e.id] = l, b(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Pl(e, t) {
  const n = e.intent ?? t_(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function t_(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function jo(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ot(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? _t(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? _t(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? _t(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? _t(t, n, r, a) : e.recover(t, n, a);
  }
}
function _t(e, t, n, r) {
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
function n_(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = r_(t, n, r, a);
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
    const s = a_(t, n, r, a);
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
function r_(e, t, n, r) {
  const a = nn(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: xl(t.id, "damage", r, t.damageInstances.length),
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
function a_(e, t, n, r) {
  const a = nn(e.amountFrom);
  return {
    id: xl(t.id, "healing", r, t.healingInstances.length),
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
function xl(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function o_(e, t, n) {
  const r = nn(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function i_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Ol("before", e), Vo("before", e), Vo("resolve", e);
}
function s_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Ol("apply", e);
}
function l_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Ol(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = c_(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Vo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function c_(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function u_(e, t, n) {
  return b(void 0);
}
async function d_(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return m_(e, t);
    case "spendRitualCost":
      return f_(e, t);
  }
}
async function m_(e, t) {
  const { context: n, resources: r } = e, a = xt(t, n);
  return a.ok ? Ml(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function f_(e, t) {
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
  }), Ml(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Ml(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function p_(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = g_(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function g_(e) {
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
class h_ {
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
    return b({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return p_({
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
    const a = await d_({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? b(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Pl(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await e_(t, r, n);
    return a.ok ? b(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = xt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = o_(t, n, a.value);
    i_({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), s_({
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
      const c = await Ot(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      n_({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return l_({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), b(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = xt(t, n);
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
      const l = await Ot(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return b(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await u_(this.messages);
    return a.ok ? b(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, a) {
    return t.ok ? (n.resourceTransactions.push(t.value), b(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: a,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, a, o, s) {
    const l = b_(t, n.intent);
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
function b_(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class y_ {
  emitCastStarted(t) {
    Hooks.callAll($t.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll($t.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll($t.ritual.castFinished, t);
  }
}
class A_ {
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
    } catch (h) {
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
        cause: h
      });
    }
    return b({
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
        }) : b({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const a = Math.max(0, n.value - r);
        return b({
          afterValue: a,
          appliedAmount: n.value - a
        });
      }
      case "heal":
      case "recover": {
        const a = Math.min(n.max, n.value + r);
        return b({
          afterValue: a,
          appliedAmount: a - n.value
        });
      }
    }
  }
}
class __ {
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
function Fl(e) {
  return {
    id: T_(),
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
function T_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class R_ {
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
    return we(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Fl(n);
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
class k_ {
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
class w_ {
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
    const n = zn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: $_(),
      flags: {
        ...t.flags,
        [d]: {
          ...E_(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = zn();
    if (!r.enabled)
      return;
    const a = n.notification ?? Ho(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Ho(n);
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
function Ho(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function $_() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function E_(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const I_ = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Bl = `${d}-inline-roll-neutralized`, S_ = `${d}-inline-roll-notice`, ua = `data-${d}-inline-roll-neutralized`, Wo = `data-${d}-inline-roll-notice`, C_ = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ko(e) {
  const t = G_(e.message), n = await L_(e.message), r = v_(t);
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
async function L_(e) {
  const t = U_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = D_(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await z_(t, n.content), replacementCount: n.replacementCount };
}
function v_(e) {
  const t = e ? q_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Ul(t);
  return n > 0 && zl(M_(t)), { replacementCount: n };
}
function D_(e) {
  const t = N_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Ul(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (zl(n.content), { content: n.innerHTML, replacementCount: a });
}
function N_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, x_(a.trim()))), replacementCount: t };
}
function Ul(e) {
  const t = P_(e);
  for (const n of t)
    n.replaceWith(O_(F_(n)));
  return t.length;
}
function P_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(I_))
    n.getAttribute(ua) !== "true" && t.add(n);
  return Array.from(t);
}
function x_(e) {
  return `<span class="${Bl}" ${ua}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${j_(e)}</span>`;
}
function O_(e) {
  const t = document.createElement("span");
  return t.classList.add(Bl), t.setAttribute(ua, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function zl(e) {
  if (e.querySelector?.(`[${Wo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(S_), t.setAttribute(Wo, "true"), t.textContent = C_, e.append(t);
}
function M_(e) {
  return e.querySelector(".message-content") ?? e;
}
function F_(e) {
  const n = e.getAttribute("data-formula") ?? B_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function B_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function U_(e) {
  return e && typeof e == "object" ? e : null;
}
async function z_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function q_(e) {
  const t = V_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function G_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function j_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function V_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Mt = "ritualRollConfig", Ft = "ritual-roll", H_ = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function rn() {
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
function ql(e) {
  const t = e.getFlag(d, Mt);
  return gr(t);
}
function Gl(e) {
  return ql(e) ?? rn();
}
async function W_(e, t) {
  const n = gr(t) ?? gr({
    ...rn(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Mt, n), n;
}
async function K_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Mt));
    return;
  }
  await e.setFlag(d, Mt, null);
}
function gr(e) {
  if (!an(e)) return null;
  const t = aT(e.intent);
  if (!t) return null;
  const n = rn();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: hr(e.damageType),
    utilityLabel: hr(e.utilityLabel) ?? n.utilityLabel,
    note: da(e.note),
    forms: iT(e.forms)
  };
}
function Y_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Q_(e) {
  const t = ql(e), n = jl(e);
  if (!t)
    return Yo(e, n);
  const r = nT(e, t);
  if (!r)
    return Yo(e, n);
  const a = Z_(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...X_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: eT(e, t),
    resistance: n
  };
}
function Yo(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: tT(e),
    resistance: t
  } : null;
}
function Z_(e, t) {
  const n = {
    type: "rollFormula",
    id: Ft,
    formula: t,
    intent: rT(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function X_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Ft}.total`,
          ...J_(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Ft}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function J_(e) {
  return e ? { damageType: e } : {};
}
function eT(e, t) {
  const n = {
    base: Sn("Padrão", t.forms.base.formula)
  };
  return Pe(e, "discente") && (n.discente = Sn("Discente", t.forms.discente.formula, 2)), Pe(e, "verdadeiro") && (n.verdadeiro = Sn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function Sn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Ft]: t.trim()
    }
  };
}
function tT(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Pe(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Pe(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function nT(e, t) {
  return [
    t.forms.base.formula.trim(),
    Pe(e, "discente") ? t.forms.discente.formula.trim() : "",
    Pe(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function jl(e) {
  const t = Vl(e), n = hr(t.skillResis), r = oT(t.resistance);
  if (!n || !r) return;
  const a = sT(n), o = H_[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function rT(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function aT(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function oT(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function iT(e) {
  const t = rn();
  return an(e) ? {
    base: Cn(e.base),
    discente: Cn(e.discente),
    verdadeiro: Cn(e.verdadeiro)
  } : t.forms;
}
function Cn(e) {
  return an(e) ? { formula: da(e.formula) } : { formula: "" };
}
function Pe(e, t) {
  const n = Vl(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return lT(r);
}
function Vl(e) {
  const t = e.system;
  return an(t) ? t : {};
}
function sT(e) {
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
function lT(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function da(e) {
  return typeof e == "string" ? e.trim() : "";
}
function hr(e) {
  const t = da(e);
  return t.length > 0 ? t : null;
}
function an(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function cT(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function uT(e) {
  switch (dT(e)) {
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
      return mT(String(e ?? ""));
  }
}
function dT(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function mT(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function fT() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function pT(e) {
  return {
    ...ma(e),
    type: "ritual.cast.started"
  };
}
function gT(e) {
  return {
    ...ma(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function hT(e) {
  return {
    ...ma(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function bT(e) {
  if (e.type === "preset") {
    const t = me(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: me(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: me(e.label),
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
function yT(e, t = {}) {
  const n = NT(e), r = [
    ...xT(t.candidates ?? []),
    ...OT(e)
  ], a = FT(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = PT(t) ?? BT(r) ?? zT(a), s = GT(canvas?.grid?.size), l = AT(o, a, r), c = IT(r), u = ET(l);
  return {
    type: "rectangleRay",
    sceneId: qT(e, n),
    regionId: ni(n?.id) ?? ni(e.id),
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
function AT(e, t, n) {
  const r = {
    x: E(e, "x") ?? 0,
    y: E(e, "y") ?? 0,
    width: E(e, "width") ?? t.width,
    height: E(e, "height") ?? t.height,
    direction: E(e, "direction") ?? 0,
    elevation: E(e, "elevation")
  };
  return {
    ...r,
    direction: _T(r, t, n)
  };
}
function _T(e, t, n) {
  const r = TT(n);
  return r !== null ? r : kT(e, t) ?? e.direction;
}
function TT(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = Qo(n, t);
    if (r !== null) return r;
    const a = on(n), o = Qo(a, t);
    if (o !== null) return o;
  }
  return null;
}
function Qo(e, t) {
  for (const n of t) {
    const r = RT(x(e, n));
    if (r !== null) return r;
  }
  return null;
}
function RT(e) {
  const t = ot(e);
  if (t === null) return null;
  const n = pa(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function kT(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Xo(Zo(e, e.direction), t), r = wT(e, t);
  if (r === null) return null;
  const o = $T([
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
    error: Xo(Zo(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? pa(o.direction) : null;
}
function wT(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = ri(o, 0, 1), c = ri(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : jT(Math.atan2(c, l));
}
function Zo(e, t) {
  const n = Wl(t), r = {
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
  ], s = o.map((k) => k.x), l = o.map((k) => k.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), h = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: h - m
  };
}
function Xo(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function $T(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = pa(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function ET(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Wl(e.direction), n = {
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
function IT(e) {
  for (const t of e) {
    const n = Jo(t, "ray.start"), r = Jo(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Jo(e, t) {
  const n = x(e, t), r = ot(x(n, "x")), a = ot(x(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function ma(e) {
  const t = bT(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: LT(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: ST(e.context.item, e.form, e.formLabel, t),
    targets: n.map(vT),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function ST(e, t, n, r) {
  return {
    name: e.name,
    slug: Ln(e, "system.slug") ?? Ln(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: Ln(e, "system.element"),
    circle: DT(e),
    form: CT(t),
    formLabel: n
  };
}
function CT(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function LT(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function vT(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function DT(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : me(t);
}
function Ln(e, t) {
  return me(foundry.utils.getProperty(e, t));
}
function me(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function NT(e) {
  return "document" in e && e.document ? e.document : e;
}
function PT(e) {
  return Hl(e.shape);
}
function xT(e) {
  return e.filter(fa);
}
function OT(e) {
  return [
    e,
    MT(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(fa);
}
function MT(e) {
  return "object" in e && fa(e.object) ? e.object : null;
}
function fa(e) {
  return !!(e && typeof e == "object");
}
function FT(e) {
  for (const t of e) {
    const n = ei(x(on(t), "bounds"));
    if (n) return n;
    const r = ei(x(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function ei(e) {
  const t = E(e, "x"), n = E(e, "y"), r = E(e, "width"), a = E(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function E(e, t) {
  return ot(x(e, t));
}
function BT(e) {
  for (const t of e) {
    const n = UT(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function UT(e) {
  if (!e || typeof e != "object") return [];
  const t = ti(on(e));
  return t.length > 0 ? t : ti(e);
}
function ti(e) {
  const t = x(e, "shapes");
  return Array.isArray(t) ? t.map(Hl).filter((n) => n !== null) : [];
}
function Hl(e) {
  const t = on(e) ?? e, n = x(t, "type");
  return typeof n != "string" ? null : {
    type: n,
    x: E(t, "x"),
    y: E(t, "y"),
    width: E(t, "width"),
    height: E(t, "height"),
    direction: E(t, "direction"),
    elevation: E(t, "elevation")
  };
}
function zT(e) {
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
function qT(e, t) {
  return vn(e, "parent.id") ?? vn(e, "document.parent.id") ?? vn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function vn(e, t) {
  return me(x(e, t));
}
function x(e, t) {
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
function on(e) {
  if (!e || typeof e != "object") return null;
  const t = x(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function ni(e) {
  return me(e);
}
function ot(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function GT(e) {
  const t = ot(e);
  return t !== null && t > 0 ? t : null;
}
function Wl(e) {
  return e * Math.PI / 180;
}
function jT(e) {
  return e * 180 / Math.PI;
}
function pa(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function ri(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class VT {
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
class sn {
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
const HT = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class WT {
  constructor(t = new sn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = KT(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(HT);
  }
}
function KT(e, t) {
  const n = [], r = YT(e), a = ai(r), o = ai(e);
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
function YT(e) {
  return QT(e) ? e.document ?? null : e;
}
function QT(e) {
  return "bounds" in e;
}
function ai(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const ZT = 100, XT = 12;
class JT {
  constructor(t = new sn()) {
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
      const a = this.foundryAdapter.getGridSize() ?? ZT, o = aR(n), s = await this.foundryAdapter.placeRegion(
        eR(t, this.foundryAdapter.getUserColor(), a),
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
        message: rR(a)
      };
    }
  }
}
function eR(e, t, n) {
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
    shapes: [tR(e, n)]
  };
}
function tR(e, t) {
  const n = nR(e, t);
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
function nR(e, t) {
  return {
    length: oi(e.length, XT, t),
    width: oi(e.width, 1, t)
  };
}
function oi(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function rR(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function aR(e) {
  const t = (n) => {
    const r = oR(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function oR(e) {
  return iR(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function iR(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class sR {
  constructor(t = new sn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(ii(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(ii(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = lR(t);
    cR(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function ii(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function lR(e) {
  return Array.from(new Set(e));
}
function cR(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class uR {
  constructor(t = new sn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Qi)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(dR(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(mR(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: br(r.region)
    }));
    for (const r of t) {
      if (!br(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = pR(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function dR(e) {
  return [
    { source: "document", region: de(e.document) },
    { source: "document.object", region: de(e.document.object) },
    { source: "preview", region: de(e.preview) },
    { source: "preview.document.object", region: de(e.preview?.document?.object) }
  ];
}
function mR(e) {
  return [
    { source: "input", region: de(e) },
    { source: "input.object", region: fR(e) ? de(e.object) : null },
    { source: "input.document.object", region: Kl(e) ? de(e.document?.object) : null }
  ];
}
function de(e) {
  return br(e) ? e : null;
}
function br(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Tt(n.x) && Tt(n.y) && Tt(n.width) && Tt(n.height);
}
function Kl(e) {
  return "document" in e && "bounds" in e;
}
function fR(e) {
  return !Kl(e);
}
function pR(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function Tt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class gR {
  async minimizeForPlacement() {
    const t = [];
    for (const n of yR())
      await hR(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await bR(n);
      }
    };
  }
}
async function hR(e) {
  if (Yl(e) || !ER(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function bR(e) {
  if (Yl(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function yR() {
  const e = /* @__PURE__ */ new Set();
  for (const t of AR())
    RR(t) && kR(t) && e.add(t);
  return [...e];
}
function AR() {
  return [
    ...si(_R()),
    ...si(TR())
  ];
}
function si(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function _R() {
  return globalThis.ui?.windows ?? null;
}
function TR() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function RR(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function kR(e) {
  const t = wR(e), n = $R(t);
  return n === "Actor" || n === "Item";
}
function wR(e) {
  return e.document ?? e.object ?? null;
}
function $R(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function ER(e) {
  const t = IR(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function IR(e) {
  const t = e.element;
  if (li(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (li(n)) return n;
  }
  return null;
}
function li(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function Yl(e) {
  return e.minimized === !0;
}
const SR = "Nenhum alvo encontrado na linha.";
class CR {
  constructor(t = new JT(), n = new uR(), r = new WT(), a = new sR(), o = new VT(), s = new gR()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = vR(r), m = yT(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(SR), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = LR(c);
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
function LR(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function vR(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function DR(e) {
  return {
    header: {
      eyebrow: Fi,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: UR(e.ritual)
    },
    forms: e.variantOptions.map((t) => NR(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: OR(e.targetNames, e.variantOptions, e.ritual),
    automation: BR(e.automationStatus ?? "assisted")
  };
}
function NR(e, t) {
  const n = PR(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? xR(t) : "—",
    details: n
  };
}
function PR(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function xR(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function OR(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => MR(a, n))
  };
}
function MR(e, t) {
  const n = e.targeting ?? FR(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function FR(e, t) {
  const n = lt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function BR(e) {
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
function UR(e) {
  const t = e.system, n = [qR(t?.element), zR(t?.circle)].filter(VR);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function zR(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function qR(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (GR(e)) {
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
      return jR(e);
  }
}
function GR(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function jR(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function VR(e) {
  return typeof e == "string" && e.length > 0;
}
const Ql = ["base", "discente", "verdadeiro"];
function ga(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Bt(e) {
  return typeof e == "string" && Ql.includes(e);
}
const { ApplicationV2: HR } = foundry.applications.api;
class tt extends HR {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = DR(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: tt.onCast,
      cancel: tt.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new tt(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    YR(a, (o) => {
      this.selectedVariant = o, yr(a, o);
    }), yr(a, this.selectedVariant), QR(a, (o) => {
      this.spendResource = o;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${$(this.model.header.eyebrow)}</p>
        <div>
          <h2>${$(this.model.header.title)}</h2>
          <p>${$(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(WR).join("")}
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
          <div><dt>Custo base</dt><dd>${$(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${$(this.model.cost.casterName)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--targets">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Alvos</h3>
          <span class="paranormal-toolkit-ritual-cast__automation-note paranormal-toolkit-ritual-cast__automation-note--${this.model.automation.status}">
            ${$(this.model.automation.title)}
          </span>
        </div>
        <div class="paranormal-toolkit-ritual-cast__targeting-forms">
          ${this.model.targets.forms.map(KR).join("")}
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targets">
          <div class="paranormal-toolkit-ritual-cast__summary-targets"><dt>Alvos atuais</dt><dd>${$(this.model.targets.targetText)}</dd></div>
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
    const n = ek(t), r = ZR(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function WR(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.details.map((o) => `<span>${$(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${$(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${$(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${$(e.label)}</strong>
        <em>${$(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${a}</span>
    </label>
  `;
}
function KR(e) {
  const t = e.checked ? "" : "hidden", n = e.showLineToggle && e.lineOptionLabel ? `
        <label class="paranormal-toolkit-ritual-cast__targeting-line-toggle">
            <input
              type="checkbox"
              name="areaTargeting-${$(e.variant)}"
              ${e.lineEnabledByDefault ? "checked" : ""}
              data-paranormal-toolkit-area-targeting-line-toggle
            >
            <span>
              <strong>${$(e.lineOptionLabel)}</strong>
              ${e.helperText ? `<em>${$(e.helperText)}</em>` : ""}
            </span>
        </label>
      ` : "";
  return `
    <div
      class="paranormal-toolkit-ritual-cast__targeting-form"
      data-paranormal-toolkit-targeting-form="${$(e.variant)}"
      data-paranormal-toolkit-targeting-mode="${$(e.mode)}"
      ${t}
    >
      <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targeting-mode">
        <div><dt>Modo</dt><dd>${$(e.modeLabel)}</dd></div>
      </dl>
      ${n}
    </div>
  `;
}
function YR(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => ci(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), ci(e, a, t));
    });
  const r = Zl(e);
  r && t(r);
}
function ci(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Bt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Zl(e), yr(e, r.value));
}
function Zl(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Bt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function yr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function QR(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function ZR(e, t, n) {
  const r = JR(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = XR(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function XR(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function JR(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Bt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Bt(n) ? n : null;
}
function ek(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function $(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function tk(e) {
  return tt.request(e);
}
const ha = {
  label: "Padrão"
}, nk = {
  label: "Discente",
  extraCost: 2
}, rk = {
  label: "Verdadeiro",
  extraCost: 5
};
class ak {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new CR();
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
    const a = this.resolveCostPreview(t), o = Xk(n), s = Yk(
      n,
      t.item,
      a,
      o
    ), l = await tk({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: a,
      defaultSpendResource: aw(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = ok(l), u = ew(
      n,
      t.item,
      c.variant,
      o
    ), m = fT(), h = u.label ?? ga(c.variant), k = dk(u), _ = (I = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: h,
      targets: I
    }), T = (I, S = t.targets, Ae = {}) => {
      this.ritualEvents.emitCastFinished(
        hT({
          ..._(S),
          status: I,
          ...Ae
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      pT(_())
    );
    const w = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (w.status === "cancelled")
      return T("cancelled", t.targets, { reason: w.reason }), { status: "cancelled" };
    if (w.status === "failed")
      return T("failed", t.targets, {
        reason: w.reason,
        message: w.message
      }), {
        status: "failed",
        reason: w.reason,
        message: w.message
      };
    const A = ik(
      t,
      w.targets
    );
    w.areaSnapshot && this.ritualEvents.emitAreaResolved(
      gT({
        ..._(w.targets),
        area: w.areaSnapshot
      })
    );
    const je = rs();
    let G = null;
    if (je) {
      const I = await lk(
        this.resources,
        A.actor,
        c,
        u,
        a
      );
      if (!I.ok)
        return T("failed", A.targets, {
          reason: I.reason,
          message: I.message
        }), {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      try {
        const S = await PA(
          A.actor
        );
        G = mk(
          S,
          u,
          a
        );
      } catch (S) {
        const Ae = S instanceof Error ? S.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return T("failed", A.targets, {
          reason: "ritual-casting-check-failed",
          message: Ae
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: Ae,
          cause: S
        };
      }
    }
    const Ve = sk(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !je
      }
    );
    if (Ve.steps.length === 0) {
      const I = Jk(
        A,
        c
      ), S = mi(
        n,
        A
      ), Ae = di(
        A.actor,
        G,
        u,
        a
      ), La = fi(
        n,
        c,
        u,
        a,
        I,
        A,
        G
      );
      if (!S.ok)
        return T("failed", A.targets, {
          reason: S.reason,
          message: S.message
        }), {
          status: "failed",
          reason: S.reason,
          message: S.message
        };
      const va = [
        ...Ae,
        ...S.actions
      ];
      return va.length > 0 ? (T("ready", A.targets), {
        status: "ready",
        workflowContext: I,
        itemUseContext: A,
        actions: va,
        summaryLines: La
      }) : (T("completed-without-actions", A.targets), {
        status: "completed-without-actions",
        workflowContext: I,
        itemUseContext: A,
        summaryLines: La
      });
    }
    const M = await this.workflow.runAutomation(Ve, {
      sourceActor: A.actor,
      sourceToken: A.token,
      item: A.item,
      targets: A.targets,
      flags: {
        itemUse: {
          source: A.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: c.variant,
          spendResource: c.spendResource
        }
      }
    });
    if (!M.ok)
      return T("failed", A.targets, {
        reason: M.error.reason,
        message: M.error.message
      }), {
        status: "failed",
        reason: M.error.reason,
        message: M.error.message,
        cause: M.error
      };
    const ae = M.value.context, F = yk(
      n,
      A,
      ae,
      k
    ), Z = mi(
      n,
      A
    ), Uc = di(
      A.actor,
      G,
      u,
      a
    ), Sa = fi(
      n,
      c,
      u,
      a,
      ae,
      A,
      G
    );
    if (!F.ok)
      return T("failed", A.targets, {
        reason: F.reason,
        message: F.message
      }), {
        status: "failed",
        reason: F.reason,
        message: F.message
      };
    if (!Z.ok)
      return T("failed", A.targets, {
        reason: Z.reason,
        message: Z.message
      }), {
        status: "failed",
        reason: Z.reason,
        message: Z.message
      };
    const Ca = [
      ...Uc,
      ...F.actions,
      ...Z.actions
    ];
    return Ca.length === 0 ? (T("completed-without-actions", A.targets), {
      status: "completed-without-actions",
      workflowContext: ae,
      itemUseContext: A,
      summaryLines: Sa
    }) : (T("ready", A.targets), {
      status: "ready",
      workflowContext: ae,
      itemUseContext: A,
      actions: Ca,
      summaryLines: Sa
    });
  }
  async applyAction(t) {
    return Ot(
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
function ok(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function ik(e, t) {
  return {
    ...e,
    targets: t
  };
}
function sk(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || ya(l) && (!a.includeCostSteps || !s))
      continue;
    const c = ck(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && ow(n.extraCost) && o.push({
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
async function lk(e, t, n, r, a) {
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
function ck(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = uk(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function uk(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function dk(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function mk(e, t, n) {
  const a = fk(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function fk(e, t) {
  const n = Ue(e, t);
  return n ? cT(n.amount) : null;
}
function di(e, t, n, r) {
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
function mi(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = ba(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = As(o);
      n.push(
        pk(
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
function pk(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? bk(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: gk(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: hk(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function gk(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function hk(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function bk(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function yk(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || Ak(s, r)) continue;
    const l = xt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = ba(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (_k(s)) {
        Tk(
          o,
          u,
          Rk(s, n, l.value)
        );
        continue;
      }
      a.push(wk(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...kk(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function Ak(e, t) {
  const n = Xl(e.amountFrom);
  return n !== null && t.has(n);
}
function _k(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Tk(e, t, n) {
  const r = Sk(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Rk(e, t, n) {
  const r = Xl(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function kk(e, t, n, r) {
  const a = Dk(e), o = a.length > 1 ? xk() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const h = Nk(u.amount, s);
        return {
          id: $k(u, s, m),
          amount: h,
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
      label: Ek(c, s, a.length > 1),
      executedLabel: Ik(
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
function wk(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = vk(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Ck(e, r, n),
    executedLabel: Lk(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function $k(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Ek(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Ik(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Sk(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Xl(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Ck(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Lk(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function vk(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Dk(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Nk(e, t) {
  const n = e * t.multiplier, r = Pk(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Pk(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function xk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ba(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function fi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${ga(t.variant)}`,
    Bk(t, n, r),
    ...Fk(s),
    ...Object.values(a.rolls).flatMap(Uk),
    ...Ok(e, o),
    ...zk(e.resistance),
    ...Wk(n)
  ];
}
function Ok(e, t) {
  return Mk(e) ? ba("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Mk(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Fk(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Bk(e, t, n) {
  const r = Ue(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Uk(e) {
  const n = [`${Kk(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = qk(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${uT(e.damageType)}`), n;
}
function zk(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function qk(e) {
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
    const s = Gk(o);
    s && (Hk(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Gk(e) {
  const t = jk(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Vk(e);
}
function jk(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Vk(e) {
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
function Hk(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Wk(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Kk(e) {
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
function Yk(e, t, n, r) {
  return Ql.map((a) => {
    const o = Jl(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? ga(a),
      enabled: s,
      details: o ? Qk(o, n) : [],
      finalCostText: o ? Zk(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Qk(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  a.length > 0 ? r.push(a.join(", ")) : r.push("efeito manual");
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
function Zk(e, t) {
  const n = Ue(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Xk(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(ya);
}
function Jk(e, t) {
  return Fl({
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
function ew(e, t, n, r) {
  return Jl(e, t, n, r) ?? ha;
}
function Jl(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? nw(t, n) ? tw(n) : null : n === "base" ? ha : null);
}
function tw(e) {
  switch (e) {
    case "base":
      return ha;
    case "discente":
      return nk;
    case "verdadeiro":
      return rk;
  }
}
function nw(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return rw(foundry.utils.getProperty(e, n));
}
function rw(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function aw(e) {
  return e.steps.some(ya);
}
function ya(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function ow(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const ec = "itemUsePrompts", tc = "chatCard", ln = "data-paranormal-toolkit-prompt-id", cn = "data-paranormal-toolkit-pending-id", Aa = "data-paranormal-toolkit-executed-label", Ar = "data-paranormal-toolkit-choice-group", nc = "data-paranormal-toolkit-skipped-label", Ut = "data-paranormal-toolkit-action-section", pi = "data-paranormal-toolkit-detail-key", gi = "data-paranormal-toolkit-roll-card", _a = "data-paranormal-toolkit-roll-detail-toggle", rc = "data-paranormal-toolkit-roll-detail-id", ac = "data-paranormal-toolkit-resistance-roll-button", oc = "data-paranormal-toolkit-resistance-skill", ic = "data-paranormal-toolkit-resistance-skill-label", sc = "data-paranormal-toolkit-resistance-target-actor-id", lc = "data-paranormal-toolkit-resistance-target-name", cc = "data-paranormal-toolkit-resistance-roll-result", hi = "data-paranormal-toolkit-system-card-replaced", iw = `[${cn}]`, sw = `[${_a}]`, lw = `[${ac}]`, _r = `${d}-chat-enrichment`, g = `${d}-item-use-prompt`, cw = `${g}__actions`, bi = `${g}__details`, uc = `${g}__summary`, uw = `${g}__title`, dc = `${g}__button--executed`, Rt = `${g}__roll-card`, dw = "data-paranormal-toolkit-roll-card-target-mode", mw = "data-paranormal-toolkit-roll-card-target-names", fw = "data-paranormal-toolkit-roll-card-resistance", pw = "data-paranormal-toolkit-roll-card-resistance-skill", gw = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let yi = !1, Tr = null;
const q = /* @__PURE__ */ new Map(), hw = [0, 100, 500, 1500, 3e3], bw = 3e4, yw = [0, 100, 500, 1500, 3e3];
function Aw(e) {
  if (Tr = e, yi) {
    _i(e);
    return;
  }
  const t = (n, r) => {
    fc(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), yi = !0, _i(e);
}
async function Ai(e) {
  const t = mc(e);
  q.set(e.pendingId, t), await ka(t) || $c(t), pc(e.pendingId);
}
async function _w(e) {
  const t = mc({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", q.set(e.pendingId, t), await ka(t) || $c(t), pc(e.pendingId);
}
async function Dn(e, t) {
  const n = q.get(e);
  q.delete(e), n && await w$(n, t);
}
function Ta(e) {
  const t = vc();
  for (const n of t) {
    const r = Q(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Tw(e, t) {
  const n = Ta(e);
  if (!n) return;
  const r = Q(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await ze(n.message, r));
}
async function Rw(e, t, n) {
  if (!t) return;
  const r = Ta(e);
  if (!r) return;
  const a = Q(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await ze(r.message, a);
}
function mc(e) {
  const t = re(e.context.message), n = e.context.targets.find((s) => $r(s)), r = n ? $r(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Qw(e.context),
    executed: !1
  };
}
function fc(e, t, n) {
  k$();
  const r = dn(t);
  if (!r) return;
  const a = _$(e, r);
  a.length > 0 && zt(r);
  for (const o of a)
    Rr(r, o);
  Ac(r, n), kr(r), wr(r);
}
function _i(e) {
  for (const t of yw)
    globalThis.setTimeout(() => {
      kw(e);
    }, t);
}
function kw(e) {
  for (const t of ww()) {
    const n = un(t);
    $w(n) && fc(n, t, e);
  }
}
function ww() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function $w(e) {
  return e ? wa(e) ? !0 : E$(e).length > 0 : !1;
}
function pc(e) {
  const t = q.get(e);
  if (!t) return;
  const n = t.messageId ? T$(t.messageId) : null;
  if (n) {
    $i(n, t), zt(n), Rr(n, t), Ti(n), kr(n), wr(n);
    return;
  }
  if (t.messageId) {
    Ir(t);
    return;
  }
  const r = R$(t);
  if (r) {
    $i(r, t), zt(r), Rr(r, t), Ti(r), kr(r), wr(r);
    return;
  }
  Ir(t);
}
function Ti(e) {
  Tr && Ac(e, Tr);
}
function zt(e) {
  const t = Ew();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const n = yc(e);
  if (!n || (n.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || n.getAttribute(hi) === "true") return;
  const r = n.querySelector(`.${_r}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(hi, "true");
}
function Ew() {
  try {
    return ns() === "replace";
  } catch {
    return !1;
  }
}
function Rr(e, t) {
  if (zt(e), e.querySelector(`[${ln}="${qe(t.pendingId)}"]`)) return;
  const n = Sw(e, t);
  Lw(n, t);
  const r = Hw(t);
  if (Iw(r)) return;
  Vw(n, r).append(Yw(t));
}
function Iw(e) {
  return hc(e.id) && !pe();
}
function gc(e) {
  const n = e.closest(`[${Ut}]`)?.getAttribute(Ut) ?? null;
  return hc(n) && !pe();
}
function hc(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Sw(e, t) {
  const n = e.querySelector(`.${_r}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(_r, g);
  const a = document.createElement("header");
  a.classList.add(`${g}__header`);
  const o = document.createElement("span");
  o.classList.add(`${g}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(uw), s.textContent = Cw(t);
  const l = document.createElement("span");
  return l.classList.add(uc), l.textContent = t.summary, a.append(o, s, l), r.append(a), Xw(e).append(r), r;
}
function Cw(e) {
  const t = D(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Lw(e, t) {
  const n = t.summaryLines ?? [], r = kc(n, t);
  if (r) {
    vw(e, r, t);
    return;
  }
  Ww(e, n);
}
function vw(e, t, n) {
  if (e.querySelector(`[${gi}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(
    Rt,
    `${Rt}--${t.intent}`,
    `${Rt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && r.classList.add(`${Rt}--multi-target`), r.setAttribute(gi, "true"), r.setAttribute(dw, t.targetMode), r.setAttribute(mw, JSON.stringify(t.targetNames)), Uw(r, t), t.castingCheck && Ri(r, Nw(t.castingCheck), n.pendingId, "casting"), Dw(t) && Ri(r, Pw(t), n.pendingId, "effect"), Bw(r, t), zw(r, t, n), jw(r, t), e.append(r);
}
function Dw(e) {
  return e.intent !== "casting";
}
function Nw(e) {
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
function Pw(e) {
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
function Ri(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(
    `${g}__workflow-section`,
    `${g}__workflow-section--${t.kind}`
  ), t.status && a.classList.add(`${g}__workflow-section--${t.status}`);
  const o = document.createElement("div");
  o.classList.add(`${g}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, o.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${g}__workflow-section-status`), l.textContent = t.statusLabel, o.append(l);
  }
  if (a.append(o), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${g}__workflow-section-description`), l.textContent = t.description, a.append(l);
  }
  xw(a, t), Gw(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function xw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${g}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${g}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = Ow(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function Ow(e, t) {
  const n = Mw(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-dice-tray`);
  for (const a of Fw(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${g}__workflow-die`), a.active || o.classList.add(`${g}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Mw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Fw(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ki(e, "highest") : n.includes("kl") ? ki(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ki(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Bw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(j$);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${g}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function Uw(e, t) {
  t.resistance && (e.setAttribute(fw, t.resistance), t.resistanceSkill && e.setAttribute(pw, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(gw, t.resistanceSkillLabel));
}
function zw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const r = document.createElement("div");
  r.classList.add(`${g}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${g}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = qw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${g}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(bc(t.resistanceRollResult)), e.append(r);
}
function qw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !be())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${g}__resistance-roll-button`), n.setAttribute(ln, t.pendingId), n.setAttribute(ac, "true"), n.setAttribute(oc, e.resistanceSkill), n.setAttribute(ic, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(sc, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(lc, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${g}__resistance-roll-button--rolled`), n.setAttribute(cc, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${g}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function bc(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = Tc(e), t;
}
function Gw(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${g}__roll-detail-toggle`), l.setAttribute(_a, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${g}__roll-detail-list`), c.setAttribute(rc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const h = document.createElement("dd");
    h.textContent = u.value, c.append(m, h);
  }
  e.append(l, c);
}
function jw(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function Vw(e, t) {
  const n = `[${Ut}="${qe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(cw), a.setAttribute(Ut, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${g}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Hw(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = kc(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Ww(e, t) {
  if (t.length === 0) return;
  const n = Kw(e);
  for (const r of t) {
    const a = V$(r);
    if (n.querySelector(`[${pi}="${qe(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(pi, a), n.append(o);
  }
}
function Kw(e) {
  const t = e.querySelector(`.${bi}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(bi), e.append(n), n;
}
function Yw(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(ln, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(dc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(cn, e.pendingId), t.setAttribute(Aa, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ar, e.choiceGroupId), t.setAttribute(nc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Qw(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Zw(e);
  return `${t} → ${n}`;
}
function Zw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Xw(e) {
  return yc(e) ?? e;
}
function yc(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Ac(e, t) {
  const n = dn(e);
  if (!n) return;
  const r = n.querySelectorAll(iw);
  for (const a of r) {
    if (gc(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      m$(a, t);
    }));
  }
}
function kr(e) {
  const t = dn(e);
  if (!t) return;
  const n = t.querySelectorAll(sw);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Jw(t, r);
    }));
}
function wr(e) {
  const t = dn(e);
  if (!t) return;
  const n = t.querySelectorAll(lw);
  for (const r of n) {
    if (!be()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      e$(t, r);
    }));
  }
}
function Jw(e, t) {
  const n = t.getAttribute(_a);
  if (!n) return;
  const r = e.querySelector(`[${rc}="${qe(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function e$(e, t) {
  if (!be()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(ln), r = t.getAttribute(oc), a = t.getAttribute(ic) ?? (r ? fe(r) : "Resistência");
  if (!n || !r) return;
  const o = r$(e, n), s = a$(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await qm(s, r);
    await c$(c.roll);
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
    t$(t, u), n$(t, u), u$(n, u), await d$(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function t$(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(cc, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function n$(e, t) {
  const n = e.closest(`.${g}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${g}__resistance-roll-result`), a = r ?? bc(t);
  if (r) {
    r.textContent = Tc(t);
    return;
  }
  n.append(a);
}
function r$(e, t) {
  const n = q.get(t);
  if (n) return n;
  const r = un(e);
  return Q(r)[t] ?? null;
}
function a$(e, t) {
  const n = e?.resistanceTargetActor;
  if (W(n)) return n;
  const a = e?.context?.targets.map($r).find(W) ?? null;
  if (a) return a;
  const o = t.getAttribute(sc) ?? e?.resistanceTargetActorId ?? null, s = o ? i$(o) : null;
  return s || s$(
    t.getAttribute(lc) ?? e?.resistanceTargetName ?? o$(t)
  );
}
function o$(e) {
  const n = e.closest(`.${g}`)?.querySelector(`.${uc}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function $r(e) {
  const t = e.actor;
  if (W(t)) return t;
  const n = e.token, r = it(n);
  if (r) return r;
  const a = e.document;
  return it(a);
}
function it(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (W(t)) return t;
  const n = e.document?.actor;
  return W(n) ? n : null;
}
function i$(e) {
  const n = game.actors?.get?.(e);
  return W(n) ? n : _c().map((o) => it(o)).find((o) => o?.id === e) ?? null;
}
function s$(e) {
  const t = Ce(e);
  if (!t) return null;
  const n = _c().filter((o) => Ce(l$(o)) === t).map((o) => it(o)).find(W) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => W(o) && Ce(o.name) === t);
  return W(a) ? a : null;
}
function _c() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function l$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : it(e)?.name ?? null;
}
function Ce(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function W(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Tc(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function c$(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function u$(e, t) {
  const n = q.get(e);
  n && (n.resistanceRollResult = t);
}
async function d$(e, t, n) {
  const r = un(e);
  if (r)
    try {
      const a = Q(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await ze(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function un(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return Y(r?.get?.(n));
}
async function m$(e, t) {
  if (gc(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(cn);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Rc(e, e.getAttribute(Aa) ?? "✓ Automação aplicada"), f$(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Rc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(dc), e.removeAttribute(cn), e.removeAttribute(Aa);
}
function f$(e) {
  const t = e.getAttribute(Ar);
  if (!t) return;
  const n = e.closest(`.${g}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Ar}="${qe(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(nc) ?? "✓ Outra opção escolhida";
    Rc(a, o);
  }
}
function kc(e, t) {
  const n = e.map(Ra).filter(q$), r = n.find((w) => w.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = D(e, "Forma"), o = D(e, "Custo"), s = D(e, "Dados") ?? D(e, `Dados (${r.label})`), l = D(e, "Tipo"), c = D(e, "Resistência"), u = D(e, "Resistência Perícia"), m = D(e, "Resistência Rótulo") ?? (u ? fe(u) : null), h = wc(e, "Observação"), k = e.filter((w) => A$(w, r)), _ = b$(e), T = p$(t);
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
    targetMode: T.mode,
    targetNames: T.names,
    notes: h,
    details: k,
    castingCheck: _,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function p$(e) {
  const t = g$(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function g$(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && h$(n) !== "nenhum alvo") : [];
}
function h$(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function b$(e) {
  const t = e.map(Ra).find((o) => o?.intent === "casting") ?? null, n = D(e, "Conjuração DT"), r = D(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: D(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: D(e, "Dados (Conjuração)")
  } : null;
}
function Ra(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: y$(n)
  } : null;
}
function y$(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function D(e, t) {
  return wc(e, t)[0] ?? null;
}
function wc(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function A$(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Ra(e) ? !1 : e.trim().length > 0;
}
function _$(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of q.values())
    Er(r, e, t) && n.set(r.pendingId, r);
  for (const r of $$(e))
    Er(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Er(e, t, n) {
  const r = re(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !wi(n, "itemId", e.itemId) ? !1 : !e.actorId || wi(n, "actorId", e.actorId);
}
function wi(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${H$(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function T$(e) {
  const t = qe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function R$(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Er(e, null, t))
      return t;
  return null;
}
function k$() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of q.entries())
    e - r.createdAt > t && q.delete(n);
}
async function $i(e, t) {
  const n = un(e);
  if (!n) return !1;
  try {
    const r = Q(n);
    return r[t.pendingId] = $a(t, re(n)), await ze(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function ka(e) {
  const t = Sc(e);
  if (!t) return !1;
  try {
    const n = Q(t);
    return n[e.pendingId] = $a(e, re(t)), await ze(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function $c(e) {
  for (const t of hw)
    globalThis.setTimeout(() => {
      Ir(e);
    }, t);
}
async function Ir(e) {
  const t = Sc(e);
  if (wa(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await ka(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function w$(e, t) {
  const n = Ic(e.context.message);
  if (n)
    try {
      const r = Q(n), a = r[e.pendingId] ?? $a(e, re(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await ze(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function $$(e) {
  return Object.values(Q(Y(e))).filter(mt);
}
function Q(e) {
  if (!e) return {};
  const t = {}, n = wa(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(Ec(e)))
    t[r] ??= a;
  return t;
}
function E$(e) {
  return Object.values(Ec(Y(e))).filter(mt);
}
function Ec(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, ec);
  if (!xe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    mt(a) && (n[r] = a);
  return n;
}
async function ze(e, t) {
  typeof e.setFlag == "function" && (await S$(e, t), await I$(e, t));
}
async function I$(e, t) {
  await Promise.resolve(e.setFlag?.(d, ec, t));
}
function wa(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, tc);
  return U$(t) ? t : null;
}
async function S$(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(mt).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? re(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: C$(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, tc, a));
}
function C$(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function $a(e, t) {
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
function Ic(e) {
  const t = Y(e);
  if (t?.setFlag)
    return t;
  const n = L$(e);
  if (n?.setFlag)
    return n;
  const r = re(e);
  if (!r) return null;
  const a = game.messages;
  return Y(a?.get?.(r));
}
function L$(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(Y).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Sc(e) {
  const t = Ic(e.context.message);
  if (t) return t;
  const n = e.messageId ? v$(e.messageId) : null;
  if (n) return n;
  const r = vc().slice().reverse();
  return r.find((a) => D$(a, e)) ?? r.find((a) => N$(a, e)) ?? null;
}
function v$(e) {
  const t = game.messages;
  return Y(t?.get?.(e));
}
function D$(e, t) {
  const n = re(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Cc(e, t)) return !1;
  const a = Lc(e);
  return !t.actorId || !a || a === t.actorId;
}
function N$(e, t) {
  if (!x$(e, t)) return !1;
  const n = Lc(e);
  return t.actorId && n === t.actorId ? !0 : Cc(e, t);
}
function Cc(e, t) {
  const n = Ce(P$(e));
  if (!n) return !1;
  const r = Ce(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Ce(t.itemId);
  return !!(a && n.includes(a));
}
function P$(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Lc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function x$(e, t) {
  const n = O$(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= bw;
}
function O$(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function Y(e) {
  return e && typeof e == "object" ? e : null;
}
function mt(e) {
  return xe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && ce(e.resistanceTargetActorId) && ce(e.resistanceTargetName) && z$(e.resistanceRollResult) && M$(e.actionPayload) && Nn(e.title) && Nn(e.buttonLabel) && Nn(e.executedLabel) && ce(e.choiceGroupId) && ce(e.skippedLabel) && ce(e.actionSectionId) && ce(e.actionSectionTitle) && G$(e.summaryLines) : !1;
}
function M$(e) {
  return e == null ? !0 : xe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && F$(e.resource) && B$(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function F$(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function B$(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function U$(e) {
  return xe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && xe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(mt) : !1;
}
function z$(e) {
  return e == null ? !0 : xe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ce(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function q$(e) {
  return e !== null;
}
function xe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function P(e) {
  return e === null || typeof e == "string";
}
function Nn(e) {
  return e === void 0 || typeof e == "string";
}
function ce(e) {
  return e == null || typeof e == "string";
}
function G$(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function j$(e) {
  return typeof e == "string" && e.length > 0;
}
function vc() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(Y).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(Y).filter((r) => r !== null) : [];
}
function dn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function re(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function V$(e) {
  return e.trim().toLowerCase();
}
function H$(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function qe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ei = 1e3;
class W$ {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new ak(
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
      settings: qn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = qn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Sr(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && eE(t.item) && n.executionMode === "ask") {
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
    if (await Ko(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: On(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = Y$(
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
      return this.pendingExecutions.delete(t), await Dn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Dn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Ta(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = rE(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Ot(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await Tw(t), await Rw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Aw(
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
    if (await Ko(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: On(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      tE(t.item),
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
          we(a.workflowContext)
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
      if (!pe())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (J$(n, a.value), await zs(a.value), {
        ok: !0,
        executedLabel: K$(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!pe())
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
    const n = Pn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && Pn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Dn(
        a,
        Ii(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Mn();
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
      const l = Mn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Ai({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Pn(s),
        skippedLabel: Ii(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: nE(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      we(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Mn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ai({
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
      we(a.value.context)
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
    const n = Date.now(), r = Si(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > Ei && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= Ei;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Si(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = On(
      t,
      n,
      r,
      a
    );
  }
}
function K$(e) {
  return qs({ inputAmount: e.totalRawDamage });
}
function Y$(e, t) {
  if (t.resistance || !Q$(t))
    return t;
  const n = jl(e);
  return n ? { ...t, resistance: n } : t;
}
function Q$(e) {
  return Z$(e) && !X$(e);
}
function Z$(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function X$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Pn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Ii(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function J$(e, t) {
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
function eE(e) {
  return e.type === "ritual";
}
function tE(e) {
  return Q_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function nE(e) {
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
function rE(e) {
  const t = e.actorUuid ? aE(e.actorUuid) : null;
  if (Oe(t)) return t;
  const n = e.actorId ? oE(e.actorId) : null;
  return n || iE(e.actorName);
}
function aE(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function oE(e) {
  const n = game.actors?.get?.(e);
  if (Oe(n)) return n;
  for (const r of Dc()) {
    const a = Ea(r);
    if (a?.id === e) return a;
  }
  return null;
}
function iE(e) {
  const t = xn(e);
  if (!t) return null;
  for (const a of Dc()) {
    const o = sE(a);
    if (xn(o) === t) {
      const s = Ea(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Oe(a) && xn(a.name) === t
  );
  return Oe(r) ? r : null;
}
function Dc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function sE(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ea(e)?.name ?? null;
}
function Ea(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Oe(t)) return t;
  const n = e.document?.actor;
  return Oe(n) ? n : null;
}
function xn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Oe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function On(e, t, n, r) {
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
function Si(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Mn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class lE {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = ct(t);
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
class cE {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ct(t).map((l) => this.analyzeRitual(l)), r = n.filter(kt("upToDate")), a = n.filter(kt("available")), o = n.filter(kt("outdated")), s = n.filter(kt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = uE(t);
    return n ? r ? r.source.type !== "preset" ? We({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? We({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : We({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: dE(r, n.preset)
    }) : We({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : We({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function We(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? jt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function uE(e) {
  const t = e.getFlag(d, "automation");
  return Cr(t) ? t : null;
}
function dE(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function kt(e) {
  return (t) => t.status === e;
}
class mE {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = vr(t.transaction);
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
    const n = wt(t.actorName), r = wt(t.resource), a = wt(fE(t)), o = wt(pE(t));
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
function fE(e) {
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
function pE(e) {
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
function wt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function gE() {
  const e = new wA(), t = new A_(e), n = new bs(new hs()), r = new ys(new zr()), a = new __(new Nl()), o = new IA(), s = new qA(o), l = new WA(e), c = new YA(), u = c.registerMany(
    Lu()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new KA(), h = new VA(), k = Es(), _ = new Ts(k), T = new cE(
    c
  ), w = new lE(
    T,
    m,
    h
  ), A = new w_(), je = new mE(A), G = new k_(), Ve = new y_(), M = new h_(
    t,
    s,
    je,
    G
  ), ae = new R_(M, G), F = new W$(
    ae,
    t,
    s,
    n,
    _,
    A,
    Ve
  );
  return F.addStrategy(
    new ss(
      (Z) => F.handleItemUsed(Z)
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
    itemPatches: h,
    conditionRegistry: k,
    conditions: _,
    debugOutput: A,
    chatMessages: je,
    workflowHooks: G,
    ritualEvents: Ve,
    automation: M,
    workflow: ae,
    itemUseIntegration: F,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: w
  };
}
const { ApplicationV2: hE } = foundry.applications.api;
class qt extends hE {
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
      apply: qt.onApply,
      cancel: qt.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${V(Fi)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${V(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Fn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Fn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Fn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Fn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${V(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? bE(n) : AE(t)}
    </section>
  `;
}
function bE(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(yE).join("")}</ol>`;
}
function yE(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${V(e.appliedPresetId)} v${V(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${V(e.itemName)}</strong>
        <span>${V(e.reason)}</span>
        ${r}
      </div>
      <em>${V(n)}</em>
    </li>
  `;
}
function AE(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${V({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function V(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Gt = `${d}.manageRitualPresets`, Ci = `__${d}_ritualPresetHeaderControlRegistered`, _E = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function TE(e) {
  const t = globalThis;
  if (!t[Ci]) {
    for (const n of _E)
      Hooks.on(n, (r, a) => {
        RE(r, a, e);
      });
    t[Ci] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function RE(e, t, n) {
  Array.isArray(t) && wE(e) && (kE(e, n), !t.some((r) => r.action === Gt) && t.push({
    action: Gt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Nc(e, n);
    }
  }));
}
function kE(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Gt] && (e.options.actions[Gt] = (n) => {
    n.preventDefault(), n.stopPropagation(), Nc(e, t);
  }));
}
function wE(e) {
  if (!game.user?.isGM) return !1;
  const t = Pc(e);
  return t ? t.type === "agent" && ct(t).length > 0 : !1;
}
function Nc(e, t) {
  const n = Pc(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new qt(n, t).render({ force: !0 });
}
function Pc(e) {
  return Li(e.actor) ? e.actor : Li(e.document) ? e.document : null;
}
function Li(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const xc = "data-paranormal-toolkit-ritual-roll-config", ft = "data-paranormal-toolkit-ritual-roll-field", ge = "data-paranormal-toolkit-ritual-roll-action", vi = `__${d}_ritualRollConfigBlockRegistered`, $E = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], EE = [
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
function IE() {
  const e = globalThis;
  if (!e[vi]) {
    SE();
    for (const t of $E)
      Hooks.on(t, (...n) => {
        CE(n[0], n[1]);
      });
    e[vi] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function SE() {
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
function CE(e, t) {
  const n = GE(e);
  if (!n || n.type !== "ritual") return;
  const r = HE(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  vE(a);
  const o = Mc(n), s = Gl(n), l = jE(n), c = DE(n, s, o, l);
  FE(c, n, o, l), LE(a, c), Ia(c);
}
function LE(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function vE(e) {
  for (const t of Array.from(e.querySelectorAll(`[${xc}]`)))
    t.remove();
}
function DE(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(xc, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(Di("strong", "Paranormal Toolkit")), s.append(Di("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Bc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(NE(t, r)), u.append(PE(t, r)), u.append(xE(t, r)), a.append(u), a.append(OE(t, n, r)), a.append(ME(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function NE(e, t) {
  const n = mn("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(ft, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = Y_(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function PE(e, t) {
  const n = mn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(ft, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of EE) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function xE(e, t) {
  const n = mn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(ft, "utilityLabel"), n.append(r), n;
}
function OE(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(Bn("base", "Padrão", e.forms.base.formula, !0, n)), o.append(Bn("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(Bn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function Bn(e, t, n, r, a) {
  const o = mn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(ft, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function ME(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ge, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ge, "clear"), t.append(n, r), t;
}
function mn(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Di(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function FE(e, t, n, r) {
  Ge(e, "intent")?.addEventListener("change", () => Ia(e)), xi(e, "system.studentForm")?.addEventListener("change", () => Ni(e, t)), xi(e, "system.trueForm")?.addEventListener("change", () => Ni(e, t)), e.querySelector(`[${ge}="save"]`)?.addEventListener("click", () => {
    r && BE(e, t, n);
  }), e.querySelector(`[${ge}="clear"]`)?.addEventListener("click", () => {
    r && UE(e, t);
  });
}
async function BE(e, t, n) {
  const r = e.querySelector(`[${ge}="save"]`);
  r?.setAttribute("disabled", "true"), Le(e, "Salvando configuração...");
  try {
    const a = zE(e, n);
    await W_(t, a), Oc(e, a), Le(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Le(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function UE(e, t) {
  const n = e.querySelector(`[${ge}="clear"]`);
  n?.setAttribute("disabled", "true"), Le(e, "Limpando configuração...");
  try {
    await K_(t);
    const r = Gl(t);
    qE(e, r), Oc(e, r), Le(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Le(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Oc(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Bc(t) ? "Configurada" : "Rascunho");
}
function zE(e, t) {
  return {
    schemaVersion: 1,
    intent: Fc(Ge(e, "intent")?.value),
    damageType: Oi(e, "damageType"),
    utilityLabel: Oi(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: vt(e, "formula.base") },
      discente: { formula: vt(e, "formula.discente") },
      verdadeiro: { formula: vt(e, "formula.verdadeiro") }
    }
  };
}
function qE(e, t) {
  Re(e, "intent", t.intent), Re(e, "damageType", t.damageType ?? ""), Re(e, "utilityLabel", t.utilityLabel ?? "Resultado"), Re(e, "formula.base", t.forms.base.formula), Re(e, "formula.discente", t.forms.discente.formula), Re(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Ia(e);
}
function Ia(e) {
  const t = Fc(Ge(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Ni(e, t) {
  const n = Mc(t);
  Pi(e, "discente", n.discente), Pi(e, "verdadeiro", n.verdadeiro);
}
function Pi(e, t, n) {
  const r = Ge(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${ge}="save"]`)?.disabled;
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
function Le(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Mc(e) {
  const t = VE(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function GE(e) {
  return Mi(e.item) ? e.item : Mi(e.document) ? e.document : null;
}
function jE(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function VE(e) {
  const t = e.system;
  return WE(t) ? t : {};
}
function xi(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ge(e, t) {
  return e.querySelector(`[${ft}="${KE(t)}"]`);
}
function vt(e, t) {
  return Ge(e, t)?.value.trim() ?? "";
}
function Oi(e, t) {
  const n = vt(e, t);
  return n.length > 0 ? n : null;
}
function Re(e, t, n) {
  const r = Ge(e, t);
  r && (r.value = n);
}
function Fc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Bc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function HE(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Mi(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function WE(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function KE(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let j = null;
Hooks.once("init", () => {
  Eu(), ad(), am(), dA(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!za.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${za.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  j = gE(), j.itemUseIntegration.registerStrategies(), Kd(j.resources, j.resourceAdapter), em(j.conditions), hd(j), bA(), TE(j), IE(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function YE() {
  if (!j)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return j;
}
export {
  YE as getToolkitServices
};
//# sourceMappingURL=main.js.map
