const d = "paranormal-toolkit", Pi = "Paranormal Toolkit", xc = "ordemparanormal";
class ot {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Gt(e) {
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
function g(e) {
  return { ok: !1, error: e };
}
function it(e) {
  const t = Ni(e);
  return t.ok ? b(t.value.definition) : t;
}
function Ni(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? g({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : wr(t) ? b(t) : g({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Oc(e) {
  return wr(e.getFlag(d, "automation"));
}
function wr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Fc(t.source) && Mc(t.definition);
}
function Mc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every(Bc) && (t.ritualForms === void 0 || Vc(t.ritualForms)) && (t.conditionApplications === void 0 || Qc(t.conditionApplications));
}
function Fc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function Bc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Uc(t);
    case "spendRitualCost":
      return qc(t);
    case "rollFormula":
      return Gc(t);
    case "modifyResource":
      return jc(t);
    case "chatCard":
      return zc(t);
    default:
      return !1;
  }
}
function Uc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && xi(t);
}
function qc(e) {
  return e.type === "spendRitualCost";
}
function Gc(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || ru(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function jc(e) {
  const t = e;
  return t.type === "modifyResource" && Oi(t.actor) && tu(t.resource) && nu(t.operation) && xi(t) && (t.damageType === void 0 || t.damageType === null || $(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function zc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Vc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Hc(a)
  );
}
function Hc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || $(t.label)) && (t.extraCost === void 0 || ou(t.extraCost)) && (t.rollFormulaOverrides === void 0 || su(t.rollFormulaOverrides)) && (t.notes === void 0 || iu(t.notes)) && (t.targeting === void 0 || Wc(t.targeting));
}
function Wc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Yc(t.mode) && $(t.label) && (t.optionLabel === void 0 || $(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Kc(t.template));
}
function Kc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || Ia(t.distance)) && (t.width === void 0 || t.width === null || Ia(t.width));
}
function Yc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Qc(e) {
  return Array.isArray(e) && e.every(Zc);
}
function Zc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return $(t.id) && Oi(t.actor) && $(t.conditionId) && (t.label === void 0 || $(t.label)) && (t.duration === void 0 || t.duration === null || Jc(t.duration)) && (t.source === void 0 || $(t.source)) && (t.actionSectionId === void 0 || $(t.actionSectionId)) && (t.actionSectionTitle === void 0 || $(t.actionSectionTitle)) && (t.executedLabel === void 0 || $(t.executedLabel)) && (t.applyOnResistance === void 0 || Xc(t.applyOnResistance));
}
function Xc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Jc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || au(t.rounds)) && (t.expiry === void 0 || t.expiry === null || eu(t.expiry));
}
function eu(e) {
  return e === "turnStart" || e === "turnEnd";
}
function xi(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function Oi(e) {
  return e === "self" || e === "target";
}
function tu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function nu(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ru(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function au(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function ou(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Ia(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function iu(e) {
  return Array.isArray(e) && e.every($);
}
function su(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => $(t) && $(n)
  );
}
function kr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Ca);
    if (uu(t))
      return Array.from(t).filter(Ca);
  }
  return [];
}
function lu(e) {
  return kr(e)[0] ?? null;
}
function cu(e) {
  return kr(e).find(Oc) ?? null;
}
function uu(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ca(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function st(e) {
  return kr(e).filter((t) => t.type === "ritual");
}
function Mi(e) {
  return st(e)[0] ?? null;
}
function du(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Gt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = We("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = mt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Da);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = We("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = mt(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await Mn(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = We("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = mt(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await Mn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Da(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Sa(e);
    },
    async applyBestPresetsToActorRituals() {
      return Sa(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = We("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = mt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Sa(e) {
  const t = We("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = st(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), La(t);
  const r = La(t, n.length);
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
    const s = await Mn(e, a, o.preset);
    r.applied.push(mu(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), fu(r), r;
}
async function Mn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function mu(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Gt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function La(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function fu(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Da(e) {
  return {
    preset: Gt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function We(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function mt(e) {
  const t = Mi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function me(e) {
  return e ? {
    id: e.id,
    source: {
      ...pu(e.sourceActor),
      token: e.sourceToken
    },
    item: gu(e.item),
    targets: e.targets.map(hu),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: va(e.rollRequests, Fi),
    rolls: va(e.rolls, yu),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Er),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Er(e) {
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
function pu(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function gu(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function hu(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Fi(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function yu(e) {
  return {
    ...Fi(e),
    total: e.total
  };
}
function va(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function bu(e) {
  return {
    getSelected() {
      return ot.getSelectedActor();
    },
    logResources() {
      const t = ae(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await Te(
        e,
        "Gasto de PE",
        ae("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Te(
        e,
        "Gasto de PD",
        ae("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Te(
        e,
        "Dano em PV",
        ae("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Te(
        e,
        "Cura de PV",
        ae("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Te(
        e,
        "Dano em SAN",
        ae("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Te(
        e,
        "Recuperação de SAN",
        ae("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Te(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    Au(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, Er(o));
}
function ae(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Au(e) {
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
function _u() {
  ft(H.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ft(H.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ft(H.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ft(H.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Fn() {
  return {
    enabled: pt(H.enabled),
    console: pt(H.console),
    ui: pt(H.ui),
    chat: pt(H.chat)
  };
}
async function X(e, t) {
  await game.settings.set(d, H[e], t);
}
function ft(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function pt(e) {
  return game.settings.get(d, e) === !0;
}
function Tu() {
  return {
    status() {
      return Fn();
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
const Bi = "ritual.costOnly", Ui = "ritual.simpleHealing", Ru = "ritual.eletrocussao", $u = "ritual.definhar", qi = "ritual.simpleDamage", Gi = "generic.simpleHealing", ji = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, Ir = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function wu() {
  return [
    ku(),
    Eu(),
    Iu(),
    Cu(),
    Su(),
    Lu()
  ];
}
function ku() {
  return {
    id: Bi,
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
function Eu() {
  return {
    id: Ui,
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
    automation: zi(),
    itemPatch: Nu()
  };
}
function Iu() {
  return {
    id: Ru,
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
    automation: vu(),
    itemPatch: Ou()
  };
}
function Cu() {
  return {
    id: $u,
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
    automation: Pu(),
    itemPatch: xu()
  };
}
function Su() {
  return {
    id: qi,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Cr()
  };
}
function Lu() {
  return {
    id: Gi,
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
function zi(e = ji) {
  const t = Du(e);
  return Vi(
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
function Du(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...ji,
    ...e
  };
}
function vu() {
  return {
    ...Cr("3d6", {
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
function Pu() {
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
function Cr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Vi(
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
function Nu() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Ir,
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
function xu() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: Ir,
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
function Ou() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Ir,
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
function Vi(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Sr() {
  return Array.from(game.user?.targets ?? []).map(Hi);
}
function Hi(e) {
  return {
    tokenId: we(e.id),
    actorId: we(e.actor?.id),
    sceneId: we(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Wi() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: we(e.id),
    actorId: we(t?.id),
    sceneId: we(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function we(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Mu(e) {
  return {
    logFirstRitualCost() {
      const t = oe("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ie(t);
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
      const r = oe("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = ie(r);
      if (a) {
        if (!Uu(t, n)) {
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
      const t = oe("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ie(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = oe("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ie(t);
      if (!n) return;
      const r = e.automationRegistry.require(Bi);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = oe("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ie(n);
      if (!r) return;
      if (!Pa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Ui);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: zi(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = oe("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ie(n);
      if (!r) return;
      if (!Pa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(qi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Cr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = oe("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ie(t);
      n && await Fu(e, t, n);
    }
  };
}
async function Fu(e, t, n) {
  const r = it(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Wi(),
    item: n,
    targets: Sr()
  });
  if (!a.ok) {
    Bu(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", me(a.value.context));
}
function Bu(e) {
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
function oe(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ie(e) {
  const t = Mi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Uu(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Pa(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const qu = ["strict", "open"], Ki = "strict";
function Gu(e) {
  return qu.includes(e) ? e : Ki;
}
function ju(e) {
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
function jt(e, t) {
  return e === "strict" && t.kind === "pending";
}
const zu = ["disabled", "ask", "automatic"], Vu = ["buttons", "confirm"], Yi = "ask";
function Hu(e) {
  return typeof e == "string" && zu.includes(e);
}
function Wu(e) {
  return typeof e == "string" && Vu.includes(e);
}
function Ku(e) {
  return Hu(e) ? e : Wu(e) ? "ask" : Yi;
}
const Yu = ["keep", "replace"], Qu = ["manual", "assisted"], Qi = "keep", Zi = "assisted", Zu = !0, D = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Xu() {
  game.settings.register(d, D.executionMode, {
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
    default: Yi
  }), game.settings.register(d, D.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Qi
  }), game.settings.register(d, D.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Zi
  }), game.settings.register(d, D.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Ki
  }), game.settings.register(d, D.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Zu
  }), game.settings.register(d, D.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Na() {
  const e = Ku(game.settings.get(d, D.executionMode)), t = Ji(game.settings.get(d, D.systemCardMode)), n = es(game.settings.get(d, D.damageResolutionMode)), r = Lr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Xi()
  };
}
function Ju() {
  return Ji(game.settings.get(d, D.systemCardMode));
}
function ed() {
  return es(game.settings.get(d, D.damageResolutionMode));
}
function Lr() {
  return Gu(game.settings.get(d, D.resistanceGateMode));
}
function Xi() {
  return game.settings.get(d, D.ritualCastingCheckEnabled) === !0;
}
async function se(e) {
  await game.settings.set(d, D.executionMode, e);
}
function Ji(e) {
  return Yu.includes(e) ? e : Qi;
}
function es(e) {
  return Qu.includes(e) ? e : Zi;
}
function td(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await se("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await se("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await se(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await se("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await se("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await se("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await se("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const nd = [
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
function rd(e) {
  return {
    phases() {
      return nd;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = dn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = cu(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await xa(e, t, n);
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
      if (!id(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = od(n) ?? dn("Nenhum ator encontrado para executar automação do item.");
      r && await xa(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = dn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = lu(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Gi);
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
async function xa(e, t, n) {
  const r = it(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Wi(),
    item: n,
    targets: Sr()
  });
  if (!a.ok) {
    ad(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", me(a.value.context));
}
function ad(e) {
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
function dn(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function od(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function id(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function sd(e) {
  const t = bu(e), n = du(e), r = Mu(e), a = rd(e), o = Tu(), s = td(e);
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
const Tt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function ld(e) {
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
      const r = Oa();
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
      return cd(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Oa();
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
      return ud(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Oa() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function cd(e) {
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
function ud(e) {
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
function dd(e) {
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
    conditions: ld(e.conditions),
    debug: sd(e),
    hooks: Tt
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class Ma {
  static isSupportedSystem() {
    return game.system.id === xc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function md() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ke(t.id),
    actorId: ke(t.actor?.id),
    sceneId: ke(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function ts() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ke(e.id),
    actorId: ke(t?.id),
    sceneId: ke(e.scene?.id),
    name: n
  };
}
function fd(e, t = ts()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function pd(e) {
  if (!yd(e)) return null;
  const t = e.getFlag(d, "workflow");
  return hd(t) ? t : null;
}
function gd() {
  return `flags.${d}.workflow`;
}
function Fa(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${d}`), n = foundry.utils.getProperty(e, `_source.flags.${d}`);
  return t !== void 0 || n !== void 0;
}
function Ba(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Bn(t) || Bn(n);
}
function hd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function yd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ke(e) {
  return Bn(e) ? e : null;
}
function Bn(e) {
  return typeof e == "string" && e.length > 0;
}
function bd() {
  const e = (t, n) => {
    Ad(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ad(e, t) {
  const n = pd(e);
  if (!n || n.targets.length === 0) return;
  const r = Td(t);
  if (!r || r.querySelector(`.${d}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(_d(n));
}
function _d(e) {
  const t = document.createElement("section");
  t.classList.add(`${d}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Ua("Origem", e.source.name)), t.append(Ua("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Ua(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${d}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function Td(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Rd() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!$d(r) || !wd(e) || Fa(e) || Fa(t)) return;
    const a = md();
    if (a.length === 0 || !Ba(e) && !Ba(t)) return;
    const o = ts();
    e.updateSource({
      [gd()]: fd(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function $d(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function wd(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let qa = !1, mn = !1, fn = !1, gt = null;
const kd = 1e3, Ed = 750, Id = 1e3;
function Cd(e) {
  qa || (Hooks.on("combatTurnChange", (t) => {
    Ld(e, Ga(t));
  }), Hooks.on("deleteCombat", (t) => {
    Dd(e, Ga(t));
  }), qa = !0, Sd(e));
}
function Sd(e) {
  zt() && (mn || (mn = !0, globalThis.setTimeout(() => {
    mn = !1, Dr(e, "ready");
  }, kd)));
}
function Ld(e, t) {
  zt() && t && (gt && globalThis.clearTimeout(gt), gt = globalThis.setTimeout(() => {
    gt = null, Dr(e, "combat-turn-change", t);
  }, Ed));
}
function Dd(e, t) {
  zt() && t && (fn || (fn = !0, globalThis.setTimeout(() => {
    fn = !1, Dr(e, "combat-deleted", t);
  }, Id)));
}
async function Dr(e, t, n) {
  if (zt())
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
function zt() {
  return game.user?.isGM === !0;
}
function Ga(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ns = {
  enabled: "dice.animations.enabled"
};
function vd() {
  game.settings.register(d, ns.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Pd() {
  return {
    enabled: game.settings.get(d, ns.enabled) === !0
  };
}
const Vt = "chatCard", ja = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Nd = `.${i}__title`, rs = `.${i}__header`, xd = `.${i}__roll-card`, Od = `.${i}__roll-meta`, Md = `.${i}__roll-meta-pill`, vr = `.${i}__resistance`, Fd = `.${i}__resistance-header`, as = `.${i}__resistance-description`, Ht = `.${i}__resistance-roll-button`, os = `.${i}__resistance-roll-result`, za = `${i}__resistance-content`, is = `.${i}__workflow-section`, ss = `.${i}__workflow-roll`, Pr = `${i}__workflow-roll--dice-open`, Nr = `.${i}__workflow-roll-formula`, xr = `${i}__workflow-roll-formula--toggle`, Wt = `.${i}__workflow-dice-tray`, Bd = `.${i}__roll-detail-toggle`, Ud = `.${i}__roll-detail-list`, qd = `.${i}__ritual-element-badge`, Gd = `.${i}__ritual-metadata`, jd = "casting-backlash", zd = "data-paranormal-toolkit-action-section", Vd = "data-paranormal-toolkit-prompt-id", Hd = "data-paranormal-toolkit-pending-id", Va = "data-paranormal-toolkit-casting-backlash-enhanced", Ha = `.${i}`, Wd = `.${i}__workflow-section--casting`, Kd = `.${i}__workflow-section-header`, Yd = `.${i}__workflow-notes`, Qd = `[${zd}="${jd}"]`, Wa = `${i}__workflow-section-title-row`, Zd = `${i}__workflow-section-header--casting-backlash`, ls = `${i}__casting-backlash-button`;
function Xd(e) {
  for (const t of Jd(e))
    em(t), om(t);
}
function Jd(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Ha) && t.add(e);
  for (const n of e.querySelectorAll(Ha))
    t.add(n);
  return Array.from(t);
}
function em(e) {
  const t = e.querySelector(Qd);
  if (!t) return;
  const n = tm(t);
  if (!n) return;
  const r = e.querySelector(`${Wd} ${Kd}`);
  r && (r.classList.add(Zd), nm(r), rm(n), r.append(n), t.remove());
}
function tm(e) {
  return e.querySelector(
    `button[${Hd}], button[${Vd}]`
  );
}
function nm(e) {
  const t = e.querySelector(`:scope > .${Wa}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Wa);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(ls) || n.append(a));
  return n;
}
function rm(e) {
  if (e.getAttribute(Va) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = am(t, e.disabled);
  e.classList.add(ls), e.setAttribute(Va, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function am(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function om(e) {
  for (const t of e.querySelectorAll(Yd)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function im(e) {
  for (const t of Array.from(e.querySelectorAll(is)))
    for (const n of Array.from(t.querySelectorAll(`${Bd}, ${Ud}`)))
      n.remove();
}
const sm = {
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
}, lm = new Set(
  Object.values(sm)
), cm = {
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
function um(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = dm(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = cm[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : lm.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function cs(e) {
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
function dm(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class us {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", a = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return g({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const o = n.applyDamage;
    if (typeof o != "function")
      return g({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let c = null;
    for (const [u, m] of t.instances.entries()) {
      const y = mm(m, u);
      if (!y.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const R = um(m.damageType);
      if (!R.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (y.amount === 0) {
        s.push(
          fm(y.id, m, R.value)
        );
        continue;
      }
      try {
        const T = await Promise.resolve(
          o.call(n, y.amount, {
            damageType: R.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const I of gm(T.conditions))
          l.add(I);
        const p = pm(T.newPV);
        p !== null && (c = p), s.push({
          id: y.id,
          label: m.label ?? cs(R.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: Ka(T.finalDamage, y.amount),
          blocked: Ka(T.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: R.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (T) {
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: T
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
function mm(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function fm(e, t, n) {
  return {
    id: e,
    label: t.label ?? cs(n),
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
function Ka(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function pm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function gm(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Or {
  async rollResistance(t) {
    const n = await ym(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? pe(t.skill),
      roll: n,
      formula: Am(n),
      total: _m(n),
      diceBreakdown: Tm(n)
    };
  }
  getSkillLabel(t) {
    return pe(t);
  }
}
async function hm(e, t) {
  return new Or().rollResistance({ actor: e, skill: t });
}
function pe(e) {
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
async function ym(e, t) {
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
  return bm(r);
}
function bm(e) {
  return Ya(e) ? e : Array.isArray(e) ? e.find(Ya) ?? null : null;
}
function Ya(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Am(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function _m(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Tm(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Rm);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Rm(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class ds {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class ms {
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
function $m(e, t) {
  const n = Lm(e?.rounds);
  if (!n)
    return Qa(null);
  const r = e?.anchor ?? fs(t);
  if (!r)
    return {
      ...Qa(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: wm(),
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
function fs(e) {
  const t = Dm();
  if (!t?.id || !ps(t.round)) return null;
  const n = Cm(t), r = km(e, n) ?? Im(t), a = J(r?.id), o = Pm(r?.initiative), s = Em(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: vm()
  };
}
function wm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Qa(e) {
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
function km(e, t) {
  return e?.id ? t.find((n) => Sm(n) === e.id) ?? null : null;
}
function Em(e, t, n) {
  const r = J(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Nm(e.turn) ? e.turn : null;
}
function Im(e) {
  return Rt(e.combatant) ? e.combatant : null;
}
function Cm(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Rt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Rt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Rt);
  }
  return [];
}
function Sm(e) {
  return J(e.actor?.id) ?? J(e.actorId) ?? J(e.token?.actor?.id) ?? J(e.token?.actorId) ?? J(e.document?.actor?.id) ?? J(e.document?.actorId);
}
function Lm(e) {
  return ps(e) ? Math.trunc(e) : null;
}
function Dm() {
  return game.combat ?? null;
}
function vm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Rt(e) {
  return !!(e && typeof e == "object");
}
function J(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Pm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ps(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Nm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class gs {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? b(n.value) : g({
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
    const r = t.actor;
    if (!zm(r))
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = $m(t.duration, r), s = xm(a, t, o), c = t.refreshExisting ?? !0 ? Vm(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), b(Za(r, a, c.id ?? null, !1, !0, o));
      } catch (u) {
        return g({
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
      return b(Za(r, a, m, !0, !1, o));
    } catch (u) {
      return g({
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
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(t.conditionId), a = ys(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Xa(n, s) === "deleted" && (o += 1);
    } catch (s) {
      return g({
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
    const n = Km(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = Mr(s);
      a += l.length;
      for (const c of l) {
        if (!Fm(c, t)) continue;
        const u = hs(c);
        try {
          await Xa(s, c) === "deleted" && (o += 1);
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
function xm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: af(),
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
    duration: Om(n.duration),
    start: Mm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function Om(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Mm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: rf(),
    ...e
  };
}
function Za(e, t, n, r, a, o) {
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
function Fm(e, t) {
  const n = hs(e);
  if (!n.conditionId || !Bm(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = nf();
  return n.durationMode === "combatantTurn" || Um(n) ? Gm(n, r) : qm(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !B(n.startRound) || !B(n.requestedRounds) || !B(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Bm(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && B(e.requestedRounds);
}
function Um(e) {
  return !!(e.combatDurationApplied && B(e.requestedRounds) && B(e.startRound) && (e.startCombatantId || Ct(e.startTurn)));
}
function qm(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Gm(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !B(e.startRound) || !B(e.requestedRounds) || !B(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = jm(t);
  return e.startCombatantId ? r === e.startCombatantId : Ct(e.startTurn) && Ct(t.turn) ? t.turn === e.startTurn : !1;
}
function jm(e) {
  return Ee(e.combatant?.id);
}
function hs(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: $t(e, "conditionId"),
    requestedRounds: Ja(e, "requestedRounds") ?? Ke(t.value) ?? Ke(t.rounds),
    combatDurationApplied: pn(e, "combatDurationApplied"),
    combatId: $t(e, "combatId") ?? Ee(n.combat) ?? Ee(t.combat),
    startCombatantId: $t(e, "startCombatantId") ?? Ee(n.combatant),
    startInitiative: Xm(e, "startInitiative") ?? bs(n.initiative),
    startRound: Ja(e, "startRound") ?? Ke(n.round) ?? Ke(t.startRound),
    startTurn: Zm(e, "startTurn") ?? Un(n.turn) ?? Un(t.startTurn),
    expiryEvent: Jm(e, "expiryEvent") ?? As(t.expiry),
    durationMode: ef(e, "durationMode"),
    deleteOnExpire: pn(e, "deleteOnExpire"),
    expiresWithCombat: pn(e, "expiresWithCombat")
  };
}
function zm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Vm(e, t) {
  return ys(e, t)[0] ?? null;
}
function ys(e, t) {
  return Mr(e).filter((n) => Qm(n) === t);
}
async function Xa(e, t) {
  const n = t.id ?? null, r = n ? Hm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Wm(a)) return "missing";
    throw a;
  }
}
function Hm(e, t) {
  return Mr(e).find((n) => n.id === t) ?? null;
}
function Wm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Km() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      ht(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    ht(e, n);
  });
  for (const n of Ym())
    ht(e, n.actor), ht(e, n.document?.actor);
  return Array.from(e.values());
}
function ht(e, t) {
  if (!tf(t)) return;
  const r = Ee(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Ym() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Mr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Qm(e) {
  return $t(e, "conditionId");
}
function $t(e, t) {
  return Ee(ye(e, t));
}
function Ja(e, t) {
  return Ke(ye(e, t));
}
function Zm(e, t) {
  return Un(ye(e, t));
}
function Xm(e, t) {
  return bs(ye(e, t));
}
function Jm(e, t) {
  return As(ye(e, t));
}
function ef(e, t) {
  const n = ye(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function pn(e, t) {
  return ye(e, t) === !0;
}
function ye(e, t) {
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
function Ke(e) {
  return B(e) ? Math.trunc(e) : null;
}
function Un(e) {
  return Ct(e) ? Math.trunc(e) : null;
}
function bs(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function As(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function tf(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function nf() {
  return game.combat ?? null;
}
function rf() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function B(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ct(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function af() {
  return game.user?.id ?? null;
}
const of = "icons/svg/downgrade.svg", sf = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function A(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? of,
    description: sf,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const lf = A({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), cf = A({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), uf = A({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), df = A({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), mf = A({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), ff = A({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), pf = A({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), gf = A({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), hf = A({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), yf = A({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), bf = A({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Af = A({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), _f = A({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Tf = A({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Rf = A({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), $f = A({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), wf = A({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), kf = A({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Ef = A({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), If = A({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Cf = A({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Sf = A({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Lf = A({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Df = A({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), vf = A({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Pf = A({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Nf = A({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), xf = A({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Of = A({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Mf = A({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Ff = A({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Bf = A({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Uf = A({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), qf = A({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Gf = [
  lf,
  cf,
  uf,
  df,
  mf,
  ff,
  pf,
  gf,
  hf,
  yf,
  bf,
  Af,
  _f,
  Tf,
  Rf,
  $f,
  wf,
  kf,
  Ef,
  If,
  Cf,
  Sf,
  Lf,
  Df,
  vf,
  Pf,
  Nf,
  xf,
  Of,
  Mf,
  Ff,
  Bf,
  Uf,
  qf
];
class jf {
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
    return Array.from(this.definitions.values()).map(eo);
  }
  get(t) {
    const n = this.lookup.get(to(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(eo(r)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = to(t);
    r && this.lookup.set(r, n);
  }
}
function _s() {
  return new jf(Gf);
}
function eo(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function to(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function De(e) {
  return e.applyOnResistance ?? "failure";
}
function Ts(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Rs(e, t) {
  const n = De(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function $s(e) {
  const t = De(e);
  return t === "failure" || t === "success";
}
function zf(e, t, n, r) {
  const a = e.filter((c) => Rs(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => De(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Vf = {
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
}, Hf = {
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
function Wf(e) {
  return ks(e, Vf, !1);
}
function Kf(e) {
  return ks(e, Hf, !e.allowsSuccessfulResistance);
}
function Oe(e) {
  return e.kind === "waiting-resistance";
}
function ws(e) {
  return e.kind === "resisted";
}
function ks(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Re("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Re("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || jt(e.resistanceGateMode, e.resistanceState) ? Re(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Re("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : Re("available", !0, r.available, r.availableCompact, null);
}
function Re(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Ye = "data-paranormal-toolkit-prompt-id", Yf = "data-paranormal-toolkit-resistance-roll-result", Qf = "Conjuração DT";
function Zf(e) {
  const t = e.querySelector(Ht)?.getAttribute(Yf), n = et(t);
  if (n !== null) return n;
  const r = e.querySelector(os)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return et(a?.[1] ?? null);
}
function Fr(e) {
  const t = Es(e), n = tp(t);
  if (n !== null) return n;
  const r = ep(t);
  return r !== null ? r : np(e);
}
function Xf(e) {
  const t = Es(e);
  return t ? {
    actorId: gn(t.actorId),
    itemId: gn(t.itemId),
    itemName: gn(t.itemName)
  } : null;
}
function Jf(e) {
  const t = e.getAttribute(Ye);
  if (!t) return null;
  const n = Is(e), r = Cs(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Kt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function ee(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function qn(e) {
  return ee(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function ep(e) {
  const t = ap(e);
  return t.length === 0 ? null : et(op(t, Qf));
}
function tp(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : no(r, ["system", "ritual", "DT"]) ?? no(r, ["system", "ritual", "dt"]);
}
function np(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return et(n?.[1] ?? null);
}
function Es(e) {
  const t = rp(e);
  if (!t) return null;
  const n = Is(e), r = Cs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Kt(o) ? o.pendingId === t : !1) ?? null;
}
function rp(e) {
  return (e.closest(`[${Ye}]`) ?? e.querySelector(`[${Ye}]`) ?? e.parentElement?.querySelector(`[${Ye}]`) ?? null)?.getAttribute(Ye) ?? null;
}
function Is(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return ip(a) ? a : null;
}
function Cs(e) {
  const t = e?.getFlag?.(d, Vt);
  return Kt(t) ? t : null;
}
function ap(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function op(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function no(e, t) {
  let n = e;
  for (const r of t) {
    if (!Kt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : et(typeof n == "string" ? n : null);
}
function et(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function ip(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Kt(e) {
  return !!(e && typeof e == "object");
}
function gn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Yt(e) {
  return Ss({
    hasResistance: !!e.querySelector(vr),
    difficulty: Fr(e),
    resistanceTotal: Zf(e)
  });
}
function sp(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Ss({
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
function Ss(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: ju(e)
  };
}
function be() {
  return game.user?.isGM === !0;
}
function ge() {
  return be();
}
function lp(e) {
  const t = jt(e.resistanceGateMode, e.resistanceState), n = cp(e.resistanceState, e.hasDamage), r = up(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Wf({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Kf({
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
function cp(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function up(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Br(e) {
  const t = e.isGM ?? ge();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: lp({
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
function dp(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = fp(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function mp(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function fp(e, t) {
  const n = pp(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of gp(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function pp(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function gp(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ro(e, "highest") : n.includes("kl") ? ro(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ro(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const hp = "data-paranormal-toolkit-resistance-skill", yp = "data-paranormal-toolkit-resistance-skill-label", Ls = "pending", Ur = "success", qr = "failure", Ds = "rolled";
function bp(e) {
  const t = $p(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Tp(e.damageSection) : null, r = ao(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Ap(e.rollCard).map((o, s) => {
    const l = _p(o, s), c = e.resistanceResults.get(l) ?? null, u = Cp(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, y = e.effectApplications.get(l) ?? null, R = sp({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: vp(u)
    }).state, T = ao(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Ts(R)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: y,
      effect: T,
      assistedActions: Br({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: R,
        damage: n,
        effect: T,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!y,
        effectCanApplyOnSuccessfulResistance: T?.applyOnResistance === "success" || T?.applyOnResistance === "always",
        effectRequiresResolvedResistance: T ? $s(T) : !1
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
function Ap(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && vs(a) !== "nenhum alvo") : [];
}
function _p(e, t) {
  return `${vs(e)}:${t}`;
}
function Tp(e) {
  const t = Sp(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Dp(e),
    formula: Lp(e) ?? "—",
    total: t,
    diceBreakdown: mp(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function ao(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Rp(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: De(o)
  } : null;
}
function Rp(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function $p(e, t) {
  const n = wp(t), r = kp(n)?.textContent?.trim(), a = Ep(n), o = a?.getAttribute(hp) ?? null, s = a?.getAttribute(yp) ?? (o ? pe(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: Ip(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: Fr(e)
  };
}
function wp(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function kp(e) {
  return Gr(e, `.${i}__resistance-description`);
}
function Ep(e) {
  return Gr(e, Ht);
}
function Ip(e) {
  return Gr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Gr(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function Cp(e, t) {
  return e ? t === null ? Ds : e.total >= t ? Ur : qr : Ls;
}
function Sp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Lp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Dp(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function vs(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function vp(e) {
  return e === Ur ? "succeeded" : e === qr ? "failed" : "pending";
}
function Ps(e) {
  if (!e) return null;
  const t = e.actorId ? xp(e.actorId) : null, n = t ? Pp(t, e.itemId, e.itemName) : null;
  return n || Np(e.itemId, e.itemName);
}
function Pp(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Ie(o)) return o;
  }
  const a = St(n);
  if (a) {
    const o = r?.find?.((s) => Ie(s) ? St(s.name) === a : !1);
    if (Ie(o)) return o;
  }
  return null;
}
function Np(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Ie(a)) return a;
  }
  const r = St(t);
  if (r) {
    const a = n?.find?.((o) => Ie(o) ? St(o.name) === r : !1);
    if (Ie(a)) return a;
  }
  return null;
}
function xp(e) {
  const n = game.actors?.get?.(e);
  return Op(n) ? n : null;
}
function Op(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ie(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function St(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function jr(e) {
  const t = hn(e);
  if (!t) return null;
  const n = Mp().filter((o) => hn(Fp(o)) === t).map((o) => Ns(o)).find(Xe) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Xe(o) && hn(o.name) === t);
  return Xe(a) ? a : null;
}
function Mp() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Fp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ns(e)?.name ?? null;
}
function Ns(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Xe(t)) return t;
  const n = e.document?.actor;
  return Xe(n) ? n : null;
}
function Xe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function hn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function xs(e) {
  const t = Gp();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Bp(e)
  });
}
function Bp(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${wt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Up(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${wt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${wt(e.actorName)}</strong></p>
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
function Up(e) {
  const t = qp(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${wt(a)}</li>`;
}
function qp(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = oo(n?.value);
  return r === null ? null : {
    value: r,
    max: oo(n?.max)
  };
}
function oo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Gp() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function wt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function jp(e) {
  await xs(zp(e));
}
function zp(e) {
  if (Vp(e)) return e;
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
function Vp(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Os(e) {
  return e.mode, `✓ ${Ms(e.inputAmount)} PV`;
}
function Hp(e) {
  const t = Ms(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ms(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Wp {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? ge()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : jt(t.resistanceGateMode, t.resistanceState) ? {
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
class Kp {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? ge()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : jt(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Yp {
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
const Qp = `.${i}__actions`, zr = `.${i}__actions-title`, ve = `.${i}__button`, Zp = "data-paranormal-toolkit-action-section", Xp = `${i}__button--executed`, Jp = "data-paranormal-toolkit-executed-label";
function Fs(e) {
  return ee(e.querySelector(zr)?.textContent);
}
function eg(e, t) {
  const n = e.querySelector(zr);
  n && (n.textContent = t);
}
function lt(e, t) {
  const n = ee(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return ee(a) === n;
  }) ?? null;
}
function Vr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Ae(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Bs(e) {
  const t = tg(e.difficulty);
  if (t === null) return null;
  const n = io(e.skillLabel) ?? "Resistência", r = io(e.description), a = ng(r, n), o = rg(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function tg(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function io(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function ng(e, t) {
  if (!e) return null;
  const n = so(e), r = so(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function rg(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function so(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const yt = "data-paranormal-toolkit-prompt-id", Us = "multiTargetResistanceResults", qs = "multiTargetDamageApplications", Gs = "multiTargetEffectApplications";
function ag(e) {
  const t = /* @__PURE__ */ new Map(), r = Qt(e)?.[Us];
  if (!q(r)) return t;
  for (const [a, o] of Object.entries(r))
    dg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function og(e, t) {
  await Hr(e, Us, t.targetId, t);
}
function ig(e) {
  const t = /* @__PURE__ */ new Map(), r = Qt(e)?.[qs];
  if (!q(r)) return t;
  for (const [a, o] of Object.entries(r))
    mg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function sg(e, t) {
  await Hr(
    e,
    qs,
    t.targetId,
    t
  );
}
function lg(e) {
  const t = /* @__PURE__ */ new Map(), r = Qt(e)?.[Gs];
  if (!q(r)) return t;
  for (const [a, o] of Object.entries(r))
    pg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function cg(e, t) {
  await Hr(
    e,
    Gs,
    t.targetId,
    t
  );
}
function ug(e) {
  const t = Qt(e);
  return t ? {
    actorId: yn(t.actorId),
    itemId: yn(t.itemId),
    itemName: yn(t.itemName)
  } : null;
}
async function Hr(e, t, n, r) {
  const a = js(e);
  if (!a) return;
  const o = zs(e), s = Vs(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!q(u) || u.pendingId !== a) return u;
    const m = q(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, Vt, {
    ...s,
    prompts: c
  }));
}
function Qt(e) {
  const t = js(e);
  if (!t) return null;
  const n = zs(e), r = Vs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => q(o) ? o.pendingId === t : !1) ?? null;
}
function js(e) {
  return (e.closest(`[${yt}]`) ?? e.querySelector(`[${yt}]`) ?? e.parentElement?.querySelector(`[${yt}]`) ?? null)?.getAttribute(yt) ?? null;
}
function zs(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return gg(a) ? a : null;
}
function Vs(e) {
  const t = e?.getFlag?.(d, Vt);
  return q(t) ? t : null;
}
function dg(e) {
  return q(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function mg(e) {
  return q(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && fg(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function fg(e) {
  return e === "normal" || e === "half";
}
function pg(e) {
  return q(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function yn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function gg(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function q(e) {
  return !!(e && typeof e == "object");
}
const hg = "data-paranormal-toolkit-resistance-skill", yg = "data-paranormal-toolkit-resistance-skill-label", Gn = "data-paranormal-toolkit-multi-target-section", Wr = "data-paranormal-toolkit-multi-target-damage-info", Hs = "data-paranormal-toolkit-multi-target-effect-info", Ws = "data-paranormal-toolkit-multi-target-toggle", Ks = "data-paranormal-toolkit-multi-target-details", O = "data-paranormal-toolkit-multi-target-target", bg = "data-paranormal-toolkit-multi-target-state", jn = "data-paranormal-toolkit-multi-target-roll-total", zn = "data-paranormal-toolkit-multi-target-roll-formula", kt = "data-paranormal-toolkit-multi-target-roll-dice", Vn = "data-paranormal-toolkit-multi-target-roll-skill", Hn = "data-paranormal-toolkit-multi-target-roll-skill-label", Wn = "data-paranormal-toolkit-multi-target-roll-target-name", Kn = "data-paranormal-toolkit-multi-target-roll-rolled-at", Yn = "data-paranormal-toolkit-multi-target-damage-mode", Qn = "data-paranormal-toolkit-multi-target-damage-input-amount", lo = "data-paranormal-toolkit-multi-target-damage-final-amount", co = "data-paranormal-toolkit-multi-target-damage-blocked", Zn = "data-paranormal-toolkit-multi-target-damage-target-name", Xn = "data-paranormal-toolkit-multi-target-damage-applied-at", Jn = "data-paranormal-toolkit-multi-target-effect-condition-id", er = "data-paranormal-toolkit-multi-target-effect-condition-label", tr = "data-paranormal-toolkit-multi-target-effect-effect-id", nr = "data-paranormal-toolkit-multi-target-effect-created", rr = "data-paranormal-toolkit-multi-target-effect-refreshed", ar = "data-paranormal-toolkit-multi-target-effect-target-name", or = "data-paranormal-toolkit-multi-target-effect-applied-at", Ag = new gs(_s()), _g = new ds(new us()), Tg = new ms(new Or()), Rg = new Yp(Tg), $g = new Wp(_g), wg = new Kp(Ag), kg = Ls, Me = Ur, ct = qr, Eg = Ds;
function Ig(e) {
  const t = Ys(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Og(e);
  const n = Mg(e.rollCard, t), r = Fg(e.rollCard, t);
  !n && r && _h(e.rollCard, r, e.effectSection);
  const a = zg(e.rollCard);
  return Xs(a, t), yh(
    e.rollCard,
    a,
    Bg(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Th(e.rollCard, r, a), !0;
}
function Ys(e) {
  return bp({
    ...e,
    resistanceResults: Lg(e.rollCard),
    damageApplications: Dg(e.rollCard),
    effectApplications: vg(e.rollCard),
    resolveTargetConditionApplication: Cg,
    resistanceGateMode: Yr()
  });
}
function Cg(e, t, n) {
  const r = ug(e), a = Ps(r);
  if (!a) return null;
  const o = it(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = Sg(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function Sg(e, t, n) {
  const r = zf(
    e,
    n,
    t,
    bn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = bn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => bn(s) === a)) ?? null : null;
}
function Lg(e) {
  const t = ag(e);
  for (const [n, r] of xg(e))
    t.set(n, r);
  return t;
}
function Dg(e) {
  const t = ig(e);
  for (const [n, r] of Ng(e))
    t.set(n, r);
  return t;
}
function vg(e) {
  const t = lg(e);
  for (const [n, r] of Pg(e))
    t.set(n, r);
  return t;
}
function Pg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = n.getAttribute(Jn), o = n.getAttribute(er), s = n.getAttribute(tr), l = fo(n.getAttribute(nr)), c = fo(n.getAttribute(rr)), u = n.getAttribute(ar), m = n.getAttribute(or);
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
function Ng(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = n.getAttribute(Yn), o = ll(n.getAttribute(Qn)), s = n.getAttribute(Zn), l = n.getAttribute(Xn);
    !r || !wh(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function xg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${O}]`)) {
    const r = n.getAttribute(O), a = ll(n.getAttribute(jn)), o = n.getAttribute(zn), s = n.getAttribute(Vn), l = n.getAttribute(Hn), c = n.getAttribute(Wn), u = n.getAttribute(Kn);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(kt),
      rolledAt: u
    });
  }
  return t;
}
function Og(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Mg(e, t) {
  if (!t.damage)
    return Qs(e)?.remove(), null;
  const n = Ug(e);
  return qg(n, t.damage), jg(e, n), n;
}
function Fg(e, t) {
  if (!t.effect)
    return sl(e)?.remove(), null;
  const n = bh(e);
  return Ah(n, t.effect), n;
}
function Bg(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : lt(e, "Conjuração");
}
function Ug(e) {
  const t = Qs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Wr, "true"), n;
}
function Qs(e) {
  return e.querySelector(`[${Wr}="true"]`);
}
function qg(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Zs(t.formula, t.total, t.diceBreakdown));
}
function Zs(e, t, n, r = !1) {
  const a = dp({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Gg(a, r), a;
}
function Gg(e, t) {
  const n = e.querySelector(Wt), r = e.querySelector(Nr);
  if (!n || !r) return;
  e.classList.toggle(Pr, t), n.hidden = !t, r.classList.add(xr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function jg(e, t) {
  const n = lt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function zg(e) {
  const t = e.querySelector(`[${Gn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Gn, "true"), n;
}
function Xs(e, t) {
  const n = Vg(e), r = Wg(t.resistance), a = [Hg(t)];
  r && a.push(r), a.push(Qg(t, n)), e.replaceChildren(...a);
}
function Vg(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${O}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(O)).filter($h)
  );
}
function Hg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Yg(e.targets), t.append(n, r), t;
}
function Wg(e) {
  const t = Bs({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Kg(n, t), n;
}
function Kg(e, t) {
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
function Yg(e) {
  const t = e.length, n = e.filter((l) => l.state === ct).length, r = e.filter((l) => l.state === Me).length, a = e.filter((l) => l.state === kg).length, o = e.filter((l) => l.state === Eg).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Qg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Zg(r, e, t.has(r.id)));
  return n;
}
function Zg(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(O, e.id), r.setAttribute(bg, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Js(r, e.resistanceResult), el(r, e.damageApplication), tl(r, e.effectApplication);
  const a = Xg(e, t, r), o = fh(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    mo(s.target) || uo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || mo(s.target) || (s.preventDefault(), uo(r));
  }), r.append(a, o), r;
}
function Js(e, t) {
  if (!t) {
    e.removeAttribute(jn), e.removeAttribute(zn), e.removeAttribute(kt), e.removeAttribute(Vn), e.removeAttribute(Hn), e.removeAttribute(Wn), e.removeAttribute(Kn);
    return;
  }
  e.setAttribute(jn, String(t.total)), e.setAttribute(zn, t.formula), e.setAttribute(Vn, t.skill), e.setAttribute(Hn, t.skillLabel), e.setAttribute(Wn, t.targetName), e.setAttribute(Kn, t.rolledAt), t.diceBreakdown ? e.setAttribute(kt, t.diceBreakdown) : e.removeAttribute(kt);
}
function el(e, t) {
  if (!t) {
    e.removeAttribute(Yn), e.removeAttribute(Qn), e.removeAttribute(lo), e.removeAttribute(co), e.removeAttribute(Zn), e.removeAttribute(Xn);
    return;
  }
  e.setAttribute(Yn, t.mode), e.setAttribute(Qn, String(t.inputAmount)), e.removeAttribute(lo), e.removeAttribute(co), e.setAttribute(Zn, t.targetName), e.setAttribute(Xn, t.appliedAt);
}
function tl(e, t) {
  if (!t) {
    e.removeAttribute(Jn), e.removeAttribute(er), e.removeAttribute(tr), e.removeAttribute(nr), e.removeAttribute(rr), e.removeAttribute(ar), e.removeAttribute(or);
    return;
  }
  e.setAttribute(Jn, t.conditionId), e.setAttribute(er, t.conditionLabel), e.setAttribute(tr, t.effectId ?? ""), e.setAttribute(nr, String(t.created)), e.setAttribute(rr, String(t.refreshed)), e.setAttribute(ar, t.targetName), e.setAttribute(or, t.appliedAt);
}
function Xg(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Jg(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = eh(e, t.resistance);
  ah(l, n, e, t);
  const c = mh(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), ol(u, [
    nl(e, t, "compact"),
    al(e, t, "compact")
  ]), r.append(a, u), r;
}
function Jg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function eh(e, t) {
  if (!be())
    return th(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", rh(e, t)), t?.skill && (n.setAttribute(hg, t.skill), n.setAttribute(yg, t.skillLabel ?? pe(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Me ? "✓" : e.state === ct ? "✕" : "", n.append(r, a), n;
}
function th(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", nh(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Me ? "✓" : e.state === ct ? "✕" : "", n.append(r, a), n;
}
function nh(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Me ? "sucesso" : e.state === ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function rh(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Me ? "sucesso" : e.state === ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function ah(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !be() || e.addEventListener("click", (a) => {
    a.stopPropagation(), oh(t, e, n, r);
  });
}
async function oh(e, t, n, r) {
  if (!be()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? pe(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = jr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Rg.execute({ actor: l, skill: o, skillLabel: s });
    await Rh(u.roll);
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
    Js(e, m);
    try {
      await og(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    Kr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Kr(e) {
  const t = e.closest(`[${Gn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Ys({
    rollCard: n,
    damageSection: ih(n) ?? lt(n, "Dano"),
    effectSection: sh(n)
  });
  r && Xs(t, r);
}
function ih(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Wr) !== "true") ?? null;
}
function sh(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function lh(e) {
  return Oe(e.assistedActions.policy.damageActionState);
}
function ch(e) {
  return Oe(e.assistedActions.policy.effectActionState);
}
function Yr() {
  try {
    return Lr();
  } catch {
    return "strict";
  }
}
function nl(e, t, n) {
  if (e.damageApplication)
    return z(
      "✓",
      Os({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Oe(r))
    return z(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = rl(a, t.damage);
  if (o === null)
    return z(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Hp({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = z(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const y = u.closest(`[${O}]`);
    y && uh(y, u, e, t);
  }), u;
}
function rl(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function uh(e, t, n, r) {
  if (n.damageApplication) return;
  if (lh(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = rl(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = jr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await $g.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Yr(),
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
    el(e, m);
    try {
      await sg(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", y);
    }
    try {
      await jp(u.value);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", y);
    }
    Kr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function al(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (!a)
    return z(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return z(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (Oe(r))
    return z(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (ws(r))
    return z(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = z(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${O}]`);
    l && dh(l, o, e, t);
  }), o;
}
async function dh(e, t, n, r) {
  if (n.effectApplication) return;
  if (ch(n)) {
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
  const o = jr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await wg.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Yr(),
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
    tl(e, c);
    try {
      await cg(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Kr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ol(e, t) {
  for (const n of t)
    n && e.append(n);
}
function z(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function mh(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Ws, "true"), t.setAttribute("aria-hidden", "true"), il(e, t), t;
}
function uo(e) {
  const t = e.querySelector(`[${Ks}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Ws}="true"]`);
  r && il(e, r);
}
function il(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function mo(e) {
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
function fh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Ks, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = ph(e, t.resistance);
  s && r.append(s);
  const l = gh(e, t.resistance), c = hh(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function ph(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Me ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function gh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Zs(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function hh(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), ol(n, [
    nl(e, t, "full"),
    al(e, t, "full")
  ]), n;
}
function yh(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function bh(e) {
  const t = sl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Hs, "true"), n;
}
function sl(e) {
  return e.querySelector(`[${Hs}="true"]`);
}
function Ah(e, t) {
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
function _h(e, t, n) {
  const r = n?.parentElement === e ? n : lt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Th(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function bn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Rh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function $h(e) {
  return typeof e == "string" && e.length > 0;
}
function wh(e) {
  return e === "normal" || e === "half";
}
function fo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ll(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const po = "data-paranormal-toolkit-card-layout-refresh-bound";
function kh(e) {
  const t = e.rollCard.querySelector(Ht);
  t && t.getAttribute(po) !== "true" && (t.setAttribute(po, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Ce = "data-paranormal-toolkit-prompt-id", Eh = "apply-damage", Ih = "data-paranormal-toolkit-multi-target-damage-info";
function Ch(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(Ih) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Sh(e) {
  const t = Dh(e);
  return t.find((n) => n.getAttribute(Zp) === Eh) ?? t.find((n) => Fs(n) === "aplicar danos") ?? null;
}
function Lh(e) {
  const t = cl(e), n = go(t);
  return n || go(vh(e));
}
function go(e) {
  return e.find((t) => {
    const n = Fs(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Dh(e) {
  const t = cl(e);
  return t.length > 0 ? t : Qr(e);
}
function cl(e) {
  const t = xh(e);
  return t ? Qr(e).filter((n) => Nh(n, t)) : [];
}
function vh(e) {
  const t = ul(e);
  if (!t) return [];
  const n = Ph(e, t);
  return Qr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => dl(e, r)).filter((r) => !n || Oh(r, n));
}
function Qr(e) {
  const t = ul(e);
  return t ? Array.from(t.querySelectorAll(Qp)) : [];
}
function ul(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Ph(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && dl(e, n)) ?? null;
}
function Nh(e, t) {
  return e.getAttribute(Ce) === t ? !0 : Array.from(e.querySelectorAll(`[${Ce}]`)).some((n) => n.getAttribute(Ce) === t);
}
function xh(e) {
  return e.getAttribute(Ce) ?? e.querySelector(`[${Ce}]`)?.getAttribute(Ce) ?? null;
}
function dl(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Oh(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Mh(e) {
  const t = ml(), n = Yt(e.rollCard).state, r = Br({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Oe(a), s = ws(a);
  return e.applied ? Ve({
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
  }) : r.policy.canShowApplyEffect ? Ve(o ? {
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
  }) : Ve({
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
function Ve(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function Fh(e) {
  const { rollCard: t } = e, n = qh(), r = ml(), a = Yt(t).state, o = Br({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Oe(s), c = Uh(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: L(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: L(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: Bh(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: L("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: L("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: L("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: L("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: L("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: L("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: L("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: L("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: L("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: L("half", !1, !1, !1, !!e.halfButtonSkipped),
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
    normalButton: L("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: L("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function Bh(e) {
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
function L(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function Uh(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function qh() {
  try {
    return ed();
  } catch {
    return "assisted";
  }
}
function ml() {
  try {
    return Lr();
  } catch {
    return "strict";
  }
}
const Gh = "data-paranormal-toolkit-damage-resolution-state", ho = "data-paranormal-toolkit-damage-icon-enhanced", Zr = "data-paranormal-toolkit-damage-original-label", jh = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, fl = "Outra opção escolhida";
function zh(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), eg(t, "Aplicar dano"), Vh(e, t);
}
function Vh(e, t) {
  const n = Array.from(t.querySelectorAll(ve)), r = bo(n, "normal"), a = bo(n, "half");
  if (!r || !a) {
    Hh(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Ao(r, "normal"), Ao(a, "half");
  const o = Fh({
    rollCard: e,
    normalButtonApplied: Lt(r),
    halfButtonApplied: Lt(a),
    normalButtonSkipped: ir(r),
    halfButtonSkipped: ir(a)
  });
  if (!o.canShowApplyDamage) {
    _o(r), _o(a), To(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), yo(r, o.normalButton), yo(a, o.halfButton), To(t, o.summary.state, o.summary.message);
}
function yo(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Kh(e, t.visible), Yh(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function Hh(e) {
  for (const t of e)
    ir(t) && t.remove();
}
function Lt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(fl);
}
function ir(e) {
  return e.textContent?.includes(fl) ?? !1;
}
function bo(e, t) {
  const n = jh[t];
  return e.find((r) => n.test(Wh(r))) ?? null;
}
function Wh(e) {
  return [
    e.getAttribute(Zr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Ao(e, t) {
  if (e.getAttribute(ho) === "true") return;
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
  ), e.setAttribute(ho, "true"), e.setAttribute(Zr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, Ae(n));
}
function _o(e) {
  Lt(e) || e.remove();
}
function Kh(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function Yh(e, t, n, r = "Role resistência") {
  if (!Lt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(Ae(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Qh(e, n);
  }
}
function Qh(e, t) {
  const n = e.getAttribute(Zr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Zh(t), Ae(n)));
}
function Zh(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function To(e, t, n) {
  e.setAttribute(Gh, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(zr)?.after(a);
}
const tt = "data-paranormal-toolkit-effect-icon-enhanced", Pe = "data-paranormal-toolkit-effect-action-compacted", Zt = "data-paranormal-toolkit-effect-resistance-gate", Xr = "data-paranormal-toolkit-effect-section", Jr = "data-paranormal-toolkit-effect-label";
function Xh(e) {
  return e.querySelector(`[${Xr}="true"]`);
}
function Jh(e) {
  const t = ty(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? ry(), r = my(n, e.sourceActions, t);
  return r && n.setAttribute(Jr, r), ay(n, t, r), uy(e.rollCard, n, e.after ?? e.fallbackAfter), dy(e.sourceActions, n), n;
}
function ey(e, t) {
  const n = t.querySelector(ve);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = yl(t, n, r), o = pl(e, n), s = Mh({
    rollCard: e,
    effectLabel: a,
    applied: ta(n, r),
    effectCanApplyOnSuccessfulResistance: o ? De(o) === "success" || De(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? $s(o) : !1
  });
  if (s.applied) {
    py(n);
    return;
  }
  if (!s.visible) {
    gy(n);
    return;
  }
  if (s.waitingForResistance) {
    hy(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    yy(n, s.compactLabel);
    return;
  }
  by(n), hl(n, s.displayLabel);
}
function ty(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(ve) ?? []), n = Array.from(e.existingSection?.querySelectorAll(ve) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : ny(e.rollCard, r) ?? r[0] ?? null;
}
function ny(e, t) {
  const n = Yt(e).state, r = Ts(n), a = gl(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = pl(e, o, a);
    if (s && Rs(s, r)) return o;
  }
  return null;
}
function pl(e, t, n = gl(e)) {
  const r = ea(t, t.textContent?.trim() ?? ""), a = qn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => qn(s) === a)) ?? null : null;
}
function gl(e) {
  const t = Ps(Xf(e));
  if (!t) return [];
  const n = it(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function ry() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Xr, "true"), e;
}
function ay(e, t, n) {
  e.setAttribute(Xr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = oy(e), a = iy(r);
  a.textContent = "Efeito";
  const o = sy(e, r), s = ly(o);
  s.textContent = Ay(n ?? yl(e, t, t.textContent?.trim() ?? ""));
  const l = cy(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(ve)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !ta(t, c) && !fy(t, c) && hl(t, n ?? c);
}
function oy(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function iy(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function sy(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function ly(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function cy(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function uy(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function dy(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(ve)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function my(e, t, n) {
  const r = e.getAttribute(Jr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || ea(n, n.textContent?.trim() ?? "");
}
function ea(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ee(n) !== "efeito aplicado") return n;
  const r = Jf(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && ee(a) !== "aplicado" ? a : null;
}
function ta(e, t) {
  return e.classList.contains(Xp) || ee(t).includes("aplicado");
}
function fy(e, t) {
  const n = e.getAttribute(Zt);
  if (n === "pending" || n === "resisted") return !0;
  const r = qn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function hl(e, t) {
  e.getAttribute(Pe) === "true" && e.getAttribute(tt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Pe, "true"), e.setAttribute(tt, "true"), e.setAttribute(Jp, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Vr("✦", `${i}__button-icon--effect`),
    Ae("Aplicar")
  ));
}
function py(e) {
  e.getAttribute(Pe) === "true" && ee(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Pe, "true"), e.setAttribute(tt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Vr("✓", `${i}__button-icon--effect-applied`),
    Ae("Aplicado")
  ));
}
function yl(e, t, n) {
  const r = e.getAttribute(Jr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : ea(t, n) ?? n;
}
function gy(e) {
  ta(e, e.textContent?.trim() ?? "") || e.remove();
}
function hy(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Pe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Zt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Ae(t));
}
function yy(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Pe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Zt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Vr("✓", `${i}__button-icon--effect-resisted`),
    Ae(t)
  );
}
function by(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Zt), e.removeAttribute("aria-disabled");
}
function Ay(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const _y = "data-paranormal-toolkit-card-layout-normalized";
function Ty(e) {
  const t = Ry(e.rollCard), n = $y(t);
  return kh({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function Ry(e) {
  return {
    rollCard: e,
    damageSection: Ch(e),
    resistance: e.querySelector(vr),
    damageActions: Sh(e),
    effectActionSource: Lh(e),
    effectSection: Xh(e)
  };
}
function $y(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(_y, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = lt(t, "Conjuração"), c = wy({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), zh(t, a));
  const u = Jh({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: ky(n, c),
    fallbackAfter: l
  });
  return u && ey(t, u), u;
}
function wy(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function ky(e, t) {
  return e ?? t;
}
const bl = [0, 80, 180, 400, 900, 1600, 3e3], Ro = /* @__PURE__ */ new WeakSet();
function Ey(e) {
  Al(e), Iy(e);
}
function Al(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    _l(t);
}
function Iy(e) {
  if (!Ro.has(e)) {
    Ro.add(e);
    for (const t of bl)
      globalThis.setTimeout(() => {
        Al(e);
      }, t);
  }
}
function _l(e) {
  const t = Ty({
    rollCard: e,
    refreshDelaysMs: bl,
    onRefresh: () => _l(e)
  });
  Ig({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const Cy = "data-paranormal-toolkit-resistance-roll-result-enhanced", $o = "data-paranormal-toolkit-resistance-original-description", Sy = "data-paranormal-toolkit-resistance-skill", Ly = "data-paranormal-toolkit-resistance-skill-label";
function Dy(e) {
  for (const t of Array.from(e.querySelectorAll(vr)))
    vy(t);
  Ey(e);
}
function vy(e) {
  const t = e.querySelector(Fd), n = e.querySelector(as), r = e.querySelector(Ht), a = e.querySelector(os);
  if (!r || !t && !n && !a) return;
  const o = Oy(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), My(a)), Gy(r), Py(e, r, n), r.parentElement !== e && e.append(r);
}
function Py(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = xy(n), o = Bs({
    description: a,
    skillLabel: t.getAttribute(Ly) ?? t.getAttribute(Sy),
    difficulty: Fr(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  Ny(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function Ny(e, t) {
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
function xy(e) {
  const t = e.getAttribute($o);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute($o, n), n;
}
function Oy(e, t) {
  const n = e.querySelector(`.${za}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(za), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function My(e) {
  const t = Fy(e.textContent ?? "");
  t && (e.setAttribute(Cy, "true"), e.replaceChildren(qy(t)));
}
function Fy(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = By(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function By(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Uy(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Uy(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function qy(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = jy(e);
  return r && t.append(r), t;
}
function Gy(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Yt(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function jy(e) {
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
  return n.includes("kh") ? wo(e, "highest") : n.includes("kl") ? wo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function wo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function ko(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function na() {
  const e = globalThis.game;
  return Xt(e) ? e : null;
}
function U(e, t) {
  const n = Vy(e, t);
  return Et(n);
}
function Vy(e, t) {
  return t.split(".").reduce((n, r) => Xt(n) ? n[r] : null, e);
}
function Hy(e, t) {
  const n = e.indexOf(":");
  return n < 0 || nt(e.slice(0, n)) !== nt(t) ? null : Fe(e.slice(n + 1));
}
function Et(e) {
  return typeof e == "string" ? Fe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Xt(e) {
  return !!e && typeof e == "object";
}
function Wy(e) {
  return typeof e == "string";
}
function Jt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Fe(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function nt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function sr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function te(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Tl(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Ky(e) {
  for (const t of Array.from(e.querySelectorAll(xd))) {
    const n = tb(t);
    Yy(t), n && (Qy(t, n), Zy(t, n));
  }
}
function Yy(e) {
  for (const t of Array.from(e.querySelectorAll(Od)))
    t.remove();
}
function Qy(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(rs) ?? null, a = r?.querySelector(Nd) ?? null, o = r ?? e, s = o.querySelector(qd);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = bb(t.elementTone), l.textContent = yb(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Zy(e, t) {
  const n = Xy(e);
  Jy(e, n);
  const r = eb(t);
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
  const o = e.querySelector(is);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Xy(e) {
  return e.closest(`.${i}`)?.querySelector(rs) ?? null;
}
function Jy(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Gd)))
      a.remove();
}
function eb(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${sr(e.target)}` : null,
    e.duration ? `Duração: ${sr(e.duration)}` : null,
    e.resistance ? `Resistência: ${Tl(e.resistance)}` : null
  ].filter(Jt);
}
function tb(e) {
  const t = nb(e), n = lb(e), a = (t ? sb(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = ra(U(a, "element")), l = K("op.elementChoices", s) ?? Eo(ce(o, "Elemento")) ?? Eo(n.damageType), c = s ?? Ab(l), u = U(a, "circle") ?? ce(o, "Círculo"), m = db(a) ?? ce(o, "Alvo"), y = gb(a, "duration", "op.durationChoices") ?? ce(o, "Duração"), R = cb(e) ?? fb(a) ?? ce(o, "Resistência"), T = ub(o) ?? n.cost, p = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: T,
    target: m,
    duration: y,
    resistance: R
  };
  return hb(p) ? p : null;
}
function nb(e) {
  const t = rb(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Vt), r = ob(n);
  if (r.length === 0) return null;
  const a = ab(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function rb(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? na()?.messages?.get?.(n) ?? null : null;
}
function ab(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${ja}]`))) {
    const a = r.getAttribute(ja)?.trim();
    a && n.add(a);
  }
  return n;
}
function ob(e) {
  if (!Xt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(ib).filter((n) => n !== null) : [];
}
function ib(e) {
  return Xt(e) ? {
    pendingId: Et(e.pendingId),
    actorId: Et(e.actorId),
    itemId: Et(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Wy) : []
  } : null;
}
function sb(e) {
  if (!e.itemId) return null;
  const t = na(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function lb(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Md))) {
    const a = Fe(r.textContent);
    if (!a) continue;
    const o = Hy(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function cb(e) {
  const t = Fe(e.querySelector(as)?.textContent);
  return t ? Tl(t) : null;
}
function ce(e, t) {
  const n = nt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || nt(r.slice(0, a)) !== n))
      return Fe(r.slice(a + 1));
  }
  return null;
}
function ub(e) {
  const t = ce(e, "Custo") ?? ce(e, "PE");
  return t || (e.map(Fe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function db(e) {
  const t = U(e, "target");
  if (!t) return null;
  if (t === "area")
    return mb(e) ?? K("op.targetChoices", t) ?? "Área";
  const n = K("op.targetChoices", t) ?? te(t);
  return [t === "people" || t === "creatures" ? U(e, "targetQtd") : null, n].filter(Jt).join(" ");
}
function mb(e) {
  const t = U(e, "area.name"), n = U(e, "area.size"), r = U(e, "area.type"), a = t ? K("op.areaChoices", t) ?? te(t) : null, o = r ? K("op.areaTypeChoices", r) ?? te(r) : null;
  return a ? n ? o ? `${a} ${n}m ${sr(o)}` : `${a} ${n}m` : a : null;
}
function fb(e) {
  const t = U(e, "skillResis"), n = U(e, "resistance");
  if (!t || !n) return null;
  const r = K("op.skill", t) ?? te(t), a = pb(n);
  return [r, a].filter(Jt).join(" ");
}
function pb(e) {
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
function gb(e, t, n) {
  const r = U(e, t);
  return r ? K(n, r) ?? te(r) : null;
}
function hb(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function yb(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function bb(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Jt).join(" ");
}
function ra(e) {
  const t = nt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Eo(e) {
  const t = ra(e);
  return t ? K("op.elementChoices", t) ?? te(t) : e ? te(e) : null;
}
function Ab(e) {
  return ra(e);
}
function K(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = na()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Io = "data-paranormal-toolkit-dice-toggle-enhanced";
function _b(e) {
  for (const t of Array.from(e.querySelectorAll(ss)))
    Rl(t);
}
function Tb(e) {
  const t = wl(e.target);
  if (!t) return;
  const n = aa(t);
  n && (e.preventDefault(), $l(n, t));
}
function Rb(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = wl(e.target);
  if (!t) return;
  const n = aa(t);
  n && (e.preventDefault(), $l(n, t));
}
function Rl(e) {
  const t = e.querySelector(Wt);
  if (!t) return;
  const n = e.querySelector(Nr);
  if (n && n.getAttribute(Io) !== "true" && (n.setAttribute(Io, "true"), n.classList.add(xr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function $l(e, t) {
  const n = e.querySelector(Wt);
  if (!n) return;
  const r = !e.classList.contains(Pr);
  $b(e, t, n, r);
}
function $b(e, t, n, r) {
  e.classList.toggle(Pr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function wl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Nr);
  if (!t) return null;
  const n = aa(t);
  return n ? (Rl(n), t.classList.contains(xr) ? t : null) : null;
}
function aa(e) {
  const t = e.closest(ss);
  return t && t.querySelector(Wt) ? t : null;
}
const Co = `${d}-workflow-dice-toggle-styles`;
function wb() {
  if (document.getElementById(Co)) return;
  const e = document.createElement("style");
  e.id = Co, e.textContent = `
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
const kb = [0, 100, 500, 1500, 3e3];
let So = !1, An = null;
function Eb() {
  if (!So) {
    So = !0, wb(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Qe(ko(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Qe(ko(t));
    }), Hooks.once("ready", () => {
      Qe(document), Ib();
    }), document.addEventListener("click", Tb), document.addEventListener("keydown", Rb);
    for (const e of kb)
      globalThis.setTimeout(() => Qe(document), e);
  }
}
function Ib() {
  An || !document.body || (An = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Qe(n);
  }), An.observe(document.body, { childList: !0, subtree: !0 }));
}
function Qe(e) {
  e && (im(e), Ky(e), Dy(e), _b(e), Xd(e));
}
function Cb() {
  Eb();
}
const Sb = "data-paranormal-toolkit-action-section", Lb = "ritual-log", Db = ".paranormal-toolkit-item-use-prompt__actions", vb = ".paranormal-toolkit-item-use-prompt__actions-title", Pb = [0, 100, 500, 1500];
let Lo = !1;
function Nb() {
  if (Lo) return;
  const e = (t, n) => {
    Do(Fb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Do(document), Lo = !0;
}
function Do(e) {
  for (const t of Pb)
    globalThis.setTimeout(() => xb(e), t);
}
function xb(e) {
  Ob(e), Mb(e);
}
function Ob(e) {
  for (const t of e.querySelectorAll(
    `[${Sb}="${Lb}"]`
  ))
    t.remove();
}
function Mb(e) {
  for (const t of e.querySelectorAll(Db)) {
    if (vo(t.querySelector(vb)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => vo(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function Fb(e) {
  if (e instanceof HTMLElement || Bb(e))
    return e;
  if (Ub(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Bb(e) {
  return e instanceof HTMLElement;
}
function Ub(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function vo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ze = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, kl = {
  PV: "system.attributes.hp"
}, lr = {
  PV: [Ze.PV, kl.PV],
  SAN: [Ze.SAN],
  PE: [Ze.PE],
  PD: [Ze.PD]
}, cr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class qb {
  getResource(t, n) {
    const r = Po(t, n);
    if (!r.ok)
      return g(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = xo(t, n, o, l, "valor atual");
    if (u) return g(u);
    const m = xo(t, n, s, c, "valor máximo");
    return m ? g(m) : b({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Po(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Po(e, t) {
  const n = Gb(e.type, t);
  if (n && No(e, n))
    return b(n);
  const r = lr[t].find(
    (a) => No(e, a)
  );
  return r ? b(r) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: jb(e, t),
    path: lr[t].join(" | ")
  });
}
function Gb(e, t) {
  return e === "threat" ? kl[t] ?? null : e === "agent" ? Ze[t] : null;
}
function No(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function jb(e, t) {
  const n = e.type ?? "unknown", r = lr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function xo(e, t, n, r, a) {
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
class zb {
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
      const s = cr.ritualItem.circleCandidates;
      return g({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = Vb(a);
    return o ? b(o) : g({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of cr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Vb(e) {
  if (Oo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Oo(n))
      return n;
  }
  return null;
}
function Oo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Hb = "dice-so-nice";
async function El(e) {
  if (!Wb() || !Kb()) return;
  const t = Yb();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Wb() {
  try {
    return Pd().enabled;
  } catch {
    return !1;
  }
}
function Kb() {
  return game.modules?.get?.(Hb)?.active === !0;
}
function Yb() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Mo = "occultism";
class Il {
  getDifficulty(t) {
    return Qb(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Xb(t, Mo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await El(r);
    const a = tA(r);
    return {
      skill: Mo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: eA(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: nA(r)
    };
  }
}
function Qb(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Zb(e) {
  return new Il().rollCastingCheck(e);
}
async function Xb(e, t) {
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
  return Jb(r);
}
function Jb(e) {
  return Fo(e) ? e : Array.isArray(e) ? e.find(Fo) ?? null : null;
}
function Fo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function eA(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function tA(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function nA(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(rA);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function rA(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const aA = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class oA {
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
    const r = n.value, a = iA(t.ritual, r);
    return a.ok ? a.value ? b(a.value) : b({
      resource: "PE",
      amount: aA[r],
      source: "default-by-circle",
      circle: r
    }) : g(a.error);
  }
}
function iA(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : sA(n) ? {
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
function sA(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const _n = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function lA(e) {
  if (!pA(e.item)) return null;
  const t = ur(e.actor) ? e.actor : cA(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: dA(e.token) ?? uA(t),
    targets: Sr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function cA(e) {
  const t = e;
  return ur(t.actor) ? t.actor : ur(e.parent) ? e.parent : null;
}
function uA(e) {
  const t = mA(e) ?? fA(e);
  return t ? Cl(t) : null;
}
function dA(e) {
  return dr(e) ? Cl(e) : null;
}
function mA(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return dr(n) ? n : (t.getActiveTokens?.() ?? []).find(dr) ?? null;
}
function fA(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Cl(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Tn(e.id),
    actorId: Tn(t?.id),
    sceneId: Tn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function pA(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ur(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function dr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Tn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class gA {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(_n.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${_n.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = lA(hA(t));
    if (!n) {
      f.warn(`${_n.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function hA(e) {
  return e && typeof e == "object" ? e : {};
}
class yA {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Rn("missing-item-patch");
    if (t.type !== "ritual") return Rn("unsupported-item-type");
    const a = bA(r);
    return Object.keys(a).length === 0 ? Rn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function bA(e) {
  const t = {};
  v(t, "name", e.name), v(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (v(t, "system.circle", n.circle), v(t, "system.element", n.element), v(t, "system.target", n.target), v(t, "system.targetQtd", n.targetQuantity), v(t, "system.execution", n.execution), v(t, "system.range", n.range), v(t, "system.duration", n.duration), v(t, "system.skillResis", n.resistanceSkill), v(t, "system.resistance", n.resistance), v(t, "system.studentForm", n.studentForm), v(t, "system.trueForm", n.trueForm)), t;
}
function v(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Rn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class AA {
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
    return this.getNumber(t, cr.ritual.dt, 0);
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
class _A {
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
class TA {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = RA(t);
    return n.ok ? this.presets.has(t.id) ? g({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, $n(t)), b(t)) : n;
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
    return n ? $n(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? b(n) : g({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map($n);
  }
  findForItem(t) {
    return this.list().map((n) => $A(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function RA(e) {
  return !wn(e.id) || !wn(e.version) || !wn(e.label) ? g({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? g({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : b(e);
}
function $A(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = wA(a, t);
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
function wA(e, t) {
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
      const n = Bo(t.name), r = e.names.map(Bo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = kA(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Bo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function kA(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function $n(e) {
  return structuredClone(e);
}
function wn(e) {
  return typeof e == "string" && e.length > 0;
}
function Dt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? g({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : b(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = en(e.amountFrom);
    if (!n)
      return g({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const r = t.rolls[n];
    if (!r)
      return g({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const a = Math.trunc(r.total);
    return !Number.isInteger(a) || a <= 0 ? g({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : b(a);
  }
  return g({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function en(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function EA(e, t, n) {
  if (!Uo(e.id) || !Uo(e.formula))
    return g({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), a = await Promise.resolve(r.evaluate()), o = a.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return g({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await El(a);
    const l = {
      ...n.rollRequests[e.id] ?? Sl(e, t),
      total: o,
      roll: a
    };
    return n.rolls[e.id] = l, b(l);
  } catch (r) {
    return g({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Sl(e, t) {
  const n = e.intent ?? IA(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function IA(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Uo(e) {
  return typeof e == "string" && e.length > 0;
}
async function vt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? bt(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? bt(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? bt(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? bt(t, n, r, a) : e.recover(t, n, a);
  }
}
function bt(e, t, n, r) {
  return g({
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
function CA(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = SA(t, n, r, a);
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
    const s = LA(t, n, r, a);
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
function SA(e, t, n, r) {
  const a = en(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Ll(t.id, "damage", r, t.damageInstances.length),
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
function LA(e, t, n, r) {
  const a = en(e.amountFrom);
  return {
    id: Ll(t.id, "healing", r, t.healingInstances.length),
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
function Ll(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function DA(e, t, n) {
  const r = en(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function vA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Dl("before", e), qo("before", e), qo("resolve", e);
}
function PA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Dl("apply", e);
}
function NA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Dl(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = xA(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function qo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function xA(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function OA(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), b(void 0);
  } catch (r) {
    return g({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function MA(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return FA(e, t);
    case "spendRitualCost":
      return BA(e, t);
  }
}
async function FA(e, t) {
  const { context: n, resources: r } = e, a = Dt(t, n);
  return a.ok ? vl(await r.spend(n.sourceActor, t.resource, a.value), n) : g(a.error);
}
async function BA(e, t) {
  const { context: n, resources: r, ritualCosts: a } = e, o = a.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!o.ok)
    return g({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), vl(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function vl(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function UA(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = qA(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function qA(e) {
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
class GA {
  constructor(t, n, r, a) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = a;
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
        return UA({
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
        return g({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, r) {
    const a = await MA({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? b(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Sl(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await EA(t, r, n);
    return a.ok ? b(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Dt(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = DA(t, n, a.value);
    vA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), PA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, n);
    if (s.length === 0)
      return g({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const l of s) {
      const c = await vt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      CA({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return NA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), b(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Dt(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = this.resolveActors(t.actor, n);
    if (o.length === 0)
      return g({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of o) {
      const l = await vt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return b(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await OA(this.messages, t, n);
    return a.ok ? b(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, a) {
    return t.ok ? (n.resourceTransactions.push(t.value), b(t.value)) : g({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: a,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, a, o, s) {
    const l = jA(t, n.intent);
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
function jA(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class zA {
  emitCastStarted(t) {
    Hooks.callAll(Tt.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Tt.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Tt.ritual.castFinished, t);
  }
}
class VA {
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
      return g({
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
      return g({
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
      return g({
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
    } catch (y) {
      return g({
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
        cause: y
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
        return n.value < r ? g({
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
class HA {
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
function Pl(e) {
  return {
    id: WA(),
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
function WA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class KA {
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
    return me(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Pl(n);
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
class YA {
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
class QA {
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
    const n = Fn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: ZA(),
      flags: {
        ...t.flags,
        [d]: {
          ...XA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Fn();
    if (!r.enabled)
      return;
    const a = n.notification ?? Go(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Go(n);
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
function Go(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function ZA() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function XA(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const JA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Nl = `${d}-inline-roll-neutralized`, e_ = `${d}-inline-roll-notice`, oa = `data-${d}-inline-roll-neutralized`, jo = `data-${d}-inline-roll-notice`, t_ = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function zo(e) {
  const t = g_(e.message), n = await n_(e.message), r = r_(t);
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
async function n_(e) {
  const t = m_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = a_(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await f_(t, n.content), replacementCount: n.replacementCount };
}
function r_(e) {
  const t = e ? p_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = xl(t);
  return n > 0 && Ol(c_(t)), { replacementCount: n };
}
function a_(e) {
  const t = o_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = xl(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Ol(n.content), { content: n.innerHTML, replacementCount: a });
}
function o_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, s_(a.trim()))), replacementCount: t };
}
function xl(e) {
  const t = i_(e);
  for (const n of t)
    n.replaceWith(l_(u_(n)));
  return t.length;
}
function i_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(JA))
    n.getAttribute(oa) !== "true" && t.add(n);
  return Array.from(t);
}
function s_(e) {
  return `<span class="${Nl}" ${oa}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${h_(e)}</span>`;
}
function l_(e) {
  const t = document.createElement("span");
  return t.classList.add(Nl), t.setAttribute(oa, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ol(e) {
  if (e.querySelector?.(`[${jo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(e_), t.setAttribute(jo, "true"), t.textContent = t_, e.append(t);
}
function c_(e) {
  return e.querySelector(".message-content") ?? e;
}
function u_(e) {
  const n = e.getAttribute("data-formula") ?? d_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function d_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function m_(e) {
  return e && typeof e == "object" ? e : null;
}
async function f_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function p_(e) {
  const t = y_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function g_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function h_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function y_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Pt = "ritualRollConfig", Nt = "ritual-roll";
function tn() {
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
function Ml(e) {
  const t = e.getFlag(d, Pt);
  return mr(t);
}
function Fl(e) {
  return Ml(e) ?? tn();
}
async function b_(e, t) {
  const n = mr(t) ?? mr({
    ...tn(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Pt, n), n;
}
async function A_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Pt));
    return;
  }
  await e.setFlag(d, Pt, null);
}
function mr(e) {
  if (!nn(e)) return null;
  const t = C_(e.intent);
  if (!t) return null;
  const n = tn();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Ot(e.damageType),
    utilityLabel: Ot(e.utilityLabel) ?? n.utilityLabel,
    note: ia(e.note),
    forms: S_(e.forms)
  };
}
function __(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function T_(e) {
  const t = Ml(e);
  if (!t) return null;
  const n = E_(e, t);
  if (!n) return null;
  const r = R_(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...$_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: k_(e, t),
    resistance: t.intent === "damage" ? Bl(e) : void 0
  };
}
function R_(e, t) {
  const n = {
    type: "rollFormula",
    id: Nt,
    formula: t,
    intent: I_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function $_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Nt}.total`,
          ...w_(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Nt}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function w_(e) {
  return e ? { damageType: e } : {};
}
function k_(e, t) {
  const n = {
    base: kn("Padrão", t.forms.base.formula)
  };
  return xt(e, "discente") && (n.discente = kn("Discente", t.forms.discente.formula, 2)), xt(e, "verdadeiro") && (n.verdadeiro = kn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function kn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Nt]: t.trim()
    }
  };
}
function E_(e, t) {
  return [
    t.forms.base.formula.trim(),
    xt(e, "discente") ? t.forms.discente.formula.trim() : "",
    xt(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Bl(e) {
  const t = Ul(e), n = Ot(t.skillResis), r = Ot(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = L_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function I_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function C_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function S_(e) {
  const t = tn();
  return nn(e) ? {
    base: En(e.base),
    discente: En(e.discente),
    verdadeiro: En(e.verdadeiro)
  } : t.forms;
}
function En(e) {
  return nn(e) ? { formula: ia(e.formula) } : { formula: "" };
}
function xt(e, t) {
  const n = Ul(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return D_(r);
}
function Ul(e) {
  const t = e.system;
  return nn(t) ? t : {};
}
function L_(e) {
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
function D_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ia(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Ot(e) {
  const t = ia(e);
  return t.length > 0 ? t : null;
}
function nn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function v_(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function P_(e) {
  switch (N_(e)) {
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
      return x_(String(e ?? ""));
  }
}
function N_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function x_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function O_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function M_(e) {
  return {
    ...sa(e),
    type: "ritual.cast.started"
  };
}
function F_(e) {
  return {
    ...sa(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function B_(e) {
  return {
    ...sa(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function U_(e) {
  if (e.type === "preset") {
    const t = fe(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: fe(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: fe(e.label),
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
function q_(e, t = {}) {
  const n = nT(e), r = [
    ...aT(t.candidates ?? []),
    ...oT(e)
  ], a = sT(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = rT(t) ?? lT(r) ?? uT(a), s = mT(canvas?.grid?.size), l = G_(o, a, r), c = Q_(r), u = Y_(l);
  return {
    type: "rectangleRay",
    sceneId: dT(e, n),
    regionId: Zo(n?.id) ?? Zo(e.id),
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
function G_(e, t, n) {
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
    direction: j_(r, t, n)
  };
}
function j_(e, t, n) {
  const r = z_(n);
  return r !== null ? r : H_(e, t) ?? e.direction;
}
function z_(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = Vo(n, t);
    if (r !== null) return r;
    const a = rn(n), o = Vo(a, t);
    if (o !== null) return o;
  }
  return null;
}
function Vo(e, t) {
  for (const n of t) {
    const r = V_(x(e, n));
    if (r !== null) return r;
  }
  return null;
}
function V_(e) {
  const t = rt(e);
  if (t === null) return null;
  const n = ca(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function H_(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Wo(Ho(e, e.direction), t), r = W_(e, t);
  if (r === null) return null;
  const o = K_([
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
    error: Wo(Ho(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? ca(o.direction) : null;
}
function W_(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Xo(o, 0, 1), c = Xo(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : fT(Math.atan2(c, l));
}
function Ho(e, t) {
  const n = Gl(t), r = {
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
  ], s = o.map((R) => R.x), l = o.map((R) => R.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), y = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: y - m
  };
}
function Wo(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function K_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = ca(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function Y_(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Gl(e.direction), n = {
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
function Q_(e) {
  for (const t of e) {
    const n = Ko(t, "ray.start"), r = Ko(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Ko(e, t) {
  const n = x(e, t), r = rt(x(n, "x")), a = rt(x(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function sa(e) {
  const t = U_(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: J_(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: Z_(e.context.item, e.form, e.formLabel, t),
    targets: n.map(eT),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function Z_(e, t, n, r) {
  return {
    name: e.name,
    slug: In(e, "system.slug") ?? In(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: In(e, "system.element"),
    circle: tT(e),
    form: X_(t),
    formLabel: n
  };
}
function X_(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function J_(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function eT(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function tT(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : fe(t);
}
function In(e, t) {
  return fe(foundry.utils.getProperty(e, t));
}
function fe(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function nT(e) {
  return "document" in e && e.document ? e.document : e;
}
function rT(e) {
  return ql(e.shape);
}
function aT(e) {
  return e.filter(la);
}
function oT(e) {
  return [
    e,
    iT(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(la);
}
function iT(e) {
  return "object" in e && la(e.object) ? e.object : null;
}
function la(e) {
  return !!(e && typeof e == "object");
}
function sT(e) {
  for (const t of e) {
    const n = Yo(x(rn(t), "bounds"));
    if (n) return n;
    const r = Yo(x(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function Yo(e) {
  const t = E(e, "x"), n = E(e, "y"), r = E(e, "width"), a = E(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function E(e, t) {
  return rt(x(e, t));
}
function lT(e) {
  for (const t of e) {
    const n = cT(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function cT(e) {
  if (!e || typeof e != "object") return [];
  const t = Qo(rn(e));
  return t.length > 0 ? t : Qo(e);
}
function Qo(e) {
  const t = x(e, "shapes");
  return Array.isArray(t) ? t.map(ql).filter((n) => n !== null) : [];
}
function ql(e) {
  const t = rn(e) ?? e, n = x(t, "type");
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
function uT(e) {
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
function dT(e, t) {
  return Cn(e, "parent.id") ?? Cn(e, "document.parent.id") ?? Cn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Cn(e, t) {
  return fe(x(e, t));
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
function rn(e) {
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
function Zo(e) {
  return fe(e);
}
function rt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function mT(e) {
  const t = rt(e);
  return t !== null && t > 0 ? t : null;
}
function Gl(e) {
  return e * Math.PI / 180;
}
function fT(e) {
  return e * 180 / Math.PI;
}
function ca(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Xo(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class pT {
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
class an {
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
const gT = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class hT {
  constructor(t = new an()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = yT(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(gT);
  }
}
function yT(e, t) {
  const n = [], r = bT(e), a = Jo(r), o = Jo(e);
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
function bT(e) {
  return AT(e) ? e.document ?? null : e;
}
function AT(e) {
  return "bounds" in e;
}
function Jo(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const _T = 100, TT = 12;
class RT {
  constructor(t = new an()) {
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
      const a = this.foundryAdapter.getGridSize() ?? _T, o = IT(n), s = await this.foundryAdapter.placeRegion(
        $T(t, this.foundryAdapter.getUserColor(), a),
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
        message: ET(a)
      };
    }
  }
}
function $T(e, t, n) {
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
    shapes: [wT(e, n)]
  };
}
function wT(e, t) {
  const n = kT(e, t);
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
function kT(e, t) {
  return {
    length: ei(e.length, TT, t),
    width: ei(e.width, 1, t)
  };
}
function ei(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function ET(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function IT(e) {
  const t = (n) => {
    const r = CT(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function CT(e) {
  return ST(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function ST(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class LT {
  constructor(t = new an()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(ti(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(ti(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = DT(t);
    vT(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function ti(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function DT(e) {
  return Array.from(new Set(e));
}
function vT(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class PT {
  constructor(t = new an()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Hi)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(NT(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(xT(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: fr(r.region)
    }));
    for (const r of t) {
      if (!fr(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = MT(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function NT(e) {
  return [
    { source: "document", region: de(e.document) },
    { source: "document.object", region: de(e.document.object) },
    { source: "preview", region: de(e.preview) },
    { source: "preview.document.object", region: de(e.preview?.document?.object) }
  ];
}
function xT(e) {
  return [
    { source: "input", region: de(e) },
    { source: "input.object", region: OT(e) ? de(e.object) : null },
    { source: "input.document.object", region: jl(e) ? de(e.document?.object) : null }
  ];
}
function de(e) {
  return fr(e) ? e : null;
}
function fr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return At(n.x) && At(n.y) && At(n.width) && At(n.height);
}
function jl(e) {
  return "document" in e && "bounds" in e;
}
function OT(e) {
  return !jl(e);
}
function MT(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function At(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const FT = "Nenhum alvo encontrado na linha.";
class BT {
  constructor(t = new RT(), n = new PT(), r = new hT(), a = new LT(), o = new pT()) {
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
      const r = [], a = this.regionTargetPreview.captureCurrentTargets(), o = () => {
        this.regionTargetPreview.restorePreviousTargets(a);
      }, s = await this.regionLinePlacement.placeLine(
        {
          shape: "rectangleRay",
          length: t.formTargeting?.template?.distance,
          width: t.formTargeting?.template?.width
        },
        {
          onChange: (l) => {
            r.push(l);
            try {
              const c = this.regionTargetResolver.resolvePreviewTargetTokens(l);
              this.regionTargetPreview.previewTargets(c.tokens);
            } catch {
              this.regionTargetPreview.previewTargets([]);
            }
          }
        }
      );
      if (s.status === "cancelled")
        return o(), s;
      if (s.status === "failed")
        return o(), this.foundryAdapter.warn(s.message), s;
      try {
        const l = this.regionTargetResolver.resolveTargets(s.region), c = qT(r), u = q_(s.region, {
          candidates: [c?.preview, c?.document],
          shape: c?.shape
        });
        return l.targets.length === 0 ? (o(), this.foundryAdapter.warn(FT), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(l.tokens), {
          status: "confirmed",
          targets: l.targets,
          areaSnapshot: u
        });
      } catch (l) {
        o();
        const c = UT(l);
        return this.foundryAdapter.warn(c), {
          status: "failed",
          reason: "region-resolution-failed",
          message: c
        };
      } finally {
        s.wasCreated && await this.regionCleanup.deleteCreatedRegion(s.region);
      }
    }
    return {
      status: "failed",
      reason: "unsupported-targeting-mode",
      message: "Modo de seleção de alvos não suportado."
    };
  }
}
function UT(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function qT(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function GT(e) {
  return {
    header: {
      eyebrow: Pi,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: QT(e.ritual)
    },
    forms: e.variantOptions.map((t) => jT(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: HT(e.targetNames, e.variantOptions, e.ritual),
    automation: YT(e.automationStatus ?? "assisted")
  };
}
function jT(e, t) {
  const n = zT(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? VT(t) : "—",
    details: n
  };
}
function zT(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function VT(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function HT(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => WT(a, n))
  };
}
function WT(e, t) {
  const n = e.targeting ?? KT(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function KT(e, t) {
  const n = it(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function YT(e) {
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
function QT(e) {
  const t = e.system, n = [XT(t?.element), ZT(t?.circle)].filter(tR);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function ZT(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function XT(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (JT(e)) {
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
      return eR(e);
  }
}
function JT(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function eR(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function tR(e) {
  return typeof e == "string" && e.length > 0;
}
const zl = ["base", "discente", "verdadeiro"];
function ua(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Mt(e) {
  return typeof e == "string" && zl.includes(e);
}
const { ApplicationV2: nR } = foundry.applications.api;
class Je extends nR {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = GT(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: Je.onCast,
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
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    oR(a, (o) => {
      this.selectedVariant = o, pr(a, o);
    }), pr(a, this.selectedVariant), iR(a, (o) => {
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
          ${this.model.forms.map(rR).join("")}
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
          ${this.model.targets.forms.map(aR).join("")}
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
    const n = uR(t), r = sR(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function rR(e) {
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
function aR(e) {
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
function oR(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => ni(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), ni(e, a, t));
    });
  const r = Vl(e);
  r && t(r);
}
function ni(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Mt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Vl(e), pr(e, r.value));
}
function Vl(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Mt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function pr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function iR(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function sR(e, t, n) {
  const r = cR(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = lR(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function lR(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function cR(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Mt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Mt(n) ? n : null;
}
function uR(e) {
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
async function dR(e) {
  return Je.request(e);
}
const da = {
  label: "Padrão"
}, mR = {
  label: "Discente",
  extraCost: 2
}, fR = {
  label: "Verdadeiro",
  extraCost: 5
};
class pR {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new BT();
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
    const a = this.resolveCostPreview(t), o = l$(n), s = o$(
      n,
      t.item,
      a,
      o
    ), l = await dR({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: a,
      defaultSpendResource: p$(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = gR(l), u = u$(
      n,
      t.item,
      c.variant,
      o
    ), m = O_(), y = u.label ?? ua(c.variant), R = TR(u), T = (C = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: y,
      targets: C
    }), p = (C, S = t.targets, _e = {}) => {
      this.ritualEvents.emitCastFinished(
        B_({
          ...T(S),
          status: C,
          ..._e
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      M_(T())
    );
    const I = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (I.status === "cancelled")
      return p("cancelled", t.targets, { reason: I.reason }), { status: "cancelled" };
    if (I.status === "failed")
      return p("failed", t.targets, {
        reason: I.reason,
        message: I.message
      }), {
        status: "failed",
        reason: I.reason,
        message: I.message
      };
    const _ = hR(
      t,
      I.targets
    );
    I.areaSnapshot && this.ritualEvents.emitAreaResolved(
      F_({
        ...T(I.targets),
        area: I.areaSnapshot
      })
    );
    const je = Xi();
    let j = null;
    if (je) {
      const C = await bR(
        this.resources,
        _.actor,
        c,
        u,
        a
      );
      if (!C.ok)
        return p("failed", _.targets, {
          reason: C.reason,
          message: C.message
        }), {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        const S = await Zb(
          _.actor
        );
        j = RR(
          S,
          u,
          a
        );
      } catch (S) {
        const _e = S instanceof Error ? S.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return p("failed", _.targets, {
          reason: "ritual-casting-check-failed",
          message: _e
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: _e,
          cause: S
        };
      }
    }
    const ze = yR(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !je
      }
    );
    if (ze.steps.length === 0) {
      const C = c$(
        _,
        c
      ), S = ai(
        n,
        _
      ), _e = ri(
        _.actor,
        j,
        u,
        a
      ), ka = oi(
        n,
        c,
        u,
        a,
        C,
        _,
        j
      );
      if (!S.ok)
        return p("failed", _.targets, {
          reason: S.reason,
          message: S.message
        }), {
          status: "failed",
          reason: S.reason,
          message: S.message
        };
      const Ea = [
        ..._e,
        ...S.actions
      ];
      return Ea.length > 0 ? (p("ready", _.targets), {
        status: "ready",
        workflowContext: C,
        itemUseContext: _,
        actions: Ea,
        summaryLines: ka
      }) : (p("completed-without-actions", _.targets), {
        status: "completed-without-actions",
        workflowContext: C,
        itemUseContext: _,
        summaryLines: ka
      });
    }
    const M = await this.workflow.runAutomation(ze, {
      sourceActor: _.actor,
      sourceToken: _.token,
      item: _.item,
      targets: _.targets,
      flags: {
        itemUse: {
          source: _.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: c.variant,
          spendResource: c.spendResource
        }
      }
    });
    if (!M.ok)
      return p("failed", _.targets, {
        reason: M.error.reason,
        message: M.error.message
      }), {
        status: "failed",
        reason: M.error.reason,
        message: M.error.message,
        cause: M.error
      };
    const re = M.value.context, F = CR(
      n,
      _,
      re,
      R
    ), Z = ai(
      n,
      _
    ), Nc = ri(
      _.actor,
      j,
      u,
      a
    ), $a = oi(
      n,
      c,
      u,
      a,
      re,
      _,
      j
    );
    if (!F.ok)
      return p("failed", _.targets, {
        reason: F.reason,
        message: F.message
      }), {
        status: "failed",
        reason: F.reason,
        message: F.message
      };
    if (!Z.ok)
      return p("failed", _.targets, {
        reason: Z.reason,
        message: Z.message
      }), {
        status: "failed",
        reason: Z.reason,
        message: Z.message
      };
    const wa = [
      ...Nc,
      ...F.actions,
      ...Z.actions
    ];
    return wa.length === 0 ? (p("completed-without-actions", _.targets), {
      status: "completed-without-actions",
      workflowContext: re,
      itemUseContext: _,
      summaryLines: $a
    }) : (p("ready", _.targets), {
      status: "ready",
      workflowContext: re,
      itemUseContext: _,
      actions: wa,
      summaryLines: $a
    });
  }
  async applyAction(t) {
    return vt(
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
function gR(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function hR(e, t) {
  return {
    ...e,
    targets: t
  };
}
function yR(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || fa(l) && (!a.includeCostSteps || !s))
      continue;
    const c = AR(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && g$(n.extraCost) && o.push({
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
async function bR(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Be(a, r);
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
function AR(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = _R(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function _R(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function TR(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function RR(e, t, n) {
  const a = $R(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function $R(e, t) {
  const n = Be(e, t);
  return n ? v_(n.amount) : null;
}
function ri(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Be(r, n);
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
function ai(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = ma(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = fs(o);
      n.push(
        wR(
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
function wR(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? IR(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: kR(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: ER(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function kR(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function ER(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function IR(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function CR(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || SR(s, r)) continue;
    const l = Dt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = ma(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (LR(s)) {
        DR(
          o,
          u,
          vR(s, n, l.value)
        );
        continue;
      }
      a.push(NR(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...PR(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function SR(e, t) {
  const n = Hl(e.amountFrom);
  return n !== null && t.has(n);
}
function LR(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function DR(e, t, n) {
  const r = FR(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function vR(e, t, n) {
  const r = Hl(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function PR(e, t, n, r) {
  const a = GR(e), o = a.length > 1 ? VR() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const y = jR(u.amount, s);
        return {
          id: xR(u, s, m),
          amount: y,
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
      label: OR(c, s, a.length > 1),
      executedLabel: MR(
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
function NR(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = qR(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: BR(e, r, n),
    executedLabel: UR(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function xR(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function OR(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function MR(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function FR(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Hl(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function BR(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function UR(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function qR(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function GR(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function jR(e, t) {
  const n = e * t.multiplier, r = zR(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function zR(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function VR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ma(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function oi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${ua(t.variant)}`,
    YR(t, n, r),
    ...KR(s),
    ...Object.values(a.rolls).flatMap(QR),
    ...HR(e, o),
    ...ZR(e.resistance),
    ...r$(n)
  ];
}
function HR(e, t) {
  return WR(e) ? ma("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function WR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function KR(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function YR(e, t, n) {
  const r = Be(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function QR(e) {
  const n = [`${a$(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = XR(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${P_(e.damageType)}`), n;
}
function ZR(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function XR(e) {
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
    const s = JR(o);
    s && (n$(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function JR(e) {
  const t = e$(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : t$(e);
}
function e$(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function t$(e) {
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
function n$(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function r$(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function a$(e) {
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
function o$(e, t, n, r) {
  return zl.map((a) => {
    const o = Wl(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? ua(a),
      enabled: s,
      details: o ? i$(o, n) : [],
      finalCostText: o ? s$(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function i$(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  a.length > 0 ? r.push(a.join(", ")) : r.push("efeito manual");
  const o = Be(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Be(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function s$(e, t) {
  const n = Be(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function l$(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(fa);
}
function c$(e, t) {
  return Pl({
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
function u$(e, t, n, r) {
  return Wl(e, t, n, r) ?? da;
}
function Wl(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? m$(t, n) ? d$(n) : null : n === "base" ? da : null);
}
function d$(e) {
  switch (e) {
    case "base":
      return da;
    case "discente":
      return mR;
    case "verdadeiro":
      return fR;
  }
}
function m$(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return f$(foundry.utils.getProperty(e, n));
}
function f$(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function p$(e) {
  return e.steps.some(fa);
}
function fa(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function g$(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Kl = "itemUsePrompts", Yl = "chatCard", on = "data-paranormal-toolkit-prompt-id", sn = "data-paranormal-toolkit-pending-id", pa = "data-paranormal-toolkit-executed-label", gr = "data-paranormal-toolkit-choice-group", Ql = "data-paranormal-toolkit-skipped-label", Ft = "data-paranormal-toolkit-action-section", ii = "data-paranormal-toolkit-detail-key", si = "data-paranormal-toolkit-roll-card", ga = "data-paranormal-toolkit-roll-detail-toggle", Zl = "data-paranormal-toolkit-roll-detail-id", Xl = "data-paranormal-toolkit-resistance-roll-button", Jl = "data-paranormal-toolkit-resistance-skill", ec = "data-paranormal-toolkit-resistance-skill-label", tc = "data-paranormal-toolkit-resistance-target-actor-id", nc = "data-paranormal-toolkit-resistance-target-name", rc = "data-paranormal-toolkit-resistance-roll-result", li = "data-paranormal-toolkit-system-card-replaced", h$ = `[${sn}]`, y$ = `[${ga}]`, b$ = `[${Xl}]`, hr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, A$ = `${h}__actions`, ci = `${h}__details`, ac = `${h}__summary`, _$ = `${h}__title`, oc = `${h}__button--executed`, di = `${h}__roll-card`;
let mi = !1, yr = null;
const G = /* @__PURE__ */ new Map(), T$ = [0, 100, 500, 1500, 3e3], R$ = 3e4, $$ = [0, 100, 500, 1500, 3e3];
function w$(e) {
  if (yr = e, mi) {
    pi(e);
    return;
  }
  const t = (n, r) => {
    sc(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), mi = !0, pi(e);
}
async function fi(e) {
  const t = ic(e);
  G.set(e.pendingId, t), await ba(t) || Ac(t), lc(e.pendingId);
}
async function k$(e) {
  const t = ic({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", G.set(e.pendingId, t), await ba(t) || Ac(t), lc(e.pendingId);
}
async function Sn(e, t) {
  const n = G.get(e);
  G.delete(e), n && await kw(n, t);
}
function ha(e) {
  const t = kc();
  for (const n of t) {
    const r = Q(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function E$(e, t) {
  const n = ha(e);
  if (!n) return;
  const r = Q(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Ue(n.message, r));
}
async function I$(e, t, n) {
  if (!t) return;
  const r = ha(e);
  if (!r) return;
  const a = Q(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Ue(r.message, a);
}
function ic(e) {
  const t = ne(e.context.message), n = e.context.targets.find((s) => Tr(s)), r = n ? Tr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: ew(e.context),
    executed: !1
  };
}
function sc(e, t, n) {
  ww();
  const r = cn(t);
  if (!r) return;
  const a = Tw(e, r);
  a.length > 0 && Bt(r);
  for (const o of a)
    br(r, o);
  fc(r, n), Ar(r), _r(r);
}
function pi(e) {
  for (const t of $$)
    globalThis.setTimeout(() => {
      C$(e);
    }, t);
}
function C$(e) {
  for (const t of S$()) {
    const n = ln(t);
    L$(n) && sc(n, t, e);
  }
}
function S$() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function L$(e) {
  return e ? Aa(e) ? !0 : Iw(e).length > 0 : !1;
}
function lc(e) {
  const t = G.get(e);
  if (!t) return;
  const n = t.messageId ? Rw(t.messageId) : null;
  if (n) {
    Ai(n, t), Bt(n), br(n, t), gi(n), Ar(n), _r(n);
    return;
  }
  if (t.messageId) {
    $r(t);
    return;
  }
  const r = $w(t);
  if (r) {
    Ai(r, t), Bt(r), br(r, t), gi(r), Ar(r), _r(r);
    return;
  }
  $r(t);
}
function gi(e) {
  yr && fc(e, yr);
}
function Bt(e) {
  const t = D$();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = mc(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(li) === "true") return;
  const r = n.querySelector(`.${hr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(li, "true");
}
function D$() {
  try {
    return Ju() === "replace";
  } catch {
    return !1;
  }
}
function br(e, t) {
  if (Bt(e), e.querySelector(`[${on}="${qe(t.pendingId)}"]`)) return;
  const n = P$(e, t);
  x$(n, t);
  const r = Q$(t);
  if (v$(r)) return;
  Y$(n, r).append(J$(t));
}
function v$(e) {
  return uc(e.id) && !ge();
}
function cc(e) {
  const n = e.closest(`[${Ft}]`)?.getAttribute(Ft) ?? null;
  return uc(n) && !ge();
}
function uc(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function P$(e, t) {
  const n = e.querySelector(`.${hr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(hr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(_$), s.textContent = N$(t);
  const l = document.createElement("span");
  return l.classList.add(ac), l.textContent = t.summary, a.append(o, s, l), r.append(a), nw(e).append(r), r;
}
function N$(e) {
  const t = P(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function x$(e, t) {
  const n = t.summaryLines ?? [], r = yc(n, t);
  if (r) {
    O$(e, r, t);
    return;
  }
  Z$(e, n);
}
function O$(e, t, n) {
  if (e.querySelector(`[${si}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(di, `${di}--${t.intent}`), r.setAttribute(si, "true"), t.castingCheck && hi(r, F$(t.castingCheck), n.pendingId, "casting"), M$(t) && hi(r, B$(t), n.pendingId, "effect"), z$(r, t), V$(r, t, n), K$(r, t), e.append(r);
}
function M$(e) {
  return e.intent !== "casting";
}
function F$(e) {
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
function B$(e) {
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
function hi(e, t, n, r) {
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
  U$(a, t), W$(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function U$(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = q$(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function q$(e, t) {
  const n = G$(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of j$(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function G$(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function j$(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? yi(e, "highest") : n.includes("kl") ? yi(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function yi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function z$(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Vw);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function V$(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = H$(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(dc(t.resistanceRollResult)), e.append(r);
}
function H$(e, t) {
  if (!e.resistanceSkill || !be()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(on, t.pendingId), n.setAttribute(Xl, "true"), n.setAttribute(Jl, e.resistanceSkill), n.setAttribute(ec, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(tc, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(nc, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(rc, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function dc(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = gc(e), t;
}
function W$(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(ga, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Zl, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const y = document.createElement("dd");
    y.textContent = u.value, c.append(m, y);
  }
  e.append(l, c);
}
function K$(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function Y$(e, t) {
  const n = `[${Ft}="${qe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(A$), a.setAttribute(Ft, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Q$(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = yc(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Z$(e, t) {
  if (t.length === 0) return;
  const n = X$(e);
  for (const r of t) {
    const a = Hw(r);
    if (n.querySelector(`[${ii}="${qe(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(ii, a), n.append(o);
  }
}
function X$(e) {
  const t = e.querySelector(`.${ci}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ci), e.append(n), n;
}
function J$(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(on, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(oc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(sn, e.pendingId), t.setAttribute(pa, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(gr, e.choiceGroupId), t.setAttribute(Ql, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function ew(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = tw(e);
  return `${t} → ${n}`;
}
function tw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function nw(e) {
  return mc(e) ?? e;
}
function mc(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function fc(e, t) {
  const n = cn(e);
  if (!n) return;
  const r = n.querySelectorAll(h$);
  for (const a of r) {
    if (cc(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      hw(a, t);
    }));
  }
}
function Ar(e) {
  const t = cn(e);
  if (!t) return;
  const n = t.querySelectorAll(y$);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      rw(t, r);
    }));
}
function _r(e) {
  const t = cn(e);
  if (!t) return;
  const n = t.querySelectorAll(b$);
  for (const r of n) {
    if (!be()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      aw(t, r);
    }));
  }
}
function rw(e, t) {
  const n = t.getAttribute(ga);
  if (!n) return;
  const r = e.querySelector(`[${Zl}="${qe(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function aw(e, t) {
  if (!be()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(on), r = t.getAttribute(Jl), a = t.getAttribute(ec) ?? (r ? pe(r) : "Resistência");
  if (!n || !r) return;
  const o = sw(e, n), s = lw(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await hm(s, r);
    await fw(c.roll);
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
    ow(t, u), iw(t, u), pw(n, u), await gw(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function ow(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(rc, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function iw(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? dc(t);
  if (r) {
    r.textContent = gc(t);
    return;
  }
  n.append(a);
}
function sw(e, t) {
  const n = G.get(t);
  if (n) return n;
  const r = ln(e);
  return Q(r)[t] ?? null;
}
function lw(e, t) {
  const n = e?.resistanceTargetActor;
  if (W(n)) return n;
  const a = e?.context?.targets.map(Tr).find(W) ?? null;
  if (a) return a;
  const o = t.getAttribute(tc) ?? e?.resistanceTargetActorId ?? null, s = o ? uw(o) : null;
  return s || dw(
    t.getAttribute(nc) ?? e?.resistanceTargetName ?? cw(t)
  );
}
function cw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${ac}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Tr(e) {
  const t = e.actor;
  if (W(t)) return t;
  const n = e.token, r = at(n);
  if (r) return r;
  const a = e.document;
  return at(a);
}
function at(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (W(t)) return t;
  const n = e.document?.actor;
  return W(n) ? n : null;
}
function uw(e) {
  const n = game.actors?.get?.(e);
  return W(n) ? n : pc().map((o) => at(o)).find((o) => o?.id === e) ?? null;
}
function dw(e) {
  const t = Se(e);
  if (!t) return null;
  const n = pc().filter((o) => Se(mw(o)) === t).map((o) => at(o)).find(W) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => W(o) && Se(o.name) === t);
  return W(a) ? a : null;
}
function pc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function mw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : at(e)?.name ?? null;
}
function Se(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function W(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function gc(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function fw(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function pw(e, t) {
  const n = G.get(e);
  n && (n.resistanceRollResult = t);
}
async function gw(e, t, n) {
  const r = ln(e);
  if (r)
    try {
      const a = Q(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Ue(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function ln(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return Y(r?.get?.(n));
}
async function hw(e, t) {
  if (cc(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(sn);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    hc(e, e.getAttribute(pa) ?? "✓ Automação aplicada"), yw(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function hc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(oc), e.removeAttribute(sn), e.removeAttribute(pa);
}
function yw(e) {
  const t = e.getAttribute(gr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${gr}="${qe(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Ql) ?? "✓ Outra opção escolhida";
    hc(a, o);
  }
}
function yc(e, t) {
  const n = e.map(ya).filter(jw), r = n.find((p) => p.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = P(e, "Forma"), o = P(e, "Custo"), s = P(e, "Dados") ?? P(e, `Dados (${r.label})`), l = P(e, "Tipo"), c = P(e, "Resistência"), u = P(e, "Resistência Perícia"), m = P(e, "Resistência Rótulo") ?? (u ? pe(u) : null), y = bc(e, "Observação"), R = e.filter((p) => _w(p, r)), T = bw(e);
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
    notes: y,
    details: R,
    castingCheck: T,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function bw(e) {
  const t = e.map(ya).find((o) => o?.intent === "casting") ?? null, n = P(e, "Conjuração DT"), r = P(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: P(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: P(e, "Dados (Conjuração)")
  } : null;
}
function ya(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: Aw(n)
  } : null;
}
function Aw(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function P(e, t) {
  return bc(e, t)[0] ?? null;
}
function bc(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function _w(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || ya(e) ? !1 : e.trim().length > 0;
}
function Tw(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of G.values())
    Rr(r, e, t) && n.set(r.pendingId, r);
  for (const r of Ew(e))
    Rr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Rr(e, t, n) {
  const r = ne(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !bi(n, "itemId", e.itemId) ? !1 : !e.actorId || bi(n, "actorId", e.actorId);
}
function bi(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Ww(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function Rw(e) {
  const t = qe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function $w(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Rr(e, null, t))
      return t;
  return null;
}
function ww() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of G.entries())
    e - r.createdAt > t && G.delete(n);
}
async function Ai(e, t) {
  const n = ln(e);
  if (!n) return !1;
  try {
    const r = Q(n);
    return r[t.pendingId] = _a(t, ne(n)), await Ue(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function ba(e) {
  const t = Rc(e);
  if (!t) return !1;
  try {
    const n = Q(t);
    return n[e.pendingId] = _a(e, ne(t)), await Ue(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Ac(e) {
  for (const t of T$)
    globalThis.setTimeout(() => {
      $r(e);
    }, t);
}
async function $r(e) {
  const t = Rc(e);
  if (Aa(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await ba(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function kw(e, t) {
  const n = Tc(e.context.message);
  if (n)
    try {
      const r = Q(n), a = r[e.pendingId] ?? _a(e, ne(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Ue(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Ew(e) {
  return Object.values(Q(Y(e))).filter(ut);
}
function Q(e) {
  if (!e) return {};
  const t = {}, n = Aa(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(_c(e)))
    t[r] ??= a;
  return t;
}
function Iw(e) {
  return Object.values(_c(Y(e))).filter(ut);
}
function _c(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Kl);
  if (!Ne(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    ut(a) && (n[r] = a);
  return n;
}
async function Ue(e, t) {
  typeof e.setFlag == "function" && (await Sw(e, t), await Cw(e, t));
}
async function Cw(e, t) {
  await Promise.resolve(e.setFlag?.(d, Kl, t));
}
function Aa(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Yl);
  return qw(t) ? t : null;
}
async function Sw(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(ut).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? ne(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Lw(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Yl, a));
}
function Lw(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function _a(e, t) {
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
function Tc(e) {
  const t = Y(e);
  if (t?.setFlag)
    return t;
  const n = Dw(e);
  if (n?.setFlag)
    return n;
  const r = ne(e);
  if (!r) return null;
  const a = game.messages;
  return Y(a?.get?.(r));
}
function Dw(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(Y).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Rc(e) {
  const t = Tc(e.context.message);
  if (t) return t;
  const n = e.messageId ? vw(e.messageId) : null;
  if (n) return n;
  const r = kc().slice().reverse();
  return r.find((a) => Pw(a, e)) ?? r.find((a) => Nw(a, e)) ?? null;
}
function vw(e) {
  const t = game.messages;
  return Y(t?.get?.(e));
}
function Pw(e, t) {
  const n = ne(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!$c(e, t)) return !1;
  const a = wc(e);
  return !t.actorId || !a || a === t.actorId;
}
function Nw(e, t) {
  if (!Ow(e, t)) return !1;
  const n = wc(e);
  return t.actorId && n === t.actorId ? !0 : $c(e, t);
}
function $c(e, t) {
  const n = Se(xw(e));
  if (!n) return !1;
  const r = Se(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Se(t.itemId);
  return !!(a && n.includes(a));
}
function xw(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function wc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Ow(e, t) {
  const n = Mw(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= R$;
}
function Mw(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function Y(e) {
  return e && typeof e == "object" ? e : null;
}
function ut(e) {
  return Ne(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && N(e.messageId) && N(e.itemId) && N(e.actorId) && N(e.itemName) && le(e.resistanceTargetActorId) && le(e.resistanceTargetName) && Gw(e.resistanceRollResult) && Fw(e.actionPayload) && Ln(e.title) && Ln(e.buttonLabel) && Ln(e.executedLabel) && le(e.choiceGroupId) && le(e.skippedLabel) && le(e.actionSectionId) && le(e.actionSectionTitle) && zw(e.summaryLines) : !1;
}
function Fw(e) {
  return e == null ? !0 : Ne(e) ? e.kind === "resource-operation" && N(e.actorId) && N(e.actorUuid) && typeof e.actorName == "string" && Bw(e.resource) && Uw(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Bw(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Uw(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function qw(e) {
  return Ne(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && N(e.messageId) && Ne(e.source) && N(e.source.actorId) && N(e.source.actorName) && N(e.source.itemId) && N(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ut) : !1;
}
function Gw(e) {
  return e == null ? !0 : Ne(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && le(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function jw(e) {
  return e !== null;
}
function Ne(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function N(e) {
  return e === null || typeof e == "string";
}
function Ln(e) {
  return e === void 0 || typeof e == "string";
}
function le(e) {
  return e == null || typeof e == "string";
}
function zw(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Vw(e) {
  return typeof e == "string" && e.length > 0;
}
function kc() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(Y).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(Y).filter((r) => r !== null) : [];
}
function cn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ne(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Hw(e) {
  return e.trim().toLowerCase();
}
function Ww(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function qe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const _i = 1e3;
class Kw {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new pR(
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
    const r = Ni(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && tk(t.item) && n.executionMode === "ask") {
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
    if (await zo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Pn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = Qw(
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
      return this.pendingExecutions.delete(t), await Sn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Sn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = ha(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = ak(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await vt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await E$(t), await I$(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (w$(
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
    if (await zo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Pn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      nk(t.item),
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
          me(a.workflowContext)
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
      if (!ge())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (ek(n, a.value), await xs(a.value), {
        ok: !0,
        executedLabel: Yw(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!ge())
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
    const n = Dn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && Dn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Sn(
        a,
        Ti(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Nn();
    await k$({
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
      const l = Nn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await fi({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Dn(s),
        skippedLabel: Ti(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: rk(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      me(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Nn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await fi({
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
      me(a.value.context)
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
    const n = Date.now(), r = Ri(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > _i && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= _i;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Ri(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = Pn(
      t,
      n,
      r,
      a
    );
  }
}
function Yw(e) {
  return Os({ inputAmount: e.totalRawDamage });
}
function Qw(e, t) {
  if (t.resistance || !Zw(t))
    return t;
  const n = Bl(e);
  return n ? { ...t, resistance: n } : t;
}
function Zw(e) {
  return Xw(e) && !Jw(e);
}
function Xw(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Jw(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Dn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Ti(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function ek(e, t) {
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
function tk(e) {
  return e.type === "ritual";
}
function nk(e) {
  return T_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function rk(e) {
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
function ak(e) {
  const t = e.actorUuid ? ok(e.actorUuid) : null;
  if (xe(t)) return t;
  const n = e.actorId ? ik(e.actorId) : null;
  return n || sk(e.actorName);
}
function ok(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function ik(e) {
  const n = game.actors?.get?.(e);
  if (xe(n)) return n;
  for (const r of Ec()) {
    const a = Ta(r);
    if (a?.id === e) return a;
  }
  return null;
}
function sk(e) {
  const t = vn(e);
  if (!t) return null;
  for (const a of Ec()) {
    const o = lk(a);
    if (vn(o) === t) {
      const s = Ta(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => xe(a) && vn(a.name) === t
  );
  return xe(r) ? r : null;
}
function Ec() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function lk(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ta(e)?.name ?? null;
}
function Ta(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (xe(t)) return t;
  const n = e.document?.actor;
  return xe(n) ? n : null;
}
function vn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function xe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Pn(e, t, n, r) {
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
function Ri(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Nn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class ck {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = st(t);
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
class uk {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = st(t).map((l) => this.analyzeRitual(l)), r = n.filter(_t("upToDate")), a = n.filter(_t("available")), o = n.filter(_t("outdated")), s = n.filter(_t("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = dk(t);
    return n ? r ? r.source.type !== "preset" ? He({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? He({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : He({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: mk(r, n.preset)
    }) : He({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : He({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function He(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Gt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function dk(e) {
  const t = e.getFlag(d, "automation");
  return wr(t) ? t : null;
}
function mk(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function _t(e) {
  return (t) => t.status === e;
}
class fk {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Er(t.transaction);
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
  async createWorkflowSummaryMessage(t, n) {
    const r = this.createWorkflowSummaryContent(t, n), a = me(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: a,
      flags: {
        [d]: {
          workflowSummary: a
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = w(t.actorName), r = w(t.resource), a = w($i(t)), o = w(gk(t));
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
  createWorkflowSummaryContent(t, n) {
    const r = w(n.title ?? "Automação"), a = n.message ? `<p>${w(n.message)}</p>` : "", o = w(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = w(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((p) => w(p.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map(
      (p) => `<li><strong>${w(p.id)}:</strong> ${w(p.formula)} = ${p.total} <em>(${w(pk(p.intent))})</em>${p.damageType ? ` — ${w(p.damageType)}` : ""}</li>`
    ), u = t.ritualCosts.map(
      (p) => `<li><strong>${w(p.itemName)}:</strong> ${p.circle}º círculo — ${p.amount} ${w(p.resource)} (${w(hk(p.source))})</li>`
    ), m = t.damageInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount}${p.damageType ? ` ${w(p.damageType)}` : ""} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (p) => `<li><strong>${w(p.actorName)}:</strong> ${w($i(p))} — ${p.before.value}/${p.before.max} &rarr; ${p.after.value}/${p.after.max}</li>`
    ), T = t.phases.map((p) => w(p)).join(" &rarr; ");
    return `
      <section class="${d}-card ${d}-workflow-card">
        <header class="${d}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${d}-card__body">
          ${a}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${u.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${c.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${c.join("")}</ul>` : ""}
          ${m.length > 0 ? `<p><strong>Dano:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p class="${d}-workflow-card__phases"><strong>Fases:</strong> ${T}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function pk(e) {
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
function $i(e) {
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
function gk(e) {
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
function hk(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function w(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function yk() {
  const e = new qb(), t = new VA(e), n = new ds(new us()), r = new ms(new Or()), a = new HA(new Il()), o = new zb(), s = new oA(o), l = new AA(e), c = new TA(), u = c.registerMany(
    wu()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new _A(), y = new yA(), R = _s(), T = new gs(R), p = new uk(
    c
  ), I = new ck(
    p,
    m,
    y
  ), _ = new QA(), je = new fk(_), j = new YA(), ze = new zA(), M = new GA(
    t,
    s,
    je,
    j
  ), re = new KA(M, j), F = new Kw(
    re,
    t,
    s,
    n,
    T,
    _,
    ze
  );
  return F.addStrategy(
    new gA(
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
    itemPatches: y,
    conditionRegistry: R,
    conditions: T,
    debugOutput: _,
    chatMessages: je,
    workflowHooks: j,
    ritualEvents: ze,
    automation: M,
    workflow: re,
    itemUseIntegration: F,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: I
  };
}
const { ApplicationV2: bk } = foundry.applications.api;
class Ut extends bk {
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
      apply: Ut.onApply,
      cancel: Ut.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${V(Pi)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${V(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${xn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${xn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${xn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function xn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${V(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Ak(n) : Tk(t)}
    </section>
  `;
}
function Ak(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(_k).join("")}</ol>`;
}
function _k(e) {
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
function Tk(e) {
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
const qt = `${d}.manageRitualPresets`, wi = `__${d}_ritualPresetHeaderControlRegistered`, Rk = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function $k(e) {
  const t = globalThis;
  if (!t[wi]) {
    for (const n of Rk)
      Hooks.on(n, (r, a) => {
        wk(r, a, e);
      });
    t[wi] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function wk(e, t, n) {
  Array.isArray(t) && Ek(e) && (kk(e, n), !t.some((r) => r.action === qt) && t.push({
    action: qt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ic(e, n);
    }
  }));
}
function kk(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[qt] && (e.options.actions[qt] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ic(e, t);
  }));
}
function Ek(e) {
  if (!game.user?.isGM) return !1;
  const t = Cc(e);
  return t ? t.type === "agent" && st(t).length > 0 : !1;
}
function Ic(e, t) {
  const n = Cc(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ut(n, t).render({ force: !0 });
}
function Cc(e) {
  return ki(e.actor) ? e.actor : ki(e.document) ? e.document : null;
}
function ki(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Sc = "data-paranormal-toolkit-ritual-roll-config", dt = "data-paranormal-toolkit-ritual-roll-field", he = "data-paranormal-toolkit-ritual-roll-action", Ei = `__${d}_ritualRollConfigBlockRegistered`, Ik = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Ck = [
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
function Sk() {
  const e = globalThis;
  if (!e[Ei]) {
    Lk();
    for (const t of Ik)
      Hooks.on(t, (...n) => {
        Dk(n[0], n[1]);
      });
    e[Ei] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Lk() {
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
function Dk(e, t) {
  const n = Vk(e);
  if (!n || n.type !== "ritual") return;
  const r = Kk(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  Pk(a);
  const o = Dc(n), s = Fl(n), l = Hk(n), c = Nk(n, s, o, l);
  Uk(c, n, o, l), vk(a, c), Ra(c);
}
function vk(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Pk(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Sc}]`)))
    t.remove();
}
function Nk(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Sc, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(Ii("strong", "Paranormal Toolkit")), s.append(Ii("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Pc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(xk(t, r)), u.append(Ok(t, r)), u.append(Mk(t, r)), a.append(u), a.append(Fk(t, n, r)), a.append(Bk(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function xk(e, t) {
  const n = un("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(dt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = __(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function Ok(e, t) {
  const n = un("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(dt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of Ck) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function Mk(e, t) {
  const n = un("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(dt, "utilityLabel"), n.append(r), n;
}
function Fk(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(On("base", "Padrão", e.forms.base.formula, !0, n)), o.append(On("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(On("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function On(e, t, n, r, a) {
  const o = un(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(dt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function Bk(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(he, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(he, "clear"), t.append(n, r), t;
}
function un(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Ii(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Uk(e, t, n, r) {
  Ge(e, "intent")?.addEventListener("change", () => Ra(e)), Li(e, "system.studentForm")?.addEventListener("change", () => Ci(e, t)), Li(e, "system.trueForm")?.addEventListener("change", () => Ci(e, t)), e.querySelector(`[${he}="save"]`)?.addEventListener("click", () => {
    r && qk(e, t, n);
  }), e.querySelector(`[${he}="clear"]`)?.addEventListener("click", () => {
    r && Gk(e, t);
  });
}
async function qk(e, t, n) {
  const r = e.querySelector(`[${he}="save"]`);
  r?.setAttribute("disabled", "true"), Le(e, "Salvando configuração...");
  try {
    const a = jk(e, n);
    await b_(t, a), Lc(e, a), Le(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Le(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Gk(e, t) {
  const n = e.querySelector(`[${he}="clear"]`);
  n?.setAttribute("disabled", "true"), Le(e, "Limpando configuração...");
  try {
    await A_(t);
    const r = Fl(t);
    zk(e, r), Lc(e, r), Le(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Le(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Lc(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Pc(t) ? "Configurada" : "Rascunho");
}
function jk(e, t) {
  return {
    schemaVersion: 1,
    intent: vc(Ge(e, "intent")?.value),
    damageType: Di(e, "damageType"),
    utilityLabel: Di(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: It(e, "formula.base") },
      discente: { formula: It(e, "formula.discente") },
      verdadeiro: { formula: It(e, "formula.verdadeiro") }
    }
  };
}
function zk(e, t) {
  $e(e, "intent", t.intent), $e(e, "damageType", t.damageType ?? ""), $e(e, "utilityLabel", t.utilityLabel ?? "Resultado"), $e(e, "formula.base", t.forms.base.formula), $e(e, "formula.discente", t.forms.discente.formula), $e(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Ra(e);
}
function Ra(e) {
  const t = vc(Ge(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Ci(e, t) {
  const n = Dc(t);
  Si(e, "discente", n.discente), Si(e, "verdadeiro", n.verdadeiro);
}
function Si(e, t, n) {
  const r = Ge(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${he}="save"]`)?.disabled;
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
function Dc(e) {
  const t = Wk(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Vk(e) {
  return vi(e.item) ? e.item : vi(e.document) ? e.document : null;
}
function Hk(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Wk(e) {
  const t = e.system;
  return Yk(t) ? t : {};
}
function Li(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ge(e, t) {
  return e.querySelector(`[${dt}="${Qk(t)}"]`);
}
function It(e, t) {
  return Ge(e, t)?.value.trim() ?? "";
}
function Di(e, t) {
  const n = It(e, t);
  return n.length > 0 ? n : null;
}
function $e(e, t, n) {
  const r = Ge(e, t);
  r && (r.value = n);
}
function vc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Pc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function Kk(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function vi(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function Yk(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Qk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ue = null;
Hooks.once("init", () => {
  _u(), Xu(), vd(), Cb(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ma.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Ma.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ue = yk(), ue.itemUseIntegration.registerStrategies(), Cd(ue.conditions), dd(ue), Rd(), bd(), Nb(), $k(ue), Sk(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function Zk() {
  if (!ue)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ue;
}
export {
  Zk as getToolkitServices
};
//# sourceMappingURL=main.js.map
