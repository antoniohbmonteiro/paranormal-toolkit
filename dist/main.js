const d = "paranormal-toolkit", Gi = "Paranormal Toolkit", Hc = "ordemparanormal";
class st {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Vt(e) {
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
  const t = Lr(e);
  return t.ok ? b(t.value.definition) : t;
}
function Lr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : vr(t) ? b(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Wc(e) {
  return vr(e.getFlag(d, "automation"));
}
function vr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Yc(t.source) && Kc(t.definition);
}
function Kc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Qc) && (t.ritualForms === void 0 || nu(t.ritualForms)) && (t.conditionApplications === void 0 || su(t.conditionApplications));
}
function Yc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Qc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Zc(t);
    case "spendRitualCost":
      return Xc(t);
    case "rollFormula":
      return Jc(t);
    case "modifyResource":
      return eu(t);
    case "chatCard":
      return tu(t);
    default:
      return !1;
  }
}
function Zc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ji(t);
}
function Xc(e) {
  return e.type === "spendRitualCost";
}
function Jc(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || pu(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function eu(e) {
  const t = e;
  return t.type === "modifyResource" && Vi(t.actor) && mu(t.resource) && fu(t.operation) && ji(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function tu(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function nu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && ru(a)
  );
}
function ru(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || R(t.label)) && (t.extraCost === void 0 || hu(t.extraCost)) && (t.rollFormulaOverrides === void 0 || yu(t.rollFormulaOverrides)) && (t.notes === void 0 || bu(t.notes)) && (t.targeting === void 0 || au(t.targeting));
}
function au(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return iu(t.mode) && R(t.label) && (t.optionLabel === void 0 || R(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || ou(t.template));
}
function ou(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || xa(t.distance)) && (t.width === void 0 || t.width === null || xa(t.width));
}
function iu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function su(e) {
  return Array.isArray(e) && e.every(lu);
}
function lu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Vi(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || uu(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel)) && (t.applyOnResistance === void 0 || cu(t.applyOnResistance));
}
function cu(e) {
  return e === "failure" || e === "success" || e === "always";
}
function uu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || gu(t.rounds)) && (t.expiry === void 0 || t.expiry === null || du(t.expiry));
}
function du(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ji(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Vi(e) {
  return e === "self" || e === "target";
}
function mu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function fu(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function pu(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function gu(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function hu(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function xa(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function bu(e) {
  return Array.isArray(e) && e.every(R);
}
function yu(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => R(t) && R(n)
  );
}
function Dr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Oa);
    if (Tu(t))
      return Array.from(t).filter(Oa);
  }
  return [];
}
function Au(e) {
  return Dr(e)[0] ?? null;
}
function _u(e) {
  return Dr(e).find(Wc) ?? null;
}
function Tu(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Oa(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ct(e) {
  return Dr(e).filter((t) => t.type === "ritual");
}
function Hi(e) {
  return ct(e)[0] ?? null;
}
function Ru(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Vt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Ke("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = pt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Ba);
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
      const o = await zn(e, r, a.value);
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
      const a = await zn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Ba(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ma(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ma(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Ke("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = pt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Ma(e) {
  const t = Ke("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ct(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Fa(t);
  const r = Fa(t, n.length);
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
    const s = await zn(e, a, o.preset);
    r.applied.push(ku(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), wu(r), r;
}
async function zn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ku(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Vt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Fa(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function wu(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Ba(e) {
  return {
    preset: Vt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Ke(e) {
  const t = st.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function pt(e) {
  const t = Hi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function we(e) {
  return e ? {
    id: e.id,
    source: {
      ...$u(e.sourceActor),
      token: e.sourceToken
    },
    item: Eu(e.item),
    targets: e.targets.map(Su),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Ua(e.rollRequests, Wi),
    rolls: Ua(e.rolls, Cu),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Nr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Nr(e) {
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
function $u(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Eu(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Su(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Wi(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Cu(e) {
  return {
    ...Wi(e),
    total: e.total
  };
}
function Ua(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Iu(e) {
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
    Lu(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, Nr(o));
}
function oe(e) {
  const t = st.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Lu(e) {
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
function vu() {
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
function qn() {
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
function Du() {
  return {
    status() {
      return qn();
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
const Ki = "ritual.costOnly", Yi = "ritual.simpleHealing", Nu = "ritual.eletrocussao", Pu = "ritual.definhar", Qi = "ritual.simpleDamage", Zi = "generic.simpleHealing", Xi = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, Pr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function xu() {
  return [
    Ou(),
    Mu(),
    Fu(),
    Bu(),
    Uu(),
    zu()
  ];
}
function Ou() {
  return {
    id: Ki,
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
function Mu() {
  return {
    id: Yi,
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
    automation: Ji(),
    itemPatch: Vu()
  };
}
function Fu() {
  return {
    id: Nu,
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
    automation: Gu(),
    itemPatch: Wu()
  };
}
function Bu() {
  return {
    id: Pu,
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
    automation: ju(),
    itemPatch: Hu()
  };
}
function Uu() {
  return {
    id: Qi,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: xr()
  };
}
function zu() {
  return {
    id: Zi,
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
function Ji(e = Xi) {
  const t = qu(e);
  return es(
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
function qu(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Xi,
    ...e
  };
}
function Gu() {
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
function ju() {
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
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return es(
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
function Vu() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Pr,
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
function Hu() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: Pr,
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
function Wu() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Pr,
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
function es(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Or() {
  return Array.from(game.user?.targets ?? []).map(ts);
}
function ts(e) {
  return {
    tokenId: $e(e.id),
    actorId: $e(e.actor?.id),
    sceneId: $e(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function ns() {
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
function Ku(e) {
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
        if (!Zu(t, n)) {
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
      const r = e.automationRegistry.require(Ki);
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
      if (!za(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Yi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Ji(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = ie("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = se(n);
      if (!r) return;
      if (!za(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Qi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: xr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ie("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = se(t);
      n && await Yu(e, t, n);
    }
  };
}
async function Yu(e, t, n) {
  const r = lt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ns(),
    item: n,
    targets: Or()
  });
  if (!a.ok) {
    Qu(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", we(a.value.context));
}
function Qu(e) {
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
  const t = Hi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Zu(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function za(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Xu = ["strict", "open"], rs = "strict";
function Ju(e) {
  return Xu.includes(e) ? e : rs;
}
function ed(e) {
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
function Ht(e, t) {
  return e === "strict" && t.kind === "pending";
}
const td = ["disabled", "ask", "automatic"], nd = ["buttons", "confirm"], as = "ask";
function rd(e) {
  return typeof e == "string" && td.includes(e);
}
function ad(e) {
  return typeof e == "string" && nd.includes(e);
}
function od(e) {
  return rd(e) ? e : ad(e) ? "ask" : as;
}
const id = ["keep", "replace"], sd = ["manual", "assisted"], os = "keep", is = "assisted", ld = !0, L = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function cd() {
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
    default: as
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
    default: os
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
    default: is
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
    default: rs
  }), game.settings.register(d, L.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: ld
  }), game.settings.register(d, L.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Gn() {
  const e = od(game.settings.get(d, L.executionMode)), t = cs(game.settings.get(d, L.systemCardMode)), n = us(game.settings.get(d, L.damageResolutionMode)), r = Mr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: ls()
  };
}
function ss() {
  return cs(game.settings.get(d, L.systemCardMode));
}
function ud() {
  return us(game.settings.get(d, L.damageResolutionMode));
}
function Mr() {
  return Ju(game.settings.get(d, L.resistanceGateMode));
}
function ls() {
  return game.settings.get(d, L.ritualCastingCheckEnabled) === !0;
}
async function le(e) {
  await game.settings.set(d, L.executionMode, e);
}
function cs(e) {
  return id.includes(e) ? e : os;
}
function us(e) {
  return sd.includes(e) ? e : is;
}
function dd(e) {
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
const md = [
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
function fd(e) {
  return {
    phases() {
      return md;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = pn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = _u(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await qa(e, t, n);
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
      if (!hd(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = gd(n) ?? pn("Nenhum ator encontrado para executar automação do item.");
      r && await qa(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = pn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Au(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Zi);
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
async function qa(e, t, n) {
  const r = lt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ns(),
    item: n,
    targets: Or()
  });
  if (!a.ok) {
    pd(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", we(a.value.context));
}
function pd(e) {
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
function pn(e) {
  const t = st.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function gd(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function hd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function bd(e) {
  const t = Iu(e), n = Ru(e), r = Ku(e), a = fd(e), o = Du(), s = dd(e);
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
function yd(e) {
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
      const r = Ga();
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
      return Ad(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Ga();
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
      return _d(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Ga() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function Ad(e) {
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
function _d(e) {
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
function Td(e) {
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
    conditions: yd(e.conditions),
    debug: bd(e),
    hooks: $t
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class ja {
  static isSupportedSystem() {
    return game.system.id === Hc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const gn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Rd(e) {
  if (!Cd(e.item)) return null;
  const t = jn(e.actor) ? e.actor : kd(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: $d(e.token) ?? wd(t),
    targets: Or(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function kd(e) {
  const t = e;
  return jn(t.actor) ? t.actor : jn(e.parent) ? e.parent : null;
}
function wd(e) {
  const t = Ed(e) ?? Sd(e);
  return t ? ds(t) : null;
}
function $d(e) {
  return Vn(e) ? ds(e) : null;
}
function Ed(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Vn(n) ? n : (t.getActiveTokens?.() ?? []).find(Vn) ?? null;
}
function Sd(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ds(e) {
  const t = e.actor ?? null;
  return {
    tokenId: hn(e.id),
    actorId: hn(t?.id),
    sceneId: hn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Cd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function jn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Vn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function hn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class ms {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(gn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${gn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Rd(Id(t));
    if (!n) {
      f.warn(`${gn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Id(e) {
  return e && typeof e == "object" ? e : {};
}
function Hn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Fr() {
  const e = globalThis.game;
  return Wt(e) ? e : null;
}
function B(e, t) {
  const n = Ld(e, t);
  return Et(n);
}
function Ld(e, t) {
  return t.split(".").reduce((n, r) => Wt(n) ? n[r] : null, e);
}
function vd(e, t) {
  const n = e.indexOf(":");
  return n < 0 || nt(e.slice(0, n)) !== nt(t) ? null : Me(e.slice(n + 1));
}
function Et(e) {
  return typeof e == "string" ? Me(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Wt(e) {
  return !!e && typeof e == "object";
}
function Dd(e) {
  return typeof e == "string";
}
function Kt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Me(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function nt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Wn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function te(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function fs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const Nd = "paranormal-toolkit-chat-message--full-width-card", Va = ".paranormal-toolkit-ability-card", Ha = "li.chat-message";
let Wa = !1;
function Pd() {
  if (Wa) return;
  Wa = !0;
  const e = Hooks, t = (n, r) => {
    Ka(Hn(r));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), Ka(document);
}
function Ka(e) {
  if (!e) return 0;
  const t = Br(e), n = xd(t), r = /* @__PURE__ */ new Set();
  for (const a of n) {
    const o = Od(t, a);
    o?.classList && r.add(o);
  }
  for (const a of r)
    a.classList?.add(Nd);
  return r.size;
}
function xd(e) {
  const t = [];
  e.matches?.(Va) && t.push(e);
  const n = e.querySelectorAll?.(Va);
  if (!n) return t;
  for (const r of Array.from(n)) {
    const a = Br(r);
    t.includes(a) || t.push(a);
  }
  return t;
}
function Od(e, t) {
  if (e.matches?.(Ha)) return e;
  const n = t.closest?.(Ha);
  return n ? Br(n) : null;
}
function Br(e) {
  return e && typeof e == "object" ? e : {};
}
function Md(e) {
  const t = Fd(e.cost), n = Bd(e.currentResource), r = t > 0 && !e.passive, a = n >= t;
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
function Fd(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function Bd(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: Ud } = foundry.applications.api;
class Je extends Ud {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = Md(t), this.spendResource = this.model.cost.spendResourceChecked;
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
          src="${zd(this.model.header.image)}"
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
function zd(e) {
  return N(e);
}
function qd(e, t) {
  const n = Kd(t.system), r = Dt(n.activation), a = Hd(r), o = jd();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: Yd(t),
    activation: r,
    activationLabel: Vd(r),
    description: Dt(n.description),
    chatDescription: Gd(
      n.chatDescription,
      n.description
    ),
    cost: a ? 0 : Wd(n.cost),
    resource: o,
    passive: a
  };
}
function Gd(e, t) {
  const n = Dt(e);
  return n.trim().length > 0 ? n : Dt(t);
}
function jd() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function Vd(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, r = Qd()?.(t) ?? t;
  return r === t ? e : r;
}
function Hd(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function Wd(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function Kd(e) {
  return e && typeof e == "object" ? e : {};
}
function Dt(e) {
  return typeof e == "string" ? e : "";
}
function Yd(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function Qd() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class Zd {
  async publish(t, n, r) {
    const a = await nm(n), o = Xd({
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
    }, l = em(t.message);
    if (ss() === "replace" && l) {
      await l.update(s);
      return;
    }
    await ChatMessage.create(s);
  }
}
function Xd(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, r = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", a = Jd(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${tm(e.abilityImage)}" alt="">
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

      ${a}

      <footer class="paranormal-toolkit-ability-card__status ${r}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${ke(n)}</span>
      </footer>
    </article>
  `;
}
function Jd(e) {
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
function em(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function ke(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function tm(e) {
  return ke(e);
}
async function nm(e) {
  const t = e.chatDescription || e.description, n = rm();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: am(e.actor)
  });
}
function rm() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function am(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class om {
  constructor(t, n, r = new Zd()) {
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
    if (!im(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const r = qd(n, t.item), a = this.readCurrentResource(r);
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
function im(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Ya = 1e3;
class sm {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new om(t, n), this.strategy = new ms(
      (r) => this.handleItemUsed(r)
    );
  }
  register() {
    this.strategy.register(), Pd(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (Gn().executionMode === "disabled" || !cm(t.item)) return;
    const n = um(t);
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
    return n !== void 0 && Date.now() - n < Ya;
  }
  pruneRecentExecutions() {
    const t = Date.now() - Ya;
    for (const [n, r] of this.recentExecutions)
      r < t && this.recentExecutions.delete(n);
  }
}
function lm(e, t) {
  const n = new sm(e, t);
  return n.register(), n;
}
function cm(e) {
  if (e.type !== "ability") return !1;
  const t = Lr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function um(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let Qa = !1, bn = !1, yn = !1, bt = null;
const dm = 1e3, mm = 750, fm = 1e3;
function pm(e) {
  Qa || (Hooks.on("combatTurnChange", (t) => {
    hm(e, Za(t));
  }), Hooks.on("deleteCombat", (t) => {
    bm(e, Za(t));
  }), Qa = !0, gm(e));
}
function gm(e) {
  Yt() && (bn || (bn = !0, globalThis.setTimeout(() => {
    bn = !1, Ur(e, "ready");
  }, dm)));
}
function hm(e, t) {
  Yt() && t && (bt && globalThis.clearTimeout(bt), bt = globalThis.setTimeout(() => {
    bt = null, Ur(e, "combat-turn-change", t);
  }, mm));
}
function bm(e, t) {
  Yt() && t && (yn || (yn = !0, globalThis.setTimeout(() => {
    yn = !1, Ur(e, "combat-deleted", t);
  }, fm)));
}
async function Ur(e, t, n) {
  if (Yt())
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
function Yt() {
  return game.user?.isGM === !0;
}
function Za(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ps = {
  enabled: "dice.animations.enabled"
};
function ym() {
  game.settings.register(d, ps.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Am() {
  return {
    enabled: game.settings.get(d, ps.enabled) === !0
  };
}
const Qt = "chatCard", Xa = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, _m = `.${i}__title`, gs = `.${i}__header`, Tm = `.${i}__roll-card`, Rm = `.${i}__roll-meta`, km = `.${i}__roll-meta-pill`, zr = `.${i}__resistance`, wm = `.${i}__resistance-header`, hs = `.${i}__resistance-description`, Zt = `.${i}__resistance-roll-button`, bs = `.${i}__resistance-roll-result`, Ja = `${i}__resistance-content`, ys = `.${i}__workflow-section`, As = `.${i}__workflow-roll`, qr = `${i}__workflow-roll--dice-open`, Gr = `.${i}__workflow-roll-formula`, jr = `${i}__workflow-roll-formula--toggle`, Xt = `.${i}__workflow-dice-tray`, $m = `.${i}__roll-detail-toggle`, Em = `.${i}__roll-detail-list`, Sm = `.${i}__ritual-element-badge`, Cm = `.${i}__ritual-metadata`, Im = "casting-backlash", Lm = "data-paranormal-toolkit-action-section", vm = "data-paranormal-toolkit-prompt-id", Dm = "data-paranormal-toolkit-pending-id", eo = "data-paranormal-toolkit-casting-backlash-enhanced", to = `.${i}`, Nm = `.${i}__workflow-section--casting`, Pm = `.${i}__workflow-section-header`, xm = `.${i}__workflow-notes`, Om = `[${Lm}="${Im}"]`, no = `${i}__workflow-section-title-row`, Mm = `${i}__workflow-section-header--casting-backlash`, _s = `${i}__casting-backlash-button`;
function Fm(e) {
  for (const t of Bm(e))
    Um(t), Vm(t);
}
function Bm(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(to) && t.add(e);
  for (const n of e.querySelectorAll(to))
    t.add(n);
  return Array.from(t);
}
function Um(e) {
  const t = e.querySelector(Om);
  if (!t) return;
  const n = zm(t);
  if (!n) return;
  const r = e.querySelector(`${Nm} ${Pm}`);
  r && (r.classList.add(Mm), qm(r), Gm(n), r.append(n), t.remove());
}
function zm(e) {
  return e.querySelector(
    `button[${Dm}], button[${vm}]`
  );
}
function qm(e) {
  const t = e.querySelector(`:scope > .${no}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(no);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(_s) || n.append(a));
  return n;
}
function Gm(e) {
  if (e.getAttribute(eo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = jm(t, e.disabled);
  e.classList.add(_s), e.setAttribute(eo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function jm(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Vm(e) {
  for (const t of e.querySelectorAll(xm)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Hm(e) {
  for (const t of Array.from(e.querySelectorAll(ys)))
    for (const n of Array.from(t.querySelectorAll(`${$m}, ${Em}`)))
      n.remove();
}
const Wm = {
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
}, Km = new Set(
  Object.values(Wm)
), Ym = {
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
function Qm(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Zm(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Ym[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Km.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Ts(e) {
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
function Zm(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Rs {
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
      const h = Xm(m, u);
      if (!h.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const k = Qm(m.damageType);
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
          Jm(h.id, m, k.value)
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
        for (const w of tf(_.conditions))
          l.add(w);
        const T = ef(_.newPV);
        T !== null && (c = T), s.push({
          id: h.id,
          label: m.label ?? Ts(k.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: h.amount,
          finalDamage: ro(_.finalDamage, h.amount),
          blocked: ro(_.blocked, 0),
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
function Xm(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Jm(e, t, n) {
  return {
    id: e,
    label: t.label ?? Ts(n),
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
function ro(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function ef(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function tf(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Vr {
  async rollResistance(t) {
    const n = await rf(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? fe(t.skill),
      roll: n,
      formula: of(n),
      total: sf(n),
      diceBreakdown: lf(n)
    };
  }
  getSkillLabel(t) {
    return fe(t);
  }
}
async function nf(e, t) {
  return new Vr().rollResistance({ actor: e, skill: t });
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
async function rf(e, t) {
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
  return af(r);
}
function af(e) {
  return ao(e) ? e : Array.isArray(e) ? e.find(ao) ?? null : null;
}
function ao(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function of(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function sf(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function lf(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(cf);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function cf(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class ks {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class ws {
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
function uf(e, t) {
  const n = bf(e?.rounds);
  if (!n)
    return oo(null);
  const r = e?.anchor ?? $s(t);
  if (!r)
    return {
      ...oo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: df(),
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
function $s(e) {
  const t = yf();
  if (!t?.id || !Es(t.round)) return null;
  const n = gf(t), r = mf(e, n) ?? pf(t), a = J(r?.id), o = _f(r?.initiative), s = ff(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Af()
  };
}
function df() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function oo(e) {
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
function mf(e, t) {
  return e?.id ? t.find((n) => hf(n) === e.id) ?? null : null;
}
function ff(e, t, n) {
  const r = J(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Tf(e.turn) ? e.turn : null;
}
function pf(e) {
  return St(e.combatant) ? e.combatant : null;
}
function gf(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(St);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(St);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(St);
  }
  return [];
}
function hf(e) {
  return J(e.actor?.id) ?? J(e.actorId) ?? J(e.token?.actor?.id) ?? J(e.token?.actorId) ?? J(e.document?.actor?.id) ?? J(e.document?.actorId);
}
function bf(e) {
  return Es(e) ? Math.trunc(e) : null;
}
function yf() {
  return game.combat ?? null;
}
function Af() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function St(e) {
  return !!(e && typeof e == "object");
}
function J(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function _f(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Es(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Tf(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Ss {
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
    if (!vf(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = uf(t.duration, r), s = Rf(a, t, o), c = t.refreshExisting ?? !0 ? Df(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), b(io(r, a, c.id ?? null, !1, !0, o));
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
      return b(io(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = Is(n, r);
    let o = 0;
    try {
      for (const s of a)
        await so(n, s) === "deleted" && (o += 1);
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
    const n = xf(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = Hr(s);
      a += l.length;
      for (const c of l) {
        if (!$f(c, t)) continue;
        const u = Cs(c);
        try {
          await so(s, c) === "deleted" && (o += 1);
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
function Rf(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Vf(),
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
    duration: kf(n.duration),
    start: wf(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function kf(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function wf(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: jf(),
    ...e
  };
}
function io(e, t, n, r, a, o) {
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
function $f(e, t) {
  const n = Cs(e);
  if (!n.conditionId || !Ef(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Gf();
  return n.durationMode === "combatantTurn" || Sf(n) ? If(n, r) : Cf(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !U(n.startRound) || !U(n.requestedRounds) || !U(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Ef(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && U(e.requestedRounds);
}
function Sf(e) {
  return !!(e.combatDurationApplied && U(e.requestedRounds) && U(e.startRound) && (e.startCombatantId || Nt(e.startTurn)));
}
function Cf(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function If(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !U(e.startRound) || !U(e.requestedRounds) || !U(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Lf(t);
  return e.startCombatantId ? r === e.startCombatantId : Nt(e.startTurn) && Nt(t.turn) ? t.turn === e.startTurn : !1;
}
function Lf(e) {
  return Ee(e.combatant?.id);
}
function Cs(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ct(e, "conditionId"),
    requestedRounds: lo(e, "requestedRounds") ?? Ye(t.value) ?? Ye(t.rounds),
    combatDurationApplied: An(e, "combatDurationApplied"),
    combatId: Ct(e, "combatId") ?? Ee(n.combat) ?? Ee(t.combat),
    startCombatantId: Ct(e, "startCombatantId") ?? Ee(n.combatant),
    startInitiative: Bf(e, "startInitiative") ?? Ls(n.initiative),
    startRound: lo(e, "startRound") ?? Ye(n.round) ?? Ye(t.startRound),
    startTurn: Ff(e, "startTurn") ?? Kn(n.turn) ?? Kn(t.startTurn),
    expiryEvent: Uf(e, "expiryEvent") ?? vs(t.expiry),
    durationMode: zf(e, "durationMode"),
    deleteOnExpire: An(e, "deleteOnExpire"),
    expiresWithCombat: An(e, "expiresWithCombat")
  };
}
function vf(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Df(e, t) {
  return Is(e, t)[0] ?? null;
}
function Is(e, t) {
  return Hr(e).filter((n) => Mf(n) === t);
}
async function so(e, t) {
  const n = t.id ?? null, r = n ? Nf(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Pf(a)) return "missing";
    throw a;
  }
}
function Nf(e, t) {
  return Hr(e).find((n) => n.id === t) ?? null;
}
function Pf(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function xf() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      yt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    yt(e, n);
  });
  for (const n of Of())
    yt(e, n.actor), yt(e, n.document?.actor);
  return Array.from(e.values());
}
function yt(e, t) {
  if (!qf(t)) return;
  const r = Ee(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Of() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Hr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Mf(e) {
  return Ct(e, "conditionId");
}
function Ct(e, t) {
  return Ee(he(e, t));
}
function lo(e, t) {
  return Ye(he(e, t));
}
function Ff(e, t) {
  return Kn(he(e, t));
}
function Bf(e, t) {
  return Ls(he(e, t));
}
function Uf(e, t) {
  return vs(he(e, t));
}
function zf(e, t) {
  const n = he(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function An(e, t) {
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
  return U(e) ? Math.trunc(e) : null;
}
function Kn(e) {
  return Nt(e) ? Math.trunc(e) : null;
}
function Ls(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function vs(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function qf(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Gf() {
  return game.combat ?? null;
}
function jf() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function U(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Nt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Vf() {
  return game.user?.id ?? null;
}
const Hf = "icons/svg/downgrade.svg", Wf = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function y(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Hf,
    description: Wf,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Kf = y({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Yf = y({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Qf = y({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Zf = y({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Xf = y({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Jf = y({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), ep = y({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), tp = y({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), np = y({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), rp = y({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), ap = y({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), op = y({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), ip = y({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), sp = y({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), lp = y({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), cp = y({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), up = y({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), dp = y({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), mp = y({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), fp = y({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), pp = y({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), gp = y({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), hp = y({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), bp = y({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), yp = y({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Ap = y({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), _p = y({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Tp = y({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Rp = y({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), kp = y({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), wp = y({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), $p = y({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Ep = y({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Sp = y({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Cp = [
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
  fp,
  pp,
  gp,
  hp,
  bp,
  yp,
  Ap,
  _p,
  Tp,
  Rp,
  kp,
  wp,
  $p,
  Ep,
  Sp
];
class Ip {
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
    return Array.from(this.definitions.values()).map(co);
  }
  get(t) {
    const n = this.lookup.get(uo(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(co(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = uo(t);
    r && this.lookup.set(r, n);
  }
}
function Ds() {
  return new Ip(Cp);
}
function co(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function uo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function ve(e) {
  return e.applyOnResistance ?? "failure";
}
function Ns(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Ps(e, t) {
  const n = ve(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function xs(e) {
  const t = ve(e);
  return t === "failure" || t === "success";
}
function Lp(e, t, n, r) {
  const a = e.filter((c) => Ps(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => ve(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const vp = {
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
}, Dp = {
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
function Np(e) {
  return Ms(e, vp, !1);
}
function Pp(e) {
  return Ms(e, Dp, !e.allowsSuccessfulResistance);
}
function Fe(e) {
  return e.kind === "waiting-resistance";
}
function Os(e) {
  return e.kind === "resisted";
}
function Ms(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Te("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Te("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || Ht(e.resistanceGateMode, e.resistanceState) ? Te(
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
const Qe = "data-paranormal-toolkit-prompt-id", xp = "data-paranormal-toolkit-resistance-roll-result", Op = "Conjuração DT";
function Mp(e) {
  const t = e.querySelector(Zt)?.getAttribute(xp), n = rt(t);
  if (n !== null) return n;
  const r = e.querySelector(bs)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return rt(a?.[1] ?? null);
}
function Wr(e) {
  const t = Fs(e), n = zp(t);
  if (n !== null) return n;
  const r = Up(t);
  return r !== null ? r : qp(e);
}
function Fp(e) {
  const t = Fs(e);
  return t ? {
    actorId: _n(t.actorId),
    itemId: _n(t.itemId),
    itemName: _n(t.itemName)
  } : null;
}
function Bp(e) {
  const t = e.getAttribute(Qe);
  if (!t) return null;
  const n = Bs(e), r = Us(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Jt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function ne(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Yn(e) {
  return ne(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Up(e) {
  const t = jp(e);
  return t.length === 0 ? null : rt(Vp(t, Op));
}
function zp(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : mo(r, ["system", "ritual", "DT"]) ?? mo(r, ["system", "ritual", "dt"]);
}
function qp(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return rt(n?.[1] ?? null);
}
function Fs(e) {
  const t = Gp(e);
  if (!t) return null;
  const n = Bs(e), r = Us(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Jt(o) ? o.pendingId === t : !1) ?? null;
}
function Gp(e) {
  return (e.closest(`[${Qe}]`) ?? e.querySelector(`[${Qe}]`) ?? e.parentElement?.querySelector(`[${Qe}]`) ?? null)?.getAttribute(Qe) ?? null;
}
function Bs(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Hp(a) ? a : null;
}
function Us(e) {
  const t = e?.getFlag?.(d, Qt);
  return Jt(t) ? t : null;
}
function jp(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Vp(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function mo(e, t) {
  let n = e;
  for (const r of t) {
    if (!Jt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : rt(typeof n == "string" ? n : null);
}
function rt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Hp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Jt(e) {
  return !!(e && typeof e == "object");
}
function _n(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function en(e) {
  return zs({
    hasResistance: !!e.querySelector(zr),
    difficulty: Wr(e),
    resistanceTotal: Mp(e)
  });
}
function Wp(e) {
  if (!e.hasResistance || e.difficulty === null)
    return zs({
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
function zs(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: ed(e)
  };
}
function be() {
  return game.user?.isGM === !0;
}
function pe() {
  return be();
}
function Kp(e) {
  const t = Ht(e.resistanceGateMode, e.resistanceState), n = Yp(e.resistanceState, e.hasDamage), r = Qp(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Np({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Pp({
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
function Yp(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Qp(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Kr(e) {
  const t = e.isGM ?? pe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Kp({
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
function Zp(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Jp(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Xp(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Jp(e, t) {
  const n = eg(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of tg(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function eg(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function tg(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? fo(e, "highest") : n.includes("kl") ? fo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function fo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const ng = "data-paranormal-toolkit-resistance-skill", rg = "data-paranormal-toolkit-resistance-skill-label", ag = "data-paranormal-toolkit-roll-card-target-names", og = "data-paranormal-toolkit-roll-card-resistance", ig = "data-paranormal-toolkit-roll-card-resistance-skill", sg = "data-paranormal-toolkit-roll-card-resistance-skill-label", qs = "pending", Yr = "success", Qr = "failure", Gs = "rolled";
function lg(e) {
  const t = fg(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? dg(e.damageSection) : null, r = po(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = cg(e.rollCard).map((o, s) => {
    const l = ug(o, s), c = e.resistanceResults.get(l) ?? null, u = Ag(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, h = e.effectApplications.get(l) ?? null, k = Wp({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: wg(u)
    }).state, _ = po(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Ns(k)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: h,
      effect: _,
      assistedActions: Kr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: k,
        damage: n,
        effect: _,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!h,
        effectCanApplyOnSuccessfulResistance: _?.applyOnResistance === "success" || _?.applyOnResistance === "always",
        effectRequiresResolvedResistance: _ ? xs(_) : !1
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
function cg(e) {
  const t = e.getAttribute(ag), n = t ? kg(t) : [];
  if (n.length > 0) return n;
  const a = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = a.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && js(s) !== "nenhum alvo") : [];
}
function ug(e, t) {
  return `${js(e)}:${t}`;
}
function dg(e) {
  const t = _g(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Rg(e),
    formula: Tg(e) ?? "—",
    total: t,
    diceBreakdown: Xp(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function po(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: mg(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: ve(o)
  } : null;
}
function mg(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function fg(e, t) {
  const n = gg(t), r = pg(e), a = r.description ?? hg(n)?.textContent?.trim(), o = bg(n), s = r.skill ?? o?.getAttribute(ng) ?? null, l = r.skillLabel ?? o?.getAttribute(rg) ?? (s ? fe(s) : null);
  return !a && !s ? null : {
    description: a ?? "Resistência do alvo.",
    formula: yg(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: Wr(e)
  };
}
function pg(e) {
  return {
    description: Tn(e, og),
    skill: Tn(e, ig),
    skillLabel: Tn(e, sg)
  };
}
function gg(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function hg(e) {
  return Zr(e, `.${i}__resistance-description`);
}
function bg(e) {
  return Zr(e, Zt);
}
function yg(e) {
  return Zr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Zr(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function Ag(e, t) {
  return e ? t === null ? Gs : e.total >= t ? Yr : Qr : qs;
}
function _g(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Tg(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Rg(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function kg(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function Tn(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function js(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function wg(e) {
  return e === Yr ? "succeeded" : e === Qr ? "failed" : "pending";
}
function Vs(e) {
  if (!e) return null;
  const t = e.actorId ? Sg(e.actorId) : null, n = t ? $g(t, e.itemId, e.itemName) : null;
  return n || Eg(e.itemId, e.itemName);
}
function $g(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Se(o)) return o;
  }
  const a = Pt(n);
  if (a) {
    const o = r?.find?.((s) => Se(s) ? Pt(s.name) === a : !1);
    if (Se(o)) return o;
  }
  return null;
}
function Eg(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Se(a)) return a;
  }
  const r = Pt(t);
  if (r) {
    const a = n?.find?.((o) => Se(o) ? Pt(o.name) === r : !1);
    if (Se(a)) return a;
  }
  return null;
}
function Sg(e) {
  const n = game.actors?.get?.(e);
  return Cg(n) ? n : null;
}
function Cg(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Se(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Pt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Xr(e) {
  const t = Rn(e);
  if (!t) return null;
  const n = Ig().filter((o) => Rn(Lg(o)) === t).map((o) => Hs(o)).find(et) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => et(o) && Rn(o.name) === t);
  return et(a) ? a : null;
}
function Ig() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Lg(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Hs(e)?.name ?? null;
}
function Hs(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (et(t)) return t;
  const n = e.document?.actor;
  return et(n) ? n : null;
}
function et(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Rn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Ws(e) {
  const t = Pg();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: vg(e)
  });
}
function vg(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${It(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Dg(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${It(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${It(e.actorName)}</strong></p>
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
function Dg(e) {
  const t = Ng(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${It(a)}</li>`;
}
function Ng(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = go(n?.value);
  return r === null ? null : {
    value: r,
    max: go(n?.max)
  };
}
function go(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Pg() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function It(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function xg(e) {
  await Ws(Og(e));
}
function Og(e) {
  if (Mg(e)) return e;
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
function Mg(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Ks(e) {
  return e.mode, `✓ ${Ys(e.inputAmount)} PV`;
}
function Fg(e) {
  const t = Ys(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ys(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Bg {
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
    } : Ht(t.resistanceGateMode, t.resistanceState) ? {
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
class Ug {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? pe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : Ht(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class zg {
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
const qg = `.${i}__actions`, Jr = `.${i}__actions-title`, De = `.${i}__button`, Gg = "data-paranormal-toolkit-action-section", jg = `${i}__button--executed`, Vg = "data-paranormal-toolkit-executed-label";
function Qs(e) {
  return ne(e.querySelector(Jr)?.textContent);
}
function Hg(e, t) {
  const n = e.querySelector(Jr);
  n && (n.textContent = t);
}
function ut(e, t) {
  const n = ne(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return ne(a) === n;
  }) ?? null;
}
function ea(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ye(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Zs(e) {
  const t = Wg(e.difficulty);
  if (t === null) return null;
  const n = ho(e.skillLabel) ?? "Resistência", r = ho(e.description), a = Kg(r, n), o = Yg(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Wg(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function ho(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Kg(e, t) {
  if (!e) return null;
  const n = bo(e), r = bo(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function Yg(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function bo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const At = "data-paranormal-toolkit-prompt-id", Xs = "multiTargetResistanceResults", Js = "multiTargetDamageApplications", el = "multiTargetEffectApplications";
function Qg(e) {
  const t = /* @__PURE__ */ new Map(), r = tn(e)?.[Xs];
  if (!z(r)) return t;
  for (const [a, o] of Object.entries(r))
    rh(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Zg(e, t) {
  await ta(e, Xs, t.targetId, t);
}
function Xg(e) {
  const t = /* @__PURE__ */ new Map(), r = tn(e)?.[Js];
  if (!z(r)) return t;
  for (const [a, o] of Object.entries(r))
    ah(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Jg(e, t) {
  await ta(
    e,
    Js,
    t.targetId,
    t
  );
}
function eh(e) {
  const t = /* @__PURE__ */ new Map(), r = tn(e)?.[el];
  if (!z(r)) return t;
  for (const [a, o] of Object.entries(r))
    ih(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function th(e, t) {
  await ta(
    e,
    el,
    t.targetId,
    t
  );
}
function nh(e) {
  const t = tn(e);
  return t ? {
    actorId: kn(t.actorId),
    itemId: kn(t.itemId),
    itemName: kn(t.itemName)
  } : null;
}
async function ta(e, t, n, r) {
  const a = tl(e);
  if (!a) return;
  const o = nl(e), s = rl(o);
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
  l && await Promise.resolve(o.setFlag?.(d, Qt, {
    ...s,
    prompts: c
  }));
}
function tn(e) {
  const t = tl(e);
  if (!t) return null;
  const n = nl(e), r = rl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => z(o) ? o.pendingId === t : !1) ?? null;
}
function tl(e) {
  return (e.closest(`[${At}]`) ?? e.querySelector(`[${At}]`) ?? e.parentElement?.querySelector(`[${At}]`) ?? null)?.getAttribute(At) ?? null;
}
function nl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return sh(a) ? a : null;
}
function rl(e) {
  const t = e?.getFlag?.(d, Qt);
  return z(t) ? t : null;
}
function rh(e) {
  return z(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function ah(e) {
  return z(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && oh(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function oh(e) {
  return e === "normal" || e === "half";
}
function ih(e) {
  return z(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function kn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function sh(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function z(e) {
  return !!(e && typeof e == "object");
}
const lh = "data-paranormal-toolkit-resistance-skill", ch = "data-paranormal-toolkit-resistance-skill-label", Qn = "data-paranormal-toolkit-multi-target-section", na = "data-paranormal-toolkit-multi-target-damage-info", al = "data-paranormal-toolkit-multi-target-effect-info", ol = "data-paranormal-toolkit-multi-target-toggle", il = "data-paranormal-toolkit-multi-target-details", O = "data-paranormal-toolkit-multi-target-target", uh = "data-paranormal-toolkit-multi-target-state", Zn = "data-paranormal-toolkit-multi-target-roll-total", Xn = "data-paranormal-toolkit-multi-target-roll-formula", Lt = "data-paranormal-toolkit-multi-target-roll-dice", Jn = "data-paranormal-toolkit-multi-target-roll-skill", er = "data-paranormal-toolkit-multi-target-roll-skill-label", tr = "data-paranormal-toolkit-multi-target-roll-target-name", nr = "data-paranormal-toolkit-multi-target-roll-rolled-at", rr = "data-paranormal-toolkit-multi-target-damage-mode", ar = "data-paranormal-toolkit-multi-target-damage-input-amount", yo = "data-paranormal-toolkit-multi-target-damage-final-amount", Ao = "data-paranormal-toolkit-multi-target-damage-blocked", or = "data-paranormal-toolkit-multi-target-damage-target-name", ir = "data-paranormal-toolkit-multi-target-damage-applied-at", sr = "data-paranormal-toolkit-multi-target-effect-condition-id", lr = "data-paranormal-toolkit-multi-target-effect-condition-label", cr = "data-paranormal-toolkit-multi-target-effect-effect-id", ur = "data-paranormal-toolkit-multi-target-effect-created", dr = "data-paranormal-toolkit-multi-target-effect-refreshed", mr = "data-paranormal-toolkit-multi-target-effect-target-name", fr = "data-paranormal-toolkit-multi-target-effect-applied-at", dh = new Ss(Ds()), mh = new ks(new Rs()), fh = new ws(new Vr()), ph = new zg(fh), gh = new Bg(mh), hh = new Ug(dh), bh = qs, Be = Yr, dt = Qr, yh = Gs;
function Ah(e) {
  const t = sl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Ch(e);
  const n = Ih(e.rollCard, t), r = Lh(e.rollCard, t);
  !n && r && mb(e.rollCard, r, e.effectSection);
  const a = Oh(e.rollCard);
  return ul(a, t), cb(
    e.rollCard,
    a,
    vh(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && fb(e.rollCard, r, a), !0;
}
function sl(e) {
  return lg({
    ...e,
    resistanceResults: Rh(e.rollCard),
    damageApplications: kh(e.rollCard),
    effectApplications: wh(e.rollCard),
    resolveTargetConditionApplication: _h,
    resistanceGateMode: aa()
  });
}
function _h(e, t, n) {
  const r = nh(e), a = Vs(r);
  if (!a) return null;
  const o = lt(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = Th(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function Th(e, t, n) {
  const r = Lp(
    e,
    n,
    t,
    wn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = wn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => wn(s) === a)) ?? null : null;
}
function Rh(e) {
  const t = Qg(e);
  for (const [n, r] of Sh(e))
    t.set(n, r);
  return t;
}
function kh(e) {
  const t = Xg(e);
  for (const [n, r] of Eh(e))
    t.set(n, r);
  return t;
}
function wh(e) {
  const t = eh(e);
  for (const [n, r] of $h(e))
    t.set(n, r);
  return t;
}
function $h(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = n.getAttribute(sr), o = n.getAttribute(lr), s = n.getAttribute(cr), l = Ro(n.getAttribute(ur)), c = Ro(n.getAttribute(dr)), u = n.getAttribute(mr), m = n.getAttribute(fr);
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
function Eh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = n.getAttribute(rr), o = _l(n.getAttribute(ar)), s = n.getAttribute(or), l = n.getAttribute(ir);
    !r || !hb(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Sh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = _l(n.getAttribute(Zn)), o = n.getAttribute(Xn), s = n.getAttribute(Jn), l = n.getAttribute(er), c = n.getAttribute(tr), u = n.getAttribute(nr);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(Lt),
      rolledAt: u
    });
  }
  return t;
}
function Ch(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Ih(e, t) {
  if (!t.damage)
    return ll(e)?.remove(), null;
  const n = Dh(e);
  return Nh(n, t.damage), xh(e, n), n;
}
function Lh(e, t) {
  if (!t.effect)
    return Al(e)?.remove(), null;
  const n = ub(e);
  return db(n, t.effect), n;
}
function vh(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : ut(e, "Conjuração");
}
function Dh(e) {
  const t = ll(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(na, "true"), n;
}
function ll(e) {
  return e.querySelector(`[${na}="true"]`);
}
function Nh(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(cl(t.formula, t.total, t.diceBreakdown));
}
function cl(e, t, n, r = !1) {
  const a = Zp({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Ph(a, r), a;
}
function Ph(e, t) {
  const n = e.querySelector(Xt), r = e.querySelector(Gr);
  if (!n || !r) return;
  e.classList.toggle(qr, t), n.hidden = !t, r.classList.add(jr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function xh(e, t) {
  const n = ut(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Oh(e) {
  const t = e.querySelector(`[${Qn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Qn, "true"), n;
}
function ul(e, t) {
  const n = Mh(e), r = Bh(t.resistance), a = [Fh(t)];
  r && a.push(r), a.push(qh(t, n)), e.replaceChildren(...a);
}
function Mh(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${O}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(O)).filter(gb)
  );
}
function Fh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = zh(e.targets), t.append(n, r), t;
}
function Bh(e) {
  const t = Zs({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Uh(n, t), n;
}
function Uh(e, t) {
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
function zh(e) {
  const t = e.length, n = e.filter((l) => l.state === dt).length, r = e.filter((l) => l.state === Be).length, a = e.filter((l) => l.state === bh).length, o = e.filter((l) => l.state === yh).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function qh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Gh(r, e, t.has(r.id)));
  return n;
}
function Gh(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(O, e.id), r.setAttribute(uh, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), dl(r, e.resistanceResult), ml(r, e.damageApplication), fl(r, e.effectApplication);
  const a = jh(e, t, r), o = ob(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    To(s.target) || _o(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || To(s.target) || (s.preventDefault(), _o(r));
  }), r.append(a, o), r;
}
function dl(e, t) {
  if (!t) {
    e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Lt), e.removeAttribute(Jn), e.removeAttribute(er), e.removeAttribute(tr), e.removeAttribute(nr);
    return;
  }
  e.setAttribute(Zn, String(t.total)), e.setAttribute(Xn, t.formula), e.setAttribute(Jn, t.skill), e.setAttribute(er, t.skillLabel), e.setAttribute(tr, t.targetName), e.setAttribute(nr, t.rolledAt), t.diceBreakdown ? e.setAttribute(Lt, t.diceBreakdown) : e.removeAttribute(Lt);
}
function ml(e, t) {
  if (!t) {
    e.removeAttribute(rr), e.removeAttribute(ar), e.removeAttribute(yo), e.removeAttribute(Ao), e.removeAttribute(or), e.removeAttribute(ir);
    return;
  }
  e.setAttribute(rr, t.mode), e.setAttribute(ar, String(t.inputAmount)), e.removeAttribute(yo), e.removeAttribute(Ao), e.setAttribute(or, t.targetName), e.setAttribute(ir, t.appliedAt);
}
function fl(e, t) {
  if (!t) {
    e.removeAttribute(sr), e.removeAttribute(lr), e.removeAttribute(cr), e.removeAttribute(ur), e.removeAttribute(dr), e.removeAttribute(mr), e.removeAttribute(fr);
    return;
  }
  e.setAttribute(sr, t.conditionId), e.setAttribute(lr, t.conditionLabel), e.setAttribute(cr, t.effectId ?? ""), e.setAttribute(ur, String(t.created)), e.setAttribute(dr, String(t.refreshed)), e.setAttribute(mr, t.targetName), e.setAttribute(fr, t.appliedAt);
}
function jh(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Vh(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Hh(e, t.resistance);
  Qh(l, n, e, t);
  const c = ab(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), bl(u, [
    pl(e, t, "compact"),
    hl(e, t, "compact")
  ]), r.append(a, u), r;
}
function Vh(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Hh(e, t) {
  if (!be())
    return Wh(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Yh(e, t)), t?.skill && (n.setAttribute(lh, t.skill), n.setAttribute(ch, t.skillLabel ?? fe(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Be ? "✓" : e.state === dt ? "✕" : "", n.append(r, a), n;
}
function Wh(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Kh(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Be ? "✓" : e.state === dt ? "✕" : "", n.append(r, a), n;
}
function Kh(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Be ? "sucesso" : e.state === dt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Yh(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Be ? "sucesso" : e.state === dt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Qh(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !be() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Zh(t, e, n, r);
  });
}
async function Zh(e, t, n, r) {
  if (!be()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? fe(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Xr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await ph.execute({ actor: l, skill: o, skillLabel: s });
    await pb(u.roll);
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
    dl(e, m);
    try {
      await Zg(r.rollCard, m);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", h);
    }
    ra(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function ra(e) {
  const t = e.closest(`[${Qn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = sl({
    rollCard: n,
    damageSection: Xh(n) ?? ut(n, "Dano"),
    effectSection: Jh(n)
  });
  r && ul(t, r);
}
function Xh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(na) !== "true") ?? null;
}
function Jh(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function eb(e) {
  return Fe(e.assistedActions.policy.damageActionState);
}
function tb(e) {
  return Fe(e.assistedActions.policy.effectActionState);
}
function aa() {
  try {
    return Mr();
  } catch {
    return "strict";
  }
}
function pl(e, t, n) {
  if (e.damageApplication)
    return ee(
      "✓",
      Ks({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Fe(r))
    return ee(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = gl(a, t.damage);
  if (o === null)
    return ee(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Fg({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = ee(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const h = u.closest(`[${O}]`);
    h && nb(h, u, e, t);
  }), u;
}
function gl(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function nb(e, t, n, r) {
  if (n.damageApplication) return;
  if (eb(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = gl(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Xr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await gh.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: aa(),
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
    ml(e, m);
    try {
      await Jg(r.rollCard, m);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", h);
    }
    try {
      await xg(u.value);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", h);
    }
    ra(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function hl(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (e.effectApplication)
    return ee(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!a) return null;
  if (Fe(r))
    return ee(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Os(r))
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
    l && rb(l, o, e, t);
  }), o;
}
async function rb(e, t, n, r) {
  if (n.effectApplication) return;
  if (tb(n)) {
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
  const o = Xr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await hh.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: aa(),
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
    fl(e, c);
    try {
      await th(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), ra(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function bl(e, t) {
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
function ab(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(ol, "true"), t.setAttribute("aria-hidden", "true"), yl(e, t), t;
}
function _o(e) {
  const t = e.querySelector(`[${il}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${ol}="true"]`);
  r && yl(e, r);
}
function yl(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function To(e) {
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
function ob(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(il, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = ib(e, t.resistance);
  s && r.append(s);
  const l = sb(e, t.resistance), c = lb(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function ib(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Be ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function sb(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = cl(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function lb(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), bl(n, [
    pl(e, t, "full"),
    hl(e, t, "full")
  ]), n;
}
function cb(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ub(e) {
  const t = Al(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(al, "true"), n;
}
function Al(e) {
  return e.querySelector(`[${al}="true"]`);
}
function db(e, t) {
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
function mb(e, t, n) {
  const r = n?.parentElement === e ? n : ut(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function fb(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function wn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function pb(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function gb(e) {
  return typeof e == "string" && e.length > 0;
}
function hb(e) {
  return e === "normal" || e === "half";
}
function Ro(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function _l(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const ko = "data-paranormal-toolkit-card-layout-refresh-bound";
function bb(e) {
  const t = e.rollCard.querySelector(Zt);
  t && t.getAttribute(ko) !== "true" && (t.setAttribute(ko, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Ce = "data-paranormal-toolkit-prompt-id", yb = "apply-damage", Ab = "data-paranormal-toolkit-multi-target-damage-info";
function _b(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(Ab) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Tb(e) {
  const t = kb(e);
  return t.find((n) => n.getAttribute(Gg) === yb) ?? t.find((n) => Qs(n) === "aplicar danos") ?? null;
}
function Rb(e) {
  const t = Tl(e), n = wo(t);
  return n || wo(wb(e));
}
function wo(e) {
  return e.find((t) => {
    const n = Qs(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function kb(e) {
  const t = Tl(e);
  return t.length > 0 ? t : oa(e);
}
function Tl(e) {
  const t = Sb(e);
  return t ? oa(e).filter((n) => Eb(n, t)) : [];
}
function wb(e) {
  const t = Rl(e);
  if (!t) return [];
  const n = $b(e, t);
  return oa(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => kl(e, r)).filter((r) => !n || Cb(r, n));
}
function oa(e) {
  const t = Rl(e);
  return t ? Array.from(t.querySelectorAll(qg)) : [];
}
function Rl(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function $b(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && kl(e, n)) ?? null;
}
function Eb(e, t) {
  return e.getAttribute(Ce) === t ? !0 : Array.from(e.querySelectorAll(`[${Ce}]`)).some((n) => n.getAttribute(Ce) === t);
}
function Sb(e) {
  return e.getAttribute(Ce) ?? e.querySelector(`[${Ce}]`)?.getAttribute(Ce) ?? null;
}
function kl(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Cb(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Ib(e) {
  const t = wl(), n = en(e.rollCard).state, r = Kr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Fe(a), s = Os(a);
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
function Lb(e) {
  const { rollCard: t } = e, n = Nb(), r = wl(), a = en(t).state, o = Kr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Fe(s), c = Db(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: I(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: I(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: vb(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: I("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: I("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: I("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: I("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: I("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: I("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: I("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: I("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: I("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: I("half", !1, !1, !1, !!e.halfButtonSkipped),
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
    normalButton: I("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: I("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function vb(e) {
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
function I(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function Db(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Nb() {
  try {
    return ud();
  } catch {
    return "assisted";
  }
}
function wl() {
  try {
    return Mr();
  } catch {
    return "strict";
  }
}
const Pb = "data-paranormal-toolkit-damage-resolution-state", $o = "data-paranormal-toolkit-damage-icon-enhanced", ia = "data-paranormal-toolkit-damage-original-label", xb = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, $l = "Outra opção escolhida";
function Ob(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Hg(t, "Aplicar dano"), Mb(e, t);
}
function Mb(e, t) {
  const n = Array.from(t.querySelectorAll(De)), r = So(n, "normal"), a = So(n, "half");
  if (!r || !a) {
    Fb(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Co(r, "normal"), Co(a, "half");
  const o = Lb({
    rollCard: e,
    normalButtonApplied: xt(r),
    halfButtonApplied: xt(a),
    normalButtonSkipped: pr(r),
    halfButtonSkipped: pr(a)
  });
  if (!o.canShowApplyDamage) {
    Io(r), Io(a), Lo(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), Eo(r, o.normalButton), Eo(a, o.halfButton), Lo(t, o.summary.state, o.summary.message);
}
function Eo(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Ub(e, t.visible), zb(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function Fb(e) {
  for (const t of e)
    pr(t) && t.remove();
}
function xt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes($l);
}
function pr(e) {
  return e.textContent?.includes($l) ?? !1;
}
function So(e, t) {
  const n = xb[t];
  return e.find((r) => n.test(Bb(r))) ?? null;
}
function Bb(e) {
  return [
    e.getAttribute(ia),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Co(e, t) {
  if (e.getAttribute($o) === "true") return;
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
  ), e.setAttribute($o, "true"), e.setAttribute(ia, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ye(n));
}
function Io(e) {
  xt(e) || e.remove();
}
function Ub(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function zb(e, t, n, r = "Role resistência") {
  if (!xt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ye(r));
      return;
    }
    e.removeAttribute("aria-disabled"), qb(e, n);
  }
}
function qb(e, t) {
  const n = e.getAttribute(ia) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Gb(t), ye(n)));
}
function Gb(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function Lo(e, t, n) {
  e.setAttribute(Pb, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Jr)?.after(a);
}
const at = "data-paranormal-toolkit-effect-icon-enhanced", Ne = "data-paranormal-toolkit-effect-action-compacted", nn = "data-paranormal-toolkit-effect-resistance-gate", sa = "data-paranormal-toolkit-effect-section", la = "data-paranormal-toolkit-effect-label";
function jb(e) {
  return e.querySelector(`[${sa}="true"]`);
}
function Vb(e) {
  const t = Wb(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Yb(), r = ay(n, e.sourceActions, t);
  return r && n.setAttribute(la, r), Qb(n, t, r), ny(e.rollCard, n, e.after ?? e.fallbackAfter), ry(e.sourceActions, n), n;
}
function Hb(e, t) {
  const n = t.querySelector(De);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = Il(t, n, r), o = El(e, n), s = Ib({
    rollCard: e,
    effectLabel: a,
    applied: ua(n, r),
    effectCanApplyOnSuccessfulResistance: o ? ve(o) === "success" || ve(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? xs(o) : !1
  });
  if (s.applied) {
    iy(n);
    return;
  }
  if (!s.visible) {
    sy(n);
    return;
  }
  if (s.waitingForResistance) {
    ly(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    cy(n, s.compactLabel);
    return;
  }
  uy(n), Cl(n, s.displayLabel);
}
function Wb(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(De) ?? []), n = Array.from(e.existingSection?.querySelectorAll(De) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Kb(e.rollCard, r) ?? r[0] ?? null;
}
function Kb(e, t) {
  const n = en(e).state, r = Ns(n), a = Sl(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = El(e, o, a);
    if (s && Ps(s, r)) return o;
  }
  return null;
}
function El(e, t, n = Sl(e)) {
  const r = ca(t, t.textContent?.trim() ?? ""), a = Yn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Yn(s) === a)) ?? null : null;
}
function Sl(e) {
  const t = Vs(Fp(e));
  if (!t) return [];
  const n = lt(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function Yb() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(sa, "true"), e;
}
function Qb(e, t, n) {
  e.setAttribute(sa, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Zb(e), a = Xb(r);
  a.textContent = "Efeito";
  const o = Jb(e, r), s = ey(o);
  s.textContent = dy(n ?? Il(e, t, t.textContent?.trim() ?? ""));
  const l = ty(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(De)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !ua(t, c) && !oy(t, c) && Cl(t, n ?? c);
}
function Zb(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Xb(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Jb(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function ey(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function ty(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function ny(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ry(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(De)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function ay(e, t, n) {
  const r = e.getAttribute(la);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || ca(n, n.textContent?.trim() ?? "");
}
function ca(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ne(n) !== "efeito aplicado") return n;
  const r = Bp(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && ne(a) !== "aplicado" ? a : null;
}
function ua(e, t) {
  return e.classList.contains(jg) || ne(t).includes("aplicado");
}
function oy(e, t) {
  const n = e.getAttribute(nn);
  if (n === "pending" || n === "resisted") return !0;
  const r = Yn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Cl(e, t) {
  e.getAttribute(Ne) === "true" && e.getAttribute(at) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(at, "true"), e.setAttribute(Vg, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    ea("✦", `${i}__button-icon--effect`),
    ye("Aplicar")
  ));
}
function iy(e) {
  e.getAttribute(Ne) === "true" && ne(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(at, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    ea("✓", `${i}__button-icon--effect-applied`),
    ye("Aplicado")
  ));
}
function Il(e, t, n) {
  const r = e.getAttribute(la) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : ca(t, n) ?? n;
}
function sy(e) {
  ua(e, e.textContent?.trim() ?? "") || e.remove();
}
function ly(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ne), e.removeAttribute(at), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(nn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ye(t));
}
function cy(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ne), e.removeAttribute(at), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(nn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    ea("✓", `${i}__button-icon--effect-resisted`),
    ye(t)
  );
}
function uy(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(nn), e.removeAttribute("aria-disabled");
}
function dy(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const my = "data-paranormal-toolkit-card-layout-normalized";
function fy(e) {
  const t = py(e.rollCard), n = gy(t);
  return bb({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function py(e) {
  return {
    rollCard: e,
    damageSection: _b(e),
    resistance: e.querySelector(zr),
    damageActions: Tb(e),
    effectActionSource: Rb(e),
    effectSection: jb(e)
  };
}
function gy(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(my, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = ut(t, "Conjuração"), c = hy({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), Ob(t, a));
  const u = Vb({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: by(n, c),
    fallbackAfter: l
  });
  return u && Hb(t, u), u;
}
function hy(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function by(e, t) {
  return e ?? t;
}
const Ll = [0, 80, 180, 400, 900, 1600, 3e3], vo = /* @__PURE__ */ new WeakSet();
function yy(e) {
  vl(e), Ay(e);
}
function vl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Dl(t);
}
function Ay(e) {
  if (!vo.has(e)) {
    vo.add(e);
    for (const t of Ll)
      globalThis.setTimeout(() => {
        vl(e);
      }, t);
  }
}
function Dl(e) {
  const t = fy({
    rollCard: e,
    refreshDelaysMs: Ll,
    onRefresh: () => Dl(e)
  });
  Ah({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const _y = "data-paranormal-toolkit-resistance-roll-result-enhanced", Do = "data-paranormal-toolkit-resistance-original-description", Ty = "data-paranormal-toolkit-resistance-skill", Ry = "data-paranormal-toolkit-resistance-skill-label", ky = `${i}__resistance--without-roll-button`, wy = ["Fortitude", "Reflexos", "Vontade"];
function $y(e) {
  for (const t of Array.from(e.querySelectorAll(zr)))
    Ey(t);
  yy(e);
}
function Ey(e) {
  const t = e.querySelector(wm), n = e.querySelector(hs), r = e.querySelector(Zt), a = vy(r) ? r : null, o = e.querySelector(bs);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(ky, !a);
  const s = Ly(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), Py(o)), Sy(e, r, n), a && (By(a), a.parentElement !== e && e.append(a));
}
function Sy(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = Iy(n), o = Zs({
    description: a,
    skillLabel: Dy(t, a),
    difficulty: Wr(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  Cy(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function Cy(e, t) {
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
  const t = e.getAttribute(Do);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(Do, n), n;
}
function Ly(e, t) {
  const n = e.querySelector(`.${Ja}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Ja), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function vy(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function Dy(e, t) {
  const n = e?.getAttribute(Ry) ?? e?.getAttribute(Ty) ?? null;
  return n || Ny(t);
}
function Ny(e) {
  const t = No(e);
  return wy.find((n) => t.startsWith(No(n))) ?? null;
}
function No(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function Py(e) {
  const t = xy(e.textContent ?? "");
  t && (e.setAttribute(_y, "true"), e.replaceChildren(Fy(t)));
}
function xy(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Oy(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Oy(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: My(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function My(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Fy(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Uy(e);
  return r && t.append(r), t;
}
function By(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = en(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function Uy(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of zy(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function zy(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Po(e, "highest") : n.includes("kl") ? Po(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Po(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function qy(e) {
  for (const t of Array.from(e.querySelectorAll(Tm))) {
    const n = Yy(t);
    Gy(t), n && (jy(t, n), Vy(t, n));
  }
}
function Gy(e) {
  for (const t of Array.from(e.querySelectorAll(Rm)))
    t.remove();
}
function jy(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(gs) ?? null, a = r?.querySelector(_m) ?? null, o = r ?? e, s = o.querySelector(Sm);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = mA(t.elementTone), l.textContent = dA(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Vy(e, t) {
  const n = Hy(e);
  Wy(e, n);
  const r = Ky(t);
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
  const o = e.querySelector(ys);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Hy(e) {
  return e.closest(`.${i}`)?.querySelector(gs) ?? null;
}
function Wy(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Cm)))
      a.remove();
}
function Ky(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Wn(e.target)}` : null,
    e.duration ? `Duração: ${Wn(e.duration)}` : null,
    e.resistance ? `Resistência: ${fs(e.resistance)}` : null
  ].filter(Kt);
}
function Yy(e) {
  const t = Qy(e), n = nA(e), a = (t ? tA(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = da(B(a, "element")), l = K("op.elementChoices", s) ?? xo(ue(o, "Elemento")) ?? xo(n.damageType), c = s ?? fA(l), u = B(a, "circle") ?? ue(o, "Círculo"), m = oA(a) ?? ue(o, "Alvo"), h = cA(a, "duration", "op.durationChoices") ?? ue(o, "Duração"), k = rA(e) ?? sA(a) ?? ue(o, "Resistência"), _ = aA(o) ?? n.cost, T = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: _,
    target: m,
    duration: h,
    resistance: k
  };
  return uA(T) ? T : null;
}
function Qy(e) {
  const t = Zy(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Qt), r = Jy(n);
  if (r.length === 0) return null;
  const a = Xy(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Zy(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Fr()?.messages?.get?.(n) ?? null : null;
}
function Xy(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Xa}]`))) {
    const a = r.getAttribute(Xa)?.trim();
    a && n.add(a);
  }
  return n;
}
function Jy(e) {
  if (!Wt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(eA).filter((n) => n !== null) : [];
}
function eA(e) {
  return Wt(e) ? {
    pendingId: Et(e.pendingId),
    actorId: Et(e.actorId),
    itemId: Et(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Dd) : []
  } : null;
}
function tA(e) {
  if (!e.itemId) return null;
  const t = Fr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function nA(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(km))) {
    const a = Me(r.textContent);
    if (!a) continue;
    const o = vd(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function rA(e) {
  const t = Me(e.querySelector(hs)?.textContent);
  return t ? fs(t) : null;
}
function ue(e, t) {
  const n = nt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || nt(r.slice(0, a)) !== n))
      return Me(r.slice(a + 1));
  }
  return null;
}
function aA(e) {
  const t = ue(e, "Custo") ?? ue(e, "PE");
  return t || (e.map(Me).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function oA(e) {
  const t = B(e, "target");
  if (!t) return null;
  if (t === "area")
    return iA(e) ?? K("op.targetChoices", t) ?? "Área";
  const n = K("op.targetChoices", t) ?? te(t);
  return [t === "people" || t === "creatures" ? B(e, "targetQtd") : null, n].filter(Kt).join(" ");
}
function iA(e) {
  const t = B(e, "area.name"), n = B(e, "area.size"), r = B(e, "area.type"), a = t ? K("op.areaChoices", t) ?? te(t) : null, o = r ? K("op.areaTypeChoices", r) ?? te(r) : null;
  return a ? n ? o ? `${a} ${n}m ${Wn(o)}` : `${a} ${n}m` : a : null;
}
function sA(e) {
  const t = B(e, "skillResis"), n = B(e, "resistance");
  if (!t || !n) return null;
  const r = K("op.skill", t) ?? te(t), a = lA(n);
  return [r, a].filter(Kt).join(" ");
}
function lA(e) {
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
      return K("op.resistanceChoices", e) ?? te(e);
  }
}
function cA(e, t, n) {
  const r = B(e, t);
  return r ? K(n, r) ?? te(r) : null;
}
function uA(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function dA(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function mA(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Kt).join(" ");
}
function da(e) {
  const t = nt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function xo(e) {
  const t = da(e);
  return t ? K("op.elementChoices", t) ?? te(t) : e ? te(e) : null;
}
function fA(e) {
  return da(e);
}
function K(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Fr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Oo = "data-paranormal-toolkit-dice-toggle-enhanced";
function pA(e) {
  for (const t of Array.from(e.querySelectorAll(As)))
    Nl(t);
}
function gA(e) {
  const t = xl(e.target);
  if (!t) return;
  const n = ma(t);
  n && (e.preventDefault(), Pl(n, t));
}
function hA(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = xl(e.target);
  if (!t) return;
  const n = ma(t);
  n && (e.preventDefault(), Pl(n, t));
}
function Nl(e) {
  const t = e.querySelector(Xt);
  if (!t) return;
  const n = e.querySelector(Gr);
  if (n && n.getAttribute(Oo) !== "true" && (n.setAttribute(Oo, "true"), n.classList.add(jr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Pl(e, t) {
  const n = e.querySelector(Xt);
  if (!n) return;
  const r = !e.classList.contains(qr);
  bA(e, t, n, r);
}
function bA(e, t, n, r) {
  e.classList.toggle(qr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function xl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Gr);
  if (!t) return null;
  const n = ma(t);
  return n ? (Nl(n), t.classList.contains(jr) ? t : null) : null;
}
function ma(e) {
  const t = e.closest(As);
  return t && t.querySelector(Xt) ? t : null;
}
const Mo = `${d}-workflow-dice-toggle-styles`;
function yA() {
  if (document.getElementById(Mo)) return;
  const e = document.createElement("style");
  e.id = Mo, e.textContent = `
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
const AA = [0, 100, 500, 1500, 3e3];
let Fo = !1, $n = null;
function _A() {
  if (!Fo) {
    Fo = !0, yA(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ze(Hn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ze(Hn(t));
    }), Hooks.once("ready", () => {
      Ze(document), TA();
    }), document.addEventListener("click", gA), document.addEventListener("keydown", hA);
    for (const e of AA)
      globalThis.setTimeout(() => Ze(document), e);
  }
}
function TA() {
  $n || !document.body || ($n = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ze(n);
  }), $n.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ze(e) {
  e && (Hm(e), qy(e), $y(e), pA(e), Fm(e));
}
function RA() {
  _A();
}
const kA = "data-paranormal-toolkit-action-section", wA = "ritual-log", $A = ".paranormal-toolkit-item-use-prompt__actions", EA = ".paranormal-toolkit-item-use-prompt__actions-title", SA = [0, 100, 500, 1500];
let Bo = !1;
function CA() {
  if (Bo) return;
  const e = (t, n) => {
    Uo(DA(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Uo(document), Bo = !0;
}
function Uo(e) {
  for (const t of SA)
    globalThis.setTimeout(() => IA(e), t);
}
function IA(e) {
  LA(e), vA(e);
}
function LA(e) {
  for (const t of e.querySelectorAll(
    `[${kA}="${wA}"]`
  ))
    t.remove();
}
function vA(e) {
  for (const t of e.querySelectorAll($A)) {
    if (zo(t.querySelector(EA)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => zo(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function DA(e) {
  if (e instanceof HTMLElement || NA(e))
    return e;
  if (PA(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function NA(e) {
  return e instanceof HTMLElement;
}
function PA(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function zo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Xe = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ol = {
  PV: "system.attributes.hp"
}, gr = {
  PV: [Xe.PV, Ol.PV],
  SAN: [Xe.SAN],
  PE: [Xe.PE],
  PD: [Xe.PD]
}, hr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class xA {
  getResource(t, n) {
    const r = qo(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = jo(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = jo(t, n, s, c, "valor máximo");
    return m ? p(m) : b({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = qo(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function qo(e, t) {
  const n = OA(e.type, t);
  if (n && Go(e, n))
    return b(n);
  const r = gr[t].find(
    (a) => Go(e, a)
  );
  return r ? b(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: MA(e, t),
    path: gr[t].join(" | ")
  });
}
function OA(e, t) {
  return e === "threat" ? Ol[t] ?? null : e === "agent" ? Xe[t] : null;
}
function Go(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function MA(e, t) {
  const n = e.type ?? "unknown", r = gr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function jo(e, t, n, r, a) {
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
class FA {
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
      const s = hr.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = BA(a);
    return o ? b(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of hr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function BA(e) {
  if (Vo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Vo(n))
      return n;
  }
  return null;
}
function Vo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const UA = "dice-so-nice";
async function Ml(e) {
  if (!zA() || !qA()) return;
  const t = GA();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function zA() {
  try {
    return Am().enabled;
  } catch {
    return !1;
  }
}
function qA() {
  return game.modules?.get?.(UA)?.active === !0;
}
function GA() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Ho = "occultism";
class Fl {
  getDifficulty(t) {
    return jA(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await HA(t, Ho);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Ml(r);
    const a = YA(r);
    return {
      skill: Ho,
      skillLabel: "Ocultismo",
      roll: r,
      formula: KA(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: QA(r)
    };
  }
}
function jA(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function VA(e) {
  return new Fl().rollCastingCheck(e);
}
async function HA(e, t) {
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
  return WA(r);
}
function WA(e) {
  return Wo(e) ? e : Array.isArray(e) ? e.find(Wo) ?? null : null;
}
function Wo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function KA(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function YA(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function QA(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(ZA);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function ZA(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const XA = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class JA {
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
    const r = n.value, a = e_(t.ritual, r);
    return a.ok ? a.value ? b(a.value) : b({
      resource: "PE",
      amount: XA[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function e_(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : t_(n) ? {
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
function t_(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class n_ {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return En("missing-item-patch");
    if (t.type !== "ritual") return En("unsupported-item-type");
    const a = r_(r);
    return Object.keys(a).length === 0 ? En("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function r_(e) {
  const t = {};
  v(t, "name", e.name), v(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (v(t, "system.circle", n.circle), v(t, "system.element", n.element), v(t, "system.target", n.target), v(t, "system.targetQtd", n.targetQuantity), v(t, "system.execution", n.execution), v(t, "system.range", n.range), v(t, "system.duration", n.duration), v(t, "system.skillResis", n.resistanceSkill), v(t, "system.resistance", n.resistance), v(t, "system.studentForm", n.studentForm), v(t, "system.trueForm", n.trueForm)), t;
}
function v(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function En(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class a_ {
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
    return this.getNumber(t, hr.ritual.dt, 0);
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
class o_ {
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
class i_ {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = s_(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Sn(t)), b(t)) : n;
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
    return n ? Sn(n) : null;
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
    return Array.from(this.presets.values()).map(Sn);
  }
  findForItem(t) {
    return this.list().map((n) => l_(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function s_(e) {
  return !Cn(e.id) || !Cn(e.version) || !Cn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : b(e);
}
function l_(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = c_(a, t);
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
function c_(e, t) {
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
      const n = Ko(t.name), r = e.names.map(Ko).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = u_(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Ko(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function u_(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Sn(e) {
  return structuredClone(e);
}
function Cn(e) {
  return typeof e == "string" && e.length > 0;
}
function Ot(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : b(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = rn(e.amountFrom);
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
function rn(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function d_(e, t, n) {
  if (!Yo(e.id) || !Yo(e.formula))
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
    await Ml(a);
    const l = {
      ...n.rollRequests[e.id] ?? Bl(e, t),
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
function Bl(e, t) {
  const n = e.intent ?? m_(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function m_(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Yo(e) {
  return typeof e == "string" && e.length > 0;
}
async function Mt(e, t, n, r, a) {
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
function f_(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = p_(t, n, r, a);
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
    const s = g_(t, n, r, a);
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
function p_(e, t, n, r) {
  const a = rn(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Ul(t.id, "damage", r, t.damageInstances.length),
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
function g_(e, t, n, r) {
  const a = rn(e.amountFrom);
  return {
    id: Ul(t.id, "healing", r, t.healingInstances.length),
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
function Ul(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function h_(e, t, n) {
  const r = rn(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function b_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), zl("before", e), Qo("before", e), Qo("resolve", e);
}
function y_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), zl("apply", e);
}
function A_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function zl(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = __(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Qo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function __(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function T_(e, t, n) {
  return b(void 0);
}
async function R_(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return k_(e, t);
    case "spendRitualCost":
      return w_(e, t);
  }
}
async function k_(e, t) {
  const { context: n, resources: r } = e, a = Ot(t, n);
  return a.ok ? ql(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function w_(e, t) {
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
  }), ql(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function ql(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function $_(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = E_(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function E_(e) {
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
class S_ {
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
        return $_({
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
    const a = await R_({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? b(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Bl(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await d_(t, r, n);
    return a.ok ? b(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Ot(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = h_(t, n, a.value);
    b_({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), y_({
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
      const c = await Mt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      f_({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return A_({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), b(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Ot(t, n);
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
      const l = await Mt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return b(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await T_(this.messages);
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
    const l = C_(t, n.intent);
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
function C_(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class I_ {
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
class L_ {
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
class v_ {
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
function Gl(e) {
  return {
    id: D_(),
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
function D_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class N_ {
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
    const r = Gl(n);
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
class P_ {
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
class x_ {
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
    const n = qn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: O_(),
      flags: {
        ...t.flags,
        [d]: {
          ...M_(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = qn();
    if (!r.enabled)
      return;
    const a = n.notification ?? Zo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Zo(n);
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
function Zo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function O_() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function M_(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const F_ = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", jl = `${d}-inline-roll-neutralized`, B_ = `${d}-inline-roll-notice`, fa = `data-${d}-inline-roll-neutralized`, Xo = `data-${d}-inline-roll-notice`, U_ = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Jo(e) {
  const t = eT(e.message), n = await z_(e.message), r = q_(t);
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
async function z_(e) {
  const t = Z_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = G_(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await X_(t, n.content), replacementCount: n.replacementCount };
}
function q_(e) {
  const t = e ? J_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Vl(t);
  return n > 0 && Hl(K_(t)), { replacementCount: n };
}
function G_(e) {
  const t = j_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Vl(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Hl(n.content), { content: n.innerHTML, replacementCount: a });
}
function j_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, H_(a.trim()))), replacementCount: t };
}
function Vl(e) {
  const t = V_(e);
  for (const n of t)
    n.replaceWith(W_(Y_(n)));
  return t.length;
}
function V_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(F_))
    n.getAttribute(fa) !== "true" && t.add(n);
  return Array.from(t);
}
function H_(e) {
  return `<span class="${jl}" ${fa}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${tT(e)}</span>`;
}
function W_(e) {
  const t = document.createElement("span");
  return t.classList.add(jl), t.setAttribute(fa, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Hl(e) {
  if (e.querySelector?.(`[${Xo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(B_), t.setAttribute(Xo, "true"), t.textContent = U_, e.append(t);
}
function K_(e) {
  return e.querySelector(".message-content") ?? e;
}
function Y_(e) {
  const n = e.getAttribute("data-formula") ?? Q_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Q_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Z_(e) {
  return e && typeof e == "object" ? e : null;
}
async function X_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function J_(e) {
  const t = nT(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function eT(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function tT(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function nT(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ft = "ritualRollConfig", Bt = "ritual-roll", rT = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function an() {
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
function Wl(e) {
  const t = e.getFlag(d, Ft);
  return br(t);
}
function Kl(e) {
  return Wl(e) ?? an();
}
async function aT(e, t) {
  const n = br(t) ?? br({
    ...an(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Ft, n), n;
}
async function oT(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Ft));
    return;
  }
  await e.setFlag(d, Ft, null);
}
function br(e) {
  if (!on(e)) return null;
  const t = gT(e.intent);
  if (!t) return null;
  const n = an();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: yr(e.damageType),
    utilityLabel: yr(e.utilityLabel) ?? n.utilityLabel,
    note: pa(e.note),
    forms: bT(e.forms)
  };
}
function iT(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function sT(e) {
  const t = Wl(e), n = Yl(e);
  if (!t)
    return ei(e, n);
  const r = fT(e, t);
  if (!r)
    return ei(e, n);
  const a = lT(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...cT(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: dT(e, t),
    resistance: n
  };
}
function ei(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: mT(e),
    resistance: t
  } : null;
}
function lT(e, t) {
  const n = {
    type: "rollFormula",
    id: Bt,
    formula: t,
    intent: pT(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function cT(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Bt}.total`,
          ...uT(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Bt}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function uT(e) {
  return e ? { damageType: e } : {};
}
function dT(e, t) {
  const n = {
    base: In("Padrão", t.forms.base.formula)
  };
  return Pe(e, "discente") && (n.discente = In("Discente", t.forms.discente.formula, 2)), Pe(e, "verdadeiro") && (n.verdadeiro = In("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function In(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Bt]: t.trim()
    }
  };
}
function mT(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Pe(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Pe(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function fT(e, t) {
  return [
    t.forms.base.formula.trim(),
    Pe(e, "discente") ? t.forms.discente.formula.trim() : "",
    Pe(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Yl(e) {
  const t = Ql(e), n = yr(t.skillResis), r = hT(t.resistance);
  if (!n || !r) return;
  const a = yT(n), o = rT[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function pT(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function gT(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function hT(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function bT(e) {
  const t = an();
  return on(e) ? {
    base: Ln(e.base),
    discente: Ln(e.discente),
    verdadeiro: Ln(e.verdadeiro)
  } : t.forms;
}
function Ln(e) {
  return on(e) ? { formula: pa(e.formula) } : { formula: "" };
}
function Pe(e, t) {
  const n = Ql(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return AT(r);
}
function Ql(e) {
  const t = e.system;
  return on(t) ? t : {};
}
function yT(e) {
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
function AT(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function pa(e) {
  return typeof e == "string" ? e.trim() : "";
}
function yr(e) {
  const t = pa(e);
  return t.length > 0 ? t : null;
}
function on(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _T(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function TT(e) {
  switch (RT(e)) {
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
      return kT(String(e ?? ""));
  }
}
function RT(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function kT(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function wT() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function $T(e) {
  return {
    ...ga(e),
    type: "ritual.cast.started"
  };
}
function ET(e) {
  return {
    ...ga(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function ST(e) {
  return {
    ...ga(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function CT(e) {
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
function IT(e, t = {}) {
  const n = jT(e), r = [
    ...HT(t.candidates ?? []),
    ...WT(e)
  ], a = YT(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = VT(t) ?? QT(r) ?? XT(a), s = eR(canvas?.grid?.size), l = LT(o, a, r), c = FT(r), u = MT(l);
  return {
    type: "rectangleRay",
    sceneId: JT(e, n),
    regionId: si(n?.id) ?? si(e.id),
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
function LT(e, t, n) {
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
    direction: vT(r, t, n)
  };
}
function vT(e, t, n) {
  const r = DT(n);
  return r !== null ? r : PT(e, t) ?? e.direction;
}
function DT(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = ti(n, t);
    if (r !== null) return r;
    const a = sn(n), o = ti(a, t);
    if (o !== null) return o;
  }
  return null;
}
function ti(e, t) {
  for (const n of t) {
    const r = NT(x(e, n));
    if (r !== null) return r;
  }
  return null;
}
function NT(e) {
  const t = ot(e);
  if (t === null) return null;
  const n = ba(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function PT(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = ri(ni(e, e.direction), t), r = xT(e, t);
  if (r === null) return null;
  const o = OT([
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
    error: ri(ni(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? ba(o.direction) : null;
}
function xT(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = li(o, 0, 1), c = li(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : tR(Math.atan2(c, l));
}
function ni(e, t) {
  const n = Xl(t), r = {
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
function ri(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function OT(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = ba(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function MT(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Xl(e.direction), n = {
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
function FT(e) {
  for (const t of e) {
    const n = ai(t, "ray.start"), r = ai(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function ai(e, t) {
  const n = x(e, t), r = ot(x(n, "x")), a = ot(x(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function ga(e) {
  const t = CT(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: zT(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: BT(e.context.item, e.form, e.formLabel, t),
    targets: n.map(qT),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function BT(e, t, n, r) {
  return {
    name: e.name,
    slug: vn(e, "system.slug") ?? vn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: vn(e, "system.element"),
    circle: GT(e),
    form: UT(t),
    formLabel: n
  };
}
function UT(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function zT(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function qT(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function GT(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : me(t);
}
function vn(e, t) {
  return me(foundry.utils.getProperty(e, t));
}
function me(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function jT(e) {
  return "document" in e && e.document ? e.document : e;
}
function VT(e) {
  return Zl(e.shape);
}
function HT(e) {
  return e.filter(ha);
}
function WT(e) {
  return [
    e,
    KT(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(ha);
}
function KT(e) {
  return "object" in e && ha(e.object) ? e.object : null;
}
function ha(e) {
  return !!(e && typeof e == "object");
}
function YT(e) {
  for (const t of e) {
    const n = oi(x(sn(t), "bounds"));
    if (n) return n;
    const r = oi(x(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function oi(e) {
  const t = E(e, "x"), n = E(e, "y"), r = E(e, "width"), a = E(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function E(e, t) {
  return ot(x(e, t));
}
function QT(e) {
  for (const t of e) {
    const n = ZT(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function ZT(e) {
  if (!e || typeof e != "object") return [];
  const t = ii(sn(e));
  return t.length > 0 ? t : ii(e);
}
function ii(e) {
  const t = x(e, "shapes");
  return Array.isArray(t) ? t.map(Zl).filter((n) => n !== null) : [];
}
function Zl(e) {
  const t = sn(e) ?? e, n = x(t, "type");
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
function XT(e) {
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
function JT(e, t) {
  return Dn(e, "parent.id") ?? Dn(e, "document.parent.id") ?? Dn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Dn(e, t) {
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
function sn(e) {
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
function si(e) {
  return me(e);
}
function ot(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function eR(e) {
  const t = ot(e);
  return t !== null && t > 0 ? t : null;
}
function Xl(e) {
  return e * Math.PI / 180;
}
function tR(e) {
  return e * 180 / Math.PI;
}
function ba(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function li(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class nR {
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
class ln {
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
const rR = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class aR {
  constructor(t = new ln()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = oR(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(rR);
  }
}
function oR(e, t) {
  const n = [], r = iR(e), a = ci(r), o = ci(e);
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
function iR(e) {
  return sR(e) ? e.document ?? null : e;
}
function sR(e) {
  return "bounds" in e;
}
function ci(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const lR = 100, cR = 12;
class uR {
  constructor(t = new ln()) {
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
      const a = this.foundryAdapter.getGridSize() ?? lR, o = gR(n), s = await this.foundryAdapter.placeRegion(
        dR(t, this.foundryAdapter.getUserColor(), a),
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
        message: pR(a)
      };
    }
  }
}
function dR(e, t, n) {
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
    shapes: [mR(e, n)]
  };
}
function mR(e, t) {
  const n = fR(e, t);
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
function fR(e, t) {
  return {
    length: di(e.length, cR, t),
    width: di(e.width, 1, t)
  };
}
function di(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function pR(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function gR(e) {
  const t = (n) => {
    const r = hR(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function hR(e) {
  return bR(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function bR(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class yR {
  constructor(t = new ln()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(mi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(mi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = AR(t);
    _R(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function mi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function AR(e) {
  return Array.from(new Set(e));
}
function _R(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class TR {
  constructor(t = new ln()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(ts)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(RR(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(kR(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: Ar(r.region)
    }));
    for (const r of t) {
      if (!Ar(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = $R(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function RR(e) {
  return [
    { source: "document", region: de(e.document) },
    { source: "document.object", region: de(e.document.object) },
    { source: "preview", region: de(e.preview) },
    { source: "preview.document.object", region: de(e.preview?.document?.object) }
  ];
}
function kR(e) {
  return [
    { source: "input", region: de(e) },
    { source: "input.object", region: wR(e) ? de(e.object) : null },
    { source: "input.document.object", region: Jl(e) ? de(e.document?.object) : null }
  ];
}
function de(e) {
  return Ar(e) ? e : null;
}
function Ar(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return Tt(n.x) && Tt(n.y) && Tt(n.width) && Tt(n.height);
}
function Jl(e) {
  return "document" in e && "bounds" in e;
}
function wR(e) {
  return !Jl(e);
}
function $R(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function Tt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class ER {
  async minimizeForPlacement() {
    const t = [];
    for (const n of IR())
      await SR(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await CR(n);
      }
    };
  }
}
async function SR(e) {
  if (ec(e) || !MR(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function CR(e) {
  if (ec(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function IR() {
  const e = /* @__PURE__ */ new Set();
  for (const t of LR())
    NR(t) && PR(t) && e.add(t);
  return [...e];
}
function LR() {
  return [
    ...fi(vR()),
    ...fi(DR())
  ];
}
function fi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function vR() {
  return globalThis.ui?.windows ?? null;
}
function DR() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function NR(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function PR(e) {
  const t = xR(e), n = OR(t);
  return n === "Actor" || n === "Item";
}
function xR(e) {
  return e.document ?? e.object ?? null;
}
function OR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function MR(e) {
  const t = FR(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function FR(e) {
  const t = e.element;
  if (pi(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (pi(n)) return n;
  }
  return null;
}
function pi(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function ec(e) {
  return e.minimized === !0;
}
const BR = "Nenhum alvo encontrado na linha.";
class UR {
  constructor(t = new uR(), n = new TR(), r = new aR(), a = new yR(), o = new nR(), s = new ER()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = qR(r), m = IT(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(BR), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = zR(c);
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
function zR(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function qR(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function GR(e) {
  return {
    header: {
      eyebrow: Gi,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: ZR(e.ritual)
    },
    forms: e.variantOptions.map((t) => jR(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: WR(e.targetNames, e.variantOptions, e.ritual),
    automation: QR(e.automationStatus ?? "assisted")
  };
}
function jR(e, t) {
  const n = VR(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? HR(t) : "—",
    details: n
  };
}
function VR(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function HR(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function WR(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => KR(a, n))
  };
}
function KR(e, t) {
  const n = e.targeting ?? YR(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function YR(e, t) {
  const n = lt(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function QR(e) {
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
function ZR(e) {
  const t = e.system, n = [JR(t?.element), XR(t?.circle)].filter(nk);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function XR(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function JR(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (ek(e)) {
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
      return tk(e);
  }
}
function ek(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function tk(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function nk(e) {
  return typeof e == "string" && e.length > 0;
}
const tc = ["base", "discente", "verdadeiro"];
function ya(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ut(e) {
  return typeof e == "string" && tc.includes(e);
}
const { ApplicationV2: rk } = foundry.applications.api;
class tt extends rk {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = GR(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    ik(a, (o) => {
      this.selectedVariant = o, _r(a, o);
    }), _r(a, this.selectedVariant), sk(a, (o) => {
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
          ${this.model.forms.map(ak).join("")}
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
          ${this.model.targets.forms.map(ok).join("")}
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
    const n = dk(t), r = lk(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function ak(e) {
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
function ok(e) {
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
function ik(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => gi(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), gi(e, a, t));
    });
  const r = nc(e);
  r && t(r);
}
function gi(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Ut(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), nc(e), _r(e, r.value));
}
function nc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Ut(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function _r(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function sk(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function lk(e, t, n) {
  const r = uk(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = ck(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function ck(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function uk(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Ut(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Ut(n) ? n : null;
}
function dk(e) {
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
async function mk(e) {
  return tt.request(e);
}
const Aa = {
  label: "Padrão"
}, fk = {
  label: "Discente",
  extraCost: 2
}, pk = {
  label: "Verdadeiro",
  extraCost: 5
};
class gk {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new UR();
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
    const a = this.resolveCostPreview(t), o = cw(n), s = iw(
      n,
      t.item,
      a,
      o
    ), l = await mk({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((S) => S.name),
      cost: a,
      defaultSpendResource: gw(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = hk(l), u = dw(
      n,
      t.item,
      c.variant,
      o
    ), m = wT(), h = u.label ?? ya(c.variant), k = Rk(u), _ = (S = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: h,
      targets: S
    }), T = (S, C = t.targets, Ae = {}) => {
      this.ritualEvents.emitCastFinished(
        ST({
          ..._(C),
          status: S,
          ...Ae
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      $T(_())
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
    const A = bk(
      t,
      w.targets
    );
    w.areaSnapshot && this.ritualEvents.emitAreaResolved(
      ET({
        ..._(w.targets),
        area: w.areaSnapshot
      })
    );
    const je = ls();
    let G = null;
    if (je) {
      const S = await Ak(
        this.resources,
        A.actor,
        c,
        u,
        a
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
      try {
        const C = await VA(
          A.actor
        );
        G = kk(
          C,
          u,
          a
        );
      } catch (C) {
        const Ae = C instanceof Error ? C.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return T("failed", A.targets, {
          reason: "ritual-casting-check-failed",
          message: Ae
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: Ae,
          cause: C
        };
      }
    }
    const Ve = yk(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !je
      }
    );
    if (Ve.steps.length === 0) {
      const S = uw(
        A,
        c
      ), C = bi(
        n,
        A
      ), Ae = hi(
        A.actor,
        G,
        u,
        a
      ), Na = yi(
        n,
        c,
        u,
        a,
        S,
        A,
        G
      );
      if (!C.ok)
        return T("failed", A.targets, {
          reason: C.reason,
          message: C.message
        }), {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      const Pa = [
        ...Ae,
        ...C.actions
      ];
      return Pa.length > 0 ? (T("ready", A.targets), {
        status: "ready",
        workflowContext: S,
        itemUseContext: A,
        actions: Pa,
        summaryLines: Na
      }) : (T("completed-without-actions", A.targets), {
        status: "completed-without-actions",
        workflowContext: S,
        itemUseContext: A,
        summaryLines: Na
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
    const ae = M.value.context, F = Ik(
      n,
      A,
      ae,
      k
    ), Z = bi(
      n,
      A
    ), Vc = hi(
      A.actor,
      G,
      u,
      a
    ), va = yi(
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
    const Da = [
      ...Vc,
      ...F.actions,
      ...Z.actions
    ];
    return Da.length === 0 ? (T("completed-without-actions", A.targets), {
      status: "completed-without-actions",
      workflowContext: ae,
      itemUseContext: A,
      summaryLines: va
    }) : (T("ready", A.targets), {
      status: "ready",
      workflowContext: ae,
      itemUseContext: A,
      actions: Da,
      summaryLines: va
    });
  }
  async applyAction(t) {
    return Mt(
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
function hk(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function bk(e, t) {
  return {
    ...e,
    targets: t
  };
}
function yk(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Ta(l) && (!a.includeCostSteps || !s))
      continue;
    const c = _k(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && hw(n.extraCost) && o.push({
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
async function Ak(e, t, n, r, a) {
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
function _k(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = Tk(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function Tk(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function Rk(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function kk(e, t, n) {
  const a = wk(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function wk(e, t) {
  const n = Ue(e, t);
  return n ? _T(n.amount) : null;
}
function hi(e, t, n, r) {
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
function bi(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = _a(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = $s(o);
      n.push(
        $k(
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
function $k(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? Ck(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: Ek(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Sk(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Ek(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Sk(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Ck(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Ik(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || Lk(s, r)) continue;
    const l = Ot(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = _a(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (vk(s)) {
        Dk(
          o,
          u,
          Nk(s, n, l.value)
        );
        continue;
      }
      a.push(xk(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...Pk(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function Lk(e, t) {
  const n = rc(e.amountFrom);
  return n !== null && t.has(n);
}
function vk(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Dk(e, t, n) {
  const r = Bk(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Nk(e, t, n) {
  const r = rc(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function Pk(e, t, n, r) {
  const a = Gk(e), o = a.length > 1 ? Hk() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const h = jk(u.amount, s);
        return {
          id: Ok(u, s, m),
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
      label: Mk(c, s, a.length > 1),
      executedLabel: Fk(
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
function xk(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = qk(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Uk(e, r, n),
    executedLabel: zk(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Ok(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Mk(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Fk(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Bk(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function rc(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Uk(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function zk(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function qk(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Gk(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function jk(e, t) {
  const n = e * t.multiplier, r = Vk(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Vk(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Hk() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function _a(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function yi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${ya(t.variant)}`,
    Qk(t, n, r),
    ...Yk(s),
    ...Object.values(a.rolls).flatMap(Zk),
    ...Wk(e, o),
    ...Xk(e.resistance),
    ...aw(n)
  ];
}
function Wk(e, t) {
  return Kk(e) ? _a("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Kk(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Yk(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Qk(e, t, n) {
  const r = Ue(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Zk(e) {
  const n = [`${ow(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = Jk(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${TT(e.damageType)}`), n;
}
function Xk(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Jk(e) {
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
    const s = ew(o);
    s && (rw(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function ew(e) {
  const t = tw(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : nw(e);
}
function tw(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function nw(e) {
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
function rw(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function aw(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function ow(e) {
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
function iw(e, t, n, r) {
  return tc.map((a) => {
    const o = ac(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? ya(a),
      enabled: s,
      details: o ? sw(o, n) : [],
      finalCostText: o ? lw(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function sw(e, t, n) {
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
function lw(e, t) {
  const n = Ue(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function cw(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Ta);
}
function uw(e, t) {
  return Gl({
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
function dw(e, t, n, r) {
  return ac(e, t, n, r) ?? Aa;
}
function ac(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? fw(t, n) ? mw(n) : null : n === "base" ? Aa : null);
}
function mw(e) {
  switch (e) {
    case "base":
      return Aa;
    case "discente":
      return fk;
    case "verdadeiro":
      return pk;
  }
}
function fw(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return pw(foundry.utils.getProperty(e, n));
}
function pw(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function gw(e) {
  return e.steps.some(Ta);
}
function Ta(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function hw(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const oc = "itemUsePrompts", ic = "chatCard", cn = "data-paranormal-toolkit-prompt-id", un = "data-paranormal-toolkit-pending-id", Ra = "data-paranormal-toolkit-executed-label", Tr = "data-paranormal-toolkit-choice-group", sc = "data-paranormal-toolkit-skipped-label", zt = "data-paranormal-toolkit-action-section", Ai = "data-paranormal-toolkit-detail-key", _i = "data-paranormal-toolkit-roll-card", ka = "data-paranormal-toolkit-roll-detail-toggle", lc = "data-paranormal-toolkit-roll-detail-id", cc = "data-paranormal-toolkit-resistance-roll-button", uc = "data-paranormal-toolkit-resistance-skill", dc = "data-paranormal-toolkit-resistance-skill-label", mc = "data-paranormal-toolkit-resistance-target-actor-id", fc = "data-paranormal-toolkit-resistance-target-name", pc = "data-paranormal-toolkit-resistance-roll-result", Ti = "data-paranormal-toolkit-system-card-replaced", bw = `[${un}]`, yw = `[${ka}]`, Aw = `[${cc}]`, Rr = `${d}-chat-enrichment`, g = `${d}-item-use-prompt`, _w = `${g}__actions`, Ri = `${g}__details`, gc = `${g}__summary`, Tw = `${g}__title`, hc = `${g}__button--executed`, Rt = `${g}__roll-card`, Rw = "data-paranormal-toolkit-roll-card-target-mode", kw = "data-paranormal-toolkit-roll-card-target-names", ww = "data-paranormal-toolkit-roll-card-resistance", $w = "data-paranormal-toolkit-roll-card-resistance-skill", Ew = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let ki = !1, kr = null;
const q = /* @__PURE__ */ new Map(), Sw = [0, 100, 500, 1500, 3e3], Cw = 3e4, Iw = [0, 100, 500, 1500, 3e3];
function Lw(e) {
  if (kr = e, ki) {
    $i(e);
    return;
  }
  const t = (n, r) => {
    yc(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ki = !0, $i(e);
}
async function wi(e) {
  const t = bc(e);
  q.set(e.pendingId, t), await Ea(t) || Lc(t), Ac(e.pendingId);
}
async function vw(e) {
  const t = bc({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", q.set(e.pendingId, t), await Ea(t) || Lc(t), Ac(e.pendingId);
}
async function Nn(e, t) {
  const n = q.get(e);
  q.delete(e), n && await x$(n, t);
}
function wa(e) {
  const t = Oc();
  for (const n of t) {
    const r = Q(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Dw(e, t) {
  const n = wa(e);
  if (!n) return;
  const r = Q(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await ze(n.message, r));
}
async function Nw(e, t, n) {
  if (!t) return;
  const r = wa(e);
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
function bc(e) {
  const t = re(e.context.message), n = e.context.targets.find((s) => Sr(s)), r = n ? Sr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: s$(e.context),
    executed: !1
  };
}
function yc(e, t, n) {
  P$();
  const r = mn(t);
  if (!r) return;
  const a = v$(e, r);
  a.length > 0 && qt(r);
  for (const o of a)
    wr(r, o);
  wc(r, n), $r(r), Er(r);
}
function $i(e) {
  for (const t of Iw)
    globalThis.setTimeout(() => {
      Pw(e);
    }, t);
}
function Pw(e) {
  for (const t of xw()) {
    const n = dn(t);
    Ow(n) && yc(n, t, e);
  }
}
function xw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Ow(e) {
  return e ? Sa(e) ? !0 : M$(e).length > 0 : !1;
}
function Ac(e) {
  const t = q.get(e);
  if (!t) return;
  const n = t.messageId ? D$(t.messageId) : null;
  if (n) {
    Li(n, t), qt(n), wr(n, t), Ei(n), $r(n), Er(n);
    return;
  }
  if (t.messageId) {
    Ir(t);
    return;
  }
  const r = N$(t);
  if (r) {
    Li(r, t), qt(r), wr(r, t), Ei(r), $r(r), Er(r);
    return;
  }
  Ir(t);
}
function Ei(e) {
  kr && wc(e, kr);
}
function qt(e) {
  const t = Mw();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const n = kc(e);
  if (!n || (n.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || n.getAttribute(Ti) === "true") return;
  const r = n.querySelector(`.${Rr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Ti, "true");
}
function Mw() {
  try {
    return ss() === "replace";
  } catch {
    return !1;
  }
}
function wr(e, t) {
  if (qt(e), e.querySelector(`[${cn}="${qe(t.pendingId)}"]`)) return;
  const n = Bw(e, t);
  zw(n, t);
  const r = r$(t);
  if (Fw(r)) return;
  n$(n, r).append(i$(t));
}
function Fw(e) {
  return Tc(e.id) && !pe();
}
function _c(e) {
  const n = e.closest(`[${zt}]`)?.getAttribute(zt) ?? null;
  return Tc(n) && !pe();
}
function Tc(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Bw(e, t) {
  const n = e.querySelector(`.${Rr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Rr, g);
  const a = document.createElement("header");
  a.classList.add(`${g}__header`);
  const o = document.createElement("span");
  o.classList.add(`${g}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Tw), s.textContent = Uw(t);
  const l = document.createElement("span");
  return l.classList.add(gc), l.textContent = t.summary, a.append(o, s, l), r.append(a), c$(e).append(r), r;
}
function Uw(e) {
  const t = D(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function zw(e, t) {
  const n = t.summaryLines ?? [], r = Cc(n, t);
  if (r) {
    qw(e, r, t);
    return;
  }
  a$(e, n);
}
function qw(e, t, n) {
  if (e.querySelector(`[${_i}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(
    Rt,
    `${Rt}--${t.intent}`,
    `${Rt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && r.classList.add(`${Rt}--multi-target`), r.setAttribute(_i, "true"), r.setAttribute(Rw, t.targetMode), r.setAttribute(kw, JSON.stringify(t.targetNames)), Zw(r, t), t.castingCheck && Si(r, jw(t.castingCheck), n.pendingId, "casting"), Gw(t) && Si(r, Vw(t), n.pendingId, "effect"), Qw(r, t), Xw(r, t, n), t$(r, t), e.append(r);
}
function Gw(e) {
  return e.intent !== "casting";
}
function jw(e) {
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
function Vw(e) {
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
function Si(e, t, n, r) {
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
  Hw(a, t), e$(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function Hw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${g}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${g}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = Ww(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function Ww(e, t) {
  const n = Kw(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-dice-tray`);
  for (const a of Yw(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${g}__workflow-die`), a.active || o.classList.add(`${g}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Kw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Yw(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ci(e, "highest") : n.includes("kl") ? Ci(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ci(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Qw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(tE);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${g}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function Zw(e, t) {
  t.resistance && (e.setAttribute(ww, t.resistance), t.resistanceSkill && e.setAttribute($w, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(Ew, t.resistanceSkillLabel));
}
function Xw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const r = document.createElement("div");
  r.classList.add(`${g}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${g}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Jw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${g}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(Rc(t.resistanceRollResult)), e.append(r);
}
function Jw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !be())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${g}__resistance-roll-button`), n.setAttribute(cn, t.pendingId), n.setAttribute(cc, "true"), n.setAttribute(uc, e.resistanceSkill), n.setAttribute(dc, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(mc, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(fc, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${g}__resistance-roll-button--rolled`), n.setAttribute(pc, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${g}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Rc(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = Ec(e), t;
}
function e$(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${g}__roll-detail-toggle`), l.setAttribute(ka, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${g}__roll-detail-list`), c.setAttribute(lc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const h = document.createElement("dd");
    h.textContent = u.value, c.append(m, h);
  }
  e.append(l, c);
}
function t$(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function n$(e, t) {
  const n = `[${zt}="${qe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(_w), a.setAttribute(zt, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${g}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function r$(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Cc(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function a$(e, t) {
  if (t.length === 0) return;
  const n = o$(e);
  for (const r of t) {
    const a = nE(r);
    if (n.querySelector(`[${Ai}="${qe(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Ai, a), n.append(o);
  }
}
function o$(e) {
  const t = e.querySelector(`.${Ri}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Ri), e.append(n), n;
}
function i$(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(cn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(hc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(un, e.pendingId), t.setAttribute(Ra, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Tr, e.choiceGroupId), t.setAttribute(sc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function s$(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = l$(e);
  return `${t} → ${n}`;
}
function l$(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function c$(e) {
  return kc(e) ?? e;
}
function kc(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function wc(e, t) {
  const n = mn(e);
  if (!n) return;
  const r = n.querySelectorAll(bw);
  for (const a of r) {
    if (_c(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      k$(a, t);
    }));
  }
}
function $r(e) {
  const t = mn(e);
  if (!t) return;
  const n = t.querySelectorAll(yw);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      u$(t, r);
    }));
}
function Er(e) {
  const t = mn(e);
  if (!t) return;
  const n = t.querySelectorAll(Aw);
  for (const r of n) {
    if (!be()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      d$(t, r);
    }));
  }
}
function u$(e, t) {
  const n = t.getAttribute(ka);
  if (!n) return;
  const r = e.querySelector(`[${lc}="${qe(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function d$(e, t) {
  if (!be()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(cn), r = t.getAttribute(uc), a = t.getAttribute(dc) ?? (r ? fe(r) : "Resistência");
  if (!n || !r) return;
  const o = p$(e, n), s = g$(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await nf(s, r);
    await _$(c.roll);
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
    m$(t, u), f$(t, u), T$(n, u), await R$(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function m$(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(pc, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function f$(e, t) {
  const n = e.closest(`.${g}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${g}__resistance-roll-result`), a = r ?? Rc(t);
  if (r) {
    r.textContent = Ec(t);
    return;
  }
  n.append(a);
}
function p$(e, t) {
  const n = q.get(t);
  if (n) return n;
  const r = dn(e);
  return Q(r)[t] ?? null;
}
function g$(e, t) {
  const n = e?.resistanceTargetActor;
  if (W(n)) return n;
  const a = e?.context?.targets.map(Sr).find(W) ?? null;
  if (a) return a;
  const o = t.getAttribute(mc) ?? e?.resistanceTargetActorId ?? null, s = o ? b$(o) : null;
  return s || y$(
    t.getAttribute(fc) ?? e?.resistanceTargetName ?? h$(t)
  );
}
function h$(e) {
  const n = e.closest(`.${g}`)?.querySelector(`.${gc}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Sr(e) {
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
function b$(e) {
  const n = game.actors?.get?.(e);
  return W(n) ? n : $c().map((o) => it(o)).find((o) => o?.id === e) ?? null;
}
function y$(e) {
  const t = Ie(e);
  if (!t) return null;
  const n = $c().filter((o) => Ie(A$(o)) === t).map((o) => it(o)).find(W) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => W(o) && Ie(o.name) === t);
  return W(a) ? a : null;
}
function $c() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function A$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : it(e)?.name ?? null;
}
function Ie(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function W(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ec(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function _$(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function T$(e, t) {
  const n = q.get(e);
  n && (n.resistanceRollResult = t);
}
async function R$(e, t, n) {
  const r = dn(e);
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
function dn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return Y(r?.get?.(n));
}
async function k$(e, t) {
  if (_c(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(un);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Sc(e, e.getAttribute(Ra) ?? "✓ Automação aplicada"), w$(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Sc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(hc), e.removeAttribute(un), e.removeAttribute(Ra);
}
function w$(e) {
  const t = e.getAttribute(Tr);
  if (!t) return;
  const n = e.closest(`.${g}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Tr}="${qe(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(sc) ?? "✓ Outra opção escolhida";
    Sc(a, o);
  }
}
function Cc(e, t) {
  const n = e.map($a).filter(J$), r = n.find((w) => w.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = D(e, "Forma"), o = D(e, "Custo"), s = D(e, "Dados") ?? D(e, `Dados (${r.label})`), l = D(e, "Tipo"), c = D(e, "Resistência"), u = D(e, "Resistência Perícia"), m = D(e, "Resistência Rótulo") ?? (u ? fe(u) : null), h = Ic(e, "Observação"), k = e.filter((w) => L$(w, r)), _ = C$(e), T = $$(t);
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
function $$(e) {
  const t = E$(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function E$(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && S$(n) !== "nenhum alvo") : [];
}
function S$(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function C$(e) {
  const t = e.map($a).find((o) => o?.intent === "casting") ?? null, n = D(e, "Conjuração DT"), r = D(e, "Conjuração Resultado");
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
function $a(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: I$(n)
  } : null;
}
function I$(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function D(e, t) {
  return Ic(e, t)[0] ?? null;
}
function Ic(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function L$(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || $a(e) ? !1 : e.trim().length > 0;
}
function v$(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of q.values())
    Cr(r, e, t) && n.set(r.pendingId, r);
  for (const r of O$(e))
    Cr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Cr(e, t, n) {
  const r = re(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Ii(n, "itemId", e.itemId) ? !1 : !e.actorId || Ii(n, "actorId", e.actorId);
}
function Ii(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${rE(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function D$(e) {
  const t = qe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function N$(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Cr(e, null, t))
      return t;
  return null;
}
function P$() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of q.entries())
    e - r.createdAt > t && q.delete(n);
}
async function Li(e, t) {
  const n = dn(e);
  if (!n) return !1;
  try {
    const r = Q(n);
    return r[t.pendingId] = Ca(t, re(n)), await ze(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Ea(e) {
  const t = Nc(e);
  if (!t) return !1;
  try {
    const n = Q(t);
    return n[e.pendingId] = Ca(e, re(t)), await ze(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Lc(e) {
  for (const t of Sw)
    globalThis.setTimeout(() => {
      Ir(e);
    }, t);
}
async function Ir(e) {
  const t = Nc(e);
  if (Sa(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await Ea(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function x$(e, t) {
  const n = Dc(e.context.message);
  if (n)
    try {
      const r = Q(n), a = r[e.pendingId] ?? Ca(e, re(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await ze(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function O$(e) {
  return Object.values(Q(Y(e))).filter(mt);
}
function Q(e) {
  if (!e) return {};
  const t = {}, n = Sa(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(vc(e)))
    t[r] ??= a;
  return t;
}
function M$(e) {
  return Object.values(vc(Y(e))).filter(mt);
}
function vc(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, oc);
  if (!xe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    mt(a) && (n[r] = a);
  return n;
}
async function ze(e, t) {
  typeof e.setFlag == "function" && (await B$(e, t), await F$(e, t));
}
async function F$(e, t) {
  await Promise.resolve(e.setFlag?.(d, oc, t));
}
function Sa(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, ic);
  return Z$(t) ? t : null;
}
async function B$(e, t) {
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
      actorName: U$(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, ic, a));
}
function U$(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Ca(e, t) {
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
function Dc(e) {
  const t = Y(e);
  if (t?.setFlag)
    return t;
  const n = z$(e);
  if (n?.setFlag)
    return n;
  const r = re(e);
  if (!r) return null;
  const a = game.messages;
  return Y(a?.get?.(r));
}
function z$(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(Y).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Nc(e) {
  const t = Dc(e.context.message);
  if (t) return t;
  const n = e.messageId ? q$(e.messageId) : null;
  if (n) return n;
  const r = Oc().slice().reverse();
  return r.find((a) => G$(a, e)) ?? r.find((a) => j$(a, e)) ?? null;
}
function q$(e) {
  const t = game.messages;
  return Y(t?.get?.(e));
}
function G$(e, t) {
  const n = re(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Pc(e, t)) return !1;
  const a = xc(e);
  return !t.actorId || !a || a === t.actorId;
}
function j$(e, t) {
  if (!H$(e, t)) return !1;
  const n = xc(e);
  return t.actorId && n === t.actorId ? !0 : Pc(e, t);
}
function Pc(e, t) {
  const n = Ie(V$(e));
  if (!n) return !1;
  const r = Ie(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Ie(t.itemId);
  return !!(a && n.includes(a));
}
function V$(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function xc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function H$(e, t) {
  const n = W$(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Cw;
}
function W$(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function Y(e) {
  return e && typeof e == "object" ? e : null;
}
function mt(e) {
  return xe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && ce(e.resistanceTargetActorId) && ce(e.resistanceTargetName) && X$(e.resistanceRollResult) && K$(e.actionPayload) && Pn(e.title) && Pn(e.buttonLabel) && Pn(e.executedLabel) && ce(e.choiceGroupId) && ce(e.skippedLabel) && ce(e.actionSectionId) && ce(e.actionSectionTitle) && eE(e.summaryLines) : !1;
}
function K$(e) {
  return e == null ? !0 : xe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && Y$(e.resource) && Q$(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Y$(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Q$(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Z$(e) {
  return xe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && xe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(mt) : !1;
}
function X$(e) {
  return e == null ? !0 : xe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ce(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function J$(e) {
  return e !== null;
}
function xe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function P(e) {
  return e === null || typeof e == "string";
}
function Pn(e) {
  return e === void 0 || typeof e == "string";
}
function ce(e) {
  return e == null || typeof e == "string";
}
function eE(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function tE(e) {
  return typeof e == "string" && e.length > 0;
}
function Oc() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(Y).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(Y).filter((r) => r !== null) : [];
}
function mn(e) {
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
function nE(e) {
  return e.trim().toLowerCase();
}
function rE(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function qe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const vi = 1e3;
class aE {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new gk(
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
      settings: Gn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Gn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Lr(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && dE(t.item) && n.executionMode === "ask") {
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
    if (await Jo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Mn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = iE(
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
      return this.pendingExecutions.delete(t), await Nn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Nn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = wa(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = pE(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Mt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await Dw(t), await Nw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Lw(
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
    if (await Jo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Mn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      mE(t.item),
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
      return a.ok ? (uE(n, a.value), await Ws(a.value), {
        ok: !0,
        executedLabel: oE(a.value)
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
    const n = xn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && xn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Nn(
        a,
        Di(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Fn();
    await vw({
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
      const l = Fn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await wi({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: xn(s),
        skippedLabel: Di(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: fE(s)
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
    const r = Fn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await wi({
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
    const n = Date.now(), r = Ni(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > vi && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= vi;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Ni(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = Mn(
      t,
      n,
      r,
      a
    );
  }
}
function oE(e) {
  return Ks({ inputAmount: e.totalRawDamage });
}
function iE(e, t) {
  if (t.resistance || !sE(t))
    return t;
  const n = Yl(e);
  return n ? { ...t, resistance: n } : t;
}
function sE(e) {
  return lE(e) && !cE(e);
}
function lE(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function cE(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function xn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Di(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function uE(e, t) {
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
function dE(e) {
  return e.type === "ritual";
}
function mE(e) {
  return sT(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function fE(e) {
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
function pE(e) {
  const t = e.actorUuid ? gE(e.actorUuid) : null;
  if (Oe(t)) return t;
  const n = e.actorId ? hE(e.actorId) : null;
  return n || bE(e.actorName);
}
function gE(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function hE(e) {
  const n = game.actors?.get?.(e);
  if (Oe(n)) return n;
  for (const r of Mc()) {
    const a = Ia(r);
    if (a?.id === e) return a;
  }
  return null;
}
function bE(e) {
  const t = On(e);
  if (!t) return null;
  for (const a of Mc()) {
    const o = yE(a);
    if (On(o) === t) {
      const s = Ia(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Oe(a) && On(a.name) === t
  );
  return Oe(r) ? r : null;
}
function Mc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function yE(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ia(e)?.name ?? null;
}
function Ia(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Oe(t)) return t;
  const n = e.document?.actor;
  return Oe(n) ? n : null;
}
function On(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Oe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Mn(e, t, n, r) {
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
function Ni(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Fn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class AE {
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
class _E {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = TE(t);
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
      reason: RE(r, n.preset)
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
    preset: e.match ? Vt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function TE(e) {
  const t = e.getFlag(d, "automation");
  return vr(t) ? t : null;
}
function RE(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function kt(e) {
  return (t) => t.status === e;
}
class kE {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Nr(t.transaction);
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
    const n = wt(t.actorName), r = wt(t.resource), a = wt(wE(t)), o = wt($E(t));
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
function wE(e) {
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
function $E(e) {
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
function EE() {
  const e = new xA(), t = new L_(e), n = new ks(new Rs()), r = new ws(new Vr()), a = new v_(new Fl()), o = new FA(), s = new JA(o), l = new a_(e), c = new i_(), u = c.registerMany(
    xu()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new o_(), h = new n_(), k = Ds(), _ = new Ss(k), T = new _E(
    c
  ), w = new AE(
    T,
    m,
    h
  ), A = new x_(), je = new kE(A), G = new P_(), Ve = new I_(), M = new S_(
    t,
    s,
    je,
    G
  ), ae = new N_(M, G), F = new aE(
    ae,
    t,
    s,
    n,
    _,
    A,
    Ve
  );
  return F.addStrategy(
    new ms(
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
const { ApplicationV2: SE } = foundry.applications.api;
class Gt extends SE {
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
      apply: Gt.onApply,
      cancel: Gt.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${V(Gi)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${V(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Bn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Bn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Bn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Bn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${V(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? CE(n) : LE(t)}
    </section>
  `;
}
function CE(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(IE).join("")}</ol>`;
}
function IE(e) {
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
function LE(e) {
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
const jt = `${d}.manageRitualPresets`, Pi = `__${d}_ritualPresetHeaderControlRegistered`, vE = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function DE(e) {
  const t = globalThis;
  if (!t[Pi]) {
    for (const n of vE)
      Hooks.on(n, (r, a) => {
        NE(r, a, e);
      });
    t[Pi] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function NE(e, t, n) {
  Array.isArray(t) && xE(e) && (PE(e, n), !t.some((r) => r.action === jt) && t.push({
    action: jt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Fc(e, n);
    }
  }));
}
function PE(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[jt] && (e.options.actions[jt] = (n) => {
    n.preventDefault(), n.stopPropagation(), Fc(e, t);
  }));
}
function xE(e) {
  if (!game.user?.isGM) return !1;
  const t = Bc(e);
  return t ? t.type === "agent" && ct(t).length > 0 : !1;
}
function Fc(e, t) {
  const n = Bc(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Gt(n, t).render({ force: !0 });
}
function Bc(e) {
  return xi(e.actor) ? e.actor : xi(e.document) ? e.document : null;
}
function xi(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Uc = "data-paranormal-toolkit-ritual-roll-config", ft = "data-paranormal-toolkit-ritual-roll-field", ge = "data-paranormal-toolkit-ritual-roll-action", Oi = `__${d}_ritualRollConfigBlockRegistered`, OE = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], ME = [
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
function FE() {
  const e = globalThis;
  if (!e[Oi]) {
    BE();
    for (const t of OE)
      Hooks.on(t, (...n) => {
        UE(n[0], n[1]);
      });
    e[Oi] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function BE() {
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
function UE(e, t) {
  const n = eS(e);
  if (!n || n.type !== "ritual") return;
  const r = rS(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  qE(a);
  const o = qc(n), s = Kl(n), l = tS(n), c = GE(n, s, o, l);
  YE(c, n, o, l), zE(a, c), La(c);
}
function zE(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function qE(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Uc}]`)))
    t.remove();
}
function GE(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Uc, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(Mi("strong", "Paranormal Toolkit")), s.append(Mi("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = jc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(jE(t, r)), u.append(VE(t, r)), u.append(HE(t, r)), a.append(u), a.append(WE(t, n, r)), a.append(KE(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function jE(e, t) {
  const n = fn("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(ft, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = iT(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function VE(e, t) {
  const n = fn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(ft, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of ME) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function HE(e, t) {
  const n = fn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(ft, "utilityLabel"), n.append(r), n;
}
function WE(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(Un("base", "Padrão", e.forms.base.formula, !0, n)), o.append(Un("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(Un("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function Un(e, t, n, r, a) {
  const o = fn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(ft, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function KE(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ge, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ge, "clear"), t.append(n, r), t;
}
function fn(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Mi(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function YE(e, t, n, r) {
  Ge(e, "intent")?.addEventListener("change", () => La(e)), Ui(e, "system.studentForm")?.addEventListener("change", () => Fi(e, t)), Ui(e, "system.trueForm")?.addEventListener("change", () => Fi(e, t)), e.querySelector(`[${ge}="save"]`)?.addEventListener("click", () => {
    r && QE(e, t, n);
  }), e.querySelector(`[${ge}="clear"]`)?.addEventListener("click", () => {
    r && ZE(e, t);
  });
}
async function QE(e, t, n) {
  const r = e.querySelector(`[${ge}="save"]`);
  r?.setAttribute("disabled", "true"), Le(e, "Salvando configuração...");
  try {
    const a = XE(e, n);
    await aT(t, a), zc(e, a), Le(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Le(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function ZE(e, t) {
  const n = e.querySelector(`[${ge}="clear"]`);
  n?.setAttribute("disabled", "true"), Le(e, "Limpando configuração...");
  try {
    await oT(t);
    const r = Kl(t);
    JE(e, r), zc(e, r), Le(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Le(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function zc(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = jc(t) ? "Configurada" : "Rascunho");
}
function XE(e, t) {
  return {
    schemaVersion: 1,
    intent: Gc(Ge(e, "intent")?.value),
    damageType: zi(e, "damageType"),
    utilityLabel: zi(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: vt(e, "formula.base") },
      discente: { formula: vt(e, "formula.discente") },
      verdadeiro: { formula: vt(e, "formula.verdadeiro") }
    }
  };
}
function JE(e, t) {
  Re(e, "intent", t.intent), Re(e, "damageType", t.damageType ?? ""), Re(e, "utilityLabel", t.utilityLabel ?? "Resultado"), Re(e, "formula.base", t.forms.base.formula), Re(e, "formula.discente", t.forms.discente.formula), Re(e, "formula.verdadeiro", t.forms.verdadeiro.formula), La(e);
}
function La(e) {
  const t = Gc(Ge(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Fi(e, t) {
  const n = qc(t);
  Bi(e, "discente", n.discente), Bi(e, "verdadeiro", n.verdadeiro);
}
function Bi(e, t, n) {
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
function qc(e) {
  const t = nS(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function eS(e) {
  return qi(e.item) ? e.item : qi(e.document) ? e.document : null;
}
function tS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function nS(e) {
  const t = e.system;
  return aS(t) ? t : {};
}
function Ui(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ge(e, t) {
  return e.querySelector(`[${ft}="${oS(t)}"]`);
}
function vt(e, t) {
  return Ge(e, t)?.value.trim() ?? "";
}
function zi(e, t) {
  const n = vt(e, t);
  return n.length > 0 ? n : null;
}
function Re(e, t, n) {
  const r = Ge(e, t);
  r && (r.value = n);
}
function Gc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function jc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function rS(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function qi(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function aS(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function oS(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let j = null;
Hooks.once("init", () => {
  vu(), cd(), ym(), RA(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ja.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ja.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  j = EE(), j.itemUseIntegration.registerStrategies(), lm(j.resources, j.resourceAdapter), pm(j.conditions), Td(j), CA(), DE(j), FE(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function iS() {
  if (!j)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return j;
}
export {
  iS as getToolkitServices
};
//# sourceMappingURL=main.js.map
