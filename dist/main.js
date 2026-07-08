const d = "paranormal-toolkit", vi = "Paranormal Toolkit", vc = "ordemparanormal";
class ot {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ut(e) {
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
function A(e) {
  return { ok: !0, value: e };
}
function g(e) {
  return { ok: !1, error: e };
}
function it(e) {
  const t = Pi(e);
  return t.ok ? A(t.value.definition) : t;
}
function Pi(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? g({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Rr(t) ? A(t) : g({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Pc(e) {
  return Rr(e.getFlag(d, "automation"));
}
function Rr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && xc(t.source) && Nc(t.definition);
}
function Nc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every(Oc) && (t.ritualForms === void 0 || Gc(t.ritualForms)) && (t.conditionApplications === void 0 || Wc(t.conditionApplications));
}
function xc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function Oc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Mc(t);
    case "spendRitualCost":
      return Fc(t);
    case "rollFormula":
      return Bc(t);
    case "modifyResource":
      return Uc(t);
    case "chatCard":
      return qc(t);
    default:
      return !1;
  }
}
function Mc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ni(t);
}
function Fc(e) {
  return e.type === "spendRitualCost";
}
function Bc(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || eu(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function Uc(e) {
  const t = e;
  return t.type === "modifyResource" && xi(t.actor) && Xc(t.resource) && Jc(t.operation) && Ni(t) && (t.damageType === void 0 || t.damageType === null || $(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function qc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Gc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && jc(a)
  );
}
function jc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || $(t.label)) && (t.extraCost === void 0 || nu(t.extraCost)) && (t.rollFormulaOverrides === void 0 || au(t.rollFormulaOverrides)) && (t.notes === void 0 || ru(t.notes)) && (t.targeting === void 0 || zc(t.targeting));
}
function zc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Hc(t.mode) && $(t.label) && (t.optionLabel === void 0 || $(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Vc(t.template));
}
function Vc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || ka(t.distance)) && (t.width === void 0 || t.width === null || ka(t.width));
}
function Hc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Wc(e) {
  return Array.isArray(e) && e.every(Kc);
}
function Kc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return $(t.id) && xi(t.actor) && $(t.conditionId) && (t.label === void 0 || $(t.label)) && (t.duration === void 0 || t.duration === null || Qc(t.duration)) && (t.source === void 0 || $(t.source)) && (t.actionSectionId === void 0 || $(t.actionSectionId)) && (t.actionSectionTitle === void 0 || $(t.actionSectionTitle)) && (t.executedLabel === void 0 || $(t.executedLabel)) && (t.applyOnResistance === void 0 || Yc(t.applyOnResistance));
}
function Yc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Qc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || tu(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Zc(t.expiry));
}
function Zc(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ni(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function xi(e) {
  return e === "self" || e === "target";
}
function Xc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Jc(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function eu(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function tu(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function nu(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function ka(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function ru(e) {
  return Array.isArray(e) && e.every($);
}
function au(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => $(t) && $(n)
  );
}
function $r(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Ea);
    if (su(t))
      return Array.from(t).filter(Ea);
  }
  return [];
}
function ou(e) {
  return $r(e)[0] ?? null;
}
function iu(e) {
  return $r(e).find(Pc) ?? null;
}
function su(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ea(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function st(e) {
  return $r(e).filter((t) => t.type === "ritual");
}
function Oi(e) {
  return st(e)[0] ?? null;
}
function lu(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Ut);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = We("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = mt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Sa);
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
      const o = await xn(e, r, a.value);
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
      const a = await xn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Sa(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ia(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ia(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = We("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = mt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Ia(e) {
  const t = We("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = st(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ca(t);
  const r = Ca(t, n.length);
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
    const s = await xn(e, a, o.preset);
    r.applied.push(cu(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), uu(r), r;
}
async function xn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function cu(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Ut(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Ca(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function uu(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Sa(e) {
  return {
    preset: Ut(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function We(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function mt(e) {
  const t = Oi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function de(e) {
  return e ? {
    id: e.id,
    source: {
      ...du(e.sourceActor),
      token: e.sourceToken
    },
    item: mu(e.item),
    targets: e.targets.map(fu),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: La(e.rollRequests, Mi),
    rolls: La(e.rolls, pu),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(wr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function wr(e) {
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
function du(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function mu(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function fu(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Mi(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function pu(e) {
  return {
    ...Mi(e),
    total: e.total
  };
}
function La(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function gu(e) {
  return {
    getSelected() {
      return ot.getSelectedActor();
    },
    logResources() {
      const t = re(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await Re(
        e,
        "Gasto de PE",
        re("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Re(
        e,
        "Gasto de PD",
        re("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Re(
        e,
        "Dano em PV",
        re("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Re(
        e,
        "Cura de PV",
        re("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Re(
        e,
        "Dano em SAN",
        re("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Re(
        e,
        "Recuperação de SAN",
        re("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Re(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    hu(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, wr(o));
}
function re(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function hu(e) {
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
const V = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function yu() {
  ft(V.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ft(V.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ft(V.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ft(V.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function On() {
  return {
    enabled: pt(V.enabled),
    console: pt(V.console),
    ui: pt(V.ui),
    chat: pt(V.chat)
  };
}
async function Z(e, t) {
  await game.settings.set(d, V[e], t);
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
function bu() {
  return {
    status() {
      return On();
    },
    async enable() {
      await Z("enabled", !0);
    },
    async disable() {
      await Z("enabled", !1);
    },
    async enableConsole() {
      await Z("console", !0);
    },
    async disableConsole() {
      await Z("console", !1);
    },
    async enableUi() {
      await Z("ui", !0);
    },
    async disableUi() {
      await Z("ui", !1);
    },
    async enableChat() {
      await Z("chat", !0);
    },
    async disableChat() {
      await Z("chat", !1);
    }
  };
}
const Fi = "ritual.costOnly", Bi = "ritual.simpleHealing", Au = "ritual.eletrocussao", _u = "ritual.definhar", Ui = "ritual.simpleDamage", qi = "generic.simpleHealing", Gi = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, kr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Tu() {
  return [
    Ru(),
    $u(),
    wu(),
    ku(),
    Eu(),
    Iu()
  ];
}
function Ru() {
  return {
    id: Fi,
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
function $u() {
  return {
    id: Bi,
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
    automation: ji(),
    itemPatch: Du()
  };
}
function wu() {
  return {
    id: Au,
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
    automation: Su(),
    itemPatch: Pu()
  };
}
function ku() {
  return {
    id: _u,
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
    automation: Lu(),
    itemPatch: vu()
  };
}
function Eu() {
  return {
    id: Ui,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Er()
  };
}
function Iu() {
  return {
    id: qi,
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
function ji(e = Gi) {
  const t = Cu(e);
  return zi(
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
function Cu(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Gi,
    ...e
  };
}
function Su() {
  return {
    ...Er("3d6", {
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
function Lu() {
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
function Er(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return zi(
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
function Du() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: kr,
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
function vu() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: kr,
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
function Pu() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: kr,
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
function zi(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Ir() {
  return Array.from(game.user?.targets ?? []).map(Vi);
}
function Vi(e) {
  return {
    tokenId: ke(e.id),
    actorId: ke(e.actor?.id),
    sceneId: ke(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Hi() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ke(e.id),
    actorId: ke(t?.id),
    sceneId: ke(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ke(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Nu(e) {
  return {
    logFirstRitualCost() {
      const t = ae("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = oe(t);
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
      const r = ae("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = oe(r);
      if (a) {
        if (!Mu(t, n)) {
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
      const t = ae("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = oe(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = ae("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = oe(t);
      if (!n) return;
      const r = e.automationRegistry.require(Fi);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = ae("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = oe(n);
      if (!r) return;
      if (!Da(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Bi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: ji(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = ae("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = oe(n);
      if (!r) return;
      if (!Da(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Ui);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Er(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ae("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = oe(t);
      n && await xu(e, t, n);
    }
  };
}
async function xu(e, t, n) {
  const r = it(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Hi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    Ou(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", de(a.value.context));
}
function Ou(e) {
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
function ae(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function oe(e) {
  const t = Oi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Mu(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Da(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Fu = ["strict", "open"], Wi = "strict";
function Bu(e) {
  return Fu.includes(e) ? e : Wi;
}
function Uu(e) {
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
function qt(e, t) {
  return e === "strict" && t.kind === "pending";
}
const qu = ["disabled", "ask", "automatic"], Gu = ["buttons", "confirm"], Ki = "ask";
function ju(e) {
  return typeof e == "string" && qu.includes(e);
}
function zu(e) {
  return typeof e == "string" && Gu.includes(e);
}
function Vu(e) {
  return ju(e) ? e : zu(e) ? "ask" : Ki;
}
const Hu = ["keep", "replace"], Wu = ["manual", "assisted"], Yi = "keep", Qi = "assisted", Ku = !0, L = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Yu() {
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
    default: Ki
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
    default: Yi
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
    default: Qi
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
    default: Wi
  }), game.settings.register(d, L.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ku
  }), game.settings.register(d, L.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function va() {
  const e = Vu(game.settings.get(d, L.executionMode)), t = Xi(game.settings.get(d, L.systemCardMode)), n = Ji(game.settings.get(d, L.damageResolutionMode)), r = Cr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Zi()
  };
}
function Qu() {
  return Xi(game.settings.get(d, L.systemCardMode));
}
function Zu() {
  return Ji(game.settings.get(d, L.damageResolutionMode));
}
function Cr() {
  return Bu(game.settings.get(d, L.resistanceGateMode));
}
function Zi() {
  return game.settings.get(d, L.ritualCastingCheckEnabled) === !0;
}
async function ie(e) {
  await game.settings.set(d, L.executionMode, e);
}
function Xi(e) {
  return Hu.includes(e) ? e : Yi;
}
function Ji(e) {
  return Wu.includes(e) ? e : Qi;
}
function Xu(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await ie("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await ie("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await ie(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await ie("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await ie("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await ie("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await ie("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Ju = [
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
function ed(e) {
  return {
    phases() {
      return Ju;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = un("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = iu(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Pa(e, t, n);
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
      if (!rd(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = nd(n) ?? un("Nenhum ator encontrado para executar automação do item.");
      r && await Pa(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = un("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = ou(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(qi);
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
async function Pa(e, t, n) {
  const r = it(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Hi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    td(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", de(a.value.context));
}
function td(e) {
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
function un(e) {
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function nd(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function rd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ad(e) {
  const t = gu(e), n = lu(e), r = Nu(e), a = ed(e), o = bu(), s = Xu(e);
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
function od(e) {
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
      const r = Na();
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
      return id(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Na();
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
      return sd(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Na() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function id(e) {
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
function sd(e) {
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
function ld(e) {
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
    conditions: od(e.conditions),
    debug: ad(e),
    hooks: Tt
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class xa {
  static isSupportedSystem() {
    return game.system.id === vc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function cd() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Ee(t.id),
    actorId: Ee(t.actor?.id),
    sceneId: Ee(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function es() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: Ee(e.id),
    actorId: Ee(t?.id),
    sceneId: Ee(e.scene?.id),
    name: n
  };
}
function ud(e, t = es()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function dd(e) {
  if (!pd(e)) return null;
  const t = e.getFlag(d, "workflow");
  return fd(t) ? t : null;
}
function md() {
  return `flags.${d}.workflow`;
}
function Oa(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${d}`), n = foundry.utils.getProperty(e, `_source.flags.${d}`);
  return t !== void 0 || n !== void 0;
}
function Ma(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Mn(t) || Mn(n);
}
function fd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function pd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function Ee(e) {
  return Mn(e) ? e : null;
}
function Mn(e) {
  return typeof e == "string" && e.length > 0;
}
function gd() {
  const e = (t, n) => {
    hd(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function hd(e, t) {
  const n = dd(e);
  if (!n || n.targets.length === 0) return;
  const r = bd(t);
  if (!r || r.querySelector(`.${d}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(yd(n));
}
function yd(e) {
  const t = document.createElement("section");
  t.classList.add(`${d}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Fa("Origem", e.source.name)), t.append(Fa("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Fa(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${d}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function bd(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ad() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!_d(r) || !Td(e) || Oa(e) || Oa(t)) return;
    const a = cd();
    if (a.length === 0 || !Ma(e) && !Ma(t)) return;
    const o = es();
    e.updateSource({
      [md()]: ud(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function _d(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Td(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Ba = !1, dn = !1, mn = !1, gt = null;
const Rd = 1e3, $d = 750, wd = 1e3;
function kd(e) {
  Ba || (Hooks.on("combatTurnChange", (t) => {
    Id(e, Ua(t));
  }), Hooks.on("deleteCombat", (t) => {
    Cd(e, Ua(t));
  }), Ba = !0, Ed(e));
}
function Ed(e) {
  Gt() && (dn || (dn = !0, globalThis.setTimeout(() => {
    dn = !1, Sr(e, "ready");
  }, Rd)));
}
function Id(e, t) {
  Gt() && t && (gt && globalThis.clearTimeout(gt), gt = globalThis.setTimeout(() => {
    gt = null, Sr(e, "combat-turn-change", t);
  }, $d));
}
function Cd(e, t) {
  Gt() && t && (mn || (mn = !0, globalThis.setTimeout(() => {
    mn = !1, Sr(e, "combat-deleted", t);
  }, wd)));
}
async function Sr(e, t, n) {
  if (Gt())
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
function Gt() {
  return game.user?.isGM === !0;
}
function Ua(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ts = {
  enabled: "dice.animations.enabled"
};
function Sd() {
  game.settings.register(d, ts.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ld() {
  return {
    enabled: game.settings.get(d, ts.enabled) === !0
  };
}
const jt = "chatCard", qa = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Dd = `.${i}__title`, ns = `.${i}__header`, vd = `.${i}__roll-card`, Pd = `.${i}__roll-meta`, Nd = `.${i}__roll-meta-pill`, Lr = `.${i}__resistance`, xd = `.${i}__resistance-header`, rs = `.${i}__resistance-description`, zt = `.${i}__resistance-roll-button`, as = `.${i}__resistance-roll-result`, Ga = `${i}__resistance-content`, os = `.${i}__workflow-section`, is = `.${i}__workflow-roll`, Dr = `${i}__workflow-roll--dice-open`, vr = `.${i}__workflow-roll-formula`, Pr = `${i}__workflow-roll-formula--toggle`, Vt = `.${i}__workflow-dice-tray`, Od = `.${i}__roll-detail-toggle`, Md = `.${i}__roll-detail-list`, Fd = `.${i}__ritual-element-badge`, Bd = `.${i}__ritual-metadata`, Ud = "casting-backlash", qd = "data-paranormal-toolkit-action-section", Gd = "data-paranormal-toolkit-prompt-id", jd = "data-paranormal-toolkit-pending-id", ja = "data-paranormal-toolkit-casting-backlash-enhanced", za = `.${i}`, zd = `.${i}__workflow-section--casting`, Vd = `.${i}__workflow-section-header`, Hd = `.${i}__workflow-notes`, Wd = `[${qd}="${Ud}"]`, Va = `${i}__workflow-section-title-row`, Kd = `${i}__workflow-section-header--casting-backlash`, ss = `${i}__casting-backlash-button`;
function Yd(e) {
  for (const t of Qd(e))
    Zd(t), nm(t);
}
function Qd(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(za) && t.add(e);
  for (const n of e.querySelectorAll(za))
    t.add(n);
  return Array.from(t);
}
function Zd(e) {
  const t = e.querySelector(Wd);
  if (!t) return;
  const n = Xd(t);
  if (!n) return;
  const r = e.querySelector(`${zd} ${Vd}`);
  r && (r.classList.add(Kd), Jd(r), em(n), r.append(n), t.remove());
}
function Xd(e) {
  return e.querySelector(
    `button[${jd}], button[${Gd}]`
  );
}
function Jd(e) {
  const t = e.querySelector(`:scope > .${Va}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Va);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(ss) || n.append(a));
  return n;
}
function em(e) {
  if (e.getAttribute(ja) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = tm(t, e.disabled);
  e.classList.add(ss), e.setAttribute(ja, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function tm(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function nm(e) {
  for (const t of e.querySelectorAll(Hd)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function rm(e) {
  for (const t of Array.from(e.querySelectorAll(os)))
    for (const n of Array.from(t.querySelectorAll(`${Od}, ${Md}`)))
      n.remove();
}
const am = {
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
}, om = new Set(
  Object.values(am)
), im = {
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
function sm(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = lm(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = im[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : om.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ls(e) {
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
function lm(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class cs {
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
      const y = cm(m, u);
      if (!y.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const R = sm(m.damageType);
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
          um(y.id, m, R.value)
        );
        continue;
      }
      try {
        const b = await Promise.resolve(
          o.call(n, y.amount, {
            damageType: R.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const T of mm(b.conditions))
          l.add(T);
        const p = dm(b.newPV);
        p !== null && (c = p), s.push({
          id: y.id,
          label: m.label ?? ls(R.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: Ha(b.finalDamage, y.amount),
          blocked: Ha(b.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: R.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (b) {
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: b
        });
      }
    }
    return A({
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
function cm(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function um(e, t, n) {
  return {
    id: e,
    label: t.label ?? ls(n),
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
function Ha(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function dm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function mm(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Nr {
  async rollResistance(t) {
    const n = await pm(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? fe(t.skill),
      roll: n,
      formula: hm(n),
      total: ym(n),
      diceBreakdown: bm(n)
    };
  }
  getSkillLabel(t) {
    return fe(t);
  }
}
async function fm(e, t) {
  return new Nr().rollResistance({ actor: e, skill: t });
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
async function pm(e, t) {
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
  return gm(r);
}
function gm(e) {
  return Wa(e) ? e : Array.isArray(e) ? e.find(Wa) ?? null : null;
}
function Wa(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function hm(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ym(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function bm(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Am);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Am(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class us {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class ds {
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
function _m(e, t) {
  const n = Im(e?.rounds);
  if (!n)
    return Ka(null);
  const r = e?.anchor ?? ms(t);
  if (!r)
    return {
      ...Ka(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Tm(),
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
function ms(e) {
  const t = Cm();
  if (!t?.id || !fs(t.round)) return null;
  const n = km(t), r = Rm(e, n) ?? wm(t), a = X(r?.id), o = Lm(r?.initiative), s = $m(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Sm()
  };
}
function Tm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Ka(e) {
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
function Rm(e, t) {
  return e?.id ? t.find((n) => Em(n) === e.id) ?? null : null;
}
function $m(e, t, n) {
  const r = X(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Dm(e.turn) ? e.turn : null;
}
function wm(e) {
  return Rt(e.combatant) ? e.combatant : null;
}
function km(e) {
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
function Em(e) {
  return X(e.actor?.id) ?? X(e.actorId) ?? X(e.token?.actor?.id) ?? X(e.token?.actorId) ?? X(e.document?.actor?.id) ?? X(e.document?.actorId);
}
function Im(e) {
  return fs(e) ? Math.trunc(e) : null;
}
function Cm() {
  return game.combat ?? null;
}
function Sm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Rt(e) {
  return !!(e && typeof e == "object");
}
function X(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Lm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function fs(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Dm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class ps {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? A(n.value) : g({
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
    if (!qm(r))
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = _m(t.duration, r), s = vm(a, t, o), c = t.refreshExisting ?? !0 ? Gm(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), A(Ya(r, a, c.id ?? null, !1, !0, o));
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
      return A(Ya(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = hs(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Qa(n, s) === "deleted" && (o += 1);
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
    return A({
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
    const n = Vm(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = xr(s);
      a += l.length;
      for (const c of l) {
        if (!xm(c, t)) continue;
        const u = gs(c);
        try {
          await Qa(s, c) === "deleted" && (o += 1);
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
function vm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: tf(),
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
    duration: Pm(n.duration),
    start: Nm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function Pm(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Nm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: ef(),
    ...e
  };
}
function Ya(e, t, n, r, a, o) {
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
function xm(e, t) {
  const n = gs(e);
  if (!n.conditionId || !Om(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Jm();
  return n.durationMode === "combatantTurn" || Mm(n) ? Bm(n, r) : Fm(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !F(n.startRound) || !F(n.requestedRounds) || !F(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Om(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && F(e.requestedRounds);
}
function Mm(e) {
  return !!(e.combatDurationApplied && F(e.requestedRounds) && F(e.startRound) && (e.startCombatantId || Ct(e.startTurn)));
}
function Fm(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Bm(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !F(e.startRound) || !F(e.requestedRounds) || !F(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Um(t);
  return e.startCombatantId ? r === e.startCombatantId : Ct(e.startTurn) && Ct(t.turn) ? t.turn === e.startTurn : !1;
}
function Um(e) {
  return Ie(e.combatant?.id);
}
function gs(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: $t(e, "conditionId"),
    requestedRounds: Za(e, "requestedRounds") ?? Ke(t.value) ?? Ke(t.rounds),
    combatDurationApplied: fn(e, "combatDurationApplied"),
    combatId: $t(e, "combatId") ?? Ie(n.combat) ?? Ie(t.combat),
    startCombatantId: $t(e, "startCombatantId") ?? Ie(n.combatant),
    startInitiative: Ym(e, "startInitiative") ?? ys(n.initiative),
    startRound: Za(e, "startRound") ?? Ke(n.round) ?? Ke(t.startRound),
    startTurn: Km(e, "startTurn") ?? Fn(n.turn) ?? Fn(t.startTurn),
    expiryEvent: Qm(e, "expiryEvent") ?? bs(t.expiry),
    durationMode: Zm(e, "durationMode"),
    deleteOnExpire: fn(e, "deleteOnExpire"),
    expiresWithCombat: fn(e, "expiresWithCombat")
  };
}
function qm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Gm(e, t) {
  return hs(e, t)[0] ?? null;
}
function hs(e, t) {
  return xr(e).filter((n) => Wm(n) === t);
}
async function Qa(e, t) {
  const n = t.id ?? null, r = n ? jm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (zm(a)) return "missing";
    throw a;
  }
}
function jm(e, t) {
  return xr(e).find((n) => n.id === t) ?? null;
}
function zm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Vm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      ht(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    ht(e, n);
  });
  for (const n of Hm())
    ht(e, n.actor), ht(e, n.document?.actor);
  return Array.from(e.values());
}
function ht(e, t) {
  if (!Xm(t)) return;
  const r = Ie(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Hm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function xr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Wm(e) {
  return $t(e, "conditionId");
}
function $t(e, t) {
  return Ie(he(e, t));
}
function Za(e, t) {
  return Ke(he(e, t));
}
function Km(e, t) {
  return Fn(he(e, t));
}
function Ym(e, t) {
  return ys(he(e, t));
}
function Qm(e, t) {
  return bs(he(e, t));
}
function Zm(e, t) {
  const n = he(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function fn(e, t) {
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
function Ie(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ke(e) {
  return F(e) ? Math.trunc(e) : null;
}
function Fn(e) {
  return Ct(e) ? Math.trunc(e) : null;
}
function ys(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function bs(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Xm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Jm() {
  return game.combat ?? null;
}
function ef() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function F(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ct(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function tf() {
  return game.user?.id ?? null;
}
const nf = "icons/svg/downgrade.svg", rf = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? nf,
    description: rf,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const af = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), of = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), sf = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), lf = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), cf = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), uf = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), df = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), mf = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), ff = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), pf = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), gf = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), hf = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), yf = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), bf = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Af = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), _f = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Tf = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Rf = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), $f = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), wf = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), kf = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Ef = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), If = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Cf = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Sf = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Lf = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Df = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), vf = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Pf = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Nf = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), xf = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Of = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Mf = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Ff = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Bf = [
  af,
  of,
  sf,
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
  Ff
];
class Uf {
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
    return Array.from(this.definitions.values()).map(Xa);
  }
  get(t) {
    const n = this.lookup.get(Ja(t)), r = n ? this.definitions.get(n) : null;
    return r ? A(Xa(r)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Ja(t);
    r && this.lookup.set(r, n);
  }
}
function As() {
  return new Uf(Bf);
}
function Xa(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Ja(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Pe(e) {
  return e.applyOnResistance ?? "failure";
}
function _s(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function Ts(e, t) {
  const n = Pe(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Rs(e) {
  const t = Pe(e);
  return t === "failure" || t === "success";
}
function qf(e, t, n, r) {
  const a = e.filter((c) => Ts(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Pe(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Gf = {
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
}, jf = {
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
function zf(e) {
  return ws(e, Gf, !1);
}
function Vf(e) {
  return ws(e, jf, !e.allowsSuccessfulResistance);
}
function Fe(e) {
  return e.kind === "waiting-resistance";
}
function $s(e) {
  return e.kind === "resisted";
}
function ws(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? $e("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? $e("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || qt(e.resistanceGateMode, e.resistanceState) ? $e(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? $e("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : $e("available", !0, r.available, r.availableCompact, null);
}
function $e(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Ye = "data-paranormal-toolkit-prompt-id", Hf = "data-paranormal-toolkit-resistance-roll-result", Wf = "Conjuração DT";
function Kf(e) {
  const t = e.querySelector(zt)?.getAttribute(Hf), n = et(t);
  if (n !== null) return n;
  const r = e.querySelector(as)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return et(a?.[1] ?? null);
}
function Or(e) {
  const t = ks(e), n = Xf(t);
  if (n !== null) return n;
  const r = Zf(t);
  return r !== null ? r : Jf(e);
}
function Yf(e) {
  const t = ks(e);
  return t ? {
    actorId: pn(t.actorId),
    itemId: pn(t.itemId),
    itemName: pn(t.itemName)
  } : null;
}
function Qf(e) {
  const t = e.getAttribute(Ye);
  if (!t) return null;
  const n = Es(e), r = Is(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Ht(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function J(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Bn(e) {
  return J(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Zf(e) {
  const t = tp(e);
  return t.length === 0 ? null : et(np(t, Wf));
}
function Xf(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : eo(r, ["system", "ritual", "DT"]) ?? eo(r, ["system", "ritual", "dt"]);
}
function Jf(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return et(n?.[1] ?? null);
}
function ks(e) {
  const t = ep(e);
  if (!t) return null;
  const n = Es(e), r = Is(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Ht(o) ? o.pendingId === t : !1) ?? null;
}
function ep(e) {
  return (e.closest(`[${Ye}]`) ?? e.querySelector(`[${Ye}]`) ?? e.parentElement?.querySelector(`[${Ye}]`) ?? null)?.getAttribute(Ye) ?? null;
}
function Es(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return rp(a) ? a : null;
}
function Is(e) {
  const t = e?.getFlag?.(d, jt);
  return Ht(t) ? t : null;
}
function tp(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function np(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function eo(e, t) {
  let n = e;
  for (const r of t) {
    if (!Ht(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : et(typeof n == "string" ? n : null);
}
function et(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function rp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Ht(e) {
  return !!(e && typeof e == "object");
}
function pn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Wt(e) {
  return Cs({
    hasResistance: !!e.querySelector(Lr),
    difficulty: Or(e),
    resistanceTotal: Kf(e)
  });
}
function ap(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Cs({
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
function Cs(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Uu(e)
  };
}
function ye() {
  return game.user?.isGM === !0;
}
function pe() {
  return ye();
}
function op(e) {
  const t = qt(e.resistanceGateMode, e.resistanceState), n = ip(e.resistanceState, e.hasDamage), r = sp(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = zf({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Vf({
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
function ip(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function sp(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Mr(e) {
  const t = e.isGM ?? pe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: op({
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
function lp(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = up(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function cp(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function up(e, t) {
  const n = dp(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of mp(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function dp(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function mp(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? to(e, "highest") : n.includes("kl") ? to(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function to(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const fp = "data-paranormal-toolkit-resistance-skill", pp = "data-paranormal-toolkit-resistance-skill-label", Ss = "pending", Fr = "success", Br = "failure", Ls = "rolled";
function gp(e) {
  const t = _p(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? bp(e.damageSection) : null, r = no(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = hp(e.rollCard).map((o, s) => {
    const l = yp(o, s), c = e.resistanceResults.get(l) ?? null, u = kp(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, y = e.effectApplications.get(l) ?? null, R = ap({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Sp(u)
    }).state, b = no(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      _s(R)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: y,
      effect: b,
      assistedActions: Mr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: R,
        damage: n,
        effect: b,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!y,
        effectCanApplyOnSuccessfulResistance: b?.applyOnResistance === "success" || b?.applyOnResistance === "always",
        effectRequiresResolvedResistance: b ? Rs(b) : !1
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
function hp(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && Ds(a) !== "nenhum alvo") : [];
}
function yp(e, t) {
  return `${Ds(e)}:${t}`;
}
function bp(e) {
  const t = Ep(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Cp(e),
    formula: Ip(e) ?? "—",
    total: t,
    diceBreakdown: cp(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function no(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Ap(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Pe(o)
  } : null;
}
function Ap(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function _p(e, t) {
  const n = Tp(t), r = Rp(n)?.textContent?.trim(), a = $p(n), o = a?.getAttribute(fp) ?? null, s = a?.getAttribute(pp) ?? (o ? fe(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: wp(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: Or(e)
  };
}
function Tp(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function Rp(e) {
  return Ur(e, `.${i}__resistance-description`);
}
function $p(e) {
  return Ur(e, zt);
}
function wp(e) {
  return Ur(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Ur(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function kp(e, t) {
  return e ? t === null ? Ls : e.total >= t ? Fr : Br : Ss;
}
function Ep(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Ip(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Cp(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Ds(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Sp(e) {
  return e === Fr ? "succeeded" : e === Br ? "failed" : "pending";
}
function vs(e) {
  if (!e) return null;
  const t = e.actorId ? vp(e.actorId) : null, n = t ? Lp(t, e.itemId, e.itemName) : null;
  return n || Dp(e.itemId, e.itemName);
}
function Lp(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Ce(o)) return o;
  }
  const a = St(n);
  if (a) {
    const o = r?.find?.((s) => Ce(s) ? St(s.name) === a : !1);
    if (Ce(o)) return o;
  }
  return null;
}
function Dp(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Ce(a)) return a;
  }
  const r = St(t);
  if (r) {
    const a = n?.find?.((o) => Ce(o) ? St(o.name) === r : !1);
    if (Ce(a)) return a;
  }
  return null;
}
function vp(e) {
  const n = game.actors?.get?.(e);
  return Pp(n) ? n : null;
}
function Pp(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ce(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function St(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function qr(e) {
  const t = gn(e);
  if (!t) return null;
  const n = Np().filter((o) => gn(xp(o)) === t).map((o) => Ps(o)).find(Xe) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Xe(o) && gn(o.name) === t);
  return Xe(a) ? a : null;
}
function Np() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function xp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ps(e)?.name ?? null;
}
function Ps(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Xe(t)) return t;
  const n = e.document?.actor;
  return Xe(n) ? n : null;
}
function Xe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function gn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Ns(e) {
  const t = Bp();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Op(e)
  });
}
function Op(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${wt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Mp(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${wt(e.conditions.join(", "))}</li>` : "";
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
function Mp(e) {
  const t = Fp(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${wt(a)}</li>`;
}
function Fp(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = ro(n?.value);
  return r === null ? null : {
    value: r,
    max: ro(n?.max)
  };
}
function ro(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Bp() {
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
async function Up(e) {
  await Ns(qp(e));
}
function qp(e) {
  if (Gp(e)) return e;
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
function Gp(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function xs(e) {
  return e.mode, `✓ ${Os(e.inputAmount)} PV`;
}
function jp(e) {
  const t = Os(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Os(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class zp {
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
    } : qt(t.resistanceGateMode, t.resistanceState) ? {
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
class Vp {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? pe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : qt(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Hp {
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
const Wp = `.${i}__actions`, Gr = `.${i}__actions-title`, Ne = `.${i}__button`, Kp = "data-paranormal-toolkit-action-section", Yp = `${i}__button--executed`, Qp = "data-paranormal-toolkit-executed-label";
function Ms(e) {
  return J(e.querySelector(Gr)?.textContent);
}
function Zp(e, t) {
  const n = e.querySelector(Gr);
  n && (n.textContent = t);
}
function lt(e, t) {
  const n = J(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return J(a) === n;
  }) ?? null;
}
function jr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function be(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Fs(e) {
  const t = Xp(e.difficulty);
  if (t === null) return null;
  const n = ao(e.skillLabel) ?? "Resistência", r = ao(e.description), a = Jp(r, n), o = eg(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Xp(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function ao(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Jp(e, t) {
  if (!e) return null;
  const n = oo(e), r = oo(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function eg(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function oo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const yt = "data-paranormal-toolkit-prompt-id", Bs = "multiTargetResistanceResults", Us = "multiTargetDamageApplications", qs = "multiTargetEffectApplications";
function tg(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Bs];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    lg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function ng(e, t) {
  await zr(e, Bs, t.targetId, t);
}
function rg(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Us];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    cg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function ag(e, t) {
  await zr(
    e,
    Us,
    t.targetId,
    t
  );
}
function og(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[qs];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    dg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function ig(e, t) {
  await zr(
    e,
    qs,
    t.targetId,
    t
  );
}
function sg(e) {
  const t = Kt(e);
  return t ? {
    actorId: hn(t.actorId),
    itemId: hn(t.itemId),
    itemName: hn(t.itemName)
  } : null;
}
async function zr(e, t, n, r) {
  const a = Gs(e);
  if (!a) return;
  const o = js(e), s = zs(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!U(u) || u.pendingId !== a) return u;
    const m = U(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, jt, {
    ...s,
    prompts: c
  }));
}
function Kt(e) {
  const t = Gs(e);
  if (!t) return null;
  const n = js(e), r = zs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => U(o) ? o.pendingId === t : !1) ?? null;
}
function Gs(e) {
  return (e.closest(`[${yt}]`) ?? e.querySelector(`[${yt}]`) ?? e.parentElement?.querySelector(`[${yt}]`) ?? null)?.getAttribute(yt) ?? null;
}
function js(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return mg(a) ? a : null;
}
function zs(e) {
  const t = e?.getFlag?.(d, jt);
  return U(t) ? t : null;
}
function lg(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function cg(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && ug(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function ug(e) {
  return e === "normal" || e === "half";
}
function dg(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function hn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function mg(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function U(e) {
  return !!(e && typeof e == "object");
}
const fg = "data-paranormal-toolkit-resistance-skill", pg = "data-paranormal-toolkit-resistance-skill-label", Un = "data-paranormal-toolkit-multi-target-section", Vr = "data-paranormal-toolkit-multi-target-damage-info", Vs = "data-paranormal-toolkit-multi-target-effect-info", Hs = "data-paranormal-toolkit-multi-target-toggle", Ws = "data-paranormal-toolkit-multi-target-details", x = "data-paranormal-toolkit-multi-target-target", gg = "data-paranormal-toolkit-multi-target-state", qn = "data-paranormal-toolkit-multi-target-roll-total", Gn = "data-paranormal-toolkit-multi-target-roll-formula", kt = "data-paranormal-toolkit-multi-target-roll-dice", jn = "data-paranormal-toolkit-multi-target-roll-skill", zn = "data-paranormal-toolkit-multi-target-roll-skill-label", Vn = "data-paranormal-toolkit-multi-target-roll-target-name", Hn = "data-paranormal-toolkit-multi-target-roll-rolled-at", Wn = "data-paranormal-toolkit-multi-target-damage-mode", Kn = "data-paranormal-toolkit-multi-target-damage-input-amount", io = "data-paranormal-toolkit-multi-target-damage-final-amount", so = "data-paranormal-toolkit-multi-target-damage-blocked", Yn = "data-paranormal-toolkit-multi-target-damage-target-name", Qn = "data-paranormal-toolkit-multi-target-damage-applied-at", Zn = "data-paranormal-toolkit-multi-target-effect-condition-id", Xn = "data-paranormal-toolkit-multi-target-effect-condition-label", Jn = "data-paranormal-toolkit-multi-target-effect-effect-id", er = "data-paranormal-toolkit-multi-target-effect-created", tr = "data-paranormal-toolkit-multi-target-effect-refreshed", nr = "data-paranormal-toolkit-multi-target-effect-target-name", rr = "data-paranormal-toolkit-multi-target-effect-applied-at", hg = new ps(As()), yg = new us(new cs()), bg = new ds(new Nr()), Ag = new Hp(bg), _g = new zp(yg), Tg = new Vp(hg), Rg = Ss, Be = Fr, ct = Br, $g = Ls;
function wg(e) {
  const t = Ks(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Pg(e);
  const n = Ng(e.rollCard, t), r = xg(e.rollCard, t);
  !n && r && yh(e.rollCard, r, e.effectSection);
  const a = qg(e.rollCard);
  return Zs(a, t), ph(
    e.rollCard,
    a,
    Og(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && bh(e.rollCard, r, a), !0;
}
function Ks(e) {
  return gp({
    ...e,
    resistanceResults: Ig(e.rollCard),
    damageApplications: Cg(e.rollCard),
    effectApplications: Sg(e.rollCard),
    resolveTargetConditionApplication: kg,
    resistanceGateMode: Wr()
  });
}
function kg(e, t, n) {
  const r = sg(e), a = vs(r);
  if (!a) return null;
  const o = it(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = Eg(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function Eg(e, t, n) {
  const r = qf(
    e,
    n,
    t,
    yn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = yn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => yn(s) === a)) ?? null : null;
}
function Ig(e) {
  const t = tg(e);
  for (const [n, r] of vg(e))
    t.set(n, r);
  return t;
}
function Cg(e) {
  const t = rg(e);
  for (const [n, r] of Dg(e))
    t.set(n, r);
  return t;
}
function Sg(e) {
  const t = og(e);
  for (const [n, r] of Lg(e))
    t.set(n, r);
  return t;
}
function Lg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = n.getAttribute(Zn), o = n.getAttribute(Xn), s = n.getAttribute(Jn), l = uo(n.getAttribute(er)), c = uo(n.getAttribute(tr)), u = n.getAttribute(nr), m = n.getAttribute(rr);
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
function Dg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = n.getAttribute(Wn), o = sl(n.getAttribute(Kn)), s = n.getAttribute(Yn), l = n.getAttribute(Qn);
    !r || !Th(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function vg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = sl(n.getAttribute(qn)), o = n.getAttribute(Gn), s = n.getAttribute(jn), l = n.getAttribute(zn), c = n.getAttribute(Vn), u = n.getAttribute(Hn);
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
function Pg(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Ng(e, t) {
  if (!t.damage)
    return Ys(e)?.remove(), null;
  const n = Mg(e);
  return Fg(n, t.damage), Ug(e, n), n;
}
function xg(e, t) {
  if (!t.effect)
    return il(e)?.remove(), null;
  const n = gh(e);
  return hh(n, t.effect), n;
}
function Og(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : lt(e, "Conjuração");
}
function Mg(e) {
  const t = Ys(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Vr, "true"), n;
}
function Ys(e) {
  return e.querySelector(`[${Vr}="true"]`);
}
function Fg(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Qs(t.formula, t.total, t.diceBreakdown));
}
function Qs(e, t, n, r = !1) {
  const a = lp({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Bg(a, r), a;
}
function Bg(e, t) {
  const n = e.querySelector(Vt), r = e.querySelector(vr);
  if (!n || !r) return;
  e.classList.toggle(Dr, t), n.hidden = !t, r.classList.add(Pr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Ug(e, t) {
  const n = lt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function qg(e) {
  const t = e.querySelector(`[${Un}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Un, "true"), n;
}
function Zs(e, t) {
  const n = Gg(e), r = zg(t.resistance), a = [jg(t)];
  r && a.push(r), a.push(Wg(t, n)), e.replaceChildren(...a);
}
function Gg(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${x}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(x)).filter(_h)
  );
}
function jg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Hg(e.targets), t.append(n, r), t;
}
function zg(e) {
  const t = Fs({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Vg(n, t), n;
}
function Vg(e, t) {
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
function Hg(e) {
  const t = e.length, n = e.filter((l) => l.state === ct).length, r = e.filter((l) => l.state === Be).length, a = e.filter((l) => l.state === Rg).length, o = e.filter((l) => l.state === $g).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Wg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Kg(r, e, t.has(r.id)));
  return n;
}
function Kg(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(x, e.id), r.setAttribute(gg, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Xs(r, e.resistanceResult), Js(r, e.damageApplication), el(r, e.effectApplication);
  const a = Yg(e, t, r), o = uh(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    co(s.target) || lo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || co(s.target) || (s.preventDefault(), lo(r));
  }), r.append(a, o), r;
}
function Xs(e, t) {
  if (!t) {
    e.removeAttribute(qn), e.removeAttribute(Gn), e.removeAttribute(kt), e.removeAttribute(jn), e.removeAttribute(zn), e.removeAttribute(Vn), e.removeAttribute(Hn);
    return;
  }
  e.setAttribute(qn, String(t.total)), e.setAttribute(Gn, t.formula), e.setAttribute(jn, t.skill), e.setAttribute(zn, t.skillLabel), e.setAttribute(Vn, t.targetName), e.setAttribute(Hn, t.rolledAt), t.diceBreakdown ? e.setAttribute(kt, t.diceBreakdown) : e.removeAttribute(kt);
}
function Js(e, t) {
  if (!t) {
    e.removeAttribute(Wn), e.removeAttribute(Kn), e.removeAttribute(io), e.removeAttribute(so), e.removeAttribute(Yn), e.removeAttribute(Qn);
    return;
  }
  e.setAttribute(Wn, t.mode), e.setAttribute(Kn, String(t.inputAmount)), e.removeAttribute(io), e.removeAttribute(so), e.setAttribute(Yn, t.targetName), e.setAttribute(Qn, t.appliedAt);
}
function el(e, t) {
  if (!t) {
    e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Jn), e.removeAttribute(er), e.removeAttribute(tr), e.removeAttribute(nr), e.removeAttribute(rr);
    return;
  }
  e.setAttribute(Zn, t.conditionId), e.setAttribute(Xn, t.conditionLabel), e.setAttribute(Jn, t.effectId ?? ""), e.setAttribute(er, String(t.created)), e.setAttribute(tr, String(t.refreshed)), e.setAttribute(nr, t.targetName), e.setAttribute(rr, t.appliedAt);
}
function Yg(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Qg(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Zg(e, t.resistance);
  th(l, n, e, t);
  const c = ch(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), al(u, [
    tl(e, t, "compact"),
    rl(e, t, "compact")
  ]), r.append(a, u), r;
}
function Qg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Zg(e, t) {
  if (!ye())
    return Xg(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", eh(e, t)), t?.skill && (n.setAttribute(fg, t.skill), n.setAttribute(pg, t.skillLabel ?? fe(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Be ? "✓" : e.state === ct ? "✕" : "", n.append(r, a), n;
}
function Xg(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Jg(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Be ? "✓" : e.state === ct ? "✕" : "", n.append(r, a), n;
}
function Jg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Be ? "sucesso" : e.state === ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function eh(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Be ? "sucesso" : e.state === ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function th(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !ye() || e.addEventListener("click", (a) => {
    a.stopPropagation(), nh(t, e, n, r);
  });
}
async function nh(e, t, n, r) {
  if (!ye()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? fe(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = qr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Ag.execute({ actor: l, skill: o, skillLabel: s });
    await Ah(u.roll);
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
    Xs(e, m);
    try {
      await ng(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    Hr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Hr(e) {
  const t = e.closest(`[${Un}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Ks({
    rollCard: n,
    damageSection: rh(n) ?? lt(n, "Dano"),
    effectSection: ah(n)
  });
  r && Zs(t, r);
}
function rh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Vr) !== "true") ?? null;
}
function ah(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function oh(e) {
  return Fe(e.assistedActions.policy.damageActionState);
}
function ih(e) {
  return Fe(e.assistedActions.policy.effectActionState);
}
function Wr() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
function tl(e, t, n) {
  if (e.damageApplication)
    return j(
      "✓",
      xs({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Fe(r))
    return j(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = nl(a, t.damage);
  if (o === null)
    return j(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = jp({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = j(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const y = u.closest(`[${x}]`);
    y && sh(y, u, e, t);
  }), u;
}
function nl(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function sh(e, t, n, r) {
  if (n.damageApplication) return;
  if (oh(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = nl(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = qr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await _g.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Wr(),
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
    Js(e, m);
    try {
      await ag(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", y);
    }
    try {
      await Up(u.value);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", y);
    }
    Hr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function rl(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (!a)
    return j(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return j(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (Fe(r))
    return j(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if ($s(r))
    return j(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = j(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${x}]`);
    l && lh(l, o, e, t);
  }), o;
}
async function lh(e, t, n, r) {
  if (n.effectApplication) return;
  if (ih(n)) {
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
  const o = qr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await Tg.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Wr(),
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
    el(e, c);
    try {
      await ig(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Hr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function al(e, t) {
  for (const n of t)
    n && e.append(n);
}
function j(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function ch(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Hs, "true"), t.setAttribute("aria-hidden", "true"), ol(e, t), t;
}
function lo(e) {
  const t = e.querySelector(`[${Ws}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Hs}="true"]`);
  r && ol(e, r);
}
function ol(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function co(e) {
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
function uh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Ws, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = dh(e, t.resistance);
  s && r.append(s);
  const l = mh(e, t.resistance), c = fh(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function dh(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Be ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function mh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Qs(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function fh(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), al(n, [
    tl(e, t, "full"),
    rl(e, t, "full")
  ]), n;
}
function ph(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function gh(e) {
  const t = il(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Vs, "true"), n;
}
function il(e) {
  return e.querySelector(`[${Vs}="true"]`);
}
function hh(e, t) {
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
function yh(e, t, n) {
  const r = n?.parentElement === e ? n : lt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function bh(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function yn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Ah(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function _h(e) {
  return typeof e == "string" && e.length > 0;
}
function Th(e) {
  return e === "normal" || e === "half";
}
function uo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function sl(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const mo = "data-paranormal-toolkit-card-layout-refresh-bound";
function Rh(e) {
  const t = e.rollCard.querySelector(zt);
  t && t.getAttribute(mo) !== "true" && (t.setAttribute(mo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Se = "data-paranormal-toolkit-prompt-id", $h = "apply-damage", wh = "data-paranormal-toolkit-multi-target-damage-info";
function kh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(wh) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Eh(e) {
  const t = Ch(e);
  return t.find((n) => n.getAttribute(Kp) === $h) ?? t.find((n) => Ms(n) === "aplicar danos") ?? null;
}
function Ih(e) {
  const t = ll(e), n = fo(t);
  return n || fo(Sh(e));
}
function fo(e) {
  return e.find((t) => {
    const n = Ms(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Ch(e) {
  const t = ll(e);
  return t.length > 0 ? t : Kr(e);
}
function ll(e) {
  const t = vh(e);
  return t ? Kr(e).filter((n) => Dh(n, t)) : [];
}
function Sh(e) {
  const t = cl(e);
  if (!t) return [];
  const n = Lh(e, t);
  return Kr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => ul(e, r)).filter((r) => !n || Ph(r, n));
}
function Kr(e) {
  const t = cl(e);
  return t ? Array.from(t.querySelectorAll(Wp)) : [];
}
function cl(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Lh(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && ul(e, n)) ?? null;
}
function Dh(e, t) {
  return e.getAttribute(Se) === t ? !0 : Array.from(e.querySelectorAll(`[${Se}]`)).some((n) => n.getAttribute(Se) === t);
}
function vh(e) {
  return e.getAttribute(Se) ?? e.querySelector(`[${Se}]`)?.getAttribute(Se) ?? null;
}
function ul(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Ph(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Nh(e) {
  const t = dl(), n = Wt(e.rollCard).state, r = Mr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Fe(a), s = $s(a);
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
function xh(e) {
  const { rollCard: t } = e, n = Fh(), r = dl(), a = Wt(t).state, o = Mr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Fe(s), c = Mh(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: S(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: S(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: Oh(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: S("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: S("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: S("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: S("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: S("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: S("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: S("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: S("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: S("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: S("half", !1, !1, !1, !!e.halfButtonSkipped),
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
    normalButton: S("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: S("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function Oh(e) {
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
function S(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function Mh(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Fh() {
  try {
    return Zu();
  } catch {
    return "assisted";
  }
}
function dl() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
const Bh = "data-paranormal-toolkit-damage-resolution-state", po = "data-paranormal-toolkit-damage-icon-enhanced", Yr = "data-paranormal-toolkit-damage-original-label", Uh = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, ml = "Outra opção escolhida";
function qh(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Zp(t, "Aplicar dano"), Gh(e, t);
}
function Gh(e, t) {
  const n = Array.from(t.querySelectorAll(Ne)), r = ho(n, "normal"), a = ho(n, "half");
  if (!r || !a) {
    jh(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  yo(r, "normal"), yo(a, "half");
  const o = xh({
    rollCard: e,
    normalButtonApplied: Lt(r),
    halfButtonApplied: Lt(a),
    normalButtonSkipped: ar(r),
    halfButtonSkipped: ar(a)
  });
  if (!o.canShowApplyDamage) {
    bo(r), bo(a), Ao(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), go(r, o.normalButton), go(a, o.halfButton), Ao(t, o.summary.state, o.summary.message);
}
function go(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Vh(e, t.visible), Hh(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function jh(e) {
  for (const t of e)
    ar(t) && t.remove();
}
function Lt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(ml);
}
function ar(e) {
  return e.textContent?.includes(ml) ?? !1;
}
function ho(e, t) {
  const n = Uh[t];
  return e.find((r) => n.test(zh(r))) ?? null;
}
function zh(e) {
  return [
    e.getAttribute(Yr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function yo(e, t) {
  if (e.getAttribute(po) === "true") return;
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
  ), e.setAttribute(po, "true"), e.setAttribute(Yr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, be(n));
}
function bo(e) {
  Lt(e) || e.remove();
}
function Vh(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function Hh(e, t, n, r = "Role resistência") {
  if (!Lt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(be(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Wh(e, n);
  }
}
function Wh(e, t) {
  const n = e.getAttribute(Yr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Kh(t), be(n)));
}
function Kh(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function Ao(e, t, n) {
  e.setAttribute(Bh, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Gr)?.after(a);
}
const tt = "data-paranormal-toolkit-effect-icon-enhanced", xe = "data-paranormal-toolkit-effect-action-compacted", Yt = "data-paranormal-toolkit-effect-resistance-gate", Qr = "data-paranormal-toolkit-effect-section", Zr = "data-paranormal-toolkit-effect-label";
function Yh(e) {
  return e.querySelector(`[${Qr}="true"]`);
}
function Qh(e) {
  const t = Xh(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? ey(), r = cy(n, e.sourceActions, t);
  return r && n.setAttribute(Zr, r), ty(n, t, r), sy(e.rollCard, n, e.after ?? e.fallbackAfter), ly(e.sourceActions, n), n;
}
function Zh(e, t) {
  const n = t.querySelector(Ne);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = hl(t, n, r), o = fl(e, n), s = Nh({
    rollCard: e,
    effectLabel: a,
    applied: Jr(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Pe(o) === "success" || Pe(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Rs(o) : !1
  });
  if (s.applied) {
    dy(n);
    return;
  }
  if (!s.visible) {
    my(n);
    return;
  }
  if (s.waitingForResistance) {
    fy(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    py(n, s.compactLabel);
    return;
  }
  gy(n), gl(n, s.displayLabel);
}
function Xh(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ne) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ne) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Jh(e.rollCard, r) ?? r[0] ?? null;
}
function Jh(e, t) {
  const n = Wt(e).state, r = _s(n), a = pl(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = fl(e, o, a);
    if (s && Ts(s, r)) return o;
  }
  return null;
}
function fl(e, t, n = pl(e)) {
  const r = Xr(t, t.textContent?.trim() ?? ""), a = Bn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Bn(s) === a)) ?? null : null;
}
function pl(e) {
  const t = vs(Yf(e));
  if (!t) return [];
  const n = it(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function ey() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Qr, "true"), e;
}
function ty(e, t, n) {
  e.setAttribute(Qr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = ny(e), a = ry(r);
  a.textContent = "Efeito";
  const o = ay(e, r), s = oy(o);
  s.textContent = hy(n ?? hl(e, t, t.textContent?.trim() ?? ""));
  const l = iy(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ne)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Jr(t, c) && !uy(t, c) && gl(t, n ?? c);
}
function ny(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function ry(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function ay(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function oy(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function iy(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function sy(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ly(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Ne)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function cy(e, t, n) {
  const r = e.getAttribute(Zr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Xr(n, n.textContent?.trim() ?? "");
}
function Xr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && J(n) !== "efeito aplicado") return n;
  const r = Qf(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && J(a) !== "aplicado" ? a : null;
}
function Jr(e, t) {
  return e.classList.contains(Yp) || J(t).includes("aplicado");
}
function uy(e, t) {
  const n = e.getAttribute(Yt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Bn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function gl(e, t) {
  e.getAttribute(xe) === "true" && e.getAttribute(tt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(xe, "true"), e.setAttribute(tt, "true"), e.setAttribute(Qp, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    jr("✦", `${i}__button-icon--effect`),
    be("Aplicar")
  ));
}
function dy(e) {
  e.getAttribute(xe) === "true" && J(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(xe, "true"), e.setAttribute(tt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    jr("✓", `${i}__button-icon--effect-applied`),
    be("Aplicado")
  ));
}
function hl(e, t, n) {
  const r = e.getAttribute(Zr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Xr(t, n) ?? n;
}
function my(e) {
  Jr(e, e.textContent?.trim() ?? "") || e.remove();
}
function fy(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(xe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Yt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(be(t));
}
function py(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(xe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Yt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    jr("✓", `${i}__button-icon--effect-resisted`),
    be(t)
  );
}
function gy(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Yt), e.removeAttribute("aria-disabled");
}
function hy(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const yy = "data-paranormal-toolkit-card-layout-normalized";
function by(e) {
  const t = Ay(e.rollCard), n = _y(t);
  return Rh({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function Ay(e) {
  return {
    rollCard: e,
    damageSection: kh(e),
    resistance: e.querySelector(Lr),
    damageActions: Eh(e),
    effectActionSource: Ih(e),
    effectSection: Yh(e)
  };
}
function _y(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(yy, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = lt(t, "Conjuração"), c = Ty({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), qh(t, a));
  const u = Qh({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: Ry(n, c),
    fallbackAfter: l
  });
  return u && Zh(t, u), u;
}
function Ty(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function Ry(e, t) {
  return e ?? t;
}
const yl = [0, 80, 180, 400, 900, 1600, 3e3], _o = /* @__PURE__ */ new WeakSet();
function $y(e) {
  bl(e), wy(e);
}
function bl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Al(t);
}
function wy(e) {
  if (!_o.has(e)) {
    _o.add(e);
    for (const t of yl)
      globalThis.setTimeout(() => {
        bl(e);
      }, t);
  }
}
function Al(e) {
  const t = by({
    rollCard: e,
    refreshDelaysMs: yl,
    onRefresh: () => Al(e)
  });
  wg({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const ky = "data-paranormal-toolkit-resistance-roll-result-enhanced", To = "data-paranormal-toolkit-resistance-original-description", Ey = "data-paranormal-toolkit-resistance-skill", Iy = "data-paranormal-toolkit-resistance-skill-label";
function Cy(e) {
  for (const t of Array.from(e.querySelectorAll(Lr)))
    Sy(t);
  $y(e);
}
function Sy(e) {
  const t = e.querySelector(xd), n = e.querySelector(rs), r = e.querySelector(zt), a = e.querySelector(as);
  if (!r || !t && !n && !a) return;
  const o = Py(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), Ny(a)), By(r), Ly(e, r, n), r.parentElement !== e && e.append(r);
}
function Ly(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = vy(n), o = Fs({
    description: a,
    skillLabel: t.getAttribute(Iy) ?? t.getAttribute(Ey),
    difficulty: Or(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  Dy(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function Dy(e, t) {
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
function vy(e) {
  const t = e.getAttribute(To);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(To, n), n;
}
function Py(e, t) {
  const n = e.querySelector(`.${Ga}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Ga), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Ny(e) {
  const t = xy(e.textContent ?? "");
  t && (e.setAttribute(ky, "true"), e.replaceChildren(Fy(t)));
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
  const n = Wt(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function Uy(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of qy(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function qy(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ro(e, "highest") : n.includes("kl") ? Ro(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ro(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function $o(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function ea() {
  const e = globalThis.game;
  return Qt(e) ? e : null;
}
function B(e, t) {
  const n = Gy(e, t);
  return Et(n);
}
function Gy(e, t) {
  return t.split(".").reduce((n, r) => Qt(n) ? n[r] : null, e);
}
function jy(e, t) {
  const n = e.indexOf(":");
  return n < 0 || nt(e.slice(0, n)) !== nt(t) ? null : Ue(e.slice(n + 1));
}
function Et(e) {
  return typeof e == "string" ? Ue(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Qt(e) {
  return !!e && typeof e == "object";
}
function zy(e) {
  return typeof e == "string";
}
function Zt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Ue(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function nt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function or(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ee(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function _l(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Vy(e) {
  for (const t of Array.from(e.querySelectorAll(vd))) {
    const n = Xy(t);
    Hy(t), n && (Wy(t, n), Ky(t, n));
  }
}
function Hy(e) {
  for (const t of Array.from(e.querySelectorAll(Pd)))
    t.remove();
}
function Wy(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(ns) ?? null, a = r?.querySelector(Dd) ?? null, o = r ?? e, s = o.querySelector(Fd);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = gb(t.elementTone), l.textContent = pb(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Ky(e, t) {
  const n = Yy(e);
  Qy(e, n);
  const r = Zy(t);
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
  const o = e.querySelector(os);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Yy(e) {
  return e.closest(`.${i}`)?.querySelector(ns) ?? null;
}
function Qy(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Bd)))
      a.remove();
}
function Zy(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${or(e.target)}` : null,
    e.duration ? `Duração: ${or(e.duration)}` : null,
    e.resistance ? `Resistência: ${_l(e.resistance)}` : null
  ].filter(Zt);
}
function Xy(e) {
  const t = Jy(e), n = ob(e), a = (t ? ab(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = ta(B(a, "element")), l = W("op.elementChoices", s) ?? wo(le(o, "Elemento")) ?? wo(n.damageType), c = s ?? hb(l), u = B(a, "circle") ?? le(o, "Círculo"), m = lb(a) ?? le(o, "Alvo"), y = mb(a, "duration", "op.durationChoices") ?? le(o, "Duração"), R = ib(e) ?? ub(a) ?? le(o, "Resistência"), b = sb(o) ?? n.cost, p = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: b,
    target: m,
    duration: y,
    resistance: R
  };
  return fb(p) ? p : null;
}
function Jy(e) {
  const t = eb(e);
  if (!t) return null;
  const n = t.getFlag?.(d, jt), r = nb(n);
  if (r.length === 0) return null;
  const a = tb(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function eb(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? ea()?.messages?.get?.(n) ?? null : null;
}
function tb(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${qa}]`))) {
    const a = r.getAttribute(qa)?.trim();
    a && n.add(a);
  }
  return n;
}
function nb(e) {
  if (!Qt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(rb).filter((n) => n !== null) : [];
}
function rb(e) {
  return Qt(e) ? {
    pendingId: Et(e.pendingId),
    actorId: Et(e.actorId),
    itemId: Et(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(zy) : []
  } : null;
}
function ab(e) {
  if (!e.itemId) return null;
  const t = ea(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function ob(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Nd))) {
    const a = Ue(r.textContent);
    if (!a) continue;
    const o = jy(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function ib(e) {
  const t = Ue(e.querySelector(rs)?.textContent);
  return t ? _l(t) : null;
}
function le(e, t) {
  const n = nt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || nt(r.slice(0, a)) !== n))
      return Ue(r.slice(a + 1));
  }
  return null;
}
function sb(e) {
  const t = le(e, "Custo") ?? le(e, "PE");
  return t || (e.map(Ue).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function lb(e) {
  const t = B(e, "target");
  if (!t) return null;
  if (t === "area")
    return cb(e) ?? W("op.targetChoices", t) ?? "Área";
  const n = W("op.targetChoices", t) ?? ee(t);
  return [t === "people" || t === "creatures" ? B(e, "targetQtd") : null, n].filter(Zt).join(" ");
}
function cb(e) {
  const t = B(e, "area.name"), n = B(e, "area.size"), r = B(e, "area.type"), a = t ? W("op.areaChoices", t) ?? ee(t) : null, o = r ? W("op.areaTypeChoices", r) ?? ee(r) : null;
  return a ? n ? o ? `${a} ${n}m ${or(o)}` : `${a} ${n}m` : a : null;
}
function ub(e) {
  const t = B(e, "skillResis"), n = B(e, "resistance");
  if (!t || !n) return null;
  const r = W("op.skill", t) ?? ee(t), a = db(n);
  return [r, a].filter(Zt).join(" ");
}
function db(e) {
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
      return W("op.resistanceChoices", e) ?? ee(e);
  }
}
function mb(e, t, n) {
  const r = B(e, t);
  return r ? W(n, r) ?? ee(r) : null;
}
function fb(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function pb(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function gb(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Zt).join(" ");
}
function ta(e) {
  const t = nt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function wo(e) {
  const t = ta(e);
  return t ? W("op.elementChoices", t) ?? ee(t) : e ? ee(e) : null;
}
function hb(e) {
  return ta(e);
}
function W(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = ea()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const ko = "data-paranormal-toolkit-dice-toggle-enhanced";
function yb(e) {
  for (const t of Array.from(e.querySelectorAll(is)))
    Tl(t);
}
function bb(e) {
  const t = $l(e.target);
  if (!t) return;
  const n = na(t);
  n && (e.preventDefault(), Rl(n, t));
}
function Ab(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = $l(e.target);
  if (!t) return;
  const n = na(t);
  n && (e.preventDefault(), Rl(n, t));
}
function Tl(e) {
  const t = e.querySelector(Vt);
  if (!t) return;
  const n = e.querySelector(vr);
  if (n && n.getAttribute(ko) !== "true" && (n.setAttribute(ko, "true"), n.classList.add(Pr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Rl(e, t) {
  const n = e.querySelector(Vt);
  if (!n) return;
  const r = !e.classList.contains(Dr);
  _b(e, t, n, r);
}
function _b(e, t, n, r) {
  e.classList.toggle(Dr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function $l(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(vr);
  if (!t) return null;
  const n = na(t);
  return n ? (Tl(n), t.classList.contains(Pr) ? t : null) : null;
}
function na(e) {
  const t = e.closest(is);
  return t && t.querySelector(Vt) ? t : null;
}
const Eo = `${d}-workflow-dice-toggle-styles`;
function Tb() {
  if (document.getElementById(Eo)) return;
  const e = document.createElement("style");
  e.id = Eo, e.textContent = `
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
const Rb = [0, 100, 500, 1500, 3e3];
let Io = !1, bn = null;
function $b() {
  if (!Io) {
    Io = !0, Tb(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Qe($o(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Qe($o(t));
    }), Hooks.once("ready", () => {
      Qe(document), wb();
    }), document.addEventListener("click", bb), document.addEventListener("keydown", Ab);
    for (const e of Rb)
      globalThis.setTimeout(() => Qe(document), e);
  }
}
function wb() {
  bn || !document.body || (bn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Qe(n);
  }), bn.observe(document.body, { childList: !0, subtree: !0 }));
}
function Qe(e) {
  e && (rm(e), Vy(e), Cy(e), yb(e), Yd(e));
}
function kb() {
  $b();
}
const Eb = "data-paranormal-toolkit-action-section", Ib = "ritual-log", Cb = ".paranormal-toolkit-item-use-prompt__actions", Sb = ".paranormal-toolkit-item-use-prompt__actions-title", Lb = [0, 100, 500, 1500];
let Co = !1;
function Db() {
  if (Co) return;
  const e = (t, n) => {
    So(xb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), So(document), Co = !0;
}
function So(e) {
  for (const t of Lb)
    globalThis.setTimeout(() => vb(e), t);
}
function vb(e) {
  Pb(e), Nb(e);
}
function Pb(e) {
  for (const t of e.querySelectorAll(
    `[${Eb}="${Ib}"]`
  ))
    t.remove();
}
function Nb(e) {
  for (const t of e.querySelectorAll(Cb)) {
    if (Lo(t.querySelector(Sb)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Lo(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function xb(e) {
  if (e instanceof HTMLElement || Ob(e))
    return e;
  if (Mb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Ob(e) {
  return e instanceof HTMLElement;
}
function Mb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Lo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ze = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, wl = {
  PV: "system.attributes.hp"
}, ir = {
  PV: [Ze.PV, wl.PV],
  SAN: [Ze.SAN],
  PE: [Ze.PE],
  PD: [Ze.PD]
}, sr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Fb {
  getResource(t, n) {
    const r = Do(t, n);
    if (!r.ok)
      return g(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = Po(t, n, o, l, "valor atual");
    if (u) return g(u);
    const m = Po(t, n, s, c, "valor máximo");
    return m ? g(m) : A({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Do(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Do(e, t) {
  const n = Bb(e.type, t);
  if (n && vo(e, n))
    return A(n);
  const r = ir[t].find(
    (a) => vo(e, a)
  );
  return r ? A(r) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ub(e, t),
    path: ir[t].join(" | ")
  });
}
function Bb(e, t) {
  return e === "threat" ? wl[t] ?? null : e === "agent" ? Ze[t] : null;
}
function vo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Ub(e, t) {
  const n = e.type ?? "unknown", r = ir[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Po(e, t, n, r, a) {
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
class qb {
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
      const s = sr.ritualItem.circleCandidates;
      return g({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = Gb(a);
    return o ? A(o) : g({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of sr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Gb(e) {
  if (No(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (No(n))
      return n;
  }
  return null;
}
function No(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const jb = "dice-so-nice";
async function kl(e) {
  if (!zb() || !Vb()) return;
  const t = Hb();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function zb() {
  try {
    return Ld().enabled;
  } catch {
    return !1;
  }
}
function Vb() {
  return game.modules?.get?.(jb)?.active === !0;
}
function Hb() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const xo = "occultism";
class El {
  getDifficulty(t) {
    return Wb(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Yb(t, xo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await kl(r);
    const a = Xb(r);
    return {
      skill: xo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: Zb(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: Jb(r)
    };
  }
}
function Wb(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Kb(e) {
  return new El().rollCastingCheck(e);
}
async function Yb(e, t) {
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
  return Qb(r);
}
function Qb(e) {
  return Oo(e) ? e : Array.isArray(e) ? e.find(Oo) ?? null : null;
}
function Oo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Zb(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Xb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Jb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(eA);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function eA(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const tA = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class nA {
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
    const r = n.value, a = rA(t.ritual, r);
    return a.ok ? a.value ? A(a.value) : A({
      resource: "PE",
      amount: tA[r],
      source: "default-by-circle",
      circle: r
    }) : g(a.error);
  }
}
function rA(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : aA(n) ? {
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
function aA(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const An = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function oA(e) {
  if (!dA(e.item)) return null;
  const t = lr(e.actor) ? e.actor : iA(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: lA(e.token) ?? sA(t),
    targets: Ir(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function iA(e) {
  const t = e;
  return lr(t.actor) ? t.actor : lr(e.parent) ? e.parent : null;
}
function sA(e) {
  const t = cA(e) ?? uA(e);
  return t ? Il(t) : null;
}
function lA(e) {
  return cr(e) ? Il(e) : null;
}
function cA(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return cr(n) ? n : (t.getActiveTokens?.() ?? []).find(cr) ?? null;
}
function uA(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Il(e) {
  const t = e.actor ?? null;
  return {
    tokenId: _n(e.id),
    actorId: _n(t?.id),
    sceneId: _n(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function dA(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function lr(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function cr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function _n(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class mA {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(An.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${An.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = oA(fA(t));
    if (!n) {
      f.warn(`${An.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function fA(e) {
  return e && typeof e == "object" ? e : {};
}
class pA {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Tn("missing-item-patch");
    if (t.type !== "ritual") return Tn("unsupported-item-type");
    const a = gA(r);
    return Object.keys(a).length === 0 ? Tn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function gA(e) {
  const t = {};
  D(t, "name", e.name), D(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (D(t, "system.circle", n.circle), D(t, "system.element", n.element), D(t, "system.target", n.target), D(t, "system.targetQtd", n.targetQuantity), D(t, "system.execution", n.execution), D(t, "system.range", n.range), D(t, "system.duration", n.duration), D(t, "system.skillResis", n.resistanceSkill), D(t, "system.resistance", n.resistance), D(t, "system.studentForm", n.studentForm), D(t, "system.trueForm", n.trueForm)), t;
}
function D(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Tn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class hA {
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
    return this.getNumber(t, sr.ritual.dt, 0);
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
class yA {
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
class bA {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = AA(t);
    return n.ok ? this.presets.has(t.id) ? g({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Rn(t)), A(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const a = this.register(r);
      if (!a.ok)
        return a;
      n.push(a.value);
    }
    return A(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? Rn(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? A(n) : g({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Rn);
  }
  findForItem(t) {
    return this.list().map((n) => _A(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function AA(e) {
  return !$n(e.id) || !$n(e.version) || !$n(e.label) ? g({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? g({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : A(e);
}
function _A(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = TA(a, t);
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
function TA(e, t) {
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
      const n = Mo(t.name), r = e.names.map(Mo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = RA(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Mo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function RA(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Rn(e) {
  return structuredClone(e);
}
function $n(e) {
  return typeof e == "string" && e.length > 0;
}
function Dt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? g({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : A(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Xt(e.amountFrom);
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
    }) : A(a);
  }
  return g({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Xt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function $A(e, t, n) {
  if (!Fo(e.id) || !Fo(e.formula))
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
    await kl(a);
    const l = {
      ...n.rollRequests[e.id] ?? Cl(e, t),
      total: o,
      roll: a
    };
    return n.rolls[e.id] = l, A(l);
  } catch (r) {
    return g({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Cl(e, t) {
  const n = e.intent ?? wA(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function wA(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Fo(e) {
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
function kA(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = EA(t, n, r, a);
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
    const s = IA(t, n, r, a);
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
function EA(e, t, n, r) {
  const a = Xt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Sl(t.id, "damage", r, t.damageInstances.length),
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
function IA(e, t, n, r) {
  const a = Xt(e.amountFrom);
  return {
    id: Sl(t.id, "healing", r, t.healingInstances.length),
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
function Sl(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function CA(e, t, n) {
  const r = Xt(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function SA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Ll("before", e), Bo("before", e), Bo("resolve", e);
}
function LA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Ll("apply", e);
}
function DA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Ll(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = vA(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Bo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function vA(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function PA(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), A(void 0);
  } catch (r) {
    return g({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function NA(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return xA(e, t);
    case "spendRitualCost":
      return OA(e, t);
  }
}
async function xA(e, t) {
  const { context: n, resources: r } = e, a = Dt(t, n);
  return a.ok ? Dl(await r.spend(n.sourceActor, t.resource, a.value), n) : g(a.error);
}
async function OA(e, t) {
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
  }), Dl(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Dl(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), A(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function MA(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = FA(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function FA(e) {
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
class BA {
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
    return A({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return MA({
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
    const a = await NA({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Cl(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), A(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await $A(t, r, n);
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Dt(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = CA(t, n, a.value);
    SA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), LA({
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
      kA({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return DA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), A(void 0);
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
    return A(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await PA(this.messages, t, n);
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, a) {
    return t.ok ? (n.resourceTransactions.push(t.value), A(t.value)) : g({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: a,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, a, o, s) {
    const l = UA(t, n.intent);
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
function UA(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class qA {
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
class GA {
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
    return A({
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
        }) : A({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const a = Math.max(0, n.value - r);
        return A({
          afterValue: a,
          appliedAmount: n.value - a
        });
      }
      case "heal":
      case "recover": {
        const a = Math.min(n.max, n.value + r);
        return A({
          afterValue: a,
          appliedAmount: a - n.value
        });
      }
    }
  }
}
class jA {
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
function vl(e) {
  return {
    id: zA(),
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
function zA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class VA {
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
    return de(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = vl(n);
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
class HA {
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
class WA {
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
    const n = On();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: KA(),
      flags: {
        ...t.flags,
        [d]: {
          ...YA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = On();
    if (!r.enabled)
      return;
    const a = n.notification ?? Uo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Uo(n);
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
function Uo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function KA() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function YA(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const QA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Pl = `${d}-inline-roll-neutralized`, ZA = `${d}-inline-roll-notice`, ra = `data-${d}-inline-roll-neutralized`, qo = `data-${d}-inline-roll-notice`, XA = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Go(e) {
  const t = m_(e.message), n = await JA(e.message), r = e_(t);
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
async function JA(e) {
  const t = c_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = t_(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await u_(t, n.content), replacementCount: n.replacementCount };
}
function e_(e) {
  const t = e ? d_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Nl(t);
  return n > 0 && xl(i_(t)), { replacementCount: n };
}
function t_(e) {
  const t = n_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Nl(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (xl(n.content), { content: n.innerHTML, replacementCount: a });
}
function n_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, a_(a.trim()))), replacementCount: t };
}
function Nl(e) {
  const t = r_(e);
  for (const n of t)
    n.replaceWith(o_(s_(n)));
  return t.length;
}
function r_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(QA))
    n.getAttribute(ra) !== "true" && t.add(n);
  return Array.from(t);
}
function a_(e) {
  return `<span class="${Pl}" ${ra}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${f_(e)}</span>`;
}
function o_(e) {
  const t = document.createElement("span");
  return t.classList.add(Pl), t.setAttribute(ra, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function xl(e) {
  if (e.querySelector?.(`[${qo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(ZA), t.setAttribute(qo, "true"), t.textContent = XA, e.append(t);
}
function i_(e) {
  return e.querySelector(".message-content") ?? e;
}
function s_(e) {
  const n = e.getAttribute("data-formula") ?? l_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function l_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function c_(e) {
  return e && typeof e == "object" ? e : null;
}
async function u_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function d_(e) {
  const t = p_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function m_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function f_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function p_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Pt = "ritualRollConfig", Le = "ritual-roll";
function Jt() {
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
function Ol(e) {
  const t = e.getFlag(d, Pt);
  return ur(t);
}
function Ml(e) {
  return Ol(e) ?? Jt();
}
async function g_(e, t) {
  const n = ur(t) ?? ur({
    ...Jt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Pt, n), n;
}
async function h_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Pt));
    return;
  }
  await e.setFlag(d, Pt, null);
}
function ur(e) {
  if (!en(e)) return null;
  const t = w_(e.intent);
  if (!t) return null;
  const n = Jt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Nt(e.damageType),
    utilityLabel: Nt(e.utilityLabel) ?? n.utilityLabel,
    note: aa(e.note),
    forms: k_(e.forms)
  };
}
function y_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function b_(e) {
  const t = Ol(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = A_(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...__(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: R_(e, t),
    resistance: t.intent === "damage" ? Fl(e) : void 0
  };
}
function A_(e, t) {
  const n = {
    type: "rollFormula",
    id: Le,
    formula: t,
    intent: $_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function __(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Le}.total`,
          ...T_(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Le}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function T_(e) {
  return e ? { damageType: e } : {};
}
function R_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Le]: n
      }
    }
  };
  return jo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Le]: t.forms.discente.formula.trim()
    }
  }), jo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Fl(e) {
  const t = Bl(e), n = Nt(t.skillResis), r = Nt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = E_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function $_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function w_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function k_(e) {
  const t = Jt();
  return en(e) ? {
    base: wn(e.base),
    discente: wn(e.discente),
    verdadeiro: wn(e.verdadeiro)
  } : t.forms;
}
function wn(e) {
  return en(e) ? { formula: aa(e.formula) } : { formula: "" };
}
function jo(e, t) {
  const n = Bl(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return I_(r);
}
function Bl(e) {
  const t = e.system;
  return en(t) ? t : {};
}
function E_(e) {
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
function I_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function aa(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Nt(e) {
  const t = aa(e);
  return t.length > 0 ? t : null;
}
function en(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function C_(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function S_(e) {
  switch (L_(e)) {
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
      return D_(String(e ?? ""));
  }
}
function L_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function D_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function v_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function P_(e) {
  return {
    ...oa(e),
    type: "ritual.cast.started"
  };
}
function N_(e) {
  return {
    ...oa(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function x_(e) {
  return {
    ...oa(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function O_(e) {
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
function M_(e, t = {}) {
  const n = X_(e), r = [
    ...eT(t.candidates ?? []),
    ...tT(e)
  ], a = rT(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = J_(t) ?? aT(r) ?? iT(a), s = lT(canvas?.grid?.size), l = F_(o, a, r), c = H_(r), u = V_(l);
  return {
    type: "rectangleRay",
    sceneId: sT(e, n),
    regionId: Qo(n?.id) ?? Qo(e.id),
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
function F_(e, t, n) {
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
    direction: B_(r, t, n)
  };
}
function B_(e, t, n) {
  const r = U_(n);
  return r !== null ? r : G_(e, t) ?? e.direction;
}
function U_(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = zo(n, t);
    if (r !== null) return r;
    const a = tn(n), o = zo(a, t);
    if (o !== null) return o;
  }
  return null;
}
function zo(e, t) {
  for (const n of t) {
    const r = q_(N(e, n));
    if (r !== null) return r;
  }
  return null;
}
function q_(e) {
  const t = rt(e);
  if (t === null) return null;
  const n = sa(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function G_(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Ho(Vo(e, e.direction), t), r = j_(e, t);
  if (r === null) return null;
  const o = z_([
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
    error: Ho(Vo(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? sa(o.direction) : null;
}
function j_(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Zo(o, 0, 1), c = Zo(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : cT(Math.atan2(c, l));
}
function Vo(e, t) {
  const n = ql(t), r = {
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
function Ho(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function z_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = sa(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function V_(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = ql(e.direction), n = {
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
function H_(e) {
  for (const t of e) {
    const n = Wo(t, "ray.start"), r = Wo(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Wo(e, t) {
  const n = N(e, t), r = rt(N(n, "x")), a = rt(N(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function oa(e) {
  const t = O_(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: Y_(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: W_(e.context.item, e.form, e.formLabel, t),
    targets: n.map(Q_),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function W_(e, t, n, r) {
  return {
    name: e.name,
    slug: kn(e, "system.slug") ?? kn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: kn(e, "system.element"),
    circle: Z_(e),
    form: K_(t),
    formLabel: n
  };
}
function K_(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function Y_(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function Q_(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function Z_(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : me(t);
}
function kn(e, t) {
  return me(foundry.utils.getProperty(e, t));
}
function me(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function X_(e) {
  return "document" in e && e.document ? e.document : e;
}
function J_(e) {
  return Ul(e.shape);
}
function eT(e) {
  return e.filter(ia);
}
function tT(e) {
  return [
    e,
    nT(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(ia);
}
function nT(e) {
  return "object" in e && ia(e.object) ? e.object : null;
}
function ia(e) {
  return !!(e && typeof e == "object");
}
function rT(e) {
  for (const t of e) {
    const n = Ko(N(tn(t), "bounds"));
    if (n) return n;
    const r = Ko(N(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function Ko(e) {
  const t = E(e, "x"), n = E(e, "y"), r = E(e, "width"), a = E(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function E(e, t) {
  return rt(N(e, t));
}
function aT(e) {
  for (const t of e) {
    const n = oT(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function oT(e) {
  if (!e || typeof e != "object") return [];
  const t = Yo(tn(e));
  return t.length > 0 ? t : Yo(e);
}
function Yo(e) {
  const t = N(e, "shapes");
  return Array.isArray(t) ? t.map(Ul).filter((n) => n !== null) : [];
}
function Ul(e) {
  const t = tn(e) ?? e, n = N(t, "type");
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
function iT(e) {
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
function sT(e, t) {
  return En(e, "parent.id") ?? En(e, "document.parent.id") ?? En(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function En(e, t) {
  return me(N(e, t));
}
function N(e, t) {
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
function tn(e) {
  if (!e || typeof e != "object") return null;
  const t = N(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function Qo(e) {
  return me(e);
}
function rt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function lT(e) {
  const t = rt(e);
  return t !== null && t > 0 ? t : null;
}
function ql(e) {
  return e * Math.PI / 180;
}
function cT(e) {
  return e * 180 / Math.PI;
}
function sa(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Zo(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class uT {
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
class nn {
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
const dT = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class mT {
  constructor(t = new nn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = fT(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(dT);
  }
}
function fT(e, t) {
  const n = [], r = pT(e), a = Xo(r), o = Xo(e);
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
function pT(e) {
  return gT(e) ? e.document ?? null : e;
}
function gT(e) {
  return "bounds" in e;
}
function Xo(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const hT = 100, yT = 12;
class bT {
  constructor(t = new nn()) {
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
      const a = this.foundryAdapter.getGridSize() ?? hT, o = $T(n), s = await this.foundryAdapter.placeRegion(
        AT(t, this.foundryAdapter.getUserColor(), a),
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
        message: RT(a)
      };
    }
  }
}
function AT(e, t, n) {
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
    shapes: [_T(e, n)]
  };
}
function _T(e, t) {
  const n = TT(e, t);
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
function TT(e, t) {
  return {
    length: Jo(e.length, yT, t),
    width: Jo(e.width, 1, t)
  };
}
function Jo(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function RT(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function $T(e) {
  const t = (n) => {
    const r = wT(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function wT(e) {
  return kT(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function kT(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class ET {
  constructor(t = new nn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(ei(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(ei(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = IT(t);
    CT(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function ei(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function IT(e) {
  return Array.from(new Set(e));
}
function CT(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class ST {
  constructor(t = new nn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Vi)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(LT(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(DT(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: dr(r.region)
    }));
    for (const r of t) {
      if (!dr(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = PT(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function LT(e) {
  return [
    { source: "document", region: ue(e.document) },
    { source: "document.object", region: ue(e.document.object) },
    { source: "preview", region: ue(e.preview) },
    { source: "preview.document.object", region: ue(e.preview?.document?.object) }
  ];
}
function DT(e) {
  return [
    { source: "input", region: ue(e) },
    { source: "input.object", region: vT(e) ? ue(e.object) : null },
    { source: "input.document.object", region: Gl(e) ? ue(e.document?.object) : null }
  ];
}
function ue(e) {
  return dr(e) ? e : null;
}
function dr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return At(n.x) && At(n.y) && At(n.width) && At(n.height);
}
function Gl(e) {
  return "document" in e && "bounds" in e;
}
function vT(e) {
  return !Gl(e);
}
function PT(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function At(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const NT = "Nenhum alvo encontrado na linha.";
class xT {
  constructor(t = new bT(), n = new ST(), r = new mT(), a = new ET(), o = new uT()) {
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
        const l = this.regionTargetResolver.resolveTargets(s.region), c = MT(r), u = M_(s.region, {
          candidates: [c?.preview, c?.document],
          shape: c?.shape
        });
        return l.targets.length === 0 ? (o(), this.foundryAdapter.warn(NT), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(l.tokens), {
          status: "confirmed",
          targets: l.targets,
          areaSnapshot: u
        });
      } catch (l) {
        o();
        const c = OT(l);
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
function OT(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function MT(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function FT(e) {
  return {
    header: {
      eyebrow: vi,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: HT(e.ritual)
    },
    forms: e.variantOptions.map((t) => BT(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: GT(e.targetNames, e.variantOptions, e.ritual),
    automation: VT(e.automationStatus ?? "assisted")
  };
}
function BT(e, t) {
  const n = UT(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? qT(t) : "—",
    details: n
  };
}
function UT(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function qT(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function GT(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => jT(a, n))
  };
}
function jT(e, t) {
  const n = e.targeting ?? zT(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function zT(e, t) {
  const n = it(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function VT(e) {
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
function HT(e) {
  const t = e.system, n = [KT(t?.element), WT(t?.circle)].filter(ZT);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function WT(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function KT(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (YT(e)) {
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
      return QT(e);
  }
}
function YT(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function QT(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function ZT(e) {
  return typeof e == "string" && e.length > 0;
}
const jl = ["base", "discente", "verdadeiro"];
function la(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function xt(e) {
  return typeof e == "string" && jl.includes(e);
}
const { ApplicationV2: XT } = foundry.applications.api;
class Je extends XT {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = FT(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    tR(a, (o) => {
      this.selectedVariant = o, mr(a, o);
    }), mr(a, this.selectedVariant), nR(a, (o) => {
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
          ${this.model.forms.map(JT).join("")}
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
          ${this.model.targets.forms.map(eR).join("")}
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
    const n = iR(t), r = rR(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function JT(e) {
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
function eR(e) {
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
function tR(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => ti(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), ti(e, a, t));
    });
  const r = zl(e);
  r && t(r);
}
function ti(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !xt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), zl(e), mr(e, r.value));
}
function zl(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && xt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function mr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function nR(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function rR(e, t, n) {
  const r = oR(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = aR(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function aR(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function oR(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (xt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return xt(n) ? n : null;
}
function iR(e) {
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
async function sR(e) {
  return Je.request(e);
}
const ca = {
  label: "Padrão"
}, lR = {
  label: "Discente",
  extraCost: 2
}, cR = {
  label: "Verdadeiro",
  extraCost: 5
};
class uR {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new xT();
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
    const a = this.resolveCostPreview(t), o = n$(n), s = JR(
      n,
      t.item,
      a,
      o
    ), l = await sR({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: a,
      defaultSpendResource: l$(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = dR(l), u = a$(
      n,
      t.item,
      c.variant,
      o
    ), m = v_(), y = u.label ?? la(c.variant), R = (I = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: y,
      targets: I
    }), b = (I, C = t.targets, Te = {}) => {
      this.ritualEvents.emitCastFinished(
        x_({
          ...R(C),
          status: I,
          ...Te
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      P_(R())
    );
    const p = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (p.status === "cancelled")
      return b("cancelled", t.targets, { reason: p.reason }), { status: "cancelled" };
    if (p.status === "failed")
      return b("failed", t.targets, {
        reason: p.reason,
        message: p.message
      }), {
        status: "failed",
        reason: p.reason,
        message: p.message
      };
    const T = mR(
      t,
      p.targets
    );
    p.areaSnapshot && this.ritualEvents.emitAreaResolved(
      N_({
        ...R(p.targets),
        area: p.areaSnapshot
      })
    );
    const Ae = Zi();
    let Q = null;
    if (Ae) {
      const I = await pR(
        this.resources,
        T.actor,
        c,
        u,
        a
      );
      if (!I.ok)
        return b("failed", T.targets, {
          reason: I.reason,
          message: I.message
        }), {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      try {
        const C = await Kb(
          T.actor
        );
        Q = hR(
          C,
          u,
          a
        );
      } catch (C) {
        const Te = C instanceof Error ? C.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return b("failed", T.targets, {
          reason: "ritual-casting-check-failed",
          message: Te
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: Te,
          cause: C
        };
      }
    }
    const _e = fR(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !Ae
      }
    );
    if (_e.steps.length === 0) {
      const I = r$(
        T,
        c
      ), C = ri(
        n,
        T
      ), Te = ni(
        T.actor,
        Q,
        u,
        a
      ), $a = ai(
        n,
        c,
        u,
        a,
        I,
        T,
        Q
      );
      if (!C.ok)
        return b("failed", T.targets, {
          reason: C.reason,
          message: C.message
        }), {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      const wa = [
        ...Te,
        ...C.actions
      ];
      return wa.length > 0 ? (b("ready", T.targets), {
        status: "ready",
        workflowContext: I,
        itemUseContext: T,
        actions: wa,
        summaryLines: $a
      }) : (b("completed-without-actions", T.targets), {
        status: "completed-without-actions",
        workflowContext: I,
        itemUseContext: T,
        summaryLines: $a
      });
    }
    const O = await this.workflow.runAutomation(_e, {
      sourceActor: T.actor,
      sourceToken: T.token,
      item: T.item,
      targets: T.targets,
      flags: {
        itemUse: {
          source: T.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: c.variant,
          spendResource: c.spendResource
        }
      }
    });
    if (!O.ok)
      return b("failed", T.targets, {
        reason: O.error.reason,
        message: O.error.message
      }), {
        status: "failed",
        reason: O.error.reason,
        message: O.error.message,
        cause: O.error
      };
    const ne = O.value.context, G = RR(
      n,
      T,
      ne
    ), M = ri(
      n,
      T
    ), cn = ni(
      T.actor,
      Q,
      u,
      a
    ), Ta = ai(
      n,
      c,
      u,
      a,
      ne,
      T,
      Q
    );
    if (!G.ok)
      return b("failed", T.targets, {
        reason: G.reason,
        message: G.message
      }), {
        status: "failed",
        reason: G.reason,
        message: G.message
      };
    if (!M.ok)
      return b("failed", T.targets, {
        reason: M.reason,
        message: M.message
      }), {
        status: "failed",
        reason: M.reason,
        message: M.message
      };
    const Ra = [
      ...cn,
      ...G.actions,
      ...M.actions
    ];
    return Ra.length === 0 ? (b("completed-without-actions", T.targets), {
      status: "completed-without-actions",
      workflowContext: ne,
      itemUseContext: T,
      summaryLines: Ta
    }) : (b("ready", T.targets), {
      status: "ready",
      workflowContext: ne,
      itemUseContext: T,
      actions: Ra,
      summaryLines: Ta
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
function dR(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function mR(e, t) {
  return {
    ...e,
    targets: t
  };
}
function fR(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || da(l) && (!a.includeCostSteps || !s) || o.push(gR(l, n));
  return a.includeCostSteps && s && r && c$(n.extraCost) && o.push({
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
async function pR(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = qe(a, r);
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
function gR(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function hR(e, t, n) {
  const a = yR(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function yR(e, t) {
  const n = qe(e, t);
  return n ? C_(n.amount) : null;
}
function ni(e, t, n, r) {
  if (!t || t.success) return [];
  const a = qe(r, n);
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
function ri(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = ua(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = ms(o);
      n.push(
        bR(
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
function bR(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? TR(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: AR(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: _R(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function AR(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function _R(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function TR(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function RR(e, t, n) {
  const r = [], a = /* @__PURE__ */ new Map();
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const s = Dt(o, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = ua(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if ($R(o)) {
        wR(
          a,
          c,
          kR(o, n, s.value)
        );
        continue;
      }
      r.push(IR(o, c, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...ER(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function $R(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function wR(e, t, n) {
  const r = DR(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function kR(e, t, n) {
  const r = vR(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function ER(e, t, n, r) {
  const a = OR(e), o = a.length > 1 ? BR() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const y = MR(u.amount, s);
        return {
          id: CR(u, s, m),
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
      label: SR(c, s, a.length > 1),
      executedLabel: LR(
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
function IR(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = xR(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: PR(e, r, n),
    executedLabel: NR(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function CR(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function SR(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function LR(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function DR(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function vR(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function PR(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function NR(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function xR(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function OR(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function MR(e, t) {
  const n = e * t.multiplier, r = FR(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function FR(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function BR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ua(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function ai(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${la(t.variant)}`,
    jR(t, n, r),
    ...GR(s),
    ...Object.values(a.rolls).flatMap(zR),
    ...UR(e, o),
    ...VR(e.resistance),
    ...ZR(n)
  ];
}
function UR(e, t) {
  return qR(e) ? ua("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function qR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function GR(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function jR(e, t, n) {
  const r = qe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function zR(e) {
  const n = [`${XR(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = HR(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${S_(e.damageType)}`), n;
}
function VR(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function HR(e) {
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
    const s = WR(o);
    s && (QR(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function WR(e) {
  const t = KR(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : YR(e);
}
function KR(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function YR(e) {
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
function QR(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function ZR(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function XR(e) {
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
function JR(e, t, n, r) {
  return jl.map((a) => {
    const o = Vl(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? la(a),
      enabled: s,
      details: o ? e$(o, n, r) : [],
      finalCostText: o ? t$(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function e$(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  a.length > 0 ? r.push(a.join(", ")) : n && r.push("efeito manual");
  const o = qe(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function qe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function t$(e, t) {
  const n = qe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function n$(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(da);
}
function r$(e, t) {
  return vl({
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
function a$(e, t, n, r) {
  return Vl(e, t, n, r) ?? ca;
}
function Vl(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? i$(t, n) ? o$(n) : null : n === "base" ? ca : null);
}
function o$(e) {
  switch (e) {
    case "base":
      return ca;
    case "discente":
      return lR;
    case "verdadeiro":
      return cR;
  }
}
function i$(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return s$(foundry.utils.getProperty(e, n));
}
function s$(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function l$(e) {
  return e.steps.some(da);
}
function da(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function c$(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Hl = "itemUsePrompts", Wl = "chatCard", rn = "data-paranormal-toolkit-prompt-id", an = "data-paranormal-toolkit-pending-id", ma = "data-paranormal-toolkit-executed-label", fr = "data-paranormal-toolkit-choice-group", Kl = "data-paranormal-toolkit-skipped-label", Ot = "data-paranormal-toolkit-action-section", oi = "data-paranormal-toolkit-detail-key", ii = "data-paranormal-toolkit-roll-card", fa = "data-paranormal-toolkit-roll-detail-toggle", Yl = "data-paranormal-toolkit-roll-detail-id", Ql = "data-paranormal-toolkit-resistance-roll-button", Zl = "data-paranormal-toolkit-resistance-skill", Xl = "data-paranormal-toolkit-resistance-skill-label", Jl = "data-paranormal-toolkit-resistance-target-actor-id", ec = "data-paranormal-toolkit-resistance-target-name", tc = "data-paranormal-toolkit-resistance-roll-result", si = "data-paranormal-toolkit-system-card-replaced", u$ = `[${an}]`, d$ = `[${fa}]`, m$ = `[${Ql}]`, pr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, f$ = `${h}__actions`, li = `${h}__details`, nc = `${h}__summary`, p$ = `${h}__title`, rc = `${h}__button--executed`, ci = `${h}__roll-card`;
let di = !1, gr = null;
const q = /* @__PURE__ */ new Map(), g$ = [0, 100, 500, 1500, 3e3], h$ = 3e4, y$ = [0, 100, 500, 1500, 3e3];
function b$(e) {
  if (gr = e, di) {
    fi(e);
    return;
  }
  const t = (n, r) => {
    oc(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), di = !0, fi(e);
}
async function mi(e) {
  const t = ac(e);
  q.set(e.pendingId, t), await ha(t) || yc(t), ic(e.pendingId);
}
async function A$(e) {
  const t = ac({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", q.set(e.pendingId, t), await ha(t) || yc(t), ic(e.pendingId);
}
async function In(e, t) {
  const n = q.get(e);
  q.delete(e), n && await Aw(n, t);
}
function pa(e) {
  const t = $c();
  for (const n of t) {
    const r = Y(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function _$(e, t) {
  const n = pa(e);
  if (!n) return;
  const r = Y(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Ge(n.message, r));
}
async function T$(e, t, n) {
  if (!t) return;
  const r = pa(e);
  if (!r) return;
  const a = Y(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Ge(r.message, a);
}
function ac(e) {
  const t = te(e.context.message), n = e.context.targets.find((s) => Ar(s)), r = n ? Ar(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: K$(e.context),
    executed: !1
  };
}
function oc(e, t, n) {
  bw();
  const r = sn(t);
  if (!r) return;
  const a = gw(e, r);
  a.length > 0 && Mt(r);
  for (const o of a)
    hr(r, o);
  dc(r, n), yr(r), br(r);
}
function fi(e) {
  for (const t of y$)
    globalThis.setTimeout(() => {
      R$(e);
    }, t);
}
function R$(e) {
  for (const t of $$()) {
    const n = on(t);
    w$(n) && oc(n, t, e);
  }
}
function $$() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function w$(e) {
  return e ? ya(e) ? !0 : Tw(e).length > 0 : !1;
}
function ic(e) {
  const t = q.get(e);
  if (!t) return;
  const n = t.messageId ? hw(t.messageId) : null;
  if (n) {
    bi(n, t), Mt(n), hr(n, t), pi(n), yr(n), br(n);
    return;
  }
  if (t.messageId) {
    Tr(t);
    return;
  }
  const r = yw(t);
  if (r) {
    bi(r, t), Mt(r), hr(r, t), pi(r), yr(r), br(r);
    return;
  }
  Tr(t);
}
function pi(e) {
  gr && dc(e, gr);
}
function Mt(e) {
  const t = k$();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = uc(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(si) === "true") return;
  const r = n.querySelector(`.${pr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(si, "true");
}
function k$() {
  try {
    return Qu() === "replace";
  } catch {
    return !1;
  }
}
function hr(e, t) {
  if (Mt(e), e.querySelector(`[${rn}="${je(t.pendingId)}"]`)) return;
  const n = I$(e, t);
  S$(n, t);
  const r = z$(t);
  if (E$(r)) return;
  j$(n, r).append(W$(t));
}
function E$(e) {
  return lc(e.id) && !pe();
}
function sc(e) {
  const n = e.closest(`[${Ot}]`)?.getAttribute(Ot) ?? null;
  return lc(n) && !pe();
}
function lc(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function I$(e, t) {
  const n = e.querySelector(`.${pr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(pr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(p$), s.textContent = C$(t);
  const l = document.createElement("span");
  return l.classList.add(nc), l.textContent = t.summary, a.append(o, s, l), r.append(a), Q$(e).append(r), r;
}
function C$(e) {
  const t = v(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function S$(e, t) {
  const n = t.summaryLines ?? [], r = gc(n, t);
  if (r) {
    L$(e, r, t);
    return;
  }
  V$(e, n);
}
function L$(e, t, n) {
  if (e.querySelector(`[${ii}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(ci, `${ci}--${t.intent}`), r.setAttribute(ii, "true"), t.castingCheck && gi(r, v$(t.castingCheck), n.pendingId, "casting"), D$(t) && gi(r, P$(t), n.pendingId, "effect"), F$(r, t), B$(r, t, n), G$(r, t), e.append(r);
}
function D$(e) {
  return e.intent !== "casting";
}
function v$(e) {
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
function P$(e) {
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
function gi(e, t, n, r) {
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
  N$(a, t), q$(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function N$(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = x$(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function x$(e, t) {
  const n = O$(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of M$(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function O$(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function M$(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? hi(e, "highest") : n.includes("kl") ? hi(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function hi(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function F$(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Bw);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function B$(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = U$(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(cc(t.resistanceRollResult)), e.append(r);
}
function U$(e, t) {
  if (!e.resistanceSkill || !ye()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(rn, t.pendingId), n.setAttribute(Ql, "true"), n.setAttribute(Zl, e.resistanceSkill), n.setAttribute(Xl, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Jl, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ec, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(tc, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function cc(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = fc(e), t;
}
function q$(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(fa, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Yl, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const y = document.createElement("dd");
    y.textContent = u.value, c.append(m, y);
  }
  e.append(l, c);
}
function G$(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function j$(e, t) {
  const n = `[${Ot}="${je(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(f$), a.setAttribute(Ot, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function z$(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = gc(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function V$(e, t) {
  if (t.length === 0) return;
  const n = H$(e);
  for (const r of t) {
    const a = Uw(r);
    if (n.querySelector(`[${oi}="${je(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(oi, a), n.append(o);
  }
}
function H$(e) {
  const t = e.querySelector(`.${li}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(li), e.append(n), n;
}
function W$(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(rn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(rc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(an, e.pendingId), t.setAttribute(ma, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(fr, e.choiceGroupId), t.setAttribute(Kl, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function K$(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Y$(e);
  return `${t} → ${n}`;
}
function Y$(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Q$(e) {
  return uc(e) ?? e;
}
function uc(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function dc(e, t) {
  const n = sn(e);
  if (!n) return;
  const r = n.querySelectorAll(u$);
  for (const a of r) {
    if (sc(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      uw(a, t);
    }));
  }
}
function yr(e) {
  const t = sn(e);
  if (!t) return;
  const n = t.querySelectorAll(d$);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Z$(t, r);
    }));
}
function br(e) {
  const t = sn(e);
  if (!t) return;
  const n = t.querySelectorAll(m$);
  for (const r of n) {
    if (!ye()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      X$(t, r);
    }));
  }
}
function Z$(e, t) {
  const n = t.getAttribute(fa);
  if (!n) return;
  const r = e.querySelector(`[${Yl}="${je(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function X$(e, t) {
  if (!ye()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(rn), r = t.getAttribute(Zl), a = t.getAttribute(Xl) ?? (r ? fe(r) : "Resistência");
  if (!n || !r) return;
  const o = tw(e, n), s = nw(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await fm(s, r);
    await sw(c.roll);
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
    J$(t, u), ew(t, u), lw(n, u), await cw(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function J$(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(tc, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function ew(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? cc(t);
  if (r) {
    r.textContent = fc(t);
    return;
  }
  n.append(a);
}
function tw(e, t) {
  const n = q.get(t);
  if (n) return n;
  const r = on(e);
  return Y(r)[t] ?? null;
}
function nw(e, t) {
  const n = e?.resistanceTargetActor;
  if (H(n)) return n;
  const a = e?.context?.targets.map(Ar).find(H) ?? null;
  if (a) return a;
  const o = t.getAttribute(Jl) ?? e?.resistanceTargetActorId ?? null, s = o ? aw(o) : null;
  return s || ow(
    t.getAttribute(ec) ?? e?.resistanceTargetName ?? rw(t)
  );
}
function rw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${nc}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Ar(e) {
  const t = e.actor;
  if (H(t)) return t;
  const n = e.token, r = at(n);
  if (r) return r;
  const a = e.document;
  return at(a);
}
function at(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (H(t)) return t;
  const n = e.document?.actor;
  return H(n) ? n : null;
}
function aw(e) {
  const n = game.actors?.get?.(e);
  return H(n) ? n : mc().map((o) => at(o)).find((o) => o?.id === e) ?? null;
}
function ow(e) {
  const t = De(e);
  if (!t) return null;
  const n = mc().filter((o) => De(iw(o)) === t).map((o) => at(o)).find(H) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => H(o) && De(o.name) === t);
  return H(a) ? a : null;
}
function mc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function iw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : at(e)?.name ?? null;
}
function De(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function H(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function fc(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function sw(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function lw(e, t) {
  const n = q.get(e);
  n && (n.resistanceRollResult = t);
}
async function cw(e, t, n) {
  const r = on(e);
  if (r)
    try {
      const a = Y(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Ge(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function on(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return K(r?.get?.(n));
}
async function uw(e, t) {
  if (sc(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(an);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    pc(e, e.getAttribute(ma) ?? "✓ Automação aplicada"), dw(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function pc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(rc), e.removeAttribute(an), e.removeAttribute(ma);
}
function dw(e) {
  const t = e.getAttribute(fr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${fr}="${je(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Kl) ?? "✓ Outra opção escolhida";
    pc(a, o);
  }
}
function gc(e, t) {
  const n = e.map(ga).filter(Mw), r = n.find((p) => p.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = v(e, "Forma"), o = v(e, "Custo"), s = v(e, "Dados") ?? v(e, `Dados (${r.label})`), l = v(e, "Tipo"), c = v(e, "Resistência"), u = v(e, "Resistência Perícia"), m = v(e, "Resistência Rótulo") ?? (u ? fe(u) : null), y = hc(e, "Observação"), R = e.filter((p) => pw(p, r)), b = mw(e);
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
    castingCheck: b,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function mw(e) {
  const t = e.map(ga).find((o) => o?.intent === "casting") ?? null, n = v(e, "Conjuração DT"), r = v(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: v(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: v(e, "Dados (Conjuração)")
  } : null;
}
function ga(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: fw(n)
  } : null;
}
function fw(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function v(e, t) {
  return hc(e, t)[0] ?? null;
}
function hc(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function pw(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || ga(e) ? !1 : e.trim().length > 0;
}
function gw(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of q.values())
    _r(r, e, t) && n.set(r.pendingId, r);
  for (const r of _w(e))
    _r(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function _r(e, t, n) {
  const r = te(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !yi(n, "itemId", e.itemId) ? !1 : !e.actorId || yi(n, "actorId", e.actorId);
}
function yi(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${qw(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function hw(e) {
  const t = je(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function yw(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (_r(e, null, t))
      return t;
  return null;
}
function bw() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of q.entries())
    e - r.createdAt > t && q.delete(n);
}
async function bi(e, t) {
  const n = on(e);
  if (!n) return !1;
  try {
    const r = Y(n);
    return r[t.pendingId] = ba(t, te(n)), await Ge(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function ha(e) {
  const t = _c(e);
  if (!t) return !1;
  try {
    const n = Y(t);
    return n[e.pendingId] = ba(e, te(t)), await Ge(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function yc(e) {
  for (const t of g$)
    globalThis.setTimeout(() => {
      Tr(e);
    }, t);
}
async function Tr(e) {
  const t = _c(e);
  if (ya(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await ha(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Aw(e, t) {
  const n = Ac(e.context.message);
  if (n)
    try {
      const r = Y(n), a = r[e.pendingId] ?? ba(e, te(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Ge(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function _w(e) {
  return Object.values(Y(K(e))).filter(ut);
}
function Y(e) {
  if (!e) return {};
  const t = {}, n = ya(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(bc(e)))
    t[r] ??= a;
  return t;
}
function Tw(e) {
  return Object.values(bc(K(e))).filter(ut);
}
function bc(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Hl);
  if (!Oe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    ut(a) && (n[r] = a);
  return n;
}
async function Ge(e, t) {
  typeof e.setFlag == "function" && (await $w(e, t), await Rw(e, t));
}
async function Rw(e, t) {
  await Promise.resolve(e.setFlag?.(d, Hl, t));
}
function ya(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Wl);
  return xw(t) ? t : null;
}
async function $w(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(ut).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? te(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: ww(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Wl, a));
}
function ww(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function ba(e, t) {
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
function Ac(e) {
  const t = K(e);
  if (t?.setFlag)
    return t;
  const n = kw(e);
  if (n?.setFlag)
    return n;
  const r = te(e);
  if (!r) return null;
  const a = game.messages;
  return K(a?.get?.(r));
}
function kw(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(K).find((n) => typeof n?.setFlag == "function") ?? null;
}
function _c(e) {
  const t = Ac(e.context.message);
  if (t) return t;
  const n = e.messageId ? Ew(e.messageId) : null;
  if (n) return n;
  const r = $c().slice().reverse();
  return r.find((a) => Iw(a, e)) ?? r.find((a) => Cw(a, e)) ?? null;
}
function Ew(e) {
  const t = game.messages;
  return K(t?.get?.(e));
}
function Iw(e, t) {
  const n = te(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Tc(e, t)) return !1;
  const a = Rc(e);
  return !t.actorId || !a || a === t.actorId;
}
function Cw(e, t) {
  if (!Lw(e, t)) return !1;
  const n = Rc(e);
  return t.actorId && n === t.actorId ? !0 : Tc(e, t);
}
function Tc(e, t) {
  const n = De(Sw(e));
  if (!n) return !1;
  const r = De(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = De(t.itemId);
  return !!(a && n.includes(a));
}
function Sw(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Rc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Lw(e, t) {
  const n = Dw(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= h$;
}
function Dw(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function K(e) {
  return e && typeof e == "object" ? e : null;
}
function ut(e) {
  return Oe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && se(e.resistanceTargetActorId) && se(e.resistanceTargetName) && Ow(e.resistanceRollResult) && vw(e.actionPayload) && Cn(e.title) && Cn(e.buttonLabel) && Cn(e.executedLabel) && se(e.choiceGroupId) && se(e.skippedLabel) && se(e.actionSectionId) && se(e.actionSectionTitle) && Fw(e.summaryLines) : !1;
}
function vw(e) {
  return e == null ? !0 : Oe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && Pw(e.resource) && Nw(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Pw(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Nw(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function xw(e) {
  return Oe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && Oe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ut) : !1;
}
function Ow(e) {
  return e == null ? !0 : Oe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && se(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Mw(e) {
  return e !== null;
}
function Oe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function P(e) {
  return e === null || typeof e == "string";
}
function Cn(e) {
  return e === void 0 || typeof e == "string";
}
function se(e) {
  return e == null || typeof e == "string";
}
function Fw(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Bw(e) {
  return typeof e == "string" && e.length > 0;
}
function $c() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(K).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(K).filter((r) => r !== null) : [];
}
function sn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function te(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Uw(e) {
  return e.trim().toLowerCase();
}
function qw(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function je(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ai = 1e3;
class Gw {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new uR(
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
      settings: va(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = va();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Pi(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Yw(t.item) && n.executionMode === "ask") {
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
    if (await Go(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Dn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = zw(
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
      return this.pendingExecutions.delete(t), await In(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await In(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = pa(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = Xw(r);
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
    return o.ok ? (await _$(t), await T$(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (b$(
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
    if (await Go(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Dn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      Qw(t.item),
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
          de(a.workflowContext)
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
      return a.ok ? (Kw(n, a.value), await Ns(a.value), {
        ok: !0,
        executedLabel: jw(a.value)
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
    const n = Sn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && Sn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await In(
        a,
        _i(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = vn();
    await A$({
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
      const l = vn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await mi({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Sn(s),
        skippedLabel: _i(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: Zw(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      de(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = vn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await mi({
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
      de(a.value.context)
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
    const n = Date.now(), r = Ti(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > Ai && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= Ai;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Ti(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = Dn(
      t,
      n,
      r,
      a
    );
  }
}
function jw(e) {
  return xs({ inputAmount: e.totalRawDamage });
}
function zw(e, t) {
  if (t.resistance || !Vw(t))
    return t;
  const n = Fl(e);
  return n ? { ...t, resistance: n } : t;
}
function Vw(e) {
  return Hw(e) && !Ww(e);
}
function Hw(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Ww(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Sn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function _i(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function Kw(e, t) {
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
function Yw(e) {
  return e.type === "ritual";
}
function Qw(e) {
  return b_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Zw(e) {
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
function Xw(e) {
  const t = e.actorUuid ? Jw(e.actorUuid) : null;
  if (Me(t)) return t;
  const n = e.actorId ? ek(e.actorId) : null;
  return n || tk(e.actorName);
}
function Jw(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function ek(e) {
  const n = game.actors?.get?.(e);
  if (Me(n)) return n;
  for (const r of wc()) {
    const a = Aa(r);
    if (a?.id === e) return a;
  }
  return null;
}
function tk(e) {
  const t = Ln(e);
  if (!t) return null;
  for (const a of wc()) {
    const o = nk(a);
    if (Ln(o) === t) {
      const s = Aa(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Me(a) && Ln(a.name) === t
  );
  return Me(r) ? r : null;
}
function wc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function nk(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Aa(e)?.name ?? null;
}
function Aa(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Me(t)) return t;
  const n = e.document?.actor;
  return Me(n) ? n : null;
}
function Ln(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Me(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Dn(e, t, n, r) {
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
function Ti(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function vn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class rk {
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
class ak {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = ok(t);
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
      reason: ik(r, n.preset)
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
    preset: e.match ? Ut(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function ok(e) {
  const t = e.getFlag(d, "automation");
  return Rr(t) ? t : null;
}
function ik(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function _t(e) {
  return (t) => t.status === e;
}
class sk {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = wr(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), a = de(t);
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
    const n = w(t.actorName), r = w(t.resource), a = w(Ri(t)), o = w(ck(t));
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
      (p) => `<li><strong>${w(p.id)}:</strong> ${w(p.formula)} = ${p.total} <em>(${w(lk(p.intent))})</em>${p.damageType ? ` — ${w(p.damageType)}` : ""}</li>`
    ), u = t.ritualCosts.map(
      (p) => `<li><strong>${w(p.itemName)}:</strong> ${p.circle}º círculo — ${p.amount} ${w(p.resource)} (${w(uk(p.source))})</li>`
    ), m = t.damageInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount}${p.damageType ? ` ${w(p.damageType)}` : ""} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (p) => `<li><strong>${w(p.actorName)}:</strong> ${w(Ri(p))} — ${p.before.value}/${p.before.max} &rarr; ${p.after.value}/${p.after.max}</li>`
    ), b = t.phases.map((p) => w(p)).join(" &rarr; ");
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
          ${b.length > 0 ? `<p class="${d}-workflow-card__phases"><strong>Fases:</strong> ${b}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function lk(e) {
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
function Ri(e) {
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
function ck(e) {
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
function uk(e) {
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
function dk() {
  const e = new Fb(), t = new GA(e), n = new us(new cs()), r = new ds(new Nr()), a = new jA(new El()), o = new qb(), s = new nA(o), l = new hA(e), c = new bA(), u = c.registerMany(
    Tu()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new yA(), y = new pA(), R = As(), b = new ps(R), p = new ak(
    c
  ), T = new rk(
    p,
    m,
    y
  ), Ae = new WA(), Q = new sk(Ae), _e = new HA(), O = new qA(), ne = new BA(
    t,
    s,
    Q,
    _e
  ), G = new VA(ne, _e), M = new Gw(
    G,
    t,
    s,
    n,
    b,
    Ae,
    O
  );
  return M.addStrategy(
    new mA(
      (cn) => M.handleItemUsed(cn)
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
    conditions: b,
    debugOutput: Ae,
    chatMessages: Q,
    workflowHooks: _e,
    ritualEvents: O,
    automation: ne,
    workflow: G,
    itemUseIntegration: M,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: T
  };
}
const { ApplicationV2: mk } = foundry.applications.api;
class Ft extends mk {
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
      apply: Ft.onApply,
      cancel: Ft.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${z(vi)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${z(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Pn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Pn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Pn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Pn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${z(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? fk(n) : gk(t)}
    </section>
  `;
}
function fk(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(pk).join("")}</ol>`;
}
function pk(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${z(e.appliedPresetId)} v${z(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${z(e.itemName)}</strong>
        <span>${z(e.reason)}</span>
        ${r}
      </div>
      <em>${z(n)}</em>
    </li>
  `;
}
function gk(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${z({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function z(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Bt = `${d}.manageRitualPresets`, $i = `__${d}_ritualPresetHeaderControlRegistered`, hk = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function yk(e) {
  const t = globalThis;
  if (!t[$i]) {
    for (const n of hk)
      Hooks.on(n, (r, a) => {
        bk(r, a, e);
      });
    t[$i] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function bk(e, t, n) {
  Array.isArray(t) && _k(e) && (Ak(e, n), !t.some((r) => r.action === Bt) && t.push({
    action: Bt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), kc(e, n);
    }
  }));
}
function Ak(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Bt] && (e.options.actions[Bt] = (n) => {
    n.preventDefault(), n.stopPropagation(), kc(e, t);
  }));
}
function _k(e) {
  if (!game.user?.isGM) return !1;
  const t = Ec(e);
  return t ? t.type === "agent" && st(t).length > 0 : !1;
}
function kc(e, t) {
  const n = Ec(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ft(n, t).render({ force: !0 });
}
function Ec(e) {
  return wi(e.actor) ? e.actor : wi(e.document) ? e.document : null;
}
function wi(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ic = "data-paranormal-toolkit-ritual-roll-config", dt = "data-paranormal-toolkit-ritual-roll-field", ge = "data-paranormal-toolkit-ritual-roll-action", ki = `__${d}_ritualRollConfigBlockRegistered`, Tk = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Rk = [
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
function $k() {
  const e = globalThis;
  if (!e[ki]) {
    wk();
    for (const t of Tk)
      Hooks.on(t, (...n) => {
        kk(n[0], n[1]);
      });
    e[ki] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function wk() {
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
function kk(e, t) {
  const n = Bk(e);
  if (!n || n.type !== "ritual") return;
  const r = Gk(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  Ik(a);
  const o = Sc(n), s = Ml(n), l = Uk(n), c = Ck(n, s, o, l);
  Nk(c, n, o, l), Ek(a, c), _a(c);
}
function Ek(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Ik(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ic}]`)))
    t.remove();
}
function Ck(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Ic, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(Ei("strong", "Paranormal Toolkit")), s.append(Ei("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Dc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(Sk(t, r)), u.append(Lk(t, r)), u.append(Dk(t, r)), a.append(u), a.append(vk(t, n, r)), a.append(Pk(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function Sk(e, t) {
  const n = ln("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(dt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = y_(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function Lk(e, t) {
  const n = ln("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(dt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of Rk) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function Dk(e, t) {
  const n = ln("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(dt, "utilityLabel"), n.append(r), n;
}
function vk(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(Nn("base", "Padrão", e.forms.base.formula, !0, n)), o.append(Nn("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(Nn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function Nn(e, t, n, r, a) {
  const o = ln(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(dt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function Pk(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ge, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ge, "clear"), t.append(n, r), t;
}
function ln(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Ei(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Nk(e, t, n, r) {
  ze(e, "intent")?.addEventListener("change", () => _a(e)), Si(e, "system.studentForm")?.addEventListener("change", () => Ii(e, t)), Si(e, "system.trueForm")?.addEventListener("change", () => Ii(e, t)), e.querySelector(`[${ge}="save"]`)?.addEventListener("click", () => {
    r && xk(e, t, n);
  }), e.querySelector(`[${ge}="clear"]`)?.addEventListener("click", () => {
    r && Ok(e, t);
  });
}
async function xk(e, t, n) {
  const r = e.querySelector(`[${ge}="save"]`);
  r?.setAttribute("disabled", "true"), ve(e, "Salvando configuração...");
  try {
    const a = Mk(e, n);
    await g_(t, a), Cc(e, a), ve(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), ve(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Ok(e, t) {
  const n = e.querySelector(`[${ge}="clear"]`);
  n?.setAttribute("disabled", "true"), ve(e, "Limpando configuração...");
  try {
    await h_(t);
    const r = Ml(t);
    Fk(e, r), Cc(e, r), ve(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ve(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Cc(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Dc(t) ? "Configurada" : "Rascunho");
}
function Mk(e, t) {
  return {
    schemaVersion: 1,
    intent: Lc(ze(e, "intent")?.value),
    damageType: Li(e, "damageType"),
    utilityLabel: Li(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: It(e, "formula.base") },
      discente: { formula: It(e, "formula.discente") },
      verdadeiro: { formula: It(e, "formula.verdadeiro") }
    }
  };
}
function Fk(e, t) {
  we(e, "intent", t.intent), we(e, "damageType", t.damageType ?? ""), we(e, "utilityLabel", t.utilityLabel ?? "Resultado"), we(e, "formula.base", t.forms.base.formula), we(e, "formula.discente", t.forms.discente.formula), we(e, "formula.verdadeiro", t.forms.verdadeiro.formula), _a(e);
}
function _a(e) {
  const t = Lc(ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Ii(e, t) {
  const n = Sc(t);
  Ci(e, "discente", n.discente), Ci(e, "verdadeiro", n.verdadeiro);
}
function Ci(e, t, n) {
  const r = ze(e, `formula.${t}`);
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
function ve(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Sc(e) {
  const t = qk(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Bk(e) {
  return Di(e.item) ? e.item : Di(e.document) ? e.document : null;
}
function Uk(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function qk(e) {
  const t = e.system;
  return jk(t) ? t : {};
}
function Si(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ze(e, t) {
  return e.querySelector(`[${dt}="${zk(t)}"]`);
}
function It(e, t) {
  return ze(e, t)?.value.trim() ?? "";
}
function Li(e, t) {
  const n = It(e, t);
  return n.length > 0 ? n : null;
}
function we(e, t, n) {
  const r = ze(e, t);
  r && (r.value = n);
}
function Lc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Dc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function Gk(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Di(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function jk(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function zk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ce = null;
Hooks.once("init", () => {
  yu(), Yu(), Sd(), kb(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!xa.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${xa.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ce = dk(), ce.itemUseIntegration.registerStrategies(), kd(ce.conditions), ld(ce), Ad(), gd(), Db(), yk(ce), $k(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function Vk() {
  if (!ce)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ce;
}
export {
  Vk as getToolkitServices
};
//# sourceMappingURL=main.js.map
