const d = "paranormal-toolkit", Tr = "Paranormal Toolkit", wc = "ordemparanormal";
class at {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Bt(e) {
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
function ot(e) {
  const t = Ei(e);
  return t.ok ? A(t.value.definition) : t;
}
function Ei(e) {
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
function $c(e) {
  return Rr(e.getFlag(d, "automation"));
}
function Rr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Ec(t.source) && kc(t.definition);
}
function kc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Ic) && (t.ritualForms === void 0 || Pc(t.ritualForms)) && (t.conditionApplications === void 0 || Fc(t.conditionApplications));
}
function Ec(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Ic(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Cc(t);
    case "spendRitualCost":
      return Sc(t);
    case "rollFormula":
      return Lc(t);
    case "modifyResource":
      return Dc(t);
    case "chatCard":
      return vc(t);
    default:
      return !1;
  }
}
function Cc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ii(t);
}
function Sc(e) {
  return e.type === "spendRitualCost";
}
function Lc(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || Vc(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Dc(e) {
  const t = e;
  return t.type === "modifyResource" && Ci(t.actor) && Gc(t.resource) && zc(t.operation) && Ii(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function vc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Pc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Nc(a)
  );
}
function Nc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || Wc(t.extraCost)) && (t.rollFormulaOverrides === void 0 || Yc(t.rollFormulaOverrides)) && (t.notes === void 0 || Kc(t.notes)) && (t.targeting === void 0 || xc(t.targeting));
}
function xc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Mc(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Oc(t.template));
}
function Oc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || $a(t.distance)) && (t.width === void 0 || t.width === null || $a(t.width));
}
function Mc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Fc(e) {
  return Array.isArray(e) && e.every(Bc);
}
function Bc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Ci(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || qc(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Uc(t.applyOnResistance));
}
function Uc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function qc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Hc(t.rounds)) && (t.expiry === void 0 || t.expiry === null || jc(t.expiry));
}
function jc(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ii(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Ci(e) {
  return e === "self" || e === "target";
}
function Gc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function zc(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Vc(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Hc(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Wc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function $a(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function Kc(e) {
  return Array.isArray(e) && e.every(w);
}
function Yc(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function wr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(ka);
    if (Xc(t))
      return Array.from(t).filter(ka);
  }
  return [];
}
function Qc(e) {
  return wr(e)[0] ?? null;
}
function Zc(e) {
  return wr(e).find($c) ?? null;
}
function Xc(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function ka(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function it(e) {
  return wr(e).filter((t) => t.type === "ritual");
}
function Si(e) {
  return it(e)[0] ?? null;
}
function Jc(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Bt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = He("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = dt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Ca);
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
      const o = await Pn(e, r, a.value);
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
      const a = await Pn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Ca(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ea(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ea(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = He("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = dt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Ea(e) {
  const t = He("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = it(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ia(t);
  const r = Ia(t, n.length);
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
    const s = await Pn(e, a, o.preset);
    r.applied.push(eu(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), tu(r), r;
}
async function Pn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function eu(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Bt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Ia(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function tu(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Ca(e) {
  return {
    preset: Bt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function He(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function dt(e) {
  const t = Si(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ue(e) {
  return e ? {
    id: e.id,
    source: {
      ...nu(e.sourceActor),
      token: e.sourceToken
    },
    item: ru(e.item),
    targets: e.targets.map(au),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Sa(e.rollRequests, Li),
    rolls: Sa(e.rolls, ou),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map($r),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function $r(e) {
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
function nu(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function ru(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function au(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Li(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ou(e) {
  return {
    ...Li(e),
    total: e.total
  };
}
function Sa(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function iu(e) {
  return {
    getSelected() {
      return at.getSelectedActor();
    },
    logResources() {
      const t = ne(
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
        ne("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Te(
        e,
        "Gasto de PD",
        ne("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Te(
        e,
        "Dano em PV",
        ne("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Te(
        e,
        "Cura de PV",
        ne("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Te(
        e,
        "Dano em SAN",
        ne("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Te(
        e,
        "Recuperação de SAN",
        ne("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Te(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    su(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, $r(o));
}
function ne(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function su(e) {
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
const z = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function lu() {
  mt(z.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), mt(z.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), mt(z.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), mt(z.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Nn() {
  return {
    enabled: ft(z.enabled),
    console: ft(z.console),
    ui: ft(z.ui),
    chat: ft(z.chat)
  };
}
async function Q(e, t) {
  await game.settings.set(d, z[e], t);
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
function cu() {
  return {
    status() {
      return Nn();
    },
    async enable() {
      await Q("enabled", !0);
    },
    async disable() {
      await Q("enabled", !1);
    },
    async enableConsole() {
      await Q("console", !0);
    },
    async disableConsole() {
      await Q("console", !1);
    },
    async enableUi() {
      await Q("ui", !0);
    },
    async disableUi() {
      await Q("ui", !1);
    },
    async enableChat() {
      await Q("chat", !0);
    },
    async disableChat() {
      await Q("chat", !1);
    }
  };
}
const Di = "ritual.costOnly", vi = "ritual.simpleHealing", uu = "ritual.eletrocussao", du = "ritual.definhar", Pi = "ritual.simpleDamage", Ni = "generic.simpleHealing", kr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function mu() {
  return [
    fu(),
    pu(),
    gu(),
    hu(),
    yu(),
    bu()
  ];
}
function fu() {
  return {
    id: Di,
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
function pu() {
  return {
    id: vi,
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
    automation: xi(),
    itemPatch: Tu()
  };
}
function gu() {
  return {
    id: uu,
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
    automation: Au(),
    itemPatch: wu()
  };
}
function hu() {
  return {
    id: du,
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
    automation: _u(),
    itemPatch: Ru()
  };
}
function yu() {
  return {
    id: Pi,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Er()
  };
}
function bu() {
  return {
    id: Ni,
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
function xi(e = "2d8+2") {
  return Oi(
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
function Au() {
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
function _u() {
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
  return Oi(
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
function Tu() {
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
      studentForm: !1,
      trueForm: !1
    }
  };
}
function Ru() {
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
function wu() {
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
function Oi(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Ir() {
  return Array.from(game.user?.targets ?? []).map(Mi);
}
function Mi(e) {
  return {
    tokenId: $e(e.id),
    actorId: $e(e.actor?.id),
    sceneId: $e(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Fi() {
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
function $u(e) {
  return {
    logFirstRitualCost() {
      const t = re("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ae(t);
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
      const r = re("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = ae(r);
      if (a) {
        if (!Iu(t, n)) {
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
      const t = re("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ae(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = re("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ae(t);
      if (!n) return;
      const r = e.automationRegistry.require(Di);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = re("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ae(n);
      if (!r) return;
      if (!La(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(vi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: xi(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = re("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ae(n);
      if (!r) return;
      if (!La(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Pi);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Er(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = re("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ae(t);
      n && await ku(e, t, n);
    }
  };
}
async function ku(e, t, n) {
  const r = ot(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Fi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    Eu(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", ue(a.value.context));
}
function Eu(e) {
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
function re(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ae(e) {
  const t = Si(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Iu(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function La(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Cu = ["strict", "open"], Bi = "strict";
function Su(e) {
  return Cu.includes(e) ? e : Bi;
}
function Lu(e) {
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
function Ut(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Du = ["disabled", "ask", "automatic"], vu = ["buttons", "confirm"], Ui = "ask";
function Pu(e) {
  return typeof e == "string" && Du.includes(e);
}
function Nu(e) {
  return typeof e == "string" && vu.includes(e);
}
function xu(e) {
  return Pu(e) ? e : Nu(e) ? "ask" : Ui;
}
const Ou = ["keep", "replace"], Mu = ["manual", "assisted"], qi = "keep", ji = "assisted", Fu = !0, S = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Bu() {
  game.settings.register(d, S.executionMode, {
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
    default: Ui
  }), game.settings.register(d, S.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: qi
  }), game.settings.register(d, S.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: ji
  }), game.settings.register(d, S.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Bi
  }), game.settings.register(d, S.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Fu
  }), game.settings.register(d, S.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Da() {
  const e = xu(game.settings.get(d, S.executionMode)), t = zi(game.settings.get(d, S.systemCardMode)), n = Vi(game.settings.get(d, S.damageResolutionMode)), r = Cr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Gi()
  };
}
function Uu() {
  return zi(game.settings.get(d, S.systemCardMode));
}
function qu() {
  return Vi(game.settings.get(d, S.damageResolutionMode));
}
function Cr() {
  return Su(game.settings.get(d, S.resistanceGateMode));
}
function Gi() {
  return game.settings.get(d, S.ritualCastingCheckEnabled) === !0;
}
async function oe(e) {
  await game.settings.set(d, S.executionMode, e);
}
function zi(e) {
  return Ou.includes(e) ? e : qi;
}
function Vi(e) {
  return Mu.includes(e) ? e : ji;
}
function ju(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await oe("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await oe(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await oe("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Gu = [
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
function zu(e) {
  return {
    phases() {
      return Gu;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ln("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Zc(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await va(e, t, n);
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
      if (!Wu(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Hu(n) ?? ln("Nenhum ator encontrado para executar automação do item.");
      r && await va(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ln("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Qc(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Ni);
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
async function va(e, t, n) {
  const r = ot(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Fi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    Vu(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", ue(a.value.context));
}
function Vu(e) {
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
function ln(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Hu(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Wu(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ku(e) {
  const t = iu(e), n = Jc(e), r = $u(e), a = zu(e), o = cu(), s = ju(e);
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
const _t = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function Yu(e) {
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
      const r = Pa();
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
      return Qu(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Pa();
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
      return Zu(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Pa() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function Qu(e) {
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
function Zu(e) {
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
function Xu(e) {
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
    conditions: Yu(e.conditions),
    debug: Ku(e),
    hooks: _t
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class Na {
  static isSupportedSystem() {
    return game.system.id === wc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Ju() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ke(t.id),
    actorId: ke(t.actor?.id),
    sceneId: ke(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Hi() {
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
function ed(e, t = Hi()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function td(e) {
  if (!ad(e)) return null;
  const t = e.getFlag(d, "workflow");
  return rd(t) ? t : null;
}
function nd() {
  return `flags.${d}.workflow`;
}
function xa(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${d}`), n = foundry.utils.getProperty(e, `_source.flags.${d}`);
  return t !== void 0 || n !== void 0;
}
function Oa(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return xn(t) || xn(n);
}
function rd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ad(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ke(e) {
  return xn(e) ? e : null;
}
function xn(e) {
  return typeof e == "string" && e.length > 0;
}
function od() {
  const e = (t, n) => {
    id(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function id(e, t) {
  const n = td(e);
  if (!n || n.targets.length === 0) return;
  const r = ld(t);
  if (!r || r.querySelector(`.${d}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(sd(n));
}
function sd(e) {
  const t = document.createElement("section");
  t.classList.add(`${d}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Ma("Origem", e.source.name)), t.append(Ma("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Ma(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${d}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function ld(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function cd() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!ud(r) || !dd(e) || xa(e) || xa(t)) return;
    const a = Ju();
    if (a.length === 0 || !Oa(e) && !Oa(t)) return;
    const o = Hi();
    e.updateSource({
      [nd()]: ed(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function ud(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function dd(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Fa = !1, cn = !1, un = !1, pt = null;
const md = 1e3, fd = 750, pd = 1e3;
function gd(e) {
  Fa || (Hooks.on("combatTurnChange", (t) => {
    yd(e, Ba(t));
  }), Hooks.on("deleteCombat", (t) => {
    bd(e, Ba(t));
  }), Fa = !0, hd(e));
}
function hd(e) {
  qt() && (cn || (cn = !0, globalThis.setTimeout(() => {
    cn = !1, Sr(e, "ready");
  }, md)));
}
function yd(e, t) {
  qt() && t && (pt && globalThis.clearTimeout(pt), pt = globalThis.setTimeout(() => {
    pt = null, Sr(e, "combat-turn-change", t);
  }, fd));
}
function bd(e, t) {
  qt() && t && (un || (un = !0, globalThis.setTimeout(() => {
    un = !1, Sr(e, "combat-deleted", t);
  }, pd)));
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
function Ba(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Wi = {
  enabled: "dice.animations.enabled"
};
function Ad() {
  game.settings.register(d, Wi.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function _d() {
  return {
    enabled: game.settings.get(d, Wi.enabled) === !0
  };
}
const jt = "chatCard", Ua = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Td = `.${i}__title`, Ki = `.${i}__header`, Rd = `.${i}__roll-card`, wd = `.${i}__roll-meta`, $d = `.${i}__roll-meta-pill`, Lr = `.${i}__resistance`, kd = `.${i}__resistance-header`, Yi = `.${i}__resistance-description`, Gt = `.${i}__resistance-roll-button`, Qi = `.${i}__resistance-roll-result`, qa = `${i}__resistance-content`, Zi = `.${i}__workflow-section`, Xi = `.${i}__workflow-roll`, Dr = `${i}__workflow-roll--dice-open`, vr = `.${i}__workflow-roll-formula`, Pr = `${i}__workflow-roll-formula--toggle`, zt = `.${i}__workflow-dice-tray`, Ed = `.${i}__roll-detail-toggle`, Id = `.${i}__roll-detail-list`, Cd = `.${i}__ritual-element-badge`, Sd = `.${i}__ritual-metadata`, Ld = "casting-backlash", Dd = "data-paranormal-toolkit-action-section", vd = "data-paranormal-toolkit-prompt-id", Pd = "data-paranormal-toolkit-pending-id", ja = "data-paranormal-toolkit-casting-backlash-enhanced", Ga = `.${i}`, Nd = `.${i}__workflow-section--casting`, xd = `.${i}__workflow-section-header`, Od = `.${i}__workflow-notes`, Md = `[${Dd}="${Ld}"]`, za = `${i}__workflow-section-title-row`, Fd = `${i}__workflow-section-header--casting-backlash`, Ji = `${i}__casting-backlash-button`;
function Bd(e) {
  for (const t of Ud(e))
    qd(t), Hd(t);
}
function Ud(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Ga) && t.add(e);
  for (const n of e.querySelectorAll(Ga))
    t.add(n);
  return Array.from(t);
}
function qd(e) {
  const t = e.querySelector(Md);
  if (!t) return;
  const n = jd(t);
  if (!n) return;
  const r = e.querySelector(`${Nd} ${xd}`);
  r && (r.classList.add(Fd), Gd(r), zd(n), r.append(n), t.remove());
}
function jd(e) {
  return e.querySelector(
    `button[${Pd}], button[${vd}]`
  );
}
function Gd(e) {
  const t = e.querySelector(`:scope > .${za}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(za);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(Ji) || n.append(a));
  return n;
}
function zd(e) {
  if (e.getAttribute(ja) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Vd(t, e.disabled);
  e.classList.add(Ji), e.setAttribute(ja, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Vd(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Hd(e) {
  for (const t of e.querySelectorAll(Od)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Wd(e) {
  for (const t of Array.from(e.querySelectorAll(Zi)))
    for (const n of Array.from(t.querySelectorAll(`${Ed}, ${Id}`)))
      n.remove();
}
const Kd = {
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
}, Yd = new Set(
  Object.values(Kd)
), Qd = {
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
function Zd(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Xd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Qd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Yd.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function es(e) {
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
function Xd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class ts {
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
      const y = Jd(m, u);
      if (!y.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const R = Zd(m.damageType);
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
          em(y.id, m, R.value)
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
        for (const T of nm(b.conditions))
          l.add(T);
        const p = tm(b.newPV);
        p !== null && (c = p), s.push({
          id: y.id,
          label: m.label ?? es(R.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: Va(b.finalDamage, y.amount),
          blocked: Va(b.blocked, 0),
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
function Jd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function em(e, t, n) {
  return {
    id: e,
    label: t.label ?? es(n),
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
function Va(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function tm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function nm(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Nr {
  async rollResistance(t) {
    const n = await am(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? me(t.skill),
      roll: n,
      formula: im(n),
      total: sm(n),
      diceBreakdown: lm(n)
    };
  }
  getSkillLabel(t) {
    return me(t);
  }
}
async function rm(e, t) {
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
async function am(e, t) {
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
  return om(r);
}
function om(e) {
  return Ha(e) ? e : Array.isArray(e) ? e.find(Ha) ?? null : null;
}
function Ha(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function im(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function sm(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function lm(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(cm);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function cm(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class ns {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class rs {
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
function um(e, t) {
  const n = ym(e?.rounds);
  if (!n)
    return Wa(null);
  const r = e?.anchor ?? as(t);
  if (!r)
    return {
      ...Wa(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: dm(),
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
function as(e) {
  const t = bm();
  if (!t?.id || !os(t.round)) return null;
  const n = gm(t), r = mm(e, n) ?? pm(t), a = Z(r?.id), o = _m(r?.initiative), s = fm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Am()
  };
}
function dm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Wa(e) {
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
function mm(e, t) {
  return e?.id ? t.find((n) => hm(n) === e.id) ?? null : null;
}
function fm(e, t, n) {
  const r = Z(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Tm(e.turn) ? e.turn : null;
}
function pm(e) {
  return Tt(e.combatant) ? e.combatant : null;
}
function gm(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Tt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Tt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Tt);
  }
  return [];
}
function hm(e) {
  return Z(e.actor?.id) ?? Z(e.actorId) ?? Z(e.token?.actor?.id) ?? Z(e.token?.actorId) ?? Z(e.document?.actor?.id) ?? Z(e.document?.actorId);
}
function ym(e) {
  return os(e) ? Math.trunc(e) : null;
}
function bm() {
  return game.combat ?? null;
}
function Am() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Tt(e) {
  return !!(e && typeof e == "object");
}
function Z(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function _m(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function os(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Tm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class is {
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
    if (!Dm(r))
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = um(t.duration, r), s = Rm(a, t, o), c = t.refreshExisting ?? !0 ? vm(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), A(Ka(r, a, c.id ?? null, !1, !0, o));
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
      return A(Ka(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = ls(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Ya(n, s) === "deleted" && (o += 1);
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
    const n = xm(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = xr(s);
      a += l.length;
      for (const c of l) {
        if (!km(c, t)) continue;
        const u = ss(c);
        try {
          await Ya(s, c) === "deleted" && (o += 1);
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
function Rm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Vm(),
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
    duration: wm(n.duration),
    start: $m(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function wm(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function $m(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: zm(),
    ...e
  };
}
function Ka(e, t, n, r, a, o) {
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
function km(e, t) {
  const n = ss(e);
  if (!n.conditionId || !Em(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Gm();
  return n.durationMode === "combatantTurn" || Im(n) ? Sm(n, r) : Cm(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !M(n.startRound) || !M(n.requestedRounds) || !M(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Em(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && M(e.requestedRounds);
}
function Im(e) {
  return !!(e.combatDurationApplied && M(e.requestedRounds) && M(e.startRound) && (e.startCombatantId || It(e.startTurn)));
}
function Cm(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Sm(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !M(e.startRound) || !M(e.requestedRounds) || !M(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Lm(t);
  return e.startCombatantId ? r === e.startCombatantId : It(e.startTurn) && It(t.turn) ? t.turn === e.startTurn : !1;
}
function Lm(e) {
  return Ee(e.combatant?.id);
}
function ss(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Rt(e, "conditionId"),
    requestedRounds: Qa(e, "requestedRounds") ?? We(t.value) ?? We(t.rounds),
    combatDurationApplied: dn(e, "combatDurationApplied"),
    combatId: Rt(e, "combatId") ?? Ee(n.combat) ?? Ee(t.combat),
    startCombatantId: Rt(e, "startCombatantId") ?? Ee(n.combatant),
    startInitiative: Bm(e, "startInitiative") ?? cs(n.initiative),
    startRound: Qa(e, "startRound") ?? We(n.round) ?? We(t.startRound),
    startTurn: Fm(e, "startTurn") ?? On(n.turn) ?? On(t.startTurn),
    expiryEvent: Um(e, "expiryEvent") ?? us(t.expiry),
    durationMode: qm(e, "durationMode"),
    deleteOnExpire: dn(e, "deleteOnExpire"),
    expiresWithCombat: dn(e, "expiresWithCombat")
  };
}
function Dm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function vm(e, t) {
  return ls(e, t)[0] ?? null;
}
function ls(e, t) {
  return xr(e).filter((n) => Mm(n) === t);
}
async function Ya(e, t) {
  const n = t.id ?? null, r = n ? Pm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Nm(a)) return "missing";
    throw a;
  }
}
function Pm(e, t) {
  return xr(e).find((n) => n.id === t) ?? null;
}
function Nm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function xm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      gt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    gt(e, n);
  });
  for (const n of Om())
    gt(e, n.actor), gt(e, n.document?.actor);
  return Array.from(e.values());
}
function gt(e, t) {
  if (!jm(t)) return;
  const r = Ee(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Om() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function xr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Mm(e) {
  return Rt(e, "conditionId");
}
function Rt(e, t) {
  return Ee(ge(e, t));
}
function Qa(e, t) {
  return We(ge(e, t));
}
function Fm(e, t) {
  return On(ge(e, t));
}
function Bm(e, t) {
  return cs(ge(e, t));
}
function Um(e, t) {
  return us(ge(e, t));
}
function qm(e, t) {
  const n = ge(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function dn(e, t) {
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
function Ee(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function We(e) {
  return M(e) ? Math.trunc(e) : null;
}
function On(e) {
  return It(e) ? Math.trunc(e) : null;
}
function cs(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function us(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function jm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Gm() {
  return game.combat ?? null;
}
function zm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function M(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function It(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Vm() {
  return game.user?.id ?? null;
}
const Hm = "icons/svg/downgrade.svg", Wm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Hm,
    description: Wm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Km = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Ym = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Qm = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Zm = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Xm = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Jm = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), ef = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), tf = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), nf = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), rf = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), af = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), of = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), sf = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), lf = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), cf = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), uf = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), df = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), mf = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), ff = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), pf = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), gf = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), hf = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), yf = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), bf = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Af = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), _f = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Tf = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Rf = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), wf = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), $f = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), kf = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Ef = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), If = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Cf = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Sf = [
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
  $f,
  kf,
  Ef,
  If,
  Cf
];
class Lf {
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
    return Array.from(this.definitions.values()).map(Za);
  }
  get(t) {
    const n = this.lookup.get(Xa(t)), r = n ? this.definitions.get(n) : null;
    return r ? A(Za(r)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Xa(t);
    r && this.lookup.set(r, n);
  }
}
function ds() {
  return new Lf(Sf);
}
function Za(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Xa(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function ve(e) {
  return e.applyOnResistance ?? "failure";
}
function ms(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function fs(e, t) {
  const n = ve(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function ps(e) {
  const t = ve(e);
  return t === "failure" || t === "success";
}
function Df(e, t, n, r) {
  const a = e.filter((c) => fs(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => ve(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const vf = {
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
}, Pf = {
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
function Nf(e) {
  return hs(e, vf, !1);
}
function xf(e) {
  return hs(e, Pf, !e.allowsSuccessfulResistance);
}
function Me(e) {
  return e.kind === "waiting-resistance";
}
function gs(e) {
  return e.kind === "resisted";
}
function hs(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Re("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Re("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || Ut(e.resistanceGateMode, e.resistanceState) ? Re(
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
const Ke = "data-paranormal-toolkit-prompt-id", Of = "data-paranormal-toolkit-resistance-roll-result", Mf = "Conjuração DT";
function Ff(e) {
  const t = e.querySelector(Gt)?.getAttribute(Of), n = et(t);
  if (n !== null) return n;
  const r = e.querySelector(Qi)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return et(a?.[1] ?? null);
}
function ys(e) {
  const t = bs(e), n = qf(t);
  if (n !== null) return n;
  const r = jf(t);
  return r !== null ? r : Gf(e);
}
function Bf(e) {
  const t = bs(e);
  return t ? {
    actorId: mn(t.actorId),
    itemId: mn(t.itemId),
    itemName: mn(t.itemName)
  } : null;
}
function Uf(e) {
  const t = e.getAttribute(Ke);
  if (!t) return null;
  const n = As(e), r = _s(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Vt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function X(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Mn(e) {
  return X(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function qf(e) {
  const t = Vf(e);
  return t.length === 0 ? null : et(Hf(t, Mf));
}
function jf(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Ja(r, ["system", "ritual", "DT"]) ?? Ja(r, ["system", "ritual", "dt"]);
}
function Gf(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return et(n?.[1] ?? null);
}
function bs(e) {
  const t = zf(e);
  if (!t) return null;
  const n = As(e), r = _s(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Vt(o) ? o.pendingId === t : !1) ?? null;
}
function zf(e) {
  return (e.closest(`[${Ke}]`) ?? e.querySelector(`[${Ke}]`) ?? e.parentElement?.querySelector(`[${Ke}]`) ?? null)?.getAttribute(Ke) ?? null;
}
function As(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Wf(a) ? a : null;
}
function _s(e) {
  const t = e?.getFlag?.(d, jt);
  return Vt(t) ? t : null;
}
function Vf(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Hf(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Ja(e, t) {
  let n = e;
  for (const r of t) {
    if (!Vt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : et(typeof n == "string" ? n : null);
}
function et(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Wf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Vt(e) {
  return !!(e && typeof e == "object");
}
function mn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Ht(e) {
  return Ts({
    hasResistance: !!e.querySelector(Lr),
    difficulty: ys(e),
    resistanceTotal: Ff(e)
  });
}
function Kf(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Ts({
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
function Ts(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Lu(e)
  };
}
function he() {
  return game.user?.isGM === !0;
}
function fe() {
  return he();
}
function Yf(e) {
  const t = Ut(e.resistanceGateMode, e.resistanceState), n = Qf(e.resistanceState, e.hasDamage), r = Zf(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Nf({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = xf({
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
function Qf(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Zf(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Or(e) {
  const t = e.isGM ?? fe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Yf({
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
function Xf(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = ep(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Jf(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function ep(e, t) {
  const n = tp(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of np(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function tp(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function np(e, t) {
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
const rp = "data-paranormal-toolkit-resistance-skill", ap = "data-paranormal-toolkit-resistance-skill-label", Rs = "pending", Mr = "success", Fr = "failure", ws = "rolled";
function op(e) {
  const t = up(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? lp(e.damageSection) : null, r = to(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = ip(e.rollCard).map((o, s) => {
    const l = sp(o, s), c = e.resistanceResults.get(l) ?? null, u = gp(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, y = e.effectApplications.get(l) ?? null, R = Kf({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Ap(u)
    }).state, b = to(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      ms(R)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: y,
      effect: b,
      assistedActions: Or({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: R,
        damage: n,
        effect: b,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!y,
        effectCanApplyOnSuccessfulResistance: b?.applyOnResistance === "success" || b?.applyOnResistance === "always",
        effectRequiresResolvedResistance: b ? ps(b) : !1
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
function ip(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && $s(a) !== "nenhum alvo") : [];
}
function sp(e, t) {
  return `${$s(e)}:${t}`;
}
function lp(e) {
  const t = hp(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: bp(e),
    formula: yp(e) ?? "—",
    total: t,
    diceBreakdown: Jf(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function to(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: cp(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: ve(o)
  } : null;
}
function cp(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function up(e, t) {
  const n = dp(t), r = mp(n)?.textContent?.trim(), a = fp(n), o = a?.getAttribute(rp) ?? null, s = a?.getAttribute(ap) ?? (o ? me(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: pp(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: ys(e)
  };
}
function dp(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function mp(e) {
  return Br(e, `.${i}__resistance-description`);
}
function fp(e) {
  return Br(e, Gt);
}
function pp(e) {
  return Br(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Br(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function gp(e, t) {
  return e ? t === null ? ws : e.total >= t ? Mr : Fr : Rs;
}
function hp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function yp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function bp(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function $s(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Ap(e) {
  return e === Mr ? "succeeded" : e === Fr ? "failed" : "pending";
}
function ks(e) {
  if (!e) return null;
  const t = e.actorId ? Rp(e.actorId) : null, n = t ? _p(t, e.itemId, e.itemName) : null;
  return n || Tp(e.itemId, e.itemName);
}
function _p(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Ie(o)) return o;
  }
  const a = Ct(n);
  if (a) {
    const o = r?.find?.((s) => Ie(s) ? Ct(s.name) === a : !1);
    if (Ie(o)) return o;
  }
  return null;
}
function Tp(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Ie(a)) return a;
  }
  const r = Ct(t);
  if (r) {
    const a = n?.find?.((o) => Ie(o) ? Ct(o.name) === r : !1);
    if (Ie(a)) return a;
  }
  return null;
}
function Rp(e) {
  const n = game.actors?.get?.(e);
  return wp(n) ? n : null;
}
function wp(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ie(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Ct(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ur(e) {
  const t = fn(e);
  if (!t) return null;
  const n = $p().filter((o) => fn(kp(o)) === t).map((o) => Es(o)).find(Ze) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Ze(o) && fn(o.name) === t);
  return Ze(a) ? a : null;
}
function $p() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function kp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Es(e)?.name ?? null;
}
function Es(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ze(t)) return t;
  const n = e.document?.actor;
  return Ze(n) ? n : null;
}
function Ze(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function fn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Is(e) {
  const t = Sp();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Ep(e)
  });
}
function Ep(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${wt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Ip(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${wt(e.conditions.join(", "))}</li>` : "";
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
function Ip(e) {
  const t = Cp(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${wt(a)}</li>`;
}
function Cp(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = no(n?.value);
  return r === null ? null : {
    value: r,
    max: no(n?.max)
  };
}
function no(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Sp() {
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
async function Lp(e) {
  await Is(Dp(e));
}
function Dp(e) {
  if (vp(e)) return e;
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
function vp(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Cs(e) {
  return e.mode, `✓ ${Ss(e.inputAmount)} PV`;
}
function Pp(e) {
  const t = Ss(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ss(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Np {
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
    } : Ut(t.resistanceGateMode, t.resistanceState) ? {
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
class xp {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? fe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : Ut(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Op {
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
const Mp = `.${i}__actions`, qr = `.${i}__actions-title`, Pe = `.${i}__button`, Fp = "data-paranormal-toolkit-action-section", Bp = `${i}__button--executed`, Up = "data-paranormal-toolkit-executed-label";
function Ls(e) {
  return X(e.querySelector(qr)?.textContent);
}
function qp(e, t) {
  const n = e.querySelector(qr);
  n && (n.textContent = t);
}
function st(e, t) {
  const n = X(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return X(a) === n;
  }) ?? null;
}
function jr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ye(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const ht = "data-paranormal-toolkit-prompt-id", Ds = "multiTargetResistanceResults", vs = "multiTargetDamageApplications", Ps = "multiTargetEffectApplications";
function jp(e) {
  const t = /* @__PURE__ */ new Map(), r = Wt(e)?.[Ds];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    Yp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Gp(e, t) {
  await Gr(e, Ds, t.targetId, t);
}
function zp(e) {
  const t = /* @__PURE__ */ new Map(), r = Wt(e)?.[vs];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    Qp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Vp(e, t) {
  await Gr(
    e,
    vs,
    t.targetId,
    t
  );
}
function Hp(e) {
  const t = /* @__PURE__ */ new Map(), r = Wt(e)?.[Ps];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    Xp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Wp(e, t) {
  await Gr(
    e,
    Ps,
    t.targetId,
    t
  );
}
function Kp(e) {
  const t = Wt(e);
  return t ? {
    actorId: pn(t.actorId),
    itemId: pn(t.itemId),
    itemName: pn(t.itemName)
  } : null;
}
async function Gr(e, t, n, r) {
  const a = Ns(e);
  if (!a) return;
  const o = xs(e), s = Os(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!B(u) || u.pendingId !== a) return u;
    const m = B(u[t]) ? u[t] : {};
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
function Wt(e) {
  const t = Ns(e);
  if (!t) return null;
  const n = xs(e), r = Os(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => B(o) ? o.pendingId === t : !1) ?? null;
}
function Ns(e) {
  return (e.closest(`[${ht}]`) ?? e.querySelector(`[${ht}]`) ?? e.parentElement?.querySelector(`[${ht}]`) ?? null)?.getAttribute(ht) ?? null;
}
function xs(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Jp(a) ? a : null;
}
function Os(e) {
  const t = e?.getFlag?.(d, jt);
  return B(t) ? t : null;
}
function Yp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Qp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Zp(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Zp(e) {
  return e === "normal" || e === "half";
}
function Xp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function pn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Jp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function B(e) {
  return !!(e && typeof e == "object");
}
const eg = "data-paranormal-toolkit-resistance-skill", tg = "data-paranormal-toolkit-resistance-skill-label", Fn = "data-paranormal-toolkit-multi-target-section", zr = "data-paranormal-toolkit-multi-target-damage-info", Ms = "data-paranormal-toolkit-multi-target-effect-info", Fs = "data-paranormal-toolkit-multi-target-toggle", Bs = "data-paranormal-toolkit-multi-target-details", N = "data-paranormal-toolkit-multi-target-target", ng = "data-paranormal-toolkit-multi-target-state", Bn = "data-paranormal-toolkit-multi-target-roll-total", Un = "data-paranormal-toolkit-multi-target-roll-formula", $t = "data-paranormal-toolkit-multi-target-roll-dice", qn = "data-paranormal-toolkit-multi-target-roll-skill", jn = "data-paranormal-toolkit-multi-target-roll-skill-label", Gn = "data-paranormal-toolkit-multi-target-roll-target-name", zn = "data-paranormal-toolkit-multi-target-roll-rolled-at", Vn = "data-paranormal-toolkit-multi-target-damage-mode", Hn = "data-paranormal-toolkit-multi-target-damage-input-amount", ro = "data-paranormal-toolkit-multi-target-damage-final-amount", ao = "data-paranormal-toolkit-multi-target-damage-blocked", Wn = "data-paranormal-toolkit-multi-target-damage-target-name", Kn = "data-paranormal-toolkit-multi-target-damage-applied-at", Yn = "data-paranormal-toolkit-multi-target-effect-condition-id", Qn = "data-paranormal-toolkit-multi-target-effect-condition-label", Zn = "data-paranormal-toolkit-multi-target-effect-effect-id", Xn = "data-paranormal-toolkit-multi-target-effect-created", Jn = "data-paranormal-toolkit-multi-target-effect-refreshed", er = "data-paranormal-toolkit-multi-target-effect-target-name", tr = "data-paranormal-toolkit-multi-target-effect-applied-at", rg = new is(ds()), ag = new ns(new ts()), og = new rs(new Nr()), ig = new Op(og), sg = new Np(ag), lg = new xp(rg), cg = Rs, Fe = Mr, lt = Fr, ug = ws;
function dg(e) {
  const t = Us(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), _g(e);
  const n = Tg(e.rollCard, t), r = Rg(e.rollCard, t);
  !n && r && nh(e.rollCard, r, e.effectSection);
  const a = Cg(e.rollCard);
  return Gs(a, t), Jg(
    e.rollCard,
    a,
    wg(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && rh(e.rollCard, r, a), !0;
}
function Us(e) {
  return op({
    ...e,
    resistanceResults: pg(e.rollCard),
    damageApplications: gg(e.rollCard),
    effectApplications: hg(e.rollCard),
    resolveTargetConditionApplication: mg,
    resistanceGateMode: Hr()
  });
}
function mg(e, t, n) {
  const r = Kp(e), a = ks(r);
  if (!a) return null;
  const o = ot(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = fg(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function fg(e, t, n) {
  const r = Df(
    e,
    n,
    t,
    gn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = gn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => gn(s) === a)) ?? null : null;
}
function pg(e) {
  const t = jp(e);
  for (const [n, r] of Ag(e))
    t.set(n, r);
  return t;
}
function gg(e) {
  const t = zp(e);
  for (const [n, r] of bg(e))
    t.set(n, r);
  return t;
}
function hg(e) {
  const t = Hp(e);
  for (const [n, r] of yg(e))
    t.set(n, r);
  return t;
}
function yg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = n.getAttribute(Yn), o = n.getAttribute(Qn), s = n.getAttribute(Zn), l = so(n.getAttribute(Xn)), c = so(n.getAttribute(Jn)), u = n.getAttribute(er), m = n.getAttribute(tr);
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
function bg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = n.getAttribute(Vn), o = Js(n.getAttribute(Hn)), s = n.getAttribute(Wn), l = n.getAttribute(Kn);
    !r || !ih(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Ag(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = Js(n.getAttribute(Bn)), o = n.getAttribute(Un), s = n.getAttribute(qn), l = n.getAttribute(jn), c = n.getAttribute(Gn), u = n.getAttribute(zn);
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
function _g(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Tg(e, t) {
  if (!t.damage)
    return qs(e)?.remove(), null;
  const n = $g(e);
  return kg(n, t.damage), Ig(e, n), n;
}
function Rg(e, t) {
  if (!t.effect)
    return Xs(e)?.remove(), null;
  const n = eh(e);
  return th(n, t.effect), n;
}
function wg(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : st(e, "Conjuração");
}
function $g(e) {
  const t = qs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(zr, "true"), n;
}
function qs(e) {
  return e.querySelector(`[${zr}="true"]`);
}
function kg(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(js(t.formula, t.total, t.diceBreakdown));
}
function js(e, t, n, r = !1) {
  const a = Xf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Eg(a, r), a;
}
function Eg(e, t) {
  const n = e.querySelector(zt), r = e.querySelector(vr);
  if (!n || !r) return;
  e.classList.toggle(Dr, t), n.hidden = !t, r.classList.add(Pr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Ig(e, t) {
  const n = st(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Cg(e) {
  const t = e.querySelector(`[${Fn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Fn, "true"), n;
}
function Gs(e, t) {
  const n = Sg(e);
  e.replaceChildren(Lg(t), vg(t, n));
}
function Sg(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${N}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(N)).filter(oh)
  );
}
function Lg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Dg(e.targets), t.append(n, r), t;
}
function Dg(e) {
  const t = e.length, n = e.filter((l) => l.state === lt).length, r = e.filter((l) => l.state === Fe).length, a = e.filter((l) => l.state === cg).length, o = e.filter((l) => l.state === ug).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function vg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Pg(r, e, t.has(r.id)));
  return n;
}
function Pg(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(N, e.id), r.setAttribute(ng, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), zs(r, e.resistanceResult), Vs(r, e.damageApplication), Hs(r, e.effectApplication);
  const a = Ng(e, t, r), o = Yg(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    io(s.target) || oo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || io(s.target) || (s.preventDefault(), oo(r));
  }), r.append(a, o), r;
}
function zs(e, t) {
  if (!t) {
    e.removeAttribute(Bn), e.removeAttribute(Un), e.removeAttribute($t), e.removeAttribute(qn), e.removeAttribute(jn), e.removeAttribute(Gn), e.removeAttribute(zn);
    return;
  }
  e.setAttribute(Bn, String(t.total)), e.setAttribute(Un, t.formula), e.setAttribute(qn, t.skill), e.setAttribute(jn, t.skillLabel), e.setAttribute(Gn, t.targetName), e.setAttribute(zn, t.rolledAt), t.diceBreakdown ? e.setAttribute($t, t.diceBreakdown) : e.removeAttribute($t);
}
function Vs(e, t) {
  if (!t) {
    e.removeAttribute(Vn), e.removeAttribute(Hn), e.removeAttribute(ro), e.removeAttribute(ao), e.removeAttribute(Wn), e.removeAttribute(Kn);
    return;
  }
  e.setAttribute(Vn, t.mode), e.setAttribute(Hn, String(t.inputAmount)), e.removeAttribute(ro), e.removeAttribute(ao), e.setAttribute(Wn, t.targetName), e.setAttribute(Kn, t.appliedAt);
}
function Hs(e, t) {
  if (!t) {
    e.removeAttribute(Yn), e.removeAttribute(Qn), e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Jn), e.removeAttribute(er), e.removeAttribute(tr);
    return;
  }
  e.setAttribute(Yn, t.conditionId), e.setAttribute(Qn, t.conditionLabel), e.setAttribute(Zn, t.effectId ?? ""), e.setAttribute(Xn, String(t.created)), e.setAttribute(Jn, String(t.refreshed)), e.setAttribute(er, t.targetName), e.setAttribute(tr, t.appliedAt);
}
function Ng(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = xg(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Og(e, t.resistance);
  Ug(l, n, e, t);
  const c = Kg(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), Qs(u, [
    Ws(e, t, "compact"),
    Ys(e, t, "compact")
  ]), r.append(a, u), r;
}
function xg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Og(e, t) {
  if (!he())
    return Mg(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Bg(e, t)), t?.skill && (n.setAttribute(eg, t.skill), n.setAttribute(tg, t.skillLabel ?? me(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Fe ? "✓" : e.state === lt ? "✕" : "", n.append(r, a), n;
}
function Mg(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Fg(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Fe ? "✓" : e.state === lt ? "✕" : "", n.append(r, a), n;
}
function Fg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Fe ? "sucesso" : e.state === lt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Bg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Fe ? "sucesso" : e.state === lt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Ug(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !he() || e.addEventListener("click", (a) => {
    a.stopPropagation(), qg(t, e, n, r);
  });
}
async function qg(e, t, n, r) {
  if (!he()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? me(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Ur(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await ig.execute({ actor: l, skill: o, skillLabel: s });
    await ah(u.roll);
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
    zs(e, m);
    try {
      await Gp(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    Vr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Vr(e) {
  const t = e.closest(`[${Fn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Us({
    rollCard: n,
    damageSection: jg(n) ?? st(n, "Dano"),
    effectSection: Gg(n)
  });
  r && Gs(t, r);
}
function jg(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(zr) !== "true") ?? null;
}
function Gg(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function zg(e) {
  return Me(e.assistedActions.policy.damageActionState);
}
function Vg(e) {
  return Me(e.assistedActions.policy.effectActionState);
}
function Hr() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
function Ws(e, t, n) {
  if (e.damageApplication)
    return j(
      "✓",
      Cs({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Me(r))
    return j(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = Ks(a, t.damage);
  if (o === null)
    return j(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Pp({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = j(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const y = u.closest(`[${N}]`);
    y && Hg(y, u, e, t);
  }), u;
}
function Ks(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Hg(e, t, n, r) {
  if (n.damageApplication) return;
  if (zg(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = Ks(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Ur(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await sg.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Hr(),
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
    Vs(e, m);
    try {
      await Vp(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", y);
    }
    try {
      await Lp(u.value);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", y);
    }
    Vr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Ys(e, t, n) {
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
  if (Me(r))
    return j(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (gs(r))
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
    const l = o.closest(`[${N}]`);
    l && Wg(l, o, e, t);
  }), o;
}
async function Wg(e, t, n, r) {
  if (n.effectApplication) return;
  if (Vg(n)) {
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
  const o = Ur(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await lg.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Hr(),
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
    Hs(e, c);
    try {
      await Wp(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Vr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Qs(e, t) {
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
function Kg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Fs, "true"), t.setAttribute("aria-hidden", "true"), Zs(e, t), t;
}
function oo(e) {
  const t = e.querySelector(`[${Bs}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Fs}="true"]`);
  r && Zs(e, r);
}
function Zs(e, t) {
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
function Yg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Bs, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Qg(e, t.resistance);
  s && r.append(s);
  const l = Zg(e, t.resistance), c = Xg(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Qg(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Fe ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Zg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = js(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Xg(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), Qs(n, [
    Ws(e, t, "full"),
    Ys(e, t, "full")
  ]), n;
}
function Jg(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function eh(e) {
  const t = Xs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Ms, "true"), n;
}
function Xs(e) {
  return e.querySelector(`[${Ms}="true"]`);
}
function th(e, t) {
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
function nh(e, t, n) {
  const r = n?.parentElement === e ? n : st(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function rh(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function gn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function ah(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function oh(e) {
  return typeof e == "string" && e.length > 0;
}
function ih(e) {
  return e === "normal" || e === "half";
}
function so(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function Js(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const lo = "data-paranormal-toolkit-card-layout-refresh-bound";
function sh(e) {
  const t = e.rollCard.querySelector(Gt);
  t && t.getAttribute(lo) !== "true" && (t.setAttribute(lo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Ce = "data-paranormal-toolkit-prompt-id", lh = "apply-damage", ch = "data-paranormal-toolkit-multi-target-damage-info";
function uh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(ch) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function dh(e) {
  const t = fh(e);
  return t.find((n) => n.getAttribute(Fp) === lh) ?? t.find((n) => Ls(n) === "aplicar danos") ?? null;
}
function mh(e) {
  const t = el(e), n = co(t);
  return n || co(ph(e));
}
function co(e) {
  return e.find((t) => {
    const n = Ls(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function fh(e) {
  const t = el(e);
  return t.length > 0 ? t : Wr(e);
}
function el(e) {
  const t = yh(e);
  return t ? Wr(e).filter((n) => hh(n, t)) : [];
}
function ph(e) {
  const t = tl(e);
  if (!t) return [];
  const n = gh(e, t);
  return Wr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => nl(e, r)).filter((r) => !n || bh(r, n));
}
function Wr(e) {
  const t = tl(e);
  return t ? Array.from(t.querySelectorAll(Mp)) : [];
}
function tl(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function gh(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && nl(e, n)) ?? null;
}
function hh(e, t) {
  return e.getAttribute(Ce) === t ? !0 : Array.from(e.querySelectorAll(`[${Ce}]`)).some((n) => n.getAttribute(Ce) === t);
}
function yh(e) {
  return e.getAttribute(Ce) ?? e.querySelector(`[${Ce}]`)?.getAttribute(Ce) ?? null;
}
function nl(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function bh(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Ah(e) {
  const t = rl(), n = Ht(e.rollCard).state, r = Or({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Me(a), s = gs(a);
  return e.applied ? ze({
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
  }) : r.policy.canShowApplyEffect ? ze(o ? {
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
  }) : ze({
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
function ze(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function _h(e) {
  const { rollCard: t } = e, n = wh(), r = rl(), a = Ht(t).state, o = Or({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Me(s), c = Rh(e);
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
      summary: Th(a)
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
function Th(e) {
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
function Rh(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function wh() {
  try {
    return qu();
  } catch {
    return "assisted";
  }
}
function rl() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
const $h = "data-paranormal-toolkit-damage-resolution-state", uo = "data-paranormal-toolkit-damage-icon-enhanced", Kr = "data-paranormal-toolkit-damage-original-label", kh = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, al = "Outra opção escolhida";
function Eh(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), qp(t, "Aplicar dano"), Ih(e, t);
}
function Ih(e, t) {
  const n = Array.from(t.querySelectorAll(Pe)), r = fo(n, "normal"), a = fo(n, "half");
  if (!r || !a) {
    Ch(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  po(r, "normal"), po(a, "half");
  const o = _h({
    rollCard: e,
    normalButtonApplied: St(r),
    halfButtonApplied: St(a),
    normalButtonSkipped: nr(r),
    halfButtonSkipped: nr(a)
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
    Lh(e, t.visible), Dh(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function Ch(e) {
  for (const t of e)
    nr(t) && t.remove();
}
function St(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(al);
}
function nr(e) {
  return e.textContent?.includes(al) ?? !1;
}
function fo(e, t) {
  const n = kh[t];
  return e.find((r) => n.test(Sh(r))) ?? null;
}
function Sh(e) {
  return [
    e.getAttribute(Kr),
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
  ), e.setAttribute(uo, "true"), e.setAttribute(Kr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ye(n));
}
function go(e) {
  St(e) || e.remove();
}
function Lh(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function Dh(e, t, n, r = "Role resistência") {
  if (!St(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ye(r));
      return;
    }
    e.removeAttribute("aria-disabled"), vh(e, n);
  }
}
function vh(e, t) {
  const n = e.getAttribute(Kr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Ph(t), ye(n)));
}
function Ph(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function ho(e, t, n) {
  e.setAttribute($h, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(qr)?.after(a);
}
const tt = "data-paranormal-toolkit-effect-icon-enhanced", Ne = "data-paranormal-toolkit-effect-action-compacted", Kt = "data-paranormal-toolkit-effect-resistance-gate", Yr = "data-paranormal-toolkit-effect-section", Qr = "data-paranormal-toolkit-effect-label";
function Nh(e) {
  return e.querySelector(`[${Yr}="true"]`);
}
function xh(e) {
  const t = Mh(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Bh(), r = Kh(n, e.sourceActions, t);
  return r && n.setAttribute(Qr, r), Uh(n, t, r), Hh(e.rollCard, n, e.after ?? e.fallbackAfter), Wh(e.sourceActions, n), n;
}
function Oh(e, t) {
  const n = t.querySelector(Pe);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = ll(t, n, r), o = ol(e, n), s = Ah({
    rollCard: e,
    effectLabel: a,
    applied: Xr(n, r),
    effectCanApplyOnSuccessfulResistance: o ? ve(o) === "success" || ve(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? ps(o) : !1
  });
  if (s.applied) {
    Qh(n);
    return;
  }
  if (!s.visible) {
    Zh(n);
    return;
  }
  if (s.waitingForResistance) {
    Xh(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    Jh(n, s.compactLabel);
    return;
  }
  ey(n), sl(n, s.displayLabel);
}
function Mh(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Pe) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Pe) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Fh(e.rollCard, r) ?? r[0] ?? null;
}
function Fh(e, t) {
  const n = Ht(e).state, r = ms(n), a = il(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = ol(e, o, a);
    if (s && fs(s, r)) return o;
  }
  return null;
}
function ol(e, t, n = il(e)) {
  const r = Zr(t, t.textContent?.trim() ?? ""), a = Mn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Mn(s) === a)) ?? null : null;
}
function il(e) {
  const t = ks(Bf(e));
  if (!t) return [];
  const n = ot(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function Bh() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Yr, "true"), e;
}
function Uh(e, t, n) {
  e.setAttribute(Yr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = qh(e), a = jh(r);
  a.textContent = "Efeito";
  const o = Gh(e, r), s = zh(o);
  s.textContent = ty(n ?? ll(e, t, t.textContent?.trim() ?? ""));
  const l = Vh(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Pe)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Xr(t, c) && !Yh(t, c) && sl(t, n ?? c);
}
function qh(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function jh(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Gh(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function zh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function Vh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function Hh(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Wh(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Pe)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function Kh(e, t, n) {
  const r = e.getAttribute(Qr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Zr(n, n.textContent?.trim() ?? "");
}
function Zr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && X(n) !== "efeito aplicado") return n;
  const r = Uf(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && X(a) !== "aplicado" ? a : null;
}
function Xr(e, t) {
  return e.classList.contains(Bp) || X(t).includes("aplicado");
}
function Yh(e, t) {
  const n = e.getAttribute(Kt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Mn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function sl(e, t) {
  e.getAttribute(Ne) === "true" && e.getAttribute(tt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(tt, "true"), e.setAttribute(Up, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    jr("✦", `${i}__button-icon--effect`),
    ye("Aplicar")
  ));
}
function Qh(e) {
  e.getAttribute(Ne) === "true" && X(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(tt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    jr("✓", `${i}__button-icon--effect-applied`),
    ye("Aplicado")
  ));
}
function ll(e, t, n) {
  const r = e.getAttribute(Qr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Zr(t, n) ?? n;
}
function Zh(e) {
  Xr(e, e.textContent?.trim() ?? "") || e.remove();
}
function Xh(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ne), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Kt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ye(t));
}
function Jh(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ne), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Kt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    jr("✓", `${i}__button-icon--effect-resisted`),
    ye(t)
  );
}
function ey(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Kt), e.removeAttribute("aria-disabled");
}
function ty(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const ny = "data-paranormal-toolkit-card-layout-normalized";
function ry(e) {
  const t = ay(e.rollCard), n = oy(t);
  return sh({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function ay(e) {
  return {
    rollCard: e,
    damageSection: uh(e),
    resistance: e.querySelector(Lr),
    damageActions: dh(e),
    effectActionSource: mh(e),
    effectSection: Nh(e)
  };
}
function oy(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(ny, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = st(t, "Conjuração"), c = iy({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), Eh(t, a));
  const u = xh({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: sy(n, c),
    fallbackAfter: l
  });
  return u && Oh(t, u), u;
}
function iy(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function sy(e, t) {
  return e ?? t;
}
const cl = [0, 80, 180, 400, 900, 1600, 3e3], yo = /* @__PURE__ */ new WeakSet();
function ly(e) {
  ul(e), cy(e);
}
function ul(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    dl(t);
}
function cy(e) {
  if (!yo.has(e)) {
    yo.add(e);
    for (const t of cl)
      globalThis.setTimeout(() => {
        ul(e);
      }, t);
  }
}
function dl(e) {
  const t = ry({
    rollCard: e,
    refreshDelaysMs: cl,
    onRefresh: () => dl(e)
  });
  dg({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const uy = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function dy(e) {
  for (const t of Array.from(e.querySelectorAll(Lr)))
    my(t);
  ly(e);
}
function my(e) {
  const t = e.querySelector(kd), n = e.querySelector(Yi), r = e.querySelector(Gt), a = e.querySelector(Qi);
  if (!r || !t && !n && !a) return;
  const o = fy(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), py(a)), Ay(r), r.parentElement !== e && e.append(r);
}
function fy(e, t) {
  const n = e.querySelector(`.${qa}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(qa), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function py(e) {
  const t = gy(e.textContent ?? "");
  t && (e.setAttribute(uy, "true"), e.replaceChildren(by(t)));
}
function gy(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = hy(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function hy(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: yy(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function yy(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function by(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = _y(e);
  return r && t.append(r), t;
}
function Ay(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Ht(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function _y(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Ty(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Ty(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? bo(e, "highest") : n.includes("kl") ? bo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function bo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Ao(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Jr() {
  const e = globalThis.game;
  return Yt(e) ? e : null;
}
function F(e, t) {
  const n = Ry(e, t);
  return kt(n);
}
function Ry(e, t) {
  return t.split(".").reduce((n, r) => Yt(n) ? n[r] : null, e);
}
function wy(e, t) {
  const n = e.indexOf(":");
  return n < 0 || nt(e.slice(0, n)) !== nt(t) ? null : Be(e.slice(n + 1));
}
function kt(e) {
  return typeof e == "string" ? Be(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Yt(e) {
  return !!e && typeof e == "object";
}
function $y(e) {
  return typeof e == "string";
}
function Qt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Be(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function nt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function rr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function J(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ml(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function ky(e) {
  for (const t of Array.from(e.querySelectorAll(Rd))) {
    const n = vy(t);
    Ey(t), n && (Iy(t, n), Cy(t, n));
  }
}
function Ey(e) {
  for (const t of Array.from(e.querySelectorAll(wd)))
    t.remove();
}
function Iy(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Ki) ?? null, a = r?.querySelector(Td) ?? null, o = r ?? e, s = o.querySelector(Cd);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Yy(t.elementTone), l.textContent = Ky(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Cy(e, t) {
  const n = Sy(e);
  Ly(e, n);
  const r = Dy(t);
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
  const o = e.querySelector(Zi);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Sy(e) {
  return e.closest(`.${i}`)?.querySelector(Ki) ?? null;
}
function Ly(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Sd)))
      a.remove();
}
function Dy(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${rr(e.target)}` : null,
    e.duration ? `Duração: ${rr(e.duration)}` : null,
    e.resistance ? `Resistência: ${ml(e.resistance)}` : null
  ].filter(Qt);
}
function vy(e) {
  const t = Py(e), n = By(e), a = (t ? Fy(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = ea(F(a, "element")), l = H("op.elementChoices", s) ?? _o(se(o, "Elemento")) ?? _o(n.damageType), c = s ?? Qy(l), u = F(a, "circle") ?? se(o, "Círculo"), m = jy(a) ?? se(o, "Alvo"), y = Hy(a, "duration", "op.durationChoices") ?? se(o, "Duração"), R = Uy(e) ?? zy(a) ?? se(o, "Resistência"), b = qy(o) ?? n.cost, p = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: b,
    target: m,
    duration: y,
    resistance: R
  };
  return Wy(p) ? p : null;
}
function Py(e) {
  const t = Ny(e);
  if (!t) return null;
  const n = t.getFlag?.(d, jt), r = Oy(n);
  if (r.length === 0) return null;
  const a = xy(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Ny(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Jr()?.messages?.get?.(n) ?? null : null;
}
function xy(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Ua}]`))) {
    const a = r.getAttribute(Ua)?.trim();
    a && n.add(a);
  }
  return n;
}
function Oy(e) {
  if (!Yt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(My).filter((n) => n !== null) : [];
}
function My(e) {
  return Yt(e) ? {
    pendingId: kt(e.pendingId),
    actorId: kt(e.actorId),
    itemId: kt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter($y) : []
  } : null;
}
function Fy(e) {
  if (!e.itemId) return null;
  const t = Jr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function By(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll($d))) {
    const a = Be(r.textContent);
    if (!a) continue;
    const o = wy(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function Uy(e) {
  const t = Be(e.querySelector(Yi)?.textContent);
  return t ? ml(t) : null;
}
function se(e, t) {
  const n = nt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || nt(r.slice(0, a)) !== n))
      return Be(r.slice(a + 1));
  }
  return null;
}
function qy(e) {
  const t = se(e, "Custo") ?? se(e, "PE");
  return t || (e.map(Be).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function jy(e) {
  const t = F(e, "target");
  if (!t) return null;
  if (t === "area")
    return Gy(e) ?? H("op.targetChoices", t) ?? "Área";
  const n = H("op.targetChoices", t) ?? J(t);
  return [t === "people" || t === "creatures" ? F(e, "targetQtd") : null, n].filter(Qt).join(" ");
}
function Gy(e) {
  const t = F(e, "area.name"), n = F(e, "area.size"), r = F(e, "area.type"), a = t ? H("op.areaChoices", t) ?? J(t) : null, o = r ? H("op.areaTypeChoices", r) ?? J(r) : null;
  return a ? n ? o ? `${a} ${n}m ${rr(o)}` : `${a} ${n}m` : a : null;
}
function zy(e) {
  const t = F(e, "skillResis"), n = F(e, "resistance");
  if (!t || !n) return null;
  const r = H("op.skill", t) ?? J(t), a = Vy(n);
  return [r, a].filter(Qt).join(" ");
}
function Vy(e) {
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
      return H("op.resistanceChoices", e) ?? J(e);
  }
}
function Hy(e, t, n) {
  const r = F(e, t);
  return r ? H(n, r) ?? J(r) : null;
}
function Wy(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Ky(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Yy(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Qt).join(" ");
}
function ea(e) {
  const t = nt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function _o(e) {
  const t = ea(e);
  return t ? H("op.elementChoices", t) ?? J(t) : e ? J(e) : null;
}
function Qy(e) {
  return ea(e);
}
function H(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Jr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const To = "data-paranormal-toolkit-dice-toggle-enhanced";
function Zy(e) {
  for (const t of Array.from(e.querySelectorAll(Xi)))
    fl(t);
}
function Xy(e) {
  const t = gl(e.target);
  if (!t) return;
  const n = ta(t);
  n && (e.preventDefault(), pl(n, t));
}
function Jy(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = gl(e.target);
  if (!t) return;
  const n = ta(t);
  n && (e.preventDefault(), pl(n, t));
}
function fl(e) {
  const t = e.querySelector(zt);
  if (!t) return;
  const n = e.querySelector(vr);
  if (n && n.getAttribute(To) !== "true" && (n.setAttribute(To, "true"), n.classList.add(Pr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function pl(e, t) {
  const n = e.querySelector(zt);
  if (!n) return;
  const r = !e.classList.contains(Dr);
  eb(e, t, n, r);
}
function eb(e, t, n, r) {
  e.classList.toggle(Dr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function gl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(vr);
  if (!t) return null;
  const n = ta(t);
  return n ? (fl(n), t.classList.contains(Pr) ? t : null) : null;
}
function ta(e) {
  const t = e.closest(Xi);
  return t && t.querySelector(zt) ? t : null;
}
const Ro = `${d}-workflow-dice-toggle-styles`;
function tb() {
  if (document.getElementById(Ro)) return;
  const e = document.createElement("style");
  e.id = Ro, e.textContent = `
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
const nb = [0, 100, 500, 1500, 3e3];
let wo = !1, hn = null;
function rb() {
  if (!wo) {
    wo = !0, tb(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ye(Ao(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ye(Ao(t));
    }), Hooks.once("ready", () => {
      Ye(document), ab();
    }), document.addEventListener("click", Xy), document.addEventListener("keydown", Jy);
    for (const e of nb)
      globalThis.setTimeout(() => Ye(document), e);
  }
}
function ab() {
  hn || !document.body || (hn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ye(n);
  }), hn.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ye(e) {
  e && (Wd(e), ky(e), dy(e), Zy(e), Bd(e));
}
function ob() {
  rb();
}
const ib = "data-paranormal-toolkit-action-section", sb = "ritual-log", lb = ".paranormal-toolkit-item-use-prompt__actions", cb = ".paranormal-toolkit-item-use-prompt__actions-title", ub = [0, 100, 500, 1500];
let $o = !1;
function db() {
  if ($o) return;
  const e = (t, n) => {
    ko(gb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), ko(document), $o = !0;
}
function ko(e) {
  for (const t of ub)
    globalThis.setTimeout(() => mb(e), t);
}
function mb(e) {
  fb(e), pb(e);
}
function fb(e) {
  for (const t of e.querySelectorAll(
    `[${ib}="${sb}"]`
  ))
    t.remove();
}
function pb(e) {
  for (const t of e.querySelectorAll(lb)) {
    if (Eo(t.querySelector(cb)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Eo(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function gb(e) {
  if (e instanceof HTMLElement || hb(e))
    return e;
  if (yb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function hb(e) {
  return e instanceof HTMLElement;
}
function yb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Eo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Qe = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, hl = {
  PV: "system.attributes.hp"
}, ar = {
  PV: [Qe.PV, hl.PV],
  SAN: [Qe.SAN],
  PE: [Qe.PE],
  PD: [Qe.PD]
}, or = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class bb {
  getResource(t, n) {
    const r = Io(t, n);
    if (!r.ok)
      return g(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = So(t, n, o, l, "valor atual");
    if (u) return g(u);
    const m = So(t, n, s, c, "valor máximo");
    return m ? g(m) : A({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Io(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Io(e, t) {
  const n = Ab(e.type, t);
  if (n && Co(e, n))
    return A(n);
  const r = ar[t].find(
    (a) => Co(e, a)
  );
  return r ? A(r) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: _b(e, t),
    path: ar[t].join(" | ")
  });
}
function Ab(e, t) {
  return e === "threat" ? hl[t] ?? null : e === "agent" ? Qe[t] : null;
}
function Co(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function _b(e, t) {
  const n = e.type ?? "unknown", r = ar[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function So(e, t, n, r, a) {
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
class Tb {
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
      const s = or.ritualItem.circleCandidates;
      return g({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = Rb(a);
    return o ? A(o) : g({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of or.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Rb(e) {
  if (Lo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Lo(n))
      return n;
  }
  return null;
}
function Lo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const wb = "dice-so-nice";
async function yl(e) {
  if (!$b() || !kb()) return;
  const t = Eb();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function $b() {
  try {
    return _d().enabled;
  } catch {
    return !1;
  }
}
function kb() {
  return game.modules?.get?.(wb)?.active === !0;
}
function Eb() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Do = "occultism";
class bl {
  getDifficulty(t) {
    return Ib(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Sb(t, Do);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await yl(r);
    const a = vb(r);
    return {
      skill: Do,
      skillLabel: "Ocultismo",
      roll: r,
      formula: Db(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: Pb(r)
    };
  }
}
function Ib(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Cb(e) {
  return new bl().rollCastingCheck(e);
}
async function Sb(e, t) {
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
  return Lb(r);
}
function Lb(e) {
  return vo(e) ? e : Array.isArray(e) ? e.find(vo) ?? null : null;
}
function vo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Db(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function vb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Pb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Nb);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Nb(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const xb = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Ob {
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
    const r = n.value, a = Mb(t.ritual, r);
    return a.ok ? a.value ? A(a.value) : A({
      resource: "PE",
      amount: xb[r],
      source: "default-by-circle",
      circle: r
    }) : g(a.error);
  }
}
function Mb(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Fb(n) ? {
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
function Fb(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const yn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Bb(e) {
  if (!Vb(e.item)) return null;
  const t = ir(e.actor) ? e.actor : Ub(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: jb(e.token) ?? qb(t),
    targets: Ir(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Ub(e) {
  const t = e;
  return ir(t.actor) ? t.actor : ir(e.parent) ? e.parent : null;
}
function qb(e) {
  const t = Gb(e) ?? zb(e);
  return t ? Al(t) : null;
}
function jb(e) {
  return sr(e) ? Al(e) : null;
}
function Gb(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return sr(n) ? n : (t.getActiveTokens?.() ?? []).find(sr) ?? null;
}
function zb(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Al(e) {
  const t = e.actor ?? null;
  return {
    tokenId: bn(e.id),
    actorId: bn(t?.id),
    sceneId: bn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Vb(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ir(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function sr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function bn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Hb {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(yn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${yn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Bb(Wb(t));
    if (!n) {
      f.warn(`${yn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Wb(e) {
  return e && typeof e == "object" ? e : {};
}
class Kb {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return An("missing-item-patch");
    if (t.type !== "ritual") return An("unsupported-item-type");
    const a = Yb(r);
    return Object.keys(a).length === 0 ? An("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function Yb(e) {
  const t = {};
  D(t, "name", e.name), D(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (D(t, "system.circle", n.circle), D(t, "system.element", n.element), D(t, "system.target", n.target), D(t, "system.targetQtd", n.targetQuantity), D(t, "system.execution", n.execution), D(t, "system.range", n.range), D(t, "system.duration", n.duration), D(t, "system.skillResis", n.resistanceSkill), D(t, "system.resistance", n.resistance), D(t, "system.studentForm", n.studentForm), D(t, "system.trueForm", n.trueForm)), t;
}
function D(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function An(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Qb {
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
    return this.getNumber(t, or.ritual.dt, 0);
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
class Zb {
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
class Xb {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Jb(t);
    return n.ok ? this.presets.has(t.id) ? g({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, _n(t)), A(t)) : n;
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
    return n ? _n(n) : null;
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
    return Array.from(this.presets.values()).map(_n);
  }
  findForItem(t) {
    return this.list().map((n) => eA(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Jb(e) {
  return !Tn(e.id) || !Tn(e.version) || !Tn(e.label) ? g({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? g({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : A(e);
}
function eA(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = tA(a, t);
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
function tA(e, t) {
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
      const n = Po(t.name), r = e.names.map(Po).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = nA(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Po(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function nA(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function _n(e) {
  return structuredClone(e);
}
function Tn(e) {
  return typeof e == "string" && e.length > 0;
}
function Lt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? g({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : A(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Zt(e.amountFrom);
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
function Zt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function rA(e, t, n) {
  if (!No(e.id) || !No(e.formula))
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
    await yl(a);
    const l = {
      ...n.rollRequests[e.id] ?? _l(e, t),
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
function _l(e, t) {
  const n = e.intent ?? aA(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function aA(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function No(e) {
  return typeof e == "string" && e.length > 0;
}
async function Dt(e, t, n, r, a) {
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
function oA(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = iA(t, n, r, a);
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
    const s = sA(t, n, r, a);
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
function iA(e, t, n, r) {
  const a = Zt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Tl(t.id, "damage", r, t.damageInstances.length),
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
function sA(e, t, n, r) {
  const a = Zt(e.amountFrom);
  return {
    id: Tl(t.id, "healing", r, t.healingInstances.length),
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
function Tl(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function lA(e, t, n) {
  const r = Zt(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function cA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Rl("before", e), xo("before", e), xo("resolve", e);
}
function uA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Rl("apply", e);
}
function dA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Rl(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = mA(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function xo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function mA(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function fA(e, t, n) {
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
async function pA(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return gA(e, t);
    case "spendRitualCost":
      return hA(e, t);
  }
}
async function gA(e, t) {
  const { context: n, resources: r } = e, a = Lt(t, n);
  return a.ok ? wl(await r.spend(n.sourceActor, t.resource, a.value), n) : g(a.error);
}
async function hA(e, t) {
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
  }), wl(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function wl(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), A(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function yA(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = bA(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function bA(e) {
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
class AA {
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
        return yA({
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
    const a = await pA({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = _l(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), A(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await rA(t, r, n);
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Lt(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = lA(t, n, a.value);
    cA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), uA({
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
      const c = await Dt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      oA({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return dA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), A(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Lt(t, n);
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
      const l = await Dt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return A(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await fA(this.messages, t, n);
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
    const l = _A(t, n.intent);
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
function _A(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class TA {
  emitCastStarted(t) {
    Hooks.callAll(_t.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(_t.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(_t.ritual.castFinished, t);
  }
}
class RA {
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
class wA {
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
function $l(e) {
  return {
    id: $A(),
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
function $A() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class kA {
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
    return ue(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = $l(n);
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
class EA {
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
class IA {
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
    const n = Nn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: CA(),
      flags: {
        ...t.flags,
        [d]: {
          ...SA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Nn();
    if (!r.enabled)
      return;
    const a = n.notification ?? Oo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Oo(n);
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
function Oo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function CA() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function SA(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const LA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", kl = `${d}-inline-roll-neutralized`, DA = `${d}-inline-roll-notice`, na = `data-${d}-inline-roll-neutralized`, Mo = `data-${d}-inline-roll-notice`, vA = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Fo(e) {
  const t = HA(e.message), n = await PA(e.message), r = NA(t);
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
async function PA(e) {
  const t = GA(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = xA(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await zA(t, n.content), replacementCount: n.replacementCount };
}
function NA(e) {
  const t = e ? VA(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = El(t);
  return n > 0 && Il(UA(t)), { replacementCount: n };
}
function xA(e) {
  const t = OA(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = El(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Il(n.content), { content: n.innerHTML, replacementCount: a });
}
function OA(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, FA(a.trim()))), replacementCount: t };
}
function El(e) {
  const t = MA(e);
  for (const n of t)
    n.replaceWith(BA(qA(n)));
  return t.length;
}
function MA(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(LA))
    n.getAttribute(na) !== "true" && t.add(n);
  return Array.from(t);
}
function FA(e) {
  return `<span class="${kl}" ${na}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${WA(e)}</span>`;
}
function BA(e) {
  const t = document.createElement("span");
  return t.classList.add(kl), t.setAttribute(na, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Il(e) {
  if (e.querySelector?.(`[${Mo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(DA), t.setAttribute(Mo, "true"), t.textContent = vA, e.append(t);
}
function UA(e) {
  return e.querySelector(".message-content") ?? e;
}
function qA(e) {
  const n = e.getAttribute("data-formula") ?? jA(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function jA(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function GA(e) {
  return e && typeof e == "object" ? e : null;
}
async function zA(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function VA(e) {
  const t = KA(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function HA(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function WA(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function KA(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const vt = "ritualRollConfig", Se = "ritual-roll";
function Xt() {
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
function Cl(e) {
  const t = e.getFlag(d, vt);
  return lr(t);
}
function Sl(e) {
  return Cl(e) ?? Xt();
}
async function YA(e, t) {
  const n = lr(t) ?? lr({
    ...Xt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, vt, n), n;
}
async function QA(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, vt));
    return;
  }
  await e.setFlag(d, vt, null);
}
function lr(e) {
  if (!Jt(e)) return null;
  const t = a_(e.intent);
  if (!t) return null;
  const n = Xt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Pt(e.damageType),
    utilityLabel: Pt(e.utilityLabel) ?? n.utilityLabel,
    note: ra(e.note),
    forms: o_(e.forms)
  };
}
function ZA(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function XA(e) {
  const t = Cl(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = JA(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...e_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: n_(e, t),
    resistance: t.intent === "damage" ? Ll(e) : void 0
  };
}
function JA(e, t) {
  const n = {
    type: "rollFormula",
    id: Se,
    formula: t,
    intent: r_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function e_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Se}.total`,
          ...t_(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Se}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function t_(e) {
  return e ? { damageType: e } : {};
}
function n_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Se]: n
      }
    }
  };
  return Bo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Se]: t.forms.discente.formula.trim()
    }
  }), Bo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Se]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Ll(e) {
  const t = Dl(e), n = Pt(t.skillResis), r = Pt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = i_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function r_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function a_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function o_(e) {
  const t = Xt();
  return Jt(e) ? {
    base: Rn(e.base),
    discente: Rn(e.discente),
    verdadeiro: Rn(e.verdadeiro)
  } : t.forms;
}
function Rn(e) {
  return Jt(e) ? { formula: ra(e.formula) } : { formula: "" };
}
function Bo(e, t) {
  const n = Dl(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return s_(r);
}
function Dl(e) {
  const t = e.system;
  return Jt(t) ? t : {};
}
function i_(e) {
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
function s_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ra(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Pt(e) {
  const t = ra(e);
  return t.length > 0 ? t : null;
}
function Jt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function l_(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function c_(e) {
  switch (u_(e)) {
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
      return d_(String(e ?? ""));
  }
}
function u_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function d_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function m_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function f_(e) {
  return {
    ...aa(e),
    type: "ritual.cast.started"
  };
}
function p_(e) {
  return {
    ...aa(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function g_(e) {
  return {
    ...aa(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function h_(e) {
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
function y_(e, t = {}) {
  const n = v_(e), r = [
    ...N_(t.candidates ?? []),
    ...x_(e)
  ], a = M_(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = P_(t) ?? F_(r) ?? U_(a), s = G_(canvas?.grid?.size), l = b_(o, a, r), c = E_(r), u = k_(l);
  return {
    type: "rectangleRay",
    sceneId: q_(e, n),
    regionId: zo(n?.id) ?? zo(e.id),
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
function b_(e, t, n) {
  const r = {
    x: L(e.x) ?? 0,
    y: L(e.y) ?? 0,
    width: L(e.width) ?? t.width,
    height: L(e.height) ?? t.height,
    direction: L(e.direction) ?? 0,
    elevation: L(e.elevation)
  };
  return {
    ...r,
    direction: A_(r, t, n)
  };
}
function A_(e, t, n) {
  const r = __(n);
  return r !== null ? r : R_(e, t) ?? e.direction;
}
function __(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = Uo(n, t);
    if (r !== null) return r;
    const a = j_(n), o = Uo(a, t);
    if (o !== null) return o;
  }
  return null;
}
function Uo(e, t) {
  for (const n of t) {
    const r = T_(Xe(e, n));
    if (r !== null) return r;
  }
  return null;
}
function T_(e) {
  const t = L(e);
  if (t === null) return null;
  const n = ia(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function R_(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = jo(qo(e, e.direction), t), r = w_(e, t);
  if (r === null) return null;
  const o = $_([
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
    error: jo(qo(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(1, Math.min(e.width, Math.max(e.height, 1)) * 0.05);
  return o.error <= s ? ia(o.direction) : null;
}
function w_(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Vo(o, 0, 1), c = Vo(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : z_(Math.atan2(c, l));
}
function qo(e, t) {
  const n = vl(t), r = {
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
function jo(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function $_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = ia(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function k_(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = vl(e.direction), n = {
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
function E_(e) {
  for (const t of e) {
    const n = Go(t, "ray.start"), r = Go(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Go(e, t) {
  const n = Xe(e, t), r = L(Xe(n, "x")), a = L(Xe(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function aa(e) {
  const t = h_(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: S_(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: I_(e.context.item, e.form, e.formLabel, t),
    targets: n.map(L_),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function I_(e, t, n, r) {
  return {
    name: e.name,
    slug: wn(e, "system.slug") ?? wn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: wn(e, "system.element"),
    circle: D_(e),
    form: C_(t),
    formLabel: n
  };
}
function C_(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function S_(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function L_(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function D_(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : de(t);
}
function wn(e, t) {
  return de(foundry.utils.getProperty(e, t));
}
function de(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function v_(e) {
  return "document" in e && e.document ? e.document : e;
}
function P_(e) {
  return e.shape && cr(e.shape) ? e.shape : null;
}
function N_(e) {
  return e.filter(oa);
}
function x_(e) {
  return [
    e,
    O_(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(oa);
}
function O_(e) {
  return "object" in e && oa(e.object) ? e.object : null;
}
function oa(e) {
  return !!(e && typeof e == "object");
}
function M_(e) {
  const t = e.map((n) => n.bounds);
  for (const n of t) {
    if (!n) continue;
    const r = L(n.x), a = L(n.y), o = L(n.width), s = L(n.height);
    if (!(r === null || a === null || o === null || s === null))
      return { x: r, y: a, width: o, height: s };
  }
  return null;
}
function F_(e) {
  for (const t of e) {
    const n = B_(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function B_(e) {
  if (!e || typeof e != "object") return [];
  const t = e.shapes;
  if (Array.isArray(t)) return t.filter(cr);
  const n = e.toObject;
  if (typeof n != "function") return [];
  const r = n.call(e);
  return Array.isArray(r?.shapes) ? r.shapes.filter(cr) : [];
}
function cr(e) {
  return !!(e && typeof e == "object" && typeof e.type == "string");
}
function U_(e) {
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
function q_(e, t) {
  return $n(e, "parent.id") ?? $n(e, "document.parent.id") ?? $n(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function $n(e, t) {
  return de(Xe(e, t));
}
function Xe(e, t) {
  if (!(!e || typeof e != "object"))
    return foundry.utils.getProperty(e, t);
}
function j_(e) {
  if (!e || typeof e != "object") return null;
  const t = e.toObject;
  if (typeof t != "function") return null;
  const n = t.call(e);
  return n && typeof n == "object" ? n : null;
}
function zo(e) {
  return de(e);
}
function L(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function G_(e) {
  const t = L(e);
  return t !== null && t > 0 ? t : null;
}
function vl(e) {
  return e * Math.PI / 180;
}
function z_(e) {
  return e * 180 / Math.PI;
}
function ia(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Vo(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class V_ {
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
class en {
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
const H_ = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class W_ {
  constructor(t = new en()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = K_(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(H_);
  }
}
function K_(e, t) {
  const n = [], r = Y_(e), a = Ho(r), o = Ho(e);
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
function Y_(e) {
  return Q_(e) ? e.document ?? null : e;
}
function Q_(e) {
  return "bounds" in e;
}
function Ho(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const Z_ = 100, X_ = 12;
class J_ {
  constructor(t = new en()) {
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
      const a = this.foundryAdapter.getGridSize() ?? Z_, o = aT(n), s = await this.foundryAdapter.placeRegion(
        eT(t, this.foundryAdapter.getUserColor(), a),
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
        message: rT(a)
      };
    }
  }
}
function eT(e, t, n) {
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
    shapes: [tT(e, n)]
  };
}
function tT(e, t) {
  const n = nT(e, t);
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
function nT(e, t) {
  return {
    length: Wo(e.length, X_, t),
    width: Wo(e.width, 1, t)
  };
}
function Wo(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function rT(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function aT(e) {
  const t = (n) => {
    const r = oT(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function oT(e) {
  return iT(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function iT(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class sT {
  constructor(t = new en()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(Ko(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Ko(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = lT(t);
    cT(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Ko(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function lT(e) {
  return Array.from(new Set(e));
}
function cT(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class uT {
  constructor(t = new en()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Mi)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(dT(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(mT(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: ur(r.region)
    }));
    for (const r of t) {
      if (!ur(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = pT(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function dT(e) {
  return [
    { source: "document", region: ce(e.document) },
    { source: "document.object", region: ce(e.document.object) },
    { source: "preview", region: ce(e.preview) },
    { source: "preview.document.object", region: ce(e.preview?.document?.object) }
  ];
}
function mT(e) {
  return [
    { source: "input", region: ce(e) },
    { source: "input.object", region: fT(e) ? ce(e.object) : null },
    { source: "input.document.object", region: Pl(e) ? ce(e.document?.object) : null }
  ];
}
function ce(e) {
  return ur(e) ? e : null;
}
function ur(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return bt(n.x) && bt(n.y) && bt(n.width) && bt(n.height);
}
function Pl(e) {
  return "document" in e && "bounds" in e;
}
function fT(e) {
  return !Pl(e);
}
function pT(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function bt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const gT = "Nenhum alvo encontrado na linha.";
class hT {
  constructor(t = new J_(), n = new uT(), r = new W_(), a = new sT(), o = new V_()) {
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
        const l = this.regionTargetResolver.resolveTargets(s.region), c = bT(r), u = y_(s.region, {
          candidates: [c?.preview, c?.document],
          shape: c?.shape
        });
        return l.targets.length === 0 ? (o(), this.foundryAdapter.warn(gT), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(l.tokens), {
          status: "confirmed",
          targets: l.targets,
          areaSnapshot: u
        });
      } catch (l) {
        o();
        const c = yT(l);
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
function yT(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function bT(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function AT(e) {
  return {
    header: {
      eyebrow: Tr,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: IT(e.ritual)
    },
    forms: e.variantOptions.map((t) => _T(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: wT(e.targetNames, e.variantOptions, e.ritual),
    automation: ET(e.automationStatus ?? "assisted")
  };
}
function _T(e, t) {
  const n = TT(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? RT(t) : "—",
    details: n
  };
}
function TT(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function RT(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function wT(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => $T(a, n))
  };
}
function $T(e, t) {
  const n = e.targeting ?? kT(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function kT(e, t) {
  const n = ot(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function ET(e) {
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
function IT(e) {
  const t = e.system, n = [ST(t?.element), CT(t?.circle)].filter(vT);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function CT(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function ST(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (LT(e)) {
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
      return DT(e);
  }
}
function LT(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function DT(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function vT(e) {
  return typeof e == "string" && e.length > 0;
}
const Nl = ["base", "discente", "verdadeiro"];
function sa(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Nt(e) {
  return typeof e == "string" && Nl.includes(e);
}
const { ApplicationV2: PT } = foundry.applications.api;
class Je extends PT {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = AT(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    OT(a, (o) => {
      this.selectedVariant = o, dr(a, o);
    }), dr(a, this.selectedVariant), MT(a, (o) => {
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
          ${this.model.forms.map(NT).join("")}
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
          ${this.model.targets.forms.map(xT).join("")}
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
    const n = qT(t), r = FT(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function NT(e) {
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
function xT(e) {
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
function OT(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => Yo(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Yo(e, a, t));
    });
  const r = xl(e);
  r && t(r);
}
function Yo(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Nt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), xl(e), dr(e, r.value));
}
function xl(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Nt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function dr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function MT(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function FT(e, t, n) {
  const r = UT(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = BT(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function BT(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function UT(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Nt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Nt(n) ? n : null;
}
function qT(e) {
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
async function jT(e) {
  return Je.request(e);
}
const la = {
  label: "Padrão"
}, GT = {
  label: "Discente",
  extraCost: 2
}, zT = {
  label: "Verdadeiro",
  extraCost: 5
};
class VT {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new hT();
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
    const a = this.resolveCostPreview(t), o = MR(n), s = NR(
      n,
      t.item,
      a,
      o
    ), l = await jT({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((E) => E.name),
      cost: a,
      defaultSpendResource: GR(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = HT(l), u = BR(
      n,
      t.item,
      c.variant,
      o
    ), m = m_(), y = u.label ?? sa(c.variant), R = (E = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: y,
      targets: E
    }), b = (E, I = t.targets, _e = {}) => {
      this.ritualEvents.emitCastFinished(
        g_({
          ...R(I),
          status: E,
          ..._e
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      f_(R())
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
    const T = WT(
      t,
      p.targets
    );
    p.areaSnapshot && this.ritualEvents.emitAreaResolved(
      p_({
        ...R(p.targets),
        area: p.areaSnapshot
      })
    );
    const be = Gi();
    let Y = null;
    if (be) {
      const E = await YT(
        this.resources,
        T.actor,
        c,
        u,
        a
      );
      if (!E.ok)
        return b("failed", T.targets, {
          reason: E.reason,
          message: E.message
        }), {
          status: "failed",
          reason: E.reason,
          message: E.message
        };
      try {
        const I = await Cb(
          T.actor
        );
        Y = ZT(
          I,
          u,
          a
        );
      } catch (I) {
        const _e = I instanceof Error ? I.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return b("failed", T.targets, {
          reason: "ritual-casting-check-failed",
          message: _e
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: _e,
          cause: I
        };
      }
    }
    const Ae = KT(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !be
      }
    );
    if (Ae.steps.length === 0) {
      const E = FR(
        T,
        c
      ), I = Zo(
        n,
        T
      ), _e = Qo(
        T.actor,
        Y,
        u,
        a
      ), Ra = Xo(
        n,
        c,
        u,
        a,
        E,
        T,
        Y
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
      const wa = [
        ..._e,
        ...I.actions
      ];
      return wa.length > 0 ? (b("ready", T.targets), {
        status: "ready",
        workflowContext: E,
        itemUseContext: T,
        actions: wa,
        summaryLines: Ra
      }) : (b("completed-without-actions", T.targets), {
        status: "completed-without-actions",
        workflowContext: E,
        itemUseContext: T,
        summaryLines: Ra
      });
    }
    const x = await this.workflow.runAutomation(Ae, {
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
    if (!x.ok)
      return b("failed", T.targets, {
        reason: x.error.reason,
        message: x.error.message
      }), {
        status: "failed",
        reason: x.error.reason,
        message: x.error.message,
        cause: x.error
      };
    const te = x.value.context, q = rR(
      n,
      T,
      te
    ), O = Zo(
      n,
      T
    ), sn = Qo(
      T.actor,
      Y,
      u,
      a
    ), _a = Xo(
      n,
      c,
      u,
      a,
      te,
      T,
      Y
    );
    if (!q.ok)
      return b("failed", T.targets, {
        reason: q.reason,
        message: q.message
      }), {
        status: "failed",
        reason: q.reason,
        message: q.message
      };
    if (!O.ok)
      return b("failed", T.targets, {
        reason: O.reason,
        message: O.message
      }), {
        status: "failed",
        reason: O.reason,
        message: O.message
      };
    const Ta = [
      ...sn,
      ...q.actions,
      ...O.actions
    ];
    return Ta.length === 0 ? (b("completed-without-actions", T.targets), {
      status: "completed-without-actions",
      workflowContext: te,
      itemUseContext: T,
      summaryLines: _a
    }) : (b("ready", T.targets), {
      status: "ready",
      workflowContext: te,
      itemUseContext: T,
      actions: Ta,
      summaryLines: _a
    });
  }
  async applyAction(t) {
    return Dt(
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
function HT(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function WT(e, t) {
  return {
    ...e,
    targets: t
  };
}
function KT(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || ua(l) && (!a.includeCostSteps || !s) || o.push(QT(l, n));
  return a.includeCostSteps && s && r && zR(n.extraCost) && o.push({
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
async function YT(e, t, n, r, a) {
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
function QT(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function ZT(e, t, n) {
  const a = XT(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function XT(e, t) {
  const n = Ue(e, t);
  return n ? l_(n.amount) : null;
}
function Qo(e, t, n, r) {
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
function Zo(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = ca(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = as(o);
      n.push(
        JT(
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
function JT(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? nR(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: eR(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: tR(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function eR(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function tR(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function nR(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function rR(e, t, n) {
  const r = [], a = /* @__PURE__ */ new Map();
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const s = Lt(o, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = ca(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (aR(o)) {
        oR(
          a,
          c,
          iR(o, n, s.value)
        );
        continue;
      }
      r.push(lR(o, c, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...sR(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function aR(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function oR(e, t, n) {
  const r = mR(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function iR(e, t, n) {
  const r = fR(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function sR(e, t, n, r) {
  const a = yR(e), o = a.length > 1 ? _R() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const y = bR(u.amount, s);
        return {
          id: cR(u, s, m),
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
      label: uR(c, s, a.length > 1),
      executedLabel: dR(
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
function lR(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = hR(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: pR(e, r, n),
    executedLabel: gR(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function cR(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function uR(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function dR(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function mR(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function fR(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function pR(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function gR(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function hR(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function yR(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function bR(e, t) {
  const n = e * t.multiplier, r = AR(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function AR(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function _R() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ca(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Xo(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${sa(t.variant)}`,
    $R(t, n, r),
    ...wR(s),
    ...Object.values(a.rolls).flatMap(kR),
    ...TR(e, o),
    ...ER(e.resistance),
    ...vR(n)
  ];
}
function TR(e, t) {
  return RR(e) ? ca("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function RR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function wR(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function $R(e, t, n) {
  const r = Ue(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function kR(e) {
  const n = [`${PR(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = IR(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${c_(e.damageType)}`), n;
}
function ER(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function IR(e) {
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
    const s = CR(o);
    s && (DR(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function CR(e) {
  const t = SR(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : LR(e);
}
function SR(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function LR(e) {
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
function DR(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function vR(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function PR(e) {
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
function NR(e, t, n, r) {
  return Nl.map((a) => {
    const o = Ol(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? sa(a),
      enabled: s,
      details: o ? xR(o, n, r) : [],
      finalCostText: o ? OR(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function xR(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  a.length > 0 ? r.push(a.join(", ")) : n && r.push("efeito manual");
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
function OR(e, t) {
  const n = Ue(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function MR(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(ua);
}
function FR(e, t) {
  return $l({
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
function BR(e, t, n, r) {
  return Ol(e, t, n, r) ?? la;
}
function Ol(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? qR(t, n) ? UR(n) : null : n === "base" ? la : null);
}
function UR(e) {
  switch (e) {
    case "base":
      return la;
    case "discente":
      return GT;
    case "verdadeiro":
      return zT;
  }
}
function qR(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return jR(foundry.utils.getProperty(e, n));
}
function jR(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function GR(e) {
  return e.steps.some(ua);
}
function ua(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function zR(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Ml = "itemUsePrompts", Fl = "chatCard", tn = "data-paranormal-toolkit-prompt-id", nn = "data-paranormal-toolkit-pending-id", da = "data-paranormal-toolkit-executed-label", mr = "data-paranormal-toolkit-choice-group", Bl = "data-paranormal-toolkit-skipped-label", xt = "data-paranormal-toolkit-action-section", Jo = "data-paranormal-toolkit-detail-key", ei = "data-paranormal-toolkit-roll-card", ma = "data-paranormal-toolkit-roll-detail-toggle", Ul = "data-paranormal-toolkit-roll-detail-id", ql = "data-paranormal-toolkit-resistance-roll-button", jl = "data-paranormal-toolkit-resistance-skill", Gl = "data-paranormal-toolkit-resistance-skill-label", zl = "data-paranormal-toolkit-resistance-target-actor-id", Vl = "data-paranormal-toolkit-resistance-target-name", Hl = "data-paranormal-toolkit-resistance-roll-result", ti = "data-paranormal-toolkit-system-card-replaced", VR = `[${nn}]`, HR = `[${ma}]`, WR = `[${ql}]`, fr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, KR = `${h}__actions`, ni = `${h}__details`, Wl = `${h}__summary`, YR = `${h}__title`, Kl = `${h}__button--executed`, ri = `${h}__roll-card`;
let ai = !1, pr = null;
const U = /* @__PURE__ */ new Map(), QR = [0, 100, 500, 1500, 3e3], ZR = 3e4, XR = [0, 100, 500, 1500, 3e3];
function JR(e) {
  if (pr = e, ai) {
    ii(e);
    return;
  }
  const t = (n, r) => {
    Ql(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ai = !0, ii(e);
}
async function oi(e) {
  const t = Yl(e);
  U.set(e.pendingId, t), await ga(t) || lc(t), Zl(e.pendingId);
}
async function ew(e) {
  const t = Yl({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", U.set(e.pendingId, t), await ga(t) || lc(t), Zl(e.pendingId);
}
async function kn(e, t) {
  const n = U.get(e);
  U.delete(e), n && await e$(n, t);
}
function fa(e) {
  const t = pc();
  for (const n of t) {
    const r = K(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function tw(e, t) {
  const n = fa(e);
  if (!n) return;
  const r = K(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await qe(n.message, r));
}
async function nw(e, t, n) {
  if (!t) return;
  const r = fa(e);
  if (!r) return;
  const a = K(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await qe(r.message, a);
}
function Yl(e) {
  const t = ee(e.context.message), n = e.context.targets.find((s) => br(s)), r = n ? br(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Sw(e.context),
    executed: !1
  };
}
function Ql(e, t, n) {
  Jw();
  const r = an(t);
  if (!r) return;
  const a = Qw(e, r);
  a.length > 0 && Ot(r);
  for (const o of a)
    gr(r, o);
  nc(r, n), hr(r), yr(r);
}
function ii(e) {
  for (const t of XR)
    globalThis.setTimeout(() => {
      rw(e);
    }, t);
}
function rw(e) {
  for (const t of aw()) {
    const n = rn(t);
    ow(n) && Ql(n, t, e);
  }
}
function aw() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function ow(e) {
  return e ? ha(e) ? !0 : n$(e).length > 0 : !1;
}
function Zl(e) {
  const t = U.get(e);
  if (!t) return;
  const n = t.messageId ? Zw(t.messageId) : null;
  if (n) {
    mi(n, t), Ot(n), gr(n, t), si(n), hr(n), yr(n);
    return;
  }
  if (t.messageId) {
    _r(t);
    return;
  }
  const r = Xw(t);
  if (r) {
    mi(r, t), Ot(r), gr(r, t), si(r), hr(r), yr(r);
    return;
  }
  _r(t);
}
function si(e) {
  pr && nc(e, pr);
}
function Ot(e) {
  const t = iw();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = tc(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ti) === "true") return;
  const r = n.querySelector(`.${fr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(ti, "true");
}
function iw() {
  try {
    return Uu() === "replace";
  } catch {
    return !1;
  }
}
function gr(e, t) {
  if (Ot(e), e.querySelector(`[${tn}="${je(t.pendingId)}"]`)) return;
  const n = lw(e, t);
  uw(n, t);
  const r = kw(t);
  if (sw(r)) return;
  $w(n, r).append(Cw(t));
}
function sw(e) {
  return Jl(e.id) && !fe();
}
function Xl(e) {
  const n = e.closest(`[${xt}]`)?.getAttribute(xt) ?? null;
  return Jl(n) && !fe();
}
function Jl(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function lw(e, t) {
  const n = e.querySelector(`.${fr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(fr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(YR), s.textContent = cw(t);
  const l = document.createElement("span");
  return l.classList.add(Wl), l.textContent = t.summary, a.append(o, s, l), r.append(a), Dw(e).append(r), r;
}
function cw(e) {
  const t = v(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function uw(e, t) {
  const n = t.summaryLines ?? [], r = ic(n, t);
  if (r) {
    dw(e, r, t);
    return;
  }
  Ew(e, n);
}
function dw(e, t, n) {
  if (e.querySelector(`[${ei}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(ri, `${ri}--${t.intent}`), r.setAttribute(ei, "true"), t.castingCheck && li(r, fw(t.castingCheck), n.pendingId, "casting"), mw(t) && li(r, pw(t), n.pendingId, "effect"), Aw(r, t), _w(r, t, n), ww(r, t), e.append(r);
}
function mw(e) {
  return e.intent !== "casting";
}
function fw(e) {
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
function pw(e) {
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
function li(e, t, n, r) {
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
  gw(a, t), Rw(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function gw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = hw(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function hw(e, t) {
  const n = yw(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of bw(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function yw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function bw(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ci(e, "highest") : n.includes("kl") ? ci(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ci(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Aw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(_$);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function _w(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Tw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(ec(t.resistanceRollResult)), e.append(r);
}
function Tw(e, t) {
  if (!e.resistanceSkill || !he()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(tn, t.pendingId), n.setAttribute(ql, "true"), n.setAttribute(jl, e.resistanceSkill), n.setAttribute(Gl, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(zl, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Vl, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Hl, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function ec(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = ac(e), t;
}
function Rw(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(ma, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Ul, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const y = document.createElement("dd");
    y.textContent = u.value, c.append(m, y);
  }
  e.append(l, c);
}
function ww(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function $w(e, t) {
  const n = `[${xt}="${je(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(KR), a.setAttribute(xt, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function kw(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ic(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Ew(e, t) {
  if (t.length === 0) return;
  const n = Iw(e);
  for (const r of t) {
    const a = T$(r);
    if (n.querySelector(`[${Jo}="${je(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Jo, a), n.append(o);
  }
}
function Iw(e) {
  const t = e.querySelector(`.${ni}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ni), e.append(n), n;
}
function Cw(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(tn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Kl), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(nn, e.pendingId), t.setAttribute(da, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(mr, e.choiceGroupId), t.setAttribute(Bl, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Sw(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Lw(e);
  return `${t} → ${n}`;
}
function Lw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Dw(e) {
  return tc(e) ?? e;
}
function tc(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function nc(e, t) {
  const n = an(e);
  if (!n) return;
  const r = n.querySelectorAll(VR);
  for (const a of r) {
    if (Xl(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      Vw(a, t);
    }));
  }
}
function hr(e) {
  const t = an(e);
  if (!t) return;
  const n = t.querySelectorAll(HR);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      vw(t, r);
    }));
}
function yr(e) {
  const t = an(e);
  if (!t) return;
  const n = t.querySelectorAll(WR);
  for (const r of n) {
    if (!he()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Pw(t, r);
    }));
  }
}
function vw(e, t) {
  const n = t.getAttribute(ma);
  if (!n) return;
  const r = e.querySelector(`[${Ul}="${je(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Pw(e, t) {
  if (!he()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(tn), r = t.getAttribute(jl), a = t.getAttribute(Gl) ?? (r ? me(r) : "Resistência");
  if (!n || !r) return;
  const o = Ow(e, n), s = Mw(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await rm(s, r);
    await jw(c.roll);
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
    Nw(t, u), xw(t, u), Gw(n, u), await zw(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Nw(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Hl, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function xw(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? ec(t);
  if (r) {
    r.textContent = ac(t);
    return;
  }
  n.append(a);
}
function Ow(e, t) {
  const n = U.get(t);
  if (n) return n;
  const r = rn(e);
  return K(r)[t] ?? null;
}
function Mw(e, t) {
  const n = e?.resistanceTargetActor;
  if (V(n)) return n;
  const a = e?.context?.targets.map(br).find(V) ?? null;
  if (a) return a;
  const o = t.getAttribute(zl) ?? e?.resistanceTargetActorId ?? null, s = o ? Bw(o) : null;
  return s || Uw(
    t.getAttribute(Vl) ?? e?.resistanceTargetName ?? Fw(t)
  );
}
function Fw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Wl}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function br(e) {
  const t = e.actor;
  if (V(t)) return t;
  const n = e.token, r = rt(n);
  if (r) return r;
  const a = e.document;
  return rt(a);
}
function rt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (V(t)) return t;
  const n = e.document?.actor;
  return V(n) ? n : null;
}
function Bw(e) {
  const n = game.actors?.get?.(e);
  return V(n) ? n : rc().map((o) => rt(o)).find((o) => o?.id === e) ?? null;
}
function Uw(e) {
  const t = Le(e);
  if (!t) return null;
  const n = rc().filter((o) => Le(qw(o)) === t).map((o) => rt(o)).find(V) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => V(o) && Le(o.name) === t);
  return V(a) ? a : null;
}
function rc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function qw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : rt(e)?.name ?? null;
}
function Le(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function V(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ac(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function jw(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Gw(e, t) {
  const n = U.get(e);
  n && (n.resistanceRollResult = t);
}
async function zw(e, t, n) {
  const r = rn(e);
  if (r)
    try {
      const a = K(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await qe(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function rn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return W(r?.get?.(n));
}
async function Vw(e, t) {
  if (Xl(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(nn);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    oc(e, e.getAttribute(da) ?? "✓ Automação aplicada"), Hw(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function oc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Kl), e.removeAttribute(nn), e.removeAttribute(da);
}
function Hw(e) {
  const t = e.getAttribute(mr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${mr}="${je(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Bl) ?? "✓ Outra opção escolhida";
    oc(a, o);
  }
}
function ic(e, t) {
  const n = e.map(pa).filter(b$), r = n.find((p) => p.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = v(e, "Forma"), o = v(e, "Custo"), s = v(e, "Dados") ?? v(e, `Dados (${r.label})`), l = v(e, "Tipo"), c = v(e, "Resistência"), u = v(e, "Resistência Perícia"), m = v(e, "Resistência Rótulo") ?? (u ? me(u) : null), y = sc(e, "Observação"), R = e.filter((p) => Yw(p, r)), b = Ww(e);
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
function Ww(e) {
  const t = e.map(pa).find((o) => o?.intent === "casting") ?? null, n = v(e, "Conjuração DT"), r = v(e, "Conjuração Resultado");
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
function pa(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: Kw(n)
  } : null;
}
function Kw(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function v(e, t) {
  return sc(e, t)[0] ?? null;
}
function sc(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function Yw(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || pa(e) ? !1 : e.trim().length > 0;
}
function Qw(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of U.values())
    Ar(r, e, t) && n.set(r.pendingId, r);
  for (const r of t$(e))
    Ar(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Ar(e, t, n) {
  const r = ee(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !di(n, "itemId", e.itemId) ? !1 : !e.actorId || di(n, "actorId", e.actorId);
}
function di(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${R$(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function Zw(e) {
  const t = je(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Xw(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ar(e, null, t))
      return t;
  return null;
}
function Jw() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of U.entries())
    e - r.createdAt > t && U.delete(n);
}
async function mi(e, t) {
  const n = rn(e);
  if (!n) return !1;
  try {
    const r = K(n);
    return r[t.pendingId] = ya(t, ee(n)), await qe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function ga(e) {
  const t = dc(e);
  if (!t) return !1;
  try {
    const n = K(t);
    return n[e.pendingId] = ya(e, ee(t)), await qe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function lc(e) {
  for (const t of QR)
    globalThis.setTimeout(() => {
      _r(e);
    }, t);
}
async function _r(e) {
  const t = dc(e);
  if (ha(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await ga(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function e$(e, t) {
  const n = uc(e.context.message);
  if (n)
    try {
      const r = K(n), a = r[e.pendingId] ?? ya(e, ee(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await qe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function t$(e) {
  return Object.values(K(W(e))).filter(ct);
}
function K(e) {
  if (!e) return {};
  const t = {}, n = ha(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(cc(e)))
    t[r] ??= a;
  return t;
}
function n$(e) {
  return Object.values(cc(W(e))).filter(ct);
}
function cc(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Ml);
  if (!xe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    ct(a) && (n[r] = a);
  return n;
}
async function qe(e, t) {
  typeof e.setFlag == "function" && (await a$(e, t), await r$(e, t));
}
async function r$(e, t) {
  await Promise.resolve(e.setFlag?.(d, Ml, t));
}
function ha(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Fl);
  return h$(t) ? t : null;
}
async function a$(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(ct).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? ee(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: o$(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Fl, a));
}
function o$(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function ya(e, t) {
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
function uc(e) {
  const t = W(e);
  if (t?.setFlag)
    return t;
  const n = i$(e);
  if (n?.setFlag)
    return n;
  const r = ee(e);
  if (!r) return null;
  const a = game.messages;
  return W(a?.get?.(r));
}
function i$(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(W).find((n) => typeof n?.setFlag == "function") ?? null;
}
function dc(e) {
  const t = uc(e.context.message);
  if (t) return t;
  const n = e.messageId ? s$(e.messageId) : null;
  if (n) return n;
  const r = pc().slice().reverse();
  return r.find((a) => l$(a, e)) ?? r.find((a) => c$(a, e)) ?? null;
}
function s$(e) {
  const t = game.messages;
  return W(t?.get?.(e));
}
function l$(e, t) {
  const n = ee(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!mc(e, t)) return !1;
  const a = fc(e);
  return !t.actorId || !a || a === t.actorId;
}
function c$(e, t) {
  if (!d$(e, t)) return !1;
  const n = fc(e);
  return t.actorId && n === t.actorId ? !0 : mc(e, t);
}
function mc(e, t) {
  const n = Le(u$(e));
  if (!n) return !1;
  const r = Le(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Le(t.itemId);
  return !!(a && n.includes(a));
}
function u$(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function fc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function d$(e, t) {
  const n = m$(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= ZR;
}
function m$(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function W(e) {
  return e && typeof e == "object" ? e : null;
}
function ct(e) {
  return xe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && ie(e.resistanceTargetActorId) && ie(e.resistanceTargetName) && y$(e.resistanceRollResult) && f$(e.actionPayload) && En(e.title) && En(e.buttonLabel) && En(e.executedLabel) && ie(e.choiceGroupId) && ie(e.skippedLabel) && ie(e.actionSectionId) && ie(e.actionSectionTitle) && A$(e.summaryLines) : !1;
}
function f$(e) {
  return e == null ? !0 : xe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && p$(e.resource) && g$(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function p$(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function g$(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function h$(e) {
  return xe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && xe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ct) : !1;
}
function y$(e) {
  return e == null ? !0 : xe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ie(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function b$(e) {
  return e !== null;
}
function xe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function P(e) {
  return e === null || typeof e == "string";
}
function En(e) {
  return e === void 0 || typeof e == "string";
}
function ie(e) {
  return e == null || typeof e == "string";
}
function A$(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function _$(e) {
  return typeof e == "string" && e.length > 0;
}
function pc() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(W).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(W).filter((r) => r !== null) : [];
}
function an(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ee(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function T$(e) {
  return e.trim().toLowerCase();
}
function R$(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function je(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const fi = 1e3;
class w$ {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new VT(
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
    const r = Ei(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && L$(t.item) && n.executionMode === "ask") {
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
    if (await Fo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Sn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = k$(
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
      return this.pendingExecutions.delete(t), await kn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await kn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = fa(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = P$(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Dt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await tw(t), await nw(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (JR(
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
    if (await Fo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Sn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      D$(t.item),
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
          ue(a.workflowContext)
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
      return a.ok ? (S$(n, a.value), await Is(a.value), {
        ok: !0,
        executedLabel: $$(a.value)
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
    const n = In(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && In(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await kn(
        a,
        pi(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Ln();
    await ew({
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
      const l = Ln();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await oi({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: In(s),
        skippedLabel: pi(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: v$(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      ue(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Ln();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await oi({
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
      ue(a.value.context)
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
    const n = Date.now(), r = gi(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > fi && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= fi;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(gi(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = Sn(
      t,
      n,
      r,
      a
    );
  }
}
function $$(e) {
  return Cs({ inputAmount: e.totalRawDamage });
}
function k$(e, t) {
  if (t.resistance || !E$(t))
    return t;
  const n = Ll(e);
  return n ? { ...t, resistance: n } : t;
}
function E$(e) {
  return I$(e) && !C$(e);
}
function I$(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function C$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function In(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function pi(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function S$(e, t) {
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
function L$(e) {
  return e.type === "ritual";
}
function D$(e) {
  return XA(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function v$(e) {
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
function P$(e) {
  const t = e.actorUuid ? N$(e.actorUuid) : null;
  if (Oe(t)) return t;
  const n = e.actorId ? x$(e.actorId) : null;
  return n || O$(e.actorName);
}
function N$(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function x$(e) {
  const n = game.actors?.get?.(e);
  if (Oe(n)) return n;
  for (const r of gc()) {
    const a = ba(r);
    if (a?.id === e) return a;
  }
  return null;
}
function O$(e) {
  const t = Cn(e);
  if (!t) return null;
  for (const a of gc()) {
    const o = M$(a);
    if (Cn(o) === t) {
      const s = ba(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Oe(a) && Cn(a.name) === t
  );
  return Oe(r) ? r : null;
}
function gc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function M$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ba(e)?.name ?? null;
}
function ba(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Oe(t)) return t;
  const n = e.document?.actor;
  return Oe(n) ? n : null;
}
function Cn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Oe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Sn(e, t, n, r) {
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
function gi(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Ln() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class F$ {
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
class B$ {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = U$(t);
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
      reason: q$(r, n.preset)
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
    preset: e.match ? Bt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function U$(e) {
  const t = e.getFlag(d, "automation");
  return Rr(t) ? t : null;
}
function q$(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function At(e) {
  return (t) => t.status === e;
}
class j$ {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = $r(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), a = ue(t);
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
    const n = $(t.actorName), r = $(t.resource), a = $(hi(t)), o = $(z$(t));
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
    const r = $(n.title ?? "Automação"), a = n.message ? `<p>${$(n.message)}</p>` : "", o = $(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = $(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((p) => $(p.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map(
      (p) => `<li><strong>${$(p.id)}:</strong> ${$(p.formula)} = ${p.total} <em>(${$(G$(p.intent))})</em>${p.damageType ? ` — ${$(p.damageType)}` : ""}</li>`
    ), u = t.ritualCosts.map(
      (p) => `<li><strong>${$(p.itemName)}:</strong> ${p.circle}º círculo — ${p.amount} ${$(p.resource)} (${$(V$(p.source))})</li>`
    ), m = t.damageInstances.map(
      (p) => `<li><strong>${$(p.targetActorName)}:</strong> bruto ${p.rawAmount}${p.damageType ? ` ${$(p.damageType)}` : ""} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (p) => `<li><strong>${$(p.targetActorName)}:</strong> bruto ${p.rawAmount} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (p) => `<li><strong>${$(p.actorName)}:</strong> ${$(hi(p))} — ${p.before.value}/${p.before.max} &rarr; ${p.after.value}/${p.after.max}</li>`
    ), b = t.phases.map((p) => $(p)).join(" &rarr; ");
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
function G$(e) {
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
function hi(e) {
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
function z$(e) {
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
function V$(e) {
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
function H$() {
  const e = new bb(), t = new RA(e), n = new ns(new ts()), r = new rs(new Nr()), a = new wA(new bl()), o = new Tb(), s = new Ob(o), l = new Qb(e), c = new Xb(), u = c.registerMany(
    mu()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new Zb(), y = new Kb(), R = ds(), b = new is(R), p = new B$(
    c
  ), T = new F$(
    p,
    m,
    y
  ), be = new IA(), Y = new j$(be), Ae = new EA(), x = new TA(), te = new AA(
    t,
    s,
    Y,
    Ae
  ), q = new kA(te, Ae), O = new w$(
    q,
    t,
    s,
    n,
    b,
    be,
    x
  );
  return O.addStrategy(
    new Hb(
      (sn) => O.handleItemUsed(sn)
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
    debugOutput: be,
    chatMessages: Y,
    workflowHooks: Ae,
    ritualEvents: x,
    automation: te,
    workflow: q,
    itemUseIntegration: O,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: T
  };
}
const { ApplicationV2: W$ } = foundry.applications.api;
class Mt extends W$ {
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
      apply: Mt.onApply,
      cancel: Mt.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${G(Tr)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${G(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Dn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Dn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Dn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Dn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${G(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? K$(n) : Q$(t)}
    </section>
  `;
}
function K$(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Y$).join("")}</ol>`;
}
function Y$(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${G(e.appliedPresetId)} v${G(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${G(e.itemName)}</strong>
        <span>${G(e.reason)}</span>
        ${r}
      </div>
      <em>${G(n)}</em>
    </li>
  `;
}
function Q$(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${G({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function G(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Ft = `${d}.manageRitualPresets`, yi = `__${d}_ritualPresetHeaderControlRegistered`, Z$ = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function X$(e) {
  const t = globalThis;
  if (!t[yi]) {
    for (const n of Z$)
      Hooks.on(n, (r, a) => {
        J$(r, a, e);
      });
    t[yi] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function J$(e, t, n) {
  Array.isArray(t) && tk(e) && (ek(e, n), !t.some((r) => r.action === Ft) && t.push({
    action: Ft,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), hc(e, n);
    }
  }));
}
function ek(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ft] && (e.options.actions[Ft] = (n) => {
    n.preventDefault(), n.stopPropagation(), hc(e, t);
  }));
}
function tk(e) {
  if (!game.user?.isGM) return !1;
  const t = yc(e);
  return t ? t.type === "agent" && it(t).length > 0 : !1;
}
function hc(e, t) {
  const n = yc(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Mt(n, t).render({ force: !0 });
}
function yc(e) {
  return bi(e.actor) ? e.actor : bi(e.document) ? e.document : null;
}
function bi(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const bc = "data-paranormal-toolkit-ritual-roll-config", ut = "data-paranormal-toolkit-ritual-roll-field", pe = "data-paranormal-toolkit-ritual-roll-action", Ai = `__${d}_ritualRollConfigBlockRegistered`, nk = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], rk = [
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
function ak() {
  const e = globalThis;
  if (!e[Ai]) {
    ok();
    for (const t of nk)
      Hooks.on(t, (...n) => {
        ik(n[0], n[1]);
      });
    e[Ai] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function ok() {
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
function ik(e, t) {
  const n = _k(e);
  if (!n || n.type !== "ritual") return;
  const r = wk(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  lk(a);
  const o = _c(n), s = Sl(n), l = Tk(n), c = ck(n, s, o, l);
  gk(c, n, o, l), sk(a, c), Aa(c);
}
function sk(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function lk(e) {
  for (const t of Array.from(e.querySelectorAll(`[${bc}]`)))
    t.remove();
}
function ck(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(bc, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(_i("strong", "Paranormal Toolkit")), s.append(_i("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Rc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(uk(t, r)), u.append(dk(t, r)), u.append(mk(t, r)), a.append(u), a.append(fk(t, n, r)), a.append(pk(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function uk(e, t) {
  const n = on("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(ut, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = ZA(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function dk(e, t) {
  const n = on("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(ut, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of rk) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function mk(e, t) {
  const n = on("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(ut, "utilityLabel"), n.append(r), n;
}
function fk(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(vn("base", "Padrão", e.forms.base.formula, !0, n)), o.append(vn("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(vn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function vn(e, t, n, r, a) {
  const o = on(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(ut, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function pk(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(pe, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(pe, "clear"), t.append(n, r), t;
}
function on(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function _i(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function gk(e, t, n, r) {
  Ge(e, "intent")?.addEventListener("change", () => Aa(e)), wi(e, "system.studentForm")?.addEventListener("change", () => Ti(e, t)), wi(e, "system.trueForm")?.addEventListener("change", () => Ti(e, t)), e.querySelector(`[${pe}="save"]`)?.addEventListener("click", () => {
    r && hk(e, t, n);
  }), e.querySelector(`[${pe}="clear"]`)?.addEventListener("click", () => {
    r && yk(e, t);
  });
}
async function hk(e, t, n) {
  const r = e.querySelector(`[${pe}="save"]`);
  r?.setAttribute("disabled", "true"), De(e, "Salvando configuração...");
  try {
    const a = bk(e, n);
    await YA(t, a), Ac(e, a), De(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), De(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function yk(e, t) {
  const n = e.querySelector(`[${pe}="clear"]`);
  n?.setAttribute("disabled", "true"), De(e, "Limpando configuração...");
  try {
    await QA(t);
    const r = Sl(t);
    Ak(e, r), Ac(e, r), De(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), De(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Ac(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Rc(t) ? "Configurada" : "Rascunho");
}
function bk(e, t) {
  return {
    schemaVersion: 1,
    intent: Tc(Ge(e, "intent")?.value),
    damageType: $i(e, "damageType"),
    utilityLabel: $i(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Et(e, "formula.base") },
      discente: { formula: Et(e, "formula.discente") },
      verdadeiro: { formula: Et(e, "formula.verdadeiro") }
    }
  };
}
function Ak(e, t) {
  we(e, "intent", t.intent), we(e, "damageType", t.damageType ?? ""), we(e, "utilityLabel", t.utilityLabel ?? "Resultado"), we(e, "formula.base", t.forms.base.formula), we(e, "formula.discente", t.forms.discente.formula), we(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Aa(e);
}
function Aa(e) {
  const t = Tc(Ge(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Ti(e, t) {
  const n = _c(t);
  Ri(e, "discente", n.discente), Ri(e, "verdadeiro", n.verdadeiro);
}
function Ri(e, t, n) {
  const r = Ge(e, `formula.${t}`);
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
function De(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function _c(e) {
  const t = Rk(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function _k(e) {
  return ki(e.item) ? e.item : ki(e.document) ? e.document : null;
}
function Tk(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Rk(e) {
  const t = e.system;
  return $k(t) ? t : {};
}
function wi(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ge(e, t) {
  return e.querySelector(`[${ut}="${kk(t)}"]`);
}
function Et(e, t) {
  return Ge(e, t)?.value.trim() ?? "";
}
function $i(e, t) {
  const n = Et(e, t);
  return n.length > 0 ? n : null;
}
function we(e, t, n) {
  const r = Ge(e, t);
  r && (r.value = n);
}
function Tc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Rc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function wk(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ki(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function $k(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function kk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let le = null;
Hooks.once("init", () => {
  lu(), Bu(), Ad(), ob(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Na.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Na.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  le = H$(), le.itemUseIntegration.registerStrategies(), gd(le.conditions), Xu(le), cd(), od(), db(), X$(le), ak(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Tr} inicializado.`);
});
function Ek() {
  if (!le)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return le;
}
export {
  Ek as getToolkitServices
};
//# sourceMappingURL=main.js.map
