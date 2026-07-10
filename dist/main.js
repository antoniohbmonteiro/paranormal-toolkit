const d = "paranormal-toolkit", Di = "Paranormal Toolkit", Pc = "ordemparanormal";
class at {
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
function y(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function ot(e) {
  const t = vi(e);
  return t.ok ? y(t.value.definition) : t;
}
function vi(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Rr(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Nc(e) {
  return Rr(e.getFlag(d, "automation"));
}
function Rr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Oc(t.source) && xc(t.definition);
}
function xc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Mc) && (t.ritualForms === void 0 || Gc(t.ritualForms)) && (t.conditionApplications === void 0 || Kc(t.conditionApplications));
}
function Oc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Mc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Fc(t);
    case "spendRitualCost":
      return Bc(t);
    case "rollFormula":
      return Uc(t);
    case "modifyResource":
      return zc(t);
    case "chatCard":
      return qc(t);
    default:
      return !1;
  }
}
function Fc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Pi(t);
}
function Bc(e) {
  return e.type === "spendRitualCost";
}
function Uc(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || tu(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function zc(e) {
  const t = e;
  return t.type === "modifyResource" && Ni(t.actor) && Jc(t.resource) && eu(t.operation) && Pi(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
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
  return (t.label === void 0 || R(t.label)) && (t.extraCost === void 0 || ru(t.extraCost)) && (t.rollFormulaOverrides === void 0 || ou(t.rollFormulaOverrides)) && (t.notes === void 0 || au(t.notes)) && (t.targeting === void 0 || Vc(t.targeting));
}
function Vc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Wc(t.mode) && R(t.label) && (t.optionLabel === void 0 || R(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Hc(t.template));
}
function Hc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || $a(t.distance)) && (t.width === void 0 || t.width === null || $a(t.width));
}
function Wc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Kc(e) {
  return Array.isArray(e) && e.every(Yc);
}
function Yc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Ni(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Zc(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel)) && (t.applyOnResistance === void 0 || Qc(t.applyOnResistance));
}
function Qc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Zc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || nu(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Xc(t.expiry));
}
function Xc(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Pi(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Ni(e) {
  return e === "self" || e === "target";
}
function Jc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function eu(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function tu(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function nu(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function ru(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function $a(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function au(e) {
  return Array.isArray(e) && e.every(R);
}
function ou(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => R(t) && R(n)
  );
}
function wr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Ea);
    if (lu(t))
      return Array.from(t).filter(Ea);
  }
  return [];
}
function iu(e) {
  return wr(e)[0] ?? null;
}
function su(e) {
  return wr(e).find(Nc) ?? null;
}
function lu(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ea(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function it(e) {
  return wr(e).filter((t) => t.type === "ritual");
}
function xi(e) {
  return it(e)[0] ?? null;
}
function cu(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Ut);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = He("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = dt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Sa);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = He("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = dt(n);
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
      const t = He("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = dt(t);
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
      const t = He("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = dt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Ia(e) {
  const t = He("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = it(t);
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
    r.applied.push(uu(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), du(r), r;
}
async function xn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function uu(e, t, n) {
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
function du(e) {
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
function He(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function dt(e) {
  const t = xi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Re(e) {
  return e ? {
    id: e.id,
    source: {
      ...mu(e.sourceActor),
      token: e.sourceToken
    },
    item: fu(e.item),
    targets: e.targets.map(pu),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: La(e.rollRequests, Oi),
    rolls: La(e.rolls, gu),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(kr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function kr(e) {
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
function mu(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function fu(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function pu(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Oi(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function gu(e) {
  return {
    ...Oi(e),
    total: e.total
  };
}
function La(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function hu(e) {
  return {
    getSelected() {
      return at.getSelectedActor();
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
      await Ae(
        e,
        "Gasto de PE",
        re("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Ae(
        e,
        "Gasto de PD",
        re("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Ae(
        e,
        "Dano em PV",
        re("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Ae(
        e,
        "Cura de PV",
        re("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Ae(
        e,
        "Dano em SAN",
        re("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Ae(
        e,
        "Recuperação de SAN",
        re("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Ae(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    yu(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, kr(o));
}
function re(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function yu(e) {
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
function bu() {
  mt(V.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), mt(V.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), mt(V.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), mt(V.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function On() {
  return {
    enabled: ft(V.enabled),
    console: ft(V.console),
    ui: ft(V.ui),
    chat: ft(V.chat)
  };
}
async function Z(e, t) {
  await game.settings.set(d, V[e], t);
}
function mt(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ft(e) {
  return game.settings.get(d, e) === !0;
}
function Au() {
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
const Mi = "ritual.costOnly", Fi = "ritual.simpleHealing", _u = "ritual.eletrocussao", Tu = "ritual.definhar", Bi = "ritual.simpleDamage", Ui = "generic.simpleHealing", zi = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, $r = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ru() {
  return [
    wu(),
    ku(),
    $u(),
    Eu(),
    Iu(),
    Cu()
  ];
}
function wu() {
  return {
    id: Mi,
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
function ku() {
  return {
    id: Fi,
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
    automation: qi(),
    itemPatch: vu()
  };
}
function $u() {
  return {
    id: _u,
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
    automation: Lu(),
    itemPatch: Nu()
  };
}
function Eu() {
  return {
    id: Tu,
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
    automation: Du(),
    itemPatch: Pu()
  };
}
function Iu() {
  return {
    id: Bi,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Er()
  };
}
function Cu() {
  return {
    id: Ui,
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
function qi(e = zi) {
  const t = Su(e);
  return Gi(
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
function Su(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...zi,
    ...e
  };
}
function Lu() {
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
function Du() {
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
  return Gi(
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
function vu() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: $r,
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
function Pu() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: $r,
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
function Nu() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: $r,
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
function Gi(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Ir() {
  return Array.from(game.user?.targets ?? []).map(ji);
}
function ji(e) {
  return {
    tokenId: we(e.id),
    actorId: we(e.actor?.id),
    sceneId: we(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Vi() {
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
function xu(e) {
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
        if (!Fu(t, n)) {
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
      const r = e.automationRegistry.require(Mi);
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
      const a = e.automationRegistry.require(Fi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: qi(t)
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
      const a = e.automationRegistry.require(Bi);
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
      n && await Ou(e, t, n);
    }
  };
}
async function Ou(e, t, n) {
  const r = ot(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Vi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    Mu(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", Re(a.value.context));
}
function Mu(e) {
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
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function oe(e) {
  const t = xi(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Fu(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Da(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Bu = ["strict", "open"], Hi = "strict";
function Uu(e) {
  return Bu.includes(e) ? e : Hi;
}
function zu(e) {
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
function zt(e, t) {
  return e === "strict" && t.kind === "pending";
}
const qu = ["disabled", "ask", "automatic"], Gu = ["buttons", "confirm"], Wi = "ask";
function ju(e) {
  return typeof e == "string" && qu.includes(e);
}
function Vu(e) {
  return typeof e == "string" && Gu.includes(e);
}
function Hu(e) {
  return ju(e) ? e : Vu(e) ? "ask" : Wi;
}
const Wu = ["keep", "replace"], Ku = ["manual", "assisted"], Ki = "keep", Yi = "assisted", Yu = !0, L = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Qu() {
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
    default: Wi
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
    default: Ki
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
    default: Yi
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
    default: Hi
  }), game.settings.register(d, L.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Yu
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
  const e = Hu(game.settings.get(d, L.executionMode)), t = Zi(game.settings.get(d, L.systemCardMode)), n = Xi(game.settings.get(d, L.damageResolutionMode)), r = Cr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Qi()
  };
}
function Zu() {
  return Zi(game.settings.get(d, L.systemCardMode));
}
function Xu() {
  return Xi(game.settings.get(d, L.damageResolutionMode));
}
function Cr() {
  return Uu(game.settings.get(d, L.resistanceGateMode));
}
function Qi() {
  return game.settings.get(d, L.ritualCastingCheckEnabled) === !0;
}
async function ie(e) {
  await game.settings.set(d, L.executionMode, e);
}
function Zi(e) {
  return Wu.includes(e) ? e : Ki;
}
function Xi(e) {
  return Ku.includes(e) ? e : Yi;
}
function Ju(e) {
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
const ed = [
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
function td(e) {
  return {
    phases() {
      return ed;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = cn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = su(t);
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
      if (!ad(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = rd(n) ?? cn("Nenhum ator encontrado para executar automação do item.");
      r && await Pa(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = cn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = iu(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Ui);
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
  const r = ot(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Vi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    nd(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", Re(a.value.context));
}
function nd(e) {
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
function cn(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function rd(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ad(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function od(e) {
  const t = hu(e), n = cu(e), r = xu(e), a = td(e), o = Au(), s = Ju(e);
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
function id(e) {
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
      return sd(a), a;
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
      return ld(r), r;
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
function sd(e) {
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
function ld(e) {
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
function cd(e) {
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
    conditions: id(e.conditions),
    debug: od(e),
    hooks: Tt
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class xa {
  static isSupportedSystem() {
    return game.system.id === Pc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
let Oa = !1, un = !1, dn = !1, pt = null;
const ud = 1e3, dd = 750, md = 1e3;
function fd(e) {
  Oa || (Hooks.on("combatTurnChange", (t) => {
    gd(e, Ma(t));
  }), Hooks.on("deleteCombat", (t) => {
    hd(e, Ma(t));
  }), Oa = !0, pd(e));
}
function pd(e) {
  qt() && (un || (un = !0, globalThis.setTimeout(() => {
    un = !1, Sr(e, "ready");
  }, ud)));
}
function gd(e, t) {
  qt() && t && (pt && globalThis.clearTimeout(pt), pt = globalThis.setTimeout(() => {
    pt = null, Sr(e, "combat-turn-change", t);
  }, dd));
}
function hd(e, t) {
  qt() && t && (dn || (dn = !0, globalThis.setTimeout(() => {
    dn = !1, Sr(e, "combat-deleted", t);
  }, md)));
}
async function Sr(e, t, n) {
  if (qt())
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
function qt() {
  return game.user?.isGM === !0;
}
function Ma(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Ji = {
  enabled: "dice.animations.enabled"
};
function yd() {
  game.settings.register(d, Ji.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function bd() {
  return {
    enabled: game.settings.get(d, Ji.enabled) === !0
  };
}
const Gt = "chatCard", Fa = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Ad = `.${i}__title`, es = `.${i}__header`, _d = `.${i}__roll-card`, Td = `.${i}__roll-meta`, Rd = `.${i}__roll-meta-pill`, Lr = `.${i}__resistance`, wd = `.${i}__resistance-header`, ts = `.${i}__resistance-description`, jt = `.${i}__resistance-roll-button`, ns = `.${i}__resistance-roll-result`, Ba = `${i}__resistance-content`, rs = `.${i}__workflow-section`, as = `.${i}__workflow-roll`, Dr = `${i}__workflow-roll--dice-open`, vr = `.${i}__workflow-roll-formula`, Pr = `${i}__workflow-roll-formula--toggle`, Vt = `.${i}__workflow-dice-tray`, kd = `.${i}__roll-detail-toggle`, $d = `.${i}__roll-detail-list`, Ed = `.${i}__ritual-element-badge`, Id = `.${i}__ritual-metadata`, Cd = "casting-backlash", Sd = "data-paranormal-toolkit-action-section", Ld = "data-paranormal-toolkit-prompt-id", Dd = "data-paranormal-toolkit-pending-id", Ua = "data-paranormal-toolkit-casting-backlash-enhanced", za = `.${i}`, vd = `.${i}__workflow-section--casting`, Pd = `.${i}__workflow-section-header`, Nd = `.${i}__workflow-notes`, xd = `[${Sd}="${Cd}"]`, qa = `${i}__workflow-section-title-row`, Od = `${i}__workflow-section-header--casting-backlash`, os = `${i}__casting-backlash-button`;
function Md(e) {
  for (const t of Fd(e))
    Bd(t), jd(t);
}
function Fd(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(za) && t.add(e);
  for (const n of e.querySelectorAll(za))
    t.add(n);
  return Array.from(t);
}
function Bd(e) {
  const t = e.querySelector(xd);
  if (!t) return;
  const n = Ud(t);
  if (!n) return;
  const r = e.querySelector(`${vd} ${Pd}`);
  r && (r.classList.add(Od), zd(r), qd(n), r.append(n), t.remove());
}
function Ud(e) {
  return e.querySelector(
    `button[${Dd}], button[${Ld}]`
  );
}
function zd(e) {
  const t = e.querySelector(`:scope > .${qa}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(qa);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(os) || n.append(a));
  return n;
}
function qd(e) {
  if (e.getAttribute(Ua) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Gd(t, e.disabled);
  e.classList.add(os), e.setAttribute(Ua, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Gd(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function jd(e) {
  for (const t of e.querySelectorAll(Nd)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Vd(e) {
  for (const t of Array.from(e.querySelectorAll(rs)))
    for (const n of Array.from(t.querySelectorAll(`${kd}, ${$d}`)))
      n.remove();
}
const Hd = {
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
}, Wd = new Set(
  Object.values(Hd)
), Kd = {
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
function Yd(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Qd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Kd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Wd.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function is(e) {
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
function Qd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class ss {
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
      const h = Zd(m, u);
      if (!h.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const w = Yd(m.damageType);
      if (!w.ok)
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
          Xd(h.id, m, w.value)
        );
        continue;
      }
      try {
        const T = await Promise.resolve(
          o.call(n, h.amount, {
            damageType: w.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const E of em(T.conditions))
          l.add(E);
        const _ = Jd(T.newPV);
        _ !== null && (c = _), s.push({
          id: h.id,
          label: m.label ?? is(w.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: h.amount,
          finalDamage: Ga(T.finalDamage, h.amount),
          blocked: Ga(T.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: w.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (T) {
        return p({
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
    return y({
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
function Zd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Xd(e, t, n) {
  return {
    id: e,
    label: t.label ?? is(n),
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
function Ga(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Jd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function em(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Nr {
  async rollResistance(t) {
    const n = await nm(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? me(t.skill),
      roll: n,
      formula: am(n),
      total: om(n),
      diceBreakdown: im(n)
    };
  }
  getSkillLabel(t) {
    return me(t);
  }
}
async function tm(e, t) {
  return new Nr().rollResistance({ actor: e, skill: t });
}
function me(e) {
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
async function nm(e, t) {
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
  return rm(r);
}
function rm(e) {
  return ja(e) ? e : Array.isArray(e) ? e.find(ja) ?? null : null;
}
function ja(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function am(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function om(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function im(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(sm);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function sm(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class ls {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class cs {
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
function lm(e, t) {
  const n = gm(e?.rounds);
  if (!n)
    return Va(null);
  const r = e?.anchor ?? us(t);
  if (!r)
    return {
      ...Va(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: cm(),
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
function us(e) {
  const t = hm();
  if (!t?.id || !ds(t.round)) return null;
  const n = fm(t), r = um(e, n) ?? mm(t), a = X(r?.id), o = bm(r?.initiative), s = dm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: ym()
  };
}
function cm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Va(e) {
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
function um(e, t) {
  return e?.id ? t.find((n) => pm(n) === e.id) ?? null : null;
}
function dm(e, t, n) {
  const r = X(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Am(e.turn) ? e.turn : null;
}
function mm(e) {
  return Rt(e.combatant) ? e.combatant : null;
}
function fm(e) {
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
function pm(e) {
  return X(e.actor?.id) ?? X(e.actorId) ?? X(e.token?.actor?.id) ?? X(e.token?.actorId) ?? X(e.document?.actor?.id) ?? X(e.document?.actorId);
}
function gm(e) {
  return ds(e) ? Math.trunc(e) : null;
}
function hm() {
  return game.combat ?? null;
}
function ym() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Rt(e) {
  return !!(e && typeof e == "object");
}
function X(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function bm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ds(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Am(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class ms {
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
    if (!Sm(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = lm(t.duration, r), s = _m(a, t, o), c = t.refreshExisting ?? !0 ? Lm(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(Ha(r, a, c.id ?? null, !1, !0, o));
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
      return y(Ha(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = ps(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Wa(n, s) === "deleted" && (o += 1);
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
    const n = Pm(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = xr(s);
      a += l.length;
      for (const c of l) {
        if (!wm(c, t)) continue;
        const u = fs(c);
        try {
          await Wa(s, c) === "deleted" && (o += 1);
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
function _m(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Gm(),
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
    duration: Tm(n.duration),
    start: Rm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function Tm(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Rm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: qm(),
    ...e
  };
}
function Ha(e, t, n, r, a, o) {
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
function wm(e, t) {
  const n = fs(e);
  if (!n.conditionId || !km(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = zm();
  return n.durationMode === "combatantTurn" || $m(n) ? Im(n, r) : Em(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !F(n.startRound) || !F(n.requestedRounds) || !F(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function km(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && F(e.requestedRounds);
}
function $m(e) {
  return !!(e.combatDurationApplied && F(e.requestedRounds) && F(e.startRound) && (e.startCombatantId || Ct(e.startTurn)));
}
function Em(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Im(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !F(e.startRound) || !F(e.requestedRounds) || !F(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Cm(t);
  return e.startCombatantId ? r === e.startCombatantId : Ct(e.startTurn) && Ct(t.turn) ? t.turn === e.startTurn : !1;
}
function Cm(e) {
  return ke(e.combatant?.id);
}
function fs(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: wt(e, "conditionId"),
    requestedRounds: Ka(e, "requestedRounds") ?? We(t.value) ?? We(t.rounds),
    combatDurationApplied: mn(e, "combatDurationApplied"),
    combatId: wt(e, "combatId") ?? ke(n.combat) ?? ke(t.combat),
    startCombatantId: wt(e, "startCombatantId") ?? ke(n.combatant),
    startInitiative: Mm(e, "startInitiative") ?? gs(n.initiative),
    startRound: Ka(e, "startRound") ?? We(n.round) ?? We(t.startRound),
    startTurn: Om(e, "startTurn") ?? Mn(n.turn) ?? Mn(t.startTurn),
    expiryEvent: Fm(e, "expiryEvent") ?? hs(t.expiry),
    durationMode: Bm(e, "durationMode"),
    deleteOnExpire: mn(e, "deleteOnExpire"),
    expiresWithCombat: mn(e, "expiresWithCombat")
  };
}
function Sm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Lm(e, t) {
  return ps(e, t)[0] ?? null;
}
function ps(e, t) {
  return xr(e).filter((n) => xm(n) === t);
}
async function Wa(e, t) {
  const n = t.id ?? null, r = n ? Dm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (vm(a)) return "missing";
    throw a;
  }
}
function Dm(e, t) {
  return xr(e).find((n) => n.id === t) ?? null;
}
function vm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Pm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      gt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    gt(e, n);
  });
  for (const n of Nm())
    gt(e, n.actor), gt(e, n.document?.actor);
  return Array.from(e.values());
}
function gt(e, t) {
  if (!Um(t)) return;
  const r = ke(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Nm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function xr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function xm(e) {
  return wt(e, "conditionId");
}
function wt(e, t) {
  return ke(ge(e, t));
}
function Ka(e, t) {
  return We(ge(e, t));
}
function Om(e, t) {
  return Mn(ge(e, t));
}
function Mm(e, t) {
  return gs(ge(e, t));
}
function Fm(e, t) {
  return hs(ge(e, t));
}
function Bm(e, t) {
  const n = ge(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function mn(e, t) {
  return ge(e, t) === !0;
}
function ge(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[d];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function ke(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function We(e) {
  return F(e) ? Math.trunc(e) : null;
}
function Mn(e) {
  return Ct(e) ? Math.trunc(e) : null;
}
function gs(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function hs(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Um(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function zm() {
  return game.combat ?? null;
}
function qm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function F(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ct(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Gm() {
  return game.user?.id ?? null;
}
const jm = "icons/svg/downgrade.svg", Vm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? jm,
    description: Vm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Hm = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Wm = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Km = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Ym = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Qm = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Zm = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Xm = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Jm = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), ef = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), tf = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), nf = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), rf = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), af = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), of = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), sf = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), lf = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), cf = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), uf = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), df = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), mf = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), ff = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), pf = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), gf = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), hf = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), yf = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), bf = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Af = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), _f = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Tf = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Rf = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), wf = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), kf = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), $f = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Ef = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), If = [
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
  wf,
  kf,
  $f,
  Ef
];
class Cf {
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
    return Array.from(this.definitions.values()).map(Ya);
  }
  get(t) {
    const n = this.lookup.get(Qa(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Ya(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Qa(t);
    r && this.lookup.set(r, n);
  }
}
function ys() {
  return new Cf(If);
}
function Ya(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Qa(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Se(e) {
  return e.applyOnResistance ?? "failure";
}
function bs(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function As(e, t) {
  const n = Se(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function _s(e) {
  const t = Se(e);
  return t === "failure" || t === "success";
}
function Sf(e, t, n, r) {
  const a = e.filter((c) => As(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Se(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Lf = {
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
}, Df = {
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
function vf(e) {
  return Rs(e, Lf, !1);
}
function Pf(e) {
  return Rs(e, Df, !e.allowsSuccessfulResistance);
}
function xe(e) {
  return e.kind === "waiting-resistance";
}
function Ts(e) {
  return e.kind === "resisted";
}
function Rs(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? _e("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? _e("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || zt(e.resistanceGateMode, e.resistanceState) ? _e(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? _e("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : _e("available", !0, r.available, r.availableCompact, null);
}
function _e(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Ke = "data-paranormal-toolkit-prompt-id", Nf = "data-paranormal-toolkit-resistance-roll-result", xf = "Conjuração DT";
function Of(e) {
  const t = e.querySelector(jt)?.getAttribute(Nf), n = Je(t);
  if (n !== null) return n;
  const r = e.querySelector(ns)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Je(a?.[1] ?? null);
}
function Or(e) {
  const t = ws(e), n = Uf(t);
  if (n !== null) return n;
  const r = Bf(t);
  return r !== null ? r : zf(e);
}
function Mf(e) {
  const t = ws(e);
  return t ? {
    actorId: fn(t.actorId),
    itemId: fn(t.itemId),
    itemName: fn(t.itemName)
  } : null;
}
function Ff(e) {
  const t = e.getAttribute(Ke);
  if (!t) return null;
  const n = ks(e), r = $s(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Ht(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function J(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Fn(e) {
  return J(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Bf(e) {
  const t = Gf(e);
  return t.length === 0 ? null : Je(jf(t, xf));
}
function Uf(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Za(r, ["system", "ritual", "DT"]) ?? Za(r, ["system", "ritual", "dt"]);
}
function zf(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Je(n?.[1] ?? null);
}
function ws(e) {
  const t = qf(e);
  if (!t) return null;
  const n = ks(e), r = $s(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Ht(o) ? o.pendingId === t : !1) ?? null;
}
function qf(e) {
  return (e.closest(`[${Ke}]`) ?? e.querySelector(`[${Ke}]`) ?? e.parentElement?.querySelector(`[${Ke}]`) ?? null)?.getAttribute(Ke) ?? null;
}
function ks(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Vf(a) ? a : null;
}
function $s(e) {
  const t = e?.getFlag?.(d, Gt);
  return Ht(t) ? t : null;
}
function Gf(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function jf(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Za(e, t) {
  let n = e;
  for (const r of t) {
    if (!Ht(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Je(typeof n == "string" ? n : null);
}
function Je(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Vf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Ht(e) {
  return !!(e && typeof e == "object");
}
function fn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Wt(e) {
  return Es({
    hasResistance: !!e.querySelector(Lr),
    difficulty: Or(e),
    resistanceTotal: Of(e)
  });
}
function Hf(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Es({
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
function Es(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: zu(e)
  };
}
function he() {
  return game.user?.isGM === !0;
}
function fe() {
  return he();
}
function Wf(e) {
  const t = zt(e.resistanceGateMode, e.resistanceState), n = Kf(e.resistanceState, e.hasDamage), r = Yf(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = vf({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Pf({
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
function Kf(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Yf(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Mr(e) {
  const t = e.isGM ?? fe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Wf({
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
function Qf(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Xf(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Zf(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Xf(e, t) {
  const n = Jf(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of ep(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Jf(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function ep(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Xa(e, "highest") : n.includes("kl") ? Xa(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Xa(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const tp = "data-paranormal-toolkit-resistance-skill", np = "data-paranormal-toolkit-resistance-skill-label", Is = "pending", Fr = "success", Br = "failure", Cs = "rolled";
function rp(e) {
  const t = lp(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? ip(e.damageSection) : null, r = Ja(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = ap(e.rollCard).map((o, s) => {
    const l = op(o, s), c = e.resistanceResults.get(l) ?? null, u = fp(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, h = e.effectApplications.get(l) ?? null, w = Hf({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: yp(u)
    }).state, T = Ja(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      bs(w)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: h,
      effect: T,
      assistedActions: Mr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: w,
        damage: n,
        effect: T,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!h,
        effectCanApplyOnSuccessfulResistance: T?.applyOnResistance === "success" || T?.applyOnResistance === "always",
        effectRequiresResolvedResistance: T ? _s(T) : !1
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
function ap(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && Ss(a) !== "nenhum alvo") : [];
}
function op(e, t) {
  return `${Ss(e)}:${t}`;
}
function ip(e) {
  const t = pp(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: hp(e),
    formula: gp(e) ?? "—",
    total: t,
    diceBreakdown: Zf(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Ja(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: sp(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Se(o)
  } : null;
}
function sp(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function lp(e, t) {
  const n = cp(t), r = up(n)?.textContent?.trim(), a = dp(n), o = a?.getAttribute(tp) ?? null, s = a?.getAttribute(np) ?? (o ? me(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: mp(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: Or(e)
  };
}
function cp(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function up(e) {
  return Ur(e, `.${i}__resistance-description`);
}
function dp(e) {
  return Ur(e, jt);
}
function mp(e) {
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
function fp(e, t) {
  return e ? t === null ? Cs : e.total >= t ? Fr : Br : Is;
}
function pp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function gp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function hp(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Ss(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function yp(e) {
  return e === Fr ? "succeeded" : e === Br ? "failed" : "pending";
}
function Ls(e) {
  if (!e) return null;
  const t = e.actorId ? _p(e.actorId) : null, n = t ? bp(t, e.itemId, e.itemName) : null;
  return n || Ap(e.itemId, e.itemName);
}
function bp(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if ($e(o)) return o;
  }
  const a = St(n);
  if (a) {
    const o = r?.find?.((s) => $e(s) ? St(s.name) === a : !1);
    if ($e(o)) return o;
  }
  return null;
}
function Ap(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if ($e(a)) return a;
  }
  const r = St(t);
  if (r) {
    const a = n?.find?.((o) => $e(o) ? St(o.name) === r : !1);
    if ($e(a)) return a;
  }
  return null;
}
function _p(e) {
  const n = game.actors?.get?.(e);
  return Tp(n) ? n : null;
}
function Tp(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function $e(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function St(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function zr(e) {
  const t = pn(e);
  if (!t) return null;
  const n = Rp().filter((o) => pn(wp(o)) === t).map((o) => Ds(o)).find(Ze) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Ze(o) && pn(o.name) === t);
  return Ze(a) ? a : null;
}
function Rp() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function wp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ds(e)?.name ?? null;
}
function Ds(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ze(t)) return t;
  const n = e.document?.actor;
  return Ze(n) ? n : null;
}
function Ze(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function pn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function vs(e) {
  const t = Ip();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: kp(e)
  });
}
function kp(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${kt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = $p(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${kt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${kt(e.actorName)}</strong></p>
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
function $p(e) {
  const t = Ep(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${kt(a)}</li>`;
}
function Ep(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = eo(n?.value);
  return r === null ? null : {
    value: r,
    max: eo(n?.max)
  };
}
function eo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ip() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function kt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Cp(e) {
  await vs(Sp(e));
}
function Sp(e) {
  if (Lp(e)) return e;
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
function Lp(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Ps(e) {
  return e.mode, `✓ ${Ns(e.inputAmount)} PV`;
}
function Dp(e) {
  const t = Ns(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ns(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class vp {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? fe()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : zt(t.resistanceGateMode, t.resistanceState) ? {
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
class Pp {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? fe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : zt(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Np {
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
const xp = `.${i}__actions`, qr = `.${i}__actions-title`, Le = `.${i}__button`, Op = "data-paranormal-toolkit-action-section", Mp = `${i}__button--executed`, Fp = "data-paranormal-toolkit-executed-label";
function xs(e) {
  return J(e.querySelector(qr)?.textContent);
}
function Bp(e, t) {
  const n = e.querySelector(qr);
  n && (n.textContent = t);
}
function st(e, t) {
  const n = J(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return J(a) === n;
  }) ?? null;
}
function Gr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ye(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Os(e) {
  const t = Up(e.difficulty);
  if (t === null) return null;
  const n = to(e.skillLabel) ?? "Resistência", r = to(e.description), a = zp(r, n), o = qp(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Up(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function to(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function zp(e, t) {
  if (!e) return null;
  const n = no(e), r = no(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function qp(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function no(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const ht = "data-paranormal-toolkit-prompt-id", Ms = "multiTargetResistanceResults", Fs = "multiTargetDamageApplications", Bs = "multiTargetEffectApplications";
function Gp(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Ms];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    Qp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function jp(e, t) {
  await jr(e, Ms, t.targetId, t);
}
function Vp(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Fs];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    Zp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Hp(e, t) {
  await jr(
    e,
    Fs,
    t.targetId,
    t
  );
}
function Wp(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Bs];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    Jp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Kp(e, t) {
  await jr(
    e,
    Bs,
    t.targetId,
    t
  );
}
function Yp(e) {
  const t = Kt(e);
  return t ? {
    actorId: gn(t.actorId),
    itemId: gn(t.itemId),
    itemName: gn(t.itemName)
  } : null;
}
async function jr(e, t, n, r) {
  const a = Us(e);
  if (!a) return;
  const o = zs(e), s = qs(o);
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
  l && await Promise.resolve(o.setFlag?.(d, Gt, {
    ...s,
    prompts: c
  }));
}
function Kt(e) {
  const t = Us(e);
  if (!t) return null;
  const n = zs(e), r = qs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => U(o) ? o.pendingId === t : !1) ?? null;
}
function Us(e) {
  return (e.closest(`[${ht}]`) ?? e.querySelector(`[${ht}]`) ?? e.parentElement?.querySelector(`[${ht}]`) ?? null)?.getAttribute(ht) ?? null;
}
function zs(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return eg(a) ? a : null;
}
function qs(e) {
  const t = e?.getFlag?.(d, Gt);
  return U(t) ? t : null;
}
function Qp(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Zp(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Xp(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Xp(e) {
  return e === "normal" || e === "half";
}
function Jp(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function gn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function eg(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function U(e) {
  return !!(e && typeof e == "object");
}
const tg = "data-paranormal-toolkit-resistance-skill", ng = "data-paranormal-toolkit-resistance-skill-label", Bn = "data-paranormal-toolkit-multi-target-section", Vr = "data-paranormal-toolkit-multi-target-damage-info", Gs = "data-paranormal-toolkit-multi-target-effect-info", js = "data-paranormal-toolkit-multi-target-toggle", Vs = "data-paranormal-toolkit-multi-target-details", x = "data-paranormal-toolkit-multi-target-target", rg = "data-paranormal-toolkit-multi-target-state", Un = "data-paranormal-toolkit-multi-target-roll-total", zn = "data-paranormal-toolkit-multi-target-roll-formula", $t = "data-paranormal-toolkit-multi-target-roll-dice", qn = "data-paranormal-toolkit-multi-target-roll-skill", Gn = "data-paranormal-toolkit-multi-target-roll-skill-label", jn = "data-paranormal-toolkit-multi-target-roll-target-name", Vn = "data-paranormal-toolkit-multi-target-roll-rolled-at", Hn = "data-paranormal-toolkit-multi-target-damage-mode", Wn = "data-paranormal-toolkit-multi-target-damage-input-amount", ro = "data-paranormal-toolkit-multi-target-damage-final-amount", ao = "data-paranormal-toolkit-multi-target-damage-blocked", Kn = "data-paranormal-toolkit-multi-target-damage-target-name", Yn = "data-paranormal-toolkit-multi-target-damage-applied-at", Qn = "data-paranormal-toolkit-multi-target-effect-condition-id", Zn = "data-paranormal-toolkit-multi-target-effect-condition-label", Xn = "data-paranormal-toolkit-multi-target-effect-effect-id", Jn = "data-paranormal-toolkit-multi-target-effect-created", er = "data-paranormal-toolkit-multi-target-effect-refreshed", tr = "data-paranormal-toolkit-multi-target-effect-target-name", nr = "data-paranormal-toolkit-multi-target-effect-applied-at", ag = new ms(ys()), og = new ls(new ss()), ig = new cs(new Nr()), sg = new Np(ig), lg = new vp(og), cg = new Pp(ag), ug = Is, Oe = Fr, lt = Br, dg = Cs;
function mg(e) {
  const t = Hs(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Tg(e);
  const n = Rg(e.rollCard, t), r = wg(e.rollCard, t);
  !n && r && oh(e.rollCard, r, e.effectSection);
  const a = Sg(e.rollCard);
  return Ys(a, t), nh(
    e.rollCard,
    a,
    kg(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && ih(e.rollCard, r, a), !0;
}
function Hs(e) {
  return rp({
    ...e,
    resistanceResults: gg(e.rollCard),
    damageApplications: hg(e.rollCard),
    effectApplications: yg(e.rollCard),
    resolveTargetConditionApplication: fg,
    resistanceGateMode: Wr()
  });
}
function fg(e, t, n) {
  const r = Yp(e), a = Ls(r);
  if (!a) return null;
  const o = ot(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = pg(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function pg(e, t, n) {
  const r = Sf(
    e,
    n,
    t,
    hn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = hn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => hn(s) === a)) ?? null : null;
}
function gg(e) {
  const t = Gp(e);
  for (const [n, r] of _g(e))
    t.set(n, r);
  return t;
}
function hg(e) {
  const t = Vp(e);
  for (const [n, r] of Ag(e))
    t.set(n, r);
  return t;
}
function yg(e) {
  const t = Wp(e);
  for (const [n, r] of bg(e))
    t.set(n, r);
  return t;
}
function bg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = n.getAttribute(Qn), o = n.getAttribute(Zn), s = n.getAttribute(Xn), l = so(n.getAttribute(Jn)), c = so(n.getAttribute(er)), u = n.getAttribute(tr), m = n.getAttribute(nr);
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
function Ag(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = n.getAttribute(Hn), o = ol(n.getAttribute(Wn)), s = n.getAttribute(Kn), l = n.getAttribute(Yn);
    !r || !ch(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function _g(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = ol(n.getAttribute(Un)), o = n.getAttribute(zn), s = n.getAttribute(qn), l = n.getAttribute(Gn), c = n.getAttribute(jn), u = n.getAttribute(Vn);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute($t),
      rolledAt: u
    });
  }
  return t;
}
function Tg(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Rg(e, t) {
  if (!t.damage)
    return Ws(e)?.remove(), null;
  const n = $g(e);
  return Eg(n, t.damage), Cg(e, n), n;
}
function wg(e, t) {
  if (!t.effect)
    return al(e)?.remove(), null;
  const n = rh(e);
  return ah(n, t.effect), n;
}
function kg(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : st(e, "Conjuração");
}
function $g(e) {
  const t = Ws(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Vr, "true"), n;
}
function Ws(e) {
  return e.querySelector(`[${Vr}="true"]`);
}
function Eg(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Ks(t.formula, t.total, t.diceBreakdown));
}
function Ks(e, t, n, r = !1) {
  const a = Qf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Ig(a, r), a;
}
function Ig(e, t) {
  const n = e.querySelector(Vt), r = e.querySelector(vr);
  if (!n || !r) return;
  e.classList.toggle(Dr, t), n.hidden = !t, r.classList.add(Pr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Cg(e, t) {
  const n = st(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Sg(e) {
  const t = e.querySelector(`[${Bn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Bn, "true"), n;
}
function Ys(e, t) {
  const n = Lg(e), r = vg(t.resistance), a = [Dg(t)];
  r && a.push(r), a.push(xg(t, n)), e.replaceChildren(...a);
}
function Lg(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${x}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(x)).filter(lh)
  );
}
function Dg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Ng(e.targets), t.append(n, r), t;
}
function vg(e) {
  const t = Os({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Pg(n, t), n;
}
function Pg(e, t) {
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
function Ng(e) {
  const t = e.length, n = e.filter((l) => l.state === lt).length, r = e.filter((l) => l.state === Oe).length, a = e.filter((l) => l.state === ug).length, o = e.filter((l) => l.state === dg).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function xg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Og(r, e, t.has(r.id)));
  return n;
}
function Og(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(x, e.id), r.setAttribute(rg, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Qs(r, e.resistanceResult), Zs(r, e.damageApplication), Xs(r, e.effectApplication);
  const a = Mg(e, t, r), o = Xg(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    io(s.target) || oo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || io(s.target) || (s.preventDefault(), oo(r));
  }), r.append(a, o), r;
}
function Qs(e, t) {
  if (!t) {
    e.removeAttribute(Un), e.removeAttribute(zn), e.removeAttribute($t), e.removeAttribute(qn), e.removeAttribute(Gn), e.removeAttribute(jn), e.removeAttribute(Vn);
    return;
  }
  e.setAttribute(Un, String(t.total)), e.setAttribute(zn, t.formula), e.setAttribute(qn, t.skill), e.setAttribute(Gn, t.skillLabel), e.setAttribute(jn, t.targetName), e.setAttribute(Vn, t.rolledAt), t.diceBreakdown ? e.setAttribute($t, t.diceBreakdown) : e.removeAttribute($t);
}
function Zs(e, t) {
  if (!t) {
    e.removeAttribute(Hn), e.removeAttribute(Wn), e.removeAttribute(ro), e.removeAttribute(ao), e.removeAttribute(Kn), e.removeAttribute(Yn);
    return;
  }
  e.setAttribute(Hn, t.mode), e.setAttribute(Wn, String(t.inputAmount)), e.removeAttribute(ro), e.removeAttribute(ao), e.setAttribute(Kn, t.targetName), e.setAttribute(Yn, t.appliedAt);
}
function Xs(e, t) {
  if (!t) {
    e.removeAttribute(Qn), e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Jn), e.removeAttribute(er), e.removeAttribute(tr), e.removeAttribute(nr);
    return;
  }
  e.setAttribute(Qn, t.conditionId), e.setAttribute(Zn, t.conditionLabel), e.setAttribute(Xn, t.effectId ?? ""), e.setAttribute(Jn, String(t.created)), e.setAttribute(er, String(t.refreshed)), e.setAttribute(tr, t.targetName), e.setAttribute(nr, t.appliedAt);
}
function Mg(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Fg(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Bg(e, t.resistance);
  Gg(l, n, e, t);
  const c = Zg(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), nl(u, [
    Js(e, t, "compact"),
    tl(e, t, "compact")
  ]), r.append(a, u), r;
}
function Fg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Bg(e, t) {
  if (!he())
    return Ug(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", qg(e, t)), t?.skill && (n.setAttribute(tg, t.skill), n.setAttribute(ng, t.skillLabel ?? me(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Oe ? "✓" : e.state === lt ? "✕" : "", n.append(r, a), n;
}
function Ug(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", zg(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Oe ? "✓" : e.state === lt ? "✕" : "", n.append(r, a), n;
}
function zg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Oe ? "sucesso" : e.state === lt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function qg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Oe ? "sucesso" : e.state === lt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Gg(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !he() || e.addEventListener("click", (a) => {
    a.stopPropagation(), jg(t, e, n, r);
  });
}
async function jg(e, t, n, r) {
  if (!he()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? me(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = zr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await sg.execute({ actor: l, skill: o, skillLabel: s });
    await sh(u.roll);
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
    Qs(e, m);
    try {
      await jp(r.rollCard, m);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", h);
    }
    Hr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Hr(e) {
  const t = e.closest(`[${Bn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Hs({
    rollCard: n,
    damageSection: Vg(n) ?? st(n, "Dano"),
    effectSection: Hg(n)
  });
  r && Ys(t, r);
}
function Vg(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Vr) !== "true") ?? null;
}
function Hg(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Wg(e) {
  return xe(e.assistedActions.policy.damageActionState);
}
function Kg(e) {
  return xe(e.assistedActions.policy.effectActionState);
}
function Wr() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
function Js(e, t, n) {
  if (e.damageApplication)
    return G(
      "✓",
      Ps({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (xe(r))
    return G(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = el(a, t.damage);
  if (o === null)
    return G(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Dp({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = G(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const h = u.closest(`[${x}]`);
    h && Yg(h, u, e, t);
  }), u;
}
function el(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Yg(e, t, n, r) {
  if (n.damageApplication) return;
  if (Wg(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = el(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = zr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await lg.execute({
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
    Zs(e, m);
    try {
      await Hp(r.rollCard, m);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", h);
    }
    try {
      await Cp(u.value);
    } catch (h) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", h);
    }
    Hr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function tl(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (!a)
    return G(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return G(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (xe(r))
    return G(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Ts(r))
    return G(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = G(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${x}]`);
    l && Qg(l, o, e, t);
  }), o;
}
async function Qg(e, t, n, r) {
  if (n.effectApplication) return;
  if (Kg(n)) {
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
  const o = zr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await cg.execute({
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
    Xs(e, c);
    try {
      await Kp(r.rollCard, c);
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
function nl(e, t) {
  for (const n of t)
    n && e.append(n);
}
function G(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function Zg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(js, "true"), t.setAttribute("aria-hidden", "true"), rl(e, t), t;
}
function oo(e) {
  const t = e.querySelector(`[${Vs}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${js}="true"]`);
  r && rl(e, r);
}
function rl(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function io(e) {
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
function Xg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Vs, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Jg(e, t.resistance);
  s && r.append(s);
  const l = eh(e, t.resistance), c = th(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Jg(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Oe ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function eh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Ks(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function th(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), nl(n, [
    Js(e, t, "full"),
    tl(e, t, "full")
  ]), n;
}
function nh(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function rh(e) {
  const t = al(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Gs, "true"), n;
}
function al(e) {
  return e.querySelector(`[${Gs}="true"]`);
}
function ah(e, t) {
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
function oh(e, t, n) {
  const r = n?.parentElement === e ? n : st(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function ih(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function hn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function sh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function lh(e) {
  return typeof e == "string" && e.length > 0;
}
function ch(e) {
  return e === "normal" || e === "half";
}
function so(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ol(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const lo = "data-paranormal-toolkit-card-layout-refresh-bound";
function uh(e) {
  const t = e.rollCard.querySelector(jt);
  t && t.getAttribute(lo) !== "true" && (t.setAttribute(lo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Ee = "data-paranormal-toolkit-prompt-id", dh = "apply-damage", mh = "data-paranormal-toolkit-multi-target-damage-info";
function fh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(mh) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function ph(e) {
  const t = hh(e);
  return t.find((n) => n.getAttribute(Op) === dh) ?? t.find((n) => xs(n) === "aplicar danos") ?? null;
}
function gh(e) {
  const t = il(e), n = co(t);
  return n || co(yh(e));
}
function co(e) {
  return e.find((t) => {
    const n = xs(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function hh(e) {
  const t = il(e);
  return t.length > 0 ? t : Kr(e);
}
function il(e) {
  const t = _h(e);
  return t ? Kr(e).filter((n) => Ah(n, t)) : [];
}
function yh(e) {
  const t = sl(e);
  if (!t) return [];
  const n = bh(e, t);
  return Kr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => ll(e, r)).filter((r) => !n || Th(r, n));
}
function Kr(e) {
  const t = sl(e);
  return t ? Array.from(t.querySelectorAll(xp)) : [];
}
function sl(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function bh(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && ll(e, n)) ?? null;
}
function Ah(e, t) {
  return e.getAttribute(Ee) === t ? !0 : Array.from(e.querySelectorAll(`[${Ee}]`)).some((n) => n.getAttribute(Ee) === t);
}
function _h(e) {
  return e.getAttribute(Ee) ?? e.querySelector(`[${Ee}]`)?.getAttribute(Ee) ?? null;
}
function ll(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Th(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Rh(e) {
  const t = cl(), n = Wt(e.rollCard).state, r = Mr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = xe(a), s = Ts(a);
  return e.applied ? je({
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
  }) : r.policy.canShowApplyEffect ? je(o ? {
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
  }) : je({
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
function je(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function wh(e) {
  const { rollCard: t } = e, n = Eh(), r = cl(), a = Wt(t).state, o = Mr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = xe(s), c = $h(e);
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
      summary: kh(a)
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
function kh(e) {
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
function $h(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Eh() {
  try {
    return Xu();
  } catch {
    return "assisted";
  }
}
function cl() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
const Ih = "data-paranormal-toolkit-damage-resolution-state", uo = "data-paranormal-toolkit-damage-icon-enhanced", Yr = "data-paranormal-toolkit-damage-original-label", Ch = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, ul = "Outra opção escolhida";
function Sh(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Bp(t, "Aplicar dano"), Lh(e, t);
}
function Lh(e, t) {
  const n = Array.from(t.querySelectorAll(Le)), r = fo(n, "normal"), a = fo(n, "half");
  if (!r || !a) {
    Dh(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  po(r, "normal"), po(a, "half");
  const o = wh({
    rollCard: e,
    normalButtonApplied: Lt(r),
    halfButtonApplied: Lt(a),
    normalButtonSkipped: rr(r),
    halfButtonSkipped: rr(a)
  });
  if (!o.canShowApplyDamage) {
    go(r), go(a), ho(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), mo(r, o.normalButton), mo(a, o.halfButton), ho(t, o.summary.state, o.summary.message);
}
function mo(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Ph(e, t.visible), Nh(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function Dh(e) {
  for (const t of e)
    rr(t) && t.remove();
}
function Lt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(ul);
}
function rr(e) {
  return e.textContent?.includes(ul) ?? !1;
}
function fo(e, t) {
  const n = Ch[t];
  return e.find((r) => n.test(vh(r))) ?? null;
}
function vh(e) {
  return [
    e.getAttribute(Yr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function po(e, t) {
  if (e.getAttribute(uo) === "true") return;
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
  ), e.setAttribute(uo, "true"), e.setAttribute(Yr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ye(n));
}
function go(e) {
  Lt(e) || e.remove();
}
function Ph(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function Nh(e, t, n, r = "Role resistência") {
  if (!Lt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ye(r));
      return;
    }
    e.removeAttribute("aria-disabled"), xh(e, n);
  }
}
function xh(e, t) {
  const n = e.getAttribute(Yr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Oh(t), ye(n)));
}
function Oh(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function ho(e, t, n) {
  e.setAttribute(Ih, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(qr)?.after(a);
}
const et = "data-paranormal-toolkit-effect-icon-enhanced", De = "data-paranormal-toolkit-effect-action-compacted", Yt = "data-paranormal-toolkit-effect-resistance-gate", Qr = "data-paranormal-toolkit-effect-section", Zr = "data-paranormal-toolkit-effect-label";
function Mh(e) {
  return e.querySelector(`[${Qr}="true"]`);
}
function Fh(e) {
  const t = Uh(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? qh(), r = Zh(n, e.sourceActions, t);
  return r && n.setAttribute(Zr, r), Gh(n, t, r), Yh(e.rollCard, n, e.after ?? e.fallbackAfter), Qh(e.sourceActions, n), n;
}
function Bh(e, t) {
  const n = t.querySelector(Le);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = pl(t, n, r), o = dl(e, n), s = Rh({
    rollCard: e,
    effectLabel: a,
    applied: Jr(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Se(o) === "success" || Se(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? _s(o) : !1
  });
  if (s.applied) {
    Jh(n);
    return;
  }
  if (!s.visible) {
    ey(n);
    return;
  }
  if (s.waitingForResistance) {
    ty(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    ny(n, s.compactLabel);
    return;
  }
  ry(n), fl(n, s.displayLabel);
}
function Uh(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Le) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Le) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : zh(e.rollCard, r) ?? r[0] ?? null;
}
function zh(e, t) {
  const n = Wt(e).state, r = bs(n), a = ml(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = dl(e, o, a);
    if (s && As(s, r)) return o;
  }
  return null;
}
function dl(e, t, n = ml(e)) {
  const r = Xr(t, t.textContent?.trim() ?? ""), a = Fn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Fn(s) === a)) ?? null : null;
}
function ml(e) {
  const t = Ls(Mf(e));
  if (!t) return [];
  const n = ot(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function qh() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Qr, "true"), e;
}
function Gh(e, t, n) {
  e.setAttribute(Qr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = jh(e), a = Vh(r);
  a.textContent = "Efeito";
  const o = Hh(e, r), s = Wh(o);
  s.textContent = ay(n ?? pl(e, t, t.textContent?.trim() ?? ""));
  const l = Kh(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Le)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Jr(t, c) && !Xh(t, c) && fl(t, n ?? c);
}
function jh(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Vh(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Hh(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function Wh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function Kh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function Yh(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Qh(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Le)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function Zh(e, t, n) {
  const r = e.getAttribute(Zr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Xr(n, n.textContent?.trim() ?? "");
}
function Xr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && J(n) !== "efeito aplicado") return n;
  const r = Ff(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && J(a) !== "aplicado" ? a : null;
}
function Jr(e, t) {
  return e.classList.contains(Mp) || J(t).includes("aplicado");
}
function Xh(e, t) {
  const n = e.getAttribute(Yt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Fn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function fl(e, t) {
  e.getAttribute(De) === "true" && e.getAttribute(et) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(De, "true"), e.setAttribute(et, "true"), e.setAttribute(Fp, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Gr("✦", `${i}__button-icon--effect`),
    ye("Aplicar")
  ));
}
function Jh(e) {
  e.getAttribute(De) === "true" && J(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(De, "true"), e.setAttribute(et, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Gr("✓", `${i}__button-icon--effect-applied`),
    ye("Aplicado")
  ));
}
function pl(e, t, n) {
  const r = e.getAttribute(Zr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Xr(t, n) ?? n;
}
function ey(e) {
  Jr(e, e.textContent?.trim() ?? "") || e.remove();
}
function ty(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(De), e.removeAttribute(et), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Yt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ye(t));
}
function ny(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(De), e.removeAttribute(et), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Yt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Gr("✓", `${i}__button-icon--effect-resisted`),
    ye(t)
  );
}
function ry(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Yt), e.removeAttribute("aria-disabled");
}
function ay(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const oy = "data-paranormal-toolkit-card-layout-normalized";
function iy(e) {
  const t = sy(e.rollCard), n = ly(t);
  return uh({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function sy(e) {
  return {
    rollCard: e,
    damageSection: fh(e),
    resistance: e.querySelector(Lr),
    damageActions: ph(e),
    effectActionSource: gh(e),
    effectSection: Mh(e)
  };
}
function ly(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(oy, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = st(t, "Conjuração"), c = cy({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), Sh(t, a));
  const u = Fh({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: uy(n, c),
    fallbackAfter: l
  });
  return u && Bh(t, u), u;
}
function cy(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function uy(e, t) {
  return e ?? t;
}
const gl = [0, 80, 180, 400, 900, 1600, 3e3], yo = /* @__PURE__ */ new WeakSet();
function dy(e) {
  hl(e), my(e);
}
function hl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    yl(t);
}
function my(e) {
  if (!yo.has(e)) {
    yo.add(e);
    for (const t of gl)
      globalThis.setTimeout(() => {
        hl(e);
      }, t);
  }
}
function yl(e) {
  const t = iy({
    rollCard: e,
    refreshDelaysMs: gl,
    onRefresh: () => yl(e)
  });
  mg({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const fy = "data-paranormal-toolkit-resistance-roll-result-enhanced", bo = "data-paranormal-toolkit-resistance-original-description", py = "data-paranormal-toolkit-resistance-skill", gy = "data-paranormal-toolkit-resistance-skill-label", hy = `${i}__resistance--without-roll-button`, yy = ["Fortitude", "Reflexos", "Vontade"];
function by(e) {
  for (const t of Array.from(e.querySelectorAll(Lr)))
    Ay(t);
  dy(e);
}
function Ay(e) {
  const t = e.querySelector(wd), n = e.querySelector(ts), r = e.querySelector(jt), a = ky(r) ? r : null, o = e.querySelector(ns);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(hy, !a);
  const s = wy(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), Iy(o)), _y(e, r, n), a && (vy(a), a.parentElement !== e && e.append(a));
}
function _y(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = Ry(n), o = Os({
    description: a,
    skillLabel: $y(t, a),
    difficulty: Or(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  Ty(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function Ty(e, t) {
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
function Ry(e) {
  const t = e.getAttribute(bo);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(bo, n), n;
}
function wy(e, t) {
  const n = e.querySelector(`.${Ba}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Ba), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function ky(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function $y(e, t) {
  const n = e?.getAttribute(gy) ?? e?.getAttribute(py) ?? null;
  return n || Ey(t);
}
function Ey(e) {
  const t = Ao(e);
  return yy.find((n) => t.startsWith(Ao(n))) ?? null;
}
function Ao(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function Iy(e) {
  const t = Cy(e.textContent ?? "");
  t && (e.setAttribute(fy, "true"), e.replaceChildren(Dy(t)));
}
function Cy(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Sy(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Sy(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Ly(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Ly(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Dy(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Py(e);
  return r && t.append(r), t;
}
function vy(e) {
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
function Py(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Ny(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Ny(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? _o(e, "highest") : n.includes("kl") ? _o(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function _o(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function To(e) {
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
  const n = xy(e, t);
  return Et(n);
}
function xy(e, t) {
  return t.split(".").reduce((n, r) => Qt(n) ? n[r] : null, e);
}
function Oy(e, t) {
  const n = e.indexOf(":");
  return n < 0 || tt(e.slice(0, n)) !== tt(t) ? null : Me(e.slice(n + 1));
}
function Et(e) {
  return typeof e == "string" ? Me(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Qt(e) {
  return !!e && typeof e == "object";
}
function My(e) {
  return typeof e == "string";
}
function Zt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Me(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function tt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function ar(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ee(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function bl(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Fy(e) {
  for (const t of Array.from(e.querySelectorAll(_d))) {
    const n = Vy(t);
    By(t), n && (Uy(t, n), zy(t, n));
  }
}
function By(e) {
  for (const t of Array.from(e.querySelectorAll(Td)))
    t.remove();
}
function Uy(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(es) ?? null, a = r?.querySelector(Ad) ?? null, o = r ?? e, s = o.querySelector(Ed);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = lb(t.elementTone), l.textContent = sb(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function zy(e, t) {
  const n = qy(e);
  Gy(e, n);
  const r = jy(t);
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
  const o = e.querySelector(rs);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function qy(e) {
  return e.closest(`.${i}`)?.querySelector(es) ?? null;
}
function Gy(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Id)))
      a.remove();
}
function jy(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ar(e.target)}` : null,
    e.duration ? `Duração: ${ar(e.duration)}` : null,
    e.resistance ? `Resistência: ${bl(e.resistance)}` : null
  ].filter(Zt);
}
function Vy(e) {
  const t = Hy(e), n = Xy(e), a = (t ? Zy(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = ta(B(a, "element")), l = W("op.elementChoices", s) ?? Ro(le(o, "Elemento")) ?? Ro(n.damageType), c = s ?? cb(l), u = B(a, "circle") ?? le(o, "Círculo"), m = tb(a) ?? le(o, "Alvo"), h = ob(a, "duration", "op.durationChoices") ?? le(o, "Duração"), w = Jy(e) ?? rb(a) ?? le(o, "Resistência"), T = eb(o) ?? n.cost, _ = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: T,
    target: m,
    duration: h,
    resistance: w
  };
  return ib(_) ? _ : null;
}
function Hy(e) {
  const t = Wy(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Gt), r = Yy(n);
  if (r.length === 0) return null;
  const a = Ky(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Wy(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? ea()?.messages?.get?.(n) ?? null : null;
}
function Ky(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Fa}]`))) {
    const a = r.getAttribute(Fa)?.trim();
    a && n.add(a);
  }
  return n;
}
function Yy(e) {
  if (!Qt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Qy).filter((n) => n !== null) : [];
}
function Qy(e) {
  return Qt(e) ? {
    pendingId: Et(e.pendingId),
    actorId: Et(e.actorId),
    itemId: Et(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(My) : []
  } : null;
}
function Zy(e) {
  if (!e.itemId) return null;
  const t = ea(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Xy(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Rd))) {
    const a = Me(r.textContent);
    if (!a) continue;
    const o = Oy(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function Jy(e) {
  const t = Me(e.querySelector(ts)?.textContent);
  return t ? bl(t) : null;
}
function le(e, t) {
  const n = tt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || tt(r.slice(0, a)) !== n))
      return Me(r.slice(a + 1));
  }
  return null;
}
function eb(e) {
  const t = le(e, "Custo") ?? le(e, "PE");
  return t || (e.map(Me).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function tb(e) {
  const t = B(e, "target");
  if (!t) return null;
  if (t === "area")
    return nb(e) ?? W("op.targetChoices", t) ?? "Área";
  const n = W("op.targetChoices", t) ?? ee(t);
  return [t === "people" || t === "creatures" ? B(e, "targetQtd") : null, n].filter(Zt).join(" ");
}
function nb(e) {
  const t = B(e, "area.name"), n = B(e, "area.size"), r = B(e, "area.type"), a = t ? W("op.areaChoices", t) ?? ee(t) : null, o = r ? W("op.areaTypeChoices", r) ?? ee(r) : null;
  return a ? n ? o ? `${a} ${n}m ${ar(o)}` : `${a} ${n}m` : a : null;
}
function rb(e) {
  const t = B(e, "skillResis"), n = B(e, "resistance");
  if (!t || !n) return null;
  const r = W("op.skill", t) ?? ee(t), a = ab(n);
  return [r, a].filter(Zt).join(" ");
}
function ab(e) {
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
function ob(e, t, n) {
  const r = B(e, t);
  return r ? W(n, r) ?? ee(r) : null;
}
function ib(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function sb(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function lb(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Zt).join(" ");
}
function ta(e) {
  const t = tt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Ro(e) {
  const t = ta(e);
  return t ? W("op.elementChoices", t) ?? ee(t) : e ? ee(e) : null;
}
function cb(e) {
  return ta(e);
}
function W(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = ea()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const wo = "data-paranormal-toolkit-dice-toggle-enhanced";
function ub(e) {
  for (const t of Array.from(e.querySelectorAll(as)))
    Al(t);
}
function db(e) {
  const t = Tl(e.target);
  if (!t) return;
  const n = na(t);
  n && (e.preventDefault(), _l(n, t));
}
function mb(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Tl(e.target);
  if (!t) return;
  const n = na(t);
  n && (e.preventDefault(), _l(n, t));
}
function Al(e) {
  const t = e.querySelector(Vt);
  if (!t) return;
  const n = e.querySelector(vr);
  if (n && n.getAttribute(wo) !== "true" && (n.setAttribute(wo, "true"), n.classList.add(Pr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function _l(e, t) {
  const n = e.querySelector(Vt);
  if (!n) return;
  const r = !e.classList.contains(Dr);
  fb(e, t, n, r);
}
function fb(e, t, n, r) {
  e.classList.toggle(Dr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Tl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(vr);
  if (!t) return null;
  const n = na(t);
  return n ? (Al(n), t.classList.contains(Pr) ? t : null) : null;
}
function na(e) {
  const t = e.closest(as);
  return t && t.querySelector(Vt) ? t : null;
}
const ko = `${d}-workflow-dice-toggle-styles`;
function pb() {
  if (document.getElementById(ko)) return;
  const e = document.createElement("style");
  e.id = ko, e.textContent = `
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
const gb = [0, 100, 500, 1500, 3e3];
let $o = !1, yn = null;
function hb() {
  if (!$o) {
    $o = !0, pb(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ye(To(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ye(To(t));
    }), Hooks.once("ready", () => {
      Ye(document), yb();
    }), document.addEventListener("click", db), document.addEventListener("keydown", mb);
    for (const e of gb)
      globalThis.setTimeout(() => Ye(document), e);
  }
}
function yb() {
  yn || !document.body || (yn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ye(n);
  }), yn.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ye(e) {
  e && (Vd(e), Fy(e), by(e), ub(e), Md(e));
}
function bb() {
  hb();
}
const Ab = "data-paranormal-toolkit-action-section", _b = "ritual-log", Tb = ".paranormal-toolkit-item-use-prompt__actions", Rb = ".paranormal-toolkit-item-use-prompt__actions-title", wb = [0, 100, 500, 1500];
let Eo = !1;
function kb() {
  if (Eo) return;
  const e = (t, n) => {
    Io(Cb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Io(document), Eo = !0;
}
function Io(e) {
  for (const t of wb)
    globalThis.setTimeout(() => $b(e), t);
}
function $b(e) {
  Eb(e), Ib(e);
}
function Eb(e) {
  for (const t of e.querySelectorAll(
    `[${Ab}="${_b}"]`
  ))
    t.remove();
}
function Ib(e) {
  for (const t of e.querySelectorAll(Tb)) {
    if (Co(t.querySelector(Rb)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Co(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function Cb(e) {
  if (e instanceof HTMLElement || Sb(e))
    return e;
  if (Lb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Sb(e) {
  return e instanceof HTMLElement;
}
function Lb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Co(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Qe = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Rl = {
  PV: "system.attributes.hp"
}, or = {
  PV: [Qe.PV, Rl.PV],
  SAN: [Qe.SAN],
  PE: [Qe.PE],
  PD: [Qe.PD]
}, ir = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Db {
  getResource(t, n) {
    const r = So(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = Do(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = Do(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = So(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function So(e, t) {
  const n = vb(e.type, t);
  if (n && Lo(e, n))
    return y(n);
  const r = or[t].find(
    (a) => Lo(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Pb(e, t),
    path: or[t].join(" | ")
  });
}
function vb(e, t) {
  return e === "threat" ? Rl[t] ?? null : e === "agent" ? Qe[t] : null;
}
function Lo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Pb(e, t) {
  const n = e.type ?? "unknown", r = or[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Do(e, t, n, r, a) {
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
class Nb {
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
      const s = ir.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = xb(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of ir.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function xb(e) {
  if (vo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (vo(n))
      return n;
  }
  return null;
}
function vo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ob = "dice-so-nice";
async function wl(e) {
  if (!Mb() || !Fb()) return;
  const t = Bb();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Mb() {
  try {
    return bd().enabled;
  } catch {
    return !1;
  }
}
function Fb() {
  return game.modules?.get?.(Ob)?.active === !0;
}
function Bb() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Po = "occultism";
class kl {
  getDifficulty(t) {
    return Ub(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await qb(t, Po);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await wl(r);
    const a = Vb(r);
    return {
      skill: Po,
      skillLabel: "Ocultismo",
      roll: r,
      formula: jb(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: Hb(r)
    };
  }
}
function Ub(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function zb(e) {
  return new kl().rollCastingCheck(e);
}
async function qb(e, t) {
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
  return Gb(r);
}
function Gb(e) {
  return No(e) ? e : Array.isArray(e) ? e.find(No) ?? null : null;
}
function No(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function jb(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Vb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Hb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Wb);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Wb(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Kb = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Yb {
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
    const r = n.value, a = Qb(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: Kb[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function Qb(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Zb(n) ? {
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
function Zb(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const bn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Xb(e) {
  if (!aA(e.item)) return null;
  const t = sr(e.actor) ? e.actor : Jb(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: tA(e.token) ?? eA(t),
    targets: Ir(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Jb(e) {
  const t = e;
  return sr(t.actor) ? t.actor : sr(e.parent) ? e.parent : null;
}
function eA(e) {
  const t = nA(e) ?? rA(e);
  return t ? $l(t) : null;
}
function tA(e) {
  return lr(e) ? $l(e) : null;
}
function nA(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return lr(n) ? n : (t.getActiveTokens?.() ?? []).find(lr) ?? null;
}
function rA(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function $l(e) {
  const t = e.actor ?? null;
  return {
    tokenId: An(e.id),
    actorId: An(t?.id),
    sceneId: An(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function aA(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function sr(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function lr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function An(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class oA {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(bn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${bn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Xb(iA(t));
    if (!n) {
      f.warn(`${bn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function iA(e) {
  return e && typeof e == "object" ? e : {};
}
class sA {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return _n("missing-item-patch");
    if (t.type !== "ritual") return _n("unsupported-item-type");
    const a = lA(r);
    return Object.keys(a).length === 0 ? _n("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function lA(e) {
  const t = {};
  D(t, "name", e.name), D(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (D(t, "system.circle", n.circle), D(t, "system.element", n.element), D(t, "system.target", n.target), D(t, "system.targetQtd", n.targetQuantity), D(t, "system.execution", n.execution), D(t, "system.range", n.range), D(t, "system.duration", n.duration), D(t, "system.skillResis", n.resistanceSkill), D(t, "system.resistance", n.resistance), D(t, "system.studentForm", n.studentForm), D(t, "system.trueForm", n.trueForm)), t;
}
function D(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function _n(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class cA {
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
    return this.getNumber(t, ir.ritual.dt, 0);
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
class uA {
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
class dA {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = mA(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Tn(t)), y(t)) : n;
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
    return n ? Tn(n) : null;
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
    return Array.from(this.presets.values()).map(Tn);
  }
  findForItem(t) {
    return this.list().map((n) => fA(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function mA(e) {
  return !Rn(e.id) || !Rn(e.version) || !Rn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function fA(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = pA(a, t);
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
function pA(e, t) {
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
      const n = xo(t.name), r = e.names.map(xo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = gA(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function xo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function gA(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Tn(e) {
  return structuredClone(e);
}
function Rn(e) {
  return typeof e == "string" && e.length > 0;
}
function Dt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Xt(e.amountFrom);
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
function Xt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function hA(e, t, n) {
  if (!Oo(e.id) || !Oo(e.formula))
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
    await wl(a);
    const l = {
      ...n.rollRequests[e.id] ?? El(e, t),
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
function El(e, t) {
  const n = e.intent ?? yA(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function yA(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Oo(e) {
  return typeof e == "string" && e.length > 0;
}
async function vt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? yt(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? yt(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? yt(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? yt(t, n, r, a) : e.recover(t, n, a);
  }
}
function yt(e, t, n, r) {
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
function bA(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = AA(t, n, r, a);
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
    const s = _A(t, n, r, a);
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
function AA(e, t, n, r) {
  const a = Xt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Il(t.id, "damage", r, t.damageInstances.length),
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
function _A(e, t, n, r) {
  const a = Xt(e.amountFrom);
  return {
    id: Il(t.id, "healing", r, t.healingInstances.length),
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
function Il(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function TA(e, t, n) {
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
function RA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Cl("before", e), Mo("before", e), Mo("resolve", e);
}
function wA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Cl("apply", e);
}
function kA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Cl(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = $A(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Mo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function $A(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function EA(e, t, n) {
  return y(void 0);
}
async function IA(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return CA(e, t);
    case "spendRitualCost":
      return SA(e, t);
  }
}
async function CA(e, t) {
  const { context: n, resources: r } = e, a = Dt(t, n);
  return a.ok ? Sl(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function SA(e, t) {
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
  }), Sl(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Sl(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function LA(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = DA(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function DA(e) {
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
class vA {
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
        return LA({
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
    const a = await IA({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = El(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await hA(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Dt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = TA(t, n, a.value);
    RA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), wA({
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
      const c = await vt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      bA({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return kA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Dt(t, n);
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
      const l = await vt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await EA(this.messages);
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
    const l = PA(t, n.intent);
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
function PA(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class NA {
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
class xA {
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
    return y({
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
class OA {
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
function Ll(e) {
  return {
    id: MA(),
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
function MA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class FA {
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
    return Re(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Ll(n);
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
class BA {
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
class UA {
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
      whisper: zA(),
      flags: {
        ...t.flags,
        [d]: {
          ...qA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = On();
    if (!r.enabled)
      return;
    const a = n.notification ?? Fo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Fo(n);
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
function Fo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function zA() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function qA(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const GA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Dl = `${d}-inline-roll-neutralized`, jA = `${d}-inline-roll-notice`, ra = `data-${d}-inline-roll-neutralized`, Bo = `data-${d}-inline-roll-notice`, VA = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Uo(e) {
  const t = o_(e.message), n = await HA(e.message), r = WA(t);
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
async function HA(e) {
  const t = n_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = KA(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await r_(t, n.content), replacementCount: n.replacementCount };
}
function WA(e) {
  const t = e ? a_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = vl(t);
  return n > 0 && Pl(JA(t)), { replacementCount: n };
}
function KA(e) {
  const t = YA(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = vl(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Pl(n.content), { content: n.innerHTML, replacementCount: a });
}
function YA(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, ZA(a.trim()))), replacementCount: t };
}
function vl(e) {
  const t = QA(e);
  for (const n of t)
    n.replaceWith(XA(e_(n)));
  return t.length;
}
function QA(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(GA))
    n.getAttribute(ra) !== "true" && t.add(n);
  return Array.from(t);
}
function ZA(e) {
  return `<span class="${Dl}" ${ra}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${i_(e)}</span>`;
}
function XA(e) {
  const t = document.createElement("span");
  return t.classList.add(Dl), t.setAttribute(ra, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Pl(e) {
  if (e.querySelector?.(`[${Bo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(jA), t.setAttribute(Bo, "true"), t.textContent = VA, e.append(t);
}
function JA(e) {
  return e.querySelector(".message-content") ?? e;
}
function e_(e) {
  const n = e.getAttribute("data-formula") ?? t_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function t_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function n_(e) {
  return e && typeof e == "object" ? e : null;
}
async function r_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function a_(e) {
  const t = s_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function o_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function i_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function s_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Pt = "ritualRollConfig", Nt = "ritual-roll", l_ = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
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
function Nl(e) {
  const t = e.getFlag(d, Pt);
  return cr(t);
}
function xl(e) {
  return Nl(e) ?? Jt();
}
async function c_(e, t) {
  const n = cr(t) ?? cr({
    ...Jt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Pt, n), n;
}
async function u_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Pt));
    return;
  }
  await e.setFlag(d, Pt, null);
}
function cr(e) {
  if (!en(e)) return null;
  const t = __(e.intent);
  if (!t) return null;
  const n = Jt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: ur(e.damageType),
    utilityLabel: ur(e.utilityLabel) ?? n.utilityLabel,
    note: aa(e.note),
    forms: R_(e.forms)
  };
}
function d_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function m_(e) {
  const t = Nl(e), n = Ol(e);
  if (!t)
    return zo(e, n);
  const r = b_(e, t);
  if (!r)
    return zo(e, n);
  const a = f_(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...p_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: h_(e, t),
    resistance: n
  };
}
function zo(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: y_(e),
    resistance: t
  } : null;
}
function f_(e, t) {
  const n = {
    type: "rollFormula",
    id: Nt,
    formula: t,
    intent: A_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function p_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Nt}.total`,
          ...g_(e.damageType)
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
function g_(e) {
  return e ? { damageType: e } : {};
}
function h_(e, t) {
  const n = {
    base: wn("Padrão", t.forms.base.formula)
  };
  return ve(e, "discente") && (n.discente = wn("Discente", t.forms.discente.formula, 2)), ve(e, "verdadeiro") && (n.verdadeiro = wn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function wn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Nt]: t.trim()
    }
  };
}
function y_(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return ve(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), ve(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function b_(e, t) {
  return [
    t.forms.base.formula.trim(),
    ve(e, "discente") ? t.forms.discente.formula.trim() : "",
    ve(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Ol(e) {
  const t = Ml(e), n = ur(t.skillResis), r = T_(t.resistance);
  if (!n || !r) return;
  const a = w_(n), o = l_[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function A_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function __(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function T_(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function R_(e) {
  const t = Jt();
  return en(e) ? {
    base: kn(e.base),
    discente: kn(e.discente),
    verdadeiro: kn(e.verdadeiro)
  } : t.forms;
}
function kn(e) {
  return en(e) ? { formula: aa(e.formula) } : { formula: "" };
}
function ve(e, t) {
  const n = Ml(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return k_(r);
}
function Ml(e) {
  const t = e.system;
  return en(t) ? t : {};
}
function w_(e) {
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
function k_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function aa(e) {
  return typeof e == "string" ? e.trim() : "";
}
function ur(e) {
  const t = aa(e);
  return t.length > 0 ? t : null;
}
function en(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function $_(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function E_(e) {
  switch (I_(e)) {
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
      return C_(String(e ?? ""));
  }
}
function I_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function C_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function S_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function L_(e) {
  return {
    ...oa(e),
    type: "ritual.cast.started"
  };
}
function D_(e) {
  return {
    ...oa(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function v_(e) {
  return {
    ...oa(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function P_(e) {
  if (e.type === "preset") {
    const t = de(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: de(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: de(e.label),
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
function N_(e, t = {}) {
  const n = Y_(e), r = [
    ...Z_(t.candidates ?? []),
    ...X_(e)
  ], a = eT(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = Q_(t) ?? tT(r) ?? rT(a), s = oT(canvas?.grid?.size), l = x_(o, a, r), c = G_(r), u = q_(l);
  return {
    type: "rectangleRay",
    sceneId: aT(e, n),
    regionId: Ko(n?.id) ?? Ko(e.id),
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
function x_(e, t, n) {
  const r = {
    x: $(e, "x") ?? 0,
    y: $(e, "y") ?? 0,
    width: $(e, "width") ?? t.width,
    height: $(e, "height") ?? t.height,
    direction: $(e, "direction") ?? 0,
    elevation: $(e, "elevation")
  };
  return {
    ...r,
    direction: O_(r, t, n)
  };
}
function O_(e, t, n) {
  const r = M_(n);
  return r !== null ? r : B_(e, t) ?? e.direction;
}
function M_(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = qo(n, t);
    if (r !== null) return r;
    const a = tn(n), o = qo(a, t);
    if (o !== null) return o;
  }
  return null;
}
function qo(e, t) {
  for (const n of t) {
    const r = F_(N(e, n));
    if (r !== null) return r;
  }
  return null;
}
function F_(e) {
  const t = nt(e);
  if (t === null) return null;
  const n = sa(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function B_(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = jo(Go(e, e.direction), t), r = U_(e, t);
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
    error: jo(Go(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? sa(o.direction) : null;
}
function U_(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Yo(o, 0, 1), c = Yo(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : iT(Math.atan2(c, l));
}
function Go(e, t) {
  const n = Bl(t), r = {
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
  ], s = o.map((w) => w.x), l = o.map((w) => w.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), h = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: h - m
  };
}
function jo(e, t) {
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
function q_(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Bl(e.direction), n = {
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
function G_(e) {
  for (const t of e) {
    const n = Vo(t, "ray.start"), r = Vo(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Vo(e, t) {
  const n = N(e, t), r = nt(N(n, "x")), a = nt(N(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function oa(e) {
  const t = P_(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: H_(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: j_(e.context.item, e.form, e.formLabel, t),
    targets: n.map(W_),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function j_(e, t, n, r) {
  return {
    name: e.name,
    slug: $n(e, "system.slug") ?? $n(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: $n(e, "system.element"),
    circle: K_(e),
    form: V_(t),
    formLabel: n
  };
}
function V_(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function H_(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function W_(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function K_(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : de(t);
}
function $n(e, t) {
  return de(foundry.utils.getProperty(e, t));
}
function de(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function Y_(e) {
  return "document" in e && e.document ? e.document : e;
}
function Q_(e) {
  return Fl(e.shape);
}
function Z_(e) {
  return e.filter(ia);
}
function X_(e) {
  return [
    e,
    J_(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(ia);
}
function J_(e) {
  return "object" in e && ia(e.object) ? e.object : null;
}
function ia(e) {
  return !!(e && typeof e == "object");
}
function eT(e) {
  for (const t of e) {
    const n = Ho(N(tn(t), "bounds"));
    if (n) return n;
    const r = Ho(N(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function Ho(e) {
  const t = $(e, "x"), n = $(e, "y"), r = $(e, "width"), a = $(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function $(e, t) {
  return nt(N(e, t));
}
function tT(e) {
  for (const t of e) {
    const n = nT(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function nT(e) {
  if (!e || typeof e != "object") return [];
  const t = Wo(tn(e));
  return t.length > 0 ? t : Wo(e);
}
function Wo(e) {
  const t = N(e, "shapes");
  return Array.isArray(t) ? t.map(Fl).filter((n) => n !== null) : [];
}
function Fl(e) {
  const t = tn(e) ?? e, n = N(t, "type");
  return typeof n != "string" ? null : {
    type: n,
    x: $(t, "x"),
    y: $(t, "y"),
    width: $(t, "width"),
    height: $(t, "height"),
    direction: $(t, "direction"),
    elevation: $(t, "elevation")
  };
}
function rT(e) {
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
function aT(e, t) {
  return En(e, "parent.id") ?? En(e, "document.parent.id") ?? En(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function En(e, t) {
  return de(N(e, t));
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
function Ko(e) {
  return de(e);
}
function nt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function oT(e) {
  const t = nt(e);
  return t !== null && t > 0 ? t : null;
}
function Bl(e) {
  return e * Math.PI / 180;
}
function iT(e) {
  return e * 180 / Math.PI;
}
function sa(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Yo(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class sT {
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
const lT = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class cT {
  constructor(t = new nn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = uT(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(lT);
  }
}
function uT(e, t) {
  const n = [], r = dT(e), a = Qo(r), o = Qo(e);
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
function dT(e) {
  return mT(e) ? e.document ?? null : e;
}
function mT(e) {
  return "bounds" in e;
}
function Qo(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const fT = 100, pT = 12;
class gT {
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
      const a = this.foundryAdapter.getGridSize() ?? fT, o = _T(n), s = await this.foundryAdapter.placeRegion(
        hT(t, this.foundryAdapter.getUserColor(), a),
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
        message: AT(a)
      };
    }
  }
}
function hT(e, t, n) {
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
    shapes: [yT(e, n)]
  };
}
function yT(e, t) {
  const n = bT(e, t);
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
function bT(e, t) {
  return {
    length: Zo(e.length, pT, t),
    width: Zo(e.width, 1, t)
  };
}
function Zo(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function AT(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function _T(e) {
  const t = (n) => {
    const r = TT(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function TT(e) {
  return RT(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function RT(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class wT {
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
    this.applyTargets(Xo(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Xo(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = kT(t);
    $T(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Xo(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function kT(e) {
  return Array.from(new Set(e));
}
function $T(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class ET {
  constructor(t = new nn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(ji)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(IT(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(CT(t), "final");
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
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = LT(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function IT(e) {
  return [
    { source: "document", region: ue(e.document) },
    { source: "document.object", region: ue(e.document.object) },
    { source: "preview", region: ue(e.preview) },
    { source: "preview.document.object", region: ue(e.preview?.document?.object) }
  ];
}
function CT(e) {
  return [
    { source: "input", region: ue(e) },
    { source: "input.object", region: ST(e) ? ue(e.object) : null },
    { source: "input.document.object", region: Ul(e) ? ue(e.document?.object) : null }
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
  return bt(n.x) && bt(n.y) && bt(n.width) && bt(n.height);
}
function Ul(e) {
  return "document" in e && "bounds" in e;
}
function ST(e) {
  return !Ul(e);
}
function LT(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function bt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class DT {
  async minimizeForPlacement() {
    const t = [];
    for (const n of NT())
      await vT(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await PT(n);
      }
    };
  }
}
async function vT(e) {
  if (zl(e) || !qT(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function PT(e) {
  if (zl(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function NT() {
  const e = /* @__PURE__ */ new Set();
  for (const t of xT())
    FT(t) && BT(t) && e.add(t);
  return [...e];
}
function xT() {
  return [
    ...Jo(OT()),
    ...Jo(MT())
  ];
}
function Jo(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function OT() {
  return globalThis.ui?.windows ?? null;
}
function MT() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function FT(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function BT(e) {
  const t = UT(e), n = zT(t);
  return n === "Actor" || n === "Item";
}
function UT(e) {
  return e.document ?? e.object ?? null;
}
function zT(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function qT(e) {
  const t = GT(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function GT(e) {
  const t = e.element;
  if (ei(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (ei(n)) return n;
  }
  return null;
}
function ei(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function zl(e) {
  return e.minimized === !0;
}
const jT = "Nenhum alvo encontrado na linha.";
class VT {
  constructor(t = new gT(), n = new ET(), r = new cT(), a = new wT(), o = new sT(), s = new DT()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = WT(r), m = N_(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(jT), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = HT(c);
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
function HT(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function WT(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function KT(e) {
  return {
    header: {
      eyebrow: Di,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: nR(e.ritual)
    },
    forms: e.variantOptions.map((t) => YT(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: XT(e.targetNames, e.variantOptions, e.ritual),
    automation: tR(e.automationStatus ?? "assisted")
  };
}
function YT(e, t) {
  const n = QT(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? ZT(t) : "—",
    details: n
  };
}
function QT(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function ZT(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function XT(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => JT(a, n))
  };
}
function JT(e, t) {
  const n = e.targeting ?? eR(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function eR(e, t) {
  const n = ot(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function tR(e) {
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
function nR(e) {
  const t = e.system, n = [aR(t?.element), rR(t?.circle)].filter(sR);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function rR(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function aR(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (oR(e)) {
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
      return iR(e);
  }
}
function oR(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function iR(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function sR(e) {
  return typeof e == "string" && e.length > 0;
}
const ql = ["base", "discente", "verdadeiro"];
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
  return typeof e == "string" && ql.includes(e);
}
const { ApplicationV2: lR } = foundry.applications.api;
class Xe extends lR {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = KT(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: Xe.onCast,
      cancel: Xe.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Xe(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    dR(a, (o) => {
      this.selectedVariant = o, mr(a, o);
    }), mr(a, this.selectedVariant), mR(a, (o) => {
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
          ${this.model.forms.map(cR).join("")}
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
          ${this.model.targets.forms.map(uR).join("")}
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
    const n = hR(t), r = fR(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function cR(e) {
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
function uR(e) {
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
function dR(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => ti(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), ti(e, a, t));
    });
  const r = Gl(e);
  r && t(r);
}
function ti(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !xt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Gl(e), mr(e, r.value));
}
function Gl(e) {
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
function mR(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function fR(e, t, n) {
  const r = gR(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = pR(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function pR(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function gR(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (xt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return xt(n) ? n : null;
}
function hR(e) {
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
async function yR(e) {
  return Xe.request(e);
}
const ca = {
  label: "Padrão"
}, bR = {
  label: "Discente",
  extraCost: 2
}, AR = {
  label: "Verdadeiro",
  extraCost: 5
};
class _R {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new VT();
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
    const a = this.resolveCostPreview(t), o = pw(n), s = dw(
      n,
      t.item,
      a,
      o
    ), l = await yR({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: a,
      defaultSpendResource: _w(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = TR(l), u = hw(
      n,
      t.item,
      c.variant,
      o
    ), m = S_(), h = u.label ?? la(c.variant), w = IR(u), T = (I = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: h,
      targets: I
    }), _ = (I, C = t.targets, be = {}) => {
      this.ritualEvents.emitCastFinished(
        v_({
          ...T(C),
          status: I,
          ...be
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      L_(T())
    );
    const E = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (E.status === "cancelled")
      return _("cancelled", t.targets, { reason: E.reason }), { status: "cancelled" };
    if (E.status === "failed")
      return _("failed", t.targets, {
        reason: E.reason,
        message: E.message
      }), {
        status: "failed",
        reason: E.reason,
        message: E.message
      };
    const A = RR(
      t,
      E.targets
    );
    E.areaSnapshot && this.ritualEvents.emitAreaResolved(
      D_({
        ...T(E.targets),
        area: E.areaSnapshot
      })
    );
    const qe = Qi();
    let q = null;
    if (qe) {
      const I = await kR(
        this.resources,
        A.actor,
        c,
        u,
        a
      );
      if (!I.ok)
        return _("failed", A.targets, {
          reason: I.reason,
          message: I.message
        }), {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      try {
        const C = await zb(
          A.actor
        );
        q = CR(
          C,
          u,
          a
        );
      } catch (C) {
        const be = C instanceof Error ? C.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return _("failed", A.targets, {
          reason: "ritual-casting-check-failed",
          message: be
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: be,
          cause: C
        };
      }
    }
    const Ge = wR(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !qe
      }
    );
    if (Ge.steps.length === 0) {
      const I = gw(
        A,
        c
      ), C = ri(
        n,
        A
      ), be = ni(
        A.actor,
        q,
        u,
        a
      ), wa = ai(
        n,
        c,
        u,
        a,
        I,
        A,
        q
      );
      if (!C.ok)
        return _("failed", A.targets, {
          reason: C.reason,
          message: C.message
        }), {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      const ka = [
        ...be,
        ...C.actions
      ];
      return ka.length > 0 ? (_("ready", A.targets), {
        status: "ready",
        workflowContext: I,
        itemUseContext: A,
        actions: ka,
        summaryLines: wa
      }) : (_("completed-without-actions", A.targets), {
        status: "completed-without-actions",
        workflowContext: I,
        itemUseContext: A,
        summaryLines: wa
      });
    }
    const O = await this.workflow.runAutomation(Ge, {
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
    if (!O.ok)
      return _("failed", A.targets, {
        reason: O.error.reason,
        message: O.error.message
      }), {
        status: "failed",
        reason: O.error.reason,
        message: O.error.message,
        cause: O.error
      };
    const ne = O.value.context, M = NR(
      n,
      A,
      ne,
      w
    ), Q = ri(
      n,
      A
    ), vc = ni(
      A.actor,
      q,
      u,
      a
    ), Ta = ai(
      n,
      c,
      u,
      a,
      ne,
      A,
      q
    );
    if (!M.ok)
      return _("failed", A.targets, {
        reason: M.reason,
        message: M.message
      }), {
        status: "failed",
        reason: M.reason,
        message: M.message
      };
    if (!Q.ok)
      return _("failed", A.targets, {
        reason: Q.reason,
        message: Q.message
      }), {
        status: "failed",
        reason: Q.reason,
        message: Q.message
      };
    const Ra = [
      ...vc,
      ...M.actions,
      ...Q.actions
    ];
    return Ra.length === 0 ? (_("completed-without-actions", A.targets), {
      status: "completed-without-actions",
      workflowContext: ne,
      itemUseContext: A,
      summaryLines: Ta
    }) : (_("ready", A.targets), {
      status: "ready",
      workflowContext: ne,
      itemUseContext: A,
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
function TR(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function RR(e, t) {
  return {
    ...e,
    targets: t
  };
}
function wR(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || da(l) && (!a.includeCostSteps || !s))
      continue;
    const c = $R(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && Tw(n.extraCost) && o.push({
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
async function kR(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Fe(a, r);
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
function $R(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = ER(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function ER(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function IR(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function CR(e, t, n) {
  const a = SR(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function SR(e, t) {
  const n = Fe(e, t);
  return n ? $_(n.amount) : null;
}
function ni(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Fe(r, n);
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
      const s = us(o);
      n.push(
        LR(
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
function LR(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? PR(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: DR(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: vR(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function DR(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function vR(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function PR(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function NR(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || xR(s, r)) continue;
    const l = Dt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = ua(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (OR(s)) {
        MR(
          o,
          u,
          FR(s, n, l.value)
        );
        continue;
      }
      a.push(UR(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...BR(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function xR(e, t) {
  const n = jl(e.amountFrom);
  return n !== null && t.has(n);
}
function OR(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function MR(e, t, n) {
  const r = jR(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function FR(e, t, n) {
  const r = jl(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function BR(e, t, n, r) {
  const a = KR(e), o = a.length > 1 ? ZR() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const h = YR(u.amount, s);
        return {
          id: zR(u, s, m),
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
      label: qR(c, s, a.length > 1),
      executedLabel: GR(
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
function UR(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = WR(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: VR(e, r, n),
    executedLabel: HR(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function zR(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function qR(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function GR(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function jR(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function jl(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function VR(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function HR(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function WR(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function KR(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function YR(e, t) {
  const n = e * t.multiplier, r = QR(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function QR(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function ZR() {
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
    tw(t, n, r),
    ...ew(s),
    ...Object.values(a.rolls).flatMap(nw),
    ...XR(e, o),
    ...rw(e.resistance),
    ...cw(n)
  ];
}
function XR(e, t) {
  return JR(e) ? ua("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function JR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function ew(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function tw(e, t, n) {
  const r = Fe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function nw(e) {
  const n = [`${uw(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = aw(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${E_(e.damageType)}`), n;
}
function rw(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function aw(e) {
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
    const s = ow(o);
    s && (lw(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function ow(e) {
  const t = iw(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : sw(e);
}
function iw(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function sw(e) {
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
function lw(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function cw(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function uw(e) {
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
function dw(e, t, n, r) {
  return ql.map((a) => {
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
      details: o ? mw(o, n) : [],
      finalCostText: o ? fw(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function mw(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  a.length > 0 ? r.push(a.join(", ")) : r.push("efeito manual");
  const o = Fe(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Fe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function fw(e, t) {
  const n = Fe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function pw(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(da);
}
function gw(e, t) {
  return Ll({
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
function hw(e, t, n, r) {
  return Vl(e, t, n, r) ?? ca;
}
function Vl(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? bw(t, n) ? yw(n) : null : n === "base" ? ca : null);
}
function yw(e) {
  switch (e) {
    case "base":
      return ca;
    case "discente":
      return bR;
    case "verdadeiro":
      return AR;
  }
}
function bw(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Aw(foundry.utils.getProperty(e, n));
}
function Aw(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function _w(e) {
  return e.steps.some(da);
}
function da(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Tw(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Hl = "itemUsePrompts", Wl = "chatCard", rn = "data-paranormal-toolkit-prompt-id", an = "data-paranormal-toolkit-pending-id", ma = "data-paranormal-toolkit-executed-label", fr = "data-paranormal-toolkit-choice-group", Kl = "data-paranormal-toolkit-skipped-label", Ot = "data-paranormal-toolkit-action-section", oi = "data-paranormal-toolkit-detail-key", ii = "data-paranormal-toolkit-roll-card", fa = "data-paranormal-toolkit-roll-detail-toggle", Yl = "data-paranormal-toolkit-roll-detail-id", Ql = "data-paranormal-toolkit-resistance-roll-button", Zl = "data-paranormal-toolkit-resistance-skill", Xl = "data-paranormal-toolkit-resistance-skill-label", Jl = "data-paranormal-toolkit-resistance-target-actor-id", ec = "data-paranormal-toolkit-resistance-target-name", tc = "data-paranormal-toolkit-resistance-roll-result", si = "data-paranormal-toolkit-system-card-replaced", Rw = `[${an}]`, ww = `[${fa}]`, kw = `[${Ql}]`, pr = `${d}-chat-enrichment`, g = `${d}-item-use-prompt`, $w = `${g}__actions`, li = `${g}__details`, nc = `${g}__summary`, Ew = `${g}__title`, rc = `${g}__button--executed`, ci = `${g}__roll-card`;
let di = !1, gr = null;
const z = /* @__PURE__ */ new Map(), Iw = [0, 100, 500, 1500, 3e3], Cw = 3e4, Sw = [0, 100, 500, 1500, 3e3];
function Lw(e) {
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
  z.set(e.pendingId, t), await ha(t) || yc(t), ic(e.pendingId);
}
async function Dw(e) {
  const t = ac({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", z.set(e.pendingId, t), await ha(t) || yc(t), ic(e.pendingId);
}
async function In(e, t) {
  const n = z.get(e);
  z.delete(e), n && await Dk(n, t);
}
function pa(e) {
  const t = wc();
  for (const n of t) {
    const r = Y(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function vw(e, t) {
  const n = pa(e);
  if (!n) return;
  const r = Y(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Be(n.message, r));
}
async function Pw(e, t, n) {
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
  o && await Be(r.message, a);
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
    summary: ik(e.context),
    executed: !1
  };
}
function oc(e, t, n) {
  Lk();
  const r = sn(t);
  if (!r) return;
  const a = Ik(e, r);
  a.length > 0 && Mt(r);
  for (const o of a)
    hr(r, o);
  dc(r, n), yr(r), br(r);
}
function fi(e) {
  for (const t of Sw)
    globalThis.setTimeout(() => {
      Nw(e);
    }, t);
}
function Nw(e) {
  for (const t of xw()) {
    const n = on(t);
    Ow(n) && oc(n, t, e);
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
  return e ? ya(e) ? !0 : Pk(e).length > 0 : !1;
}
function ic(e) {
  const t = z.get(e);
  if (!t) return;
  const n = t.messageId ? Ck(t.messageId) : null;
  if (n) {
    bi(n, t), Mt(n), hr(n, t), pi(n), yr(n), br(n);
    return;
  }
  if (t.messageId) {
    Tr(t);
    return;
  }
  const r = Sk(t);
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
  const t = Mw();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const n = uc(e);
  if (!n || (n.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || n.getAttribute(si) === "true") return;
  const r = n.querySelector(`.${pr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(si, "true");
}
function Mw() {
  try {
    return Zu() === "replace";
  } catch {
    return !1;
  }
}
function hr(e, t) {
  if (Mt(e), e.querySelector(`[${rn}="${Ue(t.pendingId)}"]`)) return;
  const n = Bw(e, t);
  zw(n, t);
  const r = nk(t);
  if (Fw(r)) return;
  tk(n, r).append(ok(t));
}
function Fw(e) {
  return lc(e.id) && !fe();
}
function sc(e) {
  const n = e.closest(`[${Ot}]`)?.getAttribute(Ot) ?? null;
  return lc(n) && !fe();
}
function lc(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function Bw(e, t) {
  const n = e.querySelector(`.${pr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(pr, g);
  const a = document.createElement("header");
  a.classList.add(`${g}__header`);
  const o = document.createElement("span");
  o.classList.add(`${g}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Ew), s.textContent = Uw(t);
  const l = document.createElement("span");
  return l.classList.add(nc), l.textContent = t.summary, a.append(o, s, l), r.append(a), lk(e).append(r), r;
}
function Uw(e) {
  const t = v(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function zw(e, t) {
  const n = t.summaryLines ?? [], r = gc(n, t);
  if (r) {
    qw(e, r, t);
    return;
  }
  rk(e, n);
}
function qw(e, t, n) {
  if (e.querySelector(`[${ii}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(ci, `${ci}--${t.intent}`), r.setAttribute(ii, "true"), t.castingCheck && gi(r, jw(t.castingCheck), n.pendingId, "casting"), Gw(t) && gi(r, Vw(t), n.pendingId, "effect"), Qw(r, t), Zw(r, t, n), ek(r, t), e.append(r);
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
function gi(e, t, n, r) {
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
  Hw(a, t), Jw(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
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
function Qw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Zk);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${g}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function Zw(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${g}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Xw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${g}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(cc(t.resistanceRollResult)), e.append(r);
}
function Xw(e, t) {
  if (!e.resistanceSkill || !he()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${g}__resistance-roll-button`), n.setAttribute(rn, t.pendingId), n.setAttribute(Ql, "true"), n.setAttribute(Zl, e.resistanceSkill), n.setAttribute(Xl, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Jl, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ec, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${g}__resistance-roll-button--rolled`), n.setAttribute(tc, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${g}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function cc(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = fc(e), t;
}
function Jw(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${g}__roll-detail-toggle`), l.setAttribute(fa, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${g}__roll-detail-list`), c.setAttribute(Yl, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const h = document.createElement("dd");
    h.textContent = u.value, c.append(m, h);
  }
  e.append(l, c);
}
function ek(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function tk(e, t) {
  const n = `[${Ot}="${Ue(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add($w), a.setAttribute(Ot, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${g}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function nk(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = gc(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function rk(e, t) {
  if (t.length === 0) return;
  const n = ak(e);
  for (const r of t) {
    const a = Xk(r);
    if (n.querySelector(`[${oi}="${Ue(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(oi, a), n.append(o);
  }
}
function ak(e) {
  const t = e.querySelector(`.${li}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(li), e.append(n), n;
}
function ok(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(rn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(rc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(an, e.pendingId), t.setAttribute(ma, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(fr, e.choiceGroupId), t.setAttribute(Kl, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function ik(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = sk(e);
  return `${t} → ${n}`;
}
function sk(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function lk(e) {
  return uc(e) ?? e;
}
function uc(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function dc(e, t) {
  const n = sn(e);
  if (!n) return;
  const r = n.querySelectorAll(Rw);
  for (const a of r) {
    if (sc(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      Rk(a, t);
    }));
  }
}
function yr(e) {
  const t = sn(e);
  if (!t) return;
  const n = t.querySelectorAll(ww);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      ck(t, r);
    }));
}
function br(e) {
  const t = sn(e);
  if (!t) return;
  const n = t.querySelectorAll(kw);
  for (const r of n) {
    if (!he()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      uk(t, r);
    }));
  }
}
function ck(e, t) {
  const n = t.getAttribute(fa);
  if (!n) return;
  const r = e.querySelector(`[${Yl}="${Ue(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function uk(e, t) {
  if (!he()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(rn), r = t.getAttribute(Zl), a = t.getAttribute(Xl) ?? (r ? me(r) : "Resistência");
  if (!n || !r) return;
  const o = fk(e, n), s = pk(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await tm(s, r);
    await Ak(c.roll);
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
    dk(t, u), mk(t, u), _k(n, u), await Tk(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function dk(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(tc, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function mk(e, t) {
  const n = e.closest(`.${g}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${g}__resistance-roll-result`), a = r ?? cc(t);
  if (r) {
    r.textContent = fc(t);
    return;
  }
  n.append(a);
}
function fk(e, t) {
  const n = z.get(t);
  if (n) return n;
  const r = on(e);
  return Y(r)[t] ?? null;
}
function pk(e, t) {
  const n = e?.resistanceTargetActor;
  if (H(n)) return n;
  const a = e?.context?.targets.map(Ar).find(H) ?? null;
  if (a) return a;
  const o = t.getAttribute(Jl) ?? e?.resistanceTargetActorId ?? null, s = o ? hk(o) : null;
  return s || yk(
    t.getAttribute(ec) ?? e?.resistanceTargetName ?? gk(t)
  );
}
function gk(e) {
  const n = e.closest(`.${g}`)?.querySelector(`.${nc}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Ar(e) {
  const t = e.actor;
  if (H(t)) return t;
  const n = e.token, r = rt(n);
  if (r) return r;
  const a = e.document;
  return rt(a);
}
function rt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (H(t)) return t;
  const n = e.document?.actor;
  return H(n) ? n : null;
}
function hk(e) {
  const n = game.actors?.get?.(e);
  return H(n) ? n : mc().map((o) => rt(o)).find((o) => o?.id === e) ?? null;
}
function yk(e) {
  const t = Ie(e);
  if (!t) return null;
  const n = mc().filter((o) => Ie(bk(o)) === t).map((o) => rt(o)).find(H) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => H(o) && Ie(o.name) === t);
  return H(a) ? a : null;
}
function mc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function bk(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : rt(e)?.name ?? null;
}
function Ie(e) {
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
async function Ak(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function _k(e, t) {
  const n = z.get(e);
  n && (n.resistanceRollResult = t);
}
async function Tk(e, t, n) {
  const r = on(e);
  if (r)
    try {
      const a = Y(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Be(r, a);
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
async function Rk(e, t) {
  if (sc(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(an);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    pc(e, e.getAttribute(ma) ?? "✓ Automação aplicada"), wk(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function pc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(rc), e.removeAttribute(an), e.removeAttribute(ma);
}
function wk(e) {
  const t = e.getAttribute(fr);
  if (!t) return;
  const n = e.closest(`.${g}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${fr}="${Ue(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Kl) ?? "✓ Outra opção escolhida";
    pc(a, o);
  }
}
function gc(e, t) {
  const n = e.map(ga).filter(Yk), r = n.find((_) => _.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = v(e, "Forma"), o = v(e, "Custo"), s = v(e, "Dados") ?? v(e, `Dados (${r.label})`), l = v(e, "Tipo"), c = v(e, "Resistência"), u = v(e, "Resistência Perícia"), m = v(e, "Resistência Rótulo") ?? (u ? me(u) : null), h = hc(e, "Observação"), w = e.filter((_) => Ek(_, r)), T = kk(e);
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
    notes: h,
    details: w,
    castingCheck: T,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function kk(e) {
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
    intent: $k(n)
  } : null;
}
function $k(e) {
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
function Ek(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || ga(e) ? !1 : e.trim().length > 0;
}
function Ik(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of z.values())
    _r(r, e, t) && n.set(r.pendingId, r);
  for (const r of vk(e))
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
  const r = `data-${Jk(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function Ck(e) {
  const t = Ue(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Sk(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (_r(e, null, t))
      return t;
  return null;
}
function Lk() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of z.entries())
    e - r.createdAt > t && z.delete(n);
}
async function bi(e, t) {
  const n = on(e);
  if (!n) return !1;
  try {
    const r = Y(n);
    return r[t.pendingId] = ba(t, te(n)), await Be(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function ha(e) {
  const t = _c(e);
  if (!t) return !1;
  try {
    const n = Y(t);
    return n[e.pendingId] = ba(e, te(t)), await Be(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function yc(e) {
  for (const t of Iw)
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
async function Dk(e, t) {
  const n = Ac(e.context.message);
  if (n)
    try {
      const r = Y(n), a = r[e.pendingId] ?? ba(e, te(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Be(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function vk(e) {
  return Object.values(Y(K(e))).filter(ct);
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
function Pk(e) {
  return Object.values(bc(K(e))).filter(ct);
}
function bc(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Hl);
  if (!Pe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    ct(a) && (n[r] = a);
  return n;
}
async function Be(e, t) {
  typeof e.setFlag == "function" && (await xk(e, t), await Nk(e, t));
}
async function Nk(e, t) {
  await Promise.resolve(e.setFlag?.(d, Hl, t));
}
function ya(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Wl);
  return Wk(t) ? t : null;
}
async function xk(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(ct).sort((o, s) => o.createdAt - s.createdAt);
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
      actorName: Ok(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Wl, a));
}
function Ok(e) {
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
  const n = Mk(e);
  if (n?.setFlag)
    return n;
  const r = te(e);
  if (!r) return null;
  const a = game.messages;
  return K(a?.get?.(r));
}
function Mk(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(K).find((n) => typeof n?.setFlag == "function") ?? null;
}
function _c(e) {
  const t = Ac(e.context.message);
  if (t) return t;
  const n = e.messageId ? Fk(e.messageId) : null;
  if (n) return n;
  const r = wc().slice().reverse();
  return r.find((a) => Bk(a, e)) ?? r.find((a) => Uk(a, e)) ?? null;
}
function Fk(e) {
  const t = game.messages;
  return K(t?.get?.(e));
}
function Bk(e, t) {
  const n = te(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Tc(e, t)) return !1;
  const a = Rc(e);
  return !t.actorId || !a || a === t.actorId;
}
function Uk(e, t) {
  if (!qk(e, t)) return !1;
  const n = Rc(e);
  return t.actorId && n === t.actorId ? !0 : Tc(e, t);
}
function Tc(e, t) {
  const n = Ie(zk(e));
  if (!n) return !1;
  const r = Ie(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Ie(t.itemId);
  return !!(a && n.includes(a));
}
function zk(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Rc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function qk(e, t) {
  const n = Gk(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Cw;
}
function Gk(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function K(e) {
  return e && typeof e == "object" ? e : null;
}
function ct(e) {
  return Pe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && se(e.resistanceTargetActorId) && se(e.resistanceTargetName) && Kk(e.resistanceRollResult) && jk(e.actionPayload) && Cn(e.title) && Cn(e.buttonLabel) && Cn(e.executedLabel) && se(e.choiceGroupId) && se(e.skippedLabel) && se(e.actionSectionId) && se(e.actionSectionTitle) && Qk(e.summaryLines) : !1;
}
function jk(e) {
  return e == null ? !0 : Pe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && Vk(e.resource) && Hk(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Vk(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Hk(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Wk(e) {
  return Pe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && Pe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ct) : !1;
}
function Kk(e) {
  return e == null ? !0 : Pe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && se(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Yk(e) {
  return e !== null;
}
function Pe(e) {
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
function Qk(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Zk(e) {
  return typeof e == "string" && e.length > 0;
}
function wc() {
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
function Xk(e) {
  return e.trim().toLowerCase();
}
function Jk(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ue(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ai = 1e3;
class e$ {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new _R(
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
    const r = vi(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && s$(t.item) && n.executionMode === "ask") {
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
    if (await Uo(t), !t.actor) {
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
    const a = n$(
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
    const r = n.prompt.actionPayload, a = u$(r);
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
    return o.ok ? (await vw(t), await Pw(
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
    if (await Uo(t), !t.actor) {
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
      l$(t.item),
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
          Re(a.workflowContext)
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
      if (!fe())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (i$(n, a.value), await vs(a.value), {
        ok: !0,
        executedLabel: t$(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!fe())
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
    await Dw({
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
        actionPayload: c$(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      Re(n)
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
      Re(a.value.context)
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
function t$(e) {
  return Ps({ inputAmount: e.totalRawDamage });
}
function n$(e, t) {
  if (t.resistance || !r$(t))
    return t;
  const n = Ol(e);
  return n ? { ...t, resistance: n } : t;
}
function r$(e) {
  return a$(e) && !o$(e);
}
function a$(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function o$(e) {
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
function i$(e, t) {
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
function s$(e) {
  return e.type === "ritual";
}
function l$(e) {
  return m_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function c$(e) {
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
function u$(e) {
  const t = e.actorUuid ? d$(e.actorUuid) : null;
  if (Ne(t)) return t;
  const n = e.actorId ? m$(e.actorId) : null;
  return n || f$(e.actorName);
}
function d$(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function m$(e) {
  const n = game.actors?.get?.(e);
  if (Ne(n)) return n;
  for (const r of kc()) {
    const a = Aa(r);
    if (a?.id === e) return a;
  }
  return null;
}
function f$(e) {
  const t = Ln(e);
  if (!t) return null;
  for (const a of kc()) {
    const o = p$(a);
    if (Ln(o) === t) {
      const s = Aa(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Ne(a) && Ln(a.name) === t
  );
  return Ne(r) ? r : null;
}
function kc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function p$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Aa(e)?.name ?? null;
}
function Aa(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ne(t)) return t;
  const n = e.document?.actor;
  return Ne(n) ? n : null;
}
function Ln(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ne(e) {
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
class g$ {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = it(t);
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
class h$ {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = it(t).map((l) => this.analyzeRitual(l)), r = n.filter(At("upToDate")), a = n.filter(At("available")), o = n.filter(At("outdated")), s = n.filter(At("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = y$(t);
    return n ? r ? r.source.type !== "preset" ? Ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ve({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: b$(r, n.preset)
    }) : Ve({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ve({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ve(e) {
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
function y$(e) {
  const t = e.getFlag(d, "automation");
  return Rr(t) ? t : null;
}
function b$(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function At(e) {
  return (t) => t.status === e;
}
class A$ {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = kr(t.transaction);
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
    const n = _t(t.actorName), r = _t(t.resource), a = _t(_$(t)), o = _t(T$(t));
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
function _$(e) {
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
function T$(e) {
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
function _t(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function R$() {
  const e = new Db(), t = new xA(e), n = new ls(new ss()), r = new cs(new Nr()), a = new OA(new kl()), o = new Nb(), s = new Yb(o), l = new cA(e), c = new dA(), u = c.registerMany(
    Ru()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new uA(), h = new sA(), w = ys(), T = new ms(w), _ = new h$(
    c
  ), E = new g$(
    _,
    m,
    h
  ), A = new UA(), qe = new A$(A), q = new BA(), Ge = new NA(), O = new vA(
    t,
    s,
    qe,
    q
  ), ne = new FA(O, q), M = new e$(
    ne,
    t,
    s,
    n,
    T,
    A,
    Ge
  );
  return M.addStrategy(
    new oA(
      (Q) => M.handleItemUsed(Q)
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
    conditionRegistry: w,
    conditions: T,
    debugOutput: A,
    chatMessages: qe,
    workflowHooks: q,
    ritualEvents: Ge,
    automation: O,
    workflow: ne,
    itemUseIntegration: M,
    ritualPresetDiagnostic: _,
    ritualPresetApplications: E
  };
}
const { ApplicationV2: w$ } = foundry.applications.api;
class Ft extends w$ {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${j(Di)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${j(t.actorName)}</strong></p>
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
        <span>${j(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? k$(n) : E$(t)}
    </section>
  `;
}
function k$(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map($$).join("")}</ol>`;
}
function $$(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${j(e.appliedPresetId)} v${j(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${j(e.itemName)}</strong>
        <span>${j(e.reason)}</span>
        ${r}
      </div>
      <em>${j(n)}</em>
    </li>
  `;
}
function E$(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${j({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function j(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Bt = `${d}.manageRitualPresets`, Ri = `__${d}_ritualPresetHeaderControlRegistered`, I$ = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function C$(e) {
  const t = globalThis;
  if (!t[Ri]) {
    for (const n of I$)
      Hooks.on(n, (r, a) => {
        S$(r, a, e);
      });
    t[Ri] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function S$(e, t, n) {
  Array.isArray(t) && D$(e) && (L$(e, n), !t.some((r) => r.action === Bt) && t.push({
    action: Bt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), $c(e, n);
    }
  }));
}
function L$(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Bt] && (e.options.actions[Bt] = (n) => {
    n.preventDefault(), n.stopPropagation(), $c(e, t);
  }));
}
function D$(e) {
  if (!game.user?.isGM) return !1;
  const t = Ec(e);
  return t ? t.type === "agent" && it(t).length > 0 : !1;
}
function $c(e, t) {
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
const Ic = "data-paranormal-toolkit-ritual-roll-config", ut = "data-paranormal-toolkit-ritual-roll-field", pe = "data-paranormal-toolkit-ritual-roll-action", ki = `__${d}_ritualRollConfigBlockRegistered`, v$ = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], P$ = [
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
function N$() {
  const e = globalThis;
  if (!e[ki]) {
    x$();
    for (const t of v$)
      Hooks.on(t, (...n) => {
        O$(n[0], n[1]);
      });
    e[ki] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function x$() {
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
function O$(e, t) {
  const n = Q$(e);
  if (!n || n.type !== "ritual") return;
  const r = J$(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  F$(a);
  const o = Sc(n), s = xl(n), l = Z$(n), c = B$(n, s, o, l);
  V$(c, n, o, l), M$(a, c), _a(c);
}
function M$(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function F$(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ic}]`)))
    t.remove();
}
function B$(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Ic, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append($i("strong", "Paranormal Toolkit")), s.append($i("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Dc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(U$(t, r)), u.append(z$(t, r)), u.append(q$(t, r)), a.append(u), a.append(G$(t, n, r)), a.append(j$(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function U$(e, t) {
  const n = ln("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(ut, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = d_(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function z$(e, t) {
  const n = ln("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(ut, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of P$) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function q$(e, t) {
  const n = ln("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(ut, "utilityLabel"), n.append(r), n;
}
function G$(e, t, n) {
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
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(ut, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function j$(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(pe, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(pe, "clear"), t.append(n, r), t;
}
function ln(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function $i(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function V$(e, t, n, r) {
  ze(e, "intent")?.addEventListener("change", () => _a(e)), Ci(e, "system.studentForm")?.addEventListener("change", () => Ei(e, t)), Ci(e, "system.trueForm")?.addEventListener("change", () => Ei(e, t)), e.querySelector(`[${pe}="save"]`)?.addEventListener("click", () => {
    r && H$(e, t, n);
  }), e.querySelector(`[${pe}="clear"]`)?.addEventListener("click", () => {
    r && W$(e, t);
  });
}
async function H$(e, t, n) {
  const r = e.querySelector(`[${pe}="save"]`);
  r?.setAttribute("disabled", "true"), Ce(e, "Salvando configuração...");
  try {
    const a = K$(e, n);
    await c_(t, a), Cc(e, a), Ce(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Ce(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function W$(e, t) {
  const n = e.querySelector(`[${pe}="clear"]`);
  n?.setAttribute("disabled", "true"), Ce(e, "Limpando configuração...");
  try {
    await u_(t);
    const r = xl(t);
    Y$(e, r), Cc(e, r), Ce(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Ce(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Cc(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Dc(t) ? "Configurada" : "Rascunho");
}
function K$(e, t) {
  return {
    schemaVersion: 1,
    intent: Lc(ze(e, "intent")?.value),
    damageType: Si(e, "damageType"),
    utilityLabel: Si(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: It(e, "formula.base") },
      discente: { formula: It(e, "formula.discente") },
      verdadeiro: { formula: It(e, "formula.verdadeiro") }
    }
  };
}
function Y$(e, t) {
  Te(e, "intent", t.intent), Te(e, "damageType", t.damageType ?? ""), Te(e, "utilityLabel", t.utilityLabel ?? "Resultado"), Te(e, "formula.base", t.forms.base.formula), Te(e, "formula.discente", t.forms.discente.formula), Te(e, "formula.verdadeiro", t.forms.verdadeiro.formula), _a(e);
}
function _a(e) {
  const t = Lc(ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Ei(e, t) {
  const n = Sc(t);
  Ii(e, "discente", n.discente), Ii(e, "verdadeiro", n.verdadeiro);
}
function Ii(e, t, n) {
  const r = ze(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${pe}="save"]`)?.disabled;
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
function Ce(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Sc(e) {
  const t = X$(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Q$(e) {
  return Li(e.item) ? e.item : Li(e.document) ? e.document : null;
}
function Z$(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function X$(e) {
  const t = e.system;
  return eE(t) ? t : {};
}
function Ci(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ze(e, t) {
  return e.querySelector(`[${ut}="${tE(t)}"]`);
}
function It(e, t) {
  return ze(e, t)?.value.trim() ?? "";
}
function Si(e, t) {
  const n = It(e, t);
  return n.length > 0 ? n : null;
}
function Te(e, t, n) {
  const r = ze(e, t);
  r && (r.value = n);
}
function Lc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Dc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function J$(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Li(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function eE(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function tE(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ce = null;
Hooks.once("init", () => {
  bu(), Qu(), yd(), bb(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!xa.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${xa.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ce = R$(), ce.itemUseIntegration.registerStrategies(), fd(ce.conditions), cd(ce), kb(), C$(ce), N$(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function nE() {
  if (!ce)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ce;
}
export {
  nE as getToolkitServices
};
//# sourceMappingURL=main.js.map
