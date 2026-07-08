const d = "paranormal-toolkit", Tr = "Paranormal Toolkit", Tc = "ordemparanormal";
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
  const t = $i(e);
  return t.ok ? A(t.value.definition) : t;
}
function $i(e) {
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
function Rc(e) {
  return Rr(e.getFlag(d, "automation"));
}
function Rr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && $c(t.source) && wc(t.definition);
}
function wc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(kc) && (t.ritualForms === void 0 || vc(t.ritualForms)) && (t.conditionApplications === void 0 || Oc(t.conditionApplications));
}
function $c(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function kc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Ec(t);
    case "spendRitualCost":
      return Ic(t);
    case "rollFormula":
      return Cc(t);
    case "modifyResource":
      return Sc(t);
    case "chatCard":
      return Lc(t);
    default:
      return !1;
  }
}
function Ec(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ki(t);
}
function Ic(e) {
  return e.type === "spendRitualCost";
}
function Cc(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || jc(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Sc(e) {
  const t = e;
  return t.type === "modifyResource" && Ei(t.actor) && qc(t.resource) && Gc(t.operation) && ki(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Lc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function vc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Dc(a)
  );
}
function Dc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || Vc(t.extraCost)) && (t.rollFormulaOverrides === void 0 || Wc(t.rollFormulaOverrides)) && (t.notes === void 0 || Hc(t.notes)) && (t.targeting === void 0 || Pc(t.targeting));
}
function Pc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return xc(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Nc(t.template));
}
function Nc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || wa(t.distance)) && (t.width === void 0 || t.width === null || wa(t.width));
}
function xc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Oc(e) {
  return Array.isArray(e) && e.every(Mc);
}
function Mc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Ei(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || Bc(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Fc(t.applyOnResistance));
}
function Fc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Bc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || zc(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Uc(t.expiry));
}
function Uc(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ki(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Ei(e) {
  return e === "self" || e === "target";
}
function qc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Gc(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function jc(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function zc(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Vc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function wa(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function Hc(e) {
  return Array.isArray(e) && e.every(w);
}
function Wc(e) {
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
      return n.contents.filter($a);
    if (Qc(t))
      return Array.from(t).filter($a);
  }
  return [];
}
function Kc(e) {
  return wr(e)[0] ?? null;
}
function Yc(e) {
  return wr(e).find(Rc) ?? null;
}
function Qc(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function $a(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function it(e) {
  return wr(e).filter((t) => t.type === "ritual");
}
function Ii(e) {
  return it(e)[0] ?? null;
}
function Zc(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Bt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = We("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = dt(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Ia);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = We("Nenhum ator encontrado para aplicar preset de ritual.");
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
      const t = We("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = dt(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await Pn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Ia(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ka(e);
    },
    async applyBestPresetsToActorRituals() {
      return ka(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = We("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = dt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function ka(e) {
  const t = We("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = it(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ea(t);
  const r = Ea(t, n.length);
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
    r.applied.push(Xc(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Jc(r), r;
}
async function Pn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Xc(e, t, n) {
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
function Ea(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Jc(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Ia(e) {
  return {
    preset: Bt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function We(e) {
  const t = at.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function dt(e) {
  const t = Ii(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ue(e) {
  return e ? {
    id: e.id,
    source: {
      ...eu(e.sourceActor),
      token: e.sourceToken
    },
    item: tu(e.item),
    targets: e.targets.map(nu),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Ca(e.rollRequests, Ci),
    rolls: Ca(e.rolls, ru),
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
function eu(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function tu(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function nu(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ci(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ru(e) {
  return {
    ...Ci(e),
    total: e.total
  };
}
function Ca(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function au(e) {
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
    ou(a.error);
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
function ou(e) {
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
function iu() {
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
function su() {
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
const Si = "ritual.costOnly", Li = "ritual.simpleHealing", lu = "ritual.eletrocussao", cu = "ritual.definhar", vi = "ritual.simpleDamage", Di = "generic.simpleHealing", kr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function uu() {
  return [
    du(),
    mu(),
    fu(),
    pu(),
    gu(),
    hu()
  ];
}
function du() {
  return {
    id: Si,
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
function mu() {
  return {
    id: Li,
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
    automation: Pi(),
    itemPatch: Au()
  };
}
function fu() {
  return {
    id: lu,
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
    automation: yu(),
    itemPatch: Tu()
  };
}
function pu() {
  return {
    id: cu,
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
    automation: bu(),
    itemPatch: _u()
  };
}
function gu() {
  return {
    id: vi,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Er()
  };
}
function hu() {
  return {
    id: Di,
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
function Pi(e = "2d8+2") {
  return Ni(
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
function yu() {
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
function bu() {
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
  return Ni(
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
function Au() {
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
function _u() {
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
function Tu() {
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
function Ni(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Ir() {
  return Array.from(game.user?.targets ?? []).map(xi);
}
function xi(e) {
  return {
    tokenId: ke(e.id),
    actorId: ke(e.actor?.id),
    sceneId: ke(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Oi() {
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
function Ru(e) {
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
        if (!ku(t, n)) {
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
      const r = e.automationRegistry.require(Si);
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
      if (!Sa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Li);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Pi(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = re("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ae(n);
      if (!r) return;
      if (!Sa(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(vi);
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
      n && await wu(e, t, n);
    }
  };
}
async function wu(e, t, n) {
  const r = ot(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Oi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    $u(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", ue(a.value.context));
}
function $u(e) {
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
  const t = Ii(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ku(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Sa(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Eu = ["strict", "open"], Mi = "strict";
function Iu(e) {
  return Eu.includes(e) ? e : Mi;
}
function Cu(e) {
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
const Su = ["disabled", "ask", "automatic"], Lu = ["buttons", "confirm"], Fi = "ask";
function vu(e) {
  return typeof e == "string" && Su.includes(e);
}
function Du(e) {
  return typeof e == "string" && Lu.includes(e);
}
function Pu(e) {
  return vu(e) ? e : Du(e) ? "ask" : Fi;
}
const Nu = ["keep", "replace"], xu = ["manual", "assisted"], Bi = "keep", Ui = "assisted", Ou = !0, L = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Mu() {
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
    default: Fi
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
    default: Bi
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
    default: Ui
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
    default: Mi
  }), game.settings.register(d, L.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ou
  }), game.settings.register(d, L.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function La() {
  const e = Pu(game.settings.get(d, L.executionMode)), t = Gi(game.settings.get(d, L.systemCardMode)), n = ji(game.settings.get(d, L.damageResolutionMode)), r = Cr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: qi()
  };
}
function Fu() {
  return Gi(game.settings.get(d, L.systemCardMode));
}
function Bu() {
  return ji(game.settings.get(d, L.damageResolutionMode));
}
function Cr() {
  return Iu(game.settings.get(d, L.resistanceGateMode));
}
function qi() {
  return game.settings.get(d, L.ritualCastingCheckEnabled) === !0;
}
async function oe(e) {
  await game.settings.set(d, L.executionMode, e);
}
function Gi(e) {
  return Nu.includes(e) ? e : Bi;
}
function ji(e) {
  return xu.includes(e) ? e : Ui;
}
function Uu(e) {
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
const qu = [
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
function Gu(e) {
  return {
    phases() {
      return qu;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ln("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Yc(t);
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
      if (!Vu(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = zu(n) ?? ln("Nenhum ator encontrado para executar automação do item.");
      r && await va(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ln("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Kc(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Di);
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
    sourceToken: Oi(),
    item: n,
    targets: Ir()
  });
  if (!a.ok) {
    ju(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", ue(a.value.context));
}
function ju(e) {
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
function zu(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Vu(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Hu(e) {
  const t = au(e), n = Zc(e), r = Ru(e), a = Gu(e), o = su(), s = Uu(e);
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
function Wu(e) {
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
      const r = Da();
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
      return Ku(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Da();
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
      return Yu(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Da() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function Ku(e) {
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
function Yu(e) {
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
function Qu(e) {
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
    conditions: Wu(e.conditions),
    debug: Hu(e),
    hooks: _t
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class Pa {
  static isSupportedSystem() {
    return game.system.id === Tc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Zu() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Ee(t.id),
    actorId: Ee(t.actor?.id),
    sceneId: Ee(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function zi() {
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
function Xu(e, t = zi()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ju(e) {
  if (!nd(e)) return null;
  const t = e.getFlag(d, "workflow");
  return td(t) ? t : null;
}
function ed() {
  return `flags.${d}.workflow`;
}
function Na(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${d}`), n = foundry.utils.getProperty(e, `_source.flags.${d}`);
  return t !== void 0 || n !== void 0;
}
function xa(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return xn(t) || xn(n);
}
function td(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function nd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function Ee(e) {
  return xn(e) ? e : null;
}
function xn(e) {
  return typeof e == "string" && e.length > 0;
}
function rd() {
  const e = (t, n) => {
    ad(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ad(e, t) {
  const n = Ju(e);
  if (!n || n.targets.length === 0) return;
  const r = id(t);
  if (!r || r.querySelector(`.${d}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(od(n));
}
function od(e) {
  const t = document.createElement("section");
  t.classList.add(`${d}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Oa("Origem", e.source.name)), t.append(Oa("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Oa(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${d}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function id(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function sd() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!ld(r) || !cd(e) || Na(e) || Na(t)) return;
    const a = Zu();
    if (a.length === 0 || !xa(e) && !xa(t)) return;
    const o = zi();
    e.updateSource({
      [ed()]: Xu(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function ld(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function cd(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Ma = !1, cn = !1, un = !1, pt = null;
const ud = 1e3, dd = 750, md = 1e3;
function fd(e) {
  Ma || (Hooks.on("combatTurnChange", (t) => {
    gd(e, Fa(t));
  }), Hooks.on("deleteCombat", (t) => {
    hd(e, Fa(t));
  }), Ma = !0, pd(e));
}
function pd(e) {
  qt() && (cn || (cn = !0, globalThis.setTimeout(() => {
    cn = !1, Sr(e, "ready");
  }, ud)));
}
function gd(e, t) {
  qt() && t && (pt && globalThis.clearTimeout(pt), pt = globalThis.setTimeout(() => {
    pt = null, Sr(e, "combat-turn-change", t);
  }, dd));
}
function hd(e, t) {
  qt() && t && (un || (un = !0, globalThis.setTimeout(() => {
    un = !1, Sr(e, "combat-deleted", t);
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
function Fa(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Vi = {
  enabled: "dice.animations.enabled"
};
function yd() {
  game.settings.register(d, Vi.enabled, {
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
    enabled: game.settings.get(d, Vi.enabled) === !0
  };
}
const Gt = "chatCard", Ba = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Ad = `.${i}__title`, Hi = `.${i}__header`, _d = `.${i}__roll-card`, Td = `.${i}__roll-meta`, Rd = `.${i}__roll-meta-pill`, Lr = `.${i}__resistance`, wd = `.${i}__resistance-header`, Wi = `.${i}__resistance-description`, jt = `.${i}__resistance-roll-button`, Ki = `.${i}__resistance-roll-result`, Ua = `${i}__resistance-content`, Yi = `.${i}__workflow-section`, Qi = `.${i}__workflow-roll`, vr = `${i}__workflow-roll--dice-open`, Dr = `.${i}__workflow-roll-formula`, Pr = `${i}__workflow-roll-formula--toggle`, zt = `.${i}__workflow-dice-tray`, $d = `.${i}__roll-detail-toggle`, kd = `.${i}__roll-detail-list`, Ed = `.${i}__ritual-element-badge`, Id = `.${i}__ritual-metadata`, Cd = "casting-backlash", Sd = "data-paranormal-toolkit-action-section", Ld = "data-paranormal-toolkit-prompt-id", vd = "data-paranormal-toolkit-pending-id", qa = "data-paranormal-toolkit-casting-backlash-enhanced", Ga = `.${i}`, Dd = `.${i}__workflow-section--casting`, Pd = `.${i}__workflow-section-header`, Nd = `.${i}__workflow-notes`, xd = `[${Sd}="${Cd}"]`, ja = `${i}__workflow-section-title-row`, Od = `${i}__workflow-section-header--casting-backlash`, Zi = `${i}__casting-backlash-button`;
function Md(e) {
  for (const t of Fd(e))
    Bd(t), zd(t);
}
function Fd(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Ga) && t.add(e);
  for (const n of e.querySelectorAll(Ga))
    t.add(n);
  return Array.from(t);
}
function Bd(e) {
  const t = e.querySelector(xd);
  if (!t) return;
  const n = Ud(t);
  if (!n) return;
  const r = e.querySelector(`${Dd} ${Pd}`);
  r && (r.classList.add(Od), qd(r), Gd(n), r.append(n), t.remove());
}
function Ud(e) {
  return e.querySelector(
    `button[${vd}], button[${Ld}]`
  );
}
function qd(e) {
  const t = e.querySelector(`:scope > .${ja}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(ja);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(Zi) || n.append(a));
  return n;
}
function Gd(e) {
  if (e.getAttribute(qa) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = jd(t, e.disabled);
  e.classList.add(Zi), e.setAttribute(qa, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function jd(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function zd(e) {
  for (const t of e.querySelectorAll(Nd)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Vd(e) {
  for (const t of Array.from(e.querySelectorAll(Yi)))
    for (const n of Array.from(t.querySelectorAll(`${$d}, ${kd}`)))
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
function Xi(e) {
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
class Ji {
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
      const y = Zd(m, u);
      if (!y.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const R = Yd(m.damageType);
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
          Xd(y.id, m, R.value)
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
        for (const T of em(b.conditions))
          l.add(T);
        const p = Jd(b.newPV);
        p !== null && (c = p), s.push({
          id: y.id,
          label: m.label ?? Xi(R.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: za(b.finalDamage, y.amount),
          blocked: za(b.blocked, 0),
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
    label: t.label ?? Xi(n),
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
function za(e, t) {
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
  return Va(e) ? e : Array.isArray(e) ? e.find(Va) ?? null : null;
}
function Va(e) {
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
class es {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class ts {
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
    return Ha(null);
  const r = e?.anchor ?? ns(t);
  if (!r)
    return {
      ...Ha(n),
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
function ns(e) {
  const t = hm();
  if (!t?.id || !rs(t.round)) return null;
  const n = fm(t), r = um(e, n) ?? mm(t), a = Z(r?.id), o = bm(r?.initiative), s = dm(t, r, n);
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
function Ha(e) {
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
  const r = Z(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Am(e.turn) ? e.turn : null;
}
function mm(e) {
  return Tt(e.combatant) ? e.combatant : null;
}
function fm(e) {
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
function pm(e) {
  return Z(e.actor?.id) ?? Z(e.actorId) ?? Z(e.token?.actor?.id) ?? Z(e.token?.actorId) ?? Z(e.document?.actor?.id) ?? Z(e.document?.actorId);
}
function gm(e) {
  return rs(e) ? Math.trunc(e) : null;
}
function hm() {
  return game.combat ?? null;
}
function ym() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Tt(e) {
  return !!(e && typeof e == "object");
}
function Z(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function bm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function rs(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Am(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class as {
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
    if (!Sm(r))
      return g({
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
        return await Promise.resolve(c.update?.(s)), A(Wa(r, a, c.id ?? null, !1, !0, o));
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
      return A(Wa(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = is(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Ka(n, s) === "deleted" && (o += 1);
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
    const n = Pm(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = xr(s);
      a += l.length;
      for (const c of l) {
        if (!wm(c, t)) continue;
        const u = os(c);
        try {
          await Ka(s, c) === "deleted" && (o += 1);
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
    appliedByUserId: jm(),
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
    time: Gm(),
    ...e
  };
}
function Wa(e, t, n, r, a, o) {
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
  const n = os(e);
  if (!n.conditionId || !$m(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = qm();
  return n.durationMode === "combatantTurn" || km(n) ? Im(n, r) : Em(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !M(n.startRound) || !M(n.requestedRounds) || !M(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function $m(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && M(e.requestedRounds);
}
function km(e) {
  return !!(e.combatDurationApplied && M(e.requestedRounds) && M(e.startRound) && (e.startCombatantId || It(e.startTurn)));
}
function Em(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Im(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !M(e.startRound) || !M(e.requestedRounds) || !M(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Cm(t);
  return e.startCombatantId ? r === e.startCombatantId : It(e.startTurn) && It(t.turn) ? t.turn === e.startTurn : !1;
}
function Cm(e) {
  return Ie(e.combatant?.id);
}
function os(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Rt(e, "conditionId"),
    requestedRounds: Ya(e, "requestedRounds") ?? Ke(t.value) ?? Ke(t.rounds),
    combatDurationApplied: dn(e, "combatDurationApplied"),
    combatId: Rt(e, "combatId") ?? Ie(n.combat) ?? Ie(t.combat),
    startCombatantId: Rt(e, "startCombatantId") ?? Ie(n.combatant),
    startInitiative: Mm(e, "startInitiative") ?? ss(n.initiative),
    startRound: Ya(e, "startRound") ?? Ke(n.round) ?? Ke(t.startRound),
    startTurn: Om(e, "startTurn") ?? On(n.turn) ?? On(t.startTurn),
    expiryEvent: Fm(e, "expiryEvent") ?? ls(t.expiry),
    durationMode: Bm(e, "durationMode"),
    deleteOnExpire: dn(e, "deleteOnExpire"),
    expiresWithCombat: dn(e, "expiresWithCombat")
  };
}
function Sm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Lm(e, t) {
  return is(e, t)[0] ?? null;
}
function is(e, t) {
  return xr(e).filter((n) => xm(n) === t);
}
async function Ka(e, t) {
  const n = t.id ?? null, r = n ? vm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Dm(a)) return "missing";
    throw a;
  }
}
function vm(e, t) {
  return xr(e).find((n) => n.id === t) ?? null;
}
function Dm(e) {
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
  const r = Ie(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
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
  return Rt(e, "conditionId");
}
function Rt(e, t) {
  return Ie(ge(e, t));
}
function Ya(e, t) {
  return Ke(ge(e, t));
}
function Om(e, t) {
  return On(ge(e, t));
}
function Mm(e, t) {
  return ss(ge(e, t));
}
function Fm(e, t) {
  return ls(ge(e, t));
}
function Bm(e, t) {
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
function Ie(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ke(e) {
  return M(e) ? Math.trunc(e) : null;
}
function On(e) {
  return It(e) ? Math.trunc(e) : null;
}
function ss(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ls(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Um(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function qm() {
  return game.combat ?? null;
}
function Gm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function M(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function It(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function jm() {
  return game.user?.id ?? null;
}
const zm = "icons/svg/downgrade.svg", Vm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? zm,
    description: Vm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Hm = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Wm = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Km = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Ym = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Qm = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Zm = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Xm = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Jm = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), ef = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), tf = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), nf = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), rf = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), af = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), of = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), sf = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), lf = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), cf = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), uf = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), df = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), mf = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), ff = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), pf = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), gf = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), hf = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), yf = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), bf = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Af = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), _f = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Tf = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Rf = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), wf = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), $f = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), kf = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Ef = _({
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
  $f,
  kf,
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
    return Array.from(this.definitions.values()).map(Qa);
  }
  get(t) {
    const n = this.lookup.get(Za(t)), r = n ? this.definitions.get(n) : null;
    return r ? A(Qa(r)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Za(t);
    r && this.lookup.set(r, n);
  }
}
function cs() {
  return new Cf(If);
}
function Qa(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Za(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Pe(e) {
  return e.applyOnResistance ?? "failure";
}
function us(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function ds(e, t) {
  const n = Pe(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function ms(e) {
  const t = Pe(e);
  return t === "failure" || t === "success";
}
function Sf(e, t, n, r) {
  const a = e.filter((c) => ds(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Pe(c) === t) : [], s = o.length > 0 ? o : a;
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
}, vf = {
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
function Df(e) {
  return ps(e, Lf, !1);
}
function Pf(e) {
  return ps(e, vf, !e.allowsSuccessfulResistance);
}
function Fe(e) {
  return e.kind === "waiting-resistance";
}
function fs(e) {
  return e.kind === "resisted";
}
function ps(e, t, n) {
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
const Ye = "data-paranormal-toolkit-prompt-id", Nf = "data-paranormal-toolkit-resistance-roll-result", xf = "Conjuração DT";
function Of(e) {
  const t = e.querySelector(jt)?.getAttribute(Nf), n = et(t);
  if (n !== null) return n;
  const r = e.querySelector(Ki)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return et(a?.[1] ?? null);
}
function gs(e) {
  const t = hs(e), n = Bf(t);
  if (n !== null) return n;
  const r = Uf(t);
  return r !== null ? r : qf(e);
}
function Mf(e) {
  const t = hs(e);
  return t ? {
    actorId: mn(t.actorId),
    itemId: mn(t.itemId),
    itemName: mn(t.itemName)
  } : null;
}
function Ff(e) {
  const t = e.getAttribute(Ye);
  if (!t) return null;
  const n = ys(e), r = bs(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Vt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function X(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Mn(e) {
  return X(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Bf(e) {
  const t = jf(e);
  return t.length === 0 ? null : et(zf(t, xf));
}
function Uf(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Xa(r, ["system", "ritual", "DT"]) ?? Xa(r, ["system", "ritual", "dt"]);
}
function qf(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return et(n?.[1] ?? null);
}
function hs(e) {
  const t = Gf(e);
  if (!t) return null;
  const n = ys(e), r = bs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Vt(o) ? o.pendingId === t : !1) ?? null;
}
function Gf(e) {
  return (e.closest(`[${Ye}]`) ?? e.querySelector(`[${Ye}]`) ?? e.parentElement?.querySelector(`[${Ye}]`) ?? null)?.getAttribute(Ye) ?? null;
}
function ys(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Vf(a) ? a : null;
}
function bs(e) {
  const t = e?.getFlag?.(d, Gt);
  return Vt(t) ? t : null;
}
function jf(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function zf(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Xa(e, t) {
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
function Vf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Vt(e) {
  return !!(e && typeof e == "object");
}
function mn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Ht(e) {
  return As({
    hasResistance: !!e.querySelector(Lr),
    difficulty: gs(e),
    resistanceTotal: Of(e)
  });
}
function Hf(e) {
  if (!e.hasResistance || e.difficulty === null)
    return As({
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
function As(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Cu(e)
  };
}
function he() {
  return game.user?.isGM === !0;
}
function fe() {
  return he();
}
function Wf(e) {
  const t = Ut(e.resistanceGateMode, e.resistanceState), n = Kf(e.resistanceState, e.hasDamage), r = Yf(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Df({
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
function Or(e) {
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
  return n.includes("kh") ? Ja(e, "highest") : n.includes("kl") ? Ja(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ja(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const tp = "data-paranormal-toolkit-resistance-skill", np = "data-paranormal-toolkit-resistance-skill-label", _s = "pending", Mr = "success", Fr = "failure", Ts = "rolled";
function rp(e) {
  const t = lp(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? ip(e.damageSection) : null, r = eo(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = ap(e.rollCard).map((o, s) => {
    const l = op(o, s), c = e.resistanceResults.get(l) ?? null, u = fp(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, y = e.effectApplications.get(l) ?? null, R = Hf({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: yp(u)
    }).state, b = eo(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      us(R)
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
        effectRequiresResolvedResistance: b ? ms(b) : !1
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
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && Rs(a) !== "nenhum alvo") : [];
}
function op(e, t) {
  return `${Rs(e)}:${t}`;
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
function eo(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: sp(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Pe(o)
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
    difficulty: gs(e)
  };
}
function cp(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function up(e) {
  return Br(e, `.${i}__resistance-description`);
}
function dp(e) {
  return Br(e, jt);
}
function mp(e) {
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
function fp(e, t) {
  return e ? t === null ? Ts : e.total >= t ? Mr : Fr : _s;
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
function Rs(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function yp(e) {
  return e === Mr ? "succeeded" : e === Fr ? "failed" : "pending";
}
function ws(e) {
  if (!e) return null;
  const t = e.actorId ? _p(e.actorId) : null, n = t ? bp(t, e.itemId, e.itemName) : null;
  return n || Ap(e.itemId, e.itemName);
}
function bp(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Ce(o)) return o;
  }
  const a = Ct(n);
  if (a) {
    const o = r?.find?.((s) => Ce(s) ? Ct(s.name) === a : !1);
    if (Ce(o)) return o;
  }
  return null;
}
function Ap(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Ce(a)) return a;
  }
  const r = Ct(t);
  if (r) {
    const a = n?.find?.((o) => Ce(o) ? Ct(o.name) === r : !1);
    if (Ce(a)) return a;
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
function Ce(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Ct(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ur(e) {
  const t = fn(e);
  if (!t) return null;
  const n = Rp().filter((o) => fn(wp(o)) === t).map((o) => $s(o)).find(Xe) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Xe(o) && fn(o.name) === t);
  return Xe(a) ? a : null;
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
  return typeof n == "string" ? n : $s(e)?.name ?? null;
}
function $s(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Xe(t)) return t;
  const n = e.document?.actor;
  return Xe(n) ? n : null;
}
function Xe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function fn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function ks(e) {
  const t = Ip();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: $p(e)
  });
}
function $p(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${wt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = kp(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${wt(e.conditions.join(", "))}</li>` : "";
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
function kp(e) {
  const t = Ep(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${wt(a)}</li>`;
}
function Ep(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = to(n?.value);
  return r === null ? null : {
    value: r,
    max: to(n?.max)
  };
}
function to(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ip() {
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
async function Cp(e) {
  await ks(Sp(e));
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
function Es(e) {
  return e.mode, `✓ ${Is(e.inputAmount)} PV`;
}
function vp(e) {
  const t = Is(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Is(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Dp {
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
class Pp {
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
const xp = `.${i}__actions`, qr = `.${i}__actions-title`, Ne = `.${i}__button`, Op = "data-paranormal-toolkit-action-section", Mp = `${i}__button--executed`, Fp = "data-paranormal-toolkit-executed-label";
function Cs(e) {
  return X(e.querySelector(qr)?.textContent);
}
function Bp(e, t) {
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
function Gr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ye(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const ht = "data-paranormal-toolkit-prompt-id", Ss = "multiTargetResistanceResults", Ls = "multiTargetDamageApplications", vs = "multiTargetEffectApplications";
function Up(e) {
  const t = /* @__PURE__ */ new Map(), r = Wt(e)?.[Ss];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    Wp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function qp(e, t) {
  await jr(e, Ss, t.targetId, t);
}
function Gp(e) {
  const t = /* @__PURE__ */ new Map(), r = Wt(e)?.[Ls];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    Kp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function jp(e, t) {
  await jr(
    e,
    Ls,
    t.targetId,
    t
  );
}
function zp(e) {
  const t = /* @__PURE__ */ new Map(), r = Wt(e)?.[vs];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    Qp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Vp(e, t) {
  await jr(
    e,
    vs,
    t.targetId,
    t
  );
}
function Hp(e) {
  const t = Wt(e);
  return t ? {
    actorId: pn(t.actorId),
    itemId: pn(t.itemId),
    itemName: pn(t.itemName)
  } : null;
}
async function jr(e, t, n, r) {
  const a = Ds(e);
  if (!a) return;
  const o = Ps(e), s = Ns(o);
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
  l && await Promise.resolve(o.setFlag?.(d, Gt, {
    ...s,
    prompts: c
  }));
}
function Wt(e) {
  const t = Ds(e);
  if (!t) return null;
  const n = Ps(e), r = Ns(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => B(o) ? o.pendingId === t : !1) ?? null;
}
function Ds(e) {
  return (e.closest(`[${ht}]`) ?? e.querySelector(`[${ht}]`) ?? e.parentElement?.querySelector(`[${ht}]`) ?? null)?.getAttribute(ht) ?? null;
}
function Ps(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Zp(a) ? a : null;
}
function Ns(e) {
  const t = e?.getFlag?.(d, Gt);
  return B(t) ? t : null;
}
function Wp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Kp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Yp(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Yp(e) {
  return e === "normal" || e === "half";
}
function Qp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function pn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Zp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function B(e) {
  return !!(e && typeof e == "object");
}
const Xp = "data-paranormal-toolkit-resistance-skill", Jp = "data-paranormal-toolkit-resistance-skill-label", Fn = "data-paranormal-toolkit-multi-target-section", zr = "data-paranormal-toolkit-multi-target-damage-info", xs = "data-paranormal-toolkit-multi-target-effect-info", Os = "data-paranormal-toolkit-multi-target-toggle", Ms = "data-paranormal-toolkit-multi-target-details", N = "data-paranormal-toolkit-multi-target-target", eg = "data-paranormal-toolkit-multi-target-state", Bn = "data-paranormal-toolkit-multi-target-roll-total", Un = "data-paranormal-toolkit-multi-target-roll-formula", $t = "data-paranormal-toolkit-multi-target-roll-dice", qn = "data-paranormal-toolkit-multi-target-roll-skill", Gn = "data-paranormal-toolkit-multi-target-roll-skill-label", jn = "data-paranormal-toolkit-multi-target-roll-target-name", zn = "data-paranormal-toolkit-multi-target-roll-rolled-at", Vn = "data-paranormal-toolkit-multi-target-damage-mode", Hn = "data-paranormal-toolkit-multi-target-damage-input-amount", no = "data-paranormal-toolkit-multi-target-damage-final-amount", ro = "data-paranormal-toolkit-multi-target-damage-blocked", Wn = "data-paranormal-toolkit-multi-target-damage-target-name", Kn = "data-paranormal-toolkit-multi-target-damage-applied-at", Yn = "data-paranormal-toolkit-multi-target-effect-condition-id", Qn = "data-paranormal-toolkit-multi-target-effect-condition-label", Zn = "data-paranormal-toolkit-multi-target-effect-effect-id", Xn = "data-paranormal-toolkit-multi-target-effect-created", Jn = "data-paranormal-toolkit-multi-target-effect-refreshed", er = "data-paranormal-toolkit-multi-target-effect-target-name", tr = "data-paranormal-toolkit-multi-target-effect-applied-at", tg = new as(cs()), ng = new es(new Ji()), rg = new ts(new Nr()), ag = new Np(rg), og = new Dp(ng), ig = new Pp(tg), sg = _s, Be = Mr, lt = Fr, lg = Ts;
function cg(e) {
  const t = Fs(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), bg(e);
  const n = Ag(e.rollCard, t), r = _g(e.rollCard, t);
  !n && r && eh(e.rollCard, r, e.effectSection);
  const a = Eg(e.rollCard);
  return qs(a, t), Zg(
    e.rollCard,
    a,
    Tg(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && th(e.rollCard, r, a), !0;
}
function Fs(e) {
  return rp({
    ...e,
    resistanceResults: mg(e.rollCard),
    damageApplications: fg(e.rollCard),
    effectApplications: pg(e.rollCard),
    resolveTargetConditionApplication: ug,
    resistanceGateMode: Hr()
  });
}
function ug(e, t, n) {
  const r = Hp(e), a = ws(r);
  if (!a) return null;
  const o = ot(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = dg(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function dg(e, t, n) {
  const r = Sf(
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
function mg(e) {
  const t = Up(e);
  for (const [n, r] of yg(e))
    t.set(n, r);
  return t;
}
function fg(e) {
  const t = Gp(e);
  for (const [n, r] of hg(e))
    t.set(n, r);
  return t;
}
function pg(e) {
  const t = zp(e);
  for (const [n, r] of gg(e))
    t.set(n, r);
  return t;
}
function gg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = n.getAttribute(Yn), o = n.getAttribute(Qn), s = n.getAttribute(Zn), l = io(n.getAttribute(Xn)), c = io(n.getAttribute(Jn)), u = n.getAttribute(er), m = n.getAttribute(tr);
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
function hg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = n.getAttribute(Vn), o = Zs(n.getAttribute(Hn)), s = n.getAttribute(Wn), l = n.getAttribute(Kn);
    !r || !ah(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function yg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = Zs(n.getAttribute(Bn)), o = n.getAttribute(Un), s = n.getAttribute(qn), l = n.getAttribute(Gn), c = n.getAttribute(jn), u = n.getAttribute(zn);
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
function bg(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Ag(e, t) {
  if (!t.damage)
    return Bs(e)?.remove(), null;
  const n = Rg(e);
  return wg(n, t.damage), kg(e, n), n;
}
function _g(e, t) {
  if (!t.effect)
    return Qs(e)?.remove(), null;
  const n = Xg(e);
  return Jg(n, t.effect), n;
}
function Tg(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : st(e, "Conjuração");
}
function Rg(e) {
  const t = Bs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(zr, "true"), n;
}
function Bs(e) {
  return e.querySelector(`[${zr}="true"]`);
}
function wg(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Us(t.formula, t.total, t.diceBreakdown));
}
function Us(e, t, n, r = !1) {
  const a = Qf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return $g(a, r), a;
}
function $g(e, t) {
  const n = e.querySelector(zt), r = e.querySelector(Dr);
  if (!n || !r) return;
  e.classList.toggle(vr, t), n.hidden = !t, r.classList.add(Pr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function kg(e, t) {
  const n = st(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Eg(e) {
  const t = e.querySelector(`[${Fn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Fn, "true"), n;
}
function qs(e, t) {
  const n = Ig(e);
  e.replaceChildren(Cg(t), Lg(t, n));
}
function Ig(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${N}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(N)).filter(rh)
  );
}
function Cg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Sg(e.targets), t.append(n, r), t;
}
function Sg(e) {
  const t = e.length, n = e.filter((l) => l.state === lt).length, r = e.filter((l) => l.state === Be).length, a = e.filter((l) => l.state === sg).length, o = e.filter((l) => l.state === lg).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Lg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(vg(r, e, t.has(r.id)));
  return n;
}
function vg(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(N, e.id), r.setAttribute(eg, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Gs(r, e.resistanceResult), js(r, e.damageApplication), zs(r, e.effectApplication);
  const a = Dg(e, t, r), o = Wg(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    oo(s.target) || ao(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || oo(s.target) || (s.preventDefault(), ao(r));
  }), r.append(a, o), r;
}
function Gs(e, t) {
  if (!t) {
    e.removeAttribute(Bn), e.removeAttribute(Un), e.removeAttribute($t), e.removeAttribute(qn), e.removeAttribute(Gn), e.removeAttribute(jn), e.removeAttribute(zn);
    return;
  }
  e.setAttribute(Bn, String(t.total)), e.setAttribute(Un, t.formula), e.setAttribute(qn, t.skill), e.setAttribute(Gn, t.skillLabel), e.setAttribute(jn, t.targetName), e.setAttribute(zn, t.rolledAt), t.diceBreakdown ? e.setAttribute($t, t.diceBreakdown) : e.removeAttribute($t);
}
function js(e, t) {
  if (!t) {
    e.removeAttribute(Vn), e.removeAttribute(Hn), e.removeAttribute(no), e.removeAttribute(ro), e.removeAttribute(Wn), e.removeAttribute(Kn);
    return;
  }
  e.setAttribute(Vn, t.mode), e.setAttribute(Hn, String(t.inputAmount)), e.removeAttribute(no), e.removeAttribute(ro), e.setAttribute(Wn, t.targetName), e.setAttribute(Kn, t.appliedAt);
}
function zs(e, t) {
  if (!t) {
    e.removeAttribute(Yn), e.removeAttribute(Qn), e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Jn), e.removeAttribute(er), e.removeAttribute(tr);
    return;
  }
  e.setAttribute(Yn, t.conditionId), e.setAttribute(Qn, t.conditionLabel), e.setAttribute(Zn, t.effectId ?? ""), e.setAttribute(Xn, String(t.created)), e.setAttribute(Jn, String(t.refreshed)), e.setAttribute(er, t.targetName), e.setAttribute(tr, t.appliedAt);
}
function Dg(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Pg(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Ng(e, t.resistance);
  Fg(l, n, e, t);
  const c = Hg(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), Ks(u, [
    Vs(e, t, "compact"),
    Ws(e, t, "compact")
  ]), r.append(a, u), r;
}
function Pg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Ng(e, t) {
  if (!he())
    return xg(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Mg(e, t)), t?.skill && (n.setAttribute(Xp, t.skill), n.setAttribute(Jp, t.skillLabel ?? me(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Be ? "✓" : e.state === lt ? "✕" : "", n.append(r, a), n;
}
function xg(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Og(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Be ? "✓" : e.state === lt ? "✕" : "", n.append(r, a), n;
}
function Og(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Be ? "sucesso" : e.state === lt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Mg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Be ? "sucesso" : e.state === lt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Fg(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !he() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Bg(t, e, n, r);
  });
}
async function Bg(e, t, n, r) {
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
    const u = await ag.execute({ actor: l, skill: o, skillLabel: s });
    await nh(u.roll);
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
    Gs(e, m);
    try {
      await qp(r.rollCard, m);
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
  const r = Fs({
    rollCard: n,
    damageSection: Ug(n) ?? st(n, "Dano"),
    effectSection: qg(n)
  });
  r && qs(t, r);
}
function Ug(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(zr) !== "true") ?? null;
}
function qg(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Gg(e) {
  return Fe(e.assistedActions.policy.damageActionState);
}
function jg(e) {
  return Fe(e.assistedActions.policy.effectActionState);
}
function Hr() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
function Vs(e, t, n) {
  if (e.damageApplication)
    return G(
      "✓",
      Es({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Fe(r))
    return G(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = Hs(a, t.damage);
  if (o === null)
    return G(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = vp({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = G(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const y = u.closest(`[${N}]`);
    y && zg(y, u, e, t);
  }), u;
}
function Hs(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function zg(e, t, n, r) {
  if (n.damageApplication) return;
  if (Gg(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = Hs(o, a);
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
    const u = await og.execute({
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
    js(e, m);
    try {
      await jp(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", y);
    }
    try {
      await Cp(u.value);
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
function Ws(e, t, n) {
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
  if (Fe(r))
    return G(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (fs(r))
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
    const l = o.closest(`[${N}]`);
    l && Vg(l, o, e, t);
  }), o;
}
async function Vg(e, t, n, r) {
  if (n.effectApplication) return;
  if (jg(n)) {
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
    const l = await ig.execute({
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
    zs(e, c);
    try {
      await Vp(r.rollCard, c);
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
function Ks(e, t) {
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
function Hg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Os, "true"), t.setAttribute("aria-hidden", "true"), Ys(e, t), t;
}
function ao(e) {
  const t = e.querySelector(`[${Ms}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Os}="true"]`);
  r && Ys(e, r);
}
function Ys(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function oo(e) {
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
function Wg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Ms, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Kg(e, t.resistance);
  s && r.append(s);
  const l = Yg(e, t.resistance), c = Qg(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Kg(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Be ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Yg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Us(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Qg(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), Ks(n, [
    Vs(e, t, "full"),
    Ws(e, t, "full")
  ]), n;
}
function Zg(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Xg(e) {
  const t = Qs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(xs, "true"), n;
}
function Qs(e) {
  return e.querySelector(`[${xs}="true"]`);
}
function Jg(e, t) {
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
function eh(e, t, n) {
  const r = n?.parentElement === e ? n : st(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function th(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function gn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function nh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function rh(e) {
  return typeof e == "string" && e.length > 0;
}
function ah(e) {
  return e === "normal" || e === "half";
}
function io(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function Zs(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const so = "data-paranormal-toolkit-card-layout-refresh-bound";
function oh(e) {
  const t = e.rollCard.querySelector(jt);
  t && t.getAttribute(so) !== "true" && (t.setAttribute(so, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Se = "data-paranormal-toolkit-prompt-id", ih = "apply-damage", sh = "data-paranormal-toolkit-multi-target-damage-info";
function lh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(sh) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function ch(e) {
  const t = dh(e);
  return t.find((n) => n.getAttribute(Op) === ih) ?? t.find((n) => Cs(n) === "aplicar danos") ?? null;
}
function uh(e) {
  const t = Xs(e), n = lo(t);
  return n || lo(mh(e));
}
function lo(e) {
  return e.find((t) => {
    const n = Cs(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function dh(e) {
  const t = Xs(e);
  return t.length > 0 ? t : Wr(e);
}
function Xs(e) {
  const t = gh(e);
  return t ? Wr(e).filter((n) => ph(n, t)) : [];
}
function mh(e) {
  const t = Js(e);
  if (!t) return [];
  const n = fh(e, t);
  return Wr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => el(e, r)).filter((r) => !n || hh(r, n));
}
function Wr(e) {
  const t = Js(e);
  return t ? Array.from(t.querySelectorAll(xp)) : [];
}
function Js(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function fh(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && el(e, n)) ?? null;
}
function ph(e, t) {
  return e.getAttribute(Se) === t ? !0 : Array.from(e.querySelectorAll(`[${Se}]`)).some((n) => n.getAttribute(Se) === t);
}
function gh(e) {
  return e.getAttribute(Se) ?? e.querySelector(`[${Se}]`)?.getAttribute(Se) ?? null;
}
function el(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function hh(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function yh(e) {
  const t = tl(), n = Ht(e.rollCard).state, r = Or({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Fe(a), s = fs(a);
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
function bh(e) {
  const { rollCard: t } = e, n = Th(), r = tl(), a = Ht(t).state, o = Or({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Fe(s), c = _h(e);
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
      summary: Ah(a)
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
function Ah(e) {
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
function _h(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Th() {
  try {
    return Bu();
  } catch {
    return "assisted";
  }
}
function tl() {
  try {
    return Cr();
  } catch {
    return "strict";
  }
}
const Rh = "data-paranormal-toolkit-damage-resolution-state", co = "data-paranormal-toolkit-damage-icon-enhanced", Kr = "data-paranormal-toolkit-damage-original-label", wh = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, nl = "Outra opção escolhida";
function $h(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Bp(t, "Aplicar dano"), kh(e, t);
}
function kh(e, t) {
  const n = Array.from(t.querySelectorAll(Ne)), r = mo(n, "normal"), a = mo(n, "half");
  if (!r || !a) {
    Eh(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  fo(r, "normal"), fo(a, "half");
  const o = bh({
    rollCard: e,
    normalButtonApplied: St(r),
    halfButtonApplied: St(a),
    normalButtonSkipped: nr(r),
    halfButtonSkipped: nr(a)
  });
  if (!o.canShowApplyDamage) {
    po(r), po(a), go(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), uo(r, o.normalButton), uo(a, o.halfButton), go(t, o.summary.state, o.summary.message);
}
function uo(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Ch(e, t.visible), Sh(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function Eh(e) {
  for (const t of e)
    nr(t) && t.remove();
}
function St(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(nl);
}
function nr(e) {
  return e.textContent?.includes(nl) ?? !1;
}
function mo(e, t) {
  const n = wh[t];
  return e.find((r) => n.test(Ih(r))) ?? null;
}
function Ih(e) {
  return [
    e.getAttribute(Kr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function fo(e, t) {
  if (e.getAttribute(co) === "true") return;
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
  ), e.setAttribute(co, "true"), e.setAttribute(Kr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ye(n));
}
function po(e) {
  St(e) || e.remove();
}
function Ch(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function Sh(e, t, n, r = "Role resistência") {
  if (!St(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ye(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Lh(e, n);
  }
}
function Lh(e, t) {
  const n = e.getAttribute(Kr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(vh(t), ye(n)));
}
function vh(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function go(e, t, n) {
  e.setAttribute(Rh, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(qr)?.after(a);
}
const tt = "data-paranormal-toolkit-effect-icon-enhanced", xe = "data-paranormal-toolkit-effect-action-compacted", Kt = "data-paranormal-toolkit-effect-resistance-gate", Yr = "data-paranormal-toolkit-effect-section", Qr = "data-paranormal-toolkit-effect-label";
function Dh(e) {
  return e.querySelector(`[${Yr}="true"]`);
}
function Ph(e) {
  const t = xh(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Mh(), r = Hh(n, e.sourceActions, t);
  return r && n.setAttribute(Qr, r), Fh(n, t, r), zh(e.rollCard, n, e.after ?? e.fallbackAfter), Vh(e.sourceActions, n), n;
}
function Nh(e, t) {
  const n = t.querySelector(Ne);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = il(t, n, r), o = rl(e, n), s = yh({
    rollCard: e,
    effectLabel: a,
    applied: Xr(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Pe(o) === "success" || Pe(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? ms(o) : !1
  });
  if (s.applied) {
    Kh(n);
    return;
  }
  if (!s.visible) {
    Yh(n);
    return;
  }
  if (s.waitingForResistance) {
    Qh(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    Zh(n, s.compactLabel);
    return;
  }
  Xh(n), ol(n, s.displayLabel);
}
function xh(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ne) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ne) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Oh(e.rollCard, r) ?? r[0] ?? null;
}
function Oh(e, t) {
  const n = Ht(e).state, r = us(n), a = al(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = rl(e, o, a);
    if (s && ds(s, r)) return o;
  }
  return null;
}
function rl(e, t, n = al(e)) {
  const r = Zr(t, t.textContent?.trim() ?? ""), a = Mn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Mn(s) === a)) ?? null : null;
}
function al(e) {
  const t = ws(Mf(e));
  if (!t) return [];
  const n = ot(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function Mh() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Yr, "true"), e;
}
function Fh(e, t, n) {
  e.setAttribute(Yr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Bh(e), a = Uh(r);
  a.textContent = "Efeito";
  const o = qh(e, r), s = Gh(o);
  s.textContent = Jh(n ?? il(e, t, t.textContent?.trim() ?? ""));
  const l = jh(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ne)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Xr(t, c) && !Wh(t, c) && ol(t, n ?? c);
}
function Bh(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Uh(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function qh(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function Gh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function jh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function zh(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Vh(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Ne)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function Hh(e, t, n) {
  const r = e.getAttribute(Qr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Zr(n, n.textContent?.trim() ?? "");
}
function Zr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && X(n) !== "efeito aplicado") return n;
  const r = Ff(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && X(a) !== "aplicado" ? a : null;
}
function Xr(e, t) {
  return e.classList.contains(Mp) || X(t).includes("aplicado");
}
function Wh(e, t) {
  const n = e.getAttribute(Kt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Mn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function ol(e, t) {
  e.getAttribute(xe) === "true" && e.getAttribute(tt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(xe, "true"), e.setAttribute(tt, "true"), e.setAttribute(Fp, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Gr("✦", `${i}__button-icon--effect`),
    ye("Aplicar")
  ));
}
function Kh(e) {
  e.getAttribute(xe) === "true" && X(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(xe, "true"), e.setAttribute(tt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Gr("✓", `${i}__button-icon--effect-applied`),
    ye("Aplicado")
  ));
}
function il(e, t, n) {
  const r = e.getAttribute(Qr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Zr(t, n) ?? n;
}
function Yh(e) {
  Xr(e, e.textContent?.trim() ?? "") || e.remove();
}
function Qh(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(xe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Kt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ye(t));
}
function Zh(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(xe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Kt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Gr("✓", `${i}__button-icon--effect-resisted`),
    ye(t)
  );
}
function Xh(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Kt), e.removeAttribute("aria-disabled");
}
function Jh(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const ey = "data-paranormal-toolkit-card-layout-normalized";
function ty(e) {
  const t = ny(e.rollCard), n = ry(t);
  return oh({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function ny(e) {
  return {
    rollCard: e,
    damageSection: lh(e),
    resistance: e.querySelector(Lr),
    damageActions: ch(e),
    effectActionSource: uh(e),
    effectSection: Dh(e)
  };
}
function ry(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(ey, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = st(t, "Conjuração"), c = ay({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), $h(t, a));
  const u = Ph({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: oy(n, c),
    fallbackAfter: l
  });
  return u && Nh(t, u), u;
}
function ay(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function oy(e, t) {
  return e ?? t;
}
const sl = [0, 80, 180, 400, 900, 1600, 3e3], ho = /* @__PURE__ */ new WeakSet();
function iy(e) {
  ll(e), sy(e);
}
function ll(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    cl(t);
}
function sy(e) {
  if (!ho.has(e)) {
    ho.add(e);
    for (const t of sl)
      globalThis.setTimeout(() => {
        ll(e);
      }, t);
  }
}
function cl(e) {
  const t = ty({
    rollCard: e,
    refreshDelaysMs: sl,
    onRefresh: () => cl(e)
  });
  cg({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const ly = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function cy(e) {
  for (const t of Array.from(e.querySelectorAll(Lr)))
    uy(t);
  iy(e);
}
function uy(e) {
  const t = e.querySelector(wd), n = e.querySelector(Wi), r = e.querySelector(jt), a = e.querySelector(Ki);
  if (!r || !t && !n && !a) return;
  const o = dy(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), my(a)), yy(r), r.parentElement !== e && e.append(r);
}
function dy(e, t) {
  const n = e.querySelector(`.${Ua}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Ua), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function my(e) {
  const t = fy(e.textContent ?? "");
  t && (e.setAttribute(ly, "true"), e.replaceChildren(hy(t)));
}
function fy(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = py(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function py(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: gy(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function gy(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function hy(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = by(e);
  return r && t.append(r), t;
}
function yy(e) {
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
function by(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Ay(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Ay(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? yo(e, "highest") : n.includes("kl") ? yo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function yo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function bo(e) {
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
  const n = _y(e, t);
  return kt(n);
}
function _y(e, t) {
  return t.split(".").reduce((n, r) => Yt(n) ? n[r] : null, e);
}
function Ty(e, t) {
  const n = e.indexOf(":");
  return n < 0 || nt(e.slice(0, n)) !== nt(t) ? null : Ue(e.slice(n + 1));
}
function kt(e) {
  return typeof e == "string" ? Ue(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Yt(e) {
  return !!e && typeof e == "object";
}
function Ry(e) {
  return typeof e == "string";
}
function Qt(e) {
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
function rr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function J(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ul(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function wy(e) {
  for (const t of Array.from(e.querySelectorAll(_d))) {
    const n = Ly(t);
    $y(t), n && (ky(t, n), Ey(t, n));
  }
}
function $y(e) {
  for (const t of Array.from(e.querySelectorAll(Td)))
    t.remove();
}
function ky(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Hi) ?? null, a = r?.querySelector(Ad) ?? null, o = r ?? e, s = o.querySelector(Ed);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Wy(t.elementTone), l.textContent = Hy(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Ey(e, t) {
  const n = Iy(e);
  Cy(e, n);
  const r = Sy(t);
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
  const o = e.querySelector(Yi);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Iy(e) {
  return e.closest(`.${i}`)?.querySelector(Hi) ?? null;
}
function Cy(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Id)))
      a.remove();
}
function Sy(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${rr(e.target)}` : null,
    e.duration ? `Duração: ${rr(e.duration)}` : null,
    e.resistance ? `Resistência: ${ul(e.resistance)}` : null
  ].filter(Qt);
}
function Ly(e) {
  const t = vy(e), n = My(e), a = (t ? Oy(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = ea(F(a, "element")), l = H("op.elementChoices", s) ?? Ao(se(o, "Elemento")) ?? Ao(n.damageType), c = s ?? Ky(l), u = F(a, "circle") ?? se(o, "Círculo"), m = Uy(a) ?? se(o, "Alvo"), y = zy(a, "duration", "op.durationChoices") ?? se(o, "Duração"), R = Fy(e) ?? Gy(a) ?? se(o, "Resistência"), b = By(o) ?? n.cost, p = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: b,
    target: m,
    duration: y,
    resistance: R
  };
  return Vy(p) ? p : null;
}
function vy(e) {
  const t = Dy(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Gt), r = Ny(n);
  if (r.length === 0) return null;
  const a = Py(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Dy(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Jr()?.messages?.get?.(n) ?? null : null;
}
function Py(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Ba}]`))) {
    const a = r.getAttribute(Ba)?.trim();
    a && n.add(a);
  }
  return n;
}
function Ny(e) {
  if (!Yt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(xy).filter((n) => n !== null) : [];
}
function xy(e) {
  return Yt(e) ? {
    pendingId: kt(e.pendingId),
    actorId: kt(e.actorId),
    itemId: kt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Ry) : []
  } : null;
}
function Oy(e) {
  if (!e.itemId) return null;
  const t = Jr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function My(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Rd))) {
    const a = Ue(r.textContent);
    if (!a) continue;
    const o = Ty(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function Fy(e) {
  const t = Ue(e.querySelector(Wi)?.textContent);
  return t ? ul(t) : null;
}
function se(e, t) {
  const n = nt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || nt(r.slice(0, a)) !== n))
      return Ue(r.slice(a + 1));
  }
  return null;
}
function By(e) {
  const t = se(e, "Custo") ?? se(e, "PE");
  return t || (e.map(Ue).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Uy(e) {
  const t = F(e, "target");
  if (!t) return null;
  if (t === "area")
    return qy(e) ?? H("op.targetChoices", t) ?? "Área";
  const n = H("op.targetChoices", t) ?? J(t);
  return [t === "people" || t === "creatures" ? F(e, "targetQtd") : null, n].filter(Qt).join(" ");
}
function qy(e) {
  const t = F(e, "area.name"), n = F(e, "area.size"), r = F(e, "area.type"), a = t ? H("op.areaChoices", t) ?? J(t) : null, o = r ? H("op.areaTypeChoices", r) ?? J(r) : null;
  return a ? n ? o ? `${a} ${n}m ${rr(o)}` : `${a} ${n}m` : a : null;
}
function Gy(e) {
  const t = F(e, "skillResis"), n = F(e, "resistance");
  if (!t || !n) return null;
  const r = H("op.skill", t) ?? J(t), a = jy(n);
  return [r, a].filter(Qt).join(" ");
}
function jy(e) {
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
function zy(e, t, n) {
  const r = F(e, t);
  return r ? H(n, r) ?? J(r) : null;
}
function Vy(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Hy(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Wy(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Qt).join(" ");
}
function ea(e) {
  const t = nt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Ao(e) {
  const t = ea(e);
  return t ? H("op.elementChoices", t) ?? J(t) : e ? J(e) : null;
}
function Ky(e) {
  return ea(e);
}
function H(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Jr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const _o = "data-paranormal-toolkit-dice-toggle-enhanced";
function Yy(e) {
  for (const t of Array.from(e.querySelectorAll(Qi)))
    dl(t);
}
function Qy(e) {
  const t = fl(e.target);
  if (!t) return;
  const n = ta(t);
  n && (e.preventDefault(), ml(n, t));
}
function Zy(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = fl(e.target);
  if (!t) return;
  const n = ta(t);
  n && (e.preventDefault(), ml(n, t));
}
function dl(e) {
  const t = e.querySelector(zt);
  if (!t) return;
  const n = e.querySelector(Dr);
  if (n && n.getAttribute(_o) !== "true" && (n.setAttribute(_o, "true"), n.classList.add(Pr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function ml(e, t) {
  const n = e.querySelector(zt);
  if (!n) return;
  const r = !e.classList.contains(vr);
  Xy(e, t, n, r);
}
function Xy(e, t, n, r) {
  e.classList.toggle(vr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function fl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Dr);
  if (!t) return null;
  const n = ta(t);
  return n ? (dl(n), t.classList.contains(Pr) ? t : null) : null;
}
function ta(e) {
  const t = e.closest(Qi);
  return t && t.querySelector(zt) ? t : null;
}
const To = `${d}-workflow-dice-toggle-styles`;
function Jy() {
  if (document.getElementById(To)) return;
  const e = document.createElement("style");
  e.id = To, e.textContent = `
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
const eb = [0, 100, 500, 1500, 3e3];
let Ro = !1, hn = null;
function tb() {
  if (!Ro) {
    Ro = !0, Jy(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Qe(bo(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Qe(bo(t));
    }), Hooks.once("ready", () => {
      Qe(document), nb();
    }), document.addEventListener("click", Qy), document.addEventListener("keydown", Zy);
    for (const e of eb)
      globalThis.setTimeout(() => Qe(document), e);
  }
}
function nb() {
  hn || !document.body || (hn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Qe(n);
  }), hn.observe(document.body, { childList: !0, subtree: !0 }));
}
function Qe(e) {
  e && (Vd(e), wy(e), cy(e), Yy(e), Md(e));
}
function rb() {
  tb();
}
const ab = "data-paranormal-toolkit-action-section", ob = "ritual-log", ib = ".paranormal-toolkit-item-use-prompt__actions", sb = ".paranormal-toolkit-item-use-prompt__actions-title", lb = [0, 100, 500, 1500];
let wo = !1;
function cb() {
  if (wo) return;
  const e = (t, n) => {
    $o(fb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), $o(document), wo = !0;
}
function $o(e) {
  for (const t of lb)
    globalThis.setTimeout(() => ub(e), t);
}
function ub(e) {
  db(e), mb(e);
}
function db(e) {
  for (const t of e.querySelectorAll(
    `[${ab}="${ob}"]`
  ))
    t.remove();
}
function mb(e) {
  for (const t of e.querySelectorAll(ib)) {
    if (ko(t.querySelector(sb)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => ko(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function fb(e) {
  if (e instanceof HTMLElement || pb(e))
    return e;
  if (gb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function pb(e) {
  return e instanceof HTMLElement;
}
function gb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function ko(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ze = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, pl = {
  PV: "system.attributes.hp"
}, ar = {
  PV: [Ze.PV, pl.PV],
  SAN: [Ze.SAN],
  PE: [Ze.PE],
  PD: [Ze.PD]
}, or = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class hb {
  getResource(t, n) {
    const r = Eo(t, n);
    if (!r.ok)
      return g(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = Co(t, n, o, l, "valor atual");
    if (u) return g(u);
    const m = Co(t, n, s, c, "valor máximo");
    return m ? g(m) : A({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Eo(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Eo(e, t) {
  const n = yb(e.type, t);
  if (n && Io(e, n))
    return A(n);
  const r = ar[t].find(
    (a) => Io(e, a)
  );
  return r ? A(r) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: bb(e, t),
    path: ar[t].join(" | ")
  });
}
function yb(e, t) {
  return e === "threat" ? pl[t] ?? null : e === "agent" ? Ze[t] : null;
}
function Io(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function bb(e, t) {
  const n = e.type ?? "unknown", r = ar[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Co(e, t, n, r, a) {
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
class Ab {
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
    const { path: r, value: a } = n, o = _b(a);
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
function _b(e) {
  if (So(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (So(n))
      return n;
  }
  return null;
}
function So(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Tb = "dice-so-nice";
async function gl(e) {
  if (!Rb() || !wb()) return;
  const t = $b();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Rb() {
  try {
    return bd().enabled;
  } catch {
    return !1;
  }
}
function wb() {
  return game.modules?.get?.(Tb)?.active === !0;
}
function $b() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Lo = "occultism";
class hl {
  getDifficulty(t) {
    return kb(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Ib(t, Lo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await gl(r);
    const a = Lb(r);
    return {
      skill: Lo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: Sb(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: vb(r)
    };
  }
}
function kb(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Eb(e) {
  return new hl().rollCastingCheck(e);
}
async function Ib(e, t) {
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
  return Cb(r);
}
function Cb(e) {
  return vo(e) ? e : Array.isArray(e) ? e.find(vo) ?? null : null;
}
function vo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Sb(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Lb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function vb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Db);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Db(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Pb = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Nb {
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
    const r = n.value, a = xb(t.ritual, r);
    return a.ok ? a.value ? A(a.value) : A({
      resource: "PE",
      amount: Pb[r],
      source: "default-by-circle",
      circle: r
    }) : g(a.error);
  }
}
function xb(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Ob(n) ? {
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
function Ob(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const yn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Mb(e) {
  if (!jb(e.item)) return null;
  const t = ir(e.actor) ? e.actor : Fb(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Ub(e.token) ?? Bb(t),
    targets: Ir(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Fb(e) {
  const t = e;
  return ir(t.actor) ? t.actor : ir(e.parent) ? e.parent : null;
}
function Bb(e) {
  const t = qb(e) ?? Gb(e);
  return t ? yl(t) : null;
}
function Ub(e) {
  return sr(e) ? yl(e) : null;
}
function qb(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return sr(n) ? n : (t.getActiveTokens?.() ?? []).find(sr) ?? null;
}
function Gb(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function yl(e) {
  const t = e.actor ?? null;
  return {
    tokenId: bn(e.id),
    actorId: bn(t?.id),
    sceneId: bn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function jb(e) {
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
class zb {
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
    const n = Mb(Vb(t));
    if (!n) {
      f.warn(`${yn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Vb(e) {
  return e && typeof e == "object" ? e : {};
}
class Hb {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return An("missing-item-patch");
    if (t.type !== "ritual") return An("unsupported-item-type");
    const a = Wb(r);
    return Object.keys(a).length === 0 ? An("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function Wb(e) {
  const t = {};
  v(t, "name", e.name), v(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (v(t, "system.circle", n.circle), v(t, "system.element", n.element), v(t, "system.target", n.target), v(t, "system.targetQtd", n.targetQuantity), v(t, "system.execution", n.execution), v(t, "system.range", n.range), v(t, "system.duration", n.duration), v(t, "system.skillResis", n.resistanceSkill), v(t, "system.resistance", n.resistance), v(t, "system.studentForm", n.studentForm), v(t, "system.trueForm", n.trueForm)), t;
}
function v(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function An(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Kb {
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
class Yb {
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
class Qb {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Zb(t);
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
    return this.list().map((n) => Xb(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Zb(e) {
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
function Xb(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = Jb(a, t);
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
function Jb(e, t) {
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
      const n = Do(t.name), r = e.names.map(Do).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = eA(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Do(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function eA(e) {
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
async function tA(e, t, n) {
  if (!Po(e.id) || !Po(e.formula))
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
    await gl(a);
    const l = {
      ...n.rollRequests[e.id] ?? bl(e, t),
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
function bl(e, t) {
  const n = e.intent ?? nA(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function nA(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Po(e) {
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
function rA(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = aA(t, n, r, a);
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
    const s = oA(t, n, r, a);
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
function aA(e, t, n, r) {
  const a = Zt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Al(t.id, "damage", r, t.damageInstances.length),
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
function oA(e, t, n, r) {
  const a = Zt(e.amountFrom);
  return {
    id: Al(t.id, "healing", r, t.healingInstances.length),
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
function Al(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function iA(e, t, n) {
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
function sA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), _l("before", e), No("before", e), No("resolve", e);
}
function lA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), _l("apply", e);
}
function cA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function _l(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = uA(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function No(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function uA(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function dA(e, t, n) {
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
async function mA(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return fA(e, t);
    case "spendRitualCost":
      return pA(e, t);
  }
}
async function fA(e, t) {
  const { context: n, resources: r } = e, a = Lt(t, n);
  return a.ok ? Tl(await r.spend(n.sourceActor, t.resource, a.value), n) : g(a.error);
}
async function pA(e, t) {
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
  }), Tl(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Tl(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), A(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function gA(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = hA(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function hA(e) {
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
class yA {
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
        return gA({
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
    const a = await mA({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = bl(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), A(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await tA(t, r, n);
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Lt(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = iA(t, n, a.value);
    sA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), lA({
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
      rA({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return cA({
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
      const l = await vt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return A(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await dA(this.messages, t, n);
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
    const l = bA(t, n.intent);
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
function bA(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class AA {
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
class _A {
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
class TA {
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
function Rl(e) {
  return {
    id: RA(),
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
function RA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class wA {
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
    const r = Rl(n);
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
class $A {
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
class kA {
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
      whisper: EA(),
      flags: {
        ...t.flags,
        [d]: {
          ...IA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Nn();
    if (!r.enabled)
      return;
    const a = n.notification ?? xo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = xo(n);
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
function xo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function EA() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function IA(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const CA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", wl = `${d}-inline-roll-neutralized`, SA = `${d}-inline-roll-notice`, na = `data-${d}-inline-roll-neutralized`, Oo = `data-${d}-inline-roll-notice`, LA = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Mo(e) {
  const t = zA(e.message), n = await vA(e.message), r = DA(t);
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
async function vA(e) {
  const t = qA(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = PA(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await GA(t, n.content), replacementCount: n.replacementCount };
}
function DA(e) {
  const t = e ? jA(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = $l(t);
  return n > 0 && kl(FA(t)), { replacementCount: n };
}
function PA(e) {
  const t = NA(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = $l(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (kl(n.content), { content: n.innerHTML, replacementCount: a });
}
function NA(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, OA(a.trim()))), replacementCount: t };
}
function $l(e) {
  const t = xA(e);
  for (const n of t)
    n.replaceWith(MA(BA(n)));
  return t.length;
}
function xA(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(CA))
    n.getAttribute(na) !== "true" && t.add(n);
  return Array.from(t);
}
function OA(e) {
  return `<span class="${wl}" ${na}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${VA(e)}</span>`;
}
function MA(e) {
  const t = document.createElement("span");
  return t.classList.add(wl), t.setAttribute(na, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function kl(e) {
  if (e.querySelector?.(`[${Oo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(SA), t.setAttribute(Oo, "true"), t.textContent = LA, e.append(t);
}
function FA(e) {
  return e.querySelector(".message-content") ?? e;
}
function BA(e) {
  const n = e.getAttribute("data-formula") ?? UA(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function UA(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function qA(e) {
  return e && typeof e == "object" ? e : null;
}
async function GA(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function jA(e) {
  const t = HA(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function zA(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function VA(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function HA(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Dt = "ritualRollConfig", Le = "ritual-roll";
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
function El(e) {
  const t = e.getFlag(d, Dt);
  return lr(t);
}
function Il(e) {
  return El(e) ?? Xt();
}
async function WA(e, t) {
  const n = lr(t) ?? lr({
    ...Xt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Dt, n), n;
}
async function KA(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Dt));
    return;
  }
  await e.setFlag(d, Dt, null);
}
function lr(e) {
  if (!Jt(e)) return null;
  const t = n_(e.intent);
  if (!t) return null;
  const n = Xt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Pt(e.damageType),
    utilityLabel: Pt(e.utilityLabel) ?? n.utilityLabel,
    note: ra(e.note),
    forms: r_(e.forms)
  };
}
function YA(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function QA(e) {
  const t = El(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = ZA(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...XA(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: e_(e, t),
    resistance: t.intent === "damage" ? Cl(e) : void 0
  };
}
function ZA(e, t) {
  const n = {
    type: "rollFormula",
    id: Le,
    formula: t,
    intent: t_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function XA(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Le}.total`,
          ...JA(e.damageType)
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
function JA(e) {
  return e ? { damageType: e } : {};
}
function e_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Le]: n
      }
    }
  };
  return Fo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Le]: t.forms.discente.formula.trim()
    }
  }), Fo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Cl(e) {
  const t = Sl(e), n = Pt(t.skillResis), r = Pt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = a_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function t_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function n_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function r_(e) {
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
function Fo(e, t) {
  const n = Sl(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return o_(r);
}
function Sl(e) {
  const t = e.system;
  return Jt(t) ? t : {};
}
function a_(e) {
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
function o_(e) {
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
function i_(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function s_(e) {
  switch (l_(e)) {
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
      return c_(String(e ?? ""));
  }
}
function l_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function c_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function u_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function d_(e) {
  return {
    ...aa(e),
    type: "ritual.cast.started"
  };
}
function m_(e) {
  return {
    ...aa(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function f_(e) {
  return {
    ...aa(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function p_(e) {
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
function g_(e, t = {}) {
  const n = S_(e), r = [
    ...v_(t.candidates ?? []),
    ...D_(e)
  ], a = N_(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = L_(t) ?? x_(r) ?? M_(a), s = B_(canvas?.grid?.size), l = h_(o, a, r), c = w_(r), u = R_(l);
  return {
    type: "rectangleRay",
    sceneId: F_(e, n),
    regionId: Go(n?.id) ?? Go(e.id),
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
function h_(e, t, n) {
  const r = {
    x: I(e.x) ?? 0,
    y: I(e.y) ?? 0,
    width: I(e.width) ?? t.width,
    height: I(e.height) ?? t.height,
    direction: I(e.direction) ?? 0,
    elevation: I(e.elevation)
  };
  return {
    ...r,
    direction: y_(r, t, n)
  };
}
function y_(e, t, n) {
  const r = b_(n);
  return r !== null ? r : A_(e, t) ?? e.direction;
}
function b_(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    for (const o of t) {
      const s = I(foundry.utils.getProperty(n, o));
      if (s !== null && Math.abs($e(s)) > 1e-3)
        return $e(s);
    }
    const r = n.toObject;
    if (typeof r != "function") continue;
    const a = r.call(n);
    for (const o of t) {
      const s = I(foundry.utils.getProperty(a, o));
      if (s !== null && Math.abs($e(s)) > 1e-3)
        return $e(s);
    }
  }
  return null;
}
function A_(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Uo(Bo(e, e.direction), t), r = __(e, t);
  if (r === null) return null;
  const o = T_([
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
    error: Uo(Bo(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(1, Math.min(e.width, Math.max(e.height, 1)) * 0.05);
  return o.error <= s ? $e(o.direction) : null;
}
function __(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = jo(o, 0, 1), c = jo(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : U_(Math.atan2(c, l));
}
function Bo(e, t) {
  const n = Ll(t), r = {
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
function Uo(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function T_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = $e(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function R_(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Ll(e.direction), n = {
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
function w_(e) {
  for (const t of e) {
    const n = qo(t, "ray.start"), r = qo(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function qo(e, t) {
  const n = foundry.utils.getProperty(e, t), r = I(foundry.utils.getProperty(n, "x")), a = I(foundry.utils.getProperty(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function aa(e) {
  const t = p_(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: E_(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: $_(e.context.item, e.form, e.formLabel, t),
    targets: n.map(I_),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function $_(e, t, n, r) {
  return {
    name: e.name,
    slug: wn(e, "system.slug") ?? wn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: wn(e, "system.element"),
    circle: C_(e),
    form: k_(t),
    formLabel: n
  };
}
function k_(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function E_(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function I_(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function C_(e) {
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
function S_(e) {
  return "document" in e && e.document ? e.document : e;
}
function L_(e) {
  return e.shape && cr(e.shape) ? e.shape : null;
}
function v_(e) {
  return e.filter(oa);
}
function D_(e) {
  return [
    e,
    P_(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(oa);
}
function P_(e) {
  return "object" in e && oa(e.object) ? e.object : null;
}
function oa(e) {
  return !!(e && typeof e == "object");
}
function N_(e) {
  const t = e.map((n) => n.bounds);
  for (const n of t) {
    if (!n) continue;
    const r = I(n.x), a = I(n.y), o = I(n.width), s = I(n.height);
    if (!(r === null || a === null || o === null || s === null))
      return { x: r, y: a, width: o, height: s };
  }
  return null;
}
function x_(e) {
  for (const t of e) {
    const n = O_(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function O_(e) {
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
function M_(e) {
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
function F_(e, t) {
  return $n(e, "parent.id") ?? $n(e, "document.parent.id") ?? $n(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function $n(e, t) {
  return de(foundry.utils.getProperty(e, t));
}
function Go(e) {
  return de(e);
}
function I(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function B_(e) {
  const t = I(e);
  return t !== null && t > 0 ? t : null;
}
function Ll(e) {
  return e * Math.PI / 180;
}
function U_(e) {
  return e * 180 / Math.PI;
}
function $e(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function jo(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class q_ {
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
const G_ = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class j_ {
  constructor(t = new en()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = z_(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(G_);
  }
}
function z_(e, t) {
  const n = [], r = V_(e), a = zo(r), o = zo(e);
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
function V_(e) {
  return H_(e) ? e.document ?? null : e;
}
function H_(e) {
  return "bounds" in e;
}
function zo(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const W_ = 100, K_ = 12;
class Y_ {
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
      const a = this.foundryAdapter.getGridSize() ?? W_, o = eT(n), s = await this.foundryAdapter.placeRegion(
        Q_(t, this.foundryAdapter.getUserColor(), a),
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
        message: J_(a)
      };
    }
  }
}
function Q_(e, t, n) {
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
    shapes: [Z_(e, n)]
  };
}
function Z_(e, t) {
  const n = X_(e, t);
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
function X_(e, t) {
  return {
    length: Vo(e.length, K_, t),
    width: Vo(e.width, 1, t)
  };
}
function Vo(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function J_(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function eT(e) {
  const t = (n) => {
    const r = tT(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function tT(e) {
  return nT(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function nT(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class rT {
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
    this.applyTargets(Ho(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Ho(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = aT(t);
    oT(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Ho(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function aT(e) {
  return Array.from(new Set(e));
}
function oT(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class iT {
  constructor(t = new en()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(xi)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(sT(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(lT(t), "final");
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
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = uT(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function sT(e) {
  return [
    { source: "document", region: ce(e.document) },
    { source: "document.object", region: ce(e.document.object) },
    { source: "preview", region: ce(e.preview) },
    { source: "preview.document.object", region: ce(e.preview?.document?.object) }
  ];
}
function lT(e) {
  return [
    { source: "input", region: ce(e) },
    { source: "input.object", region: cT(e) ? ce(e.object) : null },
    { source: "input.document.object", region: vl(e) ? ce(e.document?.object) : null }
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
function vl(e) {
  return "document" in e && "bounds" in e;
}
function cT(e) {
  return !vl(e);
}
function uT(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function bt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const dT = "Nenhum alvo encontrado na linha.";
class mT {
  constructor(t = new Y_(), n = new iT(), r = new j_(), a = new rT(), o = new q_()) {
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
      let r = null;
      const a = this.regionTargetPreview.captureCurrentTargets(), o = () => {
        this.regionTargetPreview.restorePreviousTargets(a);
      }, s = await this.regionLinePlacement.placeLine(
        {
          shape: "rectangleRay",
          length: t.formTargeting?.template?.distance,
          width: t.formTargeting?.template?.width
        },
        {
          onChange: (l) => {
            r = l;
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
        const l = this.regionTargetResolver.resolveTargets(s.region), c = g_(s.region, {
          candidates: [r?.preview, r?.document],
          shape: r?.shape
        });
        return l.targets.length === 0 ? (o(), this.foundryAdapter.warn(dT), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(l.tokens), {
          status: "confirmed",
          targets: l.targets,
          areaSnapshot: c
        });
      } catch (l) {
        o();
        const c = fT(l);
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
function fT(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function pT(e) {
  return {
    header: {
      eyebrow: Tr,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: RT(e.ritual)
    },
    forms: e.variantOptions.map((t) => gT(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: bT(e.targetNames, e.variantOptions, e.ritual),
    automation: TT(e.automationStatus ?? "assisted")
  };
}
function gT(e, t) {
  const n = hT(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? yT(t) : "—",
    details: n
  };
}
function hT(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function yT(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function bT(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => AT(a, n))
  };
}
function AT(e, t) {
  const n = e.targeting ?? _T(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function _T(e, t) {
  const n = ot(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function TT(e) {
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
function RT(e) {
  const t = e.system, n = [$T(t?.element), wT(t?.circle)].filter(IT);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function wT(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function $T(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (kT(e)) {
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
      return ET(e);
  }
}
function kT(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function ET(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function IT(e) {
  return typeof e == "string" && e.length > 0;
}
const Dl = ["base", "discente", "verdadeiro"];
function ia(e) {
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
  return typeof e == "string" && Dl.includes(e);
}
const { ApplicationV2: CT } = foundry.applications.api;
class Je extends CT {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = pT(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    vT(a, (o) => {
      this.selectedVariant = o, dr(a, o);
    }), dr(a, this.selectedVariant), DT(a, (o) => {
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
          ${this.model.forms.map(ST).join("")}
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
          ${this.model.targets.forms.map(LT).join("")}
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
    const n = OT(t), r = PT(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function ST(e) {
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
function LT(e) {
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
function vT(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => Wo(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Wo(e, a, t));
    });
  const r = Pl(e);
  r && t(r);
}
function Wo(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Nt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Pl(e), dr(e, r.value));
}
function Pl(e) {
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
function DT(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function PT(e, t, n) {
  const r = xT(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = NT(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function NT(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function xT(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Nt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Nt(n) ? n : null;
}
function OT(e) {
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
async function MT(e) {
  return Je.request(e);
}
const sa = {
  label: "Padrão"
}, FT = {
  label: "Discente",
  extraCost: 2
}, BT = {
  label: "Verdadeiro",
  extraCost: 5
};
class UT {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new mT();
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
    const a = this.resolveCostPreview(t), o = DR(n), s = SR(
      n,
      t.item,
      a,
      o
    ), l = await MT({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((E) => E.name),
      cost: a,
      defaultSpendResource: FR(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = qT(l), u = NR(
      n,
      t.item,
      c.variant,
      o
    ), m = u_(), y = u.label ?? ia(c.variant), R = (E = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: y,
      targets: E
    }), b = (E, C = t.targets, _e = {}) => {
      this.ritualEvents.emitCastFinished(
        f_({
          ...R(C),
          status: E,
          ..._e
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      d_(R())
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
    const T = GT(
      t,
      p.targets
    );
    p.areaSnapshot && this.ritualEvents.emitAreaResolved(
      m_({
        ...R(p.targets),
        area: p.areaSnapshot
      })
    );
    const be = qi();
    let Y = null;
    if (be) {
      const E = await zT(
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
        const C = await Eb(
          T.actor
        );
        Y = HT(
          C,
          u,
          a
        );
      } catch (C) {
        const _e = C instanceof Error ? C.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return b("failed", T.targets, {
          reason: "ritual-casting-check-failed",
          message: _e
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: _e,
          cause: C
        };
      }
    }
    const Ae = jT(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !be
      }
    );
    if (Ae.steps.length === 0) {
      const E = PR(
        T,
        c
      ), C = Yo(
        n,
        T
      ), _e = Ko(
        T.actor,
        Y,
        u,
        a
      ), Ta = Qo(
        n,
        c,
        u,
        a,
        E,
        T,
        Y
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
      const Ra = [
        ..._e,
        ...C.actions
      ];
      return Ra.length > 0 ? (b("ready", T.targets), {
        status: "ready",
        workflowContext: E,
        itemUseContext: T,
        actions: Ra,
        summaryLines: Ta
      }) : (b("completed-without-actions", T.targets), {
        status: "completed-without-actions",
        workflowContext: E,
        itemUseContext: T,
        summaryLines: Ta
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
    const te = x.value.context, q = XT(
      n,
      T,
      te
    ), O = Yo(
      n,
      T
    ), sn = Ko(
      T.actor,
      Y,
      u,
      a
    ), Aa = Qo(
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
    const _a = [
      ...sn,
      ...q.actions,
      ...O.actions
    ];
    return _a.length === 0 ? (b("completed-without-actions", T.targets), {
      status: "completed-without-actions",
      workflowContext: te,
      itemUseContext: T,
      summaryLines: Aa
    }) : (b("ready", T.targets), {
      status: "ready",
      workflowContext: te,
      itemUseContext: T,
      actions: _a,
      summaryLines: Aa
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
function qT(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function GT(e, t) {
  return {
    ...e,
    targets: t
  };
}
function jT(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || ca(l) && (!a.includeCostSteps || !s) || o.push(VT(l, n));
  return a.includeCostSteps && s && r && BR(n.extraCost) && o.push({
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
async function zT(e, t, n, r, a) {
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
function VT(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function HT(e, t, n) {
  const a = WT(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function WT(e, t) {
  const n = qe(e, t);
  return n ? i_(n.amount) : null;
}
function Ko(e, t, n, r) {
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
function Yo(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = la(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = ns(o);
      n.push(
        KT(
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
function KT(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? ZT(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: YT(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: QT(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function YT(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function QT(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function ZT(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function XT(e, t, n) {
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
    const l = la(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (JT(o)) {
        eR(
          a,
          c,
          tR(o, n, s.value)
        );
        continue;
      }
      r.push(rR(o, c, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...nR(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function JT(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function eR(e, t, n) {
  const r = sR(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function tR(e, t, n) {
  const r = lR(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function nR(e, t, n, r) {
  const a = mR(e), o = a.length > 1 ? gR() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const y = fR(u.amount, s);
        return {
          id: aR(u, s, m),
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
      label: oR(c, s, a.length > 1),
      executedLabel: iR(
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
function rR(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = dR(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: cR(e, r, n),
    executedLabel: uR(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function aR(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function oR(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function iR(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function sR(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function lR(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function cR(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function uR(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function dR(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function mR(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function fR(e, t) {
  const n = e * t.multiplier, r = pR(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function pR(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function gR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function la(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Qo(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${ia(t.variant)}`,
    AR(t, n, r),
    ...bR(s),
    ...Object.values(a.rolls).flatMap(_R),
    ...hR(e, o),
    ...TR(e.resistance),
    ...IR(n)
  ];
}
function hR(e, t) {
  return yR(e) ? la("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function yR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function bR(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function AR(e, t, n) {
  const r = qe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function _R(e) {
  const n = [`${CR(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = RR(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${s_(e.damageType)}`), n;
}
function TR(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function RR(e) {
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
    const s = wR(o);
    s && (ER(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function wR(e) {
  const t = $R(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : kR(e);
}
function $R(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function kR(e) {
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
function ER(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function IR(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function CR(e) {
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
function SR(e, t, n, r) {
  return Dl.map((a) => {
    const o = Nl(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? ia(a),
      enabled: s,
      details: o ? LR(o, n, r) : [],
      finalCostText: o ? vR(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function LR(e, t, n) {
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
function vR(e, t) {
  const n = qe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function DR(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(ca);
}
function PR(e, t) {
  return Rl({
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
function NR(e, t, n, r) {
  return Nl(e, t, n, r) ?? sa;
}
function Nl(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? OR(t, n) ? xR(n) : null : n === "base" ? sa : null);
}
function xR(e) {
  switch (e) {
    case "base":
      return sa;
    case "discente":
      return FT;
    case "verdadeiro":
      return BT;
  }
}
function OR(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return MR(foundry.utils.getProperty(e, n));
}
function MR(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function FR(e) {
  return e.steps.some(ca);
}
function ca(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function BR(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const xl = "itemUsePrompts", Ol = "chatCard", tn = "data-paranormal-toolkit-prompt-id", nn = "data-paranormal-toolkit-pending-id", ua = "data-paranormal-toolkit-executed-label", mr = "data-paranormal-toolkit-choice-group", Ml = "data-paranormal-toolkit-skipped-label", xt = "data-paranormal-toolkit-action-section", Zo = "data-paranormal-toolkit-detail-key", Xo = "data-paranormal-toolkit-roll-card", da = "data-paranormal-toolkit-roll-detail-toggle", Fl = "data-paranormal-toolkit-roll-detail-id", Bl = "data-paranormal-toolkit-resistance-roll-button", Ul = "data-paranormal-toolkit-resistance-skill", ql = "data-paranormal-toolkit-resistance-skill-label", Gl = "data-paranormal-toolkit-resistance-target-actor-id", jl = "data-paranormal-toolkit-resistance-target-name", zl = "data-paranormal-toolkit-resistance-roll-result", Jo = "data-paranormal-toolkit-system-card-replaced", UR = `[${nn}]`, qR = `[${da}]`, GR = `[${Bl}]`, fr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, jR = `${h}__actions`, ei = `${h}__details`, Vl = `${h}__summary`, zR = `${h}__title`, Hl = `${h}__button--executed`, ti = `${h}__roll-card`;
let ni = !1, pr = null;
const U = /* @__PURE__ */ new Map(), VR = [0, 100, 500, 1500, 3e3], HR = 3e4, WR = [0, 100, 500, 1500, 3e3];
function KR(e) {
  if (pr = e, ni) {
    ai(e);
    return;
  }
  const t = (n, r) => {
    Kl(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ni = !0, ai(e);
}
async function ri(e) {
  const t = Wl(e);
  U.set(e.pendingId, t), await pa(t) || ic(t), Yl(e.pendingId);
}
async function YR(e) {
  const t = Wl({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", U.set(e.pendingId, t), await pa(t) || ic(t), Yl(e.pendingId);
}
async function kn(e, t) {
  const n = U.get(e);
  U.delete(e), n && await Yw(n, t);
}
function ma(e) {
  const t = mc();
  for (const n of t) {
    const r = K(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function QR(e, t) {
  const n = ma(e);
  if (!n) return;
  const r = K(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Ge(n.message, r));
}
async function ZR(e, t, n) {
  if (!t) return;
  const r = ma(e);
  if (!r) return;
  const a = K(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Ge(r.message, a);
}
function Wl(e) {
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
    summary: $w(e.context),
    executed: !1
  };
}
function Kl(e, t, n) {
  Kw();
  const r = an(t);
  if (!r) return;
  const a = Vw(e, r);
  a.length > 0 && Ot(r);
  for (const o of a)
    gr(r, o);
  ec(r, n), hr(r), yr(r);
}
function ai(e) {
  for (const t of WR)
    globalThis.setTimeout(() => {
      XR(e);
    }, t);
}
function XR(e) {
  for (const t of JR()) {
    const n = rn(t);
    ew(n) && Kl(n, t, e);
  }
}
function JR() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function ew(e) {
  return e ? ga(e) ? !0 : Zw(e).length > 0 : !1;
}
function Yl(e) {
  const t = U.get(e);
  if (!t) return;
  const n = t.messageId ? Hw(t.messageId) : null;
  if (n) {
    ci(n, t), Ot(n), gr(n, t), oi(n), hr(n), yr(n);
    return;
  }
  if (t.messageId) {
    _r(t);
    return;
  }
  const r = Ww(t);
  if (r) {
    ci(r, t), Ot(r), gr(r, t), oi(r), hr(r), yr(r);
    return;
  }
  _r(t);
}
function oi(e) {
  pr && ec(e, pr);
}
function Ot(e) {
  const t = tw();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Jl(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Jo) === "true") return;
  const r = n.querySelector(`.${fr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Jo, "true");
}
function tw() {
  try {
    return Fu() === "replace";
  } catch {
    return !1;
  }
}
function gr(e, t) {
  if (Ot(e), e.querySelector(`[${tn}="${je(t.pendingId)}"]`)) return;
  const n = rw(e, t);
  ow(n, t);
  const r = _w(t);
  if (nw(r)) return;
  Aw(n, r).append(ww(t));
}
function nw(e) {
  return Zl(e.id) && !fe();
}
function Ql(e) {
  const n = e.closest(`[${xt}]`)?.getAttribute(xt) ?? null;
  return Zl(n) && !fe();
}
function Zl(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function rw(e, t) {
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
  s.classList.add(zR), s.textContent = aw(t);
  const l = document.createElement("span");
  return l.classList.add(Vl), l.textContent = t.summary, a.append(o, s, l), r.append(a), Ew(e).append(r), r;
}
function aw(e) {
  const t = D(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function ow(e, t) {
  const n = t.summaryLines ?? [], r = ac(n, t);
  if (r) {
    iw(e, r, t);
    return;
  }
  Tw(e, n);
}
function iw(e, t, n) {
  if (e.querySelector(`[${Xo}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(ti, `${ti}--${t.intent}`), r.setAttribute(Xo, "true"), t.castingCheck && ii(r, lw(t.castingCheck), n.pendingId, "casting"), sw(t) && ii(r, cw(t), n.pendingId, "effect"), pw(r, t), gw(r, t, n), bw(r, t), e.append(r);
}
function sw(e) {
  return e.intent !== "casting";
}
function lw(e) {
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
function cw(e) {
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
function ii(e, t, n, r) {
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
  uw(a, t), yw(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function uw(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = dw(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function dw(e, t) {
  const n = mw(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of fw(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function mw(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function fw(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? si(e, "highest") : n.includes("kl") ? si(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function si(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function pw(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(g$);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function gw(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = hw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(Xl(t.resistanceRollResult)), e.append(r);
}
function hw(e, t) {
  if (!e.resistanceSkill || !he()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(tn, t.pendingId), n.setAttribute(Bl, "true"), n.setAttribute(Ul, e.resistanceSkill), n.setAttribute(ql, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Gl, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(jl, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(zl, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Xl(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = nc(e), t;
}
function yw(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(da, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Fl, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const y = document.createElement("dd");
    y.textContent = u.value, c.append(m, y);
  }
  e.append(l, c);
}
function bw(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function Aw(e, t) {
  const n = `[${xt}="${je(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(jR), a.setAttribute(xt, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function _w(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ac(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Tw(e, t) {
  if (t.length === 0) return;
  const n = Rw(e);
  for (const r of t) {
    const a = h$(r);
    if (n.querySelector(`[${Zo}="${je(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Zo, a), n.append(o);
  }
}
function Rw(e) {
  const t = e.querySelector(`.${ei}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ei), e.append(n), n;
}
function ww(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(tn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Hl), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(nn, e.pendingId), t.setAttribute(ua, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(mr, e.choiceGroupId), t.setAttribute(Ml, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function $w(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = kw(e);
  return `${t} → ${n}`;
}
function kw(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Ew(e) {
  return Jl(e) ?? e;
}
function Jl(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function ec(e, t) {
  const n = an(e);
  if (!n) return;
  const r = n.querySelectorAll(UR);
  for (const a of r) {
    if (Ql(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      Uw(a, t);
    }));
  }
}
function hr(e) {
  const t = an(e);
  if (!t) return;
  const n = t.querySelectorAll(qR);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Iw(t, r);
    }));
}
function yr(e) {
  const t = an(e);
  if (!t) return;
  const n = t.querySelectorAll(GR);
  for (const r of n) {
    if (!he()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Cw(t, r);
    }));
  }
}
function Iw(e, t) {
  const n = t.getAttribute(da);
  if (!n) return;
  const r = e.querySelector(`[${Fl}="${je(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Cw(e, t) {
  if (!he()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(tn), r = t.getAttribute(Ul), a = t.getAttribute(ql) ?? (r ? me(r) : "Resistência");
  if (!n || !r) return;
  const o = vw(e, n), s = Dw(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await tm(s, r);
    await Mw(c.roll);
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
    Sw(t, u), Lw(t, u), Fw(n, u), await Bw(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Sw(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(zl, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Lw(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? Xl(t);
  if (r) {
    r.textContent = nc(t);
    return;
  }
  n.append(a);
}
function vw(e, t) {
  const n = U.get(t);
  if (n) return n;
  const r = rn(e);
  return K(r)[t] ?? null;
}
function Dw(e, t) {
  const n = e?.resistanceTargetActor;
  if (V(n)) return n;
  const a = e?.context?.targets.map(br).find(V) ?? null;
  if (a) return a;
  const o = t.getAttribute(Gl) ?? e?.resistanceTargetActorId ?? null, s = o ? Nw(o) : null;
  return s || xw(
    t.getAttribute(jl) ?? e?.resistanceTargetName ?? Pw(t)
  );
}
function Pw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Vl}`)?.textContent ?? null;
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
function Nw(e) {
  const n = game.actors?.get?.(e);
  return V(n) ? n : tc().map((o) => rt(o)).find((o) => o?.id === e) ?? null;
}
function xw(e) {
  const t = ve(e);
  if (!t) return null;
  const n = tc().filter((o) => ve(Ow(o)) === t).map((o) => rt(o)).find(V) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => V(o) && ve(o.name) === t);
  return V(a) ? a : null;
}
function tc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ow(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : rt(e)?.name ?? null;
}
function ve(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function V(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function nc(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Mw(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Fw(e, t) {
  const n = U.get(e);
  n && (n.resistanceRollResult = t);
}
async function Bw(e, t, n) {
  const r = rn(e);
  if (r)
    try {
      const a = K(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Ge(r, a);
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
async function Uw(e, t) {
  if (Ql(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(nn);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    rc(e, e.getAttribute(ua) ?? "✓ Automação aplicada"), qw(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function rc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Hl), e.removeAttribute(nn), e.removeAttribute(ua);
}
function qw(e) {
  const t = e.getAttribute(mr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${mr}="${je(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Ml) ?? "✓ Outra opção escolhida";
    rc(a, o);
  }
}
function ac(e, t) {
  const n = e.map(fa).filter(f$), r = n.find((p) => p.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = D(e, "Forma"), o = D(e, "Custo"), s = D(e, "Dados") ?? D(e, `Dados (${r.label})`), l = D(e, "Tipo"), c = D(e, "Resistência"), u = D(e, "Resistência Perícia"), m = D(e, "Resistência Rótulo") ?? (u ? me(u) : null), y = oc(e, "Observação"), R = e.filter((p) => zw(p, r)), b = Gw(e);
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
function Gw(e) {
  const t = e.map(fa).find((o) => o?.intent === "casting") ?? null, n = D(e, "Conjuração DT"), r = D(e, "Conjuração Resultado");
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
function fa(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: jw(n)
  } : null;
}
function jw(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function D(e, t) {
  return oc(e, t)[0] ?? null;
}
function oc(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function zw(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || fa(e) ? !1 : e.trim().length > 0;
}
function Vw(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of U.values())
    Ar(r, e, t) && n.set(r.pendingId, r);
  for (const r of Qw(e))
    Ar(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Ar(e, t, n) {
  const r = ee(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !li(n, "itemId", e.itemId) ? !1 : !e.actorId || li(n, "actorId", e.actorId);
}
function li(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${y$(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function Hw(e) {
  const t = je(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ww(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ar(e, null, t))
      return t;
  return null;
}
function Kw() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of U.entries())
    e - r.createdAt > t && U.delete(n);
}
async function ci(e, t) {
  const n = rn(e);
  if (!n) return !1;
  try {
    const r = K(n);
    return r[t.pendingId] = ha(t, ee(n)), await Ge(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function pa(e) {
  const t = cc(e);
  if (!t) return !1;
  try {
    const n = K(t);
    return n[e.pendingId] = ha(e, ee(t)), await Ge(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function ic(e) {
  for (const t of VR)
    globalThis.setTimeout(() => {
      _r(e);
    }, t);
}
async function _r(e) {
  const t = cc(e);
  if (ga(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await pa(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Yw(e, t) {
  const n = lc(e.context.message);
  if (n)
    try {
      const r = K(n), a = r[e.pendingId] ?? ha(e, ee(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Ge(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Qw(e) {
  return Object.values(K(W(e))).filter(ct);
}
function K(e) {
  if (!e) return {};
  const t = {}, n = ga(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(sc(e)))
    t[r] ??= a;
  return t;
}
function Zw(e) {
  return Object.values(sc(W(e))).filter(ct);
}
function sc(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, xl);
  if (!Oe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    ct(a) && (n[r] = a);
  return n;
}
async function Ge(e, t) {
  typeof e.setFlag == "function" && (await Jw(e, t), await Xw(e, t));
}
async function Xw(e, t) {
  await Promise.resolve(e.setFlag?.(d, xl, t));
}
function ga(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Ol);
  return d$(t) ? t : null;
}
async function Jw(e, t) {
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
      actorName: e$(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Ol, a));
}
function e$(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function ha(e, t) {
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
function lc(e) {
  const t = W(e);
  if (t?.setFlag)
    return t;
  const n = t$(e);
  if (n?.setFlag)
    return n;
  const r = ee(e);
  if (!r) return null;
  const a = game.messages;
  return W(a?.get?.(r));
}
function t$(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(W).find((n) => typeof n?.setFlag == "function") ?? null;
}
function cc(e) {
  const t = lc(e.context.message);
  if (t) return t;
  const n = e.messageId ? n$(e.messageId) : null;
  if (n) return n;
  const r = mc().slice().reverse();
  return r.find((a) => r$(a, e)) ?? r.find((a) => a$(a, e)) ?? null;
}
function n$(e) {
  const t = game.messages;
  return W(t?.get?.(e));
}
function r$(e, t) {
  const n = ee(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!uc(e, t)) return !1;
  const a = dc(e);
  return !t.actorId || !a || a === t.actorId;
}
function a$(e, t) {
  if (!i$(e, t)) return !1;
  const n = dc(e);
  return t.actorId && n === t.actorId ? !0 : uc(e, t);
}
function uc(e, t) {
  const n = ve(o$(e));
  if (!n) return !1;
  const r = ve(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = ve(t.itemId);
  return !!(a && n.includes(a));
}
function o$(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function dc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function i$(e, t) {
  const n = s$(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= HR;
}
function s$(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function W(e) {
  return e && typeof e == "object" ? e : null;
}
function ct(e) {
  return Oe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && ie(e.resistanceTargetActorId) && ie(e.resistanceTargetName) && m$(e.resistanceRollResult) && l$(e.actionPayload) && En(e.title) && En(e.buttonLabel) && En(e.executedLabel) && ie(e.choiceGroupId) && ie(e.skippedLabel) && ie(e.actionSectionId) && ie(e.actionSectionTitle) && p$(e.summaryLines) : !1;
}
function l$(e) {
  return e == null ? !0 : Oe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && c$(e.resource) && u$(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function c$(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function u$(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function d$(e) {
  return Oe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && Oe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ct) : !1;
}
function m$(e) {
  return e == null ? !0 : Oe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ie(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function f$(e) {
  return e !== null;
}
function Oe(e) {
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
function p$(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function g$(e) {
  return typeof e == "string" && e.length > 0;
}
function mc() {
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
function h$(e) {
  return e.trim().toLowerCase();
}
function y$(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function je(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const di = 1e3;
class b$ {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new UT(
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
      settings: La(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = La();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = $i(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && k$(t.item) && n.executionMode === "ask") {
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
    if (await Mo(t), !t.actor) {
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
    const a = _$(
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
    const n = ma(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = C$(r);
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
    return o.ok ? (await QR(t), await ZR(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (KR(
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
    if (await Mo(t), !t.actor) {
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
      E$(t.item),
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
      return a.ok ? ($$(n, a.value), await ks(a.value), {
        ok: !0,
        executedLabel: A$(a.value)
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
        mi(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Ln();
    await YR({
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
      }), await ri({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: In(s),
        skippedLabel: mi(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: I$(s)
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
    }), await ri({
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
    const n = Date.now(), r = fi(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > di && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= di;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(fi(t), Date.now());
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
function A$(e) {
  return Es({ inputAmount: e.totalRawDamage });
}
function _$(e, t) {
  if (t.resistance || !T$(t))
    return t;
  const n = Cl(e);
  return n ? { ...t, resistance: n } : t;
}
function T$(e) {
  return R$(e) && !w$(e);
}
function R$(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function w$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function In(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function mi(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function $$(e, t) {
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
function k$(e) {
  return e.type === "ritual";
}
function E$(e) {
  return QA(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function I$(e) {
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
function C$(e) {
  const t = e.actorUuid ? S$(e.actorUuid) : null;
  if (Me(t)) return t;
  const n = e.actorId ? L$(e.actorId) : null;
  return n || v$(e.actorName);
}
function S$(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function L$(e) {
  const n = game.actors?.get?.(e);
  if (Me(n)) return n;
  for (const r of fc()) {
    const a = ya(r);
    if (a?.id === e) return a;
  }
  return null;
}
function v$(e) {
  const t = Cn(e);
  if (!t) return null;
  for (const a of fc()) {
    const o = D$(a);
    if (Cn(o) === t) {
      const s = ya(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Me(a) && Cn(a.name) === t
  );
  return Me(r) ? r : null;
}
function fc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function D$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ya(e)?.name ?? null;
}
function ya(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Me(t)) return t;
  const n = e.document?.actor;
  return Me(n) ? n : null;
}
function Cn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Me(e) {
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
function fi(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Ln() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class P$ {
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
class N$ {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = x$(t);
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
      reason: O$(r, n.preset)
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
    preset: e.match ? Bt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function x$(e) {
  const t = e.getFlag(d, "automation");
  return Rr(t) ? t : null;
}
function O$(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function At(e) {
  return (t) => t.status === e;
}
class M$ {
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
    const n = $(t.actorName), r = $(t.resource), a = $(pi(t)), o = $(B$(t));
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
      (p) => `<li><strong>${$(p.id)}:</strong> ${$(p.formula)} = ${p.total} <em>(${$(F$(p.intent))})</em>${p.damageType ? ` — ${$(p.damageType)}` : ""}</li>`
    ), u = t.ritualCosts.map(
      (p) => `<li><strong>${$(p.itemName)}:</strong> ${p.circle}º círculo — ${p.amount} ${$(p.resource)} (${$(U$(p.source))})</li>`
    ), m = t.damageInstances.map(
      (p) => `<li><strong>${$(p.targetActorName)}:</strong> bruto ${p.rawAmount}${p.damageType ? ` ${$(p.damageType)}` : ""} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (p) => `<li><strong>${$(p.targetActorName)}:</strong> bruto ${p.rawAmount} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (p) => `<li><strong>${$(p.actorName)}:</strong> ${$(pi(p))} — ${p.before.value}/${p.before.max} &rarr; ${p.after.value}/${p.after.max}</li>`
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
function F$(e) {
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
function pi(e) {
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
function B$(e) {
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
function U$(e) {
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
function q$() {
  const e = new hb(), t = new _A(e), n = new es(new Ji()), r = new ts(new Nr()), a = new TA(new hl()), o = new Ab(), s = new Nb(o), l = new Kb(e), c = new Qb(), u = c.registerMany(
    uu()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new Yb(), y = new Hb(), R = cs(), b = new as(R), p = new N$(
    c
  ), T = new P$(
    p,
    m,
    y
  ), be = new kA(), Y = new M$(be), Ae = new $A(), x = new AA(), te = new yA(
    t,
    s,
    Y,
    Ae
  ), q = new wA(te, Ae), O = new b$(
    q,
    t,
    s,
    n,
    b,
    be,
    x
  );
  return O.addStrategy(
    new zb(
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
const { ApplicationV2: G$ } = foundry.applications.api;
class Mt extends G$ {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${j(Tr)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${j(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${vn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${vn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${vn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function vn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${j(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? j$(n) : V$(t)}
    </section>
  `;
}
function j$(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(z$).join("")}</ol>`;
}
function z$(e) {
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
function V$(e) {
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
const Ft = `${d}.manageRitualPresets`, gi = `__${d}_ritualPresetHeaderControlRegistered`, H$ = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function W$(e) {
  const t = globalThis;
  if (!t[gi]) {
    for (const n of H$)
      Hooks.on(n, (r, a) => {
        K$(r, a, e);
      });
    t[gi] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function K$(e, t, n) {
  Array.isArray(t) && Q$(e) && (Y$(e, n), !t.some((r) => r.action === Ft) && t.push({
    action: Ft,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), pc(e, n);
    }
  }));
}
function Y$(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ft] && (e.options.actions[Ft] = (n) => {
    n.preventDefault(), n.stopPropagation(), pc(e, t);
  }));
}
function Q$(e) {
  if (!game.user?.isGM) return !1;
  const t = gc(e);
  return t ? t.type === "agent" && it(t).length > 0 : !1;
}
function pc(e, t) {
  const n = gc(e);
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
function gc(e) {
  return hi(e.actor) ? e.actor : hi(e.document) ? e.document : null;
}
function hi(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const hc = "data-paranormal-toolkit-ritual-roll-config", ut = "data-paranormal-toolkit-ritual-roll-field", pe = "data-paranormal-toolkit-ritual-roll-action", yi = `__${d}_ritualRollConfigBlockRegistered`, Z$ = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], X$ = [
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
function J$() {
  const e = globalThis;
  if (!e[yi]) {
    ek();
    for (const t of Z$)
      Hooks.on(t, (...n) => {
        tk(n[0], n[1]);
      });
    e[yi] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function ek() {
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
function tk(e, t) {
  const n = gk(e);
  if (!n || n.type !== "ritual") return;
  const r = bk(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  rk(a);
  const o = bc(n), s = Il(n), l = hk(n), c = ak(n, s, o, l);
  uk(c, n, o, l), nk(a, c), ba(c);
}
function nk(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function rk(e) {
  for (const t of Array.from(e.querySelectorAll(`[${hc}]`)))
    t.remove();
}
function ak(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(hc, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(bi("strong", "Paranormal Toolkit")), s.append(bi("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = _c(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(ok(t, r)), u.append(ik(t, r)), u.append(sk(t, r)), a.append(u), a.append(lk(t, n, r)), a.append(ck(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function ok(e, t) {
  const n = on("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(ut, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = YA(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function ik(e, t) {
  const n = on("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(ut, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of X$) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function sk(e, t) {
  const n = on("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(ut, "utilityLabel"), n.append(r), n;
}
function lk(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(Dn("base", "Padrão", e.forms.base.formula, !0, n)), o.append(Dn("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(Dn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function Dn(e, t, n, r, a) {
  const o = on(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(ut, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function ck(e) {
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
function bi(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function uk(e, t, n, r) {
  ze(e, "intent")?.addEventListener("change", () => ba(e)), Ti(e, "system.studentForm")?.addEventListener("change", () => Ai(e, t)), Ti(e, "system.trueForm")?.addEventListener("change", () => Ai(e, t)), e.querySelector(`[${pe}="save"]`)?.addEventListener("click", () => {
    r && dk(e, t, n);
  }), e.querySelector(`[${pe}="clear"]`)?.addEventListener("click", () => {
    r && mk(e, t);
  });
}
async function dk(e, t, n) {
  const r = e.querySelector(`[${pe}="save"]`);
  r?.setAttribute("disabled", "true"), De(e, "Salvando configuração...");
  try {
    const a = fk(e, n);
    await WA(t, a), yc(e, a), De(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), De(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function mk(e, t) {
  const n = e.querySelector(`[${pe}="clear"]`);
  n?.setAttribute("disabled", "true"), De(e, "Limpando configuração...");
  try {
    await KA(t);
    const r = Il(t);
    pk(e, r), yc(e, r), De(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), De(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function yc(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = _c(t) ? "Configurada" : "Rascunho");
}
function fk(e, t) {
  return {
    schemaVersion: 1,
    intent: Ac(ze(e, "intent")?.value),
    damageType: Ri(e, "damageType"),
    utilityLabel: Ri(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Et(e, "formula.base") },
      discente: { formula: Et(e, "formula.discente") },
      verdadeiro: { formula: Et(e, "formula.verdadeiro") }
    }
  };
}
function pk(e, t) {
  we(e, "intent", t.intent), we(e, "damageType", t.damageType ?? ""), we(e, "utilityLabel", t.utilityLabel ?? "Resultado"), we(e, "formula.base", t.forms.base.formula), we(e, "formula.discente", t.forms.discente.formula), we(e, "formula.verdadeiro", t.forms.verdadeiro.formula), ba(e);
}
function ba(e) {
  const t = Ac(ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Ai(e, t) {
  const n = bc(t);
  _i(e, "discente", n.discente), _i(e, "verdadeiro", n.verdadeiro);
}
function _i(e, t, n) {
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
function De(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function bc(e) {
  const t = yk(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function gk(e) {
  return wi(e.item) ? e.item : wi(e.document) ? e.document : null;
}
function hk(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function yk(e) {
  const t = e.system;
  return Ak(t) ? t : {};
}
function Ti(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ze(e, t) {
  return e.querySelector(`[${ut}="${_k(t)}"]`);
}
function Et(e, t) {
  return ze(e, t)?.value.trim() ?? "";
}
function Ri(e, t) {
  const n = Et(e, t);
  return n.length > 0 ? n : null;
}
function we(e, t, n) {
  const r = ze(e, t);
  r && (r.value = n);
}
function Ac(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function _c(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function bk(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function wi(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function Ak(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _k(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let le = null;
Hooks.once("init", () => {
  iu(), Mu(), yd(), rb(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Pa.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Pa.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  le = q$(), le.itemUseIntegration.registerStrategies(), fd(le.conditions), Qu(le), sd(), rd(), cb(), W$(le), J$(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Tr} inicializado.`);
});
function Tk() {
  if (!le)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return le;
}
export {
  Tk as getToolkitServices
};
//# sourceMappingURL=main.js.map
