const d = "paranormal-toolkit", hs = "Paranormal Toolkit", wu = "ordemparanormal";
class gt {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function an(e) {
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
function ht(e) {
  const t = Zr(e);
  return t.ok ? y(t.value.definition) : t;
}
function Zr(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Jr(t) ? y(t) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Cu(e) {
  return Jr(e.getFlag(d, "automation"));
}
function Jr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Iu(t.source) && Su(t.definition);
}
function Su(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Lu) && (t.ritualForms === void 0 || Ou(t.ritualForms)) && (t.conditionApplications === void 0 || zu(t.conditionApplications));
}
function Iu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Lu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return vu(t);
    case "spendRitualCost":
      return Du(t);
    case "rollFormula":
      return Nu(t);
    case "modifyResource":
      return xu(t);
    case "chatCard":
      return Pu(t);
    default:
      return !1;
  }
}
function vu(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && bs(t);
}
function Du(e) {
  return e.type === "spendRitualCost";
}
function Nu(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || Ku(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function xu(e) {
  const t = e;
  return t.type === "modifyResource" && ys(t.actor) && Hu(t.resource) && Wu(t.operation) && bs(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Pu(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Ou(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Mu(a)
  );
}
function Mu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || w(t.label)) && (t.extraCost === void 0 || Xu(t.extraCost)) && (t.rollFormulaOverrides === void 0 || Zu(t.rollFormulaOverrides)) && (t.notes === void 0 || Qu(t.notes)) && (t.targeting === void 0 || Fu(t.targeting));
}
function Fu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Uu(t.mode) && w(t.label) && (t.optionLabel === void 0 || w(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Bu(t.template));
}
function Bu(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || to(t.distance)) && (t.width === void 0 || t.width === null || to(t.width));
}
function Uu(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function zu(e) {
  return Array.isArray(e) && e.every(qu);
}
function qu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && ys(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || ju(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel)) && (t.applyOnResistance === void 0 || Gu(t.applyOnResistance));
}
function Gu(e) {
  return e === "failure" || e === "success" || e === "always";
}
function ju(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Yu(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Vu(t.expiry));
}
function Vu(e) {
  return e === "turnStart" || e === "turnEnd";
}
function bs(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function ys(e) {
  return e === "self" || e === "target";
}
function Hu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Wu(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ku(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Yu(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Xu(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function to(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function Qu(e) {
  return Array.isArray(e) && e.every(w);
}
function Zu(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => w(t) && w(n)
  );
}
function ea(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(no);
    if (td(t))
      return Array.from(t).filter(no);
  }
  return [];
}
function Ju(e) {
  return ea(e)[0] ?? null;
}
function ed(e) {
  return ea(e).find(Cu) ?? null;
}
function td(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function no(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function bt(e) {
  return ea(e).filter((t) => t.type === "ritual");
}
function _s(e) {
  return bt(e)[0] ?? null;
}
function nd(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(an);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = nt("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = $t(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(oo);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = nt("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = $t(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await ar(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = nt("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = $t(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await ar(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: oo(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ro(e);
    },
    async applyBestPresetsToActorRituals() {
      return ro(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = nt("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = $t(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function ro(e) {
  const t = nt("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = bt(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), ao(t);
  const r = ao(t, n.length);
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
    const s = await ar(e, a, o.preset);
    r.applied.push(rd(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ad(r), r;
}
async function ar(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function rd(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: an(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function ao(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ad(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function oo(e) {
  return {
    preset: an(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function nt(e) {
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function $t(e) {
  const t = _s(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function De(e) {
  return e ? {
    id: e.id,
    source: {
      ...od(e.sourceActor),
      token: e.sourceToken
    },
    item: id(e.item),
    targets: e.targets.map(sd),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: io(e.rollRequests, As),
    rolls: io(e.rolls, ld),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(ta),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function ta(e) {
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
function od(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function id(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function sd(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function As(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ld(e) {
  return {
    ...As(e),
    total: e.total
  };
}
function io(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function cd(e) {
  return {
    getSelected() {
      return gt.getSelectedActor();
    },
    logResources() {
      const t = fe(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await Se(
        e,
        "Gasto de PE",
        fe("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Se(
        e,
        "Gasto de PD",
        fe("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Se(
        e,
        "Dano em PV",
        fe("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Se(
        e,
        "Cura de PV",
        fe("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Se(
        e,
        "Dano em SAN",
        fe("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Se(
        e,
        "Recuperação de SAN",
        fe("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Se(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    ud(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, ta(o));
}
function fe(e) {
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ud(e) {
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
const J = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function dd() {
  Et(J.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Et(J.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Et(J.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Et(J.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function or() {
  return {
    enabled: wt(J.enabled),
    console: wt(J.console),
    ui: wt(J.ui),
    chat: wt(J.chat)
  };
}
async function ae(e, t) {
  await game.settings.set(d, J[e], t);
}
function Et(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function wt(e) {
  return game.settings.get(d, e) === !0;
}
function md() {
  return {
    status() {
      return or();
    },
    async enable() {
      await ae("enabled", !0);
    },
    async disable() {
      await ae("enabled", !1);
    },
    async enableConsole() {
      await ae("console", !0);
    },
    async disableConsole() {
      await ae("console", !1);
    },
    async enableUi() {
      await ae("ui", !0);
    },
    async disableUi() {
      await ae("ui", !1);
    },
    async enableChat() {
      await ae("chat", !0);
    },
    async disableChat() {
      await ae("chat", !1);
    }
  };
}
const Ts = "ritual.costOnly", Rs = "ritual.simpleHealing", fd = "ritual.eletrocussao", pd = "ritual.definhar", ks = "ritual.simpleDamage", $s = "generic.simpleHealing", Es = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7"
}, na = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function gd() {
  return [
    hd(),
    bd(),
    yd(),
    _d(),
    Ad(),
    Td()
  ];
}
function hd() {
  return {
    id: Ts,
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
function bd() {
  return {
    id: Rs,
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
    automation: ws(),
    itemPatch: Ed()
  };
}
function yd() {
  return {
    id: fd,
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
    automation: kd(),
    itemPatch: Cd()
  };
}
function _d() {
  return {
    id: pd,
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
    automation: $d(),
    itemPatch: wd()
  };
}
function Ad() {
  return {
    id: ks,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ra()
  };
}
function Td() {
  return {
    id: $s,
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
function ws(e = Es) {
  const t = Rd(e);
  return Cs(
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
function Rd(e) {
  return typeof e == "string" ? {
    base: e,
    discente: e,
    verdadeiro: e
  } : {
    ...Es,
    ...e
  };
}
function kd() {
  return {
    ...ra("3d6", {
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
function $d() {
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
function ra(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Cs(
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
function Ed() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: na,
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
function wd() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: na,
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
function Cd() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: na,
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
function Cs(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function aa() {
  return Array.from(game.user?.targets ?? []).map(Ss);
}
function Ss(e) {
  return {
    tokenId: Ne(e.id),
    actorId: Ne(e.actor?.id),
    sceneId: Ne(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Is() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Ne(e.id),
    actorId: Ne(t?.id),
    sceneId: Ne(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Ne(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Sd(e) {
  return {
    logFirstRitualCost() {
      const t = pe("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ge(t);
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
      const r = pe("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = ge(r);
      if (a) {
        if (!vd(t, n)) {
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
      const t = pe("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ge(t);
      n && (await n.unsetFlag(d, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = pe("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ge(t);
      if (!n) return;
      const r = e.automationRegistry.require(Ts);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = pe("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ge(n);
      if (!r) return;
      if (!so(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Rs);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: ws(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = pe("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ge(n);
      if (!r) return;
      if (!so(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(ks);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: ra(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = pe("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ge(t);
      n && await Id(e, t, n);
    }
  };
}
async function Id(e, t, n) {
  const r = ht(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Is(),
    item: n,
    targets: aa()
  });
  if (!a.ok) {
    Ld(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", De(a.value.context));
}
function Ld(e) {
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
function pe(e) {
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ge(e) {
  const t = _s(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function vd(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function so(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Dd = ["strict", "open"], Ls = "strict";
function Nd(e) {
  return Dd.includes(e) ? e : Ls;
}
function xd(e) {
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
function on(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Pd = ["disabled", "ask", "automatic"], Od = ["buttons", "confirm"], vs = "ask";
function Md(e) {
  return typeof e == "string" && Pd.includes(e);
}
function Fd(e) {
  return typeof e == "string" && Od.includes(e);
}
function Bd(e) {
  return Md(e) ? e : Fd(e) ? "ask" : vs;
}
const Ud = ["keep", "replace"], zd = ["manual", "assisted"], Ds = "keep", Ns = "assisted", qd = !0, P = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Gd() {
  game.settings.register(d, P.executionMode, {
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
    default: vs
  }), game.settings.register(d, P.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Ds
  }), game.settings.register(d, P.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Ns
  }), game.settings.register(d, P.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Ls
  }), game.settings.register(d, P.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: qd
  }), game.settings.register(d, P.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ir() {
  const e = Bd(game.settings.get(d, P.executionMode)), t = Os(game.settings.get(d, P.systemCardMode)), n = Ms(game.settings.get(d, P.damageResolutionMode)), r = oa();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Ps()
  };
}
function xs() {
  return Os(game.settings.get(d, P.systemCardMode));
}
function jd() {
  return Ms(game.settings.get(d, P.damageResolutionMode));
}
function oa() {
  return Nd(game.settings.get(d, P.resistanceGateMode));
}
function Ps() {
  return game.settings.get(d, P.ritualCastingCheckEnabled) === !0;
}
async function he(e) {
  await game.settings.set(d, P.executionMode, e);
}
function Os(e) {
  return Ud.includes(e) ? e : Ds;
}
function Ms(e) {
  return zd.includes(e) ? e : Ns;
}
function Vd(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await he("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await he(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await he("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await he("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Hd = [
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
function Wd(e) {
  return {
    phases() {
      return Hd;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Sn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ed(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await lo(e, t, n);
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
      if (!Xd(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Yd(n) ?? Sn("Nenhum ator encontrado para executar automação do item.");
      r && await lo(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Sn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Ju(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require($s);
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
async function lo(e, t, n) {
  const r = ht(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Is(),
    item: n,
    targets: aa()
  });
  if (!a.ok) {
    Kd(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", De(a.value.context));
}
function Kd(e) {
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
function Sn(e) {
  const t = gt.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Yd(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Xd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Qd(e) {
  const t = cd(e), n = nd(e), r = Sd(e), a = Wd(e), o = md(), s = Vd(e);
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
const Pt = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function Zd(e) {
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
      const r = co();
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
      return Jd(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = co();
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
      return em(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function co() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function Jd(e) {
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
function em(e) {
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
function Ie(e) {
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
function tm(e) {
  const t = e.imageUrl.trim(), n = t ? `<img class="ptk-chat-card-header__image" src="${Ie(t)}" alt="${Ie(e.imageAlt ?? "")}">` : '<span class="ptk-chat-card-header__image-placeholder" aria-hidden="true"></span>', r = e.badge ? `<span class="ptk-chat-card-header__badge ptk-chat-card-header__badge--${e.badge.tone}">${Ie(e.badge.label)}</span>` : "";
  return `<header class="ptk-chat-card-header">
  <div class="ptk-chat-card-header__media">${n}</div>
  <div class="ptk-chat-card-header__content">
    <div class="ptk-chat-card-header__top-row">
      <span class="ptk-chat-card-header__eyebrow">${Ie(e.eyebrow)}</span>
      ${r}
    </div>
    <h3 class="ptk-chat-card-header__title">${Ie(e.title)}</h3>
    <p class="ptk-chat-card-header__target">${Ie(e.target)}</p>
  </div>
</header>`;
}
function nm(e) {
  return `<article class="ptk-chat-card-shell">${e.content}</article>`;
}
function rm() {
  return {
    async postRitualHeaderExample(e) {
      if (!game.user?.isGM)
        throw new Error("Apenas GMs podem publicar o exemplo de cabeçalho de ritual.");
      const n = {
        single: "Malvadão",
        none: "Nenhum alvo",
        multi: "3 alvos"
      }[e];
      if (!n)
        throw new Error('Exemplo inválido. Use "single", "none" ou "multi".');
      return ChatMessage.create({
        content: nm({
          content: tm({
            imageUrl: "icons/sundries/books/book-symbol-reverse-blue.webp",
            imageAlt: "Ícone do ritual Eletrocussão",
            eyebrow: "Ritual",
            title: "Eletrocussão",
            target: n,
            badge: { label: "Energia 1", tone: "energy" }
          })
        })
      });
    }
  };
}
function am(e) {
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
    conditions: Zd(e.conditions),
    debug: Qd(e),
    dev: rm(),
    hooks: Pt
  }, n = globalThis;
  n[d] = t, n.ParanormalToolkit = t;
  const r = game.modules.get(d);
  return r && (r.api = t), t;
}
class uo {
  static isSupportedSystem() {
    return game.system.id === wu;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
const In = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function om(e) {
  if (!dm(e.item)) return null;
  const t = sr(e.actor) ? e.actor : im(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: lm(e.token) ?? sm(t),
    targets: aa(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function im(e) {
  const t = e;
  return sr(t.actor) ? t.actor : sr(e.parent) ? e.parent : null;
}
function sm(e) {
  const t = cm(e) ?? um(e);
  return t ? Fs(t) : null;
}
function lm(e) {
  return lr(e) ? Fs(e) : null;
}
function cm(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return lr(n) ? n : (t.getActiveTokens?.() ?? []).find(lr) ?? null;
}
function um(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Fs(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Ln(e.id),
    actorId: Ln(t?.id),
    sceneId: Ln(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function dm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function sr(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function lr(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Ln(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Bs {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(In.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${In.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = om(mm(t));
    if (!n) {
      f.warn(`${In.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function mm(e) {
  return e && typeof e == "object" ? e : {};
}
function Gt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function ia() {
  const e = globalThis.game;
  return sn(e) ? e : null;
}
function W(e, t) {
  const n = fm(e, t);
  return Ot(n);
}
function fm(e, t) {
  return t.split(".").reduce((n, r) => sn(n) ? n[r] : null, e);
}
function pm(e, t) {
  const n = e.indexOf(":");
  return n < 0 || ut(e.slice(0, n)) !== ut(t) ? null : He(e.slice(n + 1));
}
function Ot(e) {
  return typeof e == "string" ? He(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function sn(e) {
  return !!e && typeof e == "object";
}
function gm(e) {
  return typeof e == "string";
}
function ln(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function He(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function ut(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function cr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function ce(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Us(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const jt = "abilityRollConfig", zs = [
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
], ur = 20, dr = 20, hm = [10, 40, 65, 99];
function qs() {
  return {
    schemaVersion: 1,
    rolls: [Gs(1)]
  };
}
function Gs(e) {
  return {
    id: ym(),
    label: e === 1 ? "Rolagem" : `Rolagem ${e}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: ""
    }
  };
}
function bm() {
  return hm.map((e) => ({ minNex: e, formula: "" }));
}
function ym() {
  const t = globalThis.crypto?.randomUUID?.();
  return t ? `roll-${t}` : `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function js(e) {
  return sa(
    e.getFlag(d, jt)
  );
}
function _m(e) {
  return js(e) ?? qs();
}
async function Am(e, t) {
  const n = sa(t);
  if (!n)
    throw new Error("Configuração de rolagens da habilidade inválida.");
  return await e.setFlag(d, jt, n), n;
}
async function Tm(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(
      t.call(e, d, jt)
    );
    return;
  }
  await e.setFlag(d, jt, null);
}
function sa(e) {
  if (!Be(e) || !Array.isArray(e.rolls)) return null;
  const t = /* @__PURE__ */ new Set();
  return {
    schemaVersion: 1,
    rolls: e.rolls.slice(0, ur).map((r, a) => Cm(r, a, t)).filter((r) => r !== null)
  };
}
function Rm(e, t) {
  const n = js(t);
  return n ? km(n, $m(e)) : [];
}
function km(e, t) {
  const n = [];
  for (const r of e.rolls) {
    if (r.formula.mode === "fixed") {
      const l = r.formula.formula.trim();
      if (!l) continue;
      n.push({
        id: r.id,
        sourceRollId: r.id,
        label: r.label,
        intent: r.intent,
        damageType: r.intent === "damage" ? r.damageType : null,
        formula: l,
        nexThreshold: null
      });
      continue;
    }
    const a = r.formula.steps.filter(
      (l) => l.formula.trim().length > 0 && l.minNex <= t
    );
    if (a.length === 0) continue;
    const o = a.at(-1);
    if (!o) continue;
    const s = r.formula.resolution === "choose-unlocked" ? a : [o];
    for (const l of s)
      n.push({
        id: r.formula.resolution === "choose-unlocked" ? `${r.id}--nex-${l.minNex}` : r.id,
        sourceRollId: r.id,
        label: r.label,
        intent: r.intent,
        damageType: r.intent === "damage" ? r.damageType : null,
        formula: l.formula.trim(),
        nexThreshold: l.minNex
      });
  }
  return n;
}
function $m(e) {
  const t = Be(e.system) ? e.system : {}, n = t.NEX ?? t.nex, r = Be(n) ? n.value : n, a = typeof r == "number" ? r : Number(r);
  return Number.isFinite(a) ? Hs(a) : 0;
}
function Vs(e) {
  return zs.find((t) => t.value === e)?.label ?? e;
}
function Em(e) {
  switch (e) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}
function wm(e) {
  return e.rolls.some((t) => t.formula.mode === "fixed" ? t.formula.formula.trim().length > 0 : t.formula.steps.some((n) => n.formula.trim().length > 0));
}
function Cm(e, t, n) {
  if (!Be(e)) return null;
  const r = `roll-${t + 1}`, a = Nm(Dm(e.id, r), n), o = Lm(e.intent), s = Sm(e.formula);
  return !o || !s ? null : {
    id: a,
    label: cn(e.label) || `Rolagem ${t + 1}`,
    intent: o,
    damageType: o === "damage" ? xm(e.damageType) : null,
    formula: s
  };
}
function Sm(e) {
  if (!Be(e)) return null;
  if (e.mode === "fixed")
    return {
      mode: "fixed",
      formula: cn(e.formula)
    };
  if (e.mode !== "nex") return null;
  const t = Array.isArray(e.steps) ? e.steps.slice(0, dr).map(Im).filter((r) => r !== null) : [];
  t.sort((r, a) => r.minNex - a.minNex);
  const n = /* @__PURE__ */ new Map();
  for (const r of t) n.set(r.minNex, r);
  return {
    mode: "nex",
    resolution: vm(e.resolution),
    steps: [...n.values()]
  };
}
function Im(e) {
  if (!Be(e)) return null;
  const t = typeof e.minNex == "number" ? e.minNex : Number(e.minNex);
  return Number.isFinite(t) ? {
    minNex: Hs(t),
    formula: cn(e.formula)
  } : null;
}
function Lm(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function vm(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function Dm(e, t) {
  return typeof e != "string" ? t : e.trim().replace(/[^a-z0-9_-]+/giu, "-").replace(/^-+|-+$/gu, "").slice(0, 80) || t;
}
function Nm(e, t) {
  let n = e, r = 2;
  for (; t.has(n); )
    n = `${e}-${r}`, r += 1;
  return t.add(n), n;
}
function Hs(e) {
  return Math.min(99, Math.max(0, Math.trunc(e)));
}
function cn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function xm(e) {
  const t = cn(e);
  return t.length > 0 ? t : null;
}
function Be(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const la = "data-paranormal-toolkit-ability-roll-id";
function Pm(e) {
  if (!Ws(e) || e.version !== 2 || !Array.isArray(e.rolls))
    return null;
  const t = se(e.actorUuid), n = se(e.itemUuid), r = se(e.abilityName);
  if (!t) return null;
  const a = e.rolls.map(Om).filter((o) => o !== null);
  return {
    version: 2,
    actorUuid: t,
    itemUuid: n,
    abilityName: r || "Habilidade",
    rolls: a,
    resource: e.resource === "PD" ? "PD" : "PE",
    cost: vn(e.cost),
    spentResource: e.spentResource === !0,
    resourceBefore: vn(e.resourceBefore),
    resourceAfter: vn(e.resourceAfter)
  };
}
function Om(e) {
  if (!Ws(e)) return null;
  const t = se(e.id), n = se(e.sourceRollId), r = se(e.label), a = se(e.formula), o = Mm(e.intent);
  if (!t || !n || !r || !a || !o) return null;
  const s = typeof e.nexThreshold == "number" && Number.isFinite(e.nexThreshold) ? Math.max(0, Math.min(99, Math.trunc(e.nexThreshold))) : null;
  return {
    id: t,
    sourceRollId: n,
    label: r,
    formula: a,
    intent: o,
    damageType: o === "damage" ? Fm(e.damageType) : null,
    nexThreshold: s
  };
}
function Mm(e) {
  return e === "generic" || e === "damage" || e === "healing" ? e : null;
}
function se(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Fm(e) {
  const t = se(e);
  return t.length > 0 ? t : null;
}
function vn(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : 0;
}
function Ws(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const mo = "paranormalToolkitAbilityRollBound";
let fo = !1;
function Bm() {
  if (fo) return;
  fo = !0;
  const e = (t, n) => {
    Um(t, Gt(n));
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), f.info("Ações de rolagem de habilidades registradas no chat.");
}
function Um(e, t) {
  if (!t) return 0;
  const n = `[${la}]`, r = Ym(t, n);
  let a = 0;
  for (const o of r)
    o.dataset[mo] !== "true" && (o.dataset[mo] = "true", o.addEventListener("click", () => {
      zm(e, o);
    }), a += 1);
  return a;
}
async function zm(e, t) {
  const n = t.getAttribute(la)?.trim();
  if (!n) return;
  const r = qm(e), a = r?.rolls.find((l) => l.id === n);
  if (!r || !a) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card."
    );
    return;
  }
  const o = await Gm(r.actorUuid);
  if (!o) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade."
    );
    return;
  }
  if (!Hm(o)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem."
    );
    return;
  }
  const s = jm();
  if (!s) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível."
    );
    return;
  }
  po(t, !0);
  try {
    const l = new s(
      a.formula,
      Vm(o)
    ), c = await Promise.resolve(l.evaluate());
    await Promise.resolve(
      c.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: o }),
        flavor: Wm(r.abilityName, a)
      })
    );
  } catch (l) {
    console.warn(
      "Paranormal Toolkit: não foi possível executar a rolagem da habilidade.",
      l
    ), ui.notifications?.warn(
      `Paranormal Toolkit: não foi possível rolar ${a.label}. Revise a fórmula configurada.`
    );
  } finally {
    po(t, !1);
  }
}
function qm(e) {
  const t = e;
  return typeof t?.getFlag != "function" ? null : Pm(
    t.getFlag(d, "abilityUse")
  );
}
async function Gm(e) {
  const t = globalThis;
  if (typeof t.fromUuid == "function")
    try {
      const o = await t.fromUuid(e);
      if (go(o)) return o;
    } catch (o) {
      f.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${e}.`,
        o
      );
    }
  const n = e.startsWith("Actor.") ? e.slice(6) : e, a = game.actors?.get?.(n);
  return go(a) ? a : null;
}
function jm() {
  const e = globalThis.Roll;
  return typeof e == "function" ? e : null;
}
function Vm(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
function Hm(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
function Wm(e, t) {
  const n = [Km(t)];
  return t.nexThreshold !== null && n.push(`NEX ${t.nexThreshold}%`), `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${Dn(e)}</strong>
      <span>${Dn(t.label)}</span>
      <small>${Dn(n.join(" · "))}</small>
    </div>
  `;
}
function Km(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Vs(e.damageType)}` : "Dano";
  }
}
function Ym(e, t) {
  const n = [];
  return e instanceof HTMLButtonElement && e.matches(t) && n.push(e), "querySelectorAll" in e && n.push(
    ...Array.from(e.querySelectorAll(t))
  ), n;
}
function po(e, t) {
  e.disabled = t, e.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    t
  );
  const n = e.querySelector("i");
  n && (n.classList.toggle("fa-dice-d20", !t), n.classList.toggle("fa-spinner", t), n.classList.toggle("fa-spin", t));
}
function go(e) {
  return !!(e && typeof e == "object" && "system" in e && ("uuid" in e || "id" in e));
}
function Dn(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
const Xm = "paranormal-toolkit-chat-message--full-width-card", ho = ".paranormal-toolkit-ability-card", bo = "li.chat-message";
let yo = !1;
function Qm() {
  if (yo) return;
  yo = !0;
  const e = Hooks, t = (n, r) => {
    _o(Gt(r));
  };
  e.on("renderChatMessageHTML", t), e.on("renderChatMessage", t), _o(document);
}
function _o(e) {
  if (!e) return 0;
  const t = ca(e), n = Zm(t), r = /* @__PURE__ */ new Set();
  for (const a of n) {
    const o = Jm(t, a);
    o?.classList && r.add(o);
  }
  for (const a of r)
    a.classList?.add(Xm);
  return r.size;
}
function Zm(e) {
  const t = [];
  e.matches?.(ho) && t.push(e);
  const n = e.querySelectorAll?.(ho);
  if (!n) return t;
  for (const r of Array.from(n)) {
    const a = ca(r);
    t.includes(a) || t.push(a);
  }
  return t;
}
function Jm(e, t) {
  if (e.matches?.(bo)) return e;
  const n = t.closest?.(bo);
  return n ? ca(n) : null;
}
function ca(e) {
  return e && typeof e == "object" ? e : {};
}
function ef(e) {
  const t = tf(e.cost), n = nf(e.currentResource), r = t > 0 && !e.passive, a = n >= t;
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
function tf(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
function nf(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
const { ApplicationV2: rf } = foundry.applications.api;
class st extends rf {
  constructor(t, n) {
    super({
      id: `${d}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${t.abilityName}`
      }
    }), this.resolveRequest = n, this.model = ef(t), this.spendResource = this.model.cost.spendResourceChecked;
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
      useAbility: st.onUseAbility,
      cancel: st.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new st(t, n).render({ force: !0 });
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
          src="${af(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${U(this.model.header.eyebrow)}</p>
          <h2>${U(this.model.header.title)}</h2>
          <p>${U(this.model.header.subtitle)}</p>
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
          <span data-paranormal-toolkit-ability-submit-label>${U(this.model.primaryActionLabel)}</span>
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
            <span>${U(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${U(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${U(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${U(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${t}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${U(this.model.cost.resource)} suficiente para pagar este custo.</span>
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
          <div><dt>Personagem</dt><dd>${U(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${U(t)}</p>
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
function U(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function af(e) {
  return U(e);
}
function of(e, t) {
  const n = mf(t.system), r = Vt(n.activation), a = uf(r), o = lf();
  return {
    actor: e,
    item: t,
    name: t.name ?? "Habilidade sem nome",
    image: ff(t),
    activation: r,
    activationLabel: cf(r),
    description: Vt(n.description),
    chatDescription: sf(
      n.chatDescription,
      n.description
    ),
    cost: a ? 0 : df(n.cost),
    resource: o,
    passive: a,
    rolls: Rm(e, t)
  };
}
function sf(e, t) {
  const n = Vt(e);
  return n.trim().length > 0 ? n : Vt(t);
}
function lf() {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === !0 ? "PD" : "PE";
}
function cf(e) {
  if (!e) return "—";
  const t = `op.executionChoices.${e}`, r = pf()?.(t) ?? t;
  return r === t ? e : r;
}
function uf(e) {
  const t = e.trim().toLocaleLowerCase("pt-BR");
  return t === "passive" || t === "passiva" || t.includes("passiv");
}
function df(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.trunc(t)) : 0;
}
function mf(e) {
  return e && typeof e == "object" ? e : {};
}
function Vt(e) {
  return typeof e == "string" ? e : "";
}
function ff(e) {
  const t = e;
  return typeof t.img == "string" && t.img.length > 0 ? t.img : "icons/svg/item-bag.svg";
}
function pf() {
  const e = game;
  return typeof e.i18n?.localize == "function" ? e.i18n.localize.bind(e.i18n) : null;
}
class gf {
  async publish(t, n, r) {
    const a = await Tf(n), o = hf({
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
      resourceAfter: r.resourceAfter,
      rolls: n.rolls
    }), s = {
      version: 2,
      actorUuid: n.actor.uuid ?? n.actor.id ?? "",
      itemUuid: n.item.uuid ?? n.item.id ?? "",
      abilityName: n.name,
      rolls: n.rolls,
      resource: n.resource,
      cost: n.cost,
      spentResource: r.spentResource,
      resourceBefore: r.resourceBefore,
      resourceAfter: r.resourceAfter
    }, l = {
      speaker: ChatMessage.getSpeaker({ actor: n.actor }),
      content: o,
      flags: {
        [d]: {
          abilityUse: s
        }
      }
    }, c = Af(t.message);
    if (xs() === "replace" && c) {
      await c.update(l);
      return;
    }
    await ChatMessage.create(l);
  }
}
function hf(e) {
  const t = e.cost > 0 ? `${e.cost} ${e.resource}` : "Nenhum", n = e.cost <= 0 || e.passive ? "Sem gasto de recurso" : e.spentResource ? `${e.cost} ${e.resource} gastos (${e.resourceBefore} → ${e.resourceAfter})` : `${e.cost} ${e.resource} não descontados`, r = e.cost <= 0 || e.passive ? "paranormal-toolkit-ability-card__status--neutral" : e.spentResource ? "paranormal-toolkit-ability-card__status--spent" : "paranormal-toolkit-ability-card__status--not-spent", a = bf(e.rolls), o = _f(e.description);
  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${mr(e.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${ie(e.abilityName)}</h3>
          <p>${ie(e.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${ie(e.activationLabel)}</span>
        <span><strong>Custo</strong>${ie(t)}</span>
      </div>

      ${a}
      ${o}

      <footer class="paranormal-toolkit-ability-card__status ${r}">
        <i class="fa-solid ${e.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${ie(n)}</span>
      </footer>
    </article>
  `;
}
function bf(e) {
  return e.length === 0 ? "" : `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${e.map((n) => {
    const r = `paranormal-toolkit-ability-card__roll--${n.intent}`, a = yf(n), o = n.nexThreshold === null ? "" : `<span>NEX ${n.nexThreshold}%</span>`;
    return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${r}"
          ${la}="${mr(n.id)}"
          title="${mr(n.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${ie(n.label)}</strong>
            <small>${ie(a)}</small>
          </span>
          ${o}
        </button>
      `;
  }).join("")}
      </div>
    </section>
  `;
}
function yf(e) {
  switch (e.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return e.damageType ? `Dano · ${Vs(e.damageType)}` : "Dano";
  }
}
function _f(e) {
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
function Af(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.update == "function" ? t : null;
}
function ie(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function mr(e) {
  return ie(e);
}
async function Tf(e) {
  const t = e.chatDescription || e.description, n = Rf();
  return !n || !t ? t : n.enrichHTML(t, {
    relativeTo: e.item,
    rollData: kf(e.actor)
  });
}
function Rf() {
  const t = foundry.applications?.ux?.TextEditor?.implementation;
  return typeof t?.enrichHTML == "function" ? t : null;
}
function kf(e) {
  const n = e.getRollData?.();
  return n && typeof n == "object" ? n : {};
}
class $f {
  constructor(t, n, r = new gf()) {
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
    if (!Ef(n))
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade."
      );
    const r = of(n, t.item), a = this.readCurrentResource(r);
    if (!a.ok)
      return this.fail(
        "resource-unavailable",
        a.message
      );
    const o = await st.request({
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
function Ef(e) {
  return game.user?.isGM ? !0 : e.isOwner === !0;
}
const Ao = 1e3;
class wf {
  workflow;
  strategy;
  inFlight = /* @__PURE__ */ new Set();
  recentExecutions = /* @__PURE__ */ new Map();
  constructor(t, n) {
    this.workflow = new $f(t, n), this.strategy = new Bs(
      (r) => this.handleItemUsed(r)
    );
  }
  register() {
    this.strategy.register(), Qm(), Bm(), f.info("Workflow genérico de habilidades registrado.");
  }
  async handleItemUsed(t) {
    if (ir().executionMode === "disabled" || !Sf(t.item)) return;
    const n = If(t);
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
    return n !== void 0 && Date.now() - n < Ao;
  }
  pruneRecentExecutions() {
    const t = Date.now() - Ao;
    for (const [n, r] of this.recentExecutions)
      r < t && this.recentExecutions.delete(n);
  }
}
function Cf(e, t) {
  const n = new wf(e, t);
  return n.register(), n;
}
function Sf(e) {
  if (e.type !== "ability") return !1;
  const t = Zr(e);
  return !t.ok && t.error.reason === "missing-automation";
}
function If(e) {
  const t = e.actor?.uuid ?? e.actor?.id ?? "missing-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "missing-item";
  return `${t}|${n}`;
}
let To = !1, Nn = !1, xn = !1, Ct = null;
const Lf = 1e3, vf = 750, Df = 1e3;
function Nf(e) {
  To || (Hooks.on("combatTurnChange", (t) => {
    Pf(e, Ro(t));
  }), Hooks.on("deleteCombat", (t) => {
    Of(e, Ro(t));
  }), To = !0, xf(e));
}
function xf(e) {
  un() && (Nn || (Nn = !0, globalThis.setTimeout(() => {
    Nn = !1, ua(e, "ready");
  }, Lf)));
}
function Pf(e, t) {
  un() && t && (Ct && globalThis.clearTimeout(Ct), Ct = globalThis.setTimeout(() => {
    Ct = null, ua(e, "combat-turn-change", t);
  }, vf));
}
function Of(e, t) {
  un() && t && (xn || (xn = !0, globalThis.setTimeout(() => {
    xn = !1, ua(e, "combat-deleted", t);
  }, Df)));
}
async function ua(e, t, n) {
  if (un())
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
function un() {
  return game.user?.isGM === !0;
}
function Ro(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Ks = {
  enabled: "dice.animations.enabled"
};
function Mf() {
  game.settings.register(d, Ks.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ff() {
  return {
    enabled: game.settings.get(d, Ks.enabled) === !0
  };
}
const dn = "chatCard", ko = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, Bf = `.${i}__title`, Ys = `.${i}__header`, Uf = `.${i}__roll-card`, zf = `.${i}__roll-meta`, qf = `.${i}__roll-meta-pill`, da = `.${i}__resistance`, Gf = `.${i}__resistance-header`, Xs = `.${i}__resistance-description`, mn = `.${i}__resistance-roll-button`, Qs = `.${i}__resistance-roll-result`, $o = `${i}__resistance-content`, Zs = `.${i}__workflow-section`, Js = `.${i}__workflow-roll`, ma = `${i}__workflow-roll--dice-open`, fa = `.${i}__workflow-roll-formula`, pa = `${i}__workflow-roll-formula--toggle`, fn = `.${i}__workflow-dice-tray`, jf = `.${i}__roll-detail-toggle`, Vf = `.${i}__roll-detail-list`, Hf = `.${i}__ritual-element-badge`, Wf = `.${i}__ritual-metadata`, Kf = "casting-backlash", Yf = "data-paranormal-toolkit-action-section", Xf = "data-paranormal-toolkit-prompt-id", Qf = "data-paranormal-toolkit-pending-id", Eo = "data-paranormal-toolkit-casting-backlash-enhanced", wo = `.${i}`, Zf = `.${i}__workflow-section--casting`, Jf = `.${i}__workflow-section-header`, ep = `.${i}__workflow-notes`, tp = `[${Yf}="${Kf}"]`, Co = `${i}__workflow-section-title-row`, np = `${i}__workflow-section-header--casting-backlash`, el = `${i}__casting-backlash-button`;
function rp(e) {
  for (const t of ap(e))
    op(t), up(t);
}
function ap(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(wo) && t.add(e);
  for (const n of e.querySelectorAll(wo))
    t.add(n);
  return Array.from(t);
}
function op(e) {
  const t = e.querySelector(tp);
  if (!t) return;
  const n = ip(t);
  if (!n) return;
  const r = e.querySelector(`${Zf} ${Jf}`);
  r && (r.classList.add(np), sp(r), lp(n), r.append(n), t.remove());
}
function ip(e) {
  return e.querySelector(
    `button[${Qf}], button[${Xf}]`
  );
}
function sp(e) {
  const t = e.querySelector(`:scope > .${Co}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Co);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(el) || n.append(a));
  return n;
}
function lp(e) {
  if (e.getAttribute(Eo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = cp(t, e.disabled);
  e.classList.add(el), e.setAttribute(Eo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function cp(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function up(e) {
  for (const t of e.querySelectorAll(ep)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function dp(e) {
  for (const t of Array.from(e.querySelectorAll(Zs)))
    for (const n of Array.from(t.querySelectorAll(`${jf}, ${Vf}`)))
      n.remove();
}
const mp = {
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
}, fp = new Set(
  Object.values(mp)
), pp = {
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
function gp(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = hp(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = pp[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : fp.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function tl(e) {
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
function hp(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class nl {
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
      const g = bp(m, u);
      if (!g.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const _ = gp(m.damageType);
      if (!_.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (g.amount === 0) {
        s.push(
          yp(g.id, m, _.value)
        );
        continue;
      }
      try {
        const k = await Promise.resolve(
          o.call(n, g.amount, {
            damageType: _.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const $ of Ap(k.conditions))
          l.add($);
        const R = _p(k.newPV);
        R !== null && (c = R), s.push({
          id: g.id,
          label: m.label ?? tl(_.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: g.amount,
          finalDamage: So(k.finalDamage, g.amount),
          blocked: So(k.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: _.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (k) {
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: k
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
function bp(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function yp(e, t, n) {
  return {
    id: e,
    label: t.label ?? tl(n),
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
function So(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function _p(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ap(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class ga {
  async rollResistance(t) {
    const n = await Rp(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? Re(t.skill),
      roll: n,
      formula: $p(n),
      total: Ep(n),
      diceBreakdown: wp(n)
    };
  }
  getSkillLabel(t) {
    return Re(t);
  }
}
async function Tp(e, t) {
  return new ga().rollResistance({ actor: e, skill: t });
}
function Re(e) {
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
async function Rp(e, t) {
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
  return kp(r);
}
function kp(e) {
  return Io(e) ? e : Array.isArray(e) ? e.find(Io) ?? null : null;
}
function Io(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function $p(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ep(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function wp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Cp);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Cp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class rl {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class al {
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
function Sp(e, t) {
  const n = Pp(e?.rounds);
  if (!n)
    return Lo(null);
  const r = e?.anchor ?? ol(t);
  if (!r)
    return {
      ...Lo(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Ip(),
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
function ol(e) {
  const t = Op();
  if (!t?.id || !il(t.round)) return null;
  const n = Np(t), r = Lp(e, n) ?? Dp(t), a = oe(r?.id), o = Fp(r?.initiative), s = vp(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Mp()
  };
}
function Ip() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Lo(e) {
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
function Lp(e, t) {
  return e?.id ? t.find((n) => xp(n) === e.id) ?? null : null;
}
function vp(e, t, n) {
  const r = oe(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Bp(e.turn) ? e.turn : null;
}
function Dp(e) {
  return Mt(e.combatant) ? e.combatant : null;
}
function Np(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Mt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Mt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Mt);
  }
  return [];
}
function xp(e) {
  return oe(e.actor?.id) ?? oe(e.actorId) ?? oe(e.token?.actor?.id) ?? oe(e.token?.actorId) ?? oe(e.document?.actor?.id) ?? oe(e.document?.actorId);
}
function Pp(e) {
  return il(e) ? Math.trunc(e) : null;
}
function Op() {
  return game.combat ?? null;
}
function Mp() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Mt(e) {
  return !!(e && typeof e == "object");
}
function oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Fp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function il(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Bp(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class sl {
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
    if (!Yp(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = Sp(t.duration, r), s = Up(a, t, o), c = t.refreshExisting ?? !0 ? Xp(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(vo(r, a, c.id ?? null, !1, !0, o));
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
      return y(vo(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = cl(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Do(n, s) === "deleted" && (o += 1);
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
    const n = Jp(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = ha(s);
      a += l.length;
      for (const c of l) {
        if (!Gp(c, t)) continue;
        const u = ll(c);
        try {
          await Do(s, c) === "deleted" && (o += 1);
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
function Up(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: cg(),
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
    duration: zp(n.duration),
    start: qp(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function zp(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function qp(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: lg(),
    ...e
  };
}
function vo(e, t, n, r, a, o) {
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
function Gp(e, t) {
  const n = ll(e);
  if (!n.conditionId || !jp(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = sg();
  return n.durationMode === "combatantTurn" || Vp(n) ? Wp(n, r) : Hp(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !K(n.startRound) || !K(n.requestedRounds) || !K(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function jp(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && K(e.requestedRounds);
}
function Vp(e) {
  return !!(e.combatDurationApplied && K(e.requestedRounds) && K(e.startRound) && (e.startCombatantId || Ht(e.startTurn)));
}
function Hp(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Wp(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !K(e.startRound) || !K(e.requestedRounds) || !K(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Kp(t);
  return e.startCombatantId ? r === e.startCombatantId : Ht(e.startTurn) && Ht(t.turn) ? t.turn === e.startTurn : !1;
}
function Kp(e) {
  return xe(e.combatant?.id);
}
function ll(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ft(e, "conditionId"),
    requestedRounds: No(e, "requestedRounds") ?? rt(t.value) ?? rt(t.rounds),
    combatDurationApplied: Pn(e, "combatDurationApplied"),
    combatId: Ft(e, "combatId") ?? xe(n.combat) ?? xe(t.combat),
    startCombatantId: Ft(e, "startCombatantId") ?? xe(n.combatant),
    startInitiative: rg(e, "startInitiative") ?? ul(n.initiative),
    startRound: No(e, "startRound") ?? rt(n.round) ?? rt(t.startRound),
    startTurn: ng(e, "startTurn") ?? fr(n.turn) ?? fr(t.startTurn),
    expiryEvent: ag(e, "expiryEvent") ?? dl(t.expiry),
    durationMode: og(e, "durationMode"),
    deleteOnExpire: Pn(e, "deleteOnExpire"),
    expiresWithCombat: Pn(e, "expiresWithCombat")
  };
}
function Yp(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Xp(e, t) {
  return cl(e, t)[0] ?? null;
}
function cl(e, t) {
  return ha(e).filter((n) => tg(n) === t);
}
async function Do(e, t) {
  const n = t.id ?? null, r = n ? Qp(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Zp(a)) return "missing";
    throw a;
  }
}
function Qp(e, t) {
  return ha(e).find((n) => n.id === t) ?? null;
}
function Zp(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Jp() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      St(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    St(e, n);
  });
  for (const n of eg())
    St(e, n.actor), St(e, n.document?.actor);
  return Array.from(e.values());
}
function St(e, t) {
  if (!ig(t)) return;
  const r = xe(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function eg() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ha(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function tg(e) {
  return Ft(e, "conditionId");
}
function Ft(e, t) {
  return xe(Ee(e, t));
}
function No(e, t) {
  return rt(Ee(e, t));
}
function ng(e, t) {
  return fr(Ee(e, t));
}
function rg(e, t) {
  return ul(Ee(e, t));
}
function ag(e, t) {
  return dl(Ee(e, t));
}
function og(e, t) {
  const n = Ee(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Pn(e, t) {
  return Ee(e, t) === !0;
}
function Ee(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[d];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function xe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function rt(e) {
  return K(e) ? Math.trunc(e) : null;
}
function fr(e) {
  return Ht(e) ? Math.trunc(e) : null;
}
function ul(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function dl(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function ig(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function sg() {
  return game.combat ?? null;
}
function lg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function K(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ht(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function cg() {
  return game.user?.id ?? null;
}
const ug = "icons/svg/downgrade.svg", dg = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function T(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? ug,
    description: dg,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const mg = T({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), fg = T({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), pg = T({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), gg = T({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), hg = T({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), bg = T({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), yg = T({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), _g = T({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Ag = T({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Tg = T({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Rg = T({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), kg = T({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), $g = T({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Eg = T({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), wg = T({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Cg = T({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Sg = T({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Ig = T({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Lg = T({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), vg = T({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Dg = T({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Ng = T({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), xg = T({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Pg = T({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Og = T({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Mg = T({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Fg = T({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Bg = T({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Ug = T({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), zg = T({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), qg = T({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Gg = T({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), jg = T({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Vg = T({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Hg = [
  mg,
  fg,
  pg,
  gg,
  hg,
  bg,
  yg,
  _g,
  Ag,
  Tg,
  Rg,
  kg,
  $g,
  Eg,
  wg,
  Cg,
  Sg,
  Ig,
  Lg,
  vg,
  Dg,
  Ng,
  xg,
  Pg,
  Og,
  Mg,
  Fg,
  Bg,
  Ug,
  zg,
  qg,
  Gg,
  jg,
  Vg
];
class Wg {
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
    return Array.from(this.definitions.values()).map(xo);
  }
  get(t) {
    const n = this.lookup.get(Po(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(xo(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Po(t);
    r && this.lookup.set(r, n);
  }
}
function ml() {
  return new Wg(Hg);
}
function xo(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Po(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Ue(e) {
  return e.applyOnResistance ?? "failure";
}
function fl(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function pl(e, t) {
  const n = Ue(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function gl(e) {
  const t = Ue(e);
  return t === "failure" || t === "success";
}
function Kg(e, t, n, r) {
  const a = e.filter((c) => pl(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Ue(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const Yg = {
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
}, Xg = {
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
function Qg(e) {
  return bl(e, Yg, !1);
}
function Zg(e) {
  return bl(e, Xg, !e.allowsSuccessfulResistance);
}
function We(e) {
  return e.kind === "waiting-resistance";
}
function hl(e) {
  return e.kind === "resisted";
}
function bl(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Le("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Le("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || on(e.resistanceGateMode, e.resistanceState) ? Le(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Le("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : Le("available", !0, r.available, r.availableCompact, null);
}
function Le(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const at = "data-paranormal-toolkit-prompt-id", Jg = "data-paranormal-toolkit-resistance-roll-result", eh = "Conjuração DT";
function th(e) {
  const t = e.querySelector(mn)?.getAttribute(Jg), n = dt(t);
  if (n !== null) return n;
  const r = e.querySelector(Qs)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return dt(a?.[1] ?? null);
}
function ba(e) {
  const t = yl(e), n = oh(t);
  if (n !== null) return n;
  const r = ah(t);
  return r !== null ? r : ih(e);
}
function nh(e) {
  const t = yl(e);
  return t ? {
    actorId: On(t.actorId),
    itemId: On(t.itemId),
    itemName: On(t.itemName)
  } : null;
}
function rh(e) {
  const t = e.getAttribute(at);
  if (!t) return null;
  const n = _l(e), r = Al(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => pn(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function ue(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function pr(e) {
  return ue(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function ah(e) {
  const t = lh(e);
  return t.length === 0 ? null : dt(ch(t, eh));
}
function oh(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Oo(r, ["system", "ritual", "DT"]) ?? Oo(r, ["system", "ritual", "dt"]);
}
function ih(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return dt(n?.[1] ?? null);
}
function yl(e) {
  const t = sh(e);
  if (!t) return null;
  const n = _l(e), r = Al(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => pn(o) ? o.pendingId === t : !1) ?? null;
}
function sh(e) {
  return (e.closest(`[${at}]`) ?? e.querySelector(`[${at}]`) ?? e.parentElement?.querySelector(`[${at}]`) ?? null)?.getAttribute(at) ?? null;
}
function _l(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return uh(a) ? a : null;
}
function Al(e) {
  const t = e?.getFlag?.(d, dn);
  return pn(t) ? t : null;
}
function lh(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function ch(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Oo(e, t) {
  let n = e;
  for (const r of t) {
    if (!pn(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : dt(typeof n == "string" ? n : null);
}
function dt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function uh(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function pn(e) {
  return !!(e && typeof e == "object");
}
function On(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function gn(e) {
  return Tl({
    hasResistance: !!e.querySelector(da),
    difficulty: ba(e),
    resistanceTotal: th(e)
  });
}
function dh(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Tl({
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
function Tl(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: xd(e)
  };
}
function we() {
  return game.user?.isGM === !0;
}
function ke() {
  return we();
}
function mh(e) {
  const t = on(e.resistanceGateMode, e.resistanceState), n = fh(e.resistanceState, e.hasDamage), r = ph(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Qg({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Zg({
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
function fh(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function ph(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function ya(e) {
  const t = e.isGM ?? ke();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: mh({
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
function gh(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = bh(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function hh(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function bh(e, t) {
  const n = yh(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of _h(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function yh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function _h(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Mo(e, "highest") : n.includes("kl") ? Mo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Mo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Ah = "data-paranormal-toolkit-resistance-skill", Th = "data-paranormal-toolkit-resistance-skill-label", Rh = "data-paranormal-toolkit-roll-card-target-names", kh = "data-paranormal-toolkit-roll-card-resistance", $h = "data-paranormal-toolkit-roll-card-resistance-skill", Eh = "data-paranormal-toolkit-roll-card-resistance-skill-label", Rl = "pending", _a = "success", Aa = "failure", kl = "rolled";
function wh(e) {
  const t = vh(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Ih(e.damageSection) : null, r = Fo(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Ch(e.rollCard).map((o, s) => {
    const l = Sh(o, s), c = e.resistanceResults.get(l) ?? null, u = Mh(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, g = e.effectApplications.get(l) ?? null, _ = dh({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: qh(u)
    }).state, k = Fo(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      fl(_)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: g,
      effect: k,
      assistedActions: ya({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: _,
        damage: n,
        effect: k,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!g,
        effectCanApplyOnSuccessfulResistance: k?.applyOnResistance === "success" || k?.applyOnResistance === "always",
        effectRequiresResolvedResistance: k ? gl(k) : !1
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
function Ch(e) {
  const t = e.getAttribute(Rh), n = t ? zh(t) : [];
  if (n.length > 0) return n;
  const a = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, o] = a.split("→");
  return o ? o.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && $l(s) !== "nenhum alvo") : [];
}
function Sh(e, t) {
  return `${$l(e)}:${t}`;
}
function Ih(e) {
  const t = Fh(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Uh(e),
    formula: Bh(e) ?? "—",
    total: t,
    diceBreakdown: hh(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Fo(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: Lh(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Ue(o)
  } : null;
}
function Lh(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function vh(e, t) {
  const n = Nh(t), r = Dh(e), a = r.description ?? xh(n)?.textContent?.trim(), o = Ph(n), s = r.skill ?? o?.getAttribute(Ah) ?? null, l = r.skillLabel ?? o?.getAttribute(Th) ?? (s ? Re(s) : null);
  return !a && !s ? null : {
    description: a ?? "Resistência do alvo.",
    formula: Oh(n)?.textContent?.trim() ?? null,
    skill: s,
    skillLabel: l,
    difficulty: ba(e)
  };
}
function Dh(e) {
  return {
    description: Mn(e, kh),
    skill: Mn(e, $h),
    skillLabel: Mn(e, Eh)
  };
}
function Nh(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function xh(e) {
  return Ta(e, `.${i}__resistance-description`);
}
function Ph(e) {
  return Ta(e, mn);
}
function Oh(e) {
  return Ta(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Ta(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function Mh(e, t) {
  return e ? t === null ? kl : e.total >= t ? _a : Aa : Rl;
}
function Fh(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Bh(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Uh(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function zh(e) {
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").map((n) => n.trim()).filter((n) => n.length > 0) : [];
  } catch {
    return [];
  }
}
function Mn(e, t) {
  const n = e.getAttribute(t)?.trim();
  return n && n.length > 0 ? n : null;
}
function $l(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function qh(e) {
  return e === _a ? "succeeded" : e === Aa ? "failed" : "pending";
}
function El(e) {
  if (!e) return null;
  const t = e.actorId ? Vh(e.actorId) : null, n = t ? Gh(t, e.itemId, e.itemName) : null;
  return n || jh(e.itemId, e.itemName);
}
function Gh(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Pe(o)) return o;
  }
  const a = Wt(n);
  if (a) {
    const o = r?.find?.((s) => Pe(s) ? Wt(s.name) === a : !1);
    if (Pe(o)) return o;
  }
  return null;
}
function jh(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Pe(a)) return a;
  }
  const r = Wt(t);
  if (r) {
    const a = n?.find?.((o) => Pe(o) ? Wt(o.name) === r : !1);
    if (Pe(a)) return a;
  }
  return null;
}
function Vh(e) {
  const n = game.actors?.get?.(e);
  return Hh(n) ? n : null;
}
function Hh(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Pe(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function Wt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ra(e) {
  const t = Fn(e);
  if (!t) return null;
  const n = Wh().filter((o) => Fn(Kh(o)) === t).map((o) => wl(o)).find(lt) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => lt(o) && Fn(o.name) === t);
  return lt(a) ? a : null;
}
function Wh() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Kh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : wl(e)?.name ?? null;
}
function wl(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (lt(t)) return t;
  const n = e.document?.actor;
  return lt(n) ? n : null;
}
function lt(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Fn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Cl(e) {
  const t = Zh();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Yh(e)
  });
}
function Yh(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Bt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Xh(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Bt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Bt(e.actorName)}</strong></p>
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
function Xh(e) {
  const t = Qh(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Bt(a)}</li>`;
}
function Qh(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Bo(n?.value);
  return r === null ? null : {
    value: r,
    max: Bo(n?.max)
  };
}
function Bo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Zh() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Bt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Jh(e) {
  await Cl(eb(e));
}
function eb(e) {
  if (tb(e)) return e;
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
function tb(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Sl(e) {
  return e.mode, `✓ ${Il(e.inputAmount)} PV`;
}
function nb(e) {
  const t = Il(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Il(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class rb {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? ke()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : on(t.resistanceGateMode, t.resistanceState) ? {
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
class ab {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? ke()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : on(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class ob {
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
const ib = `.${i}__actions`, ka = `.${i}__actions-title`, ze = `.${i}__button`, sb = "data-paranormal-toolkit-action-section", lb = `${i}__button--executed`, cb = "data-paranormal-toolkit-executed-label";
function Ll(e) {
  return ue(e.querySelector(ka)?.textContent);
}
function ub(e, t) {
  const n = e.querySelector(ka);
  n && (n.textContent = t);
}
function yt(e, t) {
  const n = ue(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return ue(a) === n;
  }) ?? null;
}
function $a(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Ce(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
function vl(e) {
  const t = db(e.difficulty);
  if (t === null) return null;
  const n = Uo(e.skillLabel) ?? "Resistência", r = Uo(e.description), a = mb(r, n), o = fb(a, t);
  return {
    skillLabel: n,
    difficulty: t,
    difficultyLabel: `DT ${t}`,
    description: o
  };
}
function db(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : Math.trunc(e);
}
function Uo(e) {
  const t = e?.replace(/\s+/gu, " ").trim();
  return t ? t.replace(/[.]$/u, "") : null;
}
function mb(e, t) {
  if (!e) return null;
  const n = zo(e), r = zo(t);
  if (!n.startsWith(r)) return e;
  const a = e.slice(t.length).replace(/^\s*[:·,;\-–—]?\s*/u, "").trim();
  return a.length > 0 ? a : null;
}
function fb(e, t) {
  if (!e) return null;
  const n = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(e);
  if (!n) return e;
  const r = Number(n[1]);
  if (!Number.isFinite(r) || r !== t) return e;
  const a = e.slice(n[0].length).trim();
  return a.length > 0 ? a : null;
}
function zo(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").trim().toLocaleLowerCase();
}
const It = "data-paranormal-toolkit-prompt-id", Dl = "multiTargetResistanceResults", Nl = "multiTargetDamageApplications", xl = "multiTargetEffectApplications";
function pb(e) {
  const t = /* @__PURE__ */ new Map(), r = hn(e)?.[Dl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Tb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function gb(e, t) {
  await Ea(e, Dl, t.targetId, t);
}
function hb(e) {
  const t = /* @__PURE__ */ new Map(), r = hn(e)?.[Nl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    Rb(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function bb(e, t) {
  await Ea(
    e,
    Nl,
    t.targetId,
    t
  );
}
function yb(e) {
  const t = /* @__PURE__ */ new Map(), r = hn(e)?.[xl];
  if (!Y(r)) return t;
  for (const [a, o] of Object.entries(r))
    $b(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function _b(e, t) {
  await Ea(
    e,
    xl,
    t.targetId,
    t
  );
}
function Ab(e) {
  const t = hn(e);
  return t ? {
    actorId: Bn(t.actorId),
    itemId: Bn(t.itemId),
    itemName: Bn(t.itemName)
  } : null;
}
async function Ea(e, t, n, r) {
  const a = Pl(e);
  if (!a) return;
  const o = Ol(e), s = Ml(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!Y(u) || u.pendingId !== a) return u;
    const m = Y(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, dn, {
    ...s,
    prompts: c
  }));
}
function hn(e) {
  const t = Pl(e);
  if (!t) return null;
  const n = Ol(e), r = Ml(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Y(o) ? o.pendingId === t : !1) ?? null;
}
function Pl(e) {
  return (e.closest(`[${It}]`) ?? e.querySelector(`[${It}]`) ?? e.parentElement?.querySelector(`[${It}]`) ?? null)?.getAttribute(It) ?? null;
}
function Ol(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Eb(a) ? a : null;
}
function Ml(e) {
  const t = e?.getFlag?.(d, dn);
  return Y(t) ? t : null;
}
function Tb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Rb(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && kb(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function kb(e) {
  return e === "normal" || e === "half";
}
function $b(e) {
  return Y(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Bn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Eb(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Y(e) {
  return !!(e && typeof e == "object");
}
const wb = "data-paranormal-toolkit-resistance-skill", Cb = "data-paranormal-toolkit-resistance-skill-label", gr = "data-paranormal-toolkit-multi-target-section", wa = "data-paranormal-toolkit-multi-target-damage-info", Fl = "data-paranormal-toolkit-multi-target-effect-info", Bl = "data-paranormal-toolkit-multi-target-toggle", Ul = "data-paranormal-toolkit-multi-target-details", j = "data-paranormal-toolkit-multi-target-target", Sb = "data-paranormal-toolkit-multi-target-state", hr = "data-paranormal-toolkit-multi-target-roll-total", br = "data-paranormal-toolkit-multi-target-roll-formula", Ut = "data-paranormal-toolkit-multi-target-roll-dice", yr = "data-paranormal-toolkit-multi-target-roll-skill", _r = "data-paranormal-toolkit-multi-target-roll-skill-label", Ar = "data-paranormal-toolkit-multi-target-roll-target-name", Tr = "data-paranormal-toolkit-multi-target-roll-rolled-at", Rr = "data-paranormal-toolkit-multi-target-damage-mode", kr = "data-paranormal-toolkit-multi-target-damage-input-amount", qo = "data-paranormal-toolkit-multi-target-damage-final-amount", Go = "data-paranormal-toolkit-multi-target-damage-blocked", $r = "data-paranormal-toolkit-multi-target-damage-target-name", Er = "data-paranormal-toolkit-multi-target-damage-applied-at", wr = "data-paranormal-toolkit-multi-target-effect-condition-id", Cr = "data-paranormal-toolkit-multi-target-effect-condition-label", Sr = "data-paranormal-toolkit-multi-target-effect-effect-id", Ir = "data-paranormal-toolkit-multi-target-effect-created", Lr = "data-paranormal-toolkit-multi-target-effect-refreshed", vr = "data-paranormal-toolkit-multi-target-effect-target-name", Dr = "data-paranormal-toolkit-multi-target-effect-applied-at", Ib = new sl(ml()), Lb = new rl(new nl()), vb = new al(new ga()), Db = new ob(vb), Nb = new rb(Lb), xb = new ab(Ib), Pb = Rl, Ke = _a, _t = Aa, Ob = kl;
function Mb(e) {
  const t = zl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Hb(e);
  const n = Wb(e.rollCard, t), r = Kb(e.rollCard, t);
  !n && r && Ly(e.rollCard, r, e.effectSection);
  const a = ey(e.rollCard);
  return jl(a, t), Cy(
    e.rollCard,
    a,
    Yb(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && vy(e.rollCard, r, a), !0;
}
function zl(e) {
  return wh({
    ...e,
    resistanceResults: Ub(e.rollCard),
    damageApplications: zb(e.rollCard),
    effectApplications: qb(e.rollCard),
    resolveTargetConditionApplication: Fb,
    resistanceGateMode: Sa()
  });
}
function Fb(e, t, n) {
  const r = Ab(e), a = El(r);
  if (!a) return null;
  const o = ht(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = Bb(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function Bb(e, t, n) {
  const r = Kg(
    e,
    n,
    t,
    Un
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = Un(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => Un(s) === a)) ?? null : null;
}
function Ub(e) {
  const t = pb(e);
  for (const [n, r] of Vb(e))
    t.set(n, r);
  return t;
}
function zb(e) {
  const t = hb(e);
  for (const [n, r] of jb(e))
    t.set(n, r);
  return t;
}
function qb(e) {
  const t = yb(e);
  for (const [n, r] of Gb(e))
    t.set(n, r);
  return t;
}
function Gb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(wr), o = n.getAttribute(Cr), s = n.getAttribute(Sr), l = Ho(n.getAttribute(Ir)), c = Ho(n.getAttribute(Lr)), u = n.getAttribute(vr), m = n.getAttribute(Dr);
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
function jb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = n.getAttribute(Rr), o = ec(n.getAttribute(kr)), s = n.getAttribute($r), l = n.getAttribute(Er);
    !r || !xy(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Vb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${j}]`)) {
    const r = n.getAttribute(j), a = ec(n.getAttribute(hr)), o = n.getAttribute(br), s = n.getAttribute(yr), l = n.getAttribute(_r), c = n.getAttribute(Ar), u = n.getAttribute(Tr);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(Ut),
      rolledAt: u
    });
  }
  return t;
}
function Hb(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Wb(e, t) {
  if (!t.damage)
    return ql(e)?.remove(), null;
  const n = Xb(e);
  return Qb(n, t.damage), Jb(e, n), n;
}
function Kb(e, t) {
  if (!t.effect)
    return Jl(e)?.remove(), null;
  const n = Sy(e);
  return Iy(n, t.effect), n;
}
function Yb(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : yt(e, "Conjuração");
}
function Xb(e) {
  const t = ql(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(wa, "true"), n;
}
function ql(e) {
  return e.querySelector(`[${wa}="true"]`);
}
function Qb(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Gl(t.formula, t.total, t.diceBreakdown));
}
function Gl(e, t, n, r = !1) {
  const a = gh({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Zb(a, r), a;
}
function Zb(e, t) {
  const n = e.querySelector(fn), r = e.querySelector(fa);
  if (!n || !r) return;
  e.classList.toggle(ma, t), n.hidden = !t, r.classList.add(pa), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Jb(e, t) {
  const n = yt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ey(e) {
  const t = e.querySelector(`[${gr}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(gr, "true"), n;
}
function jl(e, t) {
  const n = ty(e), r = ry(t.resistance), a = [ny(t)];
  r && a.push(r), a.push(iy(t, n)), e.replaceChildren(...a);
}
function ty(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${j}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(j)).filter(Ny)
  );
}
function ny(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = oy(e.targets), t.append(n, r), t;
}
function ry(e) {
  const t = vl({
    description: e?.description,
    skillLabel: e?.skillLabel ?? e?.skill,
    difficulty: e?.difficulty
  });
  if (!t) return null;
  const n = document.createElement("div");
  return n.classList.add(`${i}__targets-resistance-info`), ay(n, t), n;
}
function ay(e, t) {
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
function oy(e) {
  const t = e.length, n = e.filter((l) => l.state === _t).length, r = e.filter((l) => l.state === Ke).length, a = e.filter((l) => l.state === Pb).length, o = e.filter((l) => l.state === Ob).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function iy(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(sy(r, e, t.has(r.id)));
  return n;
}
function sy(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(j, e.id), r.setAttribute(Sb, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Vl(r, e.resistanceResult), Hl(r, e.damageApplication), Wl(r, e.effectApplication);
  const a = ly(e, t, r), o = ky(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    Vo(s.target) || jo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Vo(s.target) || (s.preventDefault(), jo(r));
  }), r.append(a, o), r;
}
function Vl(e, t) {
  if (!t) {
    e.removeAttribute(hr), e.removeAttribute(br), e.removeAttribute(Ut), e.removeAttribute(yr), e.removeAttribute(_r), e.removeAttribute(Ar), e.removeAttribute(Tr);
    return;
  }
  e.setAttribute(hr, String(t.total)), e.setAttribute(br, t.formula), e.setAttribute(yr, t.skill), e.setAttribute(_r, t.skillLabel), e.setAttribute(Ar, t.targetName), e.setAttribute(Tr, t.rolledAt), t.diceBreakdown ? e.setAttribute(Ut, t.diceBreakdown) : e.removeAttribute(Ut);
}
function Hl(e, t) {
  if (!t) {
    e.removeAttribute(Rr), e.removeAttribute(kr), e.removeAttribute(qo), e.removeAttribute(Go), e.removeAttribute($r), e.removeAttribute(Er);
    return;
  }
  e.setAttribute(Rr, t.mode), e.setAttribute(kr, String(t.inputAmount)), e.removeAttribute(qo), e.removeAttribute(Go), e.setAttribute($r, t.targetName), e.setAttribute(Er, t.appliedAt);
}
function Wl(e, t) {
  if (!t) {
    e.removeAttribute(wr), e.removeAttribute(Cr), e.removeAttribute(Sr), e.removeAttribute(Ir), e.removeAttribute(Lr), e.removeAttribute(vr), e.removeAttribute(Dr);
    return;
  }
  e.setAttribute(wr, t.conditionId), e.setAttribute(Cr, t.conditionLabel), e.setAttribute(Sr, t.effectId ?? ""), e.setAttribute(Ir, String(t.created)), e.setAttribute(Lr, String(t.refreshed)), e.setAttribute(vr, t.targetName), e.setAttribute(Dr, t.appliedAt);
}
function ly(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = cy(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = uy(e, t.resistance);
  py(l, n, e, t);
  const c = Ry(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), Ql(u, [
    Kl(e, t, "compact"),
    Xl(e, t, "compact")
  ]), r.append(a, u), r;
}
function cy(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function uy(e, t) {
  if (!we())
    return dy(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", fy(e, t)), t?.skill && (n.setAttribute(wb, t.skill), n.setAttribute(Cb, t.skillLabel ?? Re(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ke ? "✓" : e.state === _t ? "✕" : "", n.append(r, a), n;
}
function dy(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", my(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ke ? "✓" : e.state === _t ? "✕" : "", n.append(r, a), n;
}
function my(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Ke ? "sucesso" : e.state === _t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function fy(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Ke ? "sucesso" : e.state === _t ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function py(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !we() || e.addEventListener("click", (a) => {
    a.stopPropagation(), gy(t, e, n, r);
  });
}
async function gy(e, t, n, r) {
  if (!we()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? Re(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Ra(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Db.execute({ actor: l, skill: o, skillLabel: s });
    await Dy(u.roll);
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
    Vl(e, m);
    try {
      await gb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", g);
    }
    Ca(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Ca(e) {
  const t = e.closest(`[${gr}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = zl({
    rollCard: n,
    damageSection: hy(n) ?? yt(n, "Dano"),
    effectSection: by(n)
  });
  r && jl(t, r);
}
function hy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(wa) !== "true") ?? null;
}
function by(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function yy(e) {
  return We(e.assistedActions.policy.damageActionState);
}
function _y(e) {
  return We(e.assistedActions.policy.effectActionState);
}
function Sa() {
  try {
    return oa();
  } catch {
    return "strict";
  }
}
function Kl(e, t, n) {
  if (e.damageApplication)
    return le(
      "✓",
      Sl({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (We(r))
    return le(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = Yl(a, t.damage);
  if (o === null)
    return le(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = nb({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = le(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (m) => {
    m.stopPropagation();
    const g = u.closest(`[${j}]`);
    g && Ay(g, u, e, t);
  }), u;
}
function Yl(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Ay(e, t, n, r) {
  if (n.damageApplication) return;
  if (yy(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = Yl(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Ra(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await Nb.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Sa(),
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
    Hl(e, m);
    try {
      await bb(r.rollCard, m);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", g);
    }
    try {
      await Jh(u.value);
    } catch (g) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", g);
    }
    Ca(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Xl(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (e.effectApplication)
    return le(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (!a) return null;
  if (We(r))
    return le(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (hl(r))
    return le(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = le(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${j}]`);
    l && Ty(l, o, e, t);
  }), o;
}
async function Ty(e, t, n, r) {
  if (n.effectApplication) return;
  if (_y(n)) {
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
  const o = Ra(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await xb.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Sa(),
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
    Wl(e, c);
    try {
      await _b(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Ca(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Ql(e, t) {
  for (const n of t)
    n && e.append(n);
}
function le(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function Ry(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Bl, "true"), t.setAttribute("aria-hidden", "true"), Zl(e, t), t;
}
function jo(e) {
  const t = e.querySelector(`[${Ul}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Bl}="true"]`);
  r && Zl(e, r);
}
function Zl(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Vo(e) {
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
function ky(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Ul, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = $y(e, t.resistance);
  s && r.append(s);
  const l = Ey(e, t.resistance), c = wy(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function $y(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Ke ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Ey(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Gl(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function wy(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), Ql(n, [
    Kl(e, t, "full"),
    Xl(e, t, "full")
  ]), n;
}
function Cy(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Sy(e) {
  const t = Jl(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Fl, "true"), n;
}
function Jl(e) {
  return e.querySelector(`[${Fl}="true"]`);
}
function Iy(e, t) {
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
function Ly(e, t, n) {
  const r = n?.parentElement === e ? n : yt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function vy(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Un(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Dy(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Ny(e) {
  return typeof e == "string" && e.length > 0;
}
function xy(e) {
  return e === "normal" || e === "half";
}
function Ho(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ec(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Wo = "data-paranormal-toolkit-card-layout-refresh-bound";
function Py(e) {
  const t = e.rollCard.querySelector(mn);
  t && t.getAttribute(Wo) !== "true" && (t.setAttribute(Wo, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Oe = "data-paranormal-toolkit-prompt-id", Oy = "apply-damage", My = "data-paranormal-toolkit-multi-target-damage-info";
function Fy(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(My) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function By(e) {
  const t = zy(e);
  return t.find((n) => n.getAttribute(sb) === Oy) ?? t.find((n) => Ll(n) === "aplicar danos") ?? null;
}
function Uy(e) {
  const t = tc(e), n = Ko(t);
  return n || Ko(qy(e));
}
function Ko(e) {
  return e.find((t) => {
    const n = Ll(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function zy(e) {
  const t = tc(e);
  return t.length > 0 ? t : Ia(e);
}
function tc(e) {
  const t = Vy(e);
  return t ? Ia(e).filter((n) => jy(n, t)) : [];
}
function qy(e) {
  const t = nc(e);
  if (!t) return [];
  const n = Gy(e, t);
  return Ia(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => rc(e, r)).filter((r) => !n || Hy(r, n));
}
function Ia(e) {
  const t = nc(e);
  return t ? Array.from(t.querySelectorAll(ib)) : [];
}
function nc(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Gy(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && rc(e, n)) ?? null;
}
function jy(e, t) {
  return e.getAttribute(Oe) === t ? !0 : Array.from(e.querySelectorAll(`[${Oe}]`)).some((n) => n.getAttribute(Oe) === t);
}
function Vy(e) {
  return e.getAttribute(Oe) ?? e.querySelector(`[${Oe}]`)?.getAttribute(Oe) ?? null;
}
function rc(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Hy(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Wy(e) {
  const t = ac(), n = gn(e.rollCard).state, r = ya({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = We(a), s = hl(a);
  return e.applied ? Je({
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
  }) : r.policy.canShowApplyEffect ? Je(o ? {
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
  }) : Je({
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
function Je(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function Ky(e) {
  const { rollCard: t } = e, n = Qy(), r = ac(), a = gn(t).state, o = ya({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = We(s), c = Xy(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: x(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: x(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: Yy(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: x("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: x("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: x("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: x("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: x("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: x("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: x("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: x("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: x("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: x("half", !1, !1, !1, !!e.halfButtonSkipped),
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
    normalButton: x("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: x("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function Yy(e) {
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
function x(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function Xy(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Qy() {
  try {
    return jd();
  } catch {
    return "assisted";
  }
}
function ac() {
  try {
    return oa();
  } catch {
    return "strict";
  }
}
const Zy = "data-paranormal-toolkit-damage-resolution-state", Yo = "data-paranormal-toolkit-damage-icon-enhanced", La = "data-paranormal-toolkit-damage-original-label", Jy = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, oc = "Outra opção escolhida";
function e_(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), ub(t, "Aplicar dano"), t_(e, t);
}
function t_(e, t) {
  const n = Array.from(t.querySelectorAll(ze)), r = Qo(n, "normal"), a = Qo(n, "half");
  if (!r || !a) {
    n_(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Zo(r, "normal"), Zo(a, "half");
  const o = Ky({
    rollCard: e,
    normalButtonApplied: Kt(r),
    halfButtonApplied: Kt(a),
    normalButtonSkipped: Nr(r),
    halfButtonSkipped: Nr(a)
  });
  if (!o.canShowApplyDamage) {
    Jo(r), Jo(a), ei(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), Xo(r, o.normalButton), Xo(a, o.halfButton), ei(t, o.summary.state, o.summary.message);
}
function Xo(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    a_(e, t.visible), o_(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function n_(e) {
  for (const t of e)
    Nr(t) && t.remove();
}
function Kt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(oc);
}
function Nr(e) {
  return e.textContent?.includes(oc) ?? !1;
}
function Qo(e, t) {
  const n = Jy[t];
  return e.find((r) => n.test(r_(r))) ?? null;
}
function r_(e) {
  return [
    e.getAttribute(La),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Zo(e, t) {
  if (e.getAttribute(Yo) === "true") return;
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
  ), e.setAttribute(Yo, "true"), e.setAttribute(La, n), e.setAttribute("aria-label", n), e.replaceChildren(r, Ce(n));
}
function Jo(e) {
  Kt(e) || e.remove();
}
function a_(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function o_(e, t, n, r = "Role resistência") {
  if (!Kt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(Ce(r));
      return;
    }
    e.removeAttribute("aria-disabled"), i_(e, n);
  }
}
function i_(e, t) {
  const n = e.getAttribute(La) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(s_(t), Ce(n)));
}
function s_(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function ei(e, t, n) {
  e.setAttribute(Zy, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(ka)?.after(a);
}
const mt = "data-paranormal-toolkit-effect-icon-enhanced", qe = "data-paranormal-toolkit-effect-action-compacted", bn = "data-paranormal-toolkit-effect-resistance-gate", va = "data-paranormal-toolkit-effect-section", Da = "data-paranormal-toolkit-effect-label";
function l_(e) {
  return e.querySelector(`[${va}="true"]`);
}
function c_(e) {
  const t = d_(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? f_(), r = R_(n, e.sourceActions, t);
  return r && n.setAttribute(Da, r), p_(n, t, r), A_(e.rollCard, n, e.after ?? e.fallbackAfter), T_(e.sourceActions, n), n;
}
function u_(e, t) {
  const n = t.querySelector(ze);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = cc(t, n, r), o = ic(e, n), s = Wy({
    rollCard: e,
    effectLabel: a,
    applied: xa(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Ue(o) === "success" || Ue(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? gl(o) : !1
  });
  if (s.applied) {
    $_(n);
    return;
  }
  if (!s.visible) {
    E_(n);
    return;
  }
  if (s.waitingForResistance) {
    w_(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    C_(n, s.compactLabel);
    return;
  }
  S_(n), lc(n, s.displayLabel);
}
function d_(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(ze) ?? []), n = Array.from(e.existingSection?.querySelectorAll(ze) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : m_(e.rollCard, r) ?? r[0] ?? null;
}
function m_(e, t) {
  const n = gn(e).state, r = fl(n), a = sc(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = ic(e, o, a);
    if (s && pl(s, r)) return o;
  }
  return null;
}
function ic(e, t, n = sc(e)) {
  const r = Na(t, t.textContent?.trim() ?? ""), a = pr(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => pr(s) === a)) ?? null : null;
}
function sc(e) {
  const t = El(nh(e));
  if (!t) return [];
  const n = ht(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function f_() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(va, "true"), e;
}
function p_(e, t, n) {
  e.setAttribute(va, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = g_(e), a = h_(r);
  a.textContent = "Efeito";
  const o = b_(e, r), s = y_(o);
  s.textContent = I_(n ?? cc(e, t, t.textContent?.trim() ?? ""));
  const l = __(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(ze)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !xa(t, c) && !k_(t, c) && lc(t, n ?? c);
}
function g_(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function h_(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function b_(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function y_(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function __(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function A_(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function T_(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(ze)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function R_(e, t, n) {
  const r = e.getAttribute(Da);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Na(n, n.textContent?.trim() ?? "");
}
function Na(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && ue(n) !== "efeito aplicado") return n;
  const r = rh(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && ue(a) !== "aplicado" ? a : null;
}
function xa(e, t) {
  return e.classList.contains(lb) || ue(t).includes("aplicado");
}
function k_(e, t) {
  const n = e.getAttribute(bn);
  if (n === "pending" || n === "resisted") return !0;
  const r = pr(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function lc(e, t) {
  e.getAttribute(qe) === "true" && e.getAttribute(mt) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(mt, "true"), e.setAttribute(cb, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    $a("✦", `${i}__button-icon--effect`),
    Ce("Aplicar")
  ));
}
function $_(e) {
  e.getAttribute(qe) === "true" && ue(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(qe, "true"), e.setAttribute(mt, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    $a("✓", `${i}__button-icon--effect-applied`),
    Ce("Aplicado")
  ));
}
function cc(e, t, n) {
  const r = e.getAttribute(Da) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Na(t, n) ?? n;
}
function E_(e) {
  xa(e, e.textContent?.trim() ?? "") || e.remove();
}
function w_(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(qe), e.removeAttribute(mt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(bn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Ce(t));
}
function C_(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(qe), e.removeAttribute(mt), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(bn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    $a("✓", `${i}__button-icon--effect-resisted`),
    Ce(t)
  );
}
function S_(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(bn), e.removeAttribute("aria-disabled");
}
function I_(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const L_ = "data-paranormal-toolkit-card-layout-normalized";
function v_(e) {
  const t = D_(e.rollCard), n = N_(t);
  return Py({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function D_(e) {
  return {
    rollCard: e,
    damageSection: Fy(e),
    resistance: e.querySelector(da),
    damageActions: By(e),
    effectActionSource: Uy(e),
    effectSection: l_(e)
  };
}
function N_(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(L_, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = yt(t, "Conjuração"), c = x_({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), e_(t, a));
  const u = c_({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: P_(n, c),
    fallbackAfter: l
  });
  return u && u_(t, u), u;
}
function x_(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function P_(e, t) {
  return e ?? t;
}
const uc = [0, 80, 180, 400, 900, 1600, 3e3], ti = /* @__PURE__ */ new WeakSet();
function O_(e) {
  dc(e), M_(e);
}
function dc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    mc(t);
}
function M_(e) {
  if (!ti.has(e)) {
    ti.add(e);
    for (const t of uc)
      globalThis.setTimeout(() => {
        dc(e);
      }, t);
  }
}
function mc(e) {
  const t = v_({
    rollCard: e,
    refreshDelaysMs: uc,
    onRefresh: () => mc(e)
  });
  Mb({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const F_ = "data-paranormal-toolkit-resistance-roll-result-enhanced", ni = "data-paranormal-toolkit-resistance-original-description", B_ = "data-paranormal-toolkit-resistance-skill", U_ = "data-paranormal-toolkit-resistance-skill-label", z_ = `${i}__resistance--without-roll-button`, q_ = ["Fortitude", "Reflexos", "Vontade"];
function G_(e) {
  for (const t of Array.from(e.querySelectorAll(da)))
    j_(t);
  O_(e);
}
function j_(e) {
  const t = e.querySelector(Gf), n = e.querySelector(Xs), r = e.querySelector(mn), a = Y_(r) ? r : null, o = e.querySelector(Qs);
  if (!t && !n && !o && !r) return;
  e.classList.toggle(z_, !a);
  const s = K_(e, r);
  t && t.parentElement !== s && s.append(t), n && n.parentElement !== s && s.append(n), o && (o.parentElement !== e && (!r || !r.contains(o)) && e.append(o), Z_(o)), V_(e, r, n), a && (rA(a), a.parentElement !== e && e.append(a));
}
function V_(e, t, n) {
  if (!n) return;
  const r = e.closest(`.${i}__roll-card`);
  if (!r) return;
  const a = W_(n), o = vl({
    description: a,
    skillLabel: X_(t, a),
    difficulty: ba(r)
  });
  if (!o) {
    n.textContent = a, n.classList.remove(`${i}__resistance-description--difficulty`);
    return;
  }
  H_(n, o), n.classList.add(`${i}__resistance-description--difficulty`);
}
function H_(e, t) {
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
function W_(e) {
  const t = e.getAttribute(ni);
  if (t !== null) return t;
  const n = e.textContent?.trim() ?? "";
  return e.setAttribute(ni, n), n;
}
function K_(e, t) {
  const n = e.querySelector(`.${$o}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add($o), e.insertBefore(r, t?.parentElement === e ? t : e.firstChild), r;
}
function Y_(e) {
  return !e || e.hidden ? !1 : e.getAttribute("aria-hidden") !== "true";
}
function X_(e, t) {
  const n = e?.getAttribute(U_) ?? e?.getAttribute(B_) ?? null;
  return n || Q_(t);
}
function Q_(e) {
  const t = ri(e);
  return q_.find((n) => t.startsWith(ri(n))) ?? null;
}
function ri(e) {
  return e.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
function Z_(e) {
  const t = J_(e.textContent ?? "");
  t && (e.setAttribute(F_, "true"), e.replaceChildren(nA(t)));
}
function J_(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = eA(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function eA(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: tA(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function tA(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function nA(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = aA(e);
  return r && t.append(r), t;
}
function rA(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = gn(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function aA(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of oA(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function oA(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ai(e, "highest") : n.includes("kl") ? ai(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ai(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function iA(e) {
  for (const t of Array.from(e.querySelectorAll(Uf))) {
    const n = fA(t);
    sA(t), n && (lA(t, n), cA(t, n));
  }
}
function sA(e) {
  for (const t of Array.from(e.querySelectorAll(zf)))
    t.remove();
}
function lA(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Ys) ?? null, a = r?.querySelector(Bf) ?? null, o = r ?? e, s = o.querySelector(Hf);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = LA(t.elementTone), l.textContent = IA(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function cA(e, t) {
  const n = uA(e);
  dA(e, n);
  const r = mA(t);
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
  const o = e.querySelector(Zs);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function uA(e) {
  return e.closest(`.${i}`)?.querySelector(Ys) ?? null;
}
function dA(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Wf)))
      a.remove();
}
function mA(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${cr(e.target)}` : null,
    e.duration ? `Duração: ${cr(e.duration)}` : null,
    e.resistance ? `Resistência: ${Us(e.resistance)}` : null
  ].filter(ln);
}
function fA(e) {
  const t = pA(e), n = AA(e), a = (t ? _A(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Pa(W(a, "element")), l = te("op.elementChoices", s) ?? oi(ye(o, "Elemento")) ?? oi(n.damageType), c = s ?? vA(l), u = W(a, "circle") ?? ye(o, "Círculo"), m = kA(a) ?? ye(o, "Alvo"), g = CA(a, "duration", "op.durationChoices") ?? ye(o, "Duração"), _ = TA(e) ?? EA(a) ?? ye(o, "Resistência"), k = RA(o) ?? n.cost, R = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: k,
    target: m,
    duration: g,
    resistance: _
  };
  return SA(R) ? R : null;
}
function pA(e) {
  const t = gA(e);
  if (!t) return null;
  const n = t.getFlag?.(d, dn), r = bA(n);
  if (r.length === 0) return null;
  const a = hA(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function gA(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? ia()?.messages?.get?.(n) ?? null : null;
}
function hA(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${ko}]`))) {
    const a = r.getAttribute(ko)?.trim();
    a && n.add(a);
  }
  return n;
}
function bA(e) {
  if (!sn(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(yA).filter((n) => n !== null) : [];
}
function yA(e) {
  return sn(e) ? {
    pendingId: Ot(e.pendingId),
    actorId: Ot(e.actorId),
    itemId: Ot(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(gm) : []
  } : null;
}
function _A(e) {
  if (!e.itemId) return null;
  const t = ia(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function AA(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(qf))) {
    const a = He(r.textContent);
    if (!a) continue;
    const o = pm(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function TA(e) {
  const t = He(e.querySelector(Xs)?.textContent);
  return t ? Us(t) : null;
}
function ye(e, t) {
  const n = ut(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || ut(r.slice(0, a)) !== n))
      return He(r.slice(a + 1));
  }
  return null;
}
function RA(e) {
  const t = ye(e, "Custo") ?? ye(e, "PE");
  return t || (e.map(He).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function kA(e) {
  const t = W(e, "target");
  if (!t) return null;
  if (t === "area")
    return $A(e) ?? te("op.targetChoices", t) ?? "Área";
  const n = te("op.targetChoices", t) ?? ce(t);
  return [t === "people" || t === "creatures" ? W(e, "targetQtd") : null, n].filter(ln).join(" ");
}
function $A(e) {
  const t = W(e, "area.name"), n = W(e, "area.size"), r = W(e, "area.type"), a = t ? te("op.areaChoices", t) ?? ce(t) : null, o = r ? te("op.areaTypeChoices", r) ?? ce(r) : null;
  return a ? n ? o ? `${a} ${n}m ${cr(o)}` : `${a} ${n}m` : a : null;
}
function EA(e) {
  const t = W(e, "skillResis"), n = W(e, "resistance");
  if (!t || !n) return null;
  const r = te("op.skill", t) ?? ce(t), a = wA(n);
  return [r, a].filter(ln).join(" ");
}
function wA(e) {
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
      return te("op.resistanceChoices", e) ?? ce(e);
  }
}
function CA(e, t, n) {
  const r = W(e, t);
  return r ? te(n, r) ?? ce(r) : null;
}
function SA(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function IA(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function LA(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(ln).join(" ");
}
function Pa(e) {
  const t = ut(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function oi(e) {
  const t = Pa(e);
  return t ? te("op.elementChoices", t) ?? ce(t) : e ? ce(e) : null;
}
function vA(e) {
  return Pa(e);
}
function te(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = ia()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const ii = "data-paranormal-toolkit-dice-toggle-enhanced";
function DA(e) {
  for (const t of Array.from(e.querySelectorAll(Js)))
    fc(t);
}
function NA(e) {
  const t = gc(e.target);
  if (!t) return;
  const n = Oa(t);
  n && (e.preventDefault(), pc(n, t));
}
function xA(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = gc(e.target);
  if (!t) return;
  const n = Oa(t);
  n && (e.preventDefault(), pc(n, t));
}
function fc(e) {
  const t = e.querySelector(fn);
  if (!t) return;
  const n = e.querySelector(fa);
  if (n && n.getAttribute(ii) !== "true" && (n.setAttribute(ii, "true"), n.classList.add(pa), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function pc(e, t) {
  const n = e.querySelector(fn);
  if (!n) return;
  const r = !e.classList.contains(ma);
  PA(e, t, n, r);
}
function PA(e, t, n, r) {
  e.classList.toggle(ma, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function gc(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(fa);
  if (!t) return null;
  const n = Oa(t);
  return n ? (fc(n), t.classList.contains(pa) ? t : null) : null;
}
function Oa(e) {
  const t = e.closest(Js);
  return t && t.querySelector(fn) ? t : null;
}
const si = `${d}-workflow-dice-toggle-styles`;
function OA() {
  if (document.getElementById(si)) return;
  const e = document.createElement("style");
  e.id = si, e.textContent = `
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
const MA = [0, 100, 500, 1500, 3e3];
let li = !1, zn = null;
function FA() {
  if (!li) {
    li = !0, OA(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ot(Gt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ot(Gt(t));
    }), Hooks.once("ready", () => {
      ot(document), BA();
    }), document.addEventListener("click", NA), document.addEventListener("keydown", xA);
    for (const e of MA)
      globalThis.setTimeout(() => ot(document), e);
  }
}
function BA() {
  zn || !document.body || (zn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ot(n);
  }), zn.observe(document.body, { childList: !0, subtree: !0 }));
}
function ot(e) {
  e && (dp(e), iA(e), G_(e), DA(e), rp(e));
}
function UA() {
  FA();
}
const zA = "data-paranormal-toolkit-action-section", qA = "ritual-log", GA = ".paranormal-toolkit-item-use-prompt__actions", jA = ".paranormal-toolkit-item-use-prompt__actions-title", VA = [0, 100, 500, 1500];
let ci = !1;
function HA() {
  if (ci) return;
  const e = (t, n) => {
    di(XA(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), di(document), ci = !0;
}
function di(e) {
  for (const t of VA)
    globalThis.setTimeout(() => WA(e), t);
}
function WA(e) {
  KA(e), YA(e);
}
function KA(e) {
  for (const t of e.querySelectorAll(
    `[${zA}="${qA}"]`
  ))
    t.remove();
}
function YA(e) {
  for (const t of e.querySelectorAll(GA)) {
    if (mi(t.querySelector(jA)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => mi(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function XA(e) {
  if (e instanceof HTMLElement || QA(e))
    return e;
  if (ZA(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function QA(e) {
  return e instanceof HTMLElement;
}
function ZA(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function mi(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const it = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, hc = {
  PV: "system.attributes.hp"
}, xr = {
  PV: [it.PV, hc.PV],
  SAN: [it.SAN],
  PE: [it.PE],
  PD: [it.PD]
}, Pr = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class JA {
  getResource(t, n) {
    const r = fi(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = gi(t, n, o, l, "valor atual");
    if (u) return p(u);
    const m = gi(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = fi(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function fi(e, t) {
  const n = eT(e.type, t);
  if (n && pi(e, n))
    return y(n);
  const r = xr[t].find(
    (a) => pi(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: tT(e, t),
    path: xr[t].join(" | ")
  });
}
function eT(e, t) {
  return e === "threat" ? hc[t] ?? null : e === "agent" ? it[t] : null;
}
function pi(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function tT(e, t) {
  const n = e.type ?? "unknown", r = xr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function gi(e, t, n, r, a) {
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
class nT {
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
      const s = Pr.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = rT(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Pr.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function rT(e) {
  if (hi(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (hi(n))
      return n;
  }
  return null;
}
function hi(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const aT = "dice-so-nice";
async function bc(e) {
  if (!oT() || !iT()) return;
  const t = sT();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function oT() {
  try {
    return Ff().enabled;
  } catch {
    return !1;
  }
}
function iT() {
  return game.modules?.get?.(aT)?.active === !0;
}
function sT() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const bi = "occultism";
class yc {
  getDifficulty(t) {
    return lT(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await uT(t, bi);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await bc(r);
    const a = fT(r);
    return {
      skill: bi,
      skillLabel: "Ocultismo",
      roll: r,
      formula: mT(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: pT(r)
    };
  }
}
function lT(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function cT(e) {
  return new yc().rollCastingCheck(e);
}
async function uT(e, t) {
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
  return dT(r);
}
function dT(e) {
  return yi(e) ? e : Array.isArray(e) ? e.find(yi) ?? null : null;
}
function yi(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function mT(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function fT(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function pT(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(gT);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function gT(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const hT = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class bT {
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
    const r = n.value, a = yT(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: hT[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function yT(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : _T(n) ? {
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
function _T(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
class AT {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return qn("missing-item-patch");
    if (t.type !== "ritual") return qn("unsupported-item-type");
    const a = TT(r);
    return Object.keys(a).length === 0 ? qn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function TT(e) {
  const t = {};
  O(t, "name", e.name), O(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (O(t, "system.circle", n.circle), O(t, "system.element", n.element), O(t, "system.target", n.target), O(t, "system.targetQtd", n.targetQuantity), O(t, "system.execution", n.execution), O(t, "system.range", n.range), O(t, "system.duration", n.duration), O(t, "system.skillResis", n.resistanceSkill), O(t, "system.resistance", n.resistance), O(t, "system.studentForm", n.studentForm), O(t, "system.trueForm", n.trueForm)), t;
}
function O(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function qn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class RT {
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
    return this.getNumber(t, Pr.ritual.dt, 0);
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
class kT {
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
class $T {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = ET(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Gn(t)), y(t)) : n;
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
    return n ? Gn(n) : null;
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
    return Array.from(this.presets.values()).map(Gn);
  }
  findForItem(t) {
    return this.list().map((n) => wT(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function ET(e) {
  return !jn(e.id) || !jn(e.version) || !jn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function wT(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = CT(a, t);
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
function CT(e, t) {
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
      const n = _i(t.name), r = e.names.map(_i).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = ST(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function _i(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ST(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Gn(e) {
  return structuredClone(e);
}
function jn(e) {
  return typeof e == "string" && e.length > 0;
}
function Yt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = yn(e.amountFrom);
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
function yn(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function IT(e, t, n) {
  if (!Ai(e.id) || !Ai(e.formula))
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
    await bc(a);
    const l = {
      ...n.rollRequests[e.id] ?? _c(e, t),
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
function _c(e, t) {
  const n = e.intent ?? LT(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function LT(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Ai(e) {
  return typeof e == "string" && e.length > 0;
}
async function Xt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Lt(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Lt(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? Lt(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? Lt(t, n, r, a) : e.recover(t, n, a);
  }
}
function Lt(e, t, n, r) {
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
function vT(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = DT(t, n, r, a);
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
    const s = NT(t, n, r, a);
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
function DT(e, t, n, r) {
  const a = yn(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Ac(t.id, "damage", r, t.damageInstances.length),
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
function NT(e, t, n, r) {
  const a = yn(e.amountFrom);
  return {
    id: Ac(t.id, "healing", r, t.healingInstances.length),
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
function Ac(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function xT(e, t, n) {
  const r = yn(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function PT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Tc("before", e), Ti("before", e), Ti("resolve", e);
}
function OT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Tc("apply", e);
}
function MT(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Tc(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = FT(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Ti(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function FT(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function BT(e, t, n) {
  return y(void 0);
}
async function UT(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return zT(e, t);
    case "spendRitualCost":
      return qT(e, t);
  }
}
async function zT(e, t) {
  const { context: n, resources: r } = e, a = Yt(t, n);
  return a.ok ? Rc(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function qT(e, t) {
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
  }), Rc(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Rc(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function GT(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = jT(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function jT(e) {
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
class VT {
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
        return GT({
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
    const a = await UT({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = _c(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await IT(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Yt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = xT(t, n, a.value);
    PT({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), OT({
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
      const c = await Xt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      vT({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return MT({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Yt(t, n);
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
      const l = await Xt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await BT(this.messages);
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
    const l = HT(t, n.intent);
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
function HT(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class WT {
  emitCastStarted(t) {
    Hooks.callAll(Pt.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(Pt.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(Pt.ritual.castFinished, t);
  }
}
class KT {
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
    } catch (g) {
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
        cause: g
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
class YT {
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
function kc(e) {
  return {
    id: XT(),
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
function XT() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class QT {
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
    return De(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = kc(n);
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
class ZT {
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
class JT {
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
    const n = or();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: eR(),
      flags: {
        ...t.flags,
        [d]: {
          ...tR(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = or();
    if (!r.enabled)
      return;
    const a = n.notification ?? Ri(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Ri(n);
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
function Ri(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function eR() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function tR(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const nR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", $c = `${d}-inline-roll-neutralized`, rR = `${d}-inline-roll-notice`, Ma = `data-${d}-inline-roll-neutralized`, ki = `data-${d}-inline-roll-notice`, aR = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function $i(e) {
  const t = yR(e.message), n = await oR(e.message), r = iR(t);
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
async function oR(e) {
  const t = gR(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = sR(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await hR(t, n.content), replacementCount: n.replacementCount };
}
function iR(e) {
  const t = e ? bR(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Ec(t);
  return n > 0 && wc(mR(t)), { replacementCount: n };
}
function sR(e) {
  const t = lR(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Ec(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (wc(n.content), { content: n.innerHTML, replacementCount: a });
}
function lR(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, uR(a.trim()))), replacementCount: t };
}
function Ec(e) {
  const t = cR(e);
  for (const n of t)
    n.replaceWith(dR(fR(n)));
  return t.length;
}
function cR(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(nR))
    n.getAttribute(Ma) !== "true" && t.add(n);
  return Array.from(t);
}
function uR(e) {
  return `<span class="${$c}" ${Ma}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${_R(e)}</span>`;
}
function dR(e) {
  const t = document.createElement("span");
  return t.classList.add($c), t.setAttribute(Ma, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function wc(e) {
  if (e.querySelector?.(`[${ki}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(rR), t.setAttribute(ki, "true"), t.textContent = aR, e.append(t);
}
function mR(e) {
  return e.querySelector(".message-content") ?? e;
}
function fR(e) {
  const n = e.getAttribute("data-formula") ?? pR(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function pR(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function gR(e) {
  return e && typeof e == "object" ? e : null;
}
async function hR(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function bR(e) {
  const t = AR(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function yR(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function _R(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function AR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Qt = "ritualRollConfig", Zt = "ritual-roll", TR = {
  nullifies: "anula",
  discredits: "desacredita",
  partial: "parcial",
  reducesByHalf: "reduz à metade"
};
function _n() {
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
function Cc(e) {
  const t = e.getFlag(d, Qt);
  return Or(t);
}
function Sc(e) {
  return Cc(e) ?? _n();
}
async function RR(e, t) {
  const n = Or(t) ?? Or({
    ..._n(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, Qt, n), n;
}
async function kR(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, Qt));
    return;
  }
  await e.setFlag(d, Qt, null);
}
function Or(e) {
  if (!An(e)) return null;
  const t = NR(e.intent);
  if (!t) return null;
  const n = _n();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Mr(e.damageType),
    utilityLabel: Mr(e.utilityLabel) ?? n.utilityLabel,
    note: Fa(e.note),
    forms: PR(e.forms)
  };
}
function $R(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function ER(e) {
  const t = Cc(e), n = Ic(e);
  if (!t)
    return Ei(e, n);
  const r = vR(e, t);
  if (!r)
    return Ei(e, n);
  const a = wR(t, r), o = [
    { type: "spendRitualCost" },
    a,
    ...CR(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: IR(e, t),
    resistance: n
  };
}
function Ei(e, t) {
  return t ? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
    ritualForms: LR(e),
    resistance: t
  } : null;
}
function wR(e, t) {
  const n = {
    type: "rollFormula",
    id: Zt,
    formula: t,
    intent: DR(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function CR(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Zt}.total`,
          ...SR(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Zt}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function SR(e) {
  return e ? { damageType: e } : {};
}
function IR(e, t) {
  const n = {
    base: Vn("Padrão", t.forms.base.formula)
  };
  return Ge(e, "discente") && (n.discente = Vn("Discente", t.forms.discente.formula, 2)), Ge(e, "verdadeiro") && (n.verdadeiro = Vn("Verdadeiro", t.forms.verdadeiro.formula, 5)), n;
}
function Vn(e, t, n) {
  return {
    label: e,
    ...n ? { extraCost: n } : {},
    rollFormulaOverrides: {
      [Zt]: t.trim()
    }
  };
}
function LR(e) {
  const t = {
    base: { label: "Padrão" }
  };
  return Ge(e, "discente") && (t.discente = { label: "Discente", extraCost: 2 }), Ge(e, "verdadeiro") && (t.verdadeiro = { label: "Verdadeiro", extraCost: 5 }), t;
}
function vR(e, t) {
  return [
    t.forms.base.formula.trim(),
    Ge(e, "discente") ? t.forms.discente.formula.trim() : "",
    Ge(e, "verdadeiro") ? t.forms.verdadeiro.formula.trim() : ""
  ].find((r) => r.length > 0) ?? null;
}
function Ic(e) {
  const t = Lc(e), n = Mr(t.skillResis), r = xR(t.resistance);
  if (!n || !r) return;
  const a = OR(n), o = TR[r];
  return {
    skill: n,
    label: a,
    effect: r,
    summary: `${a} ${o}`
  };
}
function DR(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function NR(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function xR(e) {
  return e === "nullifies" || e === "discredits" || e === "partial" || e === "reducesByHalf" ? e : null;
}
function PR(e) {
  const t = _n();
  return An(e) ? {
    base: Hn(e.base),
    discente: Hn(e.discente),
    verdadeiro: Hn(e.verdadeiro)
  } : t.forms;
}
function Hn(e) {
  return An(e) ? { formula: Fa(e.formula) } : { formula: "" };
}
function Ge(e, t) {
  const n = Lc(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return MR(r);
}
function Lc(e) {
  const t = e.system;
  return An(t) ? t : {};
}
function OR(e) {
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
function MR(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Fa(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Mr(e) {
  const t = Fa(e);
  return t.length > 0 ? t : null;
}
function An(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function FR(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function BR(e) {
  switch (UR(e)) {
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
      return zR(String(e ?? ""));
  }
}
function UR(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function zR(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function qR() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function GR(e) {
  return {
    ...Ba(e),
    type: "ritual.cast.started"
  };
}
function jR(e) {
  return {
    ...Ba(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function VR(e) {
  return {
    ...Ba(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function HR(e) {
  if (e.type === "preset") {
    const t = Te(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: Te(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: Te(e.label),
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
function WR(e, t = {}) {
  const n = lk(e), r = [
    ...uk(t.candidates ?? []),
    ...dk(e)
  ], a = fk(r) ?? { x: 0, y: 0, width: 0, height: 0 }, o = ck(t) ?? pk(r) ?? hk(a), s = yk(canvas?.grid?.size), l = KR(o, a, r), c = nk(r), u = tk(l);
  return {
    type: "rectangleRay",
    sceneId: bk(e, n),
    regionId: Di(n?.id) ?? Di(e.id),
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
function KR(e, t, n) {
  const r = {
    x: N(e, "x") ?? 0,
    y: N(e, "y") ?? 0,
    width: N(e, "width") ?? t.width,
    height: N(e, "height") ?? t.height,
    direction: N(e, "direction") ?? 0,
    elevation: N(e, "elevation")
  };
  return {
    ...r,
    direction: YR(r, t, n)
  };
}
function YR(e, t, n) {
  const r = XR(n);
  return r !== null ? r : ZR(e, t) ?? e.direction;
}
function XR(e) {
  const t = [
    "rotation",
    "direction",
    "document.rotation",
    "document.direction",
    "object.rotation",
    "object.direction"
  ];
  for (const n of e) {
    const r = wi(n, t);
    if (r !== null) return r;
    const a = Tn(n), o = wi(a, t);
    if (o !== null) return o;
  }
  return null;
}
function wi(e, t) {
  for (const n of t) {
    const r = QR(G(e, n));
    if (r !== null) return r;
  }
  return null;
}
function QR(e) {
  const t = ft(e);
  if (t === null) return null;
  const n = za(t);
  return Math.abs(n) > 1e-3 ? n : null;
}
function ZR(e, t) {
  if (e.width <= 0 || e.height < 0 || t.width <= 0 || t.height <= 0) return null;
  const n = Si(Ci(e, e.direction), t), r = JR(e, t);
  if (r === null) return null;
  const o = ek([
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
    error: Si(Ci(e, l), t)
  })).sort((l, c) => l.error - c.error)[0];
  if (!o || o.error >= n) return null;
  const s = Math.max(12, Math.min(e.width, Math.max(e.height, 1)) * 0.12);
  return o.error <= s ? za(o.direction) : null;
}
function JR(e, t) {
  const n = e.width, r = e.height, a = n ** 2 - r ** 2;
  if (Math.abs(a) < 1e-3) return null;
  const o = (n * t.width - r * t.height) / a, s = (n * t.height - r * t.width) / a, l = Ni(o, 0, 1), c = Ni(s, 0, 1);
  return !Number.isFinite(l) || !Number.isFinite(c) ? null : _k(Math.atan2(c, l));
}
function Ci(e, t) {
  const n = Dc(t), r = {
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
  ], s = o.map((_) => _.x), l = o.map((_) => _.y), c = Math.min(...s), u = Math.max(...s), m = Math.min(...l), g = Math.max(...l);
  return {
    x: c,
    y: m,
    width: u - c,
    height: g - m
  };
}
function Si(e, t) {
  return Math.abs(e.x - t.x) + Math.abs(e.y - t.y) + Math.abs(e.width - t.width) + Math.abs(e.height - t.height);
}
function ek(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = za(n);
    t.add(Math.round(r * 1e3) / 1e3);
  }
  return [...t];
}
function tk(e) {
  if (e.width <= 0 || e.height < 0) return null;
  const t = Dc(e.direction), n = {
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
function nk(e) {
  for (const t of e) {
    const n = Ii(t, "ray.start"), r = Ii(t, "ray.end");
    if (n && r) return { start: n, end: r };
  }
  return null;
}
function Ii(e, t) {
  const n = G(e, t), r = ft(G(n, "x")), a = ft(G(n, "y"));
  return r === null || a === null ? null : { x: r, y: a };
}
function Ba(e) {
  const t = HR(e.automationSource), n = e.targets ?? e.context.targets;
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
      token: ok(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: rk(e.context.item, e.form, e.formLabel, t),
    targets: n.map(ik),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function rk(e, t, n, r) {
  return {
    name: e.name,
    slug: Wn(e, "system.slug") ?? Wn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: Wn(e, "system.element"),
    circle: sk(e),
    form: ak(t),
    formLabel: n
  };
}
function ak(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function ok(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function ik(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function sk(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : Te(t);
}
function Wn(e, t) {
  return Te(foundry.utils.getProperty(e, t));
}
function Te(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function lk(e) {
  return "document" in e && e.document ? e.document : e;
}
function ck(e) {
  return vc(e.shape);
}
function uk(e) {
  return e.filter(Ua);
}
function dk(e) {
  return [
    e,
    mk(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(Ua);
}
function mk(e) {
  return "object" in e && Ua(e.object) ? e.object : null;
}
function Ua(e) {
  return !!(e && typeof e == "object");
}
function fk(e) {
  for (const t of e) {
    const n = Li(G(Tn(t), "bounds"));
    if (n) return n;
    const r = Li(G(t, "bounds"));
    if (r) return r;
  }
  return null;
}
function Li(e) {
  const t = N(e, "x"), n = N(e, "y"), r = N(e, "width"), a = N(e, "height");
  return t === null || n === null || r === null || a === null ? null : { x: t, y: n, width: r, height: a };
}
function N(e, t) {
  return ft(G(e, t));
}
function pk(e) {
  for (const t of e) {
    const n = gk(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function gk(e) {
  if (!e || typeof e != "object") return [];
  const t = vi(Tn(e));
  return t.length > 0 ? t : vi(e);
}
function vi(e) {
  const t = G(e, "shapes");
  return Array.isArray(t) ? t.map(vc).filter((n) => n !== null) : [];
}
function vc(e) {
  const t = Tn(e) ?? e, n = G(t, "type");
  return typeof n != "string" ? null : {
    type: n,
    x: N(t, "x"),
    y: N(t, "y"),
    width: N(t, "width"),
    height: N(t, "height"),
    direction: N(t, "direction"),
    elevation: N(t, "elevation")
  };
}
function hk(e) {
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
function bk(e, t) {
  return Kn(e, "parent.id") ?? Kn(e, "document.parent.id") ?? Kn(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function Kn(e, t) {
  return Te(G(e, t));
}
function G(e, t) {
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
function Tn(e) {
  if (!e || typeof e != "object") return null;
  const t = G(e, "toObject");
  if (typeof t != "function") return null;
  try {
    const n = t.call(e);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function Di(e) {
  return Te(e);
}
function ft(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function yk(e) {
  const t = ft(e);
  return t !== null && t > 0 ? t : null;
}
function Dc(e) {
  return e * Math.PI / 180;
}
function _k(e) {
  return e * 180 / Math.PI;
}
function za(e) {
  const t = e % 360;
  return t < 0 ? t + 360 : t;
}
function Ni(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
class Ak {
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
class Rn {
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
const Tk = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class Rk {
  constructor(t = new Rn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = kk(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(Tk);
  }
}
function kk(e, t) {
  const n = [], r = $k(e), a = xi(r), o = xi(e);
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
function $k(e) {
  return Ek(e) ? e.document ?? null : e;
}
function Ek(e) {
  return "bounds" in e;
}
function xi(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const wk = 100, Ck = 12;
class Sk {
  constructor(t = new Rn()) {
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
      const a = this.foundryAdapter.getGridSize() ?? wk, o = Nk(n), s = await this.foundryAdapter.placeRegion(
        Ik(t, this.foundryAdapter.getUserColor(), a),
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
        message: Dk(a)
      };
    }
  }
}
function Ik(e, t, n) {
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
    shapes: [Lk(e, n)]
  };
}
function Lk(e, t) {
  const n = vk(e, t);
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
function vk(e, t) {
  return {
    length: Pi(e.length, Ck, t),
    width: Pi(e.width, 1, t)
  };
}
function Pi(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function Dk(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function Nk(e) {
  const t = (n) => {
    const r = xk(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function xk(e) {
  return Pk(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function Pk(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class Ok {
  constructor(t = new Rn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(Oi(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Oi(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = Mk(t);
    Fk(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Oi(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function Mk(e) {
  return Array.from(new Set(e));
}
function Fk(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class Bk {
  constructor(t = new Rn()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Ss)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(Uk(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(zk(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: Fr(r.region)
    }));
    for (const r of t) {
      if (!Fr(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = Gk(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function Uk(e) {
  return [
    { source: "document", region: Ae(e.document) },
    { source: "document.object", region: Ae(e.document.object) },
    { source: "preview", region: Ae(e.preview) },
    { source: "preview.document.object", region: Ae(e.preview?.document?.object) }
  ];
}
function zk(e) {
  return [
    { source: "input", region: Ae(e) },
    { source: "input.object", region: qk(e) ? Ae(e.object) : null },
    { source: "input.document.object", region: Nc(e) ? Ae(e.document?.object) : null }
  ];
}
function Ae(e) {
  return Fr(e) ? e : null;
}
function Fr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return vt(n.x) && vt(n.y) && vt(n.width) && vt(n.height);
}
function Nc(e) {
  return "document" in e && "bounds" in e;
}
function qk(e) {
  return !Nc(e);
}
function Gk(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function vt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
class jk {
  async minimizeForPlacement() {
    const t = [];
    for (const n of Wk())
      await Vk(n) && t.push(n);
    return {
      restore: async () => {
        for (const n of [...t].reverse())
          await Hk(n);
      }
    };
  }
}
async function Vk(e) {
  if (xc(e) || !t$(e)) return !1;
  try {
    return await e.minimize(), !0;
  } catch (t) {
    return console.warn("Paranormal Toolkit | Falha ao minimizar janela para seleção no canvas.", t), !1;
  }
}
async function Hk(e) {
  if (xc(e))
    try {
      await e.maximize();
    } catch (t) {
      console.warn("Paranormal Toolkit | Falha ao restaurar janela após seleção no canvas.", t);
    }
}
function Wk() {
  const e = /* @__PURE__ */ new Set();
  for (const t of Kk())
    Qk(t) && Zk(t) && e.add(t);
  return [...e];
}
function Kk() {
  return [
    ...Mi(Yk()),
    ...Mi(Xk())
  ];
}
function Mi(e) {
  return e ? e instanceof Map || e instanceof Set ? [...e.values()] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function Yk() {
  return globalThis.ui?.windows ?? null;
}
function Xk() {
  return globalThis.foundry?.applications?.instances ?? null;
}
function Qk(e) {
  return !!(e && typeof e == "object" && typeof e.minimize == "function" && typeof e.maximize == "function");
}
function Zk(e) {
  const t = Jk(e), n = e$(t);
  return n === "Actor" || n === "Item";
}
function Jk(e) {
  return e.document ?? e.object ?? null;
}
function e$(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.documentName == "string") return t.documentName;
  if (typeof t.constructor?.documentName == "string") return t.constructor.documentName;
  const n = t.constructor?.name;
  return n === "Actor" || n === "Item" ? n : null;
}
function t$(e) {
  const t = n$(e);
  if (!t || t.isConnected === !1) return !1;
  const n = globalThis.document;
  return n ? t.ownerDocument === n : !1;
}
function n$(e) {
  const t = e.element;
  if (Fi(t)) return t;
  if (t && typeof t == "object") {
    const n = t[0];
    if (Fi(n)) return n;
  }
  return null;
}
function Fi(e) {
  return !!(e && typeof e == "object" && "ownerDocument" in e && e.ownerDocument);
}
function xc(e) {
  return e.minimized === !0;
}
const r$ = "Nenhum alvo encontrado na linha.";
class a$ {
  constructor(t = new Sk(), n = new Bk(), r = new Rk(), a = new Ok(), o = new Ak(), s = new jk()) {
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
        const c = this.regionTargetResolver.resolveTargets(l.region), u = i$(r), m = WR(l.region, {
          candidates: [u?.preview, u?.document],
          shape: u?.shape
        });
        return c.targets.length === 0 ? (o(), this.foundryAdapter.warn(r$), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(c.tokens), {
          status: "confirmed",
          targets: c.targets,
          areaSnapshot: m
        });
      } catch (c) {
        o();
        const u = o$(c);
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
function o$(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function i$(e) {
  return e.length > 0 ? e[e.length - 1] ?? null : null;
}
function s$(e) {
  return {
    header: {
      eyebrow: hs,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: g$(e.ritual)
    },
    forms: e.variantOptions.map((t) => l$(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: d$(e.targetNames, e.variantOptions, e.ritual),
    automation: p$(e.automationStatus ?? "assisted")
  };
}
function l$(e, t) {
  const n = c$(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? u$(t) : "—",
    details: n
  };
}
function c$(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function u$(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function d$(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => m$(a, n))
  };
}
function m$(e, t) {
  const n = e.targeting ?? f$(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
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
function f$(e, t) {
  const n = ht(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function p$(e) {
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
function g$(e) {
  const t = e.system, n = [b$(t?.element), h$(t?.circle)].filter(A$);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function h$(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function b$(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (y$(e)) {
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
      return _$(e);
  }
}
function y$(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function _$(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function A$(e) {
  return typeof e == "string" && e.length > 0;
}
const Pc = ["base", "discente", "verdadeiro"];
function qa(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Jt(e) {
  return typeof e == "string" && Pc.includes(e);
}
const { ApplicationV2: T$ } = foundry.applications.api;
class ct extends T$ {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = s$(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: ct.onCast,
      cancel: ct.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new ct(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    $$(a, (o) => {
      this.selectedVariant = o, Br(a, o);
    }), Br(a, this.selectedVariant), E$(a, (o) => {
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
          ${this.model.forms.map(R$).join("")}
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
          ${this.model.targets.forms.map(k$).join("")}
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
    const n = I$(t), r = w$(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function R$(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.details.map((o) => `<span>${v(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
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
      <span class="paranormal-toolkit-ritual-cast__form-details">${a}</span>
    </label>
  `;
}
function k$(e) {
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
function $$(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => Bi(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), Bi(e, a, t));
    });
  const r = Oc(e);
  r && t(r);
}
function Bi(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Jt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Oc(e), Br(e, r.value));
}
function Oc(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Jt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Br(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function E$(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function w$(e, t, n) {
  const r = S$(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = C$(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function C$(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function S$(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Jt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Jt(n) ? n : null;
}
function I$(e) {
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
async function L$(e) {
  return ct.request(e);
}
const Ga = {
  label: "Padrão"
}, v$ = {
  label: "Discente",
  extraCost: 2
}, D$ = {
  label: "Verdadeiro",
  extraCost: 5
};
class N$ {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new a$();
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
    const a = this.resolveCostPreview(t), o = CE(n), s = $E(
      n,
      t.item,
      a,
      o
    ), l = await L$({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((E) => E.name),
      cost: a,
      defaultSpendResource: NE(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = x$(l), u = IE(
      n,
      t.item,
      c.variant,
      o
    ), m = qR(), g = u.label ?? qa(c.variant), _ = U$(u), k = (E = t.targets) => ({
      castId: m,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: g,
      targets: E
    }), R = (E, S = t.targets, B = {}) => {
      this.ritualEvents.emitCastFinished(
        VR({
          ...k(S),
          status: E,
          ...B
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      GR(k())
    );
    const $ = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if ($.status === "cancelled")
      return R("cancelled", t.targets, { reason: $.reason }), { status: "cancelled" };
    if ($.status === "failed")
      return R("failed", t.targets, {
        reason: $.reason,
        message: $.message
      }), {
        status: "failed",
        reason: $.reason,
        message: $.message
      };
    const b = P$(
      t,
      $.targets
    );
    $.areaSnapshot && this.ritualEvents.emitAreaResolved(
      jR({
        ...k($.targets),
        area: $.areaSnapshot
      })
    );
    const I = Ps();
    let A = null;
    if (I) {
      const E = await M$(
        this.resources,
        b.actor,
        c,
        u,
        a
      );
      if (!E.ok)
        return R("failed", b.targets, {
          reason: E.reason,
          message: E.message
        }), {
          status: "failed",
          reason: E.reason,
          message: E.message
        };
      try {
        const S = await cT(
          b.actor
        );
        A = z$(
          S,
          u,
          a
        );
      } catch (S) {
        const B = S instanceof Error ? S.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return R("failed", b.targets, {
          reason: "ritual-casting-check-failed",
          message: B
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: B,
          cause: S
        };
      }
    }
    const F = O$(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !I
      }
    );
    if (F.steps.length === 0) {
      const E = SE(
        b,
        c
      ), S = zi(
        n,
        b
      ), B = Ui(
        b.actor,
        A,
        u,
        a
      ), H = qi(
        n,
        c,
        u,
        a,
        E,
        b,
        A
      );
      if (!S.ok)
        return R("failed", b.targets, {
          reason: S.reason,
          message: S.message
        }), {
          status: "failed",
          reason: S.reason,
          message: S.message
        };
      const kt = [
        ...B,
        ...S.actions
      ];
      return kt.length > 0 ? (R("ready", b.targets), {
        status: "ready",
        workflowContext: E,
        itemUseContext: b,
        actions: kt,
        summaryLines: H
      }) : (R("completed-without-actions", b.targets), {
        status: "completed-without-actions",
        workflowContext: E,
        itemUseContext: b,
        summaryLines: H
      });
    }
    const D = await this.workflow.runAutomation(F, {
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
    if (!D.ok)
      return R("failed", b.targets, {
        reason: D.error.reason,
        message: D.error.message
      }), {
        status: "failed",
        reason: D.error.reason,
        message: D.error.message,
        cause: D.error
      };
    const V = D.value.context, L = W$(
      n,
      b,
      V,
      _
    ), z = zi(
      n,
      b
    ), Rt = Ui(
      b.actor,
      A,
      u,
      a
    ), me = qi(
      n,
      c,
      u,
      a,
      V,
      b,
      A
    );
    if (!L.ok)
      return R("failed", b.targets, {
        reason: L.reason,
        message: L.message
      }), {
        status: "failed",
        reason: L.reason,
        message: L.message
      };
    if (!z.ok)
      return R("failed", b.targets, {
        reason: z.reason,
        message: z.message
      }), {
        status: "failed",
        reason: z.reason,
        message: z.message
      };
    const C = [
      ...Rt,
      ...L.actions,
      ...z.actions
    ];
    return C.length === 0 ? (R("completed-without-actions", b.targets), {
      status: "completed-without-actions",
      workflowContext: V,
      itemUseContext: b,
      summaryLines: me
    }) : (R("ready", b.targets), {
      status: "ready",
      workflowContext: V,
      itemUseContext: b,
      actions: C,
      summaryLines: me
    });
  }
  async applyAction(t) {
    return Xt(
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
function x$(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function P$(e, t) {
  return {
    ...e,
    targets: t
  };
}
function O$(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps) {
    if (l.type === "modifyResource" || l.type === "chatCard" || Va(l) && (!a.includeCostSteps || !s))
      continue;
    const c = F$(l, n);
    c && o.push(c);
  }
  return a.includeCostSteps && s && r && xE(n.extraCost) && o.push({
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
async function M$(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Ye(a, r);
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
function F$(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = B$(t, e.id);
  return n === null ? e : n.length === 0 ? null : {
    ...e,
    formula: n
  };
}
function B$(e, t) {
  const n = e.rollFormulaOverrides;
  if (!n || !Object.prototype.hasOwnProperty.call(n, t)) return null;
  const r = n[t];
  return typeof r == "string" ? r.trim() : "";
}
function U$(e) {
  return new Set(
    Object.entries(e.rollFormulaOverrides ?? {}).filter(([, t]) => typeof t != "string" || t.trim().length === 0).map(([t]) => t)
  );
}
function z$(e, t, n) {
  const a = q$(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function q$(e, t) {
  const n = Ye(e, t);
  return n ? FR(n.amount) : null;
}
function Ui(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Ye(r, n);
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
function zi(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = ja(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = ol(o);
      n.push(
        G$(
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
function G$(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? H$(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: j$(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: V$(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function j$(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function V$(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function H$(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function W$(e, t, n, r = /* @__PURE__ */ new Set()) {
  const a = [], o = /* @__PURE__ */ new Map();
  for (const s of e.steps) {
    if (s.type !== "modifyResource" || K$(s, r)) continue;
    const l = Yt(s, n);
    if (!l.ok)
      return {
        ok: !1,
        reason: l.error.reason,
        message: l.error.message
      };
    const c = ja(s.actor, t);
    if (c.length === 0) {
      if (s.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (Y$(s)) {
        X$(
          o,
          u,
          Q$(s, n, l.value)
        );
        continue;
      }
      a.push(J$(s, u, l.value));
    }
  }
  for (const s of o.values())
    a.push(
      ...Z$(
        e,
        t.item,
        s.actor,
        s.entries
      )
    );
  return { ok: !0, actions: a };
}
function K$(e, t) {
  const n = Mc(e.amountFrom);
  return n !== null && t.has(n);
}
function Y$(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function X$(e, t, n) {
  const r = rE(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Q$(e, t, n) {
  const r = Mc(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function Z$(e, t, n, r) {
  const a = sE(e), o = a.length > 1 ? uE() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, m) => {
        const g = lE(u.amount, s);
        return {
          id: eE(u, s, m),
          amount: g,
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
      label: tE(c, s, a.length > 1),
      executedLabel: nE(
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
function J$(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = iE(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: aE(e, r, n),
    executedLabel: oE(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function eE(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function tE(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function nE(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function rE(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Mc(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function aE(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function oE(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function iE(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function sE(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function lE(e, t) {
  const n = e * t.multiplier, r = cE(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function cE(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function uE() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ja(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function qi(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${qa(t.variant)}`,
    pE(t, n, r),
    ...fE(s),
    ...Object.values(a.rolls).flatMap(gE),
    ...dE(e, o),
    ...hE(e.resistance),
    ...RE(n)
  ];
}
function dE(e, t) {
  return mE(e) ? ja("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function mE(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function fE(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function pE(e, t, n) {
  const r = Ye(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function gE(e) {
  const n = [`${kE(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = bE(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${BR(e.damageType)}`), n;
}
function hE(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function bE(e) {
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
    const s = yE(o);
    s && (TE(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function yE(e) {
  const t = _E(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : AE(e);
}
function _E(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function AE(e) {
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
function TE(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function RE(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function kE(e) {
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
function $E(e, t, n, r) {
  return Pc.map((a) => {
    const o = Fc(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? qa(a),
      enabled: s,
      details: o ? EE(o, n) : [],
      finalCostText: o ? wE(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function EE(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {}).map((s) => s.trim()).filter((s) => s.length > 0);
  a.length > 0 ? r.push(a.join(", ")) : r.push("efeito manual");
  const o = Ye(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Ye(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function wE(e, t) {
  const n = Ye(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function CE(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Va);
}
function SE(e, t) {
  return kc({
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
function IE(e, t, n, r) {
  return Fc(e, t, n, r) ?? Ga;
}
function Fc(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? vE(t, n) ? LE(n) : null : n === "base" ? Ga : null);
}
function LE(e) {
  switch (e) {
    case "base":
      return Ga;
    case "discente":
      return v$;
    case "verdadeiro":
      return D$;
  }
}
function vE(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return DE(foundry.utils.getProperty(e, n));
}
function DE(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function NE(e) {
  return e.steps.some(Va);
}
function Va(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function xE(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Bc = "itemUsePrompts", Uc = "chatCard", kn = "data-paranormal-toolkit-prompt-id", $n = "data-paranormal-toolkit-pending-id", Ha = "data-paranormal-toolkit-executed-label", Ur = "data-paranormal-toolkit-choice-group", zc = "data-paranormal-toolkit-skipped-label", en = "data-paranormal-toolkit-action-section", Gi = "data-paranormal-toolkit-detail-key", ji = "data-paranormal-toolkit-roll-card", Wa = "data-paranormal-toolkit-roll-detail-toggle", qc = "data-paranormal-toolkit-roll-detail-id", Gc = "data-paranormal-toolkit-resistance-roll-button", jc = "data-paranormal-toolkit-resistance-skill", Vc = "data-paranormal-toolkit-resistance-skill-label", Hc = "data-paranormal-toolkit-resistance-target-actor-id", Wc = "data-paranormal-toolkit-resistance-target-name", Kc = "data-paranormal-toolkit-resistance-roll-result", Vi = "data-paranormal-toolkit-system-card-replaced", PE = `[${$n}]`, OE = `[${Wa}]`, ME = `[${Gc}]`, zr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, FE = `${h}__actions`, Hi = `${h}__details`, Yc = `${h}__summary`, BE = `${h}__title`, Xc = `${h}__button--executed`, Dt = `${h}__roll-card`, UE = "data-paranormal-toolkit-roll-card-target-mode", zE = "data-paranormal-toolkit-roll-card-target-names", qE = "data-paranormal-toolkit-roll-card-resistance", GE = "data-paranormal-toolkit-roll-card-resistance-skill", jE = "data-paranormal-toolkit-roll-card-resistance-skill-label";
let Wi = !1, qr = null;
const X = /* @__PURE__ */ new Map(), VE = [0, 100, 500, 1500, 3e3], HE = 3e4, WE = [0, 100, 500, 1500, 3e3];
function KE(e) {
  if (qr = e, Wi) {
    Yi(e);
    return;
  }
  const t = (n, r) => {
    Zc(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Wi = !0, Yi(e);
}
async function Ki(e) {
  const t = Qc(e);
  X.set(e.pendingId, t), await Xa(t) || uu(t), Jc(e.pendingId);
}
async function YE(e) {
  const t = Qc({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", X.set(e.pendingId, t), await Xa(t) || uu(t), Jc(e.pendingId);
}
async function Yn(e, t) {
  const n = X.get(e);
  X.delete(e), n && await Jw(n, t);
}
function Ka(e) {
  const t = hu();
  for (const n of t) {
    const r = re(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function XE(e, t) {
  const n = Ka(e);
  if (!n) return;
  const r = re(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Xe(n.message, r));
}
async function QE(e, t, n) {
  if (!t) return;
  const r = Ka(e);
  if (!r) return;
  const a = re(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Xe(r.message, a);
}
function Qc(e) {
  const t = de(e.context.message), n = e.context.targets.find((s) => Hr(s)), r = n ? Hr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Ew(e.context),
    executed: !1
  };
}
function Zc(e, t, n) {
  Zw();
  const r = wn(t);
  if (!r) return;
  const a = Yw(e, r);
  a.length > 0 && tn(r);
  for (const o of a)
    Gr(r, o);
  au(r, n), jr(r), Vr(r);
}
function Yi(e) {
  for (const t of WE)
    globalThis.setTimeout(() => {
      ZE(e);
    }, t);
}
function ZE(e) {
  for (const t of JE()) {
    const n = En(t);
    ew(n) && Zc(n, t, e);
  }
}
function JE() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function ew(e) {
  return e ? Qa(e) ? !0 : tC(e).length > 0 : !1;
}
function Jc(e) {
  const t = X.get(e);
  if (!t) return;
  const n = t.messageId ? Xw(t.messageId) : null;
  if (n) {
    es(n, t), tn(n), Gr(n, t), Xi(n), jr(n), Vr(n);
    return;
  }
  if (t.messageId) {
    Kr(t);
    return;
  }
  const r = Qw(t);
  if (r) {
    es(r, t), tn(r), Gr(r, t), Xi(r), jr(r), Vr(r);
    return;
  }
  Kr(t);
}
function Xi(e) {
  qr && au(e, qr);
}
function tn(e) {
  const t = tw();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = ru(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Vi) === "true") return;
  const r = n.querySelector(`.${zr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Vi, "true");
}
function tw() {
  try {
    return xs() === "replace";
  } catch {
    return !1;
  }
}
function Gr(e, t) {
  if (tn(e), e.querySelector(`[${kn}="${Qe(t.pendingId)}"]`)) return;
  const n = rw(e, t);
  ow(n, t);
  const r = Tw(t);
  if (nw(r)) return;
  Aw(n, r).append($w(t));
}
function nw(e) {
  return tu(e.id) && !ke();
}
function eu(e) {
  const n = e.closest(`[${en}]`)?.getAttribute(en) ?? null;
  return tu(n) && !ke();
}
function tu(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function rw(e, t) {
  const n = e.querySelector(`.${zr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(zr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(BE), s.textContent = aw(t);
  const l = document.createElement("span");
  return l.classList.add(Yc), l.textContent = t.summary, a.append(o, s, l), r.append(a), Cw(e).append(r), r;
}
function aw(e) {
  const t = M(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function ow(e, t) {
  const n = t.summaryLines ?? [], r = lu(n, t);
  if (r) {
    iw(e, r, t);
    return;
  }
  Rw(e, n);
}
function iw(e, t, n) {
  if (e.querySelector(`[${ji}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(
    Dt,
    `${Dt}--${t.intent}`,
    `${Dt}--target-${t.targetMode}`
  ), t.targetMode === "multi" && r.classList.add(`${Dt}--multi-target`), r.setAttribute(ji, "true"), r.setAttribute(UE, t.targetMode), r.setAttribute(zE, JSON.stringify(t.targetNames)), gw(r, t), t.castingCheck && Qi(r, lw(t.castingCheck), n.pendingId, "casting"), sw(t) && Qi(r, cw(t), n.pendingId, "effect"), pw(r, t), hw(r, t, n), _w(r, t), e.append(r);
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
function Qi(e, t, n, r) {
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
  return n.includes("kh") ? Zi(e, "highest") : n.includes("kl") ? Zi(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Zi(e, t) {
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
  ].filter(_C);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function gw(e, t) {
  t.resistance && (e.setAttribute(qE, t.resistance), t.resistanceSkill && e.setAttribute(GE, t.resistanceSkill), t.resistanceSkillLabel && e.setAttribute(jE, t.resistanceSkillLabel));
}
function hw(e, t, n) {
  if (!t.resistance || t.targetMode === "multi") return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = bw(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(nu(t.resistanceRollResult)), e.append(r);
}
function bw(e, t) {
  if (e.targetMode === "none" || !e.resistanceSkill || !we())
    return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(kn, t.pendingId), n.setAttribute(Gc, "true"), n.setAttribute(jc, e.resistanceSkill), n.setAttribute(Vc, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Hc, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Wc, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Kc, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function nu(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = iu(e), t;
}
function yw(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Wa, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(qc, s), c.hidden = !0;
  for (const u of o) {
    const m = document.createElement("dt");
    m.textContent = u.label;
    const g = document.createElement("dd");
    g.textContent = u.value, c.append(m, g);
  }
  e.append(l, c);
}
function _w(e, t) {
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
  const n = `[${en}="${Qe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(FE), a.setAttribute(en, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Tw(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = lu(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Rw(e, t) {
  if (t.length === 0) return;
  const n = kw(e);
  for (const r of t) {
    const a = AC(r);
    if (n.querySelector(`[${Gi}="${Qe(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Gi, a), n.append(o);
  }
}
function kw(e) {
  const t = e.querySelector(`.${Hi}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Hi), e.append(n), n;
}
function $w(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(kn, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Xc), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute($n, e.pendingId), t.setAttribute(Ha, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ur, e.choiceGroupId), t.setAttribute(zc, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Ew(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = ww(e);
  return `${t} → ${n}`;
}
function ww(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Cw(e) {
  return ru(e) ?? e;
}
function ru(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function au(e, t) {
  const n = wn(e);
  if (!n) return;
  const r = n.querySelectorAll(PE);
  for (const a of r) {
    if (eu(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      zw(a, t);
    }));
  }
}
function jr(e) {
  const t = wn(e);
  if (!t) return;
  const n = t.querySelectorAll(OE);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Sw(t, r);
    }));
}
function Vr(e) {
  const t = wn(e);
  if (!t) return;
  const n = t.querySelectorAll(ME);
  for (const r of n) {
    if (!we()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Iw(t, r);
    }));
  }
}
function Sw(e, t) {
  const n = t.getAttribute(Wa);
  if (!n) return;
  const r = e.querySelector(`[${qc}="${Qe(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Iw(e, t) {
  if (!we()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(kn), r = t.getAttribute(jc), a = t.getAttribute(Vc) ?? (r ? Re(r) : "Resistência");
  if (!n || !r) return;
  const o = Dw(e, n), s = Nw(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Tp(s, r);
    await Fw(c.roll);
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
    Lw(t, u), vw(t, u), Bw(n, u), await Uw(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Lw(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Kc, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function vw(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? nu(t);
  if (r) {
    r.textContent = iu(t);
    return;
  }
  n.append(a);
}
function Dw(e, t) {
  const n = X.get(t);
  if (n) return n;
  const r = En(e);
  return re(r)[t] ?? null;
}
function Nw(e, t) {
  const n = e?.resistanceTargetActor;
  if (ee(n)) return n;
  const a = e?.context?.targets.map(Hr).find(ee) ?? null;
  if (a) return a;
  const o = t.getAttribute(Hc) ?? e?.resistanceTargetActorId ?? null, s = o ? Pw(o) : null;
  return s || Ow(
    t.getAttribute(Wc) ?? e?.resistanceTargetName ?? xw(t)
  );
}
function xw(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Yc}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Hr(e) {
  const t = e.actor;
  if (ee(t)) return t;
  const n = e.token, r = pt(n);
  if (r) return r;
  const a = e.document;
  return pt(a);
}
function pt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const n = e.document?.actor;
  return ee(n) ? n : null;
}
function Pw(e) {
  const n = game.actors?.get?.(e);
  return ee(n) ? n : ou().map((o) => pt(o)).find((o) => o?.id === e) ?? null;
}
function Ow(e) {
  const t = Me(e);
  if (!t) return null;
  const n = ou().filter((o) => Me(Mw(o)) === t).map((o) => pt(o)).find(ee) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => ee(o) && Me(o.name) === t);
  return ee(a) ? a : null;
}
function ou() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Mw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : pt(e)?.name ?? null;
}
function Me(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function iu(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Fw(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Bw(e, t) {
  const n = X.get(e);
  n && (n.resistanceRollResult = t);
}
async function Uw(e, t, n) {
  const r = En(e);
  if (r)
    try {
      const a = re(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Xe(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function En(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return ne(r?.get?.(n));
}
async function zw(e, t) {
  if (eu(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute($n);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    su(e, e.getAttribute(Ha) ?? "✓ Automação aplicada"), qw(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function su(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Xc), e.removeAttribute($n), e.removeAttribute(Ha);
}
function qw(e) {
  const t = e.getAttribute(Ur);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Ur}="${Qe(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(zc) ?? "✓ Outra opção escolhida";
    su(a, o);
  }
}
function lu(e, t) {
  const n = e.map(Ya).filter(bC), r = n.find(($) => $.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = M(e, "Forma"), o = M(e, "Custo"), s = M(e, "Dados") ?? M(e, `Dados (${r.label})`), l = M(e, "Tipo"), c = M(e, "Resistência"), u = M(e, "Resistência Perícia"), m = M(e, "Resistência Rótulo") ?? (u ? Re(u) : null), g = cu(e, "Observação"), _ = e.filter(($) => Kw($, r)), k = Hw(e), R = Gw(t);
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
    targetMode: R.mode,
    targetNames: R.names,
    notes: g,
    details: _,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Gw(e) {
  const t = jw(e);
  return t.length <= 0 ? { mode: "none", names: t } : t.length === 1 ? { mode: "single", names: t } : { mode: "multi", names: t };
}
function jw(e) {
  const [, t] = e.summary.split("→");
  return t ? t.split(",").map((n) => n.trim()).filter((n) => n.length > 0 && Vw(n) !== "nenhum alvo") : [];
}
function Vw(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase();
}
function Hw(e) {
  const t = e.map(Ya).find((o) => o?.intent === "casting") ?? null, n = M(e, "Conjuração DT"), r = M(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: M(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: M(e, "Dados (Conjuração)")
  } : null;
}
function Ya(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: Ww(n)
  } : null;
}
function Ww(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function M(e, t) {
  return cu(e, t)[0] ?? null;
}
function cu(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function Kw(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Ya(e) ? !1 : e.trim().length > 0;
}
function Yw(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of X.values())
    Wr(r, e, t) && n.set(r.pendingId, r);
  for (const r of eC(e))
    Wr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Wr(e, t, n) {
  const r = de(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Ji(n, "itemId", e.itemId) ? !1 : !e.actorId || Ji(n, "actorId", e.actorId);
}
function Ji(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${TC(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function Xw(e) {
  const t = Qe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Qw(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Wr(e, null, t))
      return t;
  return null;
}
function Zw() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of X.entries())
    e - r.createdAt > t && X.delete(n);
}
async function es(e, t) {
  const n = En(e);
  if (!n) return !1;
  try {
    const r = re(n);
    return r[t.pendingId] = Za(t, de(n)), await Xe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Xa(e) {
  const t = fu(e);
  if (!t) return !1;
  try {
    const n = re(t);
    return n[e.pendingId] = Za(e, de(t)), await Xe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function uu(e) {
  for (const t of VE)
    globalThis.setTimeout(() => {
      Kr(e);
    }, t);
}
async function Kr(e) {
  const t = fu(e);
  if (Qa(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await Xa(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Jw(e, t) {
  const n = mu(e.context.message);
  if (n)
    try {
      const r = re(n), a = r[e.pendingId] ?? Za(e, de(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Xe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function eC(e) {
  return Object.values(re(ne(e))).filter(At);
}
function re(e) {
  if (!e) return {};
  const t = {}, n = Qa(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(du(e)))
    t[r] ??= a;
  return t;
}
function tC(e) {
  return Object.values(du(ne(e))).filter(At);
}
function du(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Bc);
  if (!je(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    At(a) && (n[r] = a);
  return n;
}
async function Xe(e, t) {
  typeof e.setFlag == "function" && (await rC(e, t), await nC(e, t));
}
async function nC(e, t) {
  await Promise.resolve(e.setFlag?.(d, Bc, t));
}
function Qa(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Uc);
  return gC(t) ? t : null;
}
async function rC(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(At).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? de(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: aC(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Uc, a));
}
function aC(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Za(e, t) {
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
function mu(e) {
  const t = ne(e);
  if (t?.setFlag)
    return t;
  const n = oC(e);
  if (n?.setFlag)
    return n;
  const r = de(e);
  if (!r) return null;
  const a = game.messages;
  return ne(a?.get?.(r));
}
function oC(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(ne).find((n) => typeof n?.setFlag == "function") ?? null;
}
function fu(e) {
  const t = mu(e.context.message);
  if (t) return t;
  const n = e.messageId ? iC(e.messageId) : null;
  if (n) return n;
  const r = hu().slice().reverse();
  return r.find((a) => sC(a, e)) ?? r.find((a) => lC(a, e)) ?? null;
}
function iC(e) {
  const t = game.messages;
  return ne(t?.get?.(e));
}
function sC(e, t) {
  const n = de(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!pu(e, t)) return !1;
  const a = gu(e);
  return !t.actorId || !a || a === t.actorId;
}
function lC(e, t) {
  if (!uC(e, t)) return !1;
  const n = gu(e);
  return t.actorId && n === t.actorId ? !0 : pu(e, t);
}
function pu(e, t) {
  const n = Me(cC(e));
  if (!n) return !1;
  const r = Me(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Me(t.itemId);
  return !!(a && n.includes(a));
}
function cC(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function gu(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function uC(e, t) {
  const n = dC(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= HE;
}
function dC(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function ne(e) {
  return e && typeof e == "object" ? e : null;
}
function At(e) {
  return je(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && q(e.messageId) && q(e.itemId) && q(e.actorId) && q(e.itemName) && be(e.resistanceTargetActorId) && be(e.resistanceTargetName) && hC(e.resistanceRollResult) && mC(e.actionPayload) && Xn(e.title) && Xn(e.buttonLabel) && Xn(e.executedLabel) && be(e.choiceGroupId) && be(e.skippedLabel) && be(e.actionSectionId) && be(e.actionSectionTitle) && yC(e.summaryLines) : !1;
}
function mC(e) {
  return e == null ? !0 : je(e) ? e.kind === "resource-operation" && q(e.actorId) && q(e.actorUuid) && typeof e.actorName == "string" && fC(e.resource) && pC(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function fC(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function pC(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function gC(e) {
  return je(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && q(e.messageId) && je(e.source) && q(e.source.actorId) && q(e.source.actorName) && q(e.source.itemId) && q(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(At) : !1;
}
function hC(e) {
  return e == null ? !0 : je(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && be(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function bC(e) {
  return e !== null;
}
function je(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function q(e) {
  return e === null || typeof e == "string";
}
function Xn(e) {
  return e === void 0 || typeof e == "string";
}
function be(e) {
  return e == null || typeof e == "string";
}
function yC(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function _C(e) {
  return typeof e == "string" && e.length > 0;
}
function hu() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(ne).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(ne).filter((r) => r !== null) : [];
}
function wn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function de(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function AC(e) {
  return e.trim().toLowerCase();
}
function TC(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Qe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ts = 1e3;
class RC {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new N$(
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
      settings: ir(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = ir();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Zr(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && IC(t.item) && n.executionMode === "ask") {
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
    if (await $i(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Jn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = $C(
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
      return this.pendingExecutions.delete(t), await Yn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Yn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Ka(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = DC(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Xt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await XE(t), await QE(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (KE(
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
    if (await $i(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Jn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      LC(t.item),
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
          De(a.workflowContext)
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
      if (!ke())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (SC(n, a.value), await Cl(a.value), {
        ok: !0,
        executedLabel: kC(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!ke())
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
    const n = Qn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && Qn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await Yn(
        a,
        ns(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = er();
    await YE({
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
      const l = er();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Ki({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Qn(s),
        skippedLabel: ns(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: vC(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      De(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = er();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ki({
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
      De(a.value.context)
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
    const n = Date.now(), r = rs(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > ts && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= ts;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(rs(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = Jn(
      t,
      n,
      r,
      a
    );
  }
}
function kC(e) {
  return Sl({ inputAmount: e.totalRawDamage });
}
function $C(e, t) {
  if (t.resistance || !EC(t))
    return t;
  const n = Ic(e);
  return n ? { ...t, resistance: n } : t;
}
function EC(e) {
  return wC(e) && !CC(e);
}
function wC(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function CC(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function Qn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function ns(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function SC(e, t) {
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
function IC(e) {
  return e.type === "ritual";
}
function LC(e) {
  return ER(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function vC(e) {
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
function DC(e) {
  const t = e.actorUuid ? NC(e.actorUuid) : null;
  if (Ve(t)) return t;
  const n = e.actorId ? xC(e.actorId) : null;
  return n || PC(e.actorName);
}
function NC(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function xC(e) {
  const n = game.actors?.get?.(e);
  if (Ve(n)) return n;
  for (const r of bu()) {
    const a = Ja(r);
    if (a?.id === e) return a;
  }
  return null;
}
function PC(e) {
  const t = Zn(e);
  if (!t) return null;
  for (const a of bu()) {
    const o = OC(a);
    if (Zn(o) === t) {
      const s = Ja(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Ve(a) && Zn(a.name) === t
  );
  return Ve(r) ? r : null;
}
function bu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function OC(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ja(e)?.name ?? null;
}
function Ja(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ve(t)) return t;
  const n = e.document?.actor;
  return Ve(n) ? n : null;
}
function Zn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ve(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Jn(e, t, n, r) {
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
function rs(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function er() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class MC {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = bt(t);
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
class FC {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = bt(t).map((l) => this.analyzeRitual(l)), r = n.filter(Nt("upToDate")), a = n.filter(Nt("available")), o = n.filter(Nt("outdated")), s = n.filter(Nt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = BC(t);
    return n ? r ? r.source.type !== "preset" ? et({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? et({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : et({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: UC(r, n.preset)
    }) : et({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : et({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function et(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? an(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function BC(e) {
  const t = e.getFlag(d, "automation");
  return Jr(t) ? t : null;
}
function UC(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Nt(e) {
  return (t) => t.status === e;
}
class zC {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = ta(t.transaction);
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
    const n = xt(t.actorName), r = xt(t.resource), a = xt(qC(t)), o = xt(GC(t));
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
function qC(e) {
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
function GC(e) {
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
function xt(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function jC() {
  const e = new JA(), t = new KT(e), n = new rl(new nl()), r = new al(new ga()), a = new YT(new yc()), o = new nT(), s = new bT(o), l = new RT(e), c = new $T(), u = c.registerMany(
    gd()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const m = new kT(), g = new AT(), _ = ml(), k = new sl(_), R = new FC(
    c
  ), $ = new MC(
    R,
    m,
    g
  ), b = new JT(), I = new zC(b), A = new ZT(), F = new WT(), D = new VT(
    t,
    s,
    I,
    A
  ), V = new QT(D, A), L = new RC(
    V,
    t,
    s,
    n,
    k,
    b,
    F
  );
  return L.addStrategy(
    new Bs(
      (z) => L.handleItemUsed(z)
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
    itemPatches: g,
    conditionRegistry: _,
    conditions: k,
    debugOutput: b,
    chatMessages: I,
    workflowHooks: A,
    ritualEvents: F,
    automation: D,
    workflow: V,
    itemUseIntegration: L,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: VC } = foundry.applications.api;
class nn extends VC {
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
      apply: nn.onApply,
      cancel: nn.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${Z(hs)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${Z(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${tr("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${tr("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${tr("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function tr(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${Z(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? HC(n) : KC(t)}
    </section>
  `;
}
function HC(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(WC).join("")}</ol>`;
}
function WC(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${Z(e.appliedPresetId)} v${Z(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${Z(e.itemName)}</strong>
        <span>${Z(e.reason)}</span>
        ${r}
      </div>
      <em>${Z(n)}</em>
    </li>
  `;
}
function KC(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${Z({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function Z(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const rn = `${d}.manageRitualPresets`, as = `__${d}_ritualPresetHeaderControlRegistered`, YC = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function XC(e) {
  const t = globalThis;
  if (!t[as]) {
    for (const n of YC)
      Hooks.on(n, (r, a) => {
        QC(r, a, e);
      });
    t[as] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function QC(e, t, n) {
  Array.isArray(t) && JC(e) && (ZC(e, n), !t.some((r) => r.action === rn) && t.push({
    action: rn,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), yu(e, n);
    }
  }));
}
function ZC(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[rn] && (e.options.actions[rn] = (n) => {
    n.preventDefault(), n.stopPropagation(), yu(e, t);
  }));
}
function JC(e) {
  if (!game.user?.isGM) return !1;
  const t = _u(e);
  return t ? t.type === "agent" && bt(t).length > 0 : !1;
}
function yu(e, t) {
  const n = _u(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new nn(n, t).render({ force: !0 });
}
function _u(e) {
  return os(e.actor) ? e.actor : os(e.document) ? e.document : null;
}
function os(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Yr = "data-paranormal-toolkit-stylesheet";
function eS(e) {
  const t = oS(e), n = tS(t), r = rS(n), a = nS(n, t);
  if (a)
    return a.href = r, a.setAttribute(Yr, t), a;
  const o = document.createElement("link");
  return o.rel = "stylesheet", o.href = r, o.setAttribute(Yr, t), document.head.append(o), o;
}
function tS(e) {
  const t = `modules/${d}/${e}`, n = foundry.utils, r = n.getRoute;
  return typeof r == "function" ? r.call(n, t) : t;
}
function nS(e, t) {
  const n = is(e);
  for (const r of Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]')
  ))
    if (r.getAttribute(Yr) === t || is(r.href) === n)
      return r;
  return null;
}
function rS(e) {
  const t = aS();
  if (!t) return e;
  const n = e.includes("?") ? "&" : "?";
  return `${e}${n}v=${encodeURIComponent(t)}`;
}
function aS() {
  const e = game.modules.get(d), t = e?.version ?? e?.manifest?.version;
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : null;
}
function is(e) {
  try {
    return new URL(e, document.baseURI).pathname;
  } catch {
    return e;
  }
}
function oS(e) {
  return e.trim().replace(/^\/+|\/+$/gu, "");
}
function _e(e, t) {
  const n = document.createElement("label");
  n.classList.add(`${d}-ability-roll-config__field`);
  const r = document.createElement("span");
  return r.textContent = e, n.append(r, t), n;
}
function Xr(e, t, n) {
  const r = document.createElement("input");
  return r.type = "text", r.value = e, r.placeholder = t, r.disabled = !n, r;
}
function zt(e, t, n) {
  const r = document.createElement("button");
  r.type = "button", n && r.classList.add(n);
  const a = document.createElement("i");
  a.className = t;
  const o = document.createElement("span");
  return o.textContent = e, r.append(a, o), r;
}
function Au(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.classList.add(`${d}-ability-roll-config__icon-button`), n.title = e, n.setAttribute("aria-label", e);
  const r = document.createElement("i");
  return r.className = t, n.append(r), n;
}
function tt(e, t, n = !1) {
  const r = document.createElement("option");
  return r.value = e, r.textContent = t, r.selected = n, r;
}
function iS(e) {
  const { roll: t, index: n, editable: r, onChange: a, onRemove: o } = e, s = document.createElement("article");
  s.classList.add(`${d}-ability-roll-config__card`), s.dataset.abilityRollId = t.id;
  const l = document.createElement("header");
  l.classList.add(`${d}-ability-roll-config__card-header`);
  const c = document.createElement("div");
  c.classList.add(`${d}-ability-roll-config__card-title`);
  const u = document.createElement("strong");
  u.textContent = `Rolagem ${n + 1}`;
  const m = document.createElement("span");
  c.append(u, m);
  const g = Au("Remover rolagem", "fa-solid fa-trash");
  g.disabled = !r, g.addEventListener("click", o), l.append(c, g);
  const _ = document.createElement("div");
  _.classList.add(`${d}-ability-roll-config__fields`);
  const k = Xr(
    t.label,
    "Ex.: Dano adicional",
    r
  );
  k.addEventListener("input", () => {
    t.label = k.value, a();
  }), _.append(_e("Nome da rolagem", k));
  const R = document.createElement("select");
  R.disabled = !r;
  for (const C of [
    "generic",
    "damage",
    "healing"
  ])
    R.append(
      tt(
        C,
        Em(C),
        t.intent === C
      )
    );
  R.addEventListener("change", () => {
    t.intent = uS(R.value), Rt(), a();
  }), _.append(_e("Tipo da rolagem", R));
  const $ = document.createElement("div");
  $.classList.add(
    `${d}-ability-roll-config__damage-field`
  ), _.append($);
  const b = document.createElement("section");
  b.classList.add(
    `${d}-ability-roll-config__formula-section`
  );
  const I = document.createElement("div");
  I.classList.add(
    `${d}-ability-roll-config__formula-header`
  );
  const A = document.createElement("strong");
  A.textContent = "Fórmula";
  const F = document.createElement("label");
  F.classList.add(`${d}-ability-roll-config__scaling-toggle`);
  const D = document.createElement("input");
  D.type = "checkbox", D.checked = t.formula.mode === "nex", D.disabled = !r;
  const V = document.createElement("span");
  V.textContent = "Varia conforme o NEX", F.append(D, V), I.append(A, F);
  const L = document.createElement("div");
  return L.classList.add(`${d}-ability-roll-config__formula`), b.append(I, L), D.addEventListener("change", () => {
    t.formula = D.checked ? {
      mode: "nex",
      resolution: "highest-unlocked",
      steps: lS(
        t.formula.mode === "fixed" ? t.formula.formula : ""
      )
    } : {
      mode: "fixed",
      formula: t.formula.mode === "nex" ? t.formula.steps.find((C) => C.formula.trim())?.formula ?? "" : t.formula.formula
    }, z(), me(), a();
  }), s.append(l, _, b), z(), Rt(), me(), s;
  function z() {
    m.textContent = t.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }
  function Rt() {
    $.replaceChildren();
    const C = t.intent === "damage";
    if (_.classList.toggle(
      `${d}-ability-roll-config__fields--without-damage`,
      !C
    ), $.hidden = !C, !C) return;
    const E = document.createElement("select");
    E.disabled = !r, E.append(tt("", "—", !t.damageType));
    for (const { value: S, label: B } of zs)
      E.append(tt(S, B, t.damageType === S));
    E.addEventListener("change", () => {
      t.damageType = E.value || null, a();
    }), $.append(_e("Tipo de dano", E));
  }
  function me() {
    if (L.replaceChildren(), t.formula.mode === "fixed") {
      const H = Xr(
        t.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        r
      );
      H.addEventListener("input", () => {
        t.formula.mode === "fixed" && (t.formula.formula = H.value, a());
      }), L.append(_e("Expressão", H));
      return;
    }
    const C = t.formula, E = document.createElement("select");
    E.disabled = !r, E.append(
      tt(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        C.resolution === "highest-unlocked"
      ),
      tt(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        C.resolution === "choose-unlocked"
      )
    ), E.addEventListener("change", () => {
      C.resolution = dS(E.value), a();
    }), L.append(_e("Comportamento", E));
    const S = document.createElement("div");
    S.classList.add(`${d}-ability-roll-config__steps`), C.steps.forEach((H, kt) => {
      S.append(
        sS({
          step: H,
          editable: r,
          onChange: a,
          onRemove: () => {
            C.steps.splice(kt, 1), me(), a();
          }
        })
      );
    }), L.append(S);
    const B = zt(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${d}-ability-roll-config__add-step`
    );
    B.disabled = !r || C.steps.length >= dr, B.addEventListener("click", () => {
      C.steps.length >= dr || (C.steps.push({
        minNex: cS(
          C.steps.map((H) => H.minNex)
        ),
        formula: ""
      }), me(), a());
    }), L.append(B);
  }
}
function sS(e) {
  const { step: t, editable: n, onChange: r, onRemove: a } = e, o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__step`);
  const s = document.createElement("input");
  s.type = "number", s.min = "0", s.max = "99", s.step = "1", s.value = String(t.minNex), s.disabled = !n, s.setAttribute("aria-label", "NEX mínimo"), s.addEventListener("change", () => {
    t.minNex = mS(Number(s.value)), s.value = String(t.minNex), r();
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__nex-control`);
  const c = document.createElement("span");
  c.textContent = "%", l.append(s, c);
  const u = Xr(t.formula, "Ex.: 2d6", n);
  u.setAttribute("aria-label", "Fórmula da etapa"), u.addEventListener("input", () => {
    t.formula = u.value, r();
  });
  const m = Au("Remover etapa", "fa-solid fa-xmark");
  return m.disabled = !n, m.addEventListener("click", a), o.append(
    _e("NEX mínimo", l),
    _e("Fórmula", u),
    m
  ), o;
}
function lS(e) {
  const t = bm(), n = t[0];
  return e.trim() && n && (n.formula = e), t;
}
function cS(e) {
  for (const t of [10, 40, 65, 99])
    if (!e.includes(t)) return t;
  for (let t = 0; t <= 99; t += 1)
    if (!e.includes(t)) return t;
  return 99;
}
function uS(e) {
  return e === "damage" || e === "healing" ? e : "generic";
}
function dS(e) {
  return e === "choose-unlocked" ? "choose-unlocked" : "highest-unlocked";
}
function mS(e) {
  return Number.isFinite(e) ? Math.min(99, Math.max(0, Math.trunc(e))) : 0;
}
function fS(e) {
  let t = nr(e.config);
  const n = document.createElement("section");
  n.classList.add(`${d}-ability-roll-config`), n.dataset.paranormalToolkitAbilityRollConfig = e.itemKey;
  const r = pS(t), a = document.createElement("p");
  a.classList.add(`${d}-ability-roll-config__hint`), a.textContent = "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";
  const o = document.createElement("div");
  o.classList.add(`${d}-ability-roll-config__list`);
  const s = zt(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${d}-ability-roll-config__add-roll`
  );
  s.addEventListener("click", () => {
    t.rolls.length >= ur || (t.rolls.push(Gs(t.rolls.length + 1)), _(), I("Rolagem adicionada. Salve para confirmar."));
  });
  const l = document.createElement("div");
  l.classList.add(`${d}-ability-roll-config__actions`);
  const c = zt("Salvar fórmulas", "fa-solid fa-floppy-disk"), u = zt("Limpar", "fa-solid fa-eraser");
  l.append(c, u);
  const m = document.createElement("footer");
  m.classList.add(`${d}-ability-roll-config__footer`), m.append(s, l);
  const g = document.createElement("p");
  return g.classList.add(`${d}-ability-roll-config__status`), g.textContent = e.editable ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", n.append(r, a, o, m, g), c.addEventListener("click", () => {
    e.editable && k();
  }), u.addEventListener("click", () => {
    e.editable && R();
  }), _(), n;
  function _() {
    if (o.replaceChildren(), t.rolls.length === 0) {
      const A = document.createElement("p");
      A.classList.add(`${d}-ability-roll-config__empty`), A.textContent = "Nenhuma rolagem configurada.", o.append(A);
    } else
      t.rolls.forEach((A, F) => {
        o.append(
          iS({
            roll: A,
            index: F,
            editable: e.editable,
            onChange: () => {
              Qr(r, t), I("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              t.rolls.splice(F, 1), _(), I("Rolagem removida. Salve para confirmar.");
            }
          })
        );
      });
    Qr(r, t), b(!1);
  }
  async function k() {
    $(!0), I("Salvando configuração...");
    try {
      const A = sa(t);
      if (!A) throw new Error("Configuração inválida.");
      t = nr(await e.onSave(A)), _(), I("Configuração salva.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        A
      ), I("Não foi possível salvar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade."
      );
    } finally {
      $(!1);
    }
  }
  async function R() {
    $(!0), I("Limpando configuração...");
    try {
      t = nr(await e.onClear()), _(), I("Configuração removida.");
    } catch (A) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        A
      ), I("Não foi possível limpar a configuração."), ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade."
      );
    } finally {
      $(!1);
    }
  }
  function $(A) {
    n.classList.toggle(`${d}-ability-roll-config--busy`, A), b(A);
  }
  function b(A) {
    c.disabled = A || !e.editable, u.disabled = A || !e.editable, s.disabled = A || !e.editable || t.rolls.length >= ur;
  }
  function I(A) {
    g.textContent = A;
  }
}
function pS(e) {
  const t = document.createElement("header");
  t.classList.add(`${d}-ability-roll-config__header`);
  const n = document.createElement("div");
  n.classList.add(`${d}-ability-roll-config__title`);
  const r = document.createElement("strong");
  r.textContent = "Paranormal Toolkit";
  const a = document.createElement("span");
  a.textContent = "Fórmulas de rolagem", n.append(r, a);
  const o = document.createElement("span");
  return o.classList.add(`${d}-ability-roll-config__badge`), t.append(n, o), Qr(t, e), t;
}
function Qr(e, t) {
  const n = e.querySelector(
    `.${d}-ability-roll-config__badge`
  );
  n && (n.textContent = wm(t) ? "Configurada" : "Rascunho");
}
function nr(e) {
  return JSON.parse(JSON.stringify(e));
}
const gS = "[data-paranormal-toolkit-ability-roll-config]", ss = `__${d}_abilityRollConfigBlockRegistered`, hS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
];
function bS() {
  const e = globalThis;
  if (!e[ss]) {
    eS("styles/ability-roll-config.css");
    for (const t of hS)
      Hooks.on(t, (...n) => {
        yS(n[0], n[1]);
      });
    e[ss] = !0, f.info(
      "Bloco de configuração de rolagens de habilidade registrado na ficha de item."
    );
  }
}
function yS(e, t) {
  const n = AS(e);
  if (!n || n.type !== "ability") return;
  const r = RS(t);
  if (!r) return;
  const a = r.querySelector(
    'section[data-tab="abilityAttr"]'
  );
  if (!a) return;
  for (const s of Array.from(
    a.querySelectorAll(gS)
  ))
    s.remove();
  const o = fS({
    itemKey: n.uuid ?? n.id ?? "ability",
    config: _m(n),
    editable: TS(n),
    onSave: async (s) => {
      const l = await Am(n, s);
      return ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas."
      ), l;
    },
    onClear: async () => (await Tm(n), ui.notifications?.info(
      "Paranormal Toolkit: rolagens da habilidade removidas."
    ), qs())
  });
  _S(a, o);
}
function _S(e, t) {
  const n = e.querySelector(
    ".class-attributes-section"
  );
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item") ?? e).append(t);
}
function AS(e) {
  return ls(e.item) ? e.item : ls(e.document) ? e.document : null;
}
function TS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function RS(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ls(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
const Tu = "data-paranormal-toolkit-ritual-roll-config", Tt = "data-paranormal-toolkit-ritual-roll-field", $e = "data-paranormal-toolkit-ritual-roll-action", cs = `__${d}_ritualRollConfigBlockRegistered`, kS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], $S = [
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
function ES() {
  const e = globalThis;
  if (!e[cs]) {
    wS();
    for (const t of kS)
      Hooks.on(t, (...n) => {
        CS(n[0], n[1]);
      });
    e[cs] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function wS() {
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
function CS(e, t) {
  const n = zS(e);
  if (!n || n.type !== "ritual") return;
  const r = jS(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  IS(a);
  const o = ku(n), s = Sc(n), l = qS(n), c = LS(n, s, o, l);
  OS(c, n, o, l), SS(a, c), eo(c);
}
function SS(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function IS(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Tu}]`)))
    t.remove();
}
function LS(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(Tu, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(us("strong", "Paranormal Toolkit")), s.append(us("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = Eu(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(vS(t, r)), u.append(DS(t, r)), u.append(NS(t, r)), a.append(u), a.append(xS(t, n, r)), a.append(PS(r));
  const m = document.createElement("p");
  return m.classList.add(`${d}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function vS(e, t) {
  const n = Cn("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Tt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = $R(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function DS(e, t) {
  const n = Cn("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Tt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of $S) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function NS(e, t) {
  const n = Cn("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Tt, "utilityLabel"), n.append(r), n;
}
function xS(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(rr("base", "Padrão", e.forms.base.formula, !0, n)), o.append(rr("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(rr("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function rr(e, t, n, r, a) {
  const o = Cn(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(Tt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function PS(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute($e, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute($e, "clear"), t.append(n, r), t;
}
function Cn(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function us(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function OS(e, t, n, r) {
  Ze(e, "intent")?.addEventListener("change", () => eo(e)), fs(e, "system.studentForm")?.addEventListener("change", () => ds(e, t)), fs(e, "system.trueForm")?.addEventListener("change", () => ds(e, t)), e.querySelector(`[${$e}="save"]`)?.addEventListener("click", () => {
    r && MS(e, t, n);
  }), e.querySelector(`[${$e}="clear"]`)?.addEventListener("click", () => {
    r && FS(e, t);
  });
}
async function MS(e, t, n) {
  const r = e.querySelector(`[${$e}="save"]`);
  r?.setAttribute("disabled", "true"), Fe(e, "Salvando configuração...");
  try {
    const a = BS(e, n);
    await RR(t, a), Ru(e, a), Fe(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Fe(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function FS(e, t) {
  const n = e.querySelector(`[${$e}="clear"]`);
  n?.setAttribute("disabled", "true"), Fe(e, "Limpando configuração...");
  try {
    await kR(t);
    const r = Sc(t);
    US(e, r), Ru(e, r), Fe(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Fe(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Ru(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = Eu(t) ? "Configurada" : "Rascunho");
}
function BS(e, t) {
  return {
    schemaVersion: 1,
    intent: $u(Ze(e, "intent")?.value),
    damageType: ps(e, "damageType"),
    utilityLabel: ps(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: qt(e, "formula.base") },
      discente: { formula: qt(e, "formula.discente") },
      verdadeiro: { formula: qt(e, "formula.verdadeiro") }
    }
  };
}
function US(e, t) {
  ve(e, "intent", t.intent), ve(e, "damageType", t.damageType ?? ""), ve(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ve(e, "formula.base", t.forms.base.formula), ve(e, "formula.discente", t.forms.discente.formula), ve(e, "formula.verdadeiro", t.forms.verdadeiro.formula), eo(e);
}
function eo(e) {
  const t = $u(Ze(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function ds(e, t) {
  const n = ku(t);
  ms(e, "discente", n.discente), ms(e, "verdadeiro", n.verdadeiro);
}
function ms(e, t, n) {
  const r = Ze(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${$e}="save"]`)?.disabled;
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
function Fe(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function ku(e) {
  const t = GS(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function zS(e) {
  return gs(e.item) ? e.item : gs(e.document) ? e.document : null;
}
function qS(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function GS(e) {
  const t = e.system;
  return VS(t) ? t : {};
}
function fs(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ze(e, t) {
  return e.querySelector(`[${Tt}="${HS(t)}"]`);
}
function qt(e, t) {
  return Ze(e, t)?.value.trim() ?? "";
}
function ps(e, t) {
  const n = qt(e, t);
  return n.length > 0 ? n : null;
}
function ve(e, t, n) {
  const r = Ze(e, t);
  r && (r.value = n);
}
function $u(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Eu(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function jS(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function gs(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function VS(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function HS(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Q = null;
Hooks.once("init", () => {
  dd(), Gd(), Mf(), UA(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!uo.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${uo.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = jC(), Q.itemUseIntegration.registerStrategies(), Cf(Q.resources, Q.resourceAdapter), Nf(Q.conditions), am(Q), HA(), XC(Q), ES(), bS(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  );
});
function WS() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  WS as getToolkitServices
};
//# sourceMappingURL=main.js.map
