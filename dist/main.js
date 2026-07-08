const d = "paranormal-toolkit", Rr = "Paranormal Toolkit", Dc = "ordemparanormal";
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
  }) : $r(t) ? A(t) : g({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function vc(e) {
  return $r(e.getFlag(d, "automation"));
}
function $r(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Nc(t.source) && Pc(t.definition);
}
function Pc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every(xc) && (t.ritualForms === void 0 || qc(t.ritualForms)) && (t.conditionApplications === void 0 || Hc(t.conditionApplications));
}
function Nc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function xc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Oc(t);
    case "spendRitualCost":
      return Mc(t);
    case "rollFormula":
      return Fc(t);
    case "modifyResource":
      return Bc(t);
    case "chatCard":
      return Uc(t);
    default:
      return !1;
  }
}
function Oc(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ni(t);
}
function Mc(e) {
  return e.type === "spendRitualCost";
}
function Fc(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || Jc(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function Bc(e) {
  const t = e;
  return t.type === "modifyResource" && xi(t.actor) && Zc(t.resource) && Xc(t.operation) && Ni(t) && (t.damageType === void 0 || t.damageType === null || $(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Uc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function qc(e) {
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
  return (t.label === void 0 || $(t.label)) && (t.extraCost === void 0 || tu(t.extraCost)) && (t.rollFormulaOverrides === void 0 || ru(t.rollFormulaOverrides)) && (t.notes === void 0 || nu(t.notes)) && (t.targeting === void 0 || Gc(t.targeting));
}
function Gc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Vc(t.mode) && $(t.label) && (t.optionLabel === void 0 || $(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || zc(t.template));
}
function zc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || Ea(t.distance)) && (t.width === void 0 || t.width === null || Ea(t.width));
}
function Vc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Hc(e) {
  return Array.isArray(e) && e.every(Wc);
}
function Wc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return $(t.id) && xi(t.actor) && $(t.conditionId) && (t.label === void 0 || $(t.label)) && (t.duration === void 0 || t.duration === null || Yc(t.duration)) && (t.source === void 0 || $(t.source)) && (t.actionSectionId === void 0 || $(t.actionSectionId)) && (t.actionSectionTitle === void 0 || $(t.actionSectionTitle)) && (t.executedLabel === void 0 || $(t.executedLabel)) && (t.applyOnResistance === void 0 || Kc(t.applyOnResistance));
}
function Kc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Yc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || eu(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Qc(t.expiry));
}
function Qc(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ni(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function xi(e) {
  return e === "self" || e === "target";
}
function Zc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Xc(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Jc(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function eu(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function tu(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Ea(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function nu(e) {
  return Array.isArray(e) && e.every($);
}
function ru(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => $(t) && $(n)
  );
}
function wr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Ia);
    if (iu(t))
      return Array.from(t).filter(Ia);
  }
  return [];
}
function au(e) {
  return wr(e)[0] ?? null;
}
function ou(e) {
  return wr(e).find(vc) ?? null;
}
function iu(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ia(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function st(e) {
  return wr(e).filter((t) => t.type === "ritual");
}
function Oi(e) {
  return st(e)[0] ?? null;
}
function su(e) {
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
      const r = e.automationRegistry.findForItem(n).map(La);
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
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: La(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ca(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ca(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = We("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = mt(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Ca(e) {
  const t = We("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = st(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Sa(t);
  const r = Sa(t, n.length);
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
    r.applied.push(lu(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), cu(r), r;
}
async function xn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function lu(e, t, n) {
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
function Sa(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function cu(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function La(e) {
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
      ...uu(e.sourceActor),
      token: e.sourceToken
    },
    item: du(e.item),
    targets: e.targets.map(mu),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Da(e.rollRequests, Mi),
    rolls: Da(e.rolls, fu),
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
function uu(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function du(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function mu(e) {
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
function fu(e) {
  return {
    ...Mi(e),
    total: e.total
  };
}
function Da(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function pu(e) {
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
    gu(a.error);
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
  const t = ot.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function gu(e) {
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
function hu() {
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
function yu() {
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
const Fi = "ritual.costOnly", Bi = "ritual.simpleHealing", bu = "ritual.eletrocussao", Au = "ritual.definhar", Ui = "ritual.simpleDamage", qi = "generic.simpleHealing", Er = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function _u() {
  return [
    Tu(),
    Ru(),
    $u(),
    wu(),
    ku(),
    Eu()
  ];
}
function Tu() {
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
function Ru() {
  return {
    id: Bi,
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
    automation: ji(),
    itemPatch: Su()
  };
}
function $u() {
  return {
    id: bu,
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
    automation: Iu(),
    itemPatch: Du()
  };
}
function wu() {
  return {
    id: Au,
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
    automation: Cu(),
    itemPatch: Lu()
  };
}
function ku() {
  return {
    id: Ui,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Ir()
  };
}
function Eu() {
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
function ji(e = "2d8+2") {
  return Gi(
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
function Iu() {
  return {
    ...Ir("3d6", {
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
function Cu() {
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
function Ir(e = "1d8", t = {}) {
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
function Su() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Er,
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
function Lu() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: Er,
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
function Du() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Er,
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
function Cr() {
  return Array.from(game.user?.targets ?? []).map(zi);
}
function zi(e) {
  return {
    tokenId: ke(e.id),
    actorId: ke(e.actor?.id),
    sceneId: ke(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Vi() {
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
function vu(e) {
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
        if (!xu(t, n)) {
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
      if (!va(t)) {
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
      if (!va(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Ui);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Ir(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = ae("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = oe(t);
      n && await Pu(e, t, n);
    }
  };
}
async function Pu(e, t, n) {
  const r = it(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Vi(),
    item: n,
    targets: Cr()
  });
  if (!a.ok) {
    Nu(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", de(a.value.context));
}
function Nu(e) {
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
function xu(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function va(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ou = ["strict", "open"], Hi = "strict";
function Mu(e) {
  return Ou.includes(e) ? e : Hi;
}
function Fu(e) {
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
const Bu = ["disabled", "ask", "automatic"], Uu = ["buttons", "confirm"], Wi = "ask";
function qu(e) {
  return typeof e == "string" && Bu.includes(e);
}
function ju(e) {
  return typeof e == "string" && Uu.includes(e);
}
function Gu(e) {
  return qu(e) ? e : ju(e) ? "ask" : Wi;
}
const zu = ["keep", "replace"], Vu = ["manual", "assisted"], Ki = "keep", Yi = "assisted", Hu = !0, L = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Wu() {
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
    default: Hu
  }), game.settings.register(d, L.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Pa() {
  const e = Gu(game.settings.get(d, L.executionMode)), t = Zi(game.settings.get(d, L.systemCardMode)), n = Xi(game.settings.get(d, L.damageResolutionMode)), r = Sr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Qi()
  };
}
function Ku() {
  return Zi(game.settings.get(d, L.systemCardMode));
}
function Yu() {
  return Xi(game.settings.get(d, L.damageResolutionMode));
}
function Sr() {
  return Mu(game.settings.get(d, L.resistanceGateMode));
}
function Qi() {
  return game.settings.get(d, L.ritualCastingCheckEnabled) === !0;
}
async function ie(e) {
  await game.settings.set(d, L.executionMode, e);
}
function Zi(e) {
  return zu.includes(e) ? e : Ki;
}
function Xi(e) {
  return Vu.includes(e) ? e : Yi;
}
function Qu(e) {
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
const Zu = [
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
function Xu(e) {
  return {
    phases() {
      return Zu;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = un("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ou(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Na(e, t, n);
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
      if (!td(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = ed(n) ?? un("Nenhum ator encontrado para executar automação do item.");
      r && await Na(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = un("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = au(t);
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
async function Na(e, t, n) {
  const r = it(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Vi(),
    item: n,
    targets: Cr()
  });
  if (!a.ok) {
    Ju(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", de(a.value.context));
}
function Ju(e) {
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
function ed(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function td(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function nd(e) {
  const t = pu(e), n = su(e), r = vu(e), a = Xu(e), o = yu(), s = Qu(e);
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
function rd(e) {
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
      const r = xa();
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
      return ad(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = xa();
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
      return od(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function xa() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function ad(e) {
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
function od(e) {
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
function id(e) {
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
    conditions: rd(e.conditions),
    debug: nd(e),
    hooks: Tt
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class Oa {
  static isSupportedSystem() {
    return game.system.id === Dc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function sd() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Ee(t.id),
    actorId: Ee(t.actor?.id),
    sceneId: Ee(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Ji() {
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
function ld(e, t = Ji()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function cd(e) {
  if (!md(e)) return null;
  const t = e.getFlag(d, "workflow");
  return dd(t) ? t : null;
}
function ud() {
  return `flags.${d}.workflow`;
}
function Ma(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${d}`), n = foundry.utils.getProperty(e, `_source.flags.${d}`);
  return t !== void 0 || n !== void 0;
}
function Fa(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Mn(t) || Mn(n);
}
function dd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function md(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function Ee(e) {
  return Mn(e) ? e : null;
}
function Mn(e) {
  return typeof e == "string" && e.length > 0;
}
function fd() {
  const e = (t, n) => {
    pd(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function pd(e, t) {
  const n = cd(e);
  if (!n || n.targets.length === 0) return;
  const r = hd(t);
  if (!r || r.querySelector(`.${d}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(gd(n));
}
function gd(e) {
  const t = document.createElement("section");
  t.classList.add(`${d}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Ba("Origem", e.source.name)), t.append(Ba("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Ba(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${d}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function hd(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function yd() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!bd(r) || !Ad(e) || Ma(e) || Ma(t)) return;
    const a = sd();
    if (a.length === 0 || !Fa(e) && !Fa(t)) return;
    const o = Ji();
    e.updateSource({
      [ud()]: ld(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function bd(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ad(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Ua = !1, dn = !1, mn = !1, gt = null;
const _d = 1e3, Td = 750, Rd = 1e3;
function $d(e) {
  Ua || (Hooks.on("combatTurnChange", (t) => {
    kd(e, qa(t));
  }), Hooks.on("deleteCombat", (t) => {
    Ed(e, qa(t));
  }), Ua = !0, wd(e));
}
function wd(e) {
  jt() && (dn || (dn = !0, globalThis.setTimeout(() => {
    dn = !1, Lr(e, "ready");
  }, _d)));
}
function kd(e, t) {
  jt() && t && (gt && globalThis.clearTimeout(gt), gt = globalThis.setTimeout(() => {
    gt = null, Lr(e, "combat-turn-change", t);
  }, Td));
}
function Ed(e, t) {
  jt() && t && (mn || (mn = !0, globalThis.setTimeout(() => {
    mn = !1, Lr(e, "combat-deleted", t);
  }, Rd)));
}
async function Lr(e, t, n) {
  if (jt())
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
function jt() {
  return game.user?.isGM === !0;
}
function qa(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const es = {
  enabled: "dice.animations.enabled"
};
function Id() {
  game.settings.register(d, es.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Cd() {
  return {
    enabled: game.settings.get(d, es.enabled) === !0
  };
}
const Gt = "chatCard", ja = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Sd = `.${i}__title`, ts = `.${i}__header`, Ld = `.${i}__roll-card`, Dd = `.${i}__roll-meta`, vd = `.${i}__roll-meta-pill`, Dr = `.${i}__resistance`, Pd = `.${i}__resistance-header`, ns = `.${i}__resistance-description`, zt = `.${i}__resistance-roll-button`, rs = `.${i}__resistance-roll-result`, Ga = `${i}__resistance-content`, as = `.${i}__workflow-section`, os = `.${i}__workflow-roll`, vr = `${i}__workflow-roll--dice-open`, Pr = `.${i}__workflow-roll-formula`, Nr = `${i}__workflow-roll-formula--toggle`, Vt = `.${i}__workflow-dice-tray`, Nd = `.${i}__roll-detail-toggle`, xd = `.${i}__roll-detail-list`, Od = `.${i}__ritual-element-badge`, Md = `.${i}__ritual-metadata`, Fd = "casting-backlash", Bd = "data-paranormal-toolkit-action-section", Ud = "data-paranormal-toolkit-prompt-id", qd = "data-paranormal-toolkit-pending-id", za = "data-paranormal-toolkit-casting-backlash-enhanced", Va = `.${i}`, jd = `.${i}__workflow-section--casting`, Gd = `.${i}__workflow-section-header`, zd = `.${i}__workflow-notes`, Vd = `[${Bd}="${Fd}"]`, Ha = `${i}__workflow-section-title-row`, Hd = `${i}__workflow-section-header--casting-backlash`, is = `${i}__casting-backlash-button`;
function Wd(e) {
  for (const t of Kd(e))
    Yd(t), em(t);
}
function Kd(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Va) && t.add(e);
  for (const n of e.querySelectorAll(Va))
    t.add(n);
  return Array.from(t);
}
function Yd(e) {
  const t = e.querySelector(Vd);
  if (!t) return;
  const n = Qd(t);
  if (!n) return;
  const r = e.querySelector(`${jd} ${Gd}`);
  r && (r.classList.add(Hd), Zd(r), Xd(n), r.append(n), t.remove());
}
function Qd(e) {
  return e.querySelector(
    `button[${qd}], button[${Ud}]`
  );
}
function Zd(e) {
  const t = e.querySelector(`:scope > .${Ha}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Ha);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(is) || n.append(a));
  return n;
}
function Xd(e) {
  if (e.getAttribute(za) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Jd(t, e.disabled);
  e.classList.add(is), e.setAttribute(za, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Jd(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function em(e) {
  for (const t of e.querySelectorAll(zd)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function tm(e) {
  for (const t of Array.from(e.querySelectorAll(as)))
    for (const n of Array.from(t.querySelectorAll(`${Nd}, ${xd}`)))
      n.remove();
}
const nm = {
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
}, rm = new Set(
  Object.values(nm)
), am = {
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
function om(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = im(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = am[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : rm.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ss(e) {
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
function im(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class ls {
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
      const y = sm(m, u);
      if (!y.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const R = om(m.damageType);
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
          lm(y.id, m, R.value)
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
        for (const T of um(b.conditions))
          l.add(T);
        const p = cm(b.newPV);
        p !== null && (c = p), s.push({
          id: y.id,
          label: m.label ?? ss(R.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: Wa(b.finalDamage, y.amount),
          blocked: Wa(b.blocked, 0),
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
function sm(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function lm(e, t, n) {
  return {
    id: e,
    label: t.label ?? ss(n),
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
function Wa(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function cm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function um(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class xr {
  async rollResistance(t) {
    const n = await mm(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? fe(t.skill),
      roll: n,
      formula: pm(n),
      total: gm(n),
      diceBreakdown: hm(n)
    };
  }
  getSkillLabel(t) {
    return fe(t);
  }
}
async function dm(e, t) {
  return new xr().rollResistance({ actor: e, skill: t });
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
async function mm(e, t) {
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
  return fm(r);
}
function fm(e) {
  return Ka(e) ? e : Array.isArray(e) ? e.find(Ka) ?? null : null;
}
function Ka(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function pm(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function gm(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function hm(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(ym);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function ym(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class cs {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class us {
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
function bm(e, t) {
  const n = km(e?.rounds);
  if (!n)
    return Ya(null);
  const r = e?.anchor ?? ds(t);
  if (!r)
    return {
      ...Ya(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Am(),
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
function ds(e) {
  const t = Em();
  if (!t?.id || !ms(t.round)) return null;
  const n = $m(t), r = _m(e, n) ?? Rm(t), a = X(r?.id), o = Cm(r?.initiative), s = Tm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Im()
  };
}
function Am() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Ya(e) {
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
function _m(e, t) {
  return e?.id ? t.find((n) => wm(n) === e.id) ?? null : null;
}
function Tm(e, t, n) {
  const r = X(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Sm(e.turn) ? e.turn : null;
}
function Rm(e) {
  return Rt(e.combatant) ? e.combatant : null;
}
function $m(e) {
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
function wm(e) {
  return X(e.actor?.id) ?? X(e.actorId) ?? X(e.token?.actor?.id) ?? X(e.token?.actorId) ?? X(e.document?.actor?.id) ?? X(e.document?.actorId);
}
function km(e) {
  return ms(e) ? Math.trunc(e) : null;
}
function Em() {
  return game.combat ?? null;
}
function Im() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Rt(e) {
  return !!(e && typeof e == "object");
}
function X(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Cm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ms(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Sm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class fs {
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
    if (!Bm(r))
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = bm(t.duration, r), s = Lm(a, t, o), c = t.refreshExisting ?? !0 ? Um(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), A(Qa(r, a, c.id ?? null, !1, !0, o));
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
      return A(Qa(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = gs(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Za(n, s) === "deleted" && (o += 1);
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
    const n = Gm(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = Or(s);
      a += l.length;
      for (const c of l) {
        if (!Pm(c, t)) continue;
        const u = ps(c);
        try {
          await Za(s, c) === "deleted" && (o += 1);
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
function Lm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Jm(),
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
    duration: Dm(n.duration),
    start: vm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function Dm(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function vm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Xm(),
    ...e
  };
}
function Qa(e, t, n, r, a, o) {
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
function Pm(e, t) {
  const n = ps(e);
  if (!n.conditionId || !Nm(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Zm();
  return n.durationMode === "combatantTurn" || xm(n) ? Mm(n, r) : Om(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !F(n.startRound) || !F(n.requestedRounds) || !F(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Nm(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && F(e.requestedRounds);
}
function xm(e) {
  return !!(e.combatDurationApplied && F(e.requestedRounds) && F(e.startRound) && (e.startCombatantId || Ct(e.startTurn)));
}
function Om(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Mm(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !F(e.startRound) || !F(e.requestedRounds) || !F(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Fm(t);
  return e.startCombatantId ? r === e.startCombatantId : Ct(e.startTurn) && Ct(t.turn) ? t.turn === e.startTurn : !1;
}
function Fm(e) {
  return Ie(e.combatant?.id);
}
function ps(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: $t(e, "conditionId"),
    requestedRounds: Xa(e, "requestedRounds") ?? Ke(t.value) ?? Ke(t.rounds),
    combatDurationApplied: fn(e, "combatDurationApplied"),
    combatId: $t(e, "combatId") ?? Ie(n.combat) ?? Ie(t.combat),
    startCombatantId: $t(e, "startCombatantId") ?? Ie(n.combatant),
    startInitiative: Wm(e, "startInitiative") ?? hs(n.initiative),
    startRound: Xa(e, "startRound") ?? Ke(n.round) ?? Ke(t.startRound),
    startTurn: Hm(e, "startTurn") ?? Fn(n.turn) ?? Fn(t.startTurn),
    expiryEvent: Km(e, "expiryEvent") ?? ys(t.expiry),
    durationMode: Ym(e, "durationMode"),
    deleteOnExpire: fn(e, "deleteOnExpire"),
    expiresWithCombat: fn(e, "expiresWithCombat")
  };
}
function Bm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Um(e, t) {
  return gs(e, t)[0] ?? null;
}
function gs(e, t) {
  return Or(e).filter((n) => Vm(n) === t);
}
async function Za(e, t) {
  const n = t.id ?? null, r = n ? qm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (jm(a)) return "missing";
    throw a;
  }
}
function qm(e, t) {
  return Or(e).find((n) => n.id === t) ?? null;
}
function jm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Gm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      ht(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    ht(e, n);
  });
  for (const n of zm())
    ht(e, n.actor), ht(e, n.document?.actor);
  return Array.from(e.values());
}
function ht(e, t) {
  if (!Qm(t)) return;
  const r = Ie(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function zm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Or(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Vm(e) {
  return $t(e, "conditionId");
}
function $t(e, t) {
  return Ie(he(e, t));
}
function Xa(e, t) {
  return Ke(he(e, t));
}
function Hm(e, t) {
  return Fn(he(e, t));
}
function Wm(e, t) {
  return hs(he(e, t));
}
function Km(e, t) {
  return ys(he(e, t));
}
function Ym(e, t) {
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
function hs(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ys(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Qm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Zm() {
  return game.combat ?? null;
}
function Xm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function F(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ct(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Jm() {
  return game.user?.id ?? null;
}
const ef = "icons/svg/downgrade.svg", tf = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? ef,
    description: tf,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const nf = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), rf = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), af = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), of = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), sf = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), lf = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), cf = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), uf = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), df = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), mf = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), ff = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), pf = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), gf = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), hf = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), yf = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), bf = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Af = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), _f = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Tf = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Rf = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), $f = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), wf = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), kf = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Ef = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), If = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Cf = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Sf = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Lf = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Df = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), vf = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Pf = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Nf = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), xf = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Of = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Mf = [
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
  Of
];
class Ff {
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
    return Array.from(this.definitions.values()).map(Ja);
  }
  get(t) {
    const n = this.lookup.get(eo(t)), r = n ? this.definitions.get(n) : null;
    return r ? A(Ja(r)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = eo(t);
    r && this.lookup.set(r, n);
  }
}
function bs() {
  return new Ff(Mf);
}
function Ja(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function eo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Pe(e) {
  return e.applyOnResistance ?? "failure";
}
function As(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function _s(e, t) {
  const n = Pe(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Ts(e) {
  const t = Pe(e);
  return t === "failure" || t === "success";
}
function Bf(e, t, n, r) {
  const a = e.filter((c) => _s(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Pe(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Uf = {
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
}, qf = {
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
function jf(e) {
  return $s(e, Uf, !1);
}
function Gf(e) {
  return $s(e, qf, !e.allowsSuccessfulResistance);
}
function Fe(e) {
  return e.kind === "waiting-resistance";
}
function Rs(e) {
  return e.kind === "resisted";
}
function $s(e, t, n) {
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
const Ye = "data-paranormal-toolkit-prompt-id", zf = "data-paranormal-toolkit-resistance-roll-result", Vf = "Conjuração DT";
function Hf(e) {
  const t = e.querySelector(zt)?.getAttribute(zf), n = et(t);
  if (n !== null) return n;
  const r = e.querySelector(rs)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return et(a?.[1] ?? null);
}
function Mr(e) {
  const t = ws(e), n = Yf(t);
  if (n !== null) return n;
  const r = Qf(t);
  return r !== null ? r : Zf(e);
}
function Wf(e) {
  const t = ws(e);
  return t ? {
    actorId: pn(t.actorId),
    itemId: pn(t.itemId),
    itemName: pn(t.itemName)
  } : null;
}
function Kf(e) {
  const t = e.getAttribute(Ye);
  if (!t) return null;
  const n = ks(e), r = Es(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Ht(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function J(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Bn(e) {
  return J(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Yf(e) {
  const t = Jf(e);
  return t.length === 0 ? null : et(ep(t, Vf));
}
function Qf(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : to(r, ["system", "ritual", "DT"]) ?? to(r, ["system", "ritual", "dt"]);
}
function Zf(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return et(n?.[1] ?? null);
}
function ws(e) {
  const t = Xf(e);
  if (!t) return null;
  const n = ks(e), r = Es(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Ht(o) ? o.pendingId === t : !1) ?? null;
}
function Xf(e) {
  return (e.closest(`[${Ye}]`) ?? e.querySelector(`[${Ye}]`) ?? e.parentElement?.querySelector(`[${Ye}]`) ?? null)?.getAttribute(Ye) ?? null;
}
function ks(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return tp(a) ? a : null;
}
function Es(e) {
  const t = e?.getFlag?.(d, Gt);
  return Ht(t) ? t : null;
}
function Jf(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function ep(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function to(e, t) {
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
function tp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Ht(e) {
  return !!(e && typeof e == "object");
}
function pn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Wt(e) {
  return Is({
    hasResistance: !!e.querySelector(Dr),
    difficulty: Mr(e),
    resistanceTotal: Hf(e)
  });
}
function np(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Is({
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
function Is(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Fu(e)
  };
}
function ye() {
  return game.user?.isGM === !0;
}
function pe() {
  return ye();
}
function rp(e) {
  const t = qt(e.resistanceGateMode, e.resistanceState), n = ap(e.resistanceState, e.hasDamage), r = op(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = jf({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Gf({
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
function ap(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function op(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Fr(e) {
  const t = e.isGM ?? pe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: rp({
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
function ip(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = lp(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function sp(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function lp(e, t) {
  const n = cp(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of up(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function cp(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function up(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? no(e, "highest") : n.includes("kl") ? no(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function no(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const dp = "data-paranormal-toolkit-resistance-skill", mp = "data-paranormal-toolkit-resistance-skill-label", Cs = "pending", Br = "success", Ur = "failure", Ss = "rolled";
function fp(e) {
  const t = bp(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? hp(e.damageSection) : null, r = ro(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = pp(e.rollCard).map((o, s) => {
    const l = gp(o, s), c = e.resistanceResults.get(l) ?? null, u = $p(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, y = e.effectApplications.get(l) ?? null, R = np({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Ip(u)
    }).state, b = ro(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      As(R)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: y,
      effect: b,
      assistedActions: Fr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: R,
        damage: n,
        effect: b,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!y,
        effectCanApplyOnSuccessfulResistance: b?.applyOnResistance === "success" || b?.applyOnResistance === "always",
        effectRequiresResolvedResistance: b ? Ts(b) : !1
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
function pp(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && Ls(a) !== "nenhum alvo") : [];
}
function gp(e, t) {
  return `${Ls(e)}:${t}`;
}
function hp(e) {
  const t = wp(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Ep(e),
    formula: kp(e) ?? "—",
    total: t,
    diceBreakdown: sp(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function ro(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: yp(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Pe(o)
  } : null;
}
function yp(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function bp(e, t) {
  const n = Ap(t), r = _p(n)?.textContent?.trim(), a = Tp(n), o = a?.getAttribute(dp) ?? null, s = a?.getAttribute(mp) ?? (o ? fe(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: Rp(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: Mr(e)
  };
}
function Ap(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function _p(e) {
  return qr(e, `.${i}__resistance-description`);
}
function Tp(e) {
  return qr(e, zt);
}
function Rp(e) {
  return qr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function qr(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function $p(e, t) {
  return e ? t === null ? Ss : e.total >= t ? Br : Ur : Cs;
}
function wp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function kp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Ep(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Ls(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Ip(e) {
  return e === Br ? "succeeded" : e === Ur ? "failed" : "pending";
}
function Ds(e) {
  if (!e) return null;
  const t = e.actorId ? Lp(e.actorId) : null, n = t ? Cp(t, e.itemId, e.itemName) : null;
  return n || Sp(e.itemId, e.itemName);
}
function Cp(e, t, n) {
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
function Sp(e, t) {
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
function Lp(e) {
  const n = game.actors?.get?.(e);
  return Dp(n) ? n : null;
}
function Dp(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ce(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function St(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function jr(e) {
  const t = gn(e);
  if (!t) return null;
  const n = vp().filter((o) => gn(Pp(o)) === t).map((o) => vs(o)).find(Xe) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Xe(o) && gn(o.name) === t);
  return Xe(a) ? a : null;
}
function vp() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Pp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : vs(e)?.name ?? null;
}
function vs(e) {
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
async function Ps(e) {
  const t = Mp();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Np(e)
  });
}
function Np(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${wt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = xp(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${wt(e.conditions.join(", "))}</li>` : "";
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
function xp(e) {
  const t = Op(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${wt(a)}</li>`;
}
function Op(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = ao(n?.value);
  return r === null ? null : {
    value: r,
    max: ao(n?.max)
  };
}
function ao(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Mp() {
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
async function Fp(e) {
  await Ps(Bp(e));
}
function Bp(e) {
  if (Up(e)) return e;
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
function Up(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Ns(e) {
  return e.mode, `✓ ${xs(e.inputAmount)} PV`;
}
function qp(e) {
  const t = xs(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function xs(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class jp {
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
class Gp {
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
class zp {
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
const Vp = `.${i}__actions`, Gr = `.${i}__actions-title`, Ne = `.${i}__button`, Hp = "data-paranormal-toolkit-action-section", Wp = `${i}__button--executed`, Kp = "data-paranormal-toolkit-executed-label";
function Os(e) {
  return J(e.querySelector(Gr)?.textContent);
}
function Yp(e, t) {
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
function zr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function be(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function Ms(e) {
  const t = Qp(e.difficulty);
  if (t === null) return null;
  const n = oo(e.skillLabel) ?? "Resistência", r = oo(e.description), a = Zp(r, n), o = Xp(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function Qp(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function oo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function Zp(e, t) {
  if (!e) return null;
  const n = io(e), r = io(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function Xp(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function io(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const yt = "data-paranormal-toolkit-prompt-id", Fs = "multiTargetResistanceResults", Bs = "multiTargetDamageApplications", Us = "multiTargetEffectApplications";
function Jp(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Fs];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    ig(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function eg(e, t) {
  await Vr(e, Fs, t.targetId, t);
}
function tg(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Bs];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    sg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function ng(e, t) {
  await Vr(
    e,
    Bs,
    t.targetId,
    t
  );
}
function rg(e) {
  const t = /* @__PURE__ */ new Map(), r = Kt(e)?.[Us];
  if (!U(r)) return t;
  for (const [a, o] of Object.entries(r))
    cg(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function ag(e, t) {
  await Vr(
    e,
    Us,
    t.targetId,
    t
  );
}
function og(e) {
  const t = Kt(e);
  return t ? {
    actorId: hn(t.actorId),
    itemId: hn(t.itemId),
    itemName: hn(t.itemName)
  } : null;
}
async function Vr(e, t, n, r) {
  const a = qs(e);
  if (!a) return;
  const o = js(e), s = Gs(o);
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
  const t = qs(e);
  if (!t) return null;
  const n = js(e), r = Gs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => U(o) ? o.pendingId === t : !1) ?? null;
}
function qs(e) {
  return (e.closest(`[${yt}]`) ?? e.querySelector(`[${yt}]`) ?? e.parentElement?.querySelector(`[${yt}]`) ?? null)?.getAttribute(yt) ?? null;
}
function js(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return ug(a) ? a : null;
}
function Gs(e) {
  const t = e?.getFlag?.(d, Gt);
  return U(t) ? t : null;
}
function ig(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function sg(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && lg(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function lg(e) {
  return e === "normal" || e === "half";
}
function cg(e) {
  return U(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function hn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ug(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function U(e) {
  return !!(e && typeof e == "object");
}
const dg = "data-paranormal-toolkit-resistance-skill", mg = "data-paranormal-toolkit-resistance-skill-label", Un = "data-paranormal-toolkit-multi-target-section", Hr = "data-paranormal-toolkit-multi-target-damage-info", zs = "data-paranormal-toolkit-multi-target-effect-info", Vs = "data-paranormal-toolkit-multi-target-toggle", Hs = "data-paranormal-toolkit-multi-target-details", x = "data-paranormal-toolkit-multi-target-target", fg = "data-paranormal-toolkit-multi-target-state", qn = "data-paranormal-toolkit-multi-target-roll-total", jn = "data-paranormal-toolkit-multi-target-roll-formula", kt = "data-paranormal-toolkit-multi-target-roll-dice", Gn = "data-paranormal-toolkit-multi-target-roll-skill", zn = "data-paranormal-toolkit-multi-target-roll-skill-label", Vn = "data-paranormal-toolkit-multi-target-roll-target-name", Hn = "data-paranormal-toolkit-multi-target-roll-rolled-at", Wn = "data-paranormal-toolkit-multi-target-damage-mode", Kn = "data-paranormal-toolkit-multi-target-damage-input-amount", so = "data-paranormal-toolkit-multi-target-damage-final-amount", lo = "data-paranormal-toolkit-multi-target-damage-blocked", Yn = "data-paranormal-toolkit-multi-target-damage-target-name", Qn = "data-paranormal-toolkit-multi-target-damage-applied-at", Zn = "data-paranormal-toolkit-multi-target-effect-condition-id", Xn = "data-paranormal-toolkit-multi-target-effect-condition-label", Jn = "data-paranormal-toolkit-multi-target-effect-effect-id", er = "data-paranormal-toolkit-multi-target-effect-created", tr = "data-paranormal-toolkit-multi-target-effect-refreshed", nr = "data-paranormal-toolkit-multi-target-effect-target-name", rr = "data-paranormal-toolkit-multi-target-effect-applied-at", pg = new fs(bs()), gg = new cs(new ls()), hg = new us(new xr()), yg = new zp(hg), bg = new jp(gg), Ag = new Gp(pg), _g = Cs, Be = Br, ct = Ur, Tg = Ss;
function Rg(e) {
  const t = Ws(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Dg(e);
  const n = vg(e.rollCard, t), r = Pg(e.rollCard, t);
  !n && r && gh(e.rollCard, r, e.effectSection);
  const a = Bg(e.rollCard);
  return Qs(a, t), mh(
    e.rollCard,
    a,
    Ng(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && hh(e.rollCard, r, a), !0;
}
function Ws(e) {
  return fp({
    ...e,
    resistanceResults: kg(e.rollCard),
    damageApplications: Eg(e.rollCard),
    effectApplications: Ig(e.rollCard),
    resolveTargetConditionApplication: $g,
    resistanceGateMode: Kr()
  });
}
function $g(e, t, n) {
  const r = og(e), a = Ds(r);
  if (!a) return null;
  const o = it(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = wg(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function wg(e, t, n) {
  const r = Bf(
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
function kg(e) {
  const t = Jp(e);
  for (const [n, r] of Lg(e))
    t.set(n, r);
  return t;
}
function Eg(e) {
  const t = tg(e);
  for (const [n, r] of Sg(e))
    t.set(n, r);
  return t;
}
function Ig(e) {
  const t = rg(e);
  for (const [n, r] of Cg(e))
    t.set(n, r);
  return t;
}
function Cg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = n.getAttribute(Zn), o = n.getAttribute(Xn), s = n.getAttribute(Jn), l = mo(n.getAttribute(er)), c = mo(n.getAttribute(tr)), u = n.getAttribute(nr), m = n.getAttribute(rr);
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
function Sg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = n.getAttribute(Wn), o = il(n.getAttribute(Kn)), s = n.getAttribute(Yn), l = n.getAttribute(Qn);
    !r || !Ah(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Lg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${x}]`)) {
    const r = n.getAttribute(x), a = il(n.getAttribute(qn)), o = n.getAttribute(jn), s = n.getAttribute(Gn), l = n.getAttribute(zn), c = n.getAttribute(Vn), u = n.getAttribute(Hn);
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
function Dg(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function vg(e, t) {
  if (!t.damage)
    return Ks(e)?.remove(), null;
  const n = xg(e);
  return Og(n, t.damage), Fg(e, n), n;
}
function Pg(e, t) {
  if (!t.effect)
    return ol(e)?.remove(), null;
  const n = fh(e);
  return ph(n, t.effect), n;
}
function Ng(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : lt(e, "Conjuração");
}
function xg(e) {
  const t = Ks(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Hr, "true"), n;
}
function Ks(e) {
  return e.querySelector(`[${Hr}="true"]`);
}
function Og(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Ys(t.formula, t.total, t.diceBreakdown));
}
function Ys(e, t, n, r = !1) {
  const a = ip({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Mg(a, r), a;
}
function Mg(e, t) {
  const n = e.querySelector(Vt), r = e.querySelector(Pr);
  if (!n || !r) return;
  e.classList.toggle(vr, t), n.hidden = !t, r.classList.add(Nr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Fg(e, t) {
  const n = lt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Bg(e) {
  const t = e.querySelector(`[${Un}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Un, "true"), n;
}
function Qs(e, t) {
  const n = Ug(e), r = jg(t.resistance), a = [qg(t)];
  r && a.push(r), a.push(Vg(t, n)), e.replaceChildren(...a);
}
function Ug(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${x}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(x)).filter(bh)
  );
}
function qg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = zg(e.targets), t.append(n, r), t;
}
function jg(e) {
  const t = Ms({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), Gg(n, t), n;
}
function Gg(e, t) {
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
function zg(e) {
  const t = e.length, n = e.filter((l) => l.state === ct).length, r = e.filter((l) => l.state === Be).length, a = e.filter((l) => l.state === _g).length, o = e.filter((l) => l.state === Tg).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Vg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Hg(r, e, t.has(r.id)));
  return n;
}
function Hg(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(x, e.id), r.setAttribute(fg, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Zs(r, e.resistanceResult), Xs(r, e.damageApplication), Js(r, e.effectApplication);
  const a = Wg(e, t, r), o = lh(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    uo(s.target) || co(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || uo(s.target) || (s.preventDefault(), co(r));
  }), r.append(a, o), r;
}
function Zs(e, t) {
  if (!t) {
    e.removeAttribute(qn), e.removeAttribute(jn), e.removeAttribute(kt), e.removeAttribute(Gn), e.removeAttribute(zn), e.removeAttribute(Vn), e.removeAttribute(Hn);
    return;
  }
  e.setAttribute(qn, String(t.total)), e.setAttribute(jn, t.formula), e.setAttribute(Gn, t.skill), e.setAttribute(zn, t.skillLabel), e.setAttribute(Vn, t.targetName), e.setAttribute(Hn, t.rolledAt), t.diceBreakdown ? e.setAttribute(kt, t.diceBreakdown) : e.removeAttribute(kt);
}
function Xs(e, t) {
  if (!t) {
    e.removeAttribute(Wn), e.removeAttribute(Kn), e.removeAttribute(so), e.removeAttribute(lo), e.removeAttribute(Yn), e.removeAttribute(Qn);
    return;
  }
  e.setAttribute(Wn, t.mode), e.setAttribute(Kn, String(t.inputAmount)), e.removeAttribute(so), e.removeAttribute(lo), e.setAttribute(Yn, t.targetName), e.setAttribute(Qn, t.appliedAt);
}
function Js(e, t) {
  if (!t) {
    e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Jn), e.removeAttribute(er), e.removeAttribute(tr), e.removeAttribute(nr), e.removeAttribute(rr);
    return;
  }
  e.setAttribute(Zn, t.conditionId), e.setAttribute(Xn, t.conditionLabel), e.setAttribute(Jn, t.effectId ?? ""), e.setAttribute(er, String(t.created)), e.setAttribute(tr, String(t.refreshed)), e.setAttribute(nr, t.targetName), e.setAttribute(rr, t.appliedAt);
}
function Wg(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Kg(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Yg(e, t.resistance);
  Jg(l, n, e, t);
  const c = sh(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), rl(u, [
    el(e, t, "compact"),
    nl(e, t, "compact")
  ]), r.append(a, u), r;
}
function Kg(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Yg(e, t) {
  if (!ye())
    return Qg(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Xg(e, t)), t?.skill && (n.setAttribute(dg, t.skill), n.setAttribute(mg, t.skillLabel ?? fe(t.skill))), !t?.skill)
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
function Qg(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Zg(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Be ? "✓" : e.state === ct ? "✕" : "", n.append(r, a), n;
}
function Zg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Be ? "sucesso" : e.state === ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Xg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Be ? "sucesso" : e.state === ct ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Jg(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !ye() || e.addEventListener("click", (a) => {
    a.stopPropagation(), eh(t, e, n, r);
  });
}
async function eh(e, t, n, r) {
  if (!ye()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? fe(o) : "Resistência");
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
    const u = await yg.execute({ actor: l, skill: o, skillLabel: s });
    await yh(u.roll);
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
    Zs(e, m);
    try {
      await eg(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    Wr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Wr(e) {
  const t = e.closest(`[${Un}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Ws({
    rollCard: n,
    damageSection: th(n) ?? lt(n, "Dano"),
    effectSection: nh(n)
  });
  r && Qs(t, r);
}
function th(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Hr) !== "true") ?? null;
}
function nh(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function rh(e) {
  return Fe(e.assistedActions.policy.damageActionState);
}
function ah(e) {
  return Fe(e.assistedActions.policy.effectActionState);
}
function Kr() {
  try {
    return Sr();
  } catch {
    return "strict";
  }
}
function el(e, t, n) {
  if (e.damageApplication)
    return G(
      "✓",
      Ns({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
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
  const o = tl(a, t.damage);
  if (o === null)
    return G(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = qp({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = G(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const y = u.closest(`[${x}]`);
    y && oh(y, u, e, t);
  }), u;
}
function tl(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function oh(e, t, n, r) {
  if (n.damageApplication) return;
  if (rh(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = tl(o, a);
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
    const u = await bg.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Kr(),
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
    Xs(e, m);
    try {
      await ng(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", y);
    }
    try {
      await Fp(u.value);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", y);
    }
    Wr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function nl(e, t, n) {
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
  if (Rs(r))
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
    l && ih(l, o, e, t);
  }), o;
}
async function ih(e, t, n, r) {
  if (n.effectApplication) return;
  if (ah(n)) {
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
    const l = await Ag.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Kr(),
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
    Js(e, c);
    try {
      await ag(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Wr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function rl(e, t) {
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
function sh(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Vs, "true"), t.setAttribute("aria-hidden", "true"), al(e, t), t;
}
function co(e) {
  const t = e.querySelector(`[${Hs}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Vs}="true"]`);
  r && al(e, r);
}
function al(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function uo(e) {
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
function lh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Hs, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = ch(e, t.resistance);
  s && r.append(s);
  const l = uh(e, t.resistance), c = dh(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function ch(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Be ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function uh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Ys(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function dh(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), rl(n, [
    el(e, t, "full"),
    nl(e, t, "full")
  ]), n;
}
function mh(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function fh(e) {
  const t = ol(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(zs, "true"), n;
}
function ol(e) {
  return e.querySelector(`[${zs}="true"]`);
}
function ph(e, t) {
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
function gh(e, t, n) {
  const r = n?.parentElement === e ? n : lt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function hh(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function yn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function yh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function bh(e) {
  return typeof e == "string" && e.length > 0;
}
function Ah(e) {
  return e === "normal" || e === "half";
}
function mo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function il(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const fo = "data-paranormal-toolkit-card-layout-refresh-bound";
function _h(e) {
  const t = e.rollCard.querySelector(zt);
  t && t.getAttribute(fo) !== "true" && (t.setAttribute(fo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Se = "data-paranormal-toolkit-prompt-id", Th = "apply-damage", Rh = "data-paranormal-toolkit-multi-target-damage-info";
function $h(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(Rh) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function wh(e) {
  const t = Eh(e);
  return t.find((n) => n.getAttribute(Hp) === Th) ?? t.find((n) => Os(n) === "aplicar danos") ?? null;
}
function kh(e) {
  const t = sl(e), n = po(t);
  return n || po(Ih(e));
}
function po(e) {
  return e.find((t) => {
    const n = Os(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Eh(e) {
  const t = sl(e);
  return t.length > 0 ? t : Yr(e);
}
function sl(e) {
  const t = Lh(e);
  return t ? Yr(e).filter((n) => Sh(n, t)) : [];
}
function Ih(e) {
  const t = ll(e);
  if (!t) return [];
  const n = Ch(e, t);
  return Yr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => cl(e, r)).filter((r) => !n || Dh(r, n));
}
function Yr(e) {
  const t = ll(e);
  return t ? Array.from(t.querySelectorAll(Vp)) : [];
}
function ll(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Ch(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && cl(e, n)) ?? null;
}
function Sh(e, t) {
  return e.getAttribute(Se) === t ? !0 : Array.from(e.querySelectorAll(`[${Se}]`)).some((n) => n.getAttribute(Se) === t);
}
function Lh(e) {
  return e.getAttribute(Se) ?? e.querySelector(`[${Se}]`)?.getAttribute(Se) ?? null;
}
function cl(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Dh(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function vh(e) {
  const t = ul(), n = Wt(e.rollCard).state, r = Fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Fe(a), s = Rs(a);
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
function Ph(e) {
  const { rollCard: t } = e, n = Oh(), r = ul(), a = Wt(t).state, o = Fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Fe(s), c = xh(e);
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
      summary: Nh(a)
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
function Nh(e) {
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
function xh(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Oh() {
  try {
    return Yu();
  } catch {
    return "assisted";
  }
}
function ul() {
  try {
    return Sr();
  } catch {
    return "strict";
  }
}
const Mh = "data-paranormal-toolkit-damage-resolution-state", go = "data-paranormal-toolkit-damage-icon-enhanced", Qr = "data-paranormal-toolkit-damage-original-label", Fh = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, dl = "Outra opção escolhida";
function Bh(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Yp(t, "Aplicar dano"), Uh(e, t);
}
function Uh(e, t) {
  const n = Array.from(t.querySelectorAll(Ne)), r = yo(n, "normal"), a = yo(n, "half");
  if (!r || !a) {
    qh(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  bo(r, "normal"), bo(a, "half");
  const o = Ph({
    rollCard: e,
    normalButtonApplied: Lt(r),
    halfButtonApplied: Lt(a),
    normalButtonSkipped: ar(r),
    halfButtonSkipped: ar(a)
  });
  if (!o.canShowApplyDamage) {
    Ao(r), Ao(a), _o(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), ho(r, o.normalButton), ho(a, o.halfButton), _o(t, o.summary.state, o.summary.message);
}
function ho(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Gh(e, t.visible), zh(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function qh(e) {
  for (const t of e)
    ar(t) && t.remove();
}
function Lt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(dl);
}
function ar(e) {
  return e.textContent?.includes(dl) ?? !1;
}
function yo(e, t) {
  const n = Fh[t];
  return e.find((r) => n.test(jh(r))) ?? null;
}
function jh(e) {
  return [
    e.getAttribute(Qr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function bo(e, t) {
  if (e.getAttribute(go) === "true") return;
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
  ), e.setAttribute(go, "true"), e.setAttribute(Qr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, be(n));
}
function Ao(e) {
  Lt(e) || e.remove();
}
function Gh(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function zh(e, t, n, r = "Role resistência") {
  if (!Lt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(be(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Vh(e, n);
  }
}
function Vh(e, t) {
  const n = e.getAttribute(Qr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Hh(t), be(n)));
}
function Hh(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function _o(e, t, n) {
  e.setAttribute(Mh, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Gr)?.after(a);
}
const tt = "data-paranormal-toolkit-effect-icon-enhanced", xe = "data-paranormal-toolkit-effect-action-compacted", Yt = "data-paranormal-toolkit-effect-resistance-gate", Zr = "data-paranormal-toolkit-effect-section", Xr = "data-paranormal-toolkit-effect-label";
function Wh(e) {
  return e.querySelector(`[${Zr}="true"]`);
}
function Kh(e) {
  const t = Qh(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Xh(), r = sy(n, e.sourceActions, t);
  return r && n.setAttribute(Xr, r), Jh(n, t, r), oy(e.rollCard, n, e.after ?? e.fallbackAfter), iy(e.sourceActions, n), n;
}
function Yh(e, t) {
  const n = t.querySelector(Ne);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = gl(t, n, r), o = ml(e, n), s = vh({
    rollCard: e,
    effectLabel: a,
    applied: ea(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Pe(o) === "success" || Pe(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Ts(o) : !1
  });
  if (s.applied) {
    cy(n);
    return;
  }
  if (!s.visible) {
    uy(n);
    return;
  }
  if (s.waitingForResistance) {
    dy(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    my(n, s.compactLabel);
    return;
  }
  fy(n), pl(n, s.displayLabel);
}
function Qh(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Ne) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Ne) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Zh(e.rollCard, r) ?? r[0] ?? null;
}
function Zh(e, t) {
  const n = Wt(e).state, r = As(n), a = fl(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = ml(e, o, a);
    if (s && _s(s, r)) return o;
  }
  return null;
}
function ml(e, t, n = fl(e)) {
  const r = Jr(t, t.textContent?.trim() ?? ""), a = Bn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => Bn(s) === a)) ?? null : null;
}
function fl(e) {
  const t = Ds(Wf(e));
  if (!t) return [];
  const n = it(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function Xh() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Zr, "true"), e;
}
function Jh(e, t, n) {
  e.setAttribute(Zr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = ey(e), a = ty(r);
  a.textContent = "Efeito";
  const o = ny(e, r), s = ry(o);
  s.textContent = py(n ?? gl(e, t, t.textContent?.trim() ?? ""));
  const l = ay(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Ne)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !ea(t, c) && !ly(t, c) && pl(t, n ?? c);
}
function ey(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function ty(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function ny(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function ry(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function ay(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function oy(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function iy(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Ne)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function sy(e, t, n) {
  const r = e.getAttribute(Xr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Jr(n, n.textContent?.trim() ?? "");
}
function Jr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && J(n) !== "efeito aplicado") return n;
  const r = Kf(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && J(a) !== "aplicado" ? a : null;
}
function ea(e, t) {
  return e.classList.contains(Wp) || J(t).includes("aplicado");
}
function ly(e, t) {
  const n = e.getAttribute(Yt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Bn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function pl(e, t) {
  e.getAttribute(xe) === "true" && e.getAttribute(tt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(xe, "true"), e.setAttribute(tt, "true"), e.setAttribute(Kp, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    zr("✦", `${i}__button-icon--effect`),
    be("Aplicar")
  ));
}
function cy(e) {
  e.getAttribute(xe) === "true" && J(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(xe, "true"), e.setAttribute(tt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    zr("✓", `${i}__button-icon--effect-applied`),
    be("Aplicado")
  ));
}
function gl(e, t, n) {
  const r = e.getAttribute(Xr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Jr(t, n) ?? n;
}
function uy(e) {
  ea(e, e.textContent?.trim() ?? "") || e.remove();
}
function dy(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(xe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Yt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(be(t));
}
function my(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(xe), e.removeAttribute(tt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Yt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    zr("✓", `${i}__button-icon--effect-resisted`),
    be(t)
  );
}
function fy(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Yt), e.removeAttribute("aria-disabled");
}
function py(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const gy = "data-paranormal-toolkit-card-layout-normalized";
function hy(e) {
  const t = yy(e.rollCard), n = by(t);
  return _h({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function yy(e) {
  return {
    rollCard: e,
    damageSection: $h(e),
    resistance: e.querySelector(Dr),
    damageActions: wh(e),
    effectActionSource: kh(e),
    effectSection: Wh(e)
  };
}
function by(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(gy, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = lt(t, "Conjuração"), c = Ay({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), Bh(t, a));
  const u = Kh({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: _y(n, c),
    fallbackAfter: l
  });
  return u && Yh(t, u), u;
}
function Ay(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function _y(e, t) {
  return e ?? t;
}
const hl = [0, 80, 180, 400, 900, 1600, 3e3], To = /* @__PURE__ */ new WeakSet();
function Ty(e) {
  yl(e), Ry(e);
}
function yl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    bl(t);
}
function Ry(e) {
  if (!To.has(e)) {
    To.add(e);
    for (const t of hl)
      globalThis.setTimeout(() => {
        yl(e);
      }, t);
  }
}
function bl(e) {
  const t = hy({
    rollCard: e,
    refreshDelaysMs: hl,
    onRefresh: () => bl(e)
  });
  Rg({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const $y = "data-paranormal-toolkit-resistance-roll-result-enhanced", Ro = "data-paranormal-toolkit-resistance-original-description", wy = "data-paranormal-toolkit-resistance-skill", ky = "data-paranormal-toolkit-resistance-skill-label";
function Ey(e) {
  for (const t of Array.from(e.querySelectorAll(Dr)))
    Iy(t);
  Ty(e);
}
function Iy(e) {
  const t = e.querySelector(Pd), n = e.querySelector(ns), r = e.querySelector(zt), a = e.querySelector(rs);
  if (!r || !t && !n && !a) return;
  const o = Dy(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), vy(a)), My(r), Cy(e, r, n), r.parentElement !== e && e.append(r);
}
function Cy(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = Ly(n), o = Ms({
    description: a,
    skillLabel: t.getAttribute(ky) ?? t.getAttribute(wy),
    difficulty: Mr(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  Sy(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function Sy(e, t) {
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
function Ly(e) {
  const t = e.getAttribute(Ro);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(Ro, n), n;
}
function Dy(e, t) {
  const n = e.querySelector(`.${Ga}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Ga), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function vy(e) {
  const t = Py(e.textContent ?? "");
  t && (e.setAttribute($y, "true"), e.replaceChildren(Oy(t)));
}
function Py(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Ny(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Ny(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: xy(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function xy(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Oy(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Fy(e);
  return r && t.append(r), t;
}
function My(e) {
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
function Fy(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of By(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function By(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? $o(e, "highest") : n.includes("kl") ? $o(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function $o(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function wo(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function ta() {
  const e = globalThis.game;
  return Qt(e) ? e : null;
}
function B(e, t) {
  const n = Uy(e, t);
  return Et(n);
}
function Uy(e, t) {
  return t.split(".").reduce((n, r) => Qt(n) ? n[r] : null, e);
}
function qy(e, t) {
  const n = e.indexOf(":");
  return n < 0 || nt(e.slice(0, n)) !== nt(t) ? null : Ue(e.slice(n + 1));
}
function Et(e) {
  return typeof e == "string" ? Ue(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Qt(e) {
  return !!e && typeof e == "object";
}
function jy(e) {
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
function Al(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Gy(e) {
  for (const t of Array.from(e.querySelectorAll(Ld))) {
    const n = Qy(t);
    zy(t), n && (Vy(t, n), Hy(t, n));
  }
}
function zy(e) {
  for (const t of Array.from(e.querySelectorAll(Dd)))
    t.remove();
}
function Vy(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(ts) ?? null, a = r?.querySelector(Sd) ?? null, o = r ?? e, s = o.querySelector(Od);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = fb(t.elementTone), l.textContent = mb(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Hy(e, t) {
  const n = Wy(e);
  Ky(e, n);
  const r = Yy(t);
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
  const o = e.querySelector(as);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Wy(e) {
  return e.closest(`.${i}`)?.querySelector(ts) ?? null;
}
function Ky(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Md)))
      a.remove();
}
function Yy(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${or(e.target)}` : null,
    e.duration ? `Duração: ${or(e.duration)}` : null,
    e.resistance ? `Resistência: ${Al(e.resistance)}` : null
  ].filter(Zt);
}
function Qy(e) {
  const t = Zy(e), n = rb(e), a = (t ? nb(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = na(B(a, "element")), l = W("op.elementChoices", s) ?? ko(le(o, "Elemento")) ?? ko(n.damageType), c = s ?? pb(l), u = B(a, "circle") ?? le(o, "Círculo"), m = ib(a) ?? le(o, "Alvo"), y = ub(a, "duration", "op.durationChoices") ?? le(o, "Duração"), R = ab(e) ?? lb(a) ?? le(o, "Resistência"), b = ob(o) ?? n.cost, p = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: b,
    target: m,
    duration: y,
    resistance: R
  };
  return db(p) ? p : null;
}
function Zy(e) {
  const t = Xy(e);
  if (!t) return null;
  const n = t.getFlag?.(d, Gt), r = eb(n);
  if (r.length === 0) return null;
  const a = Jy(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Xy(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? ta()?.messages?.get?.(n) ?? null : null;
}
function Jy(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${ja}]`))) {
    const a = r.getAttribute(ja)?.trim();
    a && n.add(a);
  }
  return n;
}
function eb(e) {
  if (!Qt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(tb).filter((n) => n !== null) : [];
}
function tb(e) {
  return Qt(e) ? {
    pendingId: Et(e.pendingId),
    actorId: Et(e.actorId),
    itemId: Et(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(jy) : []
  } : null;
}
function nb(e) {
  if (!e.itemId) return null;
  const t = ta(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function rb(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(vd))) {
    const a = Ue(r.textContent);
    if (!a) continue;
    const o = qy(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function ab(e) {
  const t = Ue(e.querySelector(ns)?.textContent);
  return t ? Al(t) : null;
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
function ob(e) {
  const t = le(e, "Custo") ?? le(e, "PE");
  return t || (e.map(Ue).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function ib(e) {
  const t = B(e, "target");
  if (!t) return null;
  if (t === "area")
    return sb(e) ?? W("op.targetChoices", t) ?? "Área";
  const n = W("op.targetChoices", t) ?? ee(t);
  return [t === "people" || t === "creatures" ? B(e, "targetQtd") : null, n].filter(Zt).join(" ");
}
function sb(e) {
  const t = B(e, "area.name"), n = B(e, "area.size"), r = B(e, "area.type"), a = t ? W("op.areaChoices", t) ?? ee(t) : null, o = r ? W("op.areaTypeChoices", r) ?? ee(r) : null;
  return a ? n ? o ? `${a} ${n}m ${or(o)}` : `${a} ${n}m` : a : null;
}
function lb(e) {
  const t = B(e, "skillResis"), n = B(e, "resistance");
  if (!t || !n) return null;
  const r = W("op.skill", t) ?? ee(t), a = cb(n);
  return [r, a].filter(Zt).join(" ");
}
function cb(e) {
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
function ub(e, t, n) {
  const r = B(e, t);
  return r ? W(n, r) ?? ee(r) : null;
}
function db(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function mb(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function fb(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Zt).join(" ");
}
function na(e) {
  const t = nt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function ko(e) {
  const t = na(e);
  return t ? W("op.elementChoices", t) ?? ee(t) : e ? ee(e) : null;
}
function pb(e) {
  return na(e);
}
function W(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = ta()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Eo = "data-paranormal-toolkit-dice-toggle-enhanced";
function gb(e) {
  for (const t of Array.from(e.querySelectorAll(os)))
    _l(t);
}
function hb(e) {
  const t = Rl(e.target);
  if (!t) return;
  const n = ra(t);
  n && (e.preventDefault(), Tl(n, t));
}
function yb(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Rl(e.target);
  if (!t) return;
  const n = ra(t);
  n && (e.preventDefault(), Tl(n, t));
}
function _l(e) {
  const t = e.querySelector(Vt);
  if (!t) return;
  const n = e.querySelector(Pr);
  if (n && n.getAttribute(Eo) !== "true" && (n.setAttribute(Eo, "true"), n.classList.add(Nr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Tl(e, t) {
  const n = e.querySelector(Vt);
  if (!n) return;
  const r = !e.classList.contains(vr);
  bb(e, t, n, r);
}
function bb(e, t, n, r) {
  e.classList.toggle(vr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Rl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Pr);
  if (!t) return null;
  const n = ra(t);
  return n ? (_l(n), t.classList.contains(Nr) ? t : null) : null;
}
function ra(e) {
  const t = e.closest(os);
  return t && t.querySelector(Vt) ? t : null;
}
const Io = `${d}-workflow-dice-toggle-styles`;
function Ab() {
  if (document.getElementById(Io)) return;
  const e = document.createElement("style");
  e.id = Io, e.textContent = `
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
const _b = [0, 100, 500, 1500, 3e3];
let Co = !1, bn = null;
function Tb() {
  if (!Co) {
    Co = !0, Ab(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Qe(wo(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Qe(wo(t));
    }), Hooks.once("ready", () => {
      Qe(document), Rb();
    }), document.addEventListener("click", hb), document.addEventListener("keydown", yb);
    for (const e of _b)
      globalThis.setTimeout(() => Qe(document), e);
  }
}
function Rb() {
  bn || !document.body || (bn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Qe(n);
  }), bn.observe(document.body, { childList: !0, subtree: !0 }));
}
function Qe(e) {
  e && (tm(e), Gy(e), Ey(e), gb(e), Wd(e));
}
function $b() {
  Tb();
}
const wb = "data-paranormal-toolkit-action-section", kb = "ritual-log", Eb = ".paranormal-toolkit-item-use-prompt__actions", Ib = ".paranormal-toolkit-item-use-prompt__actions-title", Cb = [0, 100, 500, 1500];
let So = !1;
function Sb() {
  if (So) return;
  const e = (t, n) => {
    Lo(Pb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Lo(document), So = !0;
}
function Lo(e) {
  for (const t of Cb)
    globalThis.setTimeout(() => Lb(e), t);
}
function Lb(e) {
  Db(e), vb(e);
}
function Db(e) {
  for (const t of e.querySelectorAll(
    `[${wb}="${kb}"]`
  ))
    t.remove();
}
function vb(e) {
  for (const t of e.querySelectorAll(Eb)) {
    if (Do(t.querySelector(Ib)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Do(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function Pb(e) {
  if (e instanceof HTMLElement || Nb(e))
    return e;
  if (xb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Nb(e) {
  return e instanceof HTMLElement;
}
function xb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Do(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ze = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, $l = {
  PV: "system.attributes.hp"
}, ir = {
  PV: [Ze.PV, $l.PV],
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
class Ob {
  getResource(t, n) {
    const r = vo(t, n);
    if (!r.ok)
      return g(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = No(t, n, o, l, "valor atual");
    if (u) return g(u);
    const m = No(t, n, s, c, "valor máximo");
    return m ? g(m) : A({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = vo(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function vo(e, t) {
  const n = Mb(e.type, t);
  if (n && Po(e, n))
    return A(n);
  const r = ir[t].find(
    (a) => Po(e, a)
  );
  return r ? A(r) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Fb(e, t),
    path: ir[t].join(" | ")
  });
}
function Mb(e, t) {
  return e === "threat" ? $l[t] ?? null : e === "agent" ? Ze[t] : null;
}
function Po(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Fb(e, t) {
  const n = e.type ?? "unknown", r = ir[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function No(e, t, n, r, a) {
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
class Bb {
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
    const { path: r, value: a } = n, o = Ub(a);
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
function Ub(e) {
  if (xo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (xo(n))
      return n;
  }
  return null;
}
function xo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const qb = "dice-so-nice";
async function wl(e) {
  if (!jb() || !Gb()) return;
  const t = zb();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function jb() {
  try {
    return Cd().enabled;
  } catch {
    return !1;
  }
}
function Gb() {
  return game.modules?.get?.(qb)?.active === !0;
}
function zb() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Oo = "occultism";
class kl {
  getDifficulty(t) {
    return Vb(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Wb(t, Oo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await wl(r);
    const a = Qb(r);
    return {
      skill: Oo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: Yb(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: Zb(r)
    };
  }
}
function Vb(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Hb(e) {
  return new kl().rollCastingCheck(e);
}
async function Wb(e, t) {
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
  return Kb(r);
}
function Kb(e) {
  return Mo(e) ? e : Array.isArray(e) ? e.find(Mo) ?? null : null;
}
function Mo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Yb(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Qb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Zb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Xb);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Xb(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Jb = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class eA {
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
    const r = n.value, a = tA(t.ritual, r);
    return a.ok ? a.value ? A(a.value) : A({
      resource: "PE",
      amount: Jb[r],
      source: "default-by-circle",
      circle: r
    }) : g(a.error);
  }
}
function tA(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : nA(n) ? {
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
function nA(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const An = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function rA(e) {
  if (!cA(e.item)) return null;
  const t = lr(e.actor) ? e.actor : aA(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: iA(e.token) ?? oA(t),
    targets: Cr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function aA(e) {
  const t = e;
  return lr(t.actor) ? t.actor : lr(e.parent) ? e.parent : null;
}
function oA(e) {
  const t = sA(e) ?? lA(e);
  return t ? El(t) : null;
}
function iA(e) {
  return cr(e) ? El(e) : null;
}
function sA(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return cr(n) ? n : (t.getActiveTokens?.() ?? []).find(cr) ?? null;
}
function lA(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function El(e) {
  const t = e.actor ?? null;
  return {
    tokenId: _n(e.id),
    actorId: _n(t?.id),
    sceneId: _n(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function cA(e) {
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
class uA {
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
    const n = rA(dA(t));
    if (!n) {
      f.warn(`${An.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function dA(e) {
  return e && typeof e == "object" ? e : {};
}
class mA {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Tn("missing-item-patch");
    if (t.type !== "ritual") return Tn("unsupported-item-type");
    const a = fA(r);
    return Object.keys(a).length === 0 ? Tn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function fA(e) {
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
class pA {
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
class gA {
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
class hA {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = yA(t);
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
    return this.list().map((n) => bA(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function yA(e) {
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
function bA(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = AA(a, t);
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
function AA(e, t) {
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
      const n = Fo(t.name), r = e.names.map(Fo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = _A(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Fo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function _A(e) {
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
async function TA(e, t, n) {
  if (!Bo(e.id) || !Bo(e.formula))
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
    await wl(a);
    const l = {
      ...n.rollRequests[e.id] ?? Il(e, t),
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
function Il(e, t) {
  const n = e.intent ?? RA(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function RA(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Bo(e) {
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
function $A(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = wA(t, n, r, a);
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
    const s = kA(t, n, r, a);
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
function wA(e, t, n, r) {
  const a = Xt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Cl(t.id, "damage", r, t.damageInstances.length),
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
function kA(e, t, n, r) {
  const a = Xt(e.amountFrom);
  return {
    id: Cl(t.id, "healing", r, t.healingInstances.length),
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
function Cl(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function EA(e, t, n) {
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
function IA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Sl("before", e), Uo("before", e), Uo("resolve", e);
}
function CA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Sl("apply", e);
}
function SA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Sl(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = LA(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Uo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function LA(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function DA(e, t, n) {
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
async function vA(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return PA(e, t);
    case "spendRitualCost":
      return NA(e, t);
  }
}
async function PA(e, t) {
  const { context: n, resources: r } = e, a = Dt(t, n);
  return a.ok ? Ll(await r.spend(n.sourceActor, t.resource, a.value), n) : g(a.error);
}
async function NA(e, t) {
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
  }), Ll(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Ll(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), A(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function xA(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = OA(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function OA(e) {
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
class MA {
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
        return xA({
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
    const a = await vA({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Il(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), A(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await TA(t, r, n);
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Dt(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = EA(t, n, a.value);
    IA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), CA({
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
      $A({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return SA({
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
    const a = await DA(this.messages, t, n);
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
    const l = FA(t, n.intent);
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
function FA(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class BA {
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
class UA {
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
class qA {
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
function Dl(e) {
  return {
    id: jA(),
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
function jA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class GA {
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
    const r = Dl(n);
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
class zA {
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
class VA {
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
      whisper: HA(),
      flags: {
        ...t.flags,
        [d]: {
          ...WA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = On();
    if (!r.enabled)
      return;
    const a = n.notification ?? qo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = qo(n);
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
function qo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function HA() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function WA(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const KA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", vl = `${d}-inline-roll-neutralized`, YA = `${d}-inline-roll-notice`, aa = `data-${d}-inline-roll-neutralized`, jo = `data-${d}-inline-roll-notice`, QA = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Go(e) {
  const t = u_(e.message), n = await ZA(e.message), r = XA(t);
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
async function ZA(e) {
  const t = s_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = JA(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await l_(t, n.content), replacementCount: n.replacementCount };
}
function XA(e) {
  const t = e ? c_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Pl(t);
  return n > 0 && Nl(a_(t)), { replacementCount: n };
}
function JA(e) {
  const t = e_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Pl(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Nl(n.content), { content: n.innerHTML, replacementCount: a });
}
function e_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, n_(a.trim()))), replacementCount: t };
}
function Pl(e) {
  const t = t_(e);
  for (const n of t)
    n.replaceWith(r_(o_(n)));
  return t.length;
}
function t_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(KA))
    n.getAttribute(aa) !== "true" && t.add(n);
  return Array.from(t);
}
function n_(e) {
  return `<span class="${vl}" ${aa}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${d_(e)}</span>`;
}
function r_(e) {
  const t = document.createElement("span");
  return t.classList.add(vl), t.setAttribute(aa, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Nl(e) {
  if (e.querySelector?.(`[${jo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(YA), t.setAttribute(jo, "true"), t.textContent = QA, e.append(t);
}
function a_(e) {
  return e.querySelector(".message-content") ?? e;
}
function o_(e) {
  const n = e.getAttribute("data-formula") ?? i_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function i_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function s_(e) {
  return e && typeof e == "object" ? e : null;
}
async function l_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function c_(e) {
  const t = m_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function u_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function d_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function m_(e) {
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
function xl(e) {
  const t = e.getFlag(d, Pt);
  return ur(t);
}
function Ol(e) {
  return xl(e) ?? Jt();
}
async function f_(e, t) {
  const n = ur(t) ?? ur({
    ...Jt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Pt, n), n;
}
async function p_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Pt));
    return;
  }
  await e.setFlag(d, Pt, null);
}
function ur(e) {
  if (!en(e)) return null;
  const t = R_(e.intent);
  if (!t) return null;
  const n = Jt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Nt(e.damageType),
    utilityLabel: Nt(e.utilityLabel) ?? n.utilityLabel,
    note: oa(e.note),
    forms: $_(e.forms)
  };
}
function g_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function h_(e) {
  const t = xl(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = y_(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...b_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: __(e, t),
    resistance: t.intent === "damage" ? Ml(e) : void 0
  };
}
function y_(e, t) {
  const n = {
    type: "rollFormula",
    id: Le,
    formula: t,
    intent: T_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function b_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Le}.total`,
          ...A_(e.damageType)
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
function A_(e) {
  return e ? { damageType: e } : {};
}
function __(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Le]: n
      }
    }
  };
  return zo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Le]: t.forms.discente.formula.trim()
    }
  }), zo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Ml(e) {
  const t = Fl(e), n = Nt(t.skillResis), r = Nt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = w_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function T_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function R_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function $_(e) {
  const t = Jt();
  return en(e) ? {
    base: wn(e.base),
    discente: wn(e.discente),
    verdadeiro: wn(e.verdadeiro)
  } : t.forms;
}
function wn(e) {
  return en(e) ? { formula: oa(e.formula) } : { formula: "" };
}
function zo(e, t) {
  const n = Fl(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return k_(r);
}
function Fl(e) {
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
function oa(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Nt(e) {
  const t = oa(e);
  return t.length > 0 ? t : null;
}
function en(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function E_(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function I_(e) {
  switch (C_(e)) {
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
      return S_(String(e ?? ""));
  }
}
function C_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function S_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function L_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function D_(e) {
  return {
    ...ia(e),
    type: "ritual.cast.started"
  };
}
function v_(e) {
  return {
    ...ia(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function P_(e) {
  return {
    ...ia(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function N_(e) {
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
function x_(e, t = {}) {
  const n = Q_(e), r = [
    ...X_(t.candidates ?? []),
    ...J_(e)
  ], a = tT(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = Z_(t) ?? nT(r) ?? aT(a), s = iT(canvas?.grid?.size), l = O_(o, a, r), c = z_(r), u = G_(l);
  return {
    type: "rectangleRay",
    sceneId: oT(e, n),
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
function O_(e, t, n) {
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
    direction: M_(r, t, n)
  };
}
function M_(e, t, n) {
  const r = F_(n);
  return r !== null ? r : U_(e, t) ?? e.direction;
}
function F_(e) {
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
    const a = tn(n), o = Vo(a, t);
    if (o !== null) return o;
  }
  return null;
}
function Vo(e, t) {
  for (const n of t) {
    const r = B_(N(e, n));
    if (r !== null) return r;
  }
  return null;
}
function B_(e) {
  const t = rt(e);
  if (t === null) return null;
  const n = la(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function U_(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Wo(Ho(e, e.direction), t), r = q_(e, t);
  if (r === null) return null;
  const o = j_([
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
  return o.error <= s ? la(o.direction) : null;
}
function q_(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Xo(o, 0, 1), c = Xo(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : sT(Math.atan2(c, l));
}
function Ho(e, t) {
  const n = Ul(t), r = {
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
function j_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = la(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function G_(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Ul(e.direction), n = {
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
function z_(e) {
  for (const t of e) {
    const n = Ko(t, "ray.start"), r = Ko(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Ko(e, t) {
  const n = N(e, t), r = rt(N(n, "x")), a = rt(N(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function ia(e) {
  const t = N_(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: W_(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: V_(e.context.item, e.form, e.formLabel, t),
    targets: n.map(K_),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function V_(e, t, n, r) {
  return {
    name: e.name,
    slug: kn(e, "system.slug") ?? kn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: kn(e, "system.element"),
    circle: Y_(e),
    form: H_(t),
    formLabel: n
  };
}
function H_(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function W_(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function K_(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function Y_(e) {
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
function Q_(e) {
  return "document" in e && e.document ? e.document : e;
}
function Z_(e) {
  return Bl(e.shape);
}
function X_(e) {
  return e.filter(sa);
}
function J_(e) {
  return [
    e,
    eT(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(sa);
}
function eT(e) {
  return "object" in e && sa(e.object) ? e.object : null;
}
function sa(e) {
  return !!(e && typeof e == "object");
}
function tT(e) {
  for (const t of e) {
    const n = Yo(N(tn(t), "bounds"));
    if (n) return n;
    const r = Yo(N(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function Yo(e) {
  const t = E(e, "x"), n = E(e, "y"), r = E(e, "width"), a = E(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function E(e, t) {
  return rt(N(e, t));
}
function nT(e) {
  for (const t of e) {
    const n = rT(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function rT(e) {
  if (!e || typeof e != "object") return [];
  const t = Qo(tn(e));
  return t.length > 0 ? t : Qo(e);
}
function Qo(e) {
  const t = N(e, "shapes");
  return Array.isArray(t) ? t.map(Bl).filter((n) => n !== null) : [];
}
function Bl(e) {
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
function aT(e) {
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
function oT(e, t) {
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
function Zo(e) {
  return me(e);
}
function rt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function iT(e) {
  const t = rt(e);
  return t !== null && t > 0 ? t : null;
}
function Ul(e) {
  return e * Math.PI / 180;
}
function sT(e) {
  return e * 180 / Math.PI;
}
function la(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Xo(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class lT {
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
const cT = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class uT {
  constructor(t = new nn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = dT(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(cT);
  }
}
function dT(e, t) {
  const n = [], r = mT(e), a = Jo(r), o = Jo(e);
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
function mT(e) {
  return fT(e) ? e.document ?? null : e;
}
function fT(e) {
  return "bounds" in e;
}
function Jo(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const pT = 100, gT = 12;
class hT {
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
      const a = this.foundryAdapter.getGridSize() ?? pT, o = TT(n), s = await this.foundryAdapter.placeRegion(
        yT(t, this.foundryAdapter.getUserColor(), a),
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
        message: _T(a)
      };
    }
  }
}
function yT(e, t, n) {
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
    shapes: [bT(e, n)]
  };
}
function bT(e, t) {
  const n = AT(e, t);
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
function AT(e, t) {
  return {
    length: ei(e.length, gT, t),
    width: ei(e.width, 1, t)
  };
}
function ei(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function _T(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function TT(e) {
  const t = (n) => {
    const r = RT(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function RT(e) {
  return $T(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function $T(e) {
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
    this.applyTargets(ti(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(ti(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = kT(t);
    ET(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function ti(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function kT(e) {
  return Array.from(new Set(e));
}
function ET(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class IT {
  constructor(t = new nn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(zi)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(CT(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(ST(t), "final");
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
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = DT(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function CT(e) {
  return [
    { source: "document", region: ue(e.document) },
    { source: "document.object", region: ue(e.document.object) },
    { source: "preview", region: ue(e.preview) },
    { source: "preview.document.object", region: ue(e.preview?.document?.object) }
  ];
}
function ST(e) {
  return [
    { source: "input", region: ue(e) },
    { source: "input.object", region: LT(e) ? ue(e.object) : null },
    { source: "input.document.object", region: ql(e) ? ue(e.document?.object) : null }
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
function ql(e) {
  return "document" in e && "bounds" in e;
}
function LT(e) {
  return !ql(e);
}
function DT(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function At(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const vT = "Nenhum alvo encontrado na linha.";
class PT {
  constructor(t = new hT(), n = new IT(), r = new uT(), a = new wT(), o = new lT()) {
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
        const l = this.regionTargetResolver.resolveTargets(s.region), c = xT(r), u = x_(s.region, {
          candidates: [c?.preview, c?.document],
          shape: c?.shape
        });
        return l.targets.length === 0 ? (o(), this.foundryAdapter.warn(vT), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(l.tokens), {
          status: "confirmed",
          targets: l.targets,
          areaSnapshot: u
        });
      } catch (l) {
        o();
        const c = NT(l);
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
function NT(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function xT(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function OT(e) {
  return {
    header: {
      eyebrow: Rr,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: zT(e.ritual)
    },
    forms: e.variantOptions.map((t) => MT(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: UT(e.targetNames, e.variantOptions, e.ritual),
    automation: GT(e.automationStatus ?? "assisted")
  };
}
function MT(e, t) {
  const n = FT(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? BT(t) : "—",
    details: n
  };
}
function FT(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function BT(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function UT(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => qT(a, n))
  };
}
function qT(e, t) {
  const n = e.targeting ?? jT(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function jT(e, t) {
  const n = it(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function GT(e) {
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
function zT(e) {
  const t = e.system, n = [HT(t?.element), VT(t?.circle)].filter(YT);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function VT(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function HT(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (WT(e)) {
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
      return KT(e);
  }
}
function WT(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function KT(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function YT(e) {
  return typeof e == "string" && e.length > 0;
}
const jl = ["base", "discente", "verdadeiro"];
function ca(e) {
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
const { ApplicationV2: QT } = foundry.applications.api;
class Je extends QT {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = OT(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    JT(a, (o) => {
      this.selectedVariant = o, mr(a, o);
    }), mr(a, this.selectedVariant), eR(a, (o) => {
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
          ${this.model.forms.map(ZT).join("")}
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
          ${this.model.targets.forms.map(XT).join("")}
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
    const n = aR(t), r = tR(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function ZT(e) {
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
function XT(e) {
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
function JT(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => ni(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), ni(e, a, t));
    });
  const r = Gl(e);
  r && t(r);
}
function ni(e, t, n) {
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
function eR(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function tR(e, t, n) {
  const r = rR(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = nR(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function nR(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function rR(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (xt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return xt(n) ? n : null;
}
function aR(e) {
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
async function oR(e) {
  return Je.request(e);
}
const ua = {
  label: "Padrão"
}, iR = {
  label: "Discente",
  extraCost: 2
}, sR = {
  label: "Verdadeiro",
  extraCost: 5
};
class lR {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new PT();
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
    const a = this.resolveCostPreview(t), o = e$(n), s = ZR(
      n,
      t.item,
      a,
      o
    ), l = await oR({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: a,
      defaultSpendResource: i$(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = cR(l), u = n$(
      n,
      t.item,
      c.variant,
      o
    ), m = L_(), y = u.label ?? ca(c.variant), R = (I = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: y,
      targets: I
    }), b = (I, C = t.targets, Te = {}) => {
      this.ritualEvents.emitCastFinished(
        P_({
          ...R(C),
          status: I,
          ...Te
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      D_(R())
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
    const T = uR(
      t,
      p.targets
    );
    p.areaSnapshot && this.ritualEvents.emitAreaResolved(
      v_({
        ...R(p.targets),
        area: p.areaSnapshot
      })
    );
    const Ae = Qi();
    let Q = null;
    if (Ae) {
      const I = await mR(
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
        const C = await Hb(
          T.actor
        );
        Q = pR(
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
    const _e = dR(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !Ae
      }
    );
    if (_e.steps.length === 0) {
      const I = t$(
        T,
        c
      ), C = ai(
        n,
        T
      ), Te = ri(
        T.actor,
        Q,
        u,
        a
      ), wa = oi(
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
      const ka = [
        ...Te,
        ...C.actions
      ];
      return ka.length > 0 ? (b("ready", T.targets), {
        status: "ready",
        workflowContext: I,
        itemUseContext: T,
        actions: ka,
        summaryLines: wa
      }) : (b("completed-without-actions", T.targets), {
        status: "completed-without-actions",
        workflowContext: I,
        itemUseContext: T,
        summaryLines: wa
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
    const ne = O.value.context, j = _R(
      n,
      T,
      ne
    ), M = ai(
      n,
      T
    ), cn = ri(
      T.actor,
      Q,
      u,
      a
    ), Ra = oi(
      n,
      c,
      u,
      a,
      ne,
      T,
      Q
    );
    if (!j.ok)
      return b("failed", T.targets, {
        reason: j.reason,
        message: j.message
      }), {
        status: "failed",
        reason: j.reason,
        message: j.message
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
    const $a = [
      ...cn,
      ...j.actions,
      ...M.actions
    ];
    return $a.length === 0 ? (b("completed-without-actions", T.targets), {
      status: "completed-without-actions",
      workflowContext: ne,
      itemUseContext: T,
      summaryLines: Ra
    }) : (b("ready", T.targets), {
      status: "ready",
      workflowContext: ne,
      itemUseContext: T,
      actions: $a,
      summaryLines: Ra
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
function cR(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function uR(e, t) {
  return {
    ...e,
    targets: t
  };
}
function dR(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || ma(l) && (!a.includeCostSteps || !s) || o.push(fR(l, n));
  return a.includeCostSteps && s && r && s$(n.extraCost) && o.push({
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
async function mR(e, t, n, r, a) {
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
function fR(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function pR(e, t, n) {
  const a = gR(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function gR(e, t) {
  const n = qe(e, t);
  return n ? E_(n.amount) : null;
}
function ri(e, t, n, r) {
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
function ai(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = da(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = ds(o);
      n.push(
        hR(
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
function hR(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? AR(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: yR(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: bR(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function yR(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function bR(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function AR(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function _R(e, t, n) {
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
    const l = da(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (TR(o)) {
        RR(
          a,
          c,
          $R(o, n, s.value)
        );
        continue;
      }
      r.push(kR(o, c, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...wR(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function TR(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function RR(e, t, n) {
  const r = SR(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function $R(e, t, n) {
  const r = LR(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function wR(e, t, n, r) {
  const a = NR(e), o = a.length > 1 ? MR() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const y = xR(u.amount, s);
        return {
          id: ER(u, s, m),
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
      label: IR(c, s, a.length > 1),
      executedLabel: CR(
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
function kR(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = PR(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: DR(e, r, n),
    executedLabel: vR(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function ER(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function IR(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function CR(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function SR(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function LR(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function DR(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function vR(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function PR(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function NR(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function xR(e, t) {
  const n = e * t.multiplier, r = OR(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function OR(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function MR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function da(e, t) {
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
    `Forma: ${ca(t.variant)}`,
    qR(t, n, r),
    ...UR(s),
    ...Object.values(a.rolls).flatMap(jR),
    ...FR(e, o),
    ...GR(e.resistance),
    ...YR(n)
  ];
}
function FR(e, t) {
  return BR(e) ? da("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function BR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function UR(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function qR(e, t, n) {
  const r = qe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function jR(e) {
  const n = [`${QR(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = zR(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${I_(e.damageType)}`), n;
}
function GR(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function zR(e) {
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
    const s = VR(o);
    s && (KR(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function VR(e) {
  const t = HR(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : WR(e);
}
function HR(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function WR(e) {
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
function KR(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function YR(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function QR(e) {
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
function ZR(e, t, n, r) {
  return jl.map((a) => {
    const o = zl(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? ca(a),
      enabled: s,
      details: o ? XR(o, n, r) : [],
      finalCostText: o ? JR(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function XR(e, t, n) {
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
function JR(e, t) {
  const n = qe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function e$(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(ma);
}
function t$(e, t) {
  return Dl({
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
function n$(e, t, n, r) {
  return zl(e, t, n, r) ?? ua;
}
function zl(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? a$(t, n) ? r$(n) : null : n === "base" ? ua : null);
}
function r$(e) {
  switch (e) {
    case "base":
      return ua;
    case "discente":
      return iR;
    case "verdadeiro":
      return sR;
  }
}
function a$(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return o$(foundry.utils.getProperty(e, n));
}
function o$(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function i$(e) {
  return e.steps.some(ma);
}
function ma(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function s$(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Vl = "itemUsePrompts", Hl = "chatCard", rn = "data-paranormal-toolkit-prompt-id", an = "data-paranormal-toolkit-pending-id", fa = "data-paranormal-toolkit-executed-label", fr = "data-paranormal-toolkit-choice-group", Wl = "data-paranormal-toolkit-skipped-label", Ot = "data-paranormal-toolkit-action-section", ii = "data-paranormal-toolkit-detail-key", si = "data-paranormal-toolkit-roll-card", pa = "data-paranormal-toolkit-roll-detail-toggle", Kl = "data-paranormal-toolkit-roll-detail-id", Yl = "data-paranormal-toolkit-resistance-roll-button", Ql = "data-paranormal-toolkit-resistance-skill", Zl = "data-paranormal-toolkit-resistance-skill-label", Xl = "data-paranormal-toolkit-resistance-target-actor-id", Jl = "data-paranormal-toolkit-resistance-target-name", ec = "data-paranormal-toolkit-resistance-roll-result", li = "data-paranormal-toolkit-system-card-replaced", l$ = `[${an}]`, c$ = `[${pa}]`, u$ = `[${Yl}]`, pr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, d$ = `${h}__actions`, ci = `${h}__details`, tc = `${h}__summary`, m$ = `${h}__title`, nc = `${h}__button--executed`, di = `${h}__roll-card`;
let mi = !1, gr = null;
const q = /* @__PURE__ */ new Map(), f$ = [0, 100, 500, 1500, 3e3], p$ = 3e4, g$ = [0, 100, 500, 1500, 3e3];
function h$(e) {
  if (gr = e, mi) {
    pi(e);
    return;
  }
  const t = (n, r) => {
    ac(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), mi = !0, pi(e);
}
async function fi(e) {
  const t = rc(e);
  q.set(e.pendingId, t), await ya(t) || hc(t), oc(e.pendingId);
}
async function y$(e) {
  const t = rc({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", q.set(e.pendingId, t), await ya(t) || hc(t), oc(e.pendingId);
}
async function In(e, t) {
  const n = q.get(e);
  q.delete(e), n && await yw(n, t);
}
function ga(e) {
  const t = Rc();
  for (const n of t) {
    const r = Y(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function b$(e, t) {
  const n = ga(e);
  if (!n) return;
  const r = Y(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await je(n.message, r));
}
async function A$(e, t, n) {
  if (!t) return;
  const r = ga(e);
  if (!r) return;
  const a = Y(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await je(r.message, a);
}
function rc(e) {
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
    summary: H$(e.context),
    executed: !1
  };
}
function ac(e, t, n) {
  hw();
  const r = sn(t);
  if (!r) return;
  const a = fw(e, r);
  a.length > 0 && Mt(r);
  for (const o of a)
    hr(r, o);
  uc(r, n), yr(r), br(r);
}
function pi(e) {
  for (const t of g$)
    globalThis.setTimeout(() => {
      _$(e);
    }, t);
}
function _$(e) {
  for (const t of T$()) {
    const n = on(t);
    R$(n) && ac(n, t, e);
  }
}
function T$() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function R$(e) {
  return e ? ba(e) ? !0 : Aw(e).length > 0 : !1;
}
function oc(e) {
  const t = q.get(e);
  if (!t) return;
  const n = t.messageId ? pw(t.messageId) : null;
  if (n) {
    Ai(n, t), Mt(n), hr(n, t), gi(n), yr(n), br(n);
    return;
  }
  if (t.messageId) {
    Tr(t);
    return;
  }
  const r = gw(t);
  if (r) {
    Ai(r, t), Mt(r), hr(r, t), gi(r), yr(r), br(r);
    return;
  }
  Tr(t);
}
function gi(e) {
  gr && uc(e, gr);
}
function Mt(e) {
  const t = $$();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = cc(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(li) === "true") return;
  const r = n.querySelector(`.${pr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(li, "true");
}
function $$() {
  try {
    return Ku() === "replace";
  } catch {
    return !1;
  }
}
function hr(e, t) {
  if (Mt(e), e.querySelector(`[${rn}="${Ge(t.pendingId)}"]`)) return;
  const n = k$(e, t);
  I$(n, t);
  const r = j$(t);
  if (w$(r)) return;
  q$(n, r).append(V$(t));
}
function w$(e) {
  return sc(e.id) && !pe();
}
function ic(e) {
  const n = e.closest(`[${Ot}]`)?.getAttribute(Ot) ?? null;
  return sc(n) && !pe();
}
function sc(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function k$(e, t) {
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
  s.classList.add(m$), s.textContent = E$(t);
  const l = document.createElement("span");
  return l.classList.add(tc), l.textContent = t.summary, a.append(o, s, l), r.append(a), K$(e).append(r), r;
}
function E$(e) {
  const t = v(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function I$(e, t) {
  const n = t.summaryLines ?? [], r = pc(n, t);
  if (r) {
    C$(e, r, t);
    return;
  }
  G$(e, n);
}
function C$(e, t, n) {
  if (e.querySelector(`[${si}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(di, `${di}--${t.intent}`), r.setAttribute(si, "true"), t.castingCheck && hi(r, L$(t.castingCheck), n.pendingId, "casting"), S$(t) && hi(r, D$(t), n.pendingId, "effect"), O$(r, t), M$(r, t, n), U$(r, t), e.append(r);
}
function S$(e) {
  return e.intent !== "casting";
}
function L$(e) {
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
function D$(e) {
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
  v$(a, t), B$(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function v$(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = P$(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function P$(e, t) {
  const n = N$(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of x$(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function N$(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function x$(e, t) {
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
function O$(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Mw);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function M$(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = F$(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(lc(t.resistanceRollResult)), e.append(r);
}
function F$(e, t) {
  if (!e.resistanceSkill || !ye()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(rn, t.pendingId), n.setAttribute(Yl, "true"), n.setAttribute(Ql, e.resistanceSkill), n.setAttribute(Zl, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Xl, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Jl, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ec, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function lc(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = mc(e), t;
}
function B$(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(pa, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Kl, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const y = document.createElement("dd");
    y.textContent = u.value, c.append(m, y);
  }
  e.append(l, c);
}
function U$(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function q$(e, t) {
  const n = `[${Ot}="${Ge(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(d$), a.setAttribute(Ot, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function j$(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = pc(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function G$(e, t) {
  if (t.length === 0) return;
  const n = z$(e);
  for (const r of t) {
    const a = Fw(r);
    if (n.querySelector(`[${ii}="${Ge(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(ii, a), n.append(o);
  }
}
function z$(e) {
  const t = e.querySelector(`.${ci}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ci), e.append(n), n;
}
function V$(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(rn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(nc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(an, e.pendingId), t.setAttribute(fa, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(fr, e.choiceGroupId), t.setAttribute(Wl, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function H$(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = W$(e);
  return `${t} → ${n}`;
}
function W$(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function K$(e) {
  return cc(e) ?? e;
}
function cc(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function uc(e, t) {
  const n = sn(e);
  if (!n) return;
  const r = n.querySelectorAll(l$);
  for (const a of r) {
    if (ic(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      lw(a, t);
    }));
  }
}
function yr(e) {
  const t = sn(e);
  if (!t) return;
  const n = t.querySelectorAll(c$);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Y$(t, r);
    }));
}
function br(e) {
  const t = sn(e);
  if (!t) return;
  const n = t.querySelectorAll(u$);
  for (const r of n) {
    if (!ye()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Q$(t, r);
    }));
  }
}
function Y$(e, t) {
  const n = t.getAttribute(pa);
  if (!n) return;
  const r = e.querySelector(`[${Kl}="${Ge(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Q$(e, t) {
  if (!ye()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(rn), r = t.getAttribute(Ql), a = t.getAttribute(Zl) ?? (r ? fe(r) : "Resistência");
  if (!n || !r) return;
  const o = J$(e, n), s = ew(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await dm(s, r);
    await ow(c.roll);
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
    Z$(t, u), X$(t, u), iw(n, u), await sw(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Z$(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ec, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function X$(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? lc(t);
  if (r) {
    r.textContent = mc(t);
    return;
  }
  n.append(a);
}
function J$(e, t) {
  const n = q.get(t);
  if (n) return n;
  const r = on(e);
  return Y(r)[t] ?? null;
}
function ew(e, t) {
  const n = e?.resistanceTargetActor;
  if (H(n)) return n;
  const a = e?.context?.targets.map(Ar).find(H) ?? null;
  if (a) return a;
  const o = t.getAttribute(Xl) ?? e?.resistanceTargetActorId ?? null, s = o ? nw(o) : null;
  return s || rw(
    t.getAttribute(Jl) ?? e?.resistanceTargetName ?? tw(t)
  );
}
function tw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${tc}`)?.textContent ?? null;
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
function nw(e) {
  const n = game.actors?.get?.(e);
  return H(n) ? n : dc().map((o) => at(o)).find((o) => o?.id === e) ?? null;
}
function rw(e) {
  const t = De(e);
  if (!t) return null;
  const n = dc().filter((o) => De(aw(o)) === t).map((o) => at(o)).find(H) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => H(o) && De(o.name) === t);
  return H(a) ? a : null;
}
function dc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function aw(e) {
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
function mc(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function ow(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function iw(e, t) {
  const n = q.get(e);
  n && (n.resistanceRollResult = t);
}
async function sw(e, t, n) {
  const r = on(e);
  if (r)
    try {
      const a = Y(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await je(r, a);
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
async function lw(e, t) {
  if (ic(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(an);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    fc(e, e.getAttribute(fa) ?? "✓ Automação aplicada"), cw(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function fc(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(nc), e.removeAttribute(an), e.removeAttribute(fa);
}
function cw(e) {
  const t = e.getAttribute(fr);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${fr}="${Ge(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Wl) ?? "✓ Outra opção escolhida";
    fc(a, o);
  }
}
function pc(e, t) {
  const n = e.map(ha).filter(xw), r = n.find((p) => p.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = v(e, "Forma"), o = v(e, "Custo"), s = v(e, "Dados") ?? v(e, `Dados (${r.label})`), l = v(e, "Tipo"), c = v(e, "Resistência"), u = v(e, "Resistência Perícia"), m = v(e, "Resistência Rótulo") ?? (u ? fe(u) : null), y = gc(e, "Observação"), R = e.filter((p) => mw(p, r)), b = uw(e);
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
function uw(e) {
  const t = e.map(ha).find((o) => o?.intent === "casting") ?? null, n = v(e, "Conjuração DT"), r = v(e, "Conjuração Resultado");
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
function ha(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: dw(n)
  } : null;
}
function dw(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function v(e, t) {
  return gc(e, t)[0] ?? null;
}
function gc(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function mw(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || ha(e) ? !1 : e.trim().length > 0;
}
function fw(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of q.values())
    _r(r, e, t) && n.set(r.pendingId, r);
  for (const r of bw(e))
    _r(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function _r(e, t, n) {
  const r = te(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !bi(n, "itemId", e.itemId) ? !1 : !e.actorId || bi(n, "actorId", e.actorId);
}
function bi(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Bw(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function pw(e) {
  const t = Ge(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function gw(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (_r(e, null, t))
      return t;
  return null;
}
function hw() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of q.entries())
    e - r.createdAt > t && q.delete(n);
}
async function Ai(e, t) {
  const n = on(e);
  if (!n) return !1;
  try {
    const r = Y(n);
    return r[t.pendingId] = Aa(t, te(n)), await je(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function ya(e) {
  const t = Ac(e);
  if (!t) return !1;
  try {
    const n = Y(t);
    return n[e.pendingId] = Aa(e, te(t)), await je(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function hc(e) {
  for (const t of f$)
    globalThis.setTimeout(() => {
      Tr(e);
    }, t);
}
async function Tr(e) {
  const t = Ac(e);
  if (ba(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await ya(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function yw(e, t) {
  const n = bc(e.context.message);
  if (n)
    try {
      const r = Y(n), a = r[e.pendingId] ?? Aa(e, te(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await je(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function bw(e) {
  return Object.values(Y(K(e))).filter(ut);
}
function Y(e) {
  if (!e) return {};
  const t = {}, n = ba(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(yc(e)))
    t[r] ??= a;
  return t;
}
function Aw(e) {
  return Object.values(yc(K(e))).filter(ut);
}
function yc(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Vl);
  if (!Oe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    ut(a) && (n[r] = a);
  return n;
}
async function je(e, t) {
  typeof e.setFlag == "function" && (await Tw(e, t), await _w(e, t));
}
async function _w(e, t) {
  await Promise.resolve(e.setFlag?.(d, Vl, t));
}
function ba(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Hl);
  return Pw(t) ? t : null;
}
async function Tw(e, t) {
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
      actorName: Rw(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Hl, a));
}
function Rw(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Aa(e, t) {
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
function bc(e) {
  const t = K(e);
  if (t?.setFlag)
    return t;
  const n = $w(e);
  if (n?.setFlag)
    return n;
  const r = te(e);
  if (!r) return null;
  const a = game.messages;
  return K(a?.get?.(r));
}
function $w(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(K).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Ac(e) {
  const t = bc(e.context.message);
  if (t) return t;
  const n = e.messageId ? ww(e.messageId) : null;
  if (n) return n;
  const r = Rc().slice().reverse();
  return r.find((a) => kw(a, e)) ?? r.find((a) => Ew(a, e)) ?? null;
}
function ww(e) {
  const t = game.messages;
  return K(t?.get?.(e));
}
function kw(e, t) {
  const n = te(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!_c(e, t)) return !1;
  const a = Tc(e);
  return !t.actorId || !a || a === t.actorId;
}
function Ew(e, t) {
  if (!Cw(e, t)) return !1;
  const n = Tc(e);
  return t.actorId && n === t.actorId ? !0 : _c(e, t);
}
function _c(e, t) {
  const n = De(Iw(e));
  if (!n) return !1;
  const r = De(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = De(t.itemId);
  return !!(a && n.includes(a));
}
function Iw(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Tc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Cw(e, t) {
  const n = Sw(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= p$;
}
function Sw(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function K(e) {
  return e && typeof e == "object" ? e : null;
}
function ut(e) {
  return Oe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && se(e.resistanceTargetActorId) && se(e.resistanceTargetName) && Nw(e.resistanceRollResult) && Lw(e.actionPayload) && Cn(e.title) && Cn(e.buttonLabel) && Cn(e.executedLabel) && se(e.choiceGroupId) && se(e.skippedLabel) && se(e.actionSectionId) && se(e.actionSectionTitle) && Ow(e.summaryLines) : !1;
}
function Lw(e) {
  return e == null ? !0 : Oe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && Dw(e.resource) && vw(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Dw(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function vw(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Pw(e) {
  return Oe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && Oe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ut) : !1;
}
function Nw(e) {
  return e == null ? !0 : Oe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && se(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function xw(e) {
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
function Ow(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Mw(e) {
  return typeof e == "string" && e.length > 0;
}
function Rc() {
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
function Fw(e) {
  return e.trim().toLowerCase();
}
function Bw(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ge(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const _i = 1e3;
class Uw {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new lR(
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
      settings: Pa(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Pa();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Pi(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Ww(t.item) && n.executionMode === "ask") {
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
    const a = jw(
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
    const n = ga(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = Qw(r);
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
    return o.ok ? (await b$(t), await A$(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (h$(
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
      Kw(t.item),
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
      return a.ok ? (Hw(n, a.value), await Ps(a.value), {
        ok: !0,
        executedLabel: qw(a.value)
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
        Ti(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = vn();
    await y$({
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
      }), await fi({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Sn(s),
        skippedLabel: Ti(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: Yw(s)
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
    this.lastAttempt = Dn(
      t,
      n,
      r,
      a
    );
  }
}
function qw(e) {
  return Ns({ inputAmount: e.totalRawDamage });
}
function jw(e, t) {
  if (t.resistance || !Gw(t))
    return t;
  const n = Ml(e);
  return n ? { ...t, resistance: n } : t;
}
function Gw(e) {
  return zw(e) && !Vw(e);
}
function zw(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Vw(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Sn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Ti(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function Hw(e, t) {
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
function Ww(e) {
  return e.type === "ritual";
}
function Kw(e) {
  return h_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Yw(e) {
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
function Qw(e) {
  const t = e.actorUuid ? Zw(e.actorUuid) : null;
  if (Me(t)) return t;
  const n = e.actorId ? Xw(e.actorId) : null;
  return n || Jw(e.actorName);
}
function Zw(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Xw(e) {
  const n = game.actors?.get?.(e);
  if (Me(n)) return n;
  for (const r of $c()) {
    const a = _a(r);
    if (a?.id === e) return a;
  }
  return null;
}
function Jw(e) {
  const t = Ln(e);
  if (!t) return null;
  for (const a of $c()) {
    const o = ek(a);
    if (Ln(o) === t) {
      const s = _a(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Me(a) && Ln(a.name) === t
  );
  return Me(r) ? r : null;
}
function $c() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ek(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : _a(e)?.name ?? null;
}
function _a(e) {
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
function Ri(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function vn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class tk {
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
class nk {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = rk(t);
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
      reason: ak(r, n.preset)
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
function rk(e) {
  const t = e.getFlag(d, "automation");
  return $r(t) ? t : null;
}
function ak(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function _t(e) {
  return (t) => t.status === e;
}
class ok {
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
    const n = w(t.actorName), r = w(t.resource), a = w($i(t)), o = w(sk(t));
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
      (p) => `<li><strong>${w(p.id)}:</strong> ${w(p.formula)} = ${p.total} <em>(${w(ik(p.intent))})</em>${p.damageType ? ` — ${w(p.damageType)}` : ""}</li>`
    ), u = t.ritualCosts.map(
      (p) => `<li><strong>${w(p.itemName)}:</strong> ${p.circle}º círculo — ${p.amount} ${w(p.resource)} (${w(lk(p.source))})</li>`
    ), m = t.damageInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount}${p.damageType ? ` ${w(p.damageType)}` : ""} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (p) => `<li><strong>${w(p.actorName)}:</strong> ${w($i(p))} — ${p.before.value}/${p.before.max} &rarr; ${p.after.value}/${p.after.max}</li>`
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
function ik(e) {
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
function sk(e) {
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
function lk(e) {
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
function ck() {
  const e = new Ob(), t = new UA(e), n = new cs(new ls()), r = new us(new xr()), a = new qA(new kl()), o = new Bb(), s = new eA(o), l = new pA(e), c = new hA(), u = c.registerMany(
    _u()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new gA(), y = new mA(), R = bs(), b = new fs(R), p = new nk(
    c
  ), T = new tk(
    p,
    m,
    y
  ), Ae = new VA(), Q = new ok(Ae), _e = new zA(), O = new BA(), ne = new MA(
    t,
    s,
    Q,
    _e
  ), j = new GA(ne, _e), M = new Uw(
    j,
    t,
    s,
    n,
    b,
    Ae,
    O
  );
  return M.addStrategy(
    new uA(
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
    workflow: j,
    itemUseIntegration: M,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: T
  };
}
const { ApplicationV2: uk } = foundry.applications.api;
class Ft extends uk {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${z(Rr)}</p>
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
      ${n.length > 0 ? dk(n) : fk(t)}
    </section>
  `;
}
function dk(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(mk).join("")}</ol>`;
}
function mk(e) {
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
function fk(e) {
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
const Bt = `${d}.manageRitualPresets`, wi = `__${d}_ritualPresetHeaderControlRegistered`, pk = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function gk(e) {
  const t = globalThis;
  if (!t[wi]) {
    for (const n of pk)
      Hooks.on(n, (r, a) => {
        hk(r, a, e);
      });
    t[wi] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function hk(e, t, n) {
  Array.isArray(t) && bk(e) && (yk(e, n), !t.some((r) => r.action === Bt) && t.push({
    action: Bt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), wc(e, n);
    }
  }));
}
function yk(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Bt] && (e.options.actions[Bt] = (n) => {
    n.preventDefault(), n.stopPropagation(), wc(e, t);
  }));
}
function bk(e) {
  if (!game.user?.isGM) return !1;
  const t = kc(e);
  return t ? t.type === "agent" && st(t).length > 0 : !1;
}
function wc(e, t) {
  const n = kc(e);
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
function kc(e) {
  return ki(e.actor) ? e.actor : ki(e.document) ? e.document : null;
}
function ki(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ec = "data-paranormal-toolkit-ritual-roll-config", dt = "data-paranormal-toolkit-ritual-roll-field", ge = "data-paranormal-toolkit-ritual-roll-action", Ei = `__${d}_ritualRollConfigBlockRegistered`, Ak = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], _k = [
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
function Tk() {
  const e = globalThis;
  if (!e[Ei]) {
    Rk();
    for (const t of Ak)
      Hooks.on(t, (...n) => {
        $k(n[0], n[1]);
      });
    e[Ei] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Rk() {
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
function $k(e, t) {
  const n = Mk(e);
  if (!n || n.type !== "ritual") return;
  const r = Uk(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  kk(a);
  const o = Cc(n), s = Ol(n), l = Fk(n), c = Ek(n, s, o, l);
  vk(c, n, o, l), wk(a, c), Ta(c);
}
function wk(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function kk(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ec}]`)))
    t.remove();
}
function Ek(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Ec, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(Ii("strong", "Paranormal Toolkit")), s.append(Ii("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Lc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(Ik(t, r)), u.append(Ck(t, r)), u.append(Sk(t, r)), a.append(u), a.append(Lk(t, n, r)), a.append(Dk(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function Ik(e, t) {
  const n = ln("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(dt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = g_(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function Ck(e, t) {
  const n = ln("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(dt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of _k) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function Sk(e, t) {
  const n = ln("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(dt, "utilityLabel"), n.append(r), n;
}
function Lk(e, t, n) {
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
function Dk(e) {
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
function Ii(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function vk(e, t, n, r) {
  ze(e, "intent")?.addEventListener("change", () => Ta(e)), Li(e, "system.studentForm")?.addEventListener("change", () => Ci(e, t)), Li(e, "system.trueForm")?.addEventListener("change", () => Ci(e, t)), e.querySelector(`[${ge}="save"]`)?.addEventListener("click", () => {
    r && Pk(e, t, n);
  }), e.querySelector(`[${ge}="clear"]`)?.addEventListener("click", () => {
    r && Nk(e, t);
  });
}
async function Pk(e, t, n) {
  const r = e.querySelector(`[${ge}="save"]`);
  r?.setAttribute("disabled", "true"), ve(e, "Salvando configuração...");
  try {
    const a = xk(e, n);
    await f_(t, a), Ic(e, a), ve(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), ve(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Nk(e, t) {
  const n = e.querySelector(`[${ge}="clear"]`);
  n?.setAttribute("disabled", "true"), ve(e, "Limpando configuração...");
  try {
    await p_(t);
    const r = Ol(t);
    Ok(e, r), Ic(e, r), ve(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ve(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Ic(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Lc(t) ? "Configurada" : "Rascunho");
}
function xk(e, t) {
  return {
    schemaVersion: 1,
    intent: Sc(ze(e, "intent")?.value),
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
function Ok(e, t) {
  we(e, "intent", t.intent), we(e, "damageType", t.damageType ?? ""), we(e, "utilityLabel", t.utilityLabel ?? "Resultado"), we(e, "formula.base", t.forms.base.formula), we(e, "formula.discente", t.forms.discente.formula), we(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Ta(e);
}
function Ta(e) {
  const t = Sc(ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Ci(e, t) {
  const n = Cc(t);
  Si(e, "discente", n.discente), Si(e, "verdadeiro", n.verdadeiro);
}
function Si(e, t, n) {
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
function Cc(e) {
  const t = Bk(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Mk(e) {
  return vi(e.item) ? e.item : vi(e.document) ? e.document : null;
}
function Fk(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Bk(e) {
  const t = e.system;
  return qk(t) ? t : {};
}
function Li(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ze(e, t) {
  return e.querySelector(`[${dt}="${jk(t)}"]`);
}
function It(e, t) {
  return ze(e, t)?.value.trim() ?? "";
}
function Di(e, t) {
  const n = It(e, t);
  return n.length > 0 ? n : null;
}
function we(e, t, n) {
  const r = ze(e, t);
  r && (r.value = n);
}
function Sc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Lc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function Uk(e) {
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
function qk(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function jk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ce = null;
Hooks.once("init", () => {
  hu(), Wu(), Id(), $b(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Oa.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Oa.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ce = ck(), ce.itemUseIntegration.registerStrategies(), $d(ce.conditions), id(ce), yd(), fd(), Sb(), gk(ce), Tk(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Rr} inicializado.`);
});
function Gk() {
  if (!ce)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ce;
}
export {
  Gk as getToolkitServices
};
//# sourceMappingURL=main.js.map
